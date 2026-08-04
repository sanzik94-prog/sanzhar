import type { EnemyTheme } from './enemies';

export function drawEnemySkin(
  context: CanvasRenderingContext2D,
  x: number,
  top: number,
  size: number,
  theme: EnemyTheme,
) {
  context.save();
  context.fillStyle = theme.body;
  context.strokeStyle = theme.accent;
  context.lineWidth = Math.max(2, size * .025);

  if (theme.id === 'ghost') {
    context.globalAlpha = .78;
    context.beginPath();
    context.arc(x, top + size * .22, size * .2, Math.PI, 0);
    context.lineTo(x + size * .25, top + size * .82);
    context.lineTo(x + size * .12, top + size * .72);
    context.lineTo(x, top + size * .84);
    context.lineTo(x - size * .12, top + size * .72);
    context.lineTo(x - size * .25, top + size * .82);
    context.closePath();
    context.fill();
    context.stroke();
  } else if (theme.id === 'doll') {
    context.beginPath();
    context.arc(x, top + size * .18, size * .18, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillRect(x - size * .2, top + size * .38, size * .4, size * .4);
    context.beginPath();
    context.moveTo(x - size * .2, top + size * .5);
    context.lineTo(x - size * .38, top + size * .78);
    context.moveTo(x + size * .2, top + size * .5);
    context.lineTo(x + size * .38, top + size * .78);
    context.stroke();
  } else if (theme.id === 'robot') {
    context.fillRect(x - size * .19, top, size * .38, size * .3);
    context.strokeRect(x - size * .19, top, size * .38, size * .3);
    context.fillRect(x - size * .27, top + size * .36, size * .54, size * .44);
    context.strokeRect(x - size * .27, top + size * .36, size * .54, size * .44);
    context.fillStyle = theme.accent;
    context.fillRect(x - size * .13, top + size * .48, size * .26, size * .08);
  } else {
    context.beginPath();
    context.moveTo(x, top - size * .08);
    context.lineTo(x + size * .23, top + size * .28);
    context.lineTo(x + size * .3, top + size * .88);
    context.lineTo(x, top + size * .72);
    context.lineTo(x - size * .3, top + size * .88);
    context.lineTo(x - size * .23, top + size * .28);
    context.closePath();
    context.fill();
    context.stroke();
  }

  context.shadowColor = theme.accent;
  context.shadowBlur = Math.max(18, size * .25);
  context.fillStyle = theme.accent;
  context.fillRect(x - size * .09, top + size * .14, 7, 7);
  context.fillRect(x + size * .07, top + size * .14, 7, 7);
  context.restore();
}
