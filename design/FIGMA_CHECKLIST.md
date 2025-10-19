# PaiperSum Figma Creation Checklist

Use this checklist when creating the actual Figma file from the specifications.

---

## 🎨 Design System Setup

### Variables & Tokens
- [ ] Import `tokens.json` to Figma Variables
- [ ] Create color variables (brand, ink, paper, border)
- [ ] Create number variables (spacing, radius)
- [ ] Create string variables (fonts)
- [ ] Verify all values match tokens.json exactly

### Typography Styles
- [ ] Create text styles for all combinations:
  - [ ] Heading 1 (Inter 700, 30px)
  - [ ] Heading 2 (Inter 600, 24px)
  - [ ] Heading 3 (Inter 600, 20px)
  - [ ] Body (Inter 400, 16px)
  - [ ] Small (Inter 400, 14px)
  - [ ] Caption (Inter 400, 12px)
  - [ ] Legal (Source Serif Pro 400, 16px)
- [ ] Set line heights (tight 1.25, base 1.5, relaxed 1.75)
- [ ] Link to Google Fonts in description

### Color Styles
- [ ] Brand colors (Blue, Green, Yellow, Red)
- [ ] Ink shades (900, 700, 500, 300)
- [ ] Paper shades (0, 50, 100)
- [ ] Border (200)
- [ ] Add descriptions to each color style

### Effects (Shadows)
- [ ] Shadow SM (0px 1px 2px, 6% black)
- [ ] Shadow MD (0px 6px 18px, 10% black)
- [ ] Shadow LG (0px 10px 30px, 12% black)

---

## 🧩 Component Library

### PS/Button
- [ ] Create component set with variants:
  - [ ] Primary variant
  - [ ] Secondary variant
  - [ ] Destructive variant
  - [ ] Ghost variant
- [ ] Add states to each variant:
  - [ ] Default
  - [ ] Hover
  - [ ] Active
  - [ ] Disabled
  - [ ] Loading
- [ ] Set auto-layout: Horizontal, gap 8px, padding 12px 24px
- [ ] Add icon slot (optional, 20px)
- [ ] Height: 40px fixed
- [ ] Border radius: 10px
- [ ] Test all combinations work

### PS/Input
- [ ] Create component set with types:
  - [ ] Text
  - [ ] Textarea
  - [ ] File
  - [ ] Select
- [ ] Add states:
  - [ ] Default
  - [ ] Focus (2px blue ring)
  - [ ] Error (2px red ring)
  - [ ] Disabled (60% opacity)
- [ ] Include label slot
- [ ] Include helper/error text slot
- [ ] Auto-layout: Vertical, gap 6px
- [ ] Input height: 40px
- [ ] Border: 1px border/200

### PS/Card
- [ ] Create variants:
  - [ ] Default (border only)
  - [ ] Elevated (shadow, no border)
  - [ ] Border (thick border)
- [ ] Padding: 16px and 24px variants
- [ ] Border radius: 12px
- [ ] Auto-layout: Vertical, gap 12px
- [ ] Min-width: hug, max-width: fill

### PS/Badge
- [ ] Create variants:
  - [ ] Risk Green
  - [ ] Risk Yellow
  - [ ] Risk Red
  - [ ] Confidence
  - [ ] Status
- [ ] Height: 24px
- [ ] Padding: 4px 10px
- [ ] Border radius: 6px
- [ ] Icon slot: 16px
- [ ] Gap: 4px

### PS/RiskMeter
- [ ] Container: 100% width, 24px height
- [ ] Background bar: paper/100, rounded full
- [ ] Fill bar: Variable color based on score
  - [ ] 0-24: Green
  - [ ] 25-49: Green
  - [ ] 50-74: Yellow
  - [ ] 75-100: Red
- [ ] Labels above: "Risk" and "Score · Level"
- [ ] Auto-layout: Vertical, gap 6px

### PS/Modal
- [ ] Overlay: Frame fill rgba(0,0,0,0.5)
- [ ] Container: 560px width, padding 24px
- [ ] Border radius: 16px
- [ ] Shadow: LG
- [ ] Header: Inter 600, 20px
- [ ] Body: Inter 400, 14px, line-height 1.5
- [ ] Footer: Buttons, gap 12px, justify right

### PS/Toast
- [ ] Variants: Success, Warning, Error, Info
- [ ] Width: 400px max
- [ ] Padding: 12px 16px
- [ ] Border-left: 4px solid (variant color)
- [ ] Icon: 20px
- [ ] Close button: X icon
- [ ] Auto-layout: Horizontal, gap 12px

