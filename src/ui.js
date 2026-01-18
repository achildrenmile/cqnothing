/**
 * CQ… Nothing. – UI Module
 *
 * Handles all rendering and user interactions.
 */

import * as i18n from './i18n.js';
import * as scenarios from './scenarios.js';
import * as causes from './causes.js';

// DOM element references
let elements = {};

/**
 * Initialize UI and cache DOM elements
 */
export function init() {
    elements = {
        scenarioContainer: document.getElementById('scenario-container'),
        causesContainer: document.getElementById('causes-container'),
        feedbackContainer: document.getElementById('feedback-container'),
        scenarioTitle: document.getElementById('scenario-title'),
        scenarioSituation: document.getElementById('scenario-situation'),
        scenarioBand: document.getElementById('scenario-band'),
        scenarioTime: document.getElementById('scenario-time'),
        scenarioDistance: document.getElementById('scenario-distance'),
        scenarioAntenna: document.getElementById('scenario-antenna'),
        scenarioPower: document.getElementById('scenario-power'),
        scenarioSymptoms: document.getElementById('scenario-symptoms'),
        scenarioCounter: document.getElementById('scenario-counter'),
        btnPrevious: document.getElementById('btn-previous'),
        btnNext: document.getElementById('btn-next'),
        btnCheck: document.getElementById('btn-check'),
        btnReset: document.getElementById('btn-reset'),
        btnLanguage: document.getElementById('btn-language'),
        languageLabel: document.getElementById('language-label'),
        labelBand: document.getElementById('label-band'),
        labelTime: document.getElementById('label-time'),
        labelDistance: document.getElementById('label-distance'),
        labelAntenna: document.getElementById('label-antenna'),
        labelPower: document.getElementById('label-power'),
        labelSymptoms: document.getElementById('label-symptoms'),
        questionMain: document.getElementById('question-main'),
        questionHint: document.getElementById('question-hint'),
        feedbackTitle: document.getElementById('feedback-title'),
        plausibleSection: document.getElementById('plausible-section'),
        unlikelySection: document.getElementById('unlikely-section'),
        missedSection: document.getElementById('missed-section'),
        ahaSection: document.getElementById('aha-section'),
        footerTagline: document.getElementById('footer-tagline')
    };
}

/**
 * Render a scenario to the UI
 */
export function renderScenario(scenario, index, total) {
    const lang = i18n.getLanguage();

    // Title and situation (direct i18n objects)
    elements.scenarioTitle.textContent = scenario.title[lang] || scenario.title['en'];
    elements.scenarioSituation.textContent = scenario.situation[lang] || scenario.situation['en'];

    // Use enum translations
    elements.scenarioBand.textContent = scenarios.getEnumValue('bands', scenario.band, lang);
    elements.scenarioTime.textContent = scenarios.getEnumValue('times', scenario.time, lang);
    elements.scenarioDistance.textContent = scenarios.getEnumValue('distances', scenario.distance, lang);
    elements.scenarioAntenna.textContent = scenarios.getEnumValue('antennas', scenario.antenna, lang);
    elements.scenarioPower.textContent = scenario.power[lang] || scenario.power['en'];

    // Symptoms (array of enum keys)
    const symptomsHtml = scenario.symptoms
        .map(s => `<li>${scenarios.getEnumValue('symptoms', s, lang)}</li>`)
        .join('');
    elements.scenarioSymptoms.innerHTML = symptomsHtml;

    // Counter
    elements.scenarioCounter.textContent =
        `${i18n.t('nav.scenario')} ${index + 1} ${i18n.t('nav.of')} ${total}`;

    // Navigation buttons
    elements.btnPrevious.disabled = index === 0;
    elements.btnNext.disabled = index === total - 1;

    hideFeedback();
}

/**
 * Render cause selection checkboxes
 */
export function renderCauseSelection(causeList, onSelectionChange) {
    const lang = i18n.getLanguage();
    const grouped = groupCausesByCategory(causeList);

    let html = '';

    // Define category order
    const categoryOrder = ['propagation', 'timing', 'equipment', 'interference', 'operator'];

    categoryOrder.forEach(category => {
        if (!grouped[category] || grouped[category].length === 0) return;

        const categoryLabel = causes.getCategoryName(category, lang);
        html += `<div class="cause-category">`;
        html += `<h4 class="cause-category-label">${categoryLabel}</h4>`;

        grouped[category].forEach(cause => {
            const name = cause.name[lang] || cause.name['en'];
            const description = cause.description[lang] || cause.description['en'];

            html += `
                <label class="cause-option" for="cause-${cause.id}">
                    <input type="checkbox"
                           id="cause-${cause.id}"
                           name="causes"
                           value="${cause.id}"
                           aria-label="${i18n.t('a11y.causeOption')}: ${name}">
                    <span class="cause-checkbox"></span>
                    <span class="cause-content">
                        <span class="cause-name">${name}</span>
                        <span class="cause-description">${description}</span>
                    </span>
                </label>
            `;
        });

        html += `</div>`;
    });

    elements.causesContainer.innerHTML = html;

    // Add change listeners
    const checkboxes = elements.causesContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            if (onSelectionChange) {
                onSelectionChange(getSelectedCauses());
            }
        });
    });
}

/**
 * Group causes by category
 */
function groupCausesByCategory(causeList) {
    const grouped = {};

    causeList.forEach(cause => {
        if (!grouped[cause.category]) {
            grouped[cause.category] = [];
        }
        grouped[cause.category].push(cause);
    });

    return grouped;
}

/**
 * Get currently selected cause IDs
 */
export function getSelectedCauses() {
    const checkboxes = elements.causesContainer.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Clear all selections
 */
export function clearSelections() {
    const checkboxes = elements.causesContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = false;
    });
}

