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

  public getSelectedMove(slot: Slot): Move | undefined {
    return this.moves.find((move: Move | undefined) => {
      return move?.slotDest === slot;
    });
  }

  public toggle(visible: boolean) {
    this.moves.forEach((move: Move) => {
      move.slotDest.canReceive = visible;
    });
  }
}
