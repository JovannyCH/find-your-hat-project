const readline = require("readline");

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// Create readline out from class to call since function
const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Task 2  create a class with the a constructor and should take a argument
class Field {
    constructor(array) {
        this.board = array;
        // Save the position of the player
        while (true) {
            // Generate a random position
            let player_x = Math.floor(Math.random() * this.board.length);
            let player_y = Math.floor(Math.random() * this.board[0].length);
            // Check if the position is valid
            if (this.board[player_x][player_y] === fieldCharacter) {
                // If the position is valid insert the player
                this.board[player_x][player_y] = pathCharacter;
                // Save the position of the player
                this.positionPlayer = { x: player_x, y: player_y };
                // Break the loop
                break;
            }
        }
    }
    // Method to print the board
    printBoard() {
        console.clear();
        for (const rows of this.board) {
            console.log(rows.join(""));
        }
    }
    // Metthod to get input from user and give instructions to move
    getInstructionsFromUser() {
        // Get position from player
        const { x, y } = this.positionPlayer;
        let newX = x;
        let newY = y;
        this.printBoard();
        console.log("Instructions to move.\n{w to up}\n{s to down}\n{d to right}\n{a to left}");
        readLine.question("Which is your path? ", (input) => {
            // Switch to determine the new position of player
            switch (input) {
                case "w":
                    newX -= 1;
                    break;
                case "s":
                    newX += 1;
                    break;
                case "d":
                    newY += 1;
                    break;
                case "a":
                    newY -= 1;
                    break;
                default:
                    console.log("Your input is invalid.");
                    break; // Go ut of event without changes
            }
            this.checkGameStatus(newX, newY);
        });
    }

    // Method to evaluate if the player win, lost or go out of board
    checkGameStatus(evaX, evaY) {
        // Check if the player go out of the board
        if (evaX < 0 || evaX >= this.board.length || evaY < 0 || evaY >= this.board[0].length) {
            console.log("You can not move outside the board.");
            readLine.close();
            return;
        }
        // Check if the player win
        // Accessed to position evaX and evaY to check in the boerd
        if (this.board[evaX][evaY] === hat) {
            // if player is in the hat position
            // print the next and close the game
            console.log("Congratulations, you win!!!");
            readLine.close();
            // return to avoid the next code
            return;
            // Check if the player fall in a hole
            // Accessed to position evaX and evaY to check in the boerd
        } else if (this.board[evaX][evaY] === hole) {
            // if player is in the hole position
            // print the next and close the game
            console.log("You lose, you fall in a hole.");
            readLine.close();
            // return to avoid the next code
            return;
            // Check if the player don't fall in a hole or win print the board and get new instructions
        } else {
            // If the player is in a valid position update on the board
            // Update the position of the player and print the board again
            this.positionPlayer = { x: evaX, y: evaY };
            this.board[evaX][evaY] = pathCharacter;
            // Call the method to get new instructions from the player
            this.getInstructionsFromUser();
        }
        //console.log("\nPlayer in: [", evaX,"][", evaY,"]");
    }
    // Method to create a board with the dimentions and the number of holes
    static generateField(width, height, percentage) {
        let customBoard = [];
        // Create the board with own dimentions
        for (let i = 0; i < height; i++) {
            customBoard.push([]);
            for (let j = 0; j < width; j++) {
                customBoard[i].push(fieldCharacter);
            }
        }
        // Calculate the number of holes
        let numberOfHoles = Math.floor((width * height) * (percentage / 100));
        // Insert the holes in random positions
        for (let h = 0; h < numberOfHoles; h++) {
            while (true) {
                // Generate random position for the hole
                let hole_x = Math.floor(Math.random() * height);
                let hole_y = Math.floor(Math.random() * height);
                // Check if the position is valid
                if (customBoard[hole_x][hole_y] === fieldCharacter) {
                    // If the position is valid insert the hole
                    customBoard[hole_x][hole_y] = hole;
                    // Break the loop
                    break;
                }
            }
        }
        // Insert the hat in a random position
        while (true) {
            // Generate a random position
            let hat_x = Math.floor(Math.random() * height);
            let hat_y = Math.floor(Math.random() * height);
            // Check if the position is valid
            if (customBoard[hat_x][hat_y] === fieldCharacter) {
                // If the position is valid insert the hat
                customBoard[hat_x][hat_y] = hat;
                // Break the loop
                break;
            }
        }
        // Return the custom board
        return customBoard;
    }
}
// Function to ask with promise 
const ask = (question) => {
    return new Promise((resolve) => {
        readLine.question(question, (answer) => {
            resolve(answer);
        });
    });
}
// This function is the main interface
const main_Function = async () => {
    // Print the welcome message
    console.log("====>|    Welcome to game!    |<====");
    console.log("Options:\n1) Try the game.\n2) Create your board and play.\n3) Quite the game.");
    // Ask the user to choose an option
    let option = await ask("Choose an option: ")
    switch (option) {
        case "1":
            console.clear();
            let tryGame = new Field([
                ['░', '░', 'O', '░', '░', '░'],
                ['░', '░', '░', '░', 'O', 'O'],
                ['░', 'O', '░', 'O', '░', 'O'],
                ['░', '░', '^', '░', '░', '░'],
                ['░', 'O', 'O', '░', 'O', 'O'],
                ['O', '░', '░', 'O', 'O', '░']
            ]);
            tryGame.getInstructionsFromUser();
            break;
        case "2":
            console.clear();
            // Get the dimentions of the board and the percentage of holes
            let widthCustom = await ask("Enter the width of the board: ");
            let heightCustom = await ask("Enter the height of the board: ");
            let percentageCustom = await ask("Enter the percentage of holes: ");

            // Pass the values to type number
            widthCustom = parseInt(widthCustom);
            heightCustom = parseInt(heightCustom);
            percentageCustom = parseInt(percentageCustom);
            // Check if the values are valid
            if (isNaN(widthCustom) || isNaN(heightCustom) || isNaN(percentageCustom)) {
                console.log("The values are invalid, try again.");
                readLine.close();
                return;
            }
            // Create the board with the custom values
            let customGame = new Field(Field.generateField(widthCustom, heightCustom, percentageCustom));
            customGame.getInstructionsFromUser();
            break;
        case "3":
            console.clear();
            console.log("Thanks for execute me!!!");
            readLine.close();
            break;
        default:
            console.log("Try again, your input is invalid.");
            readLine.close();
            break;
    }
}
// Call the main function
main_Function();
/* This form clear the screen in the plataform
process.stdout.write('\x1Bc'); 
this line code is it the same to 
console.clear(); */