const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const overlay = document.querySelector('#overlay');
const message = document.querySelector('#message');
const hint = document.querySelector('#hint');
const scoreEl = document.querySelector('#score');
const bestEl = document.querySelector('#best');
const W = canvas.width, H = canvas.height;
let best = Number(localStorage.getItem('skyHopBest') || 0), score = 0, state = 'ready', frame = 0, pipes = [];
let bird = {x:105,y:H/2,v:0,r:15,tilt:0};
bestEl.textContent = best;

function reset(){score=0;frame=0;pipes=[];bird={x:105,y:H/2,v:0,r:15,tilt:0};scoreEl.textContent=0;}
function flap(){if(state==='over'){reset();state='play';overlay.classList.add('hidden')}else if(state==='ready'){state='play';overlay.classList.add('hidden')}if(state==='play'){bird.v=-6.6;bird.tilt=-.42}}
function pipe(){const gap=155;const top=115+Math.random()*(H-gap-230);pipes.push({x:W+28,top,gap,passed:false});}
function rounded(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function drawBackground(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#362150');g.addColorStop(.58,'#241734');g.addColorStop(1,'#101019');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle='#ffffff16';for(let i=0;i<28;i++){const x=(i*89+frame*.25)%W,y=(i*47)%470;ctx.fillRect(x,y,2,2)}ctx.fillStyle='#1b1325';ctx.fillRect(0,H-64,W,64);ctx.fillStyle='#6f2c70';for(let x=-40;x<W+40;x+=42){ctx.beginPath();ctx.moveTo(x,H-64);ctx.lineTo(x+22,H-88);ctx.lineTo(x+45,H-64);ctx.fill()}ctx.fillStyle='#f47b40';ctx.fillRect(0,H-8,W,8)}
function drawPipe(p){const width=65;const grad=ctx.createLinearGradient(p.x,0,p.x+width,0);grad.addColorStop(0,'#922c94');grad.addColorStop(.55,'#ef4f7e');grad.addColorStop(1,'#f8993a');ctx.fillStyle=grad;rounded(p.x,0,width,p.top,9);rounded(p.x,p.top-17,width,21,6);const bottom=p.top+p.gap;rounded(p.x,bottom,width,H-bottom-64,9);rounded(p.x,bottom-4,width,21,6);ctx.fillStyle='#fff4';ctx.fillRect(p.x+10,4,5,Math.max(0,p.top-9));ctx.fillRect(p.x+10,bottom+9,5,H-bottom-78)}
function drawBird(){ctx.save();ctx.translate(bird.x,bird.y);ctx.rotate(bird.tilt);ctx.fillStyle='#feda75';ctx.shadowColor='#fda53a';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(0,0,bird.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(5,-5,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#17111d';ctx.beginPath();ctx.arc(7,-5,2.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fa5c63';ctx.beginPath();ctx.moveTo(12,3);ctx.lineTo(27,8);ctx.lineTo(12,12);ctx.closePath();ctx.fill();ctx.fillStyle='#ed8748';ctx.beginPath();ctx.ellipse(-8,6,9,5,.3,0,Math.PI*2);ctx.fill();ctx.restore()}
function collide(p){const bx=bird.x,by=bird.y,r=bird.r;return bx+r>p.x&&bx-r<p.x+65&&(by-r<p.top||by+r>p.top+p.gap)}
function gameOver(){state='over';message.textContent='GAME OVER';hint.textContent='Tap to try again';overlay.classList.remove('hidden');if(score>best){best=score;localStorage.setItem('skyHopBest',best);bestEl.textContent=best}}
function update(){if(state==='play'){bird.v+=.36;bird.y+=bird.v;bird.tilt=Math.min(1.05,bird.tilt+.045);if(frame%92===0)pipe();for(const p of pipes){p.x-=2.65;if(!p.passed&&p.x+65<bird.x){p.passed=true;score++;scoreEl.textContent=score}if(collide(p))gameOver()}pipes=pipes.filter(p=>p.x>-80);if(bird.y+bird.r>H-64||bird.y-bird.r<0)gameOver()}frame++}
function render(){drawBackground();pipes.forEach(drawPipe);drawBird()}
function loop(){update();render();requestAnimationFrame(loop)}
window.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();flap()}});canvas.addEventListener('pointerdown',flap);loop();
