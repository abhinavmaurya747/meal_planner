import React from "react";
import "../css/Footer.css"; // Create a separate CSS file for styling if needed

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Meal Planner. All rights reserved.
        </p>
        {/* Add any additional content you want to display in the footer */}
      </div>
    </footer>
  );
};

export default Footer;
