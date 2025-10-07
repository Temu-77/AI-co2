# Components

This directory contains reusable React components for the AI Image CO2 Calculator application.

## LoadingSpinner

A loading overlay component with animated spinner and rotating emojis.

### Features
- Animated circular spinner with gradient colors
- Rotating emojis (⏳ → 🌱 → 🌍) every 800ms
- Glassmorphism overlay effect with backdrop blur
- Optional loading message
- Gradient border animation
- Centered fixed positioning

### Usage

```tsx
import LoadingSpinner from './components/LoadingSpinner';

// Without message
<LoadingSpinner />

// With message
<LoadingSpinner message="Calculating CO2 emissions..." />
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| message | string | No | Optional loading message to display below the spinner |

### Styling
- Uses Tailwind CSS classes
- Glassmorphism effects with `backdrop-blur-xl`
- Gradient border using padding trick
- Custom animations: `animate-spin`, `animate-pulse-slow`, `animate-gradient-shift`, `animate-fade-in`

### Requirements Satisfied
- Requirement 2.3: Loading state with animated spinner and emoji
- Requirement 5.4: Animated loading states with relevant emojis


## ErrorDisplay

A user-friendly error display component with retry and dismiss functionality.

### Features
- Error message with emoji indicators (⚠️)
- AlertCircle icon with pulse animation
- Gradient background (red/orange theme)
- Optional retry button with rotating RefreshCw icon
- Optional dismiss button with X icon
- Smooth hover and active state animations
- Glassmorphism effects with backdrop blur

### Usage

```tsx
import { ErrorDisplay } from './components/ErrorDisplay';

// Basic error display
<ErrorDisplay error="Network connection failed" />

// With retry functionality
<ErrorDisplay 
  error="Failed to fetch CO2 data" 
  onRetry={() => retryApiCall()} 
/>

// With dismiss functionality
<ErrorDisplay 
  error="Invalid file format" 
  onDismiss={() => clearError()} 
/>

// With both retry and dismiss
<ErrorDisplay 
  error="Something went wrong" 
  onRetry={() => retryOperation()}
  onDismiss={() => closeError()}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| error | string | Yes | Error message to display |
| onRetry | () => void | No | Callback function when retry button is clicked |
| onDismiss | () => void | No | Callback function when dismiss button is clicked |

### Styling
- Uses Tailwind CSS classes
- Gradient background: `from-red-500/10 to-orange-500/10`
- Border: `border-red-500/30`
- Glassmorphism effects with `backdrop-blur-xl`
- Hover effects: scale and shadow transitions
- Active state: scale-down animation

### Animations
- Fade-in animation on mount
- Pulse animation on error icon
- Rotate animation on retry button hover (180° rotation)
- Scale transitions on button interactions

### Requirements Satisfied
- Requirement 2.4: User-friendly error message and retry functionality
- Requirement 5.8: Friendly error messages with emojis (⚠️, ❌)


## ImageUpload

A drag-and-drop image upload component with file validation and preview functionality.

### Features
- Drag-and-drop zone with visual feedback
- File input fallback for click-to-upload
- Real-time file validation (type and size)
- Animated drag hover states
- Image preview after successful upload
- Error display for invalid files
- Support for multiple image formats (PNG, JPG, JPEG, WebP, GIF)
- Disabled state support
- Glassmorphism effects with backdrop blur

### Usage

