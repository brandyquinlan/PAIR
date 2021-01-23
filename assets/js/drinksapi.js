$(document).ready(function() {
    
        
        //This function is calling the drink api.
        //This URL uses "s=" to search by drink name
        //Switch to "f=" to search by first letter.
        //Switch to "i=" to search by ingredient


// below is the AJAX call and code that returns:
// drink name
// drink instructions
// drink image (URL)
// drink ingredients (in an array)
// incredient measurements (in an array, same order as ingredients array)


        $.ajax({
            url: "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita",
            type: "GET",
    
        })
        .then(function(response) {
            console.log(response);
            console.log(response.drinks[0].strDrink);
            console.log(response.drinks[0].strInstructions);
            console.log(response.drinks[0].strDrinkThumb);
            // console.log(response);
            
            // getting ingredients
            let filtered_keys = (obj, filter) => {
              let key, keys = []
              for (key in obj)
                if (obj.hasOwnProperty(key) && filter.test(key))
                  keys.push(key)
              return keys
            }
            // example:
            let possibleIngredients = filtered_keys(response.drinks[0], /strIngredient/);
            // console.log(possibleIngredients);
            var actualIngredients = [];
            for (var i = 0; i < possibleIngredients.length; i++) {
              if (response.drinks[0][possibleIngredients[i]] !== null) {
                actualIngredients.push(response.drinks[0][possibleIngredients[i]]);
              }
            }
            console.log(actualIngredients);

            //getting measurements
              let possibleMeasurements = filtered_keys(response.drinks[0], /strMeasure/);
            //   console.log(possibleMeasurements);
              var actualMeasurements = [];
              for (var i = 0; i < possibleMeasurements.length; i++) {
                if (response.drinks[0][possibleMeasurements[i]] !== null) {
                  actualMeasurements.push(response.drinks[0][possibleMeasurements[i]]);
                }
              }
              console.log(actualMeasurements);
            

        })
        
    })