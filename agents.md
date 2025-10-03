# Agent Configuration for CSS Constraint

## Objective
Create an AI agent that generates CSS code exclusively based on the predefined CSS rules found in the `src/foundation/` directory. The agent should not create, modify, or reference any CSS rules outside this directory.

## Instructions

- **Scope of CSS rules**: Only utilize the CSS rules defined within the files located in `src/foundation/`.
- **No rule creation**: Do not create new CSS rules outside those provided.
- **No modifications**: Never modify or alter the existing rules unless explicitly instructed.
- **Reference only provided rules**: When generating CSS, only reference the classes, IDs, and properties defined in `src/foundation/`.

## Available Foundation CSS (6855 lines)

The following files contain all approved CSS rules:

1. **reset.css** (38 lines) - Base reset styles
2. **colors.css** (243 lines) - Color variables and utilities
3. **spacing.css** (377 lines) - Margin/padding utilities (m-, p-, mx-, my-, mt-, mr-, mb-, ml-, etc.)
4. **typography.css** (560 lines) - Font styles and text utilities
5. **display.css** (325 lines) - Layout and display utilities (flex-, grid-, block, inline, etc.)
6. **icons.css** (5307 lines) - Icon definitions

## Implementation Details

- Provide the content of `src/foundation/` to the agent as context.
- Ensure the prompt explicitly states the constraint:
   *"Use only the CSS rules found in `src/foundation/`."*
- Optionally, include a validation step to verify that generated code complies with the rules.

## CSS Patterns & Conventions

### Utility Classes (Tailwind-style)
```css
/* Spacing: m-{size}, p-{size}, mx-, my-, mt-, mr-, mb-, ml-, px-, py-, pt-, pr-, pb-, pl- */
.m-24 { margin: var(--spacing-24); }
.p-16 { padding: var(--spacing-16); }
.mb-12 { margin-bottom: var(--spacing-12); }

/* Typography: text-{size}, font-{weight} */
.text-lg { font-size: var(--font-size-lg); line-height: var(--line-height-lg); }
.font-semibold { font-weight: var(--font-weight-semibold); }

/* Display: flex-{variant}, grid-{variant} */
.flex-row { display: flex; flex-direction: row; }
.flex-justify-between { justify-content: space-between; }
```

### CSS Variables
```css
/* Spacing */
--spacing-0, --spacing-1, --spacing-2, --spacing-4, --spacing-6, --spacing-8,
--spacing-12, --spacing-16, --spacing-20, --spacing-24, --spacing-32, --spacing-40,
--spacing-48, --spacing-64, --spacing-80, --spacing-160, --spacing-240, --spacing-320

/* Colors */
--color-primary-signal-orange, --color-primary-sky-blue
--color-blue-{100-900}, --color-green-{100-900}, --color-red-{100-900}
--color-text-default, --color-surface-default, --color-border-default

/* Typography */
--font-size-{2xs,xs,sm,md,lg,xl,2xl,3xl,4xl,5xl}
--line-height-{2xs,xs,sm,md,lg,xl,2xl,3xl,4xl,5xl}
--font-weight-{normal,semibold,bold}
```

### Component Classes (BEM-style)
```css
/* Block__Element--Modifier pattern */
.card { /* base component */ }
.card__heading { /* component child */ }
.card--with-border { /* component variant */ }
```

## Example Prompts

### ✅ DO - Use foundation classes
```
Create a card layout using SwageCSS foundation classes.

<div class="card card--with-border p-24 mb-16">
  <h2 class="card__heading text-lg font-semibold mb-12">Title</h2>
  <div class="card__content text-md">Content here</div>
</div>
```

### ❌ DON'T - Create custom CSS
```
Create a card layout with custom styles.

<div class="custom-card" style="padding: 25px; margin-bottom: 15px;">
  <h2 style="font-size: 19px; font-weight: 650;">Title</h2>
</div>

<style>
.custom-card { /* Custom CSS not allowed */ }
</style>
```

## Validation Checklist

When reviewing generated code, verify:

- [ ] All CSS classes exist in `src/foundation/`
- [ ] No inline styles used (no `style=""` attributes)
- [ ] No custom CSS rules created
- [ ] Only approved CSS variables referenced
- [ ] Spacing values use approved scale (not arbitrary values like 15px, 25px)
- [ ] Component follows BEM naming if creating new component variants

## Theme System

SwageCSS supports multiple themes via `data-theme` attribute:

```html
<html data-theme="cui">  <!-- Default Curative UI theme -->
<html data-theme="blv">  <!-- BLV theme variant -->
```

Components may have theme-specific overrides defined in their CSS files.

---

*End of agents.md*


