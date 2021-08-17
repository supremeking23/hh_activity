$(document).ready(function(){
    $("#accordion").accordion({ collapsible: true, active: 3 });
    $("#main_display").scroll(detatchedElement);

});

function detatchedElement(){
    if($("#main_display").scrollLeft() > 5){
        $("#assignments p").addClass("assigment_scrolling");
    }else {
        $("#assignments p").removeClass("assigment_scrolling");
    }
}