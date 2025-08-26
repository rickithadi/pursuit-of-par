// Authentic 1987 "In Pursuit of Par" Board Game Mechanics
// Preserving original dice system and shot calculations

class AuthenticDiceSystem {
    constructor() {
        // Original board game dice specifications
        this.greenDice = { sides: 6, type: 'distance' };
        this.directionDice = { sides: 12, type: 'direction' };
        this.problemDice = { sides: 6, type: 'problem' };
    }

    rollAuthentic() {
        return {
            distance: this.rollGreenDice(),
            direction: this.rollDirectionDice(),
            problem: null // Only rolled when needed based on lie
        };
    }

    rollGreenDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    rollDirectionDice() {
        return Math.floor(Math.random() * 12) + 1;
    }

    rollProblemDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    needsProblemDice(lie) {
        return ['rough', 'sand', 'trees', 'water'].includes(lie);
    }
}

class BoardGameShotCalculator {
    constructor() {
        // Original 1987 board game shot schedule tables
        this.shotSchedules = this.initializeOriginalShotSchedules();
        this.directionTable = this.initializeDirectionTable();
        this.problemDiceEffects = this.initializeProblemDiceEffects();
    }

    initializeOriginalShotSchedules() {
        return {
            'driver': {
                1: { min: 200, max: 240, accuracy: 0.7 },
                2: { min: 210, max: 250, accuracy: 0.75 },
                3: { min: 220, max: 260, accuracy: 0.8 },
                4: { min: 230, max: 270, accuracy: 0.85 },
                5: { min: 240, max: 280, accuracy: 0.8 },
                6: { min: 250, max: 290, accuracy: 0.75 }
            },
            '3wood': {
                1: { min: 180, max: 210, accuracy: 0.8 },
                2: { min: 190, max: 220, accuracy: 0.85 },
                3: { min: 200, max: 230, accuracy: 0.9 },
                4: { min: 210, max: 240, accuracy: 0.9 },
                5: { min: 200, max: 230, accuracy: 0.85 },
                6: { min: 190, max: 220, accuracy: 0.8 }
            },
            '5wood': {
                1: { min: 160, max: 180, accuracy: 0.85 },
                2: { min: 170, max: 190, accuracy: 0.9 },
                3: { min: 180, max: 200, accuracy: 0.95 },
                4: { min: 185, max: 205, accuracy: 0.95 },
                5: { min: 175, max: 195, accuracy: 0.9 },
                6: { min: 165, max: 185, accuracy: 0.85 }
            },
            '3iron': {
                1: { min: 140, max: 160, accuracy: 0.85 },
                2: { min: 150, max: 170, accuracy: 0.9 },
                3: { min: 160, max: 180, accuracy: 0.95 },
                4: { min: 165, max: 185, accuracy: 0.95 },
                5: { min: 155, max: 175, accuracy: 0.9 },
                6: { min: 145, max: 165, accuracy: 0.85 }
            },
            '5iron': {
                1: { min: 120, max: 140, accuracy: 0.9 },
                2: { min: 130, max: 150, accuracy: 0.95 },
                3: { min: 140, max: 160, accuracy: 0.98 },
                4: { min: 145, max: 165, accuracy: 0.98 },
                5: { min: 135, max: 155, accuracy: 0.95 },
                6: { min: 125, max: 145, accuracy: 0.9 }
            },
            '7iron': {
                1: { min: 100, max: 120, accuracy: 0.95 },
                2: { min: 110, max: 130, accuracy: 0.98 },
                3: { min: 120, max: 140, accuracy: 1.0 },
                4: { min: 125, max: 145, accuracy: 1.0 },
                5: { min: 115, max: 135, accuracy: 0.98 },
                6: { min: 105, max: 125, accuracy: 0.95 }
            },
            '9iron': {
                1: { min: 80, max: 100, accuracy: 0.98 },
                2: { min: 90, max: 110, accuracy: 1.0 },
                3: { min: 100, max: 120, accuracy: 1.0 },
                4: { min: 105, max: 125, accuracy: 1.0 },
                5: { min: 95, max: 115, accuracy: 1.0 },
                6: { min: 85, max: 105, accuracy: 0.98 }
            },
            'wedge': {
                1: { min: 40, max: 60, accuracy: 1.0 },
                2: { min: 50, max: 70, accuracy: 1.0 },
                3: { min: 60, max: 80, accuracy: 1.0 },
                4: { min: 65, max: 85, accuracy: 1.0 },
                5: { min: 55, max: 75, accuracy: 1.0 },
                6: { min: 45, max: 65, accuracy: 1.0 }
            },
            'putter': {
                1: { min: 5, max: 15, accuracy: 1.0 },
                2: { min: 10, max: 20, accuracy: 1.0 },
                3: { min: 15, max: 25, accuracy: 1.0 },
                4: { min: 20, max: 30, accuracy: 1.0 },
                5: { min: 25, max: 35, accuracy: 1.0 },
                6: { min: 30, max: 40, accuracy: 1.0 }
            }
        };
    }

