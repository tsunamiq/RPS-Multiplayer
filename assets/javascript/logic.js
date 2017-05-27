$(document).ready(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDjJUGLnKjhu5k4BlXnWkO4sZPytwpH8VI",
    authDomain: "rpsgame-jt.firebaseapp.com",
    databaseURL: "https://rpsgame-jt.firebaseio.com",
    projectId: "rpsgame-jt",
    storageBucket: "rpsgame-jt.appspot.com",
    messagingSenderId: "999453318275"
  };
  firebase.initializeApp(config);
  var database = firebase.database();


// Declare variables
var playerName1;
var playerName2;
var p1Wins =0;
var p1Losses = 0;
var p2Wins = 0;
var p2Losses = 0; 
var player = ""; 










// =================================================
// 		Submit name player 1 and player 2
// =================================================


//On click function to input names into coorisponding 
$("#nameSubmit").on("click",function(event){
	event.preventDefault();

	//Create user objects in firebase
	database.ref("player/p1").once("value").then(function(snapshot){
		
		if(snapshot.val() == null){
			console.log("Player 1 Created")
			playerName1 = $("#inputName").val().trim();
			playerCreate(playerName1,"p1")
			displayName(playerName1,1,"p1");
			$("#p1Body").text("Waiting for Player 2 to Join");

		}else{
			playerName2 = $("#inputName").val().trim();
			console.log("Player 2 Created")
			playerCreate(playerName2,"p2")
			displayName(playerName2,2);
		}
		playerEval(playerName1);
	
	});
	database.ref("player/").once("value").then(function(snapshot){
		if(snapshot.val()!= null){
			if(snapshot.val().p1 && snapshot.val().p2){
				console.log("add turn");

       			database.ref("turn/").set({
        		turn:1
     			 });
    
			}
		}
	
	});
	
});

// =================================================
// 					Player info DB
// =================================================

function playerCreate(name,playerNumber){
	database.ref("player/"+playerNumber).set({
		name : name,
      	wins: 0 ,
      	losses: 0
     }); 	

};




// =================================================
// 				Display Name	
// =================================================

function displayName(name, num,pNum){
	$("#statusBody").text("Welcome " + name + "! You are Player"+ num +"!");
};

// =================================================
// 				Display p1  name 	
// =================================================


database.ref("player/p1").on("value",function(snapshot)
	{
		if(snapshot.val() != null){
			$("#p1Head").text(snapshot.val().name);
			console.log("display head p1 success")
			var win = snapshot.val().wins;
			var lose = snapshot.val().losses;
			$("#p1Status").text("Wins: "+ win + " | "+"Losses: " +lose);

		}
	
});


// =================================================
// 				Display p2  name	
// =================================================


database.ref("player/p2").on("value",function(snapshot){
		if(snapshot.val() != null){
			$("#p2Head").text(snapshot.val().name);
			console.log("display head p2 success")
			var win = snapshot.val().wins;
			var lose = snapshot.val().losses;
			$("#p2Status").text("Wins: "+ win + " | "+"Losses: " +lose);
			// $("#p2Body").text("Waiting for Player 1 to Choose!")
		}
		
});
// =================================================
// 				turn 1	
// =================================================

database.ref("turn/").on("value",function(snapshot){
	if(snapshot.val() != null){
		if(snapshot.val().turn == 1 && playerName1 != null){
			console.log("turn 1 Success");
			$("#p1Body").empty();
			var rock = $("<h2>").attr({
				id: "choiceP1",
				data:"rock"

			}).text("Rock");

			var paper = $("<h2>").attr({
				id: "choiceP1",
				data: "paper"

			}).text("Paper");
			var scissor = $("<h2>").attr({
				id: "choiceP1",
				data: "scissor"		
			}).text("Scissor");

			$("#p1Body").append(rock);
			$("#p1Body").append(paper);
			$("#p1Body").append(scissor);
		}
	}
	if(snapshot.val() != null){
		if(snapshot.val().turn == 1 && playerName2 != null){
			$("#p2Body").text("Waiting for Player 1 to Choose!");
		}
	}


});


// =================================================
// 				turn 1 click event	
// =================================================

$(document).on("click","#choiceP1",function(){
	var choice = $(this).attr("data");
	console.log("choice is: "+ choice);

	database.ref("player/p1").update({
		choice:choice
		// name : playerName1,
  //     	wins: p1Wins,
  //     	losses: p1Losses
	});
	$("#p1Body").html("Your Choice: " + choice + "<br> Waiting for Player 2 to Choose!");
	database.ref("turn/").set({
		turn:2
	})
});

// =================================================
// 				turn 2	
// =================================================

database.ref("turn/").on("value",function(snapshot){

	if(snapshot.val() != null){
		if(snapshot.val().turn == 2 && playerName2 != null){
			$("#p2Body").empty();
			console.log("turn 2 Success");
			var rock = $("<h2>").attr({
				id: "choiceP2",
				data:"rock"

			}).text("Rock");

			var paper = $("<h2>").attr({
				id: "choiceP2",
				data: "paper"

			}).text("Paper");
			var scissor = $("<h2>").attr({
				id: "choiceP2",
				data: "scissor"		
			}).text("Scissor");

			$("#p2Body").append(rock);
			$("#p2Body").append(paper);
			$("#p2Body").append(scissor);

		}
	}

});


// =================================================
// 				turn 2 click event	
// =================================================

$(document).on("click","#choiceP2",function(){
	var choice = $(this).attr("data");
	console.log("choice is: "+ choice);

	database.ref("player/p2").update({
		choice:choice
		
	});
	$("#p2Body").text("Your Choice: " + choice);

	database.ref("turn/").set({
		turn:3
	})
});


