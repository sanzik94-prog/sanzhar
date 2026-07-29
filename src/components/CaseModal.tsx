import type { Skin } from '../lib/game';

interface CaseModalProps {
  skin: Skin;
  isNew: boolean;
  onClose: () => void;
}

export function CaseModal({ skin, isNew, onClose }: CaseModalProps) {
  return (
    <div className="modal-backdrop">
      <section className="case-modal">
        <span className="eyebrow">НАГРАДА ЗА 5 КОМНАТ</span>
        <div className="case-glow">{skin.icon}</div>
        <h2>{isNew ? 'НОВЫЙ СКИН!' : 'СКИН УЖЕ ЕСТЬ'}</h2>
        <h3>{skin.name}</h3>
        <p>{skin.rarity} · добавлен в коллекцию</p>
        <button className="primary-button" onClick={onClose}>ЗАБРАТЬ</button>
      </section>
    </div>
  );
}
