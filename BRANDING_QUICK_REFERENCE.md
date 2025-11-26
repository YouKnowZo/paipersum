# paiperSum Branding - Quick Reference

## Brand Colors

```css
/* Primary Colors */
--brand-navy: #1E3A5F
--brand-orange: #F5A623
--brand-blue: #2C5F8D

/* Variations */
--brand-navy-dark: #152940
--brand-orange-light: #FDB44B
```

## Logo

The paiperSum logo emphasizes "ai":
- **p**[**ai**]**perSum** ← "ai" is orange, rest is navy
- Stylized "P" icon with geometric shapes
- Tagline: "Legal, Simplified"

## Usage

### Primary Button
```jsx
className="bg-gradient-to-r from-brand-orange to-brand-navy text-white"
```

### Secondary Button
```jsx
className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
```

### Logo Component
```jsx
<Logo size="md" showTagline={true} />
// sizes: 'sm' | 'md' | 'lg'
```

### Text Highlight
```jsx
<span className="text-brand-orange">ai</span>
```

## Files to Check

- Logo: `apps/web/src/components/Logo.tsx`
- Colors: `apps/web/tailwind.config.cjs`
- Styles: `apps/web/src/styles.css`
- Icon: `apps/web/public/favicon.svg`

## Documentation

- **BRANDING_UPDATE_SUMMARY.md** - Complete overview
- **BRANDING_COMPLETION_REPORT.md** - Implementation details
- **apps/extension/ICON_GENERATION.md** - Extension icon guide

---

✅ **Status**: Complete and verified  
🎨 **Brand Identity**: Navy + Orange = Professional + Innovative  
🚀 **Build**: Passing
