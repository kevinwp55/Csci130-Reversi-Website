function buildGameBoard()
{
	//Extract from html form: game mode, board size, board color, player 1 color, player 2 color
	var gameSetup = {
		"mode" : location.search.slice(1).split("&")[0].split("=")[1],
		"size" : parseInt(location.search.slice(1).split("&")[1].split("=")[1]),
		"color": location.search.slice(1).split("&")[2].split("=")[1],
		"p1c" : location.search.slice(1).split("&")[3].split("=")[1],
		"p2c" : location.search.slice(1).split("&")[4].split("=")[1]
	};
	//console.log(gameSetup);
	var playable = buildGrid(gameSetup["size"]);
	//printGrid(playable);
	
	var rowID = {
		0 : 'a',
		1 : 'b',
		2 : 'c',
		3 : 'd',
		4 : 'e',
		5 : 'f',
		6 : 'g',
		7 : 'h'
	};
	var colId = [1,2,3,4,5,6,7,8];
	//create the visual representation of game board onto html page
	//Grab the div element 
	var gameBoard = document.getElementById("Game");
	
	//Create the Row ID as a single column table
	var tableRowIndex = document.createElement("table");
	tableRowIndex.setAttribute("id", "tri");
	var triTh = document.createElement("th");
	var triTbody = document.createElement("tbody");
	var triTR = document.createElement("tr");
	var triThead = document.createElement("th");
	triThead.setAttribute("id","rowcol");
	triThead.innerHTML = "0";
	triTR.appendChild(triThead);
	tableRowIndex.appendChild(triTR);
	for(var h=0; h<gameSetup["size"]; h++)
	{
		var triInnerTbody = document.createElement("tr");
		triTD = document.createElement("td");
		triTD.setAttribute("id","rowID");
		triTD.innerHTML = rowID[h];
		triInnerTbody.appendChild(triTD);
		triTbody.appendChild(triInnerTbody);
	}
	tableRowIndex.appendChild(triTbody);
	gameBoard.appendChild(tableRowIndex);
	
	//Create the visual table with Column ID
	var table = document.createElement("table");
	table.setAttribute("id","gameBoard");
	var thead = document.createElement("thead");
	var tbody = document.createElement("tbody");
	var thtr = document.createElement("tr");
	//Create ColumnID
	for(var i=0; i<gameSetup["size"]; i++)
	{
		var theadTh = document.createElement("th");
		theadTh.setAttribute("class","columnID");
		theadTh.innerHTML = colId[i];
		thtr.appendChild(theadTh);
	}
	thead.appendChild(thtr);
	table.appendChild(thead);
	//Create body of game board
	for(var j=0; j<gameSetup["size"]; j++)
	{
		var tbodyTr = document.createElement("tr");
		for(k=0; k<gameSetup["size"]; k++)
		{
			var tbodyTd = document.createElement("td");
			tbodyTd.innerHTML = playable[j][k];
			if(playable[j][k] == "p1")
			{
				var circle = document.createElement("div");
				circle.innerHTML = "o";
				circle.style.backgroundColor = gameSetup["p1c"];
				circle.setAttribute("class","circle");
				circle.setAttribute("id","disc:"+rowID[j]+String(colId[k]));
				tbodyTd.appendChild(circle);
			}
			if(playable[j][k] == "p2")
			{
				var circle = document.createElement("div");
				circle.innerHTML = "o";
				circle.style.backgroundColor = gameSetup["p2c"];
				circle.setAttribute("class","circle");
				circle.setAttribute("id","disc:"+rowID[j]+String(colId[k]));
				tbodyTd.appendChild(circle);
			}
			tbodyTd.setAttribute("id", rowID[j]+String(colId[k]));
			tbodyTd.setAttribute("bgColor",gameSetup["color"]);
			//console.log(rowID[j]+String(colId[k]));
			tbodyTr.appendChild(tbodyTd);
		}
		tbody.appendChild(tbodyTr);
	}
	table.appendChild(tbody);
	gameBoard.appendChild(table);
}

//creates the conceptual game board
function buildGrid(gridSize)
{
	var grid = [];
	for(var i=0; i<gridSize; i++)
	{
		grid[i] = [];
		for(var j=0; j<gridSize; j++)
		{
			grid[i][j] = "o";
		}
	}
	var halfSize = Math.floor(gridSize/2)-1;
	//console.log("size: "+halfSize);
	grid[halfSize][halfSize] = "p1";
	grid[halfSize][halfSize+1] = "p2";
	grid[halfSize+1][halfSize] = "p2";
	grid[halfSize+1][halfSize+1] = "p1";
	return grid;
}

//development purposes
function printGrid(grid)
{
	for(var i=0; i<grid.length; i++)
	{
		console.log(grid[i]);
	}
}