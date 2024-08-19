let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let w;
let h;

let ai = 'X';
let human = 'O';
let currentPlayer;
let mode = '1Player'; // Default mode
let waitingForMove = false;

let player1Score = 0;
let computerScore = 0;

function setup() {
    createCanvas(400, 400);
    w = width / 3;
    h = height / 3;

    if (mode === '1Player') {
        currentPlayer = ai;
        bestMove();
    } else {
        currentPlayer = human;
    }
}

function draw() {
    background(255);
    strokeWeight(4);

    line(w, 0, w, height);
    line(w * 2, 0, w * 2, height);
    line(0, h, width, h);
    line(0, h * 2, width, h * 2);

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let spot = board[i][j];
            textSize(32);
            let r = w / 4;
            if (spot == 'O') {
                noFill();
                ellipse(x, y, r * 2);
            } else if (spot == 'X') {
                let xr = w / 4;
                line(x - xr, y - xr, x + xr, y + xr);
                line(x + xr, y - xr, x - xr, y + xr);
            }
        }
    }

    let result = checkWinner();
    if (result != null) {
        noLoop();
        updateScore(result);
    }

    if (currentPlayer === ai && mode === '1Player' && !waitingForMove) {
        setTimeout(bestMove, 500);
        waitingForMove = true;
    }
}

function checkWinner() {
    let winner = null;

    for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
        }
    }

    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
        }
    }

    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                openSpots++;
            }
        }
    }

    if (winner === null && openSpots === 0) {
        return 'tie';
    } else {
        return winner;
    }
}

function equals3(a, b, c) {
    return a === b && b === c && a !== '';
}

function mousePressed() {
    if (checkWinner() !== null) {
        resetBoard();
    } else {
        if ((mode === '2Player') || (mode === '1Player' && currentPlayer === human && !waitingForMove)) {
            let i = floor(mouseX / w);
            let j = floor(mouseY / h);

            if (board[i][j] === '') {
                board[i][j] = currentPlayer;
                waitingForMove = false;

                currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
            }
        }
    }
}

function switchMode() {
    if (mode === '1Player') {
        mode = '2Player';
        document.getElementById('modeButton').textContent = '2Player';
        document.getElementById('opponentLabel').textContent = 'Player 2:';
    } else {
        mode = '1Player';
        document.getElementById('modeButton').textContent = '1Player';
        document.getElementById('opponentLabel').textContent = 'Computer:';
    }

    player1Score = 0;
    computerScore = 0;

    updateScoreDisplay();
    resetBoard();
}

function updateScoreDisplay() {
    document.getElementById('player1Score').textContent = player1Score;
    document.getElementById('player2Score').textContent = computerScore;
}

function resetBoard() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    loop();

    if (mode === '1Player') {
        currentPlayer = ai;
        bestMove();
    } else {
        currentPlayer = human;
    }
}

function updateScore(winner) {
    if (mode === '1Player') {
        if (winner === 'X') {
            computerScore++;
        } else if (winner === 'O') {
            player1Score++;
        }
    } else {
        if (winner === 'X') {
            player1Score++;
        } else if (winner === 'O') {
            computerScore++;
        }
    }

    updateScoreDisplay();
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = ai;
                let score = minimax(board, 0, false);
                board[i][j] = '';

                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }

    board[move.i][move.j] = ai;
    currentPlayer = human;
    waitingForMove = false;
}

let scores = {
    X: 10,
    O: -10,
    tie: 0
};

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}