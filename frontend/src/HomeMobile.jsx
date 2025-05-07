import React from "react";
import Header from "./Header";
import ProgressRings from "./ProgressRings"; // твой компонент с анимированными кольцами
import "./Header.css"; // если выносил стили

export default function HomeMobile(props) {
  const { kbju, summary, onMenuClick } = props;
  return (
    <div>
      <Header onMenuClick={onMenuClick} />
      <div style={{ height: 64 }} /> {/* отступ под фиксированный header */}
      <div className="progress-rings-row" style={{ marginTop: 44 }}>
        <ProgressRings
          calories={summary.calories}
          caloriesGoal={kbju.calories}
          protein={summary.protein}
          proteinGoal={kbju.protein}
          fat={summary.fat}
          fatGoal={kbju.fat}
          carb={summary.carb}
          carbGoal={kbju.carb}
        />
      </div>
      <div className="mainpage-macros-row">
        <span style={{ color: "#3bafe8" }}>Калории: <b>{summary.calories}</b>/{kbju.calories}</span>
        <span style={{ color: "#5fc77f" }}>Б: <b>{summary.protein}</b>/{kbju.protein}</span>
        <span style={{ color: "#ffb24a" }}>Ж: <b>{summary.fat}</b>/{kbju.fat}</span>
        <span style={{ color: "#ff6f61" }}>У: <b>{summary.carb}</b>/{kbju.carb}</span>
      </div>
    </div>
  );
}
