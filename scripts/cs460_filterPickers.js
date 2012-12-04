//Function to validate the values in both timepicker fields, switching their values if needed
function timepickerValidate(){
	var startVal = $('#timepicker-start').timepicker("getTime");
	startVal = (startVal == "Missing instance data for this timepicker") ? "" : startVal;
	var startTime = startVal.replace(":","");
	var endVal = $('#timepicker-end').timepicker("getTime");
	endVal = (endVal == "Missing instance data for this timepicker") ? "" : endVal;
	var endTime = endVal.replace(":","");
	if(startVal != "" && endVal != "" && startTime > endTime){
		$('#timepicker-start').timepicker("setTime",endVal);
		$('#timepicker-end').timepicker("setTime",startVal);
	}
}
$(function() {
	//Set up the start time field with a jQuery UI timepicker
	$('#timepicker-start').timepicker({
		showLeadingZero: true,
		timeSeparator: ':',
		onClose: timepickerValidate,
		hours: {
			starts: 0,                // First displayed hour
			ends: 23                  // Last displayed hour
		},
		minutes: {
			starts: 0,                // First displayed minute
			ends: 59,                 // Last displayed minute
			interval: 1               // Interval of displayed minutes
		},
		rows: 6,                      // Number of rows for the input tables, minimum 2, makes more sense if you use multiple of 2
		// buttons
		showCloseButton: true,       // shows an OK button to confirm the edit
		closeButtonText: 'Done',      // Text for the confirmation button (ok button)
		showNowButton: false,         // Shows the 'now' button
		showDeselectButton: true,    // Shows the deselect time button
		deselectButtonText: 'Clear' // Text for the deselect button
	});
	//Set up the end time field with a jQuery UI timepicker
	$('#timepicker-end').timepicker({
		showLeadingZero: true,
		timeSeparator: ':',
		onClose: timepickerValidate,
		hours: {
			starts: 0,                // First displayed hour
			ends: 23                  // Last displayed hour
		},
		minutes: {
			starts: 0,                // First displayed minute
			ends: 59,                 // Last displayed minute
			interval: 1               // Interval of displayed minutes
		},
		rows: 6,                      // Number of rows for the input tables, minimum 2, makes more sense if you use multiple of 2
		// buttons
		showCloseButton: true,       // shows an OK button to confirm the edit
		closeButtonText: 'Done',      // Text for the confirmation button (ok button)
		showNowButton: false,         // Shows the 'now' button
		showDeselectButton: true,    // Shows the deselect time button
		deselectButtonText: 'Clear' // Text for the deselect button
	});
});



$(function() {
	//Set up the begin date field with a jQuery UI datepicker
	$("#datepicker-start").datepicker({
		changeYear: true,
		dateFormat: "yy-mm-dd",
		onClose: function( selectedDate ) {
			$("#datepicker-end").datepicker( "option", "minDate", selectedDate );
		}
	});
	//Set up the end date field with a jQuery UI datepicker
	$("#datepicker-end").datepicker({
		changeYear: true,
		dateFormat: "yy-mm-dd",
		onClose: function( selectedDate ) {
			$("#datepicker-start").datepicker( "option", "maxDate", selectedDate );
		}
	});
	$("#datepicker-start").datepicker("setDate", "-4m"); //Set begin date default to 4 months in the past
	$("#datepicker-end").datepicker("setDate", new Date()); //Set begin date to the current date
});