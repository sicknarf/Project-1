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
    shuffle(){
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
    'ace': 11
};

const p = {
    name:'player',
    score:0,
    hand:[],
    cardCounter:0,
    cardDelay:1,
    chips:1000,
};

const d = {
    name:'dealer',
    score:0,
    hiddenScore:0,
    hand:[],
    cardCounter:0,
    cardDelay:0,
};

const betAmounts = [1, 5, 25, 100, 250, 500, 1000]; // 0-6
let betID = 3

let cards = new Deck;
let discardPile = []
let aceCheck = false;
let currentBet = 0;

// jQuery
$(function(){ 
    $('#initialize').click(init);
    $('#reset-game').click(init);
    hidePlays();
    $('#player-hand, #dealer-hand, #deal-again').hide();
    $('#hit').click(hit);
    $('#stay').click(()=>{
        $('#dealer-space').html(`<span id="dealer-0"><img class="animate__animated animate__flipInY animate__slower" src="assets/playable-cards/${d.hand[0].cardNum}_of_${d.hand[0].suit}.png"></span><span id="dealer-1"></span>`);
        $('#game-stats').html('');
        $('#game-stats').css('background-color', 'rgba(0,0,0,0)');
        $('#announcements').html('');
        dealerAI();
    });
    $('#deal-again').click(()=> { 
        if(currentBet > 0){
            clearHands();
            deal();
            $('#announcements').html('');
            pCount();
            $('#deal-again').hide();
            showPlays()
            $('#bet-notifications').html('');
            $('#bet-notifications').css('background-color','rgba(0,0,0,0)');
        } else if(currentBet <= 0){
            $('#bet-notifications').css('background-color','pink');
            $('#bet-notifications').html('you have to bet more than that');
        }
    });
    $('#bet-down').click(()=>{modifyBet(-1)});
    $('#bet-up').click(()=>{modifyBet(1)});
    $('#bet-amount').click(updateBet);
    $('#all-in').click(()=>{
        currentBet = p.chips;
        p.chips = 0;
        betDisplay();
    })
    $('#clear-bet').click(clearBet);
    $('#deal').click(()=>{
        if(currentBet > 0){
            deal();
            $('#bet-notifications').html('');
            $('#bet-notifications').css('background-color','rgba(0,0,0,0)');
            showPlays()
            $('#player-hand, #dealer-hand').show();
            $('#deal').hide();
        } else if(currentBet <= 0){
            $('#bet-notifications').css('background-color','pink');
            $('#bet-notifications').html('you have to bet more than that');
        }
    })
});

init();


// functions below
function init(){
    $('#playing-space').show();
    setTimeout(()=>{$('#splash').hide()}, '800')
    $('#splash').addClass('animate__animated animated__slower animate__zoomOut')
    p.score = 0;
    d.score = 0;
    p.hand = []
    d.hand = []
    $('#announcements').html('');
    cards = new Deck;
    cards.shuffle();
    betDisplay();
    $('#bet-amount').html(`${betAmounts[betID]}`);
}

function scoreCount(player){
    player.score = 0
    let handLength = player.hand.length
    for(let i = 0; i < handLength; i++){
        player.score = player.score + parseInt(scoreCounter[player.hand[i].cardNum]);
    }
};

function pCount() {
    aceChecker(p.hand);
    p.score = 0;
    scoreCount(p);
    if(p.score > 21 && aceCheck === true){
        let aceCard = p.hand.find(hand => hand.cardNum === 'ace');
        aceCard.cardNum = 'aceOne';
        scoreCount(p);
        };
    if(p.score === 21 && p.hand.length === 2){
        $('#game-stats').html('you got Blackjack!');
        animateGameStats();
        animateAnnouncementsBox();
        $('#announcements').html('<img class="animate__animated animate__fadeIn animate__slower animate__delay-1s" src="assets/blackjack.png">');
        $('#hit').prop('disabled', true);
    } else if (p.score === 21) {
        $('#game-stats').html('you got 21!');
        animateGameStats();
        $('#hit').prop('disabled', true);
    } else if (p.score > 21){
        $('#hit').prop('disabled', true);
        $('#stay').prop('disabled', true);
        $('#game-stats').html('BUST');
        animateGameStats();
        lose();
    }
    setTimeout(()=>{$('#player-hand-count').html(p.score)}, '400');
};

function aceChecker(hand){
    aceCheck = hand.some((ace) => {
        return ace.cardNum === 'ace';
    })
};

