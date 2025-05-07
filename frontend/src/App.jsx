import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars } from "react-icons/fa";
import SideMenu from "./SideMenu";
import LogoRobot from "./LoadingLogos";
import { PiBowlFoodFill } from "react-icons/pi";
import {
  CalculatorMobile,
  AIChatMobile,
  SettingsMobile,
  MealsMobile,
  MacroBar,
} from "./components/MobileExtra";
import './theme.css';
import Header from "./Header";
import './mainpage.css';

// ------ Утилиты ------
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
function getDayString(date = new Date()) {
  const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
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
const initialMealsByType = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snack: [],
};

// ------ Главный компонент ------
function App() {
  const [stage, setStage] = useState("splash");
  const [tab, setTab] = useState("home");
  const [profile, setProfile] = useState(defaultProfile);

  // Имя Telegram (можно оставить, если используется где-то ещё)
  const [telegramName, setTelegramName] = useState("");
  useEffect(() => {
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      window.Telegram.WebApp.initDataUnsafe?.user?.first_name
    ) {
      setTelegramName(window.Telegram.WebApp.initDataUnsafe.user.first_name);
    }
  }, []);

  // Splash (загрузка) — увеличено до 3 секунд и сразу переход в основной интерфейс
  useEffect(() => {
    if (stage === "splash") {
      setTimeout(() => setStage("app"), 3000);
    }
  }, [stage]);

  // --- ВАЖНО: удалено всё, что связано с welcome, typed и приветствием ---

  const kbju = getKBJU(profile);
  const [mealsByType, setMealsByType] = useState(initialMealsByType);
  const allMeals = [
    ...mealsByType.breakfast.map(m => ({ ...m, type: "breakfast" })),
    ...mealsByType.lunch.map(m => ({ ...m, type: "lunch" })),
    ...mealsByType.dinner.map(m => ({ ...m, type: "dinner" })),
    ...mealsByType.snack.map(m => ({ ...m, type: "snack" })),
  ];
  const summary = allMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carb: acc.carb + (m.carb || 0),
      fat: acc.fat + (m.fat || 0)
    }),
    { calories: 0, protein: 0, carb: 0, fat: 0 }
  );
  const [messages, setMessages] = useState([]);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(profile.name);
  const [calcType, setCalcType] = useState("breakfast");
  const [calcMode, setCalcMode] = useState("manual");
  const [aiLoading, setAiLoading] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  // Кнопка гамбургера
  const Hamburger = (
    <button
      style={{
        position: "fixed", right: 18, top: 18, zIndex: 300,
        background: "#fff", border: "none", borderRadius: "7px",
        padding: "11px 13px", boxShadow: "0 2px 10px #b8e7fa40",
        cursor: "pointer", fontSize: 22, color: "#229ED9"
      }}
      onClick={() => setSideMenuOpen(true)}
      aria-label="Меню"
    >
      <FaBars />
    </button>
  );

  // Splash
  if (stage === "splash") {
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", background: "linear-gradient(120deg,#eef5fe 30%,#dffcf9 90%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <LogoRobot />
        <div style={{
          fontSize: 26, color: "#229ED9", fontWeight: 800, letterSpacing: ".01em", marginTop: 15
        }}>
          SmartFitness AI
        </div>
        <div style={{ marginTop: 19, fontSize: 17, color: "#7dbbf3", fontWeight: 600, letterSpacing: ".02em" }}>Загрузка...</div>
      </div>
    );
  }

  // Основной интерфейс
  return (
    <div style={{ minHeight: "100vh", background: "#fafbfc", fontFamily: "system-ui", position: "relative" }}>
      {Hamburger}
      <SideMenu
        open={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        current={tab}
        onSelect={setTab}
        profile={profile}
      />
      <AnimatePresence mode="wait">
        {tab === "home" && (
          <HomeMobile
            profile={profile}
            kbju={kbju}
            summary={summary}
            allMeals={allMeals}
            onGoToChat={() => setTab("chat")}
            onGoToCalc={() => setTab("calc")}
          />
        )}
        {tab === "calc" && (
          <CalculatorMobile
            kbju={kbju}
            mealsByType={mealsByType}
            setMealsByType={setMealsByType}
            calcType={calcType}
            setCalcType={setCalcType}
            calcMode={calcMode}
            setCalcMode={setCalcMode}
            aiLoading={aiLoading}
            setAiLoading={setAiLoading}
            onBack={() => setTab("home")}
          />
        )}
        {tab === "chat" && (
          <AIChatMobile
            messages={messages}
            setMessages={setMessages}
            onBack={() => setTab("home")}
            username={profile.name}
          />
        )}
        {tab === "settings" && (
          <SettingsMobile
            profile={profile}
            setProfile={setProfile}
            editName={editName}
            setEditName={setEditName}
            newName={newName}
            setNewName={setNewName}
            onBack={() => setTab("home")}
          />
        )}
        {tab === "meals" && (
          <MealsMobile
            mealsByType={mealsByType}
            onBack={() => setTab("home")}
          />
        )}
        {tab === "programs" && (
          <div style={{
            maxWidth: 430, margin: "60px auto 0 auto", padding: "28px", background: "#fff", borderRadius: 18,
            boxShadow: "0 2px 14px #ececec", minHeight: 220
          }}>
            <h2 style={{ color: "#229ED9", fontWeight: 800 }}>Программы тренировок</h2>
            <div style={{ color: "#333", fontSize: 17, marginTop: 20 }}>
              {/* Тут сделай свою логику/контент для программ */}
              Скоро здесь появятся ваши программы тренировок!
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- ГЛАВНАЯ СТРАНИЦА ---
function HomeMobile({ kbju, summary, allMeals, onGoToChat, onGoToCalc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
      transition={{ duration: .6 }}
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: "18px 0 10px 0",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
        minHeight: "calc(100vh - 72px)",
        boxSizing: "border-box"
      }}
    >
      <div style={{
        width: "93%",
        background: "#fff",
        borderRadius: 22,
        boxShadow: "0 2px 14px #ececec",
        padding: "25px 0 18px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <CaloriesRing value={summary.calories} max={kbju.calories} />
        <div style={{ fontWeight: 800, fontSize: 32, color: "#222", marginTop: 9 }}>{summary.calories}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#b9b9b9", marginBottom: 10 }}>
          <span style={{ color: "#229ED9", fontWeight: 800 }}>{kbju.calories}</span> цель
        </div>
        <MacroBar label="Углеводы" value={summary.carb} max={kbju.carb} color="#3bafe8" />
        <MacroBar label="Белки" value={summary.protein} max={kbju.protein} color="#5fc77f" />
        <MacroBar label="Жиры" value={summary.fat} max={kbju.fat} color="#ffb24a" />
        <motion.button
          whileTap={{ scale: 0.93 }}
          style={{
            marginTop: 20,
            background: "linear-gradient(135deg,#35c7a5 60%,#229ED9)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 17,
            border: "none",
            borderRadius: 13,
            padding: "12px 0",
            cursor: "pointer",
            boxShadow: "0 2px 8px #53ddc94d",
            width: "85%",
            maxWidth: 260
          }}
          onClick={onGoToChat}
        >ИИ Тренер</motion.button>
      </div>
      <div style={{
        width: "93%",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 2px 14px #ececec",
        padding: "18px 14px 19px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 2 }}>Сегодня</div>
        <div style={{ color: "#888", fontWeight: 600, fontSize: 14, marginBottom: 10 }}>{getDayString()}</div>
        <motion.button
          onClick={onGoToCalc}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "linear-gradient(135deg,#3bafe8 80%,#53ddc9)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 17,
            border: "none",
            borderRadius: 13,
            padding: "12px 0",
            width: "100%",
            margin: "10px 0 0 0",
            cursor: "pointer",
            boxShadow: "0 2px 12px #3bafe82a"
          }}>
          Добавить еду
        </motion.button>
      </div>
      <div style={{
        width: "93%",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 2px 14px #ececec",
        padding: "15px 14px 22px 14px",
        minHeight: 80
      }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Последние блюда</div>
        {allMeals.length === 0 ? (
          <div style={{ color: "#aaa", fontSize: 15, marginTop: 12, textAlign: "center" }}>
            <span role="img" aria-label="plate" style={{ fontSize: 22 }}>🍽️</span>
            <br />
            <span>Пока ничего не добавлено</span>
          </div>
        ) : (
          allMeals.slice(-3).reverse().map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15, marginBottom: 2 }}>
              <span>{m.emoji || "🍽️"} {m.name}</span>
              <span style={{ fontWeight: 700 }}>{m.grams} г</span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function CaloriesRing({ value, max }) {
  const pct = Math.min(100, (value / max) * 100 || 0);
  const size = 108, r = 44, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, marginBottom: 6 }}>
      <svg width={size} height={size}>
        <circle r={r} cx={size/2} cy={size/2} stroke="#f2f2f2" strokeWidth={9} fill="none" />
        <motion.circle
          r={r} cx={size/2} cy={size/2}
          fill="none" stroke="#229ED9" strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct / 100)}
          animate={{ strokeDashoffset: c - (c * pct / 100) }}
          transition={{ duration: .7 }}
        />
      </svg>
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <PiBowlFoodFill color="#229ED9" size={38} />
      </div>
    </div>
  );
}

export default App;
