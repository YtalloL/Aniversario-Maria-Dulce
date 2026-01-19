/* Utilitários compartilhados entre páginas - escritos de forma direta e legível */
(function(){
  const colors = ['#db8334','#c27a5c','#a160b2','#943cab','#e7ceed'];

  // Confete simples — chama document.body.appendChild e anima via transform
  window.createConfetti = function(x, y, count = 24){
    for (let i = 0; i < count; i++){
      const el = document.createElement('div');
      el.className = 'confetti';
      const size = Math.random() * 8 + 6;
      el.style.width = `${size}px`;
      el.style.height = `${Math.max(6, size*0.6)}px`;
      el.style.background = colors[Math.floor(Math.random()*colors.length)];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * (Math.random()*6 + 2);
      const vy = Math.sin(angle) * (Math.random()*6 + -6);
      const rot = Math.random()*360;

      requestAnimationFrame(()=>{
        el.style.transform = `translate(${vx*80}px, ${vy*80}px) rotate(${rot}deg)`;
        el.style.opacity = '0';
      });

      setTimeout(()=> el.remove(), 1400 + Math.random()*600);
    }
  };

  // Anima a idade de 0 até o número apresentado no elemento
  window.animateAge = function(el){
    if (!el) return;
    const to = parseInt(el.textContent, 10) || 0;
    const duration = 900;
    const startTime = performance.now();
    function step(now){
      const t = Math.min(1, (now - startTime) / duration);
      el.textContent = Math.floor(t * to);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = to;
    }
    requestAnimationFrame(step);
  };

  // Efeito de digitação; aceita elemento ou procura por #guestName
  window.typeName = function(el){
    el = el || document.getElementById('guestName');
    if (!el) return;
    const full = el.getAttribute('data-full') || el.textContent.trim();
    el.setAttribute('data-full', full);
    el.textContent = '';
    let i = 0;
    const speed = 40;
    (function step(){
      if (i <= full.length){
        el.textContent = full.slice(0, i);
        i++;
        setTimeout(step, speed + Math.random()*30);
      }
    })();
  };

  // Reveal suave dentro de um nó (ou no document)
  window.revealWithin = function(root){
    root = root || document;
    const elements = root.querySelectorAll('.reveal');
    elements.forEach(el => el.classList.add('reveal'));
    const obs = new IntersectionObserver((entries, o)=>{
      entries.forEach(e=>{ if (e.isIntersecting){ e.target.classList.add('visible'); o.unobserve(e.target); } });
    }, {threshold: 0.12});
    elements.forEach(el => obs.observe(el));
  };

  // Contador: atualiza um elemento com o tempo restante até targetDate
  window.updateCountdownTo = function(targetDate, el){
    if (!el) return;
    const now = new Date();
    let diff = targetDate - now;
    if (diff <= 0){ el.textContent = '0 dias 00:00:00'; return; }
    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = String(Math.floor(diff / (1000*60*60))).padStart(2,'0');
    diff -= hours * (1000*60*60);
    const mins = String(Math.floor(diff / (1000*60))).padStart(2,'0');
    diff -= mins * (1000*60);
    const secs = String(Math.floor(diff / 1000)).padStart(2,'0');
    el.textContent = `${days} dias ${hours}:${mins}:${secs}`;
  };

})();