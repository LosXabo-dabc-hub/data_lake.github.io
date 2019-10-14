<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='utf-8'>

  <title>dc.js Experiment</title>

  <script src='js/d3.js' type='text/javascript'></script>
  <script src='js/crossfilter.js' type='text/javascript'></script>
  <script src='js/dc.js' type='text/javascript'></script>
  <script src='js/jquery-1.9.1.min.js' type='text/javascript'></script>
  <script src='js/bootstrap.min.js' type='text/javascript'></script>

  <link href='css/bootstrap.min.css' rel='stylesheet' type='text/css'>
  <link href='css/dc.css' rel='stylesheet' type='text/css'>

  <style type="text/css"></style>
</head>

<body>

<div class='container' style='font: 12px sans-serif;'>
  <div class='row'>
    <div class='span12'>
      <table class='table table-hover' id='dc-table-graph'>
        <thead>
          <tr class='header'>
            <th>DTG</th>
            <th>Lat</th>
            <th>Long</th>
            <th>Depth</th>
            <th>Magnitude</th>
            <th>Google Map</th>
            <th>OSM Map</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</div>
  
<script>
  
// load data from a csv file
d3.csv("data/quakes.csv", function (data) {

  // format our data
  var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");
  
  data.forEach(function(d) { 
    d.dtg   = dtgFormat.parse(d.origintime.substr(0,19)); 
    d.lat   = +d.latitude;
    d.long  = +d.longitude;
    d.mag   = d3.round(+d.magnitude,1);
    d.depth = d3.round(+d.depth,0);
  });

  // Create the dc.js chart objects & link to div
  var dataTable = dc.dataTable("#dc-table-graph");

  // Run the data through crossfilter and load our 'facts'
  var facts = crossfilter(data);

  // Create dataTable dimension
  var timeDimension = facts.dimension(function (d) {
    return d.dtg;
  });

  // Setup the charts
  
  // Table of earthquake data
  dataTable.width(960).height(800)
    .dimension(timeDimension)
    .group(function(d) { return "Earthquake Table"
     })
    .size(10)
    .columns([
      function(d) { return d.dtg; },
      function(d) { return d.lat; },
      function(d) { return d.long; },
      function(d) { return d.depth; },
      function(d) { return d.mag; },
      function(d) { return '<a href=\"http://maps.google.com/maps?z=12&t=m&q=loc:' + d.lat + '+' + d.long +"\" target=\"_blank\">Google Map</a>"},
      function(d) { return '<a href=\"http://www.openstreetmap.org/?mlat=' + d.lat + '&mlon=' + d.long +'&zoom=12'+ "\" target=\"_blank\"> OSM Map</a>"}
    ])
    .sortBy(function(d){ return d.dtg; })
    .order(d3.ascending);

  // Render the Charts
  dc.renderAll();
  
});