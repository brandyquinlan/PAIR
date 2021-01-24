$(document).ready(function () {

    // Image slider
    $('.slider').slider({
        full_width: true,
        'height': 500
    });

    // Sidenav for mobile screens
    $('.sidenav').sidenav();

    // Materialbox zoom feature for gallery images
    $('.materialboxed').materialbox();

    // Autocomplete for search box
    // $('.autocomplete').autocomplete({
    //     data: {
    //         "Mexican": null,
    //         "Margarita": null,
    //         "Italian": null,
    //         "Wine": null,
    //         "Chinese": null
    //     }
    // });





    $('.sidenav').sidenav();
    // Sets up Materialize Navbar + Mobile Toggle
    var instance = M.Sidenav.getInstance('.sidenav');








    function saveForLater(item, name) {
        localStorage.setItem(name, JSON.stringify(item));

        $.ajax({
            url: 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + item,
            type: "GET",
            success: function (response) {

                let filtered_keys = (obj, filter) => {
                    let key, keys = []
                    for (key in obj)
                        if (obj.hasOwnProperty(key) && filter.test(key))
                            keys.push(key)
                    return keys;
                };

                let possibleIngredients = filtered_keys(response.drinks[0], /strIngredient/);
                var actualIngredients = [];
                for (var o = 0; o < possibleIngredients.length; o++) {
                    if (response.drinks[0][possibleIngredients[o]] !== null) {
                        actualIngredients.push(response.drinks[0][possibleIngredients[o]]);
                    };
                };
                //getting measurements
                let possibleMeasurements = filtered_keys(response.drinks[0], /strMeasure/);
                var actualMeasurements = [];
                for (var l = 0; l < possibleMeasurements.length; l++) {
                    if (response.drinks[0][possibleMeasurements[l]] !== null) {
                        actualMeasurements.push(response.drinks[0][possibleMeasurements[l]]);
                    };
                };

                // Begin creating all the elements with the necessary information
                var col = $('<div>').attr('class', 'col s4 l2'),
                    card = $('<div>').attr({ 'class': 'card' }),
                    cardImageDiv = $('<div>').attr({ 'class': 'card-image waves-effect waves-block waves-light' }),
                    cardImage = $('<img>').attr({ 'class': 'activator', 'src': response.drinks[0].strDrinkThumb, 'alt': 'image of food' }),

                    cardContent = $('<div>').attr('class', 'card-content'),
                    contentSpan = $('<span>').attr({ 'class': 'activator grey-text text-darken-4 truncate', 'style': 'font-size: 16pt' }).text(response.drinks[0].strDrink),

                    cardReveal = $('<div>').attr('class', 'card-reveal'),
                    revealSpan = $('<span>').attr('class', 'card-title grey-text text-darken-4').text('Quick Look'),
                    revealSpanI = $('<i>').attr('class', 'material-icons right').text('close'),
                    recipeNameH = $('<h6>').attr('id', 'recipeName').text(response.drinks[0].strDrink),
                    hr = $('<hr>'),
                    ul = $('<ul>'),
                    ingredients = $('<ul>').attr({ 'id': 'ingredientReveal' + item, 'style': 'font-weight: bold' }).text('Ingredients: '),
                    br1 = $('<br>'),
                    instructions = $('<li>').attr({ 'id': 'blurbReveal', 'style': 'font-weight: bold' }).text('Instructions: '),
                    instructionsSpan = $('<span>').attr({ 'style': 'font-weight: lighter' }).text(response.drinks[0].strInstructions);

                // Begin appending everything together
                cardImageDiv.append(cardImage);
                cardContent.append(contentSpan);
                instructions.append(instructionsSpan);
                ul.append(ingredients, br1, instructions);
                revealSpan.append(revealSpanI);
                cardReveal.append(revealSpan, recipeNameH, hr, ul);
                card.append(cardImageDiv, cardContent, cardReveal);
                col.append(card);

                $('#saved-for-later').append(col);

                // formatting and listing the ingredients for each drink
                for (let n = 0; n < actualMeasurements.length; n++) {
                    // have to check that null measurements do not show up
                    if (actualMeasurements[n] == null) {
                        var ingredientToList = $('<li>').attr({ 'style': 'font-weight: lighter' }).text(actualIngredients[n]);
                        $('#ingredientReveal' + item).append(ingredientToList);
                    } else {
                        var ingredientToList = $('<li>').attr({ 'style': 'font-weight: lighter' }).text(actualMeasurements[n] + " " + actualIngredients[n]);
                        $('#ingredientReveal' + item).append(ingredientToList);
                    };
                };
                // Accounting for any ingredients that do not have a measurement
                if (actualIngredients.length > actualMeasurements.length) {
                    for (let _ = actualMeasurements.length; _ < actualIngredients.length; _++) {
                        var otherIngredient = $('<li>').attr({ 'style': 'font-weight: lighter' }).text(actualIngredients[_]);
                        $('#ingredientReveal' + item).append(otherIngredient);
                    };
                };
            },
            error: function (error) {
                console.log(error);
            }
        });
    };




















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

                for (var i = 0; i < response.results.length; i++) {

                    // Create all the elements with the information pulled
                    var col = $('<div>').attr('class', 'col s6 l3'),
                        card = $('<div>').attr('class', 'card'),
                        cardImageDiv = $('<div>').attr('class', 'card-image waves-effect waves-block waves-light'),
                        cardImage = $('<img>').attr({ 'class': 'activator', 'src': response.results[i].image, 'alt': 'image of ' + response.results[i].title }),

                        cardContent = $('<div>').attr('class', 'card-content'),
                        contentSpan = $('<span>').attr({ 'class': 'activator grey-text text-darken-4 truncate', 'style': 'font-size: 16pt' }).text(response.results[i].title),
                        // NEED TO PUT 'SAVE FOR LATER' BUTTON HERE
                        saveBtn = $('<button>').attr({ 'id': 'saveForLaterBtn', 'data-id': response.results[i].title, 'name': response.results[i].title, 'class': 'waves-effect btn-flat' }),
                        btnI = $('<i>').attr({ 'class': 'material-icons' }).text('bookmark'),
                        contentJlink = $('<a>').attr({ 'id': 'jumplink', 'href': response.results[i].sourceUrl, 'target': 'blank' }).text("See full recipe"),


                        cardReveal = $('<div>').attr('class', 'card-reveal'),
                        revealSpan = $('<span>').attr('class', 'card-title grey-text text-darken-4').text('Quick Look'),
                        revealSpanI = $('<i>').attr('class', 'material-icons right').text('close'),
                        recipeNameH = $('<h6>').attr({ 'id': 'recipeName' }).text(response.results[i].title),
                        hr = $('<hr>'),
                        ul = $('<ul>'),
                        prepTime = $('<li>').attr({ 'id': 'prepTimeReveal', 'style': 'font-weight: bold' }).text('Total time: '),
                        prepTimeSpan = $('<span>').attr({ 'style': 'font-weight: lighter' }).text(response.results[i].readyInMinutes + ' minutes'),
                        br1 = $('<br>'),
                        ingredients = $('<ul>').attr({ 'id': 'ingredientReveal' + i, 'style': 'font-weight: bold' }).text('Ingredients:'),
                        br2 = $('<br>'),
                        description = $('<li>').attr({ 'id': 'blurbReveal', 'style': 'font-weight: bold' }).text('Description: '),
                        descriptionSpan = $('<span>' + response.results[i].summary + '</span>').attr({ 'style': 'font-weight: lighter' });

                    // Append all the elements together for presentation
                    cardImageDiv.append(cardImage);
                    saveBtn.append(btnI);
                    cardContent.append(contentSpan, saveBtn);
                    prepTime.append(prepTimeSpan);
                    description.append(descriptionSpan);
                    ul.append(prepTime, br1, ingredients, br2, description);
                    revealSpan.append(revealSpanI);
                    cardReveal.append(revealSpan, recipeNameH, contentJlink, hr, ul);
                    card.append(cardImageDiv, cardContent, cardReveal);
                    col.append(card);
                    $('#populate-results').append(col);

                    // now finding, sorting, formatting, and listing all the ingredients for each item
                    function findAllByKey(obj, keyToFind) {
                        return Object.entries(obj).reduce((acc, [key, value]) => (key === keyToFind)
                            ? acc.concat(value)
                            : (typeof value === 'object')
                                ? acc.concat(findAllByKey(value, keyToFind))
                                : acc,
                            [])
                    }
                    var ingredientsList = findAllByKey(response.results[i], 'ingredients');
                    // need to filter for ingredients first, and then use 'name'
                    // was getting an issue where other things in the main object with the key 'name' came up.
                    var ingredients = findAllByKey(ingredientsList, 'name');
                    let ingNoDupes = [...new Set(ingredients)];
                    // formatting the list of ingredients. 
                    for (let j = 0; j < ingNoDupes.length; j++) {
                        var ingredientToList = $('<li>').attr({ 'style': 'font-weight: lighter' }).text(ingNoDupes[j]);
                        $('#ingredientReveal' + i).append(ingredientToList);
                    };
                };
            });
    };




















    // function for creating the html for the results obtained from the search for DRINKS
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
                    var col = $('<div>').attr('class', 'col s6 l3'),
                        card = $('<div>').attr({ 'class': 'card' }),
                        cardImageDiv = $('<div>').attr({ 'class': 'card-image waves-effect waves-block waves-light' }),
                        cardImage = $('<img>').attr({ 'class': 'activator', 'src': response.drinks[i].strDrinkThumb, 'alt': 'image of food' }),

                        cardContent = $('<div>').attr('class', 'card-content'),
                        contentSpan = $('<span>').attr({ 'class': 'activator grey-text text-darken-4 truncate', 'style': 'font-size: 12pt' }).text(response.drinks[i].strDrink),
                        // NEED TO PUT 'SAVE FOR LATER' BUTTON HERE
                        saveBtn = $('<button>').attr({ 'id': 'saveForLaterBtn', 'data-id': response.drinks[i].idDrink, 'name': response.drinks[i].strDrink, 'class': 'waves-effect btn-flat' }),
                        btnI = $('<i>').attr({ 'class': 'material-icons' }).text('bookmark'),

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

                    // Begin appending everything together
                    cardImageDiv.append(cardImage);
                    saveBtn.append(btnI);
                    cardContent.append(contentSpan, saveBtn);
                    instructions.append(instructionsSpan);
                    ul.append(ingredients, br1, instructions);
                    revealSpan.append(revealSpanI);
                    cardReveal.append(revealSpan, recipeNameH, hr, ul);
                    card.append(cardImageDiv, cardContent, cardReveal);
                    col.append(card);

                    $('#populate-results').append(col);

                    // formatting and listing the ingredients for each drink
                    for (let n = 0; n < actualMeasurements.length; n++) {
                        // have to check that null measurements do not show up
                        if (actualMeasurements[n] == null) {
                            var ingredientToList = $('<li>').attr({ 'style': 'font-weight: lighter' }).text(actualIngredients[n]);
                            $('#ingredientReveal' + i).append(ingredientToList);
                        } else {
                            var ingredientToList = $('<li>').attr({ 'style': 'font-weight: lighter' }).text(actualMeasurements[n] + " " + actualIngredients[n]);
                            $('#ingredientReveal' + i).append(ingredientToList);
                        };
                    };
                    // Accounting for any ingredients that do not have a measurement
                    if (actualIngredients.length > actualMeasurements.length) {
                        for (let _ = actualMeasurements.length; _ < actualIngredients.length; _++) {
                            var otherIngredient = $('<li>').attr({ 'style': 'font-weight: lighter' }).text(actualIngredients[_]);
                            $('#ingredientReveal' + i).append(otherIngredient);
                        };
                    };
                };
            });
    };








    $('#results').on('click', 'button', function (event) {
        event.preventDefault();
        var item = $(this).attr('data-id'),
            name = $(this).attr('name');
        saveForLater(item, name);
        var badge = $('<span>').attr({ 'class': 'new badge blue', 'id': 'saved-badge', 'data-badge-caption': 'SAVED!' });
        $(this).append(badge);
        setTimeout(() => {
            $('#saved-badge').remove();
        }, 2000);
    });

    $('#search-cuisines').on('click', getCuisines);
    $('#search-drinks').on('click', getDrinks);


});


