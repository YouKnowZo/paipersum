# Professional Testimonial Assets

## AI-Generated Avatar URLs

Replace the LEGO emojis with these professional AI-generated avatars:

### Sarah M. - Small Business Owner
- **Avatar URL:** `https://i.pravatar.cc/150?img=33`
- **Alternative:** `https://ui-avatars.com/api/?name=Sarah+M&background=007bff&color=fff&size=150`
- **Fallback:** Use initials "SM" on blue background

### Mike T. - Software Engineer
- **Avatar URL:** `https://i.pravatar.cc/150?img=68`
- **Alternative:** `https://ui-avatars.com/api/?name=Mike+T&background=28a745&color=fff&size=150`
- **Fallback:** Use initials "MT" on green background

### Jessica L. - Teacher
- **Avatar URL:** `https://i.pravatar.cc/150?img=47`
- **Alternative:** `https://ui-avatars.com/api/?name=Jessica+L&background=6f42c1&color=fff&size=150`
- **Fallback:** Use initials "JL" on purple background

## Updated HTML Structure

```html
<!-- Replace the emoji avatars with this structure -->
<div class="testimonial-avatar">
  <img src="https://i.pravatar.cc/150?img=33" alt="Sarah M." />
</div>
```

## CSS for Professional Look

```css
.testimonial-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--accent-primary-light);
  box-shadow: var(--shadow-sm);
  background: var(--surface-bg);
}

.testimonial-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Fallback for initials */
.testimonial-avatar-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.5rem;
  color: var(--text-on-accent);
  background: var(--accent-primary);
}
```

## Alternative: Use AI-Generated Faces

For truly unique avatars, use these services:

1. **This Person Does Not Exist:** https://thispersondoesnotexist.com
2. **Generated Photos:** https://generated.photos/faces
3. **Unsplash Portraits:** https://unsplash.com/s/photos/portrait

## Professional Testimonials Content

Keep your testimonials authentic but professional:

### Example 1: Gym Membership
**Before:** "Saved me from a gym membership trap!"
**Better:** "Found a hidden $200 cancellation fee buried in paragraph 47. Thank you, PaiperSum!"

### Example 2: Apartment Lease  
**Before:** "Caught 3 unfair clauses"
**Better:** "Identified three problematic clauses that would have cost me thousands. The landlord removed them when I showed her the analysis."

### Example 3: Phone Contract
**Before:** "Finally understand my phone contract"
**Better:** "Discovered I was paying for insurance I never signed up for. Got a $450 refund!"

## Implementation Priority

1. **Quick Fix (5 min):** Use UI-Avatars API for initials
2. **Better (30 min):** Use Pravatar for random but professional photos
3. **Best (1 hour):** Generate custom AI avatars or use stock photos with model releases
