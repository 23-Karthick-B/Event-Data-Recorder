function update() {
  if (gameState !== 'playing') return;

  // Realistic steering with smooth interpolation
  if (keys['a'] || keys['ArrowLeft']) {
    car.targetSteerAngle = Math.max(car.targetSteerAngle - 240, -car.maxSteerAngle);
  } else if (keys['d'] || keys['ArrowRight']) {
    car.targetSteerAngle = Math.min(car.targetSteerAngle + 240, car.maxSteerAngle);
  } else {
    // Return to center smoothly
    car.targetSteerAngle *= 0.7;
    if (Math.abs(car.targetSteerAngle) < 1) car.targetSteerAngle = 0;
  }

  // Smooth steering angle transition
  car.steerAngle += (car.targetSteerAngle - car.steerAngle) * 0.25;

  if (keys['w'] || keys['ArrowUp']) {
    car.speed = Math.min(car.speed + car.acceleration, car.maxSpeed);
  }
  if (keys['s'] || keys['ArrowDown']) {
    car.speed = Math.max(car.speed - car.braking, -car.maxSpeed * 0.2);
  }

  if (!keys['w'] && !keys['ArrowUp'] && !keys['s'] && !keys['ArrowDown']) {
    car.speed *= (1 - car.friction);
    if (Math.abs(car.speed) < 0.05) car.speed = 0;
  }
  if (gameState !== 'playing') return;

  // ... existing steering code ...

  if (keys['w'] || keys['ArrowUp']) {
    car.speed = Math.min(car.speed + car.acceleration, car.maxSpeed);
  }
  if (keys['s'] || keys['ArrowDown']) {
    car.speed = Math.max(car.speed - car.braking, -car.maxSpeed * 0.2);
    car.brake = true;  // Set brake when actively pressing
  } else {
    car.brake = false;  // Clear brake when not pressing
  }


  // Realistic turn radius based physics
  var speedFactor = Math.abs(car.speed) / car.maxSpeed;
  car.angle += (car.steerAngle * 0.5 / car.maxSteerAngle) * car.turnSpeed * speedFactor;

  roadOffset = (roadOffset + car.speed * 2) % 4000;


  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].y += (car.speed - obstacles[i].speed) * 2;
  }

  obstacles = obstacles.filter(function (obs) {
    return obs.y < canvas.height + 150;
  });

  var dx = Math.sin(car.angle) * car.speed * 2;
  car.x += dx;
  car.x = Math.max(220, Math.min(780, car.x));

  var distStep = Math.abs(car.speed * 0.15);
  totalDistance += distStep;

  if (isCarOutsideRoad()) {
    gameState = 'crashed';
    showCrashScreen();
    return;
  }

  var carCorners = getCarCorners();
  for (var i = 0; i < obstacles.length; i++) {
    var obs = obstacles[i];
    var obsCorners = getObstacleCorners(obs);

    if (checkPolygonCollision(carCorners, obsCorners)) {
      gameState = 'crashed';
      showCrashScreen();
      return;
    }
  }

  score += Math.abs(car.speed) * 0.25;

  document.getElementById('speedDisplay').textContent = Math.floor((Math.abs(car.speed) / car.maxSpeed) * 120);
  document.getElementById('scoreDisplay').textContent = Math.floor(score);
  document.getElementById('distanceDisplay').textContent = Math.floor(totalDistance);
  document.getElementById('steerDisplay').textContent = Math.floor(car.steerAngle);

  updateSpeedometer();
}