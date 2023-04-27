// Define the data to be used for the chart
const data = [
    { country: 'United States', population: 332 },
    { country: 'China', population: 1444 },
    { country: 'India', population: 1392 },
    { country: 'Indonesia', population: 276 },
    { country: 'Pakistan', population: 225 },
    { country: 'Brazil', population: 213 },
    { country: 'Nigeria', population: 211 },
    { country: 'Bangladesh', population: 166 },
    { country: 'Russia', population: 146 },
    { country: 'Mexico', population: 130 }
  ];
  
  // Define variables for the chart dimensions and scales
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  // Create a band scale for the x-axis
  const x = d3.scaleBand()
    .domain(data.map(d => d.country))
    .range([0, width])
    .padding(0.2);
  
  
  
  
  // Create a linear scale for the y-axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.population)])
    .range([height, 0]);
  
    // Create an SVG element for the chart, define its width and height, and append a group element to it
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + 20)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Create rectangles for each data point and add interactivity with mouseover and mouseout events
  svg.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.country))
    .attr('width', x.bandwidth())
    .attr('y', d => y(d.population))
    .attr('height', d => height - y(d.population))
    .attr('fill', 'steelblue')
    .on("mouseover", function (d) {
      d3.select(this).style("fill", "#5db0f5");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("fill", "steelblue");
    });
  
    // Add x-axis labels to the chart
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-65)');
  
  
  
  
  // Add y-axis labels to the chart
  svg.append('g')
    .call(d3.axisLeft(y));