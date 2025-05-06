import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaAppleAlt, FaDumbbell, FaRobot, FaCog, FaBolt, FaUtensils } from "react-icons/fa";
import { PiBowlFoodFill } from "react-icons/pi";

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
  name: "Пользователь",
};

// --------- Главный компонент ---------
function App() {
  // --- Навигация ---
  const [tab, setTab] = useState("home"); // home, calc, chat, meals, settings

  // --- Профиль пользователя ---
  const [profile, setProfile] = useState(defaultProfile);

  // --- Цели КБЖУ ---
  const kbju = getKBJU(profile);

  // --- Состояние приёмов пищи ---
  const [meals, setMeals] = useState([
    // { name: "Лосось", grams: 470, protein: 30, carb: 2, fat: 16, calories: 210, emoji: "🐟" }
  ]);

  // --- Итог за день ---
  const summary = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carb: acc.carb + (m.carb || 0),
      fat: acc.fat + (m.fat || 0),
    }),
    { calories: 0, protein: 0, carb: 0, fat: 0 }
  );

  // --- Состояние чата ---
  const [messages, setMessages] = useState([
    // { sender: "ai", text: "Привет! Я ваш ИИ тренер." }
  ]);

  // --- Экран калькулятора: ручной или ИИ ---
  const [calcMode, setCalcMode] = useState("manual"); // manual, ai
  const [aiLoading, setAiLoading] = useState(false);

  // --- Для смены имени в настройках ---
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(profile.name);

  // --- Анимация блоков ---
  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  // --- Добавление еды вручную или с помощью ИИ ---
  function handleAddMeal(meal) {
    setMeals([...meals, meal]);
    setTab("home");
  }

  // --- Сброс профиля ---
  function handleReset() {
    setProfile(defaultProfile);
    setMeals([]);
    setMessages([]);
    setTab("home");
  }

  // --- Обновить имя пользователя ---
  function handleSaveName() {
    setProfile({ ...profile, name: newName.trim() || profile.name });
    setEditName(false);
  }

  // --- UI: Главная страница ---
  function Home() {
    return (
      <motion.div
        key="home"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          width: "100%", maxWidth: 450, margin: "0 auto", padding: "30px 0 70px 0",
          minHeight: "calc(100vh - 70px)", boxSizing: "border-box", background: "#f8f7f4"
        }}
      >
        <div style={{ display: "flex", gap: 18, justifyContent: "flex-start", alignItems: "flex-start" }}>
          {/* Кольцо калорий с логотипом */}
          <div style={{ background: "#fff", borderRadius: 22, boxShadow: "0 2px 16px #e6e6e6", padding: 22, width: 170, minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CaloriesRing value={summary.calories} max={kbju.calories}>
              <BotLogo />
            </CaloriesRing>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#888", marginTop: 8, marginBottom: 10 }}>КАЛОРИИ</div>
            <div style={{ fontWeight: 800, fontSize: 34, marginTop: -90, color: "#222" }}>{summary.calories}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#b9b9b9", marginBottom: 18 }}>{kbju.calories} ккал цель</div>
            <div style={{ width: "100%", marginTop: 15 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#3b3b3b", marginBottom: 5 }}>Обзор</div>
              <MacroBar label="Углеводы" value={summary.carb} max={kbju.carb} color="#3bafe8" />
              <MacroBar label="Белки" value={summary.protein} max={kbju.protein} color="#5fc77f" />
              <MacroBar label="Жиры" value={summary.fat} max={kbju.fat} color="#ffb24a" />
            </div>
          </div>
          {/* Правые карточки */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
            {/* Мини-кольца */}
            <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #e6e6e6", padding: 15, display: "flex", gap: 8, justifyContent: "center" }}>
              <SmallRing value={summary.protein} max={kbju.protein} label="Белки" color="#5fc77f" />
              <SmallRing value={summary.carb} max={kbju.carb} label="Углеводы" color="#3bafe8" />
              <SmallRing value={summary.fat} max={kbju.fat} label="Жиры" color="#ffb24a" />
            </div>
            {/* Сегодня + кнопка добавить еду */}
            <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #e6e6e6", padding: "17px 16px", textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: ".01em" }}>Сегодня</div>
              <div style={{ color: "#888", fontWeight: 600, fontSize: 15, marginBottom: 10 }}>{getDayString()}</div>
              <motion.button
                onClick={() => setTab("calc")}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "linear-gradient(135deg,#3bafe8 70%,#5fc77f)", color: "#fff",
                  fontWeight: 800, fontSize: 18, border: "none", borderRadius: 13,
                  padding: "13px 0", width: "100%", margin: "12px 0 0 0", cursor: "pointer", boxShadow: "0 2px 12px #3bafe82a"
                }}>
                Добавить еду
              </motion.button>
            </div>
            {/* Последние блюда */}
            <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #e6e6e6", padding: "15px 16px", minHeight: 110 }}>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>Последние блюда</div>
              {meals.length === 0 && (
                <div style={{ color: "#aaa", fontSize: 16, marginTop: 15 }}>Пока ничего не добавлено</div>
              )}
              {meals.slice(-4).reverse().map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16, marginBottom: 3 }}>
                  <span>{m.emoji || "🍽️"} {m.name}</span>
                  <span style={{ fontWeight: 700 }}>{m.grams} г</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Логотип и ИИ Кнопка */}
        <div style={{ position: "absolute", left: 24, top: 24, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <BotLogo big />
          <motion.button
            whileTap={{ scale: 0.93 }}
            style={{
              marginTop: 17,
              background: "linear-gradient(135deg,#5fc77f 60%,#3bafe8)", color: "#fff",
              fontWeight: 800, fontSize: 17, border: "none", borderRadius: 11, padding: "11px 25px",
              cursor: "pointer", boxShadow: "0 2px 12px #5fc77f2a"
            }}
            onClick={() => setTab("chat")}
          >
            ИИ Тренер
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // --- Калькулятор питания ---
  function Calculator() {
    const [mode, setMode] = useState(calcMode);
    const [form, setForm] = useState({ name: "", grams: "", protein: "", carb: "", fat: "", calories: "", emoji: "" });
    const [aiQuery, setAiQuery] = useState("");
    const [aiRes, setAiRes] = useState(null);

    function handleManualAdd(e) {
      e.preventDefault();
      if (!form.name || !form.grams) return;
      handleAddMeal({
        name: form.name,
        grams: Number(form.grams),
        protein: Number(form.protein) || 0,
        carb: Number(form.carb) || 0,
        fat: Number(form.fat) || 0,
        calories: Number(form.calories) || 0,
        emoji: form.emoji || "🍽️"
      });
    }

    async function handleAIAnalyze(e) {
      e.preventDefault();
      if (!aiQuery.trim()) return;
      setAiLoading(true);
      setTimeout(() => {
        // Эмуляция ИИ анализа
        const res = {
          name: aiQuery,
          grams: 300,
          protein: 22,
          carb: 36,
          fat: 11,
          calories: 350,
          emoji: "🤖"
        };
        setAiRes(res);
        setForm(res);
        setAiLoading(false);
      }, 1200);
    }

    return (
      <motion.div
        key="calc"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          width: "100%", maxWidth: 450, margin: "0 auto", padding: "30px 0 70px 0",
          minHeight: "calc(100vh - 70px)", boxSizing: "border-box", background: "#f8f7f4"
        }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <motion.button whileTap={{ scale: 0.97 }} style={{
            flex: 1, background: mode === "manual" ? "#3bafe8" : "#f2f2f2", color: mode === "manual" ? "#fff" : "#222",
            fontWeight: 700, border: "none", borderRadius: 12, padding: "12px 0", fontSize: 17, cursor: "pointer"
          }} onClick={() => { setMode("manual"); setCalcMode("manual"); }}>Вручную</motion.button>
          <motion.button whileTap={{ scale: 0.97 }} style={{
            flex: 1, background: mode === "ai" ? "#5fc77f" : "#f2f2f2", color: mode === "ai" ? "#fff" : "#222",
            fontWeight: 700, border: "none", borderRadius: 12, padding: "12px 0", fontSize: 17, cursor: "pointer"
          }} onClick={() => { setMode("ai"); setCalcMode("ai"); }}>С помощью ИИ</motion.button>
        </div>
        {mode === "manual" && (
          <form onSubmit={handleManualAdd} autoComplete="off" style={{
            background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #e6e6e6", padding: 22
          }}>
            <div style={{ fontSize: 21, fontWeight: 700, marginBottom: 18 }}>Добавить блюдо</div>
            <input required placeholder="Название блюда" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
            <input required type="number" min={1} placeholder="Граммовка" value={form.grams} onChange={e => setForm(f => ({ ...f, grams: e.target.value }))} style={inputStyle} />
            <input type="number" placeholder="Белки, г" value={form.protein} onChange={e => setForm(f => ({ ...f, protein: e.target.value }))} style={inputStyle} />
            <input type="number" placeholder="Углеводы, г" value={form.carb} onChange={e => setForm(f => ({ ...f, carb: e.target.value }))} style={inputStyle} />
            <input type="number" placeholder="Жиры, г" value={form.fat} onChange={e => setForm(f => ({ ...f, fat: e.target.value }))} style={inputStyle} />
            <input type="number" placeholder="Калории, ккал" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} style={inputStyle} />
            <input placeholder="🍽️ Эмодзи (по желанию)" value={form.emoji} maxLength={2} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={inputStyle} />
            <motion.button type="submit" whileTap={{ scale: 0.96 }} style={buttonStyle}>Добавить</motion.button>
            <motion.button type="button" whileTap={{ scale: 0.96 }} style={{ ...buttonStyle, background: "#eee", color: "#333", marginTop: 6 }} onClick={() => setTab("home")}>Назад</motion.button>
          </form>
        )}
        {mode === "ai" && (
          <form onSubmit={handleAIAnalyze} autoComplete="off" style={{
            background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #e6e6e6", padding: 22
          }}>
            <div style={{ fontSize: 21, fontWeight: 700, marginBottom: 18 }}>Анализ с помощью ИИ</div>
            <input required placeholder="Опишите блюдо" value={aiQuery} onChange={e => setAiQuery(e.target.value)} style={inputStyle} />
            <motion.button type="submit" whileTap={{ scale: 0.96 }} style={buttonStyle} disabled={aiLoading}>{aiLoading ? "Анализ..." : "Проанализировать"}</motion.button>
            {aiRes && (
              <div style={{ background: "#f4fef7", borderRadius: 10, padding: 12, marginTop: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Результат:</div>
                <div>Название: {aiRes.name}</div>
                <div>Калории: {aiRes.calories} ккал</div>
                <div>Белки: {aiRes.protein} г</div>
                <div>Углеводы: {aiRes.carb} г</div>
                <div>Жиры: {aiRes.fat} г</div>
                <motion.button type="button" whileTap={{ scale: 0.96 }} style={buttonStyle} onClick={() => handleAddMeal(aiRes)}>Добавить в рацион</motion.button>
              </div>
            )}
            <motion.button type="button" whileTap={{ scale: 0.96 }} style={{ ...buttonStyle, background: "#eee", color: "#333", marginTop: 9 }} onClick={() => setTab("home")}>Назад</motion.button>
          </form>
        )}
      </motion.div>
    );
  }

  // --- ИИ Тренер (чат) ---
  function AIChat() {
    const [input, setInput] = useState("");
    const [pending, setPending] = useState(false);

    function sendMessage(e) {
      e.preventDefault();
      if (!input.trim()) return;
      setMessages(msgs => [...msgs, { sender: "user", text: input }]);
      setInput("");
      setPending(true);
      setTimeout(() => {
        setMessages(msgs => [...msgs, { sender: "ai", text: `Это ответ ИИ на: "${input}"` }]);
        setPending(false);
      }, 1100);
    }

    return (
      <motion.div
        key="ai"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          width: "100%", maxWidth: 450, margin: "0 auto", padding: "30px 0 70px 0",
          minHeight: "calc(100vh - 70px)", boxSizing: "border-box", background: "#f8f7f4",
          display: "flex", flexDirection: "column"
        }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
          <BotLogo big />
          <span style={{ fontWeight: 800, fontSize: 26, marginLeft: 12 }}>ИИ Тренер</span>
        </div>
        <div style={{
          flex: 1, background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #e6e6e6", padding: 18,
          overflowY: "auto", marginBottom: 12, minHeight: 180
        }}>
          {messages.length === 0 && <div style={{ color: "#aaa", fontSize: 17 }}>Нет сообщений. Задайте вопрос ИИ тренеру!</div>}
          {messages.map((m, idx) => (
            <div key={idx} style={{
              marginBottom: 13, textAlign: m.sender === "user" ? "right" : "left"
            }}>
              <div style={{
                display: "inline-block", background: m.sender === "user" ? "#d7f1ff" : "#f3f6fa",
                borderRadius: 13, padding: "8px 14px", color: "#222", fontWeight: 600,
                maxWidth: "80%"
              }}>{m.text}</div>
            </div>
          ))}
          {pending && (
            <div style={{ marginBottom: 8, textAlign: "left" }}>
              <div style={{
                display: "inline-block", background: "#f3f6fa",
                borderRadius: 13, padding: "8px 14px", color: "#999", fontWeight: 600, opacity: 0.7
              }}>ИИ печатает...</div>
            </div>
          )}
        </div>
        <form onSubmit={sendMessage} style={{ display: "flex", gap: 7 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Введите вопрос"
            style={{ flex: 1, borderRadius: 11, border: "1px solid #e4e4e4", padding: "11px 14px", fontSize: 17, outline: "none" }}
            disabled={pending}
          />
          <motion.button type="submit" whileTap={{ scale: 0.97 }}
            style={{
              background: "linear-gradient(135deg,#3bafe8 70%,#5fc77f)", color: "#fff",
              border: "none", borderRadius: 11, fontWeight: 800, fontSize: 17, padding: "0 19px", cursor: "pointer"
            }}
            disabled={pending}
          >Отправить</motion.button>
        </form>
        <motion.button type="button" whileTap={{ scale: 0.97 }} style={{
          background: "#eee", color: "#333", borderRadius: 11, padding: "10px 0", fontWeight: 700, fontSize: 16, border: "none", marginTop: 17
        }} onClick={() => setTab("home")}>Назад</motion.button>
      </motion.div>
    );
  }

  // --- Настройки ---
  function Settings() {
    return (
      <motion.div
        key="settings"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          width: "100%", maxWidth: 450, margin: "0 auto", padding: "30px 0 70px 0",
          minHeight: "calc(100vh - 70px)", boxSizing: "border-box", background: "#f8f7f4"
        }}>
        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #e6e6e6", padding: 22, marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Настройки профиля</div>
          {!editName ? (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 5 }}>Имя: <span style={{ color: "#2573ff" }}>{profile.name}</span></div>
              <motion.button whileTap={{ scale: 0.95 }} style={buttonStyle} onClick={() => setEditName(true)}>Изменить имя</motion.button>
            </div>
          ) : (
            <div style={{ marginBottom: 14 }}>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                style={{ ...inputStyle, fontSize: 18, marginBottom: 7 }}
                placeholder="Имя"
              />
              <motion.button whileTap={{ scale: 0.95 }} style={buttonStyle} onClick={handleSaveName}>Сохранить</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} style={{ ...buttonStyle, background: "#eee", color: "#333", marginTop: 7 }} onClick={() => setEditName(false)}>Отмена</motion.button>
            </div>
          )}
          <motion.button whileTap={{ scale: 0.95 }} style={{ ...buttonStyle, background: "#ffedf1", color: "#d32d3b", marginTop: 18 }} onClick={handleReset}>Сбросить профиль</motion.button>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} style={{
          background: "#eee", color: "#333", borderRadius: 11, padding: "10px 0", fontWeight: 700, fontSize: 16, border: "none"
        }} onClick={() => setTab("home")}>Назад</motion.button>
      </motion.div>
    );
  }

  // --- Блюда (история) ---
  function MealsList() {
    return (
      <motion.div
        key="meals"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          width: "100%", maxWidth: 450, margin: "0 auto", padding: "30px 0 70px 0",
          minHeight: "calc(100vh - 70px)", boxSizing: "border-box", background: "#f8f7f4"
        }}>
        <div style={{ fontSize: 23, fontWeight: 800, marginBottom: 17, marginLeft: 8 }}>Все блюда за сегодня</div>
        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #e6e6e6", padding: 22 }}>
          {meals.length === 0 && <div style={{ color: "#aaa", fontSize: 17 }}>Вы ещё не добавили ни одного блюда.</div>}
          {meals.map((m, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, borderBottom: i < meals.length-1 ? "1px solid #eee" : "none", padding: "9px 0"
            }}>
              <span>{m.emoji || "🍽️"} <span style={{ fontWeight: 700 }}>{m.name}</span></span>
              <span style={{ fontWeight: 700 }}>{m.grams} г</span>
            </div>
          ))}
        </div>
        <motion.button whileTap={{ scale: 0.97 }} style={{
          background: "#eee", color: "#333", borderRadius: 11, padding: "10px 0", fontWeight: 700, fontSize: 16, border: "none", marginTop: 22
        }} onClick={() => setTab("home")}>Назад</motion.button>
      </motion.div>
    );
  }

  // --- Рендер ---
  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", position: "relative" }}>
      <AnimatePresence mode="wait">
        {tab === "home" && <Home />}
        {tab === "calc" && <Calculator />}
        {tab === "chat" && <AIChat />}
        {tab === "settings" && <Settings />}
        {tab === "meals" && <MealsList />}
      </AnimatePresence>
      <motion.div
        initial={{ y: 70 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        style={{
          width: "100vw", position: "fixed", left: 0, bottom: 0, background: "#fff",
          borderTop: "1px solid #f0f0f1", boxShadow: "0 -2px 12px #e9f1fe11", height: 70,
          zIndex: 111, display: "flex", justifyContent: "space-around", alignItems: "center"
        }}>
        <TabItem icon={<FaHome />} label="Главная" active={tab === "home"} onClick={() => setTab("home")} />
        <TabItem icon={<FaAppleAlt />} label="Калькулятор" active={tab === "calc"} onClick={() => setTab("calc")} />
        <TabItem icon={<FaRobot />} label="ИИ" active={tab === "chat"} onClick={() => setTab("chat")} />
        <TabItem icon={<FaUtensils />} label="Блюда" active={tab === "meals"} onClick={() => setTab("meals")} />
        <TabItem icon={<FaCog />} label="Настройки" active={tab === "settings"} onClick={() => setTab("settings")} />
      </motion.div>
    </div>
  );
}

