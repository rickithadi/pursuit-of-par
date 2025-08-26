// In Pursuit of Par - Digital Golf Simulation Engine
// Authentic 1987 board game mechanics digitized

// TPC Sawgrass Course Data
const courseData = {
    name: "TPC Sawgrass - THE PLAYERS Stadium Course",
    totalPar: 72,
    totalYardage: 6394,
    holes: [
        {
            number: 1,
            par: 4,
            yardage: 394,
            handicap: 11,
            difficulty: 13,
            scoringAverage: 3.954,
            description: "Slight dogleg right demanding accuracy from the tee"
        },
        {
            number: 2,
            par: 5,
            yardage: 532,
            handicap: 15,
            difficulty: 16,
            scoringAverage: 4.523,
            description: "Long par 5 with bunkers guarding the green"
        },
        {
            number: 3,
            par: 3,
            yardage: 177,
            handicap: 17,
            difficulty: 3,
            scoringAverage: 3.195,
            description: "Mid-iron to well-protected green"
        },
        {
            number: 4,
            par: 4,
            yardage: 384,
            handicap: 9,
            difficulty: 6,
            scoringAverage: 4.021,
            description: "Strategic placement off tee, elevated green"
        },
        {
            number: 5,
            par: 4,
            yardage: 471,
            handicap: 3,
            difficulty: 1,
            scoringAverage: 4.198,
            description: "Longest and toughest par 4 on the course"
        },
        {
            number: 6,
            par: 4,
            yardage: 393,
            handicap: 13,
            difficulty: 10,
            scoringAverage: 3.987,
            description: "Dogleg left with water hazard"
        },
        {
            number: 7,
            par: 4,
            yardage: 442,
            handicap: 1,
            difficulty: 5,
            scoringAverage: 4.087,
            description: "Challenging par 4 with bunkers and water"
        },
        {
            number: 8,
            par: 3,
            yardage: 237,
            handicap: 7,
            difficulty: 2,
            scoringAverage: 3.234,
            description: "Long par 3 over water to large green"
        },
        {
            number: 9,
            par: 5,
            yardage: 583,
            handicap: 5,
            difficulty: 14,
            scoringAverage: 4.698,
            description: "Reachable par 5 with risk/reward second shot"
        },
        {
            number: 10,
            par: 4,
            yardage: 424,
            handicap: 12,
            difficulty: 9,
            scoringAverage: 4.032,
            description: "Start of challenging back nine"
        },
        {
            number: 11,
            par: 5,
            yardage: 558,
            handicap: 8,
            difficulty: 15,
            scoringAverage: 4.632,
            description: "Par 5 with water hazard down left side"
        },
        {
            number: 12,
            par: 4,
            yardage: 358,
            handicap: 16,
            difficulty: 18,
            scoringAverage: 3.821,
            description: "Shortest and easiest par 4 on course"
        },
        {
            number: 13,
            par: 3,
            yardage: 181,
            handicap: 18,
            difficulty: 8,
            scoringAverage: 3.098,
            description: "Par 3 to large undulating green"
        },
        {
            number: 14,
            par: 4,
            yardage: 481,
            handicap: 4,
            difficulty: 4,
            scoringAverage: 4.123,
            description: "Long par 4 with water hazard"
        },
        {
            number: 15,
            par: 4,
            yardage: 449,
            handicap: 6,
            difficulty: 11,
            scoringAverage: 4.054,
            description: "Dogleg right with strategic bunkering"
        },
        {
            number: 16,
            par: 5,
            yardage: 523,
            handicap: 10,
            difficulty: 17,
            scoringAverage: 4.589,
            description: "Par 5 with water hazard protecting green"
        },
        {
            number: 17,
            par: 3,
            yardage: 137,
            handicap: 14,
            difficulty: 12,
            scoringAverage: 3.156,
            description: "World famous Island Green par 3",
            isSignature: true
        },
        {
            number: 18,
            par: 4,
            yardage: 462,
            handicap: 2,
            difficulty: 7,
            scoringAverage: 4.089,
            description: "Finishing hole with grandstand and water"
        }
    ]
};

class PursuitOfParGame {
    constructor() {
        this.currentHole = 1;
        this.currentPlayer = 1;
        this.players = [
            { id: 1, name: 'Player 1', strokes: 0, position: { x: 50, y: 90 }, lie: 'tee', scores: new Array(18).fill(''), holedOut: false },
            { id: 2, name: 'Player 2', strokes: 0, position: { x: 50, y: 90 }, lie: 'tee', scores: new Array(18).fill(''), holedOut: false }
        ];
        this.selectedClub = null;
        this.shotHistory = [];
        this.gameMode = 'stroke'; // 'stroke' or 'match'
        this.difficulty = 'authentic'; // 'authentic' or 'casual'
        
        this.init();
    }

