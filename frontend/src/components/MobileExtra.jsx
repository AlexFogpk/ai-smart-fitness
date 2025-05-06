// --- CalculatorMobile ---
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

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
  onBack,
}) {
  const [form, setForm] = useState({
    name: "",
    grams: "",
    protein: "",
    carb: "",
    fat: "",
    calories: "",
    emoji: "",
  });
  const [aiQuery, setAiQuery] = useState("");
  const [aiRes, setAiRes] = useState(null);

  function handleManualAdd(e) {
    e.preventDefault();
    if (!form.name || !form.grams) return;
    setMealsByType(types => ({
      ...types,
      [calcType]: [
        ...types[calcType],
        {
          name: form.name,
          grams: Number(form.grams),
          protein: Number(form.protein) || 0,
          carb: Number(form.carb) || 0,
          fat: Number(form.fat) || 0,
          calories: Number(form.calories) || 0,
          emoji: form.emoji || "🍽️",
        },
      ],
    }));
    setForm({
      name: "",
      grams: "",
      protein: "",
      carb: "",
      fat: "",
      calories: "",
      emoji: "",
    });
  }

  function handleAIAnalyze(e) {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      // Эмуляция ИИ анализа
      const res = {
        name: aiQuery,
        grams: 200,
        protein: 16,
        carb: 24,
        fat: 8,
        calories: 210,
        emoji: "🤖",
      };
      setAiRes(res);
      setForm(res);
      setAiLoading(false);
    }, 1200);
  }

  // Подсчёт прогресса по каждому приёму пищи
  function summaryType(type) {
    return (mealsByType[type] || []).reduce(
      (acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carb: acc.carb + (m.carb || 0),
        fat: acc.fat + (m.fat || 0),
      }),
      { calories: 0, protein: 0, carb: 0, fat: 0 }
    );
  }

  const types = [
    { key: "breakfast", label: "Завтрак", emoji: "🍳" },
    { key: "lunch", label: "Обед", emoji: "🍲" },
    { key: "dinner", label: "Ужин", emoji: "🍝" },
    { key: "snack", label: "Перекус", emoji: "🍏" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: 530,
        margin: "0 auto",
        padding: "15px 0 0 0",
        position: "relative",
      }}
    >
      <div style={{ padding: "0 11px 10px 11px" }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>
          Калькулятор питания
        </div>
        {/* Вкладки */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 13,
            justifyContent: "space-between",
          }}
        >
          {types.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setCalcType(t.key);
                setCalcMode("manual");
                setAiRes(null);
                setAiQuery("");
                setForm({
                  name: "",
                  grams: "",
                  protein: "",
                  carb: "",
                  fat: "",
                  calories: "",
                  emoji: "",
                });
              }}
              style={{
                flex: 1,
                padding: "9px 0",
                background:
                  calcType === t.key
                    ? "linear-gradient(130deg,#229ED9 80%,#53ddc9)"
                    : "#f7f7f8",
                color: calcType === t.key ? "#fff" : "#222",
                border: "none",
                borderRadius: 11,
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                boxShadow:
                  calcType === t.key
                    ? "0 2px 6px #229ed93a"
                    : "0 1px 3px #eee",
              }}
            >
              <span style={{ fontSize: 16, marginRight: 3 }}>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
        {/* Прогресс по приёму */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 15px #e7f2fa44",
            padding: "12px 14px",
            marginBottom: 13,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
            Прогресс ({types.find((t) => t.key === calcType).label})
          </div>
          <MacroBar
            label="Калории"
            value={summaryType(calcType).calories}
            max={Math.round(kbju.calories / 4)}
            color="#229ED9"
          />
          <MacroBar
            label="Белки"
            value={summaryType(calcType).protein}
            max={Math.round(kbju.protein / 4)}
            color="#5fc77f"
          />
          <MacroBar
            label="Углеводы"
            value={summaryType(calcType).carb}
            max={Math.round(kbju.carb / 4)}
            color="#3bafe8"
          />
          <MacroBar
            label="Жиры"
            value={summaryType(calcType).fat}
            max={Math.round(kbju.fat / 4)}
            color="#ffb24a"
          />
        </div>
        {/* Переключатель режима */}
        <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1,
              background: calcMode === "manual" ? "#229ED9" : "#f2f2f2",
              color: calcMode === "manual" ? "#fff" : "#222",
              fontWeight: 700,
              border: "none",
              borderRadius: 12,
              padding: "12px 0",
              fontSize: 16,
              cursor: "pointer",
            }}
            onClick={() => {
              setCalcMode("manual");
              setAiRes(null);
              setAiQuery("");
            }}
          >
            Вручную
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1,
              background: calcMode === "ai" ? "#5fc77f" : "#f2f2f2",
              color: calcMode === "ai" ? "#fff" : "#222",
              fontWeight: 700,
              border: "none",
              borderRadius: 12,
              padding: "12px 0",
              fontSize: 16,
              cursor: "pointer",
            }}
            onClick={() => {
              setCalcMode("ai");
              setAiRes(null);
              setForm({
                name: "",
                grams: "",
                protein: "",
                carb: "",
                fat: "",
                calories: "",
                emoji: "",
              });
            }}
          >
            С помощью ИИ
          </motion.button>
        </div>
        {/* Форма добавления */}
        {calcMode === "manual" && (
          <form onSubmit={handleManualAdd} autoComplete="off">
            <input
              required
              placeholder="Название блюда"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              style={inputStyle}
            />
            <input
              required
              type="number"
              min={1}
              placeholder="Граммовка"
              value={form.grams}
              onChange={(e) =>
                setForm((f) => ({ ...f, grams: e.target.value }))
              }
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Белки, г"
              value={form.protein}
              onChange={(e) =>
                setForm((f) => ({ ...f, protein: e.target.value }))
              }
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Углеводы, г"
              value={form.carb}
              onChange={(e) =>
                setForm((f) => ({ ...f, carb: e.target.value }))
              }
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Жиры, г"
              value={form.fat}
              onChange={(e) =>
                setForm((f) => ({ ...f, fat: e.target.value }))
              }
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Калории, ккал"
              value={form.calories}
              onChange={(e) =>
                setForm((f) => ({ ...f, calories: e.target.value }))
              }
              style={inputStyle}
            />
            <input
              placeholder="🍽️ Эмодзи (по желанию)"
              value={form.emoji}
              maxLength={2}
              onChange={(e) =>
                setForm((f) => ({ ...f, emoji: e.target.value }))
              }
              style={inputStyle}
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              style={buttonStyle}
            >
              <FaPlus style={{ marginRight: 6, fontSize: 14 }} />
              Добавить
            </motion.button>
          </form>
        )}
        {calcMode === "ai" && (
          <form onSubmit={handleAIAnalyze} autoComplete="off">
            <input
              required
              placeholder="Опишите блюдо"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              style={inputStyle}
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              style={buttonStyle}
              disabled={aiLoading}
            >
              {aiLoading ? "Анализ..." : "Проанализировать"}
            </motion.button>
            {aiRes && (
              <div
                style={{
                  background: "#f4fef7",
                  borderRadius: 10,
                  padding: 12,
                  marginTop: 14,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  Результат:
                </div>
                <div>Название: {aiRes.name}</div>
                <div>Калории: {aiRes.calories} ккал</div>
                <div>Белки: {aiRes.protein} г</div>
                <div>Углеводы: {aiRes.carb} г</div>
                <div>Жиры: {aiRes.fat} г</div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  style={buttonStyle}
                  onClick={() => {
                    setMealsByType((types) => ({
                      ...types,
                      [calcType]: [...types[calcType], aiRes],
                    }));
                    setAiRes(null);
                    setAiQuery("");
                  }}
                >
                  Добавить в рацион
                </motion.button>
              </div>
            )}
          </form>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          style={{
            background: "#eee",
            color: "#333",
            borderRadius: 11,
            padding: "10px 0",
            fontWeight: 700,
            fontSize: 16,
            border: "none",
            marginTop: 18,
            width: "100%",
          }}
          onClick={onBack}
        >
          Назад
        </motion.button>
      </div>
      {/* Список блюд по приёму */}
      <div
        style={{
          padding: "0 11px 11px 11px",
          marginTop: 9,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 15px #e7f2fa22",
            padding: "12px 14px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 7 }}>
            Блюда в разделе "{types.find((t) => t.key === calcType).label}"
          </div>
          {mealsByType[calcType].length === 0 && (
            <div style={{ color: "#aaa", fontSize: 15 }}>
              Пока ничего не добавлено
            </div>
          )}
          {mealsByType[calcType].map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 15,
                marginBottom: 2,
              }}
            >
              <span>
                {m.emoji || "🍽️"} <b>{m.name}</b>
              </span>
              <span style={{ fontWeight: 700 }}>{m.grams} г</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// --- AIChatMobile ---
export function AIChatMobile({ messages, setMessages, onBack, username }) {
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    setInput("");
    setPending(true);
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: `Ответ ИИ на: "${input}"` },
      ]);
      setPending(false);
    }, 1100);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      style={{
        width: "100%",
        maxWidth: 450,
        margin: "0 auto",
        padding: "30px 0 70px 0",
        minHeight: "calc(100vh - 70px)",
        boxSizing: "border-box",
        background: "#f8f7f4",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
        <div
          style={{
            width: 43,
            height: 43,
            background: "#3bafe8",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px #3bafe822",
          }}
        >
          <PiBowlFoodFill color="#fff" size={29} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 26, marginLeft: 12 }}>
          ИИ Тренер
        </span>
      </div>
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 16px #e6e6e6",
          padding: 18,
          overflowY: "auto",
          marginBottom: 12,
          minHeight: 180,
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: "#aaa", fontSize: 17 }}>
            Нет сообщений. Задайте вопрос ИИ тренеру!
          </div>
        )}
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 13,
              textAlign: m.sender === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: m.sender === "user" ? "#d7f1ff" : "#f3f6fa",
                borderRadius: 13,
                padding: "8px 14px",
                color: "#222",
                fontWeight: 600,
                maxWidth: "80%",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {pending && (
          <div style={{ marginBottom: 8, textAlign: "left" }}>
            <div
              style={{
                display: "inline-block",
                background: "#f3f6fa",
                borderRadius: 13,
                padding: "8px 14px",
                color: "#999",
                fontWeight: 600,
                opacity: 0.7,
              }}
            >
              ИИ печатает...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: 7 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите вопрос"
          style={{
            flex: 1,
            borderRadius: 11,
            border: "1px solid #e4e4e4",
            padding: "11px 14px",
            fontSize: 17,
            outline: "none",
          }}
          disabled={pending}
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          style={{
            background: "linear-gradient(135deg,#3bafe8 70%,#5fc77f)",
            color: "#fff",
            border: "none",
            borderRadius: 11,
            fontWeight: 800,
            fontSize: 17,
            padding: "0 19px",
            cursor: "pointer",
          }}
          disabled={pending}
        >
          Отправить
        </motion.button>
      </form>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        style={{
          background: "#eee",
          color: "#333",
          borderRadius: 11,
          padding: "10px 0",
          fontWeight: 700,
          fontSize: 16,
          border: "none",
          marginTop: 17,
        }}
        onClick={onBack}
      >
        Назад
      </motion.button>
    </motion.div>
  );
}

