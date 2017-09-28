var NUM_PLAYERS = 2;
var PLAYERS_LOCATION = 'player';
var TURN_LOCATION = 'player/turn';
var name;
var playernum = null;
var turn = 0;
var turn1;
var userbox;
var oppbox;


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

database.ref('player/turn').on("value",function(snapshot) {
    console.log(snapshot.val());
    if (snapshot.val() === null) {
        turn1 = null;
        return turn1;
    }
    else {
        //changes when turn is identifed so turn1 does not stay null and keep running the below condiditon
        turn1 = snapshot.val().turn;
    }

})

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
    assignplayernumber(name);


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
            $("#heading").append("<div>You are PLayer " + myPlayerNumber + "</div>");

            console.log(snapshot.val()[1]);
            console.log(snapshot.val()[2]);
            // see if player is missing
            if(snapshot.val()[opponentPlayerNumber] === undefined) {
                $("#heading").append("<div>Waiting for second player</div>");
                //update users box on dom
                userbox = $("#player" + myPlayerNumber);
                    userbox.empty();
                    userbox.append("<div class='playarea'>" + myUserId + "</div>");
                    userbox.append("<div class='playarea'> Wins: " + snapshot.val()[+myPlayerNumber].wins + ", Losses: " + snapshot.val()[+myPlayerNumber].loss + "</div>");
            }
            //both players ready
            else if((snapshot.val()[opponentPlayerNumber] != undefined) && (snapshot.val()[myPlayerNumber] != undefined)) {
                docturn.set({
                   turn: turn,
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
                userbox.empty();
                userbox.append("<div class='playarea'>" + yourname + "</div>");
                var selection = $("<div class = 'userchoice'>");
                if(yourchoice === "none") {
                    selection.append("<button class='choices' value='rock'>Rock!</button>");
                    selection.append("<button class='choices' value='paper'>Paper!</button>");
                    selection.append("<button class='choices' value='scissors'>Scissors!</button>");
                }else {
                    selection.append("<div>" + yourchoice + "!</div>");
                }
                userbox.append(selection);
                userbox.append("<div class='playarea'> Wins: " + yourwins + ", Losses: " + yourloss + "</div>");

                oppbox = $("#player" + opponentPlayerNumber);
                oppbox.empty();
                oppbox.append("<div class='playarea'>" + oppname + "</div>");
                var oppselection = $("<div class='userchoices'>");
                if(oppchoice === "none") {
                    oppselection.append("<button>Rock!</button>");
                    oppselection.append("<button>Paper!</button>");
                    oppselection.append("<button>Scissors!</button>");
                }else {
                    oppselection.append("<div>" + oppchoice + "!</div>")
                }
                oppbox.append(oppselection);
                oppbox.append("<div class='playarea'> Wins: " + oppwins + ", Losses: " + opploss + "</div>");

            }

            if ((snapshot.val()[opponentPlayerNumber] != undefined) && (snapshot.val()[myPlayerNumber] != undefined) && (yourchoice != "none" && oppchoice != "none")) {
                //run functionto compare and update the values and middle screen

            }

        });
    }
};


//function to give the user playenumber


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
                wins: 0,
                loss: 0,
                choice: "none"
            });

        }

        playGame(playernum, name);
    });


}

//setting rps value to database

function setRPS(myPlayerNumber, myRPS) {
    console.log(myPlayerNumber);
    console.log(myRPS);
    database.ref(PLAYERS_LOCATION + "/" +myPlayerNumber).update({choice: myRPS});
}


//remove person from database
window.onunload = function() {
    database.ref("player/" + playernum).remove();
    docturn.remove();
};
