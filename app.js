document.addEventListener('DOMContentLoaded', () => {
  // ── PROGRESS BAR ──
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  });

  // ── REVEAL ON SCROLL ──
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
        // Once revealed, no need to observe again
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Also reveal event cards
  const eventCards = document.querySelectorAll('.event-card');
  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });
  
  eventCards.forEach(card => cardObserver.observe(card));

  // ── FLOATING LANTERNS ──
  const lanternLayer = document.getElementById('lantern-layer');
  const lanternSvg = `
  <svg width="30" height="45" viewBox="0 0 30 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 2L18 7H12L15 2Z" fill="#C9A84C"/>
    <path d="M8 12C8 8.13401 11.134 5 15 5C18.866 5 22 8.13401 22 12V14H8V12Z" fill="#C9A84C" opacity="0.8"/>
    <path d="M6 14H24L21 34H9L6 14Z" fill="url(#lantern-glow)" stroke="#C9A84C" stroke-width="1.2"/>
    <path d="M9 34L15 42L21 34H9Z" fill="#C9A84C"/>
    <defs>
      <radialGradient id="lantern-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFF5D6" stop-opacity="1"/>
        <stop offset="60%" stop-color="#E8C870" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#C9A84C" stop-opacity="0.15"/>
      </radialGradient>
    </defs>
  </svg>
  `;

  function spawnLantern() {
    // Limit active lanterns to maintain performance
    if (lanternLayer.children.length > 25) {
      lanternLayer.removeChild(lanternLayer.firstChild);
    }

    const lantern = document.createElement('div');
    lantern.className = 'lantern';
    lantern.innerHTML = `<div class="lantern-inner">${lanternSvg}</div>`;

    // Randomize initial properties
    const startX = Math.random() * 100; // 0% to 100% width
    const duration = 12 + Math.random() * 15; // 12s to 27s
    const delay = Math.random() * 2; // 0s to 2s delay
    const scale = 0.4 + Math.random() * 0.7; // 0.4x to 1.1x scale
    const maxOp = 0.3 + Math.random() * 0.5; // 0.3 to 0.8 opacity
    const swayAmount = 10 + Math.random() * 25; // 10px to 35px sway
    const drift = (Math.random() - 0.5) * 80; // horizontal drift

    // Apply inline styles utilizing CSS variables
    lantern.style.left = `${startX}%`;
    lantern.style.bottom = `-50px`;
    lantern.style.opacity = '0';
    
    // Set custom CSS variables for keyframe usage
    lantern.style.setProperty('--duration', `${duration}s`);
    lantern.style.setProperty('--delay', `${delay}s`);
    lantern.style.setProperty('--max-op', maxOp);
    lantern.style.setProperty('--sway-amount', `${swayAmount}px`);
    lantern.style.setProperty('--scale', scale);
    lantern.style.setProperty('--drift', `${drift}px`);

    lantern.style.animation = `floatUp var(--duration) var(--delay) linear infinite`;

    lanternLayer.appendChild(lantern);
  }

  // Pre-populate some lanterns at different heights
  for (let i = 0; i < 12; i++) {
    spawnLantern();
    // Offset their animation states manually
    const lastLantern = lanternLayer.lastChild;
    const startHeight = Math.random() * 100;
    lastLantern.style.bottom = `${startHeight}vh`;
  }

  // Continuously spawn new lanterns
  setInterval(spawnLantern, 2500);

  // ── COUNTDOWN TIMER ──
  // Target date: November 20, 2026 12:00:00 UTC (Adjust to standard wedding time)
  const targetDate = new Date('May 30, 2026 11:00:00').getTime();

  const daysVal = document.getElementById('days');
  const hoursVal = document.getElementById('hours');
  const minutesVal = document.getElementById('minutes');
  const secondsVal = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      if (daysVal) daysVal.innerText = '00';
      if (hoursVal) hoursVal.innerText = '00';
      if (minutesVal) minutesVal.innerText = '00';
      if (secondsVal) secondsVal.innerText = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysVal) daysVal.innerText = String(days).padStart(2, '0');
    if (hoursVal) hoursVal.innerText = String(hours).padStart(2, '0');
    if (minutesVal) minutesVal.innerText = String(minutes).padStart(2, '0');
    if (secondsVal) secondsVal.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const rsvpForm = document.getElementById('rsvp-form');
  const attendanceSelect = document.getElementById('attendance-status');
  const guestsGroup = document.getElementById('guests-count-group');
  const guestsSelect = document.getElementById('guests-count');
  const rsvpSubmitBtn = document.getElementById('rsvp-submit-btn');
  const rsvpWhatsAppBtn = document.getElementById('rsvp-whatsapp-btn');
  const rsvpStatus = document.getElementById('rsvp-status');

  function getRsvpFormData() {
    const name = document.getElementById('guest-name').value.trim();
    const email = document.getElementById('guest-email').value.trim();
    const attendance = attendanceSelect.value;
    const guests = attendance === 'declined' ? 0 : parseInt(guestsSelect.value, 10);
    const message = document.getElementById('guest-message').value.trim();

    if (!name || !attendance) {
      return null;
    }

    return {
      name,
      email: email || 'Not Provided',
      attendance,
      guests,
      message: message || 'No message left.'
    };
  }

  async function updateStatus(status, text) {
    if (!rsvpStatus) return;
    rsvpStatus.style.display = 'block';
    rsvpStatus.className = `form-status-msg ${status}`;
    rsvpStatus.innerHTML = text;
  }

  async function submitRsvp(rsvpData) {
    const response = await fetch('/api/rsvps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rsvpData)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || 'Unable to submit RSVP.');
    }

    return response.json();
  }

  function buildWhatsAppUrl(rsvpData) {
    const text = encodeURIComponent(
      `Hi MUSTHAQ AHAMMED and AFNAN CT!%0A%0A` +
      `Name: ${rsvpData.name}%0A` +
      `Email: ${rsvpData.email}%0A` +
      `Attendance: ${rsvpData.attendance}%0A` +
      `Guests: ${rsvpData.guests}%0A` +
      `Message: ${rsvpData.message}`
    );
    return `https://api.whatsapp.com/send?phone=917356352567&text=${text}`;
  }

  function resetForm() {
    rsvpForm.reset();
    guestsGroup.style.display = 'block';
    guestsSelect.setAttribute('required', 'required');
  }

  if (rsvpForm) {
    attendanceSelect.addEventListener('change', () => {
      if (attendanceSelect.value === 'declined') {
        guestsGroup.style.display = 'none';
        guestsSelect.removeAttribute('required');
      } else {
        guestsGroup.style.display = 'block';
        guestsSelect.setAttribute('required', 'required');
      }
    });

    async function handleSubmit(isWhatsApp) {
      const rsvpData = getRsvpFormData();
      if (!rsvpData) {
        updateStatus('error', 'Please enter your name and attendance before submitting.');
        return;
      }

      rsvpSubmitBtn.disabled = true;
      if (rsvpWhatsAppBtn) rsvpWhatsAppBtn.disabled = true;
      await updateStatus('loading', 'Sending your response...');

      let whatsappWindow = null;
      if (isWhatsApp) {
        whatsappWindow = window.open('', '_blank');
      }

      try {
        await submitRsvp(rsvpData);
        resetForm();

        if (isWhatsApp) {
          const whatsappUrl = buildWhatsAppUrl(rsvpData);
          if (whatsappWindow) {
            whatsappWindow.location = whatsappUrl;
          } else {
            window.open(whatsappUrl, '_blank');
          }
        }

        await updateStatus('success', 'Thank you! Your RSVP response has been saved. <a href="responses.html" class="back-link">View response details</a>');
      } catch (error) {
        console.error('RSVP submission error:', error);
        await updateStatus('error', 'Unable to submit. Please try again or use WhatsApp directly.');
      } finally {
        rsvpSubmitBtn.disabled = false;
        if (rsvpWhatsAppBtn) rsvpWhatsAppBtn.disabled = false;
      }
    }

    rsvpForm.addEventListener('submit', async event => {
      event.preventDefault();
      await handleSubmit(false);
    });

    if (rsvpWhatsAppBtn) {
      rsvpWhatsAppBtn.addEventListener('click', async () => {
        await handleSubmit(true);
      });
    }
  }
});
