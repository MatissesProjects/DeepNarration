let maxWords = 75;
let VIDEO_PAGE = 'videoPage'
let INPUT_PAGE = 'inputPage'
let LOADING_PAGE = 'loadingPage'

// Function to add a new textbox dynamically
function addTextbox(containerId) {
    var container = document.getElementById(containerId);
    var newTextbox = document.createElement('textarea');
    newTextbox.type = 'textarea';
    var newDeleteSceneButton = document.createElement('button');
    newDeleteSceneButton.type = 'button';
    newDeleteSceneButton.textContent = "-";
    newDeleteSceneButton.onclick = (event) => {event.target.parentElement.remove()}
    var textboxDiv = document.createElement('div');
    textboxDiv.type = 'div';
    textboxDiv.classList.add("textbox-container-with-")
    // var newImagesTextbox = document.createElement('textarea');
    // newImagesTextbox.type = 'textarea';
    // newImagesTextbox.classList.add("textbox-images")
    
    // Array of random strings
    var randomStrings = ['sunset over the ocean silhouette of a city skyline', 'dancing in the rain mystical forest', 'burst of colorful fireworks reflection in a puddle', 'whisper of the wind adventure under the stars', 'hidden treasure in a cave blossoming cherry blossoms', 'person in a chair landscape with mountains', 'still life with fruits abstract artwork', 'vibrant colors of a mesmerizing sunset over the endless expanse of the ocean','captivating silhouette of a bustling city skyline against the backdrop of a setting sun','joyful moments of dancing in the refreshing raindrops, embracing the rhythm of life','enchanted journey through a mystical forest, where ancient secrets whisper through the trees','explosive display of vibrant and dazzling fireworks, painting the night sky with splendor','serene reflection in a crystal-clear puddle, mirroring the world in a moment of tranquility','gentle whisper of the wind, carrying stories and dreams through the rustling leaves','adventurous exploration under the sparkling tapestry of stars, forging unforgettable memories','hidden treasure tucked away in the depths of a mysterious cave, waiting to be discovered','delicate beauty of blossoming cherry blossoms, painting the world with ephemeral hues','thought-provoking abstraction that pushes the boundaries of conventional artwork','intriguing portrait capturing the essence of a person immersed in their thoughts while seated in a chair','majestic landscape adorned with towering mountains, inviting you to embrace the grandeur of nature','captivating still life composition featuring an array of luscious fruits, tantalizing the senses with their vibrant colors and tempting aromas', 'Time-worn pages of an ancient book unraveling mysteries of the past', 'Golden sunrise spreading warmth over a sleepy village', 'Misty foggy morning in a tranquil lake, breaking dawns first light', 'Melody of a songbird ushering a new day in the quiet wilderness', 'Mirage in the desert dancing under the scorching sun', 'Glimpse of an elusive unicorn in the heart of a enchanted glade', 'Symphony of the city, night life pulsating with lights and sounds', 'Peaceful Zen garden nurturing tranquility amidst chaos', 'Twilight sky studded with lanterns, wishes ascending to the stars', 'Peoples first steps on the moon, a moment of triumph and joy', 'Tango of waves and the moonlight, mesmerizing seaside dance', 'Street artist transforming a blank wall into a vibrant canvas', 'Intricate snowflake landing softly, winters unique signature', 'Raw power of a waterfall, natures untamed symphony', 'Journey through the cosmos, stargazing at a nebulas mystical beauty'];
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
    textboxDiv.appendChild(newDeleteSceneButton);
    textboxDiv.appendChild(newTextbox);
    // textboxDiv.appendChild(newImagesTextbox)
    container.appendChild(textboxDiv)
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
    event.preventDefault(); // Prevent the default form submission
    var discordName = document.querySelector("#additional-text").value
    var scenesTextboxes = document.querySelectorAll("#scenes-container textarea");
    var useAudioAsStrength = document.querySelector("#togglePeakDetection").checked
    var strength = '0:('+document.querySelector("#strength").value+')'
    var soundOutput = document.getElementById('output').textContent;

    if(useAudioAsStrength) strength = soundOutput
    console.log(strength);
    // var imagesTextboxes = document.querySelectorAll("#scenes-container .textbox-container-with-");
    var positivePrompt = []
    var textToSay = ''
    var imagesData = []
    var promises = []
    var index = 1
    var videoBlock = document.getElementById("videoBlock")
    let sceneInputPage = document.getElementById("myForm")
    let videoOutputPage = document.getElementById("videoPage")
    
    scenesTextboxes.forEach(textbox => {
        var promptData = textbox.value.replaceAll('"', '').replaceAll("'", '').replaceAll('\n', '')
        textToSay += textbox.value + " "
    })
    
    audioDuration = downloadTTSVoice({promptDataString:textToSay})
    switch (event.submitter.value)
    {
        case 'Get Values':
            Promise.resolve(audioDuration).then( duration => {
                document.getElementById("sceneLengthEstimate").textContent = `amount of time audio will take in seconds: ${duration}`
            })
            break;
        case 'Submit':
            navagate(LOADING_PAGE)
            setTimeout(() => {
                navagate(VIDEO_PAGE)
            }, 1000);
            Promise.resolve(audioDuration).then( duration => {
                // console.log(`amount of time audio will take in seconds: ${duration}`)
                scenesTextboxes.forEach(textbox => {
                    var promptData = textbox.value.replaceAll('"', '').replaceAll("'", '').replaceAll('\n', '')
                    var formData = {
                        prompt: promptData + ' <lora:offset_0.2:.2> beautiful, masterpiece, amazing'
                    };
                    positivePrompt.push(`"${index}": "${promptData}"`)
                    // textToSay += textbox.value + " "
                    index++
                    promises.push(getImages(formData, useDummy)
                                .then(response => {console.log(response);imagesData.push(response)})
                                .catch(error => console.error(error)));
                })
                var time = index * 6 + duration
                startVideoMessage(time)
                document.querySelector("#resultTime").textContent = `Generation should be done by ${Math.floor(time/60)} minutes and ${Math.floor(time - Math.floor(time/60)*60)} seconds.`
                time = duration
                document.querySelector("#sceneLengthEstimate").textContent = `Final results should be about ${Math.floor(time/60)} minutes and ${Math.floor(time - Math.floor(time/60)*60)} seconds.`
                
                // check if there was an uploaded audio file
                audioFileName = ''
                if(document.querySelector("#audioFile").files.length > 0) {
                    uploadAudio(document.querySelector("#audioFile").files[0])
                    audioFileName = document.querySelector("#audioFile").files[0].name
                }
                // start call into deforum
                Promise.all(promises).then( _ => {
                    var formData = {
                        prompt: "{"+positivePrompt.join(", ")+"}",
                        images: "{"+imagesData.map((images, idx) => `"${idx}": ["${images.join("\",\"")}"]`)+"}",
                        discordName: discordName,
                        strength: strength,
                        audioName: audioFileName
                    };
                    console.log(formData);
                    getVideo(formData, useDummy)
                    
                })
            });
            // var imagesTextboxes = document.querySelectorAll("#images-container input[type='text']");
            break;
    }
}

