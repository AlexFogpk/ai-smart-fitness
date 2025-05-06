import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaAppleAlt, FaRobot, FaUtensils, FaCog } from "react-icons/fa";
import { PiBowlFoodFill } from "react-icons/pi";

import {
  CalculatorMobile,
  AIChatMobile,
  SettingsMobile,
  MealsMobile,
  MacroBar,
  inputStyle,
  buttonStyle,
} from "./components/MobileExtra";

// --------- Утилиты ---------
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

// --------- Начальные данные ---------
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

// --------- Главный компонент ---------
function App() {
  const [stage, setStage] = useState("splash"); // splash, welcome, app
  const [tab, setTab] = useState("home"); // home, calc, chat, meals, settings
  const [profile, setProfile] = useState(defaultProfile);

  // Имя Telegram
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

  // Splash (загрузка)
  useEffect(() => {
    if (stage === "splash") {
      setTimeout(() => setStage("welcome"), 1700);
    }
  }, [stage]);

  // Welcome (приветствие)
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (stage === "welcome") {
      const name = telegramName || "друг";
      const full = `Добро пожаловать, ${name}!`;
      setTyped("");
      let i = 0;
      const typing = setInterval(() => {
        setTyped(txt => {
          if (i < full.length) {
            i++;
            return full.slice(0, i);
          } else {
            clearInterval(typing);
            return full;
          }
        });
      }, 34);
      return () => clearInterval(typing);
    }
  }, [stage, telegramName]);

  // При инициализации профиля
  useEffect(() => {
    if (stage === "welcome" && telegramName && !profile.name) {
      setProfile(p => ({ ...p, name: telegramName }));
    }
  }, [stage, telegramName, profile.name]);

  // Цели КБЖУ
  const kbju = getKBJU(profile);

  // Состояние приёмов пищи по типу
  const [mealsByType, setMealsByType] = useState(initialMealsByType);

  // Все приёмы в плоском виде для истории/главной
  const allMeals = [
    ...mealsByType.breakfast.map(m => ({ ...m, type: "breakfast" })),
    ...mealsByType.lunch.map(m => ({ ...m, type: "lunch" })),
    ...mealsByType.dinner.map(m => ({ ...m, type: "dinner" })),
    ...mealsByType.snack.map(m => ({ ...m, type: "snack" })),
  ];

  // Итог за день
  const summary = allMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carb: acc.carb + (m.carb || 0),
      fat: acc.fat + (m.fat || 0)
    }),
    { calories: 0, protein: 0, carb: 0, fat: 0 }
  );

  // Состояние чата
  const [messages, setMessages] = useState([]);

  // Для смены имени в настройках
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(profile.name);

  // Для калькулятора питания
  const [calcType, setCalcType] = useState("breakfast"); // breakfast, lunch, dinner, snack
  const [calcMode, setCalcMode] = useState("manual"); // manual, ai
  const [aiLoading, setAiLoading] = useState(false);

  // --------- Splash ---------
  if (stage === "splash") {
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", background: "linear-gradient(120deg,#eef5fe 30%,#dffcf9 90%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          style={{ width: 77, height: 77, marginBottom: 12 }}
        >
          <svg width={77} height={77}>
            <circle cx={38.5} cy={38.5} r={33} stroke="#3baef2" strokeWidth={8} fill="none" strokeDasharray="80 90" strokeLinecap="round" />
            <circle cx={38.5} cy={38.5} r={24} stroke="#68e0cf" strokeWidth={7} fill="none" strokeDasharray="38 50" strokeLinecap="round" />
          </svg>
          <svg width={22} height={22} style={{ position: "absolute", left: 28, top: 28 }}>
            <path d="M15.2 7.8C14.7 7.2 13.8 6.8 12.8 6.8c-1.2 0-2.3.8-3 1.6-.7.8-1.1 1.7-1.1 2.7 0 1.1.3 2.1.8 2.8.4.5 1 .8 1.9.8 1.2 0 2.3-.8 3-1.6.7-.8 1.1-1.7 1.1-2.7 0-1.2-.3-2.1-.8-2.8z" fill="#229ED9" />
          </svg>
        </motion.div>
        <div style={{
          fontSize: 26, color: "#229ED9", fontWeight: 800, letterSpacing: ".01em", marginTop: 15
        }}>
          SmartFitness AI
        </div>
        <div style={{ marginTop: 19, fontSize: 17, color: "#7dbbf3", fontWeight: 600, letterSpacing: ".02em" }}>Загрузка...</div>
      </div>
    );
  }

  // --------- Welcome ---------
  if (stage === "welcome") {
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", background: "linear-gradient(120deg,#f3f7fa 10%,#f2fff6 90%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}
          style={{
            padding: "32px 16px 28px 16px", background: "#fff", borderRadius: 27,
            boxShadow: "0 4px 38px #ddeff940", width: "89vw", maxWidth: 390, minHeight: 230,
            display: "flex", flexDirection: "column", alignItems: "center"
          }}>
          <div style={{
            width: 60, height: 60, background: "#229ED9", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14
          }}>
            <PiBowlFoodFill color="#fff" size={36} />
          </div>
          <span style={{
            fontSize: 25, fontWeight: 800, color: "#1d3557",
            minHeight: 35, marginBottom: 22, marginTop: 3, letterSpacing: ".01em"
          }}>
            {typed}<span style={{ opacity: .5, fontWeight: 900 }}>|</span>
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: 7,
              background: "linear-gradient(135deg,#229ED9 70%,#53ddc9)", color: "#fff",
              fontWeight: 800, fontSize: 18, border: "none", borderRadius: 13,
              padding: "13px 45px", margin: "9px 0 0 0", cursor: "pointer", boxShadow: "0 2px 12px #3bafe82a"
            }}
            onClick={() => setStage("app")}
          >
            Начать
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // --------- Приложение ---------
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafbfc",
        paddingBottom: 66, // Высота MobileMenu
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
      }}
    >
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
      </AnimatePresence>
      <MobileMenu tab={tab} setTab={setTab} />
    </div>
  );
}

