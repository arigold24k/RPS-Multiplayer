var player1_ = $("#player1");
var player2_ = $("#player2");
var user;
var name;
var wins = 0;
var loss = 0;
var a;
var playernum = 0;
var lenofplayers;
var NUM_PLAYERS = 2;
var PLAYERS_LOCATION = 'player';
var PLAYER_DATA_LOCATION = 'player_data';

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

//creating the players checking to see if there are values in the database for registered
//players

for (var i = 1; i < 3; i++) {
    database.ref("player/" + i).once("value").then(function (snapshot) {
       a = snapshot.exists();
       console.log(a);
    });
    if (a) {  }
    else if (!a) {
        playernum = i;
        break;
    }
    else if (a && i === 2) {
        $("#heading").empty();
        $("#heading").append("<div>Please Wait, as there are currently two players</div>");

    }



};






// database.ref().on("value", function(snapshot) {
//     console.log(snapshot.val().player.length);
//     if (snapshot.val().player.length === 3) {
//         $("#heading").empty();
//         $("#heading").append("<div>Please Wait, as there are currently two players</div>");
//     }
//
// });
//
//
database.ref("player").on("value", function(snapshot) {
//     if (player1.text() === "Waiting Player 1") {
//         player1.append("<div id='name'>" + childsnapshot.val().name + "</div>")
//     }
// })
    lenofplayers = snapshot.val().length;

    if (snapshot.val() === null) {

    }

    else if (playernum === 1) {
         i = playernum;
        user = "player" + i;
    console.log(snapshot.val());
    console.log(snapshot.val().length);
        name = snapshot.val()[i].name;
        wins = snapshot.val()[i].wins;
        loss = snapshot.val()[i].losses;
        console.log(i);
        console.log(name);
        console.log(wins);
        console.log(loss);
        // console.log(user);
        console.log("#" + user);
        $("#" + user).empty();
        $("#" + user).append("<div>" + name + "</div>");
    }

    else if (playernum === 2) {
         i = playernum;
        user = "player" + i;
        console.log(snapshot.val());
        console.log(snapshot.val().length);
        name = snapshot.val()[i].name;
        wins = snapshot.val()[i].wins;
        loss = snapshot.val()[i].losses;
        console.log(i);
        console.log(name);
        console.log(wins);
        console.log(loss);
        // console.log(user);
        console.log("#" + user);
        $("#" + user).empty();
        $("#" + user).append("<div>" + name + "</div>");
    }
    // else {
    //     $("#heading").empty();
    //     $("#heading").append("<div>Please Wait, as there are currently two players</div>");
    // }
//
//
});
//
//
//
//
//
//
$("#submit").on("click", function() {
    //
    // if (($("#players").val() != "")) {
    //     name = $("#players").val();
    //     database.ref("player/" + playernum).set({
    //         name: name,
    //         wins: 0,
    //         losses: 0
    //     });
    //
    //     $("#heading").empty();
    //     $("#heading").append("<div>Hi " +name + " You are " + user + "</div>");
    //
    //     if (lenofplayers === 2) {
    //         $("#heading").append("<div> Waiting for Player 2</div>");
    //
    //     }
    //
    // };
    // else if (player2_.text() === "Waiting Player 2" && $("#players").val() != "") {
    //     i = 2;
    //     database.ref("player/" + i).set({
    //         name: $("#players").val(),
    //         wins: 0,
    //         losses: 0
    //     });
    //
    //     $("#heading").empty();
    //     $("#heading").append("<div>Hi " +name + " You are " + user + "</div>");
    // }




});


player1_.empty();
player2_.empty();
player1_.text("Waiting Player 1");
player2_.text("Waiting Player 2");




//use this while the game is running
database.ref().on("value", function(snapshot) {

}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);

});



window.onunload = function() {
    database.ref("player/" + i).remove();

};