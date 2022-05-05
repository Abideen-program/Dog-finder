const ALLBREED_LIST = 'https://dog.ceo/api/breeds/list/all';
const SELECT = document.querySelector('select');
const SLIDESHOW = document.getElementById('slideshow');
let timer;
let removeFirstImage;

// To get list of dog breed
async function load(){
    try{
        const response = await fetch(ALLBREED_LIST);
        const data = await response.json() //converting the fetch data from the api into json
        createBreedList(data.message); // getting on the message part of our json response
    } catch{
        alert('There is an error fetching the data from the server')
    }
    
}
load()

function createBreedList(breedList){
    const BREEDLIST = Object.keys(breedList); //turning the key(properties) in our message into an array
    BREEDLIST.forEach( breed =>{ //looping through the returned array and appending them to the select dropdown
        const OPTION = document.createElement('option') //this create an <option></option>
        OPTION.value = breed; //assign the value of breed to each breed
        OPTION.appendChild(document.createTextNode(breed)) //create assign the breed to the option tag as a text
        SELECT.appendChild(OPTION) //assign the option tag to the select dropdown
        // console.log(OPTION)
    })
}

async function loadEachBreed(e){
    const VALUE = e.target.value; //to get the value of the clicked breed
    if(VALUE != 'Select a dog breed'){ //to disselect the first option (select a dog breed)
        const EACHBREED_URL = `https://dog.ceo/api/breed/${VALUE}/images`; // fetch data from the server using clicked value 
        const response = await fetch(EACHBREED_URL); 
        const data = await response.json(); //converting the fetch data from the api into json
        createSlideshow(data.message) //pass the message part of the data into function
    }
}

function createSlideshow(images){
    let currentImagePosition = 0 //set image position to loop through array of images

    clearInterval(timer); //to restart the interval when a new breed is selected
    clearTimeout(removeFirstImage) // to remove the first image delay after the interval is clear

    if (images.length > 1){ //only run if the image of the breed is more than one
        SLIDESHOW.innerHTML = `
        <div class='slide' style='background-image: url(${images[0]})'></div>
        <div class='slide' style='background-image: url(${images[1]})'></div>
    ` // add first two images to the slideshow div.
        currentImagePosition += 2; //set the image position to the next image going to the slide

        if(images.length == 2){ //this runs when the image of the breed is just 2
            currentImagePosition = 0;
        }

        timer = setInterval(nextImage, 3000); //set an interval to always show new image after 3s
    } else { // this runs if the image of the breed is 1
        SLIDESHOW.innerHTML = `
        <div class='slide' style='background-image: url(${images[0]})'></div>
        <div class='slide'></div>
    `
    }


    function nextImage(){
        SLIDESHOW.insertAdjacentHTML('beforeend', `<div class='slide' style='background-image: url(${images[currentImagePosition]})'></div>`); //add new image below the last image after 3s
        
        removeFirstImage =  setTimeout( () => {
           document.querySelector('.slide').remove(); // alway remove the image position 1 when new image is added
        }, 1000);

        if(currentImagePosition + 1 >= images.length){
            currentImagePosition = 0;
        } else{
            currentImagePosition++;
        }
    }


}

SELECT.addEventListener('change', loadEachBreed)