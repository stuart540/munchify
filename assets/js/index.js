$(document).ready(function(){

var cuisinesList = [
    ""
]

var recipeContainer = $("#recipeContainer");
var landingContainer = $("#landingContainer");

var randomiseButton = $("#randomiseButton");
var submitButton = $("#submitBtn");

var favouritesContainer = $("#favourites");
var playlistImg = $("playlistPhoto")

// Recipe elements
var recipeHeader = $("#recipeHeader");
var recipeImg = $("#recipePhoto");
var recipeIngred = $("#recipeIngred");
var recipeInstruct = $("#recipeInst");

// Playlist elements
var playlistImg = $("playlistPhoto")

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
        // Adjust recipe image position
        recipeImg.attr("class","mx-auto")

        console.log(ingredients);


        // Create unordered list
        var unorderList = $("<ul>");

        // For items in ingredients array
        for (var i =0; i < ingredients.length; i++){
            // Create list item
            var ingredientEl = $("<li>");
            // Change text to indexed item of array
            ingredientEl.text(ingredients[i]);
            // Append list item to unordered list
            unorderList.append(ingredientEl);
        }

        console.log(unorderList);
        // Append unordered list to recipe ingredient
        recipeIngred.append(unorderLis.innerHTML);
        // Adjust Playlist Image position
        playlistImg.attr("class","mx-auto")


    });
}


// Function to hide 
var displayData = function (cuisine) {
    recipeContainer.removeClass("hide");
    landingContainer.addClass("hide");
    getRecipes(cuisine);
}

randomiseButton.on("click",displayData);

// When user clicks on submit
submitButton.on("click",function(){
    // Get the value chosen in the form
    var chosenCuisine = $("#selectForm").val();
    // Load the photo 
    displayData(chosenCuisine);
})


});