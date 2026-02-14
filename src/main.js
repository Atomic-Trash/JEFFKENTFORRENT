import '@fontsource-variable/sora'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'

import './styles/reset.css'
import './styles/variables.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/effects.css'
import './styles/responsive.css'

import { initAnimations } from './js/interactions.js'

document.addEventListener('DOMContentLoaded', initAnimations)
