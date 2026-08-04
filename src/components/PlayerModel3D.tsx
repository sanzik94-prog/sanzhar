function ModelPart({ className }: { className: string }) {
  return (
    <div className={`model-part ${className}`}>
      <i className="face front" /><i className="face back" />
      <i className="face left" /><i className="face right" />
      <i className="face top" /><i className="face bottom" />
    </div>
  );
}

export function PlayerModel3D() {
  const selectedSkin = Number(localStorage.getItem('shadow-selected-skin') ?? 0);
  const emblems: Record<number, string> = {
    1: '🦇', 2: '🕷', 3: '◉', 4: '◈', 5: '★', 6: '⚡', 8: '⌁', 9: '➶',
    10: '◢', 11: '◎', 12: '●', 13: '⬡', 14: '★', 15: '◉', 16: '♜', 17: '◆', 18: '♢',
  };
  const hasCape = [1, 6, 11, 19].includes(selectedSkin);
  const hasHeadDecor = [1, 4, 5, 6, 10, 12, 13, 15, 16, 17, 18].includes(selectedSkin);
  const skinClass = selectedSkin === 19 ? 'moon-knight-skin' : `skin-color-${selectedSkin % 5}`;
  return (
    <div className={`player-model-3d ${skinClass} skin-id-${selectedSkin}`} aria-label="3D-модель игрока">
      <div className="model-rig">
        {hasCape && <div className={selectedSkin === 19 ? 'moon-cape' : 'skin-cape'} />}
        <ModelPart className="model-head" />
        <div className="model-face">
          <i className="face-eye face-eye-left" />
          <i className="face-eye face-eye-right" />
          <b className="face-brow face-brow-left" />
          <b className="face-brow face-brow-right" />
          <span className="face-mouth" />
        </div>
        {selectedSkin === 19 && <><div className="moon-hood" /><div className="moon-crescent">☾</div></>}
        {hasHeadDecor && <div className="skin-head-decor"><i /><i /></div>}
        {emblems[selectedSkin] && <div className="skin-emblem">{emblems[selectedSkin]}</div>}
        {selectedSkin === 13 && <div className="skin-wings"><i /><i /></div>}
        <ModelPart className="model-body" />
        <ModelPart className="model-arm model-arm-left" />
        <ModelPart className="model-arm model-arm-right" />
        <ModelPart className="model-leg model-leg-left" />
        <ModelPart className="model-leg model-leg-right" />
        <div className="model-shoulders"><i /><i /></div>
        <div className="model-belt"><i /><i /><b /></div>
        <div className="model-gloves"><i /><i /></div>
        <div className="model-boots"><i /><i /></div>
        <div className="model-back-badge">{emblems[selectedSkin] ?? '◆'}</div>
      </div>
    </div>
  );
}
