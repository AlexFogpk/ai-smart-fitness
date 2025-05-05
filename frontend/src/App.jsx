import React, { useState } from "react";

// Базовая функция для расчета КБЖУ (Миффлина-Сан Жеора, упрощенная)
function calcKBJU({ sex, weight, height, age, activity, goal }) {
  // BMR (основной обмен)
  let bmr =
    sex === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  // ТДЭ (Total Daily Energy Expenditure)
  let tdee = bmr * Number(activity);

  // Учет цели
  if (goal === "weight-loss") tdee -= 300;
  else if (goal === "weight-gain") tdee += 300;

  // Белки/Жиры/Углеводы (проценты для примера)
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
  // "user" — объект с введёнными параметрами/целью
  const [user, setUser] = useState(null);

  // Состояние для 'съеденного' (будет использоваться для заполнения колец)
  const [today, setToday] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carb: 0,
  });

  // Вынесем стили инпут/селект/лейбл для любых тем Telegram
  const formFieldStyle = {
    width: "100%",
    marginTop: 5,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e3ebf3",
    outline: "none",
    fontSize: 16,
    background: "#f6f8fc",
    color: "#14213d",         // фиксируем цвет для всех тем!
    fontWeight: 500,
  };

  // 1. Onboarding-форма
  if (!user) {
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
            };
            setUser(formUser);
          }}
          style={{
            background: "#fff",
            borderRadius: 27,
            boxShadow: "0 4px 32px #e0f5ee70, 0 1.5px 12px #bbc6e238",
            padding: "36px 22px 32px 22px",
            minWidth: 280,
            maxWidth: 350,
            width: "100%",
            margin: "auto",
            color: "#14213d" // все лейблы точно будут темными!
          }}
        >
          {/* Фикс универсальный: для темных тем Telegram */}
          <style>
            {`
              input, select, label, option {
                color: #14213d !important;
                background: #f6f8fc !important;
              }
            `}
          </style>
          <h2 style={{
            textAlign: "center", fontWeight: 900,
            fontSize: 26, marginBottom: 16, color: "#1d3557", letterSpacing: ".01em"
          }}>
            🎯 Персонализация
          </h2>
          <p style={{ textAlign: "center", color: "#6d7887", fontSize: 15, marginBottom: 20 }}>
            Заполни данные и получи индивидуальную цель!
          </p>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }} htmlFor="sex">Пол:</label><br />
            <select required name="sex" defaultValue="male" style={formFieldStyle}>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }} htmlFor="age">Возраст:</label>
            <input required type="number" name="age" min={10} max={100} style={formFieldStyle} placeholder="Например, 25" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }} htmlFor="height">Рост (см):</label>
            <input required type="number" name="height" min={120} max={250} style={formFieldStyle} placeholder="Например, 180" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }} htmlFor="weight">Вес (кг):</label>
            <input required type="number" name="weight" min={30} max={250} style={formFieldStyle} placeholder="Например, 70" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }} htmlFor="activity">Активность:</label>
            <select required name="activity" defaultValue="1.2" style={formFieldStyle}>
              <option value="1.2">Минимальная</option>
              <option value="1.375">Лёгкая (1-3 трен./нед)</option>
              <option value="1.55">Средняя (3-5 трен./нед)</option>
              <option value="1.725">Высокая</option>
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600 }} htmlFor="goal">Цель:</label>
            <select required name="goal" defaultValue="weight-loss" style={formFieldStyle}>
              <option value="weight-loss">Похудение</option>
              <option value="maintain">Поддержание</option>
              <option value="weight-gain">Набор массы</option>
            </select>
          </div>
          <button type="submit" style={{
            width: "100%", background: "linear-gradient(135deg,#68e0cf 60%,#6ccf83)",
            padding: "13px", borderRadius: 15, color: "#fff", border: 0,
            fontWeight: 800, fontSize: 19, letterSpacing: ".01em", boxShadow: "0 2px 12px #63d1c380",
            marginTop: 8, transition: "0.13s", cursor: "pointer"
          }}>
            Сохранить и начать
          </button>
        </form>
      </div>
    )
  }

  // 2. После онбординга — расчет и дашборд
  const kbju = calcKBJU(user);

  // Прогресс — проценты
  const pct = (val, max) => Math.min(100, Math.round((val / max) * 100));

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center",
      background: "linear-gradient(135deg,#fff,#e9e9f7 60%,#d4d8f2)"
    }}>
      <h2 style={{
        marginTop: 28,
        fontWeight: 700,
        color: "#14213d"
      }}>
        Привет, {user.sex === 'male' ? 'тренирующийся' : 'тренирующаяся'}!
      </h2>
      <p style={{ color: "#888" }}>Твоя суточная цель: {kbju.calories} ккал, Б: {kbju.protein} г, Ж: {kbju.fat} г, У: {kbju.carb} г</p>

      {/* Дашборд по кольцам */}
      <div style={{
        margin: 34, padding: "36px 24px", maxWidth: 330, borderRadius: 32,
        boxShadow: "0 8px 32px #d5daf840,0 1.5px 12px #bbc6e238", background: "#fff"
      }}>
        {/* Главное кольцо */}
        <Circle
          pct={pct(today.calories, kbju.calories)}
          label={"Калории"}
          value={today.calories}
          max={kbju.calories}
          color="#68e0cf"
        />
        {/* БЖУ полоски */}
        <MiniBar
          label="Белки"
          value={today.protein}
          max={kbju.protein}
          color="#6ccf83"
        />
        <MiniBar
          label="Жиры"
          value={today.fat}
          max={kbju.fat}
          color="#f4ce68"
        />
        <MiniBar
          label="Углеводы"
          value={today.carb}
          max={kbju.carb}
          color="#e27d6e"
        />
      </div>
      {/* Тестовые кнопки "съесть" */}
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
