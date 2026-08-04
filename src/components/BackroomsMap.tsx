import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { canEnterMazePosition, FINISH_PORTAL, getMazeLayout, MAP_SIZE } from '../lib/backrooms';
import { PipeHack } from './PipeHack';
import { RobloxFirstPerson } from './RobloxFirstPerson';
import { getEnemyTheme } from '../lib/enemies';
import { PuzzleMapOverlay } from './PuzzleMapOverlay';

interface Point { x: number; y: number; }
interface BackroomsMapProps { solved: number; total: number; room: number; onCaught: () => void; onFinish: () => void; }
const PLAYER_WALK_SPEED = .68;
const OWNER_SPEED = .18;

export function BackroomsMap({ solved, total, onCaught, onFinish, room }: BackroomsMapProps) {
  const [player, setPlayer] = useState<Point>({ x: 100, y: 154 });
  const [owner, setOwner] = useState<Point>({ x: 100, y: 184 });
  const [stick, setStick] = useState<Point>({ x: 0, y: 0 });
  const [caught, setCaught] = useState(false);
  const [stamina, setStamina] = useState(100);
  const [isExhausted, setIsExhausted] = useState(false);
  const [look, setLook] = useState<Point>({ x: 0, y: 0 });
  const [chaseCountdown, setChaseCountdown] = useState(5);
  const [hackOpen, setHackOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const input = useRef<Point>({ x: 0, y: 0 });
  const velocity = useRef<Point>({ x: 0, y: 0 });
  const playerRef = useRef(player);
  const ownerRef = useRef(owner);
  const sprint = useRef(false);
  const caughtOnce = useRef(false);
  const unlockedRef = useRef(0);
  const chaseStartsAt = useRef(performance.now() + 5000);
  const staminaRef = useRef(100);
  const exhaustedRef = useRef(false);
  const lookRef = useRef(look);
  const caughtHandler = useRef(onCaught);
  const finishHandler = useRef(onFinish);
  const portalOpenRef = useRef(false);
  const finishedOnce = useRef(false);
  const hackTriggered = useRef(false);
  caughtHandler.current = onCaught;
  finishHandler.current = onFinish;
  const enemyTheme = getEnemyTheme(room);
  const wallColor: [number, number, number] = room === 12 ? [255, 225, 18] : enemyTheme.wall;
  const layout = useMemo(() => getMazeLayout(room), [room]);
  const { doors, rooms, walls } = layout;
  const unlocked = Math.min(doors.length, Math.floor(solved * doors.length / total));
  const blockingDoors = useMemo(() => doors.map((door) => ({
    x: door.x - 3,
    y: door.y - 4,
    width: door.width + 6,
    height: door.height + 8,
  })), [doors]);
  const visibleWalls = useMemo(() => [
    ...walls,
    ...blockingDoors.slice(unlocked),
  ], [blockingDoors, unlocked, walls]);
  const allPuzzlesSolved = solved >= total;
  unlockedRef.current = unlocked;

  useEffect(() => {
    const keys = new Set<string>();
    const movementCodes: Record<string, string> = {
      KeyW: 'w',
      KeyA: 'a',
      KeyS: 's',
      KeyD: 'd',
      ArrowUp: 'arrowup',
      ArrowLeft: 'arrowleft',
      ArrowDown: 'arrowdown',
      ArrowRight: 'arrowright',
    };
    function syncKeys() {
      input.current = {
        x: Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft')),
        y: Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup')),
      };
      setStick({ x: input.current.x * 25, y: input.current.y * 25 });
    }
    const down = (event: KeyboardEvent) => {
      const key = movementCodes[event.code] ?? event.key.toLowerCase();
      if (event.code === 'KeyQ') sprint.current = true;
      if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
        event.preventDefault(); keys.add(key); syncKeys();
      }
    };
    const up = (event: KeyboardEvent) => {
      const key = movementCodes[event.code] ?? event.key.toLowerCase();
      if (event.code === 'KeyQ') sprint.current = false;
      keys.delete(key); syncKeys();
    };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useEffect(() => {
    const isNearLockedDoor = doors.slice(unlocked).some((door) => {
      const doorX = door.x + door.width / 2;
      const doorY = door.y + door.height / 2;
      return Math.hypot(player.x - doorX, player.y - doorY) < 11;
    });
    if (isNearLockedDoor && !allPuzzlesSolved) {
      window.dispatchEvent(new Event('backrooms-door-approach'));
    }
  }, [allPuzzlesSolved, doors, player, solved, unlocked]);

  useEffect(() => {
    const distance = Math.hypot(player.x - FINISH_PORTAL.x, player.y - FINISH_PORTAL.y);
    if (distance < 11 && !allPuzzlesSolved) {
      window.dispatchEvent(new Event('backrooms-door-approach'));
      return;
    }
    if (distance < 11 && allPuzzlesSolved && !portalOpen && !hackTriggered.current) {
      hackTriggered.current = true;
      setHackOpen(true);
    } else if (distance > 15) {
      hackTriggered.current = false;
    }
  }, [allPuzzlesSolved, player, portalOpen]);

  useEffect(() => {
    function openHack(event: KeyboardEvent) {
      const distance = Math.hypot(player.x - FINISH_PORTAL.x, player.y - FINISH_PORTAL.y);
      if (event.code === 'KeyE' && distance < 13 && allPuzzlesSolved && !portalOpen) setHackOpen(true);
    }
    window.addEventListener('keydown', openHack);
    return () => window.removeEventListener('keydown', openHack);
  }, [allPuzzlesSolved, player, portalOpen]);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    function tick(now: number) {
      const delta = Math.min(2, (now - previous) / 16);
      previous = now;
      const chaseRemaining = Math.max(0, Math.ceil((chaseStartsAt.current - now) / 1000));
      setChaseCountdown(chaseRemaining);
      const length = Math.max(1, Math.hypot(input.current.x, input.current.y));
      const running = sprint.current && !exhaustedRef.current && staminaRef.current > 0 && length > 0;
      const speed = running ? 1.55 : 1;
      staminaRef.current = running ? Math.max(0, staminaRef.current - .3 * delta) : Math.min(100, staminaRef.current + .25 * delta);
      if (staminaRef.current === 0 && !exhaustedRef.current) {
        exhaustedRef.current = true;
        sprint.current = false;
        setIsExhausted(true);
      } else if (staminaRef.current >= 25 && exhaustedRef.current) {
        exhaustedRef.current = false;
        setIsExhausted(false);
      }
      setStamina(staminaRef.current);
      const hasInput = Math.hypot(input.current.x, input.current.y) > .05;
      const smoothing = hasInput ? .075 : .05;
      const blend = 1 - Math.pow(1 - smoothing, delta);
      const strafe = -input.current.x / length * speed;
      const forward = -input.current.y / length * speed;
      const yaw = lookRef.current.x * Math.PI / 180;
      const moveX = strafe * Math.cos(yaw) + forward * Math.sin(yaw);
      const moveY = forward * Math.cos(yaw) - strafe * Math.sin(yaw);
      velocity.current.x += (moveX - velocity.current.x) * blend;
      velocity.current.y += (moveY - velocity.current.y) * blend;
      setPlayer((current) => {
        const px = Math.max(6, Math.min(194, current.x + velocity.current.x * PLAYER_WALK_SPEED * delta));
        const py = Math.max(6, Math.min(194, current.y + velocity.current.y * PLAYER_WALK_SPEED * delta));
        const canMoveX = canEnterMazePosition(px, current.y, unlockedRef.current, walls, blockingDoors);
        const x = canMoveX ? px : current.x;
        if (!canMoveX) velocity.current.x = 0;
        const canMoveY = canEnterMazePosition(x, py, unlockedRef.current, walls, blockingDoors);
        const y = canMoveY ? py : current.y;
        if (!canMoveY) velocity.current.y = 0;
        playerRef.current = { x, y };
        return { x, y };
      });
      setOwner((current) => {
        if (now < chaseStartsAt.current) return current;
        const dx = playerRef.current.x - current.x;
        const dy = playerRef.current.y - current.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const stepX = current.x + dx / distance * OWNER_SPEED * delta;
        const stepY = current.y + dy / distance * OWNER_SPEED * delta;
        const x = canEnterMazePosition(stepX, current.y, unlockedRef.current, walls, blockingDoors) ? stepX : current.x;
        const y = canEnterMazePosition(x, stepY, unlockedRef.current, walls, blockingDoors) ? stepY : current.y;
        const next = { x, y };
        ownerRef.current = next;
        return next;
      });
      const portalDistance = Math.hypot(playerRef.current.x - FINISH_PORTAL.x, playerRef.current.y - FINISH_PORTAL.y);
      if (portalOpenRef.current && portalDistance < 4 && !finishedOnce.current) {
        finishedOnce.current = true;
        finishHandler.current();
      }
      if (now >= chaseStartsAt.current && !caughtOnce.current && Math.hypot(playerRef.current.x - ownerRef.current.x, playerRef.current.y - ownerRef.current.y) < 5) {
        caughtOnce.current = true; setCaught(true); window.setTimeout(() => caughtHandler.current(), 650);
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function drag(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    const scale = Math.min(1, 31 / Math.max(1, Math.hypot(x, y)));
    setStick({ x: x * scale, y: y * scale });
    input.current = { x: x * scale / 31, y: y * scale / 31 };
  }
  const release = () => { setStick({ x: 0, y: 0 }); input.current = { x: 0, y: 0 }; };
  const px = player.x / MAP_SIZE * 100;
  const py = player.y / MAP_SIZE * 100;
  const camera = { x: (50 - px) * .9, y: (50 - py) * .9 };
  const portalDistance = Math.hypot(player.x - FINISH_PORTAL.x, player.y - FINISH_PORTAL.y);
  const heading = Math.PI / 2 - look.x * Math.PI / 180;
  const targetHeading = Math.atan2(FINISH_PORTAL.y - player.y, FINISH_PORTAL.x - player.x);
  const portalAngle = Math.atan2(
    Math.sin(targetHeading - heading),
    Math.cos(targetHeading - heading),
  ) * 180 / Math.PI;

  return (
    <div className={`topdown-game ${Math.hypot(input.current.x,input.current.y)>.1?'topdown-moving':''} ${caught ? 'topdown-caught' : ''}`}>
      <RobloxFirstPerson player={player} owner={owner} look={look} unlocked={unlocked}
        portalOpen={portalOpen} enemyTheme={enemyTheme} walls={visibleWalls} wallColor={wallColor}
        onLook={(next) => { lookRef.current = next; setLook(next); }} />
      <div className={`enemy-name enemy-${enemyTheme.id}`}>
        КОМНАТА {room} · <b>{enemyTheme.name}</b>
      </div>
      <PuzzleMapOverlay solved={solved} total={total} />
      <div className={`portal-compass ${portalOpen ? 'portal-ready' : ''}`}>
        <div className="portal-arrow" style={{ transform: `rotate(${portalAngle}deg)` }} />
        <i style={{ transform: `rotate(${portalAngle}deg)` }}>▲</i>
        <span>{portalOpen ? 'ПОРТАЛ' : allPuzzlesSolved ? 'ДВЕРЬ ДЛЯ ВЗЛОМА' : `ГОЛОВОЛОМКИ ${solved}/${total}`} · {Math.round(portalDistance)} м</span>
      </div>
      {portalDistance < 13 && allPuzzlesSolved && !portalOpen && <div className="hack-prompt"><kbd>E</kbd> ВЗЛОМАТЬ ДВЕРЬ</div>}
      {portalDistance < 13 && !allPuzzlesSolved && <div className="hack-prompt">ОТКРЫВАЮ ГОЛОВОЛОМКУ {solved + 1} / {total}</div>}
      <div className="topdown-world" style={{ transform: `translate(${camera.x}%,${camera.y}%)` }}>
        {rooms.map((room) => (
          <div key={room.name} className={`maze-room room-${room.kind}`} style={{
            left:`${room.x/2}%`,top:`${room.y/2}%`,width:`${room.width/2}%`,height:`${room.height/2}%`,
          }}><span>{room.name}</span></div>
        ))}
        {walls.map((wall, index) => <i key={index} className="top-wall" style={{ left:`${wall.x/2}%`,top:`${wall.y/2}%`,width:`${wall.width/2}%`,height:`${wall.height/2}%` }} />)}
        {doors.map((door, index) => (
          <div key={index}>
            {index >= unlocked && <i className="locked-zone-line" style={{ left:`${(door.x + door.width / 2) / 2}%` }} />}
            <b className={`top-door ${index < unlocked ? 'open' : 'locked'}`}
              style={{ left:`${door.x/2}%`,top:`${door.y/2}%`,width:`${door.width/2}%`,height:`${door.height/2}%` }}>
              {index < unlocked ? '✓' : '🔒'}
            </b>
          </div>
        ))}
        <div className="top-player" style={{ left:`${px}%`,top:`${py}%` }}><span>🥷</span><i /></div>
        <div className="top-owner" style={{ left:`${owner.x/2}%`,top:`${owner.y/2}%` }}><span>😡</span><b>{chaseCountdown > 0 ? `СТАРТ ${chaseCountdown}` : 'ХОЗЯИН'}</b></div>
      </div>
      <div className="top-hud">КОМНАТА · {Math.round(player.x)}:{Math.round(player.y)}<span>ЭНЕРГИЯ {Math.round(stamina)}%</span></div>
      {chaseCountdown > 0 && <div className="chase-countdown">ФОРА <b>{chaseCountdown}</b></div>}
      <div className="top-stamina"><i style={{width:`${stamina}%`}} /></div>
      <div className={`sprint-hud ${isExhausted ? 'sprint-exhausted' : ''}`}>
        <span>{isExhausted ? 'НЕТ СИЛ' : 'СПРИНТ [Q]'}</span>
        <b>{Math.round(stamina)} / 100</b>
        <i><em style={{ width: `${stamina}%` }} /></i>
      </div>
      <button
        type="button"
        className="sprint-button"
        disabled={isExhausted}
        onPointerDown={() => { sprint.current = true; }}
        onPointerUp={() => { sprint.current = false; }}
        onPointerCancel={() => { sprint.current = false; }}
        onPointerLeave={() => { sprint.current = false; }}
      >
        БЕГ
      </button>
      {hackOpen && (
        <PipeHack
          onClose={() => setHackOpen(false)}
          onSolved={() => {
            portalOpenRef.current = true;
            setPortalOpen(true);
            setHackOpen(false);
          }}
        />
      )}
      <div className="walk-joystick" onPointerDown={(e)=>{e.currentTarget.setPointerCapture(e.pointerId);drag(e)}} onPointerMove={(e)=>e.currentTarget.hasPointerCapture(e.pointerId)&&drag(e)} onPointerUp={release} onPointerCancel={release}><span style={{transform:`translate(${stick.x}px,${stick.y}px)`}} /></div>
      {caught && <div className="caught-overlay"><b>ТЕБЯ ПОЙМАЛИ</b></div>}
    </div>
  );
}
