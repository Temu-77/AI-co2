# 🔽 Collapsible Ad Banner Details Feature

## ✨ What Was Added

### **Toggle Button**
- **Location**: Top-right of the Ad Banner Details header
- **Default State**: Hidden (collapsed)
- **Visual Design**: 
  - Gray background with subtle border
  - Hover effects for better UX
  - Smooth color transitions
  - Chevron icons (up/down) to indicate state

### **Collapsible Animation**
- **Smooth Transition**: 300ms ease-in-out animation
- **Height Animation**: Expands from 0 to full height
- **Opacity Animation**: Fades in/out for smooth visual effect
- **Max Height**: 2000px to accommodate all content

### **Accessibility Features**
- **ARIA Labels**: Proper `aria-expanded` and `aria-label` attributes
- **Keyboard Accessible**: Button can be focused and activated with keyboard
- **Screen Reader Friendly**: Clear labels for assistive technology

## 🎯 User Experience

### **Default Behavior**
- Ad Banner Details section is **hidden by default**
- Users see only the header with "Show" button
- Cleaner initial view focusing on CO2 results

### **Interaction**
- **Click "Show"**: Smoothly expands to reveal all details
- **Click "Hide"**: Smoothly collapses back to header only
- **Visual Feedback**: Button text and icon change based on state

### **Button States**
```
Collapsed: [Show ▼]
Expanded:  [Hide ▲]
```

## 🛠️ Technical Implementation

### **React State Management**
```typescript
const [isExpanded, setIsExpanded] = useState(false);
```

### **CSS Classes for Animation**
```css
transition-all duration-300 ease-in-out overflow-hidden
${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
```

### **Icons Used**
- `ChevronDown` (▼) - When collapsed
- `ChevronUp` (▲) - When expanded
- From Lucide React icon library

## 📱 Responsive Design

### **Button Layout**
- **Desktop**: Positioned at top-right of header
- **Mobile**: Maintains same position with proper touch targets
- **Minimum Touch Target**: 44px for accessibility

### **Content Layout**
- All existing responsive grid layouts preserved
- Smooth animations work across all screen sizes
- No layout shifts during expand/collapse

## 🎨 Visual Design

### **Button Styling**
- **Background**: `bg-gray-800/50` with hover `bg-gray-700/50`
- **Border**: `border-white/10` with hover `border-white/20`
- **Text**: `text-gray-300` with hover `text-white`
- **Padding**: `px-4 py-2` for comfortable click area

### **Animation Properties**
- **Duration**: 300ms (smooth but not slow)
- **Easing**: `ease-in-out` for natural feel
- **Properties**: `max-height` and `opacity` for smooth reveal

## 🚀 Benefits

### **Improved UX**
1. **Cleaner Initial View**: Focus on CO2 results first
2. **Progressive Disclosure**: Show details only when needed
3. **Smooth Interactions**: Professional animations
4. **Clear Visual Cues**: Obvious expand/collapse states

### **Performance**
1. **No Layout Shifts**: Smooth height transitions
2. **Efficient Rendering**: Content still rendered, just hidden
3. **Minimal JavaScript**: Simple state toggle

### **Accessibility**
1. **Screen Reader Support**: Proper ARIA attributes
2. **Keyboard Navigation**: Fully keyboard accessible
3. **Clear Labels**: Descriptive button text and labels

## 📋 Usage

### **For Users**
1. Upload an ad banner image
2. View CO2 analysis results immediately
3. Click "Show" to see detailed ad banner specifications
4. Click "Hide" to collapse details and focus on results

### **For Developers**
- Component maintains all existing props and functionality
- No breaking changes to parent components
- Easy to customize animation timing or styling
- Accessible by default

---

This feature enhances the user experience by providing a cleaner initial view while still allowing access to detailed technical specifications when needed.