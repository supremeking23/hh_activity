import students_data from "./students_data.js";
import courses_data from "./courses_data.js";
import notes_data from "./notes_data.js";

/* Hack */
const default_user = {
    "account_type": "admin",
    "account_id": 111,
    "sender": "Ivan Christian Jay",
};

$(document).ready(function(){
    loadAddedHHCoursesToDOM();                                                                      /* load courses that is selected by the user to the DOM */
    loadAllHHCoursesToDOM();                                                                        /* load all courses from the database and display it to the DOM */
    loadHHStudents();                                                                               /* load all students to the DOM */
    
    $("#accordion").accordion({ collapsible: true, active: 3 });                                    /* accordion behaviour, use in aside element */
    $("#courses_list").sortable();                                                                  /* Sortable  behaviour, use in sorting course group*/

    $("body")
            .on("click","#btn_add_course, #btn_cancel_add_course", loadHHCourses)                   /* this function is responsible for showing and hiding the course form */
            .on("submit", "#course_form", submitHHCourseForm)                                       /* this function is responsible for adding/updating courses */
            .on("click", ".courses", checkHHCourseAction)                                           /* this function is responsible for  checking and unchecking the the course's checkbox */
            .on("click",'.students_assignment_cell', showModalInStudentCell)                        /* this function is responsible for showing up a modal where user can write comment to students assigment */
            .on("submit", "#add_assigment_note_form", submitAddAssignmentNoteForm)                  /* this function is responsible for adding new note for a student assignment */
            .on("hidden.bs.modal","#add_assignment_note_modal", hideAssignmentNoteModal)           /* this function is responsible for closing the add_assignment_note_modal */
            .on("keyup", "#add_assigment_note_form textarea", function(e){
               let add_assignment_note_textarea = $(this);
               $("#number_of_words span").text(`${add_assignment_note_textarea.val().length}/500`);

               if(add_assignment_note_textarea.val().length > 500){
                   add_assignment_note_textarea.addClass("error");
               }
               else{
                   add_assignment_note_textarea.removeClass("error");
               }
            });
});


/**
* DOCU: This function is used to close and reset form in add_assignment_note_modal <br>
* Triggered: .on('hidden.bs.modal',"#add_assignment_note_modal", hideAssignmentNoteModal) <br>
* Last Updated Date: August 25, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function hideAssignmentNoteModal(){
    let add_assignment_note_modal = $("#add_assignment_note_modal");
    dd_assignment_note_modal.find("textarea").removeClass("error");
    add_assignment_note_modal.find("form").trigger("reset");
    a
}

/**
* DOCU: This function is used to submit note written by a user for student assignment. <br>
* Triggered: .on("submit", "#add_assigment_note_form", submitAddAssignmentNoteForm) <br>
* Last Updated Date: August 25, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function submitAddAssignmentNoteForm() {
    let snackbar =  $("#snackbar");
    const find_note = notes_data.filter((note) => note.id === parseInt($("#note_id").val())); 
    const {replies} = find_note[0];

    replies.unshift({
        ...default_user,
        "reply_body": $("textarea").val(),
    });

    let list_of_replies = replyNoteHTMLTemplate(replies);

    snackbar.find("span").text("Note successfully added.");
    snackbar.addClass("show");
    /* remove the class show from snackbar after 3 seconds */
    setTimeout(() => { 
        snackbar.removeClass("show"); 
    }, 3000);
    
    $(this).trigger("reset");
    // $("#add_assignment_note_modal").modal("hide");
    $("#list_of_notes").html(list_of_replies);
    return false;
}

/**
* DOCU: This function is used to show a modal where user can write a comment to a students assignment. <br>
* This function also has a behavior when a table row is hovered or clicked it will change its style <br>
* Triggered: .on('click','td', showModalInStudentCell); <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function showModalInStudentCell(){ 
    let output_table_data = $(this);
    console.log(output_table_data.data("student_id"));
    output_table_data.closest("tr").siblings().removeClass("active");                           
    output_table_data.closest("li").siblings().find("tr").removeClass("active");                
    output_table_data.closest("tr").addClass("active");  
    
    /* use to find student that matches the value of student_id data attribute */
    const find_student = students_data.filter((student) => student.id === parseInt(output_table_data.data("student_id")));
     /* object destructing of the find_student[0]*/
    const {first_name, last_name } = find_student[0];

    /* use to find notes that matches the value of student_id,course_id and assignment_id data attribute */
    const find_note = notes_data.filter((note) => {
        if(note.account_id === parseInt(output_table_data.data("student_id")) &&  
          note.course_id === parseInt(output_table_data.data("course_id")) && 
          note.assignment_id === parseInt(output_table_data.data("assignment_id"))){
            return note;
        }
    });

    /* object destructing of the find_note[0] */
    const {file_name, note_body, replies, id} = find_note[0]; 
    let add_assignment_note_modal = $("#add_assignment_note_modal");

    /* assign what is being returned form replyNoteHTMLTemplate(replies) to variable list_of_replies */
    let list_of_replies = replyNoteHTMLTemplate(replies);
    
    $("#list_of_notes").html(list_of_replies);
    add_assignment_note_modal.find("#student_name").text(`${first_name} ${last_name}`);
    add_assignment_note_modal.find("a").attr("href","javascript:void(0)").html(`<img src="./assets/file.png"/> ${file_name} <img src="./assets/download.png"/>`);
    add_assignment_note_modal.find("#student_note").text(`${note_body}`); 
    add_assignment_note_modal.find("#note_id").val(`${id}`); 
}

