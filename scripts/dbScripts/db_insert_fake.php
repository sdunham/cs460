<?php
/**
 * This script generates between 0 and 15 random incidents and inserts them into the project's MySQL database.
 * For each incident, a random time, type, latitude, and longitude is chosen. Once the appropriate records
 * have been inserted, the script sends an email with details for each record which was created.
 */

$num_records = rand(0,15); //Number of records to create today
$cur_date = date("Y-m-d"); //Today's date, to be used in the resulting email subject line
if($num_records > 0){
	//Open connection to MySQL database
	$mysqli = new mysqli("localhost", "sdunham_cs460", "G00dluck", "sdunham_cs460");
	if ($mysqli->connect_errno) {
		//Return error message if connection fails
		echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error . "<br />";
	}
	else{
		//Return successful connection message otherwise
		echo "Successfully connected to MySQL: " . $mysqli->host_info . "<br />";
	}
	//Prepare to generate random records
	$lat_prefix = "47"; //All campus location latitudes begin with this
	$long_prefix = "-122"; //All campus location longitudes begin with this
	echo "Creating " . $num_records . " records!<br />";
	$email_message = "Creating " . $num_records . " records!\n"; //Begin creating string for email message
	for($i = 0; $i < $num_records; $i++){
		$hour = rand(0,23); //Hour this incident occured, 24-hour format
		$minute = rand(0,59); //Minute this incident occured
		$type = rand(1,14); //Incident type number, to be used by assignType function
		$type = assignType($type);//Replace type number with correct string
		$latitude = $lat_prefix . "." . mt_rand(257461,265470); //All campus location latitudes are between these two numbers
		$longitude = $long_prefix . "." . mt_rand(477753,484105); //All campus location longitudes are between these two numbers
		if (!$mysqli->query("INSERT INTO incidents_fake(added,id,date,time,type,location,latitude,longitude) VALUES(DEFAULT,DEFAULT,CURRENT_DATE,'" . $hour . ":" . $minute . ":00','" . $type . "',DEFAULT," . $latitude . "," . $longitude .");")) {
			//Return an error message if this query fails
			echo "Record insertion failed: (" . $mysqli->errno . ") " . $mysqli->error . "<br />";
			$email_message = $email_message . "Record insertion failed: (" . $mysqli->errno . ") " . $mysqli->error . "\n"; //Add error to email string
		}
		else{
			//Return success message otherwise
			echo "Inserted hour=" . $hour . ", minute=" . $minute . ", type=" . $type . ", latitude=" . $latitude . ", and longitude=" . $longitude . "<br />";
			$email_message = $email_message . "Inserted hour=" . $hour . ", minute=" . $minute . ", type=" . $type . ", latitude=" . $latitude . ", and longitude=" . $longitude . "\n"; //Add generated records to email string
		}
	}
	//Close the connection to the database
	mysqli_close($mysqli);
	//Send results to email
	$email = mail("dunham.scott@gmail.com","Fake Incidents Created on " . $cur_date,$email_message);
}
else{
	echo "No records to create today!";
	$email = mail("dunham.scott@gmail.com","No Fake Incidents Created on " . $cur_date,"");
}

//Assigns an incident type based on the number provided.
function assignType($num){
	switch ($num) {
		case 1:
			$ret = "Aggravated Assault";
			break;
		case 2:
			$ret = "Burglary";
			break;
		case 3:
			$ret = "Murder / Non-Negligent Manslaughter";
			break;
		case 4:
			$ret = "Negligent Manslaughter";
			break;
		case 5:
			$ret = "Motor Vehicle Theft";
			break;
		case 6:
			$ret = "Robbery";
			break;
		case 7:
			$ret = "Sex Offense - Non-Forcible";
			break;
		case 8:
			$ret = "Sex Offense - Forcible";
			break;
		case 9:
			$ret = "Liquor Law Violations";
			break;
		case 10:
			$ret = "Drug Abuse Violations";
			break;
		case 11:
			$ret = "Weapon Violations";
			break;
		case 12:
			$ret = "Theft";
			break;
		case 13:
			$ret = "Attempted Crime";
			break;
		case 14:
			$ret = "Vandalism";
			break;
		
	}
	return strtoupper($ret); //Real incident types are upper case. Return upper case version of fake type to be consistent
}
?>