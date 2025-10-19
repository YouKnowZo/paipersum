# PaiperSum Screen Specifications

## Frame Structure
All screens: 1440×900 (Desktop), 375×812 (Mobile)

---

## A. Dashboard / Upload View

**Frame**: `PS/Dashboard`

### Layout Grid
```
┌─────────────────────────────────────────────────────┐
│ Header (64px)                                       │
│ [Logo] ──────────────────────── [Profile] [Logout] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────┐  ┌────────────┐ │
│  │                              │  │  Recent    │ │
│  │  Upload / Paste Area         │  │  Analyses  │ │
│  │                              │  │            │ │
│  │  [Drag & Drop or Paste]      │  │  • Doc 1   │ │
│  │                              │  │  • Doc 2   │ │
│  │  [Analyze Document Button]   │  │  • Doc 3   │ │
│  │                              │  │            │ │
│  └──────────────────────────────┘  └────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Components
- **Header**
  - Left: Logo + App name (Inter 600, 18px)
  - Right: Profile dropdown (avatar 32px) + Logout link
  - Height: 64px
  - Border bottom: 1px border/200
  - Sticky: top

- **Main Content** (2-column grid, 4:1 ratio)
  - Gap: 24px
  - Padding: 32px

- **Upload Card** (PS/Card Elevated)
  - Dropzone: Dashed border 2px border/200, 300px min-height
  - Icon: Upload (Lucide, 48px, ink/300)
  - Text: "Drag & drop a document or paste text"
  - Toggle: Switch between file/text modes
  - CTA: PS/Button Primary "Analyze Document"

- **Recent Analyses Sidebar**
  - Width: 280px
  - Card list: Name, timestamp, risk badge
  - Click → Navigate to analysis

### Specifications
```
Container max-width: 1440px
Padding: 32px
Gap: 24px

Dropzone:
  Min-height: 300px
  Border: 2px dashed border/200
  Border-radius: 12px
  Padding: 48px
  Hover: border brand/blue, bg blue/50

Toggle (File/Text):
  Segmented control
  Height: 32px
  Border-radius: 8px
```

---

## B. Analysis Summary View

**Frame**: `PS/AnalysisSummary`

### Layout
```
┌─────────────────────────────────────────────────────┐
│ Header (64px) + Document Title + Risk Bar           │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  Summary Panel       │  Clauses Panel               │
│                      │                              │
│  • Risk Meter        │  • Top 5 Clauses             │
│  • Confidence        │  • Risk dots                 │
│  • Summary Text      │  • Titles                    │
│                      │  • Snippets                  │
│  [Download Report]   │                              │
│  [Compare Version]   │  [View All Clauses →]        │
│                      │                              │
└──────────────────────┴──────────────────────────────┘
```

### Components
- **Document Header**
  - Title: Inter 700, 24px, ink/900
  - Subtitle: Uploaded date, file size
  - Risk Bar: PS/RiskMeter (full width below title)
  - Height: 120px

- **Summary Panel** (Left, 40% width)
  - Risk Meter: PS/RiskMeter (score + label)
  - Confidence: Badge with percentage
  - Summary: Auto-generated key points (3-5 bullets)
  - Actions: Download (PDF), Compare versions

- **Clauses Panel** (Right, 60% width)
  - Header: "Top Risk Clauses Found"
  - List: 5 × PS/ClauseCard
  - CTA: "View All Clauses →" link

### Specifications
```
Header:
  Padding: 24px 32px
  Border-bottom: 1px border/200

Grid:
  Columns: 2 (5fr 7fr)
  Gap: 32px
  Padding: 32px

Summary Panel Card:
  Padding: 24px
  Gap: 20px

Clause Card:
  Gap: 12px between cards
  Max-height: 600px (scroll if overflow)
```

---

## C. Clauses Detail View

**Frame**: `PS/ClausesDetail`

### Layout
```
┌─────────────────────────────────────────────────────┐
│ Header + Breadcrumb                                 │
├─────────────────────────────────────────────────────┤
│ [Filters: All • Red • Yellow • Green]  [Search]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Clause 1: Indemnification        [Red dot]   │  │
│  │ Summary...                                    │  │
│  │ "Source citation..."                          │  │
│  │ [Show original text ▼]                        │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Clause 2: Arbitration            [Yellow]    │  │
│  │ ...                                           │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Components
- **Breadcrumb**
  - Dashboard > Analysis > Clauses
  - Font: Inter 400, 14px, ink/500

- **Filter Bar**
  - Chips: All (default), Red, Yellow, Green
  - Active state: brand/blue bg, white text
  - Search: PS/Input with search icon

- **Clause List**
  - Expandable PS/ClauseCard
  - Click "Show original text" → Expand to show full legal excerpt
  - Scroll container with sticky header

### Specifications
```
Filter Bar:
  Height: 56px
  Padding: 12px 32px
  Gap: 12px
  Background: paper/50

Clause Cards:
  Gap: 16px
  Padding: 32px

Expandable section:
  Background: paper/50
  Padding: 16px
  Border-radius: 8px
  Font: Source Serif Pro (legal font)
  Transition: height 300ms ease-out
```

