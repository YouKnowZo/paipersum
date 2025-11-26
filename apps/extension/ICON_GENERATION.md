# Browser Extension Icon Generation

The paiperSum logo has been updated with the new brand colors:
- Navy Blue: `#1E3A5F`
- Orange: `#F5A623`
- Secondary Blue: `#2C5F8D`

## Current Icon Files

- `icon.svg` - Full detailed logo (best for 128px)
- `icon-simple.svg` - Simplified logo (best for smaller sizes)

## Generate PNG Icons

To generate the PNG icon files from the SVG sources:

### Option 1: Using rsvg-convert (Linux/Mac)
```bash
cd apps/extension/public

# Generate icon16.png
rsvg-convert -w 16 -h 16 icon-simple.svg -o icon16.png

# Generate icon48.png
rsvg-convert -w 48 -h 48 icon-simple.svg -o icon48.png

# Generate icon128.png
rsvg-convert -w 128 -h 128 icon.svg -o icon128.png
```

### Option 2: Using Inkscape
```bash
cd apps/extension/public

# Generate icons
inkscape icon-simple.svg -w 16 -h 16 -o icon16.png
inkscape icon-simple.svg -w 48 -h 48 -o icon48.png
inkscape icon.svg -w 128 -h 128 -o icon128.png
```

### Option 3: Using ImageMagick
```bash
cd apps/extension/public

convert -background none -resize 16x16 icon-simple.svg icon16.png
convert -background none -resize 48x48 icon-simple.svg icon48.png
convert -background none -resize 128x128 icon.svg icon128.png
```

### Option 4: Using Online Tools
1. Open [CloudConvert](https://cloudconvert.com/svg-to-png) or similar
2. Upload `icon-simple.svg`
3. Set dimensions to 16x16, 48x48
4. Upload `icon.svg` and set to 128x128
5. Download and place in `apps/extension/public/`

### Option 5: Using Figma/Design Tool
1. Import the SVG files into Figma, Sketch, or similar
2. Export as PNG at the required sizes
3. Save to `apps/extension/public/`

## Logo Design

The paiperSum logo features:
- A stylized "P" icon combining geometric shapes
- Orange/yellow accent representing "ai"
- Navy blue primary color
- White circle accent for visual interest
- Clean, modern, professional appearance

The text logo displays "paiperSum" with the "ai" portion in orange.