```tsx
import { ImageUpload } from './components/ImageUpload';

function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    // Process the file...
  };

  return (
    <ImageUpload 
      onImageUpload={handleImageUpload}
      isDisabled={isProcessing}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onImageUpload | (file: File) => void | Yes | Callback function called when a valid file is uploaded |
| isDisabled | boolean | Yes | Disables upload interactions when true |

### Drag States
- **Default**: Shows Upload icon and "Upload AI-Generated Image" text
- **Dragging**: Shows Image icon with bounce animation and "Drop your image here" text
- **Border**: Changes from gray-600 to emerald-400 on drag
- **Scale**: Applies scale-105 animation on drag

### File Validation
- **Accepted formats**: PNG, JPG, JPEG, WebP, GIF
- **Maximum size**: 10MB
- **Validation**: Uses `validateImageFile` utility from `utils/imageProcessing`
- **Error display**: Shows error message with ❌ emoji for invalid files

### Preview Functionality
- Creates object URL for image preview
- Displays image in rounded container with border
- Shows success message with ✅ emoji
- Maintains aspect ratio

### Styling
- Uses Tailwind CSS classes
- Glassmorphism effects with `backdrop-blur-xl`
- Gradient button: `from-emerald-500 to-cyan-500`
- Border: Dashed border that changes color on drag
- Hover effects: Border color change and scale transitions
- Active state: scale-95 animation on button press

### Animations
- Fade-in animation for preview and error messages
- Bounce animation on drag hover (Image icon)
- Scale transitions on drag and button interactions
- Smooth color transitions on hover

### Requirements Satisfied
- Requirement 1.1: Image upload interface with drag-and-drop functionality
- Requirement 1.2: Visual feedback on drag (highlight, animation)
- Requirement 1.3: File validation for image formats
- Requirement 1.4: Error message with emoji feedback (❌)
- Requirement 1.7: Replace previous analysis with fade transitions


## ImageMetadataDisplay

A card component that displays extracted image metadata with preview and glassmorphism styling.

### Features
- Card layout with gradient border effects
- Image preview section with emoji placeholder
- Displays resolution, file size, and format
- Fade-in animation on mount
- Glassmorphism effects with backdrop blur
- Responsive grid layout (single column on mobile, 2-column on tablet/desktop)
- Hover effects on metadata cards
- Formatted file size display

### Usage

```tsx
import { ImageMetadataDisplay } from './components/ImageMetadataDisplay';

