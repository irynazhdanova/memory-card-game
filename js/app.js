/*
 * Create a list that holds all of your cards
 */
const iconSet = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt', 'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'];

// Declare variables
const deck = document.querySelector('.deck');

const cards = document.querySelectorAll('.deck li');

const restart = document.querySelector('.restart');

let openedCards = [];

let matchedCards = [];

let moveCount = document.querySelector('.moves');

let moves = 0;// move counter (two opened cards)

let clicks = 0; // click counter

const starList = document.querySelector('.stars');

let stars =  document.querySelectorAll('.stars li');

const timer = document.querySelector('.timer');

let time; // used to set setInterval with time count function

let modal = document.getElementById('modal');

let finalTimer = document.querySelector('.final-score-timer');

let finalMoves = document.querySelector('.final-move-count');

let finalStars = document.querySelector('.final-score .stars');

const closeModalButton = document.querySelector('.close-modal');

const playAgainButton = document.querySelector('.play-again');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
//Start new game on document load
document.addEventListener('DOMContentLoaded', startGame);

// Start new game on restart button press
restart.addEventListener('click', function() {
    // Disable restart game from restart button if modal is open
    if (modal.style.display === 'block') {
        return false;
    } else {
        startGame();
    } 
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//start game function definition
function startGame() {
    //empty cards arrays
    emptyArray(openedCards);
    emptyArray(matchedCards);

    //reset moves count
    clicks = 0;
    moves = 0;
    moveCount.innerHTML = moves;
    // reset star rating
    for (let i = 0; i < stars.length; i++) {
        stars[i].firstElementChild.className = 'fa fa-star';
    }
    //reset timer
    seconds = 0;
    minutes = 0;
    hours = 0;
    stopTimer();
    timer.innerHTML = addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds);
    //empty the list of cards
    deck.innerHTML = '';

    //shuffle the icons
    let shuffledIconSet = shuffle(iconSet);
    
    //add a card from cards nodeList with only class 'card' 
    cards.forEach(function(card){
        deck.appendChild(card);
        card.classList = 'card';
        //add an icon to each card
        for (let i = 0; i < shuffledIconSet.length; i++) {
        cards[i].firstElementChild.className = shuffledIconSet[i];
        }
    });
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Function to open cards 
deck.addEventListener('click', function(event) {
    //Check if user clicked a card on the deck
    if(!(event.target.className === 'deck') && (openedCards.length <= 2)) {
        openCard(event);
        addToOpenedCards(event);
    } 
});

//A function to open a card's icon
function openCard(event) {
    if(openedCards.length < 2) {
        event.target.className = 'card open show disable';
    } else {
        return false;
    }
}

//Add opened card to the list of opened cards
function addToOpenedCards(event) {
    openedCards.push(event.target.firstElementChild);
    moveCounter();
    // Check if two cards match or not happens when there're two opened cards
    if (openedCards.length === 2) {        
        // Compare if two opened cards match  
        if (openedCards[0].classList.value === openedCards[1].classList.value) {
            match(openedCards, matchedCards);
        } else {
            notMatch(openedCards);
        }
    } 
}

// Function to run if two opened cards do match
// cards are locked in the open position
function match(arr1, arr2) {
    setTimeout(function(){
        arr1[0].parentNode.classList.remove('open', 'show');
        arr1[0].parentNode.classList.add('match');
        arr1[1].parentNode.classList.remove('open', 'show');
        arr1[1].parentNode.classList.add('match');
        arr2.push(arr1[0], arr1[1]);
        emptyArray(arr1);
    }, 800);
    // when all cards do match matched cards list contains 16 items and modal appears
    setTimeout(function(){
        if(arr2.length === 16) {
            gameWon();
        }
    }, 1000);
}

// Empty an array
function emptyArray(arr) {
    arr.splice(0, arr.length);
}

// Function to run if two opened cards do not match
// Cards get closed and become available for clicks again
function notMatch(arr) {
        setTimeout(function(){
            arr[0].parentNode.classList.add('mismatch');
            arr[1].parentNode.classList.add('mismatch');
        }, 500);
        setTimeout(function() {
            arr[0].parentNode.classList.remove('open', 'show', 'disable', 'mismatch');
            arr[1].parentNode.classList.remove('open', 'show', 'disable', 'mismatch');
            openedCards = [];
        }, 1500); 
}

//Count clicks function
function moveCounter() {
    clicks++;
    // if user opened two cards add one move to moves
    moves = Math.floor(clicks/2);
    
    if (moves ===1) {
        moveCount.nextElementSibling.innerHTML = ' Move';
    } else {
        moveCount.nextElementSibling.innerHTML = ' Moves';
    }
    // Display move count 
    moveCount.innerHTML = moves;
    if (clicks === 1) {
        time = setInterval(function(){
            timeCount();
        }, 1000);
    }

    // change stars rating according to the move count
    if (moves >= 0 && moves < 13) {
        for (let i = 0; i < stars.length; i++) {
            stars[i].firstElementChild.className = 'fa fa-star';
        }
    } else if (moves >= 13 && moves <= 18) {
        starList.lastElementChild.firstElementChild.className = 'fa fa-star-o';
    } else if (moves > 18) {
        starList.lastElementChild.previousElementSibling.firstElementChild.className = 'fa fa-star-o';
    }
}

/* 
Timer functionality
*/

// Timer function
let seconds = 0;
let minutes = 0;
let hours = 0;

function timeCount() {
        timer.innerHTML = addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds);
        seconds++;
        if(seconds === 60) {
            minutes++;
            seconds = 0;
        }
        
        if(minutes === 60) {
            hours++;
            minutes = 0;
        }
}

// Stop timer
    function stopTimer() {
        clearInterval(time);
    }

// Add zeros to timer displayed on the page 
function addZero(num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return num;
    }
}

// Congratulation (you won) window
function gameWon() {
    stopTimer();
    modal.style.display = 'block';
    finalMoves.innerHTML = moveCount.innerHTML;
    finalTimer.innerHTML = timer.innerHTML;
    finalStars.innerHTML = 'Rating: ' + starList.innerHTML; 
}

// Close modal without starting new game
function closeModal() {
    modal.style.display = 'none';
}

// Event listener for 'No, thanks!' button to close modal
closeModalButton.addEventListener('click', function() {
    closeModal();
});

// Event listener for 'Play again!' button 
//to close modal and start new game
playAgainButton.addEventListener('click', function() {
    closeModal();
    startGame();
});