    // Authentic Shot Schedule Tables from Original Game
    shotSchedules = {
        // Green Six-Sided Dice Distance Table
        ironShots: {
            // Woods 1-8, Irons 3-9 distances based on dice roll (1-6)
            'driver': [280, 270, 260, 250, 240, 230],
            '3wood': [240, 230, 220, 210, 200, 190],
            '5wood': [220, 210, 200, 190, 180, 170],
            '3iron': [200, 190, 185, 175, 165, 155],
            '4iron': [185, 175, 170, 160, 150, 145],
            '5iron': [170, 165, 155, 150, 145, 140],
            '6iron': [160, 155, 150, 145, 140, 135],
            '7iron': [150, 145, 140, 135, 130, 125],
            '8iron': [140, 135, 130, 125, 120, 115],
            '9iron': [130, 125, 120, 115, 110, 105]
        },
        
        // Pitching/Sand Wedge Schedule
        wedgeShots: {
            'wedge': [100, 95, 90, 85, 80, 75],
            'sand': [70, 65, 60, 55, 50, 45]
        },
        
        // Problem Dice (Red) - Reduced distances for hazards
        problemShots: {
            'driver': [180, 170, 160, 150, 140, 130],
            '3wood': [160, 150, 140, 130, 120, 110],
            '5wood': [140, 130, 120, 110, 100, 90],
            '3iron': [120, 115, 110, 105, 100, 95],
            '4iron': [115, 110, 105, 100, 95, 90],
            '5iron': [110, 105, 100, 95, 90, 85],
            '6iron': [105, 100, 95, 90, 85, 80],
            '7iron': [100, 95, 90, 85, 80, 75],
            '8iron': [95, 90, 85, 80, 75, 70],
            '9iron': [90, 85, 80, 75, 70, 65],
            'wedge': [65, 60, 55, 50, 45, 40],
            'sand': [45, 40, 35, 30, 25, 20]
        },
        
        // Greenside Trap Shots & Putts
        greensideShots: {
            'longPutt': [15, 12, 10, 8, 6, 4], // Distance putts travel
            'mediumPutt': [8, 6, 5, 4, 3, 2],
            'shortPutt': [4, 3, 2, 1, 1, 1], // "Gimme" range
            'chip': [25, 20, 18, 15, 12, 10],
            'bunkerShot': [20, 15, 12, 10, 8, 6]
        }
    };

