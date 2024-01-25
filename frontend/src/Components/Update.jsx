/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { XCircle } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "reactjs-popup/dist/index.css";

const Update = ({ onClose }) => {
  // console.log(mainId)

  const modalRef = useRef();

  const closeModal = (e) => {
    if(modalRef.current == e.target){
      onClose();
    }
  }

  const token = localStorage.getItem("token");

  const [values, setValues] = useState({});

  const updateInformation = async (e) => {
    e.preventDefault();

    if(values?.password  == "" || values?.firstName  == "" || values?.lastName == ""){
      onClose()
      return
    }

    try {
      const { data } = await axios.put(
        "http://localhost:3000/api/v1/user/update",
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data) {
        // console.log(data);
        toast("Updating..."); // Display a temporary message

        setTimeout(async () => {
          toast.dismiss();
          toast("Data updated successfully", { position: "top-right" });

          onClose();
        }, 2000);
      }
    } catch (error) {
      console.log("Error while Updating :", error);
      toast("Error while Updating" , {position : "top-right"})
    }
  };

  return (
    <div ref={modalRef} onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center ">
      <div className=" mt-5 flex flex-col flex-wrap w-[25rem] ">
        <button
          className=" place-self-end hover:text-red-500"
          onClick={onClose}
        >
          <XCircle />
        </button>

        <div className=" bg-white p-5 rounded-xl flex flex-col gap-4 flex-wrap ">
          <h1 className=" text-3xl font-bold text-center pb-12">
            Update Information{" "}
            {/* <span className="text-2xl inline-block font-medium">
              (At least update any one field)
            </span> */}
          </h1>
          <form onSubmit={updateInformation}>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="w-100 block text-black font-semibold"
              >
                Password <span className="font-light text-zinc-600">(min length : 4)</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="new password min length : 4"
                className="border-2 border-black/2 mt-2 w-[22rem] rounded-lg  outline-none p-1"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="firstName"
                className="w-100 block text-black font-semibold"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="update first name"
                className="border-2 border-black/2 mt-2 w-[22rem] rounded-lg  outline-none p-1"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="lastName"
                className="w-100 block text-black font-semibold"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="update last name"
                className="border-2 border-black/2 mt-2 w-[22rem] rounded-lg  outline-none p-1"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <button
              className="text-1xl font-semibold bg-blue-500 p-2 rounded-2xl hover:bg-blue-400 w-full"
              type="submit"
            >
              Update
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Update;
