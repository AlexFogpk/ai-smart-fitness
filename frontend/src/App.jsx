import React, { useState, useEffect, useRef } from "react";

// --- КАЛЬКУЛЯТОР КБЖУ ---
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

function App() {
  // стадии: splash -> welcome -> rename -> loading -> onboard -> dashboard
  const [stage, setStage] = useState("splash");
  const [telegramName, setTelegramName] = useState("");
  const [name, setName] = useState(""); // отображаемое имя
  const [user, setUser] = useState(null); // параметры и цель  
  const [today, setToday] = useState({ calories: 0, protein: 0, fat: 0, carb: 0 });

  // OnSplash mount — просто timer (2.4 сек)
  useEffect(() => {
    if (stage === "splash") {
      setTimeout(() => setStage("welcome"), 2400);
    }
  }, [stage]);

  // При первом запуске — получаем имя из Telegram WebApp или fallback
  useEffect(() => {
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      window.Telegram.WebApp.initDataUnsafe?.user?.first_name
    ) {
      setTelegramName(window.Telegram.WebApp.initDataUnsafe.user.first_name);
      setName(window.Telegram.WebApp.initDataUnsafe.user.first_name);
    }
  }, []);

  // --- 1. SPLASH ---
  if (stage === "splash") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e8f7ff 20%, #e7fff6 90%)",
        display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"
      }}>
        {/* Apple стиль: лого или кольцо */}
        <div style={{
          animation: "logo-jump 2s cubic-bezier(.7,.14,.16,1) infinite alternate"
        }}>
          <svg width={82} height={82} viewBox="0 0 82 82" fill="none">
            <circle cx={41} cy={41} r={34} stroke="#6CCF83" strokeWidth={9} strokeLinecap="round"
              strokeDasharray="90 85" />
            <circle cx={41} cy={41} r={34} stroke="#68e0cf" strokeWidth={9} strokeLinecap="round"
              strokeDasharray="60 140" transform="rotate(18 41 41)" />
          </svg>
        </div>
        <div style={{
          marginTop: 38, color: "#1d3557", fontSize: 19, fontWeight: 700, letterSpacing: ".01em"
        }}>
          SmartFitness AI
        </div>
        <style>{`
          @keyframes logo-jump {
            0% { transform: scale(1); opacity: 0.91;}
            40% { transform: scale(1.11);}
            100% { transform: scale(1) rotate(6deg);}
          }
        `}</style>
      </div>
    );
  }

  // --- 2. Приветствие (имя) ---
  if (stage === "welcome") {
    return (
      <div style={{
        minHeight: "100vh", background: "linear-gradient(130deg, #f6f8fc 55%, #e2ecfc 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", position: "relative"
      }}>
        <div style={{
          width: "96vw", maxWidth: 390, borderRadius: 22, background: "#fff", margin: "0 auto",
          boxShadow: "0 2px 18px #d9e5ee38", padding: "29px 10px 24px 10px",
          textAlign: "center", position: "relative", zIndex: 2,
          animation: "fadein-up2 .88s cubic-bezier(.16,1,.3,1)"
        }}>
          <div style={{
            fontSize: 41, fontWeight: 800, marginBottom: 6, marginTop: 2, color: "#1d3557", letterSpacing: ".01em"
          }}>
            👋 Привет{(name || telegramName) ? `, ${name || telegramName}!` : "!"}
          </div>
          <div style={{ color: "#6d7887", fontSize: 18, fontWeight: 500, marginBottom: 26 }}>
            Это твой SmartFitness AI.<br />
            {name || telegramName ? <> Это твоё имя?</> : <>Как тебя зовут?</>}
          </div>
          <div style={{ margin: "20px 0" }}>
            <button
              style={{
                fontSize: 20, fontWeight: 700, color: "#fff",
                background: "linear-gradient(135deg,#68e0cf 70%,#6CCF83 120%)",
                border: 0, borderRadius: 14, padding: "14px 20px",
                marginRight: 12, marginBottom: 8, cursor: "pointer",
                boxShadow: "0 4px 23px #63d1c324", minWidth: 160
              }}
              onClick={() => setStage("loading")}
            >
              Да, всё верно!
            </button>
            <button
              style={{
                fontSize: 16.5, fontWeight: 700, color: "#68e0cf", background: "#f7fbfb",
                border: "1.6px solid #68e0cf30", borderRadius: 13, padding: "14px 22px", marginLeft: 12, marginBottom: 8, cursor: "pointer", minWidth: 115
              }}
              onClick={() => setStage("rename")}
            >
              Нет, изменить
            </button>
          </div>
        </div>
        {/* Фон */}
        <div style={{
          position: "absolute", width: 230, height: 230, borderRadius: "50%",
          right: -50, top: -50, background: "linear-gradient(90deg, #e27d6e14 55%, #f4ce681A)",
          zIndex: 1, filter: "blur(8px)"
        }} />
        <style>{`
          @keyframes fadein-up2 {
            0% { opacity:0; transform: translateY(40px);}
            100% { opacity:1; transform:translateY(0);}
          }
        `}</style>
      </div>
    );
  }

  // --- 3. Переименование имени ---
  if (stage === "rename") {
    // автоматически фокусируемся на поле имени
    const refInput = useRef();
    useEffect(() => { setTimeout(() => refInput.current && refInput.current.focus(), 200); }, []);
    return (
      <div style={{
        minHeight: "100vh", background: "linear-gradient(130deg, #f6f8fc 55%, #e2ecfc 100%)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <form
          autoComplete="off"
          style={{
            background: "#fff", borderRadius: 19,
            boxShadow: "0 2px 15px #ccefee12",
            padding: "26px 17px 25px 17px", width: "97vw", maxWidth: 350, textAlign: "center"
          }}
          onSubmit={e => {
            e.preventDefault();
            if (name.trim().length > 1) setStage("loading");
          }}>
          <div style={{ fontWeight: 800, fontSize: 23, marginBottom: 16, color: "#1d3557" }}>
            Введи твоё имя 👇
          </div>
          <input
            ref={refInput}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ваше имя"
            required
            autoFocus
            style={{
              width: "96%", fontSize: 20, padding: "14px 13px", marginBottom: 22,
              border: "1.2px solid #ebeef4", borderRadius: 12, background: "#f6f8fc",
              color: "#14213d", fontWeight: 700, outline: "none"
            }}
            onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
          />
          <button type="submit" style={{
            width: "98%", background: "linear-gradient(135deg,#68e0cf 60%,#6ccf83)",
            padding: "13px", borderRadius: 14, color: "#fff", border: 0,
            fontWeight: 800, fontSize: 18, letterSpacing: ".01em",
            boxShadow: "0 2px 12px #63d1c380", marginTop: 10, cursor: "pointer"
          }}>
            Сохранить имя
          </button>
        </form>
      </div>
    );
  }

  // --- 4. Индивидуальная настройка (LOADING) ---
  if (stage === "loading") {
    useEffect(() => {
      const t = setTimeout(() => setStage("onboard"), 1800);
      return () => clearTimeout(t);
    }, []);
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e8f7ff 30%, #e7fff6 120%)",
        display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"
      }}>
        {/* Apple-style кольцо loader */}
        <div style={{ marginBottom: 34 }}>
          <svg width="68" height="68" viewBox="0 0 50 50">
            <circle
              cx="25" cy="25" r="21"
              stroke="#68e0cf"
              strokeWidth="5"
              fill="none"
              strokeDasharray="120"
              strokeDashoffset="80"
              style={{ animation: "asloader 1.13s linear infinite" }}
            />
            <style>
              {`
                @keyframes asloader {
                  0% { stroke-dashoffset: 120; }
                  100% { stroke-dashoffset: 0;}
                }
              `}
            </style>
          </svg>
        </div>
        <div style={{
          color: "#68e0cf", fontWeight: 700, fontSize: 19, letterSpacing: ".01em", textShadow: "0 2px 6px #fff"
        }}>
          Индивидуальная настройка...
        </div>
      </div>
    );
  }

  // --- 5. ОНБОРДИНГ ФОРМА ---
  if (stage === "onboard" && !user) {
    const formFieldStyle = {
      width: "100%", marginTop: 5, padding: "10px 12px", borderRadius: 12,
      border: "1px solid #e3ebf3", outline: "none", fontSize: 16, background: "#f6f8fc",
      color: "#14213d", fontWeight: 500,
    };
    // Быстрое сохранение значений, блюр после Enter
    const [params, setParams] = useState({ sex: "male", age: "", height: "", weight: "", activity: "1.2", goal: "weight-loss" });
    const handleChange = e => {
      const { name, value } = e.target;
      setParams(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = e => {
      e.preventDefault();
      document.activeElement && document.activeElement.blur();
      setUser({ ...params, age: Number(params.age), height: Number(params.height), weight: Number(params.weight), name });
    };

    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f6f8fc 60%, #e1f6ef 120%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "SF Pro Display, sans-serif"
      }}>
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          style={{
            background: "#fff", borderRadius: 24,
            boxShadow: "0 4px 24px #ddeff960",
            padding: "32px 9px 28px 9px", width: "98vw", maxWidth: 410, margin: "0 auto",
            color: "#14213d"
          }}
        >
          <h2 style={{
            textAlign: "center", fontWeight: 900,
            fontSize: 22, marginBottom: 18, color: "#1d3557", letterSpacing: ".01em"
          }}>
            {name ? <>Отлично, {name}! Теперь укажи параметры:</> : <>Твои параметры</>}
          </h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }} htmlFor="sex">Пол:</label><br />
            <select name="sex" value={params.sex} onChange={handleChange} style={formFieldStyle}>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }} htmlFor="age">Возраст:</label>
            <input type="number" name="age" min={10} max={100}
              style={formFieldStyle}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Например, 25"
              value={params.age}
              onChange={handleChange}
              onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
              autoComplete="off"
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }} htmlFor="height">Рост (см):</label>
            <input type="number" name="height" min={120} max={250}
              style={formFieldStyle}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Например, 180"
              value={params.height}
              onChange={handleChange}
              onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }} htmlFor="weight">Вес (кг):</label>
            <input type="number" name="weight" min={30} max={250}
              style={formFieldStyle}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Например, 70"
              value={params.weight}
              onChange={handleChange}
              onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }} htmlFor="activity">Активность:</label>
            <select name="activity" value={params.activity} onChange={handleChange} style={formFieldStyle}>
              <option value="1.2">Минимальная</option>
              <option value="1.375">Лёгкая (1-3 трен./нед)</option>
              <option value="1.55">Средняя (3-5 трен./нед)</option>
              <option value="1.725">Высокая</option>
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }} htmlFor="goal">Цель:</label>
            <select name="goal" value={params.goal} onChange={handleChange} style={formFieldStyle}>
              <option value="weight-loss">Похудение</option>
              <option value="maintain">Поддержание</option>
              <option value="weight-gain">Набор массы</option>
            </select>
          </div>
          <button type="submit" style={{
            width: "100%", background: "linear-gradient(135deg,#68e0cf 60%,#6ccf83)", padding: "13px",
            borderRadius: 15, color: "#fff", border: 0, fontWeight: 800, fontSize: 19, letterSpacing: ".01em",
            boxShadow: "0 2px 12px #63d1c380", marginTop: 8, transition: "0.13s", cursor: "pointer"
          }}>
            Сохранить и продолжить
          </button>
        </form>
      </div>
    );
  }

  // --- 6. ДАШБОРД ---
  if (user) {
    const kbju = calcKBJU(user);
    const pct = (val, max) => Math.min(100, Math.round((val / max) * 100));
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        background: "linear-gradient(135deg,#fff,#e9e9f7 60%,#d4d8f2)"
      }}>
        <h2 style={{
          marginTop: 28, fontWeight: 700, color: "#14213d"
        }}>
          Привет, {user.name ? user.name : (user.sex === 'male' ? 'тренирующийся' : 'тренирующаяся')}!
        </h2>
        <p style={{ color: "#888" }}>
          Твоя суточная цель: {kbju.calories} ккал, Б: {kbju.protein} г, Ж: {kbju.fat} г, У: {kbju.carb} г
        </p>
        <div style={{
          margin: 34, padding: "36px 24px", maxWidth: 330, borderRadius: 32,
          boxShadow: "0 8px 32px #d5daf840,0 1.5px 12px #bbc6e238", background: "#fff"
        }}>
          <Circle
            pct={pct(today.calories, kbju.calories)}
            label={"Калории"}
            value={today.calories}
            max={kbju.calories}
            color="#68e0cf"
          />
          <MiniBar label="Белки" value={today.protein} max={kbju.protein} color="#6ccf83" />
          <MiniBar label="Жиры" value={today.fat} max={kbju.fat} color="#f4ce68" />
          <MiniBar label="Углеводы" value={today.carb} max={kbju.carb} color="#e27d6e" />
        </div>
        <div>
          <button onClick={() => setToday(t => ({
            ...t,
            calories: t.calories + 120,
            protein: t.protein + 5,
            fat: t.fat + 2,
            carb: t.carb + 15
          }))}
            style={{
              margin: 12, padding: "12px 24px", borderRadius: 12,
              background: "#6ccf83", color: "#fff", border: 0
            }}>
            + Добавить еду (пример)
          </button>
          <button onClick={() => setToday({ calories: 0, protein: 0, fat: 0, carb: 0 })}
            style={{
              margin: 12, padding: "12px 24px", borderRadius: 12,
              background: "#e27d6e", color: "#fff", border: 0
            }}>
            Сбросить
          </button>
        </div>
      </div>
    );
  }

  // --- заглушка для непредусмотренных ситуаций ---
  return null;
}

