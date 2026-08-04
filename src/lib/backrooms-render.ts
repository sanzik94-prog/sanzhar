import type { EnemyTheme } from './enemies';
import { drawEnemySkin } from './enemy-render';
import { drawMinotaur } from './minotaur-render';

export function drawBackroomsCeiling(
  context: CanvasRenderingContext2D,
  width: number,
  horizon: number,
  scale: number,
  theme: EnemyTheme,
) {
  const ceiling = context.createLinearGradient(0, 0, 0, horizon);
  ceiling.addColorStop(0, '#303127');
  ceiling.addColorStop(1, theme.ceiling);
  context.fillStyle = ceiling;
  context.fillRect(0, 0, width, horizon);
  context.strokeStyle = 'rgba(45, 45, 27, .58)';
  context.lineWidth = Math.max(2, scale);

  for (let panel = 1; panel < 9; panel += 1) {
    const y = horizon - horizon * Math.pow(panel / 9, 1.65);
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  for (let column = -4; column <= 4; column += 1) {
    context.beginPath();
    context.moveTo(width / 2 + column * width * .2, 0);
    context.lineTo(width / 2 + column * width * .025, horizon);
    context.stroke();
  }
  for (const light of [{ x: .5, y: .13, w: .13 }, { x: .43, y: .32, w: .08 }]) {
    context.shadowColor = theme.accent;
    context.shadowBlur = 28 * scale;
    context.fillStyle = 'rgba(255, 249, 200, .96)';
    context.fillRect(width * (light.x - light.w / 2), horizon * light.y, width * light.w, 7 * scale);
  }
  context.shadowBlur = 0;
}

export function drawEnemy(
  context: CanvasRenderingContext2D,
  width: number,
  horizon: number,
  player: { x: number; y: number },
  enemy: { x: number; y: number },
  heading: number,
  fieldOfView: number,
  theme: EnemyTheme,
) {
  const dx = enemy.x - player.x;
  const dy = enemy.y - player.y;
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(Math.sin(Math.atan2(dy, dx) - heading), Math.cos(Math.atan2(dy, dx) - heading));
  if (Math.abs(angle) > fieldOfView / 2 || distance > 65) return;
  const x = width * (.5 + angle / fieldOfView);
  const size = Math.min(horizon * 1.45, horizon * 6 / Math.max(distance, 3));
  const top = horizon - size * .55;
  if (theme.id === 'minotaur') {
    drawMinotaur(context, x, top, size, theme.accent);
    return;
  }
  drawEnemySkin(context, x, top, size, theme);
}

export function drawThemeAtmosphere(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizon: number,
  theme: EnemyTheme,
) {
  context.save();
  if (theme.id === 'minotaur') {
    context.strokeStyle = 'rgba(255,104,38,.26)';
    context.lineWidth = 5;
    for (const x of [width * .13, width * .87]) {
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x + 18, horizon * .72); context.stroke();
    }
  } else if (theme.id === 'ghost') {
    const fog = context.createLinearGradient(0, horizon, 0, height);
    fog.addColorStop(0, 'rgba(185,255,255,.03)'); fog.addColorStop(1, 'rgba(185,255,255,.2)');
    context.fillStyle = fog; context.fillRect(0, horizon, width, height - horizon);
  } else if (theme.id === 'doll') {
    context.fillStyle = 'rgba(255,180,195,.12)';
    for (let x = 30; x < width; x += 70) for (let y = 35; y < horizon; y += 70) context.fillRect(x, y, 7, 7);
  } else if (theme.id === 'robot') {
    context.strokeStyle = 'rgba(255,181,46,.15)';
    for (let x = 0; x < width; x += 64) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
  } else {
    context.fillStyle = 'rgba(68,15,95,.16)';
    context.fillRect(0, 0, width, height);
  }
  context.restore();
}

export function drawFinishPortal(
  context: CanvasRenderingContext2D,
  width: number,
  horizon: number,
  player: { x: number; y: number },
  heading: number,
  fieldOfView: number,
  isOpen: boolean,
) {
  const dx = 116 - player.x;
  const dy = 35 - player.y;
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(
    Math.sin(Math.atan2(dy, dx) - heading),
    Math.cos(Math.atan2(dy, dx) - heading),
  );
  if (Math.abs(angle) > fieldOfView / 2 || distance > 90) return;
  const x = width * (.5 + angle / fieldOfView);
  const portalHeight = Math.min(horizon * 1.45, horizon * 7 / Math.max(distance, 3));
  const portalWidth = portalHeight * .48;
  context.shadowColor = isOpen ? '#2fffe0' : '#ffb52e';
  context.shadowBlur = isOpen ? 34 : 16;
  context.strokeStyle = isOpen ? '#62ffe8' : '#8f6423';
  context.lineWidth = Math.max(5, portalWidth * .1);
  context.fillStyle = isOpen ? 'rgba(18, 138, 135, .68)' : 'rgba(38, 24, 12, .94)';
  context.fillRect(x - portalWidth / 2, horizon - portalHeight / 2, portalWidth, portalHeight);
  context.strokeRect(x - portalWidth / 2, horizon - portalHeight / 2, portalWidth, portalHeight);
  context.shadowBlur = 0;
}
