//the view, is responsible for updating the display; and the controller,
//it glues everything together by handling the user input, making sure the game
//logic gets played and determining when the game is over.




var view = {
	displayMessage: function(msg){
					var messageArea = document.getElementById("messageArea");
					messageArea.innerHTML = msg;
	},


	displayHit: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");

	},

	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");

	}

};
//The model should  includes the location of the ships, the ship locations
//that have been hit, and how many ships have been sunk



//keep note of the methods that allows you to communicate with the view

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipSunk: 0,

	ships: [

				{ locations: [0, 0, 0], hits: ["", "", ""] },
				{ locations: [0, 0, 0], hits: ["", "", ""] },
				{ locations: [0, 0, 0], hits: ["", "", ""] } ],



	//the fire method in the model goes through the ships and checks to see the user's
	//guess is a hit and if it is it adds "hit" to the ship.hits
	fire: function(guess) {


	for(var i = 0; i < this.numShips; i++){
		//this goes through the ships objects
		var ship = this.ships[i];
		//we are going to use indexOf to see if the user's guess is infact and index
		// in the locations array. If it is it will return the index value and if it
		//is not than we get a -1

		//once we have an object from the ships array we can go though its properties
		//in this case the ship objects have two properties each with a locations
		//and a hits
		var index = ship.locations.indexOf(guess);
		if (index >= 0){
			ship.hits[index] = "hit";
			view.displayHit(guess);
			view.displayMessage("HIT!");
			if(this.isSunk(ship)){
				this.shipSunk++;
				view.displayMessage("You sank my battleship!");
			}
			return true;
		}
	}
	view.displayMiss(guess);
	view.displayMessage("You missed.");
	return false;
},

//creating the method to see if a ship is sunk

	isSunk: function(ship){
		for(var i = 0; i < this.shipLength; i++){
			if(ship.hits[i] !== "hit"){
				return false;

			}
		}
		return true;
	},


	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
},

collision: function(locations) {
for (var i = 0; i < this.numShips; i++) {
	var ship = this.ships[i];
	for (var j = 0; j < locations.length; j++) {
		if (ship.locations.indexOf(locations[j]) >= 0) {
			return true;
		}
	}
}
return false;
}

};




// the controller gets the guess, processes the guess and sends it to the model
//if the players guess is an index in the ship variable then the controller adds
//one ot guesses and keeps a stat of how the player is doing


var controller = {
	guesses: 0,
	processGuess: function(guess){
		//this is the user's guess after the rows have been converted to a number and
		//concatenated with the column
		var location = parseGuess(guess);
		if(location) {
			this.guesses++
			var hit = model.fire(location);
			if(hit && model.shipSunk === model.numShips){
				view.displayMessage("You sank my battelships, in " + this.guesses + " guesses");
			}
		}
	}
};



// this function makes sure that the users guess if within the boundaries of the
//game and that it is a valid entry.I also converts row into a number

function  parseGuess (guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if(guess === null || guess.length !== 2){
		alert("Oops, please enter a letter and a number on the board.");

	}else{
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);





		if(isNaN(row) || isNaN(column)){
			alert("Oops that isnt on the board.");
		}else if(row < 0 || row >= model.boardSize || column < 0
				|| column >= model.boardSize){
					alert("Oops, thats off the board");

			}else {
				return row + column;
			}

		}
		return null;
	}









//this function gets the fireButton form and hands it to an event handler
function init(){
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();

}




// this is so you wont have to click on the button each time you want to submit
//it allows you to use the enter button
function handleKeyPress(e){
	var fireButton = document.getElementById("fireButton");
	if(e.keyCode === 13){
		fireButton.click();
		return false;
	}
}







//even handler for the fireButton. this takes the users guess by getting the text
//fromt the text form
function handleFireButton(){
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	//this code hands the users guess and hands it to the controller
	controller.processGuess(guess);
	// this resets the code so you wont have to backspace after each guess
	guessInput.value = "";

}
//this will allows this init to run after the pages is fullly loaded
window.onload = init;


//testing processGuess

// controller.processGuess("A0");
//
// controller.processGuess("A6");
// controller.processGuess("B6");
// controller.processGuess("C6");
//
// controller.processGuess("C4");
// controller.processGuess("D4");
// controller.processGuess("E4");
//
// controller.processGuess("B0");
// controller.provessGuess("B1");
// controller.processGuesss("B2");




















//for testing parseGuess
// console.log(parseGuess("A0"));
// console.log(parseGuess("B6"));
// console.log(parseGuess("G3"));
// console.log(parseGuess("H0"));
// console.log(parseGuess("A7"));






//for testing the model and fire methods making sure they both work
// model.fire("53");
// model.fire("06");
// model.fire("16");



// view.displayMessage("Hello");
// view.displayHit("03");
// view.displayHit("06");
// view.displayHit("16");
// view.displayHit("11");
// view.displayHit("12");
// view.displayHit("13");
// view.displayMiss("00");
// view.displayMiss("00");
