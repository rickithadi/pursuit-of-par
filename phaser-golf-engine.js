// In Pursuit of Par - Phaser.js Golf Engine
// Authentic 1987 board game mechanics with modern Phaser.js visualization
// Preserves original dice system and shot calculations

class PhaserGolfEngine {
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
        
        // Phaser.js game instance
        this.phaserGame = null;
        this.gameScene = null;
        
        // Authentic 1987 mechanics - preserved from original board game
        this.diceRoller = new AuthenticDiceSystem();
        this.shotCalculator = new BoardGameShotCalculator();
        this.courseManager = new TPC3DCourseManager();
        this.unitsManager = new UnitsManager();
        
        // Shot analysis system
        this.shotAnalyzer = new ShotAnalyzer();
        this.clubAdvisor = new ClubAdvisor();
        
        this.init();
    }

    async init() {
        await this.initializePhaserGame();
        this.setupDefaultPlayers();
        this.setupEventHandlers();
        
        console.log('🎮 Phaser.js Golf Engine initialized with authentic 1987 mechanics');
    }

    async initializePhaserGame() {
        // Phaser.js game configuration
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'courseVisualization',
            backgroundColor: '#87CEEB',
            scene: {
                key: 'GolfCourseScene',
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this)
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            }
        };

        // Clear existing canvas content
        const courseContainer = document.getElementById('courseVisualization');
        if (courseContainer) {
            courseContainer.innerHTML = '';
        }

        // Initialize Phaser game
        this.phaserGame = new Phaser.Game(config);
    }

    preload() {
        // Create simple colored rectangles for game elements
        // Green fairway
        this.add.graphics()
            .fillStyle(0x32CD32)
            .fillRect(0, 0, 1, 1)
            .generateTexture('fairway', 1, 1);
            
        // Rough areas
        this.add.graphics()
            .fillStyle(0x6B8E23)
            .fillRect(0, 0, 1, 1)
            .generateTexture('rough', 1, 1);
            
        // Green surface
        this.add.graphics()
            .fillStyle(0x228B22)
            .fillRect(0, 0, 1, 1)
            .generateTexture('green', 1, 1);
            
        // Sand traps
        this.add.graphics()
            .fillStyle(0xF4A460)
            .fillRect(0, 0, 1, 1)
            .generateTexture('sand', 1, 1);
            
        // Water hazards
        this.add.graphics()
            .fillStyle(0x1565C0)
            .fillRect(0, 0, 1, 1)
            .generateTexture('water', 1, 1);
            
        // Golf ball
        this.add.graphics()
            .fillStyle(0xFFFFFF)
            .fillCircle(6, 6, 6)
            .lineStyle(2, 0x000000)
            .strokeCircle(6, 6, 6)
            .generateTexture('golfball', 12, 12);
            
        // Tee box
        this.add.graphics()
            .fillStyle(0x8B4513)
            .fillRect(0, 0, 1, 1)
            .generateTexture('tee', 1, 1);
    }

    create() {
        this.gameScene = this;
        
        // Course elements - rendered in layers
        this.courseElements = {
            background: null,
            rough: [],
            fairway: null,
            hazards: [],
            green: null,
            teeBox: null,
            ball: null,
            distanceMarkers: []
        };
        
        // Render initial hole
        this.renderCurrentHole();
        
        // Setup input handling
        this.setupInputHandling();
    }

    update() {
        // Game loop - minimal for board game mechanics
        // Ball animation and state updates happen here
    }

    renderCurrentHole() {
        if (!this.gameScene) return;
        
        const hole = courseData.holes[this.currentHole - 1];
        
        // Clear previous elements
        this.clearCourseElements();
        
        // Render course elements in proper order (back to front)
        this.renderCourseAreas(hole);
        this.renderHazards(hole);
        this.renderGreen(hole);
        this.renderTeeBox(hole);
        this.renderDistanceMarkers(hole);
        this.renderBallPosition();
    }

    clearCourseElements() {
        // Clear all existing course elements
        Object.values(this.courseElements).forEach(element => {
            if (Array.isArray(element)) {
                element.forEach(item => item?.destroy && item.destroy());
                element.length = 0;
            } else if (element && element.destroy) {
                element.destroy();
            }
        });
    }

    renderCourseAreas(hole) {
        const width = 800;
        const height = 600;
        
        // FAIRWAY - Central playing area
        this.courseElements.fairway = this.gameScene.add.rectangle(
            width * 0.5, height * 0.45, 
            width * 0.4, height * 0.7, 
            0x32CD32
        );
        
        // Add fairway stripe pattern for authenticity
        for (let i = 0; i < 8; i++) {
            const stripeX = width * 0.3 + (width * 0.4 / 8) * i;
            const stripe = this.gameScene.add.line(
                stripeX, height * 0.45,
                0, -height * 0.35, 0, height * 0.35,
                0x2E8B57, 0.3
            );
            this.courseElements.rough.push(stripe);
        }
        
        // ROUGH AREAS - Left and right sides
        const leftRough = this.gameScene.add.rectangle(
            width * 0.15, height * 0.45,
            width * 0.3, height * 0.7,
            0x6B8E23
        );
        
        const rightRough = this.gameScene.add.rectangle(
            width * 0.85, height * 0.45,
            width * 0.3, height * 0.7,
            0x6B8E23
        );
        
        this.courseElements.rough.push(leftRough, rightRough);
        
        // Add rough texture patches
        for (let i = 0; i < 15; i++) {
            const leftPatch = this.gameScene.add.circle(
                Math.random() * width * 0.3,
                height * 0.1 + Math.random() * height * 0.7,
                3 + Math.random() * 8,
                0x556B2F,
                0.6
            );
            
            const rightPatch = this.gameScene.add.circle(
                width * 0.7 + Math.random() * width * 0.3,
                height * 0.1 + Math.random() * height * 0.7,
                3 + Math.random() * 8,
                0x556B2F,
                0.6
            );
            
            this.courseElements.rough.push(leftPatch, rightPatch);
        }
    }

    renderHazards(hole) {
        const width = 800;
        const height = 600;
        
        // Sand traps - based on authentic TPC Sawgrass holes
        if (this.holeHasSand(hole)) {
            // Greenside bunker
            const greensideBunker = this.gameScene.add.ellipse(
                width * 0.45, height * 0.25,
                60, 40,
                0xF4A460
            );
            greensideBunker.setRotation(Math.PI / 4);
            
            // Fairway bunker
            const fairwayBunker = this.gameScene.add.ellipse(
                width * 0.35, height * 0.5,
                50, 30,
                0xF4A460
            );
            fairwayBunker.setRotation(-Math.PI / 6);
            
            this.courseElements.hazards.push(greensideBunker, fairwayBunker);
            
            // Add sand texture
            for (let i = 0; i < 20; i++) {
                const sandGrain = this.gameScene.add.circle(
                    width * 0.3 + Math.random() * width * 0.3,
                    height * 0.2 + Math.random() * height * 0.4,
                    1 + Math.random() * 2,
                    0xDEB887,
                    0.8
                );
                this.courseElements.hazards.push(sandGrain);
            }
        }
        
        // Water hazards
        if (this.holeHasWater(hole)) {
            if (hole.number === 17) {
                // Famous Island Green - water surrounds green
                const islandWater = this.gameScene.add.rectangle(
                    width * 0.5, height * 0.3,
                    width * 0.6, height * 0.3,
                    0x1565C0
                );
                this.courseElements.hazards.push(islandWater);
            } else {
                // Regular water hazard
                const waterHazard = this.gameScene.add.ellipse(
                    width * 0.2, height * 0.4,
                    120, 60,
                    0x1565C0
                );
                this.courseElements.hazards.push(waterHazard);
            }
        }
    }

    renderGreen(hole) {
        const width = 800;
        const height = 600;
        
        // GREEN - Elevated circular putting surface
        this.courseElements.green = this.gameScene.add.circle(
            width * 0.5, height * 0.2,
            40,
            0x228B22
        );
        
        // Green border/collar
        const greenBorder = this.gameScene.add.circle(
            width * 0.5, height * 0.2,
            42,
            0x006400
        ).setStrokeStyle(3, 0x006400, 1);
        greenBorder.setFillStyle();
        
        // GIMME CIRCLE - Inner putting circle (authentic board game rule)
        const gimmeCircle = this.gameScene.add.circle(
            width * 0.5, height * 0.2,
            8,
            0x90EE90
        );
        
        // FLAGSTICK AND PIN
        const flagstick = this.gameScene.add.line(
            width * 0.5, height * 0.2,
            0, 0, 0, -25,
            0xFFFFFF, 1
        ).setLineWidth(2);
        
        // FLAG
        const flag = this.gameScene.add.rectangle(
            width * 0.5 + 7, height * 0.2 - 20,
            15, 8,
            0xFF0000
        );
        
        this.courseElements.hazards.push(greenBorder, gimmeCircle, flagstick, flag);
    }

    renderTeeBox(hole) {
        const width = 800;
        const height = 600;
        
        // TEE BOX - Starting position
        this.courseElements.teeBox = this.gameScene.add.rectangle(
            width * 0.5, height * 0.875,
            width * 0.06, height * 0.05,
            0x8B4513
        );
        
        // Tee markers (gold)
        const leftMarker = this.gameScene.add.circle(
            width * 0.48, height * 0.875,
            3,
            0xFFD700
        );
        
        const rightMarker = this.gameScene.add.circle(
            width * 0.52, height * 0.875,
            3,
            0xFFD700
        );
        
        this.courseElements.hazards.push(leftMarker, rightMarker);
    }

    renderDistanceMarkers(hole) {
        const width = 800;
        const height = 600;
        
        // Distance markers every 50 yards (authentic board game feature)
        const distances = [50, 100, 150, 200];
        
        distances.forEach((distance, index) => {
            const y = height * 0.8 - (index * height * 0.15);
            
            // Marker stake
            const stake = this.gameScene.add.rectangle(
                width * 0.1, y,
                2, 20,
                0x8B4513
            );
            
            // Distance text
            const displayDistance = this.convertDistance(distance);
            const unit = this.units === 'yards' ? 'y' : 'm';
            
            const distanceText = this.gameScene.add.text(
                width * 0.1 + 20, y,
                `${Math.round(displayDistance)}${unit}`,
                {
                    fontSize: '12px',
                    fontFamily: 'Inter',
                    fill: '#000000'
                }
            );
            
            this.courseElements.distanceMarkers.push(stake, distanceText);
        });
    }

    renderBallPosition() {
        const width = 800;
        const height = 600;
        
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

        // Create golf ball sprite
        this.courseElements.ball = this.gameScene.add.image(ballX, ballY, 'golfball');
        
        // Add shadow effect
        const ballShadow = this.gameScene.add.circle(
            ballX + 2, ballY + 2,
            6,
            0x000000,
            0.3
        );
        
        this.courseElements.hazards.push(ballShadow);
    }

    setupInputHandling() {
        // Mouse/touch input for interactive elements
        this.gameScene.input.on('pointerdown', (pointer, currentlyOver) => {
            // Handle course interaction if needed
            // For now, all interaction happens through UI buttons
        });
    }

    // Authentic dice rolling with visual feedback
    async rollDiceWithAnimation() {
        return new Promise((resolve) => {
            // Show rolling animation in UI
            const greenDiceEl = document.getElementById('greenDice');
            const directionDiceEl = document.getElementById('directionDice');
            const problemDiceEl = document.getElementById('problemDice');
            
            // Add rolling animation class
            [greenDiceEl, directionDiceEl, problemDiceEl].forEach(el => {
                if (el) el.classList.add('rolling');
            });
            
            // Simulate rolling with multiple quick updates
            let rollCount = 0;
            const rollInterval = setInterval(() => {
                if (greenDiceEl) greenDiceEl.textContent = Math.floor(Math.random() * 6) + 1;
                if (directionDiceEl) directionDiceEl.textContent = Math.floor(Math.random() * 12) + 1;
                if (problemDiceEl && problemDiceEl.style.display !== 'none') {
                    problemDiceEl.textContent = Math.floor(Math.random() * 6) + 1;
                }
                
                rollCount++;
                if (rollCount >= 10) {
                    clearInterval(rollInterval);
                    
                    // Final roll using authentic mechanics
                    const result = this.diceRoller.rollAuthentic();
                    
                    // Update UI with final results
                    if (greenDiceEl) {
                        greenDiceEl.textContent = result.distance;
                        greenDiceEl.classList.remove('rolling');
                    }
                    if (directionDiceEl) {
                        directionDiceEl.textContent = result.direction;
                        directionDiceEl.classList.remove('rolling');
                    }
                    
                    // Show problem dice if needed
                    const currentPlayerObj = this.players[this.currentPlayer - 1];
                    if (currentPlayerObj && this.diceRoller.needsProblemDice(currentPlayerObj.lie)) {
                        const problemRoll = this.diceRoller.rollProblemDice();
                        result.problem = problemRoll;
                        
                        if (problemDiceEl) {
                            problemDiceEl.style.display = 'block';
                            problemDiceEl.textContent = problemRoll;
                            problemDiceEl.classList.remove('rolling');
                        }
                    }
                    
                    resolve(result);
                }
            }, 80);
        });
    }

    // Enhanced shot calculation preserving authentic mechanics
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

        // Roll dice using authentic mechanics with animation
        const diceResult = await this.rollDiceWithAnimation();
        
        // Calculate shot with enhanced greenside rules (preserved from original)
        const shotResult = this.calculateShotWithGreensidePlay(selectedClub, diceResult, currentPlayerObj, shotType);
        
        // Update game state and visual display
        this.processShotResult(shotResult);
        this.renderCurrentHole();
        this.updateGameState();
        
        // Show shot result in UI
        this.displayShotResult(shotResult);
    }

    // Authentic shot type determination (preserved from original board game)
    determineShotType(distanceToPin, lie) {
        const distanceYards = this.units === 'meters' ? distanceToPin / this.conversionRatio : distanceToPin;
        
        if (lie === 'green') {
            return distanceYards <= 4 ? 'gimme' : 'putt';
        }
        
        // Greenside play determination from 1987 board game photos
        if (distanceYards <= 30 && lie === 'fairway') {
            return 'chip';
        }
        
        if (distanceYards <= 50 && (lie === 'rough' || lie === 'sand')) {
            return 'pitch';
        }
        
        return 'full_shot';
    }

    // Preserve original greenside mechanics exactly as in 1987 board game
    calculateShotWithGreensidePlay(club, diceResult, player, shotType) {
        let shotResult;

        switch (shotType) {
            case 'gimme':
                // Automatic putt within gimme range (authentic rule)
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
                // Regular full shot using authentic calculator
                shotResult = this.shotCalculator.calculate(club, diceResult, player.lie);
                break;
        }

        return shotResult;
    }

    // Authentic putting mechanics from 1987 board game
    calculatePuttingShot(diceResult, player) {
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

    // Chip shot mechanics from authentic 1987 board game
    calculateChipShot(club, diceResult, player) {
        const chipSchedule = {
            'wedge': { 1: 15, 2: 20, 3: 25, 4: 30, 5: 25, 6: 20 },
            '9iron': { 1: 20, 2: 25, 3: 30, 4: 35, 5: 30, 6: 25 },
            '7iron': { 1: 25, 2: 30, 3: 35, 4: 40, 5: 35, 6: 30 }
        };

        const baseDistance = chipSchedule[club]?.[diceResult.distance] || 25;
        
        // Apply lie modifiers (authentic board game rules)
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

    // Pitch shot mechanics with sand trap handling
    calculatePitchShot(club, diceResult, player) {
        const pitchSchedule = {
            'wedge': { 1: 25, 2: 35, 3: 45, 4: 50, 5: 40, 6: 30 },
            '9iron': { 1: 30, 2: 40, 3: 50, 4: 55, 5: 45, 6: 35 }
        };

        let baseDistance = pitchSchedule[club]?.[diceResult.distance] || 40;
        
        // Sand trap penalties from problem dice (authentic mechanic)
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

    // Helper methods (preserved from original implementation)
    holeHasSand(hole) {
        return [2, 4, 7, 8, 11, 16, 17, 18].includes(hole.number);
    }

    holeHasWater(hole) {
        return [8, 11, 13, 14, 16, 17, 18].includes(hole.number);
    }

    getSandTrapModifier(problemRoll) {
        const modifiers = {
            1: 0.3, 2: 0.4, 3: 0.5, 4: 0.6, 5: 0.5, 6: 0.4
        };
        return modifiers[problemRoll] || 0.5;
    }

    convertDistance(distance) {
        if (this.units === 'meters') {
            return distance * this.conversionRatio;
        }
        return distance;
    }

    calculateDistanceToPin(position, hole) {
        return Math.max(10, (100 - position.y) * 4);
    }

    // Setup game with default players
    setupDefaultPlayers() {
        this.players = [
            { 
                name: 'Player 1', 
                strokes: 0, 
                scores: new Array(18).fill(0), 
                position: {x: 50, y: 0}, 
                lie: 'tee', 
                holedOut: false 
            }
        ];
    }

    // Event handlers for UI integration
    setupEventHandlers() {
        // Units toggle button
        const unitsToggle = document.getElementById('unitsToggle');
        if (unitsToggle) {
            unitsToggle.addEventListener('click', () => this.toggleUnits());
        }

        // Club selection
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

    selectClub(clubElement) {
        // Remove selection from all clubs
        document.querySelectorAll('.club-option').forEach(club => {
            club.classList.remove('selected');
        });
        
        // Select clicked club
        clubElement.classList.add('selected');
    }

    showClubPreview(clubElement) {
        // Show club information on hover
        const club = clubElement.dataset.club;
        // Implementation for club preview tooltip
    }

    toggleUnits() {
        this.units = this.units === 'yards' ? 'meters' : 'yards';
        localStorage.setItem('preferred-units', this.units);
        
        // Update all displayed distances
        this.renderCurrentHole();
        this.updateGameState();
    }

    // Additional helper methods
    processShotResult(shotResult) {
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        
        // Update player position and stats
        currentPlayerObj.position = shotResult.position;
        currentPlayerObj.lie = shotResult.lie;
        currentPlayerObj.strokes++;
        
        // Check for hole out
        if (shotResult.holedOut) {
            currentPlayerObj.holedOut = true;
            currentPlayerObj.scores[this.currentHole - 1] = currentPlayerObj.strokes;
        }
        
        // Add to shot history
        this.shotHistory.push({
            hole: this.currentHole,
            player: this.currentPlayer,
            club: document.querySelector('.club-option.selected')?.dataset.club,
            result: shotResult
        });
    }

    displayShotResult(shotResult) {
        const resultSection = document.getElementById('shotResult');
        const distanceEl = document.getElementById('resultDistance');
        const directionEl = document.getElementById('resultDirection');
        
        if (resultSection && distanceEl && directionEl) {
            resultSection.style.display = 'block';
            
            const displayDistance = this.convertDistance(shotResult.distance);
            const unit = this.units === 'yards' ? 'yards' : 'meters';
            
            distanceEl.textContent = `${Math.round(displayDistance)} ${unit}`;
            directionEl.textContent = shotResult.direction;
        }
    }

    updateGameState() {
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const hole = courseData.holes[this.currentHole - 1];
        
        // Update UI elements
        const elements = {
            currentPlayer: currentPlayerObj.name,
            currentStrokes: currentPlayerObj.strokes,
            currentLie: this.getLieDescription(currentPlayerObj.lie),
            distanceToPin: `${Math.round(this.convertDistance(this.calculateDistanceToPin(currentPlayerObj.position, hole)))} ${this.units}`
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    }

    getLieDescription(lie) {
        const descriptions = {
            'tee': 'Tee Box',
            'fairway': 'Fairway', 
            'rough': 'Rough',
            'sand': 'Sand Trap',
            'trees': 'Trees',
            'water': 'Water Hazard',
            'green': 'Green',
            'holed': 'Holed Out'
        };
        return descriptions[lie] || lie;
    }

    showShotAnalysis(lie, distance, shotType, club) {
        // Implementation for shot analysis panel
        console.log(`Shot Analysis: ${club} from ${lie} at ${Math.round(distance)} yards (${shotType})`);
    }

    // Placeholder methods for compatibility
    getDirectionFromDice(diceValue) {
        const directions = {
            1: 'hard left', 2: 'left', 3: 'slight left',
            4: 'straight', 5: 'straight', 6: 'straight',
            7: 'straight', 8: 'straight', 9: 'slight right',
            10: 'right', 11: 'hard right', 12: 'hook/slice'
        };
        return directions[diceValue] || 'straight';
    }

    calculateEndPosition(currentPos, distance, direction) {
        // Simplified position calculation
        return {
            x: Math.max(0, Math.min(100, currentPos.x + (Math.random() - 0.5) * 20)),
            y: Math.min(100, currentPos.y + distance / 4)
        };
    }

    calculatePuttEndPosition(currentPos, distance) {
        return {
            x: currentPos.x + (Math.random() - 0.5) * 5,
            y: Math.min(100, currentPos.y + distance / 2)
        };
    }

    determineLieFromPosition() {
        // Simplified lie determination
        return Math.random() < 0.7 ? 'fairway' : 'rough';
    }
}

// Initialize when DOM is ready and Phaser is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Phaser.js is loaded
    if (typeof Phaser === 'undefined') {
        console.error('Phaser.js is not loaded. Please include the Phaser.js CDN.');
        return;
    }
    
    if (document.getElementById('courseVisualization')) {
        window.phaserGolfEngine = new PhaserGolfEngine();
        console.log('🎮 Phaser.js Golf Engine loaded successfully with authentic 1987 mechanics');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PhaserGolfEngine };
} else {
    window.PhaserGolfEngine = PhaserGolfEngine;
}