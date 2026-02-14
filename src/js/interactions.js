export function initAnimations() {
  initReveal()
  initLensGlow()
  initCardTilt()
  initOrbParallax()
}

/* ==========================================================
   Reveal — blur-to-sharp entrance cascade
   ========================================================== */

function initReveal() {
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
   Lens Glow — mouse-follow radial light
   ========================================================== */

function initLensGlow() {
  if (!window.matchMedia('(hover: hover)').matches) return

  const page = document.querySelector('.page')
  const glow = document.querySelector('.lens-glow')
  if (!page || !glow) return

  let rafId = null

  page.addEventListener('mouseenter', () => {
    glow.classList.add('lens-glow--active')
  })

  page.addEventListener('mouseleave', () => {
    glow.classList.remove('lens-glow--active')
  })

  page.addEventListener('mousemove', (e) => {
    if (rafId) return

    rafId = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px')
      document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px')
      rafId = null
    })
  })
}

/* ==========================================================
   Card Tilt — 3D perspective follows cursor
   ========================================================== */

function initCardTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return

  const cards = document.querySelectorAll('.card')
  const MAX_TILT = 3 // degrees

  cards.forEach((card) => {
    let rafId = null

    card.addEventListener('mousemove', (e) => {
      if (rafId) return

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height

        // Center around 0: -1 to 1
        const tiltX = (0.5 - y) * MAX_TILT * 2
        const tiltY = (x - 0.5) * MAX_TILT * 2

        card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
        rafId = null
      })
    })

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      card.style.transform = 'rotateX(0deg) rotateY(0deg)'

      // Reset transition after settle so mousemove feels responsive
      setTimeout(() => {
        card.style.transition = ''
      }, 400)
    })
  })
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
