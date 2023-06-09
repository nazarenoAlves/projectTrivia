import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Games from './pages/games';
import Settings from './pages/settings';
import Feedback from './pages/Feedback';
import Ranking from './pages/Ranking';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route path="/games" component={ Games } />
      <Route path="/settings" component={ Settings } />
      <Route path="/feedback" component={ Feedback } />
      <Route path="/ranking" component={ Ranking } />
    </Switch>
  );
}
