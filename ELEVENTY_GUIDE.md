# Eleventy (11ty) Guide for SwageCSS

This guide explains how Eleventy works in this project and how to create/modify pages.

---

## 🏗️ What is Eleventy?

Eleventy is a **static site generator** that:
- Reads source files (HTML, Markdown, etc.)
- Processes them through templates
- Generates static HTML output in `docs/`

**Official Docs**: https://www.11ty.dev/docs/

---

## ⚙️ Configuration

### `.eleventy.js` - Main Config File

```javascript
module.exports = function (eleventyConfig) {
    // Copy src/ directory to output unchanged
    eleventyConfig.addPassthroughCopy("src");

    // Add git commit date plugin
    eleventyConfig.addPlugin(pluginGitCommitDate);

    // Custom filters for date formatting (see below)
    eleventyConfig.addFilter("formatCommitDate", function(date) { ... });

    return {
        dir: {
          output: "docs"              // Where to generate files
        },
        pathPrefix: "/swagecss/"      // Base URL for GitHub Pages
    }
};
```

### Key Settings:
- **Output directory**: `docs/` (configured in `.eleventy.js`)
- **Path prefix**: `/swagecss/` (for GitHub Pages deployment)
- **Template engine**: Liquid (Eleventy default)
- **Passthrough copy**: `src/` directory copied to `docs/src/`

---

## 🏃 Running Eleventy

### Build Commands

```bash
# Build once (generates docs/)
npx @11ty/eleventy

# Watch mode - rebuilds on file changes (if configured)
npx @11ty/eleventy --watch

# Serve with hot reload (if configured)
npx @11ty/eleventy --serve
```

### No npm scripts defined!
Currently there are **no build scripts** in `package.json`. Consider adding:

```json
"scripts": {
  "build": "npx @11ty/eleventy",
  "watch": "npx @11ty/eleventy --watch",
  "serve": "npx @11ty/eleventy --serve"
}
```

Then you can run: `npm run build`, `npm run watch`, etc.

---

## 📄 File Processing

### What Eleventy Processes

Eleventy reads these source files:

```
Root directory:
  index.html                → docs/index.html

components/:
  card.html                 → docs/components/card/index.html
  button.html               → docs/components/button/index.html
  badge.html                → docs/components/badge/index.html
  [etc.]

foundation/:
  spacing.html              → docs/foundation/spacing/index.html
  typography.html           → docs/foundation/typography/index.html
  [etc.]

_includes/:
  layout.html               → Template (not output directly)
  _nav.html                 → Partial (not output directly)
  _titleblock.html          → Partial (not output directly)
```

### What Gets Copied (Passthrough)

```
src/ → docs/src/ (copied unchanged)
  ├── foundation/
  ├── components/
  ├── modules/
  ├── swage.css
  └── demo.css
```

---

## 📝 Front Matter

Every page needs **YAML front matter** at the top:

```html
---
layout: layout.html
title: Page Title
heading: Main Heading
secondary: Subtitle
section: Components or Foundation
design-status: in-progress
content-status: in-progress
---

<section>
  <!-- Your content here -->
</section>
```

### Front Matter Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `layout` | Template to use | `layout.html` |
| `title` | Browser title | `Swageblocks • Foundation • Spacing` |
| `heading` | Page heading | `Spacing System` |
| `secondary` | Subtitle | `Spacing imported from CUI` |
| `section` | Navigation section | `Foundation` or `Components` |
| `status` | Draft/published | `draft` |

### Available in Templates

These variables are accessible in `_includes/layout.html`:

```liquid
{{ title }}       <!-- Page title -->
{{ heading }}     <!-- Main heading -->
{{ secondary }}   <!-- Subtitle -->
{{ content }}     <!-- Your page content -->
```

---

## 🎨 Layouts & Templates

### Main Layout: `_includes/layout.html`

This wraps all pages with common structure:

```html
<!DOCTYPE html>
<html data-theme="cui">
  <head>
    <title>SwageCSS v0.2 • {{ title }}</title>
    <link href="{{ '/' | url }}src/swage.css" rel="stylesheet" />
    <link href="{{ '/' | url }}src/demo.css" rel="stylesheet" />
  </head>
  <body>
    <div class="wrap">
      <header>
        <!-- Logo, heading, etc. -->
        <h1>{{ heading }}</h1>
        <p>{{ secondary }}</p>
      </header>

      <main>
        {% include '_nav.html' %}
        <article>{{ content }}</article>
      </main>

      <footer>
        <!-- Footer content -->
      </footer>
    </div>
  </body>
</html>
```

### Partials (Includes)

**`_includes/_nav.html`** - Navigation menu
**`_includes/_titleblock.html`** - Title block component

Use with: `{% include '_nav.html' %}`

---

## 🔧 Custom Filters

### Date Formatting Filters

The project includes custom filters for formatting git commit dates:

```liquid
<!-- ISO format: 2024-01-15 14:30:45 -->
{{ page.gitCommitDate | formatCommitDateTime }}

<!-- Date only: 2024-01-15 -->
{{ page.gitCommitDate | formatCommitDate }}

<!-- Readable: Jan 15, 2024, 2:30 PM -->
{{ page.gitCommitDate | formatCommitReadable }}

<!-- Long: Monday, January 15, 2024 at 2:30 PM -->
{{ page.gitCommitDate | formatCommitLong }}

<!-- 24-hour: 01/15/2024 14:30 -->
{{ page.gitCommitDate | formatCommit24Hour }}

<!-- Relative: 2 hours ago, 3 days ago -->
{{ page.gitCommitDate | formatCommitRelative }}
```

