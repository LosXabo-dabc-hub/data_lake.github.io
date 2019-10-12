  
/**********************************
* Step0: Load data from json file *
**********************************/

// load data from a csv file
d3.csv("quakes.csv", function (data) {

  // format our data
  var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");
  
  data.forEach(function(d) { 
    d.dtg   = dtgFormat.parse(d.origintime.substr(0,19)); 
    d.lat   = +d.latitude;
    d.long  = +d.longitude;
    d.mag   = d3.round(+d.magnitude,1);
    d.depth = d3.round(+d.depth,0);
  });

/******************************************************
* Step1: Create the dc.js chart objects & ling to div *
******************************************************/

  var magnitudeChart = dc.barChart("#dc-magnitude-chart");
  var depthChart = dc.barChart("#dc-depth-chart");
  var timeChart = dc.lineChart("#dc-time-chart");
  var dataTable = dc.dataTable("#dc-table-graph");

/****************************************
* 	Run the data through crossfilter    *
****************************************/

  var facts = crossfilter(data);  // Gets our 'facts' into crossfilter

/******************************************************
* Create the Dimensions                               *
* A dimension is something to group or filter by.     *
* Crossfilter can filter by exact value, or by range. *
******************************************************/

  // for Magnitude
  var magValue = facts.dimension(function (d) {
    return d.mag;       // group or filter by magnitude
  });
  var magValueGroupSum = magValue.group()
    .reduceSum(function(d) { return d.mag; });	// sums the magnitudes per magnitude
  var magValueGroupCount = magValue.group()
    .reduceCount(function(d) { return d.mag; }) // counts the number of the facts by magnitude

  // For datatable
  var timeDimension = facts.dimension(function (d) {
    return d.dtg;
  }); // group or filter by time

  // for Depth
  var depthValue = facts.dimension(function (d) {
    return d.depth;
  });
  var depthValueGroup = depthValue.group();
  
  // define a daily volume Dimension
  var volumeByDay = facts.dimension(function(d) {
    return d3.time.hour(d.dtg);
  });
  // map/reduce to group sum
  var volumeByDayGroup = volumeByDay.group()
    .reduceCount(function(d) { return d.dtg; });

/***************************************
* 	Step4: Create the Visualisations   *
***************************************/
  
  // Magnitide Bar Graph Summed
  magnitudeChart.width(480)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(magValue)								// the values across the x axis
    .group(magValueGroupSum)							// the values on the y axis
	.transitionDuration(500)
    .centerBar(true)	
	.gap(56)                                            // bar width Keep increasing to get right then back off.
    .x(d3.scale.linear().domain([0.5, 7.5]))
	.elasticY(true)
	.xAxis().tickFormat(function(v) {return v;});	

  // Depth bar graph
  depthChart.width(480)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(depthValue)
    .group(depthValueGroup)
	.transitionDuration(500)
    .centerBar(true)	
	.gap(1)                    // bar width Keep increasing to get right then back off.
    .x(d3.scale.linear().domain([0, 100]))
	.elasticY(true)
	.xAxis().tickFormat(function(v) {return v;});

  // time graph
  timeChart.width(960)
    .height(100)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(volumeByDay)
    .group(volumeByDayGroup)
    .transitionDuration(500)
	.elasticY(true)
    .x(d3.time.scale().domain([new Date(2013, 6, 18), new Date(2013, 6, 24)])) // scale and domain of the graph
    .xAxis();

  // Table of earthquake data
  dataTable.width(960).height(800)
    .dimension(timeDimension)
	.group(function(d) { return "List of all earthquakes corresponding to the filters"
	 })
	.size(10)							// number of rows to return
    .columns([
      function(d) { return d.dtg; },
      function(d) { return d.lat; },
      function(d) { return d.long; },
      function(d) { return d.depth; },
      function(d) { return d.mag; },
	  function(d) { return '<a href=\"http://maps.google.com/maps?z=11&t=m&q=loc:' + d.lat + '+' + d.long +"\" target=\"_blank\">Google Map</a>"},
	  function(d) { return '<a href=\"http://www.openstreetmap.org/?mlat=' + d.lat + '&mlon=' + d.long +'&zoom=11'+ "\" target=\"_blank\"> OSM Map</a>"}
    ])
    .sortBy(function(d){ return d.dtg; })
    .order(d3.ascending);

/****************************
* Step6: Render the Charts  *
****************************/
			
  dc.renderAll();
  
});
  