### PS/NavItem
- [ ] States:
  - [ ] Default
  - [ ] Hover
  - [ ] Active
- [ ] Height: 40px
- [ ] Padding: 8px 12px
- [ ] Border radius: 8px
- [ ] Icon: 20px
- [ ] Gap: 10px
- [ ] Active: Left border 3px blue

### PS/Skeleton
- [ ] Types:
  - [ ] Text line (16px height)
  - [ ] Block (custom size)
  - [ ] Circle (avatar)
- [ ] Linear gradient: paper/100 → paper/50 → paper/100
- [ ] Note: Animate in prototype (shimmer left to right)

### PS/ClauseCard
- [ ] Based on PS/Card
- [ ] Border-left: 3px (risk color)
- [ ] Padding: 16px
- [ ] Gap: 12px
- [ ] Risk dot: 8px circle
- [ ] Title: Inter 600, 16px
- [ ] Summary: Inter 400, 14px
- [ ] Citation: Inter 400, 12px, italic
- [ ] Hover: shadow-md

---

## 📱 Screens - Desktop (1440×900)

### PS/Dashboard
- [ ] Header: 64px, logo left, profile right
- [ ] 2-column grid: 3fr 1fr
- [ ] Upload card with dropzone
- [ ] Recent analyses sidebar
- [ ] Use PS/Card, PS/Button components
- [ ] Add realistic content

### PS/AnalysisSummary
- [ ] Document header with risk bar
- [ ] 2-column grid: 5fr 7fr
- [ ] Left: Summary panel with PS/RiskMeter
- [ ] Right: Top 5 clauses (PS/ClauseCard)
- [ ] Action buttons: Download, Compare

### PS/ClausesDetail
- [ ] Breadcrumb navigation
- [ ] Filter bar with chips
- [ ] Search input
- [ ] Scrollable list of PS/ClauseCard
- [ ] Expandable sections for original text

### PS/Upload-Processing
- [ ] 3 states on separate frames:
  - [ ] Upload (dropzone)
  - [ ] Processing (progress bar, skeletons)
  - [ ] Complete (success icon, button)
- [ ] 600px container, centered

### PS/Auth
- [ ] Sign Up frame
- [ ] Sign In frame
- [ ] 440px card, centered
- [ ] Logo at top
- [ ] Form inputs (PS/Input)
- [ ] Primary button
- [ ] Link to alternate flow

### PS/Billing
- [ ] Monthly/Annual toggle
- [ ] 3 plan cards (Free, Pro, Team)
- [ ] 320px width each
- [ ] "Popular" badge on Pro
- [ ] Feature lists with checkmarks
- [ ] CTA buttons

### PS/Settings
- [ ] Tabbed interface
- [ ] Tab content area
- [ ] Form sections with dividers
- [ ] Toggle switches
- [ ] Danger zone at bottom (red text)

### PS/Extension
- [ ] 340px × 600px frame
- [ ] Header with close button
- [ ] Analyze button
- [ ] Compact risk card
- [ ] Simplified clause list
- [ ] View full report link

### PS/Compare (Bonus)
- [ ] Side-by-side layout
- [ ] Version headers
- [ ] Delta indicators (↑↓)
- [ ] Highlighted changes (new, removed)
- [ ] Color-coded risk changes

---

## 📱 Screens - Mobile (375×812)

### Mobile Adaptations
- [ ] PS/Dashboard - Single column, bottom nav
- [ ] PS/AnalysisSummary - Stacked layout
- [ ] PS/ClausesDetail - Full-width cards
- [ ] PS/Upload - Full-screen dropzone
- [ ] PS/Auth - Adjusted padding
- [ ] PS/Billing - Vertical card stack
- [ ] PS/Settings - Full-width tabs

---

## 🔗 Prototype & Interactions

### Flow Connections
- [ ] Dashboard → Upload (click CTA)
- [ ] Upload → Processing (after file select)
- [ ] Processing → Analysis Summary (auto after delay)
- [ ] Summary → Clauses Detail (click view all)
- [ ] Clause card → Expanded (click card)
- [ ] Dashboard → Settings (nav click)
- [ ] Billing → Stripe modal (click upgrade)
- [ ] Auth: Sign Up ↔ Sign In (toggle links)

### Interactive Components
- [ ] Button hover states
- [ ] Input focus states
- [ ] Card hover (scale, shadow)
- [ ] Nav item active states
- [ ] Modal open/close
- [ ] Toast appear/dismiss

