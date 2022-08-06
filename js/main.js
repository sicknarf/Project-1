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
        }
}
};
let cards = new Deck;
let pHand = []
let dHand = []
let pScore = 0;
let dScore = 0;
const scoreCounter = {
    'ace': [11], 
    '2': [2],
    '3': [3],
    '4': [4],
    '5': [5],
    '6': [6],
    '7': [7],
    '8': [8],
    '9': [9],
    '10': [10],
    'jack': [10],
    'queen': [10],
    'king' :[10]}

function init(){
    cards.shuffle();
    console.log('Game Initialized...');
    pHand.push(cards.deck.pop());
    dHand.push(cards.deck.pop());
    pHand.push(cards.deck.pop());
    dHand.push(cards.deck.pop());
    console.log(`You got [${pHand[0].cardNum} of ${pHand[0].suit}] and [${pHand[1].cardNum} of ${pHand[1].suit}]`);
    console.log(`Dealer's visible card is [${dHand[1].cardNum} of ${dHand[1].suit}]`);
    console.log('pHand is', pHand);
    console.log('dealer\'s hand is', dHand);
    pCount();
    dCount();
}

init();


// jQuery below
$('#reset-game').click(init);
$('#hit').click(() => { 
    pHand.push(cards.deck.pop());
    console.log('pHand is', pHand);
    pCount();
    
});

// functions below
function pCount() {
    let pAcesUsed = 0;
    let aceCheck = pHand.some((ace) => {
        return ace.cardNum === 'ace';
    });
    pScore = 0;
    for(let i = 0; i < pHand.length; i++){
        pScore = pScore + scoreCounter[pHand[i].cardNum][0];
    };
    if(pScore > 21 && aceCheck === true){
        pAcesUsed++
        pScore = pScore - (10 * pAcesUsed);
    };
    if(pScore === 21){
        console.log('WIN!!')
    }  else if (pScore > 21){
        console.log('BUST');
    }
    $('#player-hand-count').html(pScore);
}

function dCount() {
    let dAcesUsed = 0;
    let aceCheck = dHand.some((ace) => {
        return ace.cardNum === 'ace';
    });
    dScore = 0;
    for(let i = 0; i < dHand.length; i++){
        dScore = dScore + scoreCounter[dHand[i].cardNum][0];
    };
    if(dScore > 21 && aceCheck === true){
        dAcesUsed++
        dScore = dScore - (10 * dAcesUsed);
    };
    if(dScore === 21){
        console.log('dealer WIN')
    }  else if (pScore > 21){
        console.log('BUST');
    }
    $('#dealer-hand-count').html(pScore);
}