var buttonColors = ["red", "blue", "green", "yellow"]

var gamePattern = []

var userClickedPattern = [];

var level = 0
var started = false

$(document).keypress(function() {
    if (!started) {
        // change h1 to level 0 when game starts
        $("#level-title").text("Level"+ level);
        nextSequence();
        started = true;
    }
})

function nextSequence() {
    // increment the levels
    level++;    

    //update h1 with current level
    $("#level-title").text("Level"+ level);

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColors[randomNumber]
    gamePattern.push(randomChosenColour);
    
    // Use jQuery to select the button with the same ID as randomChosenColour
$("#" + randomChosenColour).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100); // Animate a flash effect

// Play the sound corresponding to the randomChosenColour
    playSound(randomChosenColour)
}

//detect when buttons are clicked
$(".btn").click(function () {
    
    // store the ID of the of the clicked button in userChosenColour
    var userChosenColour = $(this).attr("id");

    // add userChosenColour to userClickedPattern
    userClickedPattern.push(userChosenColour);
    console.log(userClickedPattern);

    // call checkAnswer after each click
    checkAnswer(userClickedPattern.length - 1);

    //play sound corresponding to clicked button
    playSound(userChosenColour);

    animatePress(userChosenColour);
})

function checkAnswer(currentLevel) {
    // check if user's answer matches game pattern
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("Success");

        // check if user has finished current sequence
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    } else {
        console.log("Wrong");

        //play the wrong.mp3
        playSound("wrong");

        //apply game-over class to the body
        $("body").addClass("game-over");

        //remove game-over class after 200ms
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 500);

        //change h1
        $("#level-title").text("Game over. Press any key to restart.");

        //reset the game 
        startOver();
    }
}

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColour) {
    // add the "pressed" class to the button
    $("#" + currentColour).addClass("pressed");

    // Remove the "pressed" class after 100 milliseconds
    setTimeout(function() {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

function startOver() {
    console.log("Game over resetting game...")
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    started = false;
}