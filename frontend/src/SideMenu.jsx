import React from "react";
import { FaHome, FaAppleAlt, FaRobot, FaUtensils, FaCog, FaDumbbell, FaUserCircle, FaSignOutAlt, FaInfoCircle } from "react-icons/fa";
import "./SideMenu.css";

export default function SideMenu({ open, onClose, current, onSelect, profile = { name: "Гость" } }) {
  return (
    <>
      <div className={`side-menu-backdrop${open ? " open" : ""}`} onClick={onClose} />
      <nav className={`side-menu${open ? " open" : ""}`}>
        {/* Профиль */}
        <div className="side-profile-block">
          <FaUserCircle size={46} color="#229ED9" className="side-profile-avatar" />
          <div>
            <div className="side-profile-name">{profile.name || "Гость"}</div>
            {/* Если будет смена имени — вынести сюда кнопку */}
          </div>
        </div>
        {/* Навигация */}
        <div className="side-menu-nav">
          <SideMenuItem
            icon={<FaHome />}
            label="Главная"
            active={current === "home"}
            onClick={() => { onSelect("home"); onClose(); }}
          />
          <SideMenuItem
            icon={<FaAppleAlt />}
            label="Калькулятор"
            active={current === "calc"}
            onClick={() => { onSelect("calc"); onClose(); }}
          />
          <SideMenuItem
            icon={<FaUtensils />}
            label="Мои блюда"
            active={current === "meals"}
            onClick={() => { onSelect("meals"); onClose(); }}
          />
          <SideMenuItem
            icon={<FaDumbbell />}
            label="Программы тренировок"
            active={current === "programs"}
            accent
            onClick={() => { onSelect("programs"); onClose(); }}
          />
          <SideMenuItem
            icon={<FaRobot />}
            label="ИИ-чат"
            active={current === "chat"}
            onClick={() => { onSelect("chat"); onClose(); }}
          />
          <SideMenuItem
            icon={<FaCog />}
            label="Настройки"
            active={current === "settings"}
            onClick={() => { onSelect("settings"); onClose(); }}
          />
        </div>
        {/* Нижний блок */}
        <div className="side-menu-bottom">
          <button className="side-menu-bottom-btn" title="О приложении">
            <FaInfoCircle style={{marginRight: 7}} />
            О приложении
          </button>
          <button className="side-menu-bottom-btn" title="Выйти">
            <FaSignOutAlt style={{marginRight: 7}} />
            Выйти
          </button>
        </div>
      </nav>
    </>
  );
}

function SideMenuItem({ icon, label, active, onClick, accent }) {
  return (
    <div
      className={`side-menu-item${active ? " active" : ""}${accent ? " accent" : ""}`}
      onClick={onClick}
    >
      <span className="side-menu-icon">{icon}</span>
      <span className="side-menu-label">{label}</span>
    </div>
  );
}
