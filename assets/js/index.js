var cuisinesList = [
    
]


getRecipes("italian")

function getRecipes(cuisine){
    var queryURL = "https://api.spoonacular.com/recipes/random?apiKey=ad7eae9455534c2b9df85e498cdf804b&number=1&tags=dinner,main dish,"+cuisine
    $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {

        var ingredients = []
        response.recipes[0].extendedIngredients.forEach(element => {
            ingredients.push(element.original)
        });


        var fullRecipe = {
            recipeName : response.recipes[0].title,
            recipeIngredients : ingredients,
            recipeImageURL : response.recipes[0].image,
            recipeInstructions : response.recipes[0].instructions,
            recipeURL : response.recipes[0].sourceUrl,
        }
        output = JSON.stringify(fullRecipe)
        return(fullRecipe)
    });
}




