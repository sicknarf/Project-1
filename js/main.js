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
const scoreCounter = {'aceOne': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'jack': 10, 'queen': 10, 'king': 10, 'ace': 11};
const betAmounts = [1, 5, 25, 100, 250, 500, 1000];

const p = {
    name: 'player',
    score: 0,
    hand: [],
    cardCounter: 0,
    cardDelay: 1,
    chips: 1000,
};
const d = {
    name: 'dealer',
    score: 0,
    hiddenScore: 0,
    hand: [],
    cardCounter: 0,
    cardDelay: 0,
};
const s = {
    name:'split',
    score: 0,
    hand: [],
    cardCounter: 1,
    cardDelay: 1,
    chips: 0,
    isActive: false,
    wasInitialized: false,
}

const soundID = {
    flip: 0,
    bet: 1,
    shuffle: 2,
    allIn: 3,
    announcement: 4,
    deal: 5,
    cheatCode: 6,
}

let betID = 3
let cards = new Deck;
let discardPile = [];
let aceCheck = false;
let currentBet = 0;
let easterEgg = 0;

$(function(){ 
    $('#menu-bgm-play').click(volume);
    $('#initialize').click(init);
    $('#reset-game').click(init);
    $('#broke').click(init);
    $('#hit').click(hit); 
    $('#split').click(split);
    $('#stay').click(stay)
    $('#bet-down').click(()=>{modifyBet(-1)});
    $('#bet-up').click(()=>{modifyBet(1)});
    $('#betting-time').click(updateBet);
    $('#clear-bet').click(clearBet);
    
    $('#deal').click(()=>{
        if(currentBet > 0){
            deal();
        } else if(currentBet <= 0){
            $('#bet-notifications').css('background-color','pink');
            $('#bet-notifications').html('you have to bet more than that');
        }
    })
    $('#deal-again').click(()=> { 
        if(currentBet > 0){
            deal();
        } else if(currentBet <= 0){
            $('#bet-notifications').css('background-color','pink');
            $('#bet-notifications').html('you have to bet more than that');
        }
    });
    $('#all-in').click(()=>{
        if(p.chips > 0){
            $('audio.game-sounds')[soundID.allIn].play()
            currentBet = currentBet + p.chips;
            if(p.chips >= 2000){
                for (let i = 0; i < 8; i++){
                    setTimeout(() => {
                        $('#betting-space').append(`<li style="margin-right:-65px">
                                                        <img style="filter: drop-shadow(4px 4px 3px #333)" 
                                                        class="animate__animated animate__fadeInBottomRight poker-chip" 
                                                        src="assets/poker-chips/4.png">
                                                    </li>`);
                    }, i*125); 
                }
            } else if(p.chips >= 750){
                for (let i = 0; i < 8; i++){
                    setTimeout(() => {
                        $('#betting-space').append(`<li style="margin-right:-65px">
                                                        <img style="filter: drop-shadow(4px 4px 3px #333)" 
                                                        class="animate__animated animate__fadeInBottomRight poker-chip" 
                                                        src="assets/poker-chips/3.png">
                                                    </li>`);
                    }, i*125); 
                }
            } else if(p.chips >= 500){
                for (let i = 0; i < 12; i++){
                    setTimeout(() => {
                        $('#betting-space').append(`<li style="margin-right:-65px">
                                                        <img style="filter: drop-shadow(4px 4px 3px #333)" 
                                                        class="animate__animated animate__fadeInBottomRight poker-chip" 
                                                        src="assets/poker-chips/2.png">
                                                    </li>`);
                    }, i*125); 
                }
            } else if(p.chips >= 250){
                for (let i = 0; i < 3; i++){
                    setTimeout(() => {
                        $('#betting-space').append(`<li style="margin-right:-65px">
                                                        <img style="filter: drop-shadow(4px 4px 3px #333)" 
                                                        class="animate__animated animate__fadeInBottomRight poker-chip" 
                                                        src="assets/poker-chips/3.png">
                                                    </li>`);
                    }, i*125); 
                }
            } else if(p.chips >= 100){
                for (let i = 0; i < 7; i++){
                    setTimeout(() => {
                        $('#betting-space').append(`<li style="margin-right:-65px">
                                                        <img style="filter: drop-shadow(4px 4px 3px #333)" 
                                                        class="animate__animated animate__fadeInBottomRight poker-chip" 
                                                        src="assets/poker-chips/2.png">
                                                    </li>`);
                    }, i*125); 
                }
            } else if(p.chips < 100){
                for (let i = 0; i < 7; i++){
                    setTimeout(() => {
                        $('#betting-space').append(`<li style="margin-right:-65px"><
                                                        img style="filter: drop-shadow(4px 4px 3px #333)" 
                                                        class="animate__animated animate__fadeInBottomRight poker-chip" 
                                                        src="assets/poker-chips/1.png"></li>`);
                    }, i*125); 
            }
        }
        p.chips = 0;
        betDisplay();
        }
    })
    $('#double').click(()=>{
        p.chips = p.chips - currentBet;
        currentBet = currentBet * 2;
        $('#hit').prop('disabled', true);
        hit();
        betDisplay();
        $('#betting-space').clone().appendTo('#betting-space');
        $('audio.game-sounds')[soundID.flip].play()
        setTimeout(() => {
            $('audio.game-sounds')[soundID.bet].play()
        }, 500);
    })
    $('#menu-bgm-pause').click(()=>{
        $('audio#bg-player')[0].pause()
        $('audio#flip-sound').prop('volume', 0);
        $('audio#bet-sound').prop('volume', 0);
        $('audio#shuffle-sound').prop('volume', 0);
        $('audio#all-in-sound').prop('volume', 0);
        $('audio#announce-sound').prop('volume', 0);
        $('audio#deal-sound').prop('volume', 0);
        $('audio#easter-egg-sound').prop('volume', 0.01);
    });
});

