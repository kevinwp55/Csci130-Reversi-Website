Kevin Chan
Csci130: Web Development
Lecture: MW 1pm
Lab: Fri 3pm

Final Project: Project Reversi
This is my implementation, or attempt, at creating a web app that consists of a series of webpages that can play the game: Reversi (or Othello).
HTML Pages include:
-Home
-Login
  -Register (Can be found in login page)
  -User (Can only be accessed if logged in)
-How2Play
-Play
  -Game (Can only be accessed by filling out the game setup form from Play)
-Credits



WHAT TO DO:
Unzip and place the projectReversi folder in your 	C:\xampp\htdocs\mysite 		directory.
The CSS/JS/PHP functions will not work if not placed in designated directory.

HOW TO IMPORT THE DATABASE:
-Requires Xampp Controller actively running Apache and MySQL.
-Open PHPMyAdmin on the xammp controller (the Admin button corresponding to MySQL)
-Create a Database called "csci130" (no quotes)
-Go to the Import Tab in the csci130 database
-Import the .sql file from the db folder
-My Xampp/PHPMyAdmin profile should be user: root, password: '' (Bad practice I know, but simplest way I can get the backend to work)

You can now access (hopefully) the information to display on the HTML pages. These pages include:
-projectReversiLogin.html
-projectReversiRegister.html
-projectReversiUser.html
-projectReversiGame.html



OTHER INFORMATION:
The Folders include:
-ProfilePics: a directory which saves all user profile pictures and is referenced back to the html page via JS script
-PHP: contains the files that respectively requests information from the database and returns data needed to fullfil the JS script or form
that is being requested.
-JS: scripts that runs the html page which also includes onload requests to the database to get things like user profile pictures, etc. Also
includes the construction of the game board as well as handling the gameplay mechanics of Reversi. Which also includes the AI scripts required
for the project (easy - random generated actions from available actions. hard - requires 4 heuristics: greedy,corners,edges,adjacent spaces).
-db: contains the database (csci130) and the 2 tables: prRegUsers (registered users) and gameData.
-CSS: contains the beautification of each html pag.

1. The JS files are heavily commented and explain the functionalities of each method.
2. The PHP files are NOT commented so I'll explain here:
	a. getUserPic.php is requested by an onload function from: prUserDisplay.js (linked to projectReversiUser.html) to request a logged-in user's custom profile picture.
		If there is no reference within the database, the user's profile picture is set to a default picture in ProfilePics folder.
	b. prConnect.php is a basic link between the database and other php files. Every php file includes this file.
	c. prLogin.php is a near copy of the reference document provided by Csci130 class instructor with a few additions of creating a cookie to
		demonstrate the creation of a cookie and starting a sessionStorage to display username in the HTML page.
	d. prReg.php is also a near copy of the reference document provided by Csci130 class instructor with the addition of checking both the 2 email
		entries and passwords in the form. Also gets redirected back to the Login page.
	e. prRequestGameData.php is referenced onload by prUserDisplay.js (linked to projectReversiUser.html) to request an array of games played data.
		If there are no games played, the request still functions, but the return is empty and the JS file check does NOT push any "undefined" values
		into the GameData Table
	f. saveImg.php is requested by projectReversiUser.html by a form that asks the user if they want to change the user's profile picture. If the request
		is made, then the php file saves a copy of the img and writes a link into the database.

3. The CSS files are quite simple since there are no dynamic or any complex customization on the html page.
	a. homeCSS.css is shared by all HTML pages that customizes the "navigation bar" so that they are clickable and navigates to their respective pages.
	b. gameCSS.css is linked to projectReversiGame.html which helps in displaying the game board.
	c. userInfo.css is linked to projectReversiUser.html to help in displaying the game played data.