// ----- Вспомогательные компоненты -----

// Кольцо калорий с логотипом внутри
function CaloriesRing({ value, max, children }) {
  const pct = Math.min(100, (value / max) * 100);
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
        {children}
      </div>
    </div>
  );
}

// Маленькое кольцо для макроэлементов
function SmallRing({ value, max, label, color }) {
  const pct = Math.min(100, (value / max) * 100);
  const size = 46, r = 18, c = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 55 }}>
      <svg width={size} height={size}>
        <circle r={r} cx={size/2} cy={size/2} stroke="#f2f2f2" strokeWidth={6} fill="none" />
        <motion.circle
          r={r} cx={size/2} cy={size/2}
          fill="none" stroke={color} strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct / 100)}
          animate={{ strokeDashoffset: c - (c * pct / 100) }}
          transition={{ duration: .7 }}
        />
      </svg>
      <div style={{ fontWeight: 800, fontSize: 15, color: color, marginTop: -32 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{label}</div>
    </div>
  );
}

// Прогресс-бар макроэлементов
function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 2 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600 }}>{value} / {max} г</span>
      </div>
      <div style={{ background: "#f0f0f0", borderRadius: 7, height: 8, width: "100%" }}>
        <div style={{
          background: color, height: 8, borderRadius: 7, width: `${pct}%`, transition: ".47s"
        }} />
      </div>
    </div>
  );
}

