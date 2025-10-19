# PaiperSum Component Specifications

## Component Library: PS/* (PaiperSum)

All components use the `PS/` prefix in Figma for organization and auto-layout patterns.

---

## 1. PS/Button

### Variants
| Variant | Background | Text | Border | Use Case |
|---------|-----------|------|--------|----------|
| **Primary** | brand/blue | white | none | Main CTAs, form submits |
| **Secondary** | transparent | ink/700 | border/200 | Cancel, less emphasis |
| **Destructive** | brand/red | white | none | Delete, dangerous actions |
| **Ghost** | transparent | brand/blue | none | Tertiary actions, links |

### States
- **Default**: Base styling
- **Hover**: Scale 1.02, shadow-md (Primary/Destructive), border color darker (Secondary)
- **Active**: Scale 0.98
- **Disabled**: Opacity 0.5, cursor not-allowed
- **Loading**: Spinner icon, text "Processing..."

### Specifications
```
Height: 40px (touch-friendly)
Padding: 12px 24px
Border radius: 10px (sm)
Font: Inter 500 (medium), 14px
Gap (icon + text): 8px
Min-width: 100px
Transition: all 150ms ease-out
```

### Figma Auto Layout
```
Direction: Horizontal
Padding: 12px horizontal, 8px vertical
Alignment: Center
Gap: 8px
Hug contents
```

---

## 2. PS/Input

### Variants
| Type | Description |
|------|-------------|
| **Text** | Single-line input |
| **Textarea** | Multi-line (min 3 rows) |
| **File** | Upload trigger with dropzone |
| **Select** | Dropdown with options |

### States
- **Default**: border/200
- **Focus**: Ring 2px brand/blue, border brand/blue
- **Error**: Ring 2px brand/red, border brand/red
- **Disabled**: Opacity 0.6, bg paper/100

### Specifications
```
Height: 40px (text), auto (textarea)
Padding: 10px 12px
Border: 1px solid border/200
Border radius: 10px (sm)
Font: Inter 400, 14px
Placeholder: ink/300

Label:
  Font: Inter 500, 14px
  Color: ink/700
  Margin bottom: 6px

Helper text:
  Font: Inter 400, 12px
  Color: ink/500
  Margin top: 4px

Error text:
  Font: Inter 400, 12px
  Color: brand/red
  Margin top: 4px
```

### Figma Auto Layout
```
Direction: Vertical
Gap: 6px
Fill container width
```

---

## 3. PS/Card

### Variants
| Type | Styling |
|------|---------|
| **Default** | bg white, border 1px border/200 |
| **Elevated** | bg white, shadow-md, no border |
| **Border** | bg paper/50, border 2px border/200 |

### Specifications
```
Padding: 16px (base) / 24px (large)
Border radius: 12px (md)
Min-height: auto
```

### Usage Examples
- Summary containers
- Clause cards
- Upload areas
- Billing plan tiers

### Figma Auto Layout
```
Direction: Vertical
Padding: 16px / 24px
Gap: 12px
Fill container
```

---

## 4. PS/Badge

### Variants
| Type | Background | Text | Icon |
|------|-----------|------|------|
| **Risk Green** | green/50 | green/800 | CheckCircle |
| **Risk Yellow** | yellow/50 | yellow/900 | AlertTriangle |
| **Risk Red** | red/50 | red/900 | Shield |
| **Confidence** | paper/100 | ink/700 | Info |
| **Status** | blue/50 | blue/800 | — |

### Specifications
```
Height: 24px
Padding: 4px 10px
Border radius: 6px (xs)
Font: Inter 500, 12px
Gap (icon + text): 4px
```

### Figma Auto Layout
```
Direction: Horizontal
Padding: 4px 10px
Gap: 4px
Hug contents
Alignment: Center
```

---

## 5. PS/RiskMeter

### Structure
- **Container**: Full width, height 24px
- **Background**: paper/100, rounded
- **Fill**: Dynamic width (0-100%), colored by threshold
- **Label**: Score + Risk level text

### Color Thresholds
```
0-24:   Minimal  → brand/green
25-49:  Low      → brand/green
50-74:  Moderate → brand/yellow
75-100: High     → brand/red
```

### Specifications
```
Container:
  Height: 24px
  Border radius: 12px (full rounded)
  Background: paper/100

Fill bar:
  Height: 100%
  Border radius: inherit
  Transition: width 400ms ease-out

Labels:
  Top row: "Risk" (left), "Score · Level" (right)
  Font: Inter 500, 14px
  Color: ink/500
  Margin bottom: 6px
```

### Animation
- On mount: Animate width from 0% to target over 400ms
- Use ease-out cubic-bezier

---

## 6. PS/Modal

### Variants
| Type | Use Case |
|------|----------|
| **Alert** | Important info, requires acknowledgment |
| **Confirm** | Confirm destructive action |
| **Info** | Display details, less critical |

### Specifications
```
Overlay:
  Background: rgba(0, 0, 0, 0.5)
  Backdrop blur: 4px

Container:
  Width: 560px max
  Padding: 24px
  Border radius: 16px (lg)
  Background: white
  Shadow: lg

Header:
  Font: Inter 600, 20px
  Color: ink/900
  Margin bottom: 12px

Body:
  Font: Inter 400, 14px
  Color: ink/700
  Line height: 1.5

Footer:
  Gap: 12px
  Margin top: 24px
  Justify: flex-end
```

