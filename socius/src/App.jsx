import React, { useEffect, Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProfileCompletionGuard from './components/ProfileCompletionGuard';
import BackgroundMusic from './components/BackgroundMusic'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy Load Pages - REFACTORED FOR SOCIUS
const Home = lazy(() => import('./pages/Home'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Community = lazy(() => import('./pages/Forum'))
const Login = lazy(() => import('./pages/Login'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const MyProfile = lazy(() => import('./pages/MyProfile'))
const MyItems = lazy(() => import('./pages/MyItems'))
const MyRequests = lazy(() => import('./pages/MyRequests'))
const MyBorrowings = lazy(() => import('./pages/MyBorrowings'))
const AddItem = lazy(() => import('./pages/AddItem'))
const ItemDetail = lazy(() => import('./pages/ItemDetail'))
const Wallet = lazy(() => import('./pages/Wallet'))
const Membership = lazy(() => import('./pages/Membership'))
const UploadProfileImage = lazy(() => import('./pages/UploadProfileImage'))

const Checkout = lazy(() => import('./pages/Checkout'))

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const normalizedPath = location.pathname.replace(/\/$/, '');
  const hideNavbarFooter = [
    '/login',
    '/my-profile',
    '/upload-profile-image',
  ].includes(normalizedPath);

  // Dynamically build the main content class
  // Don't add top padding on home page since Hero handles its own spacing
  const isHomePage = normalizedPath === '' || normalizedPath === '/';
  let mainClass = '';
  if (!hideNavbarFooter && !isHomePage) {
    mainClass += 'pt-20 ';
  }
  mainClass += 'w-full ';

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <div className={mainClass.trim()}>
        <ToastContainer />
        {/* <BackgroundMusic /> Disabled for Socius initially */}
        <ProfileCompletionGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/inventory' element={<Inventory />} />
              <Route path='/inventory/:category' element={<Inventory />} />
              <Route path='/community' element={<Community />} />
              <Route path='/forum' element={<Community />} /> {/* Legacy support / alias */}
              <Route path='/login' element={<Login />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/my-profile' element={<MyProfile />} />
              <Route path='/my-items' element={<MyItems />} />
              <Route path='/my-requests' element={<MyRequests />} />
              <Route path='/my-borrowings' element={<MyBorrowings />} />
              <Route path='/add-item' element={<AddItem />} />
              <Route path='/add-item' element={<AddItem />} />
              <Route path='/inventory/item/:itemId' element={<ItemDetail />} />
              <Route path='/wallet' element={<Wallet />} />
              <Route path='/membership' element={<Membership />} />
              <Route path='/upload-profile-image' element={<UploadProfileImage />} />
              <Route path='/checkout' element={<Checkout />} />
            </Routes>
          </Suspense>
        </ProfileCompletionGuard>
      </div>
      {!hideNavbarFooter && (
        <div className="mx-0">
          <Footer />
        </div>
      )}
    </>
  )
}

export default App;
