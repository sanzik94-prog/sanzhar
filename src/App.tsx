import { Route, Switch } from 'wouter';
import { GamePage } from './pages/GamePage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ShopPage } from './pages/ShopPage';
import './game.css';
import './backrooms-details.css';
import './pipe-hack.css';
import './player-skins.css';

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/game" component={GamePage} />
      <Route path="/shop" component={ShopPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}
