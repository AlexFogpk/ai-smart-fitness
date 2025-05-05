import React, { useState, useEffect } from "react";

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

// --- ОСНОВНОЙ КОМПОНЕНТ ---
function App() {
  // стадии: welcome -> rename -> loading -> onboard -> dashboard
  const [stage, setStage] = useState("welcome");
  const [telegramName, setTelegramName] = useState("");
  const [name, setName] = useState(""); // отображаемое имя
  const [user, setUser] = useState(null); // параметры и цель  
  const [today, setToday] = useState({ calories: 0, protein: 0, fat: 0, carb: 0 });

  // При первом запуске попробуем получить имя из Telegram WebApp
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe?.user?.first_name) {
      setTelegramName(window.Telegram.WebApp.initDataUnsafe.user.first_name);
      setName(window.Telegram.WebApp.initDataUnsafe.user.first_name);
    }
  }, []);

  // --- 1. АНИМАЦИОННОЕ ПРИВЕТСТВИЕ (stage = "welcome") ---
  if (stage === "welcome") {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: "linear-gradient(130deg, #f6f8fc 55%, #e2ecfc 100%)",
        overflow: "hidden", position: "relative"
      }}>
        <div style={{
          width: 330, borderRadius: 28, background: "#fff", boxShadow: "0 6px 32px #dfedef70, 0 1.5px 12px #e3eaff38",
          padding: "32px 20px", textAlign: "center", position: "relative", zIndex: 2,
          animation: "fadein-up 1s cubic-bezier(.16,1,.3,1)"
        }}>
          <div style={{ fontSize: 44, fontWeight: 700, marginBottom: 6, marginTop: 2, color: "#222" }}>
            👋 Привет{(name || telegramName) ? `, ${name || telegramName}!` : "!"}
          </div>
          <div style={{ color: "#6d7887", fontSize: 18, fontWeight: 500, marginBottom: 26 }}>
            Это твой SmartFitness AI.  
            {name || telegramName ? <> Это твоё имя? </> : <> Как тебя зовут?</>}
          </div>
          <div style={{ margin: "20px 0" }}>
            <button
              style={{
                fontSize: 19, fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#68e0cf 70%,#72a6e3 120%)",
                border: 0, borderRadius: 14, padding: "14px 28px", marginRight: 12, marginBottom: 8, cursor: "pointer", boxShadow: "0 4px 23px #63d1c324"
              }}
              onClick={() => setStage("loading")}
            >
              Да, всё верно!
            </button>
            <button
              style={{
                fontSize: 17, fontWeight: 700, color: "#68e0cf", background: "#f7fbfb",
                border: "1.6px solid #68e0cf30", borderRadius: 13, padding: "14px 22px", marginLeft: 12, marginBottom: 8, cursor: "pointer"
              }}
              onClick={() => setStage("rename")}
            >
              Нет, изменить
            </button>
          </div>
        </div>
        {/* Фоновые круги-анимации */}
        <div style={{
          position: "absolute", width: 310, height: 310, borderRadius: "50%",
          left: -90, top: -70, background: "linear-gradient(140deg, #6caeef50, #68e0cf22)", zIndex: 1, filter: "blur(6px) opacity(0.6)"
        }} />
        <div style={{
          position: "absolute", width: 230, height: 230, borderRadius: "50%",
          right: -70, bottom: -50, background: "linear-gradient(90deg, #e27d6e22 55%, #f4ce6826)", zIndex: 1, filter: "blur(8px) opacity(0.7)"
        }} />
        <style>{`
          @keyframes fadein-up {
            0% { opacity:0; transform: translateY(60px) scale(0.98); }
            80% { opacity:0.9; transform: translateY(-5px) scale(1.05);}
            100% { opacity:1; transform: translateY(0) scale(1);}
          }
        `}</style>
      </div>
    );
  }

  // --- 2. Смена имени (stage = "rename") ---
  if (stage === "rename") {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: "linear-gradient(130deg, #f6f8fc 55%, #e2ecfc 100%)", fontFamily: "SF Pro Display, sans-serif"
      }}>
        <form
          style={{
            background: "#fff",
            borderRadius: 22, boxShadow: "0 4px 24px #dfedef60",
            padding: "28px 17px", width: 330, textAlign: "center"
          }}
          onSubmit={e => { e.preventDefault(); setStage("loading"); }}
        >
          <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 20, color: "#14213d" }}>
            Как тебя зовут?
          </div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ваше имя"
            required
            style={{
              width: "96%",
              fontSize: 19,
              padding: "15px 14px",
              marginBottom: 22,
              border: "1.6px solid #ebeef4",
              borderRadius: 11,
              background: "#f6f8fc",
              color: "#14213d",
              fontWeight: 700,
              outline: "none"
            }}
          />
          <button type="submit" style={{
            width: "99%", background: "linear-gradient(135deg,#68e0cf 60%,#6ccf83)", padding: "13px", borderRadius: 14,
            color: "#fff", border: 0, fontWeight: 800, fontSize: 19,
            letterSpacing: ".01em", boxShadow: "0 2px 12px #63d1c380", marginTop: 10, cursor: "pointer"
          }}>
            Сохранить имя
          </button>
        </form>
      </div>
    );
  }

  // --- 3. Анимационная загрузка (stage = "loading") ---
  if (stage === "loading") {
    setTimeout(() => setStage("onboard"), 1200);
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: "radial-gradient(ellipse at 60% 35%, #f7fbfd 0%,#68e0cf22 50%, #e2ecfc 100%)"
      }}>
        <div style={{ textAlign: "center" }}>
          {/* Яблочный style лоадер */}
          <svg width="68" height="68" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="21"
              stroke="#68e0cf"
              strokeWidth="5"
              fill="none"
              strokeDasharray="120"
              strokeDashoffset="80"
              style={{ animation: "lspin 1.13s linear infinite" }}
            />
            <style>
              {`
                @keyframes lspin {
                  0% { stroke-dashoffset: 120; }
                  100% { stroke-dashoffset: 0;}
                }
              `}
            </style>
          </svg>
          <div style={{
            color: "#68e0cf", fontWeight: 700, fontSize: 19, marginTop: 16, letterSpacing: ".01em"
          }}>
            <span>Индивидуальная настройка...</span>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. ФОРМА ЦЕЛЕЙ (stage = "onboard") ---
  if (stage === "onboard" && !user) {
    const formFieldStyle = {
      width: "100%", marginTop: 5, padding: "10px 12px", borderRadius: 12,
      border: "1px solid #e3ebf3", outline: "none", fontSize: 16, background: "#f6f8fc",
      color: "#14213d", fontWeight: 500,
    };
    return (
      <div style={{
        minHeight: '100vh',
        background: "linear-gradient(135deg, #f6f8fc 60%, #e1f6ef 120%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "SF Pro Display, sans-serif"
      }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const formUser = {
              sex: fd.get("sex"),
              weight: Number(fd.get("weight")),
              height: Number(fd.get("height")),
              age: Number(fd.get("age")),
              activity: fd.get("activity"),
              goal: fd.get("goal"),
              name  // записываем в user
            };
            setUser(formUser);
          }}
          style={{
            background: "#fff",
            borderRadius: 27,
            boxShadow: "0 4px 32px #e0f5ee70, 0 1.5px 12px #bbc6e238",
            padding: "36px 22px 32px 22px", minWidth: 280, maxWidth: 350,
            width: "100%", margin: "auto", color: "#14213d"
          }}
        >
          <h2 style={{
            textAlign: "center", fontWeight: 900,
            fontSize: 22, marginBottom: 18, color: "#1d3557", letterSpacing: ".01em"
          }}>
            {name ? <>Отлично, {name}! Теперь твои параметры:</> : <>Твои параметры</>}
          </h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }} htmlFor="sex">Пол:</label><br />
            <select required name="sex" defaultValue="male" style={formFieldStyle}>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }} htmlFor="age">Возраст:</label>
            <input required type="number" name="age" min={10} max={100} style={formFieldStyle} placeholder="Например, 25" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }} htmlFor="height">Рост (см):</label>
            <input required type="number" name="height" min={120} max={250} style={formFieldStyle} placeholder="Например, 180" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }} htmlFor="weight">Вес (кг):</label>
            <input required type="number" name="weight" min={30} max={250} style={formFieldStyle} placeholder="Например, 70" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }} htmlFor="activity">Активность:</label>
            <select required name="activity" defaultValue="1.2" style={formFieldStyle}>
              <option value="1.2">Минимальная</option>
              <option value="1.375">Лёгкая (1-3 трен./нед)</option>
              <option value="1.55">Средняя (3-5 трен./нед)</option>
              <option value="1.725">Высокая</option>
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }} htmlFor="goal">Цель:</label>
            <select required name="goal" defaultValue="weight-loss" style={formFieldStyle}>
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

  // --- 5. ДАШБОРД (после всех шагов) ---
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

  // --- заглушка ---  
  return null;
}

// --- Из прошлой версии ---
// Круговое кольцо (прототип — позже дадим многослойное, как Apple Watch)
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

// "progress bar" для мини-полосок под кольцом
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
