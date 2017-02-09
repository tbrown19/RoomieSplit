$(document).ready(function () {
	$(".tableRow").hide();
});

$('#numRoomsInput').on('input', function () {
	var $tableRow = $(".tableRow");
	var $table = $("#rooms_table");
	var numRooms = $(this).val();

	//Removes all trs so it can start fresh
	$table.find("tr:gt(0)").remove();
	//Then show the table
	$tableRow.fadeIn("slow");



	//Let the user know if they enter a non allowed value for roommates
	//Clear the values if they do
	if (numRooms > 10 || numRooms < 1 || !isInt($(this).val())) {
		numRooms = 0;
		$(this).val("");
		$tableRow.fadeOut("slow");
	}

	//If they enter a correct value, loop VAL times
	for (var i = 1; i < parseInt(numRooms) + 1; i++) {
		var dimensionAttrs = {type: 'number', min:'1', max: '99', placeholder: '0'};
		var dimensionNames = ['length', 'width'];
		var dimensionMeasures = ['Ft', 'In'];
		//We create a new tr each time through the loop.
		var $newTableRow = $('<tr>').attr('class', 'roomRow');

		//Append the room number data to the row.
		$newTableRow.append(($('<td>').text(i)));

		//Loop through creating a width and length column
		dimensionNames.forEach(function (dimension) {
			var $newDimensionTd = $('<td>');
			//Then append a ft and in input to each td
			dimensionMeasures.forEach(function (measure) {
				var $input = $('<input>').attr('id', dimension + measure + 'input');
				$input.attr(dimensionAttrs);
				//Append the newly created input to the td
				$newDimensionTd.append($input);
				//Add a label to the input with what the current measurement is.
				$newDimensionTd.append($('<label>').text(measure))
			});
			//Append the newly created td to the table row
			$newTableRow.append($newDimensionTd);
		});









		$table.append($newTableRow);



		//Show the table and select it

		// $("#rooms_table").show(0).find('tbody')
		// //Begin the adding of all the differnt trs and tds
		// //Start of room number column
		// 	var $td =
		// 	.append($('<tr>')
		// 			.attr('class', 'roomRow')
		// 			//Add the room number column.
		// 			.append($('<td>').text(i))
		//
		// 			//Start of room length column
		// 			.append($('<td>')
		// 				.append($('<input>').attr('id','lengthFtInput')
		// 					.attr(roomDimensionAttrs).after($('<label>')).attr('for','lengthFtInput').text('ft')
		// 				)
		// 			)
		//
		//
		// 		//End of room length column
		// 		/*
		// 		 //Start of square footge column
		// 		 //  .append($('<td>')
		// 		 //    .attr('class','sqFt')
		// 		 //      .text(""))
		// 		 //End of square footge column
		//
		// 		 //Start of square footge column
		// 		 .append($('<td>')
		// 		 .append($('<input>')
		// 		 .attr('class', 'mini_text_line sqFt', 'type', 'text')
		// 		 .val("")))
		// 		 //End of square footge column
		// 		 //Start of % of total column
		// 		 .append($('<td>')
		// 		 .attr('class', 'perTotal')
		// 		 .text(""))
		// 		 //End of % of total column
		//
		// 		 //Start of occupants column
		// 		 .append($('<td>')
		// 		 .append($('<input>')
		// 		 .attr('class', 'mini_text_line occupants', 'type', 'text')))
		// 		 //End of occupants column
		//
		// 		 //Start of payment column
		// 		 .append($('<td>')
		// 		 .attr('class', 'payment')
		// 		 .text(""))
		// 		 //End of payment column*/
		// 	);
	}


});

