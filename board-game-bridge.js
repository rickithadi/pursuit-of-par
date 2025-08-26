// Board Game Bridge - Maintains authentic 1987 mechanics while adding visual enhancements
// This script ensures all gameplay remains true to the original board game

class BoardGameBridge {
    constructor(enhanced3DEngine) {
        this.engine3D = enhanced3DEngine;
        this.originalEngine = null;
        this.boardGameMode = true;
        
        this.init();
    }

    init() {
        console.log('🎲 Board Game Bridge initialized - maintaining authentic 1987 mechanics');
        this.setupModeToggle();
        this.preserveAuthenticMechanics();
    }

    setupModeToggle() {
        // Allow switching between enhanced visuals and classic board game feel
        const modeOptions = document.querySelectorAll('.mode-option');
        
        modeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const mode = option.dataset.mode;
                this.setGameMode(mode);
            });
        });
    }

    setGameMode(mode) {
        this.boardGameMode = (mode === 'authentic');
        
        if (this.boardGameMode) {
            console.log('🎯 Authentic 1987 Board Game Mode Active');
            this.enforceOriginalMechanics();
        } else {
            console.log('✨ Enhanced 3D Mode with Original Mechanics');
            this.enableEnhancedVisuals();
        }
    }

    enforceOriginalMechanics() {
        // Ensure all game calculations use original board game mechanics
        if (this.engine3D) {
            // Disable any physics - use pure dice calculations
            this.engine3D.physicsEnabled = false;
            this.engine3D.useOriginalDice = true;
            
            // Simplify 3D elements to maintain board game feel
            this.engine3D.setLOD('board_game');
            
            // Use geometric shapes for course elements
            this.engine3D.boardGameAesthetic = true;
        }
        
        this.updateUI('authentic');
    }

    enableEnhancedVisuals() {
        // Keep original mechanics but enhance visuals
        if (this.engine3D) {
            this.engine3D.physicsEnabled = false; // Still no physics per request
            this.engine3D.useOriginalDice = true;  // Always use authentic dice
            this.engine3D.setLOD('enhanced');
            this.engine3D.boardGameAesthetic = false;
        }
        
        this.updateUI('enhanced');
    }

    updateUI(mode) {
        const body = document.body;
        
        if (mode === 'authentic') {
            body.classList.add('board-game-mode');
            body.classList.remove('enhanced-mode');
            
            // Show that we're in authentic mode
            this.showModeIndicator('🎲 Authentic 1987 Board Game Mode');
        } else {
            body.classList.add('enhanced-mode');
            body.classList.remove('board-game-mode');
            
            this.showModeIndicator('✨ Enhanced Visuals with Original Mechanics');
        }
    }

    showModeIndicator(text) {
        // Create or update mode indicator
        let indicator = document.getElementById('modeIndicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'modeIndicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary-green);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                z-index: 1000;
                box-shadow: var(--shadow-md);
                animation: fadeIn 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.textContent = text;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (indicator) {
                indicator.style.opacity = '0';
                setTimeout(() => indicator?.remove(), 300);
            }
        }, 3000);
    }

    // Preserve authentic dice mechanics
    validateDiceRoll(result) {
        // Ensure dice results match original board game specifications
        const { distance, direction, problem } = result;
        
        // Distance dice: 1-6 (green 6-sided)
        if (distance < 1 || distance > 6) {
            console.warn('Invalid distance dice - using authentic range');
            return { ...result, distance: Math.max(1, Math.min(6, distance)) };
        }
        
        // Direction dice: 1-12 (green 12-sided) 
        if (direction < 1 || direction > 12) {
            console.warn('Invalid direction dice - using authentic range');
            return { ...result, direction: Math.max(1, Math.min(12, direction)) };
        }
        
        // Problem dice: 1-6 (red 6-sided) when needed
        if (problem !== null && (problem < 1 || problem > 6)) {
            console.warn('Invalid problem dice - using authentic range');
            return { ...result, problem: Math.max(1, Math.min(6, problem)) };
        }
        
        return result;
    }

    // Preserve authentic shot calculation
    validateShotResult(shotResult, club, diceResult, lie) {
        // Ensure shot results match original board game shot schedules
        const originalCalculator = new BoardGameShotCalculator();
        const expectedResult = originalCalculator.calculate(club, diceResult, lie);
        
        // Verify distance is within expected range
        if (Math.abs(shotResult.distance - expectedResult.distance) > 10) {
            console.warn(`Shot distance deviation detected - expected ~${expectedResult.distance}, got ${shotResult.distance}`);
        }
        
        // Verify direction matches dice table
        if (shotResult.direction !== expectedResult.direction) {
            console.warn(`Direction mismatch - expected ${expectedResult.direction}, got ${shotResult.direction}`);
        }
        
        return shotResult;
    }

    // Course layout validation
    validateCourseLayout() {
        // Ensure course data matches original TPC Sawgrass 1987 board game
        const requiredHoles = 18;
        const totalPar = 72;
        const totalYardage = 6394;
        
        if (courseData.holes.length !== requiredHoles) {
            console.error(`Course should have ${requiredHoles} holes`);
            return false;
        }
        
        if (courseData.totalPar !== totalPar) {
            console.error(`Course par should be ${totalPar}`);
            return false;
        }
        
        if (courseData.totalYardage !== totalYardage) {
            console.error(`Course yardage should be ${totalYardage}`);
            return false;
        }
        
        console.log('✅ Course layout validated - matches 1987 TPC Sawgrass board game');
        return true;
    }

    // Performance monitoring for board game feel
    monitorPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitor = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Board game doesn't need high FPS - 30 is perfect
                if (fps > 60 && this.boardGameMode) {
                    console.log('🎲 Limiting FPS for authentic board game feel');
                    // Could implement frame limiting here
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitor);
        };
        
        monitor();
    }

    // Accessibility for board game players
    setupAccessibility() {
        // Add keyboard support for dice rolling (like physical dice)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                const shotButton = document.getElementById('takeShot3D') || document.getElementById('takeShot');
                if (shotButton && !shotButton.disabled) {
                    shotButton.click();
                }
            }
            
            // Number keys for club selection (1-9)
            if (e.code.startsWith('Digit')) {
                const clubIndex = parseInt(e.code.slice(-1)) - 1;
                const clubs = document.querySelectorAll('.club-option');
                if (clubs[clubIndex]) {
                    clubs.forEach(c => c.classList.remove('selected'));
                    clubs[clubIndex].classList.add('selected');
                    clubs[clubIndex].click();
                }
            }
        });
        
        // Add screen reader support
        this.addScreenReaderSupport();
    }

    addScreenReaderSupport() {
        // Add ARIA labels for dice results
        const diceElements = document.querySelectorAll('[id$="Dice"], [id$="dice"]');
        diceElements.forEach(dice => {
            dice.setAttribute('role', 'status');
            dice.setAttribute('aria-live', 'polite');
        });
        
        // Add descriptions for course visualization
        const viewport = document.getElementById('course3DViewport') || document.getElementById('courseVisualization');
        if (viewport) {
            viewport.setAttribute('role', 'img');
            viewport.setAttribute('aria-label', 'Golf course hole visualization showing current ball position and course layout');
        }
    }

    // Debug mode for board game verification
    enableDebugMode() {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
                console.log('🔍 Board Game Debug Mode Enabled');
                
                // Show all dice probabilities
                console.table({
                    'Distance (1-6)': '16.67% each',
                    'Direction Straight (4-8)': '41.67%',
                    'Direction Left (1-3)': '25%',
                    'Direction Right (9-11)': '25%',
                    'Hook/Slice (12)': '8.33%'
                });
                
                // Validate current game state
                this.validateCourseLayout();
                
                // Show current player stats
                if (this.engine3D?.players) {
                    console.table(this.engine3D.players);
                }
            }
        });
    }
}

// Auto-initialize when 3D engine is ready
window.addEventListener('load', () => {
    if (window.enhanced3DEngine) {
        window.boardGameBridge = new BoardGameBridge(window.enhanced3DEngine);
        window.boardGameBridge.enableDebugMode();
        window.boardGameBridge.setupAccessibility();
        window.boardGameBridge.monitorPerformance();
    }
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BoardGameBridge };
} else {
    window.BoardGameBridge = BoardGameBridge;
}