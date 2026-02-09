export function initAnimations() {
  initFadeIn()
  initLensGlow()
}

function initFadeIn() {
  const animatedElements = document.querySelectorAll(
    '.header, .tagline, .section, .footer'
  )

  animatedElements.forEach((el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(12px)'
    el.style.transition =
      'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          const delay =
            Array.from(animatedElements).indexOf(el) * 80
          setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          }, delay)
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.1 }
  )

  animatedElements.forEach((el) => observer.observe(el))
}

function initLensGlow() {
  // Only enable on devices with hover capability (no touch)
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
