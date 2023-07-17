// Function to add a new textbox dynamically
function addTextbox(containerId) {
    var container = document.getElementById(containerId);
    var newTextbox = document.createElement('input');
    newTextbox.type = 'text';
    newTextbox.value = 'person in a chair'
    container.appendChild(newTextbox);
    container.appendChild(document.createElement("br"));
}

function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission

    var scenesTextboxes = document.querySelectorAll("#scenes-container input[type='text']");
    var scenesData = scenesTextboxes.forEach(textbox => {
        var formData = {
            prompt: textbox.value//.concat(imagesData)
        };
        fetch("http://127.0.0.1:5001/getImages", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            // Handle the response as needed
            console.log(response.json())
        })
        .catch(error => {
            // Handle any errors
        });
    });

    // var imagesTextboxes = document.querySelectorAll("#images-container input[type='text']");
    // var imagesData = Array.from(imagesTextboxes).map(function(textbox) {
    //     return textbox.value;
    // });


    // Perform the AJAX request to send the data
}