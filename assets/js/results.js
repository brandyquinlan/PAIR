$(document).ready(function(){
    $('.sidenav').sidenav();
    // Sets up Materialize Navbar + Mobile Toggle
    var instance = M.Sidenav.getInstance('.sidenav');
  });

/* ID names in HTML for tracking:

// Card elements that need targeted API data:
    <span id="recipeName">
    <p id="jumpLink">
    <h6 id="recipeSubName">
    <li id="prepTimeReveal">
    <li id="ingredientReveal">
    <li id="blurbReveal">
*/