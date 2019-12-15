/*
Global functions are turn order, gamestate and time
*/
var turnOrder = 0;					//Internal turn order, also acts as total turns
var gameState = true;				//stays true while playing, false = game end


var timeStart = new Date();							//get starting date
timerElem = document.getElementById("timer");		//get html element to display timer
var startTimer = setInterval(myTimer, 1000);		//Init stopwatch
function myTimer()
{
	if(gameState)
	{
		var time = (new Date() - timeStart)*0.001;		//get newdate-startdate and factor into seconds
		var minutes = Math.floor(time/60);				//divide by 60 to get minutes
		var seconds = Math.floor(time-minutes*60);		//subtract total minutes *60 to get seconds (0-59)
		//Fixes the visual bug that when seconds is < 10, would display something like "0:9"
		//Which is incorrect, so the actual display is "0:09"
		if(seconds < 10)
		{
			timerElem.innerHTML = minutes.toLocaleString()+":0"+seconds.toLocaleString();
		}
		else
		{
			timerElem.innerHTML = minutes.toLocaleString()+":"+seconds.toLocaleString();
		}
	}
}

//Game body
function playGame()
{
	//Retrieves the form data into an observable object
	var gameSetup = {
		"mode" : location.search.slice(1).split("&")[0].split("=")[1],
		"size" : parseInt(location.search.slice(1).split("&")[1].split("=")[1]),
		"color": location.search.slice(1).split("&")[2].split("=")[1],
		"p1c" : location.search.slice(1).split("&")[3].split("=")[1],
		"p2c" : location.search.slice(1).split("&")[4].split("=")[1]
	};
	
	var playable = buildGrid(gameSetup["size"]);
	//printGrid(playable);
	
	//Initiallize player and opponent owned squares in center of grid
	var p1owned = [
		{row: 3, col: 3},
		{row: 4, col: 4}
	];
	
	var p2owned = [
		{row: 3, col: 4},
		{row: 4, col: 3}
	];
	
	//Init information display (the player user pic and the opponent pic
	//as well as number of discs currently owned)
	initInfoDisplay(gameSetup);
	//Init and play the game by starting with first player
	makeClickableGrid(gameSetup, playable, gameState, p1owned, p2owned);
	
	//var gameInfo = gameInternal(gameSetup, turnOrder, playable, gameState, p1owned, p2owned);
	
}
/*
=======================================================================================================
gameInternal, getNextAvailMoves, and searchAvailDirection are all linked and provide the human player / 
computer player a list of available actions.

For each disc on a square that the player owned, must search in 8 cardinal directions to see if empty
or opponent owned. If the tail end of the search results in the opponent disc and the next square is empty,
returns that the action is available.
*/
//This will check who is the designated turn and returns a list
//of available actions that are clickable if the player is human
function gameInternal(gameSetup, grid, state, p1o, p2o)
{
	//console.log("turn: "+turnOrder);
	//console.log(gameSetup["mode"]);
	var movesList = [];
	var player = "";
	if(state)
	{
		//Checks the turn order to see intended player move
		if(turnOrder%2 == 0)
		{
			player = "p1";
			movesList = getNextAvailMoves(grid, player, p1o);
			for(var i=0; i<movesList.length; i++)
			{
				changeElemColor(movesList[i], "yellow");
			}
			return movesList;
		}
		else
		{
			player = "p2";
			if(gameSetup["mode"] == "PvP")
			{
				//console.log("mode: "+gameSetup["mode"]);
				movesList = getNextAvailMoves(grid, player, p2o);
				for(var i=0; i<movesList.length; i++)
				{
					changeElemColor(movesList[i], "yellow");
				}
				return movesList;
			}
			else if(gameSetup["mode"] == "ComputerEasy")
			{
				movesList = getNextAvailMoves(grid, player, p2o);
				return movesList;
			}
			else if(gameSetup["mode"] == "ComputerHard")
			{
				movesList = getNextAvailMoves(grid, player, p2o);
				return movesList;
			}
		}	
	}
}