volume();

function init(){
    $('audio#bg-player')[0].play()
    $('#playing-space').show();
    $('#deal, #bet-down, #bet-up, #betting-time, #all-in, #clear-bet').prop('disabled', false);
    setTimeout(()=>{$('#splash').hide()}, '800');
    $('#player-hand, #dealer-hand, #deal-again, #broke').hide();
    $('#splash').addClass('animate__animated animated__slower animate__zoomOut');
    $('#dealer-space, #player-space').html('');
    clearAnnouncements();
    $('#announcements-box').css('background-color', '');
    $('#player-parent').html('<ul id="player-space"></ul>');
    $('#split').hide();
    hidePlays();
    clearBet();
    p.score = 0;
    d.score = 0;
    p.hand = [];
    d.hand = [];
    p.chips = 1000;
    resetCounters();
    betID = 3;
    currentBet = 0
    cards = new Deck;
    cards.shuffle();
    $('audio.game-sounds')[soundID.shuffle].play()
    betDisplay();
    $('#bet-amount').html(`${betAmounts[betID]}`);
}

function deal () {
    resetCounters();
    $('audio.game-sounds')[soundID.deal].play();
    $('#player-hand, #dealer-hand').show();
    $('#deal, #bet-down, #bet-up, #betting-time, #all-in, #clear-bet').prop('disabled', true);
    $('#deal-again').hide();
    $('#player-parent').html('<ul id="player-space"></ul>');
    clearAnnouncements();
    $('#game-stats').removeClass('animate__animated animate__fadeIn animate__slower animate__delay-3s animate__delay-2s');
    $('#bet-notifications').html('');
    $('#bet-notifications').css('background-color','rgba(0,0,0,0)');
    if(p.chips >= currentBet){
        $('#double').prop('disabled', false);
    }
    showPlays();
    clearHands();
    p.hand.push(cards.deck.pop());
    $(`#${p.name}-space`).append(`<li style="margin-left:-30px" id="${p.name}-${p.cardCounter}">
                                        <img class="animate__animated animate__fadeInDownBig animate__delay-${p.cardDelay-1}s" 
                                        id="cards-${p.name}-${p.cardCounter}" 
                                        src="assets/playable-cards/${p.hand[p.cardCounter].cardNum}_of_${p.hand[p.cardCounter].suit}.png">
                                  </li>`);
    p.cardCounter++;
    d.hand.push(cards.deck.pop());
    cardPop(p);
    p.cardCounter++;
    cardPop(d);
    d.cardCounter++;
    playerAI(p)
    d.hiddenScore = 0;
    for(let i = 1; i < d.hand.length; i++){
        d.hiddenScore = d.hiddenScore + parseInt(scoreCounter[d.hand[i].cardNum]);
    };
    $('#dealer-hand-count').html(d.hiddenScore);
    $('#hit').prop('disabled', false);
    $('#stay').prop('disabled', false);
    $('#announcements-box').css('background-color', 'rgba(50,50,50,0)')
    $('#dealer-space').html(`<li style="margin-left:-30px" id="dealer-0">
                                    <img class="animate__animated animate__fadeInDownBig" 
                                    src="assets/cardback.jpeg"">
                             </li>
                             <li style="margin-left:-100px" id="${d.name}-${d.cardCounter}">
                                    <img style="filter:drop-shadow(-4px 4px 6px #333)" 
                                    class="animate__animated animate__fadeInDownBig" 
                                    src="assets/playable-cards/${d.hand[d.cardCounter].cardNum}_of_${d.hand[d.cardCounter].suit}.png">
                             </li>`);
};

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
    if (direction < 0){
        easterEgg++
    } else if (direction > 0){
        easterEgg = 0
    }
    if (easterEgg === 15){
        $('audio.game-sounds')[soundID.cheatCode].play()
        p.chips = p.chips * 10;
        easterEgg = 0;
        betDisplay();
    }
}

