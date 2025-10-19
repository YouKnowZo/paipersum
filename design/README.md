# PaiperSum Design System

## 📐 Complete Figma Blueprint

This directory contains the complete design system, specifications, and handoff documentation for PaiperSum.

---

## 📁 File Overview

| File | Description |
|------|-------------|
| **tokens.json** | Design tokens in standard format (colors, spacing, typography, etc.) - Import to Figma or Tailwind |
| **components.md** | Complete component specifications with variants, states, and implementation details |
| **screens.md** | All screen layouts with responsive breakpoints and component usage |
| **flows.md** | User flows, animations, micro-interactions, and prototype specifications |
| **handoff.md** | Developer handoff guide with code examples, token sync, and QA checklist |
| **README.md** | This file - overview and quick links |

---

## 🎨 Design System at a Glance

### Colors
```
Brand
├── Blue   #0f4c81  Primary actions, links
├── Green  #2e7d32  Success, low risk
├── Yellow #f9a825  Warning, moderate risk
└── Red    #c62828  Error, high risk

Neutrals
├── Ink    #0b1324 → #9ca3af  Text hierarchy
├── Paper  #ffffff → #f3f4f6  Backgrounds
└── Border #e5e7eb              Dividers
```

### Typography
- **UI Font**: Inter (400, 500, 600, 700)
- **Legal Font**: Source Serif Pro (400, 600)
- **Scale**: 12px → 30px

### Spacing
- **Scale**: 4px → 64px (xs, sm, md, lg, xl, 2xl, 3xl, 4xl)

### Components
- 10 core components (Button, Input, Card, Badge, RiskMeter, Modal, Toast, NavItem, Skeleton, ClauseCard)
- All with variants, states, and responsive behavior

---

## 🖼️ Screens Included

1. **Dashboard / Upload** - Main entry point, drag-and-drop upload
2. **Analysis Summary** - Risk meter, confidence, clause overview
3. **Clauses Detail** - Filterable list with expandable cards
4. **File Upload / OCR** - Processing states with progress
5. **Authentication** - Sign up, sign in, password reset
6. **Billing & Plans** - 3-tier pricing with Stripe integration
7. **Settings** - Account, privacy, API keys, danger zone
8. **Extension Sidebar** - Compact 340px panel for browser extension
9. **Comparison View** - Side-by-side document diff (bonus)

All screens designed at:
- Desktop: 1440×900
- Mobile: 375×812

---

## 🔄 User Flows

1. **New Document Analysis** - Upload → Process → Analyze → View
2. **Document Comparison** - Select versions → View delta
3. **Payment Upgrade** - View plans → Stripe checkout → Confirm
4. **Sign Up & First Use** - Register → Onboard → First upload
5. **Extension Analysis** - Click icon → Analyze page → View results

---

## 🎬 Animations

All animations specified with:
- Duration (150ms, 300ms, 400ms)
- Easing (ease-in, ease-out, ease-in-out)
- Properties (transform, opacity recommended for performance)
- Reduced motion alternatives

Key animations:
- Risk meter fill (400ms ease-out)
- Upload card hover (scale 1.03)
- Clause expand (300ms slide-down)
- Success checkmark (Lottie, 1s)
- Loading skeleton shimmer

---

## 👨‍💻 For Developers

### Quick Start

1. **Import Design Tokens**
   ```bash
   # Copy tokens to your project
   cp design/tokens.json src/design/tokens.json
   
   # Import in Tailwind config
   const tokens = require('./design/tokens.json')
   ```

2. **Reference Component Specs**
   - See `components.md` for all component details
   - Find Figma → Code mappings
   - Copy React implementation examples

3. **Check Screen Layouts**
   - See `screens.md` for responsive layouts
   - Grid systems and spacing documented
   - Component placement specified

4. **Implement Animations**
   - See `flows.md` for animation specs
   - Duration, easing, and properties listed
   - Framer Motion examples provided

5. **Follow Handoff Guide**
   - See `handoff.md` for complete implementation guide
   - QA checklist included
   - Accessibility requirements detailed

