$(document).ready(function() {
    
        
        //This function is calling the drink api.
        //This URL uses "s=" to search by drink name
        //Switch to "f=" to search by first letter.
        //Switch to "i=" to search by ingredient

        $.ajax({
            url: "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita",
            type: "GET",
    
        })
        .then(function(response) {
            console.log(response);
    
            // function findAllByKey(obj, keyToFind) {
            //     return Object.entries(obj)
            //       .reduce((acc, [key, value]) => (key === keyToFind)
            //         ? acc.concat(value)
            //         : (typeof value === 'object')
            //         ? acc.concat(findAllByKey(value, keyToFind))
            //         : acc
            //       , [])
            //   }
            //   // USAGE
            //   console.log(findAllByKey(response, 'name'));
        })
        
    })

   