// declare gameBoard object using a module
const gameBoard = (() => {

    // declare Player object using a factory function
    const Player = (name, marker) => {
        return { name, marker };
    };

    // initialise player objects
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
    let gameType;
    let board = [];
    let container = document.getElementById('gameboard');
    let squaresArray = Array.from(container.children);
    let comment = document.getElementById('commentary');
    let button = document.getElementById('playAgain');
    let restart = document.getElementById('restart-img');

    // method to check winner
    function checkWinner() {
        winConditions.forEach((item, index) => {
            // check if any of the win conditions have been met
            if (board[item[0]] == 'X' && board[item[1]] == 'X' && board[item[2]] == 'X') {
                // set the winner variable
                winner = playerOne.name;
                container.classList.add('overlay');
                container.classList.add('nopointers');
                restart.classList.add('hidden');
                comment.innerHTML = `${winner} wins!`
                button.classList.remove('hidden');
                return winner;
            } else if (board[item[0]] == 'O' && board[item[1]] == 'O' && board[item[2]] == 'O') {
                // set the winner variable
                winner = playerTwo.name;
                container.classList.add('overlay');
                container.classList.add('nopointers');
                restart.classList.add('hidden');
                comment.innerHTML = `${winner} wins!`
                button.classList.remove('hidden');
                return winner;
            } else if (winner == '' && turns == 9) {
                // if 9 turns taken and no winner, declare tie
                winner = 'tie';
                container.classList.add('overlay');
                container.classList.add('nopointers');
                restart.classList.add('hidden');
                comment.innerHTML = "It's a tie!"
                button.classList.remove('hidden');
                return winner;
            }  
        }); 
    };

    function playComputerTurn() {
       // initialise an empty array for the free spaces on the board
       let freeSpaceIndexes = [];
       // check which indexes of 'board' are empty and append them to the empty array
       for (let i = 0; i < 9; i++) {
           if (board[i] == undefined) {
               freeSpaceIndexes.push(i);
           }
       };
       // choose random number from freeSpaceIndexes array
       let randomIndex = freeSpaceIndexes[Math.floor(Math.random()*freeSpaceIndexes.length)];
       // check there is still free spaces on the board
       if (randomIndex != undefined) {
           // if there are free spaces, add the computer's marker to board[randomIndex]
           let chosenSquare = document.getElementById(`index-${randomIndex}`);
           board[randomIndex] = playerTwo.marker;
           chosenSquare.classList.add(playerTwo.marker);
           chosenSquare.setAttribute('data', playerTwo.marker);
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
       };
    };

    // method to play a turn (human-vs-human)
    function playTurn() {
        board = [ , , , , , , , , , ];
        // add a event listener to each square 
        squaresArray.forEach((square, index) => square.addEventListener('click', () => {
            if (square.classList.contains('X') || square.classList.contains('O'))  {
                return
            } else {
                // if human game
                if (this.gameType == 'human') {
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
      
                // else if ai game
                } else if (this.gameType == 'AI' && this.activePlayer == playerOne) {
                    // add the player's marker to the div
                    square.classList.add(this.activePlayer.marker);
                    square.setAttribute('data', this.activePlayer.marker);
                    // update the board
                    board[index] = this.activePlayer.marker;
                    turns += 1;
                    // check for winner
                    checkWinner();
                    // update the UI 
                    if (winner == '') {
                        // update the commentary
                        displayController.alertNextPlayer();
                        // switch to next player
                        displayController.nextPlayer();  
                       setTimeout(playComputerTurn, 1000);
                    }
                    
                    
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
        board, 
        gameType, 
        squaresArray, 
        playTurn, 
        checkWinner, 
        gameReset, 
        playerOne, 
        playerTwo, 
        winner, 
        activePlayer
    };
})();


// declare the Game object using a module
const displayController = (() => {
    
    // select DOM elements, set winner
    let chooseOpponentForm = document.getElementById('choose-opponent');
    let humanVsHumanButton = document.getElementById('human');
    let humanVsAIButton = document.getElementById('ai');
    let beginGameContainer = document.getElementById('begin-game-container');
    let beginGameButton = document.getElementById('begin');
    let beginAIGameContainer = document.getElementById('begin-ai-container');
    let beginAIGameButton = document.getElementById('begin-ai');
    let comment = document.getElementById('commentary');
    let button = document.getElementById('playAgain');
    let board = document.getElementById('gameboard');
    let restartButton = document.getElementById('restart-img');
    let restartText = document.getElementById('restart-comment');
    let winner = gameBoard.winner;

    // checks if human-vs-human or human-vs-AI
    function getGameType(e) {
        if (e.target.innerHTML == 'Human') {
            gameBoard.gameType = 'human';
        } else if (e.target.innerHTML == 'AI') {
            gameBoard.gameType = 'AI';
        }
        return gameBoard.gameType;
    }

    // begin a human-vs-AI game
    function beginAIGame() {
        // get human player's name
        let playerOneName = document.getElementById('player-ai-name').value;
        if (!playerOneName) {
            gameBoard.playerOne.name = 'Player One';
        } else {
            gameBoard.playerOne.name = playerOneName;
        }
        // set human player's marker
        gameBoard.playerOne.marker = 'X';

        // set AI name
        let playerTwoName = 'Computer';
        gameBoard.playerTwo.name = playerTwoName;
        // set AI marker
        gameBoard.playerTwo.marker = 'O';
        // set the first comment
        // on game start
        comment.innerHTML = `${gameBoard.playerOne.name} moves first - click any square to begin a game`;
        // display the board and hide the name input form
        displayBoard();
        // start the game 
        gameBoard.playTurn();
    };

    // begin a human-vs-human game
    function beginHumanGame() {
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

    };

    // display the win screen
    function winDisplay() {
        board.classList.add('overlay');
        board.classList.add('nopointers');
        button.classList.add('hidden');
        if (winner == 'tie') {
            comment.innerHTML = "It's a tie!"
        } else {
            comment.innerHTML = `${winner} wins!`
        }
    };

    // display the board and restart button to the screen
    function displayBoard() {
        // print the board
        board.classList.remove('hidden');
        // display the restart button
        restartButton.classList.remove('hidden');
        // if the game type is human, hide the previous enter name input screen
        if (gameBoard.gameType == 'human') {
            beginGameContainer.classList.add('hidden');
        } else if (gameBoard.gameType == 'AI') {
            beginAIGameContainer.classList.add('hidden');
        }
    };

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

    // replayGame method: resets the board and game trackers to init values
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
    };

    // display the screen to receive 2x player name inputs and then call replayGame() to set the board and game trackers to init values
    function mainDisplay() {
    
        comment.innerHTML = '';
        // hide the choose opponent form
        if (!chooseOpponentForm.classList.contains('hidden')) {
            chooseOpponentForm.classList.add('hidden');
        }
        // hide the gameboard and remove overlays
        if (!board.classList.contains('hidden')) {
            board.classList.add('hidden');
        }
        if (board.classList.contains('overlay')) {
            board.classList.remove('overlay');
        }
        if (board.classList.contains('nopointers')) {
            board.classList.remove('nopointers');
        }
        // hide the play again button
        if (!button.classList.contains('hidden')) {
            button.classList.add('hidden');
        }
        // show the "Enter names" form
        if (beginGameContainer.classList.contains('hidden')) {
                beginGameContainer.classList.remove('hidden');
        } 
        // call the function that resets variables and prints the board
        replayGame();
    };

    // display the screen to receive 1x player name input and then call replayGame() to set the board and game trackers to init values
    function mainDisplayAI() {

        comment.innerHTML = '';
        // hide the choose opponent form
        if (!chooseOpponentForm.classList.contains('hidden')) {
            chooseOpponentForm.classList.add('hidden');
        }
        // hide the gameboard and remove overlays
        if (!board.classList.contains('hidden')) {
            board.classList.add('hidden');
        }
        if (board.classList.contains('overlay')) {
            board.classList.remove('overlay');
        }
        if (board.classList.contains('nopointers')) {
            board.classList.remove('nopointers');
        }
        // hide the play again button
        if (!button.classList.contains('hidden')) {
            button.classList.add('hidden');
        }
        // show the "Enter names" form
        if (beginAIGameContainer.classList.contains('hidden')) {
            beginAIGameContainer.classList.remove('hidden');
        } 
        // call the function that resets variables and prints the board
        replayGame();
    };

    // displays the first screen "Choose Opponent"
    function chooseOpponent() {
        comment.innerHTML = '';
        restartButton.classList.add('hidden');
        // if the board isn't hidden, hide the board
        if (!board.classList.contains('hidden')) {
            board.classList.add('hidden');
        }
        // if the board has overlay/nopointers, remove those classes
        if (board.classList.contains('overlay')) {
            board.classList.remove('overlay');
        }
        if (board.classList.contains('nopointers')) {
            board.classList.remove('nopointers');
        }
        // if the play again button isn't hidden, hide it
        if (!button.classList.contains('hidden')) {
            button.classList.add('hidden');
        }
        // if the chooseOpponentForm is hidden, unhide it
        if (chooseOpponentForm.classList.contains('hidden')) {
            chooseOpponentForm.classList.remove('hidden');
        }
    };

    // add event listener to 'Human' button
    humanVsHumanButton.addEventListener('click', function(e) {
        getGameType(e);
        mainDisplay();
    });

    // add event listener to 'AI' button
    humanVsAIButton.addEventListener('click', function(e) {
        getGameType(e);
        mainDisplayAI();
    });
    
    // Human vs Human get player names and start game on "Begin game" button click
    beginGameButton.addEventListener('click', beginHumanGame);


    // Human vs AI get player name and start game on "Begin-ai" button click
    beginAIGameButton.addEventListener('click', beginAIGame);

    // restart button event listeners
     restartButton.addEventListener('mouseenter', function() {
        restartText.classList.remove('invisible');
    });

    restartButton.addEventListener('mouseleave', function() {
        restartText.classList.add('invisible');
    });

    restartButton.addEventListener('click', function() {
        replayGame();
        gameBoard.activePlayer = gameBoard.playerOne;
        if (gameBoard.gameType == 'human') {
            beginHumanGame();
        } else if (gameBoard.gameType == 'AI') {
            beginAIGame();
        }
    });

    // show the choose opponent screen on 'play again' button click
    button.addEventListener('click', function() {
       chooseOpponent();
    });

    return {
        winDisplay, displayBoard, alertNextPlayer, nextPlayer,
    };
})();

