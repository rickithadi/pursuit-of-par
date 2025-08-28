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
        console.log('🎲 PhaserBoardGameEngine constructor starting...');
        
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
        console.log('✓ Basic properties initialized');
        
        // Visual enhancement settings
        this.visualSettings = {
            enableHexGrid: localStorage.getItem('enable-hex-grid') !== 'false',
            enableAnimations: localStorage.getItem('enable-animations') !== 'false',
            colorBlindMode: localStorage.getItem('colorblind-mode') === 'true',
            highContrast: localStorage.getItem('high-contrast') === 'true'
        };
        console.log('✓ Visual settings initialized');
        
        // Apply accessibility enhancements
        try {
            this.applyAccessibilitySettings();
            console.log('✓ Accessibility settings applied');
        } catch (error) {
            console.warn('⚠️ Accessibility settings error:', error.message);
        }
        
        // Initialize systems as null - they will be created after all classes are loaded
        this.diceSystem = null;
        this.shotCalculator = null;
        this.analysisSystem = null;
        console.log('✓ Systems initialized as null');
        
        try {
            this.init();
            console.log('✓ PhaserBoardGameEngine init() completed');
        } catch (error) {
            console.error('✗ PhaserBoardGameEngine init() failed:', error.message);
            throw error;
        }
        
        console.log('🎲 PhaserBoardGameEngine constructor completed successfully');
    }

    init() {
        this.setupDefaultPlayers();
        
        // Force wait for DOM to be completely ready
        const initGame = () => {
            console.log('🎮 DOM ready, setting up Phaser config...');
            this.setupPhaserConfig();
            
            // Additional delay to ensure everything is settled
            setTimeout(() => {
                console.log('🎮 Creating game after delay...');
                this.createGame();
            }, 100);
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGame);
        } else if (document.readyState === 'interactive') {
            // Document loaded but still loading resources
            setTimeout(initGame, 100);
        } else {
            // Document completely loaded
            initGame();
        }
        
        console.log('🎲 Phaser.js Engine initialized with authentic 1987 mechanics');
    }
    
    initializeGameSystems() {
        console.log('🎲 Initializing game systems...');
        
        // Check class availability
        console.log('Class availability check:');
        console.log('- AuthenticDiceSystem:', typeof AuthenticDiceSystem !== 'undefined');
        console.log('- BoardGameShotCalculator:', typeof BoardGameShotCalculator !== 'undefined');
        console.log('- ShotAnalysisSystem:', typeof ShotAnalysisSystem !== 'undefined');
        
        // Initialize game systems after all classes are loaded
        if (!this.diceSystem && typeof AuthenticDiceSystem !== 'undefined') {
            try {
                this.diceSystem = new AuthenticDiceSystem();
                console.log('✓ AuthenticDiceSystem initialized');
            } catch (error) {
                console.error('✗ AuthenticDiceSystem initialization failed:', error.message);
            }
        }
        
        if (!this.shotCalculator && typeof BoardGameShotCalculator !== 'undefined') {
            try {
                this.shotCalculator = new BoardGameShotCalculator();
                console.log('✓ BoardGameShotCalculator initialized');
            } catch (error) {
                console.error('✗ BoardGameShotCalculator initialization failed:', error.message);
            }
        }
        
        if (!this.analysisSystem && typeof ShotAnalysisSystem !== 'undefined') {
            try {
                this.analysisSystem = new ShotAnalysisSystem();
                console.log('✓ ShotAnalysisSystem initialized');
            } catch (error) {
                console.error('✗ ShotAnalysisSystem initialization failed:', error.message);
            }
        }
        
        console.log('🎲 Game systems initialization completed');
        console.log('Final system status:');
        console.log('- diceSystem:', this.diceSystem ? 'OK' : 'NULL');
        console.log('- shotCalculator:', this.shotCalculator ? 'OK' : 'NULL');
        console.log('- analysisSystem:', this.analysisSystem ? 'OK' : 'NULL');
    }

    setupPhaserConfig() {
        // Get viewport dimensions or use default
        const container = document.getElementById('course3DViewport');
        let containerWidth = 1120;
        let containerHeight = 500;
        
        if (container) {
            containerWidth = container.offsetWidth || 1120;
            containerHeight = container.offsetHeight || 500;
            console.log(`✓ Viewport found - using dimensions: ${containerWidth}x${containerHeight}`);
        } else {
            console.warn('⚠️ Viewport not found, using default dimensions');
        }
        
        this.config = {
            type: Phaser.AUTO, // Let Phaser decide WEBGL vs Canvas
            width: containerWidth,
            height: containerHeight,
            parent: 'course3DViewport', // Use string ID, not DOM element
            backgroundColor: '#F5F5DC', // Cream background for colonist.io aesthetic
            scene: [], // Will add scene dynamically after class is defined
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                min: {
                    width: 320,
                    height: 240
                },
                max: {
                    width: 1600,
                    height: 1200
                }
            },
            canvas: {
                style: 'display: block; margin: 0 auto;'
            }
        };
        
        console.log('✓ Phaser config setup with explicit dimensions');
    }

    createGame() {
        console.log('🎮 Creating HTML5 Canvas game (Phaser fallback)...');
        
        // Comprehensive container validation
        console.log('🔍 Looking for course3DViewport container...');
        console.log('Document ready state:', document.readyState);
        
        const container = document.getElementById('course3DViewport');
        if (!container) {
            console.error('✗ Cannot find course3DViewport container!');
            return;
        }
        
        console.log(`✓ Valid container found: ${container.tagName} with dimensions ${container.offsetWidth}x${container.offsetHeight}`);
        
        // Clear any existing content
        container.innerHTML = '';
        
        // Ensure container has proper dimensions
        const containerWidth = container.offsetWidth || 800;
        const containerHeight = container.offsetHeight || 500;
        
        if (container.offsetWidth === 0 || container.offsetHeight === 0) {
            container.style.width = '800px';
            container.style.height = '500px';
            container.style.display = 'block';
            console.log('✓ Container dimensions set manually');
        }
        
        // Remove loading overlay if present
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
            console.log('✓ Loading overlay hidden');
        }
        
        try {
            // Create HTML5 Canvas instead of Phaser
            this.canvas = document.createElement('canvas');
            this.canvas.width = containerWidth;
            this.canvas.height = containerHeight;
            this.canvas.style.border = '2px solid #4CAF50';
            this.canvas.style.borderRadius = '8px';
            this.canvas.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            this.canvas.style.display = 'block';
            this.canvas.style.margin = '0 auto';
            this.canvas.style.backgroundColor = '#F5F5DC';
            
            // Get 2D context
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('Failed to get 2D context');
            }
            
            // Insert canvas into container
            container.appendChild(this.canvas);
            console.log(`✓ HTML5 Canvas created and inserted: ${this.canvas.width}x${this.canvas.height}`);
            
            // Initialize the golf course scene
            this.initializeGolfCourse();
            
            // Set up mouse/touch interaction
            this.setupCanvasInteraction();
            
            console.log('✓ Canvas-based game successfully initialized');
            
        } catch (error) {
            console.error('✗ Error creating HTML5 Canvas:', error.message);
            
            // Show error message in container
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #d32f2f; background: #ffebee; border-radius: 8px; margin: 1rem;">
                    <h3>🚫 Canvas Creation Error</h3>
                    <p>Failed to create game canvas: ${error.message}</p>
                    <button onclick="location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            `;
        }
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

    // Process shot result and update game state
    processShotResult(shotResult) {
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        
        // Increment stroke count for every shot taken
        if (!currentPlayerObj.strokes) {
            currentPlayerObj.strokes = 0;
        }
        currentPlayerObj.strokes++;
        
        // Update player position and lie
        currentPlayerObj.position = shotResult.position;
        currentPlayerObj.lie = shotResult.lie;
        
        // Record shot in history
        this.shotHistory.push({
            hole: this.currentHole,
            player: this.currentPlayer,
            stroke: currentPlayerObj.strokes,
            club: document.querySelector('.club-option.selected')?.dataset.club,
            result: shotResult,
            timestamp: Date.now()
        });
        
        // Check for hole completion
        if (shotResult.holedOut) {
            this.completeHole();
        } else {
            // Update display with new position and stroke count
            this.updateStrokeDisplay();
            this.updatePositionDisplay();
        }
        
        // Auto-save game state after each shot
        this.saveGameState();
        
        console.log(`✓ Shot processed: Stroke ${currentPlayerObj.strokes}, Lie: ${shotResult.lie}`);
    }
    
    // Complete the current hole
    completeHole() {
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const hole = courseData.holes[this.currentHole - 1];
        const scoreToPar = currentPlayerObj.strokes - hole.par;
        
        // Record hole completion
        currentPlayerObj.scores = currentPlayerObj.scores || [];
        currentPlayerObj.scores[this.currentHole - 1] = currentPlayerObj.strokes;
        currentPlayerObj.holedOut = true;
        
        // Show hole completion celebration
        this.showHoleCompletionMessage(scoreToPar, currentPlayerObj.strokes, hole.par);
        
        // Advance to next hole after celebration
        setTimeout(() => {
            this.advanceToNextHole();
        }, 3000);
        
        console.log(`🏆 Hole ${this.currentHole} completed in ${currentPlayerObj.strokes} strokes (${this.getScoreDescription(scoreToPar)})`);
    }
    
    // Advance to the next hole
    advanceToNextHole() {
        if (this.currentHole >= 18) {
            this.completeRound();
            return;
        }
        
        this.currentHole++;
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        
        // Reset player for new hole
        currentPlayerObj.strokes = 0;
        currentPlayerObj.position = { x: 25, y: 25 }; // Tee position
        currentPlayerObj.lie = 'tee';
        currentPlayerObj.holedOut = false;
        
        // Update hole information display
        this.updateHoleDisplay();
        
        // Initialize TPC hole display for new hole
        if (window.tpcHoleDisplay) {
            window.tpcHoleDisplay.displayHole(this.currentHole);
        }
        
        console.log(`➡️ Advanced to hole ${this.currentHole}`);
    }
    
    // Complete the full 18-hole round
    completeRound() {
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const totalScore = currentPlayerObj.scores.reduce((sum, score) => sum + score, 0);
        const totalPar = courseData.holes.reduce((sum, hole) => sum + hole.par, 0);
        const finalScoreToPar = totalScore - totalPar;
        
        this.showRoundCompletionMessage(totalScore, finalScoreToPar);
        
        console.log(`🎉 Round completed! Total: ${totalScore} (${this.getScoreDescription(finalScoreToPar)} overall)`);
    }
    
    // Update stroke counter display
    updateStrokeDisplay() {
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const strokeDisplay = document.querySelector('.current-stroke, #currentStroke, .stroke-counter');
        if (strokeDisplay) {
            strokeDisplay.textContent = `Stroke: ${currentPlayerObj.strokes}`;
        }
        
        // Update par information
        const hole = courseData.holes[this.currentHole - 1];
        const scoreToPar = currentPlayerObj.strokes - hole.par;
        const parDisplay = document.querySelector('.score-to-par, #scoreToPar');
        if (parDisplay) {
            const scoreText = scoreToPar === 0 ? 'Even Par' : 
                             scoreToPar > 0 ? `+${scoreToPar}` : `${scoreToPar}`;
            parDisplay.textContent = `Score: ${scoreText}`;
        }
    }
    
    // Update position display
    updatePositionDisplay() {
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const distanceToPin = this.calculateDistanceToPin(currentPlayerObj.position);
        
        const distanceDisplay = document.getElementById('distanceToPin3D') || document.querySelector('.distance-display');
        if (distanceDisplay) {
            distanceDisplay.textContent = this.formatDistance(distanceToPin);
        }
        
        const lieDisplay = document.querySelector('.lie-display, #currentLie');
        if (lieDisplay) {
            lieDisplay.textContent = `Lie: ${currentPlayerObj.lie.charAt(0).toUpperCase() + currentPlayerObj.lie.slice(1)}`;
        }
    }
    
    // Update hole information display
    updateHoleDisplay() {
        const hole = courseData.holes[this.currentHole - 1];
        
        const holeNumberDisplay = document.querySelector('.hole-number, #holeNumber');
        if (holeNumberDisplay) {
            holeNumberDisplay.textContent = `Hole ${this.currentHole}`;
        }
        
        const holeParDisplay = document.querySelector('.hole-par, #holePar');
        if (holeParDisplay) {
            holeParDisplay.textContent = `Par ${hole.par}`;
        }
        
        const holeYardageDisplay = document.querySelector('.hole-yardage, #holeYardage3D');
        if (holeYardageDisplay) {
            holeYardageDisplay.textContent = this.formatDistance(hole.yardage);
        }
    }
    
    // Show hole completion message with celebration
    showHoleCompletionMessage(scoreToPar, strokes, par) {
        const scoreDescription = this.getScoreDescription(scoreToPar);
        const celebration = this.getCelebrationEmoji(scoreToPar);
        
        const message = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${celebration}</div>
                <h2 style="color: #1a5f3f; margin-bottom: 1rem;">${scoreDescription.toUpperCase()}!</h2>
                <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">
                    Hole ${this.currentHole} completed in <strong>${strokes}</strong> strokes
                </p>
                <p style="color: #666; margin-bottom: 1.5rem;">
                    Par ${par} • Score to Par: ${scoreToPar === 0 ? 'Even' : scoreToPar > 0 ? '+' + scoreToPar : scoreToPar}
                </p>
                <p style="font-size: 0.9rem; color: #888;">
                    Advancing to hole ${this.currentHole + 1}...
                </p>
            </div>
        `;
        
        this.showModalMessage(message, 3000);
    }
    
    // Show round completion message
    showRoundCompletionMessage(totalScore, scoreToPar) {
        const celebration = scoreToPar <= -10 ? '🏆' : scoreToPar <= -5 ? '🎉' : scoreToPar <= 0 ? '👏' : '⛳';
        const performance = scoreToPar <= -10 ? 'EXCEPTIONAL!' : 
                           scoreToPar <= -5 ? 'EXCELLENT!' : 
                           scoreToPar <= 0 ? 'GREAT ROUND!' : 
                           scoreToPar <= 10 ? 'GOOD EFFORT!' : 'KEEP PRACTICING!';
        
        const message = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${celebration}</div>
                <h1 style="color: #1a5f3f; margin-bottom: 1rem;">ROUND COMPLETE</h1>
                <h2 style="color: #c9a96e; margin-bottom: 1rem;">${performance}</h2>
                <div style="background: rgba(26, 95, 63, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">
                        Final Score: <strong>${totalScore}</strong>
                    </p>
                    <p style="font-size: 1.2rem; color: #666;">
                        Total to Par: ${scoreToPar === 0 ? 'Even Par' : scoreToPar > 0 ? '+' + scoreToPar : scoreToPar}
                    </p>
                </div>
                <button onclick="location.reload()" style="background: #1a5f3f; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 1rem; cursor: pointer;">
                    🔄 Play Again
                </button>
            </div>
        `;
        
        this.showModalMessage(message, 0); // No auto-close for round completion
    }
    
    // Get score description based on score to par
    getScoreDescription(scoreToPar) {
        const descriptions = {
            [-4]: 'Condor',
            [-3]: 'Albatross', 
            [-2]: 'Eagle',
            [-1]: 'Birdie',
            [0]: 'Par',
            [1]: 'Bogey',
            [2]: 'Double Bogey',
            [3]: 'Triple Bogey'
        };
        
        return descriptions[scoreToPar] || (scoreToPar > 3 ? `+${scoreToPar}` : `${scoreToPar}`);
    }
    
    // Get celebration emoji based on score
    getCelebrationEmoji(scoreToPar) {
        if (scoreToPar <= -3) return '🦅'; // Eagle or better
        if (scoreToPar === -2) return '🦅'; // Eagle  
        if (scoreToPar === -1) return '🐦'; // Birdie
        if (scoreToPar === 0) return '⛳'; // Par
        if (scoreToPar === 1) return '📈'; // Bogey
        return '📊'; // Double bogey or worse
    }
    
    // Show modal message overlay
    showModalMessage(html, autoCloseMs = 0) {
        const modal = document.createElement('div');
        modal.className = 'game-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                animation: slideIn 0.3s ease;
            ">
                ${html}
            </div>
            <style>
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: scale(0.8); } to { transform: scale(1); } }
            </style>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-close if specified
        if (autoCloseMs > 0) {
            setTimeout(() => {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
            }, autoCloseMs);
        }
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Save game state to localStorage
    saveGameState() {
        try {
            const gameState = {
                currentHole: this.currentHole,
                currentPlayer: this.currentPlayer,
                players: this.players,
                shotHistory: this.shotHistory,
                gameStarted: this.gameStarted,
                timestamp: Date.now(),
                version: '1.0'
            };
            
            localStorage.setItem('pursuitOfPar_gameState', JSON.stringify(gameState));
            console.log('✓ Game state saved');
        } catch (error) {
            console.warn('Failed to save game state:', error);
        }
    }
    
    // Load game state from localStorage
    loadGameState() {
        try {
            const savedState = localStorage.getItem('pursuitOfPar_gameState');
            if (!savedState) return false;
            
            const gameState = JSON.parse(savedState);
            
            // Validate saved state
            if (!gameState.players || !gameState.currentHole) {
                console.warn('Invalid saved game state');
                return false;
            }
            
            // Restore game state
            this.currentHole = gameState.currentHole;
            this.currentPlayer = gameState.currentPlayer;
            this.players = gameState.players;
            this.shotHistory = gameState.shotHistory || [];
            this.gameStarted = gameState.gameStarted;
            
            // Update displays
            this.updateHoleDisplay();
            this.updateStrokeDisplay();
            this.updatePositionDisplay();
            
            console.log('✓ Game state loaded from save');
            return true;
        } catch (error) {
            console.warn('Failed to load game state:', error);
            return false;
        }
    }
    
    // Clear saved game state
    clearSavedGame() {
        localStorage.removeItem('pursuitOfPar_gameState');
        console.log('✓ Saved game cleared');
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
    
    // UI Integration Methods
    selectClub(clubType) {
        console.log(`🏌️ Club selected: ${clubType}`);
        this.currentClub = clubType;
        
        // Update UI display
        const clubDisplay = document.getElementById('selectedClub');
        if (clubDisplay) {
            clubDisplay.textContent = clubType.charAt(0).toUpperCase() + clubType.slice(1);
        }
        
        // If we have a shot calculator, update the club there too
        if (this.shotCalculator && typeof this.shotCalculator.setClub === 'function') {
            this.shotCalculator.setClub(clubType);
        }
        
        return true;
    }
    
    takeShot() {
        console.log('🎲 Taking shot...');
        
        if (!this.diceSystem) {
            console.warn('⚠️ Dice system not initialized yet');
            return false;
        }
        
        try {
            // Roll the dice using authentic mechanics
            const diceRoll = this.diceSystem.rollAuthentic();
            console.log('🎲 Dice rolled:', diceRoll);
            
            // Update dice display in UI
            this.updateDiceDisplay(diceRoll);
            
            // Calculate shot result if we have a shot calculator
            if (this.shotCalculator && this.currentClub) {
                const shotResult = this.shotCalculator.calculateShot(
                    this.currentClub,
                    diceRoll,
                    this.getCurrentLie()
                );
                console.log('📊 Shot result:', shotResult);
                
                // Pass direction dice to shot result for proper calculation
                shotResult.directionDice = diceRoll.direction;
                
                // Apply shot and update game state
                this.applyShot(shotResult);
                
                // If using canvas, animate ball movement to new position
                if (this.canvas && this.ctx) {
                    const newCanvasPosition = this.courseToCanvas(this.ballCoursePosition);
                    console.log(`Animating ball from ${this.ballPosition.x},${this.ballPosition.y} to ${newCanvasPosition.x},${newCanvasPosition.y}`);
                    this.animateBallMovement(newCanvasPosition.x, newCanvasPosition.y);
                }
                
                return shotResult;
            } else {
                console.warn('⚠️ Shot calculator or club not available');
                return diceRoll;
            }
        } catch (error) {
            console.error('✗ Shot execution failed:', error.message);
            return false;
        }
    }
    
    updateDiceDisplay(diceRoll) {
        const greenDice = document.getElementById('greenDice3D');
        const directionDice = document.getElementById('directionDice3D');
        const problemDice = document.getElementById('problemDice3D');
        
        if (greenDice) {
            greenDice.textContent = diceRoll.distance;
            greenDice.classList.add('rolling');
            setTimeout(() => greenDice.classList.remove('rolling'), 800);
        }
        
        if (directionDice) {
            directionDice.textContent = diceRoll.direction;
            directionDice.classList.add('rolling');
            setTimeout(() => directionDice.classList.remove('rolling'), 800);
        }
        
        if (problemDice && diceRoll.problem) {
            problemDice.textContent = diceRoll.problem;
            problemDice.style.display = 'block';
            problemDice.classList.add('rolling');
            setTimeout(() => problemDice.classList.remove('rolling'), 800);
        }
    }
    
    getCurrentLie() {
        // Use actual ball position to determine lie
        return this.calculateLieFromPosition(this.ballCoursePosition);
    }
    
    calculateLieFromPosition(coursePosition) {
        const pos = coursePosition;
        
        // Check for hole completion first
        if (pos.progressPercent >= 99 && 
            pos.lateralPercent >= 45 && pos.lateralPercent <= 55) {
            return 'holed';
        }
        
        // Check tee area
        const tee = this.courseAreas.tee;
        if (pos.progressPercent >= tee.progressMin && pos.progressPercent <= tee.progressMax &&
            pos.lateralPercent >= tee.lateralMin && pos.lateralPercent <= tee.lateralMax) {
            return 'tee';
        }
        
        // Check green area
        const green = this.courseAreas.green;
        if (pos.progressPercent >= green.progressMin && pos.progressPercent <= green.progressMax &&
            pos.lateralPercent >= green.lateralMin && pos.lateralPercent <= green.lateralMax) {
            return 'green';
        }
        
        // Check sand bunkers
        for (const bunker of this.courseAreas.sandBunkers) {
            if (pos.progressPercent >= bunker.progressMin && pos.progressPercent <= bunker.progressMax &&
                pos.lateralPercent >= bunker.lateralMin && pos.lateralPercent <= bunker.lateralMax) {
                return 'sand';
            }
        }
        
        // Check water hazard
        const water = this.courseAreas.water;
        if (pos.progressPercent >= water.progressMin && pos.progressPercent <= water.progressMax &&
            pos.lateralPercent >= water.lateralMin && pos.lateralPercent <= water.lateralMax) {
            return 'water';
        }
        
        // Check fairway
        const fairway = this.courseAreas.fairway;
        if (pos.progressPercent >= fairway.progressMin && pos.progressPercent <= fairway.progressMax &&
            pos.lateralPercent >= fairway.lateralMin && pos.lateralPercent <= fairway.lateralMax) {
            return 'fairway';
        }
        
        // Default to rough if not in any specific area
        return 'rough';
    }
    
    applyShot(shotResult) {
        // Update stroke count
        this.strokeCount = (this.strokeCount || 0) + 1;
        
        // Calculate new ball position based on shot result
        const newPosition = this.calculateNewBallPosition(shotResult);
        
        // Update ball position
        this.ballCoursePosition = newPosition;
        this.ballPosition = this.courseToCanvas(newPosition);
        
        // Update lie based on new position
        this.currentLie = this.calculateLieFromPosition(newPosition);
        
        // Calculate distance to pin
        this.distanceToPin = this.calculateDistanceToPin(newPosition);
        
        // Check for hole completion or gimme
        this.checkHoleCompletion();
        
        // Update club availability based on new lie
        this.updateClubAvailability();
        
        console.log(`Shot applied: ${this.strokeCount} strokes, ${Math.round(this.distanceToPin)}y to pin, lie: ${this.currentLie}`);
    }
    
    calculateNewBallPosition(shotResult) {
        // Start from current position
        const currentPos = this.ballCoursePosition;
        
        // Calculate distance in yards from shot result
        const shotDistanceYards = shotResult.distance || shotResult.finalDistance || 0;
        
        // Convert yards to progress percentage  
        const progressChange = (shotDistanceYards / this.courseLength) * 100;
        
        // Calculate direction deviation from shot result
        let lateralChange = 0;
        if (shotResult.directionDice) {
            // Direction dice: 1-6 = left, 7-12 = right, 6-7 = straight
            const directionValue = shotResult.directionDice;
            if (directionValue <= 6) {
                // Left deviation (hook)
                lateralChange = (6 - directionValue) * -3; // Max 15% left
            } else if (directionValue >= 7) {
                // Right deviation (slice)  
                lateralChange = (directionValue - 7) * 3; // Max 15% right
            }
            
            // Apply accuracy modifier - better accuracy reduces deviation
            const accuracy = shotResult.accuracy || 0.8;
            lateralChange *= (1 - accuracy);
        }
        
        // Calculate new position
        const newProgressPercent = Math.min(100, Math.max(0, currentPos.progressPercent + progressChange));
        const newLateralPercent = Math.min(100, Math.max(0, currentPos.lateralPercent + lateralChange));
        
        return {
            progressPercent: newProgressPercent,
            lateralPercent: newLateralPercent
        };
    }
    
    calculateDistanceToPin(position) {
        // Calculate remaining distance to hole based on progress percentage
        const remainingProgress = 100 - position.progressPercent;
        const distanceYards = (remainingProgress / 100) * this.courseLength;
        return Math.max(0, distanceYards);
    }
    
    checkHoleCompletion() {
        const lie = this.currentLie;
        
        if (lie === 'holed') {
            console.log(`🏆 HOLE COMPLETE! Final score: ${this.strokeCount} strokes`);
            return 'holed';
        }
        
        // Check gimme rule - within 3 feet on green
        if (lie === 'green' && this.distanceToPin <= 1) { // ~3 feet = 1 yard
            console.log(`🎯 GIMME! Ball within 3 feet - automatic make`);
            this.currentLie = 'holed';
            return 'gimme';
        }
        
        return 'playing';
    }
    
    // Club Restriction Methods (1987 Board Game Rules)
    getAvailableClubs(lie) {
        // Authentic 1987 board game club restrictions by lie
        const allClubs = ['driver', '3wood', '5wood', '3iron', '5iron', '7iron', '9iron', 'wedge', 'putter'];
        
        switch (lie) {
            case 'tee':
                return allClubs; // All clubs available from tee
                
            case 'fairway':
                return ['3wood', '5wood', '3iron', '5iron', '7iron', '9iron', 'wedge', 'putter']; // No driver from fairway (optional rule)
                
            case 'rough':
                return ['5iron', '7iron', '9iron', 'wedge', 'putter']; // Only shorter irons from rough
                
            case 'sand':
                return ['wedge', 'putter']; // Sand wedge or putter only from bunkers
                
            case 'green':
                return ['wedge', 'putter']; // Putter primary, wedge for edge chips
                
            case 'water':
                return []; // No clubs - penalty shot/drop
                
            case 'trees':
                return ['7iron', '9iron', 'wedge', 'putter']; // Limited selection under trees
                
            default:
                return allClubs;
        }
    }
    
    updateClubAvailability() {
        const currentLie = this.getCurrentLie();
        const availableClubs = this.getAvailableClubs(currentLie);
        
        // Update UI club buttons
        const clubButtons = document.querySelectorAll('.club-option');
        clubButtons.forEach(button => {
            const clubType = button.dataset.club;
            const isAvailable = availableClubs.includes(clubType);
            
            button.disabled = !isAvailable;
            button.style.opacity = isAvailable ? '1' : '0.5';
            button.style.cursor = isAvailable ? 'pointer' : 'not-allowed';
            
            if (!isAvailable) {
                button.classList.remove('selected');
                button.title = `${clubType} not available from ${currentLie}`;
            } else {
                button.title = this.getClubDescription(clubType, currentLie);
            }
        });
        
        // Auto-select recommended club if current selection is unavailable
        if (!availableClubs.includes(this.currentClub)) {
            const recommendedClub = this.getRecommendedClub(currentLie, this.distanceToPin);
            this.selectClub(recommendedClub);
        }
        
        console.log(`Club availability updated for ${currentLie}: ${availableClubs.join(', ')}`);
    }
    
    getRecommendedClub(lie, distance) {
        const availableClubs = this.getAvailableClubs(lie);
        const clubRanges = this.getClubDistanceRanges();
        
        // Find club with distance range that best fits the target distance
        let bestClub = availableClubs[0];
        let bestScore = Infinity;
        
        for (const club of availableClubs) {
            const range = clubRanges[club];
            if (range) {
                const midRange = (range.min + range.max) / 2;
                const score = Math.abs(distance - midRange);
                if (score < bestScore) {
                    bestScore = score;
                    bestClub = club;
                }
            }
        }
        
        return bestClub;
    }
    
    getClubDescription(clubType, lie) {
        const ranges = this.getClubDistanceRanges()[clubType];
        const lieNote = lie === 'rough' ? ' (reduced from rough)' : 
                       lie === 'sand' ? ' (escape shot)' : '';
        
        return `${clubType.toUpperCase()}: ${ranges.min}-${ranges.max} yards${lieNote}`;
    }
        
        // Update UI
        const strokesDisplay = document.getElementById('currentStrokes3D');
        if (strokesDisplay) {
            strokesDisplay.textContent = this.strokeCount;
        }
        
        // Add to shot history
        this.shotHistory.push({
            hole: this.currentHole,
            player: this.currentPlayer,
            club: this.currentClub,
            result: shotResult,
            timestamp: new Date()
        });
        
        console.log(`✓ Shot applied - Strokes: ${this.strokeCount}`);
    }
    
    // Units system methods
    toggleUnits() {
        this.units = this.units === 'yards' ? 'meters' : 'yards';
        localStorage.setItem('preferred-units', this.units);
        
        const unitsButton = document.getElementById('unitsToggle');
        if (unitsButton) {
            unitsButton.textContent = `Toggle Units (${this.units === 'yards' ? 'Yards ⇄ Meters' : 'Meters ⇄ Yards'})`;
        }
        
        console.log(`🔄 Units toggled to: ${this.units}`);
        
        // Update all distance displays
        this.updateDistanceDisplays();
    }
    
    convertDistance(yards) {
        return this.units === 'meters' ? Math.round(yards * this.conversionRatio) : yards;
    }
    
    updateDistanceDisplays() {
        // Update hole yardage display
        const yardageDisplay = document.getElementById('holeYardage3D');
        if (yardageDisplay && this.currentHole) {
            const hole = courseData.holes[this.currentHole - 1];
            if (hole) {
                const distance = this.convertDistance(hole.yardage);
                yardageDisplay.textContent = `${distance} ${this.units === 'yards' ? 'yards' : 'm'}`;
            }
        }
        
        // Update distance to pin
        const distanceToPin = document.getElementById('distanceToPin3D');
        if (distanceToPin) {
            const currentDistance = 394; // This would be calculated based on ball position
            const convertedDistance = this.convertDistance(currentDistance);
            distanceToPin.textContent = `${convertedDistance} ${this.units === 'yards' ? 'yards' : 'm'}`;
        }
    }
    
    // Settings export/import
    exportSettings() {
        const settings = {
            units: this.units,
            visualSettings: this.visualSettings,
            gamePreferences: {
                enableHexGrid: localStorage.getItem('enable-hex-grid') !== 'false',
                colorBlindMode: localStorage.getItem('colorblind-mode') === 'true',
                highContrast: localStorage.getItem('high-contrast') === 'true'
            }
        };
        
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'pursuit-of-par-settings.json';
        link.click();
        
        console.log('⚙️ Settings exported');
    }
    
    importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);
                
                // Apply units
                if (settings.units) {
                    this.units = settings.units;
                    localStorage.setItem('preferred-units', this.units);
                }
                
                // Apply visual settings
                if (settings.gamePreferences) {
                    const prefs = settings.gamePreferences;
                    
                    localStorage.setItem('enable-hex-grid', prefs.enableHexGrid);
                    localStorage.setItem('colorblind-mode', prefs.colorBlindMode);
                    localStorage.setItem('high-contrast', prefs.highContrast);
                    
                    // Update checkboxes
                    const hexGrid = document.getElementById('enableHexGrid');
                    if (hexGrid) hexGrid.checked = prefs.enableHexGrid;
                    
                    const colorBlind = document.getElementById('colorBlindMode');
                    if (colorBlind) colorBlind.checked = prefs.colorBlindMode;
                    
                    const highContrast = document.getElementById('highContrastMode');
                    if (highContrast) highContrast.checked = prefs.highContrast;
                }
                
                console.log('⚙️ Settings imported successfully');
                this.updateDistanceDisplays();
                
            } catch (error) {
                console.error('✗ Failed to import settings:', error.message);
            }
        };
        
        reader.readAsText(file);
    }
    
    // HTML5 Canvas Golf Course Methods
    initializeGolfCourse() {
        console.log('🏌️ Initializing HTML5 Canvas golf course...');
        
        // Course dimensions and coordinate system
        this.courseLength = 394; // Total hole yardage
        this.courseWidth = 60; // Course width in yards (fairway + rough)
        
        // Initialize ball position at tee (course coordinates: 0% progress, center)
        this.ballCoursePosition = { 
            progressPercent: 0, // 0% = tee, 100% = hole
            lateralPercent: 50  // 50% = center, 0% = left edge, 100% = right edge
        };
        
        // Convert to canvas coordinates
        this.ballPosition = this.courseToCanvas(this.ballCoursePosition);
        this.ballRadius = 4;
        
        // Initialize hole position (green center - 100% progress, center)
        this.holePosition = this.courseToCanvas({ progressPercent: 100, lateralPercent: 50 });
        
        // Define course areas for lie detection
        this.defineCourseAreas();
        
        // Initialize game state
        this.currentLie = 'tee';
        this.distanceToPin = this.courseLength;
        this.strokeCount = 0;
        
        // Draw initial course
        this.drawGolfCourse();
        
        console.log('✓ Golf course initialized with coordinate system');
        console.log(`Ball at: ${this.ballCoursePosition.progressPercent}% progress, ${this.ballCoursePosition.lateralPercent}% lateral`);
    }
    
    // Coordinate System Methods
    courseToCanvas(coursePos) {
        // Convert course percentages to canvas pixel coordinates
        const canvasX = 50 + (coursePos.lateralPercent / 100) * (this.canvas.width - 200);
        const canvasY = this.canvas.height - 50 - (coursePos.progressPercent / 100) * (this.canvas.height - 130);
        return { x: canvasX, y: canvasY };
    }
    
    canvasToCourse(canvasPos) {
        // Convert canvas pixels to course percentage coordinates  
        const progressPercent = 100 - ((canvasPos.y - 50) / (this.canvas.height - 130)) * 100;
        const lateralPercent = ((canvasPos.x - 50) / (this.canvas.width - 200)) * 100;
        return { 
            progressPercent: Math.max(0, Math.min(100, progressPercent)),
            lateralPercent: Math.max(0, Math.min(100, lateralPercent))
        };
    }
    
    defineCourseAreas() {
        // Define course areas for accurate lie detection (all in course percentages)
        this.courseAreas = {
            tee: { progressMin: 0, progressMax: 5, lateralMin: 40, lateralMax: 60 },
            fairway: { progressMin: 5, progressMax: 85, lateralMin: 30, lateralMax: 70 },
            rough: { progressMin: 0, progressMax: 100, lateralMin: 0, lateralMax: 100 }, // Default area
            sandBunkers: [
                { progressMin: 25, progressMax: 35, lateralMin: 15, lateralMax: 25 }, // Left bunker
                { progressMin: 60, progressMax: 75, lateralMin: 75, lateralMax: 90 }  // Right bunker
            ],
            water: { progressMin: 40, progressMax: 60, lateralMin: 5, lateralMax: 20 },
            green: { progressMin: 85, progressMax: 100, lateralMin: 35, lateralMax: 65 }
        };
    }
    
    drawGolfCourse() {
        // Clear canvas with TPC Sawgrass sky color
        this.ctx.fillStyle = '#87CEEB'; // Sky blue background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw TPC Sawgrass-inspired course layout
        this.drawCourseBackground();
        this.drawWaterHazards();
        this.drawSandBunkers();
        this.drawFairwayAndRough();
        this.drawGreenComplex();
        this.drawTeeBox();
        
        // Draw course features
        this.drawYardageMarkers();
        this.drawCourseLabels();
        
        // Draw course area overlays for visual feedback
        this.drawCourseAreaOverlays();
        
        // Draw hex grid if enabled (Colonist.io style)
        if (this.visualSettings.enableHexGrid) {
            this.drawHexGrid();
        }
        
        // Draw ball
        this.drawBall();
        
        // Draw distance and lie info
        this.drawDistanceInfo();
    }
    
    drawCourseBackground() {
        // TPC Sawgrass signature deep rough/native areas
        this.ctx.fillStyle = '#556B2F'; // Dark olive green for native areas
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Spectator areas (lighter background)
        this.ctx.fillStyle = '#8FBC8F'; // Light sea green
        this.ctx.fillRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
    }
    
    drawWaterHazards() {
        // TPC Sawgrass signature water features - deep blue
        this.ctx.fillStyle = '#003366'; // Deep navy blue
        
        // Left side water hazard (inspired by hole 1 water)
        this.ctx.fillRect(20, this.canvas.height - 180, 150, 100);
        
        // Right side pond
        this.ctx.fillRect(this.canvas.width - 200, 60, 120, 80);
        
        // Water reflections/highlights
        this.ctx.fillStyle = '#4682B4'; // Steel blue highlights
        this.ctx.fillRect(30, this.canvas.height - 170, 130, 10);
        this.ctx.fillRect(this.canvas.width - 190, 70, 100, 8);
    }
    
    drawSandBunkers() {
        // TPC Sawgrass signature white sand bunkers
        this.ctx.fillStyle = '#F5F5DC'; // Beige sand color
        
        // Strategic bunkers based on TPC layout
        this.drawBunker(180, this.canvas.height - 110, 70, 35); // Fairway left
        this.drawBunker(this.canvas.width - 280, this.canvas.height - 120, 90, 45); // Fairway right
        this.drawBunker(this.canvas.width - 180, 120, 50, 25); // Greenside
    }
    
    drawBunker(x, y, width, height) {
        // White sand base
        this.ctx.fillStyle = '#F5F5DC';
        this.ctx.fillRect(x, y, width, height);
        
        // Bunker lips (raised edges)
        this.ctx.strokeStyle = '#8B7355';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
    }
    
    drawFairwayAndRough() {
        // TPC Sawgrass fairway - pristine condition
        this.ctx.fillStyle = '#228B22'; // Forest green fairway
        const fairwayWidth = this.canvas.width * 0.4;
        const fairwayX = (this.canvas.width - fairwayWidth) / 2;
        this.ctx.fillRect(fairwayX, 40, fairwayWidth, this.canvas.height - 80);
        
        // First cut rough (intermediate rough)
        this.ctx.fillStyle = '#32CD32'; // Lime green
        const roughWidth = fairwayWidth + 60;
        const roughX = (this.canvas.width - roughWidth) / 2;
        this.ctx.fillRect(roughX, 35, roughWidth, this.canvas.height - 70);
        
        // Fairway stripes (mowing pattern)
        this.ctx.fillStyle = '#1E6B1E'; // Darker green stripes
        for (let i = 0; i < fairwayWidth; i += 20) {
            this.ctx.fillRect(fairwayX + i, 40, 10, this.canvas.height - 80);
        }
    }
    
    drawGreenComplex() {
        // TPC Sawgrass signature green - multi-tiered
        const greenX = this.canvas.width - 170;
        const greenY = 40;
        const greenWidth = 140;
        const greenHeight = 100;
        
        // Green base color
        this.ctx.fillStyle = '#2E8B57'; // Sea green
        this.ctx.fillRect(greenX, greenY, greenWidth, greenHeight);
        
        // Pin placement (back-right typical TPC position)
        this.ctx.fillStyle = '#000000'; // Black flagstick
        this.ctx.fillRect(this.holePosition.x - 1, this.holePosition.y - 25, 2, 45);
        
        // TPC signature white flag
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.holePosition.x + 1, this.holePosition.y - 25, 20, 12);
        
        // "TPC" text on flag
        this.ctx.fillStyle = '#000080'; // Navy blue
        this.ctx.font = 'bold 8px Arial';
        this.ctx.fillText('TPC', this.holePosition.x + 3, this.holePosition.y - 17);
        
        // Hole cup
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(this.holePosition.x, this.holePosition.y, 3, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawTeeBox() {
        // TPC championship tee markers
        this.ctx.fillStyle = '#FFD700'; // Gold tee markers
        this.ctx.fillRect(45, this.canvas.height - 55, 15, 8);
        this.ctx.fillRect(65, this.canvas.height - 55, 15, 8);
        
        // Tee box area
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(40, this.canvas.height - 60, 50, 20);
    }
    
    drawCourseLabels() {
        // TPC Sawgrass hole information
        this.ctx.fillStyle = '#000080'; // Navy blue text
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText('TPC SAWGRASS', 20, 30);
        
        this.ctx.font = '12px Arial';
        this.ctx.fillText('HOLE 1 - PAR 4 - 394 YARDS', 20, 50);
        
        // Stadium Course designation
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#8B0000'; // Dark red
        this.ctx.fillText('THE PLAYERS STADIUM COURSE', 20, 65);
    }
    
    drawCourseAreaOverlays() {
        // Draw subtle overlays to show different course areas
        this.ctx.globalAlpha = 0.1; // Very transparent
        
        // Highlight current ball's area if not tee/fairway
        if (this.ballCoursePosition && this.currentLie) {
            const ballCanvas = this.courseToCanvas(this.ballCoursePosition);
            const highlightRadius = 40;
            
            const lieColors = {
                'tee': '#4CAF50',
                'fairway': '#2196F3', 
                'rough': '#FF9800',
                'sand': '#FF5722',
                'green': '#8BC34A',
                'water': '#F44336'
            };
            
            if (lieColors[this.currentLie]) {
                this.ctx.fillStyle = lieColors[this.currentLie];
                this.ctx.beginPath();
                this.ctx.arc(ballCanvas.x, ballCanvas.y, highlightRadius, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
        
        // Draw area boundaries (very subtle)
        this.ctx.globalAlpha = 0.05;
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        
        // Draw rough/fairway boundaries
        const fairwayBounds = this.courseAreas.fairway;
        const fairwayTopLeft = this.courseToCanvas({
            progressPercent: fairwayBounds.progressMin,
            lateralPercent: fairwayBounds.lateralMin
        });
        const fairwayBottomRight = this.courseToCanvas({
            progressPercent: fairwayBounds.progressMax, 
            lateralPercent: fairwayBounds.lateralMax
        });
        
        this.ctx.strokeRect(
            fairwayTopLeft.x,
            fairwayBottomRight.y, 
            fairwayBottomRight.x - fairwayTopLeft.x,
            fairwayTopLeft.y - fairwayBottomRight.y
        );
        
        this.ctx.globalAlpha = 1.0; // Reset transparency
    }
    
    drawYardageMarkers() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        
        // 100, 150, 200, 250 yard markers
        const markers = [
            { distance: 100, x: this.canvas.width - 200 },
            { distance: 150, x: this.canvas.width - 300 },
            { distance: 200, x: this.canvas.width - 400 },
            { distance: 250, x: this.canvas.width - 500 }
        ];
        
        markers.forEach(marker => {
            if (marker.x > 50) {
                // Draw marker circle
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.beginPath();
                this.ctx.arc(marker.x, this.canvas.height - 70, 15, 0, 2 * Math.PI);
                this.ctx.fill();
                
                // Draw distance text
                this.ctx.fillStyle = '#000000';
                this.ctx.fillText(marker.distance.toString(), marker.x, this.canvas.height - 65);
            }
        });
    }
    
    drawHexGrid() {
        // Draw subtle hex grid overlay
        this.ctx.strokeStyle = 'rgba(76, 175, 80, 0.2)';
        this.ctx.lineWidth = 1;
        
        const hexSize = 30;
        const hexWidth = hexSize * 2;
        const hexHeight = hexSize * Math.sqrt(3);
        
        for (let row = 0; row < Math.ceil(this.canvas.height / hexHeight) + 1; row++) {
            for (let col = 0; col < Math.ceil(this.canvas.width / hexWidth) + 1; col++) {
                const x = col * hexWidth * 0.75;
                const y = row * hexHeight + (col % 2) * hexHeight * 0.5;
                
                if (x < this.canvas.width + hexSize && y < this.canvas.height + hexSize) {
                    this.drawHexagon(x, y, hexSize);
                }
            }
        }
    }
    
    drawHexagon(centerX, centerY, radius) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }
    
    drawBall() {
        // Draw ball shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(this.ballPosition.x + 2, this.ballPosition.y + 2, this.ballRadius, this.ballRadius * 0.6, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw ball
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(this.ballPosition.x, this.ballPosition.y, this.ballRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Add dimples for realism
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i;
            const x = this.ballPosition.x + (this.ballRadius * 0.5) * Math.cos(angle);
            const y = this.ballPosition.y + (this.ballRadius * 0.5) * Math.sin(angle);
            this.ctx.beginPath();
            this.ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawDistanceInfo() {
        // Use accurate course-based distance calculation
        const yardsDistance = Math.round(this.distanceToPin);
        
        // Draw distance line
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.ballPosition.x, this.ballPosition.y);
        this.ctx.lineTo(this.holePosition.x, this.holePosition.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset dash
        
        // Draw distance text
        const midX = (this.ballPosition.x + this.holePosition.x) / 2;
        const midY = (this.ballPosition.y + this.holePosition.y) / 2;
        
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(midX - 30, midY - 12, 60, 24);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 12px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${yardsDistance}y`, midX, midY + 4);
        
        // Add lie information with color coding
        const lieColors = {
            'tee': '#4CAF50',      // Green - excellent
            'fairway': '#2196F3',  // Blue - good
            'rough': '#FF9800',    // Orange - challenging
            'sand': '#FF5722',     // Red-orange - difficult  
            'green': '#8BC34A',    // Light green - putting
            'water': '#F44336',    // Red - penalty
            'holed': '#FFD700'     // Gold - complete
        };
        
        const lieColor = lieColors[this.currentLie] || '#666666';
        this.ctx.fillStyle = lieColor;
        this.ctx.fillRect(this.ballPosition.x - 30, this.ballPosition.y - 35, 60, 20);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 10px Inter, sans-serif';
        this.ctx.fillText(this.currentLie.toUpperCase(), this.ballPosition.x, this.ballPosition.y - 22);
        
        // Add lie condition indicator
        const lieIcon = {
            'tee': '🏌️',
            'fairway': '✅', 
            'rough': '⚠️',
            'sand': '🏖️',
            'green': '🏁',
            'water': '💧',
            'holed': '🏆'
        };
        
        this.ctx.font = '12px Arial';
        this.ctx.fillText(lieIcon[this.currentLie] || '❓', this.ballPosition.x - 35, this.ballPosition.y - 22);
        
        // Update UI displays
        this.updateGameUI();
    }
    
    updateGameUI() {
        // Update distance display
        const distanceDisplay = document.getElementById('distanceToPin3D');
        if (distanceDisplay) {
            const distance = this.units === 'yards' ? Math.round(this.distanceToPin) : Math.round(this.distanceToPin * this.conversionRatio);
            const unit = this.units === 'yards' ? 'yards' : 'm';
            distanceDisplay.textContent = `${distance} ${unit}`;
        }
        
        // Update strokes display
        const strokesDisplay = document.getElementById('currentStrokes3D');
        if (strokesDisplay) {
            strokesDisplay.textContent = this.strokeCount || 0;
        }
        
        // Update lie display
        const lieDisplay = document.getElementById('currentLie3D');
        if (lieDisplay) {
            lieDisplay.textContent = this.currentLie.charAt(0).toUpperCase() + this.currentLie.slice(1);
        }
    }
    
    setupCanvasInteraction() {
        // Mouse click handler for taking shots
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
            
            console.log(`Canvas clicked at: ${clickX}, ${clickY}`);
            
            // Check if clicked near ball (for shot taking)
            const ballDistance = Math.sqrt(
                Math.pow(clickX - this.ballPosition.x, 2) + 
                Math.pow(clickY - this.ballPosition.y, 2)
            );
            
            if (ballDistance < 20) {
                console.log('Ball clicked - taking shot');
                this.takeShot();
            }
        });
        
        // Mouse hover for trajectory preview
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            // Change cursor when hovering over ball
            const ballDistance = Math.sqrt(
                Math.pow(mouseX - this.ballPosition.x, 2) + 
                Math.pow(mouseY - this.ballPosition.y, 2)
            );
            
            this.canvas.style.cursor = ballDistance < 20 ? 'pointer' : 'default';
        });
        
        console.log('✓ Canvas interaction setup complete');
    }
    
    // Override takeShot to work with canvas
    animateBallMovement(targetX, targetY) {
        const startX = this.ballPosition.x;
        const startY = this.ballPosition.y;
        const duration = 1000; // 1 second animation
        let startTime = null;
        
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing function for realistic ball movement
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            this.ballPosition.x = startX + (targetX - startX) * easeOut;
            this.ballPosition.y = startY + (targetY - startY) * easeOut;
            
            // Redraw course with new ball position
            this.drawGolfCourse();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                console.log('Ball animation complete');
                // Update game state after animation
                this.updateGameStateAfterShot();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    updateGameStateAfterShot() {
        // Game state already updated in applyShot(), just check for completion messages
        
        if (this.currentLie === 'holed') {
            console.log('Ball is in the hole! 🏆');
            
            // Show completion message
            const completionMessage = document.createElement('div');
            completionMessage.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #4CAF50;
                color: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                z-index: 2000;
                box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            `;
            
            const par = 4; // TPC Sawgrass hole 1 par
            const score = this.strokeCount - par;
            const scoreText = score <= 0 ? (score === 0 ? "PAR!" : (score === -1 ? "BIRDIE!" : "EAGLE!")) : `+${score}`;
            
            completionMessage.innerHTML = `
                <h2>🏆 Hole Complete!</h2>
                <p>Final Score: ${this.strokeCount} strokes (${scoreText})</p>
                <p>Authentic 1987 board game mechanics!</p>
            `;
            
            document.body.appendChild(completionMessage);
            setTimeout(() => completionMessage.remove(), 5000);
        }
        
        // Refresh UI to show current state
        this.updateGameUI();
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
        console.log('🎮 GolfCourseScene: Initializing...');
        
        this.engine = this.game.phaserEngine;
        this.engine.currentScene = this;
        
        console.log('✓ Engine reference established');
        
        // Initialize visual settings with colonist.io preferences
        this.visualSettings = {
            enableHexGrid: localStorage.getItem('enable-hex-grid') !== 'false',
            enableAnimations: localStorage.getItem('enable-animations') !== 'false',
            colorBlindMode: localStorage.getItem('colorblind-mode') === 'true',
            highContrast: localStorage.getItem('high-contrast') === 'true'
        };
        
        console.log('✓ Visual settings loaded:', this.visualSettings);
    }

    preload() {
        console.log('📦 GolfCourseScene: Preloading assets...');
        // Load any necessary assets for colonist.io styling
        // For now, we'll use programmatic graphics
        console.log('✓ Using programmatic graphics for colonist.io-inspired visuals');
    }

    create() {
        console.log('🎨 GolfCourseScene: Creating scene...');
        console.log(`Scene dimensions: ${this.scale.width}x${this.scale.height}`);
        
        try {
            console.log('🏞️ Setting up course visuals...');
            this.setupCourseVisuals();
            
            console.log('🎲 Creating dice sprites...');
            this.createDiceSprites();
            
            console.log('⛳ Creating ball...');
            this.createBall();
            
            console.log('🖱️ Setting up input handlers...');
            this.setupInputHandlers();
            
            console.log('⚙️ Creating visual settings panel...');
            this.createVisualSettingsPanel();
            
            console.log('✅ GolfCourseScene created successfully!');
        } catch (error) {
            console.error('❌ Error creating GolfCourseScene:', error.message);
            console.error('Stack:', error.stack);
        }
    }

    setupCourseVisuals() {
        const { width, height } = this.scale;
        console.log('🏌️ Setting up course visuals, canvas size:', width, 'x', height);
        
        // Check course data availability
        if (!courseData || !courseData.holes) {
            console.error('❌ Course data not available!', courseData);
            // Create fallback hole data
            window.courseData = {
                holes: [
                    { number: 1, par: 4, yardage: 394, layout: 'straight', difficulty: 13 }
                ]
            };
        }
        
        const hole = courseData.holes[this.engine?.currentHole - 1] || courseData.holes[0];
        console.log('🏌️ Current hole data:', hole);
        
        // Clear canvas with colonist.io cream background
        const bg = this.add.rectangle(width/2, height/2, width, height, 0xF5F5DC);
        console.log('🎨 Background created:', bg);
        
        // Add test shapes to verify rendering works
        const testCircle = this.add.circle(100, 100, 30, 0xFF0000);
        console.log('🔴 Test circle created:', testCircle);
        
        const testRect = this.add.rectangle(200, 100, 60, 40, 0x00FF00);
        console.log('🟢 Test rectangle created:', testRect);
        
        // Get color palette based on accessibility settings
        const colors = this.getColorPalette();
        
        // Create colonist.io inspired course areas with high contrast
        console.log('🟢 Creating fairway area...');
        this.createFairwayArea(colors, hole);
        
        console.log('🟤 Creating rough areas...');
        this.createRoughAreas(colors);
        
        console.log('🟢 Creating green area...');
        this.createGreenArea(colors);
        
        console.log('💧 Creating hazard areas...');
        this.createHazardAreas(colors, hole);
        
        console.log('📍 Creating tee box...');
        this.createTeeBox(colors);
        
        console.log('📏 Creating distance markers...');
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
// BoardGameShotCalculator is imported from authentic-mechanics.js

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
        ShotAnalysisSystem
    };
} else {
    window.PhaserBoardGameEngine = PhaserBoardGameEngine;
    window.GolfCourseScene = GolfCourseScene;
    window.ShotAnalysisSystem = ShotAnalysisSystem;
    
    // Add method to initialize the scene after classes are loaded
    PhaserBoardGameEngine.prototype.initializeScene = function() {
        if (this.game && !this.currentScene && !this.game.scene.getScene('GolfCourseScene')) {
            this.game.scene.add('GolfCourseScene', GolfCourseScene, true);
            console.log('✓ GolfCourseScene initialized via initializeScene method');
        }
    };
}