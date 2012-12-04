//Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});
var chart;
//Function used to draw a pie chart with the provided data
var genChart = function(pieData){
	if($(".graph-toggle").hasClass("shown")){
		$("#graph").empty();
		var options = {
			backgroundColor: "transparent",
			pieSliceBorderColor: "transparent",
			chartArea:{top:20},
			//colors: ["B52A2C","B56D2A","B5B22A","72B52A","2CB52A","2AB56D","2AB5B2","2A72B5","2A2CB5","6D2AB5","B22AB5","B52A72","A7988B","333333","000000"],
			sliceVisibilityThreshold:1/180,
			legend: {position: "bottom", textStyle: {color: "white", fontSize: 12}}
		};
		//Create and populate the data table.
		var data = google.visualization.arrayToDataTable(pieData,true);
		//Create and draw the visualization.
		chart = new google.visualization.PieChart(document.getElementById('graph'));
		chart.draw(data,options);
	}
};

//Redraw the chart when the window is resized (using the debounced smartresize function)
$(window).smartresize(function(){  
	genChart(processedChartData);
	console.log("Window resized!");
});