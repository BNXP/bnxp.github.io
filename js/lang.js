/**
 * Internationalization — Browser + IP-based language detection
 * Supported: ar, en, tr, ur  ·  Default: ar
 * RTL: ar, ur
 */

const LANG_CONFIG = {
  supported: ['ar', 'en', 'tr', 'ur'],
  default: 'ar',
  rtl: ['ar', 'ur'],
  // Map browser language codes → our supported codes
  browserMap: {
    'ar': 'ar', 'ar-sa': 'ar', 'ar-eg': 'ar', 'ar-iq': 'ar', 'ar-jo': 'ar',
    'ar-lb': 'ar', 'ar-kw': 'ar', 'ar-ae': 'ar', 'ar-qa': 'ar', 'ar-bh': 'ar',
    'ar-om': 'ar', 'ar-ye': 'ar', 'ar-sy': 'ar', 'ar-dz': 'ar', 'ar-ma': 'ar',
    'ar-tn': 'ar', 'ar-ly': 'ar', 'ar-sd': 'ar', 'ar-so': 'ar', 'ar-mr': 'ar',
    'ar-dj': 'ar', 'ar-km': 'ar', 'ar-ps': 'ar', 'ar-td': 'ar', 'ar-mr': 'ar',
    'en': 'en', 'en-us': 'en', 'en-gb': 'en', 'en-au': 'en', 'en-ca': 'en',
    'en-nz': 'en', 'en-ie': 'en', 'en-in': 'en', 'en-za': 'en', 'en-ng': 'en',
    'en-ph': 'en', 'en-sg': 'en', 'en-my': 'en', 'tr': 'tr', 'tr-tr': 'tr',
    'tr-cy': 'tr', 'az': 'tr', 'az-az': 'tr', 'tk': 'tr', 'tk-tm': 'tr',
    'ur': 'ur', 'ur-pk': 'ur', 'ur-in': 'ur', 'pa': 'ur', 'pa-in': 'ur',
    'pa-pk': 'ur', 'sd': 'ur', 'sd-pk': 'ur', 'sd-in': 'ur'
  },
  countryMap: {
    // Arab world → Arabic
    SA: 'ar', AE: 'ar', QA: 'ar', KW: 'ar', BH: 'ar', OM: 'ar',
    EG: 'ar', IQ: 'ar', JO: 'ar', LB: 'ar', SY: 'ar', YE: 'ar',
    SD: 'ar', DZ: 'ar', MA: 'ar', TN: 'ar', LY: 'ar', MR: 'ar',
    PS: 'ar', SO: 'ar', DJ: 'ar', KM: 'ar', TD: 'ar', EH: 'ar',
    // Turkey & Turkic regions → Turkish
    TR: 'tr', CY: 'tr', AZ: 'tr', TM: 'tr', UZ: 'tr', KG: 'tr', KZ: 'tr',
    // Pakistan & Urdu regions → Urdu
    PK: 'ur', BD: 'ur', AF: 'ur',
    // English (fallback for Western / other countries)
    US: 'en', GB: 'en', AU: 'en', NZ: 'en', IE: 'en', CA: 'en',
    FR: 'en', DE: 'en', NL: 'en', SE: 'en', NO: 'en', DK: 'en',
    FI: 'en', CH: 'en', AT: 'en', BE: 'en', ES: 'en', IT: 'en',
    PT: 'en', GR: 'en', PL: 'en', CZ: 'en', HU: 'en', RO: 'en',
    BG: 'en', HR: 'en', SI: 'en', SK: 'en', LT: 'en', LV: 'en',
    EE: 'en', MT: 'en', LU: 'en', IS: 'en', AL: 'en', BA: 'en',
    MK: 'en', ME: 'en', RS: 'en', MD: 'en', UA: 'en', RU: 'en',
    BY: 'en', GE: 'en', AM: 'en', IL: 'en', IR: 'en', TH: 'en',
    MY: 'en', SG: 'en', ID: 'en', PH: 'en', VN: 'en', KR: 'en',
    JP: 'en', CN: 'en', HK: 'en', TW: 'en', MX: 'en', BR: 'en',
    AR: 'en', CL: 'en', CO: 'en', PE: 'en', VE: 'en', EC: 'en',
    BO: 'en', PY: 'en', UY: 'en', GY: 'en', SR: 'en', CR: 'en',
    PA: 'en', GT: 'en', HN: 'en', SV: 'en', NI: 'en', DO: 'en',
    CU: 'en', PR: 'en', JM: 'en', HT: 'en', TT: 'en', BB: 'en',
    LC: 'en', GD: 'en', VC: 'en', AG: 'en', DM: 'en', KN: 'en',
    BS: 'en', BZ: 'en', ZA: 'en', NG: 'en', KE: 'en', GH: 'en',
    ET: 'en', UG: 'en', TZ: 'en', MZ: 'en', ZM: 'en', ZW: 'en',
    MW: 'en', BW: 'en', NA: 'en', SZ: 'en', LS: 'en', MG: 'en',
    MU: 'en', SC: 'en', RW: 'en', BI: 'en', SS: 'en', ER: 'en',
    SL: 'en', LR: 'en', GN: 'en', GW: 'en', SN: 'en', GM: 'en',
    ML: 'en', BF: 'en', NE: 'en', TG: 'en', BJ: 'en', CI: 'en',
    MR: 'en', DZ: 'en', MA: 'en', TN: 'en', LY: 'en', SD: 'en',
    EG: 'en', LK: 'en', NP: 'en', BT: 'en', MV: 'en', MM: 'en',
    LA: 'en', KH: 'en', BN: 'en', PG: 'en', FJ: 'en', SB: 'en',
    VU: 'en', WS: 'en', TO: 'en', KI: 'en', TV: 'en', NR: 'en',
    PW: 'en', MH: 'en', FM: 'en', NR: 'en'
  }
};