### Smart Animate
- [ ] Risk meter fill animation
- [ ] Modal scale + fade
- [ ] Page transitions
- [ ] Clause expand/collapse

### Overlays
- [ ] Modal: Center position, 50% dark bg
- [ ] Toast: Top-right position, fixed

---

## 📸 Assets & Exports

### Icons
- [ ] Export all Lucide icons as SVG
- [ ] Include: Upload, FileText, Shield, AlertTriangle, CheckCircle, Info, XCircle, ChevronRight, Search, Settings, User, CreditCard, Download, Eye, Lock

### Illustrations
- [ ] Empty state illustration
- [ ] Success illustration
- [ ] Error illustration (optional)

### Logos
- [ ] PaiperSum logo (light)
- [ ] PaiperSum logo (dark) (if needed)
- [ ] Export as SVG + PNG

### Screenshots
For pitch deck and documentation:
- [ ] Dashboard view
- [ ] Analysis summary
- [ ] Upload flow
- [ ] Billing page
- [ ] Extension panel
- [ ] Export as PNG, 2x resolution

---

## 📐 Organization & Naming

### File Structure
- [ ] Cover page with project info
- [ ] Design System page
- [ ] Components page
- [ ] Desktop Screens page
- [ ] Mobile Screens page
- [ ] Flows & Prototypes page
- [ ] Assets & Exports page

### Naming Convention
- [ ] Components: PS/ComponentName
- [ ] Screens: PS/ScreenName
- [ ] Variants: Component/Variant/State
- [ ] Layers: Descriptive names (not "Frame 123")

### Documentation
- [ ] Add descriptions to all components
- [ ] Annotate complex interactions
- [ ] Add notes for developers
- [ ] Link to this documentation in file description

---

## ✅ Quality Assurance

### Design System
- [ ] All colors use variables
- [ ] All spacing uses 4px base grid
- [ ] Typography styles applied consistently
- [ ] Border radius consistent
- [ ] Shadows applied correctly

### Components
- [ ] All variants work independently
- [ ] States transition smoothly
- [ ] Auto-layout constraints correct
- [ ] Resizing behaves as expected
- [ ] Icons properly aligned

### Screens
- [ ] All use components (no detached instances)
- [ ] Spacing matches spec
- [ ] Alignment is pixel-perfect
- [ ] Content is realistic (not lorem ipsum)
- [ ] All text readable (no cut-off)

### Prototype
- [ ] All interactions work
- [ ] Transitions are smooth
- [ ] No dead-end screens
- [ ] Back navigation functional
- [ ] Overlay positioning correct

### Accessibility
- [ ] Color contrast verified (use Stark plugin)
- [ ] Focus states visible
- [ ] Touch targets ≥40px
- [ ] Text size ≥14px (except captions)
- [ ] Alternative text in descriptions

---

## 🚀 Pre-Delivery Checklist

### File Preparation
- [ ] Remove unused components
- [ ] Organize layers clearly
- [ ] Name everything properly
- [ ] Add cover page with overview
- [ ] Include changelog/version notes

### Developer Handoff
- [ ] Share file with view access
- [ ] Export tokens.json
- [ ] Export all assets to `/design/assets/`
- [ ] Create preview video (optional)
- [ ] Notify development team

### Documentation
- [ ] Verify all `.md` files are up to date
- [ ] Check code examples work
- [ ] Update any changed specifications
- [ ] Add Figma file link to README

---

## 📹 Bonus: Preview Video

If creating preview.mp4:
- [ ] Screen recording of prototype flow
- [ ] 30-60 seconds
- [ ] 1920×1080 resolution
- [ ] Show key interactions:
  - Upload flow
  - Analysis results
  - Risk meter animation
  - Navigation between screens
- [ ] Add subtle background music (optional)
- [ ] Export as MP4, H.264 codec

---

## 🎯 Priority Checklist

If time is limited, prioritize:

**Must Have**
- [x] Design tokens and variables
- [x] Core components (Button, Input, Card, RiskMeter)
- [x] Dashboard screen
- [x] Analysis Summary screen
- [x] Basic prototype flow

**Should Have**
- [ ] All components with variants
- [ ] All desktop screens
- [ ] Complete prototype
- [ ] Mobile screens

**Nice to Have**
- [ ] Advanced animations
- [ ] Comparison view
- [ ] Preview video
- [ ] Extensive annotations

---

**Estimated Time**: 20-40 hours for complete implementation

**Status**: Ready to start building in Figma!

**Reference**: Use `components.md`, `screens.md`, and `flows.md` for detailed specifications.
