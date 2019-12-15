<?php
require_once 'prConnect.php';
$data = file_get_contents("php://input");

$username = '';
$mode = '';
$size = 0;
$p1score = 0;
$p2score = 0;
$status = '';
$time = '';
date_default_timezone_set('America/Los_Angeles');
$date = date('m-d-Y H:i:s');
$response = "";

	$data =  json_decode($data,true);
	$username = $data["user"];
	$mode = $data["mode"];
	$size = $data["size"];
	$p1score = $data["p1score"];
	$p2score = $data["p2score"];
	$status = $data["status"];
	$time = $data["time"];

$sql = "INSERT INTO gameData (username, gameMode, gameSize, p1Discs, p2Discs, status, time, date) VALUES (?,?,?,?,?,?,?,?)";
if($stmt = mysqli_prepare($link, $sql))
{
	mysqli_stmt_bind_param($stmt, "ssiiisss", $param_username, $param_mode, $param_size, $param_p1score, $param_p2score, $param_status, $param_time, $param_date);
			
	$param_username = $username;
	$param_mode = $mode;
	$param_size = $size;
	$param_p1score = $p1score;
	$param_p2score = $p2score;
	$param_status = $status;
	$param_time = $time;
	$param_date = $date;
	if(mysqli_stmt_execute($stmt))
	{
		$response = "Game saved!";
	}
	else
	{
		$response = "Could not save!";
	}
	mysqli_stmt_close($stmt);
}
else
{
	echo "Could not talk to server <br>";
	echo mysqli_error($link);
}
mysqli_close($link);
	
echo json_encode($response);

?>