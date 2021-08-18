import students_data from "./students_data.js";
import courses_data from "./courses_data.js";

let courses_selected = [];

$(document).ready(function(){
    loadStudents();
    loadCourses();
    
    $("#accordion").accordion({ collapsible: true, active: 3 });
    $("#main_display").scroll(detatchedElement);
    $("body")
            .on('click',"#btn_add_course, #btn_cancel_add_course",function () {
                $("#course_form").toggleClass("show");       
            })
            .on("submit","#course_form",submitCourseForm)
            .on("click",".courses",function(){
                let course_id = $(this).val();

                for(let index = 0; index < courses_data.length; index++){
                    if(courses_data[index].id == course_id){
                        courses_selected.push(courses_data[index]);
                    }
                }

                console.log(courses_selected);
            });
    
});

function submitCourseForm(){
    let course_form = $(this);  
    let snackbar =  $("#snackbar");  
    
    course_form.trigger("reset");    
    snackbar.addClass("show");
    setTimeout(function(){ snackbar.removeClass("show"); }, 3000);
    $("#add_course_image").hide();

    loadAddedCourses();
    
    return false;
}

function loadAddedCourses(){
    let html = addedCourseTemplate(courses_selected);
    $("#courses_list").html(html);
}

function addedCourseTemplate(courses) {
    let html_template = ``;
    
   for(let index = 0; index < courses.length;index++) {
        html_template += `<div class="course">`;
        html_template += `   <h5>${courses[index].course_title}</h5>`;
        html_template += `   <table>`;
        html_template += `       <tbody>`;
        html_template += `           <tr>`;
        html_template += `               <td>Algorithm I</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `           </tr>`;
        html_template += `           <tr>`;
        html_template += `               <td>Algorithm I</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `           </tr>`;
        html_template += `           <tr>`;
        html_template += `               <td>Algorithm I</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `           </tr>`;
        html_template += `           <tr>`;
        html_template += `               <td>Algorithm I</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `           </tr>`;
        html_template += `           <tr>`;
        html_template += `               <td>Algorithm I</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `               <td>--</td>`;
        html_template += `           </tr>`;
        html_template += `         </tbody>`;
        html_template += `   </table>`;
        html_template += `</div>`;
   }

   return html_template;
}

function loadCourses() {
    let html = ``;
    
    for(let index = 0; index < courses_data.length; index++){
        html += `<li>`; 
        html += `<input type="checkbox" class="courses" name="courses" value="${courses_data[index].id}"> ${courses_data[index].course_title}`   
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

        let html = `<th>Assignments</th>`;
        
        for(let index = 0; index < students_data.length; index++){
            html += `<th class="tooltip_utility">${students_data[index].last_name}, ${students_data[index].first_name[0]}... 
                <span class="tooltip_utility_text"><img src="${await getCountry(students_data[index].country)}" /> ${students_data[index].last_name}, ${students_data[index].first_name}</span>
            </th>`;
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