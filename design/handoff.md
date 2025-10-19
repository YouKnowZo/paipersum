# PaiperSum Developer Handoff Guide

## Overview

This document bridges the gap between Figma designs and production code, ensuring pixel-perfect implementation and consistent user experience.

---

## 1. Figma File Structure

### Organization
```
📁 PaiperSum.fig
├── 📄 Cover (Project overview)
├── 🎨 Design System
│   ├── Tokens & Variables
│   ├── Colors
│   ├── Typography
│   ├── Spacing & Layout
│   └── Shadows & Effects
├── 🧩 Components
│   ├── PS/Button (all variants)
│   ├── PS/Input (all types)
│   ├── PS/Card
│   ├── PS/Badge
│   ├── PS/RiskMeter
│   ├── PS/Modal
│   ├── PS/Toast
│   ├── PS/NavItem
│   ├── PS/Skeleton
│   └── PS/ClauseCard
├── 📱 Screens (Desktop)
│   ├── Dashboard
│   ├── Analysis Summary
│   ├── Clauses Detail
│   ├── Upload Flow
│   ├── Auth (Sign Up/In)
│   ├── Billing
│   ├── Settings
│   └── Extension
├── 📱 Screens (Mobile)
│   └── (Responsive variants)
├── 🔄 Flows & Prototypes
│   └── Interactive prototype links
└── 📸 Assets & Exports
    ├── Icons
    ├── Illustrations
    └── Logos
```

### Naming Conventions

**Components**: `PS/ComponentName`
- Example: `PS/Button`, `PS/Card/Elevated`

**Screens**: `PS/ScreenName`
- Example: `PS/Dashboard`, `PS/AnalysisSummary`

**Instances**: `ComponentName/Variant/State`
- Example: `Button/Primary/Hover`, `Input/Text/Focus`

---

## 2. Design Token Export

### Figma Variables → Code Sync

**File**: `design/tokens.json`

### Import to Tailwind
```javascript
// tailwind.config.js
const tokens = require('./design/tokens.json')

module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: tokens.color.brand.blue.$value,
          green: tokens.color.brand.green.$value,
          yellow: tokens.color.brand.yellow.$value,
          red: tokens.color.brand.red.$value,
        },
        ink: {
          900: tokens.color.ink['900'].$value,
          700: tokens.color.ink['700'].$value,
          500: tokens.color.ink['500'].$value,
          300: tokens.color.ink['300'].$value,
        },
        paper: {
          0: tokens.color.paper['0'].$value,
          50: tokens.color.paper['50'].$value,
          100: tokens.color.paper['100'].$value,
        },
        border: {
          200: tokens.color.border['200'].$value,
        }
      },
      borderRadius: {
        xs: tokens.radius.xs.$value,
        sm: tokens.radius.sm.$value,
        md: tokens.radius.md.$value,
        lg: tokens.radius.lg.$value,
        xl: tokens.radius.xl.$value,
      },
      spacing: {
        xs: tokens.spacing.xs.$value,
        sm: tokens.spacing.sm.$value,
        md: tokens.spacing.md.$value,
        lg: tokens.spacing.lg.$value,
        xl: tokens.spacing.xl.$value,
        '2xl': tokens.spacing['2xl'].$value,
        '3xl': tokens.spacing['3xl'].$value,
        '4xl': tokens.spacing['4xl'].$value,
      },
      boxShadow: {
        sm: `${tokens.shadow.sm.$value.offsetX} ${tokens.shadow.sm.$value.offsetY} ${tokens.shadow.sm.$value.blur} ${tokens.shadow.sm.$value.color}`,
        md: `${tokens.shadow.md.$value.offsetX} ${tokens.shadow.md.$value.offsetY} ${tokens.shadow.md.$value.blur} ${tokens.shadow.md.$value.color}`,
        lg: `${tokens.shadow.lg.$value.offsetX} ${tokens.shadow.lg.$value.offsetY} ${tokens.shadow.lg.$value.blur} ${tokens.shadow.lg.$value.color}`,
      },
      fontFamily: {
        ui: [tokens.typography['font-family'].ui.$value, 'sans-serif'],
        legal: [tokens.typography['font-family'].legal.$value, 'serif'],
      },
      transitionDuration: {
        fast: tokens.duration.fast.$value,
        base: tokens.duration.base.$value,
        slow: tokens.duration.slow.$value,
      }
    }
  }
}
```

