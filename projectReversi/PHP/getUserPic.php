<?php
require_once 'prConnect.php';
if($_SERVER["REQUEST_METHOD"] == "POST")
{
	$pic_error = "";
	$response = "";
	$dataName = "";
	if(array_key_exists('user', $_POST))
	{
		$dataName=$_POST['user'];
	}
	else
	{
		$pic_error = "could not retrieve username. ";
	}
	if(empty($dataName))
	{
		$pic_error = "get function data is empty. ";
	}
	else
	{
		$sql = "SELECT userPic FROM prRegUsers WHERE username='$dataName'";
		$result = mysqli_query($link, $sql);
		$row = mysqli_fetch_array($result,MYSQLI_ASSOC);
		$count = mysqli_num_rows($result);
		if($count>0)
		{
			$response = $row["userPic"];
		}
		else
		{
			$pic_error = $pic_error."No such User exists. ";
		}
	}
	
	if($pic_error != "")
	{
		$response = "Error: ".$pic_error;
		echo json_encode($response);
	}
	else
	{
		echo json_encode($response);
	}
		
}