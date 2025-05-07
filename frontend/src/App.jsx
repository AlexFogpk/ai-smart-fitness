import React, { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import Header from "./Header";
import { motion } from "framer-motion";
import { PiBowlFoodFill } from "react-icons/pi";
import "./theme.css";
import "./mainpage.css";

// --- Калькулятор КБЖУ ---
function getKBJU({ sex, weight, height, age, activity, goal }) {
  let bmr =
    sex === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  let tdee = bmr * activity;
  if (goal === "loss") tdee -= 300;
  if (goal === "gain") tdee += 300;
  const protein = Math.round(weight * 1.7);
  const fat = Math.round(weight * 0.9);
  const carb = Math.round((tdee - (protein * 4 + fat * 9)) / 4);
  return {
    calories: Math.round(tdee),
    protein,
    fat,
    carb,
  };
}

const defaultProfile = {
  sex: "male",
  age: 25,
  height: 180,
  weight: 75,
  activity: 1.375,
  goal: "maintain",
  name: "",
};

// --- Кольцо калорий ---
function CaloriesRing({ value, max }) {
  const pct = Math.min(100, (value / max) * 100 || 0);
  const size = 108, r = 44, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, marginBottom: 6 }}>
      <svg width={size} height={size}>
        <circle r={r} cx={size / 2} cy={size / 2} stroke="#f2f2f2" strokeWidth={9} fill="none" />
        <motion.circle
          r={r}
          cx={size / 2}
          cy={size / 2}
          fill="none"
          stroke="#229ED9"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct / 100)}
          animate={{ strokeDashoffset: c - (c * pct / 100) }}
          transition={{ duration: 0.7 }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PiBowlFoodFill color="#229ED9" size={38} />
        <span style={{ color: "#229ED9", fontWeight: 800, fontSize: 24, marginTop: 3 }}>
          {value}
        </span>
      </div>
    </div>
  );
}

// --- Полоски макронутриентов ---
function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100 || 0);
  return (
    <div style={{ width: "88%", margin: "6px 0" }}>
      <div style={{ fontSize: 14, fontWeight: 600, color, marginBottom: 2 }}>{label}</div>
      <div
        style={{
          background: "#f3f5f9",
          borderRadius: 10,
          height: 10,
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 1px 4px #e0eafc60",
        }}
      >
        <motion.div
          style={{
            background: color,
            height: 10,
            borderRadius: 10,
            width: pct + "%",
          }}
          initial={{ width: 0 }}
          animate={{ width: pct + "%" }}
          transition={{ duration: 0.9 }}
        />
      </div>
      <div style={{ fontSize: 13, color: "#888", marginTop: 1 }}>
        {value} / {max}
      </div>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState("splash");
  const [tab, setTab] = useState("home");
  const [profile] = useState(defaultProfile);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  useEffect(() => {
    if (stage === "splash") {
      setTimeout(() => setStage("app"), 900);
    }
  }, [stage]);

  const kbju = getKBJU(profile);

  // Здесь можно подставить реальные данные из meals, если есть
  const summary = { calories: 1200, protein: 60, fat: 40, carb: 150 };

  if (stage === "splash") {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(120deg,#eef5fe 30%,#dffcf9 90%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 26,
            color: "#229ED9",
            fontWeight: 800,
            letterSpacing: ".01em",
            marginTop: 15,
          }}
        >
          SmartFitness AI
        </div>
        <div
          style={{
            marginTop: 19,
            fontSize: 17,
            color: "#7dbbf3",
            fontWeight: 600,
            letterSpacing: ".02em",
          }}
        >
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafbfc",
        fontFamily: "system-ui",
        position: "relative",
      }}
    >
      <Header onMenuClick={() => setSideMenuOpen(true)} />
      <SideMenu
        open={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        current={tab}
        onSelect={setTab}
        profile={profile}
      />
      <div style={{ height: 64 }} /> {/* отступ под header */}
      {tab === "home" && (
        <div
          style={{
            maxWidth: 430,
            margin: "0 auto",
            padding: "32px 0 18px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="progress-rings-row" style={{ marginTop: 0 }}>
            <CaloriesRing value={summary.calories} max={kbju.calories} />
          </div>
          <div className="mainpage-macros-row">
            <MacroBar label="Белки" value={summary.protein} max={kbju.protein} color="#5fc77f" />
            <MacroBar label="Жиры" value={summary.fat} max={kbju.fat} color="#ffb24a" />
            <MacroBar label="Углеводы" value={summary.carb} max={kbju.carb} color="#3bafe8" />
          </div>
        </div>
      )}
    </div>
  );
}
