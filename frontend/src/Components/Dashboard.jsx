import axios from "axios";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "reactjs-popup/dist/index.css";
import Update from "./Update";


const Dashboard = () => {
  //  const header = `Authorization: Bearer ${token}`;
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  // console.log(user) //! if no user --> null

  

  const [balance, setBalance] = useState(0);
  const [id , setId] = useState("")
  // console.log(id)

  const [showModal , setShowModal] = useState(false);
  
  const [selectedUser , setSelectedUser] = useState(null);

  const getBalance = async (token) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/account/balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(data);

      if (data) {
        setBalance(Number(data.balance.toFixed(2)));
        setId(data.id)
        //! i have modified response from backend -> now balance along with user id will come as responce
        // console.log(data.balance);
        
      }
    } catch (error) {
      console.log("Error getting balance in Dashboard ", error);
    }
  };

  useEffect(() => {
    if (!user) {
      toast("Please Sign In to access Dashboard", { position: "top-right" });
      navigate("/");
      return;
    }
    

    const token = localStorage.getItem("token");
    // console.log(token);
    // const header = `Authorization: Bearer ${token}`;
    getBalance(token);
  }, [showModal , user]);

  const [search, setSearch] = useState("");
  const [allUser, setAllUser] = useState([]);
  // console.log(allUser)

  const getAllUser = async () => {
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/user/bulk?filter=${search}`
    );

    if (data) {

      const users = data.user.filter((u) => u._id !== id)
      setAllUser(users);
      // console.log(users);
    }
  };

 

  const showUser = (user) => { //! is user ke pass sab h matlab id , firsname..(object)
    // console.log(user._id)

    setShowModal(!showModal)
    setSelectedUser(user);


    
  }

  useEffect(() => {
    getAllUser();
  }, [user, search , id ]);


  const logOut = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");

    
  }

  const [updatedata , setUpdateData] = useState(false)

  
  // const updateData = () => {
  //   setUpdate(!update)
    
  // }
  

  return (
    <div className="h-screen bg-white-500 ">
      {showModal && <Modal
       onClose = {() =>setShowModal(!showModal)}
       friendName = {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : " "}
       friendId = {selectedUser ? selectedUser._id : ""}
        />}
        {
          updatedata && <Update
           onClose = { () => setUpdateData(!updatedata)}
           
           />
        }
      <div className=" bg-white p-7 border-b-2  flex justify-between ">
        <h2 className="text-black font-bold text-2xl">Payments App </h2>
        <div className=" flex justify-between items-center  ">
        <button className=" font-medium p-1  bg-red-400/55 hover:bg-red-500 rounded-lg mx-4" onClick={logOut}>LogOut</button>
        <button className="font-medium p-1  bg-blue-400 hover:bg-blue-500 rounded-lg mx-4" onClick={() => setUpdateData(!updatedata)}>Update</button>
        <h3 className="font-semibold"> Hello , {user?.toLowerCase()} </h3>
        </div>
      </div>
        
      <div>
        <h1 className="text-black font-bold text-lg p-4">
          {" "}
          Your Balance <span className="px-2">Rs : {balance}</span>
        </h1>
      </div>
      <div className="w-full">
        <h1 className="text-black font-bold text-lg p-4"> Users </h1>
        <input
          type="text"
          name=""
          id=""
          placeholder="search users..."
          className="bg-grey-500 border-2 w-full mx-4 rounded-lg p-1"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className=" p-8">
        {allUser.length > 0 ? allUser.map((user) => (
          
          <div className="flex justify-between  p-2" key={user._id}>
            <h1 className="text-black font-bold text-lg">
              <span className="w-7 h-7 bg-slate-300  rounded-xl inline-flex justify-center font-medium mx-2">
                {`${user.firstName.charAt(0).toLowerCase()}${user.lastName.charAt(0).toLowerCase()}`}
              </span>
              {`${user.firstName} ${user.lastName}`}
            </h1>
            <button className="bg-black text-white p-3 rounded-lg hover:bg-black/75" onClick={()=> showUser(user)}>
              {" "}
              Send Money
              
            </button>
          </div>
        )) : <div className="font-bold text-4xl text-center"> User Not Found </div>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
