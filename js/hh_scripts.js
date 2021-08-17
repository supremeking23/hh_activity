import students_data from "./students_data.js";

$(document).ready(function(){
    loadStudents();
    
    $("#accordion").accordion({ collapsible: true, active: 3 });
    $("#main_display").scroll(detatchedElement);
    $("[data-toggle='tooltip']").tooltip();
});


function loadStudents() {
    let html = ``;
    for(let index = 0; index < students_data.length; index++){
        html += `<td class="tooltip_utility">${students_data[index].last_name}, ${students_data[index].first_name[0]}... 
            <span class="tooltip_utility_text">${students_data[index].last_name}, ${students_data[index].first_name}</span>
        </td>`;
    }
    $("#student_row").html(html);
}

function detatchedElement(){
    if($("#main_display").scrollLeft() > 5){
        $("#assignments p").addClass("assigment_scrolling");
    }else {
        $("#assignments p").removeClass("assigment_scrolling");
    }
}