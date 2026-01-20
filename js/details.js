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

    // Adicionar ao Google Agenda
    const addToCalendarBtn = document.getElementById('addToCalendar');
    if (addToCalendarBtn) {
      addToCalendarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const dateStr = document.getElementById('date')?.textContent.trim();
        const timeStr = document.getElementById('time')?.textContent.trim() || '18:00';
        const place = document.getElementById('place')?.textContent.trim() || '';
        const gift = document.getElementById('gift')?.textContent.trim() || '';
        const titleMain = document.querySelector('h1.name span')?.textContent.trim() || '';
        const titleSub = document.querySelector('p.name span')?.textContent.trim() || '';
        const title = titleMain && titleSub ? `${titleMain} — ${titleSub}` : (titleMain || titleSub || 'Evento');

        if (!dateStr) {
          window.alert('Data inválida para adicionar à agenda.');
          return;
        }

        const [day, month, year] = dateStr.split('/').map(s => parseInt(s, 10));
        const [hour, minute] = timeStr.split(':').map(s => parseInt(s, 10));
        const startDate = new Date(year, month - 1, day, hour || 0, minute || 0);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // duração padrão 2h

        function formatForCalendar(d) {
          const yy = d.getFullYear().toString().padStart(4,'0');
          const mm = (d.getMonth()+1).toString().padStart(2,'0');
          const dd = d.getDate().toString().padStart(2,'0');
          const hh = d.getHours().toString().padStart(2,'0');
          const min = d.getMinutes().toString().padStart(2,'0');
          const ss = d.getSeconds().toString().padStart(2,'0');
          return `${yy}${mm}${dd}T${hh}${min}${ss}`;
        }

        const start = formatForCalendar(startDate);
        const end = formatForCalendar(endDate);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
        const details = gift;
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(place)}&ctz=${encodeURIComponent(tz)}`;

        window.open(url, '_blank');
      });
    }

  });
})();