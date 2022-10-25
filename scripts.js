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

    // method to check winner
    function checkWinner() {
        console.log('Checking for a winner...');
        console.log('The active player is: ' + activePlayer.name);
        winConditions.forEach((item, index) => {
            // check if any of the win conditions have been met
            if (board[item[0]] == 'X' && board[item[1]] == 'X' && board[item[2]] == 'X') {
                    // set the winner variable
                    winner = playerOne.name;
                    console.log('We have a winner! > ' + playerOne.name);
                    displayController.winDisplay();
                } else if (board[item[0]] == 'O' && board[item[1]] == 'O' && board[item[2]] == 'O') {
                    // set the winner variable
                    winner = playerTwo.name;
                    console.log('We have a winner! > ' + playerTwo.name);
                    displayController.winDisplay();
                } else {
                // check for a tie if no winner
                if (winner == '' && turns == 9) {
                    // if 9 turns taken and no winner, declare tie
                    winner = 'tie';
                    console.log('It\'s a tie!');
                } else {
                    console.log("No winner yet...")
                }
            }  
        })

        return winner
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
                console.log('Board: ' + board);
                console.log('Turns: ' + turns);
                checkWinner();
                // update the UI
                // if winner has been declared, update the commentary
                if (winner != '') {
                    displayController.winDisplay();
                // if no winner declared, update commentary and move to next turn
                } else {
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
    

    // before game start
    beginGameButton.addEventListener('click', function() {
        let playerOneName = document.getElementById('player-one-name').value
        gameBoard.playerOne.name = playerOneName;
        gameBoard.playerOne.marker = 'X';
        let playerTwoName = document.getElementById('player-two-name').value
        gameBoard.playerTwo.name = playerTwoName;
        gameBoard.playerTwo.marker = 'O';
        
        // on game start
        comment.innerHTML = `${gameBoard.playerOne.name} moves first - click any square to begin a game`;
        displayBoard();
        gameBoard.playTurn();
    
    });

    function winDisplay() {
        board.classList.add('overlay');
        board.classList.add('nopointers');
        if (gameBoard.winner == 'tie') {
            comment.innerHTML = "It's a tie!"
        } else {
            comment.innerHTML = `${gameBoard.activePlayer.name} wins!`
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
        console.log('The current player is ' + gameBoard.activePlayer.name);
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
       console.log('Play again button pressed');
       mainDisplay();
    })

    return {
        winDisplay, displayBoard, alertNextPlayer, nextPlayer
    };
})();

