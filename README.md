# Tic Tac Toe

[View live demo](https://jcrachael.github.io/tictactoe/).

Project sourced from [The Odin Project JavaScript course](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe).

## The project

A tic tac toe game that can be played in the browser made using JavaScript and object-oriented programming.

## To-dos:
* Create an AI so the user can choose to play against a computer
    * Implement `gameBoard.playComputerTurn()` which will handle the AI's turn
    * Update `gameBoard.playTurn()` to call `playComputerTurn()` each time it is the Computer's (`playerTwo`'s) turn
    * Initially the AI will be on "easy" mode, just choosing a valid square at random to place their marker each turn
    * Once the "easy" mode is implemented, I plan to implement a "hard" mode where the AI is unbeatable

## Pseudocode

UI:
* Title
* Choose opponent screen: Human or AI
* Begin game screen:
    * Name: [text input placeholder = "Player 1"]
    * Name: [text input placeholder = "Player 2"] (human-v-human game only)
    * Button: "Begin game"
* Game screen:
    * Commentary: "Player 1 moves first. Click any square to begin."
    * Game board
    * Commentary updates each turn; on game win, a button "Play again" appears
    * If user clicks "Play again", the game board is wiped and starts again

Game:

* Module: `gameBoard`
    * has factory function method called `createPlayer` that returns the properties `name` (the player's name) and `marker` (e.g., `X` or `O`) inan object
    * initialises the two players `playerOne` and `playerTwo`
    * stores `winConditions` variable as an array of arrays, `activePlayer`, `winner`, `turns`
    * has property `board` - an (initially empty) array of length 9 containing the markers for each player
    * has method `playComputerTurn` which will handle AI turn by selecting a random available index from `board` each turn (on easy mode)
    * has method `playTurn` which adds an event listener to each `<div class="square">` element that listens for clicks and, on click:
        * increases the `turns` counter
        * checks that square does not currently have a class of `X` or `O`
        * if it doesn't, then update that square with the `activePlayer`'s marker and give it the corresponding class
        * update the game state
        * validate the game state:
            * check if a player has won using `checkWinner` method
            * check if the game ended in a draw
                * if yes, end the game
            * if no, change the active player and update the commentary
            * update the UI
        * checks if it is an AI turn next and if so, calls `playComputerTurn` at the appropriate time
    * has method `checkWinner` which:
        * checks if any of the `winCondition`s have been satisfied and if so, declares `winner` to the activePlayer 
        * otherwise checks if it is a tie (turns = 9 and no winner) in which case `winner` is set to `tie` 
        * if there is a `winner` then call the `winDisplay` method 
        * returns `winner`
    * has method `gameReset` which resets the board and display:
        * set `winner` to null, `turns` to 0, `activePlayer` to default etc.
        * `board.splice(0, board.length)`
    * returns `checkWinner`, `gameReset`, `playTurn`, `board`, `playerOne`, `playerTwo`, `winner`
        


* Module: `displayController` - controls the flow of the game
    * fetches DOM elements
    * adds event listener to play again button that calls `replayGame`
    * adds event listener to begin game button that calls `displayBoard`
    * method `winDisplay`
        * returns commentary based on win conditions
        * displays the play again button
    * method `displayBoard` which displays the game board and hides the begin game button
    * method `replayGame`
        * calls `gameBoard.gameReset()`
        * updates each square to have no text content
        * removes the play again button
        * resets the commentary
    * method `mainDisplay` 
        * hides the squares, play again button
        * displays the player name inputs, and play button
        * calls `replayGame()`
    * returns `winDisplay`, `displayBoard`
    
    


---

Last modified: 26 October 2022