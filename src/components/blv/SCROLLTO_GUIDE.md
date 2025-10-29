# ScrollTo Component

The ScrollTo component provides progressive section reveal with smooth fade in/out animations for BLV prototype pages.

## Features

- **Progressive Reveal**: Shows only one section at a time, revealing the next as you scroll
- **Smooth Transitions**: Fade in/out animations with scale and stagger effects
- **Bidirectional**: Works when scrolling up or down
- **Navigation Dots**: Visual indicator showing current section and allowing quick navigation
- **Keyboard Support**: Arrow keys and Page Up/Down for navigation
- **Anchor Link Support**: Works with anchor links to specific sections
- **Front Matter Enabled**: Easy to enable/disable per page
- **Progress Tracking**: Footer button is disabled until all sections have been viewed

## Usage

### 1. Enable in Front Matter

Add `scrollto-enabled: true` to your page's front matter:

```yaml
---
layout: templates/blv/layout.html
title: My Page
scrollto-enabled: true
---
```

### 2. Add ScrollTo Class to Sections

Add the `scrollto` class to each section you want to progressively reveal:

```html
<section id="welcome" class="scrollto">
    <h1>Welcome</h1>
    <p>Content here...</p>
</section>

<section id="features" class="scrollto">
    <h2>Features</h2>
    <p>More content...</p>
</section>

<section id="conclusion" class="scrollto">
    <h2>Conclusion</h2>
    <p>Final content...</p>
</section>
```

### 3. Add Anchor Links (Optional)

Link between sections using anchor links:

```html
<a href="#features" class="button">Next Section</a>
```

## Behavior

### Section Visibility
- Only the first section is visible on page load
- As you scroll down, the next section fades in while the current one fades out
- Scrolling up reverses the behavior

### Child Element Animation
Child elements within each section have:
- **Staggered entrance**: Each child element animates in sequence
- **Scale + fade effect**: Elements start scaled (1.15x) and fade in as they appear
- **Smooth timing**: 0.6s transitions with spring easing

### Navigation Dots
- Positioned in the upper right corner of the article
- Shows total number of sections
- Highlights current active section
- Click to jump to any section

### Keyboard Navigation
- **Arrow Down / Page Down**: Go to next section
- **Arrow Up / Page Up**: Go to previous section

### Footer Button State
- **Initial State**: Button is disabled when page loads
- **Tracking**: Component tracks which sections have been viewed
- **Enabled**: Button becomes enabled once all sections have been viewed
- **Click Prevention**: Disabled button clicks are prevented programmatically

## CSS Structure

The component uses these CSS classes:

- `.scrollto` - Applied to each section
- `.scrollto-active` - Added to the currently visible section
- `.scrollto-dots` - Container for navigation dots
- `.scrollto-dot` - Individual navigation dot
- `.scrollto-dot.active` - Active navigation dot

## How It Works

1. **Initialization**: JavaScript detects `data-scrollto-enabled` attribute on `<html>`
2. **Setup**: First section is marked as active, others are hidden
3. **Scroll Detection**: Monitors scroll position and detects section changes
4. **State Management**: Adds/removes `scrollto-active` class to control visibility
5. **Animation**: CSS transitions handle the fade/scale effects

## Customization

### Adjust Animation Speed

Edit `/src/themes/blv/components/scrollto.css`:

```css
/* Change transition duration */
html[data-theme="blv"][data-scrollto-enabled] .scrollto {
    transition: opacity 1.2s ease-in-out; /* default: 0.8s */
}
```

### Disable Navigation Dots

Comment out the `createNavigationDots()` call in `/src/themes/blv/components/scrollto.js`:

```javascript
// createNavigationDots(); // Comment this line to disable
```

### Change Minimum Section Height

Edit the `min-block-size` in the CSS:

```css
html[data-theme="blv"][data-scrollto-enabled] .scrollto {
    min-block-size: 80vh; /* default: 100vh */
}
```

## Example Page

See `/prototypes/blv/renewal/01/index.html` for a complete working example.

## Browser Support

Works in all modern browsers. Uses:
- CSS transitions
- Intersection Observer API (for scroll detection)
- Smooth scrolling

## Troubleshooting

### Sections not appearing
- Ensure `scrollto-enabled: true` is in front matter
- Check that sections have `class="scrollto"`
- Verify JavaScript is loading (check browser console)

### Animations not smooth
- Check browser performance
- Reduce number of child elements if needed
- Adjust transition timing in CSS

### Navigation dots not showing
- Verify `createNavigationDots()` is called in JS
- Check z-index isn't being overridden
- Ensure right-side space is available

## Files

- **CSS**: `/src/themes/blv/components/scrollto.css`
- **JavaScript**: `/src/themes/blv/components/scrollto.js`
- **Layout Integration**: `/_includes/templates/blv/layout.html`
- **Import**: `/src/themes/blv/blv.css` (line 3)

