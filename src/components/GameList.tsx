import { useEffect, useState } from "react";
import MiniLoader from "./MiniLoader";
import { FaUserCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import Modal from "./Modal";
import { FiLogOut } from "react-icons/fi";

const GameList = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState({});

  useEffect(() => {
    getUserData();
  }, []);

  let getUserData = () => {
    let data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
    }
  };

  useEffect(() => {
    if (userData) {
      getGameList();
    }
  }, [userData]);

  let getGameList = async () => {
    try {
      setIsLoading(true);
      let result = await fetch(`${import.meta.env.VITE_BACKEND_URL}games`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userData?.accessToken}`,
        },
      });
      let formatedData = await result.json();
      console.log(formatedData.data.rows, "object");
      setData(formatedData?.data?.rows);
      setIsLoading(false);
    } catch (err: any) {
      setError(
        err?.message === "Cannot read properties of undefined (reading 'rows')"
          ? "Login again"
          : err?.message
      );
      setIsLoading(false);
    }
  };

  const loginAgain = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-10/12 sm:max-w-8/12 lg:max-w-6/12 m-auto gap-4 py-20">
      {openModal && (
        <Modal selectedGame={selectedGame} setOpenModal={setOpenModal} />
      )}
      <div className="flex flex-row gap-5 items-center">
        <h2 className="text-4xl font-bold">GAME LIST</h2>
        <button
          className="p-2 rounded-full bg-red-500 hover:bg-red-500/70 duration-300 text-white cursor-pointer"
          onClick={loginAgain}
        >
          <FiLogOut />
        </button>
      </div>
      {error && (
        <p className="text-red-300">{error}</p>
      )}
      {isLoading ? (
        <MiniLoader />
      ) : (
        <div className="h-96 flex flex-col gap-5">
          {data.map((item, index) => (
            <li
              key={index}
              className="flex flex-row list-none p-2 w-full bg-black/60 rounded-2xl hover:bg-black/40 cursor-pointer duration-300"
              onClick={() => {
                setOpenModal(true);
                setSelectedGame(item);
              }}
            >
              <img
                src={item?.image}
                alt="img"
                className="w-32 h-32 object-cover rounded-xl"
              />
              <div className="flex flex-col w-full px-6 justify-between">
                <div>
                  <h6 className="font-bold text-2xl line-clamp-3">
                    {item?.name}
                  </h6>
                  <p className="line-clamp-2">{item?.description}</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="flex flex-row gap-2 items-center">
                    <span>
                      <FaUserCircle />
                    </span>
                    <span>{item?.totalSlots}</span>
                  </p>
                  <p className="flex flex-row gap-2 items-center">
                    <span>
                      <FaClock />
                    </span>
                    <span>{item?.duration}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameList;