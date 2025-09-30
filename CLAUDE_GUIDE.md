# Claude Code Quick Reference Guide

**SwageCSS** - A utility-first CSS framework based on Curative Design System

---

## 🚀 Quick Start

### Foundation CSS Location
All approved CSS rules are in:
```
src/foundation/
```

**Total: 6,855 lines** across 6 files

### Core Rule
> Only use CSS classes and variables from `src/foundation/`. Never create custom CSS or use inline styles.

---

## 📁 Project Structure

```
swagecss/
├── src/
│   ├── foundation/          ← ALL CSS rules here (read-only)
│   │   ├── foundation.css   (main import)
│   │   ├── reset.css        (38 lines)
│   │   ├── colors.css       (243 lines)
│   │   ├── spacing.css      (377 lines)
│   │   ├── typography.css   (560 lines)
│   │   ├── display.css      (325 lines)
│   │   └── icons.css        (5,307 lines)
│   ├── components/          ← Component CSS files (22 components)
│   ├── plugins/             ← Drawer, theme toggle, etc.
│   ├── blocks/              ← Block-level styles
│   └── swage.css            ← Main entry (imports all)
├── components/              ← Component documentation pages
├── _includes/               ← Eleventy templates
├── foundation/              ← Foundation documentation pages
├── docs/                    ← Build output (generated)
├── .eleventy.js             ← Eleventy config
├── .clauconfig              ← Claude config
├── .cursorrules             ← Cursor AI rules
└── agents.md                ← Detailed CSS constraints

Output: docs/ (built by Eleventy with prefix: /swagecss/)
```

---

## 🎨 Foundation CSS Files

| File | Lines | Purpose | Examples |
|------|-------|---------|----------|
| **reset.css** | 38 | Base reset | `*, *::before, *::after { box-sizing: border-box; }` |
| **colors.css** | 243 | Color variables & utilities | `--color-blue-500`, `--color-text-default` |
| **spacing.css** | 377 | Margin/padding utilities | `.m-24`, `.p-16`, `.mx-auto`, `.pt-8` |
| **typography.css** | 560 | Font styles & text utilities | `.text-lg`, `.font-semibold`, `--font-size-md` |
| **display.css** | 325 | Layout & display utilities | `.flex-row`, `.grid-cols-3`, `.block` |
| **icons.css** | 5,307 | Icon definitions | Icon SVG data URLs |

---

## 🛠️ Common Tasks

### Task: Create a New Component

1. **Use foundation utility classes**
   ```html
   <div class="card card--with-border p-24 mb-16">
     <h2 class="card__heading text-lg font-semibold mb-12">Title</h2>
     <div class="card__content text-md">Content</div>
   </div>
   ```

2. **Check existing components** in `src/components/` for patterns

3. **Follow BEM naming**: `.block__element--modifier`

### Task: Add Spacing

**Approved spacing values:**
```
0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 160, 240, 320
```

**Utility pattern:**
```html
<!-- Margin -->
<div class="m-24">        <!-- All sides: 24px -->
<div class="mt-16 mb-8">  <!-- Top: 16px, Bottom: 8px -->
<div class="mx-auto">     <!-- Horizontal: auto (center) -->

<!-- Padding -->
<div class="p-16">        <!-- All sides: 16px -->
<div class="px-24 py-12"> <!-- Horiz: 24px, Vert: 12px -->
```

### Task: Style Text

**Typography utilities:**
```html
<!-- Size -->
<h1 class="text-2xl">     <!-- 24px -->
<p class="text-md">       <!-- 16px -->
<small class="text-sm">   <!-- 14px -->

<!-- Weight -->
<span class="font-bold">      <!-- 700 -->
<span class="font-semibold">  <!-- 600 -->
<span class="font-normal">    <!-- 400 -->

<!-- Combination -->
<h2 class="text-lg font-semibold mb-12">Heading</h2>
```

### Task: Create Layout

