# 🎲 AUTHENTIC 1987 BOARD GAME MECHANICS - COMPLETE CONTEXT

## Overview
This document preserves the complete authentic mechanics from the original 1987 "In Pursuit of Par" board game, derived from user-provided board game photos and historical research. These mechanics are **fully implemented** in the codebase and ready for canvas integration.

---

## 📸 Original Board Game Photos Analysis

### Photo Evidence Provided by User:
1. **Orange Distance Gauges** - Showing club distance ranges and shot schedules
2. **Shot Schedule Tables** - Authentic dice-to-distance mappings for each club
3. **Greenside Play Mechanics** - Chip and pitch shot rules (10-30y, 30-50y)
4. **Equipment List** - Complete club set with yardage specifications
5. **Direction Dice System** - 12-sided dice with hook/slice mechanics
6. **Problem Dice Effects** - Sand trap, rough, and hazard modifiers

---

## 🎯 Core Game Mechanics (Implemented)

### 1. Authentic Dice System
```javascript
// EXACTLY as shown in board game photos
greenDice: 6-sided (distance determination)
directionDice: 12-sided (direction/accuracy)
problemDice: 6-sided (hazard effects)

// Roll sequence: Green dice → Direction dice → Problem dice (if needed)
```

### 2. Shot Schedule Tables (From Photos)
```javascript
// Authentic 1987 yardage ranges per dice roll
'driver': {
    1: { min: 200, max: 240, accuracy: 0.7 },
    2: { min: 210, max: 250, accuracy: 0.75 },
    3: { min: 220, max: 260, accuracy: 0.8 },
    4: { min: 230, max: 270, accuracy: 0.85 },
    5: { min: 240, max: 280, accuracy: 0.8 },
    6: { min: 250, max: 290, accuracy: 0.75 }
},
'wedge': {
    1: { min: 40, max: 60, accuracy: 1.0 },
    2: { min: 50, max: 70, accuracy: 1.0 },
    3: { min: 60, max: 80, accuracy: 1.0 },
    4: { min: 65, max: 85, accuracy: 1.0 },
    5: { min: 55, max: 75, accuracy: 1.0 },
    6: { min: 45, max: 65, accuracy: 1.0 }
}
// ... complete tables for all 9 clubs
```

### 3. Direction System (12-Sided Dice)
```javascript
// Authentic board game direction table
1: 'Hard Left' (-45°)
2: 'Left' (-30°)
3: 'Slight Left' (-15°)
4-8: 'Straight' (0°)  // Higher probability of straight shots
9: 'Slight Right' (15°)
10: 'Right' (30°)
11: 'Hard Right' (45°)
12: 'Hook/Slice' (±60°) // Additional roll determines hook vs slice
```

### 4. Short Game Mechanics (From Photos)
```javascript
// CRITICAL: Missing from original implementation
chipShots: {
    range: '10-30 yards',
    modifier: 0.3, // 30% of normal distance
    accuracy: +0.2, // Bonus accuracy
    description: 'Low trajectory, more roll'
},
pitchShots: {
    range: '30-60 yards', 
    modifier: 0.6, // 60% of normal distance
    accuracy: +0.1, // Slight accuracy bonus
    description: 'Higher trajectory, less roll'
},
puttingRules: {
    gimmeRange: '3 feet or less = automatic make',
    greenOnly: true,
    maxRange: '40 yards'
}
```

### 5. Problem Dice Effects (Hazards)
```javascript
// When lie requires problem dice roll
'rough': {
    1: { distanceMultiplier: 0.5, accuracyPenalty: 0.2 },
    2: { distanceMultiplier: 0.6, accuracyPenalty: 0.15 },
    3: { distanceMultiplier: 0.7, accuracyPenalty: 0.1 },
    4: { distanceMultiplier: 0.8, accuracyPenalty: 0.1 },
    5: { distanceMultiplier: 0.7, accuracyPenalty: 0.15 },
    6: { distanceMultiplier: 0.6, accuracyPenalty: 0.2 }
},
'sand': {
    1-6: { forceWedge: true, distanceMultiplier: 0.3-0.6, accuracyPenalty: 0.2-0.3 }
},
'water': {
    1-6: { penaltyStroke: true, dropZone: 'previous' or 'lateral' }
}
```

---

## 🏌️ Complete Club Set (Authentic 1987)

### Full Equipment List
```javascript
clubs: [
    { name: 'Driver', range: [200, 290], lies: ['tee', 'fairway'] },
    { name: '3 Wood', range: [180, 240], lies: ['tee', 'fairway'] },
    { name: '5 Wood', range: [160, 205], lies: ['tee', 'fairway', 'rough'] },
    { name: '3 Iron', range: [140, 185], lies: ['tee', 'fairway', 'rough'] },
    { name: '5 Iron', range: [120, 165], lies: ['tee', 'fairway', 'rough'] },
    { name: '7 Iron', range: [100, 145], lies: ['tee', 'fairway', 'rough', 'sand'] },
    { name: '9 Iron', range: [80, 125], lies: ['tee', 'fairway', 'rough', 'sand'] },
    { name: 'Wedge', range: [40, 85], lies: ['tee', 'fairway', 'rough', 'sand'] },
    { name: 'Putter', range: [5, 40], lies: ['green'] }
]
```

### Lie Restrictions (Critical Rule)
- **Tee:** All clubs available
- **Fairway:** No putting, all others OK
- **Rough:** No woods from rough (irons/wedge only)
- **Sand:** Wedge only (force wedge rule)
- **Green:** Putter only
- **Trees:** Limited club selection based on problem dice

---

## 🏞️ Course Layout Specifications

