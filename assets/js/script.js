$(document).ready(function () {
  // Image slider
  $(".slider").slider({
    indicators: false,
    full_width: true,
    height: 333,
  });

  $(".fixed-action-btn").floatingActionButton();

  var history = JSON.parse(localStorage.getItem("Saved")) || [],
    currentResults = JSON.parse(localStorage.getItem("currentResults")) || [],
    foodapi = "2363a262f60e4280bebafc985ee630d9";

  // function for creating the html for the results obtained from the search for FOOD
  function getCuisines(event) {
    event.preventDefault();

    // empty results container of any previous results
    $("#populate-results").empty();
    // take user input and throw it into the api call
    var searchVal = $("#user-search-food").val();

    $.ajax({
      url:
        "https://api.spoonacular.com/recipes/complexSearch?query=" +
        searchVal +
        "&recipes&instructionsRequired=true&addRecipeInformation=true&apiKey=" +
        foodapi,
      type: "GET",
      success: function (response) {
        // clear past current results
        currentResults = [];
        localStorage.setItem("currentResults", JSON.stringify(currentResults));

        // if there are no results for the searched value, alert and leave the function
        switch (response.results.length) {
          case 0:
            M.toast({ html: "Sorry, no results..", classes: "rounded toast" });
            return;
        }

        // loop through all the results and create a card for each one
        for (var i = 0; i < response.results.length; i++) {
          // populate the current results array, which is used in the save for later function
          currentResults.push(response.results[i]);

          // Create all the elements with the information pulled
          var col = $("<div>").attr("class", "col s12 m6 l4"),
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
              "data-id": response.results[i].id,
              "data-name": response.results[i].title,
              name: "food",
              class:
                "btn-floating btn-small fixed-action-btn1 halfway-fab waves-effect waves-light indigo lighten-3",
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
              .text("Ingredients: "),
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
          var ingredientsList = findAllByKey(
            response.results[i],
            "ingredients"
          );
          // filter our any duplicate ingredients
          let ingNoDupes = [...new Set(findAllByKey(ingredientsList, "name"))];
          // formatting the list of ingredients.
          $.each(ingNoDupes, (index, value) => {
            index += 1;
            var ingredientToList = $("<span>").attr({
              style: "font-weight: lighter",
            });
            index !== ingNoDupes.length
              ? ingredientToList.text(value + ", ")
              : ingredientToList.text(value + ".");

            $("#ingredientReveal" + i).append(ingredientToList);
          });
        }
        // push the current results array to the local storage, for use in the save for later function
        localStorage.setItem("currentResults", JSON.stringify(currentResults));
        var clearResultsBtn = $("<a>")
          .attr({
            class: "btn waves-effect red darken-4 right",
            id: "clear-results",
          })
          .text("Clear Results");
        $("#populate-results").append(clearResultsBtn);
      },
      // logging the error to the console in case the api call fails for some reason
      error: function (error) {
        console.log(error);
      },
    });
  }

  // function for creating the html for the results obtained from the search for DRINKS
  function getDrinks(event) {
    event.preventDefault();
    // clear any results from past search
    $("#populate-results").empty();
    // take user input and put it into the api call
    var searchVal = $("#user-search-drink").val();
    $.ajax({
      url:
        "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + searchVal,
      type: "GET",
      success: function (response) {
        // Clear our the results from the storage before getting the new ones
        currentResults = [];
        localStorage.setItem("currentResults", JSON.stringify(currentResults));

        // if there are no results, notify user and exit the funciton
        switch (response.drinks) {
          case null:
            M.toast({ html: "Sorry, no results..", classes: "rounded toast" });
            return;
        }

        // loop  through the results and create a card for each one
        for (let i = 0; i < response.drinks.length; i++) {
          // making the obj under evaluation more accessible
          let currentDrink = response.drinks[i];
          // update current results array
          currentResults.push(currentDrink);

          // getting measurements and ingredients
          let actualIngredients = parseProperty(currentDrink, /strIngredient/),
            actualMeasurements = parseProperty(currentDrink, /strMeasure/);

          // Begin creating all the elements with the necessary information
          var col = $("<div>").attr("class", "col s12 m6 l4"),
            card = $("<div>").attr({ class: "card" }),
            cardImageDiv = $("<div>").attr({
              class: "card-image waves-effect waves-block waves-light",
            }),
            cardImage = $("<img>").attr({
              class: "activator",
              src: currentDrink.strDrinkThumb,
              alt: "image of food",
            }),
            cardContent = $("<div>").attr("class", "card-content"),
            contentSpan = $("<span>")
              .attr({
                class: "activator grey-text text-darken-4 truncate",
                style: "font-size: 16pt",
              })
              .text(currentDrink.strDrink),
            saveBtn = $("<button>").attr({
              id: "saveForLaterBtn",
              "data-id": currentDrink.idDrink,
              "data-name": currentDrink.strDrink,
              name: "drink",
              class:
                "btn-floating btn-small fixed-action-btn1 halfway-fab waves-effect waves-light indigo lighten-3",
            }),
            btnI = $("<i>").attr({ class: "material-icons" }).text("bookmark"),
            cardReveal = $("<div>").attr("class", "card-reveal activator"),
            revealSpan = $("<span>")
              .attr("class", "card-title grey-text text-darken-4")
              .text("Quick Look"),
            revealSpanI = $("<i>")
              .attr("class", "material-icons right")
              .text("close"),
            recipeNameH = $("<h6>")
              .attr("id", "recipeName")
              .text(currentDrink.strDrink),
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
              .text(currentDrink.strInstructions);

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
          $.each(actualMeasurements, (index, value) => {
            // have to check that null measurements do not show up
            var ingredientToList = $("<li>").attr({
              style: "font-weight: lighter",
            });
            value === null
              ? ingredientToList.text(value)
              : ingredientToList.text(value + " " + actualIngredients[index]);
            $("#ingredientReveal" + i).append(ingredientToList);
          });
          // Accounting for any ingredients that do not have a measurement
          if (actualIngredients.length > actualMeasurements.length) {
            $.each(actualIngredients, (_, value) => {
              var lastIngredient = $("<li>")
                .attr({ style: "font-weight: lighter" })
                .text(value);
              $("#ingredientReveal" + i).append(lastIngredient);
            });
          }
        }
        // update current results in the local storage, for use in the save for later function
        localStorage.setItem("currentResults", JSON.stringify(currentResults));
        var clearResultsBtn = $("<a>")
          .attr({
            class: "btn waves-effect red darken-4 right",
            id: "clear-results",
          })
          .text("Clear Results");
        $("#populate-results").append(clearResultsBtn);
      },
      // logging the error to the console in case the api call fails for some reason
      error: function (error) {
        console.log(error);
      },
    });
  }

  // function that takes an object and puts in into the card creation function to append to the saved for later div
  function appendDrinktoSaved(localObj) {
    // assinging the object to a more accessible variable
    let drink = localObj[0],
      // getting measurements and ingredients
      actualIngredients = parseProperty(drink, /strIngredient/),
      actualMeasurements = parseProperty(drink, /strMeasure/);

    // Begin creating all the elements with the necessary information
    var col = $("<div>").attr({
        class: "col s12 m6 l4",
        id: drink.idDrink,
      }),
      card = $("<div>").attr({ class: "card" }),
      cardImageDiv = $("<div>").attr({
        class: "card-image waves-effect waves-block waves-light",
      }),
      cardImage = $("<img>").attr({
        class: "activator",
        src: drink.strDrinkThumb,
        alt: "image of food",
      }),
      cardContent = $("<div>").attr("class", "card-content"),
      contentSpan = $("<span>")
        .attr({
          class: "activator grey-text text-darken-4 truncate",
          style: "font-size: 16pt",
        })
        .text(drink.strDrink),
      deleteBtn = $("<button>").attr({
        id: "deleteBtn",
        "data-id": drink.idDrink,
        "data-name": drink.strDrink.replace(/ /g, ""),
        name: "drink",
        class:
          "btn-floating btn-small fixed-action-btn1 halfway-fab waves-effect waves-light red",
      }),
      btnI = $("<i>").attr({ class: "material-icons" }).text("delete"),
      cardReveal = $("<div>").attr("class", "card-reveal"),
      revealSpan = $("<span>")
        .attr("class", "card-title grey-text text-darken-4")
        .text("Quick Look"),
      revealSpanI = $("<i>")
        .attr("class", "material-icons right")
        .text("close"),
      recipeNameH = $("<h6>").attr("id", "recipeName").text(drink.strDrink),
      hr = $("<hr>"),
      ul = $("<ul>"),
      ingredients = $("<ul>")
        .attr({
          id: "ingredientReveal" + drink.idDrink,
          style: "font-weight: bold",
        })
        .text("Ingredients: "),
      br1 = $("<br>"),
      instructions = $("<li>")
        .attr({ id: "blurbReveal", style: "font-weight: bold" })
        .text("Instructions: "),
      instructionsSpan = $("<span>")
        .attr({ style: "font-weight: lighter" })
        .text(drink.strInstructions);

    // Begin appending everything together
    cardImageDiv.append(cardImage);
    deleteBtn.append(btnI);
    cardContent.append(contentSpan, deleteBtn);
    instructions.append(instructionsSpan);
    ul.append(ingredients, br1, instructions);
    revealSpan.append(revealSpanI);
    cardReveal.append(revealSpan, recipeNameH, hr, ul);
    card.append(cardImageDiv, cardContent, cardReveal);
    col.append(card);

    $("#saved-for-later").append(col);

    // formatting and listing the ingredients for each drink
    $.each(actualMeasurements, (index, value) => {
      // have to check that null measurements do not show up
      var ingredientToList = $("<li>").attr({
        style: "font-weight: lighter",
      });
      value === null
        ? ingredientToList.text(value)
        : ingredientToList.text(value + " " + actualIngredients[index]);
      $("#ingredientReveal" + drink.idDrink).append(ingredientToList);
    });
    // Accounting for any ingredients that do not have a measurement
    if (actualIngredients.length > actualMeasurements.length) {
      $.each(actualIngredients, (_, value) => {
        var lastIngredient = $("<li>")
          .attr({ style: "font-weight: lighter" })
          .text(value);
        $("#ingredientReveal" + drink.idDrink).append(lastIngredient);
      });
    }
  }

  // function that takes an object and puts in into the card creation function to append to the saved for later div
  function appendFoodtoSaved(localObj) {
    // assign the object to a more accessible variable
    let food = localObj[0];

    // creating all the elements to make the card
    var col = $("<div>").attr({
        class: "col s12 m6 l4",
        id: food.id,
      }),
      card = $("<div>").attr("class", "card"),
      cardImageDiv = $("<div>").attr(
        "class",
        "card-image waves-effect waves-block waves-light"
      ),
      cardImage = $("<img>").attr({
        class: "activator",
        src: food.image,
        alt: "image of " + food.title,
      }),
      cardContent = $("<div>").attr("class", "card-content"),
      contentSpan = $("<span>")
        .attr({
          class: "activator grey-text text-darken-4 truncate",
          style: "font-size: 16pt",
        })
        .text(food.title),
      deleteBtn = $("<button>").attr({
        id: "deleteBtn",
        "data-id": food.id,
        "data-name": food.title,
        name: "food",
        class:
          "btn-floating btn-small fixed-action-btn1 halfway-fab waves-effect waves-light red",
      }),
      btnI = $("<i>").attr({ class: "material-icons" }).text("delete"),
      contentJlink = $("<a>")
        .attr({
          id: "jumplink",
          href: food.sourceUrl,
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
      recipeNameH = $("<h6>").attr({ id: "recipeName" }).text(food.title),
      hr = $("<hr>"),
      ul = $("<ul>"),
      prepTime = $("<li>")
        .attr({ id: "prepTimeReveal", style: "font-weight: bold" })
        .text("Total time: "),
      prepTimeSpan = $("<span>")
        .attr({ style: "font-weight: lighter" })
        .text(food.readyInMinutes + " minutes"),
      br1 = $("<br>"),
      ingredients = $("<ul>")
        .attr({
          id: "ingredientReveal" + food.id,
          style: "font-weight: bold",
        })
        .text("Ingredients: "),
      br2 = $("<br>"),
      description = $("<li>")
        .attr({ id: "blurbReveal", style: "font-weight: bold" })
        .text("Description: "),
      descriptionSpan = $("<span>" + food.summary + "</span>").attr({
        style: "font-weight: lighter",
      });

    // Append all the elements together for presentation
    cardImageDiv.append(cardImage);
    deleteBtn.append(btnI);
    cardContent.append(contentSpan, deleteBtn);
    prepTime.append(prepTimeSpan);
    description.append(descriptionSpan);
    ul.append(prepTime, br1, ingredients, br2, description);
    revealSpan.append(revealSpanI);
    cardReveal.append(revealSpan, recipeNameH, contentJlink, hr, ul);
    card.append(cardImageDiv, cardContent, cardReveal);
    col.append(card);

    $("#saved-for-later").append(col);

    // now finding, sorting, formatting, and listing all the ingredients for each item
    var ingredientsList = findAllByKey(food, "ingredients");

    // filter one more time to remove any duplicate ingredients
    ingNoDupes = [...new Set(findAllByKey(ingredientsList, "name"))];
    // formatting the list of ingredients.
    $.each(ingNoDupes, (index, value) => {
      index += 1;
      var ingredientToList = $("<span>").attr({
        style: "font-weight: lighter",
      });
      index !== ingNoDupes.length
        ? ingredientToList.text(value + ", ")
        : ingredientToList.text(value + ".");
      $("#ingredientReveal" + food.id).append(ingredientToList);
    });
  }

  // INIT AND POPULATE SAVED MAY BE ABLE TO MERGED STILL
  function init() {
    // make sure that on page load there is nothing in the current results div
    currentResults = [];
    localStorage.setItem("currentResults", JSON.stringify(currentResults));

    // Init checks local storage (assigned to the var 'history') and then sends any past saved items to the corresponding api call for the saved for later section)
    $.each(history, function (_, value) {
      switch (value[0].type) {
        case "drink":
          appendDrinktoSaved(value);
          break;
        case "food":
          appendFoodtoSaved(value);
      }
    });
  }

  // This might be able to be cleaned up
  function populateSaved(localObj) {
    switch (localObj[0].type) {
      case "drink":
        appendDrinktoSaved(localObj);
        break;
      case "food":
        appendFoodtoSaved(localObj);
    }
  }

  // function to save items to the saved for later container
  function saveForLater(objID, type) {
    var objToSave;
    // check the type of object that will be saved, and assign it its object from the api call, as well as custom properties to help with the delete function
    switch (type) {
      case "drink":
        objToSave = currentResults.filter((obj) => {
          if (obj.idDrink == objID) {
            return true;
          }
        });
        objToSave[0]["type"] = "drink";
        objToSave[0]["id"] = objID;
        break;
      case "food":
        objToSave = currentResults.filter((obj) => {
          if (obj.id == objID) {
            return true;
          }
        });
        objToSave[0]["type"] = "food";
    }
    // check local storage for the item you are trying to save, so that you cannot save things multiple times
    if (
      history.some(function (el) {
        return el[0].id === objID;
      })
    ) {
      M.toast({
        html: "You can't save something twice!",
        classes: "rounded toast",
      });
    } else {
      M.toast({ html: "Saved!", classes: "rounded toast" }),
        history.push(objToSave),
        localStorage.setItem("Saved", JSON.stringify(history)),
        populateSaved(objToSave);
    }
  }

  // function that handles the deletion of cards, both from the local storage and the saved-for-later div
  function deleteCard(deleteID) {
    history = history.filter((obj) => {
      return obj[0].id != deleteID;
    });
    localStorage.setItem("Saved", JSON.stringify(history));
    $("#" + deleteID).fadeOut(200);
    M.toast({ html: "Deleted.", classes: "rounded toast" });
  }

  // handy functions for sorting through objects
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

  // for filtering the ingredients and measurements for the drinks
  function parseProperty(obj, filter) {
    let actual = [],
      keys = [];
    for (key in obj) {
      if (filter.test(key) && obj[key] !== null) keys.push(key);
    }
    $.each(keys, (_, value) => {
      actual.push(obj[value]);
    });
    return actual;
  }

  init();

  $("#search-cuisines").on("click", getCuisines);
  $("#search-drinks").on("click", getDrinks);

  $("#results").on("click", "button", function (event) {
    event.preventDefault();
    var type = $(this).attr("name"),
      objID = $(this).attr("data-id");
    saveForLater(objID, type);
  });

  $("#saved-for-later").on("click", "button", function (event) {
    event.preventDefault();
    var deleteID = $(this).attr("data-id"),
      type = $(this).attr("name");
    deleteCard(deleteID, type);
  });

  $("#results").on("click", "#clear-results", function () {
    $("#populate-results").empty();
    M.toast({ html: "Cleared!", classes: "rounded toast" });
    currentResults = [];
    localStorage.setItem("currentResults", JSON.stringify(currentResults));
  });
});
