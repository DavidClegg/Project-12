const audioElement = document.querySelector("audio");
const height = 500;
const width = 500;

(function main(){
    const audioContext = new AudioContext();
    let currentBuffer = null;
    
    const fetchData = url => {
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => audioBuffer.getChannelData(0))
            .then(channelData => handleData(channelData))
    }
    fetchData("I Got a Stick Arr Bryan Teoh.mp3");

    function handleData(Input){
        console.log("D3")

        let data = Input.filter((c,i,a) => i % 1000 == 0)
        // console.log(data)

        const radius = 250


        const svg = d3.select("#record")
            .append("svg")
            // .style("border","2px solid red")
            .attr("width", width)
            .attr("height", height);

        const xScale = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([0, Math.PI * 2])
        
        const yScale = d3.scaleLinear()
            .domain([-1, 4])
            .range([radius - 10, 10])

        const line = d3.lineRadial()
            .angle((d,i) => xScale(i))
            .radius(d => yScale(d))
            .curve(d3.curveBasis)

        svg.append("path")
        .datum(data)
        .attr("fill", "var(--vinyl)")
        .attr("stroke", "var(--groove)")
        .attr("stroke-width", 1)
        .attr("transform", `translate(${width/2}, ${height/2})`)
        .attr("d", line)
    }
})();
audioElement.addEventListener("timeupdate", e=>{
    let angle = (audioElement.currentTime/audioElement.duration) * 360 -3;
        console.log(angle)
        // angle > 360? 
        // document.documentElement.style.setProperty("--rotation", `0deg`)//("style", `transform: rotate(-${angle + 3}deg)`);
        // :
        document.documentElement.style.setProperty("--rotation", `-${angle+3}deg`)//("style", `transform: rotate(-${angle + 3}deg)`);
})

audioElement.addEventListener("completed", ()=> document.documentElement.style.setProperty("--rotation", `-360deg`))

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