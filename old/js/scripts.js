$(document).ready(function() {
    $("#rooms_list").hide();
});

$('#roomate_line').on('input', function() {
    //Removes all trs so it can start fresh
    $("#rooms_table").find("tr:gt(0)").remove();
    var val = $(this).val();

    //Make sure the user isn't entering a number longer than 2 digits, or a float
    if (!isInt($(this).val()) || $(this).val().length > 2) {
        $(this).val("");
    }

    //If the value drops to below 0 rehide the table
    if (val < 1) {
        $("#rooms_list").hide();
    }

    //Let the user know if they enter more than the max roomate
    //Clear the values if they do
    if (val > 20) {
        val = 0;
        alert("Max number of rooms allowed is 20");
        $('#roomate_line').val("");
        $("#rooms_list").hide();
    }

    //If they enter a correct value, loop VAL times
    for (var i = 1; i < parseInt(val) + 1; i++) {
        //Show the table and select it
        $("#rooms_list").show(0);
        $("#rooms_table").find('tbody')
            //Begin the adding of all the differnt trs and tds
            //Start of room number column
            .append($('<tr>')
                .attr('class', 'room_row')
                .append($('<td>')
                    .text('Room ' + i)
                )
                //End of room number column

                //Start of room length column
                .append($('<td>')
                    .append($('<input>')
                        .attr('class', 'mini_text_line footage lenFt', 'type', 'text'))
                    .append($('<span>')
                        .text("ft"))
                    .append($('<input>')
                        .attr('class', 'mini_text_line footage lenIn', 'type', 'text'))
                    .append($('<span>')
                        .text("in"))
                )
                //End of room length column

                //Start of room width column
                // footage widFt
                .append($('<td>')
                    .append($('<input>')
                        .attr('class', 'mini_text_line footage widFt', 'type', 'text'))
                    .append($('<span>')
                        .text("ft"))
                    .append($('<input>')
                        .attr('class', 'mini_text_line footage widIn', 'type', 'text'))
                    .append($('<span>')
                        .text("in"))
                )
                //End of room length column

                //Start of square footge column
                .append($('<td>')
                    .append($('<input>')
                        .attr('class', 'mini_text_line sqFt', 'type', 'text')
                        .val("")))
                //End of square footge column
                //Start of % of total column
                .append($('<td>')
                    .attr('class', 'perTotal')
                    .text(""))
                //End of % of total column

                //Start of occupants column
                .append($('<td>')
                    .append($('<input>')
                        .attr('class', 'mini_text_line occupants', 'type', 'text')))
                //End of occupants column

                //Start of payment column
                .append($('<td>')
                    .attr('class', 'payment')
                    .text(""))
                //End of payment column
            );
    }
});

//Checks for input in the footage areas
$('#rooms_table').on('input', '.footage', function() {
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
    } else {
        console.log("checking");
        //Assign the object to a variable and pass it to the calculation function
        var footage = $(this);
        console.log("footage of this element :" + footage.val());
        //Make sure the footage entered is valid
        if (check_valid_footage(footage)) {
            calculate_footage(footage, false);
            update_payments();
        } else {
            $(this).closest('tr').find('input.sqFt').val("");

        }
    }

    //If the value fields are empty, renable the ability to type in square footage
    if (val.length === 0 || val === 0) {
        $(this).closest('tr').find('input.sqFt').attr("disabled", false);
        $(this).closest('tr').find('td.perTotal').text(" ");
        $(this).closest('tr').find('input.sqFt').val("");

    }



});

//Checks for input in the occupants areas
$('#rooms_table').on('input', '.occupants', function() {
    //Make sure the user isn't entering a number longer than 2 digits, or a float
    if (!isInt($(this).val()) || $(this).val().length > 2) {
        $(this).val("");
    }

    update_payments();
});

//Update all values in the footage and percent of total columns
$('#footage_line').on('input', function() {
    if (!isInt($(this).val()) || isNaN($(this).val()) || $(this).val().length > 5) {
        $(this).val("");
    }
    $(".footage").each(function(index) {
        var row = $(this);
        calculate_footage(row);
    });
    update_payments();

});

//Update all values in the footage and percent of total columns
$('#rent_line').on('input', function() {
    //Some different input handlers
    if (!isInt($(this).val()) || isNaN($(this).val()) || $(this).val().length > 5) {
        $(this).val("");
    }
    update_payments();
});

