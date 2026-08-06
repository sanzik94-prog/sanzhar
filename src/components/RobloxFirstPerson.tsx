import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { BackroomsDetails } from './BackroomsDetails';
import { BackroomsCanvas } from './BackroomsCanvas';
import type { EnemyTheme } from '../lib/enemies';
import type { MazeWall } from '../lib/backrooms';

interface Point {
  x: number;
  y: number;
}

interface RobloxFirstPersonProps {
  player: Point;
  owner: Point;
  look: Point;
  unlocked: number;
  portalOpen: boolean;
  enemyTheme: EnemyTheme;
  walls: MazeWall[];
  wallColor: [number, number, number];
  onLook: (look: Point) => void;
}

export function RobloxFirstPerson({
  player,
  owner,
  look,
  unlocked,
  portalOpen,
  enemyTheme,
  walls,
  wallColor,
  onLook,
}: RobloxFirstPersonProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const lastPointer = useRef<Point>({ x: 0, y: 0 });
  const [timePhase, setTimePhase] = useState(0);
  const lookRef = useRef(look);
  const onLookRef = useRef(onLook);
  lookRef.current = look;
  onLookRef.current = onLook;
  const distance = Math.hypot(player.x - owner.x, player.y - owner.y);
  const dangerClass = distance < 15 ? 'danger-close' : distance < 35 ? 'danger-near' : '';
  const ownerScale = Math.max(.35, Math.min(4.5, 18 / Math.max(4, distance)));
  const ownerX = Math.max(12, Math.min(88, 50 + (owner.x - player.x) * .7));
  const travel = player.y * 20;
  const depthStep = (player.y % 22) / 22;
  const mapZone = Math.min(4, Math.floor(player.x / 40));
  const depthZone = Math.min(3, Math.floor(player.y / 50));
  const visualYaw = Math.sin(look.x * Math.PI / 180) * 60;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimePhase((phase) => (phase + 1) % 3);
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function lockedLook(event: MouseEvent) {
      if (document.pointerLockElement !== viewRef.current) return;
      const current = lookRef.current;
      const next = {
        x: (current.x - event.movementX * .18 + 360) % 360,
        y: Math.max(-55, Math.min(55, current.y - event.movementY * .14)),
      };
      lookRef.current = next;
      onLookRef.current(next);
    }
    document.addEventListener('mousemove', lockedLook);
    return () => {
      document.removeEventListener('mousemove', lockedLook);
    };
  }, []);

  function beginLook(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.pointerType === 'mouse') {
      void viewRef.current?.requestPointerLock();
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    lastPointer.current = { x: event.clientX, y: event.clientY };
  }

  function rotateLook(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const x = event.clientX - lastPointer.current.x;
    const y = event.clientY - lastPointer.current.y;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    const current = lookRef.current;
    const next = {
      x: (current.x - x * .25 + 360) % 360,
      y: Math.max(-55, Math.min(55, current.y - y * .19)),
    };
    lookRef.current = next;
    onLook(next);
  }

  return (
    <div
      ref={viewRef}
      className={`roblox-view map-zone-${mapZone} depth-zone-${depthZone} time-phase-${timePhase} camera-first ${dangerClass}`}
      onPointerDown={beginLook}
      onPointerMove={rotateLook}
      onDoubleClick={() => viewRef.current?.requestPointerLock()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <BackroomsCanvas player={player} owner={owner} yaw={look.x} pitch={look.y}
        portalOpen={portalOpen} enemyTheme={enemyTheme} walls={walls} wallColor={wallColor} />
      <div
        className="roblox-corridor"
        style={{ transform: `scale(1.08) rotateX(${look.y * .4}deg) rotateY(${-visualYaw * .35}deg)` }}
      >
        <div className="roblox-ceiling" style={{ backgroundPositionY: `${-travel * .35}px` }} />
        <div className="roblox-floor" style={{ backgroundPositionY: `${travel}px` }}>
          <i className="carpet-stain stain-left" />
          <i className="carpet-stain stain-right" />
          <span className="floor-seam seam-left" />
          <span className="floor-seam seam-right" />
          <b className="floor-damage"><i /><i /><i /></b>
        </div>
        <div className="roblox-wall roblox-wall-left" style={{ backgroundPositionY: `${travel * .55}px` }} />
        <div className="roblox-wall roblox-wall-right" style={{ backgroundPositionY: `${travel * .55}px` }} />
        <div className="wall-paint wall-paint-left"><i /><i /><b /></div>
        <div className="wall-paint wall-paint-right"><i /><i /><b /></div>
        <div className="floor-skirting floor-skirting-left" />
        <div className="floor-skirting floor-skirting-right" />
        <div className="backrooms-end" />
        <div className="depth-frame depth-near" style={{ transform: `scale(${1.05 + depthStep * .3}) translateZ(35px)` }} />
        <div className="depth-frame depth-middle" style={{ transform: `scale(${.62 + depthStep * .18}) translateZ(5px)` }} />
        <div className="roblox-column column-left" />
        <div className="roblox-column column-right" />
        <div className="roblox-column column-far-left" />
        <div className="roblox-column column-far-right" />
        <div className="roblox-passage roblox-passage-left" />
        <div className="roblox-passage roblox-passage-right" />
        <div className="backrooms-desk">
          <i className="desk-top" />
          <i className="desk-leg desk-leg-left" />
          <i className="desk-leg desk-leg-right" />
        </div>
        <div className="backrooms-chair">
          <i className="chair-back" />
          <i className="chair-seat" />
          <i className="chair-leg chair-leg-left" />
          <i className="chair-leg chair-leg-right" />
        </div>
        <div className="backrooms-cabinet"><i /><i /><b /></div>
        <div className="backrooms-sofa"><i /><i /><b /><b /></div>
        <div className="backrooms-lamp"><i /><b /><span /></div>
        <div className="backrooms-boxes"><i /><i /><i /></div>
        <BackroomsDetails />
        <div className={`roblox-door ${unlocked > 0 ? 'roblox-door-open' : ''}`} />
        <div className="roblox-light light-near" />
        <div className="roblox-light light-far" />
      </div>
      <div
        className="roblox-owner"
        style={{
          left: `${ownerX}%`,
          transform: `translate(-50%,-50%) scale(${ownerScale})`,
          opacity: distance < 80 ? 1 : 0,
        }}
      >
        <span><i className="owner-head"><em /><em /></i><i className="owner-body" /></span>
      </div>
      <div className="roblox-crosshair" />
      <div className="look-note">Клик — включить мышь · WASD — идти</div>
      <div className="realism-overlay"><i /><i /><i /></div>
      <div className="camera-noise" />
      <div className="danger-pulse" />
      <div className="light-bloom" />
    </div>
  );
}
