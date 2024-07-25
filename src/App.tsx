import { useState } from 'react';
import clsx from 'clsx';

import Board from './domain/Board';
import Slot from './domain/Slot';

function App() {
  const [board] = useState(new Board());

  const [, setTick] = useState<{}>();

  const [canMove, setCanMove] = useState<boolean>(true);

  const onSlotClick = (slot: Slot) => () => {
    // if there are any currently possible moves available, check for the one
    // that corresponds to the clicked slot, and apply it
    if (!board.moves.isEmpty()) {
      const selectedMove = board.moves.getSelectedMove(slot);
      if (selectedMove) {
        console.log('apply move!');
        selectedMove.apply();
      } else {
        setCanMove(false);
        setTimeout(() => {
          setCanMove(true);
        }, 300);
        console.log('reset...');
      }

      // hide all moves
      board.moves.toggle(false);

      // remove all available moves
      board.moves.flush();

      // global moves check
      const adjacentFilledSlots = board.adjacentFilledSlots;
      console.log('adjacentFilledSlots:', adjacentFilledSlots);

      if (adjacentFilledSlots === 0) {
        // if only one filled slot is left, game is won!
        if (board.getFilledSlots().length === 1) {
          console.log('you win!');
        }

        // ...otherwise, game is over
        console.log('no more moves available...!');
      }

      // render tick
      setTick({});
      return;
    }

    // only start a move from filled slots
    if (slot.state === 'filled') {
      // update possible moves from selected slot
      board.updateMoves(slot);

      if (board.moves.isEmpty()) {
        console.log('no available moves from there...!');
        setCanMove(false);
        setTimeout(() => {
          setCanMove(true);
        }, 300);
      }

      // show available moves
      board.moves.toggle(true);

      // global moves check
      const adjacentFilledSlots = board.adjacentFilledSlots;
      console.log('adjacentFilledSlots:', adjacentFilledSlots);

      // render tick
      setTick({});
      return;
    }

    console.log('cannot move from there...');
    setCanMove(false);
    setTimeout(() => {
      setCanMove(true);
    }, 300);
  };

  return (
    <div
      className={clsx(
        'w-fit m-8 p-4 bg-amber-100 shadow-lg rounded-lg border border-orange-200',
        {
          'animate-shake': !canMove,
        }
      )}
    >
      {board.grid.map((row, index) => (
        <div className="flex" key={`${index}`}>
          {row.map((slot) => (
            <div
              className="relative w-16 h-16"
              key={`${slot.x}-${slot.y}`}
              onClick={onSlotClick(slot)}
            >
              <span
                className={clsx(
                  {
                    'absolute w-10 h-10 m-3 rounded-full border border-orange-400':
                      slot.state !== 'none',
                  },
                  {
                    '!border-orange-300 shadow-inner-lg shadow-yellow-500':
                      slot.state === 'empty',
                  },
                  {
                    'bg-orange-300 shadow-md shadow-yellow-500 hover:bg-orange-400 cursor-pointer':
                      slot.state === 'filled',
                  },
                  {
                    '!bg-emerald-100 cursor-pointer': slot.canReceive,
                  }
                )}
              ></span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
