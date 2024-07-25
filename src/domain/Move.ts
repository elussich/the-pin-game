import Slot from './Slot';

export default class Move {
  public slotSrc: Slot;
  public slotDest: Slot;
  public slotToRemove: Slot;

  constructor(slotSource: Slot, slotDest: Slot, slotToRemove: Slot) {
    this.slotSrc = slotSource;
    this.slotDest = slotDest;
    this.slotToRemove = slotToRemove;
  }

  /**
   * Apply move by setting the source slot and the middle slot as empty,
   * and the destination slot as filled.
   */
  public apply() {
    this.slotDest.state = 'filled';
    this.slotSrc.state = 'empty';
    this.slotToRemove.state = 'empty';
  }
}