/**
* DOCU: This function is used to generating reply notes. <br>
* Triggered: showModalInStudentCell(), submitAddAssignmentNoteForm() <br>
* Last Updated Date: August 25, 2021
* @param {array} replies Requires: replies array 
* @function
* @return {reply_template} 
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function replyNoteHTMLTemplate(replies){
    let reply_template = ``;

    for(let reply of replies) {
        reply_template += `<div class="note">`;
        reply_template += `  <p><img src="./assets/profile.png"/><span>${reply.sender}</span>'s note <span class="note_time">1 minute ago</span></p> `;
        reply_template += `  <div id="note_body"> ${reply.reply_body} </div>`;
        reply_template += `  <button type="button">Reply</button>`;     
        reply_template += `</div>`;    
    }

    return reply_template;
}

/**
* DOCU: This function is used to hide/show the course_form popover and reset the form <br>
* Triggered: .on('click',"#btn_add_course, #btn_cancel_add_course", loadHHCourses)  <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function loadHHCourses(){ 
    $("#course_form").toggleClass("show").trigger("reset"); 
}

/**
* DOCU: This function is used to check and unchecked the courses in the course_form <br>
* Triggered: .on("click", ".courses", checkHHCourseAction) <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function checkHHCourseAction(){

    /* loop over the courses_data array */
    for(let course of courses_data){
        
        /* if the course.id is equal to the check course id, then change the is_selected value to either true or false */
        if(course.id == $(this).val()) course.is_selected = !course.is_selected;
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
function loadAllHHCoursesToDOM(){
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
* Triggered: .on("submit", "#course_form", submitHHCourseForm) <br>
* Last Updated Date: August 24, 2021
* @function
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function submitHHCourseForm(){
    let save_course_form = $(this);  
    let snackbar =  $("#snackbar");  
    let btn_add_course_submit = save_course_form.find("#btn_add_course_submit");
    let btn_add_course = $("#btn_add_course");
    let courses_added = courses_data.filter((course) => course.is_selected);

    snackbar.find("span").text("Courses and assignments successfully " + ((btn_add_course_submit.text() === "Update") ? "updated." : "added."));
    btn_add_course.html(`<img src="./assets/plus.png" alt="plus sign"> ${(courses_added.length > 0) ? "Edit Course" : "Add Course"}`);
    btn_add_course_submit.html(`<img src="./assets/plus.png" alt="plus sign"> ${(courses_added.length > 0) ? "Update" : "Add"}`);
    save_course_form.trigger("reset").toggleClass("show");  
    
    /* load all courses from the database and display it to the DOM */
    loadAddedHHCoursesToDOM();

    /* load all courses from the database and display it to the DOM */
    loadAllHHCoursesToDOM();

    $("#add_course_image").hide();
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
function loadAddedHHCoursesToDOM(){
    $("#courses_list").html(addedCourseTemplate(courses_data));
}

/**
* DOCU: This function is used to append all course to #courses_list and load it to the DOM <br>
* Triggered: loadAddedHHCoursesToDOM() <br>
* Last Updated Date: August 24, 2021
* @param {array} courses_data Requires: courses_data array 
* @function
* @return {html_template} 
* @memberOf Hacker Hero SpreadSheet Activity
* @author Ivan Christian Jay
*/
function addedCourseTemplate(courses){
    let html_template = ``;
    
    /* will loop thru all courses */
    for(let course_index = 0; course_index < courses.length; course_index++){ 
    
        /* will check if a specific course is selected; if true it will add it to the hmtl_template variable  */
        if(courses[course_index].is_selected){ 
           html_template += `<li class="course">`;
           html_template += `   <h5><img src="./assets/draggable_icon.png" alt="draggable_icon"/> ${courses[course_index].course_title}</h5>`;
           html_template += `   <table>`;
           html_template += `       <tbody>`;

            /* will loop through all assignments on a specific course*/
           for(let assignment_index = 0; assignment_index < courses[course_index].assignments.length; assignment_index++){ // add comment dito
               html_template += `           <tr>`;
               html_template += `               <td>${courses[course_index].assignments[assignment_index].assignment}</td>`;
                
               /* will loop thru all students; in every single assigments, it will produce n number of students */
               for(let student_index = 0; student_index < students_data.length; student_index++){

                   /*  HACK: Temporary solution for generating wheather student has an output or none*/
                   let has_output = Math.floor(Math.random() * 2);
                   
                   html_template += `           <td class="students_assignment_cell" data-student_id="${students_data[student_index].id}" 
                                                    data-course_id="${courses[course_index].id}"  
                                                    data-assignment_id="${courses[course_index].assignments[assignment_index].id}"  
                                                    data-toggle="modal" data-target=".modal">
                                                    ${(has_output === 0) ? "--" : "5/28/21"}
                                                </td>`;
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
* Triggered: loadHHStudents() <br>
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
async function loadHHStudents(){
    try{
        let html_template = `<th>Assignments</th>`;
        
        for(let student_index = 0; student_index < students_data.length; student_index++){
            html_template += `<th class="tooltip_utility">${students_data[student_index].last_name}, ${students_data[student_index].first_name[0]}... 
                <span class="tooltip_utility_text"><img src="${await getCountry(students_data[student_index].country)}" /> ${students_data[student_index].last_name}, ${students_data[student_index].first_name}</span>
            </th>`;
        }
        $("#student_row").html(html_template);
    } 
    catch (error){}
}