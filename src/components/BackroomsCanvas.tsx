import { useEffect, useRef, useState } from 'react';
import { mazeWalls } from '../lib/backrooms';
import { drawBackroomsCeiling, drawEnemy, drawFinishPortal, drawThemeAtmosphere } from '../lib/backrooms-render';
import type { EnemyTheme } from '../lib/enemies';

interface Point {
  x: number;
  y: number;
}

interface BackroomsCanvasProps {
  player: Point;
  owner: Point;
  yaw: number;
  pitch: number;
  portalOpen: boolean;
  enemyTheme: EnemyTheme;
}

const FIELD_OF_VIEW = Math.PI / 2.7;
const MAX_DISTANCE = 90;

function hitsWall(x: number, y: number) {
  return mazeWalls.some((wall) =>
    x >= wall.x && x <= wall.x + wall.width &&
    y >= wall.y && y <= wall.y + wall.height
  );
}

function castRay(player: Point, angle: number) {
  for (let distance = .5; distance < MAX_DISTANCE; distance += .45) {
    const x = player.x + Math.cos(angle) * distance;
    const y = player.y + Math.sin(angle) * distance;
    if (hitsWall(x, y)) return distance;
  }
  return MAX_DISTANCE;
}

export function BackroomsCanvas({ player, owner, yaw, pitch, portalOpen, enemyTheme }: BackroomsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetYaw = useRef(yaw);
  const targetPitch = useRef(pitch);
  const [smoothYaw, setSmoothYaw] = useState(yaw);
  const [smoothPitch, setSmoothPitch] = useState(pitch);
  targetYaw.current = yaw;
  targetPitch.current = pitch;

  useEffect(() => {
    let frame = 0;
    function smoothCamera() {
      setSmoothYaw((current) => {
        const difference = (targetYaw.current - current + 540) % 360 - 180;
        return Math.abs(difference) < .02 ? targetYaw.current : current + difference * .28;
      });
      setSmoothPitch((current) => current + (targetPitch.current - current) * .28);
      frame = requestAnimationFrame(smoothCamera);
    }
    frame = requestAnimationFrame(smoothCamera);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(640, Math.round(bounds.width * scale));
    canvas.height = Math.max(360, Math.round(bounds.height * scale));
    const context = canvas.getContext('2d');
    if (!context) return;

    const { width, height } = canvas;
    const horizon = height * (.48 + smoothPitch / 180);
    drawBackroomsCeiling(context, width, horizon, scale, enemyTheme);
    const floor = context.createLinearGradient(0, horizon, 0, height);
    floor.addColorStop(0, enemyTheme.floor);
    floor.addColorStop(1, '#11130f');
    context.fillStyle = floor;
    context.fillRect(0, horizon, width, height - horizon);

    const heading = Math.PI / 2 - smoothYaw * Math.PI / 180;
    const rayWidth = 3;
    for (let x = 0; x < width; x += rayWidth) {
      const rayOffset = (x / width - .5) * FIELD_OF_VIEW;
      const rawDistance = castRay(player, heading + rayOffset);
      const distance = rawDistance * Math.cos(rayOffset);
      const wallHeight = Math.min(height * 1.7, height * 5.2 / Math.max(distance, 1));
      const light = Math.max(.28, 1 - distance / 110);
      const [red, green, blue] = enemyTheme.wall;
      context.fillStyle = `rgb(${Math.round(red * light)},${Math.round(green * light)},${Math.round(blue * light)})`;
      context.fillRect(x, horizon - wallHeight / 2, rayWidth + 1, wallHeight);
      if (x % 48 < rayWidth) {
        context.fillStyle = 'rgba(30,29,14,.24)';
        context.fillRect(x, horizon - wallHeight / 2, 2, wallHeight);
      }
    }

    for (let y = horizon; y < height; y += Math.max(10, (y - horizon) * .16)) {
      context.fillStyle = 'rgba(178,165,83,.09)';
      context.fillRect(0, y, width, 2);
    }
    drawThemeAtmosphere(context, width, height, horizon, enemyTheme);
    drawFinishPortal(context, width, horizon, player, heading, FIELD_OF_VIEW, portalOpen);
    drawEnemy(context, width, horizon, player, owner, heading, FIELD_OF_VIEW, enemyTheme);
  }, [enemyTheme, owner, player, portalOpen, smoothPitch, smoothYaw]);

  return <canvas ref={canvasRef} className="backrooms-canvas" />;
}