**Flexbox:**
```html
<div class="flex-row flex-justify-between flex-align-center gap-16">
  <div>Left</div>
  <div>Right</div>
</div>

<div class="flex-column gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Grid:**
```html
<div class="grid grid-cols-3 gap-24">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>
```

### Task: Apply Colors

**Always use semantic variables for theme support:**
```html
<!-- Semantic (theme-aware) -->
<div class="text-primary bg-surface-default border-border-default">
  This adapts to the active theme
</div>

<!-- Direct (use sparingly) -->
<div style="color: var(--color-blue-500);">
  This is always blue-500
</div>
```

### Task: Work with Themes

**SwageCSS supports multiple themes:**
```html
<html data-theme="cui">  <!-- Default: Curative UI -->
<html data-theme="blv">  <!-- Alternate: BLV -->
```

Components automatically adapt when using semantic color variables.

### Task: Add to Eleventy Template

**Common template patterns:**
```liquid
<!-- In _includes/layout.html or similar -->
{% include '_nav.html' %}
{% include '_titleblock.html' %}

{{ content }}  <!-- Main content area -->
{{ title }}    <!-- Page title -->
{{ heading }}  <!-- Page heading -->

<!-- URL with path prefix -->
<link href="{{ '/' | url }}src/swage.css" rel="stylesheet">
```

---

## 🎯 CSS Variables Cheat Sheet

### Spacing
```css
--spacing-0     /* 0px */
--spacing-1     /* 1px */
--spacing-2     /* 2px */
--spacing-4     /* 4px */
--spacing-6     /* 6px */
--spacing-8     /* 8px */
--spacing-12    /* 12px */
--spacing-16    /* 16px */
--spacing-20    /* 20px */
--spacing-24    /* 24px */
--spacing-32    /* 32px */
--spacing-40    /* 40px */
--spacing-48    /* 48px */
--spacing-64    /* 64px */
--spacing-80    /* 80px */
--spacing-160   /* 160px */
--spacing-240   /* 240px */
--spacing-320   /* 320px */
```

### Colors

**Primary:**
```css
--color-primary-signal-orange
--color-primary-sky-blue
```

**Neutral:**
```css
--color-neutral-black
--color-neutral-eggshell
--color-neutral-off-white
--color-neutral-white
--color-white
```

**Semantic (theme-aware):**
```css
--color-text-default
--color-text-secondary
--color-surface-default
--color-surface-highlight
--color-surface-neutral
--color-border-default
--color-border-subtle
```

**Color Scales (100-900):**
```css
--color-blue-{100|200|300|400|500|600|700|800|900}
--color-green-{100|200|300|400|500|600|700|800|900}
--color-red-{100|200|300|400|500|600|700|800|900}
--color-yellow-{100|200|300|400|500|600|700|800|900}
--color-gray-{100|200|300|400|500|600|700|800|900}
```

### Typography

**Font Sizes:**
```css
--font-size-2xs   /* 10px */
--font-size-xs    /* 12px */
--font-size-sm    /* 14px */
--font-size-md    /* 16px */
--font-size-lg    /* 18px */
--font-size-xl    /* 20px */
--font-size-2xl   /* 24px */
--font-size-3xl   /* 30px */
--font-size-4xl   /* 36px */
--font-size-5xl   /* 48px */
```

**Line Heights:**
```css
--line-height-2xs  /* 12px */
--line-height-xs   /* 14px */
--line-height-sm   /* 16px */
--line-height-md   /* 18px */
--line-height-lg   /* 24px */
--line-height-xl   /* 24px */
/* ... (corresponds to font sizes) */
```

**Font Weights:**
```css
--font-weight-normal    /* 400 */
--font-weight-semibold  /* 600 */
--font-weight-bold      /* 700 */
```

**Font Family:**
```css
--font-family-sans  /* 'Figtree', system-ui, ... */
```

---

## ✅ Do's and ❌ Don'ts

### ✅ DO

```html
<!-- Use foundation utility classes -->
<div class="card p-24 mb-16">
  <h2 class="text-lg font-semibold">Title</h2>
</div>

<!-- Use CSS variables -->
<style>
.custom-component {
  padding: var(--spacing-24);
  color: var(--color-text-default);
}
</style>

