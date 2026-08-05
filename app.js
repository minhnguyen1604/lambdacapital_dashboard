// LC Dashboard Application Logic - SQLite Backend Driven (English Edition)

// === Du lieu du phong khi mo truc tiep bang file:// (dong bo tu data/*.xlsx) ===
// Chi dung khi mo index.html bang file:// (khong co server). Sinh tu data/FTMO_10k_Challenge.xlsx.
const FTMO_10K_TRADES = [{"id":151874883,"date":"2026-07-23","symbol":"USDJPY","direction":"BUY","amount":138.53,"rr":5.0,"duration":230754},{"id":151873970,"date":"2026-07-23","symbol":"USDJPY","direction":"BUY","amount":58.73,"rr":5.0,"duration":231025},{"id":151099924,"date":"2026-07-17","symbol":"USDJPY","direction":"BUY","amount":-5.98,"rr":2.1,"duration":83200},{"id":149659823,"date":"2026-07-14","symbol":"XAUUSD","direction":"SELL","amount":26.97,"rr":5.0,"duration":114056},{"id":146852216,"date":"2026-07-03","symbol":"BTCUSD","direction":"BUY","amount":17.11,"rr":3.1,"duration":111129},{"id":146813697,"date":"2026-07-03","symbol":"BTCUSD","direction":"BUY","amount":48.59,"rr":2.1,"duration":119227},{"id":146160046,"date":"2026-07-01","symbol":"BTCUSD","direction":"SELL","amount":1.79,"rr":5.0,"duration":41536},{"id":145615795,"date":"2026-06-30","symbol":"USDJPY","direction":"BUY","amount":196.61,"rr":5.0,"duration":106835},{"id":143893593,"date":"2026-06-25","symbol":"GBPUSD","direction":"SELL","amount":44.18,"rr":5.0,"duration":177559},{"id":143893506,"date":"2026-06-23","symbol":"BTCUSD","direction":"SELL","amount":-8.17,"rr":2.0,"duration":4},{"id":141152513,"date":"2026-06-12","symbol":"BTCUSD","direction":"BUY","amount":0.25,"rr":2.4,"duration":27570},{"id":141152493,"date":"2026-06-12","symbol":"BTCUSD","direction":"SELL","amount":-2.79,"rr":2.0,"duration":4},{"id":137218824,"date":"2026-06-01","symbol":"BTCUSD","direction":"SELL","amount":201.67,"rr":5.0,"duration":42718},{"id":135856933,"date":"2026-05-27","symbol":"XAUUSD","direction":"SELL","amount":212.75,"rr":5.0,"duration":90935},{"id":135205689,"date":"2026-05-22","symbol":"XAUUSD","direction":"SELL","amount":-15.72,"rr":2.7,"duration":16327},{"id":132639693,"date":"2026-05-15","symbol":"XAUUSD","direction":"SELL","amount":202.9,"rr":5.0,"duration":91993},{"id":130737445,"date":"2026-05-07","symbol":"GBPUSD","direction":"BUY","amount":-51.5,"rr":2.1,"duration":1520},{"id":130636471,"date":"2026-05-07","symbol":"GBPUSD","direction":"SELL","amount":-57.5,"rr":2.1,"duration":2411},{"id":130595787,"date":"2026-05-07","symbol":"GBPUSD","direction":"BUY","amount":-51.5,"rr":2.1,"duration":9731},{"id":129988602,"date":"2026-05-05","symbol":"GBPUSD","direction":"BUY","amount":100.32,"rr":2.3,"duration":9621},{"id":129959265,"date":"2026-05-05","symbol":"GBPUSD","direction":"SELL","amount":-67.63,"rr":1.0,"duration":899},{"id":129816986,"date":"2026-05-05","symbol":"GBPUSD","direction":"SELL","amount":-54.5,"rr":2.1,"duration":9108},{"id":129124140,"date":"2026-05-01","symbol":"GBPUSD","direction":"BUY","amount":0.97,"rr":5.0,"duration":2633},{"id":129001725,"date":"2026-05-01","symbol":"GBPUSD","direction":"BUY","amount":-3.2,"rr":5.0,"duration":5896},{"id":128217365,"date":"2026-04-29","symbol":"GBPUSD","direction":"SELL","amount":101.92,"rr":1.9,"duration":12842},{"id":127289434,"date":"2026-04-24","symbol":"GBPUSD","direction":"BUY","amount":100.18,"rr":5.0,"duration":11311},{"id":126996129,"date":"2026-04-24","symbol":"GBPUSD","direction":"SELL","amount":-76.68,"rr":2.1,"duration":68328},{"id":126778210,"date":"2026-04-23","symbol":"GBPUSD","direction":"SELL","amount":-94.25,"rr":2.3,"duration":13714},{"id":126458662,"date":"2026-04-22","symbol":"USDJPY","direction":"SELL","amount":-59.32,"rr":2.5,"duration":3550},{"id":126426526,"date":"2026-04-22","symbol":"USDJPY","direction":"BUY","amount":-106.89,"rr":2.1,"duration":2354},{"id":126305624,"date":"2026-04-22","symbol":"GBPUSD","direction":"BUY","amount":-68.86,"rr":2.2,"duration":24249},{"id":125784334,"date":"2026-04-21","symbol":"USDJPY","direction":"BUY","amount":184.97,"rr":4.5,"duration":60286},{"id":124949948,"date":"2026-04-17","symbol":"XAUUSD","direction":"SELL","amount":-27.62,"rr":3.3,"duration":37701},{"id":124947876,"date":"2026-04-17","symbol":"XAUUSD","direction":"SELL","amount":-67.1,"rr":2.4,"duration":38028},{"id":124290517,"date":"2026-04-16","symbol":"EURUSD","direction":"BUY","amount":0.58,"rr":5.0,"duration":63253},{"id":124507345,"date":"2026-04-16","symbol":"USDJPY","direction":"SELL","amount":-59.51,"rr":2.1,"duration":21215},{"id":122511780,"date":"2026-04-10","symbol":"GBPUSD","direction":"BUY","amount":6.42,"rr":1.9,"duration":49180},{"id":122516521,"date":"2026-04-10","symbol":"XAUUSD","direction":"BUY","amount":-0.43,"rr":2.7,"duration":48672},{"id":121421016,"date":"2026-04-07","symbol":"USDJPY","direction":"BUY","amount":0.53,"rr":5.0,"duration":45133},{"id":120082581,"date":"2026-04-01","symbol":"GBPUSD","direction":"BUY","amount":189.84,"rr":4.4,"duration":23627},{"id":118036318,"date":"2026-03-27","symbol":"USDJPY","direction":"BUY","amount":48.76,"rr":5.0,"duration":119435},{"id":117671822,"date":"2026-03-25","symbol":"USDJPY","direction":"SELL","amount":-101.7,"rr":2.1,"duration":24549},{"id":117582115,"date":"2026-03-24","symbol":"XAUUSD","direction":"BUY","amount":-32.04,"rr":0.5,"duration":1391},{"id":117534856,"date":"2026-03-24","symbol":"USDJPY","direction":"SELL","amount":-60.16,"rr":2.1,"duration":3373},{"id":117453032,"date":"2026-03-24","symbol":"USDJPY","direction":"BUY","amount":-49.09,"rr":2.7,"duration":4963},{"id":117314152,"date":"2026-03-24","symbol":"XAUUSD","direction":"BUY","amount":-48.0,"rr":2.1,"duration":20356},{"id":116863565,"date":"2026-03-23","symbol":"BTCUSD","direction":"SELL","amount":-58.39,"rr":2.2,"duration":19598},{"id":116824626,"date":"2026-03-23","symbol":"GBPUSD","direction":"SELL","amount":-99.84,"rr":2.0,"duration":4152},{"id":115178185,"date":"2026-03-18","symbol":"XAUUSD","direction":"SELL","amount":0.76,"rr":0.5,"duration":8972},{"id":115038813,"date":"2026-03-17","symbol":"XAUUSD","direction":"SELL","amount":-13.98,"rr":3.7,"duration":5470},{"id":114812789,"date":"2026-03-17","symbol":"USDJPY","direction":"SELL","amount":188.77,"rr":5.0,"duration":21651},{"id":114861551,"date":"2026-03-17","symbol":"XAUUSD","direction":"SELL","amount":-25.03,"rr":3.3,"duration":12894},{"id":114801748,"date":"2026-03-17","symbol":"XAUUSD","direction":"SELL","amount":-41.32,"rr":2.2,"duration":2006},{"id":114750174,"date":"2026-03-17","symbol":"XAUUSD","direction":"BUY","amount":-49.26,"rr":2.5,"duration":10248},{"id":114445953,"date":"2026-03-16","symbol":"EURUSD","direction":"SELL","amount":-51.2,"rr":2.2,"duration":1160},{"id":114377758,"date":"2026-03-16","symbol":"GBPUSD","direction":"SELL","amount":-37.8,"rr":2.5,"duration":5304},{"id":114377637,"date":"2026-03-16","symbol":"USDJPY","direction":"SELL","amount":-3.42,"rr":2.0,"duration":5},{"id":114346959,"date":"2026-03-16","symbol":"USDJPY","direction":"BUY","amount":-37.67,"rr":2.1,"duration":3233},{"id":113749300,"date":"2026-03-13","symbol":"GBPUSD","direction":"SELL","amount":3.47,"rr":1.8,"duration":1925},{"id":113627685,"date":"2026-03-12","symbol":"USDJPY","direction":"SELL","amount":-60.71,"rr":2.9,"duration":5158},{"id":113321679,"date":"2026-03-12","symbol":"XAUUSD","direction":"BUY","amount":13.58,"rr":2.3,"duration":15379},{"id":113121683,"date":"2026-03-12","symbol":"XAUUSD","direction":"SELL","amount":24.62,"rr":5.0,"duration":50331},{"id":112982636,"date":"2026-03-11","symbol":"GBPUSD","direction":"SELL","amount":-49.36,"rr":2.5,"duration":3555},{"id":112296989,"date":"2026-03-11","symbol":"XAUUSD","direction":"BUY","amount":18.94,"rr":5.0,"duration":119287},{"id":111239745,"date":"2026-03-06","symbol":"GBPUSD","direction":"BUY","amount":-9.91,"rr":2.2,"duration":25430},{"id":110965735,"date":"2026-03-06","symbol":"XAUUSD","direction":"SELL","amount":3.82,"rr":5.0,"duration":43620},{"id":109193967,"date":"2026-03-02","symbol":"USDJPY","direction":"BUY","amount":100.06,"rr":5.0,"duration":15925},{"id":108588199,"date":"2026-02-27","symbol":"XAUUSD","direction":"BUY","amount":-34.56,"rr":2.9,"duration":29197},{"id":107933215,"date":"2026-02-26","symbol":"GBPUSD","direction":"BUY","amount":4.27,"rr":5.0,"duration":57837},{"id":107684446,"date":"2026-02-25","symbol":"USDJPY","direction":"BUY","amount":110.89,"rr":4.5,"duration":10543},{"id":107142827,"date":"2026-02-24","symbol":"GBPUSD","direction":"SELL","amount":-9.16,"rr":2.7,"duration":35458},{"id":107230275,"date":"2026-02-24","symbol":"US100.CASH","direction":"SELL","amount":-25.58,"rr":2.0,"duration":11161},{"id":107002911,"date":"2026-02-24","symbol":"US100.CASH","direction":"SELL","amount":-23.82,"rr":2.1,"duration":35570},{"id":106139975,"date":"2026-02-20","symbol":"XAUUSD","direction":"BUY","amount":14.38,"rr":3.3,"duration":17509},{"id":105145051,"date":"2026-02-18","symbol":"USDJPY","direction":"BUY","amount":95.41,"rr":5.0,"duration":49948},{"id":105008405,"date":"2026-02-17","symbol":"USDJPY","direction":"BUY","amount":-49.7,"rr":2.2,"duration":12294},{"id":104743632,"date":"2026-02-17","symbol":"USDJPY","direction":"SELL","amount":-47.42,"rr":2.2,"duration":16480},{"id":104452577,"date":"2026-02-17","symbol":"EURUSD","direction":"SELL","amount":12.57,"rr":5.0,"duration":71443}];
// Sinh tu data/the5ers_5k_Challenge.xlsx
const THE5ERS_5K_TRADES = [{"id":578431850,"date":"2026-07-23","symbol":"USDJPY","direction":"BUY","amount":69.27,"rr":5.0,"duration":242038},{"id":578430406,"date":"2026-07-23","symbol":"USDJPY","direction":"BUY","amount":34.53,"rr":5.0,"duration":242367},{"id":577373724,"date":"2026-07-17","symbol":"USDJPY","direction":"BUY","amount":-5.0,"rr":0.5,"duration":83205},{"id":575333341,"date":"2026-07-14","symbol":"XAUUSD","direction":"SELL","amount":25.71,"rr":5.0,"duration":114044},{"id":571621346,"date":"2026-07-03","symbol":"BTCUSD","direction":"BUY","amount":36.13,"rr":2.1,"duration":119211},{"id":570774840,"date":"2026-07-01","symbol":"BTCUSD","direction":"SELL","amount":1.42,"rr":5.0,"duration":41485},{"id":570080566,"date":"2026-06-30","symbol":"USDJPY","direction":"BUY","amount":94.4,"rr":5.0,"duration":106749},{"id":567914076,"date":"2026-06-25","symbol":"GBPUSD","direction":"SELL","amount":20.34,"rr":5.0,"duration":177552},{"id":564054325,"date":"2026-06-12","symbol":"BTCUSD","direction":"BUY","amount":0.12,"rr":2.9,"duration":27516},{"id":558683680,"date":"2026-06-01","symbol":"BTCUSD","direction":"SELL","amount":109.41,"rr":5.0,"duration":42710},{"id":556739855,"date":"2026-05-27","symbol":"XAUUSD","direction":"SELL","amount":105.68,"rr":5.0,"duration":90946},{"id":555699838,"date":"2026-05-22","symbol":"XAUUSD","direction":"SELL","amount":-7.84,"rr":2.8,"duration":16325},{"id":551783689,"date":"2026-05-15","symbol":"XAUUSD","direction":"SELL","amount":99.58,"rr":5.0,"duration":91985},{"id":548820976,"date":"2026-05-07","symbol":"GBPUSD","direction":"BUY","amount":-26.25,"rr":2.1,"duration":1462},{"id":548652332,"date":"2026-05-07","symbol":"GBPUSD","direction":"SELL","amount":-25.75,"rr":2.2,"duration":2402},{"id":548565171,"date":"2026-05-07","symbol":"GBPUSD","direction":"BUY","amount":-15.5,"rr":2.1,"duration":17122},{"id":547608386,"date":"2026-05-05","symbol":"GBPUSD","direction":"BUY","amount":50.92,"rr":2.4,"duration":9608},{"id":547562795,"date":"2026-05-05","symbol":"GBPUSD","direction":"SELL","amount":-36.25,"rr":1.0,"duration":889},{"id":547306389,"date":"2026-05-05","symbol":"GBPUSD","direction":"SELL","amount":-26.25,"rr":2.2,"duration":9099},{"id":546271714,"date":"2026-05-01","symbol":"GBPUSD","direction":"BUY","amount":0.5,"rr":5.0,"duration":2670},{"id":546052592,"date":"2026-05-01","symbol":"GBPUSD","direction":"BUY","amount":-0.78,"rr":5.0,"duration":5867},{"id":544590519,"date":"2026-04-29","symbol":"GBPUSD","direction":"SELL","amount":13.57,"rr":5.0,"duration":14915},{"id":543145076,"date":"2026-04-24","symbol":"GBPUSD","direction":"BUY","amount":50.82,"rr":5.0,"duration":11276},{"id":542667497,"date":"2026-04-24","symbol":"GBPUSD","direction":"SELL","amount":-42.42,"rr":2.2,"duration":68302},{"id":542339296,"date":"2026-04-23","symbol":"GBPUSD","direction":"SELL","amount":-48.32,"rr":2.4,"duration":13702},{"id":541841188,"date":"2026-04-22","symbol":"USDJPY","direction":"SELL","amount":-29.53,"rr":2.4,"duration":3524},{"id":541788354,"date":"2026-04-22","symbol":"USDJPY","direction":"BUY","amount":-49.79,"rr":2.1,"duration":2342},{"id":541588588,"date":"2026-04-22","symbol":"GBPUSD","direction":"BUY","amount":-37.38,"rr":2.2,"duration":24240},{"id":540767869,"date":"2026-04-21","symbol":"USDJPY","direction":"BUY","amount":90.84,"rr":4.5,"duration":60277},{"id":539042925,"date":"2026-04-17","symbol":"XAUUSD","direction":"SELL","amount":-36.71,"rr":2.0,"duration":38210},{"id":538269689,"date":"2026-04-16","symbol":"USDJPY","direction":"SELL","amount":-28.09,"rr":2.2,"duration":21192},{"id":537917737,"date":"2026-04-16","symbol":"EURUSD","direction":"BUY","amount":-0.26,"rr":2.2,"duration":63236},{"id":534838134,"date":"2026-04-10","symbol":"XAUUSD","direction":"BUY","amount":-0.57,"rr":2.9,"duration":48652},{"id":534830722,"date":"2026-04-10","symbol":"GBPUSD","direction":"BUY","amount":3.48,"rr":1.9,"duration":49184},{"id":533060862,"date":"2026-04-07","symbol":"USDJPY","direction":"BUY","amount":0.74,"rr":5.0,"duration":45125},{"id":530726573,"date":"2026-04-01","symbol":"GBPUSD","direction":"BUY","amount":96.04,"rr":3.7,"duration":23625},{"id":527451809,"date":"2026-03-27","symbol":"USDJPY","direction":"BUY","amount":23.62,"rr":2.1,"duration":119446},{"id":526871284,"date":"2026-03-25","symbol":"USDJPY","direction":"SELL","amount":-49.75,"rr":1.0,"duration":24413},{"id":526761357,"date":"2026-03-24","symbol":"XAUUSD","direction":"BUY","amount":-33.14,"rr":0.5,"duration":1398},{"id":526690393,"date":"2026-03-24","symbol":"USDJPY","direction":"SELL","amount":-22.27,"rr":2.3,"duration":3365},{"id":526561993,"date":"2026-03-24","symbol":"USDJPY","direction":"BUY","amount":-21.08,"rr":2.6,"duration":4967},{"id":526331476,"date":"2026-03-24","symbol":"XAUUSD","direction":"BUY","amount":-46.43,"rr":1.9,"duration":20341},{"id":525626071,"date":"2026-03-23","symbol":"BTCUSD","direction":"SELL","amount":-30.9,"rr":2.1,"duration":19566},{"id":525561489,"date":"2026-03-23","symbol":"GBPUSD","direction":"SELL","amount":-50.08,"rr":2.1,"duration":4146},{"id":523054097,"date":"2026-03-18","symbol":"XAUUSD","direction":"SELL","amount":1.92,"rr":0.5,"duration":8976},{"id":522863384,"date":"2026-03-17","symbol":"XAUUSD","direction":"SELL","amount":-5.41,"rr":4.6,"duration":5461},{"id":522611661,"date":"2026-03-17","symbol":"XAUUSD","direction":"SELL","amount":-17.24,"rr":4.5,"duration":12908},{"id":522533201,"date":"2026-03-17","symbol":"USDJPY","direction":"SELL","amount":91.98,"rr":5.0,"duration":21656},{"id":522512959,"date":"2026-03-17","symbol":"XAUUSD","direction":"SELL","amount":-27.8,"rr":3.7,"duration":1987},{"id":522512351,"date":"2026-03-17","symbol":"USDJPY","direction":"SELL","amount":-0.14,"rr":2.0,"duration":10},{"id":522420340,"date":"2026-03-17","symbol":"XAUUSD","direction":"BUY","amount":-24.51,"rr":2.5,"duration":10240},{"id":520953974,"date":"2026-03-13","symbol":"GBPUSD","direction":"SELL","amount":0.96,"rr":2.0,"duration":1886},{"id":520953936,"date":"2026-03-13","symbol":"USDJPY","direction":"SELL","amount":-1.34,"rr":2.0,"duration":5},{"id":520805818,"date":"2026-03-12","symbol":"USDJPY","direction":"SELL","amount":-31.83,"rr":1.7,"duration":5118},{"id":520339084,"date":"2026-03-12","symbol":"XAUUSD","direction":"BUY","amount":6.69,"rr":2.4,"duration":15376},{"id":520031710,"date":"2026-03-12","symbol":"XAUUSD","direction":"SELL","amount":8.29,"rr":2.7,"duration":50329},{"id":519833824,"date":"2026-03-11","symbol":"GBPUSD","direction":"SELL","amount":-27.9,"rr":2.6,"duration":3542},{"id":518763951,"date":"2026-03-11","symbol":"XAUUSD","direction":"BUY","amount":17.64,"rr":5.0,"duration":119273},{"id":517162826,"date":"2026-03-06","symbol":"GBPUSD","direction":"BUY","amount":-6.3,"rr":2.2,"duration":25410},{"id":516790530,"date":"2026-03-06","symbol":"XAUUSD","direction":"SELL","amount":2.82,"rr":5.0,"duration":43627},{"id":513990885,"date":"2026-03-02","symbol":"USDJPY","direction":"BUY","amount":59.17,"rr":5.0,"duration":15949},{"id":512802489,"date":"2026-02-27","symbol":"XAUUSD","direction":"BUY","amount":-17.57,"rr":5.0,"duration":29222},{"id":511820582,"date":"2026-02-26","symbol":"GBPUSD","direction":"BUY","amount":1.86,"rr":5.0,"duration":57797},{"id":511431400,"date":"2026-02-25","symbol":"USDJPY","direction":"BUY","amount":66.35,"rr":4.8,"duration":10526},{"id":510717298,"date":"2026-02-24","symbol":"NAS100","direction":"SELL","amount":-8.4,"rr":0.5,"duration":11760},{"id":510556609,"date":"2026-02-24","symbol":"GBPUSD","direction":"SELL","amount":-5.4,"rr":2.2,"duration":35434},{"id":510352989,"date":"2026-02-24","symbol":"NAS100","direction":"SELL","amount":-13.35,"rr":2.1,"duration":35552},{"id":509032781,"date":"2026-02-20","symbol":"XAUUSD","direction":"BUY","amount":5.09,"rr":2.8,"duration":17534},{"id":507553179,"date":"2026-02-18","symbol":"USDJPY","direction":"BUY","amount":49.27,"rr":5.0,"duration":49744},{"id":507362031,"date":"2026-02-17","symbol":"USDJPY","direction":"BUY","amount":-39.59,"rr":1.0,"duration":12031},{"id":506990353,"date":"2026-02-17","symbol":"USDJPY","direction":"SELL","amount":-39.27,"rr":2.1,"duration":16470},{"id":506627416,"date":"2026-02-17","symbol":"XAUUSD","direction":"SELL","amount":102.34,"rr":5.0,"duration":48883},{"id":506521065,"date":"2026-02-17","symbol":"EURUSD","direction":"SELL","amount":9.96,"rr":5.0,"duration":71487},{"id":506452026,"date":"2026-02-16","symbol":"GBPUSD","direction":"BUY","amount":-3.44,"rr":3.3,"duration":2706},{"id":506433646,"date":"2026-02-16","symbol":"USDJPY","direction":"BUY","amount":-0.89,"rr":0.5,"duration":1628},{"id":506369221,"date":"2026-02-16","symbol":"GBPUSD","direction":"BUY","amount":-14.08,"rr":3.8,"duration":12629},{"id":506290155,"date":"2026-02-16","symbol":"XAUUSD","direction":"SELL","amount":-39.9,"rr":2.5,"duration":14437},{"id":505547150,"date":"2026-02-13","symbol":"EURUSD","direction":"SELL","amount":0.17,"rr":2.4,"duration":19219},{"id":504036585,"date":"2026-02-11","symbol":"EURUSD","direction":"BUY","amount":-0.48,"rr":0.5,"duration":5915},{"id":503978267,"date":"2026-02-11","symbol":"XAUUSD","direction":"BUY","amount":-39.74,"rr":4.7,"duration":23014},{"id":503929125,"date":"2026-02-11","symbol":"EURUSD","direction":"BUY","amount":-1.76,"rr":2.6,"duration":5607},{"id":503851131,"date":"2026-02-11","symbol":"XAUUSD","direction":"BUY","amount":-9.23,"rr":0.5,"duration":11115},{"id":502747234,"date":"2026-02-09","symbol":"XAUUSD","direction":"BUY","amount":-0.78,"rr":5.0,"duration":30365},{"id":502266605,"date":"2026-02-09","symbol":"USDJPY","direction":"SELL","amount":1.3,"rr":5.0,"duration":23185},{"id":501687813,"date":"2026-02-09","symbol":"XAUUSD","direction":"BUY","amount":99.21,"rr":5.0,"duration":224446},{"id":501658819,"date":"2026-02-06","symbol":"USDJPY","direction":"BUY","amount":-0.03,"rr":5.0,"duration":8915},{"id":501623249,"date":"2026-02-06","symbol":"EURUSD","direction":"BUY","amount":-6.36,"rr":2.4,"duration":2189},{"id":501593199,"date":"2026-02-06","symbol":"USDJPY","direction":"BUY","amount":3.72,"rr":3.2,"duration":5470},{"id":501391807,"date":"2026-02-06","symbol":"USDJPY","direction":"SELL","amount":-29.73,"rr":2.4,"duration":25790},{"id":501319889,"date":"2026-02-06","symbol":"EURUSD","direction":"SELL","amount":-7.67,"rr":0.5,"duration":7086},{"id":500754421,"date":"2026-02-05","symbol":"XAUUSD","direction":"SELL","amount":-16.65,"rr":2.9,"duration":1258},{"id":500736306,"date":"2026-02-05","symbol":"EURUSD","direction":"SELL","amount":-7.84,"rr":2.6,"duration":1818},{"id":500311183,"date":"2026-02-05","symbol":"EURUSD","direction":"SELL","amount":0.62,"rr":5.0,"duration":55932},{"id":499738707,"date":"2026-02-04","symbol":"GBPUSD","direction":"BUY","amount":5.4,"rr":5.0,"duration":30122},{"id":499492443,"date":"2026-02-04","symbol":"GBPUSD","direction":"BUY","amount":0.35,"rr":3.0,"duration":43418},{"id":492169306,"date":"2026-01-22","symbol":"USDJPY","direction":"BUY","amount":2.52,"rr":5.0,"duration":51296},{"id":490440869,"date":"2026-01-20","symbol":"GBPUSD","direction":"BUY","amount":72.67,"rr":4.2,"duration":21705},{"id":490435491,"date":"2026-01-20","symbol":"USDJPY","direction":"BUY","amount":-29.96,"rr":2.4,"duration":450},{"id":490386395,"date":"2026-01-20","symbol":"USDJPY","direction":"BUY","amount":-33.29,"rr":3.0,"duration":4163},{"id":489264509,"date":"2026-01-16","symbol":"XAUUSD","direction":"BUY","amount":-32.52,"rr":2.6,"duration":4468},{"id":488976725,"date":"2026-01-16","symbol":"USDJPY","direction":"SELL","amount":-21.49,"rr":3.0,"duration":1766},{"id":488377434,"date":"2026-01-15","symbol":"USDJPY","direction":"BUY","amount":-29.07,"rr":3.3,"duration":957},{"id":488305510,"date":"2026-01-15","symbol":"USDJPY","direction":"BUY","amount":-24.69,"rr":2.6,"duration":1632},{"id":488207679,"date":"2026-01-15","symbol":"GBPUSD","direction":"SELL","amount":1.47,"rr":2.8,"duration":4077},{"id":486938954,"date":"2026-01-13","symbol":"GBPUSD","direction":"SELL","amount":53.89,"rr":5.0,"duration":4222},{"id":486622695,"date":"2026-01-13","symbol":"XAUUSD","direction":"BUY","amount":-20.18,"rr":2.7,"duration":2927},{"id":486494420,"date":"2026-01-13","symbol":"GBPUSD","direction":"SELL","amount":-2.61,"rr":2.2,"duration":543},{"id":486415409,"date":"2026-01-13","symbol":"XAUUSD","direction":"BUY","amount":-6.9,"rr":2.8,"duration":8547},{"id":486344222,"date":"2026-01-13","symbol":"USDJPY","direction":"BUY","amount":70.25,"rr":5.0,"duration":6462},{"id":484936606,"date":"2026-01-09","symbol":"XAUUSD","direction":"SELL","amount":-10.9,"rr":2.7,"duration":2220},{"id":484817787,"date":"2026-01-09","symbol":"XAUUSD","direction":"SELL","amount":-24.96,"rr":1.0,"duration":1530},{"id":484793628,"date":"2026-01-09","symbol":"GBPUSD","direction":"SELL","amount":14.2,"rr":5.0,"duration":17780},{"id":484793020,"date":"2026-01-09","symbol":"XAUUSD","direction":"BUY","amount":-23.97,"rr":2.5,"duration":2151},{"id":484750083,"date":"2026-01-09","symbol":"XAUUSD","direction":"BUY","amount":-23.95,"rr":5.0,"duration":3581},{"id":484692180,"date":"2026-01-09","symbol":"XAUUSD","direction":"BUY","amount":-21.9,"rr":3.0,"duration":1234},{"id":484671884,"date":"2026-01-09","symbol":"NAS100","direction":"SELL","amount":2.3,"rr":5.0,"duration":3294},{"id":484653312,"date":"2026-01-09","symbol":"XAUUSD","direction":"BUY","amount":-25.85,"rr":2.6,"duration":472},{"id":483959922,"date":"2026-01-08","symbol":"XAUUSD","direction":"SELL","amount":1.05,"rr":5.0,"duration":2280},{"id":483760688,"date":"2026-01-08","symbol":"USDJPY","direction":"BUY","amount":-27.75,"rr":4.1,"duration":6354},{"id":482972606,"date":"2026-01-07","symbol":"USDJPY","direction":"SELL","amount":4.59,"rr":5.0,"duration":16838},{"id":479196017,"date":"2025-12-30","symbol":"GBPUSD","direction":"BUY","amount":0.9,"rr":5.0,"duration":23756},{"id":478784456,"date":"2025-12-29","symbol":"GBPUSD","direction":"SELL","amount":-24.08,"rr":2.1,"duration":4348},{"id":475555006,"date":"2025-12-19","symbol":"GBPUSD","direction":"SELL","amount":1.2,"rr":5.0,"duration":8739},{"id":474614796,"date":"2025-12-17","symbol":"XAUUSD","direction":"BUY","amount":61.02,"rr":5.0,"duration":2748},{"id":474298224,"date":"2025-12-17","symbol":"USDJPY","direction":"SELL","amount":-28.58,"rr":2.6,"duration":5208},{"id":473217581,"date":"2025-12-15","symbol":"GBPUSD","direction":"BUY","amount":28.8,"rr":5.0,"duration":11006},{"id":473164861,"date":"2025-12-15","symbol":"GBPUSD","direction":"BUY","amount":38.6,"rr":5.0,"duration":17596},{"id":473121999,"date":"2025-12-15","symbol":"GBPUSD","direction":"SELL","amount":-16.0,"rr":2.7,"duration":5365},{"id":473099662,"date":"2025-12-15","symbol":"GBPUSD","direction":"SELL","amount":0.6,"rr":2.6,"duration":985},{"id":473066695,"date":"2025-12-15","symbol":"GBPUSD","direction":"BUY","amount":-28.6,"rr":2.9,"duration":5621},{"id":472429349,"date":"2025-12-12","symbol":"XAUUSD","direction":"BUY","amount":65.92,"rr":5.0,"duration":9653},{"id":471902726,"date":"2025-12-11","symbol":"XAUUSD","direction":"BUY","amount":-25.54,"rr":4.2,"duration":2682},{"id":471887679,"date":"2025-12-11","symbol":"XAUUSD","direction":"SELL","amount":-16.98,"rr":3.6,"duration":982},{"id":471841982,"date":"2025-12-11","symbol":"XAUUSD","direction":"BUY","amount":-16.48,"rr":3.8,"duration":4792},{"id":471073124,"date":"2025-12-10","symbol":"GBPUSD","direction":"BUY","amount":8.96,"rr":5.0,"duration":7051},{"id":471011119,"date":"2025-12-10","symbol":"XAUUSD","direction":"BUY","amount":0.78,"rr":4.5,"duration":4253},{"id":470678124,"date":"2025-12-09","symbol":"XAUUSD","direction":"BUY","amount":-14.66,"rr":3.7,"duration":2019},{"id":470347421,"date":"2025-12-09","symbol":"GBPUSD","direction":"BUY","amount":0.56,"rr":5.0,"duration":21215},{"id":470338549,"date":"2025-12-09","symbol":"XAUUSD","direction":"SELL","amount":-21.53,"rr":2.2,"duration":996},{"id":469941589,"date":"2025-12-08","symbol":"XAUUSD","direction":"SELL","amount":2.41,"rr":2.6,"duration":2697},{"id":469891702,"date":"2025-12-08","symbol":"XAUUSD","direction":"SELL","amount":-2.57,"rr":2.6,"duration":968},{"id":469440688,"date":"2025-12-05","symbol":"XAUUSD","direction":"BUY","amount":1.18,"rr":2.0,"duration":5},{"id":468308686,"date":"2025-12-04","symbol":"XAUUSD","direction":"SELL","amount":-10.28,"rr":4.3,"duration":718},{"id":468274624,"date":"2025-12-04","symbol":"XAUUSD","direction":"SELL","amount":-4.52,"rr":3.6,"duration":1247},{"id":468260413,"date":"2025-12-04","symbol":"XAUUSD","direction":"SELL","amount":18.55,"rr":5.0,"duration":2436},{"id":468250899,"date":"2025-12-04","symbol":"XAUUSD","direction":"SELL","amount":3.7,"rr":5.0,"duration":1717},{"id":468225038,"date":"2025-12-04","symbol":"XAUUSD","direction":"BUY","amount":-7.26,"rr":5.0,"duration":1926},{"id":468221483,"date":"2025-12-04","symbol":"XAUUSD","direction":"BUY","amount":-14.32,"rr":3.6,"duration":2560},{"id":467604091,"date":"2025-12-03","symbol":"USDJPY","direction":"SELL","amount":-0.05,"rr":5.0,"duration":4503},{"id":467232865,"date":"2025-12-02","symbol":"USDJPY","direction":"SELL","amount":-17.1,"rr":2.6,"duration":320},{"id":466972512,"date":"2025-12-02","symbol":"GBPUSD","direction":"SELL","amount":-24.84,"rr":2.4,"duration":293},{"id":466886042,"date":"2025-12-02","symbol":"GBPUSD","direction":"SELL","amount":-9.68,"rr":2.7,"duration":496},{"id":466774708,"date":"2025-12-02","symbol":"USDJPY","direction":"BUY","amount":5.85,"rr":5.0,"duration":1848},{"id":466664096,"date":"2025-12-02","symbol":"EURUSD","direction":"SELL","amount":-2.8,"rr":3.9,"duration":1629},{"id":466663991,"date":"2025-12-02","symbol":"EURUSD","direction":"SELL","amount":-2.24,"rr":4.4,"duration":1661},{"id":465310086,"date":"2025-11-28","symbol":"XAUUSD","direction":"BUY","amount":-1.76,"rr":2.2,"duration":263},{"id":464003052,"date":"2025-11-26","symbol":"GBPUSD","direction":"BUY","amount":38.85,"rr":5.0,"duration":6274},{"id":463610711,"date":"2025-11-25","symbol":"XAUUSD","direction":"BUY","amount":-4.85,"rr":3.1,"duration":2578},{"id":463395466,"date":"2025-11-25","symbol":"USDJPY","direction":"SELL","amount":9.33,"rr":5.0,"duration":2423},{"id":463356262,"date":"2025-11-25","symbol":"NAS100","direction":"BUY","amount":-15.36,"rr":2.8,"duration":428},{"id":462722811,"date":"2025-11-24","symbol":"USDJPY","direction":"BUY","amount":49.86,"rr":5.0,"duration":6016},{"id":461262394,"date":"2025-11-20","symbol":"XAUUSD","direction":"SELL","amount":1.18,"rr":1.7,"duration":294},{"id":460575967,"date":"2025-11-19","symbol":"XAUUSD","direction":"BUY","amount":-0.22,"rr":4.8,"duration":842},{"id":460542612,"date":"2025-11-19","symbol":"XAUUSD","direction":"BUY","amount":-17.42,"rr":2.6,"duration":1232},{"id":460538809,"date":"2025-11-19","symbol":"USDJPY","direction":"BUY","amount":67.55,"rr":5.0,"duration":7549},{"id":460408599,"date":"2025-11-19","symbol":"EURUSD","direction":"SELL","amount":-11.25,"rr":2.6,"duration":1193},{"id":460402380,"date":"2025-11-19","symbol":"USDJPY","direction":"BUY","amount":-26.1,"rr":2.2,"duration":780},{"id":459002558,"date":"2025-11-17","symbol":"XAUUSD","direction":"SELL","amount":-2.04,"rr":2.1,"duration":273},{"id":458990474,"date":"2025-11-17","symbol":"XAUUSD","direction":"SELL","amount":2.78,"rr":2.1,"duration":1253}];

