$(document).ready(function(){

var cuisinesList = [
    ""
]

var recipeContainer = $("#recipeContainer");
var landingContainer = $("#landingContainer");

var randomiseButton = $("#randomiseButton");


var favouritesContainer = $("#favourites");

// Recipe elements
var recipeHeader = $("#recipeHeader");
var recipeImg = $("#recipePhoto");
var recipeIngred = $("#recipeIngred");
var recipeInstruct = $("#recipeInst");


function getRecipes(cuisine){
    var queryURL = "https://api.spoonacular.com/recipes/random?apiKey=ad7eae9455534c2b9df85e498cdf804b&number=1&tags=dinner,main dish,"+cuisine
    $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {

        console.log(response);


        var ingredients = [];
        response.recipes[0].extendedIngredients.forEach(element => {
            ingredients.push(element.original);
        

        });


        var fullRecipe = {
            recipeName : response.recipes[0].title,
            recipeIngredients : ingredients,
            recipeImageURL : response.recipes[0].image,
            recipeInstructions : response.recipes[0].instructions,
            recipeURL : response.recipes[0].sourceUrl,
        }

        console.log(fullRecipe);
        
        // Update header to recipe name
        recipeHeader.text(fullRecipe.recipeName);

        // Update image to recipe image
        recipeImg.attr("src",fullRecipe.recipeImageURL);

        recipeIngred.text(fullRecipe.recipeIngredients);



    });
}


// Function to hide 
var hideLanding = function () {
    recipeContainer.removeClass("hide");
    landingContainer.addClass("hide");
    getRecipes("italian");
}

randomiseButton.on("click",hideLanding);


});