function bestMove() {
  let bestScore = -Infinity;
  let move;

  // Iterate through all empty spots on the board
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        board[i][j] = ai; // Try the current spot with AI move
        let score = minimax(board, 0, false); // Get minimax score for this move
        board[i][j] = ''; // Reset the spot

        // Update bestScore and move if this score is better
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }

  // Make the best move found
  board[move.i][move.j] = ai;
  currentPlayer = human; // Switch to human's turn
  waitingForMove = false; // Reset the flag
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
          board[i][j] = ai; // Try the current spot with AI move
          let score = minimax(board, depth + 1, false); // Recursively minimize human's score
          board[i][j] = ''; // Reset the spot
          bestScore = max(score, bestScore); // Get the maximum score
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = human; // Try the current spot with human move
          let score = minimax(board, depth + 1, true); // Recursively maximize AI's score
          board[i][j] = ''; // Reset the spot
          bestScore = min(score, bestScore); // Get the minimum score
        }
      }
    }
    return bestScore;
  }
}