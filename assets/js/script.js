$(document).ready(function () {
  // Image slider
  $(".slider").slider({
    indicators: false,
    full_width: true,
    height: 333,
  });

  $(".fixed-action-btn").floatingActionButton();

  var history = JSON.parse(localStorage.getItem("Saved")) || [];
  var foodapi = "39b1896909144a7ba69854d6540cfbaf";

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
        // if there are no results for the searched value, alert and leave the function
        switch (response.results.length) {
          case 0:
            M.toast({ html: "Sorry, no results.." });
            return;
        }

        for (var i = 0; i < response.results.length; i++) {
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
              "data-id": response.results[i].title,
              "data-name": response.results[i].id,
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
          // need to filter for ingredients first, and then use 'name'
          // was getting an issue where other things in the main object with the key 'name' came up.
          var ingredients = findAllByKey(ingredientsList, "name");
          let ingNoDupes = [...new Set(ingredients)];
          // formatting the list of ingredients.
           $.each(ingNoDupes, (index, value) => {
             index = index + 1;
             var ingredientToList = $("<span>").attr({
               style: "font-weight: lighter",
             });
             if (index !== ingNoDupes.length) {
               ingredientToList.text(value + ", ");
             } else if (index === ingNoDupes.length) {
               ingredientToList.text(value + ".");
             }
             $("#ingredientReveal" + i).append(
               ingredientToList
             );
           });
        }
      },
      failure: function (error) {
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
        switch (response.drinks) {
          case null:
            M.toast({ html: "Sorry, no results.." });
            return;
        }

        for (let i = 0; i < response.drinks.length; i++) {
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
      },
      failure: function (error) {
        console.log(error);
      },
    });
  }

  // function that takes an object apiRecall and puts in into the card creation function to append to the saved for later div
  function appendDrinktoSaved(apiRecall) {
    $.ajax({
      url:
        "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + apiRecall,
      type: "GET",
      success: function (response) {
        // getting ingredients
        let possibleIngredients = filterKeys(
          response.drinks[0],
          /strIngredient/
        );
        var actualIngredients = [];
        filterDrinkIngredients(
          possibleIngredients,
          actualIngredients,
          response,
          0
        );

        //getting measurements
        let possibleMeasurements = filterKeys(response.drinks[0], /strMeasure/);
        var actualMeasurements = [];
        filterDrinkIngredients(
          possibleMeasurements,
          actualMeasurements,
          response,
          0
        );

        // Begin creating all the elements with the necessary information
        var col = $("<div>").attr({
            class: "col s12 m6 l4",
            id: response.drinks[0].strDrink.replace(/ /g, ""),
          }),
          card = $("<div>").attr({ class: "card" }),
          cardImageDiv = $("<div>").attr({
            class: "card-image waves-effect waves-block waves-light",
          }),
          cardImage = $("<img>").attr({
            class: "activator responsive-img",
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
          deleteBtn = $("<button>").attr({
            id: "saveForLaterBtn",
            "data-id": response.drinks[0].idDrink,
            "data-name": response.drinks[0].strDrink,
            name: "food",
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
            .text(response.drinks[0].strDrink),
          hr = $("<hr>"),
          ul = $("<ul>"),
          ingredients = $("<ul>")
            .attr({
              id: "ingredientReveal" + apiRecall,
              style: "font-weight: bold",
            })
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
        for (let n = 0; n < actualMeasurements.length; n++) {
          // have to check that null measurements do not show up
          if (actualMeasurements[n] == null) {
            var ingredientToList = $("<li>")
              .attr({ style: "font-weight: lighter" })
              .text(actualIngredients[n]);
            $("#ingredientReveal" + apiRecall).append(ingredientToList);
          } else {
            var ingredientToList = $("<li>")
              .attr({ style: "font-weight: lighter" })
              .text(actualMeasurements[n] + " " + actualIngredients[n]);
            $("#ingredientReveal" + apiRecall).append(ingredientToList);
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
            $("#ingredientReveal" + apiRecall).append(otherIngredient);
          }
        }
      },
    });
  }

  // function that takes an object apiRecall and puts in into the card creation function to append to the saved for later div
  function appendFoodtoSaved(apiRecall) {
    $.ajax({
      type: "GET",
      url:
        "https://api.spoonacular.com/recipes/complexSearch?query&titleMatch=" +
        apiRecall +
        "&recipes&instructionsRequired=true&addRecipeInformation=true&apiKey=" +
        foodapi,
      success: function (response) {
        var col = $("<div>").attr({
            class: "col s12 m6 l4",
            id: response.results[0].id,
          }),
          card = $("<div>").attr("class", "card"),
          cardImageDiv = $("<div>").attr(
            "class",
            "card-image waves-effect waves-block waves-light"
          ),
          cardImage = $("<img>").attr({
            class: "activator responsive-img",
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
          deleteBtn = $("<button>").attr({
            id: "saveForLaterBtn",
            "data-id": response.results[0].title,
            "data-name": response.results[0].id,
            name: "food",
            class:
              "btn-floating btn-small fixed-action-btn1 halfway-fab waves-effect waves-light red",
          }),
          btnI = $("<i>").attr({ class: "material-icons" }).text("delete"),
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
            .attr({
              id: "ingredientReveal" + apiRecall.replace(/ /g, ""),
              style: "font-weight: bold",
            })
            .text("Ingredients: "),
          br2 = $("<br>"),
          description = $("<li>")
            .attr({ id: "blurbReveal", style: "font-weight: bold" })
            .text("Description: "),
          descriptionSpan = $(
            "<span>" + response.results[0].summary + "</span>"
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
        var ingredientsList = findAllByKey(response.results[0], "ingredients");
        // need to filter for ingredients first, and then use 'name'
        // was getting an issue where other things in the main object with the key 'name' came up.
        var ingredients = findAllByKey(ingredientsList, "name"),
          ingNoDupes = [...new Set(ingredients)];
        // formatting the list of ingredients.
        $.each(ingNoDupes, (i, value) => {
          i = i + 1;
          var ingredientToList = $("<span>").attr({
            style: "font-weight: lighter",
          });
          if (i !== ingNoDupes.length) {
            ingredientToList.text(value + ", ");
          } else if (i === ingNoDupes.length) {
            ingredientToList.text(value + ".");
          }
          $("#ingredientReveal" + apiRecall.replace(/ /g, "")).append(
            ingredientToList
          );
        });
      },
    });
  }

  // INIT AND POPULATE SAVED MAY BE ABLE TO M
  function init() {
    // Init checks local storage (assigned to the var 'history') and then sends any past saved items to the corresponding api call for the saved for later section)
    $.each(history, function (i, value) {
      switch (value.type) {
        case "food":
          appendFoodtoSaved(value.APIcall);
          break;
        case "drink":
          appendDrinktoSaved(value.APIcall);
          break;
      }
    });
  }

  function populateSaved(searchVal) {
    return history.forEach(function (el) {
      if (el.type === "food" && el.APIcall === searchVal) {
        appendFoodtoSaved(searchVal);
      } else if (el.type === "drink" && el.APIcall === searchVal) {
        appendDrinktoSaved(searchVal);
      }
    });
  }

  // function that saves things for later
  function saveForLater(apiRecall, cardID, type) {
    function checkValue(arr, objValue) {
      return arr.some(function (el) {
        return el.cardID === objValue;
      });
    }
    if (!checkValue(history, cardID)) {
      M.toast({ html: "Saved!" });
      var obj = {
        APIcall: apiRecall,
        cardID: cardID,
        type: type,
      };
      history.push(obj);
      localStorage.setItem("Saved", JSON.stringify(history));
      populateSaved(apiRecall);
    }
  }

  function deleteFromHistory(deleteID) {
    history = history.filter(function (obj) {
      return obj.cardID !== deleteID;
    });
    localStorage.setItem("Saved", JSON.stringify(history));
    // Might be able to assign delete ID to the cards themselves and the use .remove()
    $("#" + deleteID).remove();
    M.toast({ html: "Deleted." });
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
    for (let i = 0; i < poss.length; i++) {
      if (res.drinks[z][poss[i]] !== null) {
        act.push(res.drinks[z][poss[i]]);
      }
    }
  }
  
  // called on page load to load all previously saved items
  init();

  $("#results").on("click", "button", function (event) {
    event.preventDefault();
    var apiRecall = $(this).attr("data-id"),
      cardID = $(this).attr("data-name").replace(/ /g, ""),
      type = $(this).attr("name");
    saveForLater(apiRecall, cardID, type);
  });

  $("#saved-for-later").on("click", "button", function (event) {
    event.preventDefault();
    var deleteID = $(this).attr("data-name").replace(/ /g, "");
    deleteFromHistory(deleteID);
  });

  $("#search-cuisines").on("click", getCuisines);
  $("#search-drinks").on("click", getDrinks);
});
