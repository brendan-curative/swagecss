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

See [CLAUDE_GUIDE.md](CLAUDE_GUIDE.md) for complete developer documentation, or [agents.md](agents.md) for detailed CSS constraints and validation rules.

---

## ⚠️ Important: Never Edit `docs/`

The `docs/` directory is **completely auto-generated** by Eleventy. Always edit source files (components/, foundation/, _includes/) and run `npx @11ty/eleventy` to regenerate. See [ELEVENTY_GUIDE.md](ELEVENTY_GUIDE.md) for details.

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