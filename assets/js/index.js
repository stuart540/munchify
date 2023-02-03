$(document).ready(function(){

var cuisinesList = [
    ""
]

var recipeContainer = $("#recipeContainer");
var landingContainer = $("#landingContainer");

var randomiseButton = $("#randomiseButton");
var favouriteRecipeButton = $("#favouriteRecipe");



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
            recipeID : response.recipes[0].id
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


// Save current recipe to local storage when favourite button is clicked. Or, remove from local storage if clicked again.
// When we initially generate the favourites button we need to check whether the recipe ID is already present in local storage. Then, set the data-saved attribute to true if it is or false if not

favouriteRecipeButton.on('click', function(){
if(favouriteRecipeButton.attr(data-saved) === false)
{
    favouriteRecipeButton.attr(data-saved, true) 
    // Need to add a line here to update styling/text content on button to show the recipe is saved
    
    
    // Adding the recipe into local storage using the ID from spoonacular as the name.
    // Using the spoonacular ID gives us a unique ID for each recipe so we can easily check if it already exists
    // Add "recipeID_" to the start of each key so if we store anything else in local storage we can seperate out recipes
    // Define currentRecipe as a global variable elsewhere. It should be an object matching the structure of the fullRecipe object in getRecipes()
    var savingRecipe = JSON.stringify(currentRecipe);
    localStorage.setItem(("recipeID_"+currentRecipe.recipeID), savingRecipe);
}
else
{
    favouriteRecipeButton.attr(data-saved, true);
    localStorage.removeItem(("recipeID_"+currentRecipe.recipeID));

    // Need to add a line here to update styling/text content on button to show the recipe is not saved
}
});

function savedRecipeCardsRender(){
    
    // Retrieve all items from local storage and place into arrays
    var keys = Object.keys(localStorage);
    var values = Object.values(localStorage);
    // Remove any elements in the arrays that are not saved recipes    
    for (i in keys){
        if(keys[i].startsWith("recipeID_")){}
        else
        {keys.splice(i,1);
         values.splice(i,1);           
        }
    }    
    // Pick 3 elements indexs in recipe list to display. Or if 3 or less just pick what we have
    var selectedRecipes = []
    if (keys.length < 4){
        switch(keys.length) {
            case 1:
              selectedRecipes = [0]
              break;
            case 2:
              selectedRecipes = [1,0]
              break;
            case 3:
              selectedRecipes = [2,1,0]
          }
    } else {
        selectedRecipes = generateRandomNumbers(3,keys.length)
    }
    




}

// Function for picking n unique random numbers out of a list up to a max number
function generateRandomNumbers(n,max) {
    let uniqueNumbers = [];
    while (uniqueNumbers.length < n) {
      let randomNumber = Math.floor((Math.random() * max) + 0);
      if (!uniqueNumbers.includes(randomNumber)) {
        uniqueNumbers.push(randomNumber);
      }
    }
    return uniqueNumbers;
  }

});