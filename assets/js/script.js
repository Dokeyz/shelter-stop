// Variables (currently unused)
const pets = [];
var petSearchEl = document.getElementById("#petSearch");
var inputSearchEl = document.getElementById("#input-search")
var dropDownEl = document.getElementById("#dropdown");

//Test to see if JS is being read
console.log("Test verified");

//key and secret key
const key = "3MhZWv3SRcv8wPldKWvstjLodBxUaDsorgFz5QCH9ytZZUg35U";
const secret = "xcxJUki5IurEVc8LldFqf7ZAzdERM8MJihnCNinr";

var pf = new petfinder.Client({apiKey: "3MhZWv3SRcv8wPldKWvstjLodBxUaDsorgFz5QCH9ytZZUg35U", secret: "xcxJUki5IurEVc8LldFqf7ZAzdERM8MJihnCNinr"});

pf.animal.search()
    .then(function (response) {
        // Do something with `response.data.animals`
        console.log(response);
    })
    .catch(function (error) {
        // Handle the error
    });

//asyncronous function provided by SDK
async function showAnimals(animalType, searchBreed, location) {
    //Show first page of pets
    let page = 1;
    
    //So far this will show results based on type, breed, and location
    apiResult = await pf.animal.search({
        type: animalType,
        breed: searchBreed,
        location,
        page,
        limit: 1,
    });
    let Idx = (page - 1) * 1;
    apiResult.data.animals.forEach(function(animal) {
        console.log(` -- ${++Idx}: ${animal.name} id: ${animal.id} url: ${animal.url}`);
    });
    }

    //currently this function only shows dogs in the 32219 florida zip code
(async function() {
    await showAnimals("Dog",undefined,32219);
    
})();

//!//

//CODE FOR THE SECOND API BELOW:

//!//

//Default map layer
let map = L.map('map', {
    layers: MQ.mapLayer(),
    //Random lattitude, longitude (Orlando, FL)
    center: [28.5384, -81.3789],
    zoom: 12
});
    function runDirection(start, end) {
        
        //recreating new map layer after removal
        map = L.map('map', {
            layers: MQ.mapLayer(),
            center: [28.5384, -81.3789],
            zoom: 12
        });
        
        var dir = MQ.routing.directions();

        dir.route({
            locations: [
                start,
                end
            ]
        });
    

        CustomRouteLayer = MQ.Routing.RouteLayer.extend({
            createStartMarker: (location) => {
                var custom_icon;
                var marker;

                custom_icon = L.icon({
                    iconUrl: './assets/images/red.png',
                    iconSize: [20, 29],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });

                marker = L.marker(location.latLng, {icon: custom_icon}).addTo(map);

                return marker;
            },

            createEndMarker: (location) => {
                var custom_icon;
                var marker;
                //Use blue marker image for destination
                custom_icon = L.icon({
                    iconUrl: './assets/images/blue.png',
                    iconSize: [20, 29],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });

                marker = L.marker(location.latLng, {icon: custom_icon}).addTo(map);

                return marker;
            }
        });
        
        map.addLayer(new CustomRouteLayer({
            directions: dir,
            fitBounds: true
        })); 
    }

//Function that runs when form is submitted
function submitForm(event) {
    event.preventDefault();

    //Deletes map layers
    map.remove();

    //Gets data for the map, currently hardcoded to zip code 32219 and a destination value for the form, below is the appropriate start commented out:
    //start = document.getElementById("zipCode");
    start = "32219";
    end = document.getElementById("destination").value;

    // run directions function
    runDirection(start, end);

    // reset form
    document.getElementById("form").reset();
}

//Assigns the form to form variable
const form = document.getElementById('form');

//Call the submitForm() function when submitting the form - WILL NEED TO CHANGE THIS TO MATCH THE PETFINDER API UPON CLICKING A PET
form.addEventListener('submit', submitForm);