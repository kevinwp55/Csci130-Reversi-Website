<?php
require_once 'prConnect.php';

//Get information from form
$username = '';
$password = '';
$email = '';
$username_err = '';
$password_err = '';
$email_err = '';
$regStatus = true;

//Proccess form data, check for duplicate username
if($_SERVER["REQUEST_METHOD"] == "POST")
{
	//Validate username
	if(empty(trim($_POST["uName"])))
	{
		$username_err = "Invalid Username: EMPTY ";
		$regStatus = false;
	}
	else
	{
		//This is where the reference 'register_mysql.php' diverges.
		//Need to check if identical username exists, else create new user
		$sql = "SELECT * FROM prRegUsers WHERE username = ?";
		
		if($stmt = mysqli_prepare($link, $sql))
		{
			mysqli_stmt_bind_param($stmt, "s", $param_username);
			$param_username = trim($_POST["uName"]);
			if(mysqli_stmt_execute($stmt))
			{
				mysqli_stmt_store_result($stmt);
				if(mysqli_stmt_num_rows($stmt) > 0)
				{
					$username_err = "Username already taken. ";
					$regStatus = false;
				}
				else
				{
					$username = $_POST["uName"];
				}
			}
			else
			{
				echo "Error in talking to db...<br>";
				$regStatus = false;
			}
			mysqli_stmt_close($stmt);
		}
	}
	
	//Check if passwords are entered correctly and validate the password
	if(strlen(trim($_POST['pWord0'])) < 6){
        $password_err = "Password must have atleast 6 characters.";
    }
	else if(trim($_POST['pWord0']) != trim($_POST['pWord1']))
	{
		$password_err = "The passwords DO NOT match! ";
		$regStatus = false;
	}
	else
	{
        $password = trim($_POST['pWord0']);
    }
	
	//Confirm that the emails match AND are valid emails
	if(validateEmail(trim($_POST['email0'])) && validateEmail(trim($_POST['email1'])))
	{
		if(trim($_POST['email0']) == trim($_POST['email1']))
		{
			//Check if email exists in db
			$sql = "SELECT * FROM prRegUsers WHERE email = ?";
			if($stmt = mysqli_prepare($link, $sql))
			{
				mysqli_stmt_bind_param($stmt, "s", $param_email);
				$param_email = trim($_POST['email0']);
				if(mysqli_stmt_execute($stmt))
				{
					mysqli_stmt_store_result($stmt);
					if(mysqli_stmt_num_rows($stmt) > 0)
					{
						$username_err = "Email already taken. ";
						$regStatus = false;
					}
					else
					{
						$email = trim($_POST['email0']);
					}
				}
				else
				{
					echo "Error in talking to db...<br>";
					$regStatus = false;
				}
				mysqli_stmt_close($stmt);
			}
		}
		else
		{
			$email_err = "The emails DO NOT match! ";
			$regStatus = false;
		}
	}
	else
	{
		$email_err = "Invalid email... ";
		$regStatus = false;
	}
	
	//Finally, create the user
	if(empty($username_err) && empty($password_err) && empty($email_err))
	{
		$sql = "INSERT INTO prRegUsers (username, email, password) VALUES (?,?,?)";
		if($stmt = mysqli_prepare($link, $sql))
		{
			mysqli_stmt_bind_param($stmt, "sss", $param_username, $param_email, $param_password);
			
			$param_username = $username;
			$param_password = password_hash($password, PASSWORD_DEFAULT);
			$param_email = $email;
			
			if(mysqli_stmt_execute($stmt))
			{
				$regStatus = true;
			}
			else
			{
				echo "Unable to execute user creation <br>";
				$regStatus = false;
			}
			mysqli_stmt_close($stmt);
		}
		else
		{
			echo "Could not talk to server <br>";
			echo mysqli_error($link);
			$regStatus = false;
		}
	}
	mysqli_close($link);
}

function validateEmail($someEmail)
{
	if (filter_var($someEmail, FILTER_VALIDATE_EMAIL)) 
	{
		return TRUE;
	}
	else 
	{
		return FALSE;
	}
}

$regResponse = "";
if($regStatus)
{
	$regResponse = "Register Successful!";
}
else
{
	$regResponse = "Register Failed: ". $username_err . $password_err . $email_err;
}
?>

<html>
<head></head>
<body>
<script>
	confirm("<?php echo $regResponse; ?>. Redirecting to Login");
	window.location.href = 'http://localhost/mysite/projectReversi/projectReversiLogin.html';
</script>
</body>
</html>