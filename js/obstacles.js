function initTrees() {
  trees = [];
  var sceneryItems = [];

  // Mix of cartoon trees and buildings
  for (var i = 0; i < 50; i++) {
    var isLeftSide = Math.random() < 0.5;
    var itemType = Math.random();

    if (itemType < 0.8) {
      // Cartoon tree (70% probability)
      sceneryItems.push({
        type: 'tree',
        x: isLeftSide ? Math.random() * 180 : 820 + Math.random() * 180,
        y: Math.random() * 4000,
        size: 25 + Math.random() * 20,
        treeStyle: Math.floor(Math.random() * 3), // 0=round, 1=pine, 2=lollipop
        color: ['#2ecc71', '#27ae60', '#16a085'][Math.floor(Math.random() * 3)]
      });
    } else {
      // Building (30% probability)
      sceneryItems.push({
        type: 'building',
        x: isLeftSide ? Math.random() * 180 : 820 + Math.random() * 180,
        y: Math.random() * 4000,
        width: 40 + Math.random() * 40,
        height: 80 + Math.random() * 100,
        buildingType: Math.floor(Math.random() * 3),
        color: ['#e74c3c', '#3498db', '#9b59b6', '#f39c12', '#1abc9c'][Math.floor(Math.random() * 5)],
        windows: Math.floor(Math.random() * 3) + 2
      });
    }
  }

  trees = sceneryItems;
}



function isSpawnPositionSafe(x, y, width, height) {
  var minHorizontalDist = 80;  // Minimum pixels between vehicles horizontally
  var minVerticalDist = 180;   // Minimum pixels between vehicles vertically

  for (var i = 0; i < obstacles.length; i++) {
    var obs = obstacles[i];

    var horizontalDist = Math.abs(obs.x - x);
    var verticalDist = Math.abs(obs.y - y);

    // Check if too close horizontally AND vertically
    if (horizontalDist < (width + obs.width) / 2 + minHorizontalDist &&
      verticalDist < (height + obs.height) / 2 + minVerticalDist) {
      return false;  // Position is blocked
    }
  }

  return true;  // Position is safe
}

function spawnObstacle() {
  var lanes = [280, 360, 440, 560, 640, 720];
  var typeKeys = Object.keys(obstacleTypes);
  var typeKey = typeKeys[Math.floor(Math.random() * typeKeys.length)];
  var type = obstacleTypes[typeKey];

  // Try to find a safe spawn position
  var maxAttempts = 5;
  var spawnSuccess = false;

  for (var attempt = 0; attempt < maxAttempts; attempt++) {
    var lane = lanes[Math.floor(Math.random() * lanes.length)];
    var spawnY = -100;

    // Check if this position is safe
    if (isSpawnPositionSafe(lane, spawnY, type.width, type.height)) {
      obstacles.push({
        x: lane,
        y: spawnY,
        width: type.width,
        height: type.height,
        type: typeKey,
        speed: type.speed,
        color: type.color
      });
      spawnSuccess = true;
      break;  // Successfully spawned
    }
    // If blocked, loop will try a different random lane
  }

  // If all attempts failed, skip this spawn cycle
  return spawnSuccess;
}

