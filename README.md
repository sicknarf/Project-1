# Welcome to Blackjack!

## [get started now!](https://francis-project-one.netlify.app/)

The rules to Blackjack are fairly straightforward. Your objective is to get as close to 21 as possible. All face cards are worth 10, and Aces are worth either 11 or 1.

### The Interface

The buttons will be clearly labeled, here's what each of them do.

![Bet Minus Button](/assets/readme-info/bet-minus.png) ![Bet Plus Button](/assets/readme-info/bet-plus.png)

You can click the plus or minus button to adjust your bet, and once you have decided on an amount, click the middle green button to add that amount to your current betting pool.

![All In Button](/assets/readme-info/all-in.png)

Alternatively, you could go ahead and go all in to put all your chips into the betting pool.

![Clear Bet Button](/assets/readme-info/clear-bet.png)

Your bet isn't final until you deal. You can always take the pool back with the clear bet button. Otherwise, hit deal!

![Hit Stand Double Buttons](/assets/readme-info/hit-stay-double.png)

Hit means you ask the dealer to deal you the next card. Stand means your turn ends, and then dealer will keep drawing cards until they hit 17 or higher. If they go over 21, you win! But if they're closer than you to 21, you will lose. Otherwise, if you tie, it is called a push, and you get your bet back.

For additional resources as to when to hit or stand, you can refer [here](https://blog.betway.com/casino/blackjack-strategy-101-what-is-the-hit-stand-betting-system/)

### Technologies Used

I used HTML, CSS, JavaScript, jQuery, Bootstrap 5.0.2, and animate.style.

### Approach Taken

This was a fun project for me. First I had to figure out how to construct a deck, and eventually decided on using JS classes and methods to construct and shuffle one together. Then, I coded in how to calculate the values of each card and display a total. Finally, compare that total against each player. The player's point of view starts at the splash screen, which then move forwards onto the betting area. Following the betting area, and once the bet is set up, it moves into a pretty natural flow of the game.

### What Went Well

The whole project moved rather smoothly for me, what went well was building it off of the console first, and then moving to HTML/CSS

### Hurdles

The biggest hurdle for me was figuring out how to calculate aces, since they count both as either 11, or a 1. Eventually I decided on manipulating the object in JS to properly count the values.

### Future Features

Multi-deck blackjack, a number of other NPCs, and choosing your position at the table to change your own odds. Distant future may also include other non-NPC players. Double functionality on splits.

### Other Resources Used

W3Schools, MDN, StackOverflow, a number of Blackjack explanation sites, and the Washington Post's Blackjack game.