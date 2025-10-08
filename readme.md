## SwageCSS

*/swāj/* - a shaped tool or die for giving a desired form to metal by hammering or pressure.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="src/img/swageblock-dk.svg">
  <source media="(prefers-color-scheme: light)" srcset="src/img/swageblock-lt.svg">
  <img alt="Swage CSS logo" src="src/img/swageblock-lt.svg">
</picture>

A utility-first CSS framework based on the Curative Design System, built with Eleventy.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the site
npx @11ty/eleventy --serve

# View output
open docs/index.html
```

---

## 📚 Documentation

### For Developers
- **[CLAUDE_GUIDE.md](CLAUDE_GUIDE.md)** - Quick reference for common tasks, CSS patterns, and workflows
- **[ELEVENTY_GUIDE.md](ELEVENTY_GUIDE.md)** - Complete guide to Eleventy static site generator usage
- **[agents.md](agents.md)** - Detailed CSS constraints and validation rules

### For AI Assistants
- **[.clauconfig](.clauconfig)** - Claude Code configuration
- **[.cursorrules](.cursorrules)** - Cursor AI rules and guidelines

---

## 🎨 Core Principle

**Only use CSS from `src/foundation/`** - Never create custom CSS or use inline styles.

All styling must use pre-defined classes and variables:
- ✅ Use foundation utilities: `m-24`, `p-16`, `flex-row`, `text-lg`
- ✅ Use CSS variables: `var(--spacing-24)`, `var(--color-text-default)`
- ❌ Never use arbitrary values: `padding: 15px`, `color: #123456`
- ❌ Never write inline styles: `style="..."`

---

## 📁 Project Structure

```
swagecss/
├── src/foundation/          ← Core CSS (6,855 lines - read-only)
├── src/components/          ← Component CSS files
├── components/              ← Component documentation pages
├── foundation/              ← Foundation documentation pages
├── _includes/               ← Eleventy templates
├── docs/                    ← ⚠️ AUTO-GENERATED (never edit!)
└── .eleventy.js             ← Eleventy configuration
```

---

## 🛠️ Creating Components

See [CLAUDE_GUIDE.md](CLAUDE_GUIDE.md#task-create-a-new-component) for detailed instructions.

**Quick overview:**

1. Create directory: `src/components/my-component/`
2. Add CSS: `my-component.css` (using foundation variables only)
3. Register: Add import to `src/components/components.css`
4. Document: Create `components/my-component.html` (optional)
5. Build: Run `npx @11ty/eleventy`

---

## 🎭 Themes

SwageCSS supports multiple themes via `data-theme` attribute:

```html
<html data-theme="cui">  <!-- Default: Curative UI -->
<html data-theme="blv">  <!-- Alternate: BLV -->
```

---

## ⚠️ Important Rules

### Never Edit `docs/`
The `docs/` directory is **completely auto-generated** by Eleventy.
- ❌ Never edit files in `docs/` - changes will be overwritten
- ✅ Edit source files (components/, foundation/, _includes/)
- ✅ Run `npx @11ty/eleventy` to regenerate

### CSS Constraints
- ❌ Never modify `src/foundation/` without permission
- ❌ Never use `!important`
- ✅ Use approved spacing scale: 0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 160, 240, 320
- ✅ Follow BEM naming: `.component__element--modifier`

---

## 📖 Learn More

- **Foundation CSS**: [src/foundation/](src/foundation/) - All approved CSS rules
- **Components**: [src/components/](src/components/) - Example patterns
- **Eleventy Docs**: https://www.11ty.dev/docs/

---

## 🤝 Working with AI Assistants

This project is optimized for AI-assisted development. Key files:
- [.clauconfig](.clauconfig) - Project structure and constraints
- [.cursorrules](.cursorrules) - Detailed development rules
- [agents.md](agents.md) - CSS constraint validation

**Good prompt**: "Create a button using SwageCSS foundation classes"
**Bad prompt**: "Add custom CSS for this component"

---

*SwageCSS v0.2*