// importing prompt npm package
const prompt = require('prompt');

// getting a random selection for computer
function getComputerSelection() {
    const randomNum = Math.random();
    if (randomNum <= 0.34) {
        return 'PAPER';
    } else if (randomNum <= 0.67) {
        return 'SCISSORS';
    } else {
        return 'ROCK';
    }
}

// starting the prompt
prompt.start();

// collecting user input
prompt.get(['userSelection'], (err, result) => {
    if (err) {
        console.error('Error getting user input:', err); // creating an error message for incorrect inputs
        return;
    }

    // getting user selection from prompt
    const userSelection = result.userSelection.toUpperCase();
    // getting computer selection
    const computerSelection = getComputerSelection();

    // displaying user n computer selections
    console.log('User Selection:', userSelection);
    console.log('Computer Selection:', computerSelection);

    // picking the winner based on their selections
    if (userSelection === computerSelection) {
        console.log("It's a tie!");
    } else if (
        (userSelection === 'ROCK' && computerSelection === 'SCISSORS') ||
        (userSelection === 'PAPER' && computerSelection === 'ROCK') ||
        (userSelection === 'SCISSORS' && computerSelection === 'PAPER')
    ) {
        console.log('User Wins. Good job!'); // printing
    } else {
        console.log('Computer Wins. Good game!'); // printing
    }
});