//
function getNextAvailMoves(grid, player, playerOwned)
{
	var actionsList = [];
	var direction = [];
	for(var i=0; i<playerOwned.length; i++)
	{
		//Search N, NE, E, SE, S, SW, W, NW
		//Remember that xy plane is rotated 90 degrees clockwise through 2d array
		//2d array search: quad1 = -x+y, quad2 = +x+y, quad3 = +x-y, quad4 = -x-y
		direction[0] = searchAvailDirection(grid, player, playerOwned[i], -1, 0);
		direction[1] = searchAvailDirection(grid, player, playerOwned[i], -1, 1);
		direction[2] = searchAvailDirection(grid, player, playerOwned[i], 0, 1);	
		direction[3] = searchAvailDirection(grid, player, playerOwned[i], 1, 1,);
		direction[4] = searchAvailDirection(grid, player, playerOwned[i], 1, 0);
		direction[5] = searchAvailDirection(grid, player, playerOwned[i], 1, -1);
		direction[6] = searchAvailDirection(grid, player, playerOwned[i], 0, -1);
		direction[7] = searchAvailDirection(grid, player, playerOwned[i], -1,-1);
		//Look for unavailable moves (i.e. direction index of both row and col == -1)
		for(var j=0; j<direction.length; j++)
		{
			if(direction[j]["row"] != -1 && direction[j]["col"] != -1)
			{
				actionsList.push(direction[j]);
			}
		}
	}
	return actionsList;
}

function searchAvailDirection(grid, player, startPos, drow, dcol)
{
	var opponent = "p1";
	if(player == "p1")
	{
		opponent = "p2";
	}
	//console.log(parseInt(startPos["row"]+drow)+", "+parseInt(startPos["col"]+dcol));
	//check if out of bounds
	if(startPos["row"]+drow >=0 && startPos["row"]+drow < grid.length && startPos["col"]+dcol >=0 && startPos["col"]+dcol < grid.length)
	{
		//check if next position is taken by player
		if(grid[startPos["row"]+drow][startPos["col"]+dcol] == player)
		{
			//no move avail
			return {row: -1, col: -1};
		}
		//check if next position is taken by opponent
		else if(grid[startPos["row"]+drow][startPos["col"]+dcol] == opponent)
		{
			//potential move avail, search further in respective direction
			var newX = startPos["row"]+drow;
			var newY = startPos["col"]+dcol;
			//console.log(newX+", "+newY);
			return searchAvailDirection(grid, player, {row: newX, col: newY}, drow, dcol);
		}
		//check if next position is empty ("o")
		else if(grid[startPos["row"]+drow][startPos["col"]+dcol] == "o")
		{
			if(grid[startPos["row"]][startPos["col"]] == opponent)
			{
				//console.log("current: "+startPos["row"]+", "+startPos["col"]);
				//console.log(grid[startPos["row"]][startPos["col"]]+" at: "+startPos["row"]+", "+startPos["col"]);
				var newX = startPos["row"]+drow;
				var newY = startPos["col"]+dcol;
				//console.log("newPos: "+newX+", "+newY);
				return {row: newX, col: newY};
			}
			else if(grid[startPos["row"]][startPos["col"]] == player)
			{
				return {row:-1, col:-1};
			}
			else
			{
				return {row:-1, col:-1};
			}
		}
		else
		{
			return {row:-1,col:-1};
		}
	}
	//Out of bounds
	else
	{
		return {row: -1, col: -1};
	}
	
}

