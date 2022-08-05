let pHand = []
let dHand = []
class Deck{
    constructor(){
        this.deck = [];
        const suits = ['s', 'c', 'h', 'd'];
        const values = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
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

let cards = new Deck
cards.shuffle();
console.log(cards.deck);