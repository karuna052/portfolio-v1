import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Monitor, Smartphone, Search } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <NavLink to="/" className="brand">
          <Compass className="brand-icon" />
          <span>GravityWalls</span>
        </NavLink>
        
        <div className="nav-links">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Discover
          </NavLink>
          <NavLink to="/desktop" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Monitor size={18} /> Desktop
          </NavLink>
          <NavLink to="/mobile" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Smartphone size={18} /> Mobile
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
