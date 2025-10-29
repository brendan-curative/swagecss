# Agreement Component

The Agreement component displays large bodies of text in a scrollable container with a checkmark button for user agreement. It's designed for terms of service, privacy policies, and other legal agreements in the BLV prototype theme.

## Features

- **Scrollable Content**: Large text bodies in a fixed-height scrollable container
- **Checkmark Button**: Uses the BLV Checkmark Button component for agreement
- **Button State Management**: Footer button is disabled until all agreements are checked
- **Multiple Agreements**: Supports multiple agreement sections on one page
- **Front Matter Enabled**: Easy to enable/disable per page
- **BLV Themed**: Styled for the BLV prototype theme

## Usage

### 1. Enable in Front Matter

Add `agreement-enabled: true` to your page's front matter:

```yaml
---
layout: templates/blv/layout.html
title: Terms and Conditions
agreement-enabled: true
---
```

### 2. HTML Structure

```html
<div class="agreement">
    <!-- Scrollable content -->
    <div class="agreement__content">
        <h1>Terms of Service</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        <h2>Section 1: User Responsibilities</h2>
        <p>More content here...</p>
        <!-- Add as much content as needed -->
    </div>
    
    <!-- Agreement checkmark button -->
    <button class="checkmark-button agreement__button" data-checked="false">
        <svg class="checkmark-button__icon" width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.5" cy="10.8672" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        <span class="checkmark-button__text">I agree to the Terms of Service</span>
    </button>
</div>
```

### 3. Multiple Agreements

You can have multiple agreement sections on one page. All must be checked before the footer button is enabled:

```html
<div class="agreement">
    <div class="agreement__content">
        <h1>Terms of Service</h1>
        <p>Content...</p>
    </div>
    <button class="checkmark-button agreement__button" data-checked="false">
        <svg class="checkmark-button__icon" width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.5" cy="10.8672" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        <span class="checkmark-button__text">I agree to the Terms of Service</span>
    </button>
</div>

<div class="agreement">
    <div class="agreement__content">
        <h1>Privacy Policy</h1>
        <p>Content...</p>
    </div>
    <button class="checkmark-button agreement__button" data-checked="false">
        <svg class="checkmark-button__icon" width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.5" cy="10.8672" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        <span class="checkmark-button__text">I agree to the Privacy Policy</span>
    </button>
</div>
```

## CSS Classes

### Main Classes
- `.agreement` - Container for the entire agreement section
- `.agreement__content` - Scrollable content area
- `.agreement__button` - Checkmark button wrapper (inherits from `.checkmark-button`)
- `.checkmark-button` - Base checkmark button styling (BLV component)
- `.checkmark-button__icon` - Checkmark icon SVG
- `.checkmark-button__text` - Button text label

### State Classes
- `.checkmark-button--checked` - Applied when button is checked
- `data-checked="true"` - Data attribute indicating checked state
- `data-checked="false"` - Data attribute indicating unchecked state

## Behavior

### Content Scrolling
- Maximum height: 300px
- Scrollable overflow with styled scrollbar
- Supports all HTML content (headings, paragraphs, lists, etc.)

### Checkmark Button Interaction
1. **Unchecked state**: Gray border, gray text, empty circle icon
2. **Hover**: Visual feedback on hover state  
3. **Checked state**: Primary color border and text, filled circle with checkmark
4. **Click**: Toggles between checked and unchecked states

### Footer Button State
- **Initial**: Button is disabled (`button--big-primary-disabled`)
- **Tracking**: Monitors all agreement checkmark buttons on the page
- **Enabled**: Button becomes clickable once ALL agreements are checked
- **Re-disabled**: Button is disabled again if any button is unchecked
- **Coordination**: If both `agreement-enabled` and `scrollto-enabled` are active, the button will only enable when BOTH all agreements are checked AND all scrollto sections have been viewed

## Styling

### Content Area
The scrollable content area supports:
- Headings (h1, h2, h3)
- Paragraphs with spacing
- Lists (ul, ol)
- Custom scrollbar styling

### BLV Theme
The component includes special styling for the BLV theme:
- Semi-transparent white background
- Backdrop blur effect
- BLV shadow styling

## Customization

### Adjust Content Height

```css
.agreement__content {
    max-height: 400px; /* Change from default 300px */
}
```

### Custom Scrollbar Colors

```css
.agreement__content::-webkit-scrollbar-thumb {
    background: var(--color-blue-500); /* Change thumb color */
}
```

### Button Text Styling

```css
.checkmark-button__text {
    font-size: var(--font-size-md); /* Adjust font size */
}
```

## Example

View the working examples at `/components/blv/agreement/`

### Full Example Code

```html
---
layout: templates/blv/layout.html
title: Accept Terms
agreement-enabled: true
---

<div class="agreement">
    <div class="agreement__content">
        <h1>Terms of Service</h1>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.</p>
        
        <h2>3. Disclaimer</h2>
        <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
        
        <!-- More sections... -->
    </div>
    
    <button class="checkmark-button agreement__button" data-checked="false">
        <svg class="checkmark-button__icon" width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.5" cy="10.8672" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        <span class="checkmark-button__text">I have read and agree to the Terms of Service</span>
    </button>
</div>
```

## Accessibility

- Checkmark button uses proper button semantics
- Focus states are clearly visible
- ARIA attributes managed by checkmark button component
- `data-checked` attribute provides state information
- Screen reader compatible

## Browser Support

Works in all modern browsers. Uses:
- CSS flexbox for layout
- CSS custom properties for theming
- Webkit scrollbar styling (graceful degradation in Firefox)

## Troubleshooting

### Button not enabling
- Ensure `agreement-enabled: true` is in front matter
- Check that all buttons have class `checkmark-button agreement__button`
- Verify `data-checked` attribute is present on buttons
- Check that checkmark button JavaScript is loading

### Buttons not toggling
- Ensure `toggleCheckmarkButton()` function is available
- Check browser console for JavaScript errors
- Verify checkmark-button.js is loaded before agreement.js

### Content not scrolling
- Check that content exceeds 300px height
- Verify `overflow-y: auto` is not being overridden

### Styling issues
- Ensure both agreement.css and checkmark-button.css are loading
- Check that agreement.css is imported in components.css
- Verify no conflicting CSS rules

## Files

- **CSS**: `/src/components/blv/agreement.css`
- **JavaScript**: `/src/components/blv/agreement.js`
- **Layout Integration**: `/_includes/templates/blv/layout.html`
- **Import**: `/src/themes/blv/blv.css` (line 4)

