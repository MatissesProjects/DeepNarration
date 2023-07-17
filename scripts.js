// Function to add a new textbox dynamically
function addTextbox(containerId) {
    var container = document.getElementById(containerId);
    var newTextbox = document.createElement('input');
    newTextbox.type = 'text';
    container.appendChild(newTextbox);
    container.appendChild(document.createElement("br"));
}

document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    var formData = new FormData(this); // Create a new FormData object

    // Iterate over the additional textboxes in scenes-container
    var scenesTextboxes = document.querySelectorAll("#scenes-container input[type='text']");
    scenesTextboxes.forEach(function(textbox) {
        formData.append("scenes", textbox.value); // Append each textbox value with the name "scenes"
    });

    // Iterate over the additional textboxes in images-container
    var imagesTextboxes = document.querySelectorAll("#images-container input[type='text']");
    imagesTextboxes.forEach(function(textbox) {
        formData.append("images", textbox.value); // Append each textbox value with the name "images"
    });

    // Perform the form submission with the updated form data
    fetch("/submit", {
        method: "POST",
        body: formData
    })
    .then(response => {
        // Handle the response as needed
    })
    .catch(error => {
        // Handle any errors
    });
});
