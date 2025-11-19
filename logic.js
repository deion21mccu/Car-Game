const roadArea = document.querySelector('.road');
let player = { step: 5 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false, Space: false };
let score = 0;
const startBtn = document.querySelector(".btn");

// Event listeners for key presses
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(event) {
    if (event.key === " ") {
        event.preventDefault(); // Prevent scrolling on space
        keys.Space = true;
    } else {
        keys[event.key] = true;
    }
}

function keyUp(event) {
    if (event.key === " ") {
        keys.Space = false;
    } else {
        keys[event.key] = false;
    }
}

function moveLines() {
    let lines = document.querySelectorAll('.lines');
    lines.forEach(item => {
        // If line is off the bottom of the road, reset it to the top
        if (item.y >= roadArea.offsetHeight) {
            item.y = item.y - (roadArea.offsetHeight + 150); // Reset above the road area
        }
        item.y = item.y + player.step;
        item.style.top = item.y + 'px';
    });
}

function moveEnemies(playercar) {
    let vehicles = document.querySelectorAll('.enemies');
    let playercarb = playercar.getBoundingClientRect();

    vehicles.forEach(item => {
        let othercarb = item.getBoundingClientRect();
        
        // Collision Detection: Check if bounding boxes overlap
        if (!((playercarb.bottom < othercarb.top) || (playercarb.top > othercarb.bottom) || (playercarb.left > othercarb.right) || (playercarb.right < othercarb.left))) {
            alert("The Final Score is " + (score) + "\nPress OK to play again");
            // Stop the game and reload the page
            player.start = false;
            location.reload(); 
            return;
        }

        // If enemy car passes the bottom of the road
        if (item.y >= roadArea.offsetHeight) {
            // Player earns score
            score = score + 1;
            startBtn.innerHTML = "Score: " + score;
            
            // Reposition the enemy car to the top with a new random X position
            item.y = -300;
            item.style.left = Math.floor(Math.random() * (roadArea.offsetWidth - 41)) + 'px'; // 41 is the car width
        }

        // Move the enemy car down
        item.y = item.y + player.step;
        item.style.top = item.y + 'px';
    });
}

function playArea() {
    let playercar = document.querySelector('.car');
    let road = roadArea.getBoundingClientRect();
    
    if (player.start) {
        moveLines();
        moveEnemies(playercar);

        // Player Movement Logic
        const playerHeight = playercar.offsetHeight;
        const playerWidth = playercar.offsetWidth;

        if (keys.ArrowUp && player.y > (road.top)) {
            player.y = player.y - player.step;
        }

        if (keys.ArrowDown && player.y < (road.height - playerHeight)) {
            player.y = player.y + player.step;
        }

        if (keys.ArrowLeft && player.x > 0) {
            player.x = player.x - player.step;
        }

        if (keys.ArrowRight && player.x < (road.width - playerWidth)) {
            player.x = player.x + player.step;
        }

        // Apply new position to the player car
        playercar.style.top = player.y + 'px';
        playercar.style.left = player.x + 'px';
        
        // Loop the game
        window.requestAnimationFrame(playArea);
    }
}

function init() {
    player.start = true;
    window.requestAnimationFrame(playArea);
    
    // Clear any previous elements (in case of restart logic)
    roadArea.innerHTML = '';

    // Create road lines
    for (let i = 0; i < 5; i++) {
        let roadlines = document.createElement('div');
        roadlines.setAttribute('class', 'lines');
        roadlines.y = i * 150;
        roadlines.style.top = roadlines.y + 'px';
        roadArea.appendChild(roadlines);
    }

    // Create player car
    let playercar = document.createElement('div');
    playercar.setAttribute('class', 'car');
    roadArea.appendChild(playercar);

    // Initial positioning of player car (centered near bottom)
    const roadWidth = roadArea.offsetWidth;
    const roadHeight = roadArea.offsetHeight;
    
    // Set initial player properties (using dimensions from CSS)
    // NOTE: If CSS is not yet fully loaded, these might be 0. We'll use hardcoded values based on CSS: 41px width, 75px height
    player.x = (roadWidth / 2) - (41 / 2); // Centered
    player.y = roadHeight - 100; // 100px from the bottom

    playercar.style.left = player.x + 'px';
    playercar.style.top = player.y + 'px';
    
    // Create enemy cars
    for (let x = 0; x < 4; x++) {
        let enemies = document.createElement('div');
        enemies.setAttribute('class', 'enemies');
        enemies.y = ((x + 1) * 350) * -1; // Stagger initial starting positions far above
        enemies.style.top = enemies.y + 'px';
        enemies.style.left = Math.floor(Math.random() * (roadWidth - 41)) + 'px'; // Random X position
        roadArea.appendChild(enemies);
    }
}

function startgame() {
    // Style the start button area after game begins
    document.querySelector(".push").style.border = "5px solid rgb(86,50,57)";
    startBtn.style.backgroundColor = "rgb(86,50,57)";
    startBtn.style.cursor = "not-allowed";
    startBtn.innerHTML = "Score: 0"; // Display initial score
    init();
}
