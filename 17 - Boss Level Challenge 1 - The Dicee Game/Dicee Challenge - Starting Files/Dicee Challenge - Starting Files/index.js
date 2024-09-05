// player1
var randomNumber1 = (Math.floor(Math.random()* 6)+ 1);
console.log(randomNumber1);

var imageFileName1 = `images/dice${randomNumber1}.png`;
console.log(imageFileName1);

var imgElement1 = document.querySelector(".img1");
imgElement1.setAttribute('src', imageFileName1);
console.log(imgElement1);

//player2
var randomNumber2 = (Math.floor(Math.random()* 6)+ 1);
console.log(randomNumber2);

var imageFileName2 = `images/dice${randomNumber2}.png`;
console.log(imageFileName2);

var imgElement2 = document.querySelector(".img2");
imgElement2.setAttribute('src', imageFileName2);
console.log(imgElement2);

// Determine the winner or if there's a draw and update the <h1> text
var h1Element = document.querySelector("h1");

if (randomNumber1 > randomNumber2) {
    h1Element.innerHTML = "Player 1 Wins!";
} else if (randomNumber1 < randomNumber2) {
    h1Element.innerHTML = "Player 2 Wins!";
} else {
    h1Element.innerHTML = "It's a Draw!";
}

// Optional: Log values for debugging purposes
console.log(`Player 1: ${randomNumber1}, Player 2: ${randomNumber2}`);