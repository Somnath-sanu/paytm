import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "reactjs-popup/dist/index.css";

const SignIn = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        {
          ...values,
        }
      );
      if (response) {
        setValues({ username: "", password: "", firstName: "", lastName: "" });
        // console.log(response.data.token)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", values.username);

        toast("User LoggedIn Successfully", { position: "top-right" });

        navigate("/dashboard");
      }
    } catch (error) {
      // console.log("Error while SignIn :", error);
      toast("Please fill all the fields Correctly !! ", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (user) {
      toast("Already SignIn", { position: "top-right" });
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-500 flex flex-wrap justify-center p-11">
      <div className="  bg-white p-5 flex flex-wrap  justify-center rounded-lg overflow-hidden">
        <div className="">
          <h1 className="text-3xl font-bold text-center p-3"> SignIn</h1>
          <p className="text-grey/4 text-center">
            Enter your credentials to access your account
          </p>

          <form className="p-11" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="w-100 block font-semibold">
                Email
              </label>
              <input
                type="email"
                name="username"
                placeholder="john@gmail.com"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                className="border-2 mt-2 w-[22rem] rounded-lg outline-none p-1 "
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="w-100 block font-semibold">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="min length : 4"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                className="border-2 mt-2 w-[22rem] rounded-lg outline-none p-1 "
              />
            </div>
            <div className="bg-black text-white p-2 rounded-xl text-center hover:bg-slate-700 cursor-pointer ">
              <button type="submit">Sign In</button>
            </div>
            <p className="text-center w-full pt-2 text-black font-medium">
              Already have an account?
              <span className="underline underline-offset-1">
                <Link
                  className=" text-black items-center px-1 py-3 font-medium hover:opacity-75"
                  to="/signup"
                >
                  {" "}
                  Sign Up
                </Link>
              </span>
            </p>
          </form>
        </div>

        <div></div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
