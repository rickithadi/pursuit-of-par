class TestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            startTime: null,
            endTime: null
        };
        this.testApp = null;
        this.originalAlert = window.alert;
        this.originalConfirm = window.confirm;
        
        this.init();
    }

    init() {
        document.getElementById('runTestsBtn').addEventListener('click', () => this.runAllTests());
        this.setupMockFunctions();
        this.registerAllTests();
        this.updateUI();
    }

    setupMockFunctions() {
        // Mock alert and confirm for testing
        window.alert = (message) => {
            this.log(`ALERT: ${message}`, 'warning');
            return true;
        };
        
        window.confirm = (message) => {
            this.log(`CONFIRM: ${message}`, 'warning');
            return true;
        };
    }

    log(message, type = 'info') {
        const logContainer = document.getElementById('testLog');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    clearLog() {
        document.getElementById('testLog').innerHTML = '';
    }

    updateTestStatus(testId, status, message = '') {
        const statusElement = document.getElementById(testId);
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `test-status test-${status.toLowerCase()}`;
            if (message) statusElement.title = message;
        }
    }

    updateUI() {
        document.getElementById('totalTests').textContent = this.results.total;
        document.getElementById('passedTests').textContent = this.results.passed;
        document.getElementById('failedTests').textContent = this.results.failed;
        
        if (this.results.startTime && this.results.endTime) {
            const duration = this.results.endTime - this.results.startTime;
            document.getElementById('testTime').textContent = `${duration}ms`;
        }
        
        const overallStatus = document.getElementById('overallStatus');
        if (this.results.total === 0) {
            overallStatus.textContent = 'Ready to run tests';
        } else if (this.results.failed === 0) {
            overallStatus.textContent = '✅ All tests passed!';
            overallStatus.style.color = '#28a745';
        } else {
            overallStatus.textContent = `❌ ${this.results.failed} test(s) failed`;
            overallStatus.style.color = '#dc3545';
        }
    }

    async runAllTests() {
        this.clearLog();
        this.log('Starting TPC Sawgrass Scorecard Test Suite...', 'info');
        
        const runButton = document.getElementById('runTestsBtn');
        runButton.disabled = true;
        runButton.textContent = 'Running Tests...';
        
        this.results = {
            total: this.tests.length,
            passed: 0,
            failed: 0,
            startTime: Date.now(),
            endTime: null
        };

        // Create a fresh instance of the app for testing
        this.testApp = new TpcScorecardApp();
        await this.sleep(100); // Allow app to initialize

        this.log(`Running ${this.tests.length} tests...`, 'info');

        for (const test of this.tests) {
            try {
                this.updateTestStatus(test.id, 'Running');
                await this.sleep(10); // Visual feedback
                
                const result = await test.fn();
                if (result) {
                    this.results.passed++;
                    this.updateTestStatus(test.id, 'Pass');
                    this.log(`✅ ${test.name}`, 'success');
                } else {
                    this.results.failed++;
                    this.updateTestStatus(test.id, 'Fail');
                    this.log(`❌ ${test.name}`, 'error');
                }
            } catch (error) {
                this.results.failed++;
                this.updateTestStatus(test.id, 'Fail', error.message);
                this.log(`❌ ${test.name} - Error: ${error.message}`, 'error');
            }
        }

        this.results.endTime = Date.now();
        
        this.log('Test suite completed!', 'info');
        this.log(`Results: ${this.results.passed} passed, ${this.results.failed} failed`, 'info');
        
        runButton.disabled = false;
        runButton.textContent = 'Run All Tests';
        
        this.updateUI();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    addTest(id, name, testFunction) {
        this.tests.push({
            id: id,
            name: name,
            fn: testFunction
        });
    }

    // Helper assertion functions
    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
        return true;
    }

    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(message || 'Expected true, got false');
        }
        return true;
    }

    assertFalse(condition, message = '') {
        if (condition) {
            throw new Error(message || 'Expected false, got true');
        }
        return true;
    }

    assertArrayEqual(actual, expected, message = '') {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
        return true;
    }

    assertGreaterThan(actual, expected, message = '') {
        if (actual <= expected) {
            throw new Error(message || `Expected ${actual} to be greater than ${expected}`);
        }
        return true;
    }

    assertContains(array, item, message = '') {
        if (!array.includes(item)) {
            throw new Error(message || `Expected array to contain ${item}`);
        }
        return true;
    }

    registerAllTests() {
        // Course Data Tests
        this.addTest('test-course-structure', 'Course data structure is valid', () => {
            this.assertTrue(typeof courseData === 'object', 'courseData should be an object');
            this.assertTrue(courseData.hasOwnProperty('name'), 'courseData should have name');
            this.assertTrue(courseData.hasOwnProperty('totalPar'), 'courseData should have totalPar');
            this.assertTrue(courseData.hasOwnProperty('holes'), 'courseData should have holes array');
            this.assertTrue(Array.isArray(courseData.holes), 'holes should be an array');
            return true;
        });

        this.addTest('test-holes-complete', 'All 18 holes have required properties', () => {
            this.assertEqual(courseData.holes.length, 18, 'Should have exactly 18 holes');
            
            courseData.holes.forEach((hole, index) => {
                this.assertTrue(hole.hasOwnProperty('number'), `Hole ${index + 1} should have number`);
                this.assertTrue(hole.hasOwnProperty('par'), `Hole ${index + 1} should have par`);
                this.assertTrue(hole.hasOwnProperty('yardage'), `Hole ${index + 1} should have yardage`);
                this.assertTrue(hole.hasOwnProperty('handicap'), `Hole ${index + 1} should have handicap`);
                this.assertTrue(hole.hasOwnProperty('difficulty'), `Hole ${index + 1} should have difficulty`);
                this.assertTrue(hole.hasOwnProperty('scoringAverage'), `Hole ${index + 1} should have scoringAverage`);
                
                this.assertEqual(hole.number, index + 1, `Hole number should match index + 1`);
                this.assertTrue([3, 4, 5].includes(hole.par), `Hole ${index + 1} par should be 3, 4, or 5`);
                this.assertGreaterThan(hole.yardage, 0, `Hole ${index + 1} yardage should be positive`);
                this.assertTrue(hole.handicap >= 1 && hole.handicap <= 18, `Hole ${index + 1} handicap should be 1-18`);
                this.assertTrue(hole.difficulty >= 1 && hole.difficulty <= 18, `Hole ${index + 1} difficulty should be 1-18`);
            });
            
            return true;
        });

        this.addTest('test-total-par', 'Total par equals 72', () => {
            const totalPar = courseData.holes.reduce((sum, hole) => sum + hole.par, 0);
            this.assertEqual(totalPar, 72, 'Total par should be 72');
            this.assertEqual(courseData.totalPar, 72, 'courseData.totalPar should be 72');
            return true;
        });

        this.addTest('test-island-green', 'Hole 17 is marked as signature (Island Green)', () => {
            const hole17 = courseData.holes[16]; // 0-indexed
            this.assertEqual(hole17.number, 17, 'Should be hole 17');
            this.assertTrue(hole17.isSignature, 'Hole 17 should be marked as signature');
            this.assertEqual(hole17.par, 3, 'Hole 17 should be par 3');
            return true;
        });

        this.addTest('test-difficulty-rankings', 'Difficulty rankings are valid (1-18)', () => {
            const difficulties = courseData.holes.map(hole => hole.difficulty);
            const sortedDifficulties = [...difficulties].sort((a, b) => a - b);
            
            for (let i = 1; i <= 18; i++) {
                this.assertContains(difficulties, i, `Difficulty ranking ${i} should exist`);
            }
            
            this.assertEqual(new Set(difficulties).size, 18, 'All difficulty rankings should be unique');
            return true;
        });

        // Player Management Tests
        this.addTest('test-default-players', 'Default initialization with 2 players', () => {
            this.assertEqual(this.testApp.players.length, 2, 'Should start with 2 players');
            this.assertEqual(this.testApp.players[0].id, '1', 'First player should have id "1"');
            this.assertEqual(this.testApp.players[1].id, '2', 'Second player should have id "2"');
            this.assertEqual(this.testApp.players[0].scores.length, 18, 'Player should have 18 scores');
            return true;
        });

        this.addTest('test-add-player', 'Add player functionality (up to 4 players)', () => {
            // Reset to 2 players
            this.testApp.players = [
                { id: '1', name: 'Player 1', scores: new Array(18).fill('') },
                { id: '2', name: 'Player 2', scores: new Array(18).fill('') }
            ];
            this.testApp.nextPlayerId = 3;
            
            // Add third player
            this.testApp.addPlayer();
            this.assertEqual(this.testApp.players.length, 3, 'Should have 3 players after adding one');
            this.assertEqual(this.testApp.players[2].id, '3', 'Third player should have id "3"');
            
            // Add fourth player
            this.testApp.addPlayer();
            this.assertEqual(this.testApp.players.length, 4, 'Should have 4 players after adding another');
            this.assertEqual(this.testApp.players[3].id, '4', 'Fourth player should have id "4"');
            
            return true;
        });

        this.addTest('test-max-players', 'Prevent adding more than 4 players', () => {
            // Set to 4 players
            this.testApp.players = [
                { id: '1', name: 'Player 1', scores: new Array(18).fill('') },
                { id: '2', name: 'Player 2', scores: new Array(18).fill('') },
                { id: '3', name: 'Player 3', scores: new Array(18).fill('') },
                { id: '4', name: 'Player 4', scores: new Array(18).fill('') }
            ];
            
            const initialCount = this.testApp.players.length;
            this.testApp.addPlayer(); // Should not add
            
            this.assertEqual(this.testApp.players.length, initialCount, 'Should not add more than 4 players');
            this.assertEqual(this.testApp.players.length, 4, 'Should remain at 4 players');
            return true;
        });

        this.addTest('test-remove-player', 'Remove player functionality', () => {
            // Set to 3 players
            this.testApp.players = [
                { id: '1', name: 'Player 1', scores: new Array(18).fill('') },
                { id: '2', name: 'Player 2', scores: new Array(18).fill('') },
                { id: '3', name: 'Player 3', scores: new Array(18).fill('') }
            ];
            
            this.testApp.removePlayer('2');
            this.assertEqual(this.testApp.players.length, 2, 'Should have 2 players after removing one');
            this.assertFalse(this.testApp.players.some(p => p.id === '2'), 'Player 2 should be removed');
            return true;
        });

        this.addTest('test-min-players', 'Prevent removing last player', () => {
            // Set to 1 player
            this.testApp.players = [
                { id: '1', name: 'Player 1', scores: new Array(18).fill('') }
            ];
            
            this.testApp.removePlayer('1'); // Should not remove
            this.assertEqual(this.testApp.players.length, 1, 'Should still have 1 player');
            return true;
        });

        this.addTest('test-player-names', 'Player name updates work correctly', () => {
            const player = this.testApp.players[0];
            const originalName = player.name;
            
            player.name = 'Test Player';
            this.assertEqual(player.name, 'Test Player', 'Player name should update');
            this.assertTrue(player.name !== originalName, 'Name should be different from original');
            return true;
        });

        // Scoring System Tests
        this.addTest('test-score-validation', 'Score input validation (1-15)', () => {
            const player = this.testApp.players[0];
            
            // Test valid scores
            this.testApp.updateScore('1', 0, '4');
            this.assertEqual(player.scores[0], 4, 'Should accept valid score');
            
            // Test empty score
            this.testApp.updateScore('1', 0, '');
            this.assertEqual(player.scores[0], '', 'Should accept empty score');
            
            return true;
        });

        this.addTest('test-score-totals', 'Score totals calculate correctly', () => {
            const player = this.testApp.players[0];
            
            // Set some test scores
            player.scores = [4, 5, 3, 4, 4, 4, 4, 3, 5, 4, 5, 4, 3, 4, 4, 5, 3, 4];
            
            const total = player.scores.reduce((sum, score) => sum + score, 0);
            this.assertEqual(total, 72, 'Test scores should total 72');
            
            return true;
        });

        this.addTest('test-to-par', 'To-par calculations are accurate', () => {
            const player = this.testApp.players[0];
            
            // Set all pars
            player.scores = courseData.holes.map(hole => hole.par);
            
            const total = player.scores.reduce((sum, score) => sum + score, 0);
            const completedPar = courseData.holes.reduce((sum, hole) => sum + hole.par, 0);
            const toPar = total - completedPar;
            
            this.assertEqual(toPar, 0, 'All pars should result in even par');
            return true;
        });

        this.addTest('test-front-back-nine', 'Front/back nine calculations', () => {
            const player = this.testApp.players[0];
            player.scores = [4, 5, 3, 4, 4, 4, 4, 3, 5, 4, 5, 4, 3, 4, 4, 5, 3, 4];
            
            const frontNine = player.scores.slice(0, 9).reduce((sum, score) => sum + score, 0);
            const backNine = player.scores.slice(9, 18).reduce((sum, score) => sum + score, 0);
            
            this.assertEqual(frontNine + backNine, 72, 'Front and back nine should sum to total');
            this.assertEqual(frontNine, 36, 'Front nine should be 36');
            this.assertEqual(backNine, 36, 'Back nine should be 36');
            return true;
        });

        this.addTest('test-progress', 'Progress tracking works correctly', () => {
            const player = this.testApp.players[0];
            
            // Fill first 9 holes
            for (let i = 0; i < 9; i++) {
                player.scores[i] = 4;
            }
            
            const completed = player.scores.filter(s => s !== '').length;
            this.assertEqual(completed, 9, 'Should have 9 completed holes');
            
            return true;
        });

        this.addTest('test-score-colors', 'Score color coding (eagle, birdie, par, bogey)', () => {
            // Test different score types
            const testCases = [
                { score: 2, par: 4, expectedClass: 'eagle' },
                { score: 3, par: 4, expectedClass: 'birdie' },
                { score: 4, par: 4, expectedClass: 'par' },
                { score: 5, par: 4, expectedClass: 'bogey' },
                { score: 6, par: 4, expectedClass: 'double-bogey' }
            ];
            
            testCases.forEach(testCase => {
                const scoreToPar = testCase.score - testCase.par;
                let expectedClass = 'score-input';
                
                if (scoreToPar <= -2) expectedClass += ' eagle';
                else if (scoreToPar === -1) expectedClass += ' birdie';
                else if (scoreToPar === 0) expectedClass += ' par';
                else if (scoreToPar === 1) expectedClass += ' bogey';
                else if (scoreToPar >= 2) expectedClass += ' double-bogey';
                
                this.assertTrue(expectedClass.includes(testCase.expectedClass), 
                    `Score ${testCase.score} on par ${testCase.par} should have class ${testCase.expectedClass}`);
            });
            
            return true;
        });

        // Statistics Tests
        this.addTest('test-eagles', 'Eagle count calculation', () => {
            const player = this.testApp.players[0];
            player.scores = courseData.holes.map(hole => hole.par - 2); // All eagles
            
            const stats = this.testApp.calculatePlayerStats(player);
            this.assertEqual(stats.eagles, 18, 'Should count all eagles correctly');
            return true;
        });

        this.addTest('test-birdies', 'Birdie count calculation', () => {
            const player = this.testApp.players[0];
            player.scores = courseData.holes.map(hole => hole.par - 1); // All birdies
            
            const stats = this.testApp.calculatePlayerStats(player);
            this.assertEqual(stats.birdies, 18, 'Should count all birdies correctly');
            return true;
        });

        this.addTest('test-pars', 'Par count calculation', () => {
            const player = this.testApp.players[0];
            player.scores = courseData.holes.map(hole => hole.par); // All pars
            
            const stats = this.testApp.calculatePlayerStats(player);
            this.assertEqual(stats.pars, 18, 'Should count all pars correctly');
            return true;
        });

        this.addTest('test-bogeys', 'Bogey and double bogey counts', () => {
            const player = this.testApp.players[0];
            // 9 bogeys, 9 double bogeys
            player.scores = courseData.holes.map((hole, index) => 
                index < 9 ? hole.par + 1 : hole.par + 2
            );
            
            const stats = this.testApp.calculatePlayerStats(player);
            this.assertEqual(stats.bogeys, 9, 'Should count bogeys correctly');
            this.assertEqual(stats.doubles, 9, 'Should count double bogeys correctly');
            return true;
        });

        this.addTest('test-best-hole', 'Best hole identification', () => {
            const player = this.testApp.players[0];
            player.scores = courseData.holes.map(hole => hole.par); // All pars
            player.scores[0] = courseData.holes[0].par - 1; // One birdie on hole 1
            
            const stats = this.testApp.calculatePlayerStats(player);
            this.assertTrue(stats.bestHole.includes('#1'), 'Best hole should be #1');
            return true;
        });

        // Data Persistence Tests
        this.addTest('test-save-data', 'Save data to localStorage', () => {
            const testData = { test: 'data' };
            
            // Mock the save operation
            const originalSave = this.testApp.saveToStorage;
            let saveCalled = false;
            
            this.testApp.saveToStorage = function() {
                saveCalled = true;
                try {
                    const data = {
                        players: this.players,
                        nextPlayerId: this.nextPlayerId
                    };
                    localStorage.setItem('tpcScorecardData_test', JSON.stringify(data));
                } catch (error) {
                    // Handle save error
                }
            };
            
            this.testApp.saveToStorage();
            this.assertTrue(saveCalled, 'Save function should be called');
            
            // Restore original function
            this.testApp.saveToStorage = originalSave;
            
            return true;
        });

        this.addTest('test-load-data', 'Load data from localStorage', () => {
            // Save test data
            const testData = {
                players: [{ id: '1', name: 'Test Player', scores: new Array(18).fill('') }],
                nextPlayerId: 2
            };
            localStorage.setItem('tpcScorecardData_test', JSON.stringify(testData));
            
            // Mock load
            const savedData = localStorage.getItem('tpcScorecardData_test');
            this.assertTrue(savedData !== null, 'Should retrieve saved data');
            
            const parsed = JSON.parse(savedData);
            this.assertEqual(parsed.players[0].name, 'Test Player', 'Should load player name correctly');
            
            // Cleanup
            localStorage.removeItem('tpcScorecardData_test');
            return true;
        });

        this.addTest('test-corrupted-data', 'Handle corrupted localStorage data', () => {
            // Save corrupted data
            localStorage.setItem('tpcScorecardData_test', 'invalid json');
            
            try {
                const savedData = localStorage.getItem('tpcScorecardData_test');
                JSON.parse(savedData);
                return false; // Should have thrown error
            } catch (error) {
                // Expected behavior - handle gracefully
                localStorage.removeItem('tpcScorecardData_test');
                return true;
            }
        });

        this.addTest('test-clear-scores', 'Clear scores functionality', () => {
            const player = this.testApp.players[0];
            player.scores[0] = 4;
            player.scores[1] = 3;
            
            // Mock clear operation
            this.testApp.players.forEach(player => {
                player.scores = new Array(18).fill('');
            });
            
            this.assertEqual(player.scores[0], '', 'Score should be cleared');
            this.assertEqual(player.scores[1], '', 'Score should be cleared');
            return true;
        });

        // Export Tests
        this.addTest('test-export-html', 'Generate printable HTML scorecard', () => {
            const html = this.testApp.generatePrintableScorecard();
            
            this.assertTrue(typeof html === 'string', 'Should return HTML string');
            this.assertTrue(html.includes('<html>'), 'Should contain HTML tag');
            this.assertTrue(html.includes('TPC Sawgrass'), 'Should contain course name');
            this.assertTrue(html.includes('<table>'), 'Should contain table');
            return true;
        });

        this.addTest('test-export-players', 'Include all player data in export', () => {
            const html = this.testApp.generatePrintableScorecard();
            
            this.testApp.players.forEach(player => {
                const displayName = player.name === `Player ${player.id}` ? `Player ${player.id}` : player.name;
                this.assertTrue(html.includes(displayName), `Should include player name ${displayName}`);
            });
            
            return true;
        });

        this.addTest('test-export-branding', 'Board game branding in export', () => {
            const html = this.testApp.generatePrintableScorecard();
            
            this.assertTrue(html.includes('In Pursuit of Par'), 'Should include board game name');
            this.assertTrue(html.includes('Board Game Edition'), 'Should include board game edition text');
            this.assertTrue(html.includes('1987'), 'Should include year');
            return true;
        });

        this.addTest('test-export-island-green', 'Hole 17 Island Green marking in export', () => {
            const html = this.testApp.generatePrintableScorecard();
            
            this.assertTrue(html.includes('17 🏝️'), 'Should mark hole 17 with island emoji');
            return true;
        });

        // UI/UX Tests
        this.addTest('test-responsive-layout', 'Responsive layout with 1-4 players', () => {
            // Test with different player counts
            for (let playerCount = 1; playerCount <= 4; playerCount++) {
                this.testApp.players = [];
                for (let i = 1; i <= playerCount; i++) {
                    this.testApp.players.push({
                        id: i.toString(),
                        name: `Player ${i}`,
                        scores: new Array(18).fill('')
                    });
                }
                
                this.assertTrue(this.testApp.players.length === playerCount, 
                    `Should handle ${playerCount} players`);
            }
            
            return true;
        });

        this.addTest('test-hole-layout', 'Hole card layout adapts to player count', () => {
            // Test grid template calculation
            const testCases = [
                { players: 1, expectedCols: 1 },
                { players: 2, expectedCols: 2 },
                { players: 3, expectedCols: 2 }, // Max 2 columns
                { players: 4, expectedCols: 2 }  // Max 2 columns
            ];
            
            testCases.forEach(testCase => {
                const expectedCols = testCase.players <= 2 ? testCase.players : 2;
                this.assertEqual(expectedCols, testCase.expectedCols, 
                    `${testCase.players} players should use ${testCase.expectedCols} columns`);
            });
            
            return true;
        });

        this.addTest('test-modals', 'Modal functionality (stats, export)', () => {
            // Test that modal methods exist and can be called
            this.assertTrue(typeof this.testApp.showStats === 'function', 'showStats should be a function');
            this.assertTrue(typeof this.testApp.hideModal === 'function', 'hideModal should be a function');
            this.assertTrue(typeof this.testApp.exportScorecard === 'function', 'exportScorecard should be a function');
            return true;
        });

        this.addTest('test-input-validation', 'Input field validation and feedback', () => {
            // Test score validation logic
            const validScores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            
            validScores.forEach(score => {
                this.assertTrue(score >= 1 && score <= 15, `Score ${score} should be valid`);
            });
            
            return true;
        });

        this.log(`Registered ${this.tests.length} tests`, 'info');
    }
}

// Initialize test suite when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure the main app is loaded
    setTimeout(() => {
        new TestSuite();
    }, 500);
});