function updateBet() {
    if(p.chips > 0){
        $('#betting-space').append(`<li style="margin-right:-65px">
                                        <img style="filter: drop-shadow(4px 4px 3px #333)" 
                                        class="animate__animated animate__fadeInBottomRight poker-chip" 
                                        src="assets/poker-chips/${betID}.png">
                                    </li>`);
        $('audio.game-sounds')[soundID.bet].play()
    }
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
    } if (p.chips < 500 && betID > 4){
        betID = 4;
    } if (p.chips < 250 && betID > 3){
        betID = 3;
    } if (p.chips < 100 && betID > 2){
        betID = 2;
    } if (p.chips < 25 && betID > 1){
        betID = 1;
    } if (p.chips < 5) {
        betID = 0;
    };
    $('#bet-amount').html(`${betAmounts[betID]}`);
}

function clearBet() {
    p.chips = p.chips + currentBet;
    currentBet = currentBet - currentBet;
    $('#chips-left').html(p.chips);
    $('#bet-pool').html(currentBet);
    $('#bet-notifications').html('');
    $('#bet-notifications').css('background-color','rgba(0,0,0,0)');
    $('.poker-chip').removeClass('animate__fadeInBottomRight')
    $('.poker-chip').addClass('animate__fadeOutBottomRight')
    setTimeout(()=>{$('#betting-space').html('')}, 500)
}

function betDisplay() {
    $('#chips-left').html(p.chips);
    $('#bet-pool').html(currentBet + s.chips);
}

function hidePlays() {
    setTimeout(()=>{$('#hit, #stay, #double').hide()}, '800')
    $('#hit, #stay, #double').addClass('animate__animated animate__fadeOut');
}

function showPlays() {
    $('#hit, #stay, #double').removeClass('animate__fadeOut');
    $('#hit, #stay, #double').show();
}

function aceChecker(hand){
    aceCheck = hand.some((ace) => {
        return ace.cardNum === 'ace';
    })
};

function scoreCount(player){
    player.score = 0
    let handLength = player.hand.length
    for(let i = 0; i < handLength; i++){
        player.score = player.score + parseInt(scoreCounter[player.hand[i].cardNum]);
    }
};

function playerAI(player){
    aceChecker(player.hand);
    scoreCount(player);
    if(player.hand[0].cardNum === player.hand[1].cardNum && currentBet <= player.chips && s.wasInitialized === false){
        $('#split').show();
    }
    if(player.score > 21 && aceCheck === true){
        let aceCard = player.hand.find(hand => hand.cardNum === 'ace');
        aceCard.cardNum = 'aceOne';
        scoreCount(player);
        };
    if(player.score === 21 && player.hand.length === 2){
        animateGameStats('you got Blackjack!');
        setTimeout(() => {
            animateAnnouncementsBox();    
        }, 1);
        setTimeout(() => {$('audio.game-sounds')[soundID.announcement].play()}, 1100);
        $('#announcements').html('<img class="animate__animated animate__fadeIn animate__slower animate__delay-1s" src="assets/blackjack.png">');
        setTimeout(() => {
            $('#hit').prop('disabled', true)
        }, 1);
        $('#double').prop('disabled', true);
    } else if (player.score === 21) {
        animateGameStats('you got 21!')
        $('#hit').prop('disabled', true);
    } else if (player.score > 21){
        animateGameStats('BUST');
        if (s.wasInitialized === false){
            $('#hit').prop('disabled', true);
            $('#stay').prop('disabled', true);
            lose();
        } else if (s.wasInitialized === true){
            stay();
        }
    }
    setTimeout(()=>{$('#player-hand-count').html(player.score)}, '400');
};

