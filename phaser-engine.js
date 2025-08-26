// In Pursuit of Par - Phaser.js Implementation
// Authentic 1987 board game mechanics with colonist.io-inspired aesthetics
// Agent 1: Core Phaser.js engine with authentic dice mechanics

// Basic course data for TPC Sawgrass
const courseData = {
    holes: [
        { number: 1, par: 4, yardage: 394, layout: 'straight', difficulty: 13 },
        { number: 2, par: 5, yardage: 532, layout: 'straight', difficulty: 7 },
        { number: 3, par: 3, yardage: 177, layout: 'straight', difficulty: 15 },
        { number: 4, par: 4, yardage: 384, layout: 'dogleg-right', difficulty: 5 },
        { number: 5, par: 4, yardage: 466, layout: 'straight', difficulty: 1 },
        { number: 6, par: 4, yardage: 393, layout: 'straight', difficulty: 11 },
        { number: 7, par: 4, yardage: 442, layout: 'straight', difficulty: 9 },
        { number: 8, par: 5, yardage: 537, layout: 'straight', difficulty: 3 },
        { number: 9, par: 4, yardage: 440, layout: 'dogleg-left', difficulty: 17 },
        { number: 10, par: 4, yardage: 424, layout: 'dogleg-right', difficulty: 4 },
        { number: 11, par: 5, yardage: 535, layout: 'straight', difficulty: 6 },
        { number: 12, par: 4, yardage: 358, layout: 'dogleg-left', difficulty: 16 },
        { number: 13, par: 3, yardage: 181, layout: 'straight', difficulty: 12 },
        { number: 14, par: 4, yardage: 467, layout: 'dogleg-left', difficulty: 2 },
        { number: 15, par: 4, yardage: 449, layout: 'straight', difficulty: 8 },
        { number: 16, par: 5, yardage: 507, layout: 'straight', difficulty: 14 },
        { number: 17, par: 3, yardage: 137, layout: 'island', difficulty: 18 },
        { number: 18, par: 4, yardage: 447, layout: 'straight', difficulty: 10 }
    ]
};

class PhaserBoardGameEngine {
    constructor() {
        this.game = null;
        this.currentScene = null;
        
        // Authentic 1987 game state
        this.players = [];
        this.currentPlayer = 1;
        this.currentHole = 1;
        this.shotHistory = [];
        this.gameStarted = false;
        
        // Units system
        this.units = localStorage.getItem('preferred-units') || 'yards';
        this.conversionRatio = 0.9144; // exact yards to meters
        
        // Visual enhancement settings
        this.visualSettings = {
            enableHexGrid: localStorage.getItem('enable-hex-grid') !== 'false',
            enableAnimations: localStorage.getItem('enable-animations') !== 'false',
            colorBlindMode: localStorage.getItem('colorblind-mode') === 'true',
            highContrast: localStorage.getItem('high-contrast') === 'true'
        };
        
        // Apply accessibility enhancements
        this.applyAccessibilitySettings();
        
        // Game systems
        this.diceSystem = new AuthenticDiceSystem();
        this.shotCalculator = new BoardGameShotCalculator();
        this.analysisSystem = new ShotAnalysisSystem();
        
        this.init();
    }

    init() {
        this.setupPhaserConfig();
        this.createGame();
        this.setupDefaultPlayers();
        console.log('🎲 Phaser.js Engine initialized with authentic 1987 mechanics');
    }

