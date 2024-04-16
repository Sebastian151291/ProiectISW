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
  const [popupContent, setPopupContent] = useState('');

  const toggleOpen = () => setIsOpen(!isOpen);

  const openPopup = (content) => {
    if (content!== 'Menu')
    {
    setPopupContent(content);
    setIsOpen(true); 
    }
  };
  const aboutUsText = (
    <>
      <p>
        <strong>This is what we do.</strong>
      </p>
      <p>
        We are a company that provides fitness services. Our mission is to help
        people achieve their fitness goals.
      </p>
      <h2>Our Team</h2>
      <p>
        Our team is composed of experienced and certified professionals who are
        dedicated to helping our clients reach their fitness goals. We believe
        in a holistic approach to fitness, which includes physical exercise,
        proper nutrition, and mental well-being.
      </p>
      <h2>Our Commitment</h2>
      <p>
        We are committed to providing a safe and supportive environment for our
        clients. We understand that each individual has unique fitness goals
        and needs, and we tailor our services to meet these needs.
      </p>
      <p>We invite you to join us on your fitness journey. Let's achieve your fitness goals together!</p>
    </>
  );

  const whatDoesItDoText = (
    <>
      <p>
        <strong>This is the functionality of our app.</strong>
      </p>
      <p>
        First you need to register and offer a few details about yourself.
      </p>
      <p>
        After that you can choose one of the 3 plans we currently have
        available and start working towards your fitness goals.
      </p>
      <p>Try our app today and take control of your health and wellness journey!</p>
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

      <div className="button-container">
        <button className="button about us" style={{backgroundImage: `url(${require('D:\\Documents\\MEGA downloads\\REACT-FASTAPI-MYSQL-APP\\React\\KeepItFit\\src\\Styles\\images\\1234.gif')})`}} onClick={() => openPopup(aboutUsText)}>
          <div className='button-text'>About us</div>
        </button>
        <button className= "button what do we do" style={{backgroundImage: `url(${require('D:\\Documents\\MEGA downloads\\REACT-FASTAPI-MYSQL-APP\\React\\KeepItFit\\src\\Styles\\images\\gym1.gif')})`}} onClick={() => openPopup(whatDoesItDoText)}>
          <div className='button-text'>What does it do?</div>
        </button>
        {/* Add more buttons as needed */}
      </div>
      <div className={`popup ${isOpen ? 'open' : ''}`}>
        <p>{popupContent}</p>
        <button onClick={toggleOpen}>Close</button>
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ProductsServices" element={<ProductsServices />} />
        <Route path="/Paginaplan1" element={<Paginaplan1 />} />
        <Route path="/Paginaplan2" element={<Paginaplan2 />} />
        <Route path="/Paginaplan3" element={<Paginaplan3 />} />
        <Route path="/pagina-de-plata" element={<PaymentResponse />} />
        <Route
          path="/"
          element={
            <div className="page-container">
              <div className="full-screen-background">
                <div className="content">
                  <h1 className="title">Welcome to KeepItFit</h1>

                  <footer className="footer"></footer>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
