import React from 'react'
import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OtpVerify from './pages/Emailotp'
const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/home" element={<Home />} />
      </Routes>
  )
}

export default App
//
