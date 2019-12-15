<?php
require_once 'prConnect.php';
if(isset($_FILES["fileup"]["name"]))
{
	//From uploadfile.php with slight changes
	$profpic = basename($_FILES["fileup"]["name"]);
	$target_dir = "C:/xampp/htdocs/mysite/projectReversi/ProfilePics/";
	$saveInDir = $target_dir.$profpic;
	echo "<p>Upload information</p><ul>";
	echo  "<li>Target folder for the upload: ". $saveInDir . "</li>";
	echo  "<li>File name :". $profpic . "</li>";
	
	$uploadOK=false;
	$imgType = pathinfo($profpic,PATHINFO_EXTENSION);
	$upResponse = "";
	
	if(isset($_POST["submit"]))
	{
		$check = getimagesize($_FILES["fileup"]["tmp_name"]);
		if($check !== false)
		{
			$uploadOK = true;
		}
		else
		{
			$uploadOK = false;
			$upResponse = "False Img file uploaded";
		}
	}
	
	//verify if img exists
	if(file_exists($saveInDir))
	{
		$upResponse = "Image exists, change image and reference in db";
		$uploadOK = false;
	}
	//make sure img size is relatively small
	if($_FILES["fileup"]["size"] > 500000)
	{
		$upResponse = "Img too large";
		$uploadOK = false;
	}
	//make sure file is not malicious
	if($imgType != "jpg" && $imgType != "png")
	{
		$upResponse = "Only .jpg and .png Img's can be uploaded";
		$uploadOK = false;
	}
	//Save directory to db
	//setup mysql query to reference path to img directory
	if(isset($_POST["username"]))
	{
		$username = $_POST["username"];
		$sql = "UPDATE prRegUsers SET userPic='$profpic' WHERE username='$username'";
		if($link->query($sql) === TRUE)
		{
			echo "Img Directory Saved";
		}
		else
		{
			echo "Connection Error".$link->error;
		}
		//Upload file to directory after all checks are OK
		if($uploadOK)
		{
			if(move_uploaded_file($_FILES["fileup"]["tmp_name"], $saveInDir))
			{
				chmod($saveInDir,0755);
				$upResponse = $profpic." has been saved as your Profile Picture";
			}
		}
	}
	else
	{
		$upResponse = "User NOT defined. ";
	}
}
?>
<html>
<head></head>
<body>
<script>
	confirm("<?php echo $upResponse; ?>. Redirecting to User Profile");
	window.location.href = 'http://localhost/mysite/projectReversi/projectReversiUser.html';
</script>
</body>
</html>