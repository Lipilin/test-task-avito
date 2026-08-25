import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Booking } from './components/pages/Booking'
import { RoomList } from './components/pages/RoomList'
import { RoomDetail } from './components/pages/RoomDetail'
import { NotFound } from './components/pages/NotFound'
import { Header } from './components/layout'


function App() {
    useEffect(() => {

    }, [])
    return (
      <>
        <BrowserRouter>
          <Header />
          <div className = "container">
            
              <Routes>
                <Route path="/" element={ <Navigate to="/rooms" /> } />
                <Route path="/rooms" element={<RoomList />} />
                <Route path="/room/:id" element={<RoomDetail />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
          </div>
        </BrowserRouter>
      </>
    )
}

export default App
