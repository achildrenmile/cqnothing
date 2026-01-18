/**
 * CQ… Nothing. – Failure Causes Module
 *
 * Loads causes from JSON data file.
 */

import causesData from './data/causes.json';

// Export categories
export const CATEGORY = causesData.categories;

// Cause definitions from JSON
const causeDefinitions = causesData.causes;

/**
 * Get all causes
 * @returns {Array} All cause definitions
 */
export function getAllCauses() {
    return causeDefinitions;
}

/**
 * Get cause by ID
 * @param {string} id - Cause ID
 * @returns {Object|undefined} Cause definition or undefined
 */
export function getCauseById(id) {
    return causeDefinitions.find(c => c.id === id);
}

/**
 * Get causes by category
 * @param {string} category - Category key
 * @returns {Array} Filtered causes
 */
export function getCausesByCategory(category) {
    return causeDefinitions.filter(c => c.category === category);
}

/**
 * Get localized cause name
 * @param {string} id - Cause ID
 * @param {string} lang - Language code
 * @returns {string} Localized name
 */
export function getCauseName(id, lang) {
    const cause = getCauseById(id);
    if (!cause) return id;
    return cause.name[lang] || cause.name['en'] || id;
}

/**
 * Get localized cause description
 * @param {string} id - Cause ID
 * @param {string} lang - Language code
 * @returns {string} Localized description
 */
export function getCauseDescription(id, lang) {
    const cause = getCauseById(id);
    if (!cause) return '';
    return cause.description[lang] || cause.description['en'] || '';
}

/**
 * Get localized cause explanation (detailed)
 * @param {string} id - Cause ID
 * @param {string} lang - Language code
 * @returns {string} Localized explanation
 */
export function getCauseExplanation(id, lang) {
    const cause = getCauseById(id);
    if (!cause) return '';
    return cause.explanation[lang] || cause.explanation['en'] || '';
}

/**
 * Get localized "learn more" text
 * @param {string} id - Cause ID
 * @param {string} lang - Language code
 * @returns {string} Localized learn more text
 */
export function getCauseLearnMore(id, lang) {
    const cause = getCauseById(id);
    if (!cause) return '';
    return cause.learnMore[lang] || cause.learnMore['en'] || '';
}

/**
 * Get localized category name
 * @param {string} categoryKey - Category key
 * @param {string} lang - Language code
 * @returns {string} Localized category name
 */
export function getCategoryName(categoryKey, lang) {
    const category = CATEGORY[categoryKey];
    if (!category) return categoryKey;
    return category[lang] || category['en'] || categoryKey;
}

/**
 * Get all category keys
 * @returns {string[]} Array of category keys
 */
export function getCategoryKeys() {
    return Object.keys(CATEGORY);
}
