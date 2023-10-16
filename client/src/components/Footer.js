import React from "react";
import { NavLink } from "react-router-dom";
import "../assets/css/footer.css";

const Footer = () => {

  return (
    <div data-testid="footerContent">
      <footer>
        <NavLink to="/">
          terms of service
        </NavLink>     
        |
        <NavLink to="/">
            privacy
        </NavLink>     
        |
        <NavLink to="/">
            twitter
        </NavLink>     
        |
        <NavLink to="/">
            instagram
        </NavLink>     
        |
        <NavLink to="/">
        contact
        </NavLink>     
      </footer>
    </div>

  );
};

export default Footer;