function animateGameStats() {
    $('#game-stats').addClass('animate__animated animate__fadeIn animate__slower animate__delay-2s');
    $('#game-stats').css('background-color', 'rgba(0,0,0,0.5)');
}

function animateAnnouncementsBox() {
    $('#announcements-box').addClass('animate__animated animate__fadeIn animate__slower');
    $('#announcements-box').css('background-color', 'rgba(50,50,50,0.5)')
}

function dealerAI() {
    d.score = 0;
    scoreCount(d);
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
            $('#game-stats').html('both players got Blackjack!');
            animateGameStats();
            push();
        } else if(d.score === 21 && d.hand.length === 2){
            $('#game-stats').html('the dealer got Blackjack, you did not');
            animateGameStats();
            lose();
        } else if (p.score === 21 && d.score === 21 && p.hand.length === 2) {
            $('#game-stats').html('you got Blackjack, the dealer did not');
            animateGameStats();
            win()
        } else if(d.score === 21 && p.score === 21) {
            push()
            $('#deal-again').show();
        } else if (d.score > 21){
            animateGameStats();
            $('#game-stats').html('dealer bust!');
            win()
        } else if (21-d.score === 21-p.score){
            push()
        } else if(21-d.score < 21-p.score){
            lose();
        } else if(21-d.score > 21-p.score){
            win();
        } else {
            console.log('error. find out what happened.');
            $('#game-stats').html('an unexpected error has occurred');
            };
        setTimeout(()=>{$('#dealer-hand-count').html(d.score)}, '400');
        // console.log('d.hand is', d.hand);
        // console.log('d.score is', d.score)
    }
    if (d.score < 17) {
        d.cardCounter++;
        d.cardDelay++;
        cardPop(d);
        scoreCount(d);
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
        // console.log('discard pile got large. creating new deck and shuffling.')
        cards = new Deck
        cards.shuffle();
        discardPile = []
    }
    // console.log('clearHands end. p.hand is', p.hand, 'd.hand is', d.hand);
    // console.log('discard pile is', discardPile);
    // console.log('deck is', cards.deck)
};

function deal () {
    p.cardCounter = 0;
    d.cardCounter = 0;
    d.cardDelay = 0;
    $('#player-space').html('');
    $('#game-stats').html('');
    $('#game-stats').css('background-color', 'rgba(0,0,0,0)');
    $('#announcements-box').removeClass('animate__animated animate__fadeIn animate__slower animate__delay-1s');
    $('#game-stats').removeClass('animate__animated animate__fadeIn animate__slower animate__delay-3s animate__delay-2s');
    cardPop(p);
    p.cardCounter++;
    d.hand.push(cards.deck.pop());
    cardPop(p);
    p.cardCounter++;
    cardPop(d);
    d.cardCounter++;
    // console.log(`You got [${p.hand[0].cardNum} of ${p.hand[0].suit}] and [${p.hand[1].cardNum} of ${p.hand[1].suit}]`);
    // console.log(`Dealer's cards are [${d.hand[0].cardNum} of ${d.hand[0].suit}] and [${d.hand[1].cardNum} of ${d.hand[1].suit}]`);
    // console.log(p.hand, 'is p.hand');
    // console.log(d.hand, 'is d.hand');
    pCount();
    d.hiddenScore = 0;
    d.score = 0;
    for(let i = 1; i < d.hand.length; i++){
        d.hiddenScore = d.hiddenScore + parseInt(scoreCounter[d.hand[i].cardNum]);
    };
    $('#dealer-hand-count').html(d.hiddenScore);
    $('#hit').prop('disabled', false);
    $('#stay').prop('disabled', false);
    $('#announcements-box').css('background-color', 'rgba(50,50,50,0)')
    $('#dealer-space').html(`<span id="dealer-0"><img class="animate__animated animate__fadeInDownBig" src="assets/cardback.jpeg""></span><span id="${d.name}-${d.cardCounter}"><img class="animate__animated animate__fadeInDownBig" src="assets/playable-cards/${d.hand[d.cardCounter].cardNum}_of_${d.hand[d.cardCounter].suit}.png"></span>`);
};

function cardPop(player) {
    player.hand.push(cards.deck.pop());
    $(`#${player.name}-space`).append(`<span id="${player.name}-${player.cardCounter}"><img class="animate__animated animate__fadeInDownBig animate__delay-${player.cardDelay-1}s" id="cards-${player.name}-${player.cardCounter}" src="assets/playable-cards/${player.hand[player.cardCounter].cardNum}_of_${player.hand[player.cardCounter].suit}.png"></span>`);
};