/*======================================================================================================
searchAndFlip and searchFlipDirection contains the actual algorithm that once the human player / 
computer player has taken an action, the resulting action requires the discs in between two nonadjacent
player owned discs to be flipped. The algorithm also checks against flipping discs into an edge and
checks if the directional flip goes out of bounds (if it does, there is no flip since the opponent
owns the edge)

removeFromOwned is required to update the player1 and player2 owned objects which are necessary to be
recorded to update the game grid and update the gamestate as well as preparing to check for the next player's available moves
*/
function searchAndFlip(grid, player, startPos, p1o, p2o)
{
	//console.log("start: "+startPos["row"]+", "+startPos["col"]);
	//Search N, NE, E, SE, S, SW, W, NW
	grid = searchFlipDirection(grid, player, startPos, -1, 0, p1o, p2o);
	grid = searchFlipDirection(grid, player, startPos, -1, 1, p1o, p2o);
	grid = searchFlipDirection(grid, player, startPos, 0, 1, p1o, p2o);
	grid = searchFlipDirection(grid, player, startPos, 1, 1, p1o, p2o);
	grid = searchFlipDirection(grid, player, startPos, 1, 0, p1o, p2o);
	grid = searchFlipDirection(grid, player, startPos, 1, -1, p1o, p2o);
	grid = searchFlipDirection(grid, player, startPos, 0, -1, p1o, p2o);
	grid = searchFlipDirection(grid, player, startPos, -1, -1, p1o, p2o);
	return grid;
	
}

function searchFlipDirection(grid, player, startPos, drow, dcol, p1o, p2o)
{
	//helper identities
	var rowID = {0 : 'a',1 : 'b',2 : 'c',3 : 'd',4 : 'e',5 : 'f',6 : 'g',7 : 'h'};
	var colID = [1,2,3,4,5,6,7,8];
	//set counters for search
	var i = drow;
	var j = dcol;
	//set opponent
	var opponent = "p1";
	if(player == "p1")
		opponent = "p2";
	//set a temp position to monitor movement while searching
	//if i and j do not increase with respect to their drow/dcol
	//will loop forever, so if the temp = to the next start position
	//will break loop because search ends up as nothing to flip
	//temp cells is a container that has opponent discs in between player discs
	var tempPos = startPos
	var tempCells = [];
	while(startPos["row"]+i >=0 && startPos["row"]+i < grid.length && startPos["col"]+j >=0 && startPos["col"]+j < grid.length)
	{	
		if(tempPos == {row: startPos["row"]+i, col: startPos["col"]+j})
		{
			tempCells = [];
			break;	
		}
		else if(grid[startPos["row"]+i][startPos["col"]+j] == "o")
		{
			tempCells = [];
			break;
		}
		else if(grid[startPos["row"]+i][startPos["col"]+j] == opponent)
		{
			tempCells.push({row: startPos["row"]+i,col: startPos["col"]+j});
			i+=drow;
			j+=dcol;
		}
		else if(grid[startPos["row"]+i][startPos["col"]+j] == player)
		{
			for(var k=0; k<tempCells.length; k++)
			{
				//console.log(tempCells[k]);
				//Must remove the player 1/2 owned containers because they now belong to the other
				if(player == "p1")
				{
					p2o = removeFromOwned(p2o, tempCells[k]);
					p1o.push(tempCells[k]);
				}
				else
				{
					p1o = removeFromOwned(p1o, tempCells[k]);
					p2o.push(tempCells[k]);
				}
				//console.log("row: "+tempCells[k]["row"]+", col: "+tempCells[k]["col"]);
				//Updates the grid and the table
				grid[tempCells[k]["row"]][tempCells[k]["col"]] = player;
				var index = document.getElementById(rowID[tempCells[k]["row"]]+String(colID[[tempCells[k]["col"]]]));
				index.innerHTML = player;
				//console.log("flipped: "+index.id);
			}
			break;
		}
		tempPos = {row: startPos["row"]+i,col: startPos["col"]+j};
	}
	//Now flip the container discs
	return grid;
}

function removeFromOwned(playerOwned, target)
{
	for(var i=0; i<playerOwned.length; i++)
	{
		if(playerOwned[i]["row"] == target["row"] && playerOwned[i]["col"] == target["col"])
		{
			playerOwned.splice(i,1);
		}
	}
	return playerOwned;
}

