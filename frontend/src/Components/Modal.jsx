/* eslint-disable react/prop-types */
import { useState  , useRef} from "react";
import { XCircle } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'reactjs-popup/dist/index.css';
import { useNavigate } from "react-router-dom";

const Modal = ({ onClose, friendName, friendId }) => {

  const modalRef = useRef();

  const closeModal = (e) => {
    if(modalRef.current == e.target){
      onClose();
    }
  }

  const navigate = useNavigate()
  const token = localStorage.getItem("token");

  

  const [amount, setAmount] = useState(0);

  if(!token){
    navigate("/")
    return
  }

  const makePayment = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        {
          amount: parseFloat(amount), // Convert amount to a float if it's a string
          to: friendId, // Use the friendId from props
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data) {
        // console.log(data);
        toast("Payment Successfull",{position : "top-right"})
        onClose();
      }
    } catch (error) {
      if(error.response.data.message == "Insufficient balance"){
        toast("Payment Unsuccessfull !! Insufficient balance ",{position : "top-right"})
        return;
        
      }
      
      // console.log("Error while making Payment", error);
      toast("Payment Unsuccessfull !! ",{position : "top-right"})
    }
  };

  return (
    <div ref={modalRef} onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center ">
      <div className=" mt-5 flex flex-col flex-wrap w-[25rem] ">
        <button
          className=" place-self-end hover:text-red-300"
          onClick={onClose}
        >
          <XCircle />
        </button>
        
        <div className=" bg-white p-9 rounded-xl flex flex-col gap-4 flex-wrap ">
          <h1 className=" text-3xl font-bold text-center pb-12">Send Money</h1>
          <div className="">
            <h2 className=" font-bold text-2xl w-full p-4 text-center">
              {friendName}
            </h2>
            <div className=" flex flex-col flex-wrap  ">
              <h3 className="font-bold"> Amount (in Rs)</h3>
              <input
                className="w-full border-2 my-1 rounded-lg p-1"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                className=" bg-green-500 p-1 mt-1 rounded-xl hover:bg-green-400"
                onClick={makePayment}
              >
                {" "}
                Initiate Transfer{" "}
              </button>
             
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Modal;
