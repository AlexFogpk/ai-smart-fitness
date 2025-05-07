import React from "react";
import { FaBars } from "react-icons/fa";

export default function Header({ onMenuClick }) {
  return (
    <header className="main-header">
      <div className="main-header-logo" />
      <div className="main-header-title">SmartFitness AI</div>
      <button className="main-header-menu" onClick={onMenuClick} aria-label="Меню">
        <FaBars size={26} />
      </button>
    </header>
  );
}