// --- SettingsMobile ---
export function SettingsMobile({
  profile,
  setProfile,
  editName,
  setEditName,
  newName,
  setNewName,
  onBack,
}) {
  const [edit, setEdit] = useState(false);
  const [local, setLocal] = useState(profile);

  function handleSave() {
    setProfile(local);
    setEdit(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      style={{
        width: "100%",
        maxWidth: 450,
        margin: "0 auto",
        padding: "30px 0 70px 0",
        minHeight: "calc(100vh - 70px)",
        boxSizing: "border-box",
        background: "#f8f7f4",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 16px #e6e6e6",
          padding: 22,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
          Настройки профиля
        </div>
        {!edit ? (
          <>
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  marginBottom: 5,
                }}
              >
                Имя:{" "}
                <span style={{ color: "#229ed9" }}>{profile.name}</span>
              </div>
              <div>Пол: {profile.sex === "male" ? "Мужской" : "Женский"}</div>
              <div>Возраст: {profile.age}</div>
              <div>Рост: {profile.height} см</div>
              <div>Вес: {profile.weight} кг</div>
              <div>
                Цель:{" "}
                {
                  {
                    loss: "Похудение",
                    gain: "Набор массы",
                    maintain: "Поддержание",
                  }[profile.goal]
                }
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                style={buttonStyle}
                onClick={() => setEdit(true)}
              >
                Изменить данные
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <input
              value={local.name}
              onChange={(e) =>
                setLocal((p) => ({ ...p, name: e.target.value }))
              }
              style={{ ...inputStyle, fontSize: 18, marginBottom: 7 }}
              placeholder="Имя"
            />
            <div style={{ marginBottom: 5 }}>
              <label>Пол: </label>
              <select
                value={local.sex}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, sex: e.target.value }))
                }
                style={{
                  fontSize: 16,
                  borderRadius: 8,
                  padding: "7px 12px",
                  border: "1.2px solid #e2e7ea",
                  marginLeft: 10,
                }}
              >
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
            <input
              type="number"
              value={local.age}
              min={10}
              max={100}
              onChange={(e) =>
                setLocal((p) => ({ ...p, age: Number(e.target.value) }))
              }
              style={{ ...inputStyle, width: 100, display: "inline-block" }}
              placeholder="Возраст"
            />
            <input
              type="number"
              value={local.height}
              min={100}
              max={250}
              onChange={(e) =>
                setLocal((p) => ({ ...p, height: Number(e.target.value) }))
              }
              style={{ ...inputStyle, width: 120, display: "inline-block", marginLeft: 10 }}
              placeholder="Рост"
            />
            <input
              type="number"
              value={local.weight}
              min={20}
              max={200}
              onChange={(e) =>
                setLocal((p) => ({ ...p, weight: Number(e.target.value) }))
              }
              style={{ ...inputStyle, width: 110, display: "inline-block", marginLeft: 10 }}
              placeholder="Вес"
            />
            <div style={{ margin: "8px 0" }}>
              <label>Цель: </label>
              <select
                value={local.goal}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, goal: e.target.value }))
                }
                style={{
                  fontSize: 16,
                  borderRadius: 8,
                  padding: "7px 12px",
                  border: "1.2px solid #e2e7ea",
                  marginLeft: 10,
                }}
              >
                <option value="loss">Похудение</option>
                <option value="maintain">Поддержание</option>
                <option value="gain">Набор массы</option>
              </select>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              style={buttonStyle}
              onClick={handleSave}
            >
              Сохранить
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              style={{
                ...buttonStyle,
                background: "#eee",
                color: "#333",
                marginTop: 7,
              }}
              onClick={() => setEdit(false)}
            >
              Отмена
            </motion.button>
          </>
        )}
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        style={{
          background: "#eee",
          color: "#333",
          borderRadius: 11,
          padding: "10px 0",
          fontWeight: 700,
          fontSize: 16,
          border: "none",
        }}
        onClick={onBack}
      >
        Назад
      </motion.button>
    </motion.div>
  );
}