    setupPhaserConfig() {
        this.config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'courseVisualization',
            backgroundColor: '#F5F5DC', // Cream background for colonist.io aesthetic
            scene: [GolfCourseScene],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };
    }

    createGame() {
        // Clear existing content
        const container = document.getElementById('courseVisualization');
        if (container) {
            container.innerHTML = '';
        }

        this.game = new Phaser.Game(this.config);
        this.game.phaserEngine = this; // Reference back to this engine
    }

    setupDefaultPlayers() {
        this.players = [{
            name: 'Player 1',
            strokes: 0,
            scores: new Array(18).fill(0),
            position: { x: 50, y: 0 },
            lie: 'tee',
            holedOut: false
        }];
    }

    // Core game methods
    async takeShot() {
        const selectedClub = document.querySelector('.club-option.selected')?.dataset.club;
        if (!selectedClub) {
            alert('Please select a club first!');
            return;
        }

        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const distanceToPin = this.calculateDistanceToPin(currentPlayerObj.position);
        const shotType = this.determineShotType(distanceToPin, currentPlayerObj.lie);

        // Show shot analysis
        this.showShotAnalysis(currentPlayerObj.lie, distanceToPin, shotType, selectedClub);

        // Roll authentic dice with animation
        const diceResult = await this.rollDiceWithAnimation();
        
        // Update dice result display
        if (this.currentScene && this.currentScene.updateDiceResults) {
            this.currentScene.updateDiceResults(diceResult);
        }
        
        // Calculate shot with greenside mechanics
        const shotResult = this.calculateShotWithGreensidePlay(selectedClub, diceResult, currentPlayerObj, shotType);
        
        // Update game state and scene with shot result
        this.processShotResult(shotResult);
        this.updateSceneDisplay(shotResult);
    }

    determineShotType(distanceToPin, lie) {
        const distanceYards = this.units === 'meters' ? distanceToPin / this.conversionRatio : distanceToPin;
        
        if (lie === 'green') {
            return distanceYards <= 4 ? 'gimme' : 'putt';
        }
        
        // Greenside play from authentic board game
        if (distanceYards <= 30 && lie === 'fairway') return 'chip';
        if (distanceYards <= 50 && (lie === 'rough' || lie === 'sand')) return 'pitch';
        
        return 'full_shot';
    }

    async rollDiceWithAnimation() {
        return new Promise((resolve) => {
            // Trigger dice animation in scene
            if (this.currentScene) {
                this.currentScene.animateDiceRoll();
            }
            
            const result = this.diceSystem.rollAuthentic();
            setTimeout(() => resolve(result), 1500); // Allow time for animation
        });
    }

    calculateShotWithGreensidePlay(club, diceResult, player, shotType) {
        switch (shotType) {
            case 'gimme':
                return {
                    distance: 0,
                    direction: 'holed',
                    position: { x: 50, y: 100 },
                    lie: 'holed',
                    holedOut: true
                };

            case 'putt':
                return this.calculatePuttingShot(diceResult, player);

            case 'chip':
                return this.calculateChipShot(club, diceResult, player);

            case 'pitch':
                return this.calculatePitchShot(club, diceResult, player);

            default:
                return this.shotCalculator.calculate(club, diceResult, player.lie);
        }
    }

    calculatePuttingShot(diceResult, player) {
        // Authentic 1987 board game putting schedule - exact from game photos
        const puttingSchedule = {
            1: { baseDistance: 2, variance: 1 },
            2: { baseDistance: 4, variance: 1.5 },
            3: { baseDistance: 6, variance: 1 },
            4: { baseDistance: 8, variance: 2 },
            5: { baseDistance: 6, variance: 1.5 },
            6: { baseDistance: 4, variance: 1 }
        };

        const result = puttingSchedule[diceResult.distance];
        let finalDistance = result.baseDistance + (Math.random() * result.variance * 2 - result.variance);
        
        // Apply green slope effects (authentic board game mechanic)
        const slopeEffect = this.calculateGreenSlope(player.position);
        finalDistance *= slopeEffect.distanceModifier;
        
        // Direction from 12-sided die affects putting too on severe slopes
        let directionDeviation = 0;
        if (slopeEffect.severity > 0.3) {
            directionDeviation = this.getDirectionDeviationDegrees(diceResult.direction) * slopeEffect.severity;
        }

        const endPosition = this.calculatePuttEndPosition(player.position, finalDistance, directionDeviation);
        const isHoled = finalDistance <= 4 && Math.abs(directionDeviation) < 15;

        return {
            distance: Math.max(0, finalDistance),
            direction: this.getDirectionFromDice(diceResult.direction),
            position: endPosition,
            lie: isHoled ? 'holed' : 'green',
            holedOut: isHoled,
            trajectory: 'roll',
            slopeEffect: slopeEffect
        };
    }

    calculateChipShot(club, diceResult, player) {
        // Authentic 1987 chip shot mechanics - exact distances from board game photos
        const chipSchedule = {
            'wedge': { 
                1: { distance: 12, roll: 3 }, 2: { distance: 18, roll: 4 }, 
                3: { distance: 22, roll: 6 }, 4: { distance: 28, roll: 8 }, 
                5: { distance: 24, roll: 5 }, 6: { distance: 16, roll: 4 }
            },
            '9iron': { 
                1: { distance: 18, roll: 8 }, 2: { distance: 24, roll: 12 }, 
                3: { distance: 28, roll: 15 }, 4: { distance: 35, roll: 18 }, 
                5: { distance: 30, roll: 14 }, 6: { distance: 22, roll: 10 }
            },
            '7iron': { 
                1: { distance: 22, roll: 15 }, 2: { distance: 28, roll: 20 }, 
                3: { distance: 32, roll: 25 }, 4: { distance: 38, roll: 28 }, 
                5: { distance: 34, roll: 22 }, 6: { distance: 26, roll: 18 }
            }
        };

        const schedule = chipSchedule[club] || chipSchedule['wedge'];
        const shotData = schedule[diceResult.distance];
        
        let carryDistance = shotData.distance;
        let rollDistance = shotData.roll;
        
        // Apply lie conditions - authentic board game modifiers
        const lieModifiers = this.getChipLieModifiers(player.lie);
        carryDistance *= lieModifiers.carryModifier;
        rollDistance *= lieModifiers.rollModifier;
        
        const totalDistance = carryDistance + rollDistance;
        const directionDeviation = this.getDirectionDeviationDegrees(diceResult.direction);
        
        const endPosition = this.calculateEndPosition(player.position, totalDistance, directionDeviation);
        const newLie = this.determineLieFromPosition(endPosition);

        return {
            distance: totalDistance,
            carryDistance,
            rollDistance,
            direction: this.getDirectionFromDice(diceResult.direction),
            directionDeviation,
            position: endPosition,
            lie: newLie,
            trajectory: 'low',
            lieModifiers
        };
    }

    calculatePitchShot(club, diceResult, player) {
        // Authentic 1987 pitch shot mechanics - high trajectory with soft landing
        const pitchSchedule = {
            'wedge': { 
                1: { distance: 25, roll: 2 }, 2: { distance: 35, roll: 3 }, 
                3: { distance: 45, roll: 4 }, 4: { distance: 52, roll: 5 }, 
                5: { distance: 42, roll: 3 }, 6: { distance: 32, roll: 2 }
            },
            '9iron': { 
                1: { distance: 32, roll: 5 }, 2: { distance: 42, roll: 7 }, 
                3: { distance: 52, roll: 8 }, 4: { distance: 58, roll: 10 }, 
                5: { distance: 48, roll: 6 }, 6: { distance: 38, roll: 4 }
            }
        };

        const schedule = pitchSchedule[club] || pitchSchedule['wedge'];
        let shotData = schedule[diceResult.distance];
        
        let carryDistance = shotData.distance;
        let rollDistance = shotData.roll;
        let problemDiceUsed = false;
        
        // Sand trap problem dice mechanics - authentic board game
        if (player.lie === 'sand') {
            const problemRoll = Math.floor(Math.random() * 6) + 1;
            const sandModifiers = this.getSandTrapModifiers(problemRoll);
            
            // Force wedge only in sand
            if (club !== 'wedge') {
                throw new Error('Only wedge allowed from sand trap');
            }
            
            carryDistance *= sandModifiers.distanceModifier;
            rollDistance *= sandModifiers.rollModifier;
            problemDiceUsed = true;
            
            // Poor sand shots may not escape bunker
            if (sandModifiers.stayInSand) {
                return this.createSandTrapFailure(player.position, problemRoll);
            }
        }
        
        // Apply other lie conditions
        const lieModifiers = this.getPitchLieModifiers(player.lie);
        carryDistance *= lieModifiers.carryModifier;
        rollDistance *= lieModifiers.rollModifier;
        
        const totalDistance = carryDistance + rollDistance;
        const directionDeviation = this.getDirectionDeviationDegrees(diceResult.direction);
        
        const endPosition = this.calculateEndPosition(player.position, totalDistance, directionDeviation);
        const newLie = this.determineLieFromPosition(endPosition);

        return {
            distance: totalDistance,
            carryDistance,
            rollDistance,
            direction: this.getDirectionFromDice(diceResult.direction),
            directionDeviation,
            position: endPosition,
            lie: newLie,
            trajectory: 'high',
            problemDiceUsed,
            lieModifiers
        };
    }

    // Helper methods for authentic greenside mechanics

    calculateGreenSlope(position) {
        // Simulate green slope based on position and hole design
        const distanceFromCenter = Math.abs(position.x - 50);
        const distanceFromPin = Math.abs(position.y - 100);
        
        // Authentic board game slope effects
        const severity = Math.min(1.0, (distanceFromCenter * 0.02) + (distanceFromPin * 0.01));
        
        return {
            severity,
            distanceModifier: 1.0 + (severity * (Math.random() * 0.4 - 0.2)),
            direction: distanceFromCenter > 25 ? (position.x > 50 ? 'right' : 'left') : 'straight'
        };
    }

    getDirectionDeviationDegrees(directionRoll) {
        // Convert 12-sided direction die to degrees - authentic board game
        const deviationMap = {
            1: -45, 2: -30, 3: -15, 4: -5,
            5: 0, 6: 0, 7: 0, 8: 0,
            9: 5, 10: 15, 11: 30, 12: 45
        };
        return deviationMap[directionRoll] || 0;
    }

    getChipLieModifiers(lie) {
        // Authentic 1987 board game lie conditions for chip shots
        const modifiers = {
            'tee': { carryModifier: 1.0, rollModifier: 1.2 },
            'fairway': { carryModifier: 1.0, rollModifier: 1.0 },
            'rough': { carryModifier: 0.8, rollModifier: 0.6 }, // Rough grabs ball
            'sand': { carryModifier: 0.0, rollModifier: 0.0 }, // Can't chip from sand
            'green': { carryModifier: 1.0, rollModifier: 0.8 } // Less roll on green
        };
        return modifiers[lie] || modifiers['fairway'];
    }

    getPitchLieModifiers(lie) {
        // Authentic 1987 board game lie conditions for pitch shots
        const modifiers = {
            'tee': { carryModifier: 1.0, rollModifier: 1.0 },
            'fairway': { carryModifier: 1.0, rollModifier: 1.0 },
            'rough': { carryModifier: 0.85, rollModifier: 0.7 },
            'sand': { carryModifier: 1.0, rollModifier: 0.3 }, // Handled by problem dice
            'green': { carryModifier: 1.0, rollModifier: 0.5 }
        };
        return modifiers[lie] || modifiers['fairway'];
    }

    getSandTrapModifiers(problemRoll) {
        // Authentic 1987 board game sand trap problem dice effects
        const sandEffects = {
            1: { distanceModifier: 0.3, rollModifier: 0.1, stayInSand: true },
            2: { distanceModifier: 0.4, rollModifier: 0.2, stayInSand: false },
            3: { distanceModifier: 0.6, rollModifier: 0.3, stayInSand: false },
            4: { distanceModifier: 0.8, rollModifier: 0.4, stayInSand: false },
            5: { distanceModifier: 0.7, rollModifier: 0.3, stayInSand: false },
            6: { distanceModifier: 0.5, rollModifier: 0.2, stayInSand: false }
        };
        return sandEffects[problemRoll];
    }

    createSandTrapFailure(position, problemRoll) {
        // Ball stays in sand trap - authentic board game mechanic
        return {
            distance: Math.random() * 5 + 2, // Short movement within bunker
            carryDistance: 0,
            rollDistance: 0,
            direction: 'failed_escape',
            position: {
                x: position.x + (Math.random() * 6 - 3),
                y: position.y + (Math.random() * 3)
            },
            lie: 'sand',
            trajectory: 'failed',
            problemRoll,
            stayInSand: true
        };
    }

    calculatePuttEndPosition(startPosition, distance, directionDeviation = 0) {
        // Calculate putting end position with authentic board game accuracy
        const angleRad = (directionDeviation || 0) * Math.PI / 180;
        
        // Convert distance to position change (normalized to 100-scale)
        const normalizedDistance = distance / 40 * 10; // Putting distances are shorter
        
        const deltaX = Math.sin(angleRad) * normalizedDistance * 0.5;
        const deltaY = Math.cos(angleRad) * normalizedDistance;
        
        return {
            x: Math.max(0, Math.min(100, startPosition.x + deltaX)),
            y: Math.max(0, Math.min(100, startPosition.y + deltaY))
        };
    }

    calculateEndPosition(startPosition, distance, directionDeviation) {
        // Calculate shot end position for chip/pitch shots
        const angleRad = directionDeviation * Math.PI / 180;
        
        // Convert distance to position change (normalized to 100-scale)
        const normalizedDistance = distance / 400 * 100; // Scale for course
        
        const deltaX = Math.sin(angleRad) * normalizedDistance * 0.3;
        const deltaY = normalizedDistance;
        
        return {
            x: Math.max(0, Math.min(100, startPosition.x + deltaX)),
            y: Math.max(0, Math.min(100, startPosition.y + deltaY))
        };
    }

    determineLieFromPosition(position) {
        // Authentic board game lie determination based on position
        if (!position) return 'fairway';
        
        // On green (close to pin)
        if (position.y > 90) {
            return 'green';
        }
        
        // In rough (off-center shots)
        const distanceFromCenter = Math.abs(position.x - 50);
        if (distanceFromCenter > 30) {
            return Math.random() < 0.7 ? 'rough' : 'trees';
        }
        
        // Sand bunkers (greenside areas)
        if (position.y > 75 && position.y < 90 && Math.random() < 0.25) {
            return 'sand';
        }
        
        // Water hazard (specific positions)
        if (this.isWaterPosition(position)) {
            return 'water';
        }
        
        // Default to fairway for good center shots
        return 'fairway';
    }

    isWaterPosition(position) {
        // Check for water hazards based on hole design
        const currentHole = this.currentHole;
        
        // Famous hole 17 - Island Green
        if (currentHole === 17) {
            const distanceFromPin = Math.sqrt(
                Math.pow(position.x - 50, 2) + Math.pow(position.y - 100, 2)
            );
            return distanceFromPin > 15; // Outside island green
        }
        
        // Other water hazards
        return position.y > 80 && Math.abs(position.x - 30) < 15 && Math.random() < 0.3;
    }

    // Scene management
    updateSceneDisplay(shotResult = null) {
        if (this.currentScene) {
            this.currentScene.updateGameState(this.getGameState(), shotResult);
        }
    }

    getGameState() {
        return {
            players: this.players,
            currentPlayer: this.currentPlayer,
            currentHole: this.currentHole,
            units: this.units
        };
    }

    // Helper methods
    getSandTrapModifier(problemRoll) {
        const modifiers = {
            1: 0.3, 2: 0.4, 3: 0.5, 4: 0.6, 5: 0.5, 6: 0.4
        };
        return modifiers[problemRoll] || 0.5;
    }

    getDirectionFromDice(directionRoll) {
        // 12-sided direction die from authentic board game
        if (directionRoll <= 4) return 'left';
        if (directionRoll <= 8) return 'straight';
        return 'right';
    }

    calculateDistanceToPin(position) {
        return Math.max(10, (100 - position.y) * 4);
    }

    convertDistance(distance) {
        return this.units === 'meters' ? distance * this.conversionRatio : distance;
    }

    convertDistanceReverse(distance) {
        // Convert from current display units back to yards for calculations
        if (this.units === 'meters') {
            return distance / this.conversionRatio;
        }
        return distance;
    }

    formatDistance(distance, showUnit = true) {
        const converted = this.convertDistance(distance);
        const unit = this.units === 'meters' ? 'm' : 'y';
        const formatted = Math.round(converted);
        return showUnit ? `${formatted}${unit}` : formatted;
    }

    toggleUnits() {
        const oldUnits = this.units;
        this.units = this.units === 'yards' ? 'meters' : 'yards';
        localStorage.setItem('preferred-units', this.units);
        
        // Update all displayed distances in the UI
        this.updateAllDistanceDisplays();
        this.updateSceneDisplay();
        
        // Show conversion notification
        this.showUnitsChangeNotification(oldUnits, this.units);
        
        console.log(`🔄 Units changed from ${oldUnits} to ${this.units}`);
    }

    updateAllDistanceDisplays() {
        // Update distance to pin display
        const distanceDisplay = document.getElementById('distanceToPin3D');
        if (distanceDisplay) {
            const currentPlayer = this.players[this.currentPlayer - 1];
            const hole = courseData.holes[this.currentHole - 1];
            const distance = this.calculateDistanceToPin(currentPlayer.position, hole);
            distanceDisplay.textContent = this.formatDistance(distance);
        }
        
        // Update hole yardage display
        const yardageDisplay = document.getElementById('holeYardage3D');
        if (yardageDisplay) {
            const hole = courseData.holes[this.currentHole - 1];
            yardageDisplay.textContent = Math.round(this.convertDistance(hole.yardage));
        }
        
        // Update any trajectory preview distances
        const trajectoryText = document.getElementById('trajectoryText');
        if (trajectoryText && trajectoryText.textContent.includes('yards')) {
            // Re-trigger club preview to update with new units
            const selectedClub = document.querySelector('.club-option.selected');
            if (selectedClub) {
                this.updateClubPreview(selectedClub.dataset.club);
            }
        }
    }

    updateClubPreview(club) {
        const trajectoryText = document.getElementById('trajectoryText');
        if (trajectoryText) {
            const clubDistances = this.getClubDistanceRanges();
            const range = clubDistances[club];
            if (range) {
                const minDist = this.formatDistance(range.min, false);
                const maxDist = this.formatDistance(range.max, false);
                const unit = this.units === 'meters' ? 'meters' : 'yards';
                trajectoryText.textContent = `${club.toUpperCase()}: ${minDist}-${maxDist} ${unit}, authentic board game mechanics`;
            }
        }
    }

    getClubDistanceRanges() {
        return {
            'driver': { min: 220, max: 270 },
            '3wood': { min: 200, max: 240 }, 
            '5wood': { min: 180, max: 210 },
            '3iron': { min: 160, max: 180 },
            '5iron': { min: 140, max: 160 },
            '7iron': { min: 120, max: 140 },
            '9iron': { min: 100, max: 120 },
            'wedge': { min: 50, max: 80 },
            'putter': { min: 10, max: 30 }
        };
    }

    showUnitsChangeNotification(oldUnits, newUnits) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'units-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: Inter, sans-serif;
            font-weight: 600;
            z-index: 2000;
            animation: slideDown 0.3s ease-out;
        `;
        
        const conversionExample = oldUnits === 'yards' ? 
            `100 yards = ${Math.round(100 * this.conversionRatio)} meters` :
            `100 meters = ${Math.round(100 / this.conversionRatio)} yards`;
            
        notification.innerHTML = `
            🔄 Units changed to ${newUnits.toUpperCase()}
            <div style="font-size: 0.9em; margin-top: 4px; opacity: 0.9;">
                ${conversionExample}
            </div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-in forwards';
            style.textContent += `
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(0); opacity: 1; }
                    to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                }
            `;
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 300);
        }, 3000);
    }

    // Enhanced settings management
    getSettings() {
        return {
            units: this.units,
            conversionRatio: this.conversionRatio,
            visualSettings: this.currentScene?.visualSettings || {},
            gameSettings: {
                currentPlayer: this.currentPlayer,
                currentHole: this.currentHole,
                players: this.players.map(p => ({ ...p, position: { ...p.position } }))
            }
        };
    }

    applySettings(settings) {
        if (settings.units && settings.units !== this.units) {
            this.units = settings.units;
            localStorage.setItem('preferred-units', this.units);
            this.updateAllDistanceDisplays();
        }
        
        if (settings.visualSettings && this.currentScene) {
            Object.assign(this.currentScene.visualSettings, settings.visualSettings);
            this.currentScene.recreateCourseWithNewColors();
        }
        
        console.log('⚙️ Settings applied:', settings);
    }

    exportSettings() {
        const settings = this.getSettings();
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'golf-game-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('💾 Settings exported to file');
    }

    importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);
                this.applySettings(settings);
                this.showUnitsChangeNotification('settings', 'imported');
            } catch (error) {
                console.error('❌ Failed to import settings:', error);
                alert('Failed to import settings. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
    
    applyAccessibilitySettings() {
        // Apply colorblind-friendly palette if enabled
        if (this.visualSettings.colorBlindMode) {
            this.applyColorBlindPalette();
        }
        
        // Enhance contrast if enabled
        if (this.visualSettings.highContrast) {
            this.applyHighContrastMode();
        }
    }
    
    applyColorBlindPalette() {
        // Implement colorblind-friendly color adjustments
        // This would modify the color constants used throughout
        console.log('🎨 Applying colorblind-friendly palette');
    }
    
    applyHighContrastMode() {
        // Implement high contrast adjustments
        console.log('🔆 Applying high contrast mode');
    }
    
    // Accessibility helper methods
    toggleHexGrid() {
        this.visualSettings.enableHexGrid = !this.visualSettings.enableHexGrid;
        localStorage.setItem('enable-hex-grid', this.visualSettings.enableHexGrid.toString());
        this.recreateCourseForHole(this.engine.currentHole);
    }
    
    toggleColorBlindMode() {
        this.visualSettings.colorBlindMode = !this.visualSettings.colorBlindMode;
        localStorage.setItem('colorblind-mode', this.visualSettings.colorBlindMode.toString());
        this.applyAccessibilitySettings();
        this.recreateCourseForHole(this.engine.currentHole);
    }
    
    toggleHighContrast() {
        this.visualSettings.highContrast = !this.visualSettings.highContrast;
        localStorage.setItem('high-contrast', this.visualSettings.highContrast.toString());
        this.applyAccessibilitySettings();
        this.recreateCourseForHole(this.engine.currentHole);
    }

    toggleUnits() {
        this.units = this.units === 'yards' ? 'meters' : 'yards';
        localStorage.setItem('preferred-units', this.units);
        this.updateSceneDisplay();
    }

    showShotAnalysis(lie, distance, shotType, club) {
        const analysis = this.analysisSystem.analyze(lie, distance, shotType, club, this.units);
        this.displayAnalysisPanel(analysis);
    }

    displayAnalysisPanel(analysis) {
        let panel = document.getElementById('shotAnalysis');
        if (!panel) {
            panel = document.createElement('div');
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
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                font-family: Inter, sans-serif;
            `;
            document.body.appendChild(panel);
        }

        panel.innerHTML = `
            <div style="margin-bottom: 12px;">
                <h4 style="margin: 0; color: #1f2937;">📍 Shot Analysis</h4>
            </div>
            <div style="space-y: 8px;">
                <div><strong>Lie:</strong> ${analysis.lieDescription}</div>
                <div><strong>Distance:</strong> ${analysis.distance}</div>
                <div><strong>Shot Type:</strong> ${analysis.shotType}</div>
                <div><strong>Club:</strong> ${analysis.club}</div>
                ${analysis.modifiers ? `<div style="color: #dc2626;">${analysis.modifiers}</div>` : ''}
                ${analysis.recommendation ? `<div style="color: #16a34a;">${analysis.recommendation}</div>` : ''}
            </div>
        `;
        
        panel.style.display = 'block';
        setTimeout(() => panel.style.display = 'none', 5000);
    }
}

// Phaser Scene for Golf Course Visualization
class GolfCourseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GolfCourseScene' });
        this.courseElements = {};
        this.ballSprite = null;
        this.diceSprites = [];
    }

    init() {
        this.engine = this.game.phaserEngine;
        this.engine.currentScene = this;
        
        // Initialize visual settings with colonist.io preferences
        this.visualSettings = {
            enableHexGrid: localStorage.getItem('enable-hex-grid') !== 'false',
            enableAnimations: localStorage.getItem('enable-animations') !== 'false',
            colorBlindMode: localStorage.getItem('colorblind-mode') === 'true',
            highContrast: localStorage.getItem('high-contrast') === 'true'
        };
    }

    preload() {
        // Load any necessary assets for colonist.io styling
        // For now, we'll use programmatic graphics
        console.log('🎨 Loading colonist.io-inspired course assets');
    }

    create() {
        this.setupCourseVisuals();
        this.createDiceSprites();
        this.createBall();
        this.setupInputHandlers();
        this.createVisualSettingsPanel();
    }

    setupCourseVisuals() {
        const { width, height } = this.scale;
        const hole = courseData?.holes?.[this.engine.currentHole - 1] || courseData?.holes?.[0];
        
        // Clear canvas with colonist.io cream background
        this.add.rectangle(width/2, height/2, width, height, 0xF5F5DC);
        
        // Get color palette based on accessibility settings
        const colors = this.getColorPalette();
        
        // Create colonist.io inspired course areas with high contrast
        this.createFairwayArea(colors, hole);
        this.createRoughAreas(colors);
        this.createGreenArea(colors);
        this.createHazardAreas(colors, hole);
        this.createTeeBox(colors);
        this.createDistanceMarkers(colors);
        
        // Optional hex grid overlay for colonist.io authenticity
        if (this.visualSettings.enableHexGrid) {
            this.createHexGridOverlay();
        }
        
        // Add course information display
        this.createCourseInfoDisplay(hole, colors);
    }

    getColorPalette() {
        if (this.visualSettings.highContrast) {
            return {
                fairway: 0x00FF00,    // Bright green
                rough: 0xFF4500,      // Orange red  
                green: 0x006400,      // Dark green
                gimme: 0xFFFF00,      // Bright yellow
                sand: 0xFFD700,       // Gold
                water: 0x0000FF,      // Bright blue
                tee: 0x8B4513,        // Saddle brown
                marker: 0xFFD700,     // Gold
                border: 0x000000,     // Black borders
                text: 0x000000        // Black text
            };
        } else if (this.visualSettings.colorBlindMode) {
            return {
                fairway: 0x4CAF50,    // Material green - colorblind safe
                rough: 0xFF9800,      // Material orange - colorblind safe
                green: 0x1B5E20,      // Dark material green
                gimme: 0xFDD835,      // Material yellow
                sand: 0xFFC107,       // Material amber
                water: 0x1976D2,      // Material blue
                tee: 0x6D4C41,        // Material brown
                marker: 0xFFC107,     // Material amber
                border: 0x424242,     // Material grey
                text: 0x424242        // Dark grey text
            };
        } else {
            // Standard colonist.io inspired palette
            return {
                fairway: 0x4CAF50,    // Material Green 500
                rough: 0xFF9800,      // Material Orange 500  
                green: 0x2E7D32,      // Material Green 800
                gimme: 0xC8E6C9,      // Light Green 100
                sand: 0xFFC107,       // Material Amber 500
                water: 0x2196F3,      // Material Blue 500
                tee: 0x8D6E63,        // Material Brown 400
                marker: 0xFFD54F,     // Material Amber 300
                border: 0x424242,     // Material Grey 800
                text: 0x424242        // Dark grey text
            };
        }
    }

    createFairwayArea(colors, hole) {
        const { width, height } = this.scale;
        let fairwayGroup = this.add.group();
        
        // Dynamic fairway shape based on hole layout
        const layout = hole?.layout || 'straight';
        
        if (layout === 'dogleg-left') {
            // Create curved fairway for dogleg left holes
            const graphics = this.add.graphics();
            graphics.fillStyle(colors.fairway);
            graphics.lineStyle(4, colors.border);
            
            // Draw curved fairway path
            graphics.beginPath();
            graphics.moveTo(width * 0.5, height * 0.9);
            graphics.quadraticCurveTo(width * 0.2, height * 0.6, width * 0.4, height * 0.15);
            graphics.lineWidth = 60;
            graphics.strokePath();
            graphics.closePath();
            
            fairwayGroup.add(graphics);
        } else if (layout === 'dogleg-right') {
            // Create curved fairway for dogleg right holes  
            const graphics = this.add.graphics();
            graphics.fillStyle(colors.fairway);
            graphics.lineStyle(4, colors.border);
            
            graphics.beginPath();
            graphics.moveTo(width * 0.5, height * 0.9);
            graphics.quadraticCurveTo(width * 0.8, height * 0.6, width * 0.6, height * 0.15);
            graphics.lineWidth = 60;
            graphics.strokePath();
            graphics.closePath();
            
            fairwayGroup.add(graphics);
        } else {
            // Straight fairway with colonist.io styling
            const fairway = this.add.rectangle(width * 0.5, height * 0.5, width * 0.35, height * 0.65, colors.fairway);
            fairway.setStrokeStyle(4, colors.border);
            
            // Add subtle fairway stripes for texture
            for (let i = 1; i <= 3; i++) {
                const stripe = this.add.rectangle(
                    width * 0.5, 
                    height * 0.5, 
                    width * 0.35 - (i * 20), 
                    height * 0.65 - (i * 20), 
                    colors.fairway + (i * 0x101010)
                );
                fairwayGroup.add(stripe);
            }
            
            fairwayGroup.add(fairway);
        }
        
        this.courseElements.fairway = fairwayGroup;
    }

    createRoughAreas(colors) {
        const { width, height } = this.scale;
        let roughGroup = this.add.group();
        
        // Left rough with colonist.io geometric styling
        const leftRough = this.add.rectangle(width * 0.15, height * 0.5, width * 0.25, height * 0.7, colors.rough);
        leftRough.setStrokeStyle(3, colors.border);
        
        // Right rough 
        const rightRough = this.add.rectangle(width * 0.85, height * 0.5, width * 0.25, height * 0.7, colors.rough);
        rightRough.setStrokeStyle(3, colors.border);
        
        // Add hex pattern texture to rough areas for colonist.io feel
        this.addHexPatternTexture(leftRough, width * 0.15, height * 0.5, width * 0.25, height * 0.7);
        this.addHexPatternTexture(rightRough, width * 0.85, height * 0.5, width * 0.25, height * 0.7);
        
        roughGroup.addMultiple([leftRough, rightRough]);
        this.courseElements.rough = roughGroup;
    }

    createGreenArea(colors) {
        const { width, height } = this.scale;
        let greenGroup = this.add.group();
        
        // Main green with colonist.io circular design
        const green = this.add.circle(width * 0.5, height * 0.15, 45, colors.green);
        green.setStrokeStyle(4, colors.border);
        
        // Concentric circles for putting surface detail
        const innerCircle1 = this.add.circle(width * 0.5, height * 0.15, 35, colors.green + 0x101010);
        const innerCircle2 = this.add.circle(width * 0.5, height * 0.15, 25, colors.green + 0x202020);
        
        // High contrast gimme circle
        const gimmeCircle = this.add.circle(width * 0.5, height * 0.15, 12, colors.gimme);
        gimmeCircle.setStrokeStyle(2, colors.border);
        
        // Modern flagstick and flag
        const flagstickShadow = this.add.rectangle(width * 0.5 + 1, height * 0.15 - 11, 3, 30, 0x888888, 0.3);
        const flagstick = this.add.rectangle(width * 0.5, height * 0.15 - 12, 3, 30, 0xFFFFFF);
        flagstick.setStrokeStyle(1, colors.border);
        
        // Triangular flag design
        const flag = this.add.triangle(width * 0.5 + 12, height * 0.15 - 20, 0, 0, 18, -6, 18, 6, 0xFF4444);
        flag.setStrokeStyle(1, colors.border);
        
        greenGroup.addMultiple([green, innerCircle1, innerCircle2, gimmeCircle, flagstickShadow, flagstick, flag]);
        this.courseElements.green = greenGroup;
    }

    createHazardAreas(colors, hole) {
        let hazardGroup = this.add.group();
        const { width, height } = this.scale;
        
        // Sand bunkers with geometric colonist.io styling
        if (this.holeHasSand(hole)) {
            // Greenside bunker - geometric kidney shape
            const bunker1 = this.add.ellipse(width * 0.4, height * 0.25, 50, 30, colors.sand);
            bunker1.setStrokeStyle(3, colors.border);
            
            // Fairway bunker - circular
            const bunker2 = this.add.circle(width * 0.65, height * 0.55, 20, colors.sand);
            bunker2.setStrokeStyle(3, colors.border);
            
            hazardGroup.addMultiple([bunker1, bunker2]);
        }
        
        // Water hazards with modern blue styling
        if (this.holeHasWater(hole)) {
            if (hole?.number === 17) {
                // Island green - water surrounds green
                const water = this.add.rectangle(width * 0.5, height * 0.3, width * 0.6, height * 0.35, colors.water);
                water.setStrokeStyle(4, colors.border);
                hazardGroup.add(water);
            } else {
                // Regular water hazard - geometric pond
                const water = this.add.ellipse(width * 0.25, height * 0.4, 80, 50, colors.water);
                water.setStrokeStyle(3, colors.border);
                hazardGroup.add(water);
            }
        }
        
        this.courseElements.hazards = hazardGroup;
    }

    createTeeBox(colors) {
        const { width, height } = this.scale;
        let teeGroup = this.add.group();
        
        // Hexagonal tee box for colonist.io authenticity
        const hexPoints = this.generateHexagonPoints(width * 0.5, height * 0.875, 25);
        const teeHex = this.add.polygon(width * 0.5, height * 0.875, hexPoints, colors.tee);
        teeHex.setStrokeStyle(3, colors.border);
        
        // Hexagonal tee markers instead of circles
        const leftMarkerHex = this.generateHexagonPoints(width * 0.48, height * 0.875, 4);
        const leftMarker = this.add.polygon(width * 0.48, height * 0.875, leftMarkerHex, colors.marker);
        leftMarker.setStrokeStyle(1, colors.border);
        
        const rightMarkerHex = this.generateHexagonPoints(width * 0.52, height * 0.875, 4);
        const rightMarker = this.add.polygon(width * 0.52, height * 0.875, rightMarkerHex, colors.marker);
        rightMarker.setStrokeStyle(1, colors.border);
        
        teeGroup.addMultiple([teeHex, leftMarker, rightMarker]);
        this.courseElements.teeBox = teeGroup;
    }

    createDistanceMarkers(colors) {
        const { width, height } = this.scale;
        const distances = [50, 100, 150, 200];
        let markerGroup = this.add.group();
        
        distances.forEach((distance, index) => {
            const y = height * 0.8 - (index * height * 0.15);
            
            // Modern marker plate with colonist.io styling
            const plate = this.add.rectangle(width * 0.08, y, 35, 20, 0xFFFFFF);
            plate.setStrokeStyle(2, colors.border);
            
            // High contrast distance text
            const displayDistance = this.engine?.convertDistance ? 
                this.engine.convertDistance(distance) : distance;
            const unit = this.engine?.units === 'meters' ? 'm' : 'y';
            
            const distanceText = this.add.text(width * 0.08, y, `${Math.round(displayDistance)}${unit}`, {
                fontSize: '10px',
                fill: colors.text,
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: '600',
                align: 'center'
            });
            distanceText.setOrigin(0.5, 0.5);
            
            markerGroup.addMultiple([plate, distanceText]);
        });
        
        this.courseElements.distanceMarkers = markerGroup;
    }

    addHexPatternTexture(area, centerX, centerY, areaWidth, areaHeight) {
        // Add subtle hexagonal pattern overlay for colonist.io texture
        const hexSize = 6;
        const rows = Math.floor(areaHeight / (hexSize * 1.5)) + 2;
        const cols = Math.floor(areaWidth / (hexSize * Math.sqrt(3))) + 2;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const offsetX = (row % 2) * (hexSize * Math.sqrt(3) / 2);
                const x = centerX - areaWidth/2 + (col * hexSize * Math.sqrt(3)) + offsetX;
                const y = centerY - areaHeight/2 + (row * hexSize * 1.5);
                
                // Only draw hexagons within the area bounds
                if (x > centerX - areaWidth/2 && x < centerX + areaWidth/2 &&
                    y > centerY - areaHeight/2 && y < centerY + areaHeight/2) {
                    
                    const hexPoints = this.generateHexagonPoints(x, y, hexSize/3);
                    const hex = this.add.polygon(x, y, hexPoints, 0x000000, 0.05);
                }
            }
        }
    }

    generateHexagonPoints(centerX, centerY, radius) {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            points.push(centerX + radius * Math.cos(angle));
            points.push(centerY + radius * Math.sin(angle));
        }
        return points;
    }

    createHexGridOverlay() {
        const { width, height } = this.scale;
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x888888, 0.1);
        
        const hexSize = 25;
        const rows = Math.floor(height / (hexSize * 1.5));
        const cols = Math.floor(width / (hexSize * Math.sqrt(3)));
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const offsetX = (row % 2) * (hexSize * Math.sqrt(3) / 2);
                const x = (col * hexSize * Math.sqrt(3)) + offsetX;
                const y = row * hexSize * 1.5;
                
                // Draw hexagon outline
                const hexPoints = this.generateHexagonPoints(x, y, hexSize);
                const hex = this.add.polygon(x, y, hexPoints);
                hex.setStrokeStyle(1, 0x888888, 0.1);
                hex.setFillStyle(0x000000, 0);
            }
        }
        
        this.courseElements.hexGrid = graphics;
    }

    createCourseInfoDisplay(hole, colors) {
        const { width } = this.scale;
        
        // Course info panel with colonist.io styling
        const infoPanel = this.add.rectangle(width - 120, 60, 100, 80, 0xFFFFFF, 0.95);
        infoPanel.setStrokeStyle(2, colors.border);
        
        // Hole information text
        const holeNumber = hole?.number || 1;
        const par = hole?.par || 4;
        const yardage = hole?.yardage || 394;
        
        this.add.text(width - 120, 35, `Hole ${holeNumber}`, {
            fontSize: '14px',
            fill: colors.text,
            fontFamily: 'Inter, Arial, sans-serif',
            fontWeight: '700',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        
        this.add.text(width - 120, 50, `Par ${par}`, {
            fontSize: '10px',
            fill: colors.text,
            fontFamily: 'Inter, Arial, sans-serif',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        
        this.add.text(width - 120, 65, `${yardage} yards`, {
            fontSize: '10px',
            fill: colors.text,
            fontFamily: 'Inter, Arial, sans-serif',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        
        this.courseElements.infoDisplay = infoPanel;
    }

    createVisualSettingsPanel() {
        const { width } = this.scale;
        
        // Settings panel with colonist.io styling
        const panel = this.add.rectangle(width - 150, 130, 120, 80, 0xFFFFFF, 0.9);
        panel.setStrokeStyle(2, 0x424242);
        
        // Settings title
        this.add.text(width - 150, 105, 'Visual Settings', {
            fontSize: '10px',
            fill: '#424242',
            fontFamily: 'Inter, Arial, sans-serif',
            fontWeight: '600',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        
        // Keyboard shortcut hints
        const shortcuts = [
            'H - Toggle Hex Grid',
            'C - Colorblind Mode',
            'K - High Contrast'
        ];
        
        shortcuts.forEach((shortcut, index) => {
            this.add.text(width - 150, 120 + (index * 12), shortcut, {
                fontSize: '8px',
                fill: '#666666',
                fontFamily: 'Inter, Arial, sans-serif',
                align: 'center'
            }).setOrigin(0.5, 0.5);
        });
        
        // Setup keyboard event listeners
        this.input.keyboard.on('keydown-H', () => this.toggleHexGrid());
        this.input.keyboard.on('keydown-C', () => this.toggleColorblindMode());
        this.input.keyboard.on('keydown-K', () => this.toggleHighContrast());
    }

    toggleHexGrid() {
        this.visualSettings.enableHexGrid = !this.visualSettings.enableHexGrid;
        localStorage.setItem('enable-hex-grid', this.visualSettings.enableHexGrid);
        
        if (this.courseElements.hexGrid) {
            this.courseElements.hexGrid.setVisible(this.visualSettings.enableHexGrid);
        } else if (this.visualSettings.enableHexGrid) {
            this.createHexGridOverlay();
        }
    }

    toggleColorblindMode() {
        this.visualSettings.colorBlindMode = !this.visualSettings.colorBlindMode;
        localStorage.setItem('colorblind-mode', this.visualSettings.colorBlindMode);
        this.recreateCourseWithNewColors();
    }

    toggleHighContrast() {
        this.visualSettings.highContrast = !this.visualSettings.highContrast;
        localStorage.setItem('high-contrast', this.visualSettings.highContrast);
        this.recreateCourseWithNewColors();
    }

    recreateCourseWithNewColors() {
        // Clear existing visual elements
        Object.values(this.courseElements).forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            } else if (element && element.clear) {
                element.clear();
            }
        });
        
        // Recreate course with new color palette
        this.setupCourseVisuals();
    }
    
    createColonistInspiredCourse(hole) {
        const { width, height } = this.scale;
        
        // COLONIST.IO COLOR PALETTE - High contrast, flat colors
        const colors = {
            // Primary course areas
            fairway: 0x4CAF50,    // Material Green 500 - high contrast
            rough: 0xFF9800,      // Material Orange 500 - distinct from fairway
            green: 0x2E7D32,      // Material Green 800 - darker than fairway
            tee: 0x8BC34A,        // Material Light Green 500
            
            // Hazards - maximally distinct
            sand: 0xFFC107,       // Material Amber 500 - bright yellow
            water: 0x2196F3,      // Material Blue 500 - vivid blue
            
            // Accents and borders
            border: 0x424242,     // Material Grey 800 - strong borders
            flag: 0xF44336,       // Material Red 500 - high visibility
            
            // Background elements
            background: 0xF5F5DC, // Cream - neutral, accessible
            grid: 0xE0E0E0        // Light grey for subtle grid
        };
        
        // MAIN FAIRWAY - Central geometric shape with clear borders
        const fairwayShape = this.add.graphics();
        fairwayShape.fillStyle(colors.fairway);
        fairwayShape.lineStyle(4, colors.border);
        
        // Create distinct fairway shape based on hole layout
        if (hole?.description?.includes('dogleg right')) {
            // Dogleg right fairway
            fairwayShape.beginPath();
            fairwayShape.moveTo(width * 0.4, height * 0.8);
            fairwayShape.lineTo(width * 0.6, height * 0.8);
            fairwayShape.lineTo(width * 0.65, height * 0.5);
            fairwayShape.lineTo(width * 0.75, height * 0.3);
            fairwayShape.lineTo(width * 0.65, height * 0.25);
            fairwayShape.lineTo(width * 0.55, height * 0.45);
            fairwayShape.lineTo(width * 0.35, height * 0.75);
            fairwayShape.closePath();
        } else if (hole?.description?.includes('dogleg left')) {
            // Dogleg left fairway
            fairwayShape.beginPath();
            fairwayShape.moveTo(width * 0.4, height * 0.8);
            fairwayShape.lineTo(width * 0.6, height * 0.8);
            fairwayShape.lineTo(width * 0.65, height * 0.75);
            fairwayShape.lineTo(width * 0.45, height * 0.45);
            fairwayShape.lineTo(width * 0.25, height * 0.3);
            fairwayShape.lineTo(width * 0.35, height * 0.25);
            fairwayShape.lineTo(width * 0.55, height * 0.5);
            fairwayShape.closePath();
        } else {
            // Straight fairway
            fairwayShape.fillRoundedRect(
                width * 0.35, height * 0.25, 
                width * 0.3, height * 0.55, 
                20
            );
        }
        fairwayShape.fillPath();
        fairwayShape.strokePath();
        this.courseElements.fairway = fairwayShape;
        
        // ROUGH AREAS - Distinct hexagonal patterns
        this.createRoughAreas(colors, hole);
        
        // GREEN - Circular with colonist.io styling
        this.createColonistGreen(colors, hole);
        
        // TEE BOX - Modern geometric design
        this.createModernTeeBox(colors);
    }
    
    createRoughAreas(colors, hole) {
        const { width, height } = this.scale;
        
        // Left rough with hex-inspired border pattern
        const leftRough = this.add.graphics();
        leftRough.fillStyle(colors.rough);
        leftRough.lineStyle(3, colors.border);
        leftRough.fillRoundedRect(width * 0.05, height * 0.2, width * 0.25, height * 0.6, 15);
        leftRough.strokeRoundedRect(width * 0.05, height * 0.2, width * 0.25, height * 0.6, 15);
        
        // Add hex pattern overlay
        this.addHexPatternToArea(leftRough, width * 0.05, height * 0.2, width * 0.25, height * 0.6);
        
        // Right rough
        const rightRough = this.add.graphics();
        rightRough.fillStyle(colors.rough);
        rightRough.lineStyle(3, colors.border);
        rightRough.fillRoundedRect(width * 0.7, height * 0.2, width * 0.25, height * 0.6, 15);
        rightRough.strokeRoundedRect(width * 0.7, height * 0.2, width * 0.25, height * 0.6, 15);
        
        this.addHexPatternToArea(rightRough, width * 0.7, height * 0.2, width * 0.25, height * 0.6);
        
        this.courseElements.rough = [leftRough, rightRough];
    }
    
    createColonistGreen(colors, hole) {
        const { width, height } = this.scale;
        
        // Main green - larger, more distinct
        const green = this.add.graphics();
        green.fillStyle(colors.green);
        green.lineStyle(4, colors.border);
        
        if (hole?.number === 17) {
            // Island green - special case
            green.fillCircle(width * 0.5, height * 0.15, 45);
            green.strokeCircle(width * 0.5, height * 0.15, 45);
            
            // Water surrounding island green
            const water = this.add.graphics();
            water.fillStyle(colors.water);
            water.lineStyle(3, colors.border);
            water.fillCircle(width * 0.5, height * 0.15, 65);
            water.strokeCircle(width * 0.5, height * 0.15, 65);
            
            this.courseElements.water = water;
        } else {
            // Standard green with modern styling
            green.fillCircle(width * 0.5, height * 0.15, 50);
            green.strokeCircle(width * 0.5, height * 0.15, 50);
        }
        
        this.courseElements.green = green;
        
        // GIMME CIRCLE - High contrast inner circle
        const gimme = this.add.graphics();
        gimme.fillStyle(0xE8F5E8); // Very light green
        gimme.lineStyle(2, colors.border);
        gimme.fillCircle(width * 0.5, height * 0.15, 12);
        gimme.strokeCircle(width * 0.5, height * 0.15, 12);
        this.courseElements.gimme = gimme;
        
        // FLAGSTICK - Modern, high visibility
        const flagstick = this.add.rectangle(width * 0.5, height * 0.15 - 18, 3, 35, 0xFFFFFF);
        flagstick.setStrokeStyle(1, colors.border);
        
        const flag = this.add.graphics();
        flag.fillStyle(colors.flag);
        flag.lineStyle(1, colors.border);
        flag.fillRect(width * 0.5 + 3, height * 0.15 - 28, 18, 12);
        flag.strokeRect(width * 0.5 + 3, height * 0.15 - 28, 18, 12);
        
        this.courseElements.flag = [flagstick, flag];
    }
    
    createModernTeeBox(colors) {
        const { width, height } = this.scale;
        
        // Modern tee box with geometric design
        const teeBox = this.add.graphics();
        teeBox.fillStyle(colors.tee);
        teeBox.lineStyle(3, colors.border);
        teeBox.fillRoundedRect(
            width * 0.45, height * 0.85, 
            width * 0.1, height * 0.05, 
            10
        );
        teeBox.strokeRoundedRect(
            width * 0.45, height * 0.85, 
            width * 0.1, height * 0.05, 
            10
        );
        this.courseElements.teeBox = teeBox;
        
        // Modern tee markers - hexagonal
        const leftMarker = this.add.polygon(
            width * 0.47, height * 0.875, 
            this.createHexagonPoints(5), 
            0xFFD700
        );
        leftMarker.setStrokeStyle(2, colors.border);
        
        const rightMarker = this.add.polygon(
            width * 0.53, height * 0.875, 
            this.createHexagonPoints(5), 
            0xFFD700
        );
        rightMarker.setStrokeStyle(2, colors.border);
        
        this.courseElements.teeMarkers = [leftMarker, rightMarker];
    }
    
    createModernCourseElements(hole) {
        // Additional modern course elements
        this.createPathways();
        this.createCourseSignage(hole);
        this.createWindIndicators();
    }
    
    createElevationIndicators(hole) {
        const { width, height } = this.scale;
        
        // Create elevation contour lines for visual depth
        const contours = this.add.graphics();
        contours.lineStyle(1, 0x9E9E9E, 0.4);
        
        // Add subtle elevation lines
        const elevationLevels = [0.3, 0.5, 0.7];
        elevationLevels.forEach(level => {
            contours.strokeEllipse(
                width * 0.5, height * 0.15, 
                width * level, height * level * 0.6
            );
        });
        
        // Elevation markers with modern styling
        if (hole?.description?.includes('elevated')) {
            const elevationMarker = this.add.graphics();
            elevationMarker.fillStyle(0xFFFFFF);
            elevationMarker.lineStyle(2, 0x424242);
            
            // Triangle indicator for elevation
            elevationMarker.beginPath();
            elevationMarker.moveTo(width * 0.75, height * 0.2);
            elevationMarker.lineTo(width * 0.78, height * 0.15);
            elevationMarker.lineTo(width * 0.81, height * 0.2);
            elevationMarker.closePath();
            elevationMarker.fillPath();
            elevationMarker.strokePath();
            
            // Elevation text
            this.add.text(width * 0.82, height * 0.175, '+15ft', {
                fontSize: '10px',
                fill: '#424242',
                fontFamily: 'Inter',
                fontStyle: 'bold'
            });
            
            this.courseElements.elevationMarker = elevationMarker;
        }
        
        this.courseElements.contours = contours;
    }
    
    createPathways() {
        const { width, height } = this.scale;
        
        // Cart path with modern styling
        const cartPath = this.add.graphics();
        cartPath.lineStyle(6, 0xE0E0E0);
        cartPath.lineStyle(4, 0xFFFFFF); // Inner white line
        
        // Create curved path
        cartPath.beginPath();
        cartPath.moveTo(width * 0.05, height * 0.9);
        cartPath.quadraticCurveTo(
            width * 0.2, height * 0.6,
            width * 0.1, height * 0.3
        );
        cartPath.strokePath();
        
        this.courseElements.cartPath = cartPath;
    }
    
    createCourseSignage(hole) {
        const { width, height } = this.scale;
        
        // Modern hole information sign
        const signPost = this.add.graphics();
        signPost.fillStyle(0x8D6E63); // Brown post
        signPost.lineStyle(2, 0x424242);
        signPost.fillRoundedRect(width * 0.05, height * 0.75, 8, 40, 2);
        signPost.strokeRoundedRect(width * 0.05, height * 0.75, 8, 40, 2);
        
        const sign = this.add.graphics();
        sign.fillStyle(0xFFFFFF);
        sign.lineStyle(2, 0x424242);
        sign.fillRoundedRect(width * 0.02, height * 0.7, 60, 35, 4);
        sign.strokeRoundedRect(width * 0.02, height * 0.7, 60, 35, 4);
        
        // Hole information text
        this.add.text(width * 0.025, height * 0.71, `HOLE ${hole?.number || 1}`, {
            fontSize: '8px',
            fill: '#424242',
            fontFamily: 'Inter',
            fontStyle: 'bold'
        });
        
        this.add.text(width * 0.025, height * 0.72, `PAR ${hole?.par || 4}`, {
            fontSize: '7px',
            fill: '#666666',
            fontFamily: 'Inter'
        });
        
        this.add.text(width * 0.025, height * 0.73, `${hole?.yardage || 394} YDS`, {
            fontSize: '7px',
            fill: '#666666',
            fontFamily: 'Inter'
        });
        
        this.courseElements.signage = [signPost, sign];
    }
    
    createWindIndicators() {
        const { width, height } = this.scale;
        
        // Modern wind direction indicators
        const windSock = this.add.graphics();
        windSock.fillStyle(0xFFFFFF);
        windSock.lineStyle(2, 0x424242);
        
        // Wind sock pole
        windSock.fillRoundedRect(width * 0.9, height * 0.3, 3, 25, 1);
        windSock.strokeRoundedRect(width * 0.9, height * 0.3, 3, 25, 1);
        
        // Wind sock fabric (animated by wind)
        const fabric = this.add.graphics();
        fabric.fillStyle(0xFF5722, 0.8); // Orange fabric
        fabric.lineStyle(1, 0x424242);
        
        // Create tapered wind sock shape
        fabric.beginPath();
        fabric.moveTo(width * 0.9, height * 0.305);
        fabric.lineTo(width * 0.92, height * 0.31);
        fabric.lineTo(width * 0.94, height * 0.315);
        fabric.lineTo(width * 0.92, height * 0.32);
        fabric.closePath();
        fabric.fillPath();
        fabric.strokePath();
        
        // Animate wind sock based on conditions
        this.tweens.add({
            targets: fabric,
            rotation: Math.random() * 0.3 - 0.15,
            duration: 2000 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.courseElements.windIndicators = [windSock, fabric];
    }

    createDistanceMarkers() {
        const { width, height } = this.scale;
        const distances = [50, 100, 150, 200];
        const borderColor = 0x424242;
        
        distances.forEach((distance, index) => {
            const y = height * 0.8 - (index * height * 0.15);
            
            // Modern marker post
            const post = this.add.graphics();
            post.fillStyle(0xFFFFFF);
            post.lineStyle(2, borderColor);
            post.fillRoundedRect(width * 0.08, y - 10, 4, 25, 2);
            post.strokeRoundedRect(width * 0.08, y - 10, 4, 25, 2);
            
            // Modern distance plate
            const plate = this.add.graphics();
            plate.fillStyle(0xFFFFFF);
            plate.lineStyle(2, borderColor);
            plate.fillRoundedRect(width * 0.1, y - 8, 40, 16, 4);
            plate.strokeRoundedRect(width * 0.1, y - 8, 40, 16, 4);
            
            // Distance text with better visibility
            const displayDistance = this.engine.convertDistance(distance);
            const unit = this.engine.units === 'yards' ? 'y' : 'm';
            this.add.text(width * 0.12, y - 4, `${Math.round(displayDistance)}${unit}`, {
                fontSize: '11px',
                fill: '#424242',
                fontFamily: 'Inter',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);
        });
    }

    createSandTraps() {
        const { width, height } = this.scale;
        const hole = courseData?.holes?.[this.engine.currentHole - 1];
        
        if (this.holeHasSand(hole)) {
            const sandColor = 0xFFC107; // Bright amber - colonist.io style
            const borderColor = 0x424242;
            
            const bunkers = [];
            
            // Greenside bunker - geometric shape
            const greensideBunker = this.add.graphics();
            greensideBunker.fillStyle(sandColor);
            greensideBunker.lineStyle(3, borderColor);
            
            // Create irregular but geometric bunker shape
            greensideBunker.beginPath();
            greensideBunker.moveTo(width * 0.4, height * 0.25);
            greensideBunker.lineTo(width * 0.55, height * 0.22);
            greensideBunker.lineTo(width * 0.58, height * 0.28);
            greensideBunker.lineTo(width * 0.52, height * 0.32);
            greensideBunker.lineTo(width * 0.38, height * 0.3);
            greensideBunker.closePath();
            greensideBunker.fillPath();
            greensideBunker.strokePath();
            
            // Add sand texture pattern
            this.addSandTexture(greensideBunker, width * 0.4, height * 0.25, 0.18, 0.1);
            bunkers.push(greensideBunker);
            
            // Fairway bunker if hole warrants it
            if (hole?.difficulty <= 5) {
                const fairwayBunker = this.add.graphics();
                fairwayBunker.fillStyle(sandColor);
                fairwayBunker.lineStyle(3, borderColor);
                fairwayBunker.fillEllipse(width * 0.3, height * 0.5, 50, 30);
                fairwayBunker.strokeEllipse(width * 0.3, height * 0.5, 50, 30);
                
                this.addSandTexture(fairwayBunker, width * 0.3, height * 0.5, 0.06, 0.04);
                bunkers.push(fairwayBunker);
            }
            
            this.courseElements.sandTraps = bunkers;
        }
    }

    createWaterHazards() {
        const { width, height } = this.scale;
        const hole = courseData?.holes?.[this.engine.currentHole - 1];
        
        if (this.holeHasWater(hole)) {
            const waterColor = 0x2196F3; // Material Blue - high contrast
            const borderColor = 0x424242;
            
            let water;
            if (hole?.number === 17) {
                // Island Green handled in createColonistGreen
                return;
            } else {
                // Standard water hazard with modern styling
                water = this.add.graphics();
                water.fillStyle(waterColor);
                water.lineStyle(4, borderColor);
                
                if (hole?.description?.includes('water')) {
                    // Create geometric water hazard
                    water.fillRoundedRect(
                        width * 0.1, height * 0.35, 
                        width * 0.2, height * 0.1, 
                        15
                    );
                    water.strokeRoundedRect(
                        width * 0.1, height * 0.35, 
                        width * 0.2, height * 0.1, 
                        15
                    );
                } else {
                    water.fillEllipse(width * 0.2, height * 0.4, 120, 60);
                    water.strokeEllipse(width * 0.2, height * 0.4, 120, 60);
                }
                
                // Add water wave pattern
                this.addWaterPattern(water, width * 0.2, height * 0.4, 60, 30);
            }
            
            if (water) {
                this.courseElements.water = water;
            }
        }
    }

    createBall() {
        const { width, height } = this.scale;
        
        // Modern golf ball with enhanced visibility
        const ballShadow = this.add.graphics();
        ballShadow.fillStyle(0x000000, 0.3);
        ballShadow.fillCircle(width * 0.5 + 2, height * 0.875 + 2, 6);
        
        this.ballSprite = this.add.graphics();
        this.ballSprite.fillStyle(0xFFFFFF);
        this.ballSprite.lineStyle(2, 0x424242);
        this.ballSprite.fillCircle(width * 0.5, height * 0.875, 6);
        this.ballSprite.strokeCircle(width * 0.5, height * 0.875, 6);
        
        // Add ball dimple pattern for authentic look
        this.ballSprite.fillStyle(0xE0E0E0, 0.3);
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const x = width * 0.5 + Math.cos(angle) * 3;
            const y = height * 0.875 + Math.sin(angle) * 3;
            this.ballSprite.fillCircle(x, y, 0.5);
        }
        
        this.courseElements.ball = this.ballSprite;
        this.courseElements.ballShadow = ballShadow;
    }

    createDiceSprites() {
        const { width } = this.scale;
        
        // Modern dice with colonist.io styling
        const diceContainer = this.add.graphics();
        diceContainer.fillStyle(0xFFFFFF, 0.9);
        diceContainer.lineStyle(2, 0x424242);
        diceContainer.fillRoundedRect(width - 200, 20, 180, 120, 10);
        diceContainer.strokeRoundedRect(width - 200, 20, 180, 120, 10);
        
        // Distance die (modern geometric design)
        const distanceDie = this.add.graphics();
        distanceDie.fillStyle(0x4CAF50);
        distanceDie.lineStyle(3, 0x424242);
        distanceDie.fillRoundedRect(width - 180, 40, 35, 35, 8);
        distanceDie.strokeRoundedRect(width - 180, 40, 35, 35, 8);
        
        // Direction die (hexagonal for colonist.io feel)
        const directionDie = this.add.polygon(width - 100, 57, this.createHexagonPoints(18), 0x4CAF50);
        directionDie.setStrokeStyle(3, 0x424242);
        
        // Problem die (distinct red)
        const problemDie = this.add.graphics();
        problemDie.fillStyle(0xF44336);
        problemDie.lineStyle(3, 0x424242);
        problemDie.fillRoundedRect(width - 180, 90, 25, 25, 6);
        problemDie.strokeRoundedRect(width - 180, 90, 25, 25, 6);
        problemDie.setVisible(false); // Hidden until needed
        
        this.diceSprites = [distanceDie, directionDie, problemDie];
        
        // Modern dice labels with better typography
        this.add.text(width - 190, 25, 'DISTANCE', { 
            fontSize: '9px', 
            fill: '#424242', 
            fontFamily: 'Inter',
            fontStyle: 'bold'
        });
        this.add.text(width - 125, 25, 'DIRECTION', { 
            fontSize: '9px', 
            fill: '#424242', 
            fontFamily: 'Inter',
            fontStyle: 'bold'
        });
        this.add.text(width - 170, 80, 'HAZARD', { 
            fontSize: '8px', 
            fill: '#424242', 
            fontFamily: 'Inter',
            fontStyle: 'bold'
        });
        
        this.courseElements.diceContainer = diceContainer;
        
        // Add visual feedback for dice results
        this.createDiceResultDisplay();
    }
    
    createDiceResultDisplay() {
        const { width, height } = this.scale;
        
        // Result display area
        const resultArea = this.add.graphics();
        resultArea.fillStyle(0xFFFFFF, 0.95);
        resultArea.lineStyle(2, 0x424242);
        resultArea.fillRoundedRect(width - 200, 150, 180, 60, 8);
        resultArea.strokeRoundedRect(width - 200, 150, 180, 60, 8);
        
        // Result text labels
        this.add.text(width - 190, 155, 'LAST ROLL:', {
            fontSize: '9px',
            fill: '#424242',
            fontFamily: 'Inter',
            fontStyle: 'bold'
        });
        
        // Placeholder for dice results (will be updated dynamically)
        const distanceResult = this.add.text(width - 190, 170, 'Distance: -', {
            fontSize: '11px',
            fill: '#4CAF50',
            fontFamily: 'Inter',
            fontStyle: 'bold'
        });
        
        const directionResult = this.add.text(width - 190, 185, 'Direction: -', {
            fontSize: '11px',
            fill: '#4CAF50', 
            fontFamily: 'Inter',
            fontStyle: 'bold'
        });
        
        this.courseElements.diceResults = {
            container: resultArea,
            distance: distanceResult,
            direction: directionResult
        };
    }

    animateDiceRoll() {
        // Enhanced dice animation with modern effects
        this.diceSprites.forEach((die, index) => {
            if (die.visible) {
                // Main roll animation
                this.tweens.add({
                    targets: die,
                    rotation: Math.PI * 6,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    duration: 1000,
                    ease: 'Power2',
                    yoyo: true,
                    repeat: 1
                });
                
                // Glowing effect during roll
                if (this.visualSettings.enableAnimations) {
                    this.tweens.add({
                        targets: die,
                        alpha: 0.7,
                        duration: 200,
                        yoyo: true,
                        repeat: 4
                    });
                }
            }
        });
        
        // Add particle effects
        if (this.visualSettings.enableAnimations) {
            this.createDiceRollParticles();
        }
    }
    
    createDiceRollParticles() {
        const { width } = this.scale;
        
        // Simple particle effect around dice
        for (let i = 0; i < 6; i++) {
            const particle = this.add.circle(
                width - 125 + Math.random() * 100, 
                75 + Math.random() * 40, 
                2, 
                0xFFD700,
                0.8
            );
            
            this.tweens.add({
                targets: particle,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 800,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    updateDiceResults(diceResult) {
        if (this.courseElements.diceResults) {
            this.courseElements.diceResults.distance.setText(`Distance: ${diceResult.distance}`);
            
            const directionText = {
                1: 'Far Left', 2: 'Left', 3: 'Slight Left', 4: 'Slight Left',
                5: 'Straight', 6: 'Straight', 7: 'Straight', 8: 'Straight',
                9: 'Slight Right', 10: 'Slight Right', 11: 'Right', 12: 'Far Right'
            };
            
            this.courseElements.diceResults.direction.setText(
                `Direction: ${directionText[diceResult.direction] || 'Straight'}`
            );
        }
    }

    updateBallPosition(position, shotResult = null) {
        const { width, height } = this.scale;
        
        let ballX = width * (position.x / 100);
        let ballY = height * (0.9 - position.y / 100);
        
        // Create shot trajectory visualization for different shot types
        if (shotResult) {
            this.visualizeShotTrajectory(shotResult, ballX, ballY);
        }
        
        // Enhanced ball movement animation with trajectory-specific effects
        const duration = shotResult ? this.getShotDuration(shotResult.trajectory) : 1200;
        const ease = shotResult ? this.getShotEasing(shotResult.trajectory) : 'Power2';
        
        this.tweens.add({
            targets: this.courseElements.ball,
            x: ballX,
            y: ballY,
            duration: duration,
            ease: ease,
            onUpdate: () => {
                // Update shadow position
                if (this.courseElements.ballShadow) {
                    this.courseElements.ballShadow.x = this.courseElements.ball.x + 2;
                    this.courseElements.ballShadow.y = this.courseElements.ball.y + 2;
                }
            },
            onComplete: () => {
                // Add roll animation for chip/pitch shots
                if (shotResult && shotResult.rollDistance > 0) {
                    this.animateBallRoll(shotResult);
                }
            }
        });
        
        // Add trajectory-specific bounce effects
        if (shotResult) {
            this.addTrajectoryBounce(shotResult);
        }
    }

    visualizeShotTrajectory(shotResult, endX, endY) {
        // Clear previous trajectory
        if (this.courseElements.trajectory) {
            this.courseElements.trajectory.destroy();
        }
        
        const startX = this.courseElements.ball.x;
        const startY = this.courseElements.ball.y;
        
        const trajectory = this.add.graphics();
        trajectory.lineStyle(3, this.getTrajectoryColor(shotResult.trajectory), 0.7);
        
        // Draw different trajectory arcs based on shot type
        switch (shotResult.trajectory) {
            case 'low': // Chip shot
                this.drawChipTrajectory(trajectory, startX, startY, endX, endY, shotResult);
                break;
            case 'high': // Pitch shot
                this.drawPitchTrajectory(trajectory, startX, startY, endX, endY, shotResult);
                break;
            case 'roll': // Putt
                this.drawPuttTrajectory(trajectory, startX, startY, endX, endY, shotResult);
                break;
            default:
                trajectory.lineBetween(startX, startY, endX, endY);
        }
        
        trajectory.strokePath();
        this.courseElements.trajectory = trajectory;
        
        // Fade out trajectory after animation
        this.tweens.add({
            targets: trajectory,
            alpha: 0,
            duration: 3000,
            delay: 1000,
            onComplete: () => trajectory.destroy()
        });
    }

    drawChipTrajectory(graphics, startX, startY, endX, endY, shotResult) {
        // Low arc for chip shots with roll visualization
        const carryEndX = startX + (endX - startX) * (shotResult.carryDistance / shotResult.distance);
        const carryEndY = startY + (endY - startY) * (shotResult.carryDistance / shotResult.distance);
        
        // Carry arc (low trajectory)
        const arcHeight = Math.abs(endY - startY) * 0.15; // Low arc for chips
        graphics.beginPath();
        graphics.moveTo(startX, startY);
        graphics.quadraticCurveTo(
            (startX + carryEndX) / 2,
            Math.min(startY, carryEndY) - arcHeight,
            carryEndX,
            carryEndY
        );
        graphics.strokePath();
        
        // Roll visualization (dashed line)
        graphics.lineStyle(2, 0x4CAF50, 0.5);
        this.drawDashedLine(graphics, carryEndX, carryEndY, endX, endY);
    }

    drawPitchTrajectory(graphics, startX, startY, endX, endY, shotResult) {
        // High arc for pitch shots with soft landing
        const carryEndX = startX + (endX - startX) * (shotResult.carryDistance / shotResult.distance);
        const carryEndY = startY + (endY - startY) * (shotResult.carryDistance / shotResult.distance);
        
        // Carry arc (high trajectory)
        const arcHeight = Math.abs(endY - startY) * 0.4; // High arc for pitch
        graphics.beginPath();
        graphics.moveTo(startX, startY);
        graphics.quadraticCurveTo(
            (startX + carryEndX) / 2,
            Math.min(startY, carryEndY) - arcHeight,
            carryEndX,
            carryEndY
        );
        graphics.strokePath();
        
        // Minimal roll (dotted line)
        graphics.lineStyle(1, 0xFFD700, 0.4);
        this.drawDottedLine(graphics, carryEndX, carryEndY, endX, endY);
    }

    drawPuttTrajectory(graphics, startX, startY, endX, endY, shotResult) {
        // Straight line for putts with slope curvature
        if (shotResult.slopeEffect && shotResult.slopeEffect.severity > 0.2) {
            // Curved putt due to slope
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            const curveOffset = shotResult.slopeEffect.direction === 'right' ? 15 : -15;
            
            graphics.beginPath();
            graphics.moveTo(startX, startY);
            graphics.quadraticCurveTo(midX + curveOffset, midY, endX, endY);
            graphics.strokePath();
        } else {
            // Straight putt
            graphics.lineBetween(startX, startY, endX, endY);
        }
    }

    drawDashedLine(graphics, startX, startY, endX, endY) {
        const distance = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const dashLength = 8;
        const gapLength = 6;
        const totalLength = dashLength + gapLength;
        const steps = Math.floor(distance / totalLength);
        
        for (let i = 0; i < steps; i++) {
            const t1 = (i * totalLength) / distance;
            const t2 = ((i * totalLength) + dashLength) / distance;
            
            const x1 = startX + (endX - startX) * t1;
            const y1 = startY + (endY - startY) * t1;
            const x2 = startX + (endX - startX) * t2;
            const y2 = startY + (endY - startY) * t2;
            
            graphics.lineBetween(x1, y1, x2, y2);
        }
    }

    drawDottedLine(graphics, startX, startY, endX, endY) {
        const distance = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const dotSpacing = 4;
        const dots = Math.floor(distance / dotSpacing);
        
        for (let i = 0; i < dots; i++) {
            const t = (i * dotSpacing) / distance;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            graphics.fillCircle(x, y, 1);
        }
    }

    getTrajectoryColor(trajectory) {
        const colors = {
            'low': 0x4CAF50,  // Green for chip
            'high': 0xFFD700, // Gold for pitch
            'roll': 0x2196F3, // Blue for putt
            'failed': 0xF44336 // Red for failed shots
        };
        return colors[trajectory] || 0x9E9E9E;
    }

    getShotDuration(trajectory) {
        const durations = {
            'low': 1000,   // Quick chip
            'high': 1500,  // Slower pitch
            'roll': 2000,  // Slow putt
            'failed': 800  // Failed shot
        };
        return durations[trajectory] || 1200;
    }

    getShotEasing(trajectory) {
        const easings = {
            'low': 'Bounce.easeOut',    // Chip bounce
            'high': 'Power2.easeOut',   // Pitch arc
            'roll': 'Power1.easeOut',   // Smooth putt
            'failed': 'Power2.easeIn'   // Failed shot
        };
        return easings[trajectory] || 'Power2';
    }

    addTrajectoryBounce(shotResult) {
        switch (shotResult.trajectory) {
            case 'low': // Chip shot - multiple small bounces
                this.tweens.add({
                    targets: this.courseElements.ball,
                    scaleY: 0.8,
                    duration: 100,
                    yoyo: true,
                    repeat: 2,
                    ease: 'Power2'
                });
                break;
                
            case 'high': // Pitch shot - one big bounce then settle
                this.tweens.add({
                    targets: this.courseElements.ball,
                    scaleX: 1.3,
                    scaleY: 0.6,
                    duration: 200,
                    yoyo: true,
                    ease: 'Bounce.easeOut'
                });
                break;
                
            case 'roll': // Putt - no bounce, just smooth roll
                break;
                
            default:
                this.tweens.add({
                    targets: this.courseElements.ball,
                    scaleX: 1.1,
                    scaleY: 0.9,
                    duration: 150,
                    yoyo: true,
                    ease: 'Power2'
                });
        }
    }

    animateBallRoll(shotResult) {
        // Animate ball rolling after landing
        if (shotResult.rollDistance > 0) {
            const rollDuration = Math.min(shotResult.rollDistance * 50, 1000);
            
            this.tweens.add({
                targets: this.courseElements.ball,
                rotation: this.courseElements.ball.rotation + Math.PI * 4,
                duration: rollDuration,
                ease: 'Power2.easeOut'
            });
            
            // Add rolling sound effect placeholder
            this.createRollSoundEffect(rollDuration);
        }
    }

    createRollSoundEffect(duration) {
        // Placeholder for ball roll sound effect
        // Could be implemented with Web Audio API
        console.log(`🎵 Ball rolling for ${duration}ms`);
    }

    updateGameState(gameState) {
        // Update visual elements based on game state
        const currentPlayer = gameState.players[gameState.currentPlayer - 1];
        if (currentPlayer) {
            this.updateBallPosition(currentPlayer.position);
            this.updateLieIndicator(currentPlayer.lie);
        }
        
        // Update for hole changes
        if (gameState.currentHole !== this.lastHole) {
            this.lastHole = gameState.currentHole;
            this.recreateCourseForHole(gameState.currentHole);
        }
        
        // Update distance markers for unit changes
        if (gameState.units !== this.lastUnits) {
            this.lastUnits = gameState.units;
            this.createDistanceMarkers();
        }
    }
    
    updateLieIndicator(lie) {
        // Remove existing lie indicator
        if (this.courseElements.lieIndicator) {
            this.courseElements.lieIndicator.destroy();
        }
        
        // Create new lie indicator with colonist.io styling
        const ballPos = this.courseElements.ball;
        if (ballPos) {
            const indicator = this.add.graphics();
            
            // Color-coded lie indicators
            const lieColors = {
                'tee': 0x8BC34A,
                'fairway': 0x4CAF50, 
                'rough': 0xFF9800,
                'sand': 0xFFC107,
                'water': 0x2196F3,
                'green': 0x2E7D32
            };
            
            const color = lieColors[lie] || 0x9E9E9E;
            indicator.lineStyle(3, color);
            indicator.strokeCircle(ballPos.x, ballPos.y, 12);
            
            this.courseElements.lieIndicator = indicator;
        }
    }
    
    recreateCourseForHole(holeNumber) {
        // Clear existing course elements
        Object.values(this.courseElements).forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        
        // Recreate course for new hole
        this.setupCourseVisuals();
        this.createBall();
    }

    setupInputHandlers() {
        // Enhanced input handling with visual feedback
        this.input.on('pointerdown', (pointer) => {
            console.log('Course clicked at:', pointer.x, pointer.y);
            
            // Add click effect
            const clickEffect = this.add.graphics();
            clickEffect.lineStyle(2, 0x4CAF50);
            clickEffect.strokeCircle(pointer.x, pointer.y, 5);
            
            this.tweens.add({
                targets: clickEffect,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => clickEffect.destroy()
            });
        });
        
        // Hover effects for interactive elements
        this.input.on('pointermove', (pointer) => {
            // Add subtle hover effects for course elements
            this.updateHoverEffects(pointer);
        });

        // Setup DOM interaction handlers
        setTimeout(() => {
            this.setupDOMInteractions();
        }, 100);
    }
    
    updateHoverEffects(pointer) {
        // Implement hover effects for better interactivity
        const tolerance = 20;
        
        // Check if hovering over green
        if (this.courseElements.green && 
            Phaser.Geom.Circle.Contains(
                new Phaser.Geom.Circle(this.scale.width * 0.5, this.scale.height * 0.15, 50),
                pointer.x, pointer.y
            )) {
            this.scene.systems.displayList.bringToTop(this.courseElements.green);
        }
    }

    // Colonist.io-inspired helper methods
    createHexagonPoints(radius) {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            points.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
        }
        return points;
    }
    
    createHexGridOverlay() {
        const { width, height } = this.scale;
        const gridColor = 0xE0E0E0;
        const hexSize = 25;
        
        // Subtle hex grid overlay for colonist.io feel
        const grid = this.add.graphics();
        grid.lineStyle(1, gridColor, 0.3);
        
        for (let x = 0; x < width; x += hexSize * 1.5) {
            for (let y = 0; y < height; y += hexSize * Math.sqrt(3)) {
                const offsetX = (y / (hexSize * Math.sqrt(3))) % 2 === 0 ? 0 : hexSize * 0.75;
                this.drawHexagon(grid, x + offsetX, y, hexSize * 0.4);
            }
        }
        
        grid.setAlpha(0.15); // Very subtle
        this.courseElements.hexGrid = grid;
    }
    
    drawHexagon(graphics, x, y, radius) {
        const points = this.createHexagonPoints(radius);
        graphics.beginPath();
        graphics.moveTo(x + points[0][0], y + points[0][1]);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(x + points[i][0], y + points[i][1]);
        }
        graphics.closePath();
        graphics.strokePath();
    }
    
    addHexPatternToArea(graphics, x, y, width, height) {
        // Add subtle hex pattern within course areas
        const patternColor = 0x000000;
        const hexSize = 8;
        
        for (let px = x; px < x + width; px += hexSize * 1.2) {
            for (let py = y; py < y + height; py += hexSize) {
                const offsetX = (py / hexSize) % 2 === 0 ? 0 : hexSize * 0.6;
                if (px + offsetX < x + width && py < y + height) {
                    graphics.lineStyle(1, patternColor, 0.1);
                    this.drawHexagon(graphics, px + offsetX, py, hexSize * 0.3);
                }
            }
        }
    }
    
    addSandTexture(graphics, x, y, width, height) {
        // Add sand stipple pattern
        const stippleColor = 0xFF8F00; // Darker orange for texture
        graphics.fillStyle(stippleColor, 0.3);
        
        const { width: scaleWidth } = this.scale;
        const actualWidth = scaleWidth * width;
        const actualHeight = scaleWidth * height;
        
        // Create random stipple pattern
        for (let i = 0; i < 20; i++) {
            const px = x + (Math.random() * actualWidth);
            const py = y + (Math.random() * actualHeight);
            graphics.fillCircle(px, py, Math.random() * 2 + 1);
        }
    }
    
    addWaterPattern(graphics, x, y, width, height) {
        // Add subtle wave pattern
        const waveColor = 0x1976D2; // Darker blue for waves
        graphics.lineStyle(2, waveColor, 0.4);
        
        const { width: scaleWidth } = this.scale;
        const actualWidth = scaleWidth * (width / scaleWidth);
        
        // Create wave lines
        for (let i = 0; i < 3; i++) {
            const waveY = y + (i * 8);
            graphics.beginPath();
            for (let wx = x - actualWidth; wx <= x + actualWidth; wx += 10) {
                const waveHeight = Math.sin((wx * 0.1) + (i * 2)) * 3;
                if (wx === x - actualWidth) {
                    graphics.moveTo(wx, waveY + waveHeight);
                } else {
                    graphics.lineTo(wx, waveY + waveHeight);
                }
            }
            graphics.strokePath();
        }
    }
    
    setupDOMInteractions() {
        // Club selection functionality
        const clubOptions = document.querySelectorAll('.club-option');
        clubOptions.forEach(club => {
            club.addEventListener('click', (e) => {
                // Remove selection from all clubs
                clubOptions.forEach(c => c.classList.remove('selected'));
                // Add selection to clicked club
                e.target.classList.add('selected');
                console.log('Selected club:', e.target.dataset.club);
                
                // Visual feedback
                e.target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.target.style.transform = 'scale(1)';
                }, 150);
            });
        });

        // Shot button handler
        const shotButton = document.getElementById('takeShot3D');
        if (shotButton) {
            shotButton.addEventListener('click', () => {
                this.engine.takeShot();
            });
        }

        // Add visual toggle functionality for accessibility controls
        this.setupVisualToggles();
    }

    setupVisualToggles() {
        // Create and show toggle switches for visual settings
        const settingsContainer = document.querySelector('.enhanced-panel');
        if (settingsContainer) {
            const togglesHTML = `
                <div class="visual-toggles" style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                    <h4 style="margin: 0 0 1rem 0;">Visual Settings</h4>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <input type="checkbox" id="hexGridToggle" ${this.visualSettings.enableHexGrid ? 'checked' : ''}> 
                        <span style="margin-left: 0.5rem;">Hex Grid Overlay (H)</span>
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <input type="checkbox" id="colorblindToggle" ${this.visualSettings.colorBlindMode ? 'checked' : ''}> 
                        <span style="margin-left: 0.5rem;">Colorblind Mode (C)</span>
                    </label>
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="highContrastToggle" ${this.visualSettings.highContrast ? 'checked' : ''}> 
                        <span style="margin-left: 0.5rem;">High Contrast (K)</span>
                    </label>
                </div>
            `;
            
            settingsContainer.insertAdjacentHTML('beforeend', togglesHTML);
            
            // Wire up toggle functionality
            document.getElementById('hexGridToggle')?.addEventListener('change', (e) => {
                this.visualSettings.enableHexGrid = e.target.checked;
                localStorage.setItem('enable-hex-grid', e.target.checked);
                this.toggleHexGrid();
            });
            
            document.getElementById('colorblindToggle')?.addEventListener('change', (e) => {
                this.visualSettings.colorBlindMode = e.target.checked;
                localStorage.setItem('colorblind-mode', e.target.checked);
                this.recreateCourseWithNewColors();
            });
            
            document.getElementById('highContrastToggle')?.addEventListener('change', (e) => {
                this.visualSettings.highContrast = e.target.checked;
                localStorage.setItem('high-contrast', e.target.checked);
                this.recreateCourseWithNewColors();
            });
        }
    }

    getChipLieModifiers(lie) {
        // Authentic board game lie modifiers for chip shots
        const modifiers = {
            'tee': { carryModifier: 1.0, rollModifier: 1.2 },      // Perfect contact, extra roll
            'fairway': { carryModifier: 1.0, rollModifier: 1.0 },  // Standard conditions
            'rough': { carryModifier: 0.8, rollModifier: 0.6 },    // Reduced carry and roll
            'sand': { carryModifier: 0.6, rollModifier: 0.3 },     // Poor contact from sand
            'green': { carryModifier: 1.0, rollModifier: 0.8 }     // Putting surface
        };
        return modifiers[lie] || modifiers['fairway'];
    }

    getPitchLieModifiers(lie) {
        // Authentic board game lie modifiers for pitch shots
        const modifiers = {
            'tee': { carryModifier: 1.0, rollModifier: 0.8 },      // Clean, high trajectory
            'fairway': { carryModifier: 1.0, rollModifier: 1.0 },  // Standard conditions
            'rough': { carryModifier: 0.85, rollModifier: 1.2 },   // Flyer lie, more roll
            'sand': { carryModifier: 0.7, rollModifier: 0.5 },     // Sand trap escape
            'green': { carryModifier: 1.0, rollModifier: 0.5 }     // Delicate pitch
        };
        return modifiers[lie] || modifiers['fairway'];
    }

    getSandTrapModifier(problemRoll) {
        // Authentic problem dice effects for sand trap shots
        const modifiers = {
            1: { success: false, penalty: 'stay' },        // Ball stays in bunker
            2: { success: false, penalty: 'short' },       // Ball barely gets out, 5-10 yards
            3: { success: true, distance: 0.5 },           // Poor escape, half distance
            4: { success: true, distance: 0.7 },           // Decent escape, 70% distance
            5: { success: true, distance: 0.8 },           // Good escape, 80% distance
            6: { success: true, distance: 1.0 }            // Perfect escape, full distance
        };
        return modifiers[problemRoll] || modifiers[3];
    }

    getDirectionDeviationDegrees(directionRoll) {
        // Convert 12-sided direction die to degrees deviation
        const deviationMap = {
            1: -30, 2: -25, 3: -15, 4: -8,      // Left deviations
            5: -3, 6: -1, 7: 1, 8: 3,           // Slight deviations
            9: 8, 10: 15, 11: 25, 12: 30       // Right deviations
        };
        return deviationMap[directionRoll] || 0;
    }

    getDirectionFromDice(directionRoll) {
        // Convert direction roll to text description
        if (directionRoll <= 4) return 'left';
        if (directionRoll >= 9) return 'right';
        return 'straight';
    }

    calculateEndPosition(startPosition, distance, directionDeviation = 0) {
        // Calculate final ball position based on distance and direction
        const baseAngle = 0; // Straight toward pin
        const finalAngle = baseAngle + directionDeviation;
        
        // Convert to radians and calculate new position
        const angleRad = finalAngle * Math.PI / 180;
        const distancePercent = distance / 400; // Scale distance to course percentage
        
        const newX = startPosition.x + (Math.sin(angleRad) * distancePercent * 100);
        const newY = Math.min(100, startPosition.y + (Math.cos(angleRad) * distancePercent * 100));
        
        return {
            x: Math.max(0, Math.min(100, newX)),
            y: Math.max(0, newY)
        };
    }

    calculatePuttEndPosition(startPosition, distance) {
        // Putting is generally straight toward pin
        const distancePercent = distance / 30; // Putting distance scale
        const newY = Math.min(100, startPosition.y + (distancePercent * 100));
        
        return {
            x: startPosition.x + (Math.random() * 2 - 1), // Slight lateral movement
            y: Math.max(95, newY) // Stay on green area
        };
    }

    determineLieFromPosition(position) {
        // Determine lie based on ball position on course
        if (position.y >= 98) return 'holed';
        if (position.y >= 95) return 'green';
        if (position.y < 10) return 'tee';
        
        // Check if ball is in fairway or rough based on X position
        if (position.x >= 30 && position.x <= 70) {
            return 'fairway';
        } else {
            return 'rough';
        }
    }

    determineFinalLie(position, totalDistance) {
        // More sophisticated lie determination including hazards
        const basicLie = this.determineLieFromPosition(position);
        
        // Check for hazards based on course layout
        if (this.isInSandTrap(position)) return 'sand';
        if (this.isInWaterHazard(position)) return 'water';
        if (this.isInTrees(position)) return 'trees';
        
        return basicLie;
    }

    isInSandTrap(position) {
        // Simple sand trap detection - would be more sophisticated in full implementation
        return (position.x >= 35 && position.x <= 45 && position.y >= 20 && position.y <= 30) ||
               (position.x >= 60 && position.x <= 70 && position.y >= 50 && position.y <= 60);
    }

    isInWaterHazard(position) {
        // Simple water hazard detection
        return (position.x >= 15 && position.x <= 35 && position.y >= 35 && position.y <= 45);
    }

    isInTrees(position) {
        // Tree line detection
        return position.x <= 15 || position.x >= 85;
    }

    // Helper methods
    holeHasSand(hole) {
        return [2, 4, 7, 8, 11, 16, 17, 18].includes(hole?.number);
    }

    holeHasWater(hole) {
        return [8, 11, 13, 14, 16, 17, 18].includes(hole?.number);
    }
}

// Note: AuthenticDiceSystem is imported from authentic-mechanics.js

// Enhanced Shot Analysis and Explanation System
class ShotAnalysisSystem {
    constructor() {
        this.windConditions = this.generateWindConditions();
        this.courseConditions = this.generateCourseConditions();
    }

    analyze(lie, distance, shotType, club, units) {
        const basicAnalysis = {
            lieDescription: this.getLieDescription(lie),
            distance: `${Math.round(distance)} ${units}`,
            shotType: shotType.toUpperCase(),
            club: club.toUpperCase(),
            modifiers: this.getModifiers(lie),
            recommendation: this.getRecommendation(distance, lie, shotType)
        };

        // Add comprehensive analysis
        const detailedAnalysis = this.getDetailedAnalysis(lie, distance, shotType, club);
        const shotStrategy = this.generateShotStrategy(lie, distance, shotType, club);
        const riskAssessment = this.assessShotRisk(lie, distance, shotType);

        return {
            ...basicAnalysis,
            detailedAnalysis,
            shotStrategy,
            riskAssessment,
            windEffect: this.calculateWindEffect(distance, shotType),
            expectedOutcome: this.predictShotOutcome(lie, distance, shotType, club)
        };
    }

    getLieDescription(lie) {
        const descriptions = {
            'tee': {
                title: 'Tee Box',
                description: 'Perfect lie with optimal ball position',
                advantage: 'Maximum distance and accuracy potential',
                difficulty: 'Easy'
            },
            'fairway': {
                title: 'Fairway',
                description: 'Clean lie on short grass',
                advantage: 'Good contact and ball control',
                difficulty: 'Easy'
            },
            'rough': {
                title: 'Primary Rough',
                description: 'Longer grass affects club contact',
                advantage: 'Still manageable with proper club selection',
                difficulty: 'Moderate'
            },
            'sand': {
                title: 'Sand Bunker',
                description: 'Ball sitting in sand trap',
                advantage: 'Clean sand allows for predictable escape',
                difficulty: 'Hard'
            },
            'trees': {
                title: 'Trees/Obstacles',
                description: 'Limited swing and shot options',
                advantage: 'Requires creative shot-making',
                difficulty: 'Very Hard'
            },
            'water': {
                title: 'Water Hazard',
                description: 'Penalty situation requiring drop',
                advantage: 'Fresh start from drop area',
                difficulty: 'Penalty'
            },
            'green': {
                title: 'Putting Green',
                description: 'Smooth putting surface',
                advantage: 'Putting only, predictable roll',
                difficulty: 'Easy'
            }
        };
        return descriptions[lie] || { title: lie, description: 'Unknown lie condition', difficulty: 'Unknown' };
    }

    getModifiers(lie) {
        const modifiers = {
            'rough': {
                distance: '⬇️ -20% carry distance',
                accuracy: '⚠️ -15% accuracy',
                spin: '🔄 Reduced backspin',
                explanation: 'Grass between club and ball reduces clean contact'
            },
            'sand': {
                distance: '⬇️ -40% distance (problem dice applies)',
                accuracy: '⚠️ -30% accuracy',
                clubLimit: '🏌️ Wedge required for escape',
                explanation: 'Sand interferes with club contact, explosion shot needed'
            },
            'trees': {
                distance: '⬇️ -50% distance potential',
                accuracy: '⚠️ -40% accuracy',
                clubLimit: '🏌️ Limited to wedge, 9-iron, 7-iron',
                explanation: 'Obstacles limit swing and require punch shots'
            },
            'water': {
                penalty: '🔴 +1 penalty stroke',
                drop: '📍 Must drop at designated area',
                explanation: 'Water hazard requires penalty and drop procedure'
            }
        };
        return modifiers[lie] || {};
    }

    getDetailedAnalysis(lie, distance, shotType, club) {
        const clubData = this.getClubCharacteristics(club);
        const shotTypeData = this.getShotTypeCharacteristics(shotType);
        
        return {
            clubCharacteristics: clubData,
            shotTypeDetails: shotTypeData,
            lieImpact: this.analyzeLieImpact(lie, club, shotType),
            probabilityAnalysis: this.calculateShotProbabilities(lie, distance, shotType, club)
        };
    }

    getClubCharacteristics(club) {
        const clubs = {
            'driver': {
                loft: '10.5°',
                typical_distance: '250 yards',
                trajectory: 'Low-Medium',
                spin: 'Low backspin',
                best_for: 'Maximum distance from tee'
            },
            '3wood': {
                loft: '15°',
                typical_distance: '230 yards', 
                trajectory: 'Medium',
                spin: 'Medium backspin',
                best_for: 'Long shots from fairway'
            },
            '5wood': {
                loft: '18°',
                typical_distance: '210 yards',
                trajectory: 'Medium-High',
                spin: 'Medium backspin',
                best_for: 'Easier long shots, rough lies'
            },
            '3iron': {
                loft: '21°',
                typical_distance: '190 yards',
                trajectory: 'Low-Medium',
                spin: 'Medium backspin',
                best_for: 'Windy conditions, low trajectory'
            },
            '5iron': {
                loft: '27°',
                typical_distance: '170 yards',
                trajectory: 'Medium',
                spin: 'Medium backspin',
                best_for: 'Mid-range accuracy shots'
            },
            '7iron': {
                loft: '34°',
                typical_distance: '150 yards',
                trajectory: 'Medium-High',
                spin: 'High backspin',
                best_for: 'Approach shots to green'
            },
            '9iron': {
                loft: '42°',
                typical_distance: '130 yards',
                trajectory: 'High',
                spin: 'High backspin',
                best_for: 'Short approaches, chip shots'
            },
            'wedge': {
                loft: '56°',
                typical_distance: '100 yards',
                trajectory: 'Very High',
                spin: 'Maximum backspin',
                best_for: 'Greenside shots, sand escapes'
            },
            'putter': {
                loft: '4°',
                typical_distance: '30 feet',
                trajectory: 'Ground level',
                spin: 'Overspin/topspin',
                best_for: 'Rolling ball on green'
            }
        };
        return clubs[club] || clubs['7iron'];
    }

    getShotTypeCharacteristics(shotType) {
        const shots = {
            'full_shot': {
                description: 'Full swing with maximum power',
                trajectory: 'Optimal for club',
                accuracy: 'Standard for club and lie',
                roll: 'Normal roll after landing'
            },
            'chip': {
                description: 'Low trajectory shot that runs to pin',
                trajectory: 'Low, ball runs after landing',
                accuracy: 'High due to shorter swing',
                roll: '60-70% of total distance is roll'
            },
            'pitch': {
                description: 'High trajectory shot that lands softly',
                trajectory: 'High, ball stops quickly',
                accuracy: 'Moderate due to higher flight',
                roll: '10-20% of total distance is roll'
            },
            'putt': {
                description: 'Rolling shot along ground to hole',
                trajectory: 'Ground level only',
                accuracy: 'Depends on green reading',
                roll: '100% roll, no carry'
            },
            'gimme': {
                description: 'Automatic hole-out within 4 feet',
                trajectory: 'N/A - automatic',
                accuracy: '100% - guaranteed make',
                roll: 'N/A - ball is holed'
            }
        };
        return shots[shotType] || shots['full_shot'];
    }

    generateShotStrategy(lie, distance, shotType, club) {
        const strategies = [];
        
        // Distance management
        if (distance > 200) {
            strategies.push('🎯 Focus on accuracy over maximum distance');
        } else if (distance < 50) {
            strategies.push('🎯 Emphasize distance control and soft landing');
        }

        // Lie-specific strategy
        switch (lie) {
            case 'rough':
                strategies.push('💪 Take one club more due to lie penalty');
                strategies.push('🎯 Aim for center of green, not pin');
                break;
            case 'sand':
                strategies.push('⛳ Open clubface and aim 2 inches behind ball');
                strategies.push('🏃 Accelerate through impact, don\'t decelerate');
                break;
            case 'trees':
                strategies.push('🌳 Play safe punch shot to clear obstacles');
                strategies.push('📐 Keep ball flight low to avoid branches');
                break;
            default:
                strategies.push('🎯 Standard shot execution appropriate for distance');
        }

        // Shot type strategy
        if (shotType === 'chip') {
            strategies.push('⚡ Use putting stroke motion with chosen iron');
            strategies.push('📍 Land ball 1/3 of way to pin, let it roll 2/3');
        } else if (shotType === 'pitch') {
            strategies.push('🏌️ Use confident, accelerating swing');
            strategies.push('🎯 Land ball close to pin location');
        }

        return strategies;
    }

    assessShotRisk(lie, distance, shotType) {
        let riskLevel = 'LOW';
        const riskFactors = [];

        // Lie-based risk
        if (lie === 'sand' || lie === 'trees') {
            riskLevel = 'HIGH';
            riskFactors.push(`${lie.toUpperCase()} lie increases difficulty significantly`);
        } else if (lie === 'rough') {
            riskLevel = 'MEDIUM';
            riskFactors.push('Rough lie may cause unexpected ball flight');
        }

        // Distance-based risk
        if (distance > 250 || distance < 10) {
            riskFactors.push('Extreme distance requires precise execution');
            if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
        }

        // Shot type risk
        if (shotType === 'pitch') {
            riskFactors.push('High trajectory shots affected by wind');
            if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
        }

        return {
            level: riskLevel,
            factors: riskFactors,
            mitigation: this.getRiskMitigation(riskLevel, riskFactors)
        };
    }

    getRiskMitigation(riskLevel, factors) {
        const mitigation = [];
        
        if (riskLevel === 'HIGH') {
            mitigation.push('🎯 Play conservatively, aim for safe areas');
            mitigation.push('🏌️ Take practice swings to feel the shot');
        } else if (riskLevel === 'MEDIUM') {
            mitigation.push('⚖️ Balance risk vs reward carefully');
            mitigation.push('🎯 Have a backup plan if shot goes wrong');
        } else {
            mitigation.push('✅ Standard execution should yield good results');
        }
        
        return mitigation;
    }

    calculateWindEffect(distance, shotType) {
        const windSpeed = this.windConditions.speed;
        const windDirection = this.windConditions.direction;
        
        let effect = 'Minimal';
        if (shotType === 'pitch' && windSpeed > 10) {
            effect = 'Significant - high shots affected by wind';
        } else if (distance > 150 && windSpeed > 15) {
            effect = 'Moderate - longer shots drift with wind';
        }
        
        return {
            speed: `${windSpeed} mph`,
            direction: windDirection,
            effect: effect
        };
    }

    predictShotOutcome(lie, distance, shotType, club) {
        // Calculate success probabilities based on 1987 board game mechanics
        const baseAccuracy = this.getBaseAccuracy(club, shotType);
        const lieModifier = this.getLieAccuracyModifier(lie);
        const distanceModifier = this.getDistanceAccuracyModifier(distance, shotType);
        
        const finalAccuracy = Math.max(0.1, Math.min(0.95, baseAccuracy * lieModifier * distanceModifier));
        
        return {
            successProbability: `${Math.round(finalAccuracy * 100)}%`,
            expectedDistance: this.calculateExpectedDistance(distance, lie, shotType, club),
            possibleOutcomes: this.generatePossibleOutcomes(finalAccuracy, shotType)
        };
    }

    getBaseAccuracy(club, shotType) {
        const accuracies = {
            'putter': 0.9, 'wedge': 0.85, '9iron': 0.8, '7iron': 0.75,
            '5iron': 0.7, '3iron': 0.65, '5wood': 0.6, '3wood': 0.55, 'driver': 0.5
        };
        const shotTypeBonus = {
            'chip': 0.1, 'pitch': 0.05, 'putt': 0.15, 'gimme': 0.0, 'full_shot': 0.0
        };
        return (accuracies[club] || 0.7) + (shotTypeBonus[shotType] || 0.0);
    }

    getLieAccuracyModifier(lie) {
        const modifiers = {
            'tee': 1.1, 'fairway': 1.0, 'green': 1.05,
            'rough': 0.8, 'sand': 0.6, 'trees': 0.5, 'water': 0.0
        };
        return modifiers[lie] || 1.0;
    }

    getDistanceAccuracyModifier(distance, shotType) {
        if (shotType === 'putt') {
            return distance < 10 ? 1.0 : Math.max(0.6, 1.0 - (distance - 10) * 0.02);
        }
        return distance < 100 ? 1.0 : Math.max(0.7, 1.0 - (distance - 100) * 0.001);
    }

    calculateExpectedDistance(baseDistance, lie, shotType, club) {
        const lieModifiers = {
            'tee': 1.0, 'fairway': 1.0, 'green': 1.0,
            'rough': 0.85, 'sand': 0.65, 'trees': 0.7, 'water': 0.0
        };
        
        const modifier = lieModifiers[lie] || 1.0;
        const expectedDistance = Math.round(baseDistance * modifier);
        
        return `${expectedDistance-10}-${expectedDistance+10} yards`;
    }

    generatePossibleOutcomes(accuracy, shotType) {
        const outcomes = [];
        
        if (accuracy > 0.8) {
            outcomes.push('🎯 Excellent shot, likely close to target');
        }
        if (accuracy > 0.6) {
            outcomes.push('✅ Good shot, reasonable result expected');
        } else {
            outcomes.push('⚠️ Challenging shot, manage expectations');
        }
        
        if (shotType === 'chip' || shotType === 'pitch') {
            outcomes.push('🏌️ Greenside shot - opportunity to get close to pin');
        }
        
        return outcomes;
    }

    generateWindConditions() {
        return {
            speed: Math.floor(Math.random() * 20) + 5, // 5-25 mph
            direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]
        };
    }

    generateCourseConditions() {
        return {
            firmness: ['Soft', 'Medium', 'Firm'][Math.floor(Math.random() * 3)],
            greenSpeed: Math.floor(Math.random() * 3) + 8 // 8-10 stimpmeter
        };
    }

    getRecommendation(distance, lie, shotType) {
        if (shotType === 'chip') {
            return '💡 Low running shot - land 1/3 distance to pin, roll 2/3';
        }
        if (shotType === 'pitch') {
            return '💡 High soft shot - land near pin with minimal roll';
        }
        if (shotType === 'putt') {
            return '💡 Read green slope, aim for firm stroke past hole';
        }
        if (shotType === 'gimme') {
            return '✅ Automatic make - ball is within gimme range';
        }
        
        // Full shots
        if (lie === 'sand') {
            return '🏌️ Explosion shot - hit sand 2" behind ball, accelerate through';
        }
        if (lie === 'rough') {
            return '💪 Take one club more, expect reduced distance and accuracy';
        }
        if (distance > 200) {
            return '🎯 Focus on smooth tempo and solid contact over power';
        }
        
        return '⚡ Standard shot execution appropriate for distance and conditions';
    }
}

// Placeholder shot calculator (to be enhanced by Agent 3)
class BoardGameShotCalculator {
    calculate(club, diceResult, lie) {
        // Basic calculation - will be enhanced by other agents
        const baseDistance = this.getClubDistance(club);
        const modifier = this.getLieModifier(lie);
        
        return {
            distance: baseDistance * modifier * (diceResult.distance / 3.5),
            direction: this.getDirectionFromDice(diceResult.direction),
            position: { x: 50, y: 50 }, // Placeholder
            lie: 'fairway'
        };
    }

    getClubDistance(club) {
        const distances = {
            'driver': 250, '3wood': 220, '5wood': 190,
            '3iron': 170, '5iron': 150, '7iron': 130,
            '9iron': 110, 'wedge': 70, 'putter': 30
        };
        return distances[club] || 100;
    }

    getLieModifier(lie) {
        const modifiers = {
            'tee': 1.0, 'fairway': 1.0, 'rough': 0.8,
            'sand': 0.6, 'trees': 0.7, 'water': 0.0, 'green': 1.0
        };
        return modifiers[lie] || 1.0;
    }

    getDirectionFromDice(roll) {
        if (roll <= 4) return 'left';
        if (roll <= 8) return 'straight';
        return 'right';
    }
}

// Course data needs to be available globally
if (typeof courseData === 'undefined') {
    // Fallback course data if not loaded from script.js
    window.courseData = {
        name: "TPC Sawgrass - THE PLAYERS Stadium Course",
        totalPar: 72,
        totalYardage: 6394,
        holes: [
            { number: 1, par: 4, yardage: 394, handicap: 11, difficulty: 13, description: "Slight dogleg right demanding accuracy from the tee" },
            { number: 2, par: 5, yardage: 532, handicap: 15, difficulty: 16, description: "Long par 5 with bunkers guarding the green" },
            { number: 17, par: 3, yardage: 137, handicap: 17, difficulty: 17, description: "Famous island green par 3" }
        ]
    };
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('courseVisualization')) {
        window.phaserEngine = new PhaserBoardGameEngine();
        console.log('🎲 Phaser.js Engine loaded successfully with colonist.io-inspired visuals');
        console.log('🎨 Enhanced course visualization with:', {
            hexGridOverlay: window.phaserEngine.currentScene?.visualSettings?.enableHexGrid,
            colorBlindSupport: window.phaserEngine.currentScene?.visualSettings?.colorBlindMode,
            highContrast: window.phaserEngine.currentScene?.visualSettings?.highContrast
        });
    }
});

// Module exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PhaserBoardGameEngine,
        GolfCourseScene,
        AuthenticDiceSystem,
        ShotAnalysisSystem,
        BoardGameShotCalculator
    };
} else {
    window.PhaserBoardGameEngine = PhaserBoardGameEngine;
    window.GolfCourseScene = GolfCourseScene;
    window.AuthenticDiceSystem = AuthenticDiceSystem;
    window.ShotAnalysisSystem = ShotAnalysisSystem;
    window.BoardGameShotCalculator = BoardGameShotCalculator;
}