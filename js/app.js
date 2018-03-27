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

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
// Display card function 
function openCard(event) {
    //disable card opening if there're two cards opened
    if (openedCards.length === 2) {
        return false;
    }
    this.classList.toggle('open');
    this.classList.toggle('show');
}

//function to run if two opened cards match
function match() {
    setTimeout(function() {
        openedCards[0].classList.add('match');
        openedCards[1].classList.add('match');
        openedCards[0].classList.remove('show', 'open');
        openedCards[1].classList.remove('show', 'open');
        matchedCards.push(openedCards[0], openedCards[1]);
        openedCards = [];
    }, 750);
}

//function to run if two opened cards do not match
function notMatch() {
    setTimeout(function() {
        openedCards[0].classList.remove('show', 'open');
        openedCards[1].classList.remove('show', 'open');
        openedCards = [];
    }, 1000);
}

//add the card to a *list* of "open" cards function 
function addToOpenedCards(event) {
    openedCards.push(this);
    if (openedCards.length === 2) {
        //if opened cards match run match else run unmatched function
        if (openedCards[0].firstElementChild.classList.value === openedCards[1].firstElementChild.classList.value) {
            match();
        } else {
            notMatch();
        }
    }
}

// Event listeners
// Start new game on restart button press
restart.addEventListener('click', startGame);

//Start new game on document load
document.addEventListener('DOMContentLoaded', startGame);

// Add event listeners on card click
for (let i = 0; i < iconSet.length; i++) {
    cards[i].addEventListener('click', openCard);
    cards[i].addEventListener('click', addToOpenedCards);
}