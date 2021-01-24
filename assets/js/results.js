$(document).ready(function () {

  $('.sidenav').sidenav();
  // Sets up Materialize Navbar + Mobile Toggle
  var instance = M.Sidenav.getInstance('.sidenav');

  /* ID names in HTML for tracking:
  
  // Card elements that need targeted API data:
      <span id="recipeName">
      <p id="jumpLink">
      <h6 id="recipeSubName">
      <li id="prepTimeReveal">
      <li id="ingredientReveal">
      <li id="blurbReveal">
  */


  // function for creating the html for the results obtained from the search for FOOD
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
          var ingredientsList = findAllByKey(response.results[i], 'ingredients');
          // need to filter for ingredients first, and then use name
          // was getting an issue where other things in the main object with the key 'name' came up.
          var ingredients = findAllByKey(ingredientsList, 'name');
          let ingNoDupes = [...new Set(ingredients)];
          // formatting the list of ingredients. 
          let ingredientsArr = [];
          for (let j = 0; j < ingNoDupes.length; j++) {
            ingredientsArr.push(ingNoDupes[j]);
          }



          var col = $('<div>').attr('class', 'col s6 l4'),
            card = $('<div>').attr('class', 'card'),
            cardImageDiv = $('<div>').attr('class', 'card-image waves-effect waves-block waves-light'),
            cardImage = $('<img>').attr({ 'class': 'activator', 'src': response.results[i].image, 'alt': 'image of ' + response.results[i].title }),

            cardContent = $('<div>').attr('class', 'card-content'),
            contentSpan = $('<span>').attr({ 'class': ' activator grey-text text-darken-4 truncate', 'style': 'font-size: 12pt' }).text(response.results[i].title),
            // NEED TO PUT 'SAVE FOR LATER' BUTTON HERE
            spanI = $('<i>').attr('class', 'material-icons').text('expand_less'),
            contentJlink = $('<a>').attr({ 'id': 'jumplink', 'href': response.results[i].sourceUrl, 'target': 'blank' }).text("See full recipe"),


            cardReveal = $('<div>').attr('class', 'card-reveal'),
            revealSpan = $('<span>').attr('class', 'card-title grey-text text-darken-4').text('Quick Look'),
            revealSpanI = $('<i>').attr('class', 'material-icons right').text('close'),
            recipeNameH = $('<h6>').attr({ 'id': 'recipeName' }).text(response.results[i].title),
            hr = $('<hr>'),
            ul = $('<ul>'),
            prepTime = $('<li>').attr('id', 'prepTimeReveal').text('Total time: ' + response.results[i].readyInMinutes + ' minutes'),
            br1 = $('<br>'),
            ingredients = $('<li>').attr('id', 'ingredientReveal').text('Ingredients: ' + ingredientsArr),
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

          // clear out the ingredients array so they don't overflow to the next item
          ingredientsArr = [];
        }

        // Return to top button
        var backtotop = $('<a>').attr({ 'href': '#top', 'class': 'waves-effect waves-light lime darken-3 btn-small right' }).text('Back to Top'),
          buttonDiv = $('<div>').append(backtotop);

        $('#populate-results').append(buttonDiv);
      })
  }

  function getDrinks(event) {
    event.preventDefault();



    $('#populate-results').empty();

    var searchVal = $('#search-value').val();
    $.ajax({
      url: "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + searchVal,
      type: "GET",
    })
      .then(function (response) {
        console.log(response);

        for (let i = 0; i < response.drinks.length; i++) {


          // This seems to be working now, to filter out the ingredients from each recipe pulled
          // function findAllByKey(obj, keyToFind) {
          //   return Object.entries(obj).reduce((acc, [key, value]) => (key === keyToFind)
          //       ? acc.concat(value)
          //       : (typeof value === 'object')
          //         ? acc.concat(findAllByKey(value, keyToFind))
          //         : acc, 
          //         [])
          // }
          // var ingredients = findAllByKey(response.drinks[i], 'name');
          // let ingNoDupes = [...new Set(ingredients)]
          // console.log(ingNoDupes);


          // getting ingredients
          let filtered_keys = (obj, filter) => {
            let key, keys = []
            for (key in obj)
              if (obj.hasOwnProperty(key) && filter.test(key))
                keys.push(key)
            return keys;
          };
          // example:
          let possibleIngredients = filtered_keys(response.drinks[i], /strIngredient/);
          var actualIngredients = [];
          for (var o = 0; o < possibleIngredients.length; o++) {
            if (response.drinks[0][possibleIngredients[o]] !== null) {
              actualIngredients.push(response.drinks[i][possibleIngredients[o]]);
            };
          };
          //getting measurements
          let possibleMeasurements = filtered_keys(response.drinks[i], /strMeasure/);
          var actualMeasurements = [];
          for (var l = 0; l < possibleMeasurements.length; l++) {
            if (response.drinks[0][possibleMeasurements[l]] !== null) {
              actualMeasurements.push(response.drinks[i][possibleMeasurements[l]]);
            };
          };

          // Begin creating all the elements with the necessary information
          var col = $('<div>').attr('class', 'col s6 l4'),
            card = $('<div>').attr('class', 'card'),
            cardImageDiv = $('<div>').attr('class', 'card-image waves-effect waves-block waves-light'),
            cardImage = $('<img>').attr({ 'class': 'activator', 'src': response.drinks[i].strDrinkThumb, 'alt': 'image of food' }),

            cardContent = $('<div>').attr('class', 'card-content'),
            contentSpan = $('<span>').attr({ 'class': 'activator grey-text text-darken-4 truncate', 'style': 'font-size: 12pt' }).text(response.drinks[i].strDrink),
            // NEED TO PUT 'SAVE FOR LATER' BUTTON HERE
            spanI = $('<i>').attr('class', 'material-icons right').text('expand_less'),


            cardReveal = $('<div>').attr('class', 'card-reveal'),
            revealSpan = $('<span>').attr('class', 'card-title grey-text text-darken-4').text('Quick Look'),
            revealSpanI = $('<i>').attr('class', 'material-icons right').text('close'),
            recipeNameH = $('<h6>').attr('id', 'recipeName').text(response.drinks[i].strDrink),
            hr = $('<hr>'),
            ul = $('<ul>'),
            ingredients = $('<ul>').attr({ 'id': 'ingredientReveal' + i, 'style': 'font-weight: bold' }).text('Ingredients: '),
            br1 = $('<br>'),
            instructions = $('<li>').attr({ 'id': 'blurbReveal', 'style': 'font-weight: bold' }).text('Instructions: '),
            instructionsSpan = $('<span>').attr({ 'style': 'font-weight: lighter' }).text(response.drinks[i].strInstructions);

          addFav = $('<a>').attr('class', 'waves-effect waves-light lime darken-3 btn-small right').text('Add Favorite');

          // Begin appending everything together
          cardImageDiv.append(cardImage);
          contentSpan.append(spanI);
          cardContent.append(contentSpan);
          instructions.append(instructionsSpan);
          ul.append(ingredients, br1, instructions);
          revealSpan.append(revealSpanI);
          cardReveal.append(revealSpan, recipeNameH, hr, ul, addFav);

          card.append(cardImageDiv, cardContent, cardReveal);
          col.append(card);

          $('#populate-results').append(col);

          // formatting and listing the ingredients for each drink
          for (let n = 0; n < actualMeasurements.length; n++) {
            var ingredientToList = $('<li>').attr({ 'style': 'font-weight: lighter' }).text(actualMeasurements[n] + " " + actualIngredients[n]);
            $('#ingredientReveal' + i).append(ingredientToList);
          };
          // Accounting for any ingredients that do not have a measurement
          if (actualIngredients.length > actualMeasurements.length) {
            for (let _ = actualMeasurements.length; _ < actualIngredients.length; _++) {
              var otherIngredient = $('<li>').attr({ 'style': 'font-weight: lighter' }).text(actualIngredients[_]);
              $('#ingredientReveal' + i).append(otherIngredient);
            };
          };


        }

        // Return to top button
        var backtotop = $('<a>').attr({ 'href': '#top', 'class': 'waves-effect waves-light lime darken-3 btn-small right' }).text('Back to Top'),
          buttonDiv = $('<div>').append(backtotop);

        $('#populate-results').append(buttonDiv);
      })
  }

  $('#search-cuisines').on('click', getCuisines);
  $('#search-drinks').on('click', getDrinks);
});
