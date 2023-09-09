let maxWords = 75;
let VIDEO_PAGE = 'videoPage'
let INPUT_PAGE = 'inputPage'
let LOADING_PAGE = 'loadingPage'
var peakDisplayed = false;
var useTts = true;
var useInsertedImages = false;

// Function to add a new textbox dynamically
function addTextbox(containerId) {
    var initialText = "";
    var container = document.getElementById(containerId);
    var newTextbox = document.createElement('textarea');
    newTextbox.type = 'textarea';
    newTextbox.onblur = () => {
        if(newTextbox.value !== initialText) {
            initialText = newTextbox.value
            getTtsLength()
        }
    }
    newTextbox.title = "Max scene length is set to 75 words"

    var newDeleteSceneButton = document.createElement('button');
    newDeleteSceneButton.type = 'button';
    newDeleteSceneButton.textContent = "-";
    newDeleteSceneButton.title = "remove this scene"
    newDeleteSceneButton.classList.add("fab")
    newDeleteSceneButton.onclick = (event) => {
        event.target.parentElement.remove()
        getTtsLength()
    }
    var randomStrings = ['sunset over the ocean silhouette of a city skyline', 'dancing in the rain mystical forest', 'burst of colorful fireworks reflection in a puddle', 'whisper of the wind adventure under the stars', 'hidden treasure in a cave blossoming cherry blossoms', 'person in a chair landscape with mountains', 'still life with fruits abstract artwork', 'vibrant colors of a mesmerizing sunset over the endless expanse of the ocean', 'captivating silhouette of a bustling city skyline against the backdrop of a setting sun', 'joyful moments of dancing in the refreshing raindrops, embracing the rhythm of life', 'enchanted journey through a mystical forest, where ancient secrets whisper through the trees', 'explosive display of vibrant and dazzling fireworks, painting the night sky with splendor', 'serene reflection in a crystal-clear puddle, mirroring the world in a moment of tranquility', 'gentle whisper of the wind, carrying stories and dreams through the rustling leaves', 'adventurous exploration under the sparkling tapestry of stars, forging unforgettable memories', 'hidden treasure tucked away in the depths of a mysterious cave, waiting to be discovered', 'delicate beauty of blossoming cherry blossoms, painting the world with ephemeral hues', 'thought-provoking abstraction that pushes the boundaries of conventional artwork', 'intriguing portrait capturing the essence of a person immersed in their thoughts while seated in a chair', 'majestic landscape adorned with towering mountains, inviting you to embrace the grandeur of nature', 'captivating still life composition featuring an array of luscious fruits, tantalizing the senses with their vibrant colors and tempting aromas', 'Time-worn pages of an ancient book unraveling mysteries of the past', 'Golden sunrise spreading warmth over a sleepy village', 'Misty foggy morning in a tranquil lake, breaking dawns first light', 'Melody of a songbird ushering a new day in the quiet wilderness', 'Mirage in the desert dancing under the scorching sun', 'Glimpse of an elusive unicorn in the heart of a enchanted glade', 'Symphony of the city, night life pulsating with lights and sounds', 'Peaceful Zen garden nurturing tranquility amidst chaos', 'Twilight sky studded with lanterns, wishes ascending to the stars', 'Peoples first steps on the moon, a moment of triumph and joy', 'Tango of waves and the moonlight, mesmerizing seaside dance', 'Street artist transforming a blank wall into a vibrant canvas', 'Intricate snowflake landing softly, winters unique signature', 'Raw power of a waterfall, natures untamed symphony', 'Journey through the cosmos, stargazing at a nebulas mystical beauty', 'Sunlight filtering through swaying palm leaves on a tropical beach', 'Historic sailboat navigating choppy waters during a storm at sea', 'Majestic eagle soaring high above snow-capped mountain peaks', 'Hot air balloons floating gracefully over a vibrant autumn landscape', 'Delicate butterfly wings shimmering with vivid colors and intricate patterns', 'Ancient ruins blanketed in emerald moss, echoing with forgotten stories', 'Sun-bleached bones of an old shipwreck peeking through ocean waves'];
    var newShuffleButton = document.createElement('button');
    newShuffleButton.type = 'button';
    newShuffleButton.title = "add random text to this scene"
    newShuffleButton.classList.add("fab")
    newShuffleButton.textContent = '🔀';
    newShuffleButton.onclick = (event) => {
        // Array of random strings
        var randomIndex = Math.floor(Math.random() * randomStrings.length);
        newTextbox.value = randomStrings[randomIndex];
        initialText = newTextbox.value;
        getTtsLength()
    }
    var textboxDiv = document.createElement('div');
    textboxDiv.type = 'div';
    textboxDiv.classList.add("textbox-container-with-")

    var imageDiv = document.createElement('div');
    imageDiv.type = 'div';
    imageDiv.classList.add("image-container-plus")

    var moreImagesButton = document.createElement('button')
    moreImagesButton.type = 'button'
    moreImagesButton.title = 'optionally add url of images to this scene, more is better, up to 5 for now, order matters. Or add none and get them all generated'
    moreImagesButton.textContent = '+ image'
    moreImagesButton.onclick = (event) => {
        if(event.target.parentElement.getElementsByClassName("image-textarea").length < 5) {
            var newImagebox = document.createElement('textarea');
            newImagebox.classList.add("image-textarea")
            newImagebox.style.height = "10px"
            newImagebox.style.width = "100%"
            newImagebox.title = "url of your image"
            imageDiv.appendChild(newImagebox);
        }
    }
    imageDiv.appendChild(moreImagesButton)

    var lessImagesButton = document.createElement('button')
    lessImagesButton.type = 'button'
    lessImagesButton.title = 'removes last image from this scene'
    lessImagesButton.textContent = '- image'
    lessImagesButton.onclick = (event) => {
        if(event.target.parentElement.getElementsByClassName("image-textarea").length > 0) {
            var lastImageContainer = event.target.parentElement.getElementsByClassName("image-textarea")
            imageDiv.removeChild(lastImageContainer[lastImageContainer.length-1]);
        }
    }
    imageDiv.appendChild(lessImagesButton)
    var themeSelection = document.createElement('select')
    themeSelection.classList.add("themeSelection");
    themeSelection.title = "add extra information to your prompts automatically with these addons"
    createOption(themeSelection, "None");
    createOption(themeSelection, "Wild");
    createOption(themeSelection, "Fun");
    createOption(themeSelection, "Strange");
    themeSelection.value = 'None';
    
    var newSceneTime = document.createElement('textarea');
    newSceneTime.type = 'textarea';
    newSceneTime.title = 'Amount of time in seconds this scene should be visible for'
    newSceneTime.classList.add('sceneTime');
    newTextbox.classList.add("sceneTextboxes")
    newTextbox.style.height = "26px";
    newTextbox.style.width = "70%";
    themeSelection.style.width = "3%"
    themeSelection.style.height = "26px";
    newSceneTime.style.width = "5%"
    newSceneTime.style.height = "26px";
    if(useTts) newSceneTime.style.display = "none";
    else newSceneTime.style.display = "block";
    if(useInsertedImages) imageDiv.style.display = "block";
    else imageDiv.style.display = "none";
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
    textboxDiv.appendChild(newShuffleButton);
    textboxDiv.appendChild(newTextbox);
    textboxDiv.appendChild(themeSelection);
    textboxDiv.appendChild(newSceneTime);
    textboxDiv.appendChild(imageDiv);
    container.appendChild(textboxDiv);
}