//Checks for input in the square footage area
$('#rooms_table').on('input', '.occupants', function() {
    //Make sure the user isn't entering a number longer than 2 digits, or a float
    if (!isInt($(this).val()) || $(this).val().length > 2) {
        $(this).val("");
    }

    update_payments();
});

$('#rooms_table').on('input', '.sqFt', function() {
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
    } else {
        $(this).closest('tr').find('input.footage').show();
        $(this).closest('tr').find('span').show();
    }
    var footage = $(this);
    if (check_valid_footage(footage)) {
        calculate_footage(footage, true);
        update_payments();
    }
});

$("#confirm_button").click(function() {
    $("#how_to").slideUp(500);
});

$("#clear_button").click(function() {
    clear_all_info();
});


//Update all the payment catagories
function update_payments() {
    $(".occupants").each(function(index) {
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
        //console.log("needed to find");
        sqFootage = calculate_area(footage);
    } else {
        //console.log("already provided");
        sqFootage = footage.val();
    }
    footage.closest('tr').find('.sqFt').val(sqFootage);
    if (check_valid_footage(footage)) {
        //Get the total square footage and find out each persons share of it
        var totalFt = $('#footage_line').val() || sqFootage;
        //console.log($('#footage_line').val());
        //console.log("total ft" + totalFt);
        var percent_of_total = sqFootage / totalFt * 100;
        percent_of_total = Math.round(percent_of_total * 100) / 100;
        //console.log(percent_of_total);
        footage.closest('tr').children('td.perTotal').text(percent_of_total || "");

    } else {
        footage.closest('tr').find('.sqFt').val("");
    }
}

//Handles rent based on total percentages
function calculate_rent(occupants) {
    var total_rent = $('#rent_line').val() || 0;

    //Get the number of occupants
    var num_occupants = 0;
    $(".occupants").each(function(index) {
        num_occupants += parseInt($(this).val()) || 0;
    });

    //Get the livable space amount
    var private_space = 0;
    $(".sqFt").each(function(index) {
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

    //Remove the base payment from the total rent to find out how much is still
    //left to be paid
    //Handle the rare case when there is no common space
    if (indv_base_payment !== 0) {
        total_rent = total_rent - (indv_base_payment * num_occupants || 1);
    }

    //Figure out what percentage of the private space does the occupant have
    var indv_private_space = calculate_area(occupants) / occupants.val();
    var percent_of_private = indv_private_space / private_space;

    if (private_space == all_space) {
        indv_private_payment = total_rent / num_occupants;
    }

    //Calculate how much rent should be paid based on the private percentage
    var indv_private_payment = (percent_of_private * total_rent);
    var indv_total_payment = indv_base_payment + indv_private_payment;
    //console.log("percent_of_private " + percent_of_private);

    //If payment is infinity(ish) or NaN set to 0
    if (indv_total_payment > 100000000000 || isNaN(indv_total_payment)) {
        indv_total_payment = 0;
    }

    //Round the rent and then display it
    indv_total_payment = Math.round(indv_total_payment * 100) / 100;
    occupants.closest('tr').children('td.payment').text(indv_total_payment);
}

function check_valid_footage(footage) {
    var total_footage = $('#footage_line').val();
    var calculated_footage = 0;
    //Find the total footage of the rooms entered so far
    $(".sqFt").each(function(index) {
        //console.log($(this).val());
        calculated_footage += parseFloat($(this).val()) || 0;
    });

    room_footage = parseInt(footage.val());

    //If the room or all the rooms is greater than the total clear the most recent
    if (room_footage > total_footage || calculated_footage > total_footage) {
        //Could call the clear row function but that removes too much info
        //Would make it a pain if a user simply mis clicked
        footage.closest('tr').find('input.footage').show();
        footage.closest('tr').find('span').show();
        footage.closest('tr').find('input.sqFt').val("");
        footage.closest('tr').find('td.perTotal').text("");
        footage.closest('tr').find('td.payment').text("");
        footage.val("");
        return false;
    } else {
        return true;
    }

}
//Clears all the elements entered in a row
function clear_row(row) {
    row.closest('tr').find('input.footage').val("");
    row.closest('tr').find('input.footage').show();
    row.closest('tr').find('span').show();
    row.closest('tr').find('input.sqFt').val("");
    row.closest('tr').find('td.perTotal').text("");
    row.closest('tr').find('input.occupants').val("");
    row.closest('tr').find('td.payment').text("");
    row.val("");

}

//Loop through the rows and call the clear row function to clear them
function clear_all_info() {
    $(".sqFt").each(function(index) {
        clear_row($(this));
    });
}