// --- MealsMobile ---
export function MealsMobile({ mealsByType, onBack }) {
  const types = [
    { key: "breakfast", label: "Завтрак", emoji: "🍳" },
    { key: "lunch", label: "Обед", emoji: "🍲" },
    { key: "dinner", label: "Ужин", emoji: "🍝" },
    { key: "snack", label: "Перекус", emoji: "🍏" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: 530,
        margin: "0 auto",
        padding: "15px 0 0 0",
        position: "relative",
      }}
    >
      <div style={{ padding: "0 11px 10px 11px" }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>
          История блюд за сегодня
        </div>
        {types.map((t) => (
          <div
            key={t.key}
            style={{
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 2px 8px #e7f2fa22",
              padding: "12px 12px",
              marginBottom: 13,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
              {t.emoji} {t.label}
            </div>
            {mealsByType[t.key].length === 0 && (
              <div style={{ color: "#aaa", fontSize: 15 }}>
                Нет блюд в этом разделе
              </div>
            )}
            {mealsByType[t.key].map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 15,
                  marginBottom: 2,
                }}
              >
                <span>
                  {m.emoji || "🍽️"} <b>{m.name}</b>
                </span>
                <span style={{ fontWeight: 700 }}>{m.grams} г</span>
              </div>
            ))}
          </div>
        ))}
        <motion.button
          whileTap={{ scale: 0.97 }}
          style={{
            background: "#eee",
            color: "#333",
            borderRadius: 11,
            padding: "10px 0",
            fontWeight: 700,
            fontSize: 16,
            border: "none",
            marginTop: 12,
            width: "100%",
          }}
          onClick={onBack}
        >
          Назад
        </motion.button>
      </div>
    </motion.div>
  );
}

// --- Стили для инпутов и кнопок ---
export const inputStyle = {
  width: "100%",
  border: "1.5px solid #e2e7ea",
  borderRadius: 10,
  padding: "11px 13px",
  fontSize: 16,
  marginBottom: 10,
  outline: "none",
  fontWeight: 600,
  color: "#222",
  background: "#f8f9fb",
};

export const buttonStyle = {
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
  boxShadow: "0 2px 12px #3bafe82a",
};

// --- Повтор MacroBar если не импортирован ---
export function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100 || 0);
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
