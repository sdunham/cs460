//Generic incident icon class
var IncidentIcon = L.Icon.extend({
	options: {
		iconSize:     [35, 35], // size of the icon
		iconAnchor:   [17.5, 25], // point of the icon which will correspond to marker's location
		popupAnchor:  [0, -23] // point from which the popup should open relative to the iconAnchor
	}
});

//Individual icons for each Clery category
var liquorIcon = new IncidentIcon({iconUrl: 'icons/PNGs/liquor.png'});
var robberyIcon = new IncidentIcon({iconUrl: 'icons/PNGs/robbery.png'});
var assaultIcon = new IncidentIcon({iconUrl: 'icons/PNGs/assault.png', iconAnchor: [13.5, 22]});
var burglaryIcon = new IncidentIcon({iconUrl: 'icons/PNGs/burglary.png'});
var murderIcon = new IncidentIcon({iconUrl: 'icons/PNGs/murder.png'});
var carTheftIcon = new IncidentIcon({iconUrl: 'icons/PNGs/car.png', iconAnchor: [17.5, 17]});
var drugIcon = new IncidentIcon({iconUrl: 'icons/PNGs/drugs.png'});
var weaponIcon = new IncidentIcon({iconUrl: 'icons/PNGs/gun.png', iconAnchor: [23.5, 19]});
var theftIcon = new IncidentIcon({iconUrl: 'icons/PNGs/pickpocket.png'});
var vandalismIcon = new IncidentIcon({iconUrl: 'icons/PNGs/vandalism.png'});
var sexOffenseIcon = new IncidentIcon({iconUrl: 'icons/PNGs/sexoffense.png', iconAnchor: [17.5, 30]});
var attemptedCrimeIcon = new IncidentIcon({iconUrl: 'icons/PNGs/arrest.png'});
var manslaughterIcon = new IncidentIcon({iconUrl: 'icons/PNGs/manslaughter.png', iconAnchor: [30.5, 20]});
var unknownIcon = new IncidentIcon({iconUrl: 'icons/PNGs/unknown.png'});

/*var liquorIcon = new IncidentIcon({iconUrl: 'icons/PNGs/liquor.png', iconAnchor: [25.5, 20]});
var robberyIcon = new IncidentIcon({iconUrl: 'icons/PNGs/robbery.png', iconAnchor: [33.5, 24]});
var assaultIcon = new IncidentIcon({iconUrl: 'icons/PNGs/assault.png', iconAnchor: [10.5, 20]});
var burglaryIcon = new IncidentIcon({iconUrl: 'icons/PNGs/burglary.png', iconAnchor: [24.5, 18]});
var murderIcon = new IncidentIcon({iconUrl: 'icons/PNGs/murder.png', iconAnchor: [24.5, 20]});
var carTheftIcon = new IncidentIcon({iconUrl: 'icons/PNGs/car.png', iconAnchor: [17.5, 20]});
var drugIcon = new IncidentIcon({iconUrl: 'icons/PNGs/drugs.png', iconAnchor: [34.5, 20]});
var weaponIcon = new IncidentIcon({iconUrl: 'icons/PNGs/gun.png', iconAnchor: [17.5, 17]});
var theftIcon = new IncidentIcon({iconUrl: 'icons/PNGs/pickpocket.png', iconAnchor: [32.5, 27]});
var vandalismIcon = new IncidentIcon({iconUrl: 'icons/PNGs/vandalism.png'});
var sexOffenseIcon = new IncidentIcon({iconUrl: 'icons/PNGs/sexoffense.png', iconAnchor: [20.5, 35]});
var attemptedCrimeIcon = new IncidentIcon({iconUrl: 'icons/PNGs/arrest.png', iconAnchor: [20.5, 8]});
var manslaughterIcon = new IncidentIcon({iconUrl: 'icons/PNGs/manslaughter.png', iconAnchor: [32.5, 22]});
var unknownIcon = new IncidentIcon({iconUrl: 'icons/PNGs/unknown.png'});*/

//Generic HTML template used to create each popup
var incidentPopupTemplate = "<div><h3 class='incidentID'>Incident # </h3><div class='popupField'><span class='popupLabel'>Type:</span><span class='popupType'></span></div><div class='popupField'><span class='popupLabel'>Location:</span><span class='popupLoc'></span></div><div class='popupField'><span class='popupLabel'>Date:</span><span class='popupDate'></span></div><div class='popupField'><span class='popupLabel'>Time:</span><span class='popupTime'></span></div></div>";

