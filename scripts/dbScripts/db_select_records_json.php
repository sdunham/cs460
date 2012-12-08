<?php
//Open connection to MySQL database
$mysqli = new mysqli("localhost", "sdunham_cs460", "G00dluck", "sdunham_cs460");
if ($mysqli->connect_errno) {
	//Return error message if connection fails
	header("HTTP/1.1 559 Error connecting to database");
	exit();
}

//Declare empty array to hold WHERE clause statements
$whereArr = array();
//Generate WHERE clause statements based on user input, insert them into array
if(!empty($_POST["beginDate"])){
	$whereArr["beginDate"] = "date >= '" . $_POST["beginDate"] . "'";
}
if(!empty($_POST["endDate"])){
	$whereArr["endDate"] = "date <= '" . $_POST["endDate"] . "'";
}
if(!empty($_POST["beginTime"])){
	$whereArr["beginTime"] = "time >= '" . $_POST["beginTime"] . ":00'";
}
if(!empty($_POST["endTime"])){
	$whereArr["endTime"] = "time <= '" . $_POST["endTime"] . ":00'";
}
if(!empty($_POST["type"])){
	$typeVals = implode(",",$_POST["type"]);
	$whereArr["type"] = "type IN (" . $typeVals . ")";
}

//Empty string to hold the WHERE clause to be used in this SQL statement
$where = "";
//If any WHERE clause statements were generated, concatenate them into a single WHERE clause
if(!empty($whereArr)){
	$where = "WHERE";
	foreach($whereArr as $value){
		$where = $where . " " . $value . " AND";
	}
	$where = substr($where,0,-3); //Remove trailing "AND" from the string
}

//Determine the name of the table to be queried, based on user input
$tableName = "incidents_" . $_POST["data"];

//Assemble SQL SELECT statement, including user-specified WHERE clause and table name
$sql = "SELECT * FROM " . $tableName . " " . $where . "ORDER BY date DESC";

if (!$res = $mysqli->query($sql)) {
	//Return an error message if the query failed
	header("HTTP/1.1 559 Error executing specified query");
	exit();
}
else{
	//Generate a JSON file containing the resulting data
	$json = array();
	
	//The table containing the real data includes a location description, so the table will include a column to hold this data
	if($_POST["data"] == "real"){
		while($row = $res->fetch_assoc()){
			$json["incidents"][] = $row;
		}
	}
	//The table containing the fake data doesn't include a location description, so the table won't display one
	else{
		while($row = $res->fetch_assoc()){
			$json["incidents"][] = $row;
		}
	}
	
	//Free memory associated with the query results
	$res->free();
}

//Close the connection to the database
mysqli_close($mysqli);

//Return the JSON object
header("Content-Type: application/json");
echo json_encode($json);

?>