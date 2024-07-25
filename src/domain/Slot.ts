type SlotState = 'empty' | 'filled' | 'none';

export default class Slot {
  public x: number;
  public y: number;
  public state: SlotState = 'none';
  public canReceive: boolean = false;

  constructor(x: number, y: number, state: SlotState) {
    this.x = x;
    this.y = y;
    this.state = state;
  }
}
