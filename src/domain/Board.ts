import Move from './Move';
import Moves from './Moves';
import Slot from './Slot';

export default class Board {
  public grid: Array<Slot[]> = [];
  private currentMoves = new Moves();
  private filledSlots: Set<Slot> = new Set();

  constructor() {
    this.create();

    // @todo wonder if filled slot tracking can be done along grid creation
    this.grid.forEach(row => {
      row.forEach(slot => {
        if (slot.state === 'filled') {
          this.filledSlots.add(slot);
        }
      });
    });
  }

  private create() {
    this.grid[0] = [
      new Slot(0, 0, 'none'),
      new Slot(1, 0, 'none'),
      new Slot(2, 0, 'filled'),
      new Slot(3, 0, 'filled'),
      new Slot(4, 0, 'filled'),
      new Slot(5, 0, 'none'),
      new Slot(6, 0, 'none'),
    ];
    this.grid[1] = [
      new Slot(0, 1, 'none'),
      new Slot(1, 1, 'none'),
      new Slot(2, 1, 'filled'),
      new Slot(3, 1, 'filled'),
      new Slot(4, 1, 'filled'),
      new Slot(5, 1, 'none'),
      new Slot(6, 1, 'none'),
    ];
    this.grid[2] = [
      new Slot(0, 2, 'filled'),
      new Slot(1, 2, 'filled'),
      new Slot(2, 2, 'filled'),
      new Slot(3, 2, 'filled'),
      new Slot(4, 2, 'filled'),
      new Slot(5, 2, 'filled'),
      new Slot(6, 2, 'filled'),
    ];
    this.grid[3] = [
      new Slot(0, 3, 'filled'),
      new Slot(1, 3, 'filled'),
      new Slot(2, 3, 'filled'),
      new Slot(3, 3, 'empty'),
      new Slot(4, 3, 'filled'),
      new Slot(5, 3, 'filled'),
      new Slot(6, 3, 'filled'),
    ];
    this.grid[4] = [
      new Slot(0, 4, 'filled'),
      new Slot(1, 4, 'filled'),
      new Slot(2, 4, 'filled'),
      new Slot(3, 4, 'filled'),
      new Slot(4, 4, 'filled'),
      new Slot(5, 4, 'filled'),
      new Slot(6, 4, 'filled'),
    ];
    this.grid[5] = [
      new Slot(0, 5, 'none'),
      new Slot(1, 5, 'none'),
      new Slot(2, 5, 'filled'),
      new Slot(3, 5, 'filled'),
      new Slot(4, 5, 'filled'),
      new Slot(5, 5, 'none'),
      new Slot(6, 5, 'none'),
    ];
    this.grid[6] = [
      new Slot(0, 6, 'none'),
      new Slot(1, 6, 'none'),
      new Slot(2, 6, 'filled'),
      new Slot(3, 6, 'filled'),
      new Slot(4, 6, 'filled'),
      new Slot(5, 6, 'none'),
      new Slot(6, 6, 'none'),
    ];
  }

  /**
   * @todo Move to a separate class maybe?
   */
  private slotLocator: Record<string, (slot: Slot) => Slot | undefined> = {
    left: ((slot: Slot) => this.grid[slot.y][slot.x - 1]).bind(this),
    right: ((slot: Slot) => this.grid[slot.y][slot.x + 1]).bind(this),
    up: ((slot: Slot) => this.grid[slot.y - 1]?.[slot.x]).bind(this),
    down: ((slot: Slot) => this.grid[slot.y + 1]?.[slot.x]).bind(this),
  };

  /**
   * Loops through four directions to find a possible move;
   * if move is possible, it is added to the internal moves array.
   * 
   * @param {Slot} slot - The slot to find possible moves from.
   */
  public setCurrentMoves(slot: Slot): void {
    Object.keys(this.slotLocator).forEach((direction: string) => {
      const newMove = this.getMove(slot, direction);
      if (newMove) {
        this.currentMoves.add(newMove);
      }
    });
  }

  /**
   * Gets possible move from passed slot and desired direction.
   * If no move is possible, returns `null`.
   * 
   * @param {Slot} slot - The slot to find possible move from. 
   * @param {string} direction - The direction of the possible move.
   * @returns {Move | null} - Returns the possible move, or null if none.
   */
  private getMove(slot: Slot, direction: string): Move | null {
    // get potential slot to be removed, immediately next to the passed slot
    const slotToBeRemoved = this.slotLocator[direction](slot);
    if (slotToBeRemoved?.state === 'filled') {
      // get potential slot to be replaced, one slot away from the passed slot
      const slotToBeReplaced = this.slotLocator[direction](slotToBeRemoved);
      if (slotToBeReplaced?.state === 'empty') {
        // return new move
        return new Move(slot, slotToBeReplaced, slotToBeRemoved);
      }
    }
    return null;
  }

  public hasCurrentMoves(): boolean {
    return !this.currentMoves.isEmpty()
  }

  public toggleCurrentMovesDestination(isMoveDestination: boolean) {
    return this.currentMoves.toggleMovesDestination(isMoveDestination);
  }

  public flushCurrentMoves() {
    this.currentMoves.flush();
  }

  public getCurrentMoveTo(slot: Slot): Move | undefined {
    return this.currentMoves.getMoveTo(slot);
  }

  /**
   * Applies passed current move, and also updates filled slots set by adding
   * the destination slot (which becomes filled), and removing the source slot
   * and the in-between slot (which were formerly filled).
   * 
   * @param {Move} currentMove - Move to be applied 
   */
  public applyCurrentMove(currentMove: Move) {
    currentMove.apply();
    this.filledSlots.add(currentMove.destinationSlot);
    this.filledSlots.delete(currentMove.sourceSlot);
    this.filledSlots.delete(currentMove.middleSlot);
  }

  /**
   * Loops through all filled slots to check if they have any moves available.
   * Returns an array of moves.
   * 
   * @todo Do we really need to store moves, or can we just count them?
   * @returns {Array} - Array of available moves.
   */
  public getAvailableMoves(): Move[] {
    const availableMoves: Move[] = [];
    this.filledSlots.forEach((slot: Slot) => {
      Object.keys(this.slotLocator).forEach((direction: string) => {
        const newMove = this.getMove(slot, direction);
        if (newMove) {
          availableMoves.push(newMove);
        }
      });
    });
    return availableMoves;
  }

  public getFilledSlots(): Set<Slot> {
    return this.filledSlots;
  }

  public print() {
    console.log(this.grid);
    let output = ``;
    this.grid.forEach((row) => {
      row.forEach((slot) => {
        let stateToString = '  ';
        if (slot.state === 'empty') {
          stateToString = 'o ';
        }
        if (slot.state === 'filled') {
          stateToString = 'x ';
        }
        return (output += `${stateToString}`);
      });
      output += `\n`;
    });
    console.log(output);
  }
}
