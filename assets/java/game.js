var NUM_PLAYERS = 2;
var PLAYERS_LOCATION = 'player';
var TURN_LOCATION = 'player/turn';
var CHAT_LOCATION = 'player/chat';
var name;
var playernum = null;
var turn1;
var userbox;
var oppbox;
var outcome;
var wins = 0;
var loss = 0;


var config = {
    apiKey: "AIzaSyBqZY_Twf_hvNCxU-rrFDTg4Jvv3M12Y84",
    authDomain: "la-banda-golda.firebaseapp.com",
    databaseURL: "https://la-banda-golda.firebaseio.com",
    projectId: "la-banda-golda",
    storageBucket: "la-banda-golda.appspot.com",
    messagingSenderId: "983273892439"
};

firebase.initializeApp(config);


var database = firebase.database();
var docturn = database.ref(TURN_LOCATION);

//
// $("#player1").empty();
// $("#player2").empty();
// $("#player1").text("Waiting for Player 1");
// $("#player2").text("Waiting for Player 2");



database.ref('player').on("value", function (snapshot) {

    console.log(snapshot.val());
    if (snapshot.val() === null){
        $("#player1").empty();
        $("#player1").text("Waiting for Player 1");
        $("#player2").empty();
        $("#player2").text("Waiting for Player 2");
    }
    else if ((snapshot.val()[1] != undefined && snapshot.val()[2] != undefined) && playernum === null) {
        $("#player1").empty();
        $("#player1").text(snapshot.val()[1].name + " is currently playing.");
        $("#player2").empty();
        $("#player2").text(snapshot.val()[2].name + " is currently playing.");

    }

    else {
        if (snapshot.val()[1] === undefined) {
            $("#player1").empty();
            $("#player1").text("Waiting for Player 1");
        }else {
            $("#player1").empty();
            $("#player1").text(snapshot.val()[1].name + " is waiting for you.");
        }

        if (snapshot.val()[2] === undefined) {
            $("#player2").empty();
            $("#player2").text("Waiting for Player 2");
        }else {
            $("#player2").empty();
            $("#player2").text(snapshot.val()[2].name + " is waiting for you.");
        }

    }
});

database.ref('player/turn').on("value",function(snapshot) {
    console.log(snapshot.val());
    if (snapshot.val() === null || snapshot.val().turn === null) {
        turn1 = 0;
        return turn1;
    }
    else {
        //changes when turn is identifed so turn1 does not stay null and keep running the below condiditon
        turn1 = snapshot.val().turn;
        return turn1;
    }

});

console.log(turn1);

database.ref(PLAYERS_LOCATION).once("child_added").then(function(childSnapshot) {

    if(childSnapshot.val() === undefined) {

    }
    else if (childSnapshot.val() != undefined && turn1 === null) {
        console.log(childSnapshot.val());
        console.log(childSnapshot.key);
        var initial_update = $("#player" + childSnapshot.key);
        initial_update.empty();
        initial_update.append("<div class='playarea'>" + childSnapshot.val().name + "</div>");
        initial_update.append("<div class='playarea'> Wins: " + childSnapshot.val().wins + ", Losses: " + childSnapshot.val().loss + "</div>");
    }
});

//to enter game
$("#submit").on("click", function() {
    name = $("#players").val();
    console.log(name);
    if (name.trim() != "") {
        console.log(name);
        assignplayernumber(name);
    }


});






// function to play the game

