/**
 * CQ… Nothing. – Evaluator Module
 *
 * Analyzes player selections and generates feedback.
 */

import * as scenarios from './scenarios.js';
import * as causes from './causes.js';

/**
 * Evaluate player selections for a scenario
 */
export function evaluate(scenarioId, selectedCauseIds) {
    const scenario = scenarios.getScenarioById(scenarioId);

    if (!scenario) {
        console.error(`Scenario not found: ${scenarioId}`);
        return createEmptyResult();
    }

    const mappings = scenario.causeMappings;
    const result = {
        scenarioId: scenarioId,
        selected: selectedCauseIds,
        plausible: [],
        unlikely: [],
        missed: [],
        ahaHint: scenario.ahaHint,
        summary: null
    };

    // Categorize selected causes
    selectedCauseIds.forEach(causeId => {
        const plausibility = mappings[causeId];

        if (!plausibility) {
            console.warn(`Cause ${causeId} not mapped for scenario ${scenarioId}`);
            return;
        }

        if (plausibility === 'unlikely') {
            result.unlikely.push({ causeId, plausibility });
        } else {
            result.plausible.push({ causeId, plausibility });
        }
    });

    // Find missed important causes
    const highlyPlausible = scenarios.getHighlyPlausibleCauses(scenarioId);
    highlyPlausible.forEach(causeId => {
        if (!selectedCauseIds.includes(causeId)) {
            result.missed.push({
                causeId,
                plausibility: mappings[causeId]
            });
        }
    });

    result.summary = generateSummary(result);

    return result;
}

/**
 * Generate summary assessment
 */
function generateSummary(result) {
    const hasVeryLikely = result.plausible.some(p => p.plausibility === 'very_likely');
    const hasLikely = result.plausible.some(p => p.plausibility === 'likely');
    const hasMissedImportant = result.missed.length > 0;
    const hasUnlikely = result.unlikely.length > 0;
    const hasPlausible = result.plausible.length > 0;

    if (hasVeryLikely && !hasMissedImportant && !hasUnlikely) {
        return { type: 'perfect', messageKey: 'feedback.perfect' };
    }

    if ((hasVeryLikely || hasLikely) && (hasMissedImportant || hasUnlikely)) {
        return { type: 'partial', messageKey: 'feedback.partly' };
    }

    if (hasPlausible && !hasVeryLikely && !hasLikely) {
        return { type: 'partial', messageKey: 'feedback.partly' };
    }

    if (!hasPlausible) {
        return { type: 'rethink', messageKey: 'feedback.rethink' };
    }

    return { type: 'partial', messageKey: 'feedback.partly' };
}

/**
 * Create empty result for errors
 */
function createEmptyResult() {
    return {
        scenarioId: null,
        selected: [],
        plausible: [],
        unlikely: [],
        missed: [],
        ahaHint: null,
        summary: { type: 'error', messageKey: null }
    };
}

/**
 * Get detailed feedback for a cause
 */
export function getCauseFeedback(causeId, plausibility, lang) {
    return {
        name: causes.getCauseName(causeId, lang),
        description: causes.getCauseDescription(causeId, lang),
        explanation: causes.getCauseExplanation(causeId, lang),
        learnMore: causes.getCauseLearnMore(causeId, lang),
        plausibility: plausibility,
        plausibilityLabel: scenarios.getPlausibilityLabel(plausibility, lang)
    };
}

/**
 * Get full evaluation with resolved feedback text
 */
export function evaluateWithFeedback(scenarioId, selectedCauseIds, lang) {
    const result = evaluate(scenarioId, selectedCauseIds);

    result.plausibleFeedback = result.plausible.map(p =>
        getCauseFeedback(p.causeId, p.plausibility, lang)
    );

    result.unlikelyFeedback = result.unlikely.map(u =>
        getCauseFeedback(u.causeId, u.plausibility, lang)
    );

    result.missedFeedback = result.missed.map(m =>
        getCauseFeedback(m.causeId, m.plausibility, lang)
    );

    if (result.ahaHint) {
        result.ahaHintText = result.ahaHint[lang] || result.ahaHint['en'];
    }

    return result;
}

/**
 * Check if user has made a selection
 */
export function hasSelection(selectedCauseIds) {
    return selectedCauseIds && selectedCauseIds.length > 0;
}