function createOption(themeSelection, optionValue) {
    var option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    themeSelection.appendChild(option);
}

function clearAllTextboxes() {
    var scenesTextboxes = document.querySelectorAll("#scenes-container textarea");
    scenesTextboxes.forEach(element => {
        element.value = ""
    });
    getTtsLength()
}

function setTo1Scene() {
    document.querySelectorAll(".textbox-container-with-").forEach(i => i.remove() )
    addTextbox('scenes-container')
    getTtsLength()
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

function getTtsLength() {
    // var imagesTextboxes = document.querySelectorAll("#images-container input[type='text']");
    
    var scenesTextboxes = document.querySelectorAll("textarea.sceneTextboxes")
    var textToSay = ''
    scenesTextboxes.forEach(textbox => {
        textToSay += textbox.value + " "
    })
    if(textToSay.trim().length > 0) {
        audioDuration = downloadTTSVoice({promptDataString:textToSay})
        Promise.resolve(audioDuration).then( duration => {
            document.getElementById("sceneLengthEstimate").textContent = `tts and video will be ${parseFloat(duration).toFixed(1)} seconds, you need your selected music to match up`
        })
    } else {
        document.getElementById("sceneLengthEstimate").textContent = `tts and video will be 0 seconds, you need your selected music to match up`
    }
}

function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission
    var discordName = document.querySelector("#additional-text").value
    var discordUsername = document.querySelector("#additional-text-username").value
    var themes = []
    document.querySelectorAll(".themeSelection").forEach(i => {
        themes.push(i.value);
    })
    var ttsTimings = []
    document.querySelectorAll(".sceneTime").forEach(i => {
        if(i.value === "") ttsTimings.push(-1);
        else ttsTimings.push(parseFloat(i.value))
    })
    var scenesTextboxes = document.querySelectorAll("textarea.sceneTextboxes")
    var images = []
    document.querySelectorAll(".textbox-container-with-").forEach(i => {
        const imageTextAreas = i.querySelectorAll(".image-textarea");
        const imageTextAreasArray = Array.from(imageTextAreas).map(j => j.value);
        images.push(imageTextAreasArray);
      });
    var positivePrompt = []
    var imagesData = []
    var promises = []
    var index = 1
    
    switch (event.submitter.value)
    {
        case 'Enable peak detection for strength':
            togglePeakDetectionFun()
            break;
        case 'Submit':
            var success = formValidation();
            if(success) {
                navagate(LOADING_PAGE)
                processAudio().then( () => {
                    setTimeout(() => {
                        var strength;
                        var soundOutput;
                        strength = '0:('+document.querySelector("#strength").value+')'
                        soundOutput = document.getElementById('output').textContent;
                        navagate(VIDEO_PAGE)
                    
                        if(peakDisplayed) strength = soundOutput
                        console.log(strength);
                        Promise.resolve(audioDuration).then( duration => {
                            imagesForms = []
                            scenesTextboxes.forEach(textbox => {
                                var promptData = textbox.value.replaceAll('"', '').replaceAll("'", '').replaceAll('\n', '')
                                var formData = {
                                    prompt: promptData
                                };
                                index++
                                positivePrompt.push(`"${index}": "${promptData}"`)
                                imagesForms.push(formData)
                            });
                            // check if there was an uploaded audio file
                            audioFileName = ''
                            if(document.querySelector("#audioFile").files.length > 0) {
                                uploadAudio(document.querySelector("#audioFile").files[0])
                                audioFileName = document.querySelector("#audioFile").files[0].name
                            }

                            // if images are filled
                            // add them to job
                            let job ={ 
                                imagePrompts: imagesForms,
                                discordName: discordName,
                                strength: strength,
                                audioName: audioFileName,
                                discordUsername: discordUsername,
                                themes: themes,
                                ttsTimings: ttsTimings,
                                useTts: useTts
                            }
                            if(document.querySelector(".image-textarea")) {
                                    job['images']=images
                                    getVideo(job, useDummy)
                                        .then(response => {
                                            console.log(response);
                                        })
                                        .catch(error => console.error(error));
                            } else {
                                    getImagesVideo(job, useDummy)
                                        .then(response => {
                                            console.log(response);
                                            imagesData.push(response)
                                        })
                                        .catch(error => console.error(error))
                            }
                            

                            var time = index * 6 + duration * 17
                            // startVideoMessage(time)
                            document.querySelector("#resultTime").textContent = `Generation should be done by ${Math.floor(time/60)} minutes and ${Math.floor(time - Math.floor(time/60)*60)} seconds.`
                            time = duration
                            document.querySelector("#sceneLengthEstimate").textContent = `Final results should be about ${Math.floor(time/60)} minutes and ${Math.floor(time - Math.floor(time/60)*60)} seconds.`
                        });
                    }, 1500);
                }).catch(error => {
                    console.error('Error in processAudio:', error);
                    // Handle the error, perhaps show a user-friendly message.
                });
            }
            break;
    }
}
// if there are any images set, and a different scene doesnt have images this should fail for now
// we dont catch this case yet.
function formValidation() {
    var success = true;
    // document.querySelectorAll(".textbox-container-with-")
    document.querySelectorAll("textarea").forEach(x => {
        if (parseFloat(x.value.length) > 0 || x.style.display ==="none") {
            x.style.backgroundColor = '';
        }
        else {
            x.style.backgroundColor = 'red';
            // if one of useTts useInsertedImages use case to ignore adding check
            success = false;
        }
    });
    return success;
}

