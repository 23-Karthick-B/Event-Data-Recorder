function logBlackboxData() {
  if (gameState !== 'playing') return;

  var now = new Date();
  var tickMs = Date.now() - startTime;

  var START_LAT = 12.9716;
  var START_LON = 77.5946;
  var R = 6371000;
  var heading = (car.angle * 180 / Math.PI + 90) % 360;
  var dlat = (totalDistance / R) * Math.cos(car.angle) * (180 / Math.PI);
  var dlon = (totalDistance / (R * Math.cos(START_LAT * Math.PI / 180))) *
    Math.sin(car.angle) * (180 / Math.PI);
  var gpsLat = START_LAT + 4 * dlat;
  var gpsLon = START_LON + 4 * dlon;

  var STEER_TURN_THRESHOLD = 10.0;
  var accelTurn = 0.0;
  if (Math.abs(car.steerAngle) >= STEER_TURN_THRESHOLD) {
    var v = (Math.abs(car.speed) / car.maxSpeed) * 90 / 3.6;
    var k = 600.0;
    var r = k / Math.abs(car.steerAngle);
    accelTurn = (v * v) / Math.max(r, 1.0);
    if (car.steerAngle < 0) accelTurn = -accelTurn;
  }

  var speedKph = (Math.abs(car.speed) / car.maxSpeed) * 120;
  var leftInd = car.leftIndicator ? 1 : 0;
  var rightInd = car.rightIndicator ? 1 : 0;
  var brake = car.brake ? 1 : 0;
  console.log('CSV logging - brake:', brake, 'car.brake:', car.brake);

  var gpsSogKph = speedKph + (Math.random() - 0.5) * 2;

  var IST_OFFSET = 5.5 * 60 * 60 * 1000;
  var istDate = new Date(now.getTime() + IST_OFFSET);

  var logEntry = {
    time_ist: istDate.toISOString(),
    tick_ms: tickMs,
    speed_kph: speedKph.toFixed(3),
    distance_m: totalDistance.toFixed(3),
    steer_deg: car.steerAngle.toFixed(2),
    left_ind: leftInd,
    right_ind: rightInd,
    brake: brake,
    gps_lat: gpsLat.toFixed(6),
    gps_lon: gpsLon.toFixed(6),
    gps_sog_kph: gpsSogKph.toFixed(3),
    gps_fix: 1,
    accel_during_turn_mps2: accelTurn.toFixed(4),
    rmc_line: '$GPRMC,' + gpsLat.toFixed(4) + ',N,' + gpsLon.toFixed(4) + ',E,'
  };

  blackboxData.push(logEntry);
  document.getElementById('logsDisplay').textContent = blackboxData.length;

  blackboxData.push(logEntry);
  document.getElementById('logsDisplay').textContent = blackboxData.length;

  // Convert logEntry to CSV line
  const csvLine = [
    logEntry.time_ist,
    logEntry.tick_ms,
    logEntry.speed_kph,
    logEntry.distance_m,
    logEntry.steer_deg,
    logEntry.left_ind,
    logEntry.right_ind,
    logEntry.brake,
    logEntry.gps_lat,
    logEntry.gps_lon,
    logEntry.gps_sog_kph,
    logEntry.gps_fix,
    logEntry.accel_during_turn_mps2,
    logEntry.rmc_line
  ].join(",");

  // Send to server → Node stores CSV + uploads to Adafruit IO
  fetch("/store-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ log: csvLine })
  });

}

