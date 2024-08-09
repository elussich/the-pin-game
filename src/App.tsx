import { useEffect, useState } from 'react';
import clsx from 'clsx';

import Board from './domain/Board';
import Slot from './domain/Slot';

const SHAKE_ANIMATION_DURATION = 300;

function App() {
  const [board] = useState(new Board());

  const [, setTick] = useState<{}>();

  const [moveError, setMoveError] = useState<boolean>(false);

  useEffect(() => {
    if (moveError) {
      const timeoutId = setTimeout(() => {
        setMoveError(false)
      }, SHAKE_ANIMATION_DURATION);

      return () => clearTimeout(timeoutId);
    }
  }, [moveError]);

  const onSlotClick = (slot: Slot) => () => {
    if (slot.state === 'none') {
      return;
    }

    // if there are any currently possible moves available, check for the one
    // that corresponds to the clicked slot, and apply it
    if (board.hasCurrentMoves()) {
      const currentMove = board.getCurrentMoveTo(slot);
      if (currentMove) {
        console.log('apply move!');
        board.applyCurrentMove(currentMove);

        // toggle off all current middle and destination moves
        board.toggleCurrentMovesMiddle(false);
        board.toggleCurrentMovesDestination(false);

        // important: remove all current moves after applying the move,
        // so that player can play a new move
        board.flushCurrentMoves();

        // check all available moves for every filled slot
        const availableMoves = board.getAvailableMoves();
        console.log('availableMoves:', availableMoves);

        if (availableMoves.length === 0) {
          // if only one filled slot is left, game is won!
          const filledSlots = board.getFilledSlots();
          console.log('filledSlots:', filledSlots);
          // @todo check also for two or three filled slots left, as a consolation prize...
          if (filledSlots.size === 1) {
            // check if left slot is in the center of the grid for ULTIMATE PRIZE
            console.log('you win!');
          } else {
            // ...otherwise, game is over
            console.log('no more moves available...!');
          }
        }
      } else {
        setMoveError(true);
        console.log('reset...');
      }

      // render tick
      setTick({});
      return;
    }

    // start a move from filled slots only!
    if (slot.state === 'filled') {
      // set current possible moves for selected slot
      board.setCurrentMoves(slot);

      if (board.hasCurrentMoves()) {
        // toggle on current middle and destination moves
        // these will serve as a visual hint
        board.toggleCurrentMovesMiddle(true);
        board.toggleCurrentMovesDestination(true);
      } else {
        console.log('no available moves from there...!');
        setMoveError(true);
      }

      // render tick
      setTick({});
      return;
    }

    console.log('cannot move from there...');
    setMoveError(true);
  };

  return (
    <>
      <header className="mt-4">
        <h1 className='text-center text-3xl font-semibold text-slate-600 mb-2'>The Pin Game</h1>
        <h2 className='text-center text-xl text-slate-600'>Only one pin can survive!</h2>
      </header>
      <div
        className={clsx(
          'mx-auto w-fit m-8 p-3 sm:p-4 bg-amber-100 shadow-lg rounded-lg border border-orange-200',
          {
            'animate-shake': moveError,
          }
        )}
      >
        {board.grid.map((row, index) => (
          <div className="flex" key={`${index}`}>
            {row.map((slot) => (
              <div
                className="relative w-12 h-12 sm:w-16 sm:h-16"
                key={`${slot.x}-${slot.y}`}
                onClick={onSlotClick(slot)}
              >
                <span
                  className={clsx(
                    {
                      'absolute w-7 h-7 sm:w-10 sm:h-10 m-[0.625rem] sm:m-3 rounded-full border border-orange-400':
                        slot.state !== 'none',
                    },
                    {
                      '!border-orange-300 shadow-inner-lg shadow-yellow-500':
                        slot.state === 'empty',
                    },
                    {
                      'bg-orange-300 shadow-md shadow-yellow-500 hover:sm:bg-orange-400 cursor-pointer':
                        slot.state === 'filled',
                    },
                    {
                      'opacity-50': slot.isMoveMiddle,
                    },
                    {
                      '!bg-emerald-100 cursor-pointer': slot.isMoveDestination,
                    }
                  )}
                ></span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