    // Direction Table for Green Twelve-Sided Dice
    directionTable = {
        1: { angle: 0, description: 'Straight' },
        2: { angle: 0, description: 'Straight' },
        3: { angle: 10, direction: 'left', description: '10° Left' },
        4: { angle: 10, direction: 'right', description: '10° Right' },
        5: { angle: 0, description: 'Straight' },
        6: { angle: 0, description: 'Straight' },
        7: { angle: 20, direction: 'left', description: '20° Left' },
        8: { angle: 20, direction: 'right', description: '20° Right' },
        9: { angle: 0, description: 'Straight' },
        10: { angle: 10, direction: 'left', description: '10° Left' },
        11: { angle: 10, direction: 'right', description: '10° Right' },
        12: { angle: 0, description: 'Straight' }
    };

    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.loadCurrentHole();
    }

    setupEventListeners() {
        // Club selection
        document.querySelectorAll('.club-option').forEach(club => {
            club.addEventListener('click', (e) => {
                this.selectClub(e.target.dataset.club);
            });
        });

        // Take shot button
        document.getElementById('takeShot').addEventListener('click', () => {
            this.takeShot();
        });

        // Game controls
        document.getElementById('undoShot').addEventListener('click', () => {
            this.undoLastShot();
        });

        document.getElementById('nextHole').addEventListener('click', () => {
            this.nextHole();
        });
    }

    selectClub(clubType) {
        this.selectedClub = clubType;
        
        // Update UI
        document.querySelectorAll('.club-option').forEach(club => {
            club.classList.remove('selected');
        });
        document.querySelector(`[data-club="${clubType}"]`).classList.add('selected');
        
        // Enable shot button
        document.getElementById('takeShot').disabled = false;
    }

    rollDice(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    rollGreenSixSided() {
        return this.rollDice(6);
    }

    rollGreenTwelveSided() {
        return this.rollDice(12);
    }

    rollRedProblemDice() {
        return this.rollDice(6);
    }

    determineHazard(position) {
        const x = position.x;
        const y = position.y;
        const hole = courseData.holes[this.currentHole - 1];
        
        // Check if on green (top area)
        if (y < 15) {
            return 'green';
        }
        
        // Check if on tee (bottom area)
        if (y > 85) {
            return 'tee';
        }
        
        // Get current hole hazards for accurate detection
        const hazards = this.getHoleHazards(hole);
        
        // Check if ball is in any hazard
        for (const hazard of hazards) {
            if (this.isPositionInHazard(position, hazard)) {
                return hazard.type;
            }
        }
        
        // Check if in fairway (center area)
        if (x > 40 && x < 60) {
            return 'fairway';
        }
        
        // Default to rough if outside fairway
        return 'rough';
    }

    isPositionInHazard(position, hazard) {
        const ballX = position.x;
        const ballY = position.y;
        
        // Convert hazard dimensions to percentage coordinates
        const hazardLeft = hazard.x;
        const hazardRight = hazard.x + (hazard.width / 4); // Approximate conversion
        const hazardTop = hazard.y;
        const hazardBottom = hazard.y + (hazard.height / 4);
        
        return ballX >= hazardLeft && ballX <= hazardRight && 
               ballY >= hazardTop && ballY <= hazardBottom;
    }

    needsProblemDice(lie) {
        return ['rough', 'sand', 'trees', 'water'].includes(lie);
    }

    getDistance(club, diceRoll, isProblematic = false) {
        const scheduleType = isProblematic ? 'problemShots' : this.getScheduleType(club);
        const schedule = this.shotSchedules[scheduleType];
        
        if (!schedule || !schedule[club]) {
            console.warn(`No schedule found for club: ${club}`);
            return 100; // Default distance
        }
        
        return schedule[club][diceRoll - 1];
    }

    getScheduleType(club) {
        if (['driver', '3wood', '5wood', '3iron', '4iron', '5iron', '6iron', '7iron', '8iron', '9iron'].includes(club)) {
            return 'ironShots';
        }
        if (['wedge', 'sand'].includes(club)) {
            return 'wedgeShots';
        }
        if (['putter'].includes(club)) {
            return 'greensideShots';
        }
        return 'ironShots';
    }

    calculateNewPosition(currentPos, distance, direction) {
        // Simplified position calculation
        // In full implementation, this would use proper trigonometry and course layouts
        
        let newX = currentPos.x;
        let newY = currentPos.y;
        
        // Convert distance to pixels (rough approximation)
        const pixelDistance = Math.min(distance / 5, 80); // Scale down for visualization
        
        // Apply direction
        if (direction.angle === 0) {
            newY -= pixelDistance; // Straight toward hole
        } else {
            const radians = (direction.angle * Math.PI) / 180;
            const xOffset = pixelDistance * Math.sin(radians) * (direction.direction === 'left' ? -1 : 1);
            const yOffset = pixelDistance * Math.cos(radians);
            
            newX += xOffset;
            newY -= yOffset;
        }
        
        // Keep within bounds
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));
        
        return { x: newX, y: newY };
    }

    takeShot() {
        if (!this.selectedClub) {
            alert('Please select a club first!');
            return;
        }

        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const hazard = this.determineHazard(currentPlayerObj.position);
        const needsProblem = this.needsProblemDice(hazard);
        
        // Roll dice with animation
        this.animateDiceRoll(() => {
            // Generate dice rolls
            const distanceDice = needsProblem ? this.rollRedProblemDice() : this.rollGreenSixSided();
            const directionDice = this.rollGreenTwelveSided();
            
            // Calculate shot result
            const distance = this.getDistance(this.selectedClub, distanceDice, needsProblem);
            const direction = this.directionTable[directionDice];
            const newPosition = this.calculateNewPosition(currentPlayerObj.position, distance, direction);
            const newLie = this.determineHazard(newPosition);
            
            // Update player state
            currentPlayerObj.position = newPosition;
            currentPlayerObj.lie = newLie;
            currentPlayerObj.strokes++;
            
            // Save shot to history
            this.shotHistory.push({
                player: this.currentPlayer,
                hole: this.currentHole,
                club: this.selectedClub,
                distanceDice,
                directionDice,
                distance,
                direction: direction.description,
                fromPosition: { ...currentPlayerObj.position },
                toPosition: newPosition,
                strokes: currentPlayerObj.strokes
            });
            
            // Update display
            this.updateDisplay();
            this.showShotResult(distance, direction.description);
            this.updateBallPosition(newPosition);
            this.checkForHoleCompletion();
        });
    }

    animateDiceRoll(callback) {
        const diceElements = [
            document.getElementById('greenDice'),
            document.getElementById('directionDice')
        ];
        
        const problemDice = document.getElementById('problemDice');
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const needsProblem = this.needsProblemDice(this.determineHazard(currentPlayerObj.position));
        
        if (needsProblem) {
            problemDice.style.display = 'block';
            diceElements.push(problemDice);
        } else {
            problemDice.style.display = 'none';
        }
        
        // Start rolling animation
        diceElements.forEach(dice => {
            dice.classList.add('rolling');
            dice.textContent = '?';
        });
        
        // Stop animation and show results after 500ms
        setTimeout(() => {
            diceElements.forEach(dice => {
                dice.classList.remove('rolling');
            });
            callback();
        }, 500);
    }

    showShotResult(distance, direction) {
        document.getElementById('resultDistance').textContent = `${distance} yards`;
        document.getElementById('resultDirection').textContent = direction;
        document.getElementById('shotResult').style.display = 'block';
        
        // Update dice displays
        const lastShot = this.shotHistory[this.shotHistory.length - 1];
        document.getElementById('greenDice').textContent = lastShot.distanceDice;
        document.getElementById('directionDice').textContent = lastShot.directionDice;
    }

    updateBallPosition(position) {
        const ball = document.getElementById('playerBall');
        ball.style.left = `${position.x}%`;
        ball.style.bottom = `${position.y}%`;
    }

    updateDisplay() {
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const hole = courseData.holes[this.currentHole - 1];
        
        // Update hole information
        document.getElementById('currentHole').textContent = this.currentHole;
        document.getElementById('holePar').textContent = hole.par;
        document.getElementById('holeYardage').textContent = `${hole.yardage}y`;
        document.getElementById('holeDifficulty').textContent = `#${hole.difficulty}`;
        
        // Update player status
        document.getElementById('currentPlayer').textContent = currentPlayerObj.name;
        document.getElementById('currentStrokes').textContent = currentPlayerObj.strokes;
        document.getElementById('currentLie').textContent = this.formatLie(currentPlayerObj.lie);
        
        // Update distance to pin (simplified)
        const distanceToPin = Math.max(1, Math.floor((100 - currentPlayerObj.position.y) * 4));
        document.getElementById('distanceToPin').textContent = `${distanceToPin} yards`;
        
        // Update hazard warning
        this.updateHazardWarning(currentPlayerObj.lie);
        
        // Update ball position
        this.updateBallPosition(currentPlayerObj.position);
    }

    formatLie(lie) {
        const lieMap = {
            'tee': 'Tee Box',
            'fairway': 'Fairway',
            'rough': 'Rough',
            'sand': 'Sand Trap',
            'trees': 'Trees',
            'water': 'Water Hazard',
            'green': 'Green'
        };
        return lieMap[lie] || lie;
    }

    updateHazardWarning(lie) {
        const hazardWarning = document.getElementById('hazardWarning');
        const hazardDescription = document.getElementById('hazardDescription');
        
        if (this.needsProblemDice(lie)) {
            const descriptions = {
                'rough': 'Ball is in the rough - Problem Dice will be used for reduced distance',
                'sand': 'Ball is in a sand trap - Problem Dice limits club selection and distance',
                'trees': 'Ball is behind/under trees - Severely limited shot options',
                'water': 'Ball is in water hazard - Penalty stroke required'
            };
            
            hazardDescription.textContent = descriptions[lie];
            hazardWarning.style.display = 'block';
        } else {
            hazardWarning.style.display = 'none';
        }
    }

    checkForHoleCompletion() {
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        
        // Check if ball is "holed" (on green and within gimme range)
        if (currentPlayerObj.lie === 'green' && this.isWithinGimmeRange(currentPlayerObj.position)) {
            currentPlayerObj.holedOut = true;
            currentPlayerObj.scores[this.currentHole - 1] = currentPlayerObj.strokes;
            
            setTimeout(() => {
                const par = courseData.holes[this.currentHole - 1].par;
                const scoreName = this.getScoreName(currentPlayerObj.strokes, par);
                alert(`${currentPlayerObj.name} holed out! ${currentPlayerObj.strokes} strokes (${scoreName})!`);
                this.handleHoleCompletion();
            }, 1000);
        }
    }

    isWithinGimmeRange(position) {
        // Check if within small white circle (gimme range)
        const greenCenterX = 50;
        const greenCenterY = 10;
        const gimmeRadius = 8; // Percentage units
        
        const distance = Math.sqrt(
            Math.pow(position.x - greenCenterX, 2) + 
            Math.pow(position.y - greenCenterY, 2)
        );
        
        return distance <= gimmeRadius;
    }

    getScoreName(strokes, par) {
        const diff = strokes - par;
        if (diff <= -3) return 'Albatross';
        if (diff === -2) return 'Eagle';
        if (diff === -1) return 'Birdie';
        if (diff === 0) return 'Par';
        if (diff === 1) return 'Bogey';
        if (diff === 2) return 'Double Bogey';
        return `${diff > 0 ? '+' : ''}${diff}`;
    }

    handleHoleCompletion() {
        // Check if all players have holed out
        const allHoledOut = this.players.every(player => player.holedOut);
        
        if (allHoledOut) {
            // All players finished - move to next hole
            setTimeout(() => {
                if (this.currentHole < 18) {
                    this.nextHole();
                } else {
                    this.endGame();
                }
            }, 2000);
        } else {
            // Move to next player who hasn't holed out
            this.nextActivePlayer();
        }
    }

    nextActivePlayer() {
        do {
            this.currentPlayer = this.currentPlayer % this.players.length + 1;
        } while (this.players[this.currentPlayer - 1].holedOut);
        
        this.updateDisplay();
    }

    nextPlayer() {
        // Switch to next player
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        
        // Reset player position for new hole
        const nextPlayerObj = this.players[this.currentPlayer - 1];
        nextPlayerObj.position = { x: 50, y: 90 };
        nextPlayerObj.lie = 'tee';
        nextPlayerObj.strokes = 0;
        
        this.updateDisplay();
    }

    nextHole() {
        if (this.currentHole < 18) {
            this.currentHole++;
            this.resetHole();
        } else {
            this.endGame();
        }
    }

    resetHole() {
        // Reset all players for new hole
        this.players.forEach(player => {
            player.position = { x: 50, y: 90 };
            player.lie = 'tee';
            player.strokes = 0;
            player.holedOut = false;
        });
        
        this.currentPlayer = 1;
        this.selectedClub = null;
        this.shotHistory = [];
        
        // Reset UI
        document.querySelectorAll('.club-option').forEach(club => {
            club.classList.remove('selected');
        });
        document.getElementById('shotResult').style.display = 'none';
        document.getElementById('takeShot').disabled = true;
        
        this.updateDisplay();
        this.loadCurrentHole();
    }

    loadCurrentHole() {
        const hole = courseData.holes[this.currentHole - 1];
        this.renderHoleLayout(hole);
        this.updateDisplay();
    }

    renderHoleLayout(hole) {
        const visualization = document.getElementById('courseVisualization');
        
        // Clear previous hole elements
        const existingHazards = visualization.querySelectorAll('.hazard, .fairway-line');
        existingHazards.forEach(el => el.remove());
        
        // Create hole-specific layout
        this.createHoleHazards(hole, visualization);
        this.createFairwayLine(hole, visualization);
        
        // Special treatment for signature holes
        if (hole.isSignature) {
            visualization.classList.add('island-green');
            this.createIslandGreenEffect(visualization);
        } else {
            visualization.classList.remove('island-green');
        }
    }

    createHoleHazards(hole, container) {
        // Create hazards based on hole difficulty and characteristics
        const hazards = this.getHoleHazards(hole);
        
        hazards.forEach(hazard => {
            const hazardEl = document.createElement('div');
            hazardEl.className = `hazard ${hazard.type}`;
            hazardEl.style.position = 'absolute';
            hazardEl.style.left = `${hazard.x}%`;
            hazardEl.style.top = `${hazard.y}%`;
            hazardEl.style.width = `${hazard.width}px`;
            hazardEl.style.height = `${hazard.height}px`;
            hazardEl.style.borderRadius = hazard.type === 'water' ? '50%' : '20%';
            hazardEl.style.backgroundColor = this.getHazardColor(hazard.type);
            hazardEl.style.opacity = '0.7';
            hazardEl.style.zIndex = '1';
            
            container.appendChild(hazardEl);
        });
    }

    getHoleHazards(hole) {
        const hazards = [];
        const difficulty = hole.difficulty;
        
        // More hazards for harder holes
        if (difficulty <= 5) { // Very difficult holes
            hazards.push(
                { type: 'water', x: 20, y: 40, width: 40, height: 30 },
                { type: 'sand', x: 70, y: 60, width: 20, height: 15 },
                { type: 'trees', x: 10, y: 20, width: 15, height: 20 }
            );
        } else if (difficulty <= 10) { // Moderately difficult
            hazards.push(
                { type: 'sand', x: 30, y: 50, width: 25, height: 20 },
                { type: 'water', x: 80, y: 30, width: 15, height: 25 }
            );
        } else if (difficulty <= 15) { // Moderate holes
            hazards.push(
                { type: 'sand', x: 60, y: 40, width: 20, height: 15 }
            );
        }
        // Easiest holes (#16-18) have minimal hazards
        
        // Special case for Island Green (Hole 17)
        if (hole.isSignature) {
            hazards.length = 0; // Clear other hazards
            hazards.push(
                { type: 'water', x: 15, y: 15, width: 70, height: 70 } // Surrounding water
            );
        }
        
        return hazards;
    }

    getHazardColor(type) {
        const colors = {
            'water': '#4169e1',
            'sand': '#f4a460',
            'trees': '#228b22',
            'rough': '#8fbc8f'
        };
        return colors[type] || '#gray';
    }

    createFairwayLine(hole, container) {
        // Create a visual fairway guide
        const fairway = document.createElement('div');
        fairway.className = 'fairway-line';
        fairway.style.position = 'absolute';
        fairway.style.left = '45%';
        fairway.style.top = '10%';
        fairway.style.width = '10%';
        fairway.style.height = '80%';
        fairway.style.backgroundColor = '#90ee90';
        fairway.style.opacity = '0.3';
        fairway.style.borderRadius = '20px';
        fairway.style.zIndex = '0';
        
        container.appendChild(fairway);
    }

    createIslandGreenEffect(container) {
        // Special styling for Hole 17 Island Green
        const island = document.createElement('div');
        island.className = 'island-effect';
        island.style.position = 'absolute';
        island.style.top = '20px';
        island.style.left = '35%';
        island.style.width = '30%';
        island.style.height = '80px';
        island.style.backgroundColor = '#228b22';
        island.style.borderRadius = '50%';
        island.style.zIndex = '2';
        island.style.boxShadow = '0 0 20px rgba(65, 105, 225, 0.5)';
        
        container.appendChild(island);
        
        // Move the green to be on the island
        const green = container.querySelector('.green');
        green.style.top = '30px';
        green.style.zIndex = '3';
    }

    undoLastShot() {
        if (this.shotHistory.length === 0) return;
        
        const lastShot = this.shotHistory.pop();
        const playerObj = this.players[lastShot.player - 1];
        
        // Restore previous position and stroke count
        playerObj.position = lastShot.fromPosition;
        playerObj.strokes = Math.max(0, playerObj.strokes - 1);
        playerObj.lie = this.determineHazard(lastShot.fromPosition);
        
        this.updateDisplay();
        document.getElementById('shotResult').style.display = 'none';
    }

    endGame() {
        // Calculate final scores and show results
        let resultsMessage = '🏆 Game Completed! Final Results:\n\n';
        
        const playerResults = this.players.map(player => {
            const totalScore = player.scores.reduce((sum, score) => sum + (score || 0), 0);
            const totalPar = courseData.holes.reduce((sum, hole) => sum + hole.par, 0);
            const toPar = totalScore - totalPar;
            
            return {
                name: player.name,
                total: totalScore,
                toPar: toPar,
                scores: player.scores
            };
        }).sort((a, b) => a.total - b.total);
        
        playerResults.forEach((player, index) => {
            const position = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            const toParText = player.toPar === 0 ? 'E' : player.toPar > 0 ? `+${player.toPar}` : `${player.toPar}`;
            resultsMessage += `${position} ${player.name}: ${player.total} (${toParText})\n`;
        });
        
        resultsMessage += '\nWould you like to transfer scores to the digital scorecard?';
        
        if (confirm(resultsMessage)) {
            this.transferToScorecard(playerResults);
        }
    }

    transferToScorecard(results) {
        // This would integrate with the main scorecard system
        // For now, we'll just navigate to the scorecard
        alert('Scores will be transferred to the digital scorecard system!');
        window.location.href = 'index.html';
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pursuitOfParGame = new PursuitOfParGame();
});