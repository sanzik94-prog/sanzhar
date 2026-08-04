import { Link } from 'wouter';
import { CoinAmount } from '../components/CoinAmount';
import { skins } from '../lib/game';
import { loadBalance } from '../lib/wallet';

export function HomePage() {
  const room = Number(localStorage.getItem('shadow-room') ?? 1);
  const loot = loadBalance();
  const owned = JSON.parse(localStorage.getItem('shadow-skins') ?? '[0]') as number[];

  return (
    <main className="home-page">
      <div className="home-shade" />
      <header className="menu-header">
        <div className="brand"><span className="brand-mark">S</span><b>SHADOW<br />HEIST</b></div>
        <div className="menu-stats">
          <span>ЛУЧШАЯ КОМНАТА <b>{room}</b></span>
          <span>МОНЕТЫ <b><CoinAmount amount={loot} /></b></span>
        </div>
      </header>
      <section className="hero-copy">
        <span className="eyebrow">СТЕЛС · ГОЛОВОЛОМКИ · 100 КОМНАТ</span>
        <h1>УСПЕЙ ДО<br /><em>ВОЗВРАЩЕНИЯ</em></h1>
        <p>Взламывай замки, убегай от босса и зарабатывай монеты для новых скинов.</p>
        <Link href="/game" className="play-button"><span>▶</span><div><small>ПРОДОЛЖИТЬ ОГРАБЛЕНИЕ</small><b>КОМНАТА {room}</b></div><i>→</i></Link>
        <Link href="/shop" className="shop-link">🛒 МАГАЗИН СКИНОВ</Link>
      </section>
      <section className="collection-preview">
        <div><span className="eyebrow">КОЛЛЕКЦИЯ</span><b>{owned.length} / {skins.length}</b></div>
        <div className="skin-row">{owned.slice(-5).map((id) => <span key={id}>{skins[id]?.icon}</span>)}</div>
      </section>
    </main>
  );
}