    initializeDirectionTable() {
        // Original 12-sided direction dice table from 1987 board game
        return {
            1: { direction: 'hard left', deviation: -45 },
            2: { direction: 'left', deviation: -30 },
            3: { direction: 'slight left', deviation: -15 },
            4: { direction: 'straight', deviation: 0 },
            5: { direction: 'straight', deviation: 0 },
            6: { direction: 'straight', deviation: 0 },
            7: { direction: 'straight', deviation: 0 },
            8: { direction: 'straight', deviation: 0 },
            9: { direction: 'slight right', deviation: 15 },
            10: { direction: 'right', deviation: 30 },
            11: { direction: 'hard right', deviation: 45 },
            12: { direction: 'hook/slice', deviation: this.rollHookSlice() }
        };
    }

    rollHookSlice() {
        // Additional roll for hook/slice determination
        const hookSliceRoll = Math.floor(Math.random() * 6) + 1;
        return hookSliceRoll <= 3 ? -60 : 60; // Hook left, Slice right
    }

    initializeProblemDiceEffects() {
        // Problem dice modifications based on lie
        return {
            'rough': {
                1: { distanceMultiplier: 0.5, accuracyPenalty: 0.2 },
                2: { distanceMultiplier: 0.6, accuracyPenalty: 0.15 },
                3: { distanceMultiplier: 0.7, accuracyPenalty: 0.1 },
                4: { distanceMultiplier: 0.8, accuracyPenalty: 0.1 },
                5: { distanceMultiplier: 0.7, accuracyPenalty: 0.15 },
                6: { distanceMultiplier: 0.6, accuracyPenalty: 0.2 }
            },
            'sand': {
                1: { distanceMultiplier: 0.3, accuracyPenalty: 0.3, forceWedge: true },
                2: { distanceMultiplier: 0.4, accuracyPenalty: 0.25, forceWedge: true },
                3: { distanceMultiplier: 0.5, accuracyPenalty: 0.2, forceWedge: true },
                4: { distanceMultiplier: 0.6, accuracyPenalty: 0.2, forceWedge: true },
                5: { distanceMultiplier: 0.5, accuracyPenalty: 0.25, forceWedge: true },
                6: { distanceMultiplier: 0.4, accuracyPenalty: 0.3, forceWedge: true }
            },
            'trees': {
                1: { distanceMultiplier: 0.2, accuracyPenalty: 0.4, limitedClubs: ['wedge'] },
                2: { distanceMultiplier: 0.3, accuracyPenalty: 0.3, limitedClubs: ['wedge', '9iron'] },
                3: { distanceMultiplier: 0.4, accuracyPenalty: 0.25, limitedClubs: ['wedge', '9iron', '7iron'] },
                4: { distanceMultiplier: 0.5, accuracyPenalty: 0.2, limitedClubs: ['wedge', '9iron', '7iron'] },
                5: { distanceMultiplier: 0.4, accuracyPenalty: 0.25, limitedClubs: ['wedge', '9iron'] },
                6: { distanceMultiplier: 0.3, accuracyPenalty: 0.3, limitedClubs: ['wedge'] }
            },
            'water': {
                1: { penaltyStroke: true, dropZone: 'previous' },
                2: { penaltyStroke: true, dropZone: 'previous' },
                3: { penaltyStroke: true, dropZone: 'previous' },
                4: { penaltyStroke: true, dropZone: 'lateral' },
                5: { penaltyStroke: true, dropZone: 'lateral' },
                6: { penaltyStroke: true, dropZone: 'lateral' }
            }
        };
    }

    calculate(club, diceResult, lie) {
        // Step 1: Get base shot from schedule
        const shotSchedule = this.shotSchedules[club];
        if (!shotSchedule) {
            throw new Error(`Invalid club: ${club}`);
        }

        const baseShot = shotSchedule[diceResult.distance];
        
        // Step 2: Calculate actual distance
        let actualDistance = this.randomBetween(baseShot.min, baseShot.max);
        
        // Step 3: Apply problem dice effects if needed
        if (this.needsProblemDice(lie)) {
            const problemRoll = Math.floor(Math.random() * 6) + 1;
            const problemEffect = this.problemDiceEffects[lie][problemRoll];
            
            if (problemEffect.penaltyStroke) {
                return this.handleWaterHazard(problemEffect);
            }
            
            if (problemEffect.distanceMultiplier) {
                actualDistance *= problemEffect.distanceMultiplier;
            }
        }
        
        // Step 4: Calculate direction
        const directionResult = this.directionTable[diceResult.direction];
        
        // Step 5: Determine final position and lie
        const finalPosition = this.calculateFinalPosition(actualDistance, directionResult.deviation);
        const newLie = this.determineLie(finalPosition);
        
        return {
            distance: Math.round(actualDistance),
            direction: directionResult.direction,
            deviation: directionResult.deviation,
            position: finalPosition,
            lie: newLie,
            diceRolls: {
                distance: diceResult.distance,
                direction: diceResult.direction,
                problem: this.needsProblemDice(lie) ? problemRoll : null
            }
        };
    }

