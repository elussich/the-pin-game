import Board from './Board';
import GameEventManager from './GameEventManager';
import Slot from './Slot';

export default class Game {
  board: Board;
  notifier: GameEventManager;

  constructor() {
    this.board = new Board();
    this.notifier = new GameEventManager();
  }

  onMoveError(callback: (...args: any[]) => void) {
    this.notifier.on('MOVE_ERROR', callback);
  }

  onMovesUnavailable(callback: (...args: any[]) => void) {
    this.notifier.on('NO_MOVES', callback);
  }

  onUserLost(callback: (...args: any[]) => void) {
    this.notifier.on('USER_LOST', callback);
  }

  onUserWon(callback: (...args: any[]) => void) {
    this.notifier.on('USER_WON', callback);
  }

  onSlotClick(slot: Slot) {
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
            this.notifier.emit('USER_WON');
          } else {
            // ...otherwise, game is over
            console.log('no more moves available...!');
            this.notifier.emit('USER_LOST');
          }
        }
      } else {
        // @todo handle error
        // setMoveError(true);
        console.log('reset...');
        this.notifier.emit('MOVE_ERROR');
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
        this.notifier.emit('NO_MOVES');
      }

      // early break
      return;
    }

    console.log('cannot move from there...');
    // @todo handle error
    // setMoveError(true);
    this.notifier.emit('MOVE_ERROR');
  }
}