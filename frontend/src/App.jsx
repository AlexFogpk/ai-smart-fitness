import React from "react";

function App() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#fff,#e9e9f7 60%,#d4d8f2)"
    }}>
      <h1 style={{
        fontFamily: "SF Pro Display,sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: ".03em",
        marginBottom: 8, color: "#222"
      }}>
        AI Smart Fitness
      </h1>
      <p style={{
        color: "#666", fontWeight: 600, fontFamily: "SF Pro Text,sans-serif", marginBottom: 20
      }}>
        Добро пожаловать в твоё ультра-современное фитнес приложение!
      </p>
      <div style={{
        margin: 34, padding: "36px 24px", maxWidth: 320, borderRadius: 32,
        boxShadow: "0 8px 32px #d5daf840,0 1.5px 12px #bbc6e238", background: "#fff"
      }}>
        <div style={{
          width: 160, height: 160, borderRadius: "50%",
          background: "conic-gradient(#68e0cf 65%, #f4ce68 65% 85%, #e27d6e 85%)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "auto"
        }}>
          <div style={{
            width: 120, height: 120, borderRadius: "50%",
            background: "#f5f6fa", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: "#68e0cf" }}>1278</span>
            <span style={{ fontSize: 14, color: "#888" }}>калорий</span>
          </div>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-around", marginTop: 16, fontSize: 15
        }}>
          <div><span role="img" aria-label="">🍗</span> Б 94г</div>
          <div><span role="img" aria-label="">🥑</span> Ж 42г</div>
          <div><span role="img" aria-label="">🍚</span> У 144г</div>
        </div>
        <div style={{
          marginTop: 32, fontWeight: 500, fontSize: 17, color: "#444", textAlign: "center"
        }}>Сегодня ты на пути к своей цели!</div>
      </div>
      <button style={{
        marginTop: 24, padding: "12px 32px", border: "none", borderRadius: 16, background: "#68e0cf",
        color: "#fff", fontWeight: 700, fontSize: 19, cursor: "pointer", boxShadow: "0 2px 12px #63d1c380"
      }}>
        Добавить еду или тренировку
      </button>
    </div>
  );
}

export default App;
