import { useState } from 'react'
import Login from './Pages/Login'
import Home from './Pages/Home'
import { BrowserRouter as Router,Route,Routes,Navigate } from 'react-router-dom'

function App() {
   const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
          <Router>
      <Routes>
        <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Login setLoggedIn={setLoggedIn} />} />
        <Route path="/home" element={loggedIn ? <Home /> : <Navigate to="/" />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
