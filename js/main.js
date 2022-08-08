class Deck{
    constructor(){
        this.deck = [];
        const suits = ['spades', 'clubs', 'hearts', 'diamonds'];
        const cardNums = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
        suits.forEach((suit)=>{
            cardNums.forEach((cardNum)=>{
                let card = {suit: suit, cardNum: cardNum};
                this.deck.push(card);
            });
        });
        };
    shuffle(){ //TIL about the fisher-yates algorithm
        for(let i = this.deck.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }}
};
const scoreCounter = {'aceOne': 1, 
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'jack': 10,
    'queen': 10,
    'king': 10,
    'ace': 11}

const p = {
    name:'player',
    score:0,
    hand:[],
    cardCounter:0,
}

const d = {
    name:'dealer',
    score:0,
    hiddenScore:0,
    hand:[],
    cardCounter:0,
}

let cards = new Deck;
// let d.score = 0;
// let d.hiddenScore = 0;
// let d.hand = []
let discardPile = []
let aceCheck = false;
let cardCounter = 0;

init();

// jQuery
$(function(){ 
    $('#deal').hide();
    // $('#deal').prop('disabled', true);
    $('#reset-game').click(init);
    $('#hit').click(() => { 
        cardPop(p);
        console.log('p.hand is', p.hand);
        pCount();
    });
    $('#stay').click(()=>{
        $('#dealer-space').html(`<span id="dealer-0"><img src="assets/playable-cards/${d.hand[0].cardNum}_of_${d.hand[0].suit}.png"></span><span id="dealer-1"></span>`);
        dealerAI();
    });
    $('#deal').click(()=> { 
        clearHands();
        deal();
        $('h4').html('');
        pCount();
        $('#deal').hide();
        // console.log(`You got [${p.hand[0].cardNum} of ${p.hand[0].suit}] and [${p.hand[1].cardNum} of ${p.hand[1].suit}]`);
        // console.log(`Dealer's cards are [${d.hand[0].cardNum} of ${d.hand[0].suit}] and [${d.hand[1].cardNum} of ${d.hand[1].suit}]`);
    });
});

// functions below
function init(){
    p.score = 0;
    d.score = 0;
    p.hand = []
    d.hand = []
    $('h4').html('');
    cards = new Deck;
    cards.shuffle();
    console.log('Game Initialized...');
    deal();
    dHiddenCount();
    pCount();
    console.log(d, 'is dealer')
}

function scoreCount(hand, score){ // needs work
    score = 0
    for(let i = 0; i < hand.length; i++){
        score = score + parseInt(scoreCounter[hand[i].cardNum]);
    }
}

function pCount() {
    aceChecker(p.hand);
    p.score = 0;
    for(let i = 0; i < p.hand.length; i++){
        p.score = p.score + parseInt(scoreCounter[p.hand[i].cardNum]);
    };
    if(p.score > 21 && aceCheck === true){
        let aceCard = p.hand.find(hand => hand.cardNum === 'ace');
        aceCard.cardNum = 'aceOne';
            p.score = 0;
            for(let i = 0; i < p.hand.length; i++){
                p.score = p.score + parseInt(scoreCounter[p.hand[i].cardNum]);
            };
        };
    if(p.score === 21){
        $('h4').html('You got 21!');
        $('#hit').prop('disabled', true);
    }  else if (p.score > 21){
        $('#hit').prop('disabled', true);
        $('#stay').prop('disabled', true);
        $('h4').html('BUST');
        $('#deal').show();
    }
    $('#player-hand-count').html(p.score);
}

function dHiddenCount() {
    d.hiddenScore = 0;
    d.score = 0;
    for(let i = 1; i < d.hand.length; i++){
        d.hiddenScore = d.hiddenScore + parseInt(scoreCounter[d.hand[i].cardNum]);
    };
    $('#dealer-hand-count').html(d.hiddenScore);
}

function dCount(){
    for(let i = 0; i < d.hand.length; i++){
        d.score = d.score + parseInt(scoreCounter[d.hand[i].cardNum]);
    }
}

function dCountLastCard(){
    d.score = d.score + parseInt(scoreCounter[d.hand[d.hand.length-1].cardNum]);    
}

function aceChecker(hand){
    aceCheck = hand.some((ace) => {
        return ace.cardNum === 'ace';
    })
};

