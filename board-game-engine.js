// In Pursuit of Par - Authentic Board Game Engine
// Flat 2D design inspired by colonist.io aesthetics
// Based on authentic 1987 board game mechanics

class AuthenticBoardGameEngine {
    constructor() {
        // Core game state - 100% authentic to 1987 board game
        this.players = [];
        this.currentPlayer = 1;
        this.currentHole = 1;
        this.shotHistory = [];
        this.gameStarted = false;
        
        // Units preference system
        this.units = localStorage.getItem('preferred-units') || 'yards';
        this.conversionRatio = 0.9144; // yards to meters
        
        // Course visualization elements
        this.courseCanvas = null;
        this.courseCtx = null;
        
        // Shot analysis system
        this.shotAnalyzer = new ShotAnalyzer();
        this.clubAdvisor = new ClubAdvisor();
        
        this.init();
    }

    async init() {
        await this.initializeCore();
        this.setupDefaultPlayers();
        this.initializeCourseVisualization();
        this.setupEventHandlers();
        
        console.log('🎲 Authentic Board Game Engine initialized - colonist.io inspired design');
    }

    async initializeCore() {
        // Use authentic 1987 mechanics
        this.diceRoller = new AuthenticDiceSystem();
        this.shotCalculator = new BoardGameShotCalculator();
        this.courseManager = new TPC3DCourseManager();
        this.unitsManager = new UnitsManager();
    }

    initializeCourseVisualization() {
        // Create flat, 2D board game visualization
        const courseContainer = document.getElementById('courseVisualization');
        if (!courseContainer) return;

        // Create canvas for 2D board game rendering
        this.courseCanvas = document.createElement('canvas');
        this.courseCanvas.width = 800;
        this.courseCanvas.height = 600;
        this.courseCanvas.style.borderRadius = '8px';
        this.courseCanvas.style.boxShadow = 'var(--shadow-md)';
        
        this.courseCtx = this.courseCanvas.getContext('2d');
        
        // Clear container and add canvas
        courseContainer.innerHTML = '';
        courseContainer.appendChild(this.courseCanvas);
        
        // Initial hole render
        this.renderCurrentHole();
    }

    renderCurrentHole() {
        const hole = courseData.holes[this.currentHole - 1];
        const ctx = this.courseCtx;
        const width = this.courseCanvas.width;
        const height = this.courseCanvas.height;

        // Clear canvas with sky blue background
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, width, height);

