import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './Styles/App.css';
import Dashboard from './Dashboard';
import Login from './Login';
import Contact from './contact';
import ProductsServices from './ProductsServices';
import Paginaplan1 from './Paginaplan1';
import Paginaplan2 from './Paginaplan2';
import Paginaplan3 from './Paginaplan3';
import PaymentResponse from './PaymentResponse';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const openPopup = (content) => {
    setPopupContent(content);
    setIsOpen(true);
  };

  const closePopup = () => {
    setPopupContent(null);
    setIsOpen(false);
  };

  const aboutUsText = (
    <>
      {/* About Us content */}
      <p>
        <strong>This is what we do.</strong>
      </p>
      <p>
        We are a company that provides fitness services. Our mission is to help
        people achieve their fitness goals.
      </p>
      {/* Add more content as needed */}
    </>
  );

  const whatDoesItDoText = (
    <>
      {/* What Does It Do? content */}
      <p>
        <strong>This is the functionality of our app.</strong>
      </p>
      <p>
        First you need to register and offer a few details about yourself.
      </p>
      {/* Add more content as needed */}
    </>
  );

  return (
    <Router>
      <div className="dropdown">
        <button onClick={toggleOpen} className="dropbtn">
          Menu
        </button>
        {isOpen && (
          <div className="dropdown-content">
            <a href="/">Home</a>
            <a href="/login">Inregistrare</a>
            <a href="/contact">Contact-us</a>
            <a href="/ProductsServices">Planuri</a>
          </div>
        )}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="page-container">
              <div className="full-screen-background">
                <div className="content">
                  <h1 className="title">Welcome to KeepItFit</h1>
                  <div className="button-container">
                    <button className="button about us" style={{backgroundImage: `url(${require('D:\\Documents\\MEGA downloads\\REACT-FASTAPI-MYSQL-APP\\React\\KeepItFit\\src\\Styles\\images\\1234.gif')})`}} onClick={() => openPopup(aboutUsText)}>
                      <div className='button-text'>About us</div>
                    </button>
                    <button className= "button what do we do" style={{backgroundImage: `url(${require('D:\\Documents\\MEGA downloads\\REACT-FASTAPI-MYSQL-APP\\React\\KeepItFit\\src\\Styles\\images\\gym1.gif')})`}} onClick={() => openPopup(whatDoesItDoText)}>
                      <div className='button-text'>What does it do?</div>
                    </button>
                  </div>
                  <footer className="footer"></footer>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ProductsServices" element={<ProductsServices />} />
        <Route path="/Paginaplan1" element={<Paginaplan1 />} />
        <Route path="/Paginaplan2" element={<Paginaplan2 />} />
        <Route path="/Paginaplan3" element={<Paginaplan3 />} />
        <Route path="/pagina-de-plata" element={<PaymentResponse />} />
      </Routes>

      {/* Popup */}
      {isOpen && popupContent && (
        <div className={`popup ${isOpen ? 'open' : ''}`}>
          <p>{popupContent}</p>
          <button onClick={closePopup}>Close</button>
        </div>
      )}
    </Router>
  );
};

export default App;
