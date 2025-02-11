import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import MiniLoader from "./MiniLoader";
import { GrFormNext } from "react-icons/gr";
import Loader from "./Loader";
import io, { Socket } from 'socket.io-client';

const Modal = ({ selectedGame, setOpenModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [bet, setBet] = useState(null);

  const [userData, setUserData] = useState({});

  const [liveGameData, setLiveGameData] = useState();
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    let data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, [])

  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  handleUpdate({roomId: liveGameData?.data?.roomId, userId: userData?.userId, score: score})
  const handleUpdate = ({ roomId, userId, score }: {roomId: string, userId: string, score: number}) => {
      socket?.emit("UPDATE_SCORES", { roomId, userId, score });
  };

  const connectOrAlert = () => {
    if (bet !== null) {
      setStep(1);
      connectToSocket();
    } else {
      window.alert("Please select a bet to continue")
    }
  }

  const connectToSocket = () => {
    const socketConnection = io(import.meta.env.VITE_SOCKET_URL, {
      extraHeaders: {
        Authorization: `Bearer ${userData?.accessToken}`
      }
    });
    // socketConnection.on('welcome', (msg) => {
    //   console.log('Message from server: ', msg);
    // });
    socketConnection.on("connect_error", (error) => {
      console.error("Connection failed:", error.message);
      alert(error);
    });

    setSocket(socketConnection);

    socketConnection.emit('GET_AVAILABLE_ROOMS', { gameId: selectedGame?.gameId, duration: selectedGame?.duration, totalSlots: 2, bet: bet });
    socketConnection.on('FIELDS_ERROR', (data) => {
      alert(data?.message);
      setStep(0);
    });
    socketConnection.on('BALANCE_ERROR', (data) => {
      alert(data?.message);
      setStep(0);
    });
    socketConnection.on('GET_AVAILABLE_ROOMS', (data) => {
      console.log(data, "DATA");
      setLiveGameData(data);
      if(data.status.step === 2){
        setStep(2);
      }
    });
  }

  return (
    <div className="w-full h-screen flex items-center justify-center fixed bg-black/50">
      <div className="w-full h-full backdrop-blur-[5px] duration-300"></div>
      <div className="bg-white max-w-8/12 lg:max-w-4/12 p-5 pt-2 rounded-2xl absolute">
        <div className="flex flex-row items-center justify-between w-full mb-4">
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
            <p className="text-black mt-5 font-medium">Select a bet:</p>
            <div className="w-full flex flex-row gap-4 text-black">
              {selectedGame?.bets?.map((item, index) => {
                return (
                  <button
                    className={`p-2 w-full rounded-xl ${item === bet
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
            <button className={`${bet !== null && bet > -1 ? 'bg-green-400 hover:bg-green-500' : 'border border-green-400 hover:bg-green-100 text-green-400'} w-full rounded-xl flex flex-row items-center justify-center gap-2 p-2 cursor-pointer duration-300 font-bold mt-5`}
              onClick={() => connectOrAlert()}
            >
              NEXT
              <GrFormNext />
            </button>
          </div>
        ) :
          step === 1 ?
            <div className="flex flex-col gap-5 w-full items-center justify-center mt-5">
              <div className="w-20 h-20">
                <Loader />
              </div>
              <p className="text-black text-2xl font-medium">Waiting for other players to join</p>
            </div>
            :
            (
              <div>
                <ul className="mt-5">
                  {/* {Array.from({ length: selectedGame.totalSlots }, (_, index) => {
                    return ( */}
                      {/* <li key={index} className="text-black">
                        <p>Player {index + 1} score:</p> */}
                        <p className="text-black">Your score:</p>
                        <input
                          className="w-full rounded-xl outline-none bg-gray-200 p-2 mb-2"
                          type="number"
                          value={score}
                          onChange={(e)=>setScore(Number(e.target.value))}
                        ></input>
                      {/* </li> */}
                    {/* );
                  })} */}
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