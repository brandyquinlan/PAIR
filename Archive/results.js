$(document).ready(function () {

  /* ID names in HTML for tracking:
  
  // Card elements that need targeted API data:
      <span id="recipeName">
      <p id="jumpLink">
      <h6 id="recipeSubName">
      <li id="prepTimeReveal">
      <li id="ingredientReveal">
      <li id="blurbReveal">
  */



  function getCuisines(event) {
    event.preventDefault();

    $('#populate-results').empty();

    var searchVal = $('#search-value').val();
    $.ajax({
      url: "https://api.spoonacular.com/recipes/complexSearch?query=" + searchVal + "&recipes&instructionsRequired=true&addRecipeInformation=true&apiKey=a1307173fd1545b38ed82223156955bd",
      type: "GET",
    })
      .then(function (response) {
        console.log(response);

        for (let i = 0; i < response.results.length; i++) {



          // This seems to be working now, to filter out the ingredients from each recipe pulled
          function findAllByKey(obj, keyToFind) {
            return Object.entries(obj).reduce((acc, [key, value]) => (key === keyToFind)
                ? acc.concat(value)
                : (typeof value === 'object')
                  ? acc.concat(findAllByKey(value, keyToFind))
                  : acc, 
                  [])
          }
          var ingredients = findAllByKey(response.results[i], 'name');
          let ingredientsNOdupes = [...new Set(ingredients)]
          console.log(ingredientsNOdupes);



          var col = $('<div>').attr('class', 'col s6'),
            card = $('<div>').attr('class', 'card'),
            cardImageDiv = $('<div>').attr('class', 'card-image waves-effect waves-block waves-light'),
            cardImage = $('<img>').attr({'class':'activator', 'src': response.results[i].image, 'alt': 'image of food' }),

            cardContent = $('<div>').attr('class', 'card-content'),
            contentSpan = $('<span>').attr('class', 'card-title activator grey-text text-darken-4 truncate').text(response.results[i].title),
            spanI = $('<i>').attr('class', 'material-icons right').text('expand_less'),
            contentJlink = $('<a>').attr({'id':'jumplink','href':response.results[i].sourceUrl,'target':'blank'}).text("Jump to Atricle"),


            cardReveal = $('<div>').attr('class', 'card-reveal'),
            revealSpan = $('<span>').attr('class', 'card-title grey-text text-darken-4').text('Quick Look'),
            revealSpanI = $('<i>').attr('class', 'material-icons right').text('close'),
            recipeNameH = $('<h6>').attr('id', 'recipeName').text(response.results[i].title),
            hr = $('<hr>'),
            ul = $('<ul>'),
            prepTime = $('<li>').attr('id', 'prepTimeReveal').text('Total time: ' + response.results[i].readyInMinutes + ' minutes'),
            br1 = $('<br>'),
            ingredients = $('<li>').attr('id', 'ingredientReveal').text('Ingredients: ' + ingredientsNOdupes),
            br2 = $('<br>'),
            description = $('<li>').attr('id', 'blurbReveal').text('Description: ' + response.results[i].summary),

            addFav = $('<a>').attr('class', 'waves-effect waves-light lime darken-3 btn-small right').text('Add Favorite');

          cardImageDiv.append(cardImage);

          contentSpan.append(spanI);

          cardContent.append(contentSpan, contentJlink);

          ul.append(prepTime, br1, ingredients, br2, description);
          revealSpan.append(revealSpanI);
          cardReveal.append(revealSpan, recipeNameH, hr, ul, addFav);

          card.append(cardImageDiv, cardContent, cardReveal);
          col.append(card);
          $('#populate-results').append(col);
        }

        // Return to top button
        var backtotop = $('<a>').attr({ 'href': '#top', 'class': 'waves-effect waves-light lime darken-3 btn-small right' }).text('Back to Top'),
          buttonDiv = $('<div>').append(backtotop);

        $('#populate-results').append(buttonDiv);
      })

  }

  $('#search-cuisines').on('click', getCuisines)
});
