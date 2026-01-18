/**
 * CQ… Nothing. – Internationalization Module
 *
 * Manages all translatable text content and language switching.
 * Loads translations from JSON data files.
 */

import stringsData from './data/strings.json';
import scenariosData from './data/scenarios.json';

// Current language state
let currentLanguage = 'de';

// Language change listeners
const listeners = [];

// Merged strings from all sources
const strings = { ...stringsData.strings };

// Add enum translations from scenarios.json
const enums = scenariosData.enums;

/**
 * Get translated string by key
 * @param {string} key - The translation key
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} - Translated string or key if not found
 */
export function t(key, params = {}) {
    // Check if it's an enum key (e.g., "band.40m", "time.afternoon")
    const [enumType, enumValue] = key.split('.');

    if (enums[enumType + 's'] && enums[enumType + 's'][enumValue]) {
        const entry = enums[enumType + 's'][enumValue];
        return entry[currentLanguage] || entry['en'] || key;
    }

    // Regular string lookup
    const entry = strings[key];
    if (!entry) {
        console.warn(`Missing translation key: ${key}`);
        return key;
    }

    let text = entry[currentLanguage] || entry['en'] || key;

    // Simple parameter interpolation: {{param}}
    Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });

    return text;
}

/**
 * Get enum value translation
 * @param {string} enumType - Enum type (bands, times, distances, antennas, symptoms, seasons)
 * @param {string} enumValue - Enum value
 * @returns {string} - Translated string
 */
export function getEnum(enumType, enumValue) {
    if (enums[enumType] && enums[enumType][enumValue]) {
        const entry = enums[enumType][enumValue];
        return entry[currentLanguage] || entry['en'] || enumValue;
    }
    return enumValue;
}

/**
 * Set current language
 * @param {string} lang - Language code ('de' or 'en')
 */
export function setLanguage(lang) {
    const supported = stringsData.supportedLanguages || ['de', 'en'];
    if (!supported.includes(lang)) {
        console.warn(`Invalid language: ${lang}. Using 'de'.`);
        lang = 'de';
    }

    currentLanguage = lang;
    localStorage.setItem('cqnothing-lang', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Notify all listeners
    listeners.forEach(callback => callback(lang));
}

/**
 * Get current language
 * @returns {string} - Current language code
 */
export function getLanguage() {
    return currentLanguage;
}

/**
 * Get supported languages
 * @returns {string[]} - Array of supported language codes
 */
export function getSupportedLanguages() {
    return stringsData.supportedLanguages || ['de', 'en'];
}

/**
 * Register a language change listener
 * @param {Function} callback - Function to call on language change
 */
export function onLanguageChange(callback) {
    listeners.push(callback);
}

/**
 * Initialize language from localStorage
 */
export function initLanguage() {
    const stored = localStorage.getItem('cqnothing-lang');
    const supported = stringsData.supportedLanguages || ['de', 'en'];

    if (stored && supported.includes(stored)) {
        currentLanguage = stored;
    } else {
        // Default to German (primary language)
        currentLanguage = stringsData.defaultLanguage || 'de';
    }

    document.documentElement.lang = currentLanguage;
}

/**
 * Get all available translation keys (for debugging)
 * @returns {string[]} - Array of all keys
 */
export function getAllKeys() {
    return Object.keys(strings);
}

// Initialize on module load
initLanguage();
