import React from "react";
import { motion } from "framer-motion";

// Универсальные стили
export const inputStyle = {
  fontSize: 17,
  border: "1.5px solid #e1e9f3",
  borderRadius: 13,
  padding: "10px 12px",
  outline: "none",
  fontWeight: 600,
  background: "#f5faff",
  marginBottom: 10,
  width: "100%",
  boxSizing: "border-box"
};

export const buttonStyle = {
  border: "none",
  borderRadius: 13,
  background: "linear-gradient(90deg,#229ED9 60%,#53ddc9)",
  color: "#fff",
  fontWeight: 800,
  fontSize: 17,
  padding: "12px 0",
  width: "100%",
  cursor: "pointer",
  margin: "10px 0 0 0",
  boxShadow: "0 2px 12px #3bafe82a"
};

// Прогресс-бар макросов
export function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100 || 0);
  return (
    <div style={{ margin: "7px 0" }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#333", marginBottom: 1 }}>
        {label} <span style={{ color: "#bbb", fontWeight: 500 }}>{value} / {max} г</span>
      </div>
      <div style={{
        width: "100%",
        height: 10,
        background: "#f2f4f8",
        borderRadius: 6,
        overflow: "hidden",
        marginTop: 1
      }}>
        <motion.div
          style={{
            height: 10,
            background: color,
            borderRadius: 6
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: .8 }}
        />
      </div>
    </div>
  );
}

// Калькулятор питания
export function CalculatorMobile({
  kbju,
  mealsByType,
  setMealsByType,
  calcType,
  setCalcType,
  calcMode,
  setCalcMode,
  aiLoading,
  setAiLoading,
  onBack
}) {
  const [meal, setMeal] = React.useState({ name: "", grams: "", calories: "", protein: "", carb: "", fat: "", emoji: "" });

  function handleAddMeal() {
    if (!meal.name || !meal.grams) return;
    setMealsByType((prev) => ({
      ...prev,
      [calcType]: [...prev[calcType], { ...meal, grams: Number(meal.grams), calories: Number(meal.calories), protein: Number(meal.protein), carb: Number(meal.carb), fat: Number(meal.fat) }]
    }));
    setMeal({ name: "", grams: "", calories: "", protein: "", carb: "", fat: "", emoji: "" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: "18px 0 10px 0",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        alignItems: "center",
        minHeight: "calc(100vh - 72px)",
        boxSizing: "border-box"
      }}
    >
      <div style={{
        width: "93%",
        background: "#fff",
        borderRadius: 19,
        boxShadow: "0 2px 14px #ececec",
        padding: "21px 16px 18px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{ width: "100%" }}>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 7 }}>Добавить приём пищи</div>
          <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 10 }}>
            {["breakfast", "lunch", "dinner", "snack"].map(type => (
              <button
                key={type}
                style={{
                  ...buttonStyle,
                  background: calcType === type
                    ? "linear-gradient(90deg,#229ED9 60%,#53ddc9)"
                    : "#f2f4f8",
                  color: calcType === type ? "#fff" : "#229ED9",
                  fontSize: 15,
                  fontWeight: 700,
                  width: 80,
                  margin: 0,
                  padding: "7px 0"
                }}
                onClick={() => setCalcType(type)}
              >
                {type === "breakfast" && "Завтрак"}
                {type === "lunch" && "Обед"}
                {type === "dinner" && "Ужин"}
                {type === "snack" && "Перекус"}
              </button>
            ))}
          </div>
        </div>
        <input style={inputStyle} value={meal.name} onChange={e => setMeal(m => ({ ...m, name: e.target.value }))} placeholder="Название блюда" />
        <input style={inputStyle} value={meal.grams} onChange={e => setMeal(m => ({ ...m, grams: e.target.value.replace(/\D/g, "") }))} placeholder="Граммы" type="number" />
        <input style={inputStyle} value={meal.calories} onChange={e => setMeal(m => ({ ...m, calories: e.target.value.replace(/\D/g, "") }))} placeholder="Калории" type="number" />
        <input style={inputStyle} value={meal.protein} onChange={e => setMeal(m => ({ ...m, protein: e.target.value.replace(/\D/g, "") }))} placeholder="Белки" type="number" />
        <input style={inputStyle} value={meal.carb} onChange={e => setMeal(m => ({ ...m, carb: e.target.value.replace(/\D/g, "") }))} placeholder="Углеводы" type="number" />
        <input style={inputStyle} value={meal.fat} onChange={e => setMeal(m => ({ ...m, fat: e.target.value.replace(/\D/g, "") }))} placeholder="Жиры" type="number" />
        <input style={inputStyle} value={meal.emoji} onChange={e => setMeal(m => ({ ...m, emoji: e.target.value }))} placeholder="Эмодзи (необязательно)" />
        <button style={buttonStyle} onClick={handleAddMeal}>Добавить</button>
        <button style={{ ...buttonStyle, background: "#f2f2f2", color: "#229ED9", marginTop: 6 }} onClick={onBack}>Назад</button>
      </div>
    </motion.div>
  );
}