---

## D. File Upload / OCR View

**Frame**: `PS/Upload-Processing`

### States

**State 1: Upload**
```
┌───────────────────────────┐
│                           │
│  [Upload Icon 64px]       │
│                           │
│  Drop file here           │
│  or click to browse       │
│                           │
│  Supported: PDF, TXT      │
│                           │
└───────────────────────────┘
```

**State 2: Processing**
```
┌───────────────────────────┐
│  [Document Thumbnail]     │
│                           │
│  Extracting text...       │
│  [Progress bar 45%]       │
│                           │
│  PS/Skeleton lines ▬▬▬▬   │
│                           │
└───────────────────────────┘
```

**State 3: Complete**
```
┌───────────────────────────┐
│  [Check Circle Green]     │
│                           │
│  Analysis Complete!       │
│                           │
│  [View Results Button]    │
│                           │
└───────────────────────────┘
```

### Specifications
```
Container:
  Width: 600px
  Center-aligned
  Min-height: 400px

Progress bar:
  Height: 8px
  Border-radius: 4px
  Transition: width 300ms ease-out

Thumbnail:
  Width: 120px
  Height: 160px
  Border-radius: 8px
  Shadow: sm
```

---

## E. Authentication Flows

**Frame**: `PS/Auth`

### Sign Up
```
┌─────────────────────────────────────┐
│                                     │
│         [PaiperSum Logo]            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Create Account             │   │
│  │                             │   │
│  │  Email    [input]           │   │
│  │  Password [input]           │   │
│  │  Confirm  [input]           │   │
│  │                             │   │
│  │  [ ] I agree to ToS         │   │
│  │                             │   │
│  │  [Sign Up Button]           │   │
│  │                             │   │
│  │  Already have account?      │   │
│  │  [Sign In]                  │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Sign In
```
┌─────────────────────────────────────┐
│         [PaiperSum Logo]            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Sign In                    │   │
│  │                             │   │
│  │  Email    [input]           │   │
│  │  Password [input]           │   │
│  │                             │   │
│  │  [Forgot password?]         │   │
│  │                             │   │
│  │  [Sign In Button]           │   │
│  │                             │   │
│  │  Need an account?           │   │
│  │  [Sign Up]                  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Specifications
```
Container:
  Width: 440px
  Center-aligned (vertical & horizontal)
  Background: Gradient (paper/50 → white)

Card:
  Padding: 40px
  Border-radius: 16px
  Shadow: lg

Logo:
  Height: 48px
  Margin-bottom: 32px

Inputs:
  Gap: 16px
  Full width

Divider:
  Margin: 24px 0
  Text: "or" centered
```

---

## F. Billing & Plans

**Frame**: `PS/Billing`

### Layout (3-Tier Cards)
```
┌──────────────────────────────────────────────────────┐
│  Choose Your Plan              [Monthly • Annual]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │   Free   │  │   Pro    │  │   Team   │          │
│  │          │  │ POPULAR  │  │          │          │
│  │   $0     │  │   $29    │  │   $99    │          │
│  │  /month  │  │  /month  │  │  /month  │          │
│  │          │  │          │  │          │          │
│  │ • 10 docs│  │ • 100 docs│ │ • Unlimited│         │
│  │ • Basic  │  │ • ML Model│ │ • Teams   │          │
│  │          │  │ • OCR     │  │ • API     │          │
│  │          │  │ • Export  │  │ • Support │          │
│  │          │  │          │  │          │          │
│  │[Current] │  │[Upgrade] │  │[Contact] │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Components
- **Toggle** (Monthly/Annual)
  - Show "Save 20%" badge on Annual
  - Height: 40px, Segmented control style

- **Plan Cards** (PS/Card Elevated)
  - Width: 320px
  - Height: 480px
  - Gap: 24px between cards
  - "Popular" badge on Pro tier (brand/blue)

- **Pricing**
  - Font: Inter 700, 48px (price)
  - Font: Inter 400, 18px (period)

- **Features List**
  - CheckCircle icon + text
  - Font: Inter 400, 14px
  - Gap: 12px

### Specifications
```
Container:
  Max-width: 1200px
  Padding: 48px
  Center-aligned

Card:
  Padding: 32px
  Border: 2px solid border/200
  Hover: border brand/blue, shadow-lg

Popular badge:
  Position: absolute top -12px
  Background: brand/blue
  Color: white
  Padding: 4px 12px
  Border-radius: 12px