### CSS Variables Alternative
```css
:root {
  /* Colors */
  --color-brand-blue: #0f4c81;
  --color-brand-green: #2e7d32;
  --color-brand-yellow: #f9a825;
  --color-brand-red: #c62828;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  
  /* Radius */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 6px 18px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.12);
}
```

---

## 3. Component Implementation Guide

### PS/Button

**Figma Component**: `PS/Button`

**React Implementation**:
```tsx
// components/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ 
  variant = 'primary', 
  disabled, 
  loading, 
  icon, 
  children,
  onClick 
}: ButtonProps) {
  const baseClasses = 'h-10 px-6 rounded-sm font-medium text-sm transition-all duration-150 flex items-center gap-2 min-w-[100px] justify-center'
  
  const variants = {
    primary: 'bg-brand-blue text-white hover:scale-102 hover:shadow-md disabled:opacity-50',
    secondary: 'bg-transparent text-ink-700 border border-border-200 hover:border-ink-500',
    destructive: 'bg-brand-red text-white hover:scale-102 hover:shadow-md',
    ghost: 'bg-transparent text-brand-blue hover:bg-blue-50'
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  )
}
```

**Figma → Code Mapping**:
| Figma Property | Code Implementation |
|----------------|---------------------|
| Fill (Primary) | `bg-brand-blue` |
| Padding Horizontal | `px-6` (24px) |
| Border Radius | `rounded-sm` (10px) |
| Font Weight | `font-medium` (500) |
| Height | `h-10` (40px) |
| Hover Scale | `hover:scale-102` |

---

### PS/Input

**React Implementation**:
```tsx
interface InputProps {
  type?: 'text' | 'textarea' | 'file' | 'select'
  label?: string
  helperText?: string
  error?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function Input({
  type = 'text',
  label,
  helperText,
  error,
  value,
  onChange,
  placeholder,
  disabled
}: InputProps) {
  const inputClasses = `
    w-full px-3 py-2 rounded-sm border transition-all
    ${error 
      ? 'border-brand-red ring-2 ring-brand-red/20' 
      : 'border-border-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
    }
    ${disabled ? 'opacity-60 bg-paper-100' : 'bg-white'}
  `
  
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          className={inputClasses}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
        />
      ) : (
        <input
          type={type}
          className={inputClasses}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      
      {helperText && !error && (
        <span className="text-xs text-ink-500">{helperText}</span>
      )}
      
      {error && (
        <span className="text-xs text-brand-red">{error}</span>
      )}
    </div>
  )
}
```

---

### PS/RiskMeter

**React Implementation**:
```tsx
interface RiskMeterProps {
  score: number // 0-100
}

export function RiskMeter({ score }: RiskMeterProps) {
  const pct = Math.max(0, Math.min(100, score))
  
  const getLevel = () => {
    if (pct >= 75) return { label: 'High', color: 'bg-brand-red' }
    if (pct >= 50) return { label: 'Moderate', color: 'bg-brand-yellow' }
    if (pct >= 25) return { label: 'Low', color: 'bg-brand-green' }
    return { label: 'Minimal', color: 'bg-brand-green' }
  }
  
  const { label, color } = getLevel()
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-ink-500 mb-1.5">
        <span>Risk</span>
        <span>{pct} · {label}</span>
      </div>
      <div className="h-6 bg-paper-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-slow ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
```

**Animation Note**: Width transition should use `duration-slow` (400ms) with `ease-out` timing function as specified in Figma.

---

## 4. Spacing & Layout

### Figma Auto Layout → Flexbox/Grid

