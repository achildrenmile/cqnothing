/**
 * Runtime Configuration Module
 * Loads config.json at runtime for parent site branding
 */

let config = null;
let configLoaded = false;
let loadPromise = null;

/**
 * Load configuration from config.json
 * @returns {Promise<Object>} Configuration object
 */
export async function loadConfig() {
    if (configLoaded) {
        return config;
    }

    if (loadPromise) {
        return loadPromise;
    }

    loadPromise = (async () => {
        try {
            const response = await fetch('/config.json');
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            config = await response.json();
        } catch (error) {
            console.warn('Could not load config.json, using defaults:', error.message);
            config = {
                parentSiteUrl: '',
                parentSiteLogo: '',
                parentSiteName: ''
            };
        }
        configLoaded = true;
        return config;
    })();

    return loadPromise;
}

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {string} Configuration value or empty string
 */
export function getConfig(key) {
    if (!config) {
        return '';
    }
    return config[key] || '';
}

/**
 * Check if parent site is configured
 * @returns {boolean} True if parent site URL is configured
 */
export function hasParentSite() {
    return !!(config && config.parentSiteUrl);
}

/**
 * Check if parent site logo is configured
 * @returns {boolean} True if parent site logo is configured
 */
export function hasParentLogo() {
    return !!(config && config.parentSiteLogo);
}