function playGame(myPlayerNumber, myUserId) {
    console.log("the calling the function works");
    console.log(myPlayerNumber);
    if (myPlayerNumber === null) {
        $("#heading").empty();
        $("#heading").append("<div>Please Wait, as there are currently two players</div>");
    }


    else {
        //checks to make sure there are tow p layers
        var opponentPlayerNumber = myPlayerNumber === 1 ? 2 : 1;
        console.log(myPlayerNumber);
        console.log(opponentPlayerNumber);
        console.log(myPlayerNumber +" " + myUserId)

        var docref = database.ref(PLAYERS_LOCATION);
        docref.on("value", function (snapshot) {
            $("#heading").empty();
            $("#heading").append("<div>Hi " + myUserId + "!</div>");
            $("#heading").append("<div>You are Player " + myPlayerNumber + "</div>");

            console.log(snapshot.val()[1]);
            console.log(snapshot.val()[2]);
            // see if player is missing
            if(snapshot.val()[opponentPlayerNumber] === undefined) {
                $("#heading").append("<div>Waiting for second player</div>");
                //update users box on dom
                $("#player" + opponentPlayerNumber).empty();
                $("#player" + opponentPlayerNumber).append("<div>Waiting for Player " + opponentPlayerNumber + ".</div>");
                userbox = $("#player" + myPlayerNumber);
                    userbox.empty();
                    userbox.append("<div class='playarea'>" + myUserId + "</div>");
                    userbox.append("<div class='playarea'> Wins: " + snapshot.val()[+myPlayerNumber].wins + ", Losses: " + snapshot.val()[+myPlayerNumber].loss + "</div>");
            }
            //both players ready
            else if((snapshot.val()[opponentPlayerNumber] != undefined) && (snapshot.val()[myPlayerNumber] != undefined && turn1 != null)) {
                docturn.set({
                   turn: turn1,
                });
                //setting variables to values to make it easiier
                var yourname = snapshot.val()[+myPlayerNumber].name;
                var yourwins = snapshot.val()[+myPlayerNumber].wins;
                var yourloss = snapshot.val()[+myPlayerNumber].loss;
                var yourchoice = snapshot.val()[+myPlayerNumber].choice || "none";

                var oppname = snapshot.val()[+opponentPlayerNumber].name;
                var oppwins = snapshot.val()[+opponentPlayerNumber].wins;
                var opploss = snapshot.val()[+opponentPlayerNumber].loss;
                var oppchoice = snapshot.val()[+opponentPlayerNumber].choice || "none";


                console.log("two players and we are ready to play!");
                userbox = $("#player" + myPlayerNumber);
                $("#results").empty();
                userbox.empty();
                userbox.append("<div class='playarea'>" + yourname + "</div>");
                var selection = $("<div class = 'userchoices'>");
                if(yourchoice === "none") {
                    selection.append("<button class='choices' value='rock'>Rock!</button>");
                    selection.append("<button class='choices' value='paper'>Paper!</button>");
                    selection.append("<button class='choices' value='scissors'>Scissors!</button>");
                }else {
                    selection.append("<div id='boom'>" + yourchoice.toUpperCase() + "!</div>");
                }
                userbox.append(selection);
                userbox.append("<div class='playarea'> Wins: " + yourwins + ", Losses: " + yourloss + "</div>");

                oppbox = $("#player" + opponentPlayerNumber);
                $("#results").empty();
                oppbox.empty();
                oppbox.append("<div class='playarea'>" + oppname + "</div>");
                var oppselection = $("<div class='userchoices'>");
                if(oppchoice === "none") {
                    oppselection.append("<button>Rock!</button>");
                    oppselection.append("<button>Paper!</button>");
                    oppselection.append("<button>Scissors!</button>");
                }else {
                    oppselection.append("<div>" + oppname + " has selected!</div>")
                }
                oppbox.append(oppselection);
                oppbox.append("<div class='playarea'> Wins: " + oppwins + ", Losses: " + opploss + "</div>");

            }

            if ((snapshot.val()[opponentPlayerNumber] != undefined) && (snapshot.val()[myPlayerNumber] != undefined) && (yourchoice != "none" && oppchoice != "none")) {
                //run functionto compare and update the values and middle screen
                outcome = didYouWin(yourchoice, oppchoice);

                if (outcome === "win"){
                    wins++;
                    turn1++;
                    $("#results").empty();
                    $("#results").append("<div>You Won!</div>");
                }
                else if (outcome === "lose"){
                    loss++;
                    turn1++;
                    $("#results").empty();
                    $("#results").append("<div>You Loss!</div>");
                }
                else if (outcome === "draw"){
                    turn1++;
                    $("#results").empty();
                    $("#results").append("<div>Its a Draw!</div>");
                }


                updateResults(wins, loss, turn1, playernum);


            }

        });
    }
};


