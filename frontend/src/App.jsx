import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaAppleAlt, FaDumbbell, FaRobot, FaCog } from "react-icons/fa";

// ----- Утилита для КБЖУ
function calcKBJU({ sex, weight, height, age, activity, goal }) {
  let bmr =
    sex === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  let tdee = bmr * Number(activity);
  if (goal === "weight-loss") tdee -= 300;
  else if (goal === "weight-gain") tdee += 300;
  let protein = Math.round((tdee * 0.25) / 4);
  let fat = Math.round((tdee * 0.30) / 9);
  let carb = Math.round((tdee * 0.45) / 4);
  return {
    calories: Math.round(tdee),
    protein,
    fat,
    carb,
  };
}

// ----- Главный компонент
function App() {
  // splash -> welcome -> onboard -> dashboard
  const [stage, setStage] = useState("splash");
  const [name, setName] = useState("");
  const [user, setUser] = useState(null); // параметры
  const [today, setToday] = useState({ calories: 0, protein: 0, fat: 0, carb: 0 });
  const [tab, setTab] = useState("home");
  const [params, setParams] = useState({
    sex: "male", age: "", height: "", weight: "",
    activity: "1.2", goal: "weight-loss"
  });
  const inputRef = useRef();
  const [typed, setTyped] = useState(""); // для анимации печатающегося текста
  const [telegramName, setTelegramName] = useState("");

  // ----- Splash (анимированный)
  useEffect(() => {
    if (stage === "splash") {
      setTimeout(() => setStage("welcome"), 2300);
    }
  }, [stage]);

  // Получаем имя из Telegram только один раз (при старте)
  useEffect(() => {
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      window.Telegram.WebApp.initDataUnsafe?.user?.first_name
    ) {
      setTelegramName(window.Telegram.WebApp.initDataUnsafe.user.first_name);
    }
  }, []);

  // Если имя из Telegram подтянулось, сразу записываем его и переходим к анкете
  useEffect(() => {
    if (stage === "welcome" && telegramName) {
      setName(telegramName);
      setTimeout(() => setStage("onboard"), 900); // маленькая задержка для анимации welcome
    }
  }, [stage, telegramName]);

  // ----- Печатающийся текст на welcome
  useEffect(() => {
    if (stage === "welcome" && !telegramName) {
      const full = "Добро пожаловать в SmartFitness AI!";
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

  // ----- Splash -----
  if (stage === "splash") {
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", background: "linear-gradient(120deg,#eef5fe 20%,#dffcf9 90%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 17 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <AppleSpinner />
          <motion.div
            style={{
              fontSize: 29, color: "#1d3557", fontWeight: 800, letterSpacing: ".01em", marginTop: 16
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .18, duration: .7 }}
          >
            SmartFitness AI
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ----- Приветствие -----
  if (stage === "welcome") {
    // Показываем красивый приветственный экран и ждём загрузку имени
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", background: "linear-gradient(120deg,#f3f7fa 10%,#f2fff6 90%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          style={{
            padding: "34px 10px 30px 10px", background: "#fff", borderRadius: 29,
            boxShadow: "0 4px 38px #ddeff940", width: "95vw", maxWidth: 390, minHeight: 270,
            display: "flex", flexDirection: "column", alignItems: "center"
          }}
        >
          <TypingText text={typed || `Здравствуйте${telegramName ? ', ' + telegramName : ""}!`} style={{
            fontSize: 26, fontWeight: 800, color: "#1d3557",
            minHeight: 38, marginBottom: 21, marginTop: 5
          }} />
          {!telegramName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: .5, duration: .7 }}
              style={{ fontSize: 18, color: "#888", marginTop: 18 }}
            >
              Ожидание данных Telegram...
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // ----- Анкета -----
  if (stage === "onboard" && !user) {
    const formFieldStyle = {
      width: "100%", marginTop: 5, padding: "13px 12px", borderRadius: 12,
      border: "1px solid #e3ebf3", outline: "none", fontSize: 17, background: "#f6f8fc",
      color: "#14213d", fontWeight: 500, boxSizing: "border-box"
    };
    const handleChange = e => {
      const { name, value } = e.target;
      setParams(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = e => {
      e.preventDefault();
      document.activeElement && document.activeElement.blur();
      if (params.age && params.height && params.weight) {
        setUser({
          ...params,
          age: Number(params.age),
          height: Number(params.height),
          weight: Number(params.weight),
          name
        });
      }
    };
    return (
      <div style={{
        minHeight: "100vh", width: "100vw",
        background: "linear-gradient(135deg, #f5fafd 60%, #e1f6ef 120%)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <motion.form
          onSubmit={handleSubmit}
          autoComplete="off"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          style={{
            background: "#fff", borderRadius: 25,
            boxShadow: "0 4px 24px #ddeff940",
            padding: "27px 7px 18px 7px", width: "99vw", maxWidth: 385, margin: "0 auto",
            color: "#14213d", boxSizing: "border-box"
          }}
        >
          <h2 style={{
            textAlign: "center", fontWeight: 900,
            fontSize: 22, marginBottom: 16, color: "#1d3557", letterSpacing: ".01em"
          }}>
            {name ? <>Введи параметры, {name}!</> : <>Твои параметры</>}
          </h2>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: "600" }}>Пол:</label><br />
            <select name="sex" value={params.sex} onChange={handleChange} style={formFieldStyle}>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: "600" }}>Возраст:</label>
            <input type="number" name="age" min={10} max={100}
              style={formFieldStyle}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="25"
              value={params.age}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: "600" }}>Рост (см):</label>
            <input type="number" name="height" min={120} max={250}
              style={formFieldStyle}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="180"
              value={params.height}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: "600" }}>Вес (кг):</label>
            <input type="number" name="weight" min={30} max={250}
              style={formFieldStyle}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="70"
              value={params.weight}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: "600" }}>Активность:</label>
            <select name="activity" value={params.activity} onChange={handleChange} style={formFieldStyle}>
              <option value="1.2">Минимальная</option>
              <option value="1.375">Лёгкая (1-3 трен./нед)</option>
              <option value="1.55">Средняя (3-5 трен./нед)</option>
              <option value="1.725">Высокая</option>
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: "600" }}>Цель:</label>
            <select name="goal" value={params.goal} onChange={handleChange} style={formFieldStyle}>
              <option value="weight-loss">Похудение</option>
              <option value="maintain">Поддержание</option>
              <option value="weight-gain">Набор массы</option>
            </select>
          </div>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            style={{
              width: "100%", background: "linear-gradient(135deg,#68e0cf 60%,#6ccf83)", padding: "15px",
              borderRadius: 15, color: "#fff", border: 0, fontWeight: 800, fontSize: 19, letterSpacing: ".01em",
              boxShadow: "0 2px 12px #63d1c380", marginTop: 8, transition: "0.13s", cursor: "pointer"
            }}>
            Сохранить и продолжить
          </motion.button>
        </motion.form>
      </div>
    );
  }

  // ----- DASHBOARD -----
  if (user) {
    const kbju = calcKBJU(user);
    // процент для колец и прогресса
    const pct = (val, max) => Math.min(100, Math.round((val / max) * 100));
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", background: "#fafbf8",
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        {/* Верхняя секция: кольца прогресса */}
        <motion.div
          initial={{ opacity: 0, y: -22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          style={{
            width: "100%", maxWidth: 450, margin: "0 auto", marginBottom: 8,
            paddingTop: 25, display: "flex", flexDirection: "column", alignItems: "center"
          }}>
          {/* Три кольца БЖУ */}
          <div style={{
            display: "flex", gap: 28, justifyContent: "center", marginBottom: 7
          }}>
            <AnimatedRing percent={pct(today.protein, kbju.protein)} color="#6CCF83" size={70} label="Белки" value={today.protein} max={kbju.protein} />
            <AnimatedRing percent={pct(today.fat, kbju.fat)} color="#ffbf47" size={70} label="Жиры" value={today.fat} max={kbju.fat} />
            <AnimatedRing percent={pct(today.carb, kbju.carb)} color="#40a4ff" size={70} label="Углеводы" value={today.carb} max={kbju.carb} />
          </div>
          {/* Кольцо калорий */}
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <AnimatedRing percent={pct(today.calories, kbju.calories)} color="#ff5252" size={108}
              label="Калории" value={today.calories} max={kbju.calories} big />
          </div>
        </motion.div>
        {/* Кнопки действий */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .25, duration: .7 }}
          style={{ width: "100%", maxWidth: 410, marginBottom: 2, display: "flex", gap: 13, justifyContent: "center" }}>
          <motion.button whileTap={{ scale: 0.98 }} style={{
            flex: 1, background: "linear-gradient(135deg,#2573ff 60%,#53ddc9)", color: "#fff",
            border: "none", borderRadius: 15, fontWeight: 700, fontSize: 17, padding: "15px 0",
            boxShadow: "0 2px 14px #63d1c326", cursor: "pointer"
          }}
            onClick={() => setToday(t => ({
              ...t,
              calories: t.calories + 120, protein: t.protein + 5, fat: t.fat + 2, carb: t.carb + 15
            }))}
          >Добавить еду</motion.button>
          <motion.button whileTap={{ scale: 0.98 }} style={{
            flex: 1, background: "linear-gradient(135deg,#68e0cf 60%,#6ccf83)",
            color: "#fff", border: "none", borderRadius: 15, fontWeight: 700, fontSize: 17, padding: "15px 0",
            boxShadow: "0 2px 14px #63d1c326", cursor: "pointer"
          }}>Тренер ИИ</motion.button>
        </motion.div>
        {/* Переключатель табов */}
        <div style={{ flexGrow: 1, width: "100%", maxWidth: 480, paddingTop: 8, paddingBottom: 84, boxSizing: "border-box" }}>
          <AnimatePresence mode="wait">
            {tab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: .7 }}
                style={{
                  width: "99vw", maxWidth: 480, padding: "1vw", boxSizing: "border-box"
                }}>
                {/* Тут могут быть последние блюда, статистика и т.д. */}
                <div style={{
                  background: "#fff", borderRadius: 22, boxShadow: "0 2px 25px #e9e9f050",
                  padding: "15px 6vw 17px 6vw", marginBottom: 10
                }}>
                  <div style={{ fontSize: 18, fontWeight: 750, marginBottom: 7 }}>Сегодня, {(new Date()).toLocaleDateString()}</div>
                  <div style={{ color: "#444", fontWeight: 500, fontSize: 16, marginBottom: 6 }}>Пример добавления приёма пищи:</div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#111", fontSize: 16, marginBottom: 3 }}>
                    <span>🍳 Яичница</span><span style={{ fontWeight: 700 }}>211 г</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#111", fontSize: 16, marginBottom: 3 }}>
                    <span>🍌 Банан</span><span style={{ fontWeight: 700 }}>90 г</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#111", fontSize: 16, marginBottom: 3 }}>
                    <span>🥗 Салат</span><span style={{ fontWeight: 700 }}>220 г</span>
                  </div>
                </div>
              </motion.div>
            )}
            {tab === "food" && (
              <motion.div
                key="food"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: .7 }}
                style={{
                  background: "#fff", borderRadius: 24, padding: "32px", marginTop: 20,
                  textAlign: "center", color: "#444", fontWeight: 700, fontSize: 21
                }}>Здесь появится раздел "Питание"</motion.div>
            )}
            {tab === "train" && (
              <motion.div
                key="train"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: .7 }}
                style={{
                  background: "#fff", borderRadius: 24, padding: "32px", marginTop: 20,
                  textAlign: "center", color: "#444", fontWeight: 700, fontSize: 21
                }}>Раздел "Тренировки" (скоро!)</motion.div>
            )}
            {tab === "ai" && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: .7 }}
                style={{
                  background: "#fff", borderRadius: 24, padding: "32px", marginTop: 20,
                  textAlign: "center", color: "#444", fontWeight: 700, fontSize: 21
                }}>AI Ассистент (скоро...)</motion.div>
            )}
            {tab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: .7 }}
                style={{
                  background: "#fff", borderRadius: 24, padding: "32px", marginTop: 20,
                  textAlign: "center", color: "#444", fontWeight: 700, fontSize: 21
                }}>
                <div>Настройки (скоро...)</div>
                <div style={{ marginTop: 30, fontWeight: 600, fontSize: 16 }}>
                  Имя в Telegram: <span style={{ color: "#2573ff" }}>{name}</span>
                </div>
                {/* Здесь позже можно сделать смену имени */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Нижнее меню */}
        <motion.div
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18, delay: .18 }}
          style={{
            width: "100vw", position: "fixed", left: 0, bottom: 0, background: "#fff",
            borderTop: "1px solid #eff0f2", boxShadow: "0 -2px 12px #e9f1fe11", height: 68,
            zIndex: 10, display: "flex"
          }}>
          <TabItem isActive={tab === "home"} icon={<FaHome />} label="Главная" onClick={() => setTab("home")} />
          <TabItem isActive={tab === "food"} icon={<FaAppleAlt />} label="Питание" onClick={() => setTab("food")} />
          <TabItem isActive={tab === "train"} icon={<FaDumbbell />} label="Тренировки" onClick={() => setTab("train")} />
          <TabItem isActive={tab === "ai"} icon={<FaRobot />} label="ИИ" onClick={() => setTab("ai")} />
          <TabItem isActive={tab === "settings"} icon={<FaCog />} label="Настройки" onClick={() => setTab("settings")} />
        </motion.div>
      </div>
    );
  }

  return null;
}

