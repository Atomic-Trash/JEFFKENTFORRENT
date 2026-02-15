export function initAnimations() {
  initReveal()
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
