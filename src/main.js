/**
 * CQ… Nothing. – Main Application Entry Point
 *
 * Initializes and coordinates all modules.
 * Manages application state and user flow.
 */

import './styles.css';
import * as i18n from './i18n.js';
import * as causes from './causes.js';
import * as scenarios from './scenarios.js';
import * as evaluator from './evaluator.js';
import * as ui from './ui.js';
import * as config from './config.js';

// Application state
const state = {
    currentScenarioIndex: 0,
    selectedCauses: [],
    feedbackShown: false
};

/**
 * Initialize the application
 */
async function init() {
    // Load runtime config first
    await config.loadConfig();

    ui.init();

    // Apply parent site branding
    ui.applyParentSiteBranding();

    i18n.onLanguageChange(handleLanguageChange);

    ui.setupEventListeners({
        onCheck: handleCheck,
        onReset: handleReset,
        onPrevious: handlePrevious,
        onNext: handleNext,
        onLanguageToggle: handleLanguageToggle
    });

    ui.updateLanguage();
    loadScenario(0);

    console.log('CQ… Nothing. initialized successfully');
}

/**
 * Load and display a scenario by index
 */
function loadScenario(index) {
    const scenario = scenarios.getScenarioByIndex(index);
    const total = scenarios.getScenarioCount();

    if (!scenario) {
        console.error(`Scenario at index ${index} not found`);
        return;
    }

    state.currentScenarioIndex = index;
    state.selectedCauses = [];
    state.feedbackShown = false;

    ui.renderScenario(scenario, index, total);

    const allCauses = causes.getAllCauses();
    ui.renderCauseSelection(allCauses, handleSelectionChange);

    ui.hideFeedback();
}

/**
 * Handle check button click
 */
function handleCheck() {
    const selected = ui.getSelectedCauses();

    if (!evaluator.hasSelection(selected)) {
        ui.showError('question.noneSelected');
        return;
    }

    const scenario = scenarios.getScenarioByIndex(state.currentScenarioIndex);
    const lang = i18n.getLanguage();
    const evaluation = evaluator.evaluateWithFeedback(scenario.id, selected, lang);

    ui.renderFeedback(evaluation);
    state.feedbackShown = true;
}

/**
 * Handle reset button click
 */
function handleReset() {
    ui.clearSelections();
    ui.hideFeedback();
    state.selectedCauses = [];
    state.feedbackShown = false;
}

/**
 * Handle previous button click
 */
function handlePrevious() {
    if (state.currentScenarioIndex > 0) {
        loadScenario(state.currentScenarioIndex - 1);
    }
}

/**
 * Handle next button click
 */
function handleNext() {
    const total = scenarios.getScenarioCount();
    if (state.currentScenarioIndex < total - 1) {
        loadScenario(state.currentScenarioIndex + 1);
    }
}

/**
 * Handle language toggle click
 */
function handleLanguageToggle() {
    const currentLang = i18n.getLanguage();
    const newLang = currentLang === 'de' ? 'en' : 'de';
    i18n.setLanguage(newLang);
}

/**
 * Handle language change event
 */
function handleLanguageChange(newLang) {
    ui.updateLanguage();

    const scenario = scenarios.getScenarioByIndex(state.currentScenarioIndex);
    const total = scenarios.getScenarioCount();

    ui.renderScenario(scenario, state.currentScenarioIndex, total);

    const allCauses = causes.getAllCauses();
    ui.renderCauseSelection(allCauses, handleSelectionChange);

    restoreSelections();

    if (state.feedbackShown) {
        const selected = ui.getSelectedCauses();
        const evaluation = evaluator.evaluateWithFeedback(scenario.id, selected, newLang);
        ui.renderFeedback(evaluation);
    }
}

/**
 * Handle cause selection change
 */
function handleSelectionChange(selected) {
    state.selectedCauses = selected;

    if (state.feedbackShown) {
        ui.hideFeedback();
        state.feedbackShown = false;
    }
}

/**
 * Restore selections after language change
 */
function restoreSelections() {
    if (state.selectedCauses.length === 0) return;

    state.selectedCauses.forEach(causeId => {
        const checkbox = document.getElementById(`cause-${causeId}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
