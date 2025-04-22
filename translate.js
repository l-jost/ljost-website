// Function to fetch translation data
async function fetchTranslations (lang) {
  try {
    const response = await fetch(`locales/${lang}.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Could not fetch translations:', error)
    // Fallback to English if the requested language fails
    if (lang !== 'en') {
      return await fetchTranslations('en')
    }
    return {}
  }
}

// Function to apply translations to the page
function applyTranslations (translations) {
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate')
    if (translations[key]) {
      // Handle different element types appropriately
      if (element.classList.contains('menu-toggle')) { // Check for menu toggle button
        if (element.hasAttribute('aria-label')) {
          element.setAttribute('aria-label', translations[key])
        }
      } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') { // Keep existing logic for inputs/textareas
        if (element.placeholder) {
          element.placeholder = translations[key]
        }
      } else if (element.tagName === 'IMG') { // Keep existing logic for images
        if (element.alt) {
          element.alt = translations[key]
        }
      } else { // Default case: update innerHTML for other elements
        element.innerHTML = translations[key]
      }
    } else {
      console.warn(`Translation key "${key}" not found.`)
    }
  })
  // Update the lang attribute of the html tag
  const currentLang = localStorage.getItem('language') || 'en'
  document.documentElement.lang = currentLang
}

// Function to change language and reload translations
async function changeLanguage (lang) {
  console.log(`Attempting to change language to: ${lang}`)
  localStorage.setItem('language', lang) // Store preference
  const translations = await fetchTranslations(lang)
  if (Object.keys(translations).length > 0) {
    applyTranslations(translations)
    console.log(`Language changed to ${lang}`)
  } else {
    console.error(`Failed to load translations for ${lang}.`)
  }
}

// Function to set up language switcher listeners
function setupLanguageSwitcher () {
  const langEnButton = document.getElementById('lang-en')
  const langDeButton = document.getElementById('lang-de')

  if (langEnButton) {
    langEnButton.addEventListener('click', (e) => {
      e.preventDefault()
      console.log('EN button clicked')
      changeLanguage('en')
    })
  } else {
    console.warn('EN language button not found')
  }

  if (langDeButton) {
    langDeButton.addEventListener('click', (e) => {
      e.preventDefault()
      console.log('DE button clicked')
      changeLanguage('de')
    })
  } else {
    console.warn('DE language button not found')
  }
}

// Initial load: Detect language and apply translations
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed')
  // Check local storage first, then browser preference, default to 'en'
  let currentLang = localStorage.getItem('language') // Check localStorage FIRST
  if (!currentLang) { // If nothing in localStorage...
    console.log('No language found in localStorage, checking browser preference.')
    const browserLang = navigator.language.split('-')[0] // Get 'en' from 'en-US'
    currentLang = ['en', 'de'].includes(browserLang) ? browserLang : 'en' // Determine based on browser
    localStorage.setItem('language', currentLang) // Store the detected language for future loads
    console.log(`Browser language detected: ${browserLang}, setting initial language to: ${currentLang}`)
  } else {
    console.log(`Language found in localStorage: ${currentLang}`)
  }

  // Apply translations based on the determined language (either from localStorage or browser detection)
  const translations = await fetchTranslations(currentLang)
  applyTranslations(translations)
  console.log(`Applied translations for: ${currentLang}`)

  // Set up the language switcher listeners
  setupLanguageSwitcher()
})
