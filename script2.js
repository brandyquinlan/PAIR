$(document).ready(function () {

    //spoonacular API call => API key: a1307173fd1545b38ed82223156955bd

    $("#cuisineSearch").click(function (event) {
        event.preventDefault();

        searchQuery = $("#autocomplete-input").val();
        console.log(searchQuery);

    $.ajax({
        url: "https://api.spoonacular.com/recipes/complexSearch?query=" + searchQuery + "&recipes&instructionsRequired=true&addRecipeInformation=true&apiKey=a1307173fd1545b38ed82223156955bd",
        type: "GET",

    })
    .then(function(response) {
        console.log(response);
        // console.log(response.results[0].analyzedInstructions[0].steps[0].step);

        function findAllByKey(obj, keyToFind) {
            return Object.entries(obj)
              .reduce((acc, [key, value]) => (key === keyToFind)
                ? acc.concat(value)
                : (typeof value === 'object')
                ? acc.concat(findAllByKey(value, keyToFind))
                : acc
              , [])
          }
          // USAGE
          console.log(findAllByKey(response, 'name'));
    })
    
})

    // Materialize Autocomplete
    $('.autocomplete').autocomplete({
        data: {
            "Margarita": null,
            "Italian": null,
            "Wine": null,
            "Chinese": null
        }
    });

    // Material Boxed
    var mb = document.querySelectorAll('.materialboxed');
    var instance = new M.Materialbox(mb);

    $('.mb').mb();


    // $(document).ready(function() {
    $(".iris").click(function () {
        document.body.style.section.backgroundImage = 'url("assets/img/Carousel_2.jpg")';
    });
});