import students_data from "./students_data.js";
import courses_data from "./courses_data.js";

$(document).ready(function(){
    loadStudents();
    loadCourses();
    
    $("#accordion").accordion({ collapsible: true, active: 3 });
    $("#main_display").scroll(detatchedElement);
    $("body").on('click',"#btn_add_course, #btn_cancel_add_course",function () {
        $("#course_form").toggleClass("show");       
    });
});


function loadCourses() {
    let html = ``;
    
    for(let index = 0; index < courses_data.length; index++){
        html += `<li>`; 
        html += `<input type="checkbox" value="${courses_data[index].id}"> ${courses_data[index].course_title}`   
        html += `</li>`;
    }

    $("#course_list").html(html);
    
}

async function getCountry(country) {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/name/${country}`);
        
        return response.data[0].flag;

    } catch (error) {
        console.error(error);
    }

}

async function loadStudents() {
    try {

        let html = ``;
        
        for(let index = 0; index < students_data.length; index++){
            html += `<td class="tooltip_utility">${students_data[index].last_name}, ${students_data[index].first_name[0]}... 
                <span class="tooltip_utility_text"><img src="${await getCountry(students_data[index].country)}" /> ${students_data[index].last_name}, ${students_data[index].first_name}</span>
            </td>`;
        }
        $("#student_row").html(html);

    } catch (error) {
        console.log(error);
    }
}

function detatchedElement(){
    
    if($("#main_display").scrollLeft() > 5) {
        $("#assignments p").addClass("assigment_scrolling");
    }
    else {
        $("#assignments p").removeClass("assigment_scrolling");
    }
}