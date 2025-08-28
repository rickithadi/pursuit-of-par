// Visual QA Test Script
// Since Chrome MCP is not available, we'll create a test to check DOM elements

const testUrls = [
    'http://localhost:51400/phaser-golf-working.html',
    'http://localhost:51400/enhanced-phaser-golf.html',
    'http://localhost:51400/ultimate-pursuit-of-par.html'
];

// Test for DOM elements and console output
const testScript = `
// Run this in browser console for each URL
function testPhaserCanvas() {
    console.log('=== PHASER CANVAS TEST ===');
    console.log('URL:', window.location.href);
    
    // Check if Phaser is loaded
    console.log('Phaser loaded:', typeof Phaser !== 'undefined');
    
    // Check for canvas element
    const canvas = document.querySelector('canvas');
    console.log('Canvas element found:', !!canvas);
    
    if (canvas) {
        console.log('Canvas dimensions:', canvas.width + 'x' + canvas.height);
        console.log('Canvas style:', canvas.style.cssText);
        console.log('Canvas parent:', canvas.parentElement?.id || 'no parent');
        
        // Check canvas context
        const ctx = canvas.getContext('2d');
        console.log('Canvas context available:', !!ctx);
    }
    
    // Check Phaser container
    const phaserContainer = document.getElementById('phaserContainer');
    console.log('Phaser container found:', !!phaserContainer);
    
    if (phaserContainer) {
        console.log('Container children count:', phaserContainer.children.length);
        console.log('Container background color:', getComputedStyle(phaserContainer).backgroundColor);
        console.log('Container dimensions:', phaserContainer.offsetWidth + 'x' + phaserContainer.offsetHeight);
    }
    
    // Check for game objects
    console.log('Window.game:', !!window.game);
    console.log('Window.phaserScene:', !!window.phaserScene);
    console.log('Window.boardGame:', !!window.boardGame);
    
    // Check console errors
    console.log('Current console errors (check manually for red error messages)');
    
    return {
        phaserLoaded: typeof Phaser !== 'undefined',
        canvasFound: !!canvas,
        phaserContainerFound: !!phaserContainer,
        gameObjectsFound: {
            game: !!window.game,
            phaserScene: !!window.phaserScene,
            boardGame: !!window.boardGame
        }
    };
}

// Run the test
testPhaserCanvas();
`;

console.log('Visual QA Test URLs:');
testUrls.forEach(url => {
    console.log('- ' + url);
});

console.log('\n=== MANUAL TEST INSTRUCTIONS ===');
console.log('1. Open each URL in Chrome');
console.log('2. Open Developer Tools (F12)');
console.log('3. Paste the following script in Console:');
console.log('\n' + testScript);
console.log('\n4. Look for visual differences:');
console.log('   - Is the left panel (controls) visible?');
console.log('   - Is the right panel showing a Phaser canvas?');
console.log('   - What colors are actually rendering?');
console.log('   - Are there any JavaScript errors in red?');
console.log('\n5. Try interacting:');
console.log('   - Click club buttons');
console.log('   - Try taking a shot');
console.log('   - Check if buttons respond');