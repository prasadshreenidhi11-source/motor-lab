import './Header.css';
import { ArrowUpRight, Menu } from 'lucide-react';

function Header() {
  return (
    <header className="header">

      <div className="header-logo">
        <span className="logo-symbol">M</span>
        <div className="logo-text">
          <h2>MOTOR<span>LAB</span></h2>
          <p>AUTOMOTIVE ENGINEERING</p>
        </div>
      </div>

      <nav className="header-nav">
        <a href="#home" className="active">Home</a>
        <a href="#technology">Technology</a>
        <a href="#components">Components</a>
        <a href="#about">About</a>
      </nav>

      <div className="header-actions">
        <a href="#explore" className="header-contact">
          Explore System
          <ArrowUpRight size={16} />
        </a>

        <button className="menu-button">
          <Menu size={23} />
        </button>
      </div>

    </header>
  );
}

export default Header;