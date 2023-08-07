let maxWords = 75;
let VIDEO_PAGE = 'videoPage'
let INPUT_PAGE = 'inputPage'
let LOADING_PAGE = 'loadingPage'
var peakDisplayed = false;

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
        case 'Enable peak detection for strength':
            Promise.resolve(audioDuration).then( duration => {
                document.getElementById("sceneLengthEstimate").textContent = `amount of time audio will take in seconds: ${duration}`
                togglePeakDetectionFun()
            })

            break;
        case 'Submit':
            processAudio()
            var strength;
            var soundOutput;
            navagate(LOADING_PAGE)
            setTimeout(() => {
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
                            prompt: promptData + ' beautiful, masterpiece, amazing'
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

                    let job ={  imagePrompts: imagesForms,
                                discordName: discordName,
                                strength: strength,
                                audioName: audioFileName}
                    promises.push(getImages(job, useDummy)
                                    .then(response => {
                                        console.log(response);
                                        imagesData.push(response)
                                    })
                                    .catch(error => console.error(error)));

                    var time = index * 6 + duration
                    startVideoMessage(time)
                    document.querySelector("#resultTime").textContent = `Generation should be done by ${Math.floor(time/60)} minutes and ${Math.floor(time - Math.floor(time/60)*60)} seconds.`
                    time = duration
                    document.querySelector("#sceneLengthEstimate").textContent = `Final results should be about ${Math.floor(time/60)} minutes and ${Math.floor(time - Math.floor(time/60)*60)} seconds.`
                });
            }, 1500);
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
            .then(response => response.text())
    }
}

function uploadAudio(file) {
    let formData = new FormData();
    formData.append("audioFile", file);

    return fetch("https://imagegenerator.matissetec.dev/uploadAudio", {
        method: "POST",
        body: formData
    });
}

function processAudio() {
    let file = document.getElementById('audioFile').files[0];
    let minDesired = parseFloat(document.getElementById('minDesired').value);
    let maxDesired = parseFloat(document.getElementById('maxDesired').value);
    
    var textToSay = ''
    var scenesTextboxes = document.querySelectorAll("#scenes-container textarea");
    scenesTextboxes.forEach(textbox => {
        var promptData = textbox.value.replaceAll('"', '').replaceAll("'", '').replaceAll('\n', '')
        textToSay += textbox.value + " "
    })
    textToSay = textToSay.replaceAll('  ', ' ')
    
    if (!file) {
        document.getElementById('output').textContent = 'No file uploaded.';
        return;
    }

    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let source = audioContext.createBufferSource();
    
    let reader = new FileReader();
    reader.onload = function(ev) {
        audioContext.decodeAudioData(ev.target.result)
        .then(audioBuffer => {
            source.buffer = audioBuffer;
            console.log(textToSay);
            console.log(Math.ceil((textToSay.split(" ").length-1)/200*60*11.5));
            let peaks = detectPeaks(audioBuffer, Math.ceil((textToSay.split(" ").length-1)/200*60*11.5), minDesired, maxDesired);
            let output = processPeaks(peaks);
            document.getElementById('output').textContent = output;
        });
    };
    reader.readAsArrayBuffer(file);
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

function processPeaks(peaks) {//, amplitude, offset
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