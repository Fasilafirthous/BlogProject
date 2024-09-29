import React from 'react';
import './App.css';
import Homepage from './Components/Homepage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './Components/SignUp/signup';
import SignIn from './Components/SignIn/signin';
import VerifySignUp from './Components/verifySignUp/verifySignUp';
import Home from './Components/home/home';
import WritePage from './Components/write/write'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

function App() { 
  
  return (
    <>
    <div>
    <ToastContainer 
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
            </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn/>} />
          <Route path= "/signup" element={<SignUp/>}/>
          <Route path='/verifySignUp' element = {<VerifySignUp/>}/>
          <Route path='/home' element = {<Home/>}/>
          <Route path='/write' element={<WritePage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