/*========================================================================================================
This is the head function that enables the human player to play the game. This also checks whether or not
player 2 is a human or computer and then proceeds to call functions with respect to the game mode. This function (if player is human) will highlight the player's next available moves and make them clickable.
Once the human player clicks the intended move will invoke makeMove() which will proceed to update the game. If the nextAvailMoves-list returns empty (or null) will force the current player's turn a "pass" which will force the next intended player to move.
*/
function makeClickableGrid(gameSetup, grid, state, p1o, p2o)
{
	if(gameState == false)
	{
		return;
	}
	//Helper grid value containers
	var rowID = {0 : 'a',1 : 'b',2 : 'c',3 : 'd',4 : 'e',5 : 'f',6 : 'g',7 : 'h'};
	var colID = [1,2,3,4,5,6,7,8];
	//console.log(turnOrder);
	//Update player owned containers
	var tempOwned0 = [];
	var tempOwned1 = [];
	for(var i=0; i<grid.length; i++)
	{
		for(var j=0; j<grid[i].length; j++)
		{
			//console.log(grid[i][j]);
			if(grid[i][j] == "p1")
			{
				tempOwned0.push({row: i, col: j});
			}
			if(grid[i][j] == "p2")
			{
				tempOwned1.push({row: i, col: j});
			}
		}
	}
	p1o = tempOwned0;
	p2o = tempOwned1;
	updateInfoDisplay(p1o,p2o);
	updateGameDisplay(grid,gameSetup);
	//console.log(p1o.length);
	//console.log(p2o.length);
	//get available movelist 
	var movesList = gameInternal(gameSetup, grid, state, p1o, p2o);
	if(movesList.length ==0 && turnOrder <= grid.length*grid.length)
	{
		turnOrder++;
		movesList = gameInternal(gameSetup, grid, state, p1o, p2o);
		if(movesList.length ==0)
		{
			gameState = false;
			postGamefunctions(gameSetup,p1o,p2o);
		}
		else
		{
			makeClickableGrid(gameSetup, grid, state, p1o, p2o);
		}
		
	}
	if(gameSetup["mode"] == "ComputerEasy" && turnOrder%2 == 1)
	{
		computerMove(gameSetup, grid, movesList,p1o,p2o,state);
	}
	else if(gameSetup["mode"] == "ComputerHard" && turnOrder%2 == 1)
	{
		computerMove(gameSetup, grid, movesList,p1o,p2o,state);
	}
	else
	{
		var takeAction = function() {
		makeMove(gameSetup, grid, this.id, p1o, p2o, movesList, state);
		};
		//Create clickable events for each cell of the gameboard
		//only highlighted cells are interractable
		for(var i=0; i<grid.length; i++)
		{
			for(var j=0; j<grid.length; j++)
			{
				var cellID = rowID[i]+String(colID[j]);
				var elem = document.getElementById(cellID);
				if(grid[i][j] == "o")
				{
					elem.addEventListener("click", takeAction, false);
				}
			}
		}
	}
}