// Чат с ИИ
export function AIChatMobile({ messages, setMessages, onBack, username }) {
  const [input, setInput] = React.useState("");
  function handleSend() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    // Имитация ответа ИИ!
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "Я ваш AI-тренер! Задайте мне вопрос о питании или тренировках." }]);
    }, 800);
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: "18px 0 10px 0",
        display: "flex",
        flexDirection: "column",
        gap: 13,
        alignItems: "center",
        minHeight: "calc(100vh - 72px)",
        boxSizing: "border-box"
      }}
    >
      <div style={{
        width: "93%",
        background: "#fff",
        borderRadius: 19,
        boxShadow: "0 2px 14px #ececec",
        padding: "21px 16px 18px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        minHeight: 370
      }}>
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Чат с ИИ тренером</div>
        <div style={{ flex: 1, minHeight: 170, maxHeight: 260, overflowY: "auto", marginBottom: 9 }}>
          {messages.length === 0 && (
            <div style={{ color: "#b5b5b5", padding: 13, textAlign: "center" }}>
              Задайте вопрос по питанию или тренировкам!
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#e3f6fb" : "#f2f2f2",
              color: "#222",
              borderRadius: 11,
              padding: "7px 13px",
              marginBottom: 5,
              maxWidth: "92%",
              fontSize: 16,
              fontWeight: 500
            }}>
              {msg.role === "user" && <b>{username || "Вы"}:&nbsp;</b>}
              {msg.text}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <input
            style={{ ...inputStyle, marginBottom: 0, fontSize: 16, flex: 1 }}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ваш вопрос..."
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button style={{ ...buttonStyle, width: 55, minWidth: 55, padding: 0 }} onClick={handleSend}>→</button>
        </div>
        <button style={{ ...buttonStyle, background: "#f2f2f2", color: "#229ED9", marginTop: 8 }} onClick={onBack}>Назад</button>
      </div>
    </motion.div>
  );
}

