
$(document).on("click", ".saveArticle", function(){
    var status = $(this).attr("data-status");
    $(this).attr.("data-status", true)
    console.log(status);

    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
        method: "POST",
        url: "/updates/" + thidId,
        data: {
            saved: true
        }
    })
        .done(function(data){
            console.log(data)
        });
});

$(document).on("click", ".removeFavorite", function(e){
    var thisStatus = $(this).attr("data-status");
    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
        method: "POST",
        url: "/updates/" + thisId + "/" + thisStatus,
        data: {
            saved: false
        }
    })
    .done(function(data){
        console.log(data)
    });
});

$(document).on("click", ".savedNotes", function(e){

    var thisId = $(this).attr("data-id");
    var showSection = "#" + thisId;
    var noteContentId = "#newNote_" + thisId;
    var noteContent = $(noteContentID).val();
    
$.ajax({
    method: "POST",
    url: "/notes/" + thisId,
    data: {
        body: noteContent
    },
})
.done(function(data){
    console.log(data);

    $(showSection).append("<h4 style='margin-top: 20px'>"+ "Saved Notes" + "</h4>")
    $(showSection).append("<p>" + noteContent + "</p>");
    $(showSection).append("<button data-id'" + data._id + "'>Clear Note</button>");
    
    });

}); 

$(document).on("click", ".takeNotes", function(e){
    
    var thisId = $(this).attr("data-id");
    var showSection = "#" + thisId;

    $(showSection).show();

    $.ajax({
        method: "GET", 
        url: "/notes/" + thisId
    })
    .done(function(data){
        console.log(data);

        $(showSection).append("<h4 style='margin-top: 20px; margin-left: 20px'>"+ "Saved Notes" + "</h4>");
        $(showSection).append("<p style='margin-left: 60px'>"+ data.note.body + "</p>");

        $(showSection).append("<button style='margin-left: 20px'data-id='" + data._id + ">Clear Note</button");
    });
});