document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in, redirect to login page if not
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize game elements
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const restartBtn = document.getElementById('restartBtn');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const leaderboardList = document.getElementById('leaderboardList');

    // Game settings
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    // Game variables
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 0;
    let dy = 0;
    let score = 0;

    // Main game loop
    function drawGame() {
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        checkCollision();
        updateScore();
    }

    // Clear canvas for each frame
    function clearCanvas() {
        ctx.fillStyle = '#252b3d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw the snake
    function drawSnake() {
        ctx.fillStyle = '#ffffff';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    // Draw the food
    function drawFood() {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Move the snake and check for food collection
    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);
        
        if (head.x === food.x && head.y === food.y) {
            score++;
            generateFood();
        } else {
            snake.pop();
        }
    }

    // Generate food at a random position
    function generateFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    }

    // Check for collisions (with walls or itself)
    function checkCollision() {
        const head = snake[0];
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
        }
        
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
            }
        }
    }

    // Handle game over
    function gameOver() {
        alert('Game Over! Your score: ' + score);
        if (score > currentUser.highScore) {
            currentUser.highScore = score;
            updateUser(currentUser);
        }
        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        score = 0;
        generateFood();
        updateLeaderboard();
    }

    // Update the displayed score
    function updateScore() {
        scoreElement.textContent = score.toString().padStart(2, '0');
    }

    // Save updated user data
    function updateUser(user) {
        const users = JSON.parse(localStorage.getItem('users'));
        const index = users.findIndex(u => u.username === user.username);
        if (index !== -1) {
            users[index] = user;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
    }

    // Update leaderboard display
    function updateLeaderboard() {
        const users = JSON.parse(localStorage.getItem('users'));
        users.sort((a, b) => b.highScore - a.highScore);
        leaderboardList.innerHTML = '';
        users.slice(0, 5).forEach((user, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${user.username}: ${user.highScore}`;
            leaderboardList.appendChild(li);
        });
    }

    // Change direction based on key press
    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                if (dy === 0) { dx = 0; dy = -1; }
                break;
            case 'arrowdown':
            case 's':
                if (dy === 0) { dx = 0; dy = 1; }
                break;
            case 'arrowleft':
            case 'a':
                if (dx === 0) { dx = -1; dy = 0; }
                break;
            case 'arrowright':
            case 'd':
                if (dx === 0) { dx = 1; dy = 0; }
                break;
        }
    });

    // Reset game on restart button 
    restartBtn.addEventListener('click', () => {
        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        score = 0;
        generateFood();
    });

    // Logout user and redirect to login page
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'home.html';
    });

    // Display current username
    userDisplay.textContent = currentUser.username;

    // Initial setup for leaderboard and food
    updateLeaderboard();
    generateFood();

    // Start the game loop
    setInterval(drawGame, 100);
});
