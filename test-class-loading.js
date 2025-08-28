// Test script to verify class loading without browser
console.log('=== Node.js Class Loading Test ===');

// Mock Phaser for testing
global.Phaser = {
    Game: function(config) {
        this.config = config;
        console.log('Mock Phaser.Game created');
    },
    Scene: class {
        constructor() {
            console.log('Mock Phaser.Scene created');
        }
    },
    AUTO: 'AUTO'
};

// Mock document and localStorage
global.document = {
    readyState: 'complete',
    addEventListener: () => {},
    getElementById: () => ({ innerHTML: '' })
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};
global.window = global;

try {
    // Load authentic mechanics
    console.log('Loading authentic-mechanics.js...');
    require('./authentic-mechanics.js');
    console.log('✓ authentic-mechanics.js loaded');
    
    // Check if AuthenticDiceSystem is available
    if (typeof AuthenticDiceSystem !== 'undefined') {
        console.log('✓ AuthenticDiceSystem class found');
    } else {
        console.log('✗ AuthenticDiceSystem class not found');
    }
    
    // Check if BoardGameShotCalculator is available
    if (typeof BoardGameShotCalculator !== 'undefined') {
        console.log('✓ BoardGameShotCalculator class found');
    } else {
        console.log('✗ BoardGameShotCalculator class not found');
    }
    
    // Load phaser engine
    console.log('Loading phaser-engine.js...');
    require('./phaser-engine.js');
    console.log('✓ phaser-engine.js loaded');
    
    // Check if PhaserBoardGameEngine is available  
    if (typeof PhaserBoardGameEngine !== 'undefined') {
        console.log('✓ PhaserBoardGameEngine class found');
        
        // Try to create instance
        const engine = new PhaserBoardGameEngine();
        console.log('✓ PhaserBoardGameEngine instance created');
        
        // Try to initialize systems
        if (engine.initializeGameSystems) {
            engine.initializeGameSystems();
            console.log('✓ Game systems initialized');
            console.log('   - diceSystem:', engine.diceSystem ? 'OK' : 'NULL');
            console.log('   - shotCalculator:', engine.shotCalculator ? 'OK' : 'NULL');  
            console.log('   - analysisSystem:', engine.analysisSystem ? 'OK' : 'NULL');
        }
        
    } else {
        console.log('✗ PhaserBoardGameEngine class not found');
    }
    
} catch (error) {
    console.error('✗ Error during testing:', error.message);
    console.error('Stack:', error.stack);
}