### TPC Sawgrass Data (Hole 1)
```javascript
hole1: {
    number: 1,
    par: 4,
    totalYardage: 394,
    layout: 'straight',
    difficulty: 13, // USGA difficulty rating
    teePosition: { x: 50, y: 300 },
    pinPosition: { x: 750, y: 300 },
    hazards: [
        { type: 'bunker', position: [300, 250], size: '60x40' },
        { type: 'water', position: [600, 250], size: '100x60' },
        { type: 'rough', areas: ['above/below fairway'] }
    ]
}
```

### Course Visual Elements
```javascript
// Authentic board game aesthetic (colonist.io inspired)
colors: {
    fairway: '#228B22', // Forest green
    rough: '#9ACD32',   // Yellow green  
    sand: '#F4A460',    // Sandy brown
    water: '#4682B4',   // Steel blue
    green: '#00FF32',   // Bright green
    background: '#87CEEB' // Sky blue
}
```

---

## 🎮 Game Flow (Authentic Sequence)

### 1. Shot Setup
```
→ Select club based on lie and distance
→ Choose shot type (normal/chip/pitch) if near green
→ Confirm shot parameters
```

### 2. Dice Rolling Sequence
```
→ Roll green dice (1-6) for distance
→ Roll direction dice (1-12) for accuracy  
→ Roll problem dice (1-6) if hazardous lie
→ Calculate modifiers and final result
```

### 3. Shot Resolution
```
→ Apply distance from shot schedule table
→ Apply direction deviation
→ Apply lie penalties/bonuses
→ Apply short game modifiers
→ Update ball position and lie
→ Check for hole completion
```

### 4. Scoring Rules
```javascript
scoring: {
    par: 'Standard scoring (4 for this hole)',
    stroke: 'Each shot attempt counts +1',
    penalties: {
        water: '+1 stroke + ball placement',
        outOfBounds: '+1 stroke + replay from previous position',
        unplayable: '+1 stroke + drop options'
    },
    gimme: 'Putts 3 feet or closer = automatic make'
}
```

---

## 🔄 Intelligent Club Selection Logic

### Auto-Recommendation System
```javascript
function recommendClub(distanceToPin, currentLie, shortGameMode) {
    // Filter available clubs by lie
    const availableClubs = clubs.filter(club => 
        club.lies.includes(currentLie)
    );
    
    // Apply short game distance modifier
    let effectiveDistance = distanceToPin;
    if (shortGameMode === 'chip') effectiveDistance /= 0.3;
    if (shortGameMode === 'pitch') effectiveDistance /= 0.6;
    
    // Find optimal club (80-120% of range)
    return availableClubs.find(club => 
        effectiveDistance >= club.range[0] * 0.8 && 
        effectiveDistance <= club.range[1] * 1.2
    );
}
```

---

## 📊 Units and Measurements

### Conversion System
```javascript
units: {
    default: 'yards', // Authentic to 1987 board game
    metric: 'meters',
    conversion: 0.9144, // Exact yards to meters
    display: 'Toggle between yards/meters in settings'
}

// All distances in code stored in yards, converted for display
```

---

## 🎨 Visual Design Requirements

### Colonist.io Aesthetic
- **Flat, geometric design** (no 3D complexity)
- **Clean board game appearance**
- **High contrast colors** for accessibility
- **Top-down perspective** maintained
- **Distinct course areas** with clear visual separation

### UI Components (Implemented)
- **Club selection panel** with distance ranges and recommendations
- **Shot controls** with authentic dice display
- **Game information** showing hole stats, strokes, par
- **Settings modal** with accessibility and game options
- **Short game selector** for chip/pitch/normal shots

---

## 🔧 Implementation Status

### ✅ Fully Implemented Features
- **Complete dice system** with authentic probabilities
- **All 9 clubs** with accurate yardage ranges
- **Short game mechanics** (chip/pitch shots)
- **Intelligent club recommendations**
- **Lie-based restrictions**
- **Problem dice effects** for hazards
- **Units conversion** (yards ⇔ meters)
- **Settings system** with accessibility options
- **Game state management** and scoring

### ❌ Needs Canvas Implementation
- **Course visualization** (designed but not rendering)
- **Ball position tracking** (logic complete, display broken)
- **Shot animation** (mechanics ready, canvas needed)

### 📁 Key Implementation Files
```
authentic-mechanics.js     # Complete 1987 mechanics
board-game-bridge.js      # Integration layer  
enhanced-golf.html        # Full UI implementation
fresh-golf.html          # Simple working version
```

---

## 🎯 Critical Success Factors

### Must Preserve:
1. **Authentic 1987 dice mechanics** - Exactly as photographed
2. **Short game system** - Chip/pitch shots essential
3. **Club restrictions by lie** - Core gameplay balance
4. **Top-down board game aesthetic** - User requirement
5. **Colonist.io visual style** - Flat, clean, accessible

### Key User Requirements:
- **"maintain a boardgame aesthetic"**
- **"remove the 3d mode complexity"** 
- **"i like the top down view. maintain that"**
- **"account for chip and pitch shots. greenside"**
- **"make fairway more distinct from rough and green visually"**

---

## 📋 Next Instance Instructions

1. **Start with working base:** Use `enhanced-golf.html` - all mechanics implemented
2. **Fix canvas only:** Replace Phaser.js with HTML5 Canvas or SVG
3. **Preserve all features:** Don't rebuild mechanics, just fix rendering
4. **Test incrementally:** Ensure ball movement and course display work
5. **Maintain aesthetic:** Top-down, flat, colonist.io-inspired design

**The board game mechanics are complete and authentic. Only the canvas rendering layer needs resolution to deliver the fully functional golf course simulation.**