d3.csv('CPITimeSeriesCutDown.csv')
    .then(data => {
        console.log('CSV Data: ', data)
        // Code Here
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", 1000)
            .attr("height", 500)

        svg
            .selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("x", (d,i) => i * (1000/430) + 20)
            .attr("y", d => 510 - (Object.values(d)[1]*50))
            .attr("width", 1)
            .attr("height", d=> Object.values(d)[1] * 50)
            .attr("fill", "purple")
            .attr("data-value", d=>Object.values(d)[1])

        // Create the scale 
        const axesDataCreate = data.map(d => Object.values(d)[0].slice(0,4));
        console.log(axesDataCreate)
        const xScaleAxesCreate = d3.scaleLinear()
        .domain([d3.min(axesDataCreate), d3.max(axesDataCreate)])
        .range([0, 980]);


        // Create the axis
        const xAxisCreate = d3.axisTop(xScaleAxesCreate);


        // Add the axis to the chart
        svg
        .append("g")
        .attr("transform", "translate(20, 20)")
        .call(xAxisCreate)
        .attr("color", "blue")

        // Create the scale 
        const secondAxis = data.map(d => Object.values(d)[1]);
        console.log(axesDataCreate)
        const yScaleAxesCreate = d3.scaleLinear()
        .domain([d3.max(secondAxis), d3.min(secondAxis)])
        .range([0, 500]); 


        // Create the axis
        const yAxisCreate = d3.axisRight(yScaleAxesCreate);


        // Add the axis to the chart
        svg
        .append("g")
        .attr("transform", "translate(0, 10)")
        .call(yAxisCreate)
        .attr("color", "blue")
    })
    .catch(error => console.log(error))

