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

    $("#populate-results").empty();

    var searchVal = $("#user-search-food").val();
    $.ajax({
      url:
        "https://api.spoonacular.com/recipes/complexSearch?query=" +
        searchVal +
        "&recipes&instructionsRequired=true&addRecipeInformation=true&apiKey=" +
        foodapi,
      type: "GET",
      success: function (response) {
        //ADDED FOR TESTING
        currentResults = [];
        localStorage.setItem("currentResults", JSON.stringify(currentResults));
        // if there are no results for the searched value, alert and leave the function
        switch (response.results.length) {
          case 0:
            M.toast({ html: "Sorry, no results..", classes: "rounded toast" });
            return;
        }

        for (var i = 0; i < response.results.length; i++) {
          currentResults.push(response.results[i]);
          // Create all the elements with the information pulled
          var col = $("<div>").attr("class", "col s12 m6 l4"),
            card = $("<div>").attr("class", "card"),
            cardImageDiv = $("<div>").attr(
              "class",
              "card-image waves-effect waves-block waves-light"
            ),
            cardImage = $("<img>").attr({
              class: "activator responsive-img",
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
        localStorage.setItem("currentResults", JSON.stringify(currentResults));
        var clearResultsBtn = $("<a>")
          .attr({
            class: "btn waves-effect red darken-4 right",
            id: "clear-results",
          })
          .text("Clear Results");
        $("#populate-results").append(clearResultsBtn);
      },
      error: function (error) {
        console.log(error);
      },
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
      success: function (response) {
        // Clear our the results from the storage before getting the new ones
        currentResults = [];
        localStorage.setItem("currentResults", JSON.stringify(currentResults));

        switch (response.drinks) {
          case null:
            M.toast({ html: "Sorry, no results..", classes: "rounded toast" });
            return;
        }

        for (let i = 0; i < response.drinks.length; i++) {
          currentResults.push(response.drinks[i]);
          // getting ingredients
          // example:
          let possibleIngredients = filterKeys(
            response.drinks[i],
            /strIngredient/
          );
          var actualIngredients = [];
          filterDrinkIngredients(
            possibleIngredients,
            actualIngredients,
            response,
            i
          );

          //getting measurements
          let possibleMeasurements = filterKeys(
            response.drinks[i],
            /strMeasure/
          );
          var actualMeasurements = [];
          filterDrinkIngredients(
            possibleMeasurements,
            actualMeasurements,
            response,
            i
          );

          // Begin creating all the elements with the necessary information
          var col = $("<div>").attr("class", "col s12 m6 l4"),
            card = $("<div>").attr({ class: "card" }),
            cardImageDiv = $("<div>").attr({
              class: "card-image waves-effect waves-block waves-light",
            }),
            cardImage = $("<img>").attr({
              class: "activator responsive-img",
              src: response.drinks[i].strDrinkThumb,
              alt: "image of food",
            }),
            cardContent = $("<div>").attr("class", "card-content"),
            contentSpan = $("<span>")
              .attr({
                class: "activator grey-text text-darken-4 truncate",
                style: "font-size: 16pt",
              })
              .text(response.drinks[i].strDrink),
            saveBtn = $("<button>").attr({
              id: "saveForLaterBtn",
              "data-id": response.drinks[i].idDrink,
              "data-name": response.drinks[i].strDrink,
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
            $.each(actualIngredients, (index, value) => {
              var otherIngredient = $("<li>")
                .attr({ style: "font-weight: lighter" })
                .text(value);
              $("#ingredientReveal" + i).append(otherIngredient);
            });
          }
        }
        localStorage.setItem("currentResults", JSON.stringify(currentResults));
        var clearResultsBtn = $("<a>")
          .attr({
            class: "btn waves-effect red darken-4 right",
            id: "clear-results",
          })
          .text("Clear Results");
        $("#populate-results").append(clearResultsBtn);
      },
      error: function (error) {
        console.log(error);
      },
    });
  }

  // function that takes an object apiRecall and puts in into the card creation function to append to the saved for later div
  function appendDrinktoSaved(localObj) {
    // $.ajax({
    //   url:
    //     "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + apiRecall,
    //   type: "GET",
    //   success: function (response) {
    let drink = localObj[0];
    // getting ingredients
    let possibleIngredients = filterKeys(
      drink,
      // response.drinks[0],
      /strIngredient/
    );
    var actualIngredients = [];
    filterDrinkIngredients(possibleIngredients, actualIngredients, drink, 0);

    //getting measurements
    let possibleMeasurements = filterKeys(
      drink,
      // response.drinks[0],
      /strMeasure/
    );
    var actualMeasurements = [];
    filterDrinkIngredients(
      possibleMeasurements,
      actualMeasurements,
      // response
      drink,
      0
    );

    // Begin creating all the elements with the necessary information
    var col = $("<div>").attr({
        class: "col s12 m6 l4",
        // id: response.drinks[0].strDrink.replace(/ /g, ""),
        id: drink.idDrink,
      }),
      card = $("<div>").attr({ class: "card" }),
      cardImageDiv = $("<div>").attr({
        class: "card-image waves-effect waves-block waves-light",
      }),
      cardImage = $("<img>").attr({
        class: "activator responsive-img",
        // src: response.drinks[0].strDrinkThumb,
        src: drink.strDrinkThumb,
        alt: "image of food",
      }),
      cardContent = $("<div>").attr("class", "card-content"),
      contentSpan = $("<span>")
        .attr({
          class: "activator grey-text text-darken-4 truncate",
          style: "font-size: 16pt",
        })
        // .text(response.drinks[0].strDrink),
        .text(drink.strDrink),
      deleteBtn = $("<button>").attr({
        id: "deleteBtn",
        // "data-id": response.drinks[0].idDrink,
        "data-id": drink.idDrink,

        // "data-name": response.drinks[0].strDrink,
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
      recipeNameH = $("<h6>")
        .attr("id", "recipeName")
        // .text(response.drinks[0].strDrink),
        .text(drink.strDrink),
      hr = $("<hr>"),
      ul = $("<ul>"),
      ingredients = $("<ul>")
        .attr({
          // id: "ingredientReveal" + apiRecall,
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
        // .text(response.drinks[0].strInstructions);
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
      // $("#ingredientReveal" + apiRecall).append(ingredientToList);
      $("#ingredientReveal" + drink.idDrink).append(ingredientToList);
    });
    // Accounting for any ingredients that do not have a measurement
    if (actualIngredients.length > actualMeasurements.length) {
      $.each(actualIngredients, (index, value) => {
        var otherIngredient = $("<li>")
          .attr({ style: "font-weight: lighter" })
          .text(value);
        // $("#ingredientReveal" + apiRecall).append(otherIngredient);
        $("#ingredientReveal" + drink.idDrink).append(otherIngredient);
      });
    }
  }

  // function that takes an object apiRecall and puts in into the card creation function to append to the saved for later div
  function appendFoodtoSaved(localObj) {
    // $.ajax({
    //   type: "GET",
    //   url:
    //     "https://api.spoonacular.com/recipes/complexSearch?query&titleMatch=" +
    //     apiRecall +
    //     "&recipes&instructionsRequired=true&addRecipeInformation=true&apiKey=" +
    //     foodapi,
    //   success: function (response) {
    let food = localObj[0];

    var col = $("<div>").attr({
        class: "col s12 m6 l4",
        // id: response.results[0].id,
        id: food.id,
      }),
      card = $("<div>").attr("class", "card"),
      cardImageDiv = $("<div>").attr(
        "class",
        "card-image waves-effect waves-block waves-light"
      ),
      cardImage = $("<img>").attr({
        class: "activator responsive-img",
        // src: response.results[0].image,
        src: food.image,
        // alt: "image of " + response.results[0].title,
        alt: "image of " + food.title,
      }),
      cardContent = $("<div>").attr("class", "card-content"),
      contentSpan = $("<span>")
        .attr({
          class: "activator grey-text text-darken-4 truncate",
          style: "font-size: 16pt",
        })
        // .text(response.results[0].title),
        .text(food.title),
      deleteBtn = $("<button>").attr({
        id: "deleteBtn",
        // "data-id": response.results[0].title,
        "data-id": food.id,
        // "data-name": response.results[0].id,
        "data-name": food.title,
        name: "food",
        class:
          "btn-floating btn-small fixed-action-btn1 halfway-fab waves-effect waves-light red",
      }),
      btnI = $("<i>").attr({ class: "material-icons" }).text("delete"),
      contentJlink = $("<a>")
        .attr({
          id: "jumplink",
          // href: response.results[0].sourceUrl,
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
      recipeNameH = $("<h6>")
        .attr({ id: "recipeName" })
        // .text(response.results[0].title),
        .text(food.title),
      hr = $("<hr>"),
      ul = $("<ul>"),
      prepTime = $("<li>")
        .attr({ id: "prepTimeReveal", style: "font-weight: bold" })
        .text("Total time: "),
      prepTimeSpan = $("<span>")
        .attr({ style: "font-weight: lighter" })
        // .text(response.results[0].readyInMinutes + " minutes"),
        .text(food.readyInMinutes + " minutes"),
      br1 = $("<br>"),
      ingredients = $("<ul>")
        .attr({
          // id: "ingredientReveal" + apiRecall.replace(/ /g, ""),
          id: "ingredientReveal" + food.id,
          style: "font-weight: bold",
        })
        .text("Ingredients: "),
      br2 = $("<br>"),
      description = $("<li>")
        .attr({ id: "blurbReveal", style: "font-weight: bold" })
        .text("Description: "),
      descriptionSpan = $(
        // "<span>" + response.results[0].summary + "</span>"
        "<span>" + food.summary + "</span>"
      ).attr({ style: "font-weight: lighter" });

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
    // var ingredientsList = findAllByKey(response.results[0], "ingredients");
    var ingredientsList = findAllByKey(food, "ingredients");

    // filter out any duplicate ingredients
    ingNoDupes = [...new Set(findAllByKey(ingredientsList, "name"))];
    // formatting the list of ingredients.
    $.each(ingNoDupes, (i, value) => {
      i += 1;
      var ingredientToList = $("<span>").attr({
        style: "font-weight: lighter",
      });
      i !== ingNoDupes.length
        ? ingredientToList.text(value + ", ")
        : ingredientToList.text(value + ".");
      // $("#ingredientReveal" + apiRecall.replace(/ /g, "")).append(
      $("#ingredientReveal" + food.id).append(ingredientToList);
    });
  }

  // INIT AND POPULATE SAVED MAY BE ABLE TO M
  init = () => {
    currentResults = [];
    localStorage.setItem("currentResults", JSON.stringify(currentResults));

    // Init checks local storage (assigned to the var 'history') and then sends any past saved items to the corresponding api call for the saved for later section)
    $.each(history, function (i, value) {
      value[0].hasOwnProperty("idDrink")
        ? appendDrinktoSaved(value)
        : appendFoodtoSaved(value);

      // switch (value.type) {
      //   case "food":
      //     appendFoodtoSaved(value.APIcall);
      //     break;
      //   case "drink":
      //     appendDrinktoSaved(value.APIcall);
      //     break;
      // }
    });
  };

  // function populateSaved(searchVal) {
  populateSaved = (localObj) => {
    localObj[0].hasOwnProperty("idDrink")
      ? appendDrinktoSaved(localObj)
      : localObj[0].hasOwnProperty("title")
      ? appendFoodtoSaved(localObj)
      : M.toast({ html: "error" });
  };
  // return history.forEach(function (el) {
  //   if (el.type === "food" && el.APIcall === searchVal) {
  //     appendFoodtoSaved(searchVal);
  //   } else if (el.type === "drink" && el.APIcall === searchVal) {
  //     appendDrinktoSaved(searchVal);
  //   }
  // });
  // }

  // function that saves things for later
  // saveForLater = (apiRecall, cardID, type, objID) => {
  saveForLater = (objID, type) => {
    var objToSave;
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
    checkValue = () => {
      switch (type) {
        case "drink":
          return history.some(function (el) {
            return el[0].idDrink === objID;
          });
        case "food":
          return history.some((el) => {
            return el[0].id === objID;
          });
      }
    };
    !checkValue()
      ? (M.toast({ html: "Saved!", classes: "rounded toast" }),
        history.push(objToSave),
        localStorage.setItem("Saved", JSON.stringify(history)),
        populateSaved(objToSave))
      : M.toast({
          html: "You can't save something twice!",
          classes: "rounded toast",
        });

    // function checkValue(arr, objValue) {
    //   return arr.some(function (el) {
    //     return el.cardID === objValue;
    //   });
    // }
    // if (!checkValue(history, cardID)) {
    //   M.toast({ html: "Saved!", classes: "rounded toast" });
    //   var obj = {
    //     APIcall: apiRecall,
    //     cardID: cardID,
    //     type: type,
    //   };
    //   history.push(obj);
    //   localStorage.setItem("Saved", JSON.stringify(history));
    //   populateSaved(apiRecall);
    // }
  };

  function deleteCard(deleteID) {
    // history = history.filter(function (obj) {
    // return obj.cardID !== deleteID;

    history = history.filter((obj) => {
      return obj[0].id != deleteID;
    });

    // return obj.cardId !== deleteID;
    // });
    localStorage.setItem("Saved", JSON.stringify(history));
    // Might be able to assign delete ID to the cards themselves and the use .remove()
    $("#" + deleteID).remove();
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

  // more object sorting functions
  function filterKeys(obj, filter) {
    let keys = [];
    for (key in obj)
      if (obj.hasOwnProperty(key) && filter.test(key)) keys.push(key);
    return keys;
  }

  // for filtering the ingredients and measurements for the drinks
  function filterDrinkIngredients(poss, act, res, z) {
    if (res.hasOwnProperty("drinks")) {
      for (let i = 0; i < poss.length; i++) {
        if (res.drinks[z][poss[i]] !== null) {
          act.push(res.drinks[z][poss[i]]);
        }
      }
    } else {
      // THIS IF ELSE WAS NOT HERE BEFORE
      for (let i = 0; i < poss.length; i++) {
        if (res[poss[i]] !== null) {
          act.push(res[poss[i]]);
        }
      }
    }
  }

  // called on page load to load all previously saved items
  init();

  $("#search-cuisines").on("click", getCuisines);
  $("#search-drinks").on("click", getDrinks);

  $("#results").on("click", "button", function (event) {
    event.preventDefault();
    var apiRecall = $(this).attr("data-id"),
      cardID = $(this).attr("data-name").replace(/ /g, ""),
      type = $(this).attr("name"),
      objID = $(this).attr("data-id");
    // saveForLater(apiRecall, cardID, type, objID);
    saveForLater(objID, type);
  });

  $("#saved-for-later").on("click", "button", function (event) {
    event.preventDefault();
    // var deleteID = $(this).attr("data-name").replace(/ /g, "");
    var deleteID = $(this).attr("data-id"),
      type = $(this).attr("name");
    deleteCard(deleteID, type);
  });

  $("#results").on("click", "a", function () {
    $("#populate-results").empty();
    M.toast({ html: "Cleared!", classes: "rounded toast" });
  });
});