function hit() {
    cardPop(p);
    // console.log('p.hand is', p.hand);
    p.cardCounter++;
    pCount();
};

function updateBet() {
    if(p.chips-betAmounts[betID] >= 0){
        p.chips = p.chips - betAmounts[betID];
        currentBet = currentBet + betAmounts[betID];
        $('#bet-notifications').html('');
        $('#bet-notifications').css('background-color','rgba(0,0,0,0)');
    } else if (p.chips-betAmounts[betID] < 0){
        $('#bet-notifications').css('background-color','pink');
        $('#bet-notifications').html('you can\'t bet that much!');
    };
    betDisplay();
    $('#bet-amount').html(`${betAmounts[betID]}`);
    if (p.chips < 1000 && p.chips >= 500 && betID > 5){
        betID = 5;
    } else if (p.chips < 500 && betID > 4){
        betID = 4;
    } else if (p.chips < 250 && betID > 3){
        betID = 3;
    } else if (p.chips < 100 && betID > 2){
        betID = 2;
    } else if (p.chips < 25 && betID > 1){
        betID = 1;
    } else if (p.chips < 5) {
        betID = 0;
    };
    $('#bet-amount').html(`${betAmounts[betID]}`);
    
}

function modifyBet(direction) {
    if (p.chips >= 1000){
        if(betID > 0 && betID < 6){
            betID = betID + direction;
        } else if (betID === 6 && direction === -1){
            betID--
        }
    } else if (p.chips >= 500){
        if(betID > 5){
            betID = 5;
        }
        if(betID > 0 && betID < 5){
            betID = betID + direction;
        } else if (betID === 5 && direction === -1){
            betID--
        }
    } else if (p.chips >= 250){
        if(betID > 4){
            betID = 4;
        }
        if(betID > 0 && betID < 4){
            betID = betID + direction;
        } else if (betID === 4 && direction === -1){
            betID--
        }
    } else if (p.chips >= 100){
        if(betID > 3){
            betID = 3;
        }
        if(betID > 0 && betID < 3){
            betID = betID + direction;
        } else if (betID === 3 && direction === -1){
            betID--
        }
    } else if (p.chips >= 25){
        if(betID > 2){
            betID = 2;
        }
        if(betID > 0 && betID < 2){
            betID = betID + direction;
        } else if (betID === 2 && direction === -1){
            betID--
        }
    } else if (p.chips >= 5){
        if(betID > 1){
            betID = 1;
        }
        if(betID > 0 && betID < 1){
            betID = betID + direction;
        } else if (betID === 1 && direction === -1){
            betID--
        }
    } else if (p.chips < 5) {
        betID = 0
    }
    if(p.chips > 5 && betID === 0 && direction === 1){
        betID++
    }
    $('#bet-amount').html(`${betAmounts[betID]}`)
}

function clearBet() {
    p.chips = p.chips + currentBet;
    currentBet = currentBet - currentBet;
    $('#chips-left').html(p.chips);
    $('#bet-pool').html(currentBet);
    $('#bet-notifications').html('');
    $('#bet-notifications').css('background-color','rgba(0,0,0,0)');
}

function push() {
    animateAnnouncementsBox();
    $('#announcements').html('<img class="animate__animated animate__fadeIn animate__slower animate__delay-1s" src="assets/push.png">');
    $('#deal-again').show();
    p.chips = p.chips + currentBet;
    currentBet = 0;
    betDisplay();
    hidePlays();
}

function lose() {
    animateAnnouncementsBox();
    $('#announcements').html('<img class="animate__animated animate__fadeIn animate__slower animate__delay-1s" src="assets/you-lost.png">');
    $('#deal-again').show();
    currentBet = 0;
    $('#bet-pool').html(currentBet);
    hidePlays()
}

function win() {
    animateAnnouncementsBox();
    $('#announcements').html('<img class="animate__animated animate__fadeIn animate__slower animate__delay-1s" src="assets/you-won.png">');
    $('#deal-again').show();
    p.chips = p.chips + (currentBet*2);
    currentBet = 0;
    betDisplay();
    hidePlays();
}

function hidePlays() {
    setTimeout(()=>{$('#hit, #stay, #double').hide()}, '800')
    $('#hit, #stay, #double').addClass('animate__animated animate__fadeOut');
}

function showPlays() {
    $('#hit, #stay, #double').removeClass('animate__fadeOut');
    $('#hit, #stay, #double').show();
}

function betDisplay() {
    $('#chips-left').html(p.chips);
    $('#bet-pool').html(currentBet);
}