// declare gameBoard object using a module
const gameBoard = (() => {

    // declare Player object using a factory function
    const Player = (name, marker) => {
        return { name, marker };
    };

    let playerOne = Player('Player 1', 'X');
    let playerTwo = Player('Player 2', 'O');

    // win conditions
    const winConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    // initialise game tracking vars
    let activePlayer = playerOne;
    let winner = '';
    let turns = 0;

   // set board to array
    let board = [];

    // make a new div for each item in board
    let container = document.getElementById('gameboard');
    let squaresArray = Array.from(container.children);
    let comment = document.getElementById('commentary');
    let button = document.getElementById('playAgain');

    // method to check winner
    function checkWinner() {
        winConditions.forEach((item, index) => {
            // check if any of the win conditions have been met
            if (board[item[0]] == 'X' && board[item[1]] == 'X' && board[item[2]] == 'X') {
                // set the winner variable
                winner = playerOne.name;
                container.classList.add('overlay');
                container.classList.add('nopointers');
                comment.innerHTML = `${winner} wins!`
                button.classList.remove('hidden');
                return winner;
            } else if (board[item[0]] == 'O' && board[item[1]] == 'O' && board[item[2]] == 'O') {
                // set the winner variable
                winner = playerTwo.name;
                container.classList.add('overlay');
                container.classList.add('nopointers');
                comment.innerHTML = `${winner} wins!`
                button.classList.remove('hidden');
                return winner;
            } else if (winner == '' && turns == 9) {
                // if 9 turns taken and no winner, declare tie
                winner = 'tie';
                container.classList.add('overlay');
                container.classList.add('nopointers');
                comment.innerHTML = "It's a tie!"
                button.classList.remove('hidden');
                return winner;
            }  
        }); 
    };


    // method to play a turn
    function playTurn() {
        // add a event listener to each square 
        squaresArray.forEach((square, index) => square.addEventListener('click', () => {
            if (square.classList.contains('X') || square.classList.contains('O'))  {
                return
            } else {
                // add the player's marker to the div
                square.classList.add(this.activePlayer.marker);
                square.setAttribute('data', this.activePlayer.marker);
                // update the board
                board[index] = this.activePlayer.marker;
                // update game turns
                turns += 1;
                // check for winner
                checkWinner();
                // update the UI
                if (winner == '') {
                    // update the commentary
                    displayController.alertNextPlayer();
                    // switch to next player
                    displayController.nextPlayer();  
                }
            }
        }));
    };
    
    function gameReset() {
        winner = '';
        turns = 0;
        activePlayer = playerOne;
        board.splice(0, board.length);
    };

    return {
        board, squaresArray, playTurn, checkWinner, gameReset, playerOne, playerTwo, winner, activePlayer
    };
})();


// declare the Game object using a module
const displayController = (() => {

    let beginGameContainer = document.getElementById('begin-game-container');
    let beginGameButton = document.getElementById('begin');
    let comment = document.getElementById('commentary');
    let button = document.getElementById('playAgain');
    let board = document.getElementById('gameboard');
    let winner = gameBoard.winner;

    // before game start
    beginGameButton.addEventListener('click', function() {
        let playerOneName = document.getElementById('player-one-name').value
        if (!playerOneName) {
            gameBoard.playerOne.name = 'Player One'
        } else {
            gameBoard.playerOne.name = playerOneName;
        }
        
        gameBoard.playerOne.marker = 'X';
        let playerTwoName = document.getElementById('player-two-name').value
        if (!playerTwoName) {
            gameBoard.playerTwo.name = 'Player Two'
        } else {
            gameBoard.playerTwo.name = playerTwoName;
        }
        
        gameBoard.playerTwo.marker = 'O';
        
        // on game start
        comment.innerHTML = `${gameBoard.playerOne.name} moves first - click any square to begin a game`;
        displayBoard();
        gameBoard.playTurn();
    
    });

    function winDisplay() {
        board.classList.add('overlay');
        board.classList.add('nopointers');
        if (winner == 'tie') {
            comment.innerHTML = "It's a tie!"
        } else {
            comment.innerHTML = `${winner} wins!`
        }
        button.classList.remove('hidden');
    }

    function displayBoard() {
        board.classList.remove('hidden');
        beginGameContainer.classList.add('hidden');
    }

    // alert next player method
    function alertNextPlayer() {
        if (gameBoard.activePlayer == gameBoard.playerOne) {
            comment.innerHTML = `${gameBoard.playerTwo.name}'s turn`;
        } else {
            comment.innerHTML = `${gameBoard.playerOne.name}'s turn`;
        }
    };

    // next player method
    function nextPlayer() {
        if (gameBoard.activePlayer == gameBoard.playerOne) {
            gameBoard.activePlayer = gameBoard.playerTwo;
        } else {
            gameBoard.activePlayer = gameBoard.playerOne;
        }
    };

    // replayGame method
    function replayGame() {
        gameBoard.gameReset();
        // update each square to have no text content   
        gameBoard.squaresArray.forEach((square, index) => {
            if (square.classList.contains('X')) {
                square.classList.remove('X');
            } else if (square.classList.contains('O'))  {
                square.classList.remove('O');
            }
            button.classList.add('hidden');
            comment.innerHTML = '';
        })  
    }

    function mainDisplay() {
        gameBoard.activePlayer = gameBoard.playerOne;
        comment.innerHTML = '';
        if (!board.classList.contains('hidden')) {
            board.classList.add('hidden');
        }
        if (board.classList.contains('overlay')) {
            board.classList.remove('overlay');
        }
        if (board.classList.contains('nopointers')) {
            board.classList.remove('nopointers');
        }
        if (!button.classList.contains('hidden')) {
            button.classList.add('hidden');
        }
        if (beginGameContainer.classList.contains('hidden')) {
            beginGameContainer.classList.remove('hidden');
        }
        replayGame();
    }

    button.addEventListener('click', function() {
       mainDisplay();
    })

    return {
        winDisplay, displayBoard, alertNextPlayer, nextPlayer
    };
})();

