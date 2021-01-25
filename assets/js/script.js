$(document).ready(function () {
    // Image slider
    $(".slider").slider({
        indicators: false,
        full_width: true,
        height: 333,
    });

    $(".fixed-action-btn").floatingActionButton();

    // function for creating the html for the results obtained from the search for FOOD
    function getCuisines(event) {
        event.preventDefault();

        $("#populate-results").empty();

        var searchVal = $("#user-search-food").val();
        $.ajax({
            url:
                "https://api.spoonacular.com/recipes/complexSearch?query=" +
                searchVal +
                "&recipes&instructionsRequired=true&addRecipeInformation=true&apiKey=a1307173fd1545b38ed82223156955bd",
            type: "GET",
        }).then(function (response) {
            console.log(response);

            for (var i = 0; i < response.results.length; i++) {
                // Create all the elements with the information pulled
                var col = $("<div>").attr("class", "col s6 l3"),
                    card = $("<div>").attr("class", "card"),
                    cardImageDiv = $("<div>").attr(
                        "class",
                        "card-image waves-effect waves-block waves-light"
                    ),
                    cardImage = $("<img>").attr({
                        class: "activator",
                        src: response.results[i].image,
                        alt: "image of " + response.results[i].title,
                    }),
                    cardContent = $("<div>").attr("class", "card-content"),
                    contentSpan = $("<span>")
                        .attr({
                            class: "activator grey-text text-darken-4 truncate",
                            style: "font-size: 16pt",
                        })
                        .text(response.results[i].title),
                    saveBtn = $("<button>").attr({
                        id: "saveForLaterBtn",
                        "data-id": response.results[i].title,
                        name: "food",
                        class: "waves-effect btn-flat",
                    }),
                    btnI = $("<i>").attr({ class: "material-icons" }).text("bookmark"),
                    contentJlink = $("<a>")
                        .attr({
                            id: "jumplink",
                            href: response.results[i].sourceUrl,
                            target: "blank",
                        })
                        .text("See full recipe"),
                    cardReveal = $("<div>").attr("class", "card-reveal"),
                    revealSpan = $("<span>")
                        .attr("class", "card-title grey-text text-darken-4")
                        .text("Quick Look"),
                    revealSpanI = $("<i>")
                        .attr("class", "material-icons right")
                        .text("close"),
                    recipeNameH = $("<h6>")
                        .attr({ id: "recipeName" })
                        .text(response.results[i].title),
                    hr = $("<hr>"),
                    ul = $("<ul>"),
                    prepTime = $("<li>")
                        .attr({ id: "prepTimeReveal", style: "font-weight: bold" })
                        .text("Total time: "),
                    prepTimeSpan = $("<span>")
                        .attr({ style: "font-weight: lighter" })
                        .text(response.results[i].readyInMinutes + " minutes"),
                    br1 = $("<br>"),
                    ingredients = $("<ul>")
                        .attr({ id: "ingredientReveal" + i, style: "font-weight: bold" })
                        .text("Ingredients:"),
                    br2 = $("<br>"),
                    description = $("<li>")
                        .attr({ id: "blurbReveal", style: "font-weight: bold" })
                        .text("Description: "),
                    descriptionSpan = $(
                        "<span>" + response.results[i].summary + "</span>"
                    ).attr({ style: "font-weight: lighter" });

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
                $("#populate-results").append(col);

                // now finding, sorting, formatting, and listing all the ingredients for each item
                function findAllByKey(obj, keyToFind) {
                    return Object.entries(obj).reduce(
                        (acc, [key, value]) =>
                            key === keyToFind
                                ? acc.concat(value)
                                : typeof value === "object"
                                    ? acc.concat(findAllByKey(value, keyToFind))
                                    : acc,
                        []
                    );
                }
                var ingredientsList = findAllByKey(response.results[i], "ingredients");
                // need to filter for ingredients first, and then use 'name'
                // was getting an issue where other things in the main object with the key 'name' came up.
                var ingredients = findAllByKey(ingredientsList, "name");
                let ingNoDupes = [...new Set(ingredients)];
                // formatting the list of ingredients.
                for (let j = 0; j < ingNoDupes.length; j++) {
                    var ingredientToList = $("<li>")
                        .attr({ style: "font-weight: lighter" })
                        .text(ingNoDupes[j]);
                    $("#ingredientReveal" + i).append(ingredientToList);
                }
            }
        });
    }

    // function for creating the html for the results obtained from the search for DRINKS
    function getDrinks(event) {
        event.preventDefault();

        $("#populate-results").empty();

        var searchVal = $("#user-search-drink").val();
        $.ajax({
            url:
                "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + searchVal,
            type: "GET",
        }).then(function (response) {
            console.log(response);

            for (let i = 0; i < response.drinks.length; i++) {
                // getting ingredients
                let filtered_keys = (obj, filter) => {
                    let key,
                        keys = [];
                    for (key in obj)
                        if (obj.hasOwnProperty(key) && filter.test(key)) keys.push(key);
                    return keys;
                };
                // example:
                let possibleIngredients = filtered_keys(
                    response.drinks[i],
                    /strIngredient/
                );
                var actualIngredients = [];
                for (var o = 0; o < possibleIngredients.length; o++) {
                    if (response.drinks[0][possibleIngredients[o]] !== null) {
                        actualIngredients.push(response.drinks[i][possibleIngredients[o]]);
                    }
                }
                //getting measurements
                let possibleMeasurements = filtered_keys(
                    response.drinks[i],
                    /strMeasure/
                );
                var actualMeasurements = [];
                for (var l = 0; l < possibleMeasurements.length; l++) {
                    if (response.drinks[0][possibleMeasurements[l]] !== null) {
                        actualMeasurements.push(
                            response.drinks[i][possibleMeasurements[l]]
                        );
                    }
                }

                // Begin creating all the elements with the necessary information
                var col = $("<div>").attr("class", "col s6 l3"),
                    card = $("<div>").attr({ class: "card" }),
                    cardImageDiv = $("<div>").attr({
                        class: "card-image waves-effect waves-block waves-light",
                    }),
                    cardImage = $("<img>").attr({
                        class: "activator",
                        src: response.drinks[i].strDrinkThumb,
                        alt: "image of food",
                    }),
                    cardContent = $("<div>").attr("class", "card-content"),
                    contentSpan = $("<span>")
                        .attr({
                            class: "activator grey-text text-darken-4 truncate",
                            style: "font-size: 12pt",
                        })
                        .text(response.drinks[i].strDrink),
                    saveBtn = $("<button>").attr({
                        id: "saveForLaterBtn",
                        "data-id": response.drinks[i].idDrink,
                        name: "drink",
                        class: "waves-effect btn-flat",
                    }),
                    btnI = $("<i>").attr({ class: "material-icons" }).text("bookmark"),
                    cardReveal = $("<div>").attr("class", "card-reveal"),
                    revealSpan = $("<span>")
                        .attr("class", "card-title grey-text text-darken-4")
                        .text("Quick Look"),
                    revealSpanI = $("<i>")
                        .attr("class", "material-icons right")
                        .text("close"),
                    recipeNameH = $("<h6>")
                        .attr("id", "recipeName")
                        .text(response.drinks[i].strDrink),
                    hr = $("<hr>"),
                    ul = $("<ul>"),
                    ingredients = $("<ul>")
                        .attr({ id: "ingredientReveal" + i, style: "font-weight: bold" })
                        .text("Ingredients: "),
                    br1 = $("<br>"),
                    instructions = $("<li>")
                        .attr({ id: "blurbReveal", style: "font-weight: bold" })
                        .text("Instructions: "),
                    instructionsSpan = $("<span>")
                        .attr({ style: "font-weight: lighter" })
                        .text(response.drinks[i].strInstructions);

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

                $("#populate-results").append(col);

                // formatting and listing the ingredients for each drink
                for (let n = 0; n < actualMeasurements.length; n++) {
                    // have to check that null measurements do not show up
                    if (actualMeasurements[n] == null) {
                        var ingredientToList = $("<li>")
                            .attr({ style: "font-weight: lighter" })
                            .text(actualIngredients[n]);
                        $("#ingredientReveal" + i).append(ingredientToList);
                    } else {
                        var ingredientToList = $("<li>")
                            .attr({ style: "font-weight: lighter" })
                            .text(actualMeasurements[n] + " " + actualIngredients[n]);
                        $("#ingredientReveal" + i).append(ingredientToList);
                    }
                }
                // Accounting for any ingredients that do not have a measurement
                if (actualIngredients.length > actualMeasurements.length) {
                    for (
                        let v = actualMeasurements.length;
                        v < actualIngredients.length;
                        v++
                    ) {
                        var otherIngredient = $("<li>")
                            .attr({ style: "font-weight: lighter" })
                            .text(actualIngredients[v]);
                        $("#ingredientReveal" + i).append(otherIngredient);
                    }
                }
            }
        });
    }

    function saveForLater(key, value) {
        localStorage.setItem(key, JSON.stringify(value));

        if (key === "drink") {
            appendDrinktoSaved(value);
        } else if (key === "food") {
            appendFoodtoSaved(value);
        }
    }

    // function that takes an object value and puts in into the card creation function to append to the saved for later div
    function appendDrinktoSaved(value) {
        $.ajax({
            url: "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + value,
            type: "GET",
            success: function (response) {
                let filtered_keys = (obj, filter) => {
                    let key,
                        keys = [];
                    for (key in obj)
                        if (obj.hasOwnProperty(key) && filter.test(key)) keys.push(key);
                    return keys;
                };

                let possibleIngredients = filtered_keys(
                    response.drinks[0],
                    /strIngredient/
                );
                var actualIngredients = [];
                for (var o = 0; o < possibleIngredients.length; o++) {
                    if (response.drinks[0][possibleIngredients[o]] !== null) {
                        actualIngredients.push(response.drinks[0][possibleIngredients[o]]);
                    }
                }
                //getting measurements
                let possibleMeasurements = filtered_keys(
                    response.drinks[0],
                    /strMeasure/
                );
                var actualMeasurements = [];
                for (var l = 0; l < possibleMeasurements.length; l++) {
                    if (response.drinks[0][possibleMeasurements[l]] !== null) {
                        actualMeasurements.push(
                            response.drinks[0][possibleMeasurements[l]]
                        );
                    }
                }

                // Begin creating all the elements with the necessary information
                var col = $("<div>").attr("class", "col s4 l2"),
                    card = $("<div>").attr({ class: "card" }),
                    cardImageDiv = $("<div>").attr({
                        class: "card-image waves-effect waves-block waves-light",
                    }),
                    cardImage = $("<img>").attr({
                        class: "activator",
                        src: response.drinks[0].strDrinkThumb,
                        alt: "image of food",
                    }),
                    cardContent = $("<div>").attr("class", "card-content"),
                    contentSpan = $("<span>")
                        .attr({
                            class: "activator grey-text text-darken-4 truncate",
                            style: "font-size: 16pt",
                        })
                        .text(response.drinks[0].strDrink),
                    cardReveal = $("<div>").attr("class", "card-reveal"),
                    revealSpan = $("<span>")
                        .attr("class", "card-title grey-text text-darken-4")
                        .text("Quick Look"),
                    revealSpanI = $("<i>")
                        .attr("class", "material-icons right")
                        .text("close"),
                    recipeNameH = $("<h6>")
                        .attr("id", "recipeName")
                        .text(response.drinks[0].strDrink),
                    hr = $("<hr>"),
                    ul = $("<ul>"),
                    ingredients = $("<ul>")
                        .attr({ id: "ingredientReveal" + value, style: "font-weight: bold" })
                        .text("Ingredients: "),
                    br1 = $("<br>"),
                    instructions = $("<li>")
                        .attr({ id: "blurbReveal", style: "font-weight: bold" })
                        .text("Instructions: "),
                    instructionsSpan = $("<span>")
                        .attr({ style: "font-weight: lighter" })
                        .text(response.drinks[0].strInstructions);

                // Begin appending everything together
                cardImageDiv.append(cardImage);
                cardContent.append(contentSpan);
                instructions.append(instructionsSpan);
                ul.append(ingredients, br1, instructions);
                revealSpan.append(revealSpanI);
                cardReveal.append(revealSpan, recipeNameH, hr, ul);
                card.append(cardImageDiv, cardContent, cardReveal);
                col.append(card);

                $("#saved-for-later").append(col);

                // formatting and listing the ingredients for each drink
                for (let n = 0; n < actualMeasurements.length; n++) {
                    // have to check that null measurements do not show up
                    if (actualMeasurements[n] == null) {
                        var ingredientToList = $("<li>")
                            .attr({ style: "font-weight: lighter" })
                            .text(actualIngredients[n]);
                        $("#ingredientReveal" + value).append(ingredientToList);
                    } else {
                        var ingredientToList = $("<li>")
                            .attr({ style: "font-weight: lighter" })
                            .text(actualMeasurements[n] + " " + actualIngredients[n]);
                        $("#ingredientReveal" + value).append(ingredientToList);
                    }
                }
                // Accounting for any ingredients that do not have a measurement
                if (actualIngredients.length > actualMeasurements.length) {
                    for (
                        let v = actualMeasurements.length;
                        v < actualIngredients.length;
                        v++
                    ) {
                        var otherIngredient = $("<li>")
                            .attr({ style: "font-weight: lighter" })
                            .text(actualIngredients[v]);
                        $("#ingredientReveal" + value).append(otherIngredient);
                    }
                }
            },
            error: function (error) {
                console.log(error);
            },
        });
    }


    // function that takes an object value and puts in into the card creation function to append to the saved for later div
    function appendFoodtoSaved(value) {
        $.ajax({
            type: "GET",
            url:
                "https://api.spoonacular.com/recipes/complexSearch?query&titleMatch=" +
                value +
                "&recipes&instructionsRequired=true&addRecipeInformation=true&apiKey=a1307173fd1545b38ed82223156955bd",
            success: function (response) {
                console.log(response);

                var col = $("<div>").attr("class", "col s4 l2"),
                    card = $("<div>").attr("class", "card"),
                    cardImageDiv = $("<div>").attr(
                        "class",
                        "card-image waves-effect waves-block waves-light"
                    ),
                    cardImage = $("<img>").attr({
                        class: "activator",
                        src: response.results[0].image,
                        alt: "image of " + response.results[0].title,
                    }),
                    cardContent = $("<div>").attr("class", "card-content"),
                    contentSpan = $("<span>")
                        .attr({
                            class: "activator grey-text text-darken-4 truncate",
                            style: "font-size: 16pt",
                        })
                        .text(response.results[0].title),
                    saveBtn = $("<button>").attr({
                        id: "saveForLaterBtn",
                        "data-id": response.results[0].title,
                        name: "food",
                        class: "waves-effect btn-flat",
                    }),
                    btnI = $("<i>").attr({ class: "material-icons" }).text("bookmark"),
                    contentJlink = $("<a>")
                        .attr({
                            id: "jumplink",
                            href: response.results[0].sourceUrl,
                            target: "blank",
                        })
                        .text("See full recipe"),
                    cardReveal = $("<div>").attr("class", "card-reveal"),
                    revealSpan = $("<span>")
                        .attr("class", "card-title grey-text text-darken-4")
                        .text("Quick Look"),
                    revealSpanI = $("<i>")
                        .attr("class", "material-icons right")
                        .text("close"),
                    recipeNameH = $("<h6>")
                        .attr({ id: "recipeName" })
                        .text(response.results[0].title),
                    hr = $("<hr>"),
                    ul = $("<ul>"),
                    prepTime = $("<li>")
                        .attr({ id: "prepTimeReveal", style: "font-weight: bold" })
                        .text("Total time: "),
                    prepTimeSpan = $("<span>")
                        .attr({ style: "font-weight: lighter" })
                        .text(response.results[0].readyInMinutes + " minutes"),
                    br1 = $("<br>"),
                    ingredients = $("<ul>")
                        .attr({ id: "ingredientReveal" + value.replace(/ /g, ''), style: "font-weight: bold" })
                        .text("Ingredients:"),
                    br2 = $("<br>"),
                    description = $("<li>")
                        .attr({ id: "blurbReveal", style: "font-weight: bold" })
                        .text("Description: "),
                    descriptionSpan = $(
                        "<span>" + response.results[0].summary + "</span>"
                    ).attr({ style: "font-weight: lighter" });

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
                $("#saved-for-later").append(col);

                // now finding, sorting, formatting, and listing all the ingredients for each item
                function findAllByKey(obj, keyToFind) {
                    return Object.entries(obj).reduce(
                        (acc, [key, value]) =>
                            key === keyToFind
                                ? acc.concat(value)
                                : typeof value === "object"
                                    ? acc.concat(findAllByKey(value, keyToFind))
                                    : acc,
                        []
                    );
                }
                var ingredientsList = findAllByKey(response.results[0], "ingredients");
                // need to filter for ingredients first, and then use 'name'
                // was getting an issue where other things in the main object with the key 'name' came up.
                var ingredients = findAllByKey(ingredientsList, "name"),
                    ingNoDupes = [...new Set(ingredients)];
                // formatting the list of ingredients.
                for (let j = 0; j < ingNoDupes.length; j++) {
                    var ingredientToList = $("<li>")
                        .attr({ style: "font-weight: lighter" })
                        .text(ingNoDupes[j]);
                    $("#ingredientReveal" + value.replace(/ /g, '')).append(ingredientToList);
                }
            },
            error: function (error) {
                console.log(error);
            },
        });
    }

    $("#results").on("click", "button", function (event) {
        event.preventDefault();
        var value = $(this).attr("data-id"),
            key = $(this).attr("name");
        saveForLater(key, value);
        var badge = $("<span>").attr({
            class: "new badge blue",
            id: "saved-badge",
            "data-badge-caption": "SAVED!",
        });
        $(this).append(badge);
        setTimeout(() => {
            $("#saved-badge").remove();
        }, 2000);
    });

    $("#search-cuisines").on("click", getCuisines);
    $("#search-drinks").on("click", getDrinks);
});
