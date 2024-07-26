import Slot from './Slot';

export default class Move {
  public sourceSlot: Slot;
  public destinationSlot: Slot;
  public middleSlot: Slot;

  constructor(sourceSlot: Slot, destinationSlot: Slot, middleSlot: Slot) {
    this.sourceSlot = sourceSlot;
    this.destinationSlot = destinationSlot;
    this.middleSlot = middleSlot;
  }

  /**
   * Apply move by setting the source slot and the middle slot as empty,
   * and the destination slot as filled.
   */
  public apply() {
    this.destinationSlot.state = 'filled';
    this.sourceSlot.state = 'empty';
    this.middleSlot.state = 'empty';
  }
}
