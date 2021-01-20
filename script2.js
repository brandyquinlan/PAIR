$(document).ready(function() {
    
    //spoonacular API call => API key: a1307173fd1545b38ed82223156955bd

    $("button").click(function(event) {

        searchQuery = $("#autocomplete-input").val().trim();
        console.log(searchQuery);

    $.ajax({
        url: "https://api.spoonacular.com/recipes/complexSearch?query=" + searchQuery + "&recipes&instructionsRequired=true&addRecipeInformation=true&apiKey=a1307173fd1545b38ed82223156955bd",
        type: "GET",
        // dataType: "jsonp",
    })
    .then(function(response) {
        console.log(response);
    })
})

    // Materialize Autocomplete
    var ac = document.querySelector('.autocomplete');
    var instance = new M.Autocomplete(ac);
    // $(document).ready(function() {
    $('.autocomplete').autocomplete({
        data: {
            "Mexican": null,
            "Margarita": null,
            "Italian": null,
            "Wine": null,
            "Chinese": null
        }
    });
    // });

    // Material Boxed
    var mb = document.querySelectorAll('.materialboxed');
    var instance = new M.Materialbox(mb);
    // $(document).ready(function() {
    $('.mb').mb();
    // });

    // $(document).ready(function() {
    $(".iris").click(function() {
        document.body.style.section.backgroundImage = 'url("assets/img/Carousel_2.jpg")';
    });
});