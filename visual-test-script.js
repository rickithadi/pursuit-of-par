// Visual Testing Script for Phaser Golf Game
// This script will run in the browser console to diagnose rendering issues

console.log('🔍 Starting Visual Diagnostic Test...');

// Test 1: Check if we're on the right page
const currentUrl = window.location.href;
console.log('Current URL:', currentUrl);

// Test 2: Check Phaser availability  
console.log('Phaser available:', typeof Phaser !== 'undefined' ? '✅' : '❌');
if (typeof Phaser !== 'undefined') {
    console.log('Phaser version:', Phaser.VERSION);
}

// Test 3: Find canvas elements
const canvases = document.querySelectorAll('canvas');
console.log('Canvas elements found:', canvases.length);

canvases.forEach((canvas, index) => {
    console.log(`Canvas ${index}:`, {
        width: canvas.width,
        height: canvas.height,
        style: {
            display: canvas.style.display,
            visibility: canvas.style.visibility,
            backgroundColor: canvas.style.backgroundColor
        },
        parent: canvas.parentElement?.id || canvas.parentElement?.className
    });
    
    // Check if canvas is actually rendering
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const imageData = ctx.getImageData(0, 0, Math.min(10, canvas.width), Math.min(10, canvas.height));
        const hasContent = Array.from(imageData.data).some(pixel => pixel !== 0);
        console.log(`Canvas ${index} has content:`, hasContent ? '✅' : '❌');
    }
});

// Test 4: Check for Phaser game instance
console.log('Phaser game instances:', {
    'window.game': typeof window.game,
    'window.phaserGame': typeof window.phaserGame,
    'window.boardGame': typeof window.boardGame
});

// Test 5: Check containers
const containers = [
    'phaserContainer',
    'course3DViewport', 
    'gameContainer',
    'phaser-container'
];

containers.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        console.log(`Container ${id}:`, {
            exists: '✅',
            dimensions: `${element.offsetWidth}x${element.offsetHeight}`,
            backgroundColor: getComputedStyle(element).backgroundColor,
            children: element.children.length
        });
    } else {
        console.log(`Container ${id}: ❌ Not found`);
    }
});

// Test 6: Check for JavaScript errors
const originalError = console.error;
let errorCount = 0;
console.error = function(...args) {
    errorCount++;
    originalError.apply(console, ['ERROR ' + errorCount + ':', ...args]);
};

// Test 7: Scene validation (if Phaser is available)
if (typeof Phaser !== 'undefined' && window.phaserScene) {
    console.log('Phaser scene:', {
        exists: '✅',
        scene: window.phaserScene.scene?.key,
        children: window.phaserScene.children?.list?.length || 0
    });
}

// Test 8: UI Controls validation
const clubButtons = document.querySelectorAll('.club-button');
const takeShot = document.getElementById('takeShot');
const dice = document.querySelectorAll('.dice');

console.log('UI Elements:', {
    clubButtons: clubButtons.length + ' found',
    takeShot: takeShot ? '✅' : '❌',
    dice: dice.length + ' found'
});

// Test 9: Check CSS that might be hiding content
const phaserContainer = document.querySelector('.phaser-container, #phaserContainer');
if (phaserContainer) {
    const styles = getComputedStyle(phaserContainer);
    console.log('Phaser container styles:', {
        display: styles.display,
        overflow: styles.overflow,
        backgroundColor: styles.backgroundColor,
        position: styles.position,
        zIndex: styles.zIndex
    });
}

// Test 10: Final diagnostic summary
setTimeout(() => {
    console.log('\n🔍 DIAGNOSTIC SUMMARY:');
    console.log('='.repeat(50));
    console.log('URL:', currentUrl);
    console.log('Phaser loaded:', typeof Phaser !== 'undefined' ? '✅' : '❌');
    console.log('Canvas elements:', canvases.length);
    console.log('JavaScript errors:', errorCount);
    console.log('Page load complete:', document.readyState === 'complete' ? '✅' : '❌');
    
    // Try to force scene creation if possible
    if (typeof Phaser !== 'undefined' && canvases.length > 0) {
        console.log('\n🔧 ATTEMPTING MANUAL SCENE TEST...');
        try {
            const testCanvas = canvases[0];
            const ctx = testCanvas.getContext('2d');
            
            // Draw test graphics
            ctx.fillStyle = '#FF0000'; // Red
            ctx.fillRect(10, 10, 50, 50);
            ctx.fillStyle = '#00FF00'; // Green  
            ctx.fillCircle?.(100, 50, 20) || ctx.beginPath();
            
            console.log('✅ Manual canvas drawing test complete');
        } catch (error) {
            console.log('❌ Manual canvas test failed:', error.message);
        }
    }
    
    console.log('='.repeat(50));
}, 1000);

// Return a summary object
window.diagnosticResults = {
    url: currentUrl,
    phaserAvailable: typeof Phaser !== 'undefined',
    canvasCount: canvases.length,
    errorCount: errorCount,
    timestamp: new Date().toISOString()
};