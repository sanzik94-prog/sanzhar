export function drawMinotaur(
  context: CanvasRenderingContext2D,
  x: number,
  top: number,
  size: number,
  eyeColor: string,
) {
  context.save();
  const bodyLight = context.createRadialGradient(
    x - size * .14,
    top + size * .38,
    size * .04,
    x,
    top + size * .62,
    size * .55,
  );
  bodyLight.addColorStop(0, '#725b4b');
  bodyLight.addColorStop(.42, '#423129');
  bodyLight.addColorStop(1, '#1b1412');
  context.fillStyle = bodyLight;
  context.strokeStyle = '#16110f';
  context.lineWidth = Math.max(3, size * .035);

  context.beginPath();
  context.ellipse(x, top + size * .58, size * .3, size * .36, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.fillStyle = 'rgba(190,154,122,.14)';
  context.beginPath();
  context.ellipse(x - size * .08, top + size * .48, size * .13, size * .2, -.35, 0, Math.PI * 2);
  context.fill();
  for (const direction of [-1, 1]) {
    context.fillStyle = bodyLight;
    context.beginPath();
    context.ellipse(x + direction * size * .3, top + size * .58, size * .13, size * .34, direction * -.18, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.ellipse(x + direction * size * .17, top + size * .98, size * .12, size * .29, direction * .12, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  const mane = context.createLinearGradient(x - size * .2, top, x + size * .2, top + size * .45);
  mane.addColorStop(0, '#766b60');
  mane.addColorStop(.45, '#443a33');
  mane.addColorStop(1, '#1e1816');
  context.fillStyle = mane;
  context.beginPath();
  context.moveTo(x - size * .23, top + size * .29);
  context.quadraticCurveTo(x, top - size * .12, x + size * .23, top + size * .29);
  context.lineTo(x + size * .15, top + size * .5);
  context.lineTo(x - size * .15, top + size * .5);
  context.closePath();
  context.fill();

  context.fillStyle = '#251b18';
  context.beginPath();
  context.ellipse(x, top + size * .25, size * .18, size * .2, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#49342b';
  context.beginPath();
  context.ellipse(x, top + size * .34, size * .13, size * .09, 0, 0, Math.PI * 2);
  context.fill();

  const horn = context.createLinearGradient(x, top, x, top - size * .22);
  horn.addColorStop(0, '#17120f');
  horn.addColorStop(.55, '#51483f');
  horn.addColorStop(1, '#a79b88');
  context.strokeStyle = horn;
  context.lineWidth = Math.max(5, size * .065);
  context.lineCap = 'round';
  for (const direction of [-1, 1]) {
    context.beginPath();
    context.moveTo(x + direction * size * .12, top + size * .2);
    context.quadraticCurveTo(
      x + direction * size * .42,
      top + size * .04,
      x + direction * size * .46,
      top - size * .2,
    );
    context.stroke();
  }

  context.strokeStyle = '#83756c';
  context.lineWidth = Math.max(2, size * .025);
  for (const direction of [-1, 1]) {
    context.beginPath();
    context.moveTo(x + direction * size * .1, top + size * .42);
    context.lineTo(x + direction * size * .13, top + size * .72);
    context.stroke();
  }

  context.strokeStyle = 'rgba(205,174,145,.2)';
  context.lineWidth = Math.max(2, size * .018);
  context.beginPath();
  context.arc(x, top + size * .58, size * .2, Math.PI * 1.08, Math.PI * 1.9);
  context.stroke();

  context.shadowColor = eyeColor;
  context.shadowBlur = Math.max(18, size * .22);
  context.fillStyle = eyeColor;
  context.fillRect(x - size * .09, top + size * .25, 6, 6);
  context.fillRect(x + size * .07, top + size * .25, 6, 6);
  context.restore();
}