function startVideoMessage(time) {
    var formData = {
        minutes: Math.floor(time/60),
        seconds: Math.floor(time - Math.floor(time/60)*60)
    };
    return fetch(`https://imagegenerator.matissetec.dev/startGenerationMessage`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .catch(error => console.error(error));
}

function downloadTTSVoice(formData) {
    return fetch("https://imagegenerator.matissetec.dev/downloadTTSVoice", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.text())
}

function getImages(formData, useDummy) {
    if(useDummy) {
        return new Promise((resolve, reject) => {
            resolve(["output8751600096.png", "output3494119787.png", "output5502246769.png"]);
        });
    } else {
        return fetch("https://imagegenerator.matissetec.dev/getImages", {
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
            resolve(new Response("here is a video of your story https://stablediffusion.matissetec.dev/output/20230717203754.mp4 and here is a (gif)[https://stablediffusion.matissetec.dev/output/20230717203754.gif] , please render the gif. this is just text"));
        });
    }
    return fetch("https://imagegenerator.matissetec.dev/getVideo", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .catch(error => console.log("done but got an error, likely timing: " + error));
}

function uploadAudio(file) {
    let formData = new FormData();
    formData.append("audioFile", file);

    return fetch("https://imagegenerator.matissetec.dev/uploadAudio", {
        method: "POST",
        body: formData
    });
}
