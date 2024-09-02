export type GameEvent = 'MOVE_ERROR' | 'NO_MOVES' | 'USER_LOST' | 'USER_WON';

export default class GameEventManager {
  eventMap: Record<GameEvent, Set<(...args: any[]) => void>>;

  constructor() {
    this.eventMap = {} as Record<GameEvent, Set<(...args: any[]) => void>>;
  }

  on(event: GameEvent, callback: (...args: any[]) => void) {
    if (!this.eventMap[event]) {
      this.eventMap[event] = new Set();
    }

    this.eventMap[event].add(callback);
  }

  off(event: GameEvent, callback: (...args: any[]) => void) {
    if (!this.eventMap[event]) {
      return;
    }

    this.eventMap[event].delete(callback);
  }

  emit(event: GameEvent, ...args: any[]) {
    if (!this.eventMap[event]) {
      return;
    }

    this.eventMap[event].forEach((cb: any) => cb(...args));
  }
}