**Figma Auto Layout Properties**:
| Property | CSS Equivalent |
|----------|----------------|
| Direction: Horizontal | `flex-direction: row` |
| Direction: Vertical | `flex-direction: column` |
| Padding | `padding: {value}` |
| Gap | `gap: {value}` |
| Alignment: Center | `align-items: center` |
| Hug contents | `width: fit-content` |
| Fill container | `width: 100%` |

**Example Conversion**:
```
Figma:
  Direction: Vertical
  Padding: 16px
  Gap: 12px
  Fill container

CSS/Tailwind:
  className="flex flex-col p-4 gap-3 w-full"
```

---

## 5. Typography Implementation

### Font Loading
```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+Pro:wght@400;600&display=swap" rel="stylesheet">
```

### Typography Utilities
```tsx
// utils/typography.ts
export const typography = {
  h1: 'font-ui text-3xl font-bold text-ink-900 leading-tight',
  h2: 'font-ui text-2xl font-semibold text-ink-900 leading-tight',
  h3: 'font-ui text-xl font-semibold text-ink-900 leading-tight',
  body: 'font-ui text-base text-ink-700 leading-base',
  small: 'font-ui text-sm text-ink-500 leading-base',
  legal: 'font-legal text-base text-ink-700 leading-relaxed',
}
```

---

## 6. Icon Integration

### Using Lucide React
```bash
npm install lucide-react
```

```tsx
import { 
  Upload, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Info 
} from 'lucide-react'

// Usage
<Button icon={<Upload size={20} />}>
  Upload Document
</Button>
```

### Icon Standards
- **Default size**: 20px
- **Stroke width**: 1.5px
- **Color**: Inherit from parent

---

## 7. Responsive Implementation

### Breakpoint System
```tsx
// hooks/useBreakpoint.ts
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('lg')
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width <= 640) setBreakpoint('sm')
      else if (width <= 1024) setBreakpoint('md')
      else setBreakpoint('lg')
    }
    
    window.addEventListener('resize', updateBreakpoint)
    updateBreakpoint()
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])
  
  return breakpoint
}
```

### Responsive Classes
```tsx
// Desktop: 2-column, Mobile: 1-column
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Content */}
</div>

// Hide on mobile
<div className="hidden md:block">
  {/* Sidebar */}
</div>

// Full width button on mobile
<Button className="w-full md:w-auto">
  Submit
</Button>
```

---

## 8. Animation Implementation

### Framer Motion (Recommended)
```bash
npm install framer-motion
```

### Risk Meter Animation
```tsx
import { motion } from 'framer-motion'

<motion.div
  className={`h-full ${color} rounded-full`}
  initial={{ width: 0 }}
  animate={{ width: `${pct}%` }}
  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
/>
```

### Modal Animation
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.3 }}
>
  {/* Modal content */}
</motion.div>
```

### Reduced Motion
```tsx
const shouldReduceMotion = useReducedMotion()

<motion.div
  animate={shouldReduceMotion ? {} : { opacity: 1 }}
  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
/>
```

---

## 9. State Management

### Component States Mapping

| Figma Variant | React State | Implementation |
|---------------|-------------|----------------|
| Default | — | Base styling |
| Hover | `onMouseEnter/Leave` | Hover classes |
| Active | `onClick` | Active classes |
| Disabled | `disabled={true}` | Disabled attribute + opacity |
| Loading | `loading={true}` | Spinner + disabled |
| Error | `error="message"` | Error styling + text |
| Focus | `:focus` | Focus ring classes |

---

## 10. Accessibility Checklist

### Implementation Requirements

**Keyboard Navigation**
```tsx
// Ensure all interactive elements are keyboard accessible
<button onKeyDown={(e) => e.key === 'Enter' && onClick()}>

// Skip links for screen readers
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

**ARIA Labels**
```tsx
<button aria-label="Upload document">
  <Upload size={20} />
</button>

<input 
  aria-describedby="helper-text"
  aria-invalid={!!error}
/>
{helperText && <span id="helper-text">{helperText}</span>}
```

**Focus Management**
```tsx
// Focus ring
className="focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"

// Trap focus in modal
import { FocusTrap } from '@headlessui/react'

<FocusTrap>
  <Modal>...</Modal>
</FocusTrap>
```

