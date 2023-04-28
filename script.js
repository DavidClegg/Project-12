// Waveform visualiser
const audioElement = document.querySelector("audio"); // Grab the base audio element
const height = 500; // height of the svg
const width = 500; // width of the svg

let duration = 0; // global duration; simply using audioElement.duration kept giving me Infinity; which is ridiculous, I don't have that much time!

let busy = false; // There's a problem where calling playCD(n) before the svg is finished processing will create multiple svgs. A simple flag should fix it.

function load(url){
    // Main loop.
    audioElement.src = url // set the audio element
    const audioContext = new AudioContext(); // create a new Audio Context. This opens up a lot of methods to handle audio data.
    
    const fetchData = url => {
        fetch(url) // Grab the sound file
            .then(response => response.arrayBuffer()) // Get an array buffer from the data stream
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // Decodes the audio data
            .then(audioBuffer => {duration = audioBuffer.duration; return audioBuffer.getChannelData(0)})
            // Grab to duration field from the audio data to use later. Get the audio from the first channel
            .then(channelData => handleData(channelData)) // Pass the channel data to function that creates the waveform
            .then(() => busy = false);
    }
    fetchData(url);

    function handleData(Input){
        let data = Input.filter((c,i,a) => i % 1000 == 0)
        // Decrease the data array by 1000. This is important when channel data arrays are millions of values long.

        const radius = 250; 
        const svg = d3.select("#record") // Create the SVG 
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const xScale = d3.scaleLinear() // Use scaleLinear to map the indicies of the data array to angles on a circle
            .domain([0, data.length - 1])
            .range([0, Math.PI * 2])
        
        const yScale = d3.scaleLinear() // Map the data to a larger value to better display each value.
        // This is necessary because audio data is in the range of [-1, 1], and is often 6 to 10 orders of magnitude. 
            .domain([-1, 4]) // This is 4 instead of 1 to smooth out the circular waveform.
            .range([radius - 10, 10])

        const line = d3.lineRadial() // Convert the linear data to radial data
            .angle((d,i) => xScale(i))
            .radius(d => yScale(d))
            .curve(d3.curveBasis)

        svg.append("path") // create the path itself
        .datum(data)
        .attr("fill", "var(--vinyl)")
        .attr("stroke", "var(--groove)")
        .attr("stroke-width", 1)
        .attr("transform", `translate(${width/2}, ${height/2})`)
        .attr("d", line)
    }
};

audioElement.addEventListener("timeupdate", e=>{
    // Every time step update the rotation of the image and SVG to create the playing record effect
    let angle = (audioElement.currentTime/duration) * 360 -3;
    document.documentElement.style.setProperty("--rotation", `-${angle+3}deg`);
})

audioElement.addEventListener("completed", ()=> document.documentElement.style.setProperty("--rotation", `-360deg`)) // when the song ends the rotation should stay at 0 degrees

// Controls
let playing = false;
const control = {
    play: document.querySelector("#play"),
    pause: document.querySelector("#pause"),
    stop: document.querySelector("#stop"),
}

control.play.addEventListener("click", e=>{
    if(playing){
        audioElement.pause();
        playing = false;
        control.play.classList.remove("sink");
        control.pause.classList.add("sink");
    } else {
        audioElement.play();
        playing = true;
        control.play.classList.add("sink");
        
        control.pause.classList.remove("sink");
        control.stop.classList.remove("sink");
    }
})

control.pause.addEventListener("click", e =>{
    if(playing){
        audioElement.pause();
        playing = false;
        control.play.classList.remove("sink");
        control.pause.classList.add("sink");
    }
})
control.stop.addEventListener("click", e =>{
    // You can only stop if the song is currently playing
    if(playing){
        audioElement.pause();
        audioElement.currentTime = 0 ;
        playing = false;
        control.play.classList.remove("sink");
        control.pause.classList.remove("sink");
        control.stop.classList.add("sink");
        audioElement.addEventListener("ended", ()=> document.documentElement.style.setProperty("--rotation", `0deg`))
    }
})

// Album Buttons
const cds = document.querySelectorAll(".cd");

let songs = [
    "./music/futuristic-beat-146661.mp3",
    "./music/my-universe-147152.mp3",
    "./music/reflected-light-147979.mp3",
    "./music/the-future-bass-15017.mp3",
];

let images = [
    "./art/futuristic-beat-146661.webp",
    "./art/my-universe-147152.webp",
    "./art/reflected-light-147979.webp",
    "./art/the-future-bass-15017.webp",
]

function playCD(n){
    if(busy == false){
        busy = true;
        control.play.classList.remove("sink");
        control.pause.classList.remove("sink");
        control.stop.classList.remove("sink");
        playing = false;
        cds.forEach(cd => cd.classList.remove("sink"));
        cds.forEach(cd => cd.classList.remove("selected"));
        cds[n].classList.add("sink");
        cds[n].classList.add("selected");
        load(songs[n]);
        document.querySelector("svg").remove();
        document.querySelector("#mainAlbum").src = images[n];
    }
}

window.addEventListener("load",e=>playCD(0)); 
// Initially load the first song.