        // Draw course areas with distinct colors (colonist.io inspired)
        this.drawCourseAreas(hole);
        this.drawHazards(hole);
        this.drawGreen(hole);
        this.drawTeeBox(hole);
        this.drawBallPosition();
        this.drawDistanceMarkers(hole);
    }

    drawCourseAreas(hole) {
        const ctx = this.courseCtx;
        const width = this.courseCanvas.width;
        const height = this.courseCanvas.height;

        // FAIRWAY - Bright clean green (colonist.io style)
        ctx.fillStyle = '#32CD32'; // Lime Green - highly distinct
        ctx.fillRect(width * 0.3, height * 0.1, width * 0.4, height * 0.7);
        
        // Add subtle fairway stripe pattern for authenticity
        ctx.strokeStyle = '#2E8B57';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            const x = width * 0.3 + (width * 0.4 / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, height * 0.1);
            ctx.lineTo(x, height * 0.8);
            ctx.stroke();
        }

        // ROUGH AREAS - Olive green, clearly different
        ctx.fillStyle = '#6B8E23'; // Olive Drab - distinct from fairway
        
        // Left rough
        ctx.fillRect(0, height * 0.1, width * 0.3, height * 0.7);
        
        // Right rough  
        ctx.fillRect(width * 0.7, height * 0.1, width * 0.3, height * 0.7);
        
        // Add patchy texture to rough areas
        ctx.fillStyle = '#556B2F'; // Darker olive for patches
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width * 0.3;
            const y = height * 0.1 + Math.random() * height * 0.7;
            const size = 5 + Math.random() * 10;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
            
            // Mirror on right side
            ctx.beginPath();
            ctx.arc(width * 0.7 + x, y, size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    drawHazards(hole) {
        const ctx = this.courseCtx;
        const width = this.courseCanvas.width;
        const height = this.courseCanvas.height;

        // SAND TRAPS - Tan/brown, kidney shaped
        if (this.holeHasSand(hole)) {
            ctx.fillStyle = '#F4A460'; // Sandy Brown
            
            // Greenside bunker
            ctx.beginPath();
            ctx.ellipse(width * 0.45, height * 0.25, 30, 20, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Fairway bunker
            ctx.beginPath();
            ctx.ellipse(width * 0.35, height * 0.5, 25, 15, -Math.PI / 6, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add sand texture
            ctx.fillStyle = '#DEB887';
            for (let i = 0; i < 30; i++) {
                const x = width * 0.3 + Math.random() * width * 0.3;
                const y = height * 0.2 + Math.random() * height * 0.4;
                const size = 1 + Math.random() * 2;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        // WATER HAZARDS - Blue, irregular shapes
        if (this.holeHasWater(hole)) {
            ctx.fillStyle = '#1565C0'; // Deep blue
            
            if (hole.number === 17) {
                // Island Green - water surrounds green
                ctx.beginPath();
                ctx.rect(width * 0.2, height * 0.15, width * 0.6, height * 0.3);
                ctx.fill();
            } else {
                // Regular water hazard
                ctx.beginPath();
                ctx.ellipse(width * 0.2, height * 0.4, 60, 30, 0, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    drawGreen(hole) {
        const ctx = this.courseCtx;
        const width = this.courseCanvas.width;
        const height = this.courseCanvas.height;

        // GREEN - Pristine putting surface
        ctx.fillStyle = '#228B22'; // Forest Green - distinct from fairway
        
        // Draw elevated circular green
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.2, 40, 0, 2 * Math.PI);
        ctx.fill();
        
        // Green border/collar
        ctx.strokeStyle = '#006400'; // Dark green border
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // GIMME CIRCLE - Inner putting circle
        ctx.fillStyle = '#90EE90'; // Light green for gimme area
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.2, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // FLAGSTICK AND PIN
        ctx.strokeStyle = '#FFFFFF'; // White flagstick
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width * 0.5, height * 0.2);
        ctx.lineTo(width * 0.5, height * 0.2 - 25);
        ctx.stroke();
        
        // FLAG
        ctx.fillStyle = '#FF0000'; // Red flag
        ctx.beginPath();
        ctx.rect(width * 0.5, height * 0.2 - 25, 15, 8);
        ctx.fill();
    }

    drawTeeBox(hole) {
        const ctx = this.courseCtx;
        const width = this.courseCanvas.width;
        const height = this.courseCanvas.height;

        // TEE BOX - Distinct marker area
        ctx.fillStyle = '#8B4513'; // Saddle Brown
        ctx.fillRect(width * 0.47, height * 0.85, width * 0.06, height * 0.05);
        
        // Tee markers
        ctx.fillStyle = '#FFD700'; // Gold tee markers
        ctx.beginPath();
        ctx.arc(width * 0.48, height * 0.875, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width * 0.52, height * 0.875, 3, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawBallPosition() {
        const ctx = this.courseCtx;
        const width = this.courseCanvas.width;
        const height = this.courseCanvas.height;
        
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        if (!currentPlayerObj) return;

        // Calculate ball position based on game state
        let ballX, ballY;
        
        if (currentPlayerObj.lie === 'tee') {
            ballX = width * 0.5;
            ballY = height * 0.875;
        } else {
            // Convert position percentage to canvas coordinates
            ballX = width * (currentPlayerObj.position.x / 100);
            ballY = height * (0.9 - currentPlayerObj.position.y / 100);
        }

        // GOLF BALL - White with shadow
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Ball shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(ballX + 1, ballY + 1, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Ball border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 4, 0, 2 * Math.PI);
        ctx.stroke();
    }

    drawDistanceMarkers(hole) {
        const ctx = this.courseCtx;
        const width = this.courseCanvas.width;
        const height = this.courseCanvas.height;

        // Distance markers every 50 yards
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';

        const distances = [50, 100, 150, 200];
        distances.forEach((distance, index) => {
            const y = height * 0.8 - (index * height * 0.15);
            
            // Marker stake
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(width * 0.1 - 1, y - 10, 2, 20);
            
            // Distance text
            ctx.fillStyle = '#000000';
            const displayDistance = this.convertDistance(distance);
            const unit = this.units === 'yards' ? 'y' : 'm';
            ctx.fillText(`${Math.round(displayDistance)}${unit}`, width * 0.1 + 15, y + 5);
        });
    }

    // Shot type determination based on authentic board game rules
    determineShotType(distanceToPin, lie) {
        // Convert distance to yards for calculations
        const distanceYards = this.units === 'meters' ? distanceToPin / this.conversionRatio : distanceToPin;
        
        if (lie === 'green') {
            return distanceYards <= 4 ? 'gimme' : 'putt';
        }
        
        // Greenside play determination from board game photos
        if (distanceYards <= 30 && lie === 'fairway') {
            return 'chip';
        }
        
        if (distanceYards <= 50 && (lie === 'rough' || lie === 'sand')) {
            return 'pitch';
        }
        
        return 'full_shot';
    }

    // Enhanced shot calculation with greenside play
    async takeShot() {
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const selectedClub = document.querySelector('.club-option.selected')?.dataset.club;
        
        if (!selectedClub) {
            alert('Please select a club first!');
            return;
        }

        // Calculate distance to pin
        const hole = courseData.holes[this.currentHole - 1];
        const distanceToPin = this.calculateDistanceToPin(currentPlayerObj.position, hole);
        const shotType = this.determineShotType(distanceToPin, currentPlayerObj.lie);

        // Show shot analysis
        this.showShotAnalysis(currentPlayerObj.lie, distanceToPin, shotType, selectedClub);

        // Roll dice using authentic mechanics
        const diceResult = await this.rollDiceWithAnimation();
        
        // Calculate shot with enhanced greenside rules
        const shotResult = this.calculateShotWithGreensidePlay(selectedClub, diceResult, currentPlayerObj, shotType);
        
        // Update game state and visual display
        this.processShotResult(shotResult);
        this.renderCurrentHole();
        this.updateGameState();
    }

    calculateShotWithGreensidePlay(club, diceResult, player, shotType) {
        let shotResult;

        switch (shotType) {
            case 'gimme':
                // Automatic putt within gimme range
                shotResult = {
                    distance: 0,
                    direction: 'holed',
                    position: { x: 50, y: 100 },
                    lie: 'holed',
                    holedOut: true
                };
                break;

            case 'putt':
                // Use putting schedule from board game
                shotResult = this.calculatePuttingShot(diceResult, player);
                break;

            case 'chip':
                // Chip shot mechanics (10-30 yards)
                shotResult = this.calculateChipShot(club, diceResult, player);
                break;

            case 'pitch':
                // Pitch shot mechanics (30-50 yards) 
                shotResult = this.calculatePitchShot(club, diceResult, player);
                break;

            default:
                // Regular full shot
                shotResult = this.shotCalculator.calculate(club, diceResult, player.lie);
                break;
        }

        return shotResult;
    }

    calculatePuttingShot(diceResult, player) {
        // Authentic putting mechanics from board game
        const puttingSchedule = {
            1: { distance: 2, accuracy: 0.9 },
            2: { distance: 4, accuracy: 0.95 },
            3: { distance: 6, accuracy: 1.0 },
            4: { distance: 8, accuracy: 1.0 },
            5: { distance: 6, accuracy: 0.95 },
            6: { distance: 4, accuracy: 0.9 }
        };

        const result = puttingSchedule[diceResult.distance];
        const finalDistance = result.distance + (Math.random() * 2 - 1); // ±1 yard variation

        return {
            distance: Math.max(0, finalDistance),
            direction: 'straight',
            position: this.calculatePuttEndPosition(player.position, finalDistance),
            lie: finalDistance <= 4 ? 'holed' : 'green',
            holedOut: finalDistance <= 4
        };
    }

    calculateChipShot(club, diceResult, player) {
        // Chip shot schedule from board game
        const chipSchedule = {
            'wedge': { 1: 15, 2: 20, 3: 25, 4: 30, 5: 25, 6: 20 },
            '9iron': { 1: 20, 2: 25, 3: 30, 4: 35, 5: 30, 6: 25 },
            '7iron': { 1: 25, 2: 30, 3: 35, 4: 40, 5: 35, 6: 30 }
        };

        const baseDistance = chipSchedule[club]?.[diceResult.distance] || 25;
        
        // Apply lie modifiers
        let finalDistance = baseDistance;
        if (player.lie === 'rough') {
            finalDistance *= 0.8; // 20% penalty from rough
        }

        return {
            distance: finalDistance,
            direction: this.getDirectionFromDice(diceResult.direction),
            position: this.calculateEndPosition(player.position, finalDistance, diceResult.direction),
            lie: this.determineLieFromPosition()
        };
    }

    calculatePitchShot(club, diceResult, player) {
        // Pitch shot schedule - higher trajectory, softer landing
        const pitchSchedule = {
            'wedge': { 1: 25, 2: 35, 3: 45, 4: 50, 5: 40, 6: 30 },
            '9iron': { 1: 30, 2: 40, 3: 50, 4: 55, 5: 45, 6: 35 }
        };

        let baseDistance = pitchSchedule[club]?.[diceResult.distance] || 40;
        
        // Sand trap penalties from problem dice
        if (player.lie === 'sand') {
            const problemRoll = Math.floor(Math.random() * 6) + 1;
            baseDistance *= this.getSandTrapModifier(problemRoll);
        }

        return {
            distance: baseDistance,
            direction: this.getDirectionFromDice(diceResult.direction),
            position: this.calculateEndPosition(player.position, baseDistance, diceResult.direction),
            lie: this.determineLieFromPosition()
        };
    }

    // Units conversion methods
    convertDistance(distance) {
        if (this.units === 'meters') {
            return distance * this.conversionRatio;
        }
        return distance;
    }

    toggleUnits() {
        this.units = this.units === 'yards' ? 'meters' : 'yards';
        localStorage.setItem('preferred-units', this.units);
        
        // Update all displayed distances
        this.updateDisplayedDistances();
        this.renderCurrentHole();
    }

    // Show shot analysis panel
    showShotAnalysis(lie, distance, shotType, club) {
        const analysisPanel = document.getElementById('shotAnalysis') || this.createAnalysisPanel();
        
        const lieDescription = this.getLieDescription(lie);
        const modifiers = this.getShotModifiers(lie);
        const recommendations = this.clubAdvisor.recommendClub(distance, lie, shotType);
        
        analysisPanel.innerHTML = `
            <div class="analysis-header">
                <h4>📍 Shot Analysis</h4>
            </div>
            <div class="analysis-content">
                <div class="analysis-item">
                    <strong>Lie:</strong> ${lieDescription}
                </div>
                <div class="analysis-item">
                    <strong>Distance:</strong> ${Math.round(this.convertDistance(distance))} ${this.units}
                </div>
                <div class="analysis-item">
                    <strong>Shot Type:</strong> ${shotType.toUpperCase()}
                </div>
                <div class="analysis-item">
                    <strong>Selected Club:</strong> ${club.toUpperCase()}
                </div>
                ${modifiers ? `<div class="analysis-modifiers">${modifiers}</div>` : ''}
                ${recommendations ? `<div class="analysis-recommendations">${recommendations}</div>` : ''}
            </div>
        `;
        
        analysisPanel.style.display = 'block';
    }

    createAnalysisPanel() {
        const panel = document.createElement('div');
        panel.id = 'shotAnalysis';
        panel.className = 'shot-analysis-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: white;
            border-radius: 8px;
            padding: 16px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            display: none;
        `;
        
        document.body.appendChild(panel);
        return panel;
    }

    // Helper methods for authentic board game mechanics
    holeHasSand(hole) {
        // Notable sand trap holes at TPC Sawgrass
        return [2, 4, 7, 8, 11, 16, 17, 18].includes(hole.number);
    }

    holeHasWater(hole) {
        // Water holes at TPC Sawgrass
        return [8, 11, 13, 14, 16, 17, 18].includes(hole.number);
    }

    getSandTrapModifier(problemRoll) {
        const modifiers = {
            1: 0.3, 2: 0.4, 3: 0.5, 4: 0.6, 5: 0.5, 6: 0.4
        };
        return modifiers[problemRoll] || 0.5;
    }

    getLieDescription(lie) {
        const descriptions = {
            'tee': 'Tee Box - Optimal conditions',
            'fairway': 'Fairway - Clean lie, good conditions',
            'rough': 'Rough - Reduced distance and accuracy',
            'sand': 'Sand Trap - Requires escape shot with wedge',
            'trees': 'Behind/Under Trees - Limited club selection',
            'water': 'Water Hazard - Penalty stroke required',
            'green': 'Green - Putting surface'
        };
        return descriptions[lie] || lie;
    }

    getShotModifiers(lie) {
        const modifiers = {
            'rough': '⚠️ Rough: -20% distance, -15% accuracy',
            'sand': '⚠️ Sand Trap: Problem dice required, wedge only',
            'trees': '⚠️ Trees: Limited to wedge, 9-iron, 7-iron only',
            'water': '🔴 Water: Penalty stroke, drop shot required'
        };
        return modifiers[lie] || '';
    }

    // Setup event handlers for new UI
    setupEventHandlers() {
        // Units toggle button
        const unitsToggle = document.getElementById('unitsToggle');
        if (unitsToggle) {
            unitsToggle.addEventListener('click', () => this.toggleUnits());
        }

        // Club selection with enhanced guidance
        document.querySelectorAll('.club-option').forEach(club => {
            club.addEventListener('click', () => this.selectClub(club));
            club.addEventListener('mouseenter', () => this.showClubPreview(club));
        });

        // Shot button
        const shotButton = document.getElementById('takeShot') || document.getElementById('takeShot3D');
        if (shotButton) {
            shotButton.addEventListener('click', () => this.takeShot());
        }
    }

    setupDefaultPlayers() {
        this.players = [
            { name: 'Player 1', strokes: 0, scores: new Array(18).fill(0), position: {x: 50, y: 0}, lie: 'tee', holedOut: false }
        ];
    }

    // Additional methods for complete functionality
    rollDiceWithAnimation() {
        return new Promise((resolve) => {
            // Animate dice rolling
            const result = this.diceRoller.rollAuthentic();
            setTimeout(() => resolve(result), 800);
        });
    }

    calculateDistanceToPin(position, hole) {
        // Simplified distance calculation for board game
        return Math.max(10, (100 - position.y) * 4);
    }

    updateGameState() {
        // Update all UI elements with current game state
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const hole = courseData.holes[this.currentHole - 1];
        
        document.getElementById('currentPlayer').textContent = currentPlayerObj.name;
        document.getElementById('currentStrokes').textContent = currentPlayerObj.strokes;
        document.getElementById('currentLie').textContent = this.getLieDescription(currentPlayerObj.lie);
        
        const distanceToPin = this.calculateDistanceToPin(currentPlayerObj.position, hole);
        document.getElementById('distanceToPin').textContent = `${Math.round(this.convertDistance(distanceToPin))} ${this.units}`;
    }
}

// Units Management System
class UnitsManager {
    constructor() {
        this.currentUnit = localStorage.getItem('preferred-units') || 'yards';
        this.conversionRatio = 0.9144; // exact yards to meters
    }
    
    convert(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;
        return fromUnit === 'yards' ? 
            value * this.conversionRatio : 
            value / this.conversionRatio;
    }
    
    getDisplayUnit() {
        return this.currentUnit;
    }
    
    toggle() {
        this.currentUnit = this.currentUnit === 'yards' ? 'meters' : 'yards';
        localStorage.setItem('preferred-units', this.currentUnit);
        return this.currentUnit;
    }
}

// Shot Analysis System
class ShotAnalyzer {
    analyzeLie(position, hole) {
        const lie = this.determineLie(position);
        const modifiers = this.getModifiers(lie);
        const recommendations = this.getRecommendations(lie, position);
        
        return {
            lie,
            modifiers,
            recommendations,
            explanation: this.generateExplanation(lie, modifiers)
        };
    }
    
    determineLie(position) {
        // Simplified lie determination for board game
        if (position.y > 95) return 'green';
        if (position.y < 5) return 'tee';
        if (Math.abs(position.x - 50) > 25) return 'rough';
        return 'fairway';
    }
    
    getModifiers(lie) {
        const modifierTable = {
            'rough': { distance: -0.2, accuracy: -0.15 },
            'sand': { distance: -0.4, accuracy: -0.3, forceWedge: true },
            'trees': { distance: -0.5, accuracy: -0.4, limitedClubs: true },
            'water': { penaltyStroke: true }
        };
        return modifierTable[lie] || {};
    }
    
    generateExplanation(lie, modifiers) {
        const explanations = {
            'tee': 'Perfect conditions for your tee shot',
            'fairway': 'Optimal lie with full distance and accuracy',
            'rough': 'Longer grass reduces distance and accuracy',
            'sand': 'Sand trap requires wedge and problem dice',
            'trees': 'Obstacles limit club selection and shot direction',
            'water': 'Water hazard - penalty stroke applies',
            'green': 'On the putting surface'
        };
        return explanations[lie] || 'Standard lie conditions';
    }
}

// Club Selection Advisor
class ClubAdvisor {
    recommendClub(distanceToPin, lie, shotType) {
        const clubs = this.getAvailableClubs(lie);
        const optimal = this.findOptimalClub(distanceToPin, clubs, shotType);
        
        return {
            recommended: optimal,
            reasoning: this.explainChoice(optimal, distanceToPin, lie, shotType)
        };
    }
    
    getAvailableClubs(lie) {
        if (lie === 'sand') return ['wedge'];
        if (lie === 'trees') return ['wedge', '9iron', '7iron'];
        return ['driver', '3wood', '5wood', '3iron', '5iron', '7iron', '9iron', 'wedge', 'putter'];
    }
    
    findOptimalClub(distance, availableClubs, shotType) {
        if (shotType === 'putt') return 'putter';
        if (shotType === 'chip' || shotType === 'pitch') return 'wedge';
        
        // Distance-based club selection
        const clubRanges = {
            'driver': 250, '3wood': 220, '5wood': 190,
            '3iron': 170, '5iron': 150, '7iron': 130,
            '9iron': 110, 'wedge': 70, 'putter': 30
        };
        
        let bestClub = 'wedge';
        let bestDiff = Math.abs(distance - clubRanges['wedge']);
        
        availableClubs.forEach(club => {
            const clubDistance = clubRanges[club];
            const diff = Math.abs(distance - clubDistance);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestClub = club;
            }
        });
        
        return bestClub;
    }
    
    explainChoice(club, distance, lie, shotType) {
        return `${club.toUpperCase()} recommended for ${Math.round(distance)} yard ${shotType} from ${lie}`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('courseVisualization')) {
        window.boardGameEngine = new AuthenticBoardGameEngine();
        console.log('🎲 Board Game Engine loaded successfully');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthenticBoardGameEngine, UnitsManager, ShotAnalyzer, ClubAdvisor };
} else {
    window.AuthenticBoardGameEngine = AuthenticBoardGameEngine;
    window.UnitsManager = UnitsManager;
    window.ShotAnalyzer = ShotAnalyzer;
    window.ClubAdvisor = ClubAdvisor;
}