//Clicking on a highlighted cell will invoke this function
//this function essentially accepts that the chosen cell is the
//player's current action, then proceeds to flip the discs are that needed to be and
//setup the opponent's next available movesList and gamestate
//Checks and flips opponent's discs to player-side and recursively calls
//the next gamestate
function makeMove(gameSetup, grid, cellID, p1o, p2o, actions, state)
{
	var rowInvID = {'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7};
	var player = "";
	var opponent = "";
	if(turnOrder%2 == 0)
	{
		player = "p1";
		opponent = "p2";
	}
	else
	{
		player = "p2";
		opponent="p1";
	}
	var elem = document.getElementById(cellID);

	if(elem.getAttribute('bgColor') == "yellow")
	{
		
		elem.innerHTML = player;
		var rowIndx = parseInt(rowInvID[cellID[0]]);
		var colIndx = parseInt(cellID[1])-1;
		var newMove = {row: rowIndx, col: colIndx};
	
		elem.setAttribute("bgColor",gameSetup["color"]);
		grid[rowIndx][colIndx] = player;
		grid = searchAndFlip(grid, player, newMove, p1o, p2o);
		for(var i=0; i<grid.length; i++)
		{
			for(var j=0; j<grid[i].length; j++)
			{
				changeElemColor({row: i, col: j}, gameSetup["color"]);
			}
		}
		turnOrder += 1;
		//console.log("turn: "+turnOrder);
		makeClickableGrid(gameSetup, grid, state, p1o, p2o);
	}
}

//This will highlight a player's available 'clickable' actions
function changeElemColor(movesObj, color)
{
	var rowID = {0 : 'a',1 : 'b',2 : 'c',3 : 'd',4 : 'e',5 : 'f',6 : 'g',7 : 'h'};
	var colID = [1,2,3,4,5,6,7,8];
	var cellID = rowID[movesObj["row"]]+String(colID[movesObj["col"]]);
	var elem = document.getElementById(cellID);
	elem.setAttribute("bgColor", color);
}

//This function will check if the virtual game grid's individual space is owned by either player
//then will create an object (a circle) also known as Disc as an overlay to visually show that the intended player owns
//that specific square on the game board. If the square already has a Disc then the function will check
//and change the color of the disc if it belongs to the opposing player.
function updateGameDisplay(grid, gameSetup)
{
	//console.log("hello from updateDisplay");
	var rowID = {0 : 'a',1 : 'b',2 : 'c',3 : 'd',4 : 'e',5 : 'f',6 : 'g',7 : 'h'};
	var colID = [1,2,3,4,5,6,7,8];
	for(var i=0; i<grid.length; i++)
	{
		for(var j=0; j<grid[i].length; j++)
		{
			var elem = document.getElementById(rowID[i]+String(colID[j]));
			var discElem = document.getElementById("disc:"+elem.id);
			//console.log(discElem);
			if(discElem === null && grid[i][j] == "p1")
			{
				//console.log("Created new disc at: "+"("+i+","+j+")"+"for p1");
				var circle = document.createElement("div");
				circle.innerHTML = "o";
				circle.style.backgroundColor = gameSetup["p1c"];
				circle.setAttribute("class","circle");
				circle.setAttribute("id","disc:"+elem.id);
				elem.appendChild(circle);
			}
			if(discElem === null && grid[i][j] == "p2")
			{
				//console.log("Created new disc at: "+"("+i+","+j+")"+"for p2");
				var circle = document.createElement("div");
				circle.innerHTML = "o";
				circle.style.backgroundColor = gameSetup["p2c"];
				circle.setAttribute("class","circle");
				circle.setAttribute("id","disc:"+elem.id);
				elem.appendChild(circle);
			}
			if(grid[i][j] == "p1" && discElem != null)
			{
				//console.log("Flipped to p1: "+"("+i+","+j+")");
				discElem.style.backgroundColor = gameSetup["p1c"];
			}
			if(grid[i][j] == "p2" && discElem != null)
			{
				//console.log("Flipped to p1: "+"("+i+","+j+")");
				discElem.style.backgroundColor = gameSetup["p2c"];
			}
		}
	}
}

//This function initiallizes the game info display (where both players'
//user pics are displayed as well as current discs owned)
function initInfoDisplay(gameSetup)
{
	//Get player1 and player2 name and profile pictures
	var user = document.getElementById("username");
	if(sessionStorage.getItem('username') == null)
	{
		user.innerHTML = "Guest";
		var elem = document.getElementById("image0");
		elem.src = "ProfilePics/defaultpic.png";
	}
	else
	{
		user.innerHTML = String(sessionStorage.getItem('username'));
		requestUserProf(String(sessionStorage.getItem('username')));
	}
	var p2profile = document.getElementById("player2mode");
	if(gameSetup["mode"] == "PvP")
	{
		p2profile.innerHTML = String(sessionStorage.getItem('username'))+"'s Guest";
		var elem = document.getElementById("image1");
		elem.src = "ProfilePics/defaultpic.png";
	}
	else
	{
		p2profile.innerHTML = gameSetup["mode"];
		var elem = document.getElementById("image1");
		elem.src = "ProfilePics/computerProfile.jpg";
	}
	
}
//This function is called after each player has made their move, and will update the current Discs
//owned as well as displaying the next player's turn by highlighting their profile green
function updateInfoDisplay(p1o,p2o)
{
	document.getElementById("p1score").innerHTML = "Discs: "+String(p1o.length);
	document.getElementById("p2score").innerHTML = "Discs: "+String(p2o.length);
	if(turnOrder%2 == 0)
	{
		document.getElementById("player1").style.border = "2px solid green";
		document.getElementById("player2").style.border = "none";
	}
	else
	{
		document.getElementById("player2").style.border = "2px solid green";
		document.getElementById("player1").style.border = "none";
	}
}

/*======================================================================================================
computerMove is the main function that invokes the computer's turn.
ComputerEasy will take a random action by choosing a random index in the list of available moves
ComputerHard will request a couple heuristics:
-Greedy: calculates each available move's total discs that can be flipped and returns an arbitrary value
-Corner: Checks if the corners are occupied then calculates the manhattan distance from each available
move to the empty or computer owned corner then returns an arbitrary value
-EdgeSpace: checks and calculates if the available move is an edge and will return an arbitrary value that
is greater when the available move is an edgespace.
-AdjacentCorner: Checks if the available move is an adjacent space next to a corner space, this will return a negative arbitrary value to make the computer to NOT take the specific action. This is displayed as gameBoardPattern within the ComputerHard condition.

*/
function computerMove(gameSetup, grid, movesList, p1o, p2o,state)
{
	var rowID = {0 : 'a',1 : 'b',2 : 'c',3 : 'd',4 : 'e',5 : 'f',6 : 'g',7 : 'h'};
	var rowInvID = {'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7};
	var colID = [1,2,3,4,5,6,7,8];
	if(gameSetup["mode"] == "ComputerEasy")
	{
		setTimeout(function(){
			//console.log(movesList.length);
			var index = Math.floor(Math.random() * (movesList.length-1));
			//console.log(index);
			var cellID = rowID[movesList[index]["row"]]+String(colID[movesList[index]["col"]]);
			var elem = document.getElementById(cellID);
			//console.log(elem);
			elem.innerHTML = "p2";
			var rowIndx = parseInt(rowInvID[cellID[0]]);
			var colIndx = parseInt(cellID[1])-1;
			var newMove = {row: rowIndx, col: colIndx};
			grid[rowIndx][colIndx] = "p2";
			grid = searchAndFlip(grid, "p2", newMove, p1o, p2o);
			turnOrder += 1;
			//console.log("turn: "+turnOrder);
			makeClickableGrid(gameSetup, grid, state, p1o, p2o);
		}, 1000);
	}
	else if(gameSetup["mode"] =="ComputerHard")
	{
		console.log("computing heuristics for Hard AI");
		var gameBoardPattern = new Array(8);
		gameBoardPattern[0] = [20,-15,10,10,10,10,-15,20];
		gameBoardPattern[1] = [-15,-20,-6,0,0,-6,-20,-15];
		gameBoardPattern[2] = [10,-15,3,3,3,3,-15,10];
		gameBoardPattern[3] = [10,-10,2,-5,-5,2,-10,10];
		gameBoardPattern[4] = [10,-10,2,-5,-5,2,-10,10];
		gameBoardPattern[5] = [10,-15,3,3,3,3,-15,10];
		gameBoardPattern[6] = [-15,-20,-6,0,0,-6,-20,-15];
		gameBoardPattern[7] = [20,-15,10,10,10,10,-15,20];
		
		var greedy =  [];
		var corner = [];
		var isAnEdge = [];
		for(var i=0; i<movesList.length; i++)
		{
			//console.log("Finding Greedy and Corner Heuristics for: "+movesList[i]["row"]+", "+movesList[i]["col"]);
			greedy[i] = greedyHeuristic(grid,"p2",movesList[i],p1o,p2o);
			corner[i] = emptyCornerHeuristic(grid, movesList[i]);
			isAnEdge[i] = checkEdgeSpace(grid, movesList[i]);
		}
		
		var index = 0;
		var indexTotalScore = 0;
		for(var k=0; k<movesList.length; k++)
		{
			var tempScore = greedy[k] + corner[k] + isAnEdge[k] + gameBoardPattern[movesList[k]["row"]][movesList[k]["col"]];
			if(tempScore > indexTotalScore)
			{
				index = k;
				indexTotalScore = tempScore;
			}
		}
		
		setTimeout(function(){
			//console.log(movesList.length);
			//console.log(index);
			var cellID = rowID[movesList[index]["row"]]+String(colID[movesList[index]["col"]]);
			var elem = document.getElementById(cellID);
			//console.log(elem);
			elem.innerHTML = "p2";
			var rowIndx = parseInt(rowInvID[cellID[0]]);
			var colIndx = parseInt(cellID[1])-1;
			var newMove = {row: rowIndx, col: colIndx};
			grid[rowIndx][colIndx] = "p2";
			grid = searchAndFlip(grid, "p2", newMove, p1o, p2o);
			turnOrder += 1;
			//console.log("turn: "+turnOrder);
			makeClickableGrid(gameSetup, grid, state, p1o, p2o);
		}, 1000);
	}
	else
	{
		console.log("Nothing is happening");
	}
}

//Returns the number of Discs flipped by taking the action: startPos as an arbitrary value
function greedyHeuristic(grid, player, startPos, p1o, p2o)
{
	var accumulative = 0;
	accumulative += (gHSearch(grid, player, startPos, -1, 0, p1o, p2o));
	accumulative += (gHSearch(grid, player, startPos, -1, 1, p1o, p2o));
	accumulative += (gHSearch(grid, player, startPos, 0, 1, p1o, p2o));
	accumulative += (gHSearch(grid, player, startPos, 1, 1, p1o, p2o));
	accumulative += (gHSearch(grid, player, startPos, 1, 0, p1o, p2o));
	accumulative += (gHSearch(grid, player, startPos, 1, -1, p1o, p2o));
	accumulative += (gHSearch(grid, player, startPos, 0, -1, p1o, p2o));
	accumulative += (gHSearch(grid, player, startPos, -1, -1, p1o, p2o));
	return accumulative;
}


function gHSearch(grid, player, startPos, drow, dcol, p1o, p2o)
{
	var rowID = {0 : 'a',1 : 'b',2 : 'c',3 : 'd',4 : 'e',5 : 'f',6 : 'g',7 : 'h'};
	var colID = [1,2,3,4,5,6,7,8];
	//set counters for search
	var i = drow;
	var j = dcol;
	//set opponent
	var opponent = "p1";
	if(player == "p1")
		opponent = "p2";
	//set a temp position to monitor movement while searching
	//if i and j do not increase with respect to their drow/dcol
	//will loop forever, so if the temp = to the next start position
	//will break loop because search ends up as nothing to flip
	//temp cells is a container that has opponent discs in between player discs
	var tempPos = startPos
	var tempCells = [];
	while(startPos["row"]+i >=0 && startPos["row"]+i < grid.length && startPos["col"]+j >=0 && startPos["col"]+j < grid.length)
	{	
		if(tempPos == {row: startPos["row"]+i, col: startPos["col"]+j})
		{
			tempCells = [];
			break;	
		}
		else if(grid[startPos["row"]+i][startPos["col"]+j] == "o")
		{
			tempCells = [];
			break;
		}
		else if(grid[startPos["row"]+i][startPos["col"]+j] == opponent)
		{
			tempCells.push({row: startPos["row"]+i,col: startPos["col"]+j});
			i+=drow;
			j+=dcol;
		}
		else if(grid[startPos["row"]+i][startPos["col"]+j] == player)
		{
			return tempCells.length;
		}
		tempPos = {row: startPos["row"]+i,col: startPos["col"]+j};
	}
}

function checkEdgeSpace(grid, startPos)
{
	var edgePoints = 0;
	if(startPos["row"] == 0)
	{
		edgePoints =10;;
	}
	else if(startPos["row"] == grid.length-1)
	{
		edgePoints =10;
	}
	else if(startPos["col"] == 0)
	{
		edgePoints =10;
	}
	else if(startPos["col"] == grid.length-1)
	{
		edgePoints =10;
	}
	return edgePoints;
}

function emptyCornerHeuristic(grid, startPos)
{
	var corners = [{row: 0, col: 0},{row: 0, col: grid.length-1},{row: grid.length-1, col: grid.length-1},{row: grid.length-1, col: 0}];
	for(var i=0; i<corners.length; i++)
	{
		if(grid[corners[i]["row"]][corners[i]["col"]] != "o")
		{
			corners.splice(i,1);
		}
	}
	var distArray = [];
	for(var i=0; i<corners.length; i++)
	{
		var manhattanX = Math.abs(startPos["row"]-corners[i]["row"]);
		var manhattanY = Math.abs(startPos["col"]-corners[i]["col"]);
		distArray[i] = manhattanX+manhattanY;
	}
	return Math.min(distArray)*5;
}

//Counts the number of empty ("o") spaces in the game grid
function countEmptySquares(grid)
{
	var count = 0;
	for(var i=0; i<grid.length; i++)
	{
		for(var j=0; j<grid[i].length; j++)
		{
			if(grid[i][j] == "o")
			{
				count++;
			}
		}
	}
	if(count == 0)
	{
		return true;
	}
	else
	{
		return false;
	}
}

/*=======================================================================================================
These remaining functions are postGame request to save into database or request to display the user pictures
*/
function postGamefunctions(gameSetup,p1o,p2o)
{
	var winnerStr = "";
	var user = sessionStorage.getItem('username');
	if(p1o.length > p2o.length)
	{
		winnerStr = "You Won!";
		if(user == null)
		{
			window.alert(winnerStr+" Not a logged in user, game data will not be recorded.");
			window.location.href = 'http://localhost/mysite/projectReversi/projectReversiPlay.html';
		}
		else
		{
			if(window.confirm("Congrats "+user+" "+winnerStr+" would you like to save this game?"))
			{
				var time = document.getElementById("timer").innerHTML;
				requestGameSave(user, gameSetup["mode"], gameSetup["size"], p1o.length, p2o.length, winnerStr, time);
				window.location.href = 'http://localhost/mysite/projectReversi/projectReversiLogin.html';
			}
			else
			{
				window.location.href = 'http://localhost/mysite/projectReversi/projectReversiPlay.html';
			}
		}
	}
	else
	{
		winnerStr = "You Lost!";
		if(user == null)
		{
			window.alert(winnerStr+" Not a logged in user, game data will not be recorded.");
			window.location.href = 'http://localhost/mysite/projectReversi/projectReversiPlay.html';
		}
		else
		{
			if(window.confirm("Nice Try "+user+" "+winnerStr+" would you like to save this game?"))
			{
				var time = document.getElementById("timer").innerHTML;
				requestGameSave(user, gameSetup["mode"], gameSetup["size"], p1o.length, p2o.length, winnerStr, time);
				window.location.href = 'http://localhost/mysite/projectReversi/projectReversiLogin.html';
			}
			else
			{
				window.location.href = 'http://localhost/mysite/projectReversi/projectReversiPlay.html';
			}
		}
	}
}

function requestUserProf(name)
{
	var data = "user="+name;
	//console.log(data);
	var imgName ="";
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function()
	{
		if(httpRequest.readyState==4 && httpRequest.status==200)
		{
			imgName = JSON.parse(httpRequest.responseText);
			//console.log(imgName);
			if(imgName == "")
			{
				var elem = document.getElementById("image0");
				elem.src = "ProfilePics/defaultpic.png";
			}
			else
			{
				var elem = document.getElementById("image0");
				elem.src = "ProfilePics/"+imgName;
			}
		}
	}
	httpRequest.open("POST",'http://localhost/mysite/projectReversi/PHP/getUserPic.php',true);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.send(data);
}

function requestGameSave(name, mode, size, p1score, p2score, winnerStr, time)
{
	var data = JSON.stringify({
		'user': name,
		'mode': mode,
		'size': size,
		'p1score': p1score,
		'p2score': p2score,
		'status': winnerStr,
		'time': time
	});
	console.log(data);
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function()
	{
		if(httpRequest.readyState==4 && httpRequest.status==200)
		{
			console.log("you passed the httpRequest");
			console.log(httpRequest.responseText);
		}
	}
	httpRequest.open("POST",'http://localhost/mysite/projectReversi/PHP/prSaveGame.php',true);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.send(data);
	
}