//Checks for input in the footage areas
$('#rooms_table').on('input', '.footage', function () {
	$(this).closest('tr').find('input.sqFt').attr("disabled", true);
	//Check to see if the value is inches(true) or feet(false)
	//Then get that value
	var str = ($(this).attr('class'));
	var inches = str.includes("In");
	var val = $(this).val();

	//If an int is not entered, then clear the field
	if (!isInt(val)) {
		$(this).val("");
	}
	//Allow the inches field to go to 2 digits
	if (inches & val.length > 2 || inches & val > 12) {
		val = 0;
		$(this).val("");
		$(this).closest('tr').find('td.perTotal').text(" ");
		$(this).closest('tr').find('input.sqFt').val("");
	}
	//Allow the feet field to go to 3 digits
	else if (!inches & val.length > 2) {
		val = 0;
		$(this).val("");
		$(this).closest('tr').find('td.perTotal').text(" ");
		$(this).closest('tr').find('input.sqFt').val("");
	}
	else {
		//Assign the object to a variable and pass it to the calculation function
		var footage = $(this);
		calculate_footage(footage, false);
		update_payments();
	}

	//If the value fields are empty, renable the ability to type in square footage
	if (val.length === 0 || val === 0) {
		$(this).closest('tr').find('input.sqFt').attr("disabled", false);
		$(this).closest('tr').find('td.perTotal').text(" ");
		$(this).closest('tr').find('input.sqFt').val("");

	}


});

//Checks for input in the occupants areas
$('#rooms_table').on('input', '.occupants', function () {
	//Make sure the user isn't entering a number longer than 2 digits, or a float
	if (!isInt($(this).val()) || $(this).val().length > 2) {
		$(this).val("");
	}

	update_payments();
});

//Update all values in the footage and percent of total columns
$('#footage_line').on('input', function () {
	if (!isInt($(this).val()) || isNaN($(this).val()) || $(this).val().length > 5) {
		$(this).val("");
	}
	$(".footage").each(function (index) {
		var row = $(this);
		calculate_footage(row);
	});
	update_payments();

});

//Update all values in the footage and percent of total columns
$('#rent_line').on('input', function () {
	if (!isInt($(this).val()) || isNaN($(this).val()) || $(this).val().length > 5) {
		$(this).val("");
	}
	update_payments();
});

//Checks for input in the square footage area
$('#rooms_table').on('input', '.occupants', function () {
	//Make sure the user isn't entering a number longer than 2 digits, or a float
	if (!isInt($(this).val()) || $(this).val().length > 2) {
		$(this).val("");
	}

	update_payments();
});

$('#rooms_table').on('input', '.sqFt', function () {
	//Make sure an acceptable value is entered
	if (!isInt($(this).val()) || $(this).val().length > 4) {
		$(this).val("");
	}

	//If a value has been manually entered into the square footage field
	//Then hide the two manual footage fields
	//If they delete the value, then reshow the manual footage fields
	if ($(this).val().length !== 0) {
		$(this).closest('tr').find('input.footage').hide();
		$(this).closest('tr').find('span').hide();
	}
	else {
		$(this).closest('tr').find('input.footage').show();
		$(this).closest('tr').find('span').show();
	}
	var footage = $(this);
	calculate_footage(footage, true);
	update_payments();

});

$("#confirm_button").click(function () {
	$("#how_to").slideUp(500);
});


//Update all the payment catagories
function update_payments() {
	$(".occupants").each(function (index) {
		var occupants = $(this);
		calculate_rent(occupants);
	});
}

//Check if a number is a whole number
function isInt(n) {
	return n % 1 === 0;
}

//Calculate the area of a room based on the provided inputs
function calculate_area(row) {
	var lenFt = parseInt(row.closest('tr').find("input.lenFt").val());
	var lenIn = parseFloat(row.closest('tr').find("input.lenIn").val() / 12);
	var widFt = parseFloat(row.closest('tr').find("input.widFt").val());
	var widIn = parseFloat(row.closest('tr').find("input.widIn").val() / 12);

	//Try lenFt or if its nan change it to zero then add to lenIn
	//Then round it to two digits
	var totLen = (lenFt || 0) + lenIn;
	totLen = Math.round(totLen * 100) / 100;

	var totWid = (widFt || 0) + widIn;
	totWid = Math.round(totWid * 100) / 100;

	//Find square footage and then round, if other values haven't been entered
	//Use one in the meantime
	var sqFootage = Math.round(((totLen || 1) * (totWid || 1)) * 100) / 100;
	if (totLen === 0 & totWid === 0) {
		sqFootage = 0;
	}

	//If the value is still 0 after the previous calculations it means
	//that square footage must have already been calculated
	//So just get that value and return it
	if (sqFootage === 0) {
		sqFootage = row.closest('tr').find('.sqFt').val();
	}
	return sqFootage;
}