<!-- Check existing components for patterns -->
See: src/components/card/card.css
See: src/components/button/button.css
```

### ❌ DON'T

```html
<!-- Never use inline styles -->
<div style="padding: 25px; margin: 15px;">Bad</div>

<!-- Never use arbitrary values -->
<div class="p-25 m-15">Bad (these classes don't exist)</div>

<!-- Never create custom CSS with arbitrary values -->
<style>
.custom {
  padding: 25px;  /* Bad - use var(--spacing-24) */
  color: #123456; /* Bad - use var(--color-xxx) */
}
</style>

<!-- Never modify foundation files -->
Don't edit: src/foundation/*.css
```

---

## 🔍 Finding the Right Class

### Method 1: Search Foundation Files

```bash
# Find all margin classes
grep "\.m-" src/foundation/spacing.css

# Find color variables
grep "color-blue" src/foundation/colors.css

# Find text size classes
grep "\.text-" src/foundation/typography.css
```

### Method 2: Check Component Examples

```bash
# See how existing components use foundation classes
cat src/components/card/card.css
cat src/components/button/button.css
```

### Method 3: Ask Claude

"What spacing class gives me 24px padding?"
→ Use `p-24`

"What's the CSS variable for blue-500?"
→ Use `var(--color-blue-500)`

"How do I center content with flexbox?"
→ Use `flex-row flex-justify-center flex-align-center`

---

## 🔨 Build Commands

```bash
# Build the site
npx @11ty/eleventy

# Watch mode (if configured)
npx @11ty/eleventy --watch --serve

# View output
open docs/index.html
```

---

## 📚 Reference Files

| File | Purpose |
|------|---------|
| **[.clauconfig](.clauconfig)** | Claude Code configuration with project metadata |
| **[.cursorrules](.cursorrules)** | Comprehensive rules for Cursor AI |
| **[agents.md](agents.md)** | Detailed CSS constraints and validation checklist |
| **[readme.md](readme.md)** | Project overview |
| **This file** | Quick reference for common tasks |

---

## 🎓 Learning Path

### 1. Understand the Constraint
- Read: [agents.md](agents.md)
- Key concept: Only use `src/foundation/` CSS

### 2. Explore Foundation Files
- Open: [src/foundation/foundation.css](src/foundation/foundation.css)
- See what's imported
- Browse each file to understand available classes

### 3. Study Components
- Browse: [src/components/](src/components/)
- See how components combine foundation classes
- Note the BEM naming pattern

### 4. Build Something
- Start with a simple card or button
- Use only foundation classes
- Check against the validation checklist in [agents.md](agents.md)

---

## 💡 Tips for Working with Claude Code

### Good Prompts

```
"Create a button component using SwageCSS foundation classes"
"Add a card layout with only utilities from src/foundation/spacing.css"
"What spacing variable should I use for 32px?"
"Show me the BEM pattern for a modal component"
```

### Get Better Results

1. **Be specific about foundation-only**: "using only src/foundation/ classes"
2. **Reference existing patterns**: "like the card component in src/components/"
3. **Ask for validation**: "check this against SwageCSS constraints"
4. **Request alternatives**: "what foundation class is closest to 25px padding?"

---

## 🐛 Troubleshooting

### "Class doesn't exist"
→ Check [src/foundation/](src/foundation/) files
→ Use approved spacing scale (not arbitrary values)

### "Styles not applying"
→ Ensure [src/swage.css](src/swage.css) is imported in HTML
→ Check CSS specificity (avoid `!important`)

### "Theme not working"
→ Verify `data-theme` attribute on `<html>` element
→ Use semantic color variables (not direct scale colors)

### "Build failing"
→ Check [.eleventy.js](.eleventy.js) configuration
→ Ensure all template files are valid Liquid syntax

---

## 📞 Need Help?

1. **Check foundation files**: [src/foundation/](src/foundation/)
2. **Review component examples**: [src/components/](src/components/)
3. **Read detailed docs**: [agents.md](agents.md)
4. **Check Cursor rules**: [.cursorrules](.cursorrules)
5. **Ask Claude**: Be specific about using foundation-only classes

---

*SwageCSS v0.2 - Generated for Claude Code optimization*
