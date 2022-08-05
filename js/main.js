let pHand = []
let dHand = []
let deck = []
function newDeck(){
    deck = [];
    const suits = ['s', 'c', 'h', 'd'];
    const values = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
    suits.forEach((suit)=>{
        values.forEach((value)=>{
            let card = {suit: suit, value: value};
            deck.push(card);
        });
    }); 
};
function shuffle(array) { //TIL about the fisher-yates algorithm
        for(let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
newDeck();
shuffle(deck);
console.log(deck);
newDeck();
shuffle(deck);
console.log(deck)
