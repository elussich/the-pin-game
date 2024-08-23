import Alpine from 'alpinejs';
import clsx from 'clsx';

import './index.css';

import Game from './domain/Game';

const game = new Game();

// initialize reactive data
Alpine.data('game', () => ({
  init: () => {
    game.onMoveError(() => {
      console.log('GameEvent MOVE_ERROR');
    });
    game.onMovesUnavailable(() => {
      console.log('GameEvent NO_MOVES');
    });
  },

  // initialize game
  game,

  // assign classes to slot element based on its state
  getSlotClasses: (slot) => clsx(
    {
      'absolute w-7 h-7 sm:w-10 sm:h-10 m-[0.625rem] sm:m-3 rounded-full border border-orange-400':
        slot.state !== 'none',
    },
    {
      '!border-orange-300 shadow-inner-lg shadow-yellow-500':
        slot.state === 'empty',
    },
    {
      'bg-orange-300 shadow-md shadow-yellow-500 hover:sm:bg-orange-400 cursor-pointer':
        slot.state === 'filled',
    },
    {
      'opacity-50': slot.isMoveMiddle,
    },
    {
      '!bg-emerald-100 cursor-pointer': slot.isMoveDestination,
    }
  ),

  // handle slot click
  onSlotClick(slot) {
    this.game.onSlotClick(slot);
  },
}));

// kickstart the Alpine app
Alpine.start();