//Function to reset the chart data, to be used when querying the database
var resetData = function(){
	var newObj = {
		"AGGRAVATED ASSAULT":0,
		"ATTEMPTED CRIME":0,
		"BURGLARY":0,
		"DRUG ABUSE VIOLATIONS":0,
		"LIQUOR LAW VIOLATIONS":0,
		"MOTOR VEHICLE THEFT":0,
		"MURDER / NON-NEGLIGENT MANSLAUGHTER":0,
		"NEGLIGENT MANSLAUGHTER":0,
		"ROBBERY":0,
		"SEX OFFENSE - FORCIBLE":0,
		"SEX OFFENSE - NON-FORCIBLE":0,
		"THEFT":0,
		"UNKNOWN":0,
		"VANDALISM":0,
		"WEAPON VIOLATIONS":0
	};
	return newObj;
};

var chartData = resetData(); //Raw chart data
var processedChartData = []; //Processed chart data used by the genChart function

//Custom info control for map, creates button which opens a jQuery UI modal dialog
var infoControl = L.Control.extend({
	options: {
		position: 'topleft'
	},
	onAdd: function (map) {
		var className = 'vis-control-info',
			container = L.DomUtil.create('div', className);
		this._map = map;
		this._infoButton = this._createButton('','More information', className + '-button',container,this._showInfo,this);
		return container;
	},
	//Opens a jQuery UI modal dialog, adjusting width and height based on viewport size
	_showInfo: function (e) {
		var dialogWidth = $(window).width();
		var dialogHeight = $(window).height();
		if(dialogWidth <= 650){dialogWidth = dialogWidth * 0.9;}
		else{dialogWidth = 625;}
		if(dialogHeight <= 500){dialogHeight = dialogHeight * 0.9;}
		else{dialogHeight = 400;}
		$("#info-modal").dialog("option","width",dialogWidth);
		$("#info-modal").dialog("option","height",dialogHeight);
		$("#info-modal").dialog("open");
	},

	_createButton: function (html, title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		L.DomEvent
			.on(link,'click',L.DomEvent.stopPropagation)
			.on(link,'mousedown',L.DomEvent.stopPropagation)
			.on(link,'dblclick',L.DomEvent.stopPropagation)
			.on(link,'click',L.DomEvent.preventDefault)
			.on(link,'click',fn,context);
		return link;
	}
});

