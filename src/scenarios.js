/**
 * CQ… Nothing. – Scenarios Module
 *
 * Loads scenarios from JSON data file.
 */

import scenariosData from './data/scenarios.json';

/**
 * Plausibility levels
 */
export const PLAUSIBILITY = {
    VERY_LIKELY: 'very_likely',
    LIKELY: 'likely',
    POSSIBLE: 'possible',
    UNLIKELY: 'unlikely'
};

// Scenario definitions from JSON
const scenarioDefinitions = scenariosData.scenarios;

// Enums from JSON
const enums = scenariosData.enums;

/**
 * Get all scenarios
 * @returns {Array} All scenario definitions
 */
export function getAllScenarios() {
    return scenarioDefinitions;
}

/**
 * Get scenario by ID
 * @param {string} id - Scenario ID
 * @returns {Object|undefined} Scenario definition
 */
export function getScenarioById(id) {
    return scenarioDefinitions.find(s => s.id === id);
}

/**
 * Get scenario count
 * @returns {number} Total scenarios
 */
export function getScenarioCount() {
    return scenarioDefinitions.length;
}

/**
 * Get scenario by index
 * @param {number} index - Zero-based index
 * @returns {Object|undefined} Scenario definition
 */
export function getScenarioByIndex(index) {
    return scenarioDefinitions[index];
}

/**
 * Get scenarios by difficulty
 * @param {string} difficulty - beginner, intermediate, or advanced
 * @returns {Array} Filtered scenarios
 */
export function getScenariosByDifficulty(difficulty) {
    return scenarioDefinitions.filter(s => s.difficulty === difficulty);
}

/**
 * Get relevant causes (not unlikely) for a scenario
 * @param {string} scenarioId - Scenario ID
 * @returns {string[]} Cause IDs
 */
export function getRelevantCauses(scenarioId) {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) return [];

    return Object.entries(scenario.causeMappings)
        .filter(([, level]) => level !== 'unlikely')
        .map(([causeId]) => causeId);
}

/**
 * Get highly plausible causes (very_likely or likely)
 * @param {string} scenarioId - Scenario ID
 * @returns {string[]} Cause IDs
 */
export function getHighlyPlausibleCauses(scenarioId) {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) return [];

    return Object.entries(scenario.causeMappings)
        .filter(([, level]) => level === 'very_likely' || level === 'likely')
        .map(([causeId]) => causeId);
}

/**
 * Get enum translation
 * @param {string} enumType - bands, times, distances, antennas, symptoms, seasons
 * @param {string} enumValue - The enum value
 * @param {string} lang - Language code
 * @returns {string} Translated string
 */
export function getEnumValue(enumType, enumValue, lang) {
    if (enums[enumType] && enums[enumType][enumValue]) {
        const entry = enums[enumType][enumValue];
        return entry[lang] || entry['en'] || enumValue;
    }
    return enumValue;
}

/**
 * Get plausibility level label
 * @param {string} level - Plausibility level
 * @param {string} lang - Language code
 * @returns {string} Translated label
 */
export function getPlausibilityLabel(level, lang) {
    const labels = scenariosData.plausibilityLevels;
    if (labels[level]) {
        return labels[level][lang] || labels[level]['en'] || level;
    }
    return level;
}

/**
 * Get all available enums
 * @returns {Object} Enum definitions
 */
export function getEnums() {
    return enums;
}
