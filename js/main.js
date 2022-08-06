let pHand = []
let dHand = []
class Deck{
    constructor(){
        this.deck = [];
        const suits = ['spades', 'clubs', 'hearts', 'diamonds'];
        const values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
        suits.forEach((suit)=>{
            values.forEach((value)=>{
                let card = {suit: suit, value: value};
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

function init(){
    let cards = new Deck;
    cards.shuffle();
    console.log('Game Initialized...');
    pHand.push(cards.deck.pop());
    dHand.push(cards.deck.pop());
    pHand.push(cards.deck.pop());
    dHand.push(cards.deck.pop());
    console.log(`You got [${pHand[0].value} of ${pHand[0].suit}] and [${pHand[1].value} of ${pHand[1].suit}]`);
    console.log(`Dealer's visible card is [${dHand[1].value} of ${dHand[1].suit}]`);
}

init();