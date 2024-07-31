import Move from '../Move';
import Slot from '../Slot';

describe('Move', () => {
  it('should create a Move class with passed parameters', () => {
    const myMove = new Move(new Slot(3, 3, 'filled'), new Slot(1, 3, 'empty'), new Slot(2, 3, 'filled'));
    expect(myMove).toBeInstanceOf(Move);
    expect(myMove).toHaveProperty('sourceSlot');
    expect(myMove).toHaveProperty('destinationSlot');
    expect(myMove).toHaveProperty('middleSlot');
  });

  it('should apply move correctly', () => {
    const myMove = new Move(new Slot(3, 3, 'filled'), new Slot(1, 3, 'empty'), new Slot(2, 3, 'filled'));
    expect(myMove.sourceSlot).toHaveProperty('state', 'filled');
    expect(myMove.destinationSlot).toHaveProperty('state', 'empty');
    expect(myMove.middleSlot).toHaveProperty('state', 'filled');

    // apply and check new slots states
    myMove.apply();
    expect(myMove.sourceSlot).toHaveProperty('state', 'empty');
    expect(myMove.destinationSlot).toHaveProperty('state', 'filled');
    expect(myMove.middleSlot).toHaveProperty('state', 'empty');
  });
});
