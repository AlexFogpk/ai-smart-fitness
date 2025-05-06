import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaAppleAlt, FaRobot, FaUtensils, FaCog } from "react-icons/fa";
import LogoRobot from "./LoadingLogos";
import {
  CalculatorMobile,
  AIChatMobile,
  SettingsMobile,
  MealsMobile,
  MacroBar,
} from "./components/MobileExtra";
// === ВАЖНО: импортируй нового робота! ===
import LogoRobot from "./LoadingLogos";

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
  const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четвер��", "Пятница", "Суббота"];
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
      setTimeout(() => setStage("welcome"), 1200);
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

  useEffect(() => {
    if (stage === "welcome" && telegramName && !profile.name) {
      setProfile(p => ({ ...p, name: telegramName }));
    }
  }, [stage, telegramName, profile.name]);

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

  // ===== ЗАМЕНА ЛОГОТИПА ЗАГРУЗКИ =====
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
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, overflow: "hidden"
        }}>
          <LogoRobot />
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafbfc",
        paddingBottom: 72, // чтобы меню не перекрывалось
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

// --- Нижнее меню ---
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
        height: 62,
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