// Configuration & Initial State
const ACCOUNTS_CONFIG = {
  'ftmo-10k': { name: 'FTMO 10k', capital: 10000, type: 'FTMO' },
  'ftmo-100k-1': { name: 'FTMO 100k #1', capital: 100000, type: 'FTMO' },
  'ftmo-100k-2': { name: 'FTMO 100k #2', capital: 100000, type: 'FTMO' },
  'ftmo-100k-3': { name: 'FTMO 100k #3', capital: 100000, type: 'FTMO' },
  'ftmo-100k-4': { name: 'FTMO 100k #4', capital: 100000, type: 'FTMO' },
  'the5ers-5k': { name: 'The5ers 5k', capital: 5000, type: 'The5ers' },
  'challenge-ftmo-10k': { name: 'FTMO 10k', capital: 10000, type: 'FTMO' },
  'challenge-ftmo-100k-1': { name: 'FTMO 100k #1', capital: 100000, type: 'FTMO' },
  'challenge-ftmo-100k-2': { name: 'FTMO 100k #2', capital: 100000, type: 'FTMO' },
  'challenge-ftmo-100k-3': { name: 'FTMO 100k #3', capital: 100000, type: 'FTMO' },
  'challenge-ftmo-100k-4': { name: 'FTMO 100k #4', capital: 100000, type: 'FTMO' },
  'challenge-the5ers-5k': { name: 'The5ers 5k', capital: 5000, type: 'The5ers' },
  'personal-1': { name: 'Personal Acc #1', capital: 5000, type: 'Personal' },
  'personal-2': { name: 'Personal Acc #2', capital: 10000, type: 'Personal' }
};

