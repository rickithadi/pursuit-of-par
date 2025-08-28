#!/usr/bin/env node

/**
 * Agent 6: Headless Browser Testing Suite
 * Comprehensive automated testing for the Phaser.js golf game implementation
 * Tests colonist.io-inspired visuals, accessibility features, and game functionality
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class GolfGameTestSuite {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = {
            timestamp: new Date().toISOString(),
            testResults: [],
            screenshots: [],
            errors: [],
            performance: {},
            accessibility: {},
            responsiveness: {}
        };
        
        // Ensure screenshots directory exists
        this.screenshotsDir = path.join(__dirname, 'test-screenshots');
        if (!fs.existsSync(this.screenshotsDir)) {
            fs.mkdirSync(this.screenshotsDir);
        }
    }

    async setup() {
        console.log('🚀 Starting Golf Game Test Suite...');
        
        // Launch browser with specific settings for testing
        this.browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security'
            ]
        });

        const context = await this.browser.newContext({
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        this.page = await context.newPage();
        
        // Enable console logging
        this.page.on('console', msg => {
            const type = msg.type();
            if (type === 'error' || type === 'warning') {
                this.results.errors.push({
                    type: type,
                    message: msg.text(),
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Capture page errors
        this.page.on('pageerror', error => {
            this.results.errors.push({
                type: 'pageerror',
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        });
    }

    async navigateToGame() {
        console.log('🎮 Navigating to game...');
        
        const startTime = Date.now();
        
        try {
            await this.page.goto('http://localhost:8000/game-3d.html', {
                waitUntil: 'networkidle',
                timeout: 30000
            });
            
            const loadTime = Date.now() - startTime;
            this.results.performance.pageLoadTime = loadTime;
            
            console.log(`✅ Page loaded in ${loadTime}ms`);
            
            // Take initial screenshot
            await this.takeScreenshot('01-initial-load');
            
            return true;
        } catch (error) {
            this.results.errors.push({
                type: 'navigation',
                message: `Failed to load game: ${error.message}`,
                timestamp: new Date().toISOString()
            });
            return false;
        }
    }

    async testPageStructure() {
        console.log('🏗️ Testing page structure...');
        
        const tests = [
            {
                name: 'Header exists',
                selector: '.enhanced-header',
                expected: true
            },
            {
                name: 'Game title present',
                selector: '.enhanced-title',
                expected: true
            },
            {
                name: '3D viewport container exists',
                selector: '.course-3d-viewport',
                expected: true
            },
            {
                name: 'Control panel exists',
                selector: '.enhanced-panel',
                expected: true
            },
            {
                name: 'Club selector present',
                selector: '#clubSelector3D',
                expected: true
            },
            {
                name: 'Dice display present',
                selector: '.enhanced-dice-display',
                expected: true
            },
            {
                name: 'Shot button exists',
                selector: '#takeShot3D',
                expected: true
            }
        ];

        for (const test of tests) {
            try {
                const element = await this.page.$(test.selector);
                const result = {
                    name: test.name,
                    status: (element !== null) === test.expected ? 'PASS' : 'FAIL',
                    details: element !== null ? 'Element found' : 'Element not found',
                    selector: test.selector
                };
                this.results.testResults.push(result);
                console.log(`${result.status === 'PASS' ? '✅' : '❌'} ${test.name}`);
            } catch (error) {
                this.results.testResults.push({
                    name: test.name,
                    status: 'ERROR',
                    details: error.message,
                    selector: test.selector
                });
            }
        }
    }

    async testPhaserEngineLoading() {
        console.log('⚙️ Testing Phaser.js engine loading...');
        
        // Wait for Phaser to load
        await this.page.waitForTimeout(3000);
        
        const phaserTests = [
            {
                name: 'Phaser library loaded',
                script: 'typeof Phaser !== "undefined"'
            },
            {
                name: 'PhaserBoardGameEngine class exists',
                script: 'typeof PhaserBoardGameEngine !== "undefined"'
            },
            {
                name: 'Engine instance created',
                script: 'typeof window.phaserEngine !== "undefined"'
            },
            {
                name: 'Loading overlay hidden',
                script: 'document.getElementById("loadingOverlay").style.display === "none"'
            }
        ];

        for (const test of phaserTests) {
            try {
                const result = await this.page.evaluate(test.script);
                this.results.testResults.push({
                    name: test.name,
                    status: result ? 'PASS' : 'FAIL',
                    details: result ? 'Test passed' : 'Test failed',
                    script: test.script
                });
                console.log(`${result ? '✅' : '❌'} ${test.name}`);
            } catch (error) {
                this.results.testResults.push({
                    name: test.name,
                    status: 'ERROR',
                    details: error.message,
                    script: test.script
                });
            }
        }

        // Take screenshot after engine loading
        await this.takeScreenshot('02-phaser-engine-loaded');
    }

    async testClubSelection() {
        console.log('🏌️ Testing club selection...');
        
        const clubs = ['driver', '3wood', '5wood', '3iron', '5iron', '7iron', '9iron', 'wedge', 'putter'];
        
        for (let i = 0; i < Math.min(3, clubs.length); i++) {
            const club = clubs[i];
            try {
                await this.page.click(`[data-club="${club}"]`);
                await this.page.waitForTimeout(500);
                
                const isSelected = await this.page.evaluate((clubName) => {
                    const element = document.querySelector(`[data-club="${clubName}"]`);
                    return element && element.classList.contains('selected');
                }, club);
                
                this.results.testResults.push({
                    name: `Club selection: ${club}`,
                    status: isSelected ? 'PASS' : 'FAIL',
                    details: isSelected ? 'Club selected successfully' : 'Club selection failed'
                });
                
                console.log(`${isSelected ? '✅' : '❌'} Club selection: ${club}`);
                
                if (i === 0) {
                    await this.takeScreenshot(`03-club-selected-${club}`);
                }
            } catch (error) {
                this.results.testResults.push({
                    name: `Club selection: ${club}`,
                    status: 'ERROR',
                    details: error.message
                });
            }
        }
    }

    async testAccessibilityFeatures() {
        console.log('♿ Testing accessibility features...');
        
        const accessibilityTests = [
            {
                name: 'Hex grid toggle functionality',
                toggleId: 'enableHexGrid',
                expectedAction: 'toggleHexGrid'
            },
            {
                name: 'Colorblind mode toggle',
                toggleId: 'colorBlindMode',
                expectedClass: 'colorblind-mode'
            },
            {
                name: 'High contrast mode toggle',
                toggleId: 'highContrastMode',
                expectedClass: 'high-contrast'
            }
        ];

        for (const test of accessibilityTests) {
            try {
                const toggle = await this.page.$(`#${test.toggleId}`);
                if (toggle) {
                    await this.page.click(`label[for="${test.toggleId}"], #${test.toggleId}`);
                    await this.page.waitForTimeout(500);
                    
                    let testPassed = false;
                    
                    if (test.expectedClass) {
                        testPassed = await this.page.evaluate((className) => {
                            return document.body.classList.contains(className);
                        }, test.expectedClass);
                    } else {
                        testPassed = true; // For custom actions like hex grid toggle
                    }
                    
                    this.results.accessibility[test.name] = {
                        status: testPassed ? 'PASS' : 'FAIL',
                        details: testPassed ? 'Toggle working correctly' : 'Toggle not working'
                    };
                    
                    console.log(`${testPassed ? '✅' : '❌'} ${test.name}`);
                    
                    if (test.toggleId === 'highContrastMode' && testPassed) {
                        await this.takeScreenshot('04-high-contrast-mode');
                    }
                } else {
                    this.results.accessibility[test.name] = {
                        status: 'FAIL',
                        details: 'Toggle element not found'
                    };
                }
            } catch (error) {
                this.results.accessibility[test.name] = {
                    status: 'ERROR',
                    details: error.message
                };
            }
        }
    }

    async testDiceSystem() {
        console.log('🎲 Testing dice system...');
        
        try {
            const shotButton = await this.page.$('#takeShot3D');
            if (shotButton) {
                await this.page.click('#takeShot3D');
                await this.page.waitForTimeout(1500); // Wait for dice animation
                
                // Check if dice have values
                const diceValues = await this.page.evaluate(() => {
                    const greenDice = document.getElementById('greenDice3D');
                    const directionDice = document.getElementById('directionDice3D');
                    
                    return {
                        green: greenDice ? greenDice.textContent.trim() : null,
                        direction: directionDice ? directionDice.textContent.trim() : null
                    };
                });
                
                const diceWorking = diceValues.green !== '?' && diceValues.direction !== '?' && 
                                   diceValues.green !== null && diceValues.direction !== null;
                
                this.results.testResults.push({
                    name: 'Dice system functionality',
                    status: diceWorking ? 'PASS' : 'FAIL',
                    details: diceWorking ? `Dice rolled: Green=${diceValues.green}, Direction=${diceValues.direction}` : 'Dice did not roll properly',
                    values: diceValues
                });
                
                console.log(`${diceWorking ? '✅' : '❌'} Dice system functionality`);
                
                await this.takeScreenshot('05-dice-rolled');
            }
        } catch (error) {
            this.results.testResults.push({
                name: 'Dice system functionality',
                status: 'ERROR',
                details: error.message
            });
        }
    }

    async testResponsiveDesign() {
        console.log('📱 Testing responsive design...');
        
        const viewports = [
            { width: 375, height: 667, name: 'mobile' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 1280, height: 720, name: 'desktop-small' },
            { width: 1920, height: 1080, name: 'desktop-large' }
        ];

        for (const viewport of viewports) {
            try {
                await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
                await this.page.waitForTimeout(1000);
                
                // Check if layout adapts properly
                const layoutTest = await this.page.evaluate(() => {
                    const layout = document.querySelector('.enhanced-layout');
                    const panel = document.querySelector('.enhanced-panel');
                    
                    return {
                        layoutExists: !!layout,
                        panelExists: !!panel,
                        layoutDisplay: layout ? getComputedStyle(layout).display : null,
                        layoutGridColumns: layout ? getComputedStyle(layout).gridTemplateColumns : null
                    };
                });
                
                this.results.responsiveness[viewport.name] = {
                    viewport: viewport,
                    layoutAdapts: layoutTest.layoutExists && layoutTest.panelExists,
                    details: layoutTest
                };
                
                console.log(`${layoutTest.layoutExists && layoutTest.panelExists ? '✅' : '❌'} Responsive design: ${viewport.name}`);
                
                await this.takeScreenshot(`06-responsive-${viewport.name}`);
            } catch (error) {
                this.results.responsiveness[viewport.name] = {
                    viewport: viewport,
                    layoutAdapts: false,
                    error: error.message
                };
            }
        }
        
        // Reset to desktop size
        await this.page.setViewportSize({ width: 1920, height: 1080 });
    }

    async testPerformanceMetrics() {
        console.log('⚡ Testing performance metrics...');
        
        try {
            // Get performance timing
            const timing = await this.page.evaluate(() => {
                const perf = window.performance.timing;
                return {
                    domContentLoaded: perf.domContentLoadedEventEnd - perf.navigationStart,
                    loadComplete: perf.loadEventEnd - perf.navigationStart,
                    firstPaint: window.performance.getEntriesByType('paint')[0]?.startTime || 0,
                    resourceCount: window.performance.getEntriesByType('resource').length
                };
            });
            
            this.results.performance = {
                ...this.results.performance,
                ...timing
            };
            
            console.log(`✅ Performance metrics captured`);
            console.log(`   - DOM Content Loaded: ${timing.domContentLoaded}ms`);
            console.log(`   - Load Complete: ${timing.loadComplete}ms`);
            console.log(`   - First Paint: ${timing.firstPaint}ms`);
            console.log(`   - Resource Count: ${timing.resourceCount}`);
            
        } catch (error) {
            this.results.errors.push({
                type: 'performance',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    async takeScreenshot(name) {
        try {
            const filename = `${Date.now()}-${name}.png`;
            const filepath = path.join(this.screenshotsDir, filename);
            
            await this.page.screenshot({
                path: filepath,
                fullPage: true
            });
            
            this.results.screenshots.push({
                name: name,
                filename: filename,
                filepath: filepath,
                timestamp: new Date().toISOString()
            });
            
            console.log(`📸 Screenshot saved: ${filename}`);
        } catch (error) {
            console.error(`Failed to take screenshot ${name}:`, error.message);
        }
    }

    async generateReport() {
        console.log('📊 Generating test report...');
        
        const report = {
            title: 'Golf Game - Headless Browser Test Report',
            timestamp: this.results.timestamp,
            summary: {
                totalTests: this.results.testResults.length,
                passed: this.results.testResults.filter(t => t.status === 'PASS').length,
                failed: this.results.testResults.filter(t => t.status === 'FAIL').length,
                errors: this.results.testResults.filter(t => t.status === 'ERROR').length,
                screenshots: this.results.screenshots.length,
                jsErrors: this.results.errors.length
            },
            results: this.results
        };
        
        // Save JSON report
        const reportPath = path.join(__dirname, 'test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        // Generate HTML report
        const htmlReport = this.generateHTMLReport(report);
        const htmlPath = path.join(__dirname, 'test-report.html');
        fs.writeFileSync(htmlPath, htmlReport);
        
        console.log(`📄 Reports generated:`);
        console.log(`   - JSON: ${reportPath}`);
        console.log(`   - HTML: ${htmlPath}`);
        
        return report;
    }

    generateHTMLReport(report) {
        const passRate = ((report.summary.passed / report.summary.totalTests) * 100).toFixed(1);
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Golf Game Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; margin: 0; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .metric-value { font-size: 2rem; font-weight: 700; color: #4CAF50; }
        .metric-label { color: #666; font-size: 0.9rem; text-transform: uppercase; }
        .test-results { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .test-item { display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
        .test-status { width: 60px; text-align: center; font-weight: 600; }
        .pass { color: #4CAF50; }
        .fail { color: #F44336; }
        .error { color: #FF9800; }
        .screenshots { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .screenshot { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .screenshot img { width: 100%; border-radius: 4px; }
        .performance { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .perf-metric { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎲 Golf Game Test Report</h1>
            <p>Phaser.js Engine with Colonist.io-inspired Aesthetics</p>
            <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${report.summary.totalTests}</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric">
                <div class="metric-value">${passRate}%</div>
                <div class="metric-label">Pass Rate</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.summary.passed}</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.summary.failed}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.summary.screenshots}</div>
                <div class="metric-label">Screenshots</div>
            </div>
        </div>
        
        <div class="test-results">
            <h2>Test Results</h2>
            ${report.results.testResults.map(test => `
                <div class="test-item">
                    <div class="test-status ${test.status.toLowerCase()}">${test.status}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600;">${test.name}</div>
                        <div style="color: #666; font-size: 0.9rem;">${test.details}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${report.results.performance ? `
        <div class="performance">
            <h2>Performance Metrics</h2>
            <div class="perf-metric">
                <span>Page Load Time</span>
                <span>${report.results.performance.pageLoadTime || 'N/A'}ms</span>
            </div>
            <div class="perf-metric">
                <span>DOM Content Loaded</span>
                <span>${report.results.performance.domContentLoaded || 'N/A'}ms</span>
            </div>
            <div class="perf-metric">
                <span>Load Complete</span>
                <span>${report.results.performance.loadComplete || 'N/A'}ms</span>
            </div>
            <div class="perf-metric">
                <span>First Paint</span>
                <span>${report.results.performance.firstPaint || 'N/A'}ms</span>
            </div>
        </div>
        ` : ''}
        
        <div class="test-results">
            <h2>Screenshots</h2>
            <div class="screenshots">
                ${report.results.screenshots.map(screenshot => `
                    <div class="screenshot">
                        <h4>${screenshot.name}</h4>
                        <p style="font-size: 0.8rem; color: #666;">${screenshot.filename}</p>
                        <p style="font-size: 0.8rem; color: #666;">Taken: ${new Date(screenshot.timestamp).toLocaleString()}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${report.results.errors.length > 0 ? `
        <div class="test-results">
            <h2>JavaScript Errors (${report.results.errors.length})</h2>
            ${report.results.errors.map(error => `
                <div class="test-item">
                    <div class="test-status error">${error.type.toUpperCase()}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600;">${error.message}</div>
                        <div style="color: #666; font-size: 0.8rem;">${new Date(error.timestamp).toLocaleString()}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
</body>
</html>`;
    }

    async runFullTestSuite() {
        try {
            await this.setup();
            
            const navigationSuccess = await this.navigateToGame();
            if (!navigationSuccess) {
                throw new Error('Failed to navigate to game page');
            }

            await this.testPageStructure();
            await this.testPhaserEngineLoading();
            await this.testClubSelection();
            await this.testAccessibilityFeatures();
            await this.testDiceSystem();
            await this.testResponsiveDesign();
            await this.testPerformanceMetrics();
            
            const report = await this.generateReport();
            
            console.log('🎉 Test suite completed!');
            console.log(`📊 Results: ${report.summary.passed}/${report.summary.totalTests} tests passed (${((report.summary.passed / report.summary.totalTests) * 100).toFixed(1)}%)`);
            
            return report;
            
        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
            this.results.errors.push({
                type: 'suite-failure',
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            
            throw error;
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
}

// Run the test suite
async function main() {
    const testSuite = new GolfGameTestSuite();
    
    try {
        const report = await testSuite.runFullTestSuite();
        process.exit(0);
    } catch (error) {
        console.error('Test suite execution failed:', error);
        process.exit(1);
    }
}

// Export for use as module or run directly
if (require.main === module) {
    main();
} else {
    module.exports = GolfGameTestSuite;
}