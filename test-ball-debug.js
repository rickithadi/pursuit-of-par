// Simple ball movement test script
console.log('Ball debug script loaded');

function testBallMovement() {
    const ball = document.getElementById('ballPosition');
    
    if (!ball) {
        console.error('Ball element not found!');
        return;
    }
    
    console.log('Ball element found:', ball);
    console.log('Current ball styles:', {
        left: ball.style.left,
        bottom: ball.style.bottom,
        position: ball.style.position || getComputedStyle(ball).position
    });
    
    // Test 1: Direct style change
    console.log('Test 1: Moving ball to 75%, 50%');
    ball.style.left = '75%';
    ball.style.bottom = '50%';
    ball.style.backgroundColor = 'red';
    
    setTimeout(() => {
        console.log('Test 2: Moving ball to 25%, 80%');
        ball.style.left = '25%';
        ball.style.bottom = '80%';
        ball.style.backgroundColor = 'blue';
        
        setTimeout(() => {
            console.log('Test 3: Back to original position and color');
            ball.style.left = '50%';
            ball.style.bottom = '5%';
            ball.style.backgroundColor = '#FFD700';
        }, 2000);
        
    }, 2000);
}

// Test when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, waiting 3 seconds then testing ball...');
    setTimeout(testBallMovement, 3000);
});

// Add global function to test manually
window.testBallMovement = testBallMovement;