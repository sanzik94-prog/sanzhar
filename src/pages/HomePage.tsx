import { Link } from 'wouter';
import { skins } from '../lib/game';

export function HomePage() {
  const room = Number(localStorage.getItem('shadow-room') ?? 1);
  const loot = Number(localStorage.getItem('shadow-loot') ?? 0);
  const owned = JSON.parse(localStorage.getItem('shadow-skins') ?? '[0]') as number[];

  return (
    <main className="home-page">
      <div className="home-shade" />
      <header className="menu-header">
        <div className="brand"><span className="brand-mark">S</span><b>SHADOW<br />HEIST</b></div>
        <div className="menu-stats"><span>ЛУЧШАЯ КОМНАТА <b>{room}</b></span><span>ДОБЫЧА <b>₸ {loot.toLocaleString('ru-RU')}</b></span></div>
      </header>
      <section className="hero-copy">
        <span className="eyebrow">СТЕЛС · ГОЛОВОЛОМКИ · 100 КОМНАТ</span>
        <h1>УСПЕЙ ДО<br /><em>ВОЗВРАЩЕНИЯ</em></h1>
        <p>Взламывай замки, отключай сигнализацию и забирай добычу. С каждой комнатой времени больше — но загадок тоже.</p>
        <Link href="/game" className="play-button"><span>▶</span><div><small>ПРОДОЛЖИТЬ ОГРАБЛЕНИЕ</small><b>КОМНАТА {room}</b></div><i>→</i></Link>
        <div className="menu-note">Каждые 5 комнат — кейс с новым скином</div>
      </section>
      <section className="collection-preview">
        <div><span className="eyebrow">КОЛЛЕКЦИЯ</span><b>{owned.length} / {skins.length}</b></div>
        <div className="skin-row">{owned.slice(-5).map((id) => <span key={id}>{skins[id]?.icon}</span>)}</div>
      </section>
    </main>
  );
}
