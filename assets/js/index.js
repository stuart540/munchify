var cuisinesList = [
    
]

var recipeContainer = $("#recipeContainer");
var landingContainer = $("#landingContainer");

var randomiseButton = $("#randomiseButton");
var favouriteRecipeButton = $("#favouriteRecipe");



function getRecipes(cuisine){
    var queryURL = "https://api.spoonacular.com/recipes/random?apiKey=ad7eae9455534c2b9df85e498cdf804b&number=1&tags=dinner,main dish,"+cuisine
    $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {

        console.log(response)

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
            recipeID : response.recipes[0].id
        }
        
        console.log(fullRecipe);
        return(fullRecipe);
    });
}


// Function to hide 
var hideLanding = function () {
    recipeContainer.removeClass("hide");
    landingContainer.addClass("hide");

}

randomiseButton.on("click",hideLanding);


// Save current recipe to local storage when favourite button is clicked. Or, remove from local storage if clicked again.
// When we initially generate the favourites button we need to check whether the recipe ID is already present in local storage. Then, set the data-saved attribute to true if it is or false if not

favouriteRecipeButton.on('click', function(){
if(favouriteRecipeButton.attr(data-saved) === false)
{
    favouriteRecipeButton.attr(data-saved, true) 
    // Need to add a line here to update styling/text content on button to show the recipe is saved
    
    
    // Adding the recipe into local storage using the ID from spoonacular as the name.
    // Using the spoonacular ID gives us a unique ID for each recipe so we can easily check if it already exists 
    // Define currentRecipe as a global variable elsewhere. It should be an object matching the structure of the fullRecipe object in getRecipes()
    var savingRecipe = JSON.stringify(currentRecipe);
    localStorage.setItem(currentRecipe.recipeID, savingRecipe);
}
else
{
    favouriteRecipeButton.attr(data-saved, true);
    localStorage.removeItem(currentRecipe.recipeID);

    // Need to add a line here to update styling/text content on button to show the recipe is not saved
}

}
)