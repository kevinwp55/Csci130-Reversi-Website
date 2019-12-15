<?php
require_once 'prConnect.php';
if($_SERVER["REQUEST_METHOD"] == "POST")
{
	$gameDataError = "";
	$response = "";
	$dataName = "";
	$response = [];
	if(array_key_exists('user', $_POST))
	{
		$dataName=$_POST['user'];
	}
	else
	{
		$gameDataError = "could not retrieve game data. ";
	}
	if(empty($dataName))
	{
		$gameDataError = "get function data is empty. ";
	}
	else
	{
		$sql = "SELECT gameMode,gameSize,p1Discs,p2Discs,status,time,date FROM gameData WHERE username='$dataName'";
		$result = mysqli_query($link, $sql);
		while($row = mysqli_fetch_array($result,MYSQLI_ASSOC))
		{
			array_push($response, $row);
		}
		if(sizeof($response)>0)
		{
			$gameDataError = "";
		}
		else
		{
			$gameDataError = $gameDataError."No such User exists. ";
		}
	}
	
	if($gameDataError != "")
	{
		$response[0] = $gameDataError;
		echo json_encode($response);
	}
	else
	{
		echo json_encode($response);
	}
		
}

?>