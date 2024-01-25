import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Dashboard from "./Components/Dashboard";


function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/" element={<SignUp />}></Route>

        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
