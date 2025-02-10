import { useEffect, useState } from "react";
import MiniLoader from "./MiniLoader";
import { FaUserCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import Modal from "./Modal";

const GameList = () => {
  const [data, setData] = useState([]);
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
      console.log(JSON.parse(data), "1111111");
      setUserData(JSON.parse(data));
    }
  };

  useEffect(() => {
    if (userData) {
      getGameList();
    }
  }, [userData]);

  let getGameList = async () => {
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
  };

  console.log(data, "xxxxxxxxxxxxxx");
  return (
    <div className="flex flex-col items-center justify-center max-w-1/2 m-auto gap-4 my-20">
      {openModal && <Modal selectedGame={selectedGame} setOpenModal={setOpenModal} />}
      <h2 className="text-4xl font-bold mb-4">GAME LIST</h2>
      {isLoading ? (
        <MiniLoader />
      ) : (
        data.map((item, index) => (
          <li
            key={index}
            className="flex flex-row list-none p-2 w-full bg-black/60 rounded-2xl hover:bg-black/40 cursor-pointer duration-300"
            onClick={()=>{
              setOpenModal(true);
              setSelectedGame(item)
            }}
          >
            <img
              src={item?.image}
              alt="img"
              className="w-32 h-32 object-cover rounded-xl"
            />
            <div className="flex flex-col w-full px-6 justify-between">
              <div>
                <h6 className="font-bold text-2xl">{item?.name}</h6>
                <p>{item?.description}</p>
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
        ))
      )}
    </div>
  );
};

export default GameList;
