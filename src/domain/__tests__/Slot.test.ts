import Slot from '../Slot';

describe('Slot', () => {
  it('should create a `Slot` instance with corresponding properties', () => {
    const slot = new Slot(1, 2, 'filled');
    expect(slot).toBeInstanceOf(Slot);
    expect(slot.x).toBe(1);
    expect(slot.y).toBe(2);
    expect(slot.state).toBe('filled');
  });
});
