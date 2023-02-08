$(document).ready(function(){



var recipeContainer = $("#recipeContainer");
var landingContainer = $("#landingContainer");
var favouritesContainer = $("#favouritesContainer")

var randomiseButton = $("#randomiseButton");
var submitButton = $("#submitBtn");

var tempRecipes = []

var currentRecipeFavouriteButton = $("#favouriteButton");
var favouriteColumn0 = $("#favouriteColumn0");
var favouriteColumn1 = $("#favouriteColumn1");
var favouriteColumn2 = $("#favouriteColumn2");

var playlistImg = $("playlistPhoto")

// Recipe elements
var recipeHeader = $("#recipeHeader");
var recipeImg = $("#recipePhoto");
var recipeIngred = $("#recipeIngred");
var recipeInstruct = $("#recipeInst");

// Playlist elements
var playlistImg = $("playlistPhoto")


function getRecipes(cuisine){
    var queryURL = "https://api.spoonacular.com/recipes/random?apiKey=f14cec32cf4e47acbb3dd6e49f5de686&number=1&tags=dinner,"+cuisine
    $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
        var ingredients = [];
        response.recipes[0].extendedIngredients.forEach(element => {
            ingredients.push(element.original);    

        });
        console.log(response)
        var fullRecipe = {
            recipeName : response.recipes[0].title,
            recipeIngredients : ingredients,
            recipeImageURL : response.recipes[0].image,
            recipeInstructions : response.recipes[0].instructions,
            recipeURL : response.recipes[0].sourceUrl,
            recipeID : response.recipes[0].id,
            recipeCuisine : response.recipes[0].cuisines[0]
        }

        // Add fullRecipe to the tempRecipes array where we hold the recipes we're dealing with in this session
        tempRecipes.push(fullRecipe);

        // Send to render function
        recipeRender(fullRecipe);      


    });
}



function recipeRender(recipe){
    recipeContainer.removeClass("hide");
    landingContainer.addClass("hide");
    favouritesContainer.addClass("hide");
    $("#prevBtn").removeClass("hide");
    console.log(recipe)
     // Set current recipe button ID
     currentRecipeFavouriteButton.attr("data-ID",recipe.recipeID)

     // Check if recipe is in local storage and set data-saved attribute and favourite text accordingly

     if(localStorage.getItem("recipeID_"+recipe.recipeID) === null){
        currentRecipeFavouriteButton.attr("data-saved","false")
        currentRecipeFavouriteButton.text("Add to favourites")
     }
     else
     {
        currentRecipeFavouriteButton.attr("data-saved", "true")
        currentRecipeFavouriteButton.text("Remove from favourites") 
     }

     // Update header to recipe name
     recipeHeader.text(recipe.recipeName);

     // Update image to recipe image
     recipeImg.attr("src",recipe.recipeImageURL);

     $("#confirmLink").on("click",function(){

        window.open(recipe.recipeURL,"_blank");

     })

     
     // Adjust recipe image position
     recipeImg.attr("class","mx-auto")

     recipeIngred.text(recipe.recipeIngredients);

     // Update recipe instruction 
     let recipeInstructText = recipe.recipeInstructions.replace(/<ol>|<li>|<\/ol|<\/li>|<\/span>|<span>|<p>|<\/p>/g, function(match) {
         switch (match) {
             case "<ol>":
             case "<li>":
             case "</li>":
             case "</ol>":
             case "<span>":
             case "</span>":
             case "<p>":
             case "</p>":
                 return "";
         }
     });

     recipeInstruct.text(recipeInstructText)


     // Create unordered list
     var unorderList = $("<ul>");

     // For items in ingredients array
     for (var i =0; i < recipe.recipeIngredients.length; i++){
         // Create list item
         var ingredientEl = $("<li>");
         // Change text to indexed item of array
         ingredientEl.text(recipe.recipeIngredients[i]);
         // Append list item to unordered list
         unorderList.append(ingredientEl);
     }

     console.log(unorderList);
     // Append unordered list to recipe ingredient
     recipeIngred.append(unorderList.innerHTML);
     // Adjust Playlist Image position
     playlistImg.attr("class","mx-auto")
     getSpotifyPlaylist(recipe.recipeCuisine);

}



// Function to hide 
var displayData = function (cuisine) {
    recipeContainer.removeClass("hide");
    landingContainer.addClass("hide");
    $("#prevBtn").removeClass("hide");
    getRecipes(cuisine);
}

randomiseButton.on("click",displayData);

