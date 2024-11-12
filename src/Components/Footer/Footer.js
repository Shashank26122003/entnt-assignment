import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer-main">
            <div>
                <a href="">Home</a>
                <a href="">About Us</a>
                <a href="">Contact</a>
                <a href="">Privacy Policy</a>
            </div>

            <div className="footer-divider">
                &copy; 2024 Web Hiring Platform.
            </div>
        </div>
    );
}

export default Footer;
