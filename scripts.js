// Function to add a new textbox dynamically
function addTextbox(containerId) {
    var container = document.getElementById(containerId);
    var newTextbox = document.createElement('input');
    newTextbox.type = 'text';

    // Array of random strings
    var randomStrings = ['person in a chair', 'landscape with mountains', 'still life with fruits', 'abstract artwork'];
    var randomIndex = Math.floor(Math.random() * randomStrings.length);
    newTextbox.value = randomStrings[randomIndex];

    container.appendChild(newTextbox);
    container.appendChild(document.createElement("br"));
}


function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission

    var scenesTextboxes = document.querySelectorAll("#scenes-container input[type='text']");
    var positivePrompt = []
    var imagesData = []
    var promises = []
    var index = 1
    scenesTextboxes.forEach(textbox => {
        var formData = {
            prompt: textbox.value
        };
        positivePrompt.push(`"${index}": "${textbox.value}"`)
        index++
        promises.push(getImages(formData, useDummy)
                      .then(response => {console.log(response);imagesData.push(response)})
                      .catch(error => console.error(error)));
    })
    // .then( response =>{
    // start call into deforum
    Promise.all(promises).then( _ => {
        var imageObj = {}
        imagesData
        var formData = {
            prompt: "{"+positivePrompt.join(", ")+"}",
            images: "{"+imagesData.map((images, idx) => `"${idx}": ["${images.join("\",\"")}"]`)+"}"
        };
        console.log(formData);
        getVideo(formData, useDummy)
        .then(videoData => videoData.text())
        .then(text => {
            document.getElementById("gifDiv").innerText = text
            document.getElementById("videoBlock").innerText = text
        })
    });
    // var imagesTextboxes = document.querySelectorAll("#images-container input[type='text']");
}

function getImages(formData, useDummy) {
    if(useDummy) {
        return new Promise((resolve, reject) => {
            resolve(["output8751600096.png", "output3494119787.png", "output5502246769.png"]);
        });
    } else {
        return fetch("http://127.0.0.1:5001/getImages", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
    }
}

function getVideo(formData, useDummy) {
    if(useDummy) {
        return new Promise((resolve, reject) => {
            resolve(new Response("here is a video of your story http://localhost:5050/output/20230717203754.mp4 and here is a (gif)[http://localhost:5050/output/20230717203754.gif] , please render the gif. this is just text"));
        });
    }
    return fetch("http://127.0.0.1:5001/getVideo", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .catch(error => console.error(error));
}