$("#prevBtn").on("click",function(){
    recipeContainer.addClass("hide");
    landingContainer.removeClass("hide");
    favouritesContainer.addClass("hide");
    retrievePreviousRecipes();
    $("#prevBtn").addClass("hide");
    $("#favouritesBtn").removeClass("hide");
})
$("#favouritesBtn").on("click",function(){
    recipeContainer.addClass("hide");
    landingContainer.addClass("hide");
    favouritesContainer.removeClass("hide");
    favouritesMenu();

})

// When user clicks on submit
submitButton.on("click",function(){
    // Get the value chosen in the form
    var chosenCuisine = $("#selectForm").val();
    // Load the photo 
    getRecipes(chosenCuisine);
    $("#prevBtn").removeClass("hide");
})

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

}

};

function retrievePreviousRecipes(){
    // Clear any previously generated card elements and hide the header
    var cardDeck = $("#previousCards")
    cardDeck.empty();
    var header = $("#previousSearch")
    header.addClass("hide")
    
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
    var card = $('<div>');
    var cardImg = $('<img>');
    var cardBody = $('<div>');
    var cardh5 = $('<h5>');
    var cardButton = $('<div>');
    
    card.addClass("card landingCard");
    cardImg.addClass("card-img-top");
    cardBody.addClass("card-body");
    cardh5.addClass("card-title");
    cardButton.addClass("card-block stretched-link text-decoration-none")
    
    cardImg.attr("src",recipe.recipeImageURL);
    cardh5.text(recipe.recipeName);
    cardButton.attr("data-ID",recipe.recipeID)

    cardBody.append(cardh5);
    cardBody.attr("style","background-color:#b9fbc0;");
    card.append(cardImg);
    card.append(cardBody);
    cardh5.append(cardButton);
    htmlEl.append(card);



    cardButton.on('click', function () {
        var recipeID = cardButton.attr("data-ID")
        if(localStorage.getItem("recipeID_"+recipeID) === null){
            var recipe = tempRecipes.find(obj => {
                return obj.recipeID === parseInt(recipeID)
                })
         }
         else
         {
            var recipe = JSON.parse(localStorage.getItem("recipeID_"+recipeID))
         }
         console.log(recipe)
        recipeRender(recipe)
      });


}

// Same function as recipeCardRender() except we add a favourite button and try again button
function recipeCardRenderWithButtons(recipe,htmlEl){
    var card = $('<div>');
    var cardImg = $('<img>');
    var cardBody = $('<div>');
    var cardh5 = $('<h5>');
    var cardButton = $('<button>');
    var removeFaveBtn = $('<button>');
    
    card.addClass("card");
    cardImg.addClass("card-img-top");
    cardBody.addClass("card-body");
    cardh5.addClass("card-title");
    removeFaveBtn.attr("data-saved","true");
    removeFaveBtn.attr("data-ID",recipe.recipeID);
    
    
    cardImg.attr("src",recipe.recipeImageURL);
    cardh5.text(recipe.recipeName);
    cardButton.attr("data-ID",recipe.recipeID);
    cardButton.text("Cook Again");
    removeFaveBtn.text("Remove from favourites");

    cardBody.append(cardh5);
    cardBody.attr("style","background-color:#b9fbc0;");
    card.append(cardImg);
    card.append(cardBody);
    cardBody.append(removeFaveBtn);
    cardBody.append(cardButton);    
    htmlEl.append(card);



    cardButton.on('click', function () {
        var recipeID = cardButton.attr("data-ID")
        if(localStorage.getItem("recipeID_"+recipeID) === null){
            var recipe = tempRecipes.find(obj => {
                return obj.recipeID === parseInt(recipeID)
                })
         }
         else
         {
            var recipe = JSON.parse(localStorage.getItem("recipeID_"+recipeID))
         }
         console.log(recipe)
        recipeRender(recipe)
      });

    removeFaveBtn.on('click', function () {
    favouriteRecipe(removeFaveBtn)
    });


}

function favouritesMenu(){
    // Delete anything previously rendered

    favouriteColumn0.empty();
    favouriteColumn1.empty();
    favouriteColumn2.empty();


    // Hide other divs and show favourites
    recipeContainer.addClass("hide");
    landingContainer.addClass("hide");
    favouritesContainer.removeClass("hide");
    $("#prevBtn").removeClass("hide");
    $("#favouritesBtn").addClass("hide");

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

     // Parse recipes and place into an array
     var allRecipes = []
     values.forEach(element => {
        allRecipes.push(JSON.parse(element))
     });

     x = 0



    allRecipes.forEach(element => {
        if(x === 3){x = 0}
        switch(x) {
            case 0:
            recipeCardRenderWithButtons(element,favouriteColumn0)
              break;
            case 1:
            recipeCardRenderWithButtons(element,favouriteColumn1)
              break;
            case 2:
            recipeCardRenderWithButtons(element,favouriteColumn2)
        }
        x++


     });

}




retrievePreviousRecipes();

});

