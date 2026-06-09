// LC Dashboard Application Logic - SQLite Backend Driven

// Configuration & Initial State
const ACCOUNTS_CONFIG = {
  'ftmo-10k': { name: 'FTMO 10k', capital: 10000, type: 'FTMO' },
  'ftmo-100k-1': { name: 'FTMO 100k #1', capital: 100000, type: 'FTMO' },
  'ftmo-100k-2': { name: 'FTMO 100k #2', capital: 100000, type: 'FTMO' },
  'ftmo-100k-3': { name: 'FTMO 100k #3', capital: 100000, type: 'FTMO' },
  'ftmo-100k-4': { name: 'FTMO 100k #4', capital: 100000, type: 'FTMO' },
  'the5ers-5k': { name: 'The5ers 5k', capital: 5000, type: 'The5ers' },
  'personal-1': { name: 'Personal Acc #1', capital: 5000, type: 'Cá nhân' },
  'personal-2': { name: 'Personal Acc #2', capital: 10000, type: 'Cá nhân' }
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
  
  // Render dashboard
  renderApp();
});

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
  showToast(`Đã chuyển sang tài khoản ${ACCOUNTS_CONFIG[accountId].name}`, 'info');
}

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
    
    // Render Equity Chart
    renderEquityChart(config.capital, trades);
    
    // Render Calendar
    renderCalendar(trades);
  } catch (err) {
    console.error("Lỗi tải dữ liệu từ database SQLite:", err);
    showToast("Không thể kết nối cơ sở dữ liệu SQLite FTMO!", "error");
  }
}

