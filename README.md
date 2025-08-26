# TPC Sawgrass Digital Scorecard

A professional digital scorecard for TPC Sawgrass - THE PLAYERS Stadium Course, designed specifically for tracking scores during "In Pursuit of Par" board game sessions.

🎲 **[Live Application](https://golf.rickithadi.dev)** | 🧪 **[Run Tests](https://golf.rickithadi.dev/test)**

## Features

### 🏌️ Authentic Golf Experience
- **Tournament-Accurate Data**: Exact hole specifications from the 1987 "In Pursuit of Par" board game
- **TPC Sawgrass Stadium Course**: All 18 holes with official pars, yardages, handicaps, and difficulty rankings
- **Island Green Special**: Hole 17 gets distinctive styling as golf's most famous par 3
- **Professional Branding**: Authentic TPC colors and styling

### 👥 Dynamic Player Management
- **Up to 4 Players**: Perfect for board game sessions
- **Custom Names**: Enter player names that appear throughout the interface
- **Add/Remove Players**: Flexible player management during gameplay
- **Smart Layout**: Responsive design adapts to player count

### 📊 Advanced Scoring
- **Real-Time Calculations**: Automatic totals, to-par, front/back nine scoring
- **Visual Feedback**: Color-coded scores (eagles green, birdies light green, pars neutral, bogeys orange, doubles+ red)
- **Progress Tracking**: Visual progress bar and completion statistics
- **Score Persistence**: Never lose your progress with localStorage

### 📈 Detailed Statistics
- **Performance Analytics**: Eagles, birdies, pars, bogeys, double bogeys tracking
- **Best Hole Identification**: Find each player's strongest performance
- **Tournament Comparisons**: Compare against THE PLAYERS Championship averages
- **Per-Player Breakdowns**: Individual statistics for each player

### 🖨️ Professional Export
- **Tournament-Style Scorecards**: Print professional-quality scorecards
- **Board Game Branding**: Includes "In Pursuit of Par" attribution
- **Complete Data**: All players, scores, and course information
- **Print-Optimized**: Perfect formatting for physical scorecards

## Board Game Integration

This application perfectly complements the **"In Pursuit of Par" board game (1987)** by Pursuit of Par Enterprises, Panama City Beach, FL. The board game featured:

- **Strategic Course Management**: Make tactical decisions based on hole difficulty
- **Tournament Statistics**: Use authentic scoring averages for realistic gameplay
- **Championship Challenge**: Experience the same course layout as THE PLAYERS Championship
- **Professional Accuracy**: Every yardage, par, and statistic matches the original board game

## Technology

- **Pure JavaScript**: No frameworks, fast loading, works offline
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **localStorage**: Automatic save/restore functionality
- **Modern CSS**: Professional styling with TPC brand colors
- **Comprehensive Tests**: 40+ automated tests ensuring reliability

## Getting Started

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd pursuitOfPar

# Install dependencies (optional, for local server)
npm install

# Run local development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Deployment
This project is configured for Vercel deployment:

```bash
# Deploy to production
npm run deploy
```

### Testing
Open `test.html` in your browser or visit `/test` to run the comprehensive test suite.

## Course Data

### TPC Sawgrass - THE PLAYERS Stadium Course
- **Total Par**: 72
- **Total Yardage**: 6,394 yards  
- **Designer**: Pete & Alice Dye
- **Signature Hole**: #17 Island Green (137 yards, Par 3)

### Hole Highlights
- **Toughest Hole**: #5 Par 4, 471 yards (Difficulty #1)
- **Second Toughest**: #8 Par 3, 237 yards (Difficulty #2) 
- **Easiest Hole**: #12 Par 4, 358 yards (Difficulty #18)
- **Most Famous**: #17 Island Green (Difficulty #12)

## File Structure

```
pursuitOfPar/
├── index.html          # Main scorecard application
├── styles.css          # TPC-branded styling
├── script.js           # Core application logic
├── test.html           # Test suite interface
├── test-suite.js       # Comprehensive test cases
├── vercel.json         # Vercel deployment config
├── package.json        # Project metadata
└── README.md           # Documentation
```

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This scorecard application is designed specifically for the "In Pursuit of Par" board game experience. Contributions should maintain:

1. **Board Game Authenticity**: All course data matches the original 1987 game
2. **Professional Quality**: Tournament-level accuracy and presentation
3. **User Experience**: Simple, intuitive interface for game sessions
4. **Performance**: Fast, reliable operation without internet dependency

## License

MIT License - Feel free to use for personal board game sessions.

## Credits

- **Original Board Game**: "In Pursuit of Par" (1987) by Pursuit of Par Enterprises, Panama City Beach, FL
- **Course Design**: Pete & Alice Dye
- **Tournament Data**: THE PLAYERS Championship historical statistics
- **Digital Implementation**: Built with Claude Code

---

**Ready to play?** Fire up the board game and track your TPC Sawgrass round with tournament-level precision! 🏌️‍♂️⛳