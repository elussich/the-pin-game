import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import Game from './domain/Game';
import Slot from './domain/Slot';

const SHAKE_ANIMATION_DURATION = 300;

function App() {
  const [game] = useState(new Game());

  game.onMoveError(() => {
    console.log('GameEvent MOVE_ERROR');
    setMoveError(true);
  });
  game.onMovesUnavailable(() => {
    console.log('GameEvent NO_MOVES');
    setMoveError(true);
  });

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
    game.onSlotClick(slot);
    setTick({});
  };

  return (
    <div className="flex flex-col items-center" id="app">
      <main className="flex flex-col md:flex-row mt-8 sm:mt-12">
        <header className="mb-8 sm:mb-10 md:mb-0 md:mr-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-slate-700 font-extrabold tracking-[-0.05em]">The Pin Game</h1>
          <h2 className="text-lg sm:text-2xl md:text-3xl text-slate-500 font-normal tracking-[-0.025em] leading-[1em]">Because nobody knows its name anyway</h2>
          <h4 className="w-96 md:w-[30rem] mt-4 mb-6 sm:mt-6 sm:mb-8 text-sm sm:text-base md:text-lg text-slate-700 font-light">Have a try on this addictive pin board game, which nobody knows what it is called, but everyone gets hooked to seconds after...</h4>

          <div className="flex gap-3 md:gap-4">
            <a href="#_" className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-teal-600 md:text-lg transition duration-300 ease-out border-2 border-teal-500 rounded-full shadow-md group">
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-teal-500 group-hover:translate-x-0 ease">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-teal-600 transition-all duration-300 transform group-hover:translate-x-full ease">Play Now!</span>
              <span className="relative invisible">Play Now!</span>
            </a>
            <a href="#_" className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-slate-500 md:text-lg transition duration-300 ease-out border-2 border-slate-400 rounded-full shadow-md group">
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-slate-400 group-hover:translate-x-0 ease">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-slate-500 transition-all duration-300 transform group-hover:translate-x-full ease">Learn How to Play</span>
              <span className="relative invisible">Learn How to Play</span>
            </a>
          </div>
        </header>
        <div
          className={clsx(
            'mx-auto w-fit m-8 p-3 sm:p-4 bg-amber-100 shadow-lg rounded-lg border border-orange-200',
            {
              'animate-shake': moveError,
            }
          )}
        >
          {game.board.grid.map((row, index) => (
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
      </main>
    </div>
  );
}

export default App;