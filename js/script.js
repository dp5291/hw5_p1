/* File: script.js
GUI Assignment: Creating Dynamic table with jQuery Validation Part 1
Dhruvkumar Patel, UMass Lowell Computer Science, Dhruvkumar_patel1@student.uml.edu
Copyright (c) 2025 by Dhruvkumar. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by DP on 11/25, 2025
Description: The user inputs are validated using the jQuery validation plugin.
If all four values are valid, the multiplictaion table is generated. All the vlaidation
checks are done and page does not reload if there is an error.
citation:
Table creation references
 https://www.w3schools.com/jsref/met_table_insertrow.asp 
 https://www.w3schools.com/jsref/met_table_createthead.asp
 https://www.w3schools.com/jsref/met_node_appendchild.asp
 https://jqueryvalidation.org/jQuery.validator.addMethod/
 https://jqueryvalidation.org/validate/
*/
// Global constants
var MIN = -50;
var MAX = 50;
var MAX_CELLS = 200 * 200;

function buildTable(minCol, maxCol, minRow, maxRow) {
  var grid = document.getElementById("grid");
  grid.innerHTML = ""; // clear any existing table

  // Create table head
  var thead = grid.createTHead();
  var headRow = thead.insertRow();

  // Top-left empty corner cell
  var corner = document.createElement("th");
  corner.textContent = "";
  headRow.appendChild(corner);

  // Column headers
  for (var c = minCol; c <= maxCol; c++) {
    var th = document.createElement("th");
    th.textContent = c;
    headRow.appendChild(th);
  }

  // Create table body
  var tbody = grid.createTBody();

  // Generate multiplication rows
  for (var r = minRow; r <= maxRow; r++) {
    var tr = tbody.insertRow();

    // Row header
    var thLeft = document.createElement("th");
    thLeft.textContent = r;
    tr.appendChild(thLeft);

    // Product cells
    for (var c2 = minCol; c2 <= maxCol; c2++) {
      var td = tr.insertCell();
      td.textContent = r * c2;
    }
  }
}

$(document).ready(function () {
  var $status = $("#status");

  //validator for checking min is not greater than max
  $.validator.addMethod("greaterEqualTo", function (value, element, param) {
      var target = $(param);
      var thisVal = parseFloat(value);
      var targetVal = parseFloat(target.val());

      if (isNaN(thisVal) || isNaN(targetVal)) {
        return true;
      }

      return thisVal >= targetVal;
    },
    "Maximum value must be greater than or equal to the minimum value."
  );

  // Attach validation to the form
  $("#controls").validate({
    // Rules for each input 
    rules: {
      minCol: {
        required: true,
        number: true,
        range: [MIN, MAX]
      },
      maxCol: {
        required: true,
        number: true,
        range: [MIN, MAX],
        greaterEqualTo: "#minCol"
      },
      minRow: {
        required: true,
        number: true,
        range: [MIN, MAX]
      },
      maxRow: {
        required: true,
        number: true,
        range: [MIN, MAX],
        greaterEqualTo: "#minRow"
      }
    },

    // error message 
    messages: {
      minCol: {
        required: "Please enter a minimum column value.",
        number: "Please enter a valid number for the minimum column.",
        range: "Column values must be between -50 and 50."
      },
      maxCol: {
        required: "Please enter a maximum column value.",
        number: "Please enter a valid number for the maximum column.",
        range: "Column values must be between -50 and 50.",
        greaterEqualTo: "Maximum column must be greater than or equal to the minimum column."
      },
      minRow: {
        required: "Please enter a minimum row value.",
        number: "Please enter a valid number for the minimum row.",
        range: "Row values must be between -50 and 50."
      },
      maxRow: {
        required: "Please enter a maximum row value.",
        number: "Please enter a valid number for the maximum row.",
        range: "Row values must be between -50 and 50.",
        greaterEqualTo: "Maximum row must be greater than or equal to the minimum row."
      }
    },

    // For the error message where to place
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },

    submitHandler: function (form, event) {
      // prevent actual form submission / page reload
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      // Clear status and previous table
      $status.removeClass("ok err").text("");
      $("#grid").empty();

      // Get numeric values
      var minCol = Number($("#minCol").val());
      var maxCol = Number($("#maxCol").val());
      var minRow = Number($("#minRow").val());
      var maxRow = Number($("#maxRow").val());

      // avoid gigantic tables
      var cols = maxCol - minCol + 1;
      var rows = maxRow - minRow + 1;
      var total = rows * cols;

      if (total > MAX_CELLS) {
        $status
          .addClass("err")
          .text(
            "Error: Range too large."
          );
        return false;
      }

      // Everything is valid: build the table
      buildTable(minCol, maxCol, minRow, maxRow);

      $status
        .addClass("ok")
        .text("Table Generated Successfully!");
      return false; 
    }
  });
});