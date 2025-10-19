# PaiperSum User Flows & Animations

## User Flows

---

## Flow 1: New Document Analysis

**Goal**: Upload and analyze a legal document

### Steps
```
1. Dashboard
   ↓ Click "Upload" or drag file
2. Upload View
   ↓ File selected
3. Processing State
   ↓ OCR/Text extraction (2-5s)
4. Analysis Running
   ↓ ML model inference (3-8s)
5. Analysis Summary
   ↓ View results
6. [Optional] Clauses Detail
   ↓ Deep dive into specific clauses
7. [Optional] Download Report
```

### Screen Transitions
```
Dashboard → Upload: Modal or inline expansion (300ms)
Upload → Processing: Fade in progress bar (150ms)
Processing → Analysis: Spinner + skeleton lines
Analysis → Summary: Fade in + slide up (400ms)
```

### User Actions
| Step | Action | Feedback |
|------|--------|----------|
| Upload | Drag file or click | Dropzone highlight blue |
| Processing | Wait | Progress bar animates, % shown |
| Analysis ready | Auto-navigate | Success toast appears |
| View clauses | Click card | Expand with slide-down |
| Download | Click button | Download starts, toast confirms |

### Error Paths
- **Upload fails**: Show error message + retry button
- **Invalid file**: Toast warning, disable analyze button
- **Analysis timeout**: "Taking longer than usual" + retry
- **API error**: Generic error page with support link

---

## Flow 2: Document Comparison

**Goal**: Compare two versions to see risk delta

### Steps
```
1. Analysis Summary
   ↓ Click "Compare Versions"
2. Version Selector
   ↓ Select doc A and doc B
3. Comparison View
   ↓ Side-by-side diff
4. Delta Summary
   ↓ Risk change, new/removed clauses
5. [Optional] Export Comparison Report
```

### Key Interactions
- **Select versions**: Dropdown with document list
- **Highlight changes**: 
  - New clauses: Yellow background
  - Removed: Gray strike-through
  - Increased risk: Red arrow + number
  - Decreased risk: Green arrow + number

---

## Flow 3: Payment Upgrade

**Goal**: Upgrade from Free to Pro plan

### Steps
```
1. Dashboard or Settings
   ↓ Click "Upgrade to Pro" or reach limit
2. Billing Page
   ↓ View plans
3. Select Pro Plan
   ↓ Click "Upgrade"
4. Stripe Checkout Modal
   ↓ Enter payment details
5. Payment Processing
   ↓ Stripe webhook (2-3s)
6. Success Confirmation
   ↓ Redirect to dashboard
7. Pro Features Unlocked
```

### Stripe Integration Flow
```
Frontend                Backend              Stripe
   |                       |                    |
   |--- POST /create-checkout ----------------->|
   |<-- checkout_session_url -------------------|
   |                       |                    |
   |--- Open Stripe modal -------------------->|
   |                       |                    |
   |                       |<-- webhook --------|
   |                       |                    |
   |--- Redirect to /success ----------------->|
   |<-- Show success toast --------------------|
```

### Error Paths
- **Payment declined**: Show error, allow retry
- **Session expired**: Redirect to billing, show warning
- **Webhook failure**: Background retry + email notification

---

## Flow 4: Sign Up & First Use

**Goal**: New user creates account and analyzes first document

### Steps
```
1. Landing Page
   ↓ Click "Sign Up"
2. Registration Form
   ↓ Enter email + password
3. Email Verification (optional)
   ↓ Click link in email
4. Welcome Modal
   ↓ Quick tutorial (optional skip)
5. Dashboard (Empty State)
   ↓ Prominent "Upload First Document" CTA
6. Upload & Analyze
   ↓ Follow Flow 1
7. First Analysis Complete
   ↓ Celebration animation + tooltip hints
```

### Onboarding Experience
- **Welcome modal**: 3-slide tutorial (optional)
- **Empty state**: Large illustration + clear CTA
- **First success**: Confetti animation + "You're all set!" toast
- **Tooltips**: Guide user through key features (dismissible)

---

## Flow 5: Extension Analysis

**Goal**: Analyze a web page (e.g., Terms of Service)

### Steps
```
1. User browses to ToS page
   ↓ Extension icon shows in browser
2. Click Extension Icon
   ↓ Sidebar panel opens (slide in from right)
3. Panel Displays "Analyze Page" Button
   ↓ Click to start
4. Extension Reads Page Text
   ↓ Extract <body> text, limit 20,000 chars
5. Send to API (/analyze)
   ↓ Show progress indicator
6. Display Results Inline
   ↓ Risk meter + top clauses
7. [Optional] Click "View Full Report"
   ↓ Opens web app with full analysis
```

### Extension UX Details
- **Panel position**: Fixed top-right, 340px width
- **Close button**: X icon in header
- **Progress**: Linear bar + "Analyzing..." text
- **Results**: Compact risk meter + simplified clause list
- **Deep link**: "View Full Report" opens dashboard with pre-loaded analysis

---

## Animations & Micro-interactions

---

## Animation 1: Risk Meter Fill

**Trigger**: Analysis summary loads

```javascript
// Pseudo-code
riskMeter.width = 0
animate(riskMeter.width, targetScore + '%', {
  duration: 400ms,
  easing: 'ease-out',
  delay: 200ms // stagger after page load
})
```

**Figma**: Smart Animate between frames with width change

---

