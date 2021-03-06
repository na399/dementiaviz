var canvas = document.getElementById('mask');
var ctx = canvas.getContext('2d');

var projection = d3.geo.mercator()
  .scale(110000)
  // Customize the projection to make the center of Thailand become the center of the map
  .rotate([-100.5718, -13.73])
  .translate([500, 500]);

var path = d3.geo.path()
  .context(ctx)
  .projection(projection);

function decimalToHexString(number) {
  if (number < 0) {
    number = 0xFFFFFF + number + 1;
  }
  return '#' + _.padStart(number.toString(16).toUpperCase(), 6, '0');
}

var indexedDistricts;

function getDistrictByIndex(index) {
  if(index >= 0 && index < 50) return indexedDistricts[index];
  return 'Unknown';
}

function getDistrictByLatLon(lat, lon) {
  var xy = projection([lon, lat]);
  var colors = ctx.getImageData(xy[0], xy[1], 1, 1).data;
  var index = colors[0] * 255 * 255 + colors[1] * 255 + colors[2] - 1;
  return getDistrictByIndex(index);
}

d3.json('bkkviz.json', function(error, topo) {
  districts = topojson.feature(topo, topo.objects.district).features;
  indexedDistricts = districts.map(function(d){
    return d.properties.dname.replace('เขต','');
  });
  districts.forEach(function(d, i){
    var color = decimalToHexString(i + 1);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    path(d);
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
  });

  // console.log('indexedDistricts', JSON.stringify(indexedDistricts));
});
