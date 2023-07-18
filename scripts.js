let maxWords = 75;
let VIDEO_PAGE = 'videoPage'
let INPUT_PAGE = 'inputPage'
let LOADING_PAGE = 'loadingPage'

// Function to add a new textbox dynamically
function addTextbox(containerId) {
    var container = document.getElementById(containerId);
    var newTextbox = document.createElement('textarea');
    newTextbox.type = 'textarea';

    // Array of random strings
    var randomStrings = ['person in a chair', 'landscape with mountains', 'still life with fruits', 'abstract artwork'];
    var randomIndex = Math.floor(Math.random() * randomStrings.length);
    newTextbox.value = randomStrings[randomIndex];
    newTextbox.style.height = "26px"

    newTextbox.oninput = function() {
        this.style.height = "5px";
        this.style.height = (this.scrollHeight)+"px";
        let words = this.value.split(' ');
        if (words.length > maxWords) {
            this.value = words.slice(0, maxWords).join(' ');
            alert('You have reached the word limit.');
        }
    }

    container.appendChild(newTextbox);
    container.appendChild(document.createElement("br"));
}

function navagate(page) {
    let sceneInputPage = document.getElementById("myForm")
    let videoOutputPage = document.getElementById("videoPage")
    let loaderPage = document.getElementById("loadingPage")
    let pageMap = {}
    pageMap[INPUT_PAGE] = sceneInputPage
    pageMap[VIDEO_PAGE] = videoOutputPage
    pageMap[LOADING_PAGE] = loaderPage
    hideList = Object.keys(pageMap).filter((value) => value != page)

    console.log(`hideList: ${hideList}`)
    let nextPage = pageMap[page]
    nextPage.classList.remove('hidden');

    hideList.forEach(it => {
        pageMap[it].classList.add('hidden')
    })

    setTimeout(() => {
        hideList.forEach(it => {
            pageMap[it].hidden = true
        })
        nextPage.hidden = false
    }, 400);
}

function submitForm(event) {
    navagate(LOADING_PAGE)
    event.preventDefault(); // Prevent the default form submission

    var scenesTextboxes = document.querySelectorAll("#scenes-container textarea");
    var positivePrompt = []
    var textToSay = ''
    var imagesData = []
    var promises = []
    var index = 1
    var videoBlock = document.getElementById("videoBlock")
    let sceneInputPage = document.getElementById("myForm")
    let videoOutputPage = document.getElementById("videoPage")

    scenesTextboxes.forEach(textbox => {
        var formData = {
            prompt: textbox.value
        };
        positivePrompt.push(`"${index}": "${textbox.value}"`)
        textToSay += textbox.value + " "
        index++
        promises.push(getImages(formData, useDummy)
                      .then(response => {console.log(response);imagesData.push(response)})
                      .catch(error => console.error(error)));
    })

    // start call into deforum
    Promise.all(promises).then( _ => {
        var formData = {
            prompt: "{"+positivePrompt.join(", ")+"}",
            images: "{"+imagesData.map((images, idx) => `"${idx}": ["${images.join("\",\"")}"]`)+"}"
        };
        console.log(formData);
        getVideo(formData, useDummy)
            .then(videoData => videoData.text())
            .then(text => {
                var videoSource = document.createElement("source")
                var matches = text.match(/\/(\d+)\./)
                videoSource.src = `http://localhost:5050/output/${matches[1]}.mp4`;
                let durationPromise = new Promise(resolve => {
                    videoBlock.addEventListener('loadedmetadata', () => resolve(videoBlock.duration))
                })
                videoBlock.appendChild(videoSource)
                videoBlock.load()
                navagate(VIDEO_PAGE)
                durationPromise.then(videoDuration => {
                    fetch("http://127.0.0.1:5001/get_final_video", {
                        method: "POST",
                        body: JSON.stringify({videoUri:matches[1],
                                              promptDataString:textToSay,
                                              videoDuration:videoDuration}),
                        headers: {"Content-Type": "application/json"}
                    })
                .then(response => response.text())
                .then(text => {
                    videoSource.src = `http://localhost:5050/output/${matches[1]}.mp4`;
                    videoBlock.load();
                    console.log(text);
                })
                })
        });
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