function hit() {
    $('#double').prop('disabled', true);
    $('audio.game-sounds')[soundID.flip].play()
    $('#split').hide();
    if(s.isActive === false){
        cardPop(p);
        p.cardCounter++;
        playerAI(p)
    } else if(s.isActive === true){
        cardPop(s);
        s.cardCounter++;
        playerAI(s)
    }
};

function stay(){
    if (s.wasInitialized === true && s.isActive === false){
        s.isActive = true;
        setTimeout(() => {
            $('#hit').prop('disabled', false)
        }, 1);
        $('#double').prop('disabled', false);
        hit();
    } else {
        s.isActive = false;
        $('audio.game-sounds')[soundID.flip].play();
        $('#split').hide();
        $('#dealer-space').html(`<li style="z-index:-1 margin-left:-100px" id="dealer-0">
                                    <img class="animate__animated animate__flipInY animate__slower" 
                                    src="assets/playable-cards/${d.hand[0].cardNum}_of_${d.hand[0].suit}.png">
                                 </li>
                                 <li style="margin-left:-100px" id="dealer-1"></li>`);
        dealerAI();
    }
}

function cardPop(player) {
    $('audio.game-sounds')[soundID.flip].play()
    player.hand.push(cards.deck.pop());
    $(`#${player.name}-space`).append(`<li style="margin-left:-100px" id="${player.name}-${player.cardCounter}">
                                            <img style="filter: drop-shadow(-4px 4px 3px #333)" 
                                            class="animate__animated animate__fadeInDownBig animate__delay-${player.cardDelay-1}s" 
                                            id="cards-${player.name}-${player.cardCounter}" 
                                            src="assets/playable-cards/${player.hand[player.cardCounter].cardNum}_of_${player.hand[player.cardCounter].suit}.png">
                                        </li>`);
};

