interface CoinAmountProps { amount: number; }

export const COIN_IMAGE_URL = 'https://img.freepik.com/free-vector/video-game-coin_24877-82674.jpg?semt=ais_hybrid&w=740';

export function CoinAmount({ amount }: CoinAmountProps) {
  return <span className="coin-amount"><img src={COIN_IMAGE_URL} alt="Монеты" />{amount.toLocaleString('ru-RU')}</span>;
}
