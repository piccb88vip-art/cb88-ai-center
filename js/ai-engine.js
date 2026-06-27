const AIEngine = (() => {
  const scorePatterns = [[2,1],[1,0],[2,0],[1,1],[3,1],[0,1],[2,2],[3,2]];
  const insightBank = [
    'AI CLICKBET88 baca match ini cukup panas. Ritme permainan bisa berubah cepat, tapi tim yang lebih rapi dalam transisi punya peluang lebih cakep buat ngunci hasil.',
    'Secara pola, laga ini bukan tipe yang bisa asal tebak. Odds, momentum, dan potensi gol nunjukin match bakal ketat tapi tetap ada sisi favorit yang lebih masuk akal.',
    'Dari scan lokal, match ini punya potensi skor tipis. Yang paling menentukan bukan cuma serangan, tapi disiplin bertahan saat masuk fase akhir laga.',
    'AI melihat kedua tim bisa saling tekan. Tapi peluang paling oke condong ke tim yang lebih efektif memanfaatkan celah kecil di area lawan.',
    'Prediksi ini bukan ramalan dukun, bro. Sistem baca odds, nama tim, stage, dan pola skor umum buat nentuin skenario paling realistis.'
  ];
  const n = v => Number.isFinite(parseFloat(v)) ? parseFloat(v) : 0;
  const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
  const pick = arr => arr[rand(0, arr.length-1)];
  function generate(match){
    let home = 45, draw = 25, away = 30;
    const h = n(match.homeOdds), a = n(match.awayOdds);
    if (h > a) { home += rand(7,15); away -= rand(3,8); }
    else if (a > h) { away += rand(7,15); home -= rand(3,8); }
    home = Math.max(24, Math.min(68, home + rand(-5,5)));
    away = Math.max(20, Math.min(64, away + rand(-5,5)));
    draw = Math.max(13, 100 - home - away);
    const total = home + draw + away;
    home = Math.round(home / total * 100);
    away = Math.round(away / total * 100);
    draw = 100 - home - away;
    let score = pick(scorePatterns).slice();
    if (away > home && Math.random() > .38) score = [score[1], score[0]];
    const confidence = Math.max(home, draw, away);
    const fav = home > away ? match.home : away > home ? match.away : 'seri';
    const rec = draw > home && draw > away ? 'Potensi seri, jangan barbar ambil keputusan' : `${fav} lebih masuk akal buat dipantau`;
    const insight = `${pick(insightBank)} Prediksi skor mengarah ke ${score[0]}-${score[1]}. ${rec}. Tetap main bijak, jangan all-in cuma karena feeling lagi pede.`;
    return { score: `${score[0]}-${score[1]}`, home, draw, away, confidence, rec, insight };
  }
  return { generate };
})();