### URL Filter

The `url` filter adds the path prefix:

```liquid
<!-- Without filter -->
<link href="/src/swage.css" rel="stylesheet" />

<!-- With filter (adds /swagecss/ prefix) -->
<link href="{{ '/' | url }}src/swage.css" rel="stylesheet" />
<!-- Output: /swagecss/src/swage.css -->
```

---

## 📋 Creating New Pages

### Component Documentation Page

1. **Create file**: `components/my-component.html`

2. **Add front matter**:
```html
---
layout: layout.html
title: Swageblocks • Components • My Component
heading: My Component
secondary: Component description
section: Components
design-status: in-progress
content-status: in-progress
---
```

3. **Add content**:
```html
<section>
    <p class="body-lg text-gray-600 mb-24">
        Description of what this component does.
    </p>
</section>

<section class="component-section">
    <h2>Basic Example</h2>

    <div class="my-component">
        <div class="my-component__header">Example</div>
        <div class="my-component__body">Content</div>
    </div>
</section>

<section class="component-section">
    <h2>Variants</h2>

    <div class="my-component my-component--large">
        <div class="my-component__header">Large Variant</div>
        <div class="my-component__body">More padding</div>
    </div>
</section>
```

4. **Build**:
```bash
npx @11ty/eleventy
```

5. **Output**: `docs/components/my-component/index.html`

### Foundation Documentation Page

Same process, but:
- Place in: `foundation/my-feature.html`
- Set `section: Foundation`
- Output: `docs/foundation/my-feature/index.html`

---

## 🎯 Common Liquid Patterns

### Conditionals

```liquid
{% if status == "draft" %}
  <div class="draft-notice">This is a draft</div>
{% endif %}
```

### Loops

```liquid
{% for item in items %}
  <div class="item">{{ item.name }}</div>
{% endfor %}
```

### Comments

```liquid
{# This is a comment - won't appear in output #}
```

### Variables

```liquid
{% assign myVar = "value" %}
{{ myVar }}
```

---

## 🚀 Workflow

### Making Changes

1. **Edit source files**:
   - Components: `components/*.html`
   - Foundation: `foundation/*.html`
   - Layout: `_includes/layout.html`
   - Home: `index.html`
   - CSS: `src/components/`, `src/foundation/`

2. **Run Eleventy**:
```bash
npx @11ty/eleventy
```

3. **Check output**:
```bash
open docs/index.html
# Or view specific page
open docs/components/card/index.html
```

4. **Commit changes**:
```bash
git add components/ foundation/ _includes/ index.html docs/
git commit -m "Update component documentation"
```

### ⚠️ Important Rules

- ✅ **DO** edit source files (components/, foundation/, _includes/)
- ✅ **DO** run Eleventy after changes
- ✅ **DO** commit both source AND generated docs/
- ❌ **DON'T** edit files in docs/ directly
- ❌ **DON'T** forget to run Eleventy before committing

---

## 🐛 Troubleshooting

### Build Fails

**Check syntax**:
- Valid YAML front matter (no tabs, proper indentation)
- Closed Liquid tags (`{% %}` and `{{ }}`)
- No missing layouts or includes

**Run with debug**:
```bash
DEBUG=Eleventy* npx @11ty/eleventy
```

### Changes Not Showing

1. Did you run `npx @11ty/eleventy`?
2. Are you viewing the correct file in docs/?
3. Check browser cache (hard refresh: Cmd+Shift+R)

### Wrong Paths/URLs

- Check `pathPrefix` in `.eleventy.js`
- Use `{{ '/' | url }}` filter for all links
- Example: `{{ '/' | url }}src/swage.css` → `/swagecss/src/swage.css`

### Plugin Errors

```bash
# Reinstall dependencies
npm install

# Check package versions
npm list
```

---

## 📚 Plugins Used

### eleventy-plugin-git-commit-date

Adds `gitCommitDate` variable with last commit date for each file.

**Usage**:
```liquid
{{ page.gitCommitDate | formatCommitRelative }}
```

---

## 🎓 Learning Resources

### Official Docs
- **Eleventy**: https://www.11ty.dev/docs/
- **Liquid Syntax**: https://liquidjs.com/
- **Front Matter**: https://www.11ty.dev/docs/data-frontmatter/

### Common Tasks
- **Layouts**: https://www.11ty.dev/docs/layouts/
- **Includes**: https://www.11ty.dev/docs/languages/liquid/#supported-features
- **Filters**: https://www.11ty.dev/docs/filters/
- **Collections**: https://www.11ty.dev/docs/collections/

---

## ✅ Quick Checklist

Before committing:

- [ ] Edited source files (not docs/)
- [ ] Valid YAML front matter
- [ ] Proper Liquid syntax
- [ ] Ran `npx @11ty/eleventy`
- [ ] Checked output in docs/
- [ ] Committed both source and docs/
- [ ] No errors in build output

---

*SwageCSS v0.2 - Eleventy Guide*
