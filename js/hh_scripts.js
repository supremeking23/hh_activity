import students_data from "./students_data.js";
import courses_data from "./courses_data.js";

$(document).ready(function(){
    loadAddedCoursesToDOM();                                                                    /* load courses that is selected by the user to the DOM */
    loadAllCoursesToDOM();                                                                      /* load all courses from the database and display it to the DOM */
    loadGlobalStudents();                                                                       /* load all students to the DOM */
    
    $("#accordion").accordion({ collapsible: true, active: 3 });                                /* accordion behaviour, use in aside element */
    $("#courses_list").sortable();                                                              /* Sortable  behaviour, use in sorting course group*/

    // $(".course").draggable({ connectToSortable: "#courses_list", revert: "invalid" });

    $("body")
            .on('click',"#btn_add_course, #btn_cancel_add_course", showAllCourses)              /* this function is responsible for showing and hiding the course form */
            .on("submit", "#course_form", submitCourseForm) //change name
            .on("click", ".courses", checkCourseAction)                                         /* this function is responsible for  checking and unchecking the the course's checkbox */
            .on('click','td', addCommentToStudentAssignment);                                   /* this function is responsible for showing up a modal where user can write comment to students assigment */
    
});

/**
* DOCU: This function is used to show a modal where user can write a comment to a students assignment. <br>
* This function also has a behavior when a table row is hovered or clicked it will change its style <br>
* Triggered: .on('click','td', addCommentToStudentAssignment); <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function addCommentToStudentAssignment(){ 
    let output_table_data = $(this);
    output_table_data.closest("tr").siblings().removeClass("active");                           /* remove the class active to the previously selected or hovered table row */
    output_table_data.closest("li").siblings().find("tr").removeClass("active");                /* remove the class active to the previously selected or hovered table row on different course group */
    output_table_data.closest("tr").addClass("active");                                         /* add the class active to the current selected or hovered table row */
    
}

/**
* DOCU: This function is used to hide/show the course_form popover and reset the form <br>
* Triggered: .on('click',"#btn_add_course, #btn_cancel_add_course", showAllCourses)  <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function showAllCourses(){ 
    $("#course_form").toggleClass("show").trigger("reset"); 
}

/**
* DOCU: This function is used to check and unchecked the courses in the course_form <br>
* Triggered: .on("click", ".courses", checkCourseAction) <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function checkCourseAction(){
    for(let course_index = 0; course_index < courses_data.length; course_index++){
        if(courses_data[course_index].id == $(this).val()) courses_data[course_index].is_selected = !courses_data[course_index].is_selected;   
    }
}

/**
* DOCU: This function is used to check and unchecked the courses in the course_form <br>
* Triggered: $(document).ready(function(){}); <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function loadAllCoursesToDOM(){
    let html_template = ``;
  
    for(let course_index = 0; course_index < courses_data.length; course_index++){
        html_template += `<li>`; 
        html_template += `   <label>`;
        html_template += `      <input type="checkbox" class="courses" name="courses" ${(courses_data[course_index].is_selected) ? "checked" : ""} value="${courses_data[course_index].id}">`;
        html_template += `      <span></span>`;
        html_template += `      <p>${courses_data[course_index].course_title}</p>`;
        html_template += `   </label>`;   
        html_template += `</li>`;
    }

    $("#course_list").html(html_template);   
}


/**
* DOCU: This function is used to submit the selected or unselected courses <br>
* Triggered: .on("submit", "#course_form", submitCourseForm) <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function submitCourseForm(){
    let save_course_form = $(this);  
    let snackbar =  $("#snackbar");  
    let btn_add_course_submit = save_course_form.find("#btn_add_course_submit");
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
    
    save_course_form.trigger("reset").toggleClass("show");;    
    
    loadAddedCoursesToDOM();
    loadAllCoursesToDOM();
    
    snackbar.addClass("show");
    /* remove the class show from snackbar after 3 seconds */
    setTimeout(() => { 
        snackbar.removeClass("show"); 
    }, 3000);

    return false;
}

/**
* DOCU: This function is used to append all course to #courses_list and load it to the DOM <br>
* Triggered: $(document).ready(function(){}); <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function loadAddedCoursesToDOM(){
    $("#courses_list").html(addedCourseTemplate(courses_data));
}

/**
* DOCU: This function is used to append all course to #courses_list and load it to the DOM <br>
* Triggered: $(document).ready(function(){}); <br>
* Last Updated Date: August 24, 2021
* @param {array} courses_data Requires: courses_data array 
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function addedCourseTemplate(courses){
    let html_template = ``;
    
    for(let course_index = 0; course_index < courses.length; course_index++){ // add comment (add index as suffix name ex: course_index)
    
        if(courses[course_index].is_selected){ // add comment dito
           html_template += `<li class="course">`;
           html_template += `   <h5><img src="./assets/draggable_icon.png" alt="draggable_icon"/> ${courses[course_index].course_title}</h5>`;
           html_template += `   <table>`;
           html_template += `       <tbody>`;

           for(let assignment_index = 0; assignment_index < courses[course_index].assignments.length; assignment_index++) { // add comment dito
               html_template += `           <tr>`;
               html_template += `               <td>${courses[course_index].assignments[assignment_index]}</td>`;
                
               for(let student_id = 0; student_id < students_data.length; student_id++) { //add comment dito
                   let has_output = Math.floor(Math.random() * 2);
                   html_template += `            <td>${(has_output === 0) ? "--" : "5/28/21"}</td>`;
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

/**
* DOCU: This function is used to fetch country flag from https://restcountries.eu/ <br>
* Triggered: loadGlobalStudents() <br>
* Last Updated Date: August 24, 2021
* @param {obj} student.country Requires: student object 
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
async function getCountry(country){
    try{
        const response = await axios.get(`https://restcountries.eu/rest/v2/name/${country}`);
        
        return response.data[0].flag;
    } 
    catch (error){}

}

/**
* DOCU: This function is used to load all students in to the DOM <br>
* Triggered: $(document).ready(function(){}); <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
async function loadGlobalStudents(){
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