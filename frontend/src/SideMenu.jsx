import React from "react";
import { FaHome, FaAppleAlt, FaRobot, FaUtensils, FaCog, FaDumbbell } from "react-icons/fa";
import "./SideMenu.css";

const menuItems = [
  { key: "home", label: "Главная", icon: <FaHome /> },
  { key: "calc", label: "Калькулятор", icon: <FaAppleAlt /> },
  { key: "chat", label: "ИИ", icon: <FaRobot /> },
  { key: "meals", label: "Блюда", icon: <FaUtensils /> },
  { key: "programs", label: "Программы тренировок", icon: <FaDumbbell /> },
  { key: "settings", label: "Настройки", icon: <FaCog /> },
];

export default function SideMenu({ open, onClose, current, onSelect }) {
  return (
    <>
      <div className={`side-menu-backdrop${open ? " open" : ""}`} onClick={onClose} />
      <nav className={`side-menu${open ? " open" : ""}`}>
        <div style={{ fontWeight: 900, fontSize: 21, color: "#229ED9", padding: 18, paddingBottom: 5 }}>
          SmartFitness AI
        </div>
        {menuItems.map(item => (
          <div
            key={item.key}
            className={`side-menu-item${current === item.key ? " active" : ""}`}
            onClick={() => { onSelect(item.key); onClose(); }}
          >
            <span className="side-menu-icon">{item.icon}</span>
            <span className="side-menu-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </>
  );
}
