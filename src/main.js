import Alpine from 'alpinejs';
import clsx from 'clsx';

import './index.css';

import Board from './domain/Board';

// initialize reactive data
Alpine.data('game', () => ({
  // initialize board
  board: new Board(),

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
    if (slot.state === 'none') {
      return;
    }

    // if there are any currently possible moves available, check for the one
    // that corresponds to the clicked slot, and apply it
    if (this.board.hasCurrentMoves()) {
      const currentMove = this.board.getCurrentMoveTo(slot);
      if (currentMove) {
        console.log('apply move!');
        this.board.applyCurrentMove(currentMove);

        // toggle off all current middle and destination moves
        this.board.toggleCurrentMovesMiddle(false);
        this.board.toggleCurrentMovesDestination(false);

        // important: remove all current moves after applying the move,
        // so that player can play a new move
        this.board.flushCurrentMoves();

        // check all available moves for every filled slot
        const availableMoves = this.board.getAvailableMoves();
        console.log('availableMoves:', availableMoves);

        if (availableMoves.length === 0) {
          // if only one filled slot is left, game is won!
          const filledSlots = this.board.getFilledSlots();
          console.log('filledSlots:', filledSlots);
          // @todo check also for two or three filled slots left, as a consolation prize...
          if (filledSlots.size === 1) {
            // check if left slot is in the center of the grid for ULTIMATE PRIZE
            console.log('you win!');
          } else {
            // ...otherwise, game is over
            console.log('no more moves available...!');
          }
        }
      } else {
        // @todo handle error
        // setMoveError(true);
        console.log('reset...');
      }

      // early break
      return;
    }

    // start a move from filled slots only!
    if (slot.state === 'filled') {
      // set current possible moves for selected slot
      this.board.setCurrentMoves(slot);

      if (this.board.hasCurrentMoves()) {
        // toggle on current middle and destination moves
        // these will serve as a visual hint
        this.board.toggleCurrentMovesMiddle(true);
        this.board.toggleCurrentMovesDestination(true);
      } else {
        console.log('no available moves from there...!');
        // @todo handle error
        // setMoveError(true);
      }

      // early break
      return;
    }

    console.log('cannot move from there...');
    // @todo handle error
    // setMoveError(true);
  },
}));

// kickstart the Alpine app
Alpine.start();