function calculateKPIs(initialCapital, trades) {
  const totalTrades = trades.length;
  let wins = 0;
  let losses = 0;
  let totalWinAmount = 0;
  let totalLossAmount = 0;
  let sumRR = 0;
  
  trades.forEach(t => {
    sumRR += parseFloat(t.rr || 0);
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
  const avgRR = totalTrades > 0 ? sumRR / totalTrades : 0;
  
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
    profitFactor
  };
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
}

// --- Equity Chart (Chart.js) ---
function renderEquityChart(initialCapital, trades) {
  const ctx = document.getElementById('equityChart').getContext('2d');
  
  // Destroy old instance to prevent overlay bugs
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  // Get active month and year
  const targetYear = activeCalendarDate.getFullYear();
  const targetMonth = activeCalendarDate.getMonth(); // 0-indexed
  
  // Filter trades that happened in or before this month to calculate equity timeline
  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate historical balance leading up to this month
  let balance = initialCapital;
  
  // Group trades by day in the target month, and compute cumulative balance
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const dailyBalances = [];
  const labels = [];
  
  // Initialize baseline balance (sum of all trades prior to this month)
  const targetMonthStart = new Date(targetYear, targetMonth, 1);
  
  sortedTrades.forEach(t => {
    const tDate = new Date(t.date);
    if (tDate < targetMonthStart) {
      balance += t.amount;
    }
  });
  
  // Starting point of the chart: day 0 (representing the balance before the month starts)
  labels.push('Đầu tháng');
  dailyBalances.push(balance);
  
  // Calculate daily progression inside target month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTrades = sortedTrades.filter(t => t.date === dayStr);
    
    if (dayTrades.length > 0) {
      const dayNet = dayTrades.reduce((sum, t) => sum + t.amount, 0);
      balance += dayNet;
      labels.push(`Ngày ${day}`);
      dailyBalances.push(balance);
    } else {
      // If there are no trades on this day, we only push a data point if it's prior to or equal to Today 
      // (so we don't draw flat lines into the future)
      const loopDate = new Date(targetYear, targetMonth, day);
      if (loopDate <= SYSTEM_DATE || targetMonthStart < SYSTEM_DATE) {
        // Just maintain current balance
        labels.push(`Ngày ${day}`);
        dailyBalances.push(balance);
      }
    }
  }
  
  // Premium Light Orange Gradient for LC brand
  const chartGradient = ctx.createLinearGradient(0, 0, 0, 300);
  chartGradient.addColorStop(0, 'rgba(255, 122, 0, 0.2)');
  chartGradient.addColorStop(1, 'rgba(255, 122, 0, 0.0)');
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Tài sản (Equity)',
        data: dailyBalances,
        borderColor: '#ff7a00',
        borderWidth: 3,
        backgroundColor: chartGradient,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#ff9130',
        pointBorderColor: 'rgba(255,255,255,0.8)',
        pointBorderWidth: 2,
        pointRadius: dailyBalances.length > 15 ? 2 : 4,
        pointHoverRadius: 6,
        shadowColor: 'rgba(255, 122, 0, 0.2)',
        shadowBlur: 8
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
            label: function(context) {
              return `Equity: ${formatCurrency(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.02)',
            borderColor: 'rgba(0, 0, 0, 0.04)'
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
          grid: {
            color: 'rgba(0, 0, 0, 0.02)',
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
  
  // Set month label
  const monthNames = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
  ];
  document.getElementById('calendar-month-label').innerText = `${monthNames[targetMonth]} ${targetYear}`;
  
  // First day of target month
  const firstDay = new Date(targetYear, targetMonth, 1);
  // Get weekday of first day. 0 = Sun, 1 = Mon... 
  // We want Monday as index 0, Tuesday index 1 ... Sunday index 6
  let startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Mon, 6 = Sat
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Map Sunday to 6, Monday to 0
  
  // Days in current month
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  
  // Days in previous month
  const daysInPrevMonth = new Date(targetYear, targetMonth, 0).getDate();
  
  // Active calendar stat calculation (inside this month only)
  let monthNetProfit = 0;
  const uniqueTradingDays = new Set();
  
  // Generate days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDayNum = daysInPrevMonth - i;
    const prevDateStr = `${targetMonth === 0 ? targetYear - 1 : targetYear}-${String(targetMonth === 0 ? 12 : targetMonth).padStart(2, '0')}-${String(prevDayNum).padStart(2, '0')}`;
    
    const cell = createDayCell(prevDayNum, prevDateStr, true, trades);
    container.appendChild(cell);
  }
  
  // Generate days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check if there are trades on this day and update stats
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
  
  // Fill the remaining grid cells with next month's days to keep grid uniform
  const totalCells = startDayOfWeek + daysInMonth;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  
  for (let day = 1; day <= remainingCells; day++) {
    const nextDateStr = `${targetMonth === 11 ? targetYear + 1 : targetYear}-${String(targetMonth === 11 ? 1 : targetMonth + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cell = createDayCell(day, nextDateStr, true, trades);
    container.appendChild(cell);
  }
  
  // Update Calendar Header Stat elements
  const statProfitEl = document.getElementById('cal-stat-profit');
  statProfitEl.innerText = (monthNetProfit >= 0 ? '+' : '') + formatCurrency(monthNetProfit);
  statProfitEl.className = monthNetProfit >= 0 ? 'calendar-stat-badge profit' : 'calendar-stat-badge profit negative';
  
  // Adjust parent background color if negative
  const statProfitParent = statProfitEl.closest('.calendar-stat-badge');
  if (monthNetProfit >= 0) {
    statProfitParent.style.background = 'var(--success-glow)';
    statProfitParent.style.color = 'var(--success-text)';
    statProfitParent.style.borderColor = 'rgba(5, 150, 105, 0.15)';
  } else {
    statProfitParent.style.background = 'var(--danger-glow)';
    statProfitParent.style.color = 'var(--danger-text)';
    statProfitParent.style.borderColor = 'rgba(225, 29, 72, 0.15)';
  }
  
  document.getElementById('cal-stat-days').innerText = uniqueTradingDays.size;
}

function createDayCell(dayNum, dateStr, isOtherMonth, allTrades, isToday = false) {
  const cell = document.createElement('div');
  cell.className = 'calendar-day-cell';
  if (isOtherMonth) cell.classList.add('other-month');
  if (isToday) cell.classList.add('today');
  
  // Day number label
  const numSpan = document.createElement('span');
  numSpan.className = 'calendar-day-number';
  numSpan.innerText = dayNum;
  cell.appendChild(numSpan);
  
  // Filter trades for this day
  const dayTrades = allTrades.filter(t => t.date === dateStr);
  
  if (dayTrades.length > 0) {
    const dayData = document.createElement('div');
    dayData.className = 'calendar-day-data';
    
    // Net profit for this day
    const netProfit = dayTrades.reduce((sum, t) => sum + t.amount, 0);
    const profitSpan = document.createElement('span');
    profitSpan.className = 'calendar-day-profit ' + (netProfit >= 0 ? 'positive' : 'negative');
    profitSpan.innerText = (netProfit >= 0 ? '+' : '') + formatCurrency(netProfit);
    
    // Count of trades
    const countSpan = document.createElement('span');
    countSpan.className = 'calendar-day-count';
    countSpan.innerText = `Các giao dịch: ${dayTrades.length}`;
    
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

// Today navigation
function goToToday() {
  activeCalendarDate = new Date(SYSTEM_DATE.getFullYear(), SYSTEM_DATE.getMonth(), 1);
  renderApp();
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
    // Fetch trades for all accounts concurrently from SQLite database via API
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
      
      // Render row
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
      const statusText = stats.totalTrades > 0 ? 'Hoạt động' : 'Chưa giao dịch';
      const statusStyle = stats.totalTrades > 0 
        ? 'color: var(--success-text); background: var(--success-glow); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight:600;' 
        : 'color: var(--text-muted); background: rgba(0,0,0,0.03); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;';
        
      const category = config.type === 'Cá nhân' ? 'Tài khoản cá nhân' : 'Tài khoản quỹ';
      const breadcrumb = `Forex / ${category} / ${config.name}`;
        
      row.innerHTML = `
        <td style="padding: 14px 20px; font-weight:600; color: var(--text-primary); cursor:pointer;" onclick="switchAccount('${accId}', '${breadcrumb}')">
          ${config.name}
          <span style="font-size:0.75rem; color:var(--text-muted); display:block; font-weight:normal;">Nhấp để xem chi tiết</span>
        </td>
        <td style="padding: 14px 20px; color: var(--text-secondary);">${formatCurrency(config.capital)}</td>
        <td style="padding: 14px 20px; font-weight:600;">${formatCurrency(stats.balance)}</td>
        <td style="padding: 14px 20px;" class="kpi-value ${profitClass}">${stats.profit >= 0 ? '+' : ''}${formatCurrency(stats.profit)}</td>
        <td style="padding: 14px 20px; color: var(--text-secondary);">${stats.winrate.toFixed(0)}% (${stats.wins}/${stats.totalTrades})</td>
        <td style="padding: 14px 20px;"><span style="${statusStyle}">${statusText}</span></td>
      `;
      
      tbody.appendChild(row);
    });
    
    // Update overall top metric widgets
    document.getElementById('sum-initial-capital').innerText = formatCurrency(totalCapital);
    document.getElementById('sum-balance').innerText = formatCurrency(totalBalance);
    
    const profitEl = document.getElementById('sum-profit');
    profitEl.innerText = (totalProfit >= 0 ? '+' : '') + formatCurrency(totalProfit);
    profitEl.className = 'kpi-value ' + (totalProfit >= 0 ? 'positive' : 'negative');
    
    document.getElementById('sum-total-trades').innerText = totalTrades;
  } catch (err) {
    console.error("Lỗi đồng bộ dữ liệu tổng hợp:", err);
    showToast("Không thể đồng bộ dữ liệu tổng hợp!", "error");
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