//Calculate the footage based off of values passed to it
function calculate_footage(footage, manually_entered) {
	if (!manually_entered) {
		console.log("needed to find");
		sqFootage = calculate_area(footage);
	}
	else {
		console.log("already provided");
		sqFootage = footage.val();
	}
	footage.closest('tr').find('.sqFt').val(sqFootage);

	//Get the total square footage and find out each persons share of it
	var totalFt = $('#footage_line').val() || sqFootage;
	console.log($('#footage_line').val());
	console.log("total ft" + totalFt);
	var percent_of_total = sqFootage / totalFt * 100;
	percent_of_total = Math.round(percent_of_total * 100) / 100;
	console.log(percent_of_total);
	footage.closest('tr').children('td.perTotal').text(percent_of_total || "");

}

//Handles rent based on total percentages
function calculate_rent(occupants) {
	var total_rent = $('#rent_line').val() || 0;

	//Get the number of occupants
	var num_occupants = 0;
	$(".occupants").each(function (index) {
		num_occupants += parseInt($(this).val()) || 0;
	});

	//Get the livable space amount
	var private_space = 0;
	$(".sqFt").each(function (index) {
		private_space += parseFloat($(this).val()) || 0;
	});

	//Figure out how much of the apartment is shared space
	var all_space = $('#footage_line').val() || 0;
	var common_space = all_space - private_space;
	var percent_shared = common_space / all_space;

	//The base payment is what everyone pays based on the percentage of the
	//floor plan that is shared space
	var base_payment = percent_shared * total_rent;
	var indv_base_payment = base_payment / num_occupants;
	console.log("indv_base_payment " + indv_base_payment);

	//Remove the base payment from the total rent to find out how much is still
	//left to be paid
	total_rent = total_rent - (indv_base_payment * num_occupants || 1);

	//Figure out what percentage of the private space does the occupant have
	var indv_private_space = calculate_area(occupants) / occupants.val();
	var percent_of_private = indv_private_space / private_space;

	//Calculate how much rent should be paid based on the private percentage
	var indv_private_payment = (percent_of_private * total_rent);
	var indv_total_payment = indv_base_payment + indv_private_payment;
	console.log("percent_of_private " + percent_of_private);


	//If payment is infinity(ish) or NaN set to 0
	if (indv_total_payment > 100000000000 || isNaN(indv_total_payment)) {
		indv_total_payment = 0;
	}

	//Round the rent and then display it
	indv_total_payment = Math.round(indv_total_payment * 100) / 100;
	occupants.closest('tr').children('td.payment').text(indv_total_payment);
}


$(".calcInput").on('click focus focusout', function (event) {
	//If they click or gain focus, we want to do a little bit of styling to
	//Show that they are on this selection.
	if (event.type === 'click' || event.type === 'focus') {
		$(this).css({
			'border-left': '2px solid #011627',
			'border-right': '2px solid #011627',
			'padding-top': '10px',
			'padding-bottom': '10px'
		});

	}

	else if (event.type === 'focusout') {
		var inputVal = $(this).val();
		//If they enter a value we don't except, go back to the original input
		if (inputVal < 0 || inputVal === '') {
			$(this).css({
				'border-color': '#011627',
				'border-left': 'none',
				'border-right': 'none',
				'padding-top': '5px',
				'padding-bottom': '5px'
			});
		}
		//Otherwise we do a bit of styling to show that they entered a correct input.
		else {
			console.log($(this).prev().prev().css('display', 'inline'));
			$(this).css({
				'border': '3px solid #43A047',
				'padding-top': '5px',
				'padding-bottom': '5px'
			});
		}


	}

});
