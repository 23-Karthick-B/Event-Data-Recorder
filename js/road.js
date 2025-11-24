function drawCartoonTree(tree, drawY) {
  var x = tree.x;
  var size = tree.size;

  if (tree.treeStyle === 0) {
    // Round fluffy tree
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - size * 0.15, drawY, size * 0.3, size * 0.8);

    ctx.fillStyle = tree.color;
    ctx.beginPath();
    ctx.arc(x, drawY - size * 0.3, size * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x - size * 0.4, drawY - size * 0.1, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + size * 0.4, drawY - size * 0.1, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x - size * 0.15, drawY - size * 0.4, size * 0.2, 0, Math.PI * 2);
    ctx.fill();

  } else if (tree.treeStyle === 1) {
    // Pine tree
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - size * 0.1, drawY, size * 0.2, size * 0.5);

    ctx.fillStyle = tree.color;
    ctx.beginPath();
    ctx.moveTo(x, drawY - size * 0.9);
    ctx.lineTo(x - size * 0.5, drawY - size * 0.4);
    ctx.lineTo(x + size * 0.5, drawY - size * 0.4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = shadeColor(tree.color, -15);
    ctx.beginPath();
    ctx.moveTo(x, drawY - size * 0.6);
    ctx.lineTo(x - size * 0.6, drawY - size * 0.2);
    ctx.lineTo(x + size * 0.6, drawY - size * 0.2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = shadeColor(tree.color, -25);
    ctx.beginPath();
    ctx.moveTo(x, drawY - size * 0.3);
    ctx.lineTo(x - size * 0.7, drawY);
    ctx.lineTo(x + size * 0.7, drawY);
    ctx.closePath();
    ctx.fill();

  } else {
    // Lollipop tree
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - size * 0.12, drawY - size * 0.2, size * 0.24, size * 1.2);

    var gradient = ctx.createRadialGradient(
      x - size * 0.2, drawY - size * 0.5, size * 0.1,
      x, drawY - size * 0.3, size * 0.8
    );
    gradient.addColorStop(0, shadeColor(tree.color, 30));
    gradient.addColorStop(1, tree.color);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, drawY - size * 0.3, size * 0.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(x - size * 0.25, drawY - size * 0.5, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCartoonBuilding(building, drawY) {
  var x = building.x;
  var w = building.width;
  var h = building.height;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(x - w / 2 + 5, drawY + 3, w, h * 0.15);

  if (building.buildingType === 0) {
    // Apartment building
    var buildGrad = ctx.createLinearGradient(x - w / 2, drawY, x + w / 2, drawY);
    buildGrad.addColorStop(0, shadeColor(building.color, -20));
    buildGrad.addColorStop(0.5, building.color);
    buildGrad.addColorStop(1, shadeColor(building.color, -20));
    ctx.fillStyle = buildGrad;
    ctx.fillRect(x - w / 2, drawY - h, w, h);

    ctx.fillStyle = shadeColor(building.color, -40);
    ctx.fillRect(x - w / 2 - 3, drawY - h - 8, w + 6, 8);

    var rows = building.windows;
    var cols = 3;
    var winW = w / (cols + 1);
    var winH = h / (rows + 2);

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var winX = x - w / 2 + winW * (c + 0.7);
        var winY = drawY - h + winH * (r + 1);

        ctx.fillStyle = '#FFE5B4';
        ctx.fillRect(winX, winY, winW * 0.6, winH * 0.6);

        ctx.strokeStyle = shadeColor(building.color, -50);
        ctx.lineWidth = 1;
        ctx.strokeRect(winX, winY, winW * 0.6, winH * 0.6);
      }
    }

  } else if (building.buildingType === 1) {
    // Shop with awning
    ctx.fillStyle = building.color;
    ctx.fillRect(x - w / 2, drawY - h, w, h);

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x - w / 2 - 5, drawY - h * 0.3, w + 10, h * 0.15);

    ctx.fillStyle = '#fff';
    for (var i = 0; i < 4; i++) {
      ctx.fillRect(x - w / 2 + (w / 4) * i, drawY - h * 0.3, w / 8, h * 0.15);
    }

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - w * 0.2, drawY - h * 0.5, w * 0.4, h * 0.5);

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x - w * 0.15, drawY - h * 0.45, w * 0.3, h * 0.2);

    ctx.fillStyle = '#FFE5B4';
    ctx.fillRect(x - w * 0.4, drawY - h * 0.8, w * 0.25, h * 0.2);
    ctx.fillRect(x + w * 0.15, drawY - h * 0.8, w * 0.25, h * 0.2);

  } else {
    // Tower
    var towerW = w * 0.7;
    ctx.fillStyle = building.color;
    ctx.fillRect(x - towerW / 2, drawY - h, towerW, h);

    ctx.fillStyle = shadeColor(building.color, -50);
    ctx.beginPath();
    ctx.moveTo(x, drawY - h - 20);
    ctx.lineTo(x - towerW / 2 - 5, drawY - h);
    ctx.lineTo(x + towerW / 2 + 5, drawY - h);
    ctx.closePath();
    ctx.fill();

    for (var i = 0; i < 4; i++) {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x, drawY - h + h * 0.2 * (i + 1), towerW * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}


function drawRoad() {
  ctx.fillStyle = '#5F8575';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // REPLACE THE ENTIRE TREE DRAWING LOOP WITH THIS:
  for (var i = 0; i < trees.length; i++) {
    var item = trees[i];
    var drawY = (item.y + roadOffset) % 4000;

    if (drawY < -200 || drawY > canvas.height + 50) continue;

    if (item.type === 'tree') {
      drawCartoonTree(item, drawY);
    } else if (item.type === 'building') {
      drawCartoonBuilding(item, drawY);
    }
  }


  ctx.fillStyle = '#444';
  ctx.fillRect(200, 0, 600, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.fillRect(200, 0, 10, canvas.height);
  ctx.fillRect(790, 0, 10, canvas.height);

  ctx.fillStyle = '#ffeb3b';
  for (var i = roadOffset % 80; i < canvas.height; i += 80) {
    ctx.fillRect(495, i, 10, 40);
  }


  ctx.fillStyle = '#fff';
  ctx.setLineDash([15, 15]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#fff';
  for (var i = roadOffset % 60; i < canvas.height; i += 60) {
    ctx.beginPath();
    ctx.moveTo(350, i);
    ctx.lineTo(350, i + 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(650, i);
    ctx.lineTo(650, i + 30);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawRealisticVehicle(obs) {
  ctx.save();

  var hw = obs.width / 2;
  var hh = obs.height / 2;
  var x = obs.x;
  var y = obs.y;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(x, y + hh + 3, hw * 0.8, hh * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Vehicle body with 3D gradient
  var bodyGrad = ctx.createLinearGradient(x - hw, y, x + hw, y);
  bodyGrad.addColorStop(0, shadeColor(obs.color, -30));
  bodyGrad.addColorStop(0.5, obs.color);
  bodyGrad.addColorStop(1, shadeColor(obs.color, -30));

  ctx.fillStyle = bodyGrad;
  ctx.fillRect(x - hw, y - hh, obs.width, obs.height);

  // Hood/Roof highlight
  var roofGrad = ctx.createLinearGradient(x, y - hh, x, y - hh + 20);
  roofGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  roofGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = roofGrad;
  ctx.fillRect(x - hw + 8, y - hh, obs.width - 16, 20);

  // Windshield with reflection
  var windGrad = ctx.createLinearGradient(x, y - hh + 8, x, y - hh + 28);
  windGrad.addColorStop(0, 'rgba(100, 150, 200, 0.6)');
  windGrad.addColorStop(0.5, 'rgba(30, 30, 40, 0.9)');
  windGrad.addColorStop(1, 'rgba(10, 10, 15, 0.95)');
  ctx.fillStyle = windGrad;
  ctx.fillRect(x - hw + 10, y - hh + 8, obs.width - 20, 20);

  // Windshield glare
  ctx.fillStyle = 'rgba(200, 220, 255, 0.2)';
  ctx.fillRect(x - hw + 12, y - hh + 10, obs.width - 24, 8);

  // Rear window
  ctx.fillStyle = 'rgba(20, 20, 30, 0.8)';
  ctx.fillRect(x - hw + 10, y + hh - 24, obs.width - 20, 16);

  // Side panels (depth lines)
  ctx.strokeStyle = shadeColor(obs.color, -50);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - hw, y - hh / 2);
  ctx.lineTo(x - hw, y + hh);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + hw, y - hh / 2);
  ctx.lineTo(x + hw, y + hh);
  ctx.stroke();

  // Wheels with arches
  var wheelPositions = [
    { x: x - hw + 12, y: y - hh + 18 },
    { x: x + hw - 12, y: y - hh + 18 },
    { x: x - hw + 12, y: y + hh - 18 },
    { x: x + hw - 12, y: y + hh - 18 }
  ];

  wheelPositions.forEach(function (wheel) {
    // Wheel arch shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, 7, 0, Math.PI * 2);
    ctx.fill();

    // Tire
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Rim
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Headlights with glow
  ctx.shadowColor = 'rgba(255, 255, 200, 0.8)';
  ctx.shadowBlur = 8;
  var headlightGrad = ctx.createRadialGradient(x - hw + 16, y - hh, 0, x - hw + 16, y - hh, 6);
  headlightGrad.addColorStop(0, '#ffffee');
  headlightGrad.addColorStop(1, '#ffeb3b');
  ctx.fillStyle = headlightGrad;
  ctx.fillRect(x - hw + 12, y - hh, 8, 4);
  ctx.fillRect(x + hw - 20, y - hh, 8, 4);
  ctx.shadowBlur = 0;

  // Taillights
  ctx.fillStyle = '#cc0000';
  ctx.fillRect(x - hw + 12, y + hh - 4, 8, 4);
  ctx.fillRect(x + hw - 20, y + hh - 4, 8, 4);

  // Hood lines (design detail)
  ctx.strokeStyle = shadeColor(obs.color, -20);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - hw / 2, y - hh + 5);
  ctx.lineTo(x - hw / 2, y - hh + 25);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + hw / 2, y - hh + 5);
  ctx.lineTo(x + hw / 2, y - hh + 25);
  ctx.stroke();

  // Door lines for realism
  ctx.strokeStyle = shadeColor(obs.color, -40);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - hw + 5, y - hh + 30);
  ctx.lineTo(x - hw + 5, y + hh - 25);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + hw - 5, y - hh + 30);
  ctx.lineTo(x + hw - 5, y + hh - 25);
  ctx.stroke();

  ctx.restore();
}

function shadeColor(color, percent) {
  var num = parseInt(color.replace("#", ""), 16);
  var amt = Math.round(2.55 * percent);
  var R = (num >> 16) + amt;
  var G = (num >> 8 & 0x00FF) + amt;
  var B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}


function drawObstacles() {
  for (var i = 0; i < obstacles.length; i++) {
    drawRealisticVehicle(obstacles[i]);
  }
}


function drawMinimap() {
  mmCtx.fillStyle = '#111';
  mmCtx.fillRect(0, 0, minimap.width, minimap.height);

  // Road representation
  mmCtx.fillStyle = '#333';
  mmCtx.fillRect(40, 0, 70, minimap.height);

  // Player car (yellow dot)
  mmCtx.fillStyle = '#f4e03c';
  mmCtx.beginPath();
  mmCtx.arc(75, 160, 5, 0, Math.PI * 2);
  mmCtx.fill();

  // Draw obstacles
  for (var i = 0; i < obstacles.length; i++) {
    var obs = obstacles[i];
    var mmX = 40 + ((obs.x - 200) / 600) * 70;
    var mmY = 160 - ((obs.y - car.y) / 8);

    if (mmY > 0 && mmY < minimap.height) {
      mmCtx.fillStyle = obs.color;
      mmCtx.fillRect(mmX - 3, mmY - 3, 6, 6);  // Slightly larger for visibility
    }
  }

  // Minimap border overlay for clarity
  mmCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  mmCtx.lineWidth = 1;
  mmCtx.strokeRect(40, 0, 70, minimap.height);
}


function updateSpeedometer() {
  var speedKph = Math.floor((Math.abs(car.speed) / car.maxSpeed) * 120);
  var rotation = (speedKph / 120) * 180 - 100;
  document.getElementById('speedNeedle').style.transform = 'rotate(' + rotation + 'deg)';
  document.getElementById('speedText').innerHTML = speedKph + '<span id="speedUnit">km/h</span>';
}