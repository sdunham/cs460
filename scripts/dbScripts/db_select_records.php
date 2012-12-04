<?php
echo "<p><a href='http://dnhmsctt.com/cs460/'>Run another query!</a></p>";

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
	$whereArr["beginTime"] = "time >= '" . $_POST["beginTime"] . "00'";
}
if(!empty($_POST["endTime"])){
	$whereArr["endTime"] = "time <= '" . $_POST["endTime"] . "00'";
}
if(!empty($_POST["type"])){
	$typeVals = implode(",",$_POST["type"]);
	$whereArr["type"] = "type IN (" . $typeVals . ")";
}
if(!empty($_POST["loc"])){
	$locVals = implode(",",$_POST["loc"]);
	$whereArr["loc"] = "location IN (" . $locVals . ")";
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

if($where != ""){
	echo "Selecting records which meet the following criteria:<br />" . $where . "<br />";
}
else{
	echo "No criteria provided, selecting all records...<br />";
}

//Determine the name of the table to be queried, based on user input
$tableName = "incidents_" . $_POST["data"];
echo "Selecting records from database: " . $tableName . "<br />";

//Assemble SQL SELECT statement, including user-specified WHERE clause and table name
$sql = "SELECT * FROM " . $tableName . " " . $where . "ORDER BY date DESC";

if (!$res = $mysqli->query($sql)) {
	//Return an error message if the query failed
	echo "SELECT failed: (" . $mysqli->errno . ") " . $mysqli->error . "<br />";
}
else{
	//Generate a table with the resulting data
	echo "Selected " . $res->num_rows . " rows<br />";
	echo "<table border='1'>";
	//The table containing the real data includes a location description, so the table will include a column to hold this data
	if($_POST["data"] == "real"){
		echo "<tr><td>ID</td><td>Date</td><td>Time</td><td>Type</td><td>Location</td><td>Latitude</td><td>Longitude</td></tr>";
		while ($row = $res->fetch_assoc()) {
			echo "<tr>";
			echo "<td>" . $row['ID'] . "</td>";
			echo "<td>" . $row['date'] . "</td>";
			echo "<td>" . $row['time'] . "</td>";
			echo "<td>" . $row['type'] . "</td>";
			echo "<td>" . $row['location'] . "</td>";
			echo "<td>" . $row['lat'] . "</td>";
			echo "<td>" . $row['long'] . "</td>";
			echo "</tr>";
		}
	}
	//The table containing the fake data doesn't include a location description, so the table won't display one
	else{
		echo "<tr><td>ID</td><td>Date</td><td>Time</td><td>Type</td><td>Latitude</td><td>Longitude</td></tr>";
		while ($row = $res->fetch_assoc()) {
			echo "<tr>";
			echo "<td>" . $row['id'] . "</td>";
			echo "<td>" . $row['date'] . "</td>";
			echo "<td>" . $row['time'] . "</td>";
			echo "<td>" . $row['type'] . "</td>";
			echo "<td>" . $row['latitude'] . "</td>";
			echo "<td>" . $row['longitude'] . "</td>";
			echo "</tr>";
		}
	}
	
	echo "</table>";
	
	//Free memory associated with the query results
	$res->free();
}

//Close the connection to the database
mysqli_close($mysqli);
?>