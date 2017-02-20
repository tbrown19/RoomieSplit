var $table = $("#rooms_table");

$('#numRoomsInput').on('input focusout', function (event) {
	$( ".howToHeader" ).slideUp(500);

	var $tableRow = $(".tableRow");
	var numRooms = $(this).val();

	//Removes all trs so it can start fresh
	$table.find("tr:gt(0)").remove();
	//Then show the table

	//Let the user know if they enter a non allowed value for roommates
	//Clear the values if they do
	if (numRooms > 10 || numRooms < 1 || !isInt($(this).val())) {
		$(this).val("");
		$(this).attr("placeholder", "Must be between 1-10");
		$(this).parent().find("span").css('visibility','hidden');
		$tableRow.fadeOut("slow");
	}
	else {
		//We display the table once they leave the input
		if(event.type === 'input'){
			$(this).parent().find("span").css('visibility','visible');
		}
	}

	//If they enter a correct value, loop VAL times
	for (var i = 1; i < parseInt(numRooms) + 1; i++) {
		var inputAttrs = {class:'footage', type: 'number', min: '1', max: '99', placeholder: '0'};
		var dimensionNames = ['Length', 'Width'];
		var dimensionMeasures = ['ft', 'in'];
		//We create a new tr each time through the loop.
		var $newTableRow = $('<tr>').attr('class', 'roomRow');

		//Append the room number data to the row.
		$newTableRow.append(($('<td>').text(i)));

		//Loop through creating a width and length column
		dimensionNames.forEach(function (dimension) {
			var $newDimensionTd = $('<td>').attr('class', 'footage');
			//Then append a ft and in input to each td
			dimensionMeasures.forEach(function (measure) {
				var $input = $('<input>').attr('id', measure + dimension  + 'Input' + i);
				$input.attr(inputAttrs);

				//Append the newly created input to the td
				$newDimensionTd.append($input);
				//Add a label to the input with what the current measurement is.
				$newDimensionTd.append($('<label>').text(measure))
			});
			//Append the newly created td to the table row
			$newTableRow.append($newDimensionTd);
		});
		//Append the sq footage td to the new table row.
		($('<td>').append(
			$('<input>').attr({
				id:'sqFtInput' + i, class: "sqFtInput", type: "number", min: "1", max: "1500", placeholder: "0"
			})
		)).appendTo($newTableRow);
		//Append the occupants td to the new table row.
		($('<td>').append(
			$('<input>').attr({
				id:'occsInput' + i, class: "occsInput", type: "number", min: "1", max: "4", placeholder: "0"
			})
		)).appendTo($newTableRow);

		//Append payment td text, with a default of 0.
		($('<td>').attr('id', 'percentTotal' + i).text(0)).appendTo($newTableRow);

		($('<td>').attr('id', 'payment' + i).text(0)).appendTo($newTableRow);



		$table.append($newTableRow);
	}

});

$('#footageInput').on('input focusout', function (event) {
	$(this).parent().find("span").css('visibility','visible');

	if (check_valid_primary_inputs($(this), 1, 10000)  && event.type === 'focusout'){
		update_all_footages();
		update_all_payments();
	}

});

$('#rentInput').on('input focusout', function (event) {
	var $tableRow = $(".tableRow");
	//Fade the table row in when they start typing.
	$tableRow.fadeIn("slow");
	$(this).parent().find("span").css('visibility','visible');
	//If the enter an invalid input, then fade the table out
	if(!check_valid_primary_inputs($(this), 1, 25000)){
		$tableRow.fadeOut("slow");
	}

	update_all_payments();
});

//Checks for input in the footage areas
$table.on('input change',function(e){
	//Check for which input value has been targeted.
	var target = e.target;
	var inputObject = $('#' + target.id);
	if( target.id.slice(0,2) === 'ft'){
		handle_ft_input(inputObject);
	}
	else if(target.id.slice(0,2) === 'in') {
		handle_in_input(inputObject);
	}
	else if(target.className === 'sqFtInput') {
		handle_sqFt_input(inputObject);
	}
	else if(target.className === 'occsInput') {
		handle_occs_input(inputObject);
	}
	update_all_payments();

});

function handle_ft_input(curInput) {
	var validInputs = [1, 99];
	var validInput = check_valid_input(curInput, curInput.val(), validInputs);
	handle_footage_input(curInput, validInput);
}

function handle_in_input(curInput) {
	var validInputs = [1, 12];
	var validInput = check_valid_input(curInput, curInput.val(), validInputs);
	handle_footage_input(curInput, validInput);
}

function handle_footage_input(curInput, validInput){
	//Get the current row and then pass it to the update square footage method for that to handle the updating.
	var curRow = curInput.parent().parent();
	update_row_square_footage(curRow, validInput);
}

function handle_sqFt_input(curInput) {
	var validInputs = [1, 999];
	var validInput = check_valid_input(curInput, curInput.val(), validInputs);
	var currentRow = curInput.parent().parent();
	display_manual_footage_inputs(currentRow, validInput);
	update_row_percent_total(currentRow, curInput.val());
}

function handle_occs_input(curInput) {
	var validInputs = [1, 5];
	var currentRow = curInput.parent().parent();
	check_valid_input(curInput, curInput.val(), validInputs);
}

function update_row_square_footage(row, validInput){
	var $sqFootageTD = row.find('input.sqFtInput');
	//Calculate the sqft, and then place that in the square footage table data, then pass the footage to update % total.
	//If we already have the value calculated, then just use that, if the value ends up being 0, we want to use a blank instead.
	var footage = $sqFootageTD.val() || calculate_footage(row) || '';
	$sqFootageTD.val(footage);
	$sqFootageTD.attr('disabled', validInput);
	update_row_percent_total(row, footage);
}