// ----- Кольцо прогресса (анимированное)
function AnimatedRing({ percent = 0, color, size = 80, label, value, max, big }) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: .7, delay: big ? .13 : 0 }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center"
      }}
    >
      <Ring percent={percent} color={color} size={size} bgcolor="#f4f4f4" />
      <span style={{
        fontWeight: big ? 800 : 700,
        fontSize: big ? 26 : 15,
        marginTop: big ? -size * 0.47 : -size * 0.35,
        color: color,
        textShadow: big ? "0 1px 7px #fff9" : "none"
      }}>{value}/{max}</span>
      <span style={{
        fontWeight: 500,
        fontSize: big ? 15 : 13,
        color: "#666",
        marginBottom: big ? 0 : 1
      }}>{label}</span>
    </motion.div>
  );
}

// ----- Кольцо прогресса SVG
function Ring({ percent = 0, color = "#2573ff", size = 80, bgcolor = "#ebebf5" }) {
  const r = size * 0.46, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle r={r} cx={size / 2} cy={size / 2} fill="none" stroke={bgcolor} strokeWidth={size * 0.11} />
      <motion.circle
        r={r} cx={size / 2} cy={size / 2}
        fill="none" stroke={color} strokeWidth={size * 0.13}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * percent / 100)}
        style={{ transition: ".7s stroke-dashoffset cubic-bezier(.48,.31,.4,.86)" }}
        animate={{ strokeDashoffset: c - (c * percent / 100) }}
        transition={{ duration: .7 }}
      />
    </svg>
  );
}

