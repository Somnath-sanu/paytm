import { Link, useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");


  useEffect(() => {
    if (user) {
      toast("Already SignIn", { position: "top-right" });
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  const [values, setValues] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  // console.log(values)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        {
          ...values,
        }
      );

      // console.log(data);

      if (data) {
        toast(data.message, { position: "top-right" });
        setValues({ username: "", password: "", firstName: "", lastName: "" });
        const token = data.token;
        // console.log(token)
        localStorage.setItem("token", token);
        localStorage.setItem("user", values.username);
        navigate("/dashboard");
      }

      
    } catch (error) {
      console.log(error)
      if(error.response.statusText == "Unauthorized" || error.response.data.message == "Incorrect inputs"){
        toast("Please fill all the fields Correctly", { position: "top-right" });
      }
      else if(error.response.statusText == "Length Required"){
        toast("Email already taken !! ", { position: "top-right" });
      }
      // console.log(error.response.data.message);
      // toast(error.response.data.error.errors.name, { position: "top-right" });
      // console.log("Error While registering :", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-500 flex flex-wrap justify-center p-11">
      <div className=" bg-white p-6 flex align-center justify-center rounded-lg">
        <div className=" flex flex-col">
          <h1 className="text-3xl font-bold text-center p-3"> SignUp</h1>
          <p className="text-grey/4 text-center">
            Enter your information to create an account
          </p>

          <form className="p-11" onSubmit={(e) => handleSubmit(e)}>
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
                placeholder="john"
                className="border-2 border-black/2 mt-2 w-[22rem] rounded-lg  outline-none p-1"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="w-100 block font-semibold">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                className="border-2 mt-2 w-[22rem] rounded-lg outline-none p-1 "
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="w-100 block font-semibold">
                Email
              </label>
              <input
                type="email"
                name="username"
                placeholder="john@gmail.com"
                className="border-2 mt-2 w-[22rem] rounded-lg outline-none p-1 "
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
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
                className="border-2 mt-2 w-[22rem] rounded-lg outline-none p-1 "
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="bg-black text-white p-2 rounded-xl text-center hover:bg-slate-700 cursor-pointer ">
              <button type="submit">Sign Up</button>
            </div>
            <p className="text-center w-full pt-2 text-black font-medium">
              Already have an account?{" "}
              <span className="underline underline-offset-1">
                <Link to="/signin">Login</Link>
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

export default SignUp;
