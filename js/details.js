// Script específico para a página de detalhes (quando acessada diretamente)
(function(){
  const copyBtn = document.getElementById('copyPix');
  const pixKey = document.getElementById('pixKey');

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('.card').classList.add('enter');
    // reveal das partes
    document.querySelectorAll('.details > *').forEach(el=> el.classList.add('reveal'));
    revealWithin();

    // anima idade
    const ageEl = document.getElementById('age');
    animateAge(ageEl);

    // um confetinho discreto pra dar boas-vindas
    const rect = document.querySelector('.card').getBoundingClientRect();
    createConfetti(rect.left + rect.width/2, rect.top + rect.height/2, 28);

    // contador
    const countdownTarget = new Date('2026-03-28T00:00:00');
    const timerEl = document.getElementById('countdownTimer');
    if (timerEl) {
      updateCountdownTo(countdownTarget, timerEl);
      setInterval(()=> updateCountdownTo(countdownTarget, timerEl), 1000);
    }

    // botão copiar local
    if (copyBtn && pixKey){
      copyBtn.addEventListener('click', async ()=>{
        const val = pixKey.value.trim();
        if (!val) { copyBtn.textContent = 'Vazio'; setTimeout(()=> copyBtn.textContent='Copiar',1200); return; }
        try { await navigator.clipboard.writeText(val); copyBtn.textContent = 'Copiado!'; setTimeout(()=> copyBtn.textContent='Copiar',1500);} catch(e){ copyBtn.textContent='Erro'; setTimeout(()=> copyBtn.textContent='Copiar',1500);}      
      });
    }
  });
})();