```

---

## G. Settings

**Frame**: `PS/Settings`

### Layout (Tabbed Interface)
```
┌─────────────────────────────────────────────────────┐
│ Settings                                            │
├─────────────────────────────────────────────────────┤
│ [Account] [Privacy] [API Keys] [Billing]            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Account Information                                │
│  ────────────────────                               │
│  Email:     [user@example.com]     [Change]         │
│  Password:  ••••••••                [Change]         │
│                                                     │
│  Data Retention                                     │
│  ────────────────────                               │
│  Delete analyses after:  [30 days ▼]                │
│  □ Auto-export before deletion                      │
│                                                     │
│  Danger Zone                                        │
│  ────────────────────                               │
│  [Delete my account]  ← Red destructive             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Components
- **Tab Bar**
  - PS/NavItem horizontal layout
  - Active tab: border-bottom 2px brand/blue

- **Sections**
  - Title: Inter 600, 18px, ink/900
  - Divider: 1px border/200 below
  - Content padding: 24px

- **Toggle Switches**
  - Height: 24px
  - Active: brand/blue background

### Specifications
```
Tab bar:
  Height: 48px
  Border-bottom: 1px border/200

Content area:
  Padding: 32px
  Max-width: 800px

Form groups:
  Gap: 32px

Input rows:
  Display: flex
  Justify: space-between
  Align: center
  Gap: 16px
```

---

## H. Extension Sidebar

**Frame**: `PS/Extension` (340px × 600px)

### Layout
```
┌────────────────────────┐
│ PaiperSum         [×]  │
├────────────────────────┤
│                        │
│  [Analyze Page Button] │
│                        │
│  ┌──────────────────┐  │
│  │ Risk: 65         │  │
│  │ [█████░░░░░]     │  │
│  └──────────────────┘  │
│                        │
│  Top Clauses:          │
│                        │
│  • Indemnification     │
│  • Arbitration         │
│  • Data Sharing        │
│  • No Warranty         │
│  • Auto-Renewal        │
│                        │
│  [View Full Report →]  │
│                        │
└────────────────────────┘
```

### Components
- **Header**
  - Height: 48px
  - Logo + Close button
  - Border-bottom: 1px border/200

- **Analyze Button**
  - Full width
  - Margin: 12px

- **Risk Card** (Compact)
  - PS/RiskMeter scaled down
  - Padding: 12px

- **Clause List**
  - Simplified: Icon + Title only
  - Font: Inter 500, 13px
  - Gap: 8px

### Specifications
```
Panel:
  Width: 340px
  Max-height: 600px
  Overflow-y: auto
  Shadow: lg
  Border-radius: 12px

Compact spacing:
  Padding: 12px
  Gap: 12px

Scrollbar:
  Width: 6px
  Thumb: ink/300
  Track: transparent
```

---

## I. Comparison View (Bonus)

**Frame**: `PS/Compare`

### Layout (Side-by-Side Diff)
```
┌─────────────────────────────────────────────────────┐
│ Compare Versions                                    │
├─────────────────────────────────────────────────────┤
│  Version A ────────┐  ┌──────── Version B           │
│  Uploaded: Date    │  │ Uploaded: Date              │
│  Risk: 45          │  │ Risk: 62 (+17) ⚠️           │
│                    │  │                             │
│  Clauses: 8        │  │ Clauses: 11 (+3)            │
│                    │  │                             │
│  ┌───────────────┐ │  │ ┌───────────────┐          │
│  │ • Clause 1    │ │  │ │ • Clause 1    │          │
│  │ • Clause 2    │ │  │ │ • Clause 2    │          │
│  │               │ │  │ │ + Clause 3 NEW│          │
│  │ • Clause 8    │ │  │ │ • Clause 11   │          │
│  └───────────────┘ │  │ └───────────────┘          │
└─────────────────────────────────────────────────────┘
```

### Delta Indicators
- **Increased risk**: Red arrow ↑, red badge
- **Decreased risk**: Green arrow ↓, green badge
- **New clauses**: "+ Clause Name" with yellow highlight
- **Removed clauses**: "- Clause Name" with gray strike-through

---

## Responsive Breakpoints

### Mobile (≤640px)
- Single column layouts
- Stacked cards
- Bottom navigation (4 tabs)
- Full-width buttons
- Reduced padding (16px)

### Tablet (≤1024px)
- 2-column grids where applicable
- Side drawer navigation (hamburger)
- Maintain card spacing

### Desktop (≤1440px)
- Full feature set
- Left sidebar nav
- Multi-column layouts
- Optimal spacing

---

## Screen State Matrix

| Screen | Loading | Empty | Error | Success |
|--------|---------|-------|-------|---------|
| Dashboard | Skeleton | "Upload first doc" | Toast | Document list |
| Analysis | Skeleton | N/A | Retry button | Full summary |
| Upload | Progress bar | Dropzone | Error message | Redirect |
| Settings | — | — | Inline errors | Saved toast |
| Billing | — | — | Payment failed | Success modal |

---

## Screen Delivery Checklist

- [ ] All frames created at 1440×900 and 375×812
- [ ] Components used from PS/* library
- [ ] All states mocked (loading, empty, error, success)
- [ ] Navigation flows linked in Figma prototype
- [ ] Annotations for interactions
- [ ] Responsive behavior documented
- [ ] Exported as PNGs for pitch deck