function update_row_percent_total(row, footage){
	var $percentTotalTD = row.find('[id^=percentTotal]');
	//Calculate the square footage from what the user has entered, and get the total.
	var totalFootage = $('#footageInput').val();
	var percentOfTotal = calculate_percent_of_total(footage,totalFootage);
	console.log(percentOfTotal);
	$percentTotalTD.text(percentOfTotal);
}

function update_row_payment(row){
	var curRoomFootage = row.find('input.sqFtInput').val();
	var numOfOccupants = row.find('input.occsInput').val();

	var total_rent = $('#rentInput').val() || 0;
	//Get the number of occupants
	var num_occupants = 0;
	$(".occsInput").each(function (index) {
		num_occupants += parseInt($(this).val()) || 0;
	});

	//Get the livable space amount
	var private_space = 0;
	$(".sqFtInput").each(function (index) {
		private_space += parseFloat($(this).val()) || 0;
	});

	//Figure out how much of the apartment is shared space
	var all_space = $('#footageInput').val() || 0;
	var common_space = all_space - private_space;
	var percent_shared = common_space / all_space;

	//The base payment is what everyone pays based on the percentage of the
	//floor plan that is shared space
	var base_payment = percent_shared * total_rent;
	var indv_base_payment = base_payment / num_occupants;

	//Remove the base payment from the total rent to find out how much is still
	//left to be paid
	total_rent = total_rent - (indv_base_payment * num_occupants || 1);

	//Figure out what percentage of the private space does the occupant have
	var indv_private_space = curRoomFootage / numOfOccupants;
	var percent_of_private = indv_private_space / private_space;

	//Calculate how much rent should be paid based on the private percentage
	var indv_private_payment = (percent_of_private * total_rent);
	var indv_total_payment = indv_base_payment + indv_private_payment;

	//If payment is infinity(ish) or NaN set to 0
	if (!isFinite(indv_total_payment) || isNaN(indv_total_payment)) {
		indv_total_payment = 0;
	}

	//Round the rent and then display it
	indv_total_payment = Math.round(indv_total_payment * 100) / 100;
	row.find("[id^=payment]").text(indv_total_payment);
}

function update_all_footages(){
	$(".roomRow").each(function () {
		update_row_square_footage($(this));
	});
}

//Update all the payment categories
function update_all_payments() {
	$(".roomRow").each(function () {
		update_row_payment($(this));
	});
}

function check_valid_input(curInput, val, allowedInputs){
	//Make sure the input value is an int and in the allowed range.
	if(isInt(val) && allowedInputs[0] <= val && val <= allowedInputs[1]) {
		return true;
	}
	else{
		//If the value is incorrect, then we want to reset it.
		curInput.val("");
		console.log("Max " + allowedInputs[1]);
		curInput.placeholder("Max " + allowedInputs[1]);
		return false
	}
}

function check_valid_primary_inputs(input, min, max) {
	var value = input.val();
	console.log("input be ",  input);

	console.log("value be ", value);
	console.log("max be ", max);
	if (value > max) {
		input.attr("placeholder", "Max value " + max);
	}
	else if (value < min){
		input.attr("placeholder", "Min value " + min);
	}
	else if (!isInt(value)){

		input.attr("placeholder", "Whole numbers only.");
	}
	else{
		return true;
	}
	input.val("");
	input.parent().find("span").css('visibility','hidden');
	return false;
}

function display_manual_footage_inputs(row, disabled){
	var visibility = disabled ? 'hidden' : 'visible';
	//Hide or show the inputs and labels.
	row.find("input.footage").css('visibility', visibility);
	row.find("label").css('visibility', visibility);
}

//Calculate the area of a room based on the provided inputs
function calculate_footage(row) {
	//Get all the values we need to calculate the footage.
	var widFt = parseInt(row.find("[id^=ftWidthInput]").val());
	var widIn = parseFloat(row.find("[id^=inWidthInput]").val() / 12);
	var	lenFt = parseInt(row.find("[id^=ftLengthInput]").val());
	var lenIn = parseFloat(row.find("[id^=inLengthInput]").val() / 12);

	//Try lenFt or if its nan change it to zero then add to lenIn
	//Then round it to two digits
	var totLen = round_to_two_digits((lenFt || 0) + lenIn);
	var totWid = round_to_two_digits((widFt || 0) + widIn);
	return round_to_two_digits((totLen) * (totWid));
}

function calculate_percent_of_total(value, totalValue) {
	var percentTotal = round_to_two_digits(value / totalValue * 100) || 0;
	if(!isFinite(percentTotal)){
		percentTotal = 0;
	}
	return percentTotal;
}

//Round a number to two digits and return it.
function round_to_two_digits(number){
	return Math.round(number * 100) / 100;
}

//Check if a number is a whole number
function isInt(n) {
	return n % 1 === 0;
}

$(".calcInput").on('click focus focusout', function (event) {
	//If they click or gain focus, we want to do a little bit of styling to
	//Show that they are on this selection.
	if (event.type === 'click' || event.type === 'focus') {
		$(this).css({
			'border': '3px solid #011627',
		});

	}

	else if (event.type === 'focusout') {
		var inputVal = $(this).val();
		//If they enter a value we don't except, go back to the original input
		if (inputVal < 0 || inputVal === '') {
			$(this).css({
				'border-color': 'transparent',
				'border-bottom-color': '#011627'
			});
		}
		//Otherwise we do a bit of styling to show that they entered a correct input.
		else {
			$(this).css({
				'border': '3px solid #43A047'
			});
		}


	}

});
