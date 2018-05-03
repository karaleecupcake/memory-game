/* Creates a list that holds all of the cards */
const cardsArray = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt","fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt","fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

/* Variables for deck, move counter, stars, timer, and modal*/
const deck = document.getElementById('cardDeck');
let shuffledArray = [];
let openArray = [];
let matchedArray = [];
const movesCount = document.querySelector('.moves');
let moves = 0;
const stars = document.querySelectorAll('.fa-star');
let starRating = 3;
const timer = document.querySelector('.timer');
let second = 0;
let minute = 0;
let interval;
let timeStart = false;
const modal = document.getElementById('winningModal');
let playAgain = document.getElementById('playAgain');
let endTime = document.getElementById('endTime');
let endMove = document.getElementById('endMove');
let endRating = document.getElementById('endRating');
const restart = document.querySelector('.restart');

/* Creates a new deck using the shuffle function */
function createDeck() {
  shuffledArray = shuffle(cardsArray);
  for (var i = 0; i < cardsArray.length; i++) {
    let cardList = document.createElement('li');
    cardList.classList.add('card');
    let cardIcon = document.createElement('i');
    cardIcon.classList.add('fa');
    cardIcon.classList.add(shuffledArray[i]);
    cardList.appendChild(cardIcon);
    deck.appendChild(cardList);
    cardList.addEventListener('click', clickCard);
  }
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    };
    return array;
};

/* Shows card, removes click event listener, and starts checkCard function. Starts timer on first click  */
function clickCard (event) {
  event.target.classList.add('open', 'show');
  event.target.removeEventListener('click', clickCard);
  checkCard (event);
  if (timeStart === false) {
    startTimer()
  }
};

/* Adds card to openArray and starts move counter and checkMatch funtion when there are 2 cards */
function checkCard (event) {
  openArray.push(event.target.firstChild);
  if (openArray.length === 2) {
    disable();
    movesCounter();
    checkMatch();
  }
};

/* Checks if cards match */
function checkMatch() {
  if (openArray[0].className === openArray[1].className) {
    match();
  }
  else {
    noMatch();
  }
};

/* If cards match, adds to matchedArray, empties openArray, and checks length of matchedArray */
function match() {
  openArray[0].parentNode.classList.add('match');
  openArray[0].parentNode.classList.remove('show', 'open');
  openArray[1].parentNode.classList.add('match');
  openArray[1].parentNode.classList.remove('show', 'open');
  matchedArray.push(openArray);
  enable();
  openArray = [];
  if (matchedArray.length === 8) {
    clearInterval(interval);
    endGame();
  };
};

/* If cards do not match, removes icons from showing, empties openArray, and adds event listener event again */
function noMatch() {
  openArray[0].parentNode.classList.add('wrong');
  openArray[1].parentNode.classList.add('wrong');
  setTimeout(function() {
    openArray[0].parentNode.classList.remove('open', 'show', 'wrong');
    openArray[1].parentNode.classList.remove('open', 'show', 'wrong');
    enable();
    openArray = [];
  },500);
  openArray[0].parentNode.addEventListener('click', clickCard);
  openArray[1].parentNode.addEventListener('click', clickCard);
};

/* Disables more than 2 cards from being clicked on */
function disable() {
  document.body.style.pointerEvents = 'none';
};

/* Enables cards again */
function enable() {
  document.body.style.pointerEvents = 'auto';
};

/* Counts the moves and removes stars as moves increase */
function movesCounter() {
  moves ++;
  movesCount.innerHTML = moves;
  if (moves > 15) {
    stars[0].style.visibility = 'collapse';
    starRating = 2;
  }
  if (moves > 25) {
    stars[1].style.visibility = 'collapse';
    starRating = 1;
  }
};

/* Resets the star rating to 3 stars */
function resetStars() {
  starRating = 3;
  stars[0].style.visibility = 'visible';
  stars[1].style.visibility = 'visible';
};

/* Starts timer */
function startTimer() {
  timeStart = true;
  interval = setInterval(function () {
    timer.innerHTML = minute + ' mins ' + second + ' secs';
    second++;
    if (second == 60) {
      minute++;
      second = 0;
    };
    if (minute == 60) {
      hour++;
      minute = 0;
    };
  }, 1000);
};

/* Resets timer */
function resetTimer() {
  clearInterval(interval);
  timer.innerHTML = '0 mins 0 secs';
  minute = 0;
  second = 0;
  timeStart = false;
};

/* When all card matches are found, displays winning modal */
function endGame() {
  winningModal.style.display = 'block';
  endTime.innerHTML = timer.innerHTML
  endMove.innerHTML = movesCount.innerHTML;
  let starRating = document.querySelector('.stars')
  endRating.innerHTML = starRating.innerHTML;
  endRating.classList.add('inlineStars');
  closeModal();
};

/* Closes modal when play again button is pressed */
function closeModal() {
  playAgain.addEventListener('click', function() {
  winningModal.style.display = 'none';
  restartGame();
  });
};

/* Restarts game when restart button is clicked */
restart.addEventListener('click', restartGame);

/* Clears old deck then calls create deck function */
function restartGame() {
  while (cardDeck.hasChildNodes()) {
    cardDeck.removeChild(cardDeck.firstChild);
  }
  movesCount.innerText = '0';
  moves = 0;
  resetTimer();
  resetStars();
  createDeck();
  matchedArray = [];
  openArray = [];
};

/* Starts game by calling create deck function */
createDeck();