// ----- Анимированная иконка Apple/Спиннер
function AppleSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
      style={{
        width: 86, height: 86, marginBottom: 12, position: "relative"
      }}
    >
      <svg width={86} height={86}>
        <circle cx={43} cy={43} r={37} stroke="#6CCF83" strokeWidth={9} fill="none"
          strokeDasharray="90 90" strokeLinecap="round" />
        <circle cx={43} cy={43} r={28} stroke="#68e0cf" strokeWidth={8} fill="none"
          strokeDasharray="40 58" strokeLinecap="round" />
      </svg>
      <svg width={26} height={26} style={{
        position: "absolute", left: 30, top: 30
      }}>
        <path d="M17.2 8.8C16.7 8.2 15.8 7.8 14.8 7.8c-1.2 0-2.3.8-3 1.6-.7.8-1.1 1.7-1.1 2.7 0 1.1.3 2.1.8 2.8.4.5 1 .8 1.9.8 1.2 0 2.3-.8 3-1.6.7-.8 1.1-1.7 1.1-2.7 0-1.2-.3-2.1-.8-2.8z" fill="#222" />
      </svg>
    </motion.div>
  );
}

// ----- Печатающийся текст
function TypingText({ text, style }) {
  return <span style={style}>{text}<span style={{ opacity: .5, fontWeight: 800 }}>|</span></span>;
}

// ----- Нижнее меню (иконки)
function TabItem({ isActive, icon, label, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      style={{
        flex: "1 1 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 17, cursor: "pointer", color: isActive ? "#2573ff" : "#a2a5af",
        padding: "5px 0", transition: ".2s color", position: "relative"
      }}>
      <span style={{ fontSize: 26, marginBottom: 2 }}>{icon}</span>
      <div style={{ fontSize: 13, marginTop: "-2px", letterSpacing: ".01em" }}>{label}</div>
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="tab-underline"
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.8 }}
            transition={{ duration: .3 }}
            style={{
              marginTop: 4, width: 26, height: 3, borderRadius: 2, background: "#2573ff",
              boxShadow: "0 1.5px 6px #a9d4ff55"
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
