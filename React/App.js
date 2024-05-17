import React from 'react';
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
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ProductsServices" element={<ProductsServices />} />
        <Route path="/Paginaplan1" element={<Paginaplan1 />} />
        <Route path="/Paginaplan2" element={<Paginaplan2 />} />
        <Route path="/Paginaplan3" element={ <Paginaplan3 />} />
        <Route path="/pagina-de-plata" element={ <PaymentResponse />} />
        {/* Other Routes */}
        <Route
          path="/"
          element={
            <div className="page-container">
              <div className="full-screen-background">
                <div className="content">
                  <h1 className="title">Welcome to KeepItFit</h1>
                  <div className="text-container">
                    <p className="text">
                      KeepItFit is your ultimate companion on your journey 
                      to health and wellness. Whether you're looking to 
                      track your workouts, monitor your nutrition, or stay 
                      mindful of your overall well-being, KeepItFit provides 
                      you with all the tools and resources you need to achieve 
                      your fitness goals.
                    </p>
                    <p className="text">
                      With KeepItFit, you can easily log your workouts, whether 
                      it's cardio, strength training, or yoga, and track your 
                      progress over time. The app offers a wide range of 
                      exercises and workouts tailored to your fitness 
                      level and goals, making it easy to stay motivated and 
                      inspired.
                    </p>
                    <p className="text">
                      In addition to tracking your workouts, KeepItFit helps 
                      you monitor your nutrition by allowing you to log your 
                      meals and track your calorie intake. With access to a 
                      comprehensive database of foods and recipes, you can make 
                      informed choices about your diet and ensure you're 
                      fueling your body with the nutrients it needs to thrive.
                    </p>
                    <p className="text">
                      Whether you're a seasoned athlete or just starting your 
                      fitness journey, KeepItFit is here to support you every 
                      step of the way. Try KeepItFit today and take 
                      control of your health and wellness journey!
                    </p>
                  </div>
                  <footer className="footer">
                  <p>
                      Pentru a va incepe calatoria, vizitați{" "}
                      <a href="/login" className="contact-link">
                        Inregistrare
                      </a>
                    </p>
                    <p>
                      Pentru mai multe informații, vizitați{" "}
                      <a href="/contact" className="contact-link">
                        Contact-Us
                      </a>
                    </p>
                    <p>
                      Pentru mai multe informații, vizitați{" "}
                      <a href="/ProductsServices" className="contact-link">
                        Planuri
                      </a>
                    </p>
                  </footer>
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
