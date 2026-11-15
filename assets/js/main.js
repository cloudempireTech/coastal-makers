/**
 * Coastal Makers - Main Interactive Engine
 * Precision 3D Printing & Bespoke Decor - Sydney, NSW
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });

    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      }
    });
  }

  // 2. Dynamic Typewriter Headline
  const typewriterEl = document.querySelector('.dynamic-typewriter');
  if (typewriterEl) {
    const phrases = [
      "Precision 3D Craft.",
      "Coastal Parametric Décor.",
      "Architectural Prototypes.",
      "Topographic Art & Lighting."
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function typeLoop() {
      const current = phrases[phraseIdx];
      if (isDeleting) {
        typewriterEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 45;
      } else {
        typewriterEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 85;
      }

      if (!isDeleting && charIdx === current.length) {
        isDeleting = true;
        typeSpeed = 1600; // Pause at end
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(typeLoop, typeSpeed);
    }
    typeLoop();
  }

  // 3. Telemetry Stat Counter
  const counters = document.querySelectorAll('.stat-counter');
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endVal = parseFloat(target.getAttribute('data-target'));
          const suffix = target.getAttribute('data-suffix') || '';
          const prefix = target.getAttribute('data-prefix') || '';
          const decimals = parseInt(target.getAttribute('data-decimals') || '0', 10);
          let current = 0;
          const duration = 1400;
          const steps = 30;
          const increment = endVal / steps;
          const stepTime = duration / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= endVal) {
              current = endVal;
              clearInterval(timer);
            }
            target.textContent = prefix + (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;
          }, stepTime);

          observer.unobserve(target);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  }

  // 4. Interactive 3D Dimensional & Material Estimator
  const lengthInput = document.getElementById('dimLength');
  const widthInput = document.getElementById('dimWidth');
  const heightInput = document.getElementById('dimHeight');
  const materialSelect = document.getElementById('calcMaterial');
  const infillSelect = document.getElementById('calcInfill');
  const estWeightEl = document.getElementById('estWeight');
  const estHoursEl = document.getElementById('estHours');
  const estResEl = document.getElementById('estRes');
  const estEcoEl = document.getElementById('estEco');
  const calcWaBtn = document.getElementById('calcWaInquireBtn');

  function calculatePrintMetrics() {
    if (!lengthInput || !widthInput || !heightInput || !materialSelect || !infillSelect) return;

    const l = Math.max(1, parseFloat(lengthInput.value) || 10);
    const w = Math.max(1, parseFloat(widthInput.value) || 10);
    const h = Math.max(1, parseFloat(heightInput.value) || 10);

    // Bounding box volume in cm3
    const boundingVol = l * w * h;
    // Typical hollow / shell ratio for decorative prints ~ 18-25%
    const solidRatio = 0.22;
    
    // Infill multiplier
    const infillFactor = parseFloat(infillSelect.value) || 0.20;
    
    // Effective volume (shell + infill)
    const effectiveVol = boundingVol * (solidRatio + (1 - solidRatio) * (infillFactor * 0.45));

    // Material density in g/cm3
    const densityMap = {
      'pla_silk': { density: 1.24, name: 'Silk Bio-PLA', eco: '100% Plant-Based' },
      'petg_marine': { density: 1.27, name: 'Marine PETG', eco: 'UV & Ocean Rated' },
      'sandstone': { density: 1.45, name: 'Sandstone Composite', eco: 'Mineral Enriched' },
      'wood_polymer': { density: 1.15, name: 'Timber Bio-Polymer', eco: '40% Pine Fiber' }
    };

    const matInfo = densityMap[materialSelect.value] || densityMap['pla_silk'];
    const totalGrams = Math.round(effectiveVol * matInfo.density);
    const cappedGrams = Math.max(15, Math.min(totalGrams, 3500));

    // Print time estimate: roughly 14-20 grams per hour on modern high-speed CoreXY
    const printHours = (cappedGrams / 18.5) + (h * 0.15);
    const hoursFormatted = printHours < 1 ? '< 1 hr' : Math.round(printHours) + ' hrs';

    if (estWeightEl) estWeightEl.textContent = cappedGrams + 'g';
    if (estHoursEl) estHoursEl.textContent = hoursFormatted;
    if (estEcoEl) estEcoEl.textContent = matInfo.eco;
    if (estResEl) estResEl.textContent = h > 20 ? '0.16mm High Speed' : '0.08mm Ultra Detail';

    if (calcWaBtn) {
      const msg = `Hi Coastal Makers! I estimated a custom 3D print on your site:%0A%0A` +
        `• Dimensions: ${l}cm x ${w}cm x ${h}cm%0A` +
        `• Material: ${matInfo.name}%0A` +
        `• Infill: ${infillSelect.options[infillSelect.selectedIndex].text}%0A` +
        `• Est. Weight: ~${cappedGrams}g%0A` +
        `• Est. Print Time: ${hoursFormatted}%0A%0A` +
        `Could you provide advice or a quote on producing this in Sydney?`;
      calcWaBtn.href = `https://wa.me/61424454918?text=${msg}`;
    }
  }

  [lengthInput, widthInput, heightInput, materialSelect, infillSelect].forEach(input => {
    if (input) {
      input.addEventListener('input', calculatePrintMetrics);
      input.addEventListener('change', calculatePrintMetrics);
    }
  });

  // Run initial calculation
  calculatePrintMetrics();

  // 5. Contact Form WhatsApp Submission
  const contactForm = document.getElementById('coastalContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cfName')?.value || 'Customer';
      const phone = document.getElementById('cfPhone')?.value || '';
      const projectType = document.getElementById('cfType')?.value || 'Custom 3D Print';
      const details = document.getElementById('cfDetails')?.value || '';

      const msg = `Hi Coastal Makers,%0A%0A` +
        `I would like to discuss a 3D printing project:%0A` +
        `• Name: ${encodeURIComponent(name)}%0A` +
        `• Phone: ${encodeURIComponent(phone)}%0A` +
        `• Project Type: ${encodeURIComponent(projectType)}%0A` +
        `• Details: ${encodeURIComponent(details)}%0A%0A` +
        `Looking forward to hearing from your Sydney workshop!`;

      window.open(`https://wa.me/61424454918?text=${msg}`, '_blank');
    });
  }
});
