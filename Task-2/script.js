// Basic carousel and modal behaviors
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileBtn?.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

  // Infinite carousel helper: clones first/last slides, handles wrap-around, and supports swipe
  function createInfiniteCarousel(containerSelector, trackSelector, prevBtnSel, nextBtnSel) {
    const container = document.querySelector(containerSelector);
    if (!container) return null;
    const track = container.querySelector(trackSelector);
    const prevBtn = document.querySelector(prevBtnSel);
    const nextBtn = document.querySelector(nextBtnSel);
    if (!track) return null;

    // Clone slides
    const slides = Array.from(track.children);
    if (slides.length === 0) return null;
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.dataset.clone = 'first';
    lastClone.dataset.clone = 'last';
    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    let index = 1; // start at real first
    let isTransitioning = false;

    // compute slide width (slide + gap) based on first real slide (with fallback to container width)
    function getSlideWidth() {
      const s = track.children[1];
      if (!s) return container.clientWidth;
      const rect = s.getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const width = (rect.width || container.clientWidth) + gap;
      return width;
    }

    // Transition fallback to ensure we always clear transition lock
    const TRANSITION_TIMEOUT = 700; // ms
    let transitionFallback = null;

    function slideTo(i, withTransition = true) {
      const slideW = getSlideWidth();
      if (withTransition) {
        track.style.transition = 'transform 0.4s ease';
        clearTimeout(transitionFallback);
        transitionFallback = setTimeout(() => {
          // If 'transitionend' didn't fire, trigger fallback event handler
          track.dispatchEvent(new Event('transitionendFallback'));
        }, TRANSITION_TIMEOUT);
      } else {
        track.style.transition = 'none';
      }
      track.style.transform = `translateX(-${i * slideW}px)`;
    }

    // Initialize position (no transition)
    slideTo(index, false);

    // Handlers for buttons
    prevBtn?.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      index -= 1;
      slideTo(index, true);
    });
    nextBtn?.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      index += 1;
      slideTo(index, true);
    });

    // Swipe support (pointer events)
    let isDragging = false;
    let startX = 0;
    let activePointerId = null;
    track.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      activePointerId = e.pointerId;
      track.style.transition = 'none';
      try { track.setPointerCapture(e.pointerId); } catch (err) { /* ignore if not supported */ }
    });
    track.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const slideW = getSlideWidth();
      track.style.transform = `translateX(-${index * slideW - dx}px)`;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(evt => {
      track.addEventListener(evt, (e) => {
        if (!isDragging) return;
        isDragging = false;
        try { if (activePointerId != null) track.releasePointerCapture(activePointerId); } catch (err) { /* ignore */ }
        activePointerId = null;
        const dx = e.clientX - startX;
        const threshold = Math.min(80, getSlideWidth() * 0.15);
        if (dx > threshold) index -= 1;
        else if (dx < -threshold) index += 1;
        slideTo(index, true);
      });
    });

    // When transition ends (or fallback), if we're on a clone, jump to the real slide without animation
    function handleTransitionEnd() {
      clearTimeout(transitionFallback);
      const children = track.children;
      const current = children[index];
      if (current && current.dataset.clone === 'last') {
        // we are at the cloned last (which is at index 0), jump to real last
        index = children.length - 2;
        slideTo(index, false);
      } else if (current && current.dataset.clone === 'first') {
        // we are at the cloned first (which is at last index), jump to real first
        index = 1;
        slideTo(index, false);
      }
      // Reset transition lock
      setTimeout(() => { isTransitioning = false; }, 20);
    }
    track.addEventListener('transitionend', handleTransitionEnd);
    track.addEventListener('transitionendFallback', handleTransitionEnd);

    // On resize, reposition without transition
    window.addEventListener('resize', () => slideTo(index, false));

    return {
      next: () => nextBtn?.click(),
      prev: () => prevBtn?.click(),
      autoNext: () => { if (!isTransitioning) nextBtn?.click(); },
      getTransitioning: () => isTransitioning,
    };
  }

  // Create infinite carousels for deals and plans
  const dealsCarousel = createInfiniteCarousel('#deals-carousel', '.carousel-track', '.btn-prev', '.btn-next');
  const plansCarousel = createInfiniteCarousel('#plans-carousel', '.plan-track', '#plan-prev', '#plan-next');

  // Auto-advance periodically, respecting transition state
  setInterval(() => {
    dealsCarousel?.autoNext();
    plansCarousel?.autoNext();
  }, 7000);

  // Booking modal
  const bookingModal = document.getElementById('booking-modal');
  const modalDestination = document.getElementById('modal-destination').querySelector('span');
  const closeModal = document.getElementById('close-modal');
  const cancelBook = document.getElementById('cancel-book');
  function openModal(destination, price) {
    modalDestination.textContent = `${destination} — Rs${price}`;
    bookingModal.setAttribute('aria-hidden', 'false');
    bookingModal.classList.remove('hidden');
    bookingModal.classList.add('flex');
    // focus the first input
    document.querySelector('#booking-form input[name="name"]')?.focus();
  }
  function closeBooking() {
    bookingModal.setAttribute('aria-hidden', 'true');
    bookingModal.classList.add('hidden');
    bookingModal.classList.remove('flex');
  }
  // Delegate booking clicks so cloned slides are handled too
  document.addEventListener('click', (e) => {
    const el = e.target.closest('.book-btn, .deal-img');
    if (!el) return;
    const dest = el.dataset.destination || el.getAttribute('data-destination');
    const price = el.dataset.price || el.getAttribute('data-price');
    openModal(dest, price);
  });
  closeModal?.addEventListener('click', closeBooking);
  cancelBook?.addEventListener('click', closeBooking);

  // Submit booking
  document.getElementById('booking-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Booking confirmed! We will email you shortly.');
    closeBooking();
  });

  // Subscribe form
  const subscribeForm = document.getElementById('subscribe-form');
  subscribeForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('subscribe-email').value;
    if (email) {
      document.getElementById('subscribe-msg').classList.remove('hidden');
      subscribeForm.reset();
    }
  });

  // Simple search action
  document.getElementById('searchBtn')?.addEventListener('click', () => {
    const val = document.getElementById('search').value.trim();
    if (val) alert(`Searching deals for: ${val}`);
  });


});