// Логотип бота
function BotLogo({ big }) {
  return (
    <div style={{
      width: big ? 43 : 28, height: big ? 43 : 28, background: "#3bafe8",
      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px #3bafe822"
    }}>
      <PiBowlFoodFill color="#fff" size={big ? 29 : 19} />
    </div>
  );
}

// Кнопка нижнего меню
function TabItem({ icon, label, active, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.86 }}
      onClick={onClick}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 15, cursor: "pointer", color: active ? "#3bafe8" : "#b4b4b4"
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
            marginTop: 3, width: 22, height: 3, borderRadius: 2, background: "#3bafe8",
            boxShadow: "0 1.5px 6px #a9d4ff55"
          }}
        />
      )}
    </motion.div>
  );
}

// Стили для инпутов и кнопок
const inputStyle = {
  width: "100%",
  border: "1.5px solid #e2e7ea",
  borderRadius: 10,
  padding: "11px 13px",
  fontSize: 16,
  marginBottom: 10,
  outline: "none",
  fontWeight: 600,
  color: "#222",
  background: "#f8f9fb"
};

const buttonStyle = {
  width: "100%",
  background: "linear-gradient(135deg,#3bafe8 70%,#5fc77f)",
  color: "#fff",
  fontWeight: 800,
  fontSize: 17,
  border: "none",
  borderRadius: 11,
  padding: "13px 0",
  marginTop: 10,
  cursor: "pointer",
  boxShadow: "0 2px 12px #3bafe82a"
};

export default App;
