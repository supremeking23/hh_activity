import students_data from "./students_data.js";
import courses_data from "./courses_data.js";



$(document).ready(function(){
    loadAddedCoursesToDOM();
    loadCourses();
  
    loadStudents();
    
    $("#accordion").accordion({ collapsible: true, active: 3 });

    $("#courses_list").sortable({
        // revert: true /*animation when move to new location*/,
    });

    $(".course").draggable({
        connectToSortable: "#courses_list", 
        revert: "invalid",
    });

    $("body")
            .on('click',"#btn_add_course, #btn_cancel_add_course", updateCheckCourse)
            .on("submit", "#course_form", submitCourseForm)
            .on("click", ".courses", checkCourse)
            .on('click', 'td',function(){ 
                console.log("sdsdsd");
            });
    
});



function updateCheckCourse(){ 
    $("#course_form").toggleClass("show").trigger("reset"); 
}

function checkCourse(){
    for(let course = 0; course < courses_data.length; course++){
        if(courses_data[course].id == $(this).val()) courses_data[course].is_selected = !courses_data[course].is_selected;    
    }
}


function loadCourses(){
    let html_template = ``;
  
    for(let course = 0; course < courses_data.length; course++){
        html_template += `<li>`; 
        html_template += `   <label>`;
        html_template += `      <input type="checkbox" class="courses" name="courses" ${(courses_data[course].is_selected) ? "checked" : ""} value="${courses_data[course].id}">`;
        html_template += `      <span></span>`;
        html_template += `      <p>${courses_data[course].course_title}</p>`;
        html_template += `   </label>`;   
        html_template += `</li>`;
    }


    $("#course_list").html(html_template);   
}



function submitCourseForm(){
    let course_form = $(this);  
    let snackbar =  $("#snackbar");  
    let btn_add_course_submit = course_form.find("#btn_add_course_submit");
    let btn_add_course = $("#btn_add_course");
    let courses_added = courses_data.filter((course) => course.is_selected);
    
    if(btn_add_course_submit.text() === "Update"){
        snackbar.find("span").text("Courses and assignments successfully updated.");
    }
    else{
        snackbar.find("span").text("Courses and assignments successfully added.");
    }

    if(courses_added.length > 0) {
        btn_add_course.html(`<img src="./assets/plus.png" alt="plus sign"> Edit Course`);
        btn_add_course_submit.html("Update");
    }
    else {
        btn_add_course.html(`<img src="./assets/plus.png" alt="plus sign"> Add Course`);
        btn_add_course_submit.html("Add");
    }

    $("#add_course_image").hide();
    course_form.trigger("reset");    
    snackbar.addClass("show");
    setTimeout(function(){ snackbar.removeClass("show"); }, 3000);
    course_form.toggleClass("show");
    loadAddedCoursesToDOM();
    loadCourses();

    return false;
}

function loadAddedCoursesToDOM(){
    $("#courses_list").html(addedCourseTemplate(courses_data));
}

function addedCourseTemplate(courses){
    let html_template = ``;
    
   for(let course = 0; course < courses.length; course++) {
       
    if (courses[course].is_selected){
           html_template += `<li class="course">`;
           html_template += `   <h5><img src="./assets/draggable_icon.png" alt="draggable_icon"/> ${courses[course].course_title}</h5>`;
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
            html_template += `</li>`;
       }
   }

   return html_template;
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