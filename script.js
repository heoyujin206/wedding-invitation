const invitationIntro = document.getElementById('invitationIntro');
const introSkip = document.getElementById('introSkip');
let invitationIntroClosed = false;

function closeInvitationIntro() {
  if (invitationIntroClosed) return;
  invitationIntroClosed = true;
  invitationIntro.classList.add('is-finished');
  document.body.classList.remove('intro-open');

  window.setTimeout(() => {
    invitationIntro.remove();
  }, 500);
}

// 3초 후 페이드아웃 시작

setTimeout(() => {

    const card = document.querySelector(".intro-card-image");
    const guide = document.querySelector(".intro-guide");

    card.style.animation =
        "introFadeOut .5s ease forwards";

    guide.style.animation =
        "introFadeOut .5s ease forwards";

},3000);


// 3.5초 후 페이지 입장

setTimeout(() => {

    closeInvitationIntro();

},3500);

introSkip.addEventListener('click', closeInvitationIntro);
introSkip.addEventListener('touchstart', closeInvitationIntro, { passive: true });

const toast = document.getElementById('toast');
    function showToast(text) { toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800) }

    const galleryImages = [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1170&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=801&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=801&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=801&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=801&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=801&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=802&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?q=80&w=801&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=801&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=802&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=802&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=802&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=802&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=803&auto=format&fit=crop'
    ];

    const strip = document.getElementById('galleryStrip');
    const mainImage = document.getElementById('mainGalleryImage');
    galleryImages.forEach((src, i) => {
      const b = document.createElement('button'); b.className = 'gallery-thumb' + (i === 0 ? ' active' : ''); b.innerHTML = `<img src="${src}" alt="기록 ${i + 1}">`;
      b.addEventListener('click', () => { mainImage.src = src; document.querySelectorAll('.gallery-thumb').forEach(x => x.classList.remove('active')); b.classList.add('active') });
      strip.appendChild(b);
    });

    document.querySelectorAll('[data-scroll]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.scroll).scrollIntoView({ behavior: 'smooth' })));
    document.querySelector('[data-scroll="home"]').addEventListener('click', async () => { try { await navigator.clipboard.writeText(location.href); showToast('복사가 완료되었습니다') } catch (e) { showToast('복사에 실패했습니다') } });


    const accounts = {
      groom: [
        ['신랑', '국민은행 123-456-789012', '이성연'],
        ['신랑 아버지', '국민은행 111-222-333333', '이용훈'],
        ['신랑 어머니', '신한은행 444-555-666666', '조점희']
      ],
      bride: [
        ['신부', '신한은행 987-654-321098', '허유진'],
        ['신부 아버지', '우리은행 222-333-444444', '허봉행'],
        ['신부 어머니', '하나은행 555-666-777777', '정순월']
      ]
    };

    const inlineAccountList = document.getElementById('inlineAccountList');
    const accountButtons = document.querySelectorAll('[data-account-side]');
    let currentAccountSide = '';

    function showInlineAccounts(type) {
      const isSameSide =
        currentAccountSide === type &&
        inlineAccountList.classList.contains('show');

      accountButtons.forEach(button => {
        button.classList.toggle(
          'active',
          button.dataset.accountSide === type && !isSameSide
        );
      });

      if (isSameSide) {
        inlineAccountList.classList.remove('show');
        inlineAccountList.innerHTML = '';
        currentAccountSide = '';
        return;
      }

      inlineAccountList.innerHTML = accounts[type].map(([label, number, name]) => `
        <div class="inline-account-card">
          <div>
            <div class="inline-account-label">${label}</div>
            <div class="inline-account-name">${name}</div>
            <div class="inline-account-number">${number}</div>
          </div>
          <button class="inline-copy-account" type="button" data-account="${number}">
            복사
          </button>
        </div>
      `).join('');

      inlineAccountList.querySelectorAll('.inline-copy-account').forEach(button => {
        button.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(button.dataset.account);
            showToast('복사가 완료되었습니다');
          } catch (error) {
            showToast('복사에 실패했습니다');
          }
        });
      });

      currentAccountSide = type;
      inlineAccountList.classList.add('show');
    }

    accountButtons.forEach(button => {
      button.addEventListener('click', () => {
        showInlineAccounts(button.dataset.accountSide);
      });
    });

    const modal = document.getElementById('rsvpModal'), rsvpState = { side: '', name: '', attendance: '', companions: '', meals: '' };
    function updateSubmit() { document.getElementById('submitRsvp').disabled = !(rsvpState.side && rsvpState.name.trim() && rsvpState.attendance && rsvpState.companions && rsvpState.meals) }
    document.querySelectorAll('.choice-grid').forEach(group => {
      if (group.dataset.group === 'companions' || group.dataset.group === 'meals') {
        const select = document.createElement('select');
        select.className = 'data-select';
        select.innerHTML = '<option value="">선택해주세요</option>';
        const start = group.dataset.group === 'companions' ? 0 : 1;
        for (let i = start; i <= 6; i++) { const option = document.createElement('option'); option.value = i; option.textContent = i + '명'; select.appendChild(option) }
        group.replaceWith(select);
        select.addEventListener('change', () => { rsvpState[select.className.includes('data-select') ? (group.dataset.group) : group.dataset.group] = select.value; updateSubmit() });
      } else group.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { group.querySelectorAll('button').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); rsvpState[group.dataset.group] = b.dataset.value; updateSubmit() }));
    });
    document.getElementById('rsvpName').addEventListener('input', e => { rsvpState.name = e.target.value; updateSubmit() });
    document.getElementById('rsvpBtn').addEventListener('click', () => modal.classList.add('show'));
    document.getElementById('closeRsvp').addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show') });

    document.getElementById('submitRsvp').addEventListener('click', async () => {
      const payload = { side: rsvpState.side, name: rsvpState.name, attendance: rsvpState.attendance, companions: rsvpState.companions, meals: rsvpState.meals };
      const GOOGLE_SHEETS_WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
      try {
        if (GOOGLE_SHEETS_WEB_APP_URL.startsWith('http')) await fetch(GOOGLE_SHEETS_WEB_APP_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        modal.classList.remove('show'); showToast('전달이 완료되었습니다');
      } catch (e) { showToast('전달에 실패했습니다') }
    });

    document.getElementById('post').addEventListener('click', () => { const n = document.getElementById('name').value.trim(), m = document.getElementById('message').value.trim(); if (!n || !m) { showToast('성함과 메시지를 입력해주세요'); return } const card = document.createElement('div'); card.className = 'message-card'; card.innerHTML = '<b>' + n.replace(/[<>&"]/g, '') + '</b><p>' + m.replace(/[<>&"]/g, '') + '</p>'; document.getElementById('messages').prepend(card); document.getElementById('name').value = ''; document.getElementById('message').value = ''; showToast('축하 메시지가 등록되었습니다') });
