(() => {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let dots = [];
  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; dots = Array.from({length: Math.min(90, Math.floor(innerWidth/16))}, () => ({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,r:Math.random()*1.8+.6})); }
  function draw(){ ctx.clearRect(0,0,canvas.width,canvas.height); dots.forEach((d,i)=>{ d.x+=d.vx; d.y+=d.vy; if(d.x<0||d.x>canvas.width)d.vx*=-1; if(d.y<0||d.y>canvas.height)d.vy*=-1; ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fillStyle=i%3===0?'rgba(255,40,40,.55)':i%3===1?'rgba(30,120,255,.45)':'rgba(255,211,77,.38)'; ctx.fill(); }); requestAnimationFrame(draw); }
  addEventListener('resize', resize); resize(); draw();
})();
