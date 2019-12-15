<?php
require_once 'prConnect.php';

$username = '';
$password = '';
$login_err = '';

if($_SERVER["REQUEST_METHOD"] == "POST")
{
	if (!preg_match("/^[a-zA-Z0-9]*$/",$_POST["uName"])) 
	{
		$login_err = "Username: Only letters and white space allowed"; 
	}
	else
	{
		$username = trim($_POST["uName"]);
	}
	
	if (!preg_match("/^[a-zA-Z0-9 ]*$/",$_POST["pWord"])) 
	{
		$login_err = "Password: Only letters and white space allowed"; 
	}
	else
	{
		$password = trim($_POST["pWord"]);
	}
	
	if(empty($login_err))
	{
		$sql = "SELECT username, password FROM prRegisteredUsers WHERE username = ?";
		if($stmt = mysqli_prepare($link, $sql))
		{
			mysqli_stmt_bind_param($stmt, "s", $param_username);
			$param_username = $username;
			if(mysqli_stmt_execute($stmt))
			{
				mysqli_stmt_store_result($stmt);
				if(mysqli_stmt_num_rows($stmt) == 1)
				{
					mysqli_stmt_bind_result($stmt, $username, $hashed_password);
					if(mysqli_stmt_fetch($stmt))
					{
						if(password_verify($password, $hashed_password))
						{
							session_start();
							$_SESSION['username'] = $username;
						}
						else
						{
							$login_err = "Incorrect password";
						}
					}
					mysqli_stmt_close($stmt);
				}
				else
				{
					$login_err = "Not a valid Username";
				}
			}
			else
			{
				$login_err = "Could not communicate with Server";
			}
			
		}
	}
	mysqli_close($link);
}

if(empty($login_err))
{
	setcookie("username", $username, time() + (86400 * 30),"/");
	header("Location: http://localhost/mysite/projectReversi/projectReversiUser.html");
}
else
{
	echo $login_err;
	header("Location: http://localhost/mysite/projectReversi/projectReversiLogin.html");
}

?>