function downloadTTSVoice(formData) {
    return fetch("https://deepnarrationapi.matissetec.dev/downloadTTSVoice", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.text())
}

function getImagesVideo(formData, useDummy) {
    if(useDummy) {
        return new Promise((resolve, reject) => {
            resolve(["output8751600096.png", "output3494119787.png", "output5502246769.png"]);
        });
    } else {
        return fetch("https://deepnarrationapi.matissetec.dev/getImagesVideo", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.text())
    }
}

function getVideo(formData, useDummy) {
    if(useDummy) {
        return new Promise((resolve, reject) => {
            resolve("watch the video here 123.xyz");
        });
    } else {
        return fetch("https://deepnarrationapi.matissetec.dev/getVideo", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.text())
    }
}

function uploadAudio(file) {
    let formData = new FormData();
    formData.append("audioFile", file);
    return fetch("https://deepnarrationapi.matissetec.dev/uploadAudio", {
        method: "POST",
        body: formData
    });
}

function processAudio() {
    return new Promise((resolve, reject) => { 
        if(!peakDisplayed)
            resolve()
        let file = document.getElementById('audioFile').files[0];
        let minDesired = parseFloat(document.getElementById('minDesired').value);
        let maxDesired = parseFloat(document.getElementById('maxDesired').value);
        var textToSay = ''
        var scenesTextboxes = document.querySelectorAll("textarea.sceneTextboxes")
        scenesTextboxes.forEach(textbox => {
            textToSay += textbox.value + " "
        })
        textToSay = textToSay.replaceAll('  ', ' ')

        if (!file) {
            document.getElementById('output').textContent = 'No file uploaded.';
            reject('No file uploaded.'); // Reject the promise here
            return;
        }

        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let source = audioContext.createBufferSource();

        let reader = new FileReader();
        reader.onload = function(ev) {
            audioContext.decodeAudioData(ev.target.result)
            .then(audioBuffer => {
                source.buffer = audioBuffer;
                console.log('source length: ' + source.buffer.duration)
                console.log(textToSay);
                console.log(Math.ceil((textToSay.split(" ").length-1)/200*60*11.5));
                let peaks = detectPeaks(audioBuffer, Math.ceil((textToSay.split(" ").length-1)/200*60*11.5), minDesired, maxDesired);
                console.log((Math.max(peaks) -Math.min(peaks))/2);
                let output = processPeaks(peaks);
                document.getElementById('output').textContent = output;
                resolve(); // Resolve the promise here
            })
            .catch(error => {
                reject(error); // In case of an error in decoding, reject the promise
            });
        };
        reader.onerror = reject;  // In case of an error reading the file, reject the promise
        reader.readAsArrayBuffer(file);
    });
}