// System current date (hardcoded to June 9, 2026 to match the user's screenshot context)
const SYSTEM_DATE = new Date();

let currentAccountId = 'challenge-ftmo-10k';
let activeView = 'forex-account'; // 'forex-account', 'stock', 'summary'
let activeCalendarDate = new Date(SYSTEM_DATE.getFullYear(), SYSTEM_DATE.getMonth(), 1); // Year/Month view state
let chartInstance = null;
let currentAccountTrades = [];
let dateRangeStart = null; // null = no start constraint
let dateRangeEnd = null;   // null = no end constraint

// --- App Initializer ---
document.addEventListener('DOMContentLoaded', () => {
  // Setup default active states in sidebar
  document.getElementById('forex-sub').style.maxHeight = '1000px';
  if (document.getElementById('challenge-nested')) document.getElementById('challenge-nested').style.maxHeight = '400px';
  if (document.getElementById('tkq-nested')) document.getElementById('tkq-nested').style.maxHeight = '0px';
  
  // Restore sidebar state
  const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (sidebarCollapsed) {
    document.querySelector('.app-container').classList.add('sidebar-collapsed');
  }
  
  // Initialize stock search bar autocomplete
  initStockSearch();
  
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
    element.style.maxHeight = '1000px';
    if (trigger) trigger.classList.remove('collapsed');
  }
}