function dealerAI() {
    scoreCount(d);
    $('#game-stats').html('');
    $('#game-stats').css('background-color', 'rgba(0,0,0,0)');
    $('#hit, #stay').prop('disabled', true);
    aceChecker(d.hand);
    if (s.wasInitialized === false){
        if (d.score > 21 && aceCheck === true){
            let aceCard = d.hand.find(hand => hand.cardNum === 'ace');
            aceCard.cardNum = 'aceOne';
            dealerAI();
        }
        else if (d.score >= 17){
            $('#dealer-1').html(`<img style="filter: drop-shadow(-4px 4px 3px #333)" src="assets/playable-cards/${d.hand[1].cardNum}_of_${d.hand[1].suit}.png">`);
            if(d.score === 21 && d.hand.length === 2 && p.score === 21 && p.hand.length === 2){
                animateGameStats('both players got Blackjack!');
                push();
            } else if(d.score === 21 && d.hand.length === 2){
                animateGameStats('the dealer got Blackjack, you did not');
                lose();
            } else if (p.score === 21 && d.score === 21 && p.hand.length === 2) {
                animateGameStats('you got Blackjack, the dealer did not');
                win();
            } else if(d.score === 21 && p.score === 21) {
                push()
                $('#deal-again').show();
                $('#deal').prop('disabled', false);
            } else if (d.score > 21){
                animateGameStats('dealer bust!');
                win();
            } else if (21-d.score === 21-p.score){
                push()
            } else if(21-d.score < 21-p.score){
                lose();
            } else if(21-d.score > 21-p.score){
                win();
            } else {
                $('#game-stats').html('an unexpected error has occurred');
                };
            setTimeout(()=>{$('#dealer-hand-count').html(d.score)}, '1000');
        }
        else if (d.score < 17) {
            d.cardCounter++;
            d.cardDelay++;
            cardPop(d);
            scoreCount(d);
            dealerAI();
        }
    } else if (s.wasInitialized === true) {
        if (p.score > 21){
            p.score = 0
        }
        if (s.score > 21){
            s.score = 0
        }
        if (d.score > 21 && aceCheck === true){
            let aceCard = d.hand.find(hand => hand.cardNum === 'ace');
            aceCard.cardNum = 'aceOne';
            dealerAI();
        } else if (d.score >= 17){
            $('#dealer-1').html(`<img style="filter: drop-shadow(-4px 4px 3px #333)" src="assets/playable-cards/${d.hand[1].cardNum}_of_${d.hand[1].suit}.png">`);
            if(d.score + p.score + s.score === 63 && d.hand.length + p.hand.length + s.hand.length === 6){
                animateGameStats('triple Blackjack!');
                push(); 
            } else if (d.score === 21 && d.hand.length === 2 && p.score + s.score === 42 && p.hand.length === 2 && s.hand.length > 2) {
                animateGameStats('main hand got Blackjack, split hand did not');
                partialLoss();
                p.chips = p.chips + currentBet;
                currentBet = 0;
                setTimeout((betDisplay), '2500');
            } else if (d.score === 21 && d.hand.length === 2 && p.score + s.score === 42 && s.hand.length === 2 && p.hand.length > 2) {
                animateGameStats('split hand got Blackjack, main hand did not');
                partialLoss();
                p.chips = p.chips + s.chips;
                currentBet = 0;
                setTimeout((betDisplay), '2500');
            } else if(d.score === 21 && d.hand.length === 2){ 
                animateGameStats('the dealer got Blackjack, you did not');
                lose();
            } else if (d.score === 21 && d.hand.length > 2) {
                if (p.score + s.score === 42 && p.hand.length + s.hand.length === 4){
                    $('#game-state').html('you got double Blackjack, dealer did not');
                    animateGameStats();
                    win();
                } else if (p.score + s.score === 42 && p.hand.length === 2 && s.hand.length > 2) {
                    animateGameStats('main hand got Blackjack, split did not');
                    partialWin();
                    p.chips = p.chips + (currentBet*2) + s.chips;
                    setTimeout((betDisplay), '2500');
                } else if (p.score + s.score === 42 && s.hand.length === 2 && p.hand.length > 2) {
                    animateGameStats('split hand got Blackjack, main did not'); 
                    partialWin();
                    p.chips = p.chips + currentBet + (s.chips * 2);
                    currentBet = 0;
                    setTimeout((betDisplay), '2500');
                } else if (p.score + s.score === 42 && p.hand.length > 2 && s.hand.length > 2){
                    animateGameStats('three way tie');
                    push();
                } else if (p.score === 21 && s.score !== 21) {
                    animateGameStats('main hand won, split hand lost');
                    push();
                } else if (s.score === 21 && p.score !== 21) {
                    animateGameStats('main hand lost, split hand won');
                    push();
                }
            } else if (d.score > 21){
                animateGameStats('dealer bust!');
                if (p.score === 0) {
                    animateGameStats('main hand won!');
                    push();
                } else if (s.score === 0) {
                    animateGameStats('split hand won!');
                    push();
                }
            } else if (d.score <21){
                if (p.score > d.score && s.score > d.score){
                    animateGameStats('both hands win!');
                    win();
                } else if (p.score > d.score && s.score === d.score) {
                    animateGameStats('main hand won, split hand tied');
                    partialWin();
                    p.chips = p.chips + (currentBet*2) + s.chips;
                    currentBet = 0;
                    setTimeout((betDisplay), '2500');
                } else if (s.score > d.score && p.score === d.score) {
                    animateGameStats('split hand won, main hand tied');
                    partialWin();
                    p.chips = p.chips + currentBet + (s.chips * 2);
                    currentBet = 0;
                    setTimeout((betDisplay), '2500');
                } else if (p.score === d.score && s.score === d.score){
                    animateGameStats('three way tie');
                    push();
                } else if (p.score === d.score && s.score < d.score){
                    animateGameStats('main hand tied, split hand lost');
                    partialLoss();
                    p.chips = p.chips + currentBet;
                    currentBet = 0;
                    setTimeout((betDisplay), '2500');
                } else if (p.score < d.score && s.score === d.score){
                    animateGameStats('main hand lost, split hand tied');
                    partialLoss();
                    p.chips = p.chips + s.chips;
                    currentBet = 0
                    setTimeout((betDisplay), '2500');
                } else if (p.score < d.score && s.score > d.score){
                    animateGameStats('main hand lost, split hand won');
                    push();
                } else if (p.score > d.score && s.score < d.score){
                    animateGameStats('main hand won, split hand lost')
                    push();
                } else if (p.score < d.score && s.score < d.score){
                    animateGameStats('both hands lost');
                    lose();
                }
            } else {
                $('#game-stats').html('an unexpected error has occurred');
                };
            setTimeout(()=>{$('#dealer-hand-count').html(d.score)}, '1000');
        } else if (d.score < 17) {
            d.cardCounter++;
            d.cardDelay++;
            cardPop(d);
            scoreCount(d);
            dealerAI();
        }
    }
}