// =================================================
// 				turn 3	(Results)
// =================================================

database.ref("turn/").on("value",function(snapshot){
	if(snapshot.val() != null){
		if(snapshot.val().turn == 3){
			console.log("turn 3 Success!");
			var choice1;
			var choice2;

			database.ref("player/").once("value").then(function(snapshot){
				var choice1 = snapshot.val().p1.choice;
				var choice2 = snapshot.val().p2.choice;
				console.log("choice 1: " + choice1);
				console.log("choice 2: " + choice2);
				evalution(choice1,choice2);
		
				setTimeout(restart(), 8000);

			});
		}
	}
});

// =================================================
// 				Eval function
// =================================================

function evalution(choice1, choice2){

	var winner = 0; 
	if(choice1 == "rock" && choice2 =="paper"){
		$("#resultsBody").text("Player 2 Wins!")
		winner = 2; 
	}else if(choice1 == "rock" && choice2 =="scissor"){
		$("#resultsBody").text("Player 1 Wins!")
		winner = 1; 
	}else if(choice1 == "rock" && choice2 =="rock"){
		$("#resultsBody").text("Tie Game!")
		winner = 0; 
	}

	if(choice1 == "paper" && choice2 =="scissor"){
		$("#resultsBody").text("Player 2 Wins!")
		winner = 2; 
	}else if(choice1 == "paper" && choice2 =="rock"){
		$("#resultsBody").text("Player 1 Wins!")
		winner = 1 ; 
	}else if(choice1 == "paper" && choice2 =="paper"){
		$("#resultsBody").text("Tie Game!")
		winner = 0; 
	}

	if(choice1 == "scissor" && choice2 =="rock"){
		$("#resultsBody").text("Player 2 Wins!")
		winner = 2 ; 
	}else if(choice1 == "scissor" && choice2 =="paper"){
		$("#resultsBody").text("Player 1 Wins!")
		winner = 1 ; 
	}else if(choice1 == "scissor" && choice2 =="scissor"){
		$("#resultsBody").text("Tie Game!")
		winner = 0; 
	}

	if(winner != 0 ){
				
		if(winner == 1){
			console.log("win number: "+ winner);
			console.log("Player 1 wins and Player 2 Loses")	
			scoreStatus("p1","p2");
			
		}

		if(winner == 2 ){
			console.log("win number: "+ winner);
			console.log("Player 2 wins and Player 1 Loses")	
			scoreStatus("p2","p1");
			
		}
	}
}

// =================================================
// 				Increment wins and display
// =================================================
function scoreStatus(winner, loser){
	database.ref("player/"+winner).once("value").then(function(snapshot){
		var winCount =  snapshot.val().wins; 
		winCount++;
		console.log("wincount after increment: " + winCount)
		database.ref("player/"+winner).update({
			wins: winCount
		})

	});
	database.ref("player/"+loser).once("value").then(function(snapshot){
		var loseCount = snapshot.val().losses; 
		loseCount++;
		console.log("loseCount after increment: " + loseCount)
		database.ref("player/"+loser).update({
			losses: loseCount
		});

	});

}


// =================================================
// 				Restart Game
// =================================================


function restart(){
	database.ref("turn/").set({
		turn:1
	})
	// $("#p2Body").text("Waiting for Player 1 to choose");


};


// =================================================
// 					Player connection
// =================================================
function playerEval(playerEval){
	if(playerEval != null){
		player = "p1";
		console.log("player is: " +player);
		disconnect(player);
		// chatDisconnect()
	}else{
		player = "p2";
		console.log("player is: " +player);
		disconnect(player);
		// chatDisconnect();
	}
}


// =================================================
// 					Player disconnect
// =================================================
function disconnect(pNum){

	var ref = firebase.database().ref("player/"+pNum);

	ref.onDisconnect().remove();
}


// =================================================
// 					turn remove when disconnect
// =================================================

var ref = firebase.database().ref("turn/");

	ref.onDisconnect().remove();
	




database.ref("player/p1").on("value",function(snapshot){
	if(snapshot.val() ==null&& playerName2 != null){
		$("#p2Body").text("Waiting for Player 1 to Sign in!");
	}

})

database.ref("player/p2").on("value",function(snapshot){
	if(snapshot.val()==null && playerName1 != null){
		$("#p1Body").text("Waiting for Player 2 to Sign in!");
	}

})

// =================================================
// 					Player 1 disconnect and reconnect check turn
// =================================================

function checkTurn(){
	database.ref("turn/").once("value").then(function(snapshot){
		var turn = snapshot.val().turn;
		if(turn !=0 ){
			snapshot.update({
				turn : 1
			})
		}

	})
}

// =================================================
// 					chat on click functions
// =================================================


$("#chatSubmit").on("click",function(event){
	
	var chat = $("#chatInput").val().trim(); 

	if(playerName1 != null){
		database.ref("chat").push({
			name: playerName1 ,
			message: chat
		})
	}else{
		database.ref("chat").push({
			name: playerName2 ,
			message: chat
		})
	}
	
	$("#chatInput").val("");
});

database.ref("chat").on("child_added",function(childSnapshot){
		
		var message = $("<div/>");
		message.text(childSnapshot.val().name + ": " + childSnapshot.val().message);
		$("#chatBox").append(message);

	})

// =================================================
// 					Chat disconnect clear
// =================================================

database.ref("chat").onDisconnect().remove();

database.ref("chat").on("value",function(snapshot){
	if(snapshot.val() == null){
		$("#chatBox").empty();
	}
})
	

});