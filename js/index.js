// Script da página inicial — usa funções de `utils.js`
(function(){
  const detailsPanel = document.getElementById('detailsPanel');
  const openDetailsEls = document.querySelectorAll('.open-details');
  const guestName = document.getElementById('guestName');
  const ageEl = document.getElementById('age');
  const qrImage = document.getElementById('qrImage');

  // Toggle do painel que carrega `details.html` na primeira abertura
  let detailsLoaded = false;
  async function toggleDetails(){
    if (!detailsPanel) { window.location.href = 'details.html'; return; }
    if (detailsPanel.classList.contains('open')){
      detailsPanel.classList.remove('open');
      detailsPanel.classList.add('hidden');
      detailsPanel.setAttribute('aria-hidden','true');
      document.querySelectorAll('.open-details').forEach(b=> b.setAttribute('aria-expanded','false'));
      return;
    }

    document.querySelectorAll('.open-details').forEach(b=> b.setAttribute('aria-expanded','true'));

    if (!detailsLoaded){
      try{
        const res = await fetch('details.html');
        if (!res.ok) throw new Error('fetch failed');
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const section = doc.getElementById('details-full') || doc.querySelector('.details');
        detailsPanel.innerHTML = section ? section.innerHTML : text;

        // inicializar o botão de copiar dentro do painel (se existir)
        const copyBtnLocal = detailsPanel.querySelector('#copyPix');
        const pixKeyLocal = detailsPanel.querySelector('#pixKey');
        if (copyBtnLocal && pixKeyLocal) {
          copyBtnLocal.addEventListener('click', async ()=>{
            const val = pixKeyLocal.value.trim();
            if (!val) { copyBtnLocal.textContent = 'Vazio'; setTimeout(()=>copyBtnLocal.textContent='Copiar',1200); return; }
            try { await navigator.clipboard.writeText(val); copyBtnLocal.textContent = 'Copiado!'; setTimeout(()=>copyBtnLocal.textContent='Copiar',1500);} catch(e){copyBtnLocal.textContent='Erro'; setTimeout(()=>copyBtnLocal.textContent='Copiar',1500);}            
          });
        }

        // reveal das seções que vieram no HTML injetado
        revealWithin(detailsPanel);

        detailsLoaded = true;
      }catch(err){
        // fallback: navegar para a página completa
        window.location.href = 'details.html';
        return;
      }
    }

    detailsPanel.classList.remove('hidden');
    detailsPanel.classList.add('open');
    detailsPanel.setAttribute('aria-hidden','false');
  }

  // Inicializadores da home
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('.card').classList.add('enter');
    typeName(guestName);
    animateAge(ageEl);

    // preparar reveals (não os acionamos até o painel abrir)
    document.querySelectorAll('.details > *').forEach(el => el.classList.add('reveal'));

    // efeito visual no QR caso esteja presente
    if (qrImage && qrImage.src && !qrImage.hidden) {
      const qrPreview = document.querySelector('.qr-preview');
      qrPreview.classList.add('pulse');
      setTimeout(()=> qrPreview.classList.remove('pulse'), 1400);
    }

    // contador
    const countdownTarget = new Date('2026-03-28T00:00:00');
    const timerEl = document.getElementById('countdownTimer');
    if (timerEl) {
      updateCountdownTo(countdownTarget, timerEl);
      setInterval(()=> updateCountdownTo(countdownTarget, timerEl), 1000);
    }

    // Código movido do script inline em index.html: tratar cópia do Pix caso os elementos existam (seguro para página principal e painel carregado)
    const copyBtn = document.getElementById('copyPix');
    const pixKey = document.getElementById('pixKey');
    if (copyBtn && pixKey) {
      copyBtn.addEventListener('click', async () => {
        const val = pixKey.value.trim();
        if (!val) { copyBtn.textContent = 'Vazio'; setTimeout(()=> copyBtn.textContent = 'Copiar', 1200); return; }
        try {
          await navigator.clipboard.writeText(val);
          copyBtn.textContent = 'Copiado!';
          setTimeout(()=> copyBtn.textContent = 'Copiar', 1500);
        } catch (err) {
          copyBtn.textContent = 'Erro';
          setTimeout(()=> copyBtn.textContent = 'Copiar', 1500);
        }
      });
    }

  });

  // ligar eventos dos botões que abrem o painel
  openDetailsEls.forEach(el=> el.addEventListener('click', (ev)=>{
    ev.preventDefault();
    const rect = ev.target.getBoundingClientRect();
    createConfetti(rect.left + rect.width/2, rect.top + rect.height/2, 30);
    setTimeout(()=> toggleDetails(), 280);
  }));

})();