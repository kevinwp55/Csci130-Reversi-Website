//Get Cookie
var x = document.cookie;
//console.log(x);
//Convert Cookie's value (username) to a userID
var clearName = getCookieName(x);
//console.log(clearName);

//Display User's username for account profile
var identity = document.getElementById("uname");
identity.innerHTML = clearName;
sessionStorage.setItem('username', clearName);
document.getElementById("username").value = clearName;

var gameData = [];
//Get the Cookie if available
function getCookieName(intendedCookie)
{
	var name = "";
	var index = 0;
	for(var i=0; i < intendedCookie.length; i++)
	{
		if(intendedCookie[i] == "=")
		{
			index = i;
		}
	}
	for(var j=index+1; j<intendedCookie.length; j++)
	{
		name +=String(intendedCookie[j]);
	}
	return name;
}

//Delete any cookies currently
//Clear/Remove the session storage
//Will redirect to login page
function logOut()
{
	console.log("Deleting Cookie");
	var cookies = document.cookie.split(";");
	for(var i=0; i<cookies.length; i++)
	{
		var cookie = cookies[i];
		var cookieID = cookie.indexOf("=");
		var name = cookieID > -1 ? cookie.substr(0,cookieID) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1969 00:00:00 GMT";
	}
	
	var x = document.cookie;
	x = "cookiename=; expires=Thu, 01 Jan 1969 00:00:00 GMT; path=/";
	sessionStorage.clear();
	//console.log(sessionStorage.getItem('username'));
	window.location.href = 'http://localhost/mysite/projectReversi/projectReversiLogin.html';
}

//Request the User Profile Picture if available
//If cannot get the Profile Picture reference from database,
//sets the default user profile pic
function requestUserProf()
{
	var data = "user="+clearName;
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function()
	{
		if(httpRequest.readyState==4 && httpRequest.status==200)
		{
			var imgName = JSON.parse(httpRequest.responseText);
			if(imgName == "")
			{
				var elem = document.getElementById("image");
				elem.src = "ProfilePics/defaultpic.png";
			}
			else
			{
				var elem = document.getElementById("image");
				elem.src = "ProfilePics/"+imgName;
			}
		}
	}
	httpRequest.open("POST",'http://localhost/mysite/projectReversi/PHP/getUserPic.php',true);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.send(data);
}

//If the sessionStorage user has a value (theoretically the person that has logged in)
//Sends the request to obtain that user's game data
if(sessionStorage.getItem('username') != null)
{
	//console.log(clearName);
	var data = "user="+clearName;
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function()
	{
		if(httpRequest.readyState==4 && httpRequest.status==200)
		{
			if(eval(httpRequest.response) == "No such User exists. ")
			{
				return false;
			}
			else
			{
				console.log(eval(httpRequest.response));
				gameData = eval(httpRequest.response);
				createGameDataTable(eval(httpRequest.response));
				displayRatio();
				displayAvgTime();
			}
			
		}
	}
	httpRequest.open("POST",'http://localhost/mysite/projectReversi/PHP/prRequestGameData.php',true);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.send(data);
}

//General function to create the game info table
function createGameDataTable(data)
{
	if(data.length > 0)
	{
		var infoElem = document.getElementById("insertInfo");
		for(var i=0; i<data.length; i++)
		{
			var tRow = document.createElement("tr");
			var elem0 = document.createElement("td");
			elem0.innerHTML = data[i].gameMode;
			tRow.appendChild(elem0);
			var elem1 = document.createElement("td");
			elem1.innerHTML = data[i].gameSize;
			tRow.appendChild(elem1);
			var elem2 = document.createElement("td")
			elem2.innerHTML = data[i].p1Discs;
			tRow.appendChild(elem2);
			var elem3 = document.createElement("td")
			elem3.innerHTML = data[i].p2Discs;
			tRow.appendChild(elem3);
			var elem4 = document.createElement("td")
			elem4.innerHTML = data[i]["status"];
			tRow.appendChild(elem4);
			var elem5 = document.createElement("td")
			elem5.innerHTML = data[i].time;
			tRow.appendChild(elem5);
			var elem6 = document.createElement("td")
			elem6.innerHTML = data[i].date;
			tRow.appendChild(elem6);
			infoElem.appendChild(tRow);
		}
	}
}