// Кольцо
function Circle({ pct, label, value, max, color }) {
  const r = 62, c = 2 * Math.PI * r;
  return (
    <div style={{ margin: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={150} height={150} style={{ display: "block" }}>
        <circle r={r} cx={75} cy={75} fill="#f5f6fa" stroke="#e7e8ef" strokeWidth={15} />
        <circle
          r={r} cx={75} cy={75}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct / 100)}
          style={{ transition: ".4s stroke-dashoffset" }}
        />
      </svg>
      <div style={{
        fontSize: 25, fontWeight: 800, marginTop: -90, marginBottom: 78, color
      }}>{value} <span style={{
        fontWeight: 400, fontSize: 14, color: "#999"
      }}>/ {max}</span></div>
      <div style={{
        fontSize: 17, fontWeight: 500, color: "#555"
      }}>{label}</div>
    </div>
  );
}

// Полоски
function MiniBar({ label, value, max, color }) {
  return (
    <div style={{ margin: "11px 0" }}>
      <span style={{ fontWeight: 600, fontSize: 16, color }}>{label}: </span>
      <span style={{ fontWeight: 700 }}>{value}</span> / {max}
      <div style={{ width: "100%", height: "10px", background: "#eee", borderRadius: 8, marginTop: 2 }}>
        <div style={{
          height: "100%", width: `${Math.min(100, value / max * 100)}%`, background: color,
          borderRadius: 8, transition: ".4s width"
        }}></div>
      </div>
    </div>
  );
}

export default App;
