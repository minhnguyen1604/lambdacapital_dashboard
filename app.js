// LC Dashboard Application Logic - SQLite Backend Driven (English Edition)

// Configuration & Initial State
const ACCOUNTS_CONFIG = {
  'ftmo-10k': { name: 'FTMO 10k', capital: 10000, type: 'FTMO' },
  'ftmo-100k-1': { name: 'FTMO 100k #1', capital: 100000, type: 'FTMO' },
  'ftmo-100k-2': { name: 'FTMO 100k #2', capital: 100000, type: 'FTMO' },
  'ftmo-100k-3': { name: 'FTMO 100k #3', capital: 100000, type: 'FTMO' },
  'ftmo-100k-4': { name: 'FTMO 100k #4', capital: 100000, type: 'FTMO' },
  'the5ers-5k': { name: 'The5ers 5k', capital: 5000, type: 'The5ers' },
  'personal-1': { name: 'Personal Acc #1', capital: 5000, type: 'Personal' },
  'personal-2': { name: 'Personal Acc #2', capital: 10000, type: 'Personal' }
};

// System current date (hardcoded to June 9, 2026 to match the user's screenshot context)
const SYSTEM_DATE = new Date('2026-06-09');

let currentAccountId = 'ftmo-10k';
let activeView = 'forex-account'; // 'forex-account', 'stock', 'summary'
let activeCalendarDate = new Date('2026-06-01'); // Year/Month view state
let chartInstance = null;

// --- App Initializer ---
document.addEventListener('DOMContentLoaded', () => {
  // Setup default active states in sidebar
  document.getElementById('forex-sub').style.maxHeight = '600px';
  document.getElementById('tkq-nested').style.maxHeight = '400px';
  document.getElementById('tkcn-nested').style.maxHeight = '0px'; // Collapse personal list initially
  
  // Restore sidebar state
  const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (sidebarCollapsed) {
    document.querySelector('.app-container').classList.add('sidebar-collapsed');
  }
  
  // Render dashboard
  renderApp();
});

// --- Toggle Sidebar ---
function toggleSidebar() {
  const appContainer = document.querySelector('.app-container');
  appContainer.classList.toggle('sidebar-collapsed');
  const isCollapsed = appContainer.classList.contains('sidebar-collapsed');
  localStorage.setItem('sidebar-collapsed', isCollapsed ? 'true' : 'false');
  
  // Resize Chart.js to fit the expanded/contracted viewport width
  if (chartInstance) {
    setTimeout(() => {
      chartInstance.resize();
    }, 510);
  }
}

// --- Toggle Sidebar Accordion ---
function toggleNavGroup(id) {
  const element = document.getElementById(id);
  const trigger = element.previousElementSibling;
  
  if (element.style.maxHeight && element.style.maxHeight !== '0px') {
    element.style.maxHeight = '0px';
    if (trigger) trigger.classList.add('collapsed');
  } else {
    element.style.maxHeight = '400px';
    if (trigger) trigger.classList.remove('collapsed');
  }
}

