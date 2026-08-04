import type { EnemyTheme } from './enemies';

export function drawCorridorDecorations(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizon: number,
  theme: EnemyTheme,
) {
  context.save();
  const scale = width / 1280;
  context.strokeStyle = 'rgba(37,31,24,.72)';
  context.lineWidth = 7 * scale;
  context.beginPath();
  context.moveTo(width * .08, 0);
  context.lineTo(width * .08, horizon * .72);
  context.quadraticCurveTo(width * .08, horizon * .8, width * .14, horizon * .8);
  context.lineTo(width * .22, horizon * .8);
  context.stroke();

  context.fillStyle = 'rgba(25,27,25,.82)';
  context.strokeStyle = 'rgba(178,170,124,.58)';
  context.lineWidth = 3 * scale;
  context.fillRect(width * .78, horizon * .27, width * .12, height * .14);
  context.strokeRect(width * .78, horizon * .27, width * .12, height * .14);
  for (let line = 1; line < 5; line += 1) {
    const y = horizon * .27 + height * .025 * line;
    context.beginPath(); context.moveTo(width * .79, y); context.lineTo(width * .89, y); context.stroke();
  }

  context.globalAlpha = .62;
  context.fillStyle = theme.accent;
  context.fillRect(width * .12, horizon * .35, width * .13, height * .075);
  context.globalAlpha = 1;
  context.fillStyle = '#171710';
  context.font = `bold ${Math.max(11, 15 * scale)}px sans-serif`;
  context.textAlign = 'center';
  context.fillText('ОПАСНО', width * .185, horizon * .35 + height * .047);

  context.strokeStyle = 'rgba(35,31,23,.6)';
  context.lineWidth = 3 * scale;
  for (const offset of [0, .035, .07]) {
    context.beginPath();
    context.moveTo(width * (.58 + offset), horizon * .18);
    context.lineTo(width * (.55 + offset), horizon * .34);
    context.lineTo(width * (.59 + offset), horizon * .44);
    context.stroke();
  }
  context.restore();
}
