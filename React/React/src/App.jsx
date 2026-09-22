
import React from "react";
import Signup from "./Signup";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dash from "./Dash";
import Reset from "./Reset";

function App() {

  return (
    <div>
     <Routes>
      <Route  path="/"  element={<Signup/>}/>
      <Route  path="/login"  element={<Login/>}/>
      <Route  path="/dash"  element={<Dash/>}/>
      <Route  path="/reset/:token"  element={<Reset/>}/>


     </Routes>
    </div>
  );

}

export default App;