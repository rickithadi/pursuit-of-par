const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
    const browser = await puppeteer.launch({ 
        headless: false, // Keep visible for debugging
        defaultViewport: { width: 1200, height: 800 }
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('Navigating to the game...');
        await page.goto('http://localhost:8000/phaser-golf-working.html', { 
            waitUntil: 'networkidle0', 
            timeout: 30000 
        });
        
        // Wait for Phaser to load
        console.log('Waiting for Phaser to load...');
        await page.waitForTimeout(3000);
        
        // Screenshot 1: Initial game state
        console.log('Taking screenshot 1: Initial game state');
        await page.screenshot({ 
            path: '/Users/hadi.rickit/dev/pursuitOfPar/validation-01-initial-state.png',
            fullPage: false
        });
        
        // Wait a bit more for game to be fully ready
        await page.waitForTimeout(2000);
        
        // Check if canvas is rendering properly
        const canvasExists = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return { exists: false };
            
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let hasNonBlackPixels = false;
            
            // Check if there are any non-black pixels
            for (let i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i] > 0 || imageData.data[i + 1] > 0 || imageData.data[i + 2] > 0) {
                    hasNonBlackPixels = true;
                    break;
                }
            }
            
            return {
                exists: true,
                width: canvas.width,
                height: canvas.height,
                hasContent: hasNonBlackPixels
            };
        });
        
        console.log('Canvas status:', canvasExists);
        
        // Try to select a club
        console.log('Looking for club selection...');
        const clubButtons = await page.$$('.club-button, button[data-club], [onclick*="club"]');
        
        if (clubButtons.length > 0) {
            console.log(`Found ${clubButtons.length} club buttons, clicking the first one`);
            await clubButtons[0].click();
            await page.waitForTimeout(1000);
            
            // Screenshot 2: After club selection
            console.log('Taking screenshot 2: After club selection');
            await page.screenshot({ 
                path: '/Users/hadi.rickit/dev/pursuitOfPar/validation-02-club-selected.png',
                fullPage: false
            });
        }
        
        // Look for shot button
        console.log('Looking for shot button...');
        const shotButtons = await page.$$('button:contains("Take Shot"), button:contains("Shot"), [onclick*="shot"], [onclick*="Shot"]');
        
        // If no specific shot button, try generic buttons
        if (shotButtons.length === 0) {
            const allButtons = await page.$$('button');
            console.log(`Found ${allButtons.length} buttons total`);
            
            for (let i = 0; i < allButtons.length; i++) {
                const buttonText = await allButtons[i].evaluate(el => el.textContent);
                console.log(`Button ${i}: "${buttonText}"`);
                
                if (buttonText.toLowerCase().includes('shot') || buttonText.toLowerCase().includes('swing')) {
                    console.log('Clicking shot button');
                    await allButtons[i].click();
                    await page.waitForTimeout(2000);
                    break;
                }
            }
        } else {
            console.log('Clicking dedicated shot button');
            await shotButtons[0].click();
            await page.waitForTimeout(2000);
        }
        
        // Screenshot 3: After taking a shot
        console.log('Taking screenshot 3: After taking a shot');
        await page.screenshot({ 
            path: '/Users/hadi.rickit/dev/pursuitOfPar/validation-03-after-shot.png',
            fullPage: false
        });
        
        // Check for ball visibility and position
        const ballInfo = await page.evaluate(() => {
            // Look for Phaser game objects
            if (window.game && window.game.scene && window.game.scene.scenes[0]) {
                const scene = window.game.scene.scenes[0];
                if (scene.ball) {
                    return {
                        visible: scene.ball.visible,
                        x: scene.ball.x,
                        y: scene.ball.y,
                        fillColor: scene.ball.fillColor
                    };
                }
            }
            
            // Check for canvas-drawn ball
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Look for white pixels (ball color)
                let whitePixelCount = 0;
                for (let i = 0; i < imageData.data.length; i += 4) {
                    if (imageData.data[i] > 200 && imageData.data[i + 1] > 200 && imageData.data[i + 2] > 200) {
                        whitePixelCount++;
                    }
                }
                
                return {
                    canvasExists: true,
                    whitePixelCount: whitePixelCount,
                    hasWhitePixels: whitePixelCount > 0
                };
            }
            
            return { error: 'No game objects or canvas found' };
        });
        
        console.log('Ball info:', ballInfo);
        
        // Take one more screenshot after a delay to see if anything changed
        await page.waitForTimeout(3000);
        console.log('Taking screenshot 4: Final state');
        await page.screenshot({ 
            path: '/Users/hadi.rickit/dev/pursuitOfPar/validation-04-final-state.png',
            fullPage: false
        });
        
        // Get console logs
        const consoleLogs = await page.evaluate(() => {
            return window.console._logs || 'No logs captured';
        });
        
        console.log('\n=== VALIDATION RESULTS ===');
        console.log('Canvas status:', canvasExists);
        console.log('Ball info:', ballInfo);
        console.log('Console logs:', consoleLogs);
        
        // Create a validation report
        const report = {
            timestamp: new Date().toISOString(),
            canvasStatus: canvasExists,
            ballInfo: ballInfo,
            screenshots: [
                'validation-01-initial-state.png',
                'validation-02-club-selected.png', 
                'validation-03-after-shot.png',
                'validation-04-final-state.png'
            ],
            validation: {
                gameLoaded: canvasExists.exists,
                canvasHasContent: canvasExists.hasContent,
                ballVisible: ballInfo.visible !== false,
                noBlackScreen: canvasExists.hasContent
            }
        };
        
        fs.writeFileSync('/Users/hadi.rickit/dev/pursuitOfPar/validation-report.json', JSON.stringify(report, null, 2));
        
        console.log('\n=== Screenshots taken ===');
        console.log('1. validation-01-initial-state.png - Initial game load');
        console.log('2. validation-02-club-selected.png - After selecting club');
        console.log('3. validation-03-after-shot.png - After taking shot');
        console.log('4. validation-04-final-state.png - Final state');
        console.log('\nValidation report saved to validation-report.json');
        
    } catch (error) {
        console.error('Error taking screenshots:', error);
    } finally {
        await browser.close();
    }
}

takeScreenshots().catch(console.error);