**Color Contrast**
- All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- Brand blue on white: 6.2:1 ✓
- Ink/700 on white: 8.5:1 ✓

---

## 11. Asset Export

### Export Settings from Figma

**Icons** (SVG)
- Format: SVG
- Resolution: 1x
- Color: Inherit (use `currentColor`)

**Illustrations** (PNG)
- Format: PNG
- Resolution: 2x for retina
- Background: Transparent

**Logos** (SVG + PNG)
- SVG for web
- PNG fallback for email/legacy

**Screenshots** (PNG)
- Format: PNG
- Resolution: 2x
- For pitch deck and documentation

### Directory Structure
```
public/
├── icons/
│   ├── logo.svg
│   └── logo-dark.svg
├── illustrations/
│   ├── empty-state.svg
│   └── success.svg
└── screenshots/
    ├── dashboard.png
    ├── analysis.png
    └── upload.png
```

---

## 12. Quality Assurance

### Pre-Launch Checklist

**Design Parity**
- [ ] All colors match tokens exactly
- [ ] Spacing uses design system scale
- [ ] Typography matches spec (font, size, weight, line-height)
- [ ] Border radius consistent across components
- [ ] Shadows match design token values
- [ ] Icons are correct size and stroke width

**Interaction**
- [ ] All hover states implemented
- [ ] Focus states visible and styled
- [ ] Disabled states styled correctly
- [ ] Loading states show appropriate feedback
- [ ] Animations match duration and easing
- [ ] Reduced motion alternatives work

**Responsive**
- [ ] Mobile (375px) layout correct
- [ ] Tablet (768px) layout correct
- [ ] Desktop (1440px) layout correct
- [ ] Breakpoint transitions smooth
- [ ] No horizontal scroll at any width

**Accessibility**
- [ ] Keyboard navigation functional
- [ ] Screen reader tested (NVDA/JAWS)
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Alt text on all images

**Performance**
- [ ] Fonts preloaded
- [ ] Images optimized (WebP with PNG fallback)
- [ ] Animations use GPU-accelerated properties
- [ ] No layout shift (CLS < 0.1)
- [ ] First paint < 1.5s

---

## 13. Figma Plugins Recommended

### For Developers
- **Figma to Code** - Export to React/Tailwind
- **Content Reel** - Fill with realistic data
- **Stark** - Accessibility checker
- **Contrast** - Color contrast checker
- **Design Lint** - Catch design inconsistencies

### For Token Sync
- **Tokens Studio** - Design tokens management
- **Style Dictionary** - Export tokens to multiple formats

---

## 14. Version Control

### Figma Versioning
- Save major milestones as named versions
- Format: "v1.0 - Initial Launch", "v1.1 - Dashboard Updates"
- Document changes in version description

### Code Sync
```bash
# Update design tokens
npm run design:sync

# Generate component stubs from Figma
npm run design:components

# Export assets
npm run design:export-assets
```

---

## 15. Support & Questions

### Developer Resources
- **Figma File**: [Share link to PaiperSum.fig]
- **Design Tokens**: `design/tokens.json`
- **Component Docs**: `design/components.md`
- **Screen Specs**: `design/screens.md`
- **Flow Docs**: `design/flows.md`

### Contact
- **Designer**: [Name/Email]
- **Design Review**: [Slack channel or meeting cadence]
- **Bug Reports**: Use GitHub issues with `design` label

---

## Handoff Delivery Checklist

- [ ] Figma file shared with developer view access
- [ ] All components have variants and states documented
- [ ] Design tokens exported to JSON
- [ ] Typography fonts linked (Google Fonts or self-hosted)
- [ ] Icons exported or npm package specified
- [ ] Assets exported to `/public` directory
- [ ] Animation specifications documented
- [ ] Responsive breakpoints defined
- [ ] Accessibility annotations added
- [ ] Component mapping guide completed
- [ ] Example implementations provided
- [ ] QA checklist created
- [ ] Support contact established

---

**Last Updated**: 2025-10-19  
**Version**: 1.0  
**Figma File**: PaiperSum.fig