function dealerAI() {
    d.score = 0;
    dCount();
    $('#hit').prop('disabled', true);
    $('#stay').prop('disabled', true);
    aceChecker(d.hand);
    if (d.score > 21 && aceCheck === true){
        let aceCard = d.hand.find(hand => hand.cardNum === 'ace');
        aceCard.cardNum = 'aceOne';
        dealerAI();
    }
    if (d.score >= 17){
        $('#dealer-1').html(`<img src="assets/playable-cards/${d.hand[1].cardNum}_of_${d.hand[1].suit}.png">`)
        if(d.score === 21 && d.hand.length === 2 && p.score === 21 && p.hand.length === 2){
            $('h4').html('both blackjacks. PUSH.');
            $('#deal').show();
        } else if(d.score === 21 && d.hand.length === 2){
            $('h4').html('the dealer got blackjack');
            $('#deal').show();
        } else if (p.score === 21 && d.score === 21 && p.hand.length === 2 && d.hand.length !== 2) {
            $('h4').html('you got blackjack, dealer did not. You win!');
            $('#deal').show();
        } else if(d.score === 21 && p.score === 21) {
            $('h4').html('PUSH');
            $('#deal').show();
        } else if (d.score > 21){
            $('h4').html('dealer BUST');
            $('#deal').show();
        } else if (21-d.score === 21-p.score){
            $('h4').html('PUSH');
            $('#deal').show();
        } else if(21-d.score < 21-p.score){
            $('h4').html('the dealer has won.');
            $('#deal').show();
        } else if(21-d.score > 21-p.score){
            $('h4').html('you have won.');
            $('#deal').show();
        } else {console.log('error. find out what happened.')}
        $('#dealer-hand-count').html(d.score);
        console.log('d.hand is', d.hand);
        console.log('d.score is', d.score)
    }
    if (d.score < 17) {
        d.cardCounter++;
        cardPop(d);
        dCount();
        dealerAI();
        }
    };

function clearHands() {
    let pHandLength = p.hand.length
    let dHandLength = d.hand.length
    for(let i = 0; i < pHandLength; i++){
        let topPCard = p.hand.pop(i);
        discardPile.push(topPCard);
    }
    for(let j = 0; j < dHandLength; j++){
        let topDCard = d.hand.pop(j);
        discardPile.push(topDCard);
    }
    if (discardPile.length > cards.deck.length * .33){
        console.log('discard pile got large. creating new deck and shuffling.')
        cards = new Deck
        cards.shuffle();
        discardPile = []
    }
    console.log('clearHands end. p.hand is', p.hand, 'd.hand is', d.hand);
    console.log('discard pile is', discardPile);
    console.log('deck is', cards.deck)
};

function deal () {
    p.cardCounter = 0;
    d.cardCounter = 0;
    $('#player-space').html('');
    cardPop(p);
    p.cardCounter++;
    d.hand.push(cards.deck.pop());
    cardPop(p);
    p.cardCounter++;
    cardPop(d);
    d.cardCounter++;
    console.log(`You got [${p.hand[0].cardNum} of ${p.hand[0].suit}] and [${p.hand[1].cardNum} of ${p.hand[1].suit}]`);
    console.log(`Dealer's cards are [${d.hand[0].cardNum} of ${d.hand[0].suit}] and [${d.hand[1].cardNum} of ${d.hand[1].suit}]`);
    console.log(p.hand, 'is p.hand');
    console.log(d.hand, 'is d.hand');
    pCount();
    dHiddenCount();
    $('#hit').prop('disabled', false);
    $('#stay').prop('disabled', false);
    $('#dealer-space').html('<span id="dealer-0"><img src="assets/cardback.jpeg"></span><span id="dealer-1"></span>');
    $('#dealer-space').append(`<span id="${d.name}-${d.cardCounter}"><img src="assets/playable-cards/${d.hand[d.cardCounter].cardNum}_of_${d.hand[d.cardCounter].suit}.png"></span>`);
};

function cardPop(player) {
    player.hand.push(cards.deck.pop());
    $(`#${player.name}-space`).append(`<span id="${player.name}-${player.cardCounter}"><img src="assets/playable-cards/${player.hand[player.cardCounter].cardNum}_of_${player.hand[player.cardCounter].suit}.png"></span>`);
    $(`#${player.name}-${player.cardCounter}`).html(`<img src="assets/playable-cards/${player.hand[player.cardCounter].cardNum}_of_${player.hand[player.cardCounter].suit}.png">`);
}
// test :)