// --- Navigation actions ---
// --- Navigation actions ---
function switchAccount(accountId, breadcrumbText) {
  currentAccountId = accountId;
  activeView = 'forex-account';
  
  // Update sidebar active classes
  document.querySelectorAll('.nav-nested-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-sub-item').forEach(item => {
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
  
  // Update breadcrumb
  document.getElementById('current-breadcrumb-path').innerHTML = breadcrumbText;
  
  // Update panels visibility
  const enabledAccounts = ['challenge-ftmo-10k', 'challenge-ftmo-100k-1', 'challenge-the5ers-5k', 'ftmo-10k', 'ftmo-100k-1', 'the5ers-5k'];
  if (enabledAccounts.includes(accountId)) {
    document.getElementById('view-forex-account').style.display = 'flex';
    document.getElementById('view-stock').style.display = 'none';
    document.getElementById('view-summary').style.display = 'none';
    document.getElementById('view-coming-soon').style.display = 'none';
    
    // Show top header on workspace view
    document.querySelector('.content-header').style.display = 'flex';
    
    const breadcrumbContainer = document.getElementById('header-breadcrumbs-container');
    if (breadcrumbContainer) breadcrumbContainer.style.display = 'flex';
    
    const stockSearch = document.getElementById('header-stock-search');
    if (stockSearch) stockSearch.style.display = 'none';
    
    const filterTrigger = document.getElementById('filter-dropdown-trigger');
    if (filterTrigger) filterTrigger.style.display = '';
    
    if (accountId === 'the5ers-5k' || accountId === 'challenge-the5ers-5k') {
      showTokenModal();
    } else {
      // Re-render FTMO
      renderApp();
      showToast(`Switched to account ${ACCOUNTS_CONFIG[accountId].name}`, 'info');
    }
  } else {
    document.getElementById('view-forex-account').style.display = 'none';
    document.getElementById('view-stock').style.display = 'none';
    document.getElementById('view-summary').style.display = 'none';
    document.getElementById('view-coming-soon').style.display = 'flex';
    
    const breadcrumbContainer = document.getElementById('header-breadcrumbs-container');
    if (breadcrumbContainer) breadcrumbContainer.style.display = 'flex';
    
    const stockSearch = document.getElementById('header-stock-search');
    if (stockSearch) stockSearch.style.display = 'none';
    
    // Hide top header on Coming Soon view
    document.querySelector('.content-header').style.display = 'none';
    
    // Restart letter animation
    restartComingSoonAnimation();
    
    showToast(`Account ${ACCOUNTS_CONFIG[accountId].name} is coming soon`, 'info');
  }
}

// Switch main section
function switchMainView(viewType, viewName) {
  activeView = viewType;
  
  // Update sidebar classes
  document.querySelectorAll('.nav-nested-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-sub-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  if (viewType === 'stock') {
    document.getElementById('nav-stock').classList.add('active');
  } else if (viewType === 'summary') {
    document.getElementById('nav-summary').classList.add('active');
  }
  
  document.getElementById('view-forex-account').style.display = 'none';
  document.getElementById('view-stock').style.display = 'none';
  document.getElementById('view-summary').style.display = 'none';
  document.getElementById('view-coming-soon').style.display = 'none';
  
  const stockSearch = document.getElementById('header-stock-search');
  const filterTrigger = document.getElementById('filter-dropdown-trigger');
  const breadcrumbContainer = document.getElementById('header-breadcrumbs-container');
  
  if (viewType === 'stock') {
    document.getElementById('view-stock').style.display = 'flex';
    document.querySelector('.content-header').style.display = 'flex';
    if (stockSearch) stockSearch.style.display = 'flex';
    if (filterTrigger) filterTrigger.style.display = 'none';
    if (breadcrumbContainer) breadcrumbContainer.style.display = 'none';
    switchStockSidebarTab('backtest', 'Stocks / Backtest');
  } else if (viewType === 'summary') {
    document.getElementById('view-summary').style.display = 'block';
    document.querySelector('.content-header').style.display = 'flex';
    if (stockSearch) stockSearch.style.display = 'none';
    if (filterTrigger) filterTrigger.style.display = '';
    if (breadcrumbContainer) breadcrumbContainer.style.display = 'flex';
    renderSummaryView();
  } else {
    document.getElementById('view-coming-soon').style.display = 'flex';
    document.querySelector('.content-header').style.display = 'none';
    if (stockSearch) stockSearch.style.display = 'none';
    if (filterTrigger) filterTrigger.style.display = '';
    if (breadcrumbContainer) breadcrumbContainer.style.display = 'flex';
    restartComingSoonAnimation();
  }
  
  document.getElementById('current-breadcrumb-path').innerText = viewName;
}

// Switch Stock sidebar sub-tabs
function switchStockSidebarTab(subTabName, breadcrumbText) {
  activeView = 'stock';
  
  // Update sidebar active classes
  document.querySelectorAll('.nav-nested-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-sub-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Set main nav Stocks active and expand sub-menu
  const navStock = document.getElementById('nav-stock');
  if (navStock) navStock.classList.add('active');
  
  const stockSub = document.getElementById('stock-sub');
  if (stockSub) stockSub.style.maxHeight = '400px';
  
  const backtestSub = document.getElementById('nav-stock-backtest');
  if (backtestSub) backtestSub.classList.add('active');
  
  // Show stock panels
  document.getElementById('view-forex-account').style.display = 'none';
  document.getElementById('view-stock').style.display = 'flex';
  document.getElementById('view-summary').style.display = 'none';
  document.getElementById('view-coming-soon').style.display = 'none';
  
  // Show header and configure elements
  document.querySelector('.content-header').style.display = 'flex';
  document.getElementById('current-breadcrumb-path').innerText = breadcrumbText || 'Stocks / Backtest';
  
  const stockSearch = document.getElementById('header-stock-search');
  if (stockSearch) stockSearch.style.display = 'flex';
  
  const filterTrigger = document.getElementById('filter-dropdown-trigger');
  if (filterTrigger) filterTrigger.style.display = 'none';
  
  const breadcrumbContainer = document.getElementById('header-breadcrumbs-container');
  if (breadcrumbContainer) breadcrumbContainer.style.display = 'none';
  
  // Auto-run backtest
  setTimeout(() => {
    runStockBacktest();
  }, 50);
}

// --- Restart Coming Soon Animation ---
function restartComingSoonAnimation() {
  const content = document.querySelector('.luxury-coming-soon-content');
  if (!content) return;
  // Clone and replace to restart all CSS animations reliably
  const clone = content.cloneNode(true);
  content.parentNode.replaceChild(clone, content);
}

// --- Canh bao nguon du lieu (chi ghi ra console, khong doi giao dien) ---
function warnIfNotFromDatabase(accountId, source) {
  if (!source || source === 'db') return;
  const label = {
    excel: "doc truc tiep tu file Excel (database chua duoc cap nhat)",
    mock:  "DU LIEU MAU, khong phai giao dich that",
    empty: "khong co du lieu"
  }[source] || source;
  console.warn(`[Nguon du lieu] '${accountId}': ${label}.`);
}

// --- Data Render Functions ---
async function renderApp() {
  const enabledAccounts = ['challenge-ftmo-10k', 'challenge-ftmo-100k-1', 'challenge-the5ers-5k', 'ftmo-10k', 'ftmo-100k-1', 'the5ers-5k'];
  if (activeView !== 'forex-account' || !enabledAccounts.includes(currentAccountId)) return;
  
  try {
    let trades = [];
    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch(`/api/trades?account=${currentAccountId}`);
        if (res.ok) {
          trades = await res.json();
          warnIfNotFromDatabase(currentAccountId, res.headers.get('X-Data-Source'));
        } else {
          console.warn(`API tra ve ${res.status} cho '${currentAccountId}'. Dang dung du lieu nhung san trong app.js.`);
          trades = getTradesForAccount(currentAccountId);
        }
      } catch (e) {
        console.warn("Could not fetch trades from server API, falling back to static embedded data:", e);
        trades = getTradesForAccount(currentAccountId);
      }
    } else {
      trades = getTradesForAccount(currentAccountId);
    }
    
    currentAccountTrades = trades;
    
    // Init date range display
    initDateRangePanel();
    
    // Render the filtered state
    renderAppFiltered();
  } catch (err) {
    console.error("Error loading trade data:", err);
    showToast("Lỗi tải dữ liệu giao dịch!", "error");
  }
}

// --- Date Range Picker Logic ---

function initDateRangePanel() {
  // Set default max for end to today
  const today = SYSTEM_DATE.toISOString().split('T')[0];
  const startEl = document.getElementById('date-range-start');
  const endEl = document.getElementById('date-range-end');
  if (startEl) startEl.max = today;
  if (endEl) { endEl.max = today; endEl.value = today; }
  updateDateRangeDisplay();
}

function toggleFilterDropdown(event) {
  event.stopPropagation();
  const menu = document.getElementById('filter-dropdown-menu');
  const trigger = document.getElementById('filter-dropdown-trigger');
  if (menu) {
    const isOpen = menu.classList.toggle('show');
    if (trigger) trigger.classList.toggle('open', isOpen);
  }
}

// Close panel on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('filter-dropdown-menu');
  const trigger = document.getElementById('filter-dropdown-trigger');
  if (menu && !menu.contains(e.target) && trigger && !trigger.contains(e.target)) {
    menu.classList.remove('show');
    if (trigger) trigger.classList.remove('open');
  }
});

