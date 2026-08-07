import { useState } from 'react';
import { Link } from 'wouter';
import { CoinAmount } from '../components/CoinAmount';
import { PlayerModel3D } from '../components/PlayerModel3D';
import { skins } from '../lib/game';
import { loadBalance } from '../lib/wallet';

const SKIN_PRICE = 10_000;
const readOwned = () => JSON.parse(localStorage.getItem('shadow-skins') ?? '[0]') as number[];

export function ShopPage() {
  const [balance, setBalance] = useState(loadBalance);
  const [owned, setOwned] = useState(readOwned);
  const [selected, setSelected] = useState(() => Number(localStorage.getItem('shadow-selected-skin') ?? 0));

  function buySkin(index: number) {
    if (owned.includes(index) || balance < SKIN_PRICE) return;
    const nextBalance = balance - SKIN_PRICE;
    const nextOwned = [...owned, index];
    localStorage.setItem('shadow-loot', String(nextBalance));
    localStorage.setItem('shadow-skins', JSON.stringify(nextOwned));
    setBalance(nextBalance);
    setOwned(nextOwned);
  }

  function selectSkin(index: number) {
    if (!owned.includes(index)) return;
    localStorage.setItem('shadow-selected-skin', String(index));
    setSelected(index);
  }

  return (
    <main className="shop-page">
      <header className="shop-header">
        <Link href="/" className="shop-back">← НАЗАД</Link>
        <h1>МАГАЗИН СКИНОВ</h1>
        <CoinAmount amount={balance} />
      </header>
      <section className="shop-grid">
        {skins.map((skin, index) => {
          const isOwned = owned.includes(index);
          const isSelected = selected === index;
          return (
            <article className={`shop-card ${isSelected ? 'selected' : ''}`} key={skin.name}>
              <div className="shop-skin-icon"><PlayerModel3D skinId={index} /></div>
              <small>{skin.rarity}</small><h2>{skin.name}</h2>
              {index === 0 ? <span className="starter-skin">СТАРТОВЫЙ</span> : <CoinAmount amount={SKIN_PRICE} />}
              <button type="button" disabled={!isOwned && balance < SKIN_PRICE}
                onClick={() => isOwned ? selectSkin(index) : buySkin(index)}>
                {isSelected ? 'ВЫБРАН' : isOwned ? 'ВЫБРАТЬ' : 'КУПИТЬ'}
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
