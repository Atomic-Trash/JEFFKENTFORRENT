export function initAnimations() {
  document.documentElement.classList.add('js-loaded')
  initReveal()
  initOrbParallax()
  initCardsInteractive()
}

/* ==========================================================
   Reveal — blur-to-sharp entrance cascade
   ========================================================== */

function initReveal() {
  // Split header name for stagger
  const headerName = document.querySelector('.header__name')
  if (headerName && !headerName.classList.contains('split-done')) {
    const text = headerName.textContent
    headerName.textContent = ''
    headerName.classList.add('split-done')
    
    ;[...text].forEach((char, i) => {
      const span = document.createElement('span')
      span.textContent = char
      // Add non-breaking space for actual spaces to preserve layout
      if (char === ' ') span.innerHTML = '&nbsp;'
      span.style.setProperty('--char-index', i)
      span.classList.add('char')
      headerName.appendChild(span)
    })
  }

  // Sections and top-level elements
  const sections = document.querySelectorAll('.header, .tagline, .section, .footer')
  // Individual cards for staggered cascade
  const cards = document.querySelectorAll('.card')

  const allRevealable = [...sections, ...cards]

  allRevealable.forEach((el) => el.classList.add('reveal'))

  let index = 0

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          const delay = index * 80
          index++

          setTimeout(() => {
            el.classList.add('reveal--visible')
          }, delay)

          // Clean up will-change after animation settles
          setTimeout(() => {
            el.style.willChange = 'auto'
          }, delay + 800)

          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.1 }
  )

  allRevealable.forEach((el) => observer.observe(el))
}

/* ==========================================================
   Orb Parallax — scroll-driven depth layering
   ========================================================== */

function initOrbParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // Skip on small screens where orbs are static
  if (window.innerWidth <= 480) return

  const orbs = document.querySelectorAll('.orb')
  if (!orbs.length) return

  // Different speeds for each orb — creates depth
  const multipliers = [0.08, -0.05, 0.06, -0.04]
  let rafId = null

  function updateParallax() {
    const scrollY = window.scrollY

    orbs.forEach((orb, i) => {
      const offset = scrollY * (multipliers[i] || 0.05)
      orb.style.setProperty('--parallax-y', offset + 'px')
    })

    rafId = null
  }

  window.addEventListener('scroll', () => {
    if (rafId) return
    rafId = requestAnimationFrame(updateParallax)
  }, { passive: true })
}

/* ==========================================================
   Advanced Card Interactions — 3D Tilt & Spotlight
   ========================================================== */

function initCardsInteractive() {
  const cards = document.querySelectorAll('.card')

  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect()
      
      // Calculate cursor position relative to the card (0 to 1)
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      
      // Set properties for the spotlight glow
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
      
      // Calculate 3D tilt angles (max tilt usually ~10deg)
      const tiltX = (y - 0.5) * -10
      const tiltY = (x - 0.5) * 10
      
      card.style.setProperty('--tilt-x', `${tiltX}deg`)
      card.style.setProperty('--tilt-y', `${tiltY}deg`)
    })
    
    // Reset on leave
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg')
      card.style.setProperty('--tilt-y', '0deg')
    })
  })
}
