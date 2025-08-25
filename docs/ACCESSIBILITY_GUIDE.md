# WCAG 2.2 Level AA Accessibility Guide

## Overview
This guide documents the accessibility standards and implementation patterns for the Falcon Pointe Community Association website. All components and pages must meet WCAG 2.2 Level AA standards.

## Quick Reference Checklist

### Before marking any component complete:
- [ ] Keyboard navigable (tab order logical, no traps)
- [ ] Screen reader tested with VoiceOver/NVDA/JAWS
- [ ] Color contrast verified (4.5:1 normal text, 3:1 large text)
- [ ] ARIA labels present where needed
- [ ] Focus indicators visible (3px outline minimum)
- [ ] Error messages announced to screen readers
- [ ] Loading states announced
- [ ] Touch targets minimum 44x44 CSS pixels
- [ ] Works at 400% zoom without horizontal scroll
- [ ] Respects reduced motion preferences

## Implementation Patterns

### Skip Navigation
```tsx
// Always include in main layout
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<main id="main-content" tabIndex={-1}>
  {children}
</main>
```

### Focus Management
```css
/* Enhanced focus indicators */
*:focus-visible {
  outline: 3px solid hsl(var(--ring));
  outline-offset: 3px;
  transition: outline-offset 0.1s ease;
}
```

### Interactive Controls
```tsx
// Icon-only buttons require aria-label
<button 
  onClick={handleClick}
  aria-label="Close navigation menu"
  aria-expanded={isOpen}
>
  <X aria-hidden="true" />
</button>

// Link purposes must be clear
<Link 
  to="/contact"
  aria-label="Go to contact page"
  className="focus:outline-none focus:ring-2 focus:ring-primary"
>
  Contact
</Link>
```

### Form Fields
```tsx
// All inputs need proper labels and descriptions
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-required={required}
  aria-describedby="email-help email-error"
/>
<div id="email-help" className="sr-only">
  Enter your email address for notifications
</div>
<div id="email-error" role="alert" aria-live="polite">
  {errorMessage}
</div>
```

### Images
```tsx
// Meaningful alt text, not generic "Image"
<img 
  src={imageSrc}
  alt={image?.alt_text || `${location} community image`}
/>

// Decorative images
<img src={decorativeImage} alt="" role="presentation" />
```

### Carousels and Dynamic Content
```tsx
// Carousels need pause controls and proper announcements
<section 
  aria-label="Hero image carousel"
  aria-live="polite"
  aria-atomic="false"
>
  <button 
    onClick={() => setIsPlaying(!isPlaying)}
    aria-label={isPlaying ? "Pause carousel" : "Start carousel"}
  >
    {isPlaying ? "⏸️" : "▶️"}
  </button>
</section>
```

### Navigation Menus
```tsx
// Proper semantic structure and ARIA
<nav aria-label="Main navigation">
  <button
    aria-expanded={isOpen}
    aria-controls="mobile-menu"
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    Menu
  </button>
</nav>
```

## Testing Requirements

### Automated Testing
```typescript
// Use jest-axe for component testing
import { axe, toHaveNoViolations } from 'jest-axe';

test('Component has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist
1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Verify logical tab order
   - Test Escape key to close modals/menus
   - No keyboard traps

2. **Screen Reader Testing**
   - Test with VoiceOver (Mac), NVDA (Windows), or JAWS
   - Verify landmark navigation
   - Check heading structure (h1-h6)
   - Confirm form labels are announced
   - Test error announcements

3. **Visual Testing**
   - Test at 200% and 400% zoom
   - Verify focus indicators are visible
   - Test in high contrast mode
   - Confirm no content loss at 320px width

4. **Motion and Animation**
   - Test with `prefers-reduced-motion: reduce`
   - Verify autoplay can be paused
   - Check smooth scrolling preferences

## Common Violations and Fixes

### Color Contrast Issues
```css
/* Ensure minimum contrast ratios */
.text-normal { color: /* 4.5:1 ratio minimum */ }
.text-large { color: /* 3:1 ratio for 18pt+ text */ }
.ui-component { border-color: /* 3:1 ratio for UI elements */ }
```

### Missing Form Labels
```tsx
// Wrong
<input placeholder="Enter email" />

// Right
<label htmlFor="email">Email Address</label>
<input id="email" placeholder="Enter email" />
```

### Inaccessible Custom Components
```tsx
// Wrong
<div onClick={handleClick}>Button</div>

// Right
<button onClick={handleClick}>Button</button>
```

## Tools and Resources

### Browser Extensions
- axe DevTools
- WAVE Web Accessibility Evaluator
- Lighthouse Accessibility Audit

### Testing Tools
- jest-axe for automated testing
- Pa11y for CI/CD integration
- Color Oracle for color blindness simulation

### Screen Readers
- VoiceOver (macOS built-in)
- NVDA (Windows free)
- JAWS (Windows commercial)

## Maintenance

### Regular Audits
- Run automated tests with each PR
- Conduct manual testing for new features
- Review color contrast when updating designs
- Test keyboard navigation with each release

### Documentation Updates
- Update this guide when adding new patterns
- Document any accessibility exceptions with justification
- Maintain test coverage for all interactive components

## Support

For questions about accessibility implementation:
1. Check this guide first
2. Refer to [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
3. Test with real assistive technologies
4. When in doubt, choose the more accessible option

Remember: Accessibility is not a checklist—it's about creating an inclusive experience for all users.