document.addEventListener('DOMContentLoaded', () => {
    const handleImg = document.querySelector('.handle img');
    const balloonImg = document.querySelector('.balloon img');

    if (handleImg && balloonImg) {
        // Initial state
        balloonImg.style.display = 'none';
        balloonImg.style.height = '0px';
        balloonImg.style.width = '0px';

        startBalloonGame(handleImg, balloonImg);
    }
});

function startBalloonGame(handleImg, balloonImg) {
    let pumps = 0;                     // How many times we've pumped
    let balloonSize = 0;               // Current size of the balloon
    let isFlying = false;              // Is the balloon flying?
    
    // List of balloon images we can use
    const balloonPictures = [
        'Symbol 100001.png',
        'Symbol 100002.png',
        'Symbol 100003.png',
        'Symbol 100004.png',
        'Symbol 100005.png'
    ];
    
    // Get the original position of the handle
    const handleStartPosition = window.getComputedStyle(handleImg).transform;
    
    // 1. HANDLE ANIMATION FUNCTION
    // This makes the handle move when clicked
    function moveHandleDown() {
        // Move the handle down
        handleImg.style.transform = `${handleStartPosition} translateY(60px)`;
        handleImg.style.transition = 'transform 0.3s ease';
        
        // After a short delay, move it back up
        setTimeout(() => {
            handleImg.style.transform = handleStartPosition;
        }, 300);
    }
    
    // 2. BALLOON GROWING FUNCTION
    // This makes the balloon appear and grow
    function growBalloon() {
        // If this is the first pump, show the balloon with a random picture
        if (pumps === 0) {
            // Pick a random balloon image
            const randomNumber = Math.floor(Math.random() * balloonPictures.length);
            balloonImg.src = balloonPictures[randomNumber];
            
            // Make the balloon visible and set its position
            balloonImg.style.display = 'block';
            balloonImg.style.position = 'absolute';
        }
        
        // If we haven't pumped 4 times yet, make the balloon bigger
        if (pumps < 4) {
            // Count this pump
            pumps++;
            
            // Position balloon based on how many pumps we've done
            if (pumps === 1) {
                balloonSize = 20;
                balloonImg.style.left = '161vh';
                balloonImg.style.top = '243%';
            } else if (pumps === 2) {
                balloonSize = 90;  // 20 + 70
                balloonImg.style.left = '156vh';
                balloonImg.style.top = '210%';
            } else if (pumps === 3) {
                balloonSize = 160; // 90 + 70
                balloonImg.style.left = '151vh';
                balloonImg.style.top = '180%';
            } else if (pumps === 4) {
                balloonSize = 230; // 160 + 70
                balloonImg.style.left = '146vh';
                balloonImg.style.top = '149%';
            }
            
            // Actually change the balloon size
            balloonImg.style.height = `${balloonSize}px`;
            balloonImg.style.width = `${balloonSize}px`;
            balloonImg.style.transition = 'height 0.3s ease, width 0.3s ease, left 0.3s ease, top 0.3s ease';
        
        // If we've just done the 4th pump, make the balloon float
        } else if (pumps === 4) {
            pumps++;
            isFlying = true;
            
            // Make the balloon float up after a short delay
            setTimeout(() => {
                balloonImg.style.transition = 'all 3s ease-in-out';
                balloonImg.style.top = '10vh';
                balloonImg.style.left = '40vw';
                
                // Add the floating animation
                balloonImg.style.animation = 'floatBalloon 3s ease-in-out infinite alternate';
                
                // Now you can pop it
                balloonImg.addEventListener('click', popBalloon);
            }, 500);
        }
    }
    
    function popBalloon() {
        // 1. Hide the balloon immediately
        const balloon = document.querySelector('.balloon img');
        balloon.style.display = 'none';
        
        // 2. Create just 4 colored dots (simple version)
        const colors = ['red', 'blue', 'green', 'yellow'];
        const positions = [
            { x: 50, y: 0 },    // right
            { x: 0, y: 50 },    // down
            { x: -50, y: 0 },   // left
            { x: 0, y: -50 }    // up
        ];
        
        // Get balloon position
        const balloonRect = balloon.getBoundingClientRect();
        const centerX = balloonRect.left + balloonRect.width/2;
        const centerY = balloonRect.top + balloonRect.height/2;
        
        // Create each dot
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            dot.className = 'pop-dot'; // We'll style this in CSS
            
            // Position at balloon center
            dot.style.left = centerX + 'px';
            dot.style.top = centerY + 'px';
            dot.style.backgroundColor = colors[i];
            
            // Add to page
            document.body.appendChild(dot);
            
            // Move the dot outward
            setTimeout(() => {
                dot.style.transform = `translate(${positions[i].x}px, ${positions[i].y}px)`;
                dot.style.opacity = '0';
            }, 10);
            
            // Remove dot after animation
            setTimeout(() => {
                dot.remove();
            }, 600);
        }
        
        // 3. Reset balloon after 1 second
        setTimeout(() => {
            balloon.style.display = 'block';
            balloon.style.width = '0px';
            balloon.style.height = '0px';
            
            // Reset game state
            pumps = 0;
            balloonSize = 0;
            isFlying = false;
            balloon.style.animation = '';
        }, 1000);
    }
    
    // Listen for clicks on the pump handle
    handleImg.addEventListener('click', () => {
        moveHandleDown();
        growBalloon();
    });
    
    // Add CSS styles for animation and pop dots
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatBalloon {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-20px, -15px) rotate(5deg); }
            100% { transform: translate(20px, 15px) rotate(-5deg); }
        }
        
        .pop-dot {
            width: 10px;
            height: 10px;
            position: absolute;
            border-radius: 50%;
            transition: all 0.5s ease-out;
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
}
