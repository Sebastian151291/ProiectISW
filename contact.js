import React from 'react';
import './Styles/contact.css';

const Contact = () => {
    const showMenu = () => {
        const navLinks = document.getElementById("navLinks");
        if (navLinks) {
            navLinks.style.right = "0";
        }
    };

    return (
        <div>
            <section className="sub-header">
                <nav>
                    <i className="fa fa-bars" onClick={showMenu}></i>
                </nav>
                <h1>Contact Us</h1>
            </section>

            <section className="location">
                
                <center>
                    {/* eslint-disable-next-line */}
                    <iframe src="http://maps.google.com/maps?q=45.645733, 25.602697&z=15&output=embed" 
                    width="600" height="450" style={{ border: '0' }} allowFullScreen="" loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </center>
            </section>

            <section className="contact-us">
                <div className="row">
                    <div className="contact-col">
                        <div>
                            <i className="fa fa-home"></i>
                            <span>
                                <h5>Strada Politehnicii 1, Brașov</h5>
                                <p>Brasov</p>
                            </span>
                        </div>
                        <div>
                            <i className="fa fa-phone"></i>
                            <span>
                                <h1>0756988322</h1>
                                <p>Monday to Friday 9 Am - 4 Pm</p>
                            </span>
                        </div>
                        <div>
                            <i className="fa fa-envelope-o"></i>
                            <span>
                                <h5>KeepItFit@gmail.com</h5>
                                <p>How can we help?</p>
                            </span>
                        </div>
                    </div>
                    <div className="contact-col">
                        <form method="post" action="contact-form-handler.php">
                            <input type="text" name="name" placeholder="Enter your name" required />
                            <input type="email" name="email" placeholder="Enter email address" required />
                            <input type="text" name="subject" placeholder="Enter your subject" required />
                            <textarea rows="8" name="message" placeholder="Message" required></textarea>
                            <button type="submit" className="hero-btn red-btn">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            
        </div>
    );
};

export default Contact;