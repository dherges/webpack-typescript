import { Timer } from './app/timer';

const bootstrap = () => {
  let rootElement = document.getElementsByName('moment').item(0);

  new Timer(rootElement).init();
}

bootstrap(); // <-- starts our super-cool application

import './app/rxjs-sample'; // <-- spawns the rxjs demo
