/**
 * Internationalization + Auto IP-based language detection
 */

const LANG_CONFIG = {
  supported: ['en', 'ar', 'tr', 'fr'],
  default: 'ar',
  rtl: ['ar'],
  // Country-code -> language mapping (common Middle East / North Africa / Europe)
  countryMap: {
    SA: 'ar', AE: 'ar', QA: 'ar', KW: 'ar', BH: 'ar', OM: 'ar',
    EG: 'ar', IQ: 'ar', JO: 'ar', LB: 'ar', SY: 'ar', YE: 'ar',
    SD: 'ar', DZ: 'ar', MA: 'ar', TN: 'ar', LY: 'ar', MR: 'ar',
    PS: 'ar', SO: 'ar', DJ: 'ar', KM: 'ar',
    TR: 'tr',
    FR: 'fr', BE: 'fr', CH: 'fr', CA: 'fr', LU: 'fr',
    US: 'en', GB: 'en', CA_EN: 'en', AU: 'en', NZ: 'en'
  }
};

let currentTranslations = {};
let fallbackTranslations = {};

async function loadLocale(lang) {
  try {
    const res = await fetch(`locales/${lang}.json`);
    if (!res.ok) throw new Error('Locale not found');
    return await res.json();
  } catch (e) {
    console.warn('Failed to load locale', lang, e);
    return {};
  }
}

function applyTranslations(lang, dict) {
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', LANG_CONFIG.rtl.includes(lang) ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    let text = dict[key];
    if (text === undefined || text === null || text === '') {
      text = fallbackTranslations[key] !== undefined ? fallbackTranslations[key] : el.innerHTML;
    }
    // Use innerHTML so that \u003cbr\u003e and other simple HTML entities render correctly
    el.innerHTML = text;
  });

  // Update select value
  const select = document.getElementById('lang-select');
  if (select) select.value = lang;
}

async function setLanguage(lang) {
  if (!LANG_CONFIG.supported.includes(lang)) lang = LANG_CONFIG.default;

  const dict = await loadLocale(lang);
  if (Object.keys(dict).length === 0 && lang !== LANG_CONFIG.default) {
    // If chosen locale empty, fallback to English
    await setLanguage(LANG_CONFIG.default);
    return;
  }

  currentTranslations = dict;
  applyTranslations(lang, currentTranslations);
  localStorage.setItem('site-lang', lang);
}

async function detectLanguageByIP() {
  // 1. Check saved preference first
  const saved = localStorage.getItem('site-lang');
  if (saved && LANG_CONFIG.supported.includes(saved)) {
    return saved;
  }

  // 2. Try multiple IP detection services
  const detectors = [
    async () => {
      const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return (data.country_code || '').toUpperCase();
    },
    async () => {
      const res = await fetch('https://ipwho.is/?fields=country_code', { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return (data.country_code || '').toUpperCase();
    },
    async () => {
      const res = await fetch('https://get.geojs.io/v1/ip/country.json', { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return (data.country || '').toUpperCase();
    }
  ];

  for (const detect of detectors) {
    try {
      const country = await detect();
      if (country && LANG_CONFIG.countryMap[country]) {
        return LANG_CONFIG.countryMap[country];
      }
    } catch (e) {
      console.warn('One IP detector failed, trying next...', e);
    }
  }

  // 3. Default language (Arabic)
  return LANG_CONFIG.default;
}

async function initI18n() {
  // Preload fallback (English)
  fallbackTranslations = await loadLocale(LANG_CONFIG.default);

  const lang = await detectLanguageByIP();
  await setLanguage(lang);

  // Bind language switcher
  const select = document.getElementById('lang-select');
  if (select) {
    select.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
