# CQ… Nothing. – Architecture Document

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   i18n.js   │  │ scenarios.js│  │       causes.js         │ │
│  │             │  │             │  │                         │ │
│  │ Language    │  │ Scenario    │  │ Failure cause           │ │
│  │ strings &   │  │ definitions │  │ definitions &           │ │
│  │ toggle      │  │ & metadata  │  │ explanations            │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                │                     │               │
│         └────────────────┼─────────────────────┘               │
│                          │                                     │
│                          ▼                                     │
│              ┌───────────────────────┐                         │
│              │     evaluator.js      │                         │
│              │                       │                         │
│              │ • Evaluate selections │                         │
│              │ • Calculate plausib.  │                         │
│              │ • Generate feedback   │                         │
│              └───────────┬───────────┘                         │
│                          │                                     │
│                          ▼                                     │
│              ┌───────────────────────┐                         │
│              │        ui.js          │                         │
│              │                       │                         │
│              │ • Render scenarios    │                         │
│              │ • Handle selections   │                         │
│              │ • Display feedback    │                         │
│              │ • Manage language UI  │                         │
│              └───────────┬───────────┘                         │
│                          │                                     │
│                          ▼                                     │
│              ┌───────────────────────┐                         │
│              │        app.js         │                         │
│              │                       │                         │
│              │ • Initialize modules  │                         │
│              │ • Coordinate flow     │                         │
│              │ • State management    │                         │
│              └───────────────────────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Module Responsibilities

### 1. i18n.js – Internationalization Module
**Purpose**: Manage all translatable text content and language switching.

**Responsibilities**:
- Store all UI strings in German and English
- Provide `t(key)` function to retrieve translated strings
- Handle language toggle (DE ↔ EN)
- Persist language preference in localStorage
- Emit language change events for UI updates

**Exports**:
- `t(key, params?)` – Get translated string
- `setLanguage(lang)` – Switch language
- `getLanguage()` – Get current language
- `onLanguageChange(callback)` – Register listener

### 2. scenarios.js – Scenario Data Module
**Purpose**: Define and manage all educational scenarios.

**Responsibilities**:
- Store scenario definitions (band, time, distance, antenna, symptoms)
- Map scenarios to relevant failure causes with plausibility ratings
- Provide scenario retrieval functions
- Support scenario categories/difficulty levels (future)

**Exports**:
- `getAllScenarios()` – List all scenarios
- `getScenarioById(id)` – Get specific scenario
- `getScenarioCount()` – Total number of scenarios

### 3. causes.js – Failure Causes Module
**Purpose**: Define all possible failure causes with explanations.

**Responsibilities**:
- Define failure cause catalog
- Store beginner-friendly explanations (DE/EN)
- Categorize causes (propagation, equipment, interference, operator)
- Provide cause metadata for UI rendering

**Exports**:
- `getAllCauses()` – List all causes
- `getCauseById(id)` – Get specific cause
- `getCausesByCategory(category)` – Filter by category

### 4. evaluator.js – Evaluation Logic Module
**Purpose**: Analyze player selections and generate feedback.

**Responsibilities**:
- Compare selected causes against scenario's plausibility map
- Generate structured feedback (plausible/unlikely/missed)
- Produce beginner-friendly explanations
- NO scoring – only educational feedback

**Exports**:
- `evaluate(scenarioId, selectedCauseIds)` – Main evaluation function
- Returns: `{ plausible: [], unlikely: [], missed: [], explanations: {} }`

### 5. ui.js – User Interface Module
**Purpose**: Render all visual elements and handle user interactions.

**Responsibilities**:
- Render scenario cards with all information
- Display cause selection checkboxes
- Show/hide feedback panels
- Handle language toggle button
- Manage navigation between scenarios
- Apply accessibility best practices

**Exports**:
- `renderScenario(scenario)` – Display scenario
- `renderCauseSelection(causes)` – Show checkboxes
- `renderFeedback(evaluation)` – Display results
- `updateLanguage()` – Refresh all text

### 6. app.js – Application Controller
**Purpose**: Initialize and coordinate all modules.

**Responsibilities**:
- Bootstrap application on page load
- Manage application state (current scenario, selections)
- Coordinate module interactions
- Handle scenario navigation

**Exports**:
- `init()` – Start application
- `nextScenario()` – Advance to next
- `resetScenario()` – Clear current selections

## Data Flow

```
1. User loads page
   └─► app.init()
       └─► i18n.setLanguage(stored || 'de')
       └─► ui.renderScenario(scenarios[0])
       └─► ui.renderCauseSelection(causes)

2. User selects causes and clicks "Check"
   └─► app.checkSelection()
       └─► evaluator.evaluate(scenarioId, selectedIds)
       └─► ui.renderFeedback(result)

3. User toggles language
   └─► i18n.setLanguage(newLang)
       └─► ui.updateLanguage()
       └─► ui.renderFeedback() (if visible)

4. User clicks "Next Scenario"
   └─► app.nextScenario()
       └─► ui.renderScenario(nextScenario)
       └─► ui.clearFeedback()
```

## Design Principles

1. **Separation of Concerns**: Text content is completely separate from logic
2. **No Backend Required**: All data is embedded; works offline
3. **Deterministic Evaluation**: Same inputs always produce same feedback
4. **Extensibility**: New scenarios/causes can be added without code changes
5. **Accessibility**: Semantic HTML, keyboard navigation, screen reader support
6. **Mobile-First**: Responsive design for all screen sizes
