import students_data from "./students_data.js";
import courses_data from "./courses_data.js";

let courses_selected = [];

$(document).ready(function(){
    loadStudents();
    loadCourses();
    
    $("#accordion").accordion({ collapsible: true, active: 3 });
    $("body")
            .on('click',"#btn_add_course, #btn_cancel_add_course", function () { $("#course_form").toggleClass("show"); })
            .on("submit", "#course_form", submitCourseForm)
            .on("click", ".courses", checkCourse);
    
});

function checkCourse(){
    for(let course = 0; course < courses_data.length; course++){
        if(courses_data[course].id == $(this).val()){
            courses_selected.push(courses_data[course]);
        }
    }
}



function loadCourses(){
    let html_template = ``;
    
    for(let index = 0; index < courses_data.length; index++){
        html_template += `<li>`; 
        html_template += `   <input type="checkbox" class="courses" name="courses" value="${courses_data[index].id}"> ${courses_data[index].course_title}`   
        html_template += `</li>`;
    }

    $("#course_list").html(html_template);   
}

async function getCountry(country){
    try{
        const response = await axios.get(`https://restcountries.eu/rest/v2/name/${country}`);
        
        return response.data[0].flag;

    } 
    catch (error){}

}

async function loadStudents(){
    try{
        let html_template = `<th>Assignments</th>`;
        
        for(let student = 0; student < students_data.length; student++){
            html_template += `<th class="tooltip_utility">${students_data[student].last_name}, ${students_data[student].first_name[0]}... 
                <span class="tooltip_utility_text"><img src="${await getCountry(students_data[student].country)}" /> ${students_data[student].last_name}, ${students_data[student].first_name}</span>
            </th>`;
        }
        $("#student_row").html(html_template);

    } 
    catch (error){}
}


function submitCourseForm(){
    let course_form = $(this);  
    let snackbar =  $("#snackbar");  
    
    $("#add_course_image").hide();
    course_form.trigger("reset");    
    snackbar.addClass("show");
    setTimeout(function(){ snackbar.removeClass("show"); }, 3000);
    
    loadAddedCourses();
    
    return false;
}

function loadAddedCourses(){
    $("#courses_list").html(addedCourseTemplate(courses_selected));
}

function addedCourseTemplate(courses){
    let html_template = ``;
    
   for(let course = 0; course < courses.length; course++) {
        html_template += `<div class="course">`;
        html_template += `   <h5>${courses[course].course_title}</h5>`;
        html_template += `   <table>`;
        html_template += `       <tbody>`;
      
        for(let assignment = 0; assignment < courses[course].assignments.length; assignment++) {
            html_template += `           <tr>`;
            html_template += `               <td>${courses[course].assignments[assignment]}</td>`;
            
            for(let student = 0; student < students_data.length; student++) {
                html_template += `            <td>--</td>`;
            }
            
            html_template += `           </tr>`;
        }

        html_template += `         </tbody>`;
        html_template += `   </table>`;
        html_template += `</div>`;
   }

   return html_template;
}