function clearHands() {
    let pHandLength = p.hand.length
    let dHandLength = d.hand.length
    let sHandLength = s.hand.length
    for(let i = 0; i < pHandLength; i++){
        let topPCard = p.hand.pop(i);
        discardPile.push(topPCard);
    }
    for(let j = 0; j < dHandLength; j++){
        let topDCard = d.hand.pop(j);
        discardPile.push(topDCard);
    }
    for(let k = 0; k < sHandLength; k++){
        let topSCard = s.hand.pop(k);
        discardPile.push(topSCard);
    }
    if (discardPile.length > cards.deck.length * .33){
        cards = new Deck
        cards.shuffle();
        $('audio.game-sounds')[soundID.shuffle].play()
        discardPile = []
    }
};

function animateGameStats(statUpdate) {
    $('#game-stats').html(statUpdate);
    $('#game-stats').addClass('animate__animated animate__fadeIn animate__slower animate__delay-2s');
    $('#game-stats').css('background-color', 'rgba(0,0,0,0.5)');
}

function animateAnnouncementsBox() {
    $('#announcements-box').addClass('animate__animated animate__fadeIn animate__slower');
    $('#announcements-box').css('background-color', 'rgba(50,50,50,0.5)');
}

function push() {
    animateAnnouncementsBox();
    $('#announcements').html('<img class="animate__animated animate__fadeIn animate__slower animate__delay-1s" src="assets/push.png">');
    $('#deal-again').show();
    $('#deal, #bet-down, #bet-up, #betting-time, #all-in, #clear-bet').prop('disabled', false);
    p.chips = p.chips + s.chips + currentBet;
    currentBet = 0;
    s.chips = 0;
    setTimeout((betDisplay), '1500');
    hidePlays();
    $('.poker-chip').removeClass('animate__fadeInBottomRight')
    setTimeout(() => {$('audio.game-sounds')[soundID.announcement].play()}, 1100);
    setTimeout(() => {$('audio.game-sounds')[soundID.bet].play()}, 2000);
    setTimeout(()=>{$('.poker-chip').addClass('animate__fadeOutBottomRight')}, 2000)
    setTimeout(()=>{$('#betting-space').html('')}, 2500)
}

function lose() {
    animateAnnouncementsBox();
    $('#announcements').html('<img class="animate__animated animate__fadeIn animate__slower animate__delay-1s" src="assets/you-lost.png">');
    currentBet = 0;
    setTimeout((betDisplay), '1500');
    hidePlays()
    if (p.chips > 0){
        $('#deal-again').show();
        $('#deal, #bet-down, #bet-up, #betting-time, #all-in, #clear-bet').prop('disabled', false);
    } else if (p.chips === 0){
        setTimeout(()=>{$('#broke').show()}, '1200');
    }
    $('.poker-chip').removeClass('animate__fadeInBottomRight');
    setTimeout(() => {$('audio.game-sounds')[soundID.announcement].play()}, 1100);
    setTimeout(()=>{$('.poker-chip').addClass('animate__fadeOutUpBig')}, 2000)
    setTimeout(()=>{$('#betting-space').html('')}, 2500)
}

function win() {
    animateAnnouncementsBox();
    $('#announcements').html('<img class="animate__animated animate__fadeIn animate__slower animate__delay-1s" src="assets/you-won.png">');
    $('#deal-again').show();
    $('#deal, #bet-down, #bet-up, #betting-time, #all-in, #clear-bet').prop('disabled', false);
    p.chips = p.chips + (currentBet*2);
    currentBet = 0;
    setTimeout((betDisplay), '1500');
    hidePlays();
    $('.poker-chip').removeClass('animate__fadeInBottomRight');
    setTimeout(() => {$('audio.game-sounds')[soundID.announcement].play()}, 1100);
    setTimeout(() => {$('audio.game-sounds')[soundID.bet].play()}, 2000);
    setTimeout(()=>{$('.poker-chip').addClass('animate__fadeInDownBig')}, 500);
    setTimeout(()=>{$('#betting-space').clone().appendTo('#betting-space')}, 700);
    setTimeout(()=>{$('.poker-chip').removeClass('animate__fadeInDownBig')}, 1500);
    setTimeout(()=>{$('.poker-chip').addClass('animate__fadeOutBottomRight')}, 2000);
    setTimeout(()=>{$('#betting-space').html('')}, 2500)
}