let currentTranslations = {};
let fallbackTranslations = {};
let pageLocalePrefix = '';

function getLocalePrefix() {
  const path = window.location.pathname;
  if (path.includes('/crisis/')) return 'crisis/';
  if (path.includes('/treatments/premature-ejaculation')) return 'treatments/pe/';
  if (path.includes('/treatments/erectile-dysfunction')) return 'treatments/ed/';
  if (path.includes('/treatments/penis-enlargement')) return 'treatments/enlargement/';
  if (path.includes('/quiz/')) return 'quiz/';
  if (path.includes('/products/')) return 'products/';
  return '';
}

function getLocaleBasePath() {
  const path = window.location.pathname;
  if (path.includes('/crisis/') || path.includes('/treatments/') || path.includes('/quiz/') || path.includes('/products/')) return '../locales/';
  return 'locales/';
}

function loadLocaleXHR(lang, prefix) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const base = getLocaleBasePath();
    xhr.open('GET', `${base}${prefix}${lang}.json`, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          try {
            resolve(JSON.parse(xhr.responseText));
            return;
          } catch (e) {
            console.warn('XHR parse error for', lang, e);
          }
        }
        resolve({});
      }
    };
    xhr.onerror = () => resolve({});
    xhr.send();
  });
}

async function loadLocale(lang, prefix) {
  prefix = prefix || pageLocalePrefix;
  const base = getLocaleBasePath();
  try {
    const res = await fetch(`${base}${prefix}${lang}.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Locale not found');
    return await res.json();
  } catch (e) {
    console.warn('Fetch failed for locale', lang, 'prefix:', prefix, '- trying XHR fallback...');
    return await loadLocaleXHR(lang, prefix);
  }
}

async function loadMergedLocale(lang) {
  // Load page-specific locale + root locale, merge them
  pageLocalePrefix = getLocalePrefix();
  const [pageDict, rootDict] = await Promise.all([
    loadLocale(lang, pageLocalePrefix),
    loadLocale(lang, '')
  ]);
  return { ...rootDict, ...pageDict };
}

function applyTranslations(lang, dict) {
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', LANG_CONFIG.rtl.includes(lang) ? 'rtl' : 'ltr');

  // Translate text content of [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    let text = dict[key];
    if (text === undefined || text === null || text === '') {
      text = fallbackTranslations[key];
    }
    if (text !== undefined && text !== null && text !== '') {
      if (el.tagName === 'OPTION') {
        el.textContent = text;
      } else {
        el.innerHTML = text;
      }
    }
  });

  // Translate attributes via data-i18n-attr="placeholder:key,title:key2"
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const spec = el.getAttribute('data-i18n-attr');
    spec.split(',').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (!attr || !key) return;
      let val = dict[key];
      if (val === undefined || val === null || val === '') {
        val = fallbackTranslations[key];
      }
      if (val !== undefined && val !== null && val !== '') {
        el.setAttribute(attr, val);
      }
    });
  });

  // Sync language switcher
  const select = document.getElementById('lang-select');
  if (select) select.value = lang;

  // Update <title> if dict has it
  if (dict.root_title_site) document.title = dict.root_title_site;
}

async function setLanguage(lang, isUserAction = false) {
  if (!LANG_CONFIG.supported.includes(lang)) {
    console.warn('Unsupported language:', lang, '- falling back to', LANG_CONFIG.default);
    lang = LANG_CONFIG.default;
  }

  console.log('[i18n] Loading locale:', lang);
  const dict = await loadMergedLocale(lang);

  if (Object.keys(dict).length === 0) {
    console.error('[i18n] Failed to load locale file:', lang);
    if (isUserAction) {
      alert('Unable to load language file. Please open the site via a local server (e.g. python3 -m http.server) instead of opening the HTML file directly.');
    }
    if (lang !== LANG_CONFIG.default) {
      await setLanguage(LANG_CONFIG.default, false);
    }
    return;
  }

  console.log('[i18n] Locale loaded:', lang, '- keys:', Object.keys(dict).length);
  currentTranslations = dict;
  window.currentTranslations = currentTranslations;
  applyTranslations(lang, currentTranslations);
  try { localStorage.setItem('site-lang', lang); } catch (e) {}
  document.dispatchEvent(new CustomEvent('i18n-ready', { detail: { lang } }));
}

function detectBrowserLanguage() {
  // navigator.languages: ['tr-TR', 'tr', 'en-US', 'en']
  const langs = navigator.languages || [navigator.language || 'ar'];
  for (const raw of langs) {
    const code = raw.toLowerCase().trim();
    // Try exact match first
    if (LANG_CONFIG.browserMap[code]) return LANG_CONFIG.browserMap[code];
    // Try base language (e.g. 'tr-TR' → 'tr')
    const base = code.split('-')[0];
    if (LANG_CONFIG.browserMap[base]) return LANG_CONFIG.browserMap[base];
  }
  return null;
}

async function detectLanguageByIP() {
  const detectors = [
    async () => {
      const r = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
      if (!r.ok) return null;
      const d = await r.json();
      return (d.country_code || '').toUpperCase();
    },
    async () => {
      const r = await fetch('https://ipwho.is/', { cache: 'no-store' });
      if (!r.ok) return null;
      const d = await r.json();
      return (d.country_code || '').toUpperCase();
    },
    async () => {
      const r = await fetch('https://get.geojs.io/v1/ip/country.json', { cache: 'no-store' });
      if (!r.ok) return null;
      const d = await r.json();
      return (d.country || '').toUpperCase();
    }
  ];

  for (const d of detectors) {
    try {
      const country = await d();
      if (country && LANG_CONFIG.countryMap[country]) {
        return LANG_CONFIG.countryMap[country];
      }
    } catch (e) {
      console.warn('IP detector failed, trying next…', e);
    }
  }

  return null;
}

async function initI18n() {
  // Pre-load fallback (Arabic — primary content)
  pageLocalePrefix = getLocalePrefix();
  const [pageFallback, rootFallback] = await Promise.all([
    loadLocale(LANG_CONFIG.default, pageLocalePrefix),
    loadLocale(LANG_CONFIG.default, '')
  ]);
  fallbackTranslations = { ...rootFallback, ...pageFallback };

  let lang = null;

  // 1. Saved preference
  try {
    const saved = localStorage.getItem('site-lang');
    if (saved && LANG_CONFIG.supported.includes(saved)) {
      lang = saved;
    }
  } catch (e) {}

  // 2. Browser / system language
  if (!lang) {
    const browserLang = detectBrowserLanguage();
    if (browserLang) lang = browserLang;
  }

  // 3. IP-based geolocation
  if (!lang) {
    const ipLang = await detectLanguageByIP();
    if (ipLang) lang = ipLang;
  }

  // 4. Default
  if (!lang) lang = LANG_CONFIG.default;

  await setLanguage(lang);

  const select = document.getElementById('lang-select');
  if (select) {
    select.addEventListener('change', (e) => setLanguage(e.target.value, true));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