/**
 * Render feedback after evaluation
 */
export function renderFeedback(evaluation) {
    elements.feedbackContainer.classList.add('visible');
    elements.feedbackContainer.setAttribute('aria-hidden', 'false');
    elements.feedbackContainer.className = 'feedback-container visible';
    elements.feedbackContainer.classList.add(`feedback-${evaluation.summary.type}`);

    elements.feedbackTitle.textContent = i18n.t(evaluation.summary.messageKey);

    // Plausible causes
    if (evaluation.plausibleFeedback && evaluation.plausibleFeedback.length > 0) {
        elements.plausibleSection.classList.remove('hidden');
        elements.plausibleSection.querySelector('h4').textContent = i18n.t('feedback.plausible');
        elements.plausibleSection.querySelector('.feedback-list').innerHTML =
            renderFeedbackItems(evaluation.plausibleFeedback, 'plausible');
    } else {
        elements.plausibleSection.classList.add('hidden');
    }

    // Unlikely causes
    if (evaluation.unlikelyFeedback && evaluation.unlikelyFeedback.length > 0) {
        elements.unlikelySection.classList.remove('hidden');
        elements.unlikelySection.querySelector('h4').textContent = i18n.t('feedback.unlikely');
        elements.unlikelySection.querySelector('.feedback-list').innerHTML =
            renderFeedbackItems(evaluation.unlikelyFeedback, 'unlikely');
    } else {
        elements.unlikelySection.classList.add('hidden');
    }

    // Missed causes
    if (evaluation.missedFeedback && evaluation.missedFeedback.length > 0) {
        elements.missedSection.classList.remove('hidden');
        elements.missedSection.querySelector('h4').textContent = i18n.t('feedback.missed');
        elements.missedSection.querySelector('.feedback-list').innerHTML =
            renderFeedbackItems(evaluation.missedFeedback, 'missed');
    } else {
        elements.missedSection.classList.add('hidden');
    }

    // Aha hint
    if (evaluation.ahaHintText) {
        elements.ahaSection.classList.remove('hidden');
        elements.ahaSection.querySelector('.aha-text').textContent = evaluation.ahaHintText;
    } else {
        elements.ahaSection.classList.add('hidden');
    }

    elements.feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Render feedback items HTML
 */
function renderFeedbackItems(items, type) {
    return items.map(item => `
        <div class="feedback-item feedback-${type}">
            <div class="feedback-item-header">
                <span class="feedback-item-name">${item.name}</span>
                <span class="feedback-item-plausibility">${item.plausibilityLabel}</span>
            </div>
            <p class="feedback-item-explanation">${item.explanation}</p>
            ${item.learnMore ? `<p class="feedback-item-learnmore"><strong>💡</strong> ${item.learnMore}</p>` : ''}
        </div>
    `).join('');
}

/**
 * Hide feedback panel
 */
export function hideFeedback() {
    elements.feedbackContainer.classList.remove('visible');
    elements.feedbackContainer.setAttribute('aria-hidden', 'true');
    elements.feedbackContainer.className = 'feedback-container';
}

/**
 * Update all UI text for current language
 */
export function updateLanguage() {
    const lang = i18n.getLanguage();

    // Language toggle shows the OTHER language
    const otherLang = lang === 'de' ? 'EN' : 'DE';
    elements.languageLabel.textContent = otherLang;
    elements.btnLanguage.setAttribute('aria-label', i18n.t('a11y.languageToggle'));

    // Labels
    if (elements.labelBand) elements.labelBand.textContent = i18n.t('scenario.band');
    if (elements.labelTime) elements.labelTime.textContent = i18n.t('scenario.time');
    if (elements.labelDistance) elements.labelDistance.textContent = i18n.t('scenario.distance');
    if (elements.labelAntenna) elements.labelAntenna.textContent = i18n.t('scenario.antenna');
    if (elements.labelPower) elements.labelPower.textContent = i18n.t('scenario.power');
    if (elements.labelSymptoms) elements.labelSymptoms.textContent = i18n.t('scenario.symptoms');
    if (elements.questionMain) elements.questionMain.textContent = i18n.t('question.main');
    if (elements.questionHint) elements.questionHint.textContent = i18n.t('question.hint');
    if (elements.btnCheck) elements.btnCheck.textContent = i18n.t('btn.check');
    if (elements.btnReset) elements.btnReset.textContent = i18n.t('btn.reset');
    if (elements.btnPrevious) elements.btnPrevious.textContent = i18n.t('btn.previous');
    if (elements.btnNext) elements.btnNext.textContent = i18n.t('btn.next');
    if (elements.footerTagline) elements.footerTagline.textContent = i18n.t('footer.tagline');
}

/**
 * Show validation error
 */
export function showError(messageKey) {
    const message = i18n.t(messageKey);
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('visible');
        setTimeout(() => errorDiv.classList.remove('visible'), 3000);
    }
}

/**
 * Set up event listeners
 */
export function setupEventListeners(handlers) {
    if (handlers.onCheck && elements.btnCheck) {
        elements.btnCheck.addEventListener('click', handlers.onCheck);
    }
    if (handlers.onReset && elements.btnReset) {
        elements.btnReset.addEventListener('click', handlers.onReset);
    }
    if (handlers.onPrevious && elements.btnPrevious) {
        elements.btnPrevious.addEventListener('click', handlers.onPrevious);
    }
    if (handlers.onNext && elements.btnNext) {
        elements.btnNext.addEventListener('click', handlers.onNext);
    }
    if (handlers.onLanguageToggle && elements.btnLanguage) {
        elements.btnLanguage.addEventListener('click', handlers.onLanguageToggle);
    }
}