function partialWin() {
    $('#announcements').html('<img class="animate__animated animate__fadeIn animate__slower animate__delay-1s" src="assets/partial-win">');
    $('#deal-again').show();
    $('#deal, #bet-down, #bet-up, #betting-time, #all-in, #clear-bet').prop('disabled', false);
    hidePlays();
    $('.poker-chip').removeClass('animate__fadeInBottomRight');
    setTimeout(() => {$('audio.game-sounds')[soundID.announcement].play()}, 1100);
    setTimeout(() => {$('audio.game-sounds')[soundID.bet].play()}, 2000);
    setTimeout(()=>{$('.poker-chip').addClass('animate__fadeInDownBig')}, 500);
    setTimeout(()=>{$('#betting-space').clone().appendTo('#betting-space')}, 700);
    setTimeout(()=>{$('.poker-chip').removeClass('animate__fadeInDownBig')}, 1500);
    setTimeout(()=>{$('.poker-chip').addClass('animate__fadeOutBottomRight')}, 2000);
    setTimeout(()=>{$('#betting-space').html('')}, 2500)
}

function partialLoss() {
    animateAnnouncementsBox();
    $('#announcements').html('<img class="animate__animated animate__fadeIn animate__slower animate__delay-1s" src="assets/partial-loss.png">');
    hidePlays()
    $('#deal-again').show();
    $('#deal, #bet-down, #bet-up, #betting-time, #all-in, #clear-bet').prop('disabled', false);
    $('.poker-chip').removeClass('animate__fadeInBottomRight');
    setTimeout(() => {$('audio.game-sounds')[soundID.announcement].play()}, 1100);
    setTimeout(()=>{$('.poker-chip').addClass('animate__fadeOutUpBig')}, 2000)
    setTimeout(()=>{$('#betting-space').html('')}, 2500)
}

function split() {
    s.wasInitialized = true;
    s.chips = s.chips + currentBet
    p.chips = p.chips - currentBet;
    $('#betting-space').clone().appendTo('#betting-space')
    $('#split').hide();
    betDisplay();
    $('#player-1').remove();
    s.hand.push(p.hand.pop());
    p.cardCounter--;
    if (p.hand[0].cardNum === 'aceOne'){
        p.hand[0].cardNum = 'ace'
    }
    scoreCount(p);
    hit();
    $(`<ul id="split-space"></ul>`).appendTo('#player-parent');
    $(`#split-space`).append(`<li style="margin-left:-10px" id="split-0">
                                <img 
                                style="filter: drop-shadow(-4px 4px 3px #333)" 
                                class="animate__animated animate__fadeInDownBig animate__delay-${s.cardDelay-1}s" 
                                id="cards-${s.name}-${s.cardCounter}" 
                                src="assets/playable-cards/${s.hand[0].cardNum}_of_${s.hand[0].suit}.png">
                              </li>`);
}

function volume() {
    $('audio#bg-player').prop('volume', 0.08);
    $('audio#bg-player')[0].play();
    $('audio#flip-sound').prop('volume', 0.4);
    $('audio#bet-sound').prop('volume', 0.2);
    $('audio#shuffle-sound').prop('volume', 0.5);
    $('audio#all-in-sound').prop('volume', 0.3);
    $('audio#announce-sound').prop('volume', 0.3);
    $('audio#deal-sound').prop('volume', 0.3);
    $('audio#easter-egg-sound').prop('volume', 0.2);
}

function clearAnnouncements() {
    $('#game-stats').html('');
    $('#game-stats').css('background-color', 'rgba(0,0,0,0)');
    $('#announcements-box').removeClass('animate__animated animate__fadeIn animate__slower animate__delay-1s');
    $('#announcements').html('');
}

function resetCounters() {
    p.cardCounter = 0;
    d.cardCounter = 0;
    s.cardCounter = 1;
    d.cardDelay = 0;
    s.chips = 0;
    s.isActive = false;
    s.wasInitialized = false;
    $('#double').prop('disabled', true);
}