import Move from './Move';
import Slot from './Slot';

export default class Moves {
  private moves: Move[] = [];

  public add(move: Move) {
    this.moves.push(move);
  }

  public flush() {
    this.moves = [];
  }

  public isEmpty(): boolean {
    return this.moves.length === 0;
  }

  /**
   * Finds move within internal moves array which corresponds to the specified
   * destination slot.
   * 
   * Returns `undefined` if no move is found.
   * 
   * @param slot 
   * @returns 
   */
  public getMoveTo(slot: Slot): Move | undefined {
    return this.moves.find((move: Move | undefined) => {
      return move?.destinationSlot === slot;
    });
  }

  /**
   * Toggles `isMoveDestination` flag for every destination slot.
   * 
   * @param {boolean} isMoveDestination - Flag to be toggled.
   */
  public toggleMovesDestination(isMoveDestination: boolean) {
    this.moves.forEach((move: Move) => {
      move.destinationSlot.isMoveDestination = isMoveDestination;
    });
  }
}