function App() {
  const metadata: ImageMetadata = {
    width: 1920,
    height: 1080,
    resolution: '1920x1080',
    fileSize: 2457600,
    fileSizeFormatted: '2.4 MB',
    format: 'PNG',
    fileName: 'banner-ad.png',
  };

  const imagePreview = 'data:image/png;base64,...'; // or URL

  return (
    <ImageMetadataDisplay 
      metadata={metadata}
      imagePreview={imagePreview}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| metadata | ImageMetadata | Yes | Image metadata object containing width, height, resolution, fileSize, fileSizeFormatted, format, and fileName |
| imagePreview | string | Yes | Base64 data URL or image URL for preview (empty string shows emoji placeholder) |

### Layout Structure
- **Header**: Title with 🖼️ emoji and gradient text
- **Grid**: 2-column layout on md+ screens, single column on mobile
  - **Left Column**: Image preview with filename
  - **Right Column**: Metadata cards (resolution, file size, format)

### Metadata Cards
Each metadata card includes:
- **Icon emoji**: 📐 (Resolution), 💾 (File Size), 🎨 (Format)
- **Label**: Uppercase tracking-wide text
- **Primary value**: Large bold text
- **Secondary info**: Smaller gray text with additional details
- **Hover effect**: Border color transition to accent color

### Image Preview
- **With preview**: Displays actual image with object-contain
- **Without preview**: Shows 📸 emoji placeholder
- **Container**: Aspect-video ratio with rounded corners
- **Filename**: Truncated text below preview

### Styling
- Uses Tailwind CSS classes
- Glassmorphism effects with `backdrop-blur-xl`
- Gradient border effect: `from-cyan-500/20 via-blue-500/20 to-purple-500/20`
- Card background: `bg-gray-900/90`
- Border: `border-white/10`
- Hover transitions: Border color changes (cyan, blue, purple)

### Responsive Breakpoints
- **Mobile (< 640px)**: Single column layout, smaller text
- **Tablet (640px - 1024px)**: 2-column grid, standard text
- **Desktop (> 1024px)**: 2-column grid, larger text

### Animations
- Fade-in animation on component mount
- Smooth transitions on hover (300ms duration)
- Border color transitions on metadata cards

### Requirements Satisfied
- Requirement 1.6: Display extracted metadata with smooth transitions
- Requirement 4.1: Mobile responsive single-column layout
- Requirement 4.2: Tablet 2-column grid layout
- Requirement 4.3: Desktop multi-column layout
- Requirement 5.1: Fade-in animations on content appearance
- Requirement 5.5: Gradient borders and glassmorphism effects


## CO2EmissionCard

A card component that displays the generation CO2 emissions with animated number count-up effect and gradient styling.

### Features
- Large animated number display with count-up effect
- Gradient text effects for CO2 value
- Number animation using requestAnimationFrame for smooth 60fps performance
- Easing function (ease-out cubic) for natural acceleration/deceleration
- Automatic unit formatting (grams vs kilograms)
- Contextual descriptions with emojis
- Glassmorphism effects with backdrop blur
- Gradient border animation on hover
- Fade-in animation on mount

### Usage

```tsx
import { CO2EmissionCard } from './components/CO2EmissionCard';

function App() {
  const [co2Data, setCO2Data] = useState<CO2Data | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // When new data arrives, trigger animation
    if (co2Data) {
      setIsAnimating(true);
    }
  }, [co2Data]);

  return (
    <CO2EmissionCard 
      generationCO2={co2Data?.generationCO2 || 0}
      isAnimating={isAnimating}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| generationCO2 | number | Yes | CO2 emissions from image generation in grams |
| isAnimating | boolean | Yes | Triggers count-up animation when true |

### Animation Behavior
- **Duration**: 1200ms (1.2 seconds)
- **Easing**: Ease-out cubic for smooth deceleration
- **Frame rate**: 60fps using requestAnimationFrame
- **Start value**: 0
- **End value**: generationCO2 prop value
- **Trigger**: Animates when isAnimating is true or generationCO2 changes
- **Cleanup**: Properly cancels animation frame on unmount

### Value Formatting
Uses `formatCO2Value` utility from `utils/co2Calculations`:
- **< 1000g**: Displays in grams (e.g., "500g")
- **>= 1000g**: Displays in kilograms with appropriate decimals (e.g., "2.50kg")

### Layout Structure
- **Gradient border**: Animated gradient from emerald → cyan → blue
- **Title**: "🎨 Generation CO₂" with emoji
- **Value display**: Large 6xl/7xl text with gradient effect
- **Descriptions**: 
  - "⚡ Energy used to create this image"
  - "🌍 One-time generation cost"

### Styling
- Uses Tailwind CSS classes
- Glassmorphism effects with `backdrop-blur-xl`
- Gradient border effect: `from-emerald-500 via-cyan-500 to-blue-500`
- Gradient text: `from-emerald-400 via-cyan-400 to-blue-400`
- Card background: `bg-gray-900/90`
- Border: `border-white/10`
- Hover effect: Increased gradient opacity

### Responsive Design
- **Mobile**: text-6xl for CO2 value
- **Desktop (md+)**: text-7xl for CO2 value
- Padding and spacing adjust automatically

### Animations
- Fade-in animation on component mount
- Count-up animation for number value
- Gradient shift animation on text
- Border gradient animation on hover
- Smooth transitions (300ms duration)

### Performance Considerations
- Uses requestAnimationFrame for optimal performance
- Properly cleans up animation frames to prevent memory leaks
- Easing function prevents jarring motion
- Gradient animations use CSS for GPU acceleration

### Requirements Satisfied
- Requirement 3.2: Display generation CO2 with animated number transitions
- Requirement 3.7: Animate transitions using smooth number counting effects
- Requirement 5.1: Fade-in animations on content appearance
- Requirement 5.5: Gradient borders and glassmorphism effects
- Requirement 5.7: Smooth count-up effect for numbers

### Example Values
```tsx
// Small value (grams)
<CO2EmissionCard generationCO2={500} isAnimating={true} />
// Displays: "500g"

// Medium value (kilograms with decimals)
<CO2EmissionCard generationCO2={2500} isAnimating={true} />
// Displays: "2.50kg"

// Large value (kilograms rounded)
<CO2EmissionCard generationCO2={150000} isAnimating={true} />
// Displays: "150kg"
```


## EnvironmentalComparisons

A component that displays random environmental comparisons to provide context for CO2 emissions, showing both everyday activities and digital equivalents.

### Features
- Random selection of 2 everyday and 2 digital comparisons
- Uses useMemo for performance optimization
- Emoji icons for visual appeal
- Category-specific gradient colors (emerald for everyday, cyan for digital)
- Glassmorphism effects with backdrop blur
- Responsive 2-column grid on tablet/desktop, single column on mobile
- Hover effects with scale and shadow transitions
- Staggered animation delays for cards
- Category badges for each comparison

### Usage

```tsx
import EnvironmentalComparisons from './components/EnvironmentalComparisons';

function App() {
  const [co2Data, setCO2Data] = useState<CO2Data | null>(null);

  return (
    <EnvironmentalComparisons 
      generationCO2={co2Data?.generationCO2 || 0}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| generationCO2 | number | Yes | CO2 emissions in grams used to trigger re-randomization |

### Comparison Categories

#### Everyday Comparisons (8 options)
- 🚗 Driving a car for 0.5 km
- 💡 Running a LED bulb for 24 hours
- ☕ Making 2 cups of coffee
- 🍔 Eating a small burger
- 🚿 Taking a 5-minute hot shower
- 📱 Charging your phone 10 times
- 🌳 What a tree absorbs in 2 days
- 🔥 Burning a candle for 8 hours

#### Digital Comparisons (8 options)
- 📧 Sending 1,000 emails
- 🎬 Streaming 30 minutes of HD video
- ☁️ Storing 100 GB in the cloud for a month
- 🎮 Gaming online for 2 hours
- 💻 Running a laptop for 8 hours
- 📹 A 1-hour Zoom call
- 🔍 Making 500 Google searches
- 📲 Scrolling social media for 3 hours

### Random Selection Logic
- Uses Fisher-Yates shuffle algorithm for true randomization
- Selects 2 random items from everyday comparisons
- Selects 2 random items from digital comparisons
- Re-randomizes when generationCO2 prop changes
- Implemented with useMemo for performance

### Layout Structure
- **Header**: Title "🌍 Environmental Context" with gradient text
- **Description**: Contextual text explaining the comparisons
- **Grid**: 2-column layout on sm+ screens, single column on mobile
- **Cards**: 4 comparison cards with category-specific styling

### Card Structure
Each comparison card includes:
- **Emoji icon**: Large 4xl emoji representing the activity
- **Description text**: White font-medium text explaining the comparison
- **Category badge**: Small rounded badge showing "🌿 Everyday" or "💻 Digital"
- **Gradient background**: Category-specific gradient overlay
- **Hover effect**: Scale-105 and shadow-xl on hover

### Styling

#### Everyday Category
- Background gradient: `from-emerald-900/30 to-green-900/20`
- Border: `border-emerald-500/30`
- Hover border: `hover:border-emerald-400/50`
- Badge: `bg-emerald-500/20 text-emerald-300`

#### Digital Category
- Background gradient: `from-cyan-900/30 to-blue-900/20`
- Border: `border-cyan-500/30`
- Hover border: `hover:border-cyan-400/50`
- Badge: `bg-cyan-500/20 text-cyan-300`

### Responsive Breakpoints
- **Mobile (< 640px)**: grid-cols-1 (single column)
- **Tablet/Desktop (≥ 640px)**: sm:grid-cols-2 (2 columns)
- **Gap**: gap-4 spacing between cards

### Animations
- **Container**: Fade-in animation on mount
- **Cards**: Slide-up animation with staggered delays (100ms increments)
- **Hover**: Scale-105 and shadow-xl transitions (300ms duration)
- **Gradient overlay**: Opacity transition on hover

### Performance Considerations
- Uses useMemo to prevent unnecessary re-randomization
- Only re-randomizes when generationCO2 changes
- Efficient shuffle algorithm (O(n) complexity)
- CSS animations use GPU acceleration

### Requirements Satisfied
- Requirement 3.5: Randomly select 2 everyday and 2 digital comparisons from predefined lists
- Requirement 4.1: Single-column layout on mobile devices
- Requirement 4.2: 2-column grid on tablet devices
- Requirement 4.3: Multi-column layout on desktop devices
- Requirement 5.5: Gradient borders and glassmorphism effects
- Requirement 5.6: Appropriate emojis for metrics and comparisons

### Example Usage

```tsx
// Basic usage
<EnvironmentalComparisons generationCO2={2500} />

// With state management
function CO2Calculator() {
  const [co2Data, setCO2Data] = useState<CO2Data | null>(null);

  return (
    <>
      {co2Data && (
        <EnvironmentalComparisons 
          generationCO2={co2Data.generationCO2}
        />
      )}
    </>
  );
}

// Re-randomizes when CO2 value changes
useEffect(() => {
  // New CO2 data triggers new random comparisons
  setCO2Data(newData);
}, [newData]);
```

### Accessibility
- Semantic HTML structure
- Sufficient color contrast for text
- Hover states for interactive feedback
- Responsive touch targets (minimum 44x44px)
- Emoji used decoratively with text descriptions


## ImpactSummary

A comprehensive component that displays the total CO2 environmental impact with an animated breakdown showing generation vs transmission emissions.

### Features
- Animated total CO2 display with count-up effect
- Visual breakdown bar showing generation and transmission percentages
- Detailed breakdown cards with individual metrics
- Automatic unit formatting (grams vs kilograms)
- View count formatting (K, M, B)
- Glassmorphism effects with backdrop blur
- Gradient border animation on hover
- Responsive 2-column grid for breakdown cards
- Smooth transitions and animations
- Contextual descriptions with emojis

### Usage

```tsx
import { ImpactSummary } from './components/ImpactSummary';

function App() {
  const [co2Data, setCO2Data] = useState<CO2Data | null>(null);
  const [viewCount, setViewCount] = useState(1000000);

  // Calculate transmission CO2 based on view count
  const transmissionCO2 = co2Data 
    ? co2Data.transmissionCO2PerView * viewCount 
    : 0;
  
  // Calculate total CO2
  const totalCO2 = co2Data 
    ? co2Data.generationCO2 + transmissionCO2 
    : 0;

  return (
    <ImpactSummary 
      generationCO2={co2Data?.generationCO2 || 0}
      transmissionCO2={transmissionCO2}
      totalCO2={totalCO2}
      viewCount={viewCount}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| generationCO2 | number | Yes | CO2 emissions from image generation in grams |
| transmissionCO2 | number | Yes | Total CO2 emissions from transmission (transmissionCO2PerView × viewCount) in grams |
| totalCO2 | number | Yes | Combined total CO2 (generationCO2 + transmissionCO2) in grams |
| viewCount | number | Yes | Number of views for the image |

### Animation Behavior
- **Duration**: 1200ms (1.2 seconds)
- **Easing**: Ease-out cubic for smooth deceleration
- **Frame rate**: 60fps using requestAnimationFrame
- **Start value**: 0
- **End value**: totalCO2 prop value
- **Trigger**: Animates when totalCO2 changes
- **Cleanup**: Properly cancels animation frame on unmount

### Value Formatting

#### CO2 Values
Uses `formatCO2Value` utility from `utils/co2Calculations`:
- **< 1000g**: Displays in grams (e.g., "500g")
- **>= 1000g**: Displays in kilograms with appropriate decimals (e.g., "2.50kg")

#### View Count
- **< 1K**: Raw number (e.g., "500")
- **>= 1K**: Formatted with K suffix (e.g., "10.0K")
- **>= 1M**: Formatted with M suffix (e.g., "1.0M")
- **>= 1B**: Formatted with B suffix (e.g., "1.0B")

### Layout Structure

#### Header Section
- **Title**: "🌍 Total Environmental Impact" with gradient text
- **Total CO2**: Large animated value (5xl/6xl) with gradient effect
- **Context**: View count display

#### Breakdown Visualization
- **Visual bar**: Horizontal bar showing percentage split
  - Left side (emerald → cyan): Generation CO2 percentage
  - Right side (blue → purple): Transmission CO2 percentage
- **Animated width**: Transitions over 1000ms with ease-out

#### Breakdown Cards (2-column grid)

**Generation Card:**
- Icon: 🎨 emoji
- Label: "Generation" in emerald-400
- Value: Formatted CO2 in large text
- Percentage: Of total emissions
- Description: "One-time AI image creation"
- Border: emerald-500/20 with hover effect

**Transmission Card:**
- Icon: 📡 emoji
- Label: "Transmission" in blue-400
- Value: Formatted CO2 in large text
- Percentage: Of total emissions
- Description: "Delivery across [X] views"
- Border: blue-500/20 with hover effect

#### Footer
- Hint: "💡 Adjust view count above to see impact changes"

### Styling

#### Main Card
- Glassmorphism: `backdrop-blur-xl`, `bg-gray-900/90`
- Gradient border: `from-purple-500 via-pink-500 to-orange-500`
- Border: `border-white/10`
- Hover effect: Increased gradient opacity

#### Total Value
- Gradient text: `from-purple-400 via-pink-400 to-orange-400`
- Font size: text-5xl (mobile), text-6xl (desktop)
- Font weight: bold

#### Breakdown Bar
- Background: `bg-gray-800/50`
- Height: h-8
- Border radius: rounded-full
- Border: `border-white/10`
- Generation gradient: `from-emerald-500 to-cyan-500`
- Transmission gradient: `from-blue-500 to-purple-500`

#### Breakdown Cards
- Background: `bg-gray-800/30`
- Border radius: rounded-xl
- Padding: p-4
- Hover transition: Border color opacity increase (300ms)

### Responsive Design
- **Mobile (< 640px)**: 
  - Single column for breakdown cards
  - Smaller text sizes (text-5xl for total)
- **Tablet/Desktop (≥ 640px)**: 
  - 2-column grid (sm:grid-cols-2)
  - Larger text sizes (text-6xl for total)

### Percentage Calculation
```typescript
const generationPercentage = totalCO2 > 0 
  ? (generationCO2 / totalCO2) * 100 
  : 0;

const transmissionPercentage = totalCO2 > 0 
  ? (transmissionCO2 / totalCO2) * 100 
  : 0;
```

### Animations
- **Fade-in**: Component mount animation
- **Count-up**: Total CO2 value animation (1200ms)
- **Bar width**: Breakdown bar width transitions (1000ms)
- **Hover effects**: Border color transitions (300ms)
- **Gradient shift**: Text gradient animation

### Performance Considerations
- Uses requestAnimationFrame for optimal animation performance
- Properly cleans up animation frames to prevent memory leaks
- Easing function prevents jarring motion
- CSS transitions use GPU acceleration
- Percentage calculations cached in component

### Requirements Satisfied
- Requirement 3.1: Calculate total emissions based on generation CO2 and selected view count
- Requirement 3.4: Format numbers appropriately (grams for < 1kg, kilograms for >= 1kg)
- Requirement 3.7: Animate transitions using smooth number counting effects
- Requirement 5.7: Smooth count-up effect for numbers

### Example Values

```tsx
// Small values (all in grams)
<ImpactSummary 
  generationCO2={500}
  transmissionCO2={300}
  totalCO2={800}
  viewCount={1000}
/>
// Total: "800g", Generation: "500g" (62.5%), Transmission: "300g" (37.5%)

// Medium values (mixed units)
<ImpactSummary 
  generationCO2={500}
  transmissionCO2={1500}
  totalCO2={2000}
  viewCount={1000000}
/>
// Total: "2.00kg", Generation: "500g" (25.0%), Transmission: "1.50kg" (75.0%)

// Large values (all in kilograms)
<ImpactSummary 
  generationCO2={50000}
  transmissionCO2={150000}
  totalCO2={200000}
  viewCount={100000000}
/>
// Total: "200kg", Generation: "50kg" (25.0%), Transmission: "150kg" (75.0%)
```

### Edge Cases
- **Zero total**: Displays "0g" and handles division by zero in percentages
- **Very large numbers**: Formats appropriately (e.g., "1.5B views", "500kg")
- **Small numbers**: Displays in grams with no decimals
- **Equal split**: Shows 50.0% for each when generation equals transmission

### Integration Example

```tsx
function CO2Calculator() {
  const [co2Data, setCO2Data] = useState<CO2Data | null>(null);
  const [viewCount, setViewCount] = useState(1000000);

  const transmissionCO2 = co2Data 
    ? calculateTotalCO2(0, co2Data.transmissionCO2PerView, viewCount) 
    : 0;
  
  const totalCO2 = co2Data 
    ? calculateTotalCO2(co2Data.generationCO2, co2Data.transmissionCO2PerView, viewCount)
    : 0;

  return (
    <>
      <ViewCountSelector 
        selectedCount={viewCount}
        onCountChange={setViewCount}
      />
      
      {co2Data && (
        <ImpactSummary 
          generationCO2={co2Data.generationCO2}
          transmissionCO2={transmissionCO2}
          totalCO2={totalCO2}
          viewCount={viewCount}
        />
      )}
    </>
  );
}
```