## Animation 2: Upload Card Hover

**Trigger**: Mouse enters dropzone

```css
.dropzone:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 30px rgba(15, 76, 129, 0.15);
  border-color: #0f4c81;
  background: rgba(15, 76, 129, 0.02);
  transition: all 300ms ease-out;
}
```

**Figma**: Interactive component with hover variant

---

## Animation 3: Clause Card Expand

**Trigger**: Click "Show original text"

```javascript
// Slide down reveal
clauseDetail.display = 'block'
clauseDetail.height = 0
animate(clauseDetail.height, 'auto', {
  duration: 300ms,
  easing: 'ease-in-out'
})
```

**Figma**: Smart Animate with height change + opacity fade in

---

## Animation 4: Success Checkmark

**Trigger**: Analysis complete, payment success, upload complete

**Type**: Lottie JSON animation

```json
{
  "name": "Success Check",
  "frames": 60,
  "duration": 1000ms,
  "sequence": [
    "Circle draw (0-300ms)",
    "Check draw (300-600ms)",
    "Burst particles (600-1000ms)"
  ]
}
```

**Colors**: brand/green (#2e7d32)

**Figma**: Use LottieFiles plugin or export as GIF placeholder

---

## Animation 5: Loading Skeleton Shimmer

**Trigger**: Any loading state (analysis, page load, upload)

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

**Figma**: Use plugin like Skeleton or manually with gradient animation

---

## Animation 6: Toast Notification

**Trigger**: Success/error/warning actions

```javascript
// Slide in from right
toast.position = { x: window.width + 400, y: 16 }
animate(toast.position.x, window.width - 416, {
  duration: 300ms,
  easing: 'ease-out'
})

// Auto-dismiss after 4s
setTimeout(() => {
  animate(toast.position.x, window.width + 400, {
    duration: 300ms,
    easing: 'ease-in'
  })
}, 4000)
```

**Figma**: Smart Animate with position change

---

## Animation 7: Button Loading State

**Trigger**: Click button that starts async action

```javascript
button.disabled = true
button.opacity = 0.7
spinner.display = 'inline-block'
animate(spinner.rotation, 360, {
  duration: 800ms,
  loop: true,
  easing: 'linear'
})
```

**Figma**: Component variant with spinner + reduced opacity

---

## Animation 8: Modal Enter/Exit

**Trigger**: Open/close modal

```javascript
// Enter
overlay.opacity = 0
modal.scale = 0.95
animate(overlay.opacity, 1, { duration: 150ms })
animate(modal.scale, 1, { 
  duration: 300ms, 
  delay: 150ms,
  easing: 'ease-out'
})

// Exit (reverse)
```

**Figma**: Smart Animate with overlay fade + modal scale

---

## Animation 9: Comparison Delta Highlight

**Trigger**: Load comparison view

```javascript
// Highlight new clauses
newClauses.forEach((clause, index) => {
  animate(clause.background, 'yellow/50', {
    duration: 400ms,
    delay: index * 100ms, // stagger
    easing: 'ease-out'
  })
  // Pulse effect
  animate(clause.scale, [1, 1.03, 1], {
    duration: 600ms,
    delay: index * 100ms
  })
})
```

**Figma**: Smart Animate with background color + scale change

---

## Animation 10: Page Transition

**Trigger**: Navigate between screens

```javascript
// Fade out current + slide in next
currentPage.animate({
  opacity: 0,
  translateX: '-50px'
}, {
  duration: 200ms,
  easing: 'ease-in'
})

nextPage.animate({
  opacity: [0, 1],
  translateX: ['50px', '0px']
}, {
  duration: 300ms,
  delay: 200ms,
  easing: 'ease-out'
})
```

**Figma**: Prototype links with "Smart Animate" transition

---

## Accessibility: Reduced Motion

All animations respect `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Figma**: Document alternate static states for reduced-motion users

---

## Animation Performance Guidelines

| Animation | Property | Why |
|-----------|----------|-----|
| ✅ Good | `transform`, `opacity` | GPU-accelerated |
| ⚠️ Careful | `width`, `height` | Can trigger reflow |
| ❌ Avoid | `left`, `top`, `margin` | Forces layout recalc |

---

## Prototype Flows in Figma

### Setup Prototype Connections

1. **Dashboard → Analysis**
   - Click "Analyze" button
   - Transition: Smart Animate, 300ms ease-out

2. **Analysis → Clauses Detail**
   - Click "View All Clauses"
   - Transition: Push from right, 400ms

3. **Upload → Processing → Success**
   - After delay trigger (3s simulate)
   - Transition: Smart Animate

4. **Settings Tabs**
   - Horizontal tab navigation
   - Transition: Dissolve, 200ms

5. **Modal Open/Close**
   - Click trigger or overlay
   - Transition: Smart Animate (scale + fade)

### Interactive Overlay

Create overlay for:
- Modals (centered, 50% opacity background)
- Toasts (top-right position, fixed)
- Extension panel (right-side, slide in)

---

## Flow Documentation Checklist

- [ ] All primary flows mapped (5+ key journeys)
- [ ] Error states documented
- [ ] Success states documented
- [ ] Loading states included
- [ ] Animations specified (duration, easing, properties)
- [ ] Prototype connections in Figma
- [ ] Reduced-motion alternatives noted
- [ ] Performance considerations listed
- [ ] Lottie files exported (if used)
- [ ] Developer handoff notes for each animation
