$(document).ready(function(){

var cuisinesList = [
    ""
]

var recipeContainer = $("#recipeContainer");
var landingContainer = $("#landingContainer");

var randomiseButton = $("#randomiseButton");


var tempRecipes = []
var recipeCard0 = {}
var recipeCard1 = {}
var recipeCard2 = {}

var currentRecipeFavouriteButton = $("#currentFavouriteButton");
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

        // Add fullRecipe to the tempRecipes array where we hold the recipes we're dealing with in this session
        tempRecipes.push(fullRecipe);
        console.log(tempRecipes)

        // Set current recipe button ID
        currentRecipeFavouriteButton.attr("data-ID",fullRecipe.recipeID)

        // Update header to recipe name
        recipeHeader.text(fullRecipe.recipeName);

        // Update image to recipe image
        recipeImg.attr("src",fullRecipe.recipeImageURL);

        
        // Adjust recipe image position
        recipeImg.attr("class","mx-auto")

        recipeIngred.text(fullRecipe.recipeIngredients);

        // Adjust Playlist Image position
        playlistImg.attr("class","mx-auto")


    });
}


// Function to hide 
var hideLanding = function () {
    recipeContainer.removeClass("hide");
    landingContainer.addClass("hide");

    getRecipes("italian");
}

randomiseButton.on("click",hideLanding);

currentRecipeFavouriteButton.on('click', function () {
      favouriteRecipe(currentRecipeFavouriteButton)
    });


// I'm going to change favouriteRecipe() so we can call it as a function when the button is pressed on any recipe - not just on the current one.
// Save current recipe to local storage when favourite button is clicked. Or, remove from local storage if clicked again.
// When we initially generate the favourites button we need to check whether the recipe ID is already present in local storage. Then, set the data-saved attribute to true if it is or false if not

// Pass in the jquery element of the button. The button should have the recipe ID attached to it.
function favouriteRecipe(htmlevent){

if(htmlevent.attr("data-saved") === "false")
{
    htmlevent.attr("data-saved", "true")
    htmlevent.text("Remove from favourites") 
    // Need to add a line here to update styling/text content on button to show the recipe is saved    
    // --------

    // Adding the recipe into local storage using the ID from spoonacular as the name.
    // Using the spoonacular ID gives us a unique ID for each recipe
      var savingRecipe = tempRecipes.find(obj => {
        return obj.recipeID === parseInt(htmlevent.attr("data-ID"))
      })
      console.log(savingRecipe)
      var savingRecipeJSON = JSON.stringify(savingRecipe);
    // Add "recipeID_" to the start of each key so if we store anything else in local storage we can seperate out recipes
      localStorage.setItem(("recipeID_"+savingRecipe.recipeID), savingRecipeJSON);
    
}
else
{
    htmlevent.attr("data-saved", "false");
    htmlevent.text("Add to favourites")
    
    // Put the recipe details into a global variable so if the user changes their mind they can click button again and add back to favourites. This will clear when they leave the page.
    tempRecipes.push(JSON.parse(localStorage.getItem("recipeID_"+htmlevent.attr("data-ID"))))

    localStorage.removeItem(("recipeID_"+htmlevent.attr("data-ID")));

    // Need to add a line here to update styling/text content on button to show the recipe is not saved
    // ---------
}

};

function retrievePreviousRecipes(){
    
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
    // Pick 3 elements indexs in recipe list to display. Or if less than 4 just pick what we have
    var selectedRecipes = []

    // If there is nothing to load then exit function

    if (keys.length === 0){
        return;
    }
    if (keys.length < 4){
        switch(keys.length) {
            case 1:
              selectedRecipes = [0]
              break;
            case 2:
              selectedRecipes = [0,1]
              break;
            case 3:
              selectedRecipes = [0,1,2]
          }
    } else {
        selectedRecipes = generateRandomNumbers(3,keys.length)
    }
    
    // Setting a counter for next forEach loop
    x = 0

    // Show the header
    var header = $("#previousSearch")
        header.removeClass("hide")
    
    // Generate cards for each of the recipes we've picked and append to page
    selectedRecipes.forEach(element => {
        
        // Parse the recipe we're looking for
        thisRecipe = JSON.parse(values[element])

        // Set card global variable

        switch(x) {
            case 0:
              recipeCard0 = thisRecipe
              break;
            case 1:
              recipeCard1 = thisRecipe
              break;
            case 2:
              recipeCard2 = thisRecipe
        }
        
        // Increment the counter so we set the next variable
        x++ 

        // Pass recipe object and html element we're appending card to into card renderer
        var cardDeck = $("#previousCards")
        recipeCardRender(thisRecipe,cardDeck)

    });

}

// Function for picking n unique random numbers out of a list up to a max number
function generateRandomNumbers(n,max){
    let uniqueNumbers = [];
    while (uniqueNumbers.length < n) {
      let randomNumber = Math.floor((Math.random() * max) + 0);
      if (!uniqueNumbers.includes(randomNumber)) {
        uniqueNumbers.push(randomNumber);
      }
    }
    return uniqueNumbers;
    }



// Function to generate a bootstrap card from recipe object passed in and append to specified html element

function recipeCardRender(recipe,htmlEl){
    var card = $('<div>')
    var cardImg = $('<img>')
    var cardBody = $('<div>')
    var cardh5 = $('<h5>')
    
    card.addClass("card")
    cardImg.addClass("card-img-top")
    cardBody.addClass("card-body")
    cardh5.addClass("card-title")
    
    cardImg.attr("src",recipe.recipeImageURL)
    cardh5.text(recipe.recipeName)

    cardBody.append(cardh5);
    card.append(cardImg);
    card.append(cardBody);
    htmlEl.append(card)

}

retrievePreviousRecipes()

});