//The onclick function that reorders the table by ascending "Your Points"
function orderByPoints()
{
	document.getElementById("score").style.backgroundColor = "gray";
	document.getElementById("time").style.backgroundColor = "black";
	document.getElementById("recent").style.backgroundColor = "black";
	var sortedData = gameData.sort((a,b) => (parseInt(a.p1Discs) < parseInt(b.p1Discs)) ? 1:-1);
	//console.log(sortedData);
	var parent = document.getElementById("insertInfo");
	while(parent.hasChildNodes())
	{
		parent.removeChild(parent.firstChild);
	}
	createGameDataTable(sortedData);
	
}

//The onclick function that reorders the table by fastest time played
function orderByTime()
{
	document.getElementById("score").style.backgroundColor = "black";
	document.getElementById("time").style.backgroundColor = "gray";
	document.getElementById("recent").style.backgroundColor = "black";
	var sortedData = gameData.sort((a,b) => (a.time > b.time) ? 1:-1);
	//console.log(sortedData);
	var parent = document.getElementById("insertInfo");
	while(parent.hasChildNodes())
	{
		parent.removeChild(parent.firstChild);
	}
	createGameDataTable(sortedData);
}

//The onclick function that reorders the table by the most recent game played
function orderByRecent()
{
	document.getElementById("score").style.backgroundColor = "black";
	document.getElementById("time").style.backgroundColor = "black";
	document.getElementById("recent").style.backgroundColor = "gray";
	var sortedData = gameData.sort((a,b) => (a.date < b.date) ? 1:-1);
	var parent = document.getElementById("insertInfo");
	while(parent.hasChildNodes())
	{
		parent.removeChild(parent.firstChild);
	}
	createGameDataTable(sortedData);
}

//Takes in the game data object and records the Win-to-Lose ratio
function displayRatio()
{
	if(gameData.length > 0)
	{
		var ratioDisplay = document.getElementById("ratio");
		var wins = 0;
		var losses = 0;
		for(var i=0; i<gameData.length; i++)
		{
			if(gameData[i]["status"] == "You Won!")
			{
				wins++;
			}
			if(gameData[i]["status"] == "You Lost!")
			{
				losses++;
			}
		}
		if(losses == 0)
		{
			losses = 1;
		}
		ratioDisplay.innerHTML = "W/L Ratio: "+ (wins/losses).toPrecision(3);
	}
}

//Takes in the game data and displays the average time per game played
function displayAvgTime()
{
	if(gameData.length > 0)
	{
		var totalMinutes = 0;
		var totalSeconds = 0;
		var timeDisplay = document.getElementById("avgTime");
		for(var i=0; i<gameData.length; i++)
		{
			var time = gameData[i].time;
			var minutes = time.split(':')[0];
			var seconds = time.split(':')[1];
			//console.log("minutes: "+minutes);
			//console.log("seconds: "+seconds);
			totalMinutes += parseInt(minutes);
			totalSeconds += parseInt(seconds);
		}
		var totalTime = totalMinutes*60+totalSeconds;
		var avgTotalTime = totalTime/gameData.length;
		var newMinutes = Math.floor(avgTotalTime/60);
		var newSeconds = Math.floor(avgTotalTime-newMinutes*60);
		if(newSeconds < 10)
		{
			timeDisplay.innerHTML = "Avg Time: "+newMinutes+":0"+newSeconds;
		}
		else
		{
			timeDisplay.innerHTML = "Avg Time: "+newMinutes+":"+newSeconds;
		}
		
	}
}