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

  

  function getResults(event) {
    event.preventDefault();

    $('#populate-results').empty();

    var searchVal = $('input').val();
    $.ajax({
      url: "https://api.spoonacular.com/recipes/complexSearch?query="+searchVal+"&recipes&instructionsRequired=true&addRecipeInformation=true&apiKey=a1307173fd1545b38ed82223156955bd",
      type: "GET",
    })
      .then(function (response) {
        console.log(response);
        
        for (let i = 0; i < response.results.length; i++) {
          var col = $('<div>').attr('class', 'col s6'),
            card = $('<div>').attr('class', 'card'),
            cardImageDiv = $('<div>').attr('class', 'card-image waves-effect waves-block waves-light'),
            cardImage = $('<img>').attr({ 'src': response.results[i].image, 'alt': 'image of food' }),
    
            cardContent = $('<div>').attr('class', 'card-content'),
            contentSpan = $('<span>').attr('class', 'card-title activator grey-text text-darken-4 truncate').text(response.results[i].title),
            spanI = $('<i>').attr('class', 'material-icons right'),
            contentJlink = $('<p>').attr('id', 'jumplink').text("Jump to Atricle"),
            jLinkHREF = $('<a>').attr('href', '#'),
    
            cardReveal = $('<div>').attr('class', 'card-reveal'),
            revealSpan = $('<span>').attr('class', 'card-title grey-text text-darken-4').text('Quick Look'),
            revealSpanI = $('<i>').attr('class', 'material-icons right').text('close'),
            recipeNameH = $('<h6>').attr('id', 'recipeName'),
            hr = $('<hr>'),
            ul = $('<ul>'),
            prepTime = $('<li>').attr('id', 'prepTimeReveal').text('Total time: ' + response.results[i].readyInMinutes + ' minutes'),
            br1 = $('<br>'),
            ingredients = $('<li>').attr('id', 'ingredientReveal').text('Ingredients: ' + "var here"),
            br2 = $('<br>'),
            description = $('<li>').attr('id', 'blurbReveal').text('Description: ' + response.results[i].summary),
    
            addFav = $('<a>').attr('class', 'waves-effect waves-light lime darken-3 btn-small right').text('Add Favorite');
    
          cardImageDiv.append(cardImage);
    
          contentSpan.append(spanI);
          contentJlink.append(jLinkHREF);
          cardContent.append(contentSpan, contentJlink);
    
          ul.append(prepTime, br1, ingredients, br2, description);
          revealSpan.append(revealSpanI);
          cardReveal.append(revealSpan, recipeNameH, hr, ul, addFav);
    
          card.append(cardImageDiv, cardContent, cardReveal);
          col.append(card);
          $('#populate-results').append(col);
        }
        var backtotop = $('<a>').attr({'href':'#top','class':'waves-effect waves-light lime darken-3 btn-small right'}).text('Back to Top'),
            buttonDiv = $('<div>').append(backtotop);

            $('#populate-results').append(buttonDiv);
      })
   
  }

  $('#search').on('click', getResults)
});
