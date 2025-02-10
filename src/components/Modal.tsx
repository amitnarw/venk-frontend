import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import MiniLoader from "./MiniLoader";
import { GrFormNext } from "react-icons/gr";

const Modal = ({ selectedGame, setOpenModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [bet, setBet] = useState(null);

  const handleUpdate = () => {};

  return (
    <div className="w-full h-screen flex items-center justify-center fixed bg-black/50">
      <div className="w-full h-full backdrop-blur-[5px] duration-300"></div>
      <div className="bg-white max-w-1/3 min-w-1/3 p-5 rounded-2xl absolute">
        <div className="flex flex-row items-center justify-between w-full mb-2">
          <h2 className="font-bold text-2xl text-black">
            {selectedGame?.name}
          </h2>
          <button
            className="bg-red-500/70 hover:bg-red-600 p-2 text-2xl text-white rounded-bl-2xl rounded-tr-2xl cursor-pointer duration-300 absolute right-0 top-0"
            onClick={() => setOpenModal(false)}
          >
            <IoCloseOutline />
          </button>
        </div>
        <div className="w-full flex flex-row items-center justify-between text-black">
          <p>Total players: {selectedGame?.totalSlots}</p>
          <p>Duration of game: {selectedGame?.duration}ms</p>
        </div>
        {step === 0 ? (
          <div>
            <p className="text-black mt-5">Select a bet:</p>
            <div className="w-full flex flex-row gap-4 text-black">
              {selectedGame?.bets?.map((item, index) => {
                return (
                  <button
                    className={`p-2 w-full rounded-xl ${
                      item === bet
                        ? "bg-black text-white"
                        : "border border-gray-200 hover:bg-black hover:text-white"
                    }  duration-300 cursor-pointer`}
                    key={index}
                    onClick={() => setBet(item)}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <button className="bg-green-400 hover:bg-green-500 w-full rounded-xl flex flex-row items-center justify-center gap-2 p-2 cursor-pointer duration-300 font-bold mt-5">
              NEXT
              <GrFormNext />
            </button>
          </div>
        ) : (
          <div>
            <ul className="mt-5">
              {Array.from({ length: selectedGame.totalSlots }, (_, index) => {
                return (
                  <li key={index} className="text-black">
                    <p>Player {index + 1} score:</p>
                    <input
                      className="w-full rounded-xl outline-none bg-gray-200 p-2 mb-2"
                      type="number"
                    ></input>
                  </li>
                );
              })}
            </ul>
            {isLoading ? (
              <MiniLoader />
            ) : (
              <button className="rounded-xl bg-blue-400 hover:bg-blue-500 duration-300 w-full p-2 mt-5 cursor-pointer">
                UPDATE
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
