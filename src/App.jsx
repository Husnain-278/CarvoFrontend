import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ActivateAccountPage from './pages/ActivateAccountPage'
import AboutPage from './pages/AboutPage'
import CarDetailPage from './pages/CarDetailPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentCancelPage from './pages/PaymentCancelPage'
import UserProfilePage from './pages/UserProfilePage'
import UserRentalsPage from './pages/UserRentalsPage'
function App() {

  const { isAuthenticated } = useSelector((state) => state.auth)

  const RequireAuth = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />
  }

  const PublicOnly = ({ children }) => {
    return isAuthenticated ? <Navigate to="/" replace /> : children
  }

  return (
    <>
    <Routes>
      <Route path='login/' element={<PublicOnly><LoginPage/></PublicOnly>}/>
      <Route path='register/' element={<PublicOnly><RegisterPage/></PublicOnly>}/>
      <Route path='/' element={<RequireAuth><HomePage/></RequireAuth>}/>
      <Route path='dashboard/' element={<RequireAuth><DashboardPage/></RequireAuth>}/>
      <Route path='profile/' element={<RequireAuth><UserProfilePage/></RequireAuth>}/>
      <Route path='my-rentals/' element={<RequireAuth><UserRentalsPage/></RequireAuth>}/>
      <Route path='activate/' element={<ActivateAccountPage/>}/>
      <Route path='about/' element={<AboutPage/>}/>
      <Route path='cars/:slug' element={<RequireAuth><CarDetailPage/></RequireAuth>}/>
      <Route path='payment/success' element={<RequireAuth><PaymentSuccessPage/></RequireAuth>}/>
      <Route path='payment/cancel' element={<RequireAuth><PaymentCancelPage/></RequireAuth>}/>

    </Routes>
      
    </>
  )
}

export default App