$(function() {
	// create a map in the "map" div, set the view to a given place and zoom
	var map = L.map('map').setView([47.261743,-122.481775], 16);
	var markers; //Global variable to hold the markers
	
	// add a CloudMade tile layer with style #997
	L.tileLayer('http://{s}.tile.cloudmade.com/eac20f969c234bed8c6e3191bbac3bfc/997/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>'
	}).addTo(map);
	
	//Function which queries the database based on current filter selections
	var genIncidentMarkers = function(){
		var dataVal, beginDateVal, endDateVal, beginTimeVal, endTimeVal, typeVals;
		//Get current filter field values
		dataVal = $("input:radio[name='data']:checked").val();
		beginDateVal = $("input[name='datepicker-start']").val();
		endDateVal = $("input[name='datepicker-end']").val();
		beginTimeVal = $("input[name='timepicker-start']").val();
		endTimeVal = $("input[name='timepicker-end']").val();
		typeVals = $("#incident-select").val();
		chartData = resetData();
		processedChartData = [];
		//Initiate an AJAX call to a PHP script which returns the requested data as a JSON object
		$.ajax({
			type: "POST",
			url: "scripts/dbScripts/db_select_records_json.php",
			data: {
				data: dataVal,
				beginDate: beginDateVal,
				endDate: endDateVal,
				beginTime: beginTimeVal,
				endTime: endTimeVal,
				type: typeVals
			}
		}).done(function(data) {
			//When JSON returned, clear the current markers from the map and iterate through each incident
			var incidents = jQuery.makeArray(data.incidents);
			if(typeof markers !== "undefined"){markers.clearLayers();}
			markers = new L.MarkerClusterGroup();
			$.each(incidents, function() {
				var curID, curLat, curLong, curType, curDate, curTime, curLoc, curMarker, curPopup, curIcon;
				curID = this.ID;
				curLat = this.latitude;
				curLong = this.longitude;
				curType = this.type;
				curDate = this.date;
				curTime = this.time;
				curLoc = this.location;
				curPopup = $(incidentPopupTemplate); //Create an empty popup template to manipulate
				curPopup.find(".incidentID").append(curID);
				curPopup.find(".popupType").html(curType);
				curPopup.find(".popupLoc").html(curLoc);
				curPopup.find(".popupDate").html(curDate);
				curPopup.find(".popupTime").html(curTime);
				//Assign icon based on current incident's type
				switch(curType.toUpperCase()){
					case "AGGRAVATED ASSAULT":
					curIcon = assaultIcon;
					break;
					case "BURGLARY":
					curIcon = burglaryIcon;
					break;
					case "MURDER / NON-NEGLIGENT MANSLAUGHTER":
					curIcon = murderIcon;
					break;
					case "NEGLIGENT MANSLAUGHTER":
					curIcon = manslaughterIcon;
					break;
					case "MOTOR VEHICLE THEFT":
					curIcon = carTheftIcon;
					break;
					case "ROBBERY":
					curIcon = robberyIcon;
					break;
					case "SEX OFFENSE - NON-FORCIBLE":
					curIcon = sexOffenseIcon;
					break;
					case "SEX OFFENSE - FORCIBLE":
					curIcon = sexOffenseIcon;
					break;
					case "LIQUOR LAW VIOLATIONS":
					curIcon = liquorIcon;
					break;
					case "DRUG ABUSE VIOLATIONS":
					curIcon = drugIcon;
					break;
					case "WEAPON VIOLATIONS":
					curIcon = weaponIcon;
					break;
					case "THEFT":
					curIcon = theftIcon;
					break;
					case "ATTEMPTED CRIME":
					curIcon = attemptedCrimeIcon;
					break;
					case "VANDALISM":
					curIcon = vandalismIcon;
					break;
					default:
					curIcon = unknownIcon;
				}
				curMarker = new L.marker([curLat, curLong], {icon: curIcon});
				curMarker.bindPopup(curPopup.html(),{maxWidth:350});
				markers.addLayer(curMarker);							
				
				//Increment the count for this incident type in the chartData object
				if(chartData.hasOwnProperty(this.type)){
					chartData[this.type] += 1;
				}
				else{
					chartData[this.type] = 1;
				}
			});
			//Add the newly created markers to the map
			map.addLayer(markers);
			//Show a "Fake Data" warning dialog if the user requested fake data 
			if(dataVal == "fake"){
				$("#fake-warn").dialog({title:"<center>Alert:</center>", height:65});
			}
			//Process the chart data for use in a Google pie chart (expects 2d array)
			$.each(chartData, function(name,value){
				var cur = [name,value];
				processedChartData.push(cur);
			});
			//Sort processed data alphabetically by incident type
			processedChartData.sort(function(a,b){
				if (a[0] < b[0]){return -1;}
				else if (a[0] > b[0]){return 1;}
				else{return 0;}
			});
			//Redraw the chart based on the new data
			genChart(processedChartData);
		});
	};
	
	//Prepare "More Information" modal dialog
	$("#info-modal").dialog({
		modal: true,
		autoOpen: false,
		open: function(){
			$("#info-sections").show();
			$("#info-sections").accordion({ collapsible:true, active:0, heightStyle:"content" });
		}
	});
	
	//Prepare Real/Fake jQuery UI button set
	$("#data-radios").buttonset();
	
	//Prepare Submit jQuery UI button
	$("input[value='Submit']").button();
	
	//Add custom info button to map
	map.addControl(new infoControl());
	
	//Query the database based on the current filter selections to generate markers
	genIncidentMarkers();

	//Bind click event to filter toggle
	$(".filter-toggle").click(function(){
		$("#filters").slideToggle();
		$(this).toggleClass("shown");
	});
	
	//Bind click event to filter toggle
	$(".graph-toggle").click(function(){
		$("#graph").toggle("fast", function(){
			$(".graph-toggle").toggleClass("shown");
			genChart(processedChartData);
		});
	});
	
	//Bind click event to clicking submit button
	$("input[value='Submit']").click(function () {
		//Query the database based on the current filter selections to generate markers
		genIncidentMarkers();
	});
});