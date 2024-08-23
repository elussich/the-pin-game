import Board from './Board';
import Slot from './Slot';

export default class Game {
  board: Board;

  constructor() {
    this.board = new Board();
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
  }
}