function applyDatePreset(preset, event) {
  event.stopPropagation();
  const today = new Date(SYSTEM_DATE);
  const todayStr = today.toISOString().split('T')[0];
  const startEl = document.getElementById('date-range-start');
  const endEl = document.getElementById('date-range-end');
  
  // Remove active from all presets
  document.querySelectorAll('.date-preset-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  
  if (preset === 'all') {
    dateRangeStart = null;
    dateRangeEnd = null;
    if (startEl) startEl.value = '';
    if (endEl) endEl.value = todayStr;
  } else {
    if (endEl) endEl.value = todayStr;
    dateRangeEnd = today;
    const start = new Date(today);
    if (preset === '1m') start.setMonth(start.getMonth() - 1);
    else if (preset === '3m') start.setMonth(start.getMonth() - 3);
    else if (preset === '6m') start.setMonth(start.getMonth() - 6);
    else if (preset === 'ytd') start.setMonth(0, 1);
    dateRangeStart = start;
    if (startEl) startEl.value = start.toISOString().split('T')[0];
  }
  
  updateDateRangeDisplay();
  renderAppFiltered();
}

function onDateRangeChange() {
  const startEl = document.getElementById('date-range-start');
  const endEl = document.getElementById('date-range-end');
  dateRangeStart = startEl && startEl.value ? new Date(startEl.value + 'T00:00:00') : null;
  dateRangeEnd = endEl && endEl.value ? new Date(endEl.value + 'T23:59:59') : null;
  
  // Clear preset active states when manually selecting dates
  document.querySelectorAll('.date-preset-btn').forEach(b => b.classList.remove('active'));
  
  updateDateRangeDisplay();
  renderAppFiltered();
}

function updateDateRangeDisplay() {
  const label = document.getElementById('date-range-display');
  if (!label) return;
  if (!dateRangeStart && !dateRangeEnd) {
    label.textContent = 'All Time';
    return;
  }
  const fmt = (d) => d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '...';
  if (!dateRangeStart) {
    label.textContent = `Until ${fmt(dateRangeEnd)}`;
  } else if (!dateRangeEnd) {
    label.textContent = `From ${fmt(dateRangeStart)}`;
  } else {
    label.textContent = `${fmt(dateRangeStart)} - ${fmt(dateRangeEnd)}`;
  }
}

function renderAppFiltered() {
  if (activeView !== 'forex-account') return;
  const config = ACCOUNTS_CONFIG[currentAccountId];
  
  // Filter trades by date range
  let filteredTrades = currentAccountTrades;
  if (dateRangeStart || dateRangeEnd) {
    filteredTrades = currentAccountTrades.filter(t => {
      if (!t.date) return false;
      const d = new Date(t.date);
      if (dateRangeStart && d < dateRangeStart) return false;
      if (dateRangeEnd && d > dateRangeEnd) return false;
      return true;
    });
  }
  
  // Calculate KPIs for filtered trades
  const stats = calculateKPIs(config.capital, filteredTrades);
  
  // Render KPI values (updates risk card and performance metrics table)
  updateKPIDom(stats);
  
  // Render Capital Growth / Drawdown Chart for filtered trades
  renderCapitalChart(filteredTrades);
  
  // Render Calendar (remains separate, showing all trades for the active calendar month)
  renderCalendar(currentAccountTrades);
  
  // Render Day-of-Week & Duration Cycle Analysis
  renderCycleAnalysis(filteredTrades);
}

function renderCycleAnalysis(trades) {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const parseDayOfWeek = (timeStr) => {
    if (!timeStr) return null;
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return null;
    const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
    if (day >= 1 && day <= 5) return day - 1; // 0..4 for Mon..Fri
    return null;
  };

  const entryStats = [0, 1, 2, 3, 4].map(() => ({ count: 0, wins: 0, profit: 0 }));
  const exitStats = [0, 1, 2, 3, 4].map(() => ({ count: 0, wins: 0, profit: 0 }));
  
  const matrix = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => ({ count: 0, wins: 0, profit: 0 }))
  );

  const durationBuckets = [
    { label: 'Intraday (< 24h)', minSec: 0, maxSec: 86400, count: 0, wins: 0, profit: 0 },
    { label: '1 Day (24h - 48h)', minSec: 86400, maxSec: 172800, count: 0, wins: 0, profit: 0 },
    { label: '2 Days (48h - 72h)', minSec: 172800, maxSec: 259200, count: 0, wins: 0, profit: 0 },
    { label: '3+ Days (> 72h)', minSec: 259200, maxSec: Infinity, count: 0, wins: 0, profit: 0 }
  ];

  trades.forEach(t => {
    const entryDayIdx = parseDayOfWeek(t.open_time || t.date);
    const exitDayIdx = parseDayOfWeek(t.close_time || t.date);
    const pnl = t.amount || 0;
    const isWin = pnl > 0;
    const durSec = t.duration || 0;

    if (entryDayIdx !== null) {
      entryStats[entryDayIdx].count++;
      if (isWin) entryStats[entryDayIdx].wins++;
      entryStats[entryDayIdx].profit += pnl;
    }

    if (exitDayIdx !== null) {
      exitStats[exitDayIdx].count++;
      if (isWin) exitStats[exitDayIdx].wins++;
      exitStats[exitDayIdx].profit += pnl;
    }

    if (entryDayIdx !== null && exitDayIdx !== null) {
      matrix[entryDayIdx][exitDayIdx].count++;
      if (isWin) matrix[entryDayIdx][exitDayIdx].wins++;
      matrix[entryDayIdx][exitDayIdx].profit += pnl;
    }

    durationBuckets.forEach(b => {
      if (durSec >= b.minSec && durSec < b.maxSec) {
        b.count++;
        if (isWin) b.wins++;
        b.profit += pnl;
      }
    });
  });

  const entryListEl = document.getElementById('entry-day-list');
  if (entryListEl) {
    entryListEl.innerHTML = dayNames.map((day, idx) => {
      const s = entryStats[idx];
      const winRate = s.count > 0 ? (s.wins / s.count) * 100 : 0;
      const profitClass = s.profit >= 0 ? 'color: #059669;' : 'color: #e11d48;';
      const profitSign = s.profit >= 0 ? '+' : '';
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: rgba(0,0,0,0.02); border-radius: 6px; font-size: 0.78rem;">
          <div style="font-weight: 600; width: 80px;">${day}</div>
          <div style="color: var(--text-muted); text-align: center; width: 60px;">${s.count} trades</div>
          <div style="font-weight: 600; width: 70px; text-align: right;">${winRate.toFixed(0)}% WR</div>
          <div style="font-weight: 700; width: 90px; text-align: right; ${profitClass}">${profitSign}${formatCurrency(s.profit)}</div>
        </div>
      `;
    }).join('');
  }

  const exitListEl = document.getElementById('exit-day-list');
  if (exitListEl) {
    exitListEl.innerHTML = dayNames.map((day, idx) => {
      const s = exitStats[idx];
      const winRate = s.count > 0 ? (s.wins / s.count) * 100 : 0;
      const profitClass = s.profit >= 0 ? 'color: #059669;' : 'color: #e11d48;';
      const profitSign = s.profit >= 0 ? '+' : '';
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: rgba(0,0,0,0.02); border-radius: 6px; font-size: 0.78rem;">
          <div style="font-weight: 600; width: 80px;">${day}</div>
          <div style="color: var(--text-muted); text-align: center; width: 60px;">${s.count} trades</div>
          <div style="font-weight: 600; width: 70px; text-align: right;">${winRate.toFixed(0)}% WR</div>
          <div style="font-weight: 700; width: 90px; text-align: right; ${profitClass}">${profitSign}${formatCurrency(s.profit)}</div>
        </div>
      `;
    }).join('');
  }

  const bucketListEl = document.getElementById('duration-bucket-list');
  if (bucketListEl) {
    bucketListEl.innerHTML = durationBuckets.map(b => {
      const winRate = b.count > 0 ? (b.wins / b.count) * 100 : 0;
      const profitClass = b.profit >= 0 ? 'color: #059669;' : 'color: #e11d48;';
      const profitSign = b.profit >= 0 ? '+' : '';
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: rgba(0,0,0,0.02); border-radius: 6px; font-size: 0.78rem;">
          <div style="font-weight: 600; width: 110px;">${b.label}</div>
          <div style="color: var(--text-muted); text-align: center; width: 50px;">${b.count} t</div>
          <div style="font-weight: 600; width: 65px; text-align: right;">${winRate.toFixed(0)}% WR</div>
          <div style="font-weight: 700; width: 85px; text-align: right; ${profitClass}">${profitSign}${formatCurrency(b.profit)}</div>
        </div>
      `;
    }).join('');
  }

  const matrixBodyEl = document.getElementById('entry-exit-matrix-body');
  if (matrixBodyEl) {
    matrixBodyEl.innerHTML = dayNames.map((eDay, eIdx) => {
      const cellsHtml = dayNames.map((xDay, xIdx) => {
        const cell = matrix[eIdx][xIdx];
        if (cell.count === 0) {
          return `
            <td style="padding: 10px; background: rgba(100, 116, 139, 0.04); border-radius: 6px; color: var(--text-muted); font-size: 0.75rem;">
              -
            </td>
          `;
        }
        const winRate = (cell.wins / cell.count) * 100;
        const isPositive = cell.profit >= 0;
        const bgStyle = isPositive
          ? 'background: rgba(5, 150, 105, 0.12); border: 1px solid rgba(5, 150, 105, 0.3);'
          : 'background: rgba(225, 29, 72, 0.12); border: 1px solid rgba(225, 29, 72, 0.3);';
        const textColor = isPositive ? '#047857' : '#be123c';
        const sign = isPositive ? '+' : '';

        return `
          <td style="padding: 10px 6px; ${bgStyle} border-radius: 6px; transition: transform 0.2s ease;">
            <div style="font-size: 0.85rem; font-weight: 800; color: ${textColor};">${sign}${formatCurrency(cell.profit)}</div>
            <div style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600; margin-top: 2px;">
              ${winRate.toFixed(0)}% WR <span style="opacity: 0.7;">(${cell.count})</span>
            </div>
          </td>
        `;
      }).join('');

      return `
        <tr>
          <td style="text-align: left; font-weight: 700; font-size: 0.8rem; padding: 10px; color: var(--text-primary);">${eDay}</td>
          ${cellsHtml}
        </tr>
      `;
    }).join('');
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
  
  // 1. Recovery Factor
  const recoveryFactor = maxDDAmount > 0 ? profit / maxDDAmount : 0;

  // 2. Kelly Criterion (%)
  const winRateDec = winrate / 100;
  const winLossRatio = avgLoss > 0 ? avgWin / avgLoss : 0;
  let kelly = 0;
  if (winLossRatio > 0) {
    kelly = winRateDec - (1 - winRateDec) / winLossRatio;
  }
  const kellyPercent = kelly * 100;

  // 3. Sharpe Ratio (Trade-based)
  const avgTradeProfit = expectancy;
  let varianceSum = 0;
  trades.forEach(t => {
    varianceSum += Math.pow(t.amount - avgTradeProfit, 2);
  });
  const variance = totalTrades > 1 ? varianceSum / (totalTrades - 1) : 0;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev > 0 ? avgTradeProfit / stdDev : 0;

  // 4. Long / Short Win Rate
  let longTradesCount = 0;
  let longWins = 0;
  let shortTradesCount = 0;
  let shortWins = 0;
  trades.forEach(t => {
    const isLong = (t.direction.toUpperCase() === 'BUY');
    if (isLong) {
      longTradesCount++;
      if (t.amount > 0) longWins++;
    } else {
      shortTradesCount++;
      if (t.amount > 0) shortWins++;
    }
  });
  const longWinRate = longTradesCount > 0 ? (longWins / longTradesCount) * 100 : 0;
  const shortWinRate = shortTradesCount > 0 ? (shortWins / shortTradesCount) * 100 : 0;
  const longPercent = totalTrades > 0 ? (longTradesCount / totalTrades) * 100 : 0;
  const shortPercent = totalTrades > 0 ? (shortTradesCount / totalTrades) * 100 : 0;

  // 5. Win / Loss Hold Ratio
  let winDurationSum = 0;
  let winDurationCount = 0;
  let lossDurationSum = 0;
  let lossDurationCount = 0;
  trades.forEach(t => {
    if (t.amount > 0) {
      winDurationSum += t.duration || 0;
      winDurationCount++;
    } else if (t.amount < 0) {
      lossDurationSum += t.duration || 0;
      lossDurationCount++;
    }
  });
  const avgWinDuration = winDurationCount > 0 ? winDurationSum / winDurationCount : 0;
  const avgLossDuration = lossDurationCount > 0 ? lossDurationSum / lossDurationCount : 0;
  const holdRatio = avgLossDuration > 0 ? avgWinDuration / avgLossDuration : 0;

  // 6. Profit Concentration Ratio
  let maxWin = 0;
  trades.forEach(t => {
    if (t.amount > maxWin) {
      maxWin = t.amount;
    }
  });
  const concentration = profit > 0 ? (maxWin / profit) * 100 : 0;

  // 7. System Quality Number (SQN by Van Tharp)
  let sqnScore = 0;
  let sqnText = 'N/A';
  let sqnRating = '';
  if (totalTrades > 1 && avgLoss > 0) {
    const rMultiples = trades.map(t => t.amount / avgLoss);
    const meanR = rMultiples.reduce((acc, val) => acc + val, 0) / totalTrades;
    const rVariance = rMultiples.reduce((acc, val) => acc + Math.pow(val - meanR, 2), 0) / (totalTrades - 1);
    const rStdDev = Math.sqrt(rVariance);
    
    if (rStdDev > 0) {
      const N_capped = Math.min(totalTrades, 100);
      sqnScore = Math.sqrt(N_capped) * (meanR / rStdDev);
      
      if (sqnScore >= 5.0) sqnRating = 'Holy Grail';
      else if (sqnScore >= 3.0) sqnRating = 'Superb';
      else if (sqnScore >= 2.5) sqnRating = 'Excellent';
      else if (sqnScore >= 2.0) sqnRating = 'Good';
      else if (sqnScore >= 1.6) sqnRating = 'Average';
      else sqnRating = 'Poor';
      
      sqnText = `${sqnScore.toFixed(2)} (${sqnRating})`;
    }
  }

  // Group trades by date for daily profit/loss calculation (Max Daily Loss)
  const dailyProfits = {};
  trades.forEach(t => {
    if (t.date) {
      dailyProfits[t.date] = (dailyProfits[t.date] || 0) + t.amount;
    }
  });
  
  let maxDailyLoss = 0; // Worst negative daily net profit
  Object.values(dailyProfits).forEach(val => {
    if (val < maxDailyLoss) {
      maxDailyLoss = val;
    }
  });

  // Max Loss compared to Initial Capital
  let lowestEquity = initialCapital;
  let currentEquity = initialCapital;
  sortedTrades.forEach(t => {
    currentEquity += t.amount;
    if (currentEquity < lowestEquity) {
      lowestEquity = currentEquity;
    }
  });
  const maxLossFromInitial = initialCapital - lowestEquity; // positive drop below initialCapital
  const maxLossFromInitialPct = (maxLossFromInitial / initialCapital) * 100;

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
    maxLossesStreak,
    recoveryFactor,
    kellyPercent,
    sharpeRatio,
    sqnScore,
    sqnText,
    sqnRating,
    longWinRate,
    shortWinRate,
    holdRatio,
    concentration,
    longTradesCount,
    shortTradesCount,
    longPercent,
    shortPercent,
    maxDailyLoss,
    maxLossFromInitial,
    maxLossFromInitialPct
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

  // 18. Recovery Factor
  document.getElementById('kpi-recovery-factor').innerText = stats.totalTrades > 0 && stats.maxDDAmount > 0 
    ? stats.recoveryFactor.toFixed(2) 
    : 'N/A';

  // 19. Kelly Criterion
  document.getElementById('kpi-kelly').innerText = stats.totalTrades > 0 
    ? (stats.kellyPercent >= 0 ? '+' : '') + stats.kellyPercent.toFixed(1) + '%' 
    : 'N/A';

  // 20. Sharpe Ratio
  document.getElementById('kpi-sharpe').innerText = stats.totalTrades > 1 && stats.sharpeRatio > 0 
    ? stats.sharpeRatio.toFixed(2) 
    : 'N/A';

  // 20b. SQN (System Quality Number)
  const sqnEl = document.getElementById('kpi-sqn');
  if (sqnEl) {
    sqnEl.innerText = stats.sqnText || 'N/A';
  }

  // 21. Long / Short Win Rate
  document.getElementById('kpi-long-short-wr').innerText = `${stats.longWinRate.toFixed(0)}% / ${stats.shortWinRate.toFixed(0)}%`;

  // 22. Win / Loss Hold Ratio
  document.getElementById('kpi-hold-ratio').innerText = stats.holdRatio > 0 
    ? stats.holdRatio.toFixed(2) + 'x' 
    : 'N/A';

  // 23. Profit Concentration
  document.getElementById('kpi-concentration').innerText = stats.profit > 0 
    ? stats.concentration.toFixed(1) + '%' 
    : '0.0%';

  // Update Risk KPIs
  const initialCapital = stats.initialCapital || 10000;
  
  // Update Return Card (KPI 1)
  const profitVal = stats.profit || 0;
  const returnPct = initialCapital > 0 ? (profitVal / initialCapital) * 100 : 0;
  
  const returnProfitEl = document.getElementById('risk-monthly-profit');
  if (returnProfitEl) {
    returnProfitEl.innerText = (profitVal >= 0 ? '+' : '') + formatCurrency(profitVal);
    returnProfitEl.className = 'kpi-value ' + (profitVal >= 0 ? 'positive' : 'negative');
  }
  
  const returnPercentEl = document.getElementById('risk-monthly-percent');
  if (returnPercentEl) {
    let labelSuffix = ' MoM';
    if (!dateRangeStart && !dateRangeEnd) {
      labelSuffix = ' Initial';
    }
    returnPercentEl.innerText = (profitVal >= 0 ? '+' : '') + returnPct.toFixed(1) + '%' + labelSuffix;
    returnPercentEl.className = 'kpi-badge ' + (profitVal >= 0 ? 'positive' : 'negative');
  }
  
  // 5% target is represented in the middle (50% width), meaning 10% profit fills the bar (100% width)
  const scaleMax = initialCapital * 0.10; 
  const targetRatio = scaleMax > 0 ? (Math.max(0, profitVal) / scaleMax) * 100 : 0;
  const targetWidth = Math.min(targetRatio, 100);
  
  const returnBarEl = document.getElementById('risk-monthly-bar');
  if (returnBarEl) {
    returnBarEl.style.width = targetWidth + '%';
    returnBarEl.style.backgroundColor = '#059669'; // Green for profit progress
  }
  
  const returnRangeLabelEl = document.getElementById('risk-monthly-range-label');
  if (returnRangeLabelEl) {
    if (!dateRangeStart && !dateRangeEnd) {
      returnRangeLabelEl.innerText = 'All Time';
    } else {
      const fmtShort = (d) => d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '...';
      if (!dateRangeStart) {
        returnRangeLabelEl.innerText = `Until ${fmtShort(dateRangeEnd)}`;
      } else if (!dateRangeEnd) {
        returnRangeLabelEl.innerText = `From ${fmtShort(dateRangeStart)}`;
      } else {
        returnRangeLabelEl.innerText = `${fmtShort(dateRangeStart)} - ${fmtShort(dateRangeEnd)}`;
      }
    }
  }
  
  // 1. Max Daily Loss (3% limit)
  const displayDailyLoss = Math.abs(stats.maxDailyLoss || 0);
  const dailyLossPct = initialCapital > 0 ? (displayDailyLoss / initialCapital) * 100 : 0;
  const dailyLossLimit = initialCapital * 0.03;
  const dailyLossLimitPct = dailyLossLimit > 0 ? (displayDailyLoss / dailyLossLimit) * 100 : 0;
  const dailyLossWidth = Math.min(dailyLossLimitPct, 100);
  
  let dailyLossColor = '#059669'; // Green
  if (dailyLossLimitPct >= 80) {
    dailyLossColor = '#f87171'; // Red
  } else if (dailyLossLimitPct >= 50) {
    dailyLossColor = '#ff7a00'; // Orange
  }
  
  const dailyLossValEl = document.getElementById('risk-daily-loss');
  if (dailyLossValEl) dailyLossValEl.innerText = formatCurrency(displayDailyLoss);
  const dailyLossPctEl = document.getElementById('risk-daily-loss-pct');
  if (dailyLossPctEl) dailyLossPctEl.innerText = dailyLossPct.toFixed(1) + '%';
  const dailyLossBarEl = document.getElementById('risk-daily-loss-bar');
  if (dailyLossBarEl) {
    dailyLossBarEl.style.width = dailyLossWidth + '%';
    dailyLossBarEl.style.backgroundColor = dailyLossColor;
  }
  
  // 2. Max Loss vs Initial (10% limit)
  const maxLossFromInitial = stats.maxLossFromInitial || 0;
  const maxLossFromInitialPct = stats.maxLossFromInitialPct || 0;
  const initialDrawdownLimit = initialCapital * 0.10;
  const initialDrawdownLimitPct = initialDrawdownLimit > 0 ? (maxLossFromInitial / initialDrawdownLimit) * 100 : 0;
  const initialDrawdownWidth = Math.min(initialDrawdownLimitPct, 100);
  
  let initialDrawdownColor = '#059669'; // Green
  if (initialDrawdownLimitPct >= 80) {
    initialDrawdownColor = '#f87171'; // Red
  } else if (initialDrawdownLimitPct >= 50) {
    initialDrawdownColor = '#ff7a00'; // Orange
  }
  
  const initDDValEl = document.getElementById('risk-initial-drawdown');
  if (initDDValEl) initDDValEl.innerText = formatCurrency(maxLossFromInitial);
  const initDDPctEl = document.getElementById('risk-initial-drawdown-pct');
  if (initDDPctEl) initDDPctEl.innerText = maxLossFromInitialPct.toFixed(1) + '%';
  const initDDBarEl = document.getElementById('risk-initial-drawdown-bar');
  if (initDDBarEl) {
    initDDBarEl.style.width = initialDrawdownWidth + '%';
    initDDBarEl.style.backgroundColor = initialDrawdownColor;
  }
  
  // 3. Max Drawdown Peak (10% limit)
  const maxDDAmount = stats.maxDDAmount || 0;
  const maxDDPercent = stats.maxDDPercent || 0;
  const peakDrawdownLimitPct = (maxDDPercent / 10.0) * 100;
  const peakDrawdownWidth = Math.min(peakDrawdownLimitPct, 100);
  
  let peakDrawdownColor = '#059669'; // Green
  if (peakDrawdownLimitPct >= 80) {
    peakDrawdownColor = '#f87171'; // Red
  } else if (peakDrawdownLimitPct >= 50) {
    peakDrawdownColor = '#ff7a00'; // Orange
  }
  
  const peakDDValEl = document.getElementById('risk-peak-drawdown');
  if (peakDDValEl) peakDDValEl.innerText = formatCurrency(maxDDAmount);
  const peakDDPctEl = document.getElementById('risk-peak-drawdown-pct');
  if (peakDDPctEl) peakDDPctEl.innerText = maxDDPercent.toFixed(1) + '%';
  const peakDDBarEl = document.getElementById('risk-peak-drawdown-bar');
  if (peakDDBarEl) {
    peakDDBarEl.style.width = peakDrawdownWidth + '%';
    peakDDBarEl.style.backgroundColor = peakDrawdownColor;
  }
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
            gradient.addColorStop(zeroPos, '#f87171');
            gradient.addColorStop(1, '#f87171'); // Soft red below initialCapital
          } else if (zeroPos <= 0) {
            return '#f87171';
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
          return val >= initialCapital ? '#059669' : '#f87171';
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
            gradient.addColorStop(zeroPos + 0.01, 'rgba(248, 113, 113, 0.01)');
            gradient.addColorStop(1, 'rgba(248, 113, 113, 0.15)'); // Soft red below initialCapital
          } else if (zeroPos <= 0) {
            return 'rgba(248, 113, 113, 0.12)'; // Entirely below initialCapital
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
                if (t.duration) text += `\nDuration: ${formatDuration(t.duration)}`;
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
            },
            callback: function(value, index, ticks) {
              const total = ticks.length;
              if (index === 0 || index === total - 1) {
                return this.getLabelForValue(value);
              }
              const step = Math.ceil(total / 10);
              if (index < step / 2 || total - 1 - index < step / 2) {
                return null;
              }
              if (index % step === 0) {
                return this.getLabelForValue(value);
              }
              return null;
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
function getTradesForAccount(accId) {
  if (accId === 'challenge-ftmo-10k') {
    return typeof FTMO_10K_TRADES !== 'undefined' ? FTMO_10K_TRADES : [];
  }
  if (accId === 'challenge-the5ers-5k') {
    return typeof THE5ERS_5K_TRADES !== 'undefined' ? THE5ERS_5K_TRADES : [];
  }
  return [];
}

async function renderSummaryView() {
  const tbody = document.getElementById('summary-table-body');
  tbody.innerHTML = '';
  
  let totalCapital = 0;
  let totalBalance = 0;
  let totalProfit = 0;
  let totalTrades = 0;
  
  const accountIds = Object.keys(ACCOUNTS_CONFIG);
  const results = [];
  
  for (const accId of accountIds) {
    let trades = [];
    try {
      if (window.location.protocol !== 'file:') {
        const res = await fetch(`/api/trades?account=${accId}`);
        if (res.ok) {
          trades = await res.json();
        } else {
          trades = getTradesForAccount(accId);
        }
      } else {
        trades = getTradesForAccount(accId);
      }
    } catch (err) {
      console.warn(`Could not fetch trades for ${accId} from server, using local fallback:`, err);
      trades = getTradesForAccount(accId);
    }
    results.push({ accId, trades });
  }
  
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

function formatStockCurrency(value) {
  const currencySelect = document.getElementById('bt-currency');
  const currency = currencySelect ? currencySelect.value : 'VND';
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}

window.onStockCurrencyChange = () => {
  const currencySelect = document.getElementById('bt-currency');
  if (!currencySelect) return;
  const currency = currencySelect.value;
  const balanceInput = document.getElementById('bt-initial-balance');
  if (balanceInput) {
    if (currency === 'VND') {
      balanceInput.value = '100000000';
      balanceInput.step = '10000000';
    } else {
      balanceInput.value = '10000';
      balanceInput.step = '1000';
    }
  }
  runStockBacktest();
};

window.resetStockChartZoom = () => {
  if (stockChartInstance) {
    stockChartInstance.resetZoom();
  }
  const resetBtn = document.getElementById('btn-reset-zoom');
  if (resetBtn) resetBtn.style.display = 'none';
};

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

// === Stock Backtesting & Search Functionality ===

let AVAILABLE_TICKERS = [];

let selectedStockTicker = 'HAH';
let currentStockChartMode = 'line'; // 'line' or 'candle'
let stockChartInstance = null;
let currentStockPriceData = [];
let currentStockTrades = [];

// Initialize Ticker Autocomplete Search
function initStockSearch() {
  const suggestionsContainer = document.getElementById('stock-search-suggestions');
  if (!suggestionsContainer) return;
  
  // Fetch tickers from backend API
  fetch('/api/stock/tickers')
    .then(res => res.json())
    .then(data => {
      AVAILABLE_TICKERS = data;
    })
    .catch(err => {
      console.error("Failed to load tickers:", err);
      AVAILABLE_TICKERS = [
        { symbol: 'HAH', fullname: 'HAH.VN', sector: 'Vận tải', industry: 'Hàng hải' },
        { symbol: 'SSI', fullname: 'SSI.VN', sector: 'Tài chính', industry: 'Chứng khoán' },
        { symbol: 'HPG', fullname: 'HPG.VN', sector: 'Công nghiệp', industry: 'Thép' },
        { symbol: 'FPT', fullname: 'FPT.VN', sector: 'Công nghệ', industry: 'Phần mềm' }
      ];
    });
  
  window.showStockSearchSuggestions = () => {
    suggestionsContainer.style.display = 'block';
    renderStockSuggestions(document.getElementById('stock-search-input').value);
  };
  
  window.hideStockSearchSuggestions = () => {
    setTimeout(() => {
      suggestionsContainer.style.display = 'none';
    }, 250);
  };
  
  window.handleStockSearchKeyup = (e) => {
    const query = e.target.value.trim().toUpperCase();
    renderStockSuggestions(query);
  };
  
  window.selectStockSearchTicker = (symbol) => {
    selectedStockTicker = symbol;
    document.getElementById('stock-search-input').value = symbol;
    const titleEl = document.getElementById('stock-chart-title');
    if (titleEl) titleEl.innerText = `Price Action & Signals`;
    showToast(`Selected stock ${symbol}.VN`, 'success');
    runStockBacktest(); // Auto-run backtest on stock selection
  };
}

function renderStockSuggestions(query) {
  const suggestionsContainer = document.getElementById('stock-search-suggestions');
  if (!suggestionsContainer) return;
  
  const queryUpper = (query || '').trim().toUpperCase();
  const filtered = AVAILABLE_TICKERS.filter(item => 
    item.symbol.includes(queryUpper) || 
    (item.sector && item.sector.toUpperCase().includes(queryUpper)) ||
    (item.industry && item.industry.toUpperCase().includes(queryUpper))
  );
  
  if (filtered.length === 0) {
    suggestionsContainer.innerHTML = '<div style="padding: 10px 16px; color: var(--text-muted); font-size: 0.85rem;">No tickers found</div>';
    return;
  }
  
  suggestionsContainer.innerHTML = filtered.slice(0, 100).map(item => `
    <div onmousedown="selectStockSearchTicker('${item.symbol}')" style="padding: 10px 16px; cursor: pointer; display: flex; flex-direction: column; border-bottom: 1px solid var(--border-glass);" onmouseover="this.style.background='rgba(0,0,0,0.02)'" onmouseout="this.style.background='transparent'">
      <span style="font-weight: 700; color: var(--text-primary); font-size: 0.88rem;">${item.fullname}</span>
      <span style="font-size: 0.72rem; color: var(--text-muted);">${item.sector} (${item.industry})</span>
    </div>
  `).join('');
}

// Chart Mode toggle: line vs candle
function setStockChartMode(mode) {
  currentStockChartMode = mode;
  
  const btnLine = document.getElementById('btn-chart-mode-line');
  const btnCandle = document.getElementById('btn-chart-mode-candle');
  
  if (mode === 'line') {
    btnLine.classList.add('active');
    btnCandle.classList.remove('active');
  } else {
    btnLine.classList.remove('active');
    btnCandle.classList.add('active');
  }
  
  renderStockChart();
}

function runStockBacktest() {
  const initialBalance = parseFloat(document.getElementById('bt-initial-balance').value) || 100000000;
  const commission = parseFloat(document.getElementById('bt-commission').value) || 0.15;
  const timeframe = document.getElementById('bt-timeframe').value;
  const startDate = document.getElementById('bt-start-date').value;
  const endDate = document.getElementById('bt-end-date').value;
  
  const ticker = selectedStockTicker;
  
  // Show loading state
  showToast(`Running backtest for ${ticker}...`, 'info');
  
  // Determine if currency is VND
  const currency = document.getElementById('bt-currency')?.value || 'VND';
  
  // If currency is VND, database prices are divided by 1000, so we scale down the initial cash by 1000 for backtesting.
  const backendInitialBalance = currency === 'VND' ? initialBalance / 1000 : initialBalance;
  
  // Fetch from backend API
  const url = `/api/stock/backtest?ticker=${encodeURIComponent(ticker)}&timeframe=${timeframe}&start=${startDate}&end=${endDate}&initial_balance=${backendInitialBalance}&commission=${commission}`;
  
  fetch(url)
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.error || 'Server error') });
      }
      return res.json();
    })
    .then(data => {
      let prices = data.prices;
      let trades = data.trades;
      let metrics = { ...data.metrics };
      
      if (currency === 'VND') {
        prices = prices.map(d => ({
          ...d,
          o: d.o * 1000,
          h: d.h * 1000,
          l: d.l * 1000,
          c: d.c * 1000
        }));
        
        trades = trades.map(t => ({
          ...t,
          entry_price: t.entry_price * 1000,
          exit_price: t.exit_price * 1000,
          pnl: t.pnl * 1000
        }));
        
        metrics.Equity_Final = (metrics.Equity_Final || 0) * 1000;
        metrics.Equity_Peak = (metrics.Equity_Peak || 0) * 1000;
      }
      
      currentStockPriceData = prices;
      currentStockTrades = trades;
      
      renderStockChart();
      updateBacktestMetrics(metrics, initialBalance);
      updateBacktestTradeLog();
      
      showToast(`Backtest completed for ${ticker}.VN`, 'success');
    })
    .catch(err => {
      console.error(err);
      showToast(err.message || "Failed to run backtest", "error");
    });
}

function renderStockChart() {
  const canvasEl = document.getElementById('stockBacktestChart');
  if (!canvasEl) return;
  const ctx = canvasEl.getContext('2d');
  
  // Hide reset zoom button on redraw
  const resetBtn = document.getElementById('btn-reset-zoom');
  if (resetBtn) resetBtn.style.display = 'none';
  
  // Double-click to reset zoom
  canvasEl.ondblclick = () => {
    resetStockChartZoom();
  };
  
  if (stockChartInstance) {
    stockChartInstance.destroy();
  }
  
  const dates = currentStockPriceData.map(d => d.date);
  const closePrices = currentStockPriceData.map(d => d.c);
  
  const candlestickPlugin = {
    id: 'candlestick',
    beforeDatasetsDraw(chart) {
      const {ctx, scales: {x, y}} = chart;
      const mode = chart.config.options.chartMode;
      if (mode !== 'candle') return;

      ctx.save();
      const meta = chart.getDatasetMeta(0);
      
      currentStockPriceData.forEach((point, i) => {
        const model = meta.data[i];
        if (!model) return;
        const xPos = model.x;
        const yOpen = y.getPixelForValue(point.o);
        const yClose = y.getPixelForValue(point.c);
        const yHigh = y.getPixelForValue(point.h);
        const yLow = y.getPixelForValue(point.l);

        const isGreen = point.c >= point.o;
        ctx.strokeStyle = isGreen ? '#059669' : '#e11d48';
        ctx.fillStyle = isGreen ? '#059669' : '#e11d48';
        ctx.lineWidth = 1.5;

        // Wick
        ctx.beginPath();
        ctx.moveTo(xPos, yHigh);
        ctx.lineTo(xPos, yLow);
        ctx.stroke();

        // Body
        const bodyWidth = currentStockPriceData.length > 80 ? 4 : 8;
        const top = Math.min(yOpen, yClose);
        const bottom = Math.max(yOpen, yClose);
        const height = Math.max(1.5, bottom - top);
        ctx.fillRect(xPos - bodyWidth / 2, top, bodyWidth, height);
      });
      ctx.restore();
    }
  };

  const signalMarkersPlugin = {
    id: 'signalMarkers',
    afterDatasetsDraw(chart) {
      const {ctx, scales: {x, y}} = chart;
      const trades = chart.config.options.trades || [];
      
      ctx.save();
      trades.forEach(trade => {
        const idx = currentStockPriceData.findIndex(pt => pt.date === trade.date);
        if (idx === -1) return;
        
        const meta = chart.getDatasetMeta(0);
        const model = meta.data[idx];
        if (!model) return;
        
        const xPos = model.x;
        const yPos = y.getPixelForValue(trade.price);
        
        if (trade.type === 'BUY') {
          // Green triangle pointing up, tip exactly touching (xPos, yPos)
          ctx.fillStyle = '#059669';
          ctx.beginPath();
          ctx.moveTo(xPos, yPos);
          ctx.lineTo(xPos - 6, yPos + 12);
          ctx.lineTo(xPos + 6, yPos + 12);
          ctx.closePath();
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('B', xPos, yPos + 8);
        } else {
          // Red triangle pointing down, tip exactly touching (xPos, yPos)
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.moveTo(xPos, yPos);
          ctx.lineTo(xPos - 6, yPos - 12);
          ctx.lineTo(xPos + 6, yPos - 12);
          ctx.closePath();
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('S', xPos, yPos - 8);
        }
      });
      ctx.restore();
    }
  };

  const datasets = [
    {
      label: 'Price',
      data: closePrices,
      borderColor: currentStockChartMode === 'candle' ? 'transparent' : '#3b82f6',
      backgroundColor: currentStockChartMode === 'candle' ? 'transparent' : 'rgba(59, 130, 246, 0.03)',
      borderWidth: 2,
      fill: currentStockChartMode === 'line',
      tension: 0.1,
      pointRadius: 0,
      pointHoverRadius: 4
    }
  ];

  // Map trades to buy/sell chart markers
  const chartMarkers = [];
  currentStockTrades.forEach(trade => {
    chartMarkers.push({
      type: 'BUY',
      date: trade.entry_time,
      price: trade.entry_price
    });
    chartMarkers.push({
      type: 'SELL',
      date: trade.exit_time,
      price: trade.exit_price
    });
  });

  stockChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: datasets
    },
    plugins: [candlestickPlugin, signalMarkersPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartMode: currentStockChartMode,
      trades: chartMarkers,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const idx = context.dataIndex;
              const pt = currentStockPriceData[idx];
              if (!pt) return '';
              return [
                `Close: ${formatStockCurrency(pt.c)}`,
                `Open: ${formatStockCurrency(pt.o)}`,
                `High: ${formatStockCurrency(pt.h)}`,
                `Low: ${formatStockCurrency(pt.l)}`
              ];
            }
          }
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
            onZoom: () => {
              const rBtn = document.getElementById('btn-reset-zoom');
              if (rBtn) rBtn.style.display = 'inline-flex';
            }
          },
          pan: {
            enabled: true,
            mode: 'x',
            onPan: () => {
              const rBtn = document.getElementById('btn-reset-zoom');
              if (rBtn) rBtn.style.display = 'inline-flex';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.02)' }
        }
      }
    }
  });
}

function updateBacktestMetrics(metrics, initialBalance) {
  const tbody = document.getElementById('bt-metrics-table-body');
  if (!tbody) return;
  
  if (!metrics) {
    tbody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-muted); padding: 80px 0;">No metrics available. Run backtest to load.</td></tr>';
    return;
  }

  const netProfit = (metrics.Equity_Final || 0) - initialBalance;
  const netProfitPct = initialBalance > 0 ? (netProfit / initialBalance) * 100 : 0;
  
  const formatPct = (val) => {
    if (val === null || val === undefined) return 'N/A';
    return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
  };
  
  const formatVal = (val) => {
    if (val === null || val === undefined) return 'N/A';
    return val.toFixed(2);
  };

  const formatDays = (val) => {
    if (val === null || val === undefined) return 'N/A';
    return `${val} ngày`;
  };

  const rows = [
    { label: 'Ngày bắt đầu (Start Date)', value: metrics.Start_Date || 'N/A' },
    { label: 'Ngày kết thúc (End Date)', value: metrics.End_Date || 'N/A' },
    { label: 'Thời gian backtest (Duration)', value: formatDays(metrics.Duration_Days) },
    { label: 'Vốn ban đầu (Initial Balance)', value: formatStockCurrency(initialBalance) },
    { label: 'Vốn cuối kỳ (Ending Balance)', value: formatStockCurrency(metrics.Equity_Final) },
    { 
      label: 'Lợi nhuận ròng (Net Profit)', 
      value: `<span class="${netProfit >= 0 ? 'positive' : 'negative'}" style="font-weight: 700;">${netProfit >= 0 ? '+' : ''}${formatStockCurrency(netProfit)} (${formatPct(netProfitPct)})</span>` 
    },
    { label: 'Lợi nhuận Mua & Giữ (Buy & Hold Return)', value: formatPct(metrics.Buy_Hold_Return_Pct) },
    { label: 'Lợi nhuận năm (Annualized Return)', value: formatPct(metrics.Return_Ann_Pct) },
    { label: 'Độ biến động năm (Annualized Volatility)', value: formatPct(metrics.Volatility_Ann_Pct) },
    { label: 'Hệ số Sharpe (Sharpe Ratio)', value: formatVal(metrics.Sharpe_Ratio) },
    { label: 'Hệ số Sortino (Sortino Ratio)', value: formatVal(metrics.Sortino_Ratio) },
    { label: 'Hệ số Calmar (Calmar Ratio)', value: formatVal(metrics.Calmar_Ratio) },
    { 
      label: 'Mức sụt giảm lớn nhất (Max Drawdown)', 
      value: `<span class="negative" style="font-weight: 600;">${metrics.Max_Drawdown_Pct ? metrics.Max_Drawdown_Pct.toFixed(2) : '0.00'}%</span>` 
    },
    { label: 'Thời gian sụt giảm lớn nhất (Max DD Duration)', value: formatDays(metrics.Max_Drawdown_Duration_Days) },
    { label: 'Tổng số lệnh (Total Trades)', value: metrics.Num_Trades !== undefined ? metrics.Num_Trades : 0 },
    { 
      label: 'Tỷ lệ thắng (Win Rate)', 
      value: `<span style="font-weight: 600;">${metrics.Win_Rate_Pct ? metrics.Win_Rate_Pct.toFixed(1) : '0.0'}%</span>` 
    },
    { label: 'Hệ số lợi nhuận (Profit Factor)', value: formatVal(metrics.Profit_Factor) },
    { label: 'Kỳ vọng mỗi lệnh (Expectancy)', value: formatPct(metrics.Expectancy_Pct) },
    { label: 'Lợi nhuận TB lệnh (Avg. Trade Return)', value: formatPct(metrics.Avg_Trade_Pct) },
    { label: 'Lệnh thắng tốt nhất (Best Trade)', value: formatPct(metrics.Best_Trade_Pct) },
    { label: 'Lệnh thua tệ nhất (Worst Trade)', value: formatPct(metrics.Worst_Trade_Pct) },
    { label: 'Thời gian nắm giữ TB (Avg. Trade Duration)', value: formatDays(metrics.Avg_Trade_Duration_Days) }
  ];

  tbody.innerHTML = rows.map(row => `
    <tr style="border-bottom: 1px solid var(--border-glass);">
      <td style="padding: 10px 14px; color: var(--text-secondary); font-size: 0.88rem;">${row.label}</td>
      <td style="padding: 10px 14px; text-align: right; font-weight: 600; font-size: 0.88rem; color: var(--text-primary);">${row.value}</td>
    </tr>
  `).join('');
}

function updateBacktestTradeLog() {
  const tbody = document.getElementById('bt-trade-log-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  if (currentStockTrades.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 80px 0;">No completed trades during this period.</td></tr>';
    return;
  }
  
  const sorted = [...currentStockTrades].reverse();
  
  sorted.forEach((trade) => {
    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid var(--border-glass)';
    
    const pnlClass = trade.pnl >= 0 ? 'positive' : 'negative';
    const returnClass = trade.return_pct >= 0 ? 'kpi-badge positive' : 'kpi-badge negative';
    
    row.innerHTML = `
      <td style="padding: 10px 10px; color: var(--text-secondary); font-size: 0.85rem;">${trade.entry_time}</td>
      <td style="padding: 10px 10px; color: var(--text-secondary); font-size: 0.85rem;">${trade.exit_time}</td>
      <td style="padding: 10px 10px; text-align: right; color: var(--text-secondary); font-size: 0.85rem;">${formatStockCurrency(trade.entry_price)}</td>
      <td style="padding: 10px 10px; text-align: right; color: var(--text-secondary); font-size: 0.85rem;">${formatStockCurrency(trade.exit_price)}</td>
      <td style="padding: 10px 10px; text-align: right; font-weight: 600; font-size: 0.85rem;" class="kpi-value ${pnlClass}">${trade.pnl >= 0 ? '+' : ''}${formatStockCurrency(trade.pnl)}</td>
      <td style="padding: 10px 10px; text-align: right; font-size: 0.85rem;"><span class="${returnClass}">${trade.return_pct >= 0 ? '+' : ''}${trade.return_pct.toFixed(2)}%</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

// --- The5ers Token Modal Handlers ---

function showTokenModal() {
  const modal = document.getElementById('token-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    // Hide input form and loading, show initial question options
    document.getElementById('token-input-form').style.display = 'none';
    document.getElementById('token-loading').style.display = 'none';
    document.getElementById('modal-initial-options').style.display = 'flex';
    
    // Autofill token from localStorage if exists
    const savedToken = localStorage.getItem('the5ers_token');
    const tokenField = document.getElementById('the5ers-token-field');
    if (savedToken && tokenField) {
      tokenField.value = savedToken;
    }
  }
}

function closeTokenModal() {
  const modal = document.getElementById('token-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function handleTokenModalNo() {
  closeTokenModal();
  renderApp();
  showToast(`Loaded cached data for ${ACCOUNTS_CONFIG[currentAccountId].name}`, 'info');
}

function showTokenInputForm() {
  document.getElementById('modal-initial-options').style.display = 'none';
  document.getElementById('token-input-form').style.display = 'block';
}

function hideTokenInputForm() {
  document.getElementById('token-input-form').style.display = 'none';
  document.getElementById('modal-initial-options').style.display = 'flex';
}

async function handleTokenSubmit(event) {
  event.preventDefault();
  
  const tokenField = document.getElementById('the5ers-token-field');
  const token = tokenField ? tokenField.value.trim() : '';
  
  if (!token) {
    showToast("Please enter a token!", "error");
    return;
  }
  
  localStorage.setItem('the5ers_token', token);
  
  document.getElementById('token-input-form').style.display = 'none';
  document.getElementById('token-loading').style.display = 'block';
  
  try {
    const response = await fetch(`/api/the5ers/update-token?account=${encodeURIComponent(currentAccountId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: token, account: currentAccountId })
    });
    
    if (response.ok) {
      const trades = await response.json();
      currentAccountTrades = trades;
      
      closeTokenModal();
      initDateRangePanel();
      renderAppFiltered();
      showToast("Data fetched successfully!", "success");
    } else {
      const errData = await response.json();
      throw new Error(errData.error || "API Error");
    }
  } catch (err) {
    console.error("Crawl error:", err);
    showToast(`Fetch failed: ${err.message}`, "error");
    
    document.getElementById('token-loading').style.display = 'none';
    document.getElementById('token-input-form').style.display = 'block';
  }
}