//when the database hears a new messge is added
database.ref(CHAT_LOCATION).limitToLast(1).on("child_added", function (snapshot) {
    console.log("The message listener is working");
    console.log(snapshot.val());
    if (snapshot.val().name === name) {
        $("#chat").append("<div class='noise myPlaya'>" + snapshot.val().name + ": " + snapshot.val().mess + "</div>");
    }else {$("#chat").append("<div class='noise'>" + snapshot.val().name + ": " + snapshot.val().mess + "</div>");}
});


//when the submit button to send messages is clicked
$(document).on('click', '#submitmes', function() {
    event.preventDefault();
    var message = $("#currmess").val();
    chatupdate(name, message);
    $("#currmess").val("");
});


$(document).on('click', '.choices', function () {
        console.log("choices button works");
        var choice = $(this).val();
        setRPS(playernum, choice);
});


function assignplayernumber (name) {
    var myUserId = name;
    var playerListRef = database.ref(PLAYERS_LOCATION);


    playerListRef.once("value").then(function (snapshot) {
        var playerlist = snapshot.val();
        var joinedGame = false;



        for (i = 1; i < NUM_PLAYERS + 1; i++) {
            console.log(i);
            if(playerlist === null && !joinedGame) {
                playernum = i;
                joinedGame = true;
                break;

            }
            else if (playerlist[i] === undefined && !joinedGame) {
                playernum = i;
                joinedGame = true;
                break;
            }
        };

        if (joinedGame) {

            database.ref(PLAYERS_LOCATION + "/" + playernum).set({
                name: myUserId,
                wins: wins,
                loss: loss,
                choice: "none"
            });

        }

        playGame(playernum, name);
    });


}

function didYouWin(yourRPS, opponentRPS) {

// Run traditional rock, paper, scissors logic and return whether you won, lost, or had a draw.
    switch(yourRPS) {
        case 'rock':
            switch(opponentRPS) {
                case 'rock':
                    return 'draw';
                case 'paper':
                    return 'lose';
                case 'scissors':
                    return 'win';
            }
            break;
        case 'paper':
            switch(opponentRPS) {
                case 'rock':
                    return 'win';
                case 'paper':
                    return 'draw';
                case 'scissors':
                    return 'lose';
            }
            break;
        case 'scissors':
            switch(opponentRPS) {
                case 'rock':
                    return 'lose';
                case 'paper':
                    return 'win';
                case 'scissors':
                    return 'draw';
            }
            break;
    }
}




//updating chat
function chatupdate (myUserId, message) {
    database.ref(CHAT_LOCATION).push({name: myUserId,mess: message});
}


//setting rps value to database
function setRPS(myPlayerNumber, myRPS) {
    console.log(myPlayerNumber);
    console.log(myRPS);
    database.ref(PLAYERS_LOCATION + "/" +myPlayerNumber).update({choice: myRPS});
}


function updateResults(myWins, myLoss, myCount, myPlayerNumber) {
    setTimeout(function () {
        console.log(myPlayerNumber);
        database.ref(PLAYERS_LOCATION + "/" +myPlayerNumber).update({choice: "none"});
        database.ref(PLAYERS_LOCATION + "/" +myPlayerNumber).update({wins: myWins});
        database.ref(PLAYERS_LOCATION + "/" +myPlayerNumber).update({loss: myLoss});
        database.ref(TURN_LOCATION).update({turn: myCount});
    }, 2000);
}



//remove person from database
window.onunload = function() {
    docturn.remove();
    // docturn.set({turn: null});
    database.ref("player/" + playernum).remove();
    database.ref(CHAT_LOCATION).push({name: name,
        mess: "Has disconnected."});
    database.ref(PLAYERS_LOCATION).once("value").then(function (snapshot) {
        if (snapshot.val()[1] === undefined && snapshot.val()[2] === undefined) {
            database.ref(CHAT_LOCATION).remove();
        }
    });
};