---

## 🎯 Design Principles

### 1. **Clarity First**
Legal information is complex. Every design decision prioritizes clarity and comprehension.

### 2. **Trust Through Transparency**
Users entrust sensitive documents. Design communicates security, privacy, and reliability.

### 3. **Efficiency**
Users want quick answers. Minimize steps, maximize information density where appropriate.

### 4. **Accessibility**
WCAG AA minimum. Keyboard navigation, screen reader support, high contrast, reduced motion.

### 5. **Consistency**
Reusable components, predictable patterns, systematic design language.

---

## 📦 Deliverables Checklist

### Provided
- [x] Design tokens (tokens.json)
- [x] Component specifications (components.md)
- [x] Screen layouts (screens.md)
- [x] User flows (flows.md)
- [x] Animation specs (flows.md)
- [x] Developer handoff (handoff.md)
- [x] This overview (README.md)

### To Create in Figma
- [ ] PaiperSum.fig file with all frames
- [ ] Component library with variants
- [ ] Interactive prototype with flows
- [ ] Responsive variants (mobile/tablet/desktop)
- [ ] Screenshots for pitch deck
- [ ] Preview video (preview.mp4)

### Assets to Export
- [ ] Logo (SVG + PNG)
- [ ] Icons (SVG, currentColor)
- [ ] Illustrations (SVG)
- [ ] Screenshots (PNG, 2x)

---

## 🚀 Implementation Priority

### Phase 1: Core Experience (Week 1-2)
- Design system tokens → Tailwind config
- Core components (Button, Input, Card)
- Dashboard screen
- Analysis summary screen
- Basic upload flow

### Phase 2: Full Features (Week 3-4)
- Remaining components (RiskMeter, Modal, Toast)
- All screen layouts
- Authentication flows
- Settings page
- Responsive design

### Phase 3: Polish (Week 5-6)
- All animations
- Loading/empty/error states
- Accessibility audit
- Performance optimization
- Extension panel

---

## 📐 Design System Metrics

- **Components**: 10 (with variants: ~40)
- **Screens**: 9 (desktop + mobile: ~18)
- **Colors**: 13 semantic tokens
- **Typography scales**: 7 sizes
- **Spacing scale**: 8 steps
- **Animations**: 10 documented
- **Icons**: 15 from Lucide React

---

## 🎨 Figma Setup Instructions

### 1. Create Variables
1. Open Figma file
2. Go to Local Variables
3. Import `tokens.json` using Tokens Studio plugin
4. Map to components

### 2. Create Components
1. Follow `components.md` specifications
2. Name with `PS/` prefix
3. Add all variants and states
4. Use auto-layout with documented constraints

### 3. Build Screens
1. Create frames at 1440×900 (desktop) and 375×812 (mobile)
2. Use component instances
3. Follow layouts in `screens.md`
4. Add realistic content

### 4. Link Prototype
1. Connect screens per `flows.md`
2. Use Smart Animate for transitions
3. Add hover states
4. Test all interactions

### 5. Prepare for Handoff
1. Organize layers clearly
2. Name everything systematically
3. Add annotations for complex interactions
4. Export assets per `handoff.md`

---

## 🔗 Quick Links

- [Design Tokens](./tokens.json) - Import to Figma or code
- [Component Library](./components.md) - All component specs
- [Screen Layouts](./screens.md) - Page structure and responsive design
- [User Flows & Animations](./flows.md) - Interactions and motion
- [Developer Handoff](./handoff.md) - Implementation guide

---

## 📞 Support

### For Design Questions
- Review the relevant `.md` file first
- Check Figma file for visual reference
- Consult `handoff.md` for implementation details

### For Implementation Help
- See code examples in `handoff.md`
- Check component specifications in `components.md`
- Reference token mappings in `tokens.json`

---

## 📊 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-19 | Initial design system release |

---

## 📄 License

This design system is proprietary to PaiperSum. All rights reserved.

---

**Ready to build?** Start with `handoff.md` for step-by-step implementation guidance.