// --- Navigation actions ---
function switchAccount(accountId, breadcrumbText) {
  currentAccountId = accountId;
  activeView = 'forex-account';
  
  // Update sidebar active classes
  document.querySelectorAll('.nav-nested-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  document.getElementById('nav-forex').classList.add('active');
  const activeSubItem = document.getElementById(`acc-${accountId}`);
  if (activeSubItem) {
    activeSubItem.classList.add('active');
  }
  
  // Update panels visibility
  document.getElementById('view-forex-account').style.display = 'flex';
  document.getElementById('view-stock').style.display = 'none';
  document.getElementById('view-summary').style.display = 'none';
  
  // Update breadcrumb
  document.getElementById('current-breadcrumb-path').innerHTML = breadcrumbText;
  
  // Re-render
  renderApp();
  showToast(`Switched to account ${ACCOUNTS_CONFIG[accountId].name}`, 'info');
}

// Switch main section
function switchMainView(viewType, viewName) {
  activeView = viewType;
  
  // Update sidebar classes
  document.querySelectorAll('.nav-nested-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  if (viewType === 'stock') {
    document.getElementById('nav-stock').classList.add('active');
    document.getElementById('view-forex-account').style.display = 'none';
    document.getElementById('view-stock').style.display = 'block';
    document.getElementById('view-summary').style.display = 'none';
  } else if (viewType === 'summary') {
    document.getElementById('nav-summary').classList.add('active');
    document.getElementById('view-forex-account').style.display = 'none';
    document.getElementById('view-stock').style.display = 'none';
    document.getElementById('view-summary').style.display = 'block';
    
    renderSummaryView();
  }
  
  document.getElementById('current-breadcrumb-path').innerText = viewName;
}

// --- Data Render Functions ---
async function renderApp() {
  if (activeView !== 'forex-account') return;
  
  const config = ACCOUNTS_CONFIG[currentAccountId];
  
  try {
    // Fetch trades from the SQLite server API
    const response = await fetch(`/api/trades?account=${currentAccountId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const trades = await response.json();
    
    // Calculate KPIs
    const stats = calculateKPIs(config.capital, trades);
    
    // Render KPI values
    updateKPIDom(stats);
    
    // Render Capital Growth / Drawdown Chart
    renderCapitalChart(trades);
    
    // Render Calendar
    renderCalendar(trades);
  } catch (err) {
    console.error("Error loading account data from SQLite:", err);
    showToast("Could not connect to SQLite database!", "error");
  }
}

function calculateKPIs(initialCapital, trades) {
  const totalTrades = trades.length;
  let wins = 0;
  let losses = 0;
  let totalWinAmount = 0;
  let totalLossAmount = 0;
  let sumRR = 0;
  let sumDuration = 0;
  
  trades.forEach(t => {
    sumRR += parseFloat(t.rr || 0);
    sumDuration += parseFloat(t.duration || 0);
    if (t.amount > 0) {
      wins++;
      totalWinAmount += t.amount;
    } else if (t.amount < 0) {
      losses++;
      totalLossAmount += Math.abs(t.amount);
    }
  });
  
  const profit = totalWinAmount - totalLossAmount;
  const balance = initialCapital + profit;
  const winrate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  const avgWin = wins > 0 ? totalWinAmount / wins : 0;
  const avgLoss = losses > 0 ? totalLossAmount / losses : 0;
  const expectancy = totalTrades > 0 ? profit / totalTrades : 0;
  const profitFactor = totalLossAmount > 0 ? totalWinAmount / totalLossAmount : (totalWinAmount > 0 ? Infinity : 0);
  const avgRR = avgLoss > 0 ? avgWin / avgLoss : 0;
  const avgDuration = totalTrades > 0 ? sumDuration / totalTrades : 0;
  
  // Calculate Peak-to-Trough Max Drawdown and Consecutive Streaks
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  let peak = initialCapital;
  let maxDDAmount = 0;
  let maxDDPercent = 0;
  let currentBalance = initialCapital;
  
  let currentWinsStreak = 0;
  let currentLossesStreak = 0;
  let maxWinsStreak = 0;
  let maxLossesStreak = 0;
  
  sortedTrades.forEach(t => {
    currentBalance += t.amount;
    
    // Drawdown calculation
    if (currentBalance > peak) {
      peak = currentBalance;
    } else {
      const ddAmount = peak - currentBalance;
      const ddPercent = peak > 0 ? (ddAmount / peak) * 100 : 0;
      if (ddAmount > maxDDAmount) {
        maxDDAmount = ddAmount;
      }
      if (ddPercent > maxDDPercent) {
        maxDDPercent = ddPercent;
      }
    }
    
    // Streak calculation
    if (t.amount > 0) {
      currentWinsStreak++;
      currentLossesStreak = 0;
      if (currentWinsStreak > maxWinsStreak) {
        maxWinsStreak = currentWinsStreak;
      }
    } else if (t.amount < 0) {
      currentLossesStreak++;
      currentWinsStreak = 0;
      if (currentLossesStreak > maxLossesStreak) {
        maxLossesStreak = currentLossesStreak;
      }
    }
  });
  
  // Calculate Max Drawdown Duration (Time Balance stays below Initial Capital)
  const maxDDurationText = calculateMaxDrawdownDuration(initialCapital, trades);
  
  return {
    initialCapital,
    balance,
    profit,
    totalTrades,
    wins,
    losses,
    winrate,
    avgRR,
    avgWin,
    avgLoss,
    expectancy,
    profitFactor,
    avgDuration,
    maxDDurationText,
    maxDDAmount,
    maxDDPercent,
    maxWinsStreak,
    maxLossesStreak
  };
}

// Calculate max drawdown duration
function calculateMaxDrawdownDuration(initialCapital, trades) {
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let balance = initialCapital;
  let drawdownStart = null;
  let maxDurationDays = 0;
  
  sortedTrades.forEach(t => {
    const prevBalance = balance;
    balance += t.amount;
    
    // We parse the trade date. E.g. '2026-06-01'
    const tDate = new Date(t.date);
    
    if (balance < initialCapital && prevBalance >= initialCapital) {
      // Drawdown starts
      drawdownStart = tDate;
    } else if (balance >= initialCapital && prevBalance < initialCapital && drawdownStart) {
      // Drawdown ends
      const durationMs = tDate - drawdownStart;
      const durationDays = durationMs / (1000 * 60 * 60 * 24);
      if (durationDays > maxDurationDays) {
        maxDurationDays = durationDays;
      }
      drawdownStart = null;
    }
  });
  
  // If currently still in drawdown at the end of the history
  if (drawdownStart) {
    const durationMs = SYSTEM_DATE - drawdownStart;
    const durationDays = durationMs / (1000 * 60 * 60 * 24);
    if (durationDays > maxDurationDays) {
      maxDurationDays = durationDays;
    }
  }
  
  if (maxDurationDays === 0) return '0 days';
  return `${Math.round(maxDurationDays)} days`;
}

// Format duration helper
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds) || seconds <= 0) return 'N/A';
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} mins`;
  const hours = mins / 60;
  if (hours < 24) return `${hours.toFixed(1)} hrs`;
  const days = hours / 24;
  return `${days.toFixed(1)} days`;
}

function updateKPIDom(stats) {
  document.getElementById('kpi-initial-capital').innerText = formatCurrency(stats.initialCapital);
  document.getElementById('kpi-balance').innerText = formatCurrency(stats.balance);
  
  // Profit
  const profitEl = document.getElementById('kpi-profit');
  profitEl.innerText = (stats.profit >= 0 ? '+' : '') + formatCurrency(stats.profit);
  profitEl.className = 'kpi-value ' + (stats.profit >= 0 ? 'positive' : 'negative');
  
  document.getElementById('kpi-total-trades').innerText = stats.totalTrades;
  document.getElementById('kpi-wins').innerText = stats.wins;
  document.getElementById('kpi-losses').innerText = stats.losses;
  document.getElementById('kpi-winrate').innerText = stats.winrate.toFixed(0) + '%';
  document.getElementById('kpi-rr').innerText = '1:' + stats.avgRR.toFixed(1);
  
  // Average Win
  const avgWinEl = document.getElementById('kpi-avg-win');
  avgWinEl.innerText = '+' + formatCurrency(stats.avgWin);
  
  // Average Loss
  const avgLossEl = document.getElementById('kpi-avg-loss');
  avgLossEl.innerText = (stats.avgLoss > 0 ? '-' : '') + formatCurrency(stats.avgLoss);
  
  // Expectancy
  const expEl = document.getElementById('kpi-expectancy');
  expEl.innerText = (stats.expectancy >= 0 ? '+' : '') + formatCurrency(stats.expectancy);
  expEl.className = 'kpi-value ' + (stats.expectancy >= 0 ? 'positive' : 'negative');
  
  // Profit factor
  const pfEl = document.getElementById('kpi-profit-factor');
  if (stats.profitFactor === Infinity) {
    pfEl.innerText = '∞';
  } else if (stats.profitFactor === 0 && stats.totalTrades === 0) {
    pfEl.innerText = 'N/A';
  } else {
    pfEl.innerText = stats.profitFactor.toFixed(2);
  }

  // 13. Average Hold Time
  document.getElementById('kpi-avg-hold').innerText = formatDuration(stats.avgDuration);

  // 14. Max Drawdown Duration
  document.getElementById('kpi-max-dd-duration').innerText = stats.maxDDurationText;

  // 15. Max Drawdown ($ / %)
  document.getElementById('kpi-max-dd-amount').innerText = `${formatCurrency(stats.maxDDAmount)} (${stats.maxDDPercent.toFixed(1)}%)`;

  // 16. Max Consecutive Wins
  document.getElementById('kpi-max-consec-wins').innerText = stats.maxWinsStreak;

  // 17. Max Consecutive Losses
  document.getElementById('kpi-max-consec-losses').innerText = stats.maxLossesStreak;
}

// --- Capital Growth / Drawdown Chart (Chart.js) ---
function renderCapitalChart(trades) {
  const ctx = document.getElementById('equityChart').getContext('2d');
  
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  const initialCapital = ACCOUNTS_CONFIG[currentAccountId].capital;
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const equityData = [initialCapital];
  const labels = ['Start'];
  
  let currentEquity = initialCapital;
  sortedTrades.forEach((trade, index) => {
    currentEquity += trade.amount;
    equityData.push(currentEquity);
    
    let dateStr = '';
    if (trade.date) {
      const d = new Date(trade.date);
      if (!isNaN(d.getTime())) {
        dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        dateStr = trade.date;
      }
    } else {
      dateStr = `Trade ${index + 1}`;
    }
    labels.push(dateStr);
  });

  // Shadow glow plugin for the Equity Curve line
  const shadowPlugin = {
    id: 'shadowPlugin',
    beforeDatasetDraw: (chart) => {
      const { ctx } = chart;
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 6;
    },
    afterDatasetDraw: (chart) => {
      const { ctx } = chart;
      ctx.restore();
    }
  };
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    plugins: [shadowPlugin],
    data: {
      labels: labels,
      datasets: [{
        label: 'Equity ($)',
        data: equityData,
        borderColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return '#059669';
          
          const zeroPixel = chart.scales.y.getPixelForValue(initialCapital);
          const height = chartArea.bottom - chartArea.top;
          const zeroPos = (zeroPixel - chartArea.top) / height;
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          
          if (zeroPos > 0 && zeroPos < 1) {
            gradient.addColorStop(0, '#059669'); // Green above initialCapital
            gradient.addColorStop(zeroPos, '#059669');
            gradient.addColorStop(zeroPos, '#e11d48');
            gradient.addColorStop(1, '#e11d48'); // Red below initialCapital
          } else if (zeroPos <= 0) {
            return '#e11d48';
          } else {
            return '#059669';
          }
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: function(context) {
          const val = context.raw;
          return val >= initialCapital ? '#059669' : '#e11d48';
        },
        pointBorderColor: 'rgba(255,255,255,0.9)',
        pointBorderWidth: 1.5,
        pointRadius: equityData.length > 25 ? 1 : 3,
        pointHoverRadius: 6,
        // Dynamic green above initial capital and red below initial capital
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          
          const zeroPixel = chart.scales.y.getPixelForValue(initialCapital);
          const height = chartArea.bottom - chartArea.top;
          const zeroPos = (zeroPixel - chartArea.top) / height;
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          
          if (zeroPos > 0 && zeroPos < 1) {
            gradient.addColorStop(0, 'rgba(5, 150, 105, 0.18)'); // Green above initialCapital
            gradient.addColorStop(zeroPos - 0.01, 'rgba(5, 150, 105, 0.01)');
            gradient.addColorStop(zeroPos + 0.01, 'rgba(225, 29, 72, 0.01)');
            gradient.addColorStop(1, 'rgba(225, 29, 72, 0.18)'); // Red below initialCapital
          } else if (zeroPos <= 0) {
            return 'rgba(225, 29, 72, 0.15)'; // Entirely below initialCapital
          } else {
            return 'rgba(5, 150, 105, 0.15)'; // Entirely above initialCapital
          }
          return gradient;
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#111827',
          bodyColor: '#4b5563',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: function(context) {
              const idx = context[0].dataIndex;
              if (idx === 0) return 'Account Inception';
              const t = sortedTrades[idx - 1];
              const dir = t.direction ? t.direction.toUpperCase() : 'BUY';
              return `Trade #${t.id || idx} | ${t.symbol || ''} ${dir}`;
            },
            label: function(context) {
              const idx = context.dataIndex;
              const val = context.parsed.y;
              let text = `Equity: ${formatCurrency(val)}`;
              if (idx > 0) {
                const t = sortedTrades[idx - 1];
                const profit = t.amount;
                text += `\nProfit: ${profit >= 0 ? '+' : ''}${formatCurrency(profit)}`;
                if (t.date) text += `\nDate: ${t.date}`;
              }
              return text.split('\n');
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              family: 'Inter',
              size: 11
            }
          }
        },
        y: {
          suggestedMin: initialCapital - (initialCapital * 0.02),
          suggestedMax: initialCapital + (initialCapital * 0.02),
          grid: {
            // Draw a faint gray dashed threshold line to clearly demarcate the initial capital
            color: function(context) {
              return Math.abs(context.tick.value - initialCapital) < 0.1 ? 'rgba(15, 23, 42, 0.12)' : 'rgba(0, 0, 0, 0.02)';
            },
            lineWidth: function(context) {
              return Math.abs(context.tick.value - initialCapital) < 0.1 ? 1.5 : 1;
            },
            borderDash: function(context) {
              return Math.abs(context.tick.value - initialCapital) < 0.1 ? [5, 5] : [];
            },
            borderColor: 'rgba(0, 0, 0, 0.04)'
          },
          ticks: {
            color: '#6b7280',
            font: {
              family: 'Inter',
              size: 11
            },
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      }
    }
  });
}

// --- Trading Calendar Generator ---
function renderCalendar(trades) {
  const container = document.getElementById('calendar-days-container');
  container.innerHTML = '';
  
  const targetYear = activeCalendarDate.getFullYear();
  const targetMonth = activeCalendarDate.getMonth();
  
  const monthSelect = document.getElementById('calendar-month-select');
  const yearSelect = document.getElementById('calendar-year-select');
  if (monthSelect) monthSelect.value = targetMonth;
  if (yearSelect) yearSelect.value = targetYear;
  
  const firstDay = new Date(targetYear, targetMonth, 1);
  let startDayOfWeek = firstDay.getDay(); 
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Map Sunday to 6, Monday to 0
  
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(targetYear, targetMonth, 0).getDate();
  
  let monthNetProfit = 0;
  const uniqueTradingDays = new Set();
  
  // Previous month padding cells
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDayNum = daysInPrevMonth - i;
    const prevDateStr = `${targetMonth === 0 ? targetYear - 1 : targetYear}-${String(targetMonth === 0 ? 12 : targetMonth).padStart(2, '0')}-${String(prevDayNum).padStart(2, '0')}`;
    const cell = createDayCell(prevDayNum, prevDateStr, true, trades);
    container.appendChild(cell);
  }
  
  // Current month active cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayTrades = trades.filter(t => t.date === dateStr);
    if (dayTrades.length > 0) {
      const net = dayTrades.reduce((sum, t) => sum + t.amount, 0);
      monthNetProfit += net;
      uniqueTradingDays.add(dateStr);
    }
    
    const isToday = (targetYear === SYSTEM_DATE.getFullYear() && targetMonth === SYSTEM_DATE.getMonth() && day === SYSTEM_DATE.getDate());
    
    const cell = createDayCell(day, dateStr, false, trades, isToday);
    container.appendChild(cell);
  }
  
  // Next month padding cells
  const totalCells = startDayOfWeek + daysInMonth;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  
  for (let day = 1; day <= remainingCells; day++) {
    const nextDateStr = `${targetMonth === 11 ? targetYear + 1 : targetYear}-${String(targetMonth === 11 ? 1 : targetMonth + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cell = createDayCell(day, nextDateStr, true, trades);
    container.appendChild(cell);
  }
  
  // Update Calendar Header stats
  const statProfitEl = document.getElementById('cal-stat-profit');
  if (statProfitEl) {
    statProfitEl.innerText = (monthNetProfit >= 0 ? '+' : '') + formatCurrency(monthNetProfit);
  }
  
  const statProfitParent = document.getElementById('cal-stat-profit-container');
  if (statProfitParent) {
    if (monthNetProfit >= 0) {
      statProfitParent.className = 'calendar-stat-badge profit-positive';
    } else {
      statProfitParent.className = 'calendar-stat-badge profit-negative';
    }
  }
  
  const statDaysEl = document.getElementById('cal-stat-days');
  if (statDaysEl) {
    statDaysEl.innerText = uniqueTradingDays.size;
  }
}

function createDayCell(dayNum, dateStr, isOtherMonth, allTrades, isToday = false) {
  const cell = document.createElement('div');
  cell.className = 'calendar-day-cell';
  if (isOtherMonth) cell.classList.add('other-month');
  if (isToday) cell.classList.add('today');
  
  const numSpan = document.createElement('span');
  numSpan.className = 'calendar-day-number';
  numSpan.innerText = dayNum;
  cell.appendChild(numSpan);
  
  const dayTrades = allTrades.filter(t => t.date === dateStr);
  
  if (dayTrades.length > 0) {
    const netProfit = dayTrades.reduce((sum, t) => sum + t.amount, 0);
    
    if (netProfit >= 0) {
      cell.classList.add('has-profit');
    } else {
      cell.classList.add('has-loss');
    }
    
    const dayData = document.createElement('div');
    dayData.className = 'calendar-day-data';
    
    const profitSpan = document.createElement('span');
    profitSpan.className = 'calendar-day-profit ' + (netProfit >= 0 ? 'positive' : 'negative');
    profitSpan.innerText = (netProfit >= 0 ? '+' : '') + formatCurrency(netProfit);
    
    const countSpan = document.createElement('span');
    countSpan.className = 'calendar-day-count';
    countSpan.innerText = `Trades: ${dayTrades.length}`;
    
    dayData.appendChild(profitSpan);
    dayData.appendChild(countSpan);
    cell.appendChild(dayData);
  }
  
  return cell;
}

function adjustCalendarMonth(offset) {
  activeCalendarDate.setMonth(activeCalendarDate.getMonth() + offset);
  renderApp();
}

function goToToday() {
  activeCalendarDate = new Date(SYSTEM_DATE.getFullYear(), SYSTEM_DATE.getMonth(), 1);
  renderApp();
}

function onCalendarSelectChange() {
  const monthSelect = document.getElementById('calendar-month-select');
  const yearSelect = document.getElementById('calendar-year-select');
  if (monthSelect && yearSelect) {
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);
    activeCalendarDate = new Date(year, month, 1);
    renderApp();
  }
}

// --- Render Summary/Aggregate View ---
async function renderSummaryView() {
  const tbody = document.getElementById('summary-table-body');
  tbody.innerHTML = '';
  
  let totalCapital = 0;
  let totalBalance = 0;
  let totalProfit = 0;
  let totalTrades = 0;
  
  try {
    const accountIds = Object.keys(ACCOUNTS_CONFIG);
    const fetchPromises = accountIds.map(accId => 
      fetch(`/api/trades?account=${accId}`)
        .then(res => res.ok ? res.json() : Promise.reject(`Failed for ${accId}`))
        .then(trades => ({ accId, trades }))
    );
    
    const results = await Promise.all(fetchPromises);
    
    results.forEach(({ accId, trades }) => {
      const config = ACCOUNTS_CONFIG[accId];
      const stats = calculateKPIs(config.capital, trades);
      
      totalCapital += config.capital;
      totalBalance += stats.balance;
      totalProfit += stats.profit;
      totalTrades += stats.totalTrades;
      
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid var(--border-glass)';
      row.style.transition = 'var(--transition-fast)';
      row.addEventListener('mouseenter', () => {
        row.style.background = 'rgba(0, 0, 0, 0.01)';
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = 'transparent';
      });
      
      const profitClass = stats.profit >= 0 ? 'positive' : 'negative';
      const statusText = stats.totalTrades > 0 ? 'Active' : 'Inactive';
      const statusStyle = stats.totalTrades > 0 
        ? 'color: var(--success-text); background: var(--success-glow); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight:600;' 
        : 'color: var(--text-muted); background: rgba(0,0,0,0.03); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;';
        
      const category = config.type === 'Personal' ? 'Personal Accounts' : 'Funded Accounts';
      const breadcrumb = `Forex / ${category} / ${config.name}`;
        
      row.innerHTML = `
        <td style="padding: 14px 20px; font-weight:600; color: var(--text-primary); cursor:pointer;" onclick="switchAccount('${accId}', '${breadcrumb}')">
          ${config.name}
          <span style="font-size:0.75rem; color:var(--text-muted); display:block; font-weight:normal;">Click to view details</span>
        </td>
        <td style="padding: 14px 20px; color: var(--text-secondary);">${formatCurrency(config.capital)}</td>
        <td style="padding: 14px 20px; font-weight:600;">${formatCurrency(stats.balance)}</td>
        <td style="padding: 14px 20px;" class="kpi-value ${profitClass}">${stats.profit >= 0 ? '+' : ''}${formatCurrency(stats.profit)}</td>
        <td style="padding: 14px 20px; color: var(--text-secondary);">${stats.winrate.toFixed(0)}% (${stats.wins}/${stats.totalTrades})</td>
        <td style="padding: 14px 20px;"><span style="${statusStyle}">${statusText}</span></td>
      `;
      
      tbody.appendChild(row);
    });
    
    document.getElementById('sum-initial-capital').innerText = formatCurrency(totalCapital);
    document.getElementById('sum-balance').innerText = formatCurrency(totalBalance);
    
    const profitEl = document.getElementById('sum-profit');
    profitEl.innerText = (totalProfit >= 0 ? '+' : '') + formatCurrency(totalProfit);
    profitEl.className = 'kpi-value ' + (totalProfit >= 0 ? 'positive' : 'negative');
    
    document.getElementById('sum-total-trades').innerText = totalTrades;
  } catch (err) {
    console.error("Error synchronizing overview summary:", err);
    showToast("Could not synchronize overview data!", "error");
  }
}

// --- Helpers ---
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast-notif');
  const icon = document.getElementById('toast-icon');
  const msg = document.getElementById('toast-message');
  
  msg.innerText = message;
  toast.className = `toast show ${type}`;
  
  if (type === 'success') {
    icon.innerHTML = '✅';
  } else if (type === 'error') {
    icon.innerHTML = '❌';
  } else {
    icon.innerHTML = 'ℹ️';
  }
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
