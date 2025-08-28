// Comprehensive Test Suite for Ball Movement
console.log('🧪 Ball Movement Test Suite Loading...');

class BallMovementTester {
    constructor() {
        this.testResults = [];
        this.gameEngine = null;
    }

    // Initialize test environment
    async init() {
        console.log('🔧 Initializing test environment...');
        
        // Wait for game to be ready
        await this.waitForGame();
        
        // Get reference to game engine
        this.gameEngine = window.game;
        
        if (!this.gameEngine) {
            console.error('❌ Game engine not found!');
            return false;
        }
        
        console.log('✅ Test environment ready');
        return true;
    }

    // Wait for game to load
    waitForGame(timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkGame = () => {
                if (window.game && document.getElementById('ballPosition')) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Game loading timeout'));
                } else {
                    setTimeout(checkGame, 100);
                }
            };
            checkGame();
        });
    }

    // Test 1: Ball element exists and is positioned
    testBallElementExists() {
        console.log('🧪 Test 1: Ball Element Exists');
        
        const ball = document.getElementById('ballPosition');
        const lieIndicator = document.getElementById('lieIndicator');
        
        const results = {
            ballExists: !!ball,
            lieIndicatorExists: !!lieIndicator,
            ballHasPosition: ball ? (ball.style.left && ball.style.bottom) : false,
            initialPosition: ball ? {
                left: ball.style.left,
                bottom: ball.style.bottom
            } : null
        };
        
        const passed = results.ballExists && results.lieIndicatorExists;
        this.logTestResult('Ball Element Exists', passed, results);
        return passed;
    }

    // Test 2: Initial ball position
    testInitialPosition() {
        console.log('🧪 Test 2: Initial Ball Position');
        
        const gameState = this.gameEngine.gameState;
        const ball = document.getElementById('ballPosition');
        
        const results = {
            gameStatePosition: gameState.ballPosition,
            domPosition: {
                left: ball.style.left,
                bottom: ball.style.bottom
            },
            expectedStartingLie: gameState.currentLie === 'tee',
            expectedStartingHole: gameState.currentHole === 1
        };
        
        const passed = results.expectedStartingLie && results.expectedStartingHole;
        this.logTestResult('Initial Ball Position', passed, results);
        return passed;
    }

    // Test 3: Manual ball movement
    testManualBallMovement() {
        console.log('🧪 Test 3: Manual Ball Movement');
        
        const ball = document.getElementById('ballPosition');
        const originalLeft = ball.style.left;
        const originalBottom = ball.style.bottom;
        
        // Test movement
        ball.style.left = '75%';
        ball.style.bottom = '60%';
        
        const afterManualMove = {
            left: ball.style.left,
            bottom: ball.style.bottom
        };
        
        // Restore original position
        ball.style.left = originalLeft;
        ball.style.bottom = originalBottom;
        
        const results = {
            originalPosition: { left: originalLeft, bottom: originalBottom },
            afterMove: afterManualMove,
            movedCorrectly: afterManualMove.left === '75%' && afterManualMove.bottom === '60%',
            restoredCorrectly: ball.style.left === originalLeft && ball.style.bottom === originalBottom
        };
        
        const passed = results.movedCorrectly && results.restoredCorrectly;
        this.logTestResult('Manual Ball Movement', passed, results);
        return passed;
    }

    // Test 4: Shot calculation and ball movement
    async testShotMovement() {
        console.log('🧪 Test 4: Shot Movement Calculation');
        
        const initialState = {
            position: { ...this.gameEngine.gameState.ballPosition },
            lie: this.gameEngine.gameState.currentLie,
            distanceToPin: this.gameEngine.gameState.distanceToPin
        };
        
        // Simulate a shot result
        const testShotResult = {
            distance: 200,
            direction: { text: 'Straight', deviation: 0 },
            newDistance: initialState.distanceToPin - 200,
            holeCompleted: false,
            diceResults: { distance: 4, direction: 6, problem: null }
        };
        
        // Test the calculation method
        this.gameEngine.updateBallPositionAfterShot(testShotResult, 'fairway');
        
        const afterShotState = {
            position: { ...this.gameEngine.gameState.ballPosition },
            lie: this.gameEngine.gameState.currentLie,
            distanceToPin: this.gameEngine.gameState.distanceToPin
        };
        
        const results = {
            initialState,
            testShotResult,
            afterShotState,
            ballMoved: (
                afterShotState.position.x !== initialState.position.x ||
                afterShotState.position.y !== initialState.position.y
            ),
            progressedTowardGreen: afterShotState.position.y > initialState.position.y
        };
        
        const passed = results.ballMoved && results.progressedTowardGreen;
        this.logTestResult('Shot Movement Calculation', passed, results);
        return passed;
    }

    // Test 5: Dice rolling and shot execution
    async testFullShotExecution() {
        console.log('🧪 Test 5: Full Shot Execution');
        
        // Select a club first
        this.gameEngine.gameState.selectedClub = 'driver';
        
        const initialBallPosition = document.getElementById('ballPosition');
        const initialLeft = initialBallPosition.style.left;
        const initialBottom = initialBallPosition.style.bottom;
        
        try {
            // Execute a full shot
            const diceResults = await this.gameEngine.rollDice();
            const shotResult = this.gameEngine.calculateShotResult('driver', diceResults);
            this.gameEngine.updateBallPositionAfterShot(shotResult, 'fairway');
            
            const finalLeft = initialBallPosition.style.left;
            const finalBottom = initialBallPosition.style.bottom;
            
            const results = {
                diceResults,
                shotResult,
                initialPosition: { left: initialLeft, bottom: initialBottom },
                finalPosition: { left: finalLeft, bottom: finalBottom },
                ballActuallyMoved: (finalLeft !== initialLeft || finalBottom !== initialBottom)
            };
            
            const passed = results.ballActuallyMoved && shotResult.distance > 0;
            this.logTestResult('Full Shot Execution', passed, results);
            return passed;
            
        } catch (error) {
            this.logTestResult('Full Shot Execution', false, { error: error.message });
            return false;
        }
    }

    // Test 6: Hole progression
    testHoleProgression() {
        console.log('🧪 Test 6: Hole Progression');
        
        const initialHole = this.gameEngine.gameState.currentHole;
        const initialScore = this.gameEngine.gameState.totalScore;
        
        // Simulate hole completion
        this.gameEngine.gameState.strokeCount = 4; // Simulate taking 4 strokes
        
        // Test moveToNextHole method directly
        if (initialHole < 18) {
            this.gameEngine.moveToNextHole();
            
            const afterProgression = {
                hole: this.gameEngine.gameState.currentHole,
                strokes: this.gameEngine.gameState.strokeCount,
                ballPosition: this.gameEngine.gameState.ballPosition,
                lie: this.gameEngine.gameState.currentLie
            };
            
            const results = {
                initialHole,
                afterProgression,
                holeAdvanced: afterProgression.hole === initialHole + 1,
                strokesReset: afterProgression.strokes === 0,
                ballResetToTee: afterProgression.lie === 'tee',
                ballPositionReset: afterProgression.ballPosition.x === 50 && afterProgression.ballPosition.y === 5
            };
            
            const passed = results.holeAdvanced && results.strokesReset && results.ballResetToTee && results.ballPositionReset;
            this.logTestResult('Hole Progression', passed, results);
            
            // Reset to original hole for other tests
            this.gameEngine.gameState.currentHole = initialHole;
            this.gameEngine.gameState.strokeCount = 0;
            
            return passed;
        } else {
            this.logTestResult('Hole Progression', true, { note: 'On final hole, cannot test progression' });
            return true;
        }
    }

    // Test 7: Ball position persistence
    testBallPositionPersistence() {
        console.log('🧪 Test 7: Ball Position Persistence');
        
        // Set a specific position
        this.gameEngine.gameState.ballPosition = { x: 65, y: 45 };
        this.gameEngine.updateBallPosition();
        
        const ball = document.getElementById('ballPosition');
        const domPosition = {
            left: ball.style.left,
            bottom: ball.style.bottom
        };
        
        // Check if DOM matches game state
        const results = {
            gameStatePosition: this.gameEngine.gameState.ballPosition,
            domPosition,
            matches: ball.style.left === '65%' && ball.style.bottom === '45%'
        };
        
        const passed = results.matches;
        this.logTestResult('Ball Position Persistence', passed, results);
        return passed;
    }

    // Run all tests
    async runAllTests() {
        console.log('🚀 Starting Ball Movement Test Suite');
        console.log('=====================================');
        
        const initialized = await this.init();
        if (!initialized) {
            console.error('❌ Failed to initialize test environment');
            return;
        }
        
        const tests = [
            () => this.testBallElementExists(),
            () => this.testInitialPosition(),
            () => this.testManualBallMovement(),
            () => this.testShotMovement(),
            () => this.testFullShotExecution(),
            () => this.testHoleProgression(),
            () => this.testBallPositionPersistence()
        ];
        
        let passed = 0;
        let failed = 0;
        
        for (let i = 0; i < tests.length; i++) {
            try {
                const result = await tests[i]();
                if (result) passed++;
                else failed++;
            } catch (error) {
                console.error(`❌ Test ${i + 1} threw error:`, error);
                failed++;
            }
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('=====================================');
        console.log('🏁 Test Suite Complete');
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📊 Success Rate: ${Math.round(passed / (passed + failed) * 100)}%`);
        
        if (failed === 0) {
            console.log('🎉 All tests passed! Ball movement is working correctly.');
        } else {
            console.log('⚠️ Some tests failed. Check results above.');
        }
        
        return { passed, failed, total: passed + failed };
    }

    // Helper method to log test results
    logTestResult(testName, passed, details) {
        const icon = passed ? '✅' : '❌';
        const status = passed ? 'PASSED' : 'FAILED';
        
        console.log(`${icon} ${testName}: ${status}`);
        if (details) {
            console.log('   Details:', details);
        }
        
        this.testResults.push({
            name: testName,
            passed,
            details
        });
    }
}

// Auto-run tests when script loads
window.ballMovementTester = new BallMovementTester();

// Add global test function
window.runBallTests = () => {
    return window.ballMovementTester.runAllTests();
};

// Auto-run after page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🔄 Auto-running ball movement tests...');
        window.runBallTests();
    }, 2000); // Wait 2 seconds for game to initialize
});

console.log('✅ Ball Movement Test Suite Loaded');
console.log('📝 Use runBallTests() to run tests manually');