function detectPeaks(audioBuffer, numberOfFrames, minDesired, maxDesired) {
    let channelData = audioBuffer.getChannelData(0); // Assuming mono audio (1 channel)
    let maxPeakValue = 0; // maxActual
    let minPeakValue = Infinity; // minActual
    let peaksArray = [];

    // Find the maximum and minimum peak in the audio data
    for(let i = 0; i < channelData.length; i++) {
        if(Math.abs(channelData[i]) > maxPeakValue) {
            maxPeakValue = Math.abs(channelData[i]);
        }
        if(Math.abs(channelData[i]) < minPeakValue) {
            minPeakValue = Math.abs(channelData[i]);
        }
    }

    let interval = Math.floor(channelData.length / numberOfFrames);

    // Compute peaks data
    for(let i = 0; i < channelData.length; i += interval) {
        let maxPeakInInterval = 0;
        for(let j = i; j < i + interval; j++) {
            if(Math.abs(channelData[j]) > maxPeakInInterval) {
                maxPeakInInterval = Math.abs(channelData[j]);
            }
        }

        // Rescale the normalized peak values to the desired range
        let rescaledPeak = minDesired + (maxPeakInInterval - minPeakValue) * (maxDesired - minDesired) / (maxPeakValue - minPeakValue);
        peaksArray.push(rescaledPeak);
    }

    return peaksArray;
}

function processPeaks(peaks) {
    let output = peaks.map((peak, i) => `${i}:(${(peak).toFixed(4)})`).join(',');
    return output;
}

function togglePeakDetectionFun() {
    peakDisplayed = !peakDisplayed;
    var text = document.getElementById("peakDetection");
    var strength = document.getElementById("strengthDiv");
    var strengthLabel = document.getElementById("peakButton");
    if (peakDisplayed){
        text.style.display = "block";
        strength.style.display = "none";
        strengthLabel.textContent = "Use single strength value";
    } else {
        text.style.display = "none";
        strength.style.display = "block";
        strengthLabel.textContent = "Enable music peak detection for strength";
    }
}

function collapsibleStuff() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
        content.style.display = "none";
        this.textContent = "Open " + this.nextElementSibling.querySelector("h1").textContent;
        } else {
        content.style.display = "block";
        this.textContent = "Close " + this.nextElementSibling.querySelector("h1").textContent;
        }
    });
    coll[i].click()
    coll[i].click()
    }
}

function toggleTts(event) {
    var newSceneTime = document.querySelectorAll(".sceneTime")
    if(event.currentTarget.textContent == "disable tts")
    {
        useTts = false;
        event.currentTarget.textContent = "enable tts";
        newSceneTime.forEach(i => i.style.display = "block");
        // change color too?
    } else {
        useTts = true;
        event.currentTarget.textContent = "disable tts";
        newSceneTime.forEach(i => i.style.display = "none");
        // change color too?
    }
}

function toggleImages(event) {
    var newSceneTime = document.querySelectorAll(".image-container-plus")
    if(event.currentTarget.textContent == "insert images")
    {
        useInsertedImages = true;
        event.currentTarget.textContent = "generate all images";
        newSceneTime.forEach(i => i.style.display = "block");
        // change color too?
    } else {
        useInsertedImages = false;
        event.currentTarget.textContent = "insert images";
        newSceneTime.forEach(i => i.style.display = "none");
        // change color too?
    }
}