// Настройки профиля
export function SettingsMobile({
  profile,
  setProfile,
  editName,
  setEditName,
  newName,
  setNewName,
  onBack
}) {
  function handleSaveName() {
    setProfile(p => ({ ...p, name: newName }));
    setEditName(false);
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: "18px 0 10px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "calc(100vh - 72px)",
        boxSizing: "border-box"
      }}
    >
      <div style={{
        width: "93%",
        background: "#fff",
        borderRadius: 19,
        boxShadow: "0 2px 14px #ececec",
        padding: "21px 16px 18px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      }}>
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 13 }}>Настройки профиля</div>
        <div style={{ marginBottom: 9 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Имя:</div>
          {editName ? (
            <div style={{ display: "flex", gap: 7 }}>
              <input style={{ ...inputStyle, marginBottom: 0, fontSize: 15 }} value={newName} onChange={e => setNewName(e.target.value)} />
              <button style={{ ...buttonStyle, width: 60, minWidth: 60, fontSize: 15, padding: 0 }} onClick={handleSaveName}>OK</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#229ED9" }}>{profile.name || "Нет имени"}</span>
              <button style={{ ...buttonStyle, width: 65, minWidth: 65, fontSize: 15, padding: 0, background: "#e1e9f3", color: "#229ED9" }} onClick={() => setEditName(true)}>Изменить</button>
            </div>
          )}
        </div>
        <div style={{ marginBottom: 9 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Возраст:</div>
          <input style={inputStyle} type="number" value={profile.age} onChange={e => setProfile(p => ({ ...p, age: Number(e.target.value) }))} />
        </div>
        <div style={{ marginBottom: 9 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Рост (см):</div>
          <input style={inputStyle} type="number" value={profile.height} onChange={e => setProfile(p => ({ ...p, height: Number(e.target.value) }))} />
        </div>
        <div style={{ marginBottom: 9 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Вес (кг):</div>
          <input style={inputStyle} type="number" value={profile.weight} onChange={e => setProfile(p => ({ ...p, weight: Number(e.target.value) }))} />
        </div>
        <div style={{ marginBottom: 9 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Пол:</div>
          <select style={inputStyle} value={profile.sex} onChange={e => setProfile(p => ({ ...p, sex: e.target.value }))}>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>
        <div style={{ marginBottom: 9 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Активность:</div>
          <select style={inputStyle} value={profile.activity} onChange={e => setProfile(p => ({ ...p, activity: Number(e.target.value) }))}>
            <option value={1.2}>Минимальная</option>
            <option value={1.375}>Лёгкая</option>
            <option value={1.55}>Средняя</option>
            <option value={1.725}>Высокая</option>
            <option value={1.9}>Очень высокая</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Цель:</div>
          <select style={inputStyle} value={profile.goal} onChange={e => setProfile(p => ({ ...p, goal: e.target.value }))}>
            <option value="maintain">Держать вес</option>
            <option value="loss">Похудеть</option>
            <option value="gain">Набрать вес</option>
          </select>
        </div>
        <button style={{ ...buttonStyle, background: "#f2f2f2", color: "#229ED9" }} onClick={onBack}>Назад</button>
      </div>
    </motion.div>
  );
}

// История блюд
export function MealsMobile({ mealsByType, onBack }) {
  function mealTypeRus(type) {
    switch (type) {
      case "breakfast": return "Завтрак";
      case "lunch": return "Обед";
      case "dinner": return "Ужин";
      case "snack": return "Перекус";
      default: return "";
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: "18px 0 10px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "calc(100vh - 72px)",
        boxSizing: "border-box"
      }}
    >
      <div style={{
        width: "93%",
        background: "#fff",
        borderRadius: 19,
        boxShadow: "0 2px 14px #ececec",
        padding: "21px 16px 18px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      }}>
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 13 }}>История блюд</div>
        {["breakfast", "lunch", "dinner", "snack"].map((type) => (
          <div key={type} style={{ marginBottom: 13 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#229ED9", marginBottom: 3 }}>{mealTypeRus(type)}</div>
            {mealsByType[type].length === 0 ? (
              <div style={{ color: "#b5b5b5", fontSize: 15, marginBottom: 7 }}>Пусто</div>
            ) : (
              mealsByType[type].map((meal, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f7fafd",
                  borderRadius: 9,
                  padding: "5px 10px",
                  marginBottom: 3
                }}>
                  <span>{meal.emoji || "🍽️"} {meal.name}</span>
                  <span style={{ fontWeight: 700 }}>{meal.grams} г</span>
                </div>
              ))
            )}
          </div>
        ))}
        <button style={{ ...buttonStyle, background: "#f2f2f2", color: "#229ED9", marginTop: 10 }} onClick={onBack}>Назад</button>
      </div>
    </motion.div>
  );
}
