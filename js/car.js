function getCarCorners() {
  var hw = car.width / 2;
  var hh = car.height / 2;
  var corners = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh }
  ];
  var s = Math.sin(car.angle);
  var c = Math.cos(car.angle);
  return corners.map(function (p) {
    return {
      x: car.x + p.x * c - p.y * s,
      y: car.y + p.x * s + p.y * c
    };
  });
}
function getObstacleCorners(obs) {
  var hw = obs.width / 2;
  var hh = obs.height / 2;
  return [
    { x: obs.x - hw, y: obs.y - hh },
    { x: obs.x + hw, y: obs.y - hh },
    { x: obs.x + hw, y: obs.y + hh },
    { x: obs.x - hw, y: obs.y + hh }
  ];
}
function checkPolygonCollision(corners1, corners2) {
  var polygons = [corners1, corners2];

  for (var i = 0; i < polygons.length; i++) {
    var polygon = polygons[i];

    for (var j = 0; j < polygon.length; j++) {
      var p1 = polygon[j];
      var p2 = polygon[(j + 1) % polygon.length];

      // Get edge normal (perpendicular axis)
      var edge = { x: p2.x - p1.x, y: p2.y - p1.y };
      var normal = { x: -edge.y, y: edge.x };

      // Normalize
      var len = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
      normal.x /= len;
      normal.y /= len;

      // Project both polygons onto this axis
      var min1 = Infinity, max1 = -Infinity;
      var min2 = Infinity, max2 = -Infinity;

      for (var k = 0; k < corners1.length; k++) {
        var projection = corners1[k].x * normal.x + corners1[k].y * normal.y;
        min1 = Math.min(min1, projection);
        max1 = Math.max(max1, projection);
      }

      for (var k = 0; k < corners2.length; k++) {
        var projection = corners2[k].x * normal.x + corners2[k].y * normal.y;
        min2 = Math.min(min2, projection);
        max2 = Math.max(max2, projection);
      }

      // Check for gap on this axis
      if (max1 < min2 || max2 < min1) {
        return false; // Separating axis found - no collision
      }
    }
  }

  return true; // No separating axis found - collision detected
}



function isCarOutsideRoad() {
  var corners = getCarCorners();
  var roadLeft = 210;
  var roadRight = 790;
  for (var i = 0; i < corners.length; i++) {
    if (corners[i].x < roadLeft || corners[i].x > roadRight) {
      return true;
    }
  }
  return false;
}


function drawCar() {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);

  var hw = car.width / 2;
  var hh = car.height / 2;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  var bodyGrad = ctx.createLinearGradient(-hw, 0, hw, 0);
  bodyGrad.addColorStop(0, '#e8d21d');
  bodyGrad.addColorStop(0.5, '#f4e03c');
  bodyGrad.addColorStop(1, '#e8d21d');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-hw + 8, -hh);
  ctx.lineTo(hw - 8, -hh);
  ctx.quadraticCurveTo(hw, -hh, hw, -hh + 8);
  ctx.lineTo(hw, hh - 8);
  ctx.quadraticCurveTo(hw, hh, hw - 8, hh);
  ctx.lineTo(-hw + 8, hh);
  ctx.quadraticCurveTo(-hw, hh, -hw, hh - 8);
  ctx.lineTo(-hw, -hh + 8);
  ctx.quadraticCurveTo(-hw, -hh, -hw + 8, -hh);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = 'transparent';

  var windGrad = ctx.createLinearGradient(0, -hh + 10, 0, -hh + 28);
  windGrad.addColorStop(0, '#0a0a0a');
  windGrad.addColorStop(0.5, '#1a1a1a');
  windGrad.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = windGrad;
  ctx.fillRect(-hw + 10, -hh + 10, car.width - 20, 18);

  ctx.fillStyle = 'rgba(135, 206, 250, 0.3)';
  ctx.fillRect(-hw + 12, -hh + 12, car.width - 24, 8);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(-4, -hh + 32, 8, 20);

  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(-hw + 10, hh - 26, car.width - 20, 16);

  ctx.fillStyle = '#333';
  ctx.fillRect(-hw - 6, -hh / 2 - 6, 6, 12);
  ctx.fillRect(hw, -hh / 2 - 6, 6, 12);

  var wheelGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 8);
  wheelGrad.addColorStop(0, '#1a1a1a');
  wheelGrad.addColorStop(1, '#000');
  ctx.fillStyle = wheelGrad;
  var wheelW = 10, wheelL = 18;
  ctx.fillRect(-hw - wheelW, -hh + 14, wheelW, wheelL);
  ctx.fillRect(hw, -hh + 14, wheelW, wheelL);
  ctx.fillRect(-hw - wheelW, hh - 32, wheelW, wheelL);
  ctx.fillRect(hw, hh - 32, wheelW, wheelL);

  var headlightGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 6);
  headlightGrad.addColorStop(0, '#ffffcc');
  headlightGrad.addColorStop(1, '#ffeb3b');
  ctx.fillStyle = headlightGrad;
  ctx.fillRect(-hw + 12, -hh - 2, 10, 4);
  ctx.fillRect(hw - 22, -hh - 2, 10, 4);

  if (keys['s'] || keys['ArrowDown']) {
    ctx.fillStyle = '#ff0000';
  } else {
    ctx.fillStyle = '#8b0000';
  }
  ctx.fillRect(-hw + 12, hh - 2, 10, 4);
  ctx.fillRect(hw - 22, hh - 2, 10, 4);

  if (car.leftIndicator) {
    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.arc(-hw - 3, 0, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  if (car.rightIndicator) {
    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.arc(hw + 3, 0, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