// ----------- Мобильные компоненты ----------

function HomeMobile({ kbju, summary, allMeals, onGoToChat, onGoToCalc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
      transition={{ duration: .6 }}
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: "18px 0 0 0",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center"
      }}
    >
      <div style={{
        width: "94%",
        background: "#fff",
        borderRadius: 22,
        boxShadow: "0 2px 14px #ececec",
        padding: "20px 0 18px 0",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <CaloriesRing value={summary.calories} max={kbju.calories} />
        <div style={{ fontSize: 14, fontWeight: 700, color: "#d1d1d1", marginTop: 5, marginBottom: 0, textAlign: "center" }}>КАЛОРИИ</div>
        <div style={{ fontWeight: 800, fontSize: 31, color: "#222", marginTop: -72 }}>{summary.calories}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#b9b9b9", marginBottom: 10 }}>{kbju.calories} цель</div>
        <MacroBar label="Углеводы" value={summary.carb} max={kbju.carb} color="#3bafe8" />
        <MacroBar label="Белки" value={summary.protein} max={kbju.protein} color="#5fc77f" />
        <MacroBar label="Жиры" value={summary.fat} max={kbju.fat} color="#ffb24a" />
        <motion.button
          whileTap={{ scale: 0.93 }}
          style={{
            marginTop: 18,
            background: "linear-gradient(135deg,#35c7a5 60%,#229ED9)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
            border: "none",
            borderRadius: 11,
            padding: "10px 18px",
            cursor: "pointer",
            boxShadow: "0 2px 8px #53ddc94d",
            minWidth: 150
          }}
          onClick={onGoToChat}
        >ИИ Тренер</motion.button>
      </div>
      <div style={{
        width: "94%",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 2px 14px #ececec",
        padding: "15px 15px 19px 15px",
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
        width: "94%",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 2px 14px #ececec",
        padding: "13px 15px 20px 15px",
        minHeight: 77
      }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Последние блюда</div>
        {allMeals.length === 0 ? (
          <div style={{ color: "#aaa", fontSize: 15, marginTop: 11, textAlign: "center" }}>
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

// Кольцо калорий с логотипом внутри
function CaloriesRing({ value, max }) {
  const pct = Math.min(100, (value / max) * 100 || 0);
  const size = 110, r = 48, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, marginBottom: 8 }}>
      <svg width={size} height={size}>
        <circle r={r} cx={size/2} cy={size/2} stroke="#f2f2f2" strokeWidth={10} fill="none" />
        <motion.circle
          r={r} cx={size/2} cy={size/2}
          fill="none" stroke="#ff4941" strokeWidth={13}
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
        <PiBowlFoodFill color="#229ED9" size={37} />
      </div>
    </div>
  );
}

// Нижнее меню для мобильного — всегда прижато к низу!
function MobileMenu({ tab, setTab }) {
  return (
    <motion.div
      initial={{ y: 70 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      style={{
        width: "100vw",
        position: "fixed",
        left: 0,
        bottom: 0,
        background: "#fff",
        borderTop: "1px solid #f0f0f1",
        boxShadow: "0 -2px 12px #e9f1fe11",
        height: 66,
        zIndex: 111,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}>
      <TabItem icon={<FaHome />} label="Главная" active={tab === "home"} onClick={() => setTab("home")} />
      <TabItem icon={<FaAppleAlt />} label="Кальк." active={tab === "calc"} onClick={() => setTab("calc")} />
      <TabItem icon={<FaRobot />} label="ИИ" active={tab === "chat"} onClick={() => setTab("chat")} />
      <TabItem icon={<FaUtensils />} label="Блюда" active={tab === "meals"} onClick={() => setTab("meals")} />
      <TabItem icon={<FaCog />} label="Настройки" active={tab === "settings"} onClick={() => setTab("settings")} />
    </motion.div>
  );
}

function TabItem({ icon, label, active, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.86 }}
      onClick={onClick}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 15, cursor: "pointer", color: active ? "#229ED9" : "#b4b4b4"
      }}>
      <span style={{ fontSize: 26, marginBottom: 2 }}>{icon}</span>
      <div style={{ fontSize: 13, marginTop: "-2px", letterSpacing: ".01em" }}>{label}</div>
      {active && (
        <motion.div
          layoutId="tab-underline"
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0.8 }}
          transition={{ duration: .3 }}
          style={{
            marginTop: 3, width: 22, height: 3, borderRadius: 2, background: "#229ED9",
            boxShadow: "0 1.5px 6px #a9d4ff55"
          }}
        />
      )}
    </motion.div>
  );
}

export default App;
