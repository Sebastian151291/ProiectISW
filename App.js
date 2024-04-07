import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import './App.css'; // Importăm fișierul CSS pentru stilizare
import Contact from './contact';
import ProductsServices from './ProductsServices';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ProductsServices" element={<ProductsServices />} />
        {/* Alte rute pot fi adăugate aici */}

        {/* Text de test pe pagina principală */}
        <Route
          path="/"
          element={
            <div className="page-container">
              <div className="full-screen-background">
                <div className="content">
                  <h1 className="title">Welcome to KeepItFit</h1>
                  <div className="text-container">
                    <p className="text">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a more-or-less normal distribution of letters, as
                      opposed to using 'Content here, content here', making it
                      look like readable English. Many desktop publishing
                      packages and web page editors now use Lorem Ipsum as
                      their default model text, and a search for 'lorem ipsum'
                      will uncover many web sites still in their infancy.
                      Various versions have evolved over the years, sometimes
                      by accident, sometimes on purpose (injected humour and
                      the like).
                    </p>
                  </div>
                  <footer className="footer">
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
