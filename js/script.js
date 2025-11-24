var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var minimap = document.getElementById('minimap');
var mmCtx = minimap.getContext('2d');

var gameState = 'menu';
var score = 0;
var blackboxData = [];
var startTime = 0;
var totalDistance = 0;

// Realistic car physics parameters
var car = {
  x: 500,
  y: 550,
  width: 50,
  height: 90,
  angle: 0,
  speed: 0,
  maxSpeed: 5,        // Reduced for realistic city driving
  acceleration: 0.2,   // Slower, smoother acceleration
  braking: 0.45,        // Realistic braking
  friction: 0.02,       // Natural slowdown
  turnSpeed: 0.08,     // Realistic steering response
  maxSteerAngle: 180,    // Maximum steering angle in degrees
  steerAngle: 0,
  targetSteerAngle: 0,
  leftIndicator: false,
  rightIndicator: false,
  brake: false
};

var roadOffset = 0;
var obstacles = [];
var trees = [];
var keys = {};
var obstacleInterval;
var logInterval;
var indicatorBlinkInterval;

// Obstacle types with realistic properties
var obstacleTypes = {
  sedan: { width: 48, height: 85, color: '#3498db', speed: 0.8 },
  suv: { width: 55, height: 95, color: '#e74c3c', speed: 0.6 },
  truck: { width: 60, height: 120, color: '#95a5a6', speed: 0.5 },
  hatchback: { width: 45, height: 75, color: '#9b59b6', speed: 1.0 },      // Purple
  van: { width: 58, height: 100, color: '#16a085', speed: 0.7 },           // Teal
  bus: { width: 65, height: 140, color: '#d35400', speed: 0.4 },           // Orange
  sportscar: { width: 50, height: 80, color: '#c0392b', speed: 1.2 },      // Dark red
  ambulance: { width: 56, height: 105, color: '#ffffff', speed: 0.9 },     // White
};


// Helper function for shading colors


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRoad();
  drawObstacles();
  drawCar();
  drawMinimap();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function showCrashScreen() {
  document.getElementById('crashScreen').style.display = 'flex';
  document.getElementById('finalScore').textContent = Math.floor(score);
  document.getElementById('finalDistance').textContent = Math.floor(totalDistance);
  document.getElementById('finalLogs').textContent = blackboxData.length;
  clearInterval(obstacleInterval);
  clearInterval(logInterval);
  clearInterval(indicatorBlinkInterval);
}

function startGame() {
  gameState = 'playing';
  car = {
    x: 500,
    y: 550,
    width: 50,
    height: 90,
    angle: 0,
    speed: 0,
    maxSpeed: 5,
    acceleration: 0.04,
    braking: 0.095,
    friction: 0.02,
    turnSpeed: 0.02,
    maxSteerAngle: 180,
    steerAngle: 0,
    targetSteerAngle: 0,
    leftIndicator: false,
    rightIndicator: false,
    brake: false
  };
  score = 0;
  obstacles = [];
  blackboxData = [];
  roadOffset = 0;
  totalDistance = 0;
  startTime = Date.now();

  initTrees();
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('crashScreen').style.display = 'none';

  obstacleInterval = setInterval(function () {
    if (gameState === 'playing' && Math.random() > 0.2) {
      spawnObstacle();
    }
  }, 1000);

  logInterval = setInterval(logBlackboxData, 2000);

  // Indicator blink animation
  indicatorBlinkInterval = setInterval(function () {
    if (car.leftIndicator) {
      document.getElementById('leftIndicator').classList.toggle('active');
    } else {
      document.getElementById('leftIndicator').classList.remove('active');
    }
    if (car.rightIndicator) {
      document.getElementById('rightIndicator').classList.toggle('active');
    } else {
      document.getElementById('rightIndicator').classList.remove('active');
    }
  }, 500);
}

function downloadCSV() {
  if (blackboxData.length === 0) return;

  var headers = Object.keys(blackboxData[0]);
  var csv = headers.join(',') + '\n';

  for (var i = 0; i < blackboxData.length; i++) {
    var row = blackboxData[i];
    var values = [];
    for (var j = 0; j < headers.length; j++) {
      values.push(row[headers[j]]);
    }
    csv += values.join(',') + '\n';
  }

  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'blackbox_data_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('downloadBtn').addEventListener('click', downloadCSV);

window.addEventListener('keydown', function (e) {
  keys[e.key] = true;

  // Toggle indicators with Q and E
  if (e.key === 'q' && gameState === 'playing') {
    car.leftIndicator = !car.leftIndicator;
    if (car.leftIndicator) car.rightIndicator = false;
  }
  if (e.key === 'e' && gameState === 'playing') {
    car.rightIndicator = !car.rightIndicator;
    if (car.rightIndicator) car.leftIndicator = false;
  }
  if ((e.key === 's' || e.key === 'ArrowDown') && gameState === 'playing') {
    car.brake = true;
    logBlackboxData();  // ← Logs immediately
  }
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
});

window.addEventListener('keyup', function (e) {
  keys[e.key] = false;
  if ((e.key === 's' || e.key === 'ArrowDown') && gameState === 'playing') {
    car.brake = false;
    logBlackboxData();  // ← Logs immediately
  }
});

function uploadCSVtoAdafruit() {
  fetch("/upload-csv", { method: "POST" });
}

function uploadLatestRowToAdafruit() {
  fetch("/upload-latest", { method: "POST" });
}
document.getElementById("downloadBtn").addEventListener("click", () => {

  // Save the CSV file (you already do this)
  downloadCSV();

  // Upload whole CSV to Adafruit IO
  uploadCSVtoAdafruit();

  // Upload the latest row to Adafruit IO
  uploadLatestRowToAdafruit();
});


gameLoop();