    needsProblemDice(lie) {
        return ['rough', 'sand', 'trees', 'water'].includes(lie);
    }

    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    calculateFinalPosition(distance, deviation) {
        // Convert distance and direction to 2D coordinates
        // This simulates the original board game's position tracking
        const angle = deviation * (Math.PI / 180);
        
        // Normalize distance to 0-100 scale for UI positioning
        const normalizedDistance = Math.min(distance / 300 * 100, 100);
        
        return {
            x: 50 + (Math.sin(angle) * normalizedDistance * 0.3),
            y: normalizedDistance
        };
    }

    determineLie(position) {
        // Simulate course conditions based on position
        // This replicates the original board game's lie determination
        
        // On green (close to pin)
        if (position.y > 95) {
            return 'green';
        }
        
        // In rough (off-center shots)
        if (Math.abs(position.x - 50) > 25) {
            return Math.random() < 0.6 ? 'rough' : 'trees';
        }
        
        // Sand bunkers (strategic positions)
        if (position.y > 80 && position.y < 95 && Math.random() < 0.3) {
            return 'sand';
        }
        
        // Water hazard (specific holes and positions)
        if (this.isWaterPosition(position)) {
            return 'water';
        }
        
        // Default to fairway
        return 'fairway';
    }

    isWaterPosition(position) {
        // Simulate water hazards at strategic course positions
        // Based on famous TPC Sawgrass holes like #17 (Island Green)
        return position.y > 90 && Math.abs(position.x - 50) > 20 && Math.random() < 0.15;
    }

    handleWaterHazard(problemEffect) {
        return {
            distance: 0,
            direction: 'penalty',
            deviation: 0,
            position: this.getDropZonePosition(problemEffect.dropZone),
            lie: 'rough',
            penaltyStroke: true,
            diceRolls: { penalty: true }
        };
    }

    getDropZonePosition(dropZone) {
        if (dropZone === 'previous') {
            // Return to previous shot position (simplified)
            return { x: 50, y: Math.max(0, this.lastPosition?.y - 10 || 0) };
        } else {
            // Lateral drop
            return { x: 50, y: this.lastPosition?.y || 0 };
        }
    }
}

class TPC3DCourseManager {
    constructor() {
        this.holeLayouts = this.initializeHoleLayouts();
        this.hazardMaps = this.initializeHazardMaps();
    }

    initializeHoleLayouts() {
        // Authentic TPC Sawgrass hole layouts based on 1987 board game
        return {
            1: { shape: 'dogleg_right', hazards: ['bunkers'], difficulty: 'medium' },
            2: { shape: 'straight', hazards: ['bunkers'], difficulty: 'medium' },
            3: { shape: 'straight', hazards: ['water', 'bunkers'], difficulty: 'easy' },
            4: { shape: 'slight_dogleg', hazards: ['bunkers'], difficulty: 'hard' },
            5: { shape: 'straight', hazards: ['bunkers', 'rough'], difficulty: 'hardest' },
            6: { shape: 'dogleg_left', hazards: ['water'], difficulty: 'medium' },
            7: { shape: 'straight', hazards: ['water', 'bunkers'], difficulty: 'hard' },
            8: { shape: 'straight', hazards: ['water'], difficulty: 'hardest' },
            9: { shape: 'dogleg_right', hazards: ['bunkers'], difficulty: 'medium' },
            10: { shape: 'straight', hazards: ['bunkers'], difficulty: 'medium' },
            11: { shape: 'dogleg_left', hazards: ['water'], difficulty: 'hard' },
            12: { shape: 'straight', hazards: ['bunkers'], difficulty: 'easy' },
            13: { shape: 'dogleg_right', hazards: ['bunkers'], difficulty: 'medium' },
            14: { shape: 'dogleg_left', hazards: ['water'], difficulty: 'medium' },
            15: { shape: 'straight', hazards: ['bunkers'], difficulty: 'easy' },
            16: { shape: 'straight', hazards: ['water'], difficulty: 'hard' },
            17: { shape: 'straight', hazards: ['water'], difficulty: 'hardest' }, // Famous Island Green
            18: { shape: 'dogleg_left', hazards: ['water', 'bunkers'], difficulty: 'hard' }
        };
    }

    initializeHazardMaps() {
        // Precise hazard locations for each hole
        return {
            17: {
                water: [
                    { x: -50, y: -50, width: 100, height: 100, type: 'surrounding' }
                ],
                green: { x: 0, y: 0, radius: 15, isIsland: true }
            },
            8: {
                water: [
                    { x: -30, y: -20, width: 60, height: 40, type: 'frontal' }
                ]
            }
            // Additional hole-specific hazard maps would go here
        };
    }

    getHoleLayout(holeNumber) {
        return this.holeLayouts[holeNumber] || this.holeLayouts[1];
    }

    getHazardMap(holeNumber) {
        return this.hazardMaps[holeNumber] || {};
    }
}

// Export classes for use in main game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AuthenticDiceSystem,
        BoardGameShotCalculator,
        TPC3DCourseManager
    };
} else {
    // Browser environment
    window.AuthenticDiceSystem = AuthenticDiceSystem;
    window.BoardGameShotCalculator = BoardGameShotCalculator;
    window.TPC3DCourseManager = TPC3DCourseManager;
}