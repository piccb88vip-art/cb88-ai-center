const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));
const safe = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const flag = team => `https://flagcdn.com/w160/${FLAGS[team] || 'un'}.png`;

function switchScreen(from, to){
  $(from).classList.remove('active');
  $(to).classList.add('active');
}

async function bootSequence(){
  switchScreen('landing','boot');
  const steps = [
    {p:8, text:'Nyalain mesin AI dulu, bro...', status:'ONLINE', core:'BOOTING', db:'WAITING', stream:'LIVE', neural:'STANDBY', predictor:'LOCKED'},
    {p:19, text:'Scanning lighting system...', status:'ONLINE', core:'ACTIVE', db:'WAITING', stream:'LIVE', neural:'BOOTING', predictor:'LOCKED'},
    {p:33, text:'Connecting match database...', status:'ONLINE', core:'ACTIVE', db:'CONNECTING', stream:'SYNC', neural:'BOOTING', predictor:'LOCKED'},
    {p:49, text:'Ngulik odds dan momentum tim...', status:'ONLINE', core:'ACTIVE', db:'CONNECTED', stream:'LIVE', neural:'SCANNING', predictor:'LOCKED'},
    {p:67, text:'Neural network lagi mikir keras...', status:'ONLINE', core:'BOOSTED', db:'CONNECTED', stream:'LIVE', neural:'RUNNING', predictor:'LOADING'},
    {p:84, text:'Menyiapkan prediction engine...', status:'ONLINE', core:'BOOSTED', db:'CONNECTED', stream:'LIVE', neural:'RUNNING', predictor:'READY'},
    {p:100, text:'AI siap gas. Masuk dashboard...', status:'READY', core:'ONLINE', db:'CONNECTED', stream:'LIVE', neural:'READY', predictor:'UNLOCKED'}
  ];
  for(const s of steps){
    $('bootPercent').textContent = `${s.p}%`;
    $('bootBar').style.width = `${s.p}%`;
    $('bootText').textContent = s.text;
    $('hudStatus').textContent = s.status;
    $('hudCore').textContent = s.core;
    $('hudDb').textContent = s.db;
    $('hudStream').textContent = s.stream;
    $('hudNeural').textContent = s.neural;
    $('hudPredictor').textContent = s.predictor;
    await wait(520);
  }
  await wait(450);
  switchScreen('boot','app');
}

function normalize(row){
  return {
    id: row.id || row.matchId || row.MatchID || row['Match ID'] || crypto.randomUUID?.() || Math.random(),
    home: row.home || row.Home || row['Team A'] || row.teamA || row.HomeTeam || row['Home Team'] || '',
    away: row.away || row.Away || row['Team B'] || row.teamB || row.AwayTeam || row['Away Team'] || '',
    date: row.date || row.Date || row.Tanggal || '',
    time: row.time || row.Time || row.Jam || '',
    stage: row.stage || row.Stage || row.Group || row['Group / Stage'] || 'World Cup',
    status: String(row.status || row.Status || 'UPCOMING').toUpperCase(),
    homeOdds: row.homeOdds || row.HomeOdds || row['Home Odds'] || '',
    awayOdds: row.awayOdds || row.AwayOdds || row['Away Odds'] || ''
  };
}

async function loadMatches(){
  try{
    if(!CONFIG.sheetApi) throw new Error('API empty');
    const res = await fetch(CONFIG.sheetApi, {cache:'no-store'});
    const json = await res.json();
    const arr = Array.isArray(json) ? json : (json.matches || json.data || []);
    const rows = arr.map(normalize).filter(x => x.home && x.away);
    return rows.length ? rows : FALLBACK_MATCHES;
  }catch(e){
    return FALLBACK_MATCHES;
  }
}

function render(matches){
  $('totalMatch').textContent = matches.length;
  $('matchGrid').innerHTML = matches.map(m => `
    <article class="match-card">
      <div class="match-top"><span>${safe(m.stage)}</span><span>${safe(m.date)} • ${safe(m.time)} WIB</span></div>
      <div class="teams">
        <div class="team"><img class="flag" src="${flag(m.home)}" onerror="this.src='https://placehold.co/160x100/111827/ffffff?text=FLAG'"><b>${safe(m.home)}</b></div>
        <div class="vs">VS</div>
        <div class="team"><img class="flag" src="${flag(m.away)}" onerror="this.src='https://placehold.co/160x100/111827/ffffff?text=FLAG'"><b>${safe(m.away)}</b></div>
      </div>
      <div class="odds"><span>HOME ${safe(m.homeOdds || '-')}</span><span>AWAY ${safe(m.awayOdds || '-')}</span></div>
      <button class="scan-btn" data-id="${safe(m.id)}">🤖 SCAN PREDIKSI AI</button>
    </article>
  `).join('');
  document.querySelectorAll('.scan-btn').forEach(btn => btn.addEventListener('click', () => {
    const match = matches.find(m => String(m.id) === String(btn.dataset.id));
    startPrediction(match);
  }));
}

async function startPrediction(match){
  const modal = $('predictModal');
  const content = $('modalContent');
  modal.classList.remove('hidden');
  content.innerHTML = `<div class="thinking"><span class="small-red">CLICKBET88 AI ENGINE</span><h2>AI lagi nge-scan match...</h2><main class="robot-stage"><div class="scan-ring ring-a"></div><div class="scan-ring ring-b"></div><div class="scan-ring ring-c"></div><div class="robot-core"><div class="robot-head"><div class="antenna"></div><div class="eye left-eye"></div><div class="eye right-eye"></div><div class="mouth"></div></div><div class="robot-body"><span></span></div></div><div class="scan-line"></div></main><div class="progress"><span id="predictBar"></span></div><div class="boot-text" id="predictText">Mulai baca data...</div></div>`;
  const steps = ['Baca nama tim...', 'Ngecek odds...', 'Scan momentum...', 'Cari potensi skor...', 'Finalisasi prediksi...'];
  for(let i=0;i<steps.length;i++){
    $('predictBar').style.width = `${Math.round((i+1)/steps.length*100)}%`;
    $('predictText').textContent = steps[i];
    await wait(480);
  }
  const r = AIEngine.generate(match);
  content.innerHTML = `<div class="result"><span class="small-red">PREDIKSI SIAP, BRO</span><h2>${safe(match.home)} VS ${safe(match.away)}</h2><div style="display:flex;align-items:center;justify-content:center;gap:24px"><img class="flag" src="${flag(match.home)}"><div class="big-score">${safe(r.score)}</div><img class="flag" src="${flag(match.away)}"></div><div class="prob"><div><span>${safe(match.home)}</span><b>${r.home}%</b></div><div><span>SERI</span><b>${r.draw}%</b></div><div><span>${safe(match.away)}</span><b>${r.away}%</b></div></div><div class="recommend">🎯 ${safe(r.rec)} • Confidence ${r.confidence}%</div><div class="insight" id="typedInsight"></div><a class="login-btn" href="${CONFIG.loginUrl}" target="_blank" style="display:inline-block;margin-top:16px">GAS KE CLICKBET88</a></div>`;
  await typeText($('typedInsight'), r.insight, 16);
}

async function init(){
  render(await loadMatches());
}

$('enterBtn').addEventListener('click', bootSequence);
$('closeModal').addEventListener('click', () => $('predictModal').classList.add('hidden'));
$('refreshBtn').addEventListener('click', init);
init();