### Animation
```
Entry: Fade in overlay (150ms), scale modal 0.95 → 1 (300ms)
Exit: Reverse
```

---

## 7. PS/Toast

### Variants
| Type | Icon | Color |
|------|------|-------|
| **Success** | CheckCircle | brand/green |
| **Warning** | AlertTriangle | brand/yellow |
| **Error** | XCircle | brand/red |
| **Info** | Info | brand/blue |

### Specifications
```
Position: Fixed top-right, 16px margin
Width: 400px max
Padding: 12px 16px
Border radius: 10px (sm)
Background: white
Border-left: 4px solid (variant color)
Shadow: md

Auto-dismiss: 4 seconds
Transition: Slide in from right (300ms)
```

---

## 8. PS/NavItem

### States
- **Default**: ink/500 text, no bg
- **Hover**: ink/700 text, paper/100 bg
- **Active**: brand/blue text, blue/50 bg, left border 3px brand/blue

### Specifications
```
Height: 40px
Padding: 8px 12px
Border radius: 8px
Font: Inter 500, 14px
Gap (icon + text): 10px
```

---

## 9. PS/Skeleton

### Types
| Type | Dimensions |
|------|------------|
| **Text line** | Height 16px, width varies |
| **Block** | Custom height/width |
| **Circle** | Avatar/icon placeholders |

### Specifications
```
Background: Linear gradient
  - Base: paper/100
  - Shimmer: paper/50
Animation: Shimmer left to right, 1.5s infinite
Border radius: Inherit from content type
```

---

## 10. PS/ClauseCard

### Custom Component
Specialized card for displaying detected clauses.

### Structure
```
Container (PS/Card variant)
├── Header
│   ├── Risk dot (8px circle)
│   └── Title (Inter 600, 16px)
├── Summary (Inter 400, 14px, ink/700)
└── Citation
    ├── Label "Source:" (Inter 500, 12px, ink/500)
    └── Text (Inter 400, 12px, ink/500, italic)
```

### Specifications
```
Padding: 16px
Gap: 12px
Border-left: 3px solid (risk color)
Hover: shadow-md, translate-y -2px (200ms)
```

---

## Component Usage Matrix

| Component | Dashboard | Analysis | Upload | Settings | Auth | Extension |
|-----------|-----------|----------|--------|----------|------|-----------|
| Button | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Input | — | — | ✓ | ✓ | ✓ | — |
| Card | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Badge | ✓ | ✓ | — | — | — | ✓ |
| RiskMeter | — | ✓ | — | — | — | ✓ |
| Modal | ✓ | ✓ | ✓ | ✓ | — | — |
| Toast | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| NavItem | ✓ | ✓ | ✓ | ✓ | — | — |
| Skeleton | ✓ | ✓ | ✓ | — | — | ✓ |
| ClauseCard | — | ✓ | — | — | — | ✓ |

---

## Icons (Lucide React Set)

Standard 20px size, 1.5px stroke width.

| Icon | Use Case |
|------|----------|
| **Upload** | File upload actions |
| **FileText** | Document references |
| **Shield** | Security, risk indicators |
| **AlertTriangle** | Warnings, moderate risk |
| **CheckCircle** | Success, low risk |
| **Info** | Help text, tooltips |
| **XCircle** | Errors, close actions |
| **ChevronRight** | Navigation, expansion |
| **Search** | Search inputs |
| **Settings** | Settings pages |
| **User** | Profile, account |
| **CreditCard** | Billing |
| **Download** | Export reports |
| **Eye** | View/preview |
| **Lock** | Privacy, secure |

---

## Responsive Behavior

### Breakpoints
- **sm**: ≤640px (Mobile)
- **md**: ≤1024px (Tablet)
- **lg**: ≤1440px (Desktop)

### Component Adaptations

**Buttons**
- Mobile: Full width in forms, stack vertically
- Desktop: Inline with defined widths

**Cards**
- Mobile: Single column, full width
- Tablet: 2 columns
- Desktop: 3 columns (billing plans, dashboard)

**RiskMeter**
- All: Full width of container, responsive labels

**Modal**
- Mobile: Full screen, 16px margins
- Desktop: 560px max-width, centered

**Navigation**
- Mobile: Bottom tab bar
- Desktop: Left sidebar (240px)

---

## Accessibility Annotations

Every component includes:
- ✓ ARIA labels where interactive
- ✓ Focus indicators (2px brand/blue ring)
- ✓ Keyboard navigation support
- ✓ High contrast mode variants
- ✓ Reduced motion respect (`prefers-reduced-motion`)

---

## Component Delivery Checklist

- [ ] All variants created in Figma
- [ ] States documented (default, hover, active, disabled)
- [ ] Auto-layout constraints set
- [ ] Named correctly (PS/ComponentName)
- [ ] Exported to Tailwind component library
- [ ] Storybook stories created
- [ ] Accessibility tested
- [ ] Responsive behavior verified
