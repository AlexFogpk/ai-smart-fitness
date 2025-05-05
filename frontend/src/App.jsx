import React, { useState, useEffect, useRef } from "react";

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

// ----- Основной компонент приложения
function App() {
  // Этапы: splash -> welcome -> rename -> onboard -> dashboard
  const [stage, setStage] = useState("splash");
  // Telegram имя
  const [telegramName, setTelegramName] = useState("");
  // Имя, введенное/подтянутое пользователем
  const [name, setName] = useState("");
  const [user, setUser] = useState(null); // параметры
  const [today, setToday] = useState({ calories: 0, protein: 0, fat: 0, carb: 0 });
  const [tab, setTab] = useState("home"); // меню навигации

  // Splash 2.5 сек
  useEffect(() => {
    if (stage === "splash") setTimeout(() => setStage("welcome"), 2500);
  }, [stage]);

  // Telegram имя — подтянуть при запуске, если возможно
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

  // ----- Splash -----
  if (stage === "splash") {
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", background: "linear-gradient(120deg,#eef5fe 20%,#dffcf9 90%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <svg width={86} height={86} style={{marginBottom: 12}}>
          <circle cx={43} cy={43} r={37} stroke="#6CCF83" strokeWidth={9} fill="none"
                  strokeDasharray="90 90" strokeLinecap="round"
                  style={{animation:"spin1 1.3s linear infinite"}} />
          <circle cx={43} cy={43} r={28} stroke="#68e0cf" strokeWidth={8} fill="none"
                  strokeDasharray="40 58" strokeLinecap="round"
                  style={{animation:"spin2 .83s linear infinite"}} />
        </svg>
        <div style={{fontSize: 26, color:"#1d3557", fontWeight:700, letterSpacing:".01em", marginTop: 10}}>
          SmartFitness AI
        </div>
        <style>{`
           @keyframes spin1 { 100% { transform:rotate(360deg);}}
           @keyframes spin2 { 100% { transform:rotate(-360deg);}}
        `}</style>
      </div>
    );
  }

  // ----- Приветствие -----
  if (stage === "welcome") {
    // Если нет имени — предлагаем сразу ввести
    if (!name) {
      const inputRef = useRef();
      useEffect(()=>{ setTimeout(()=>inputRef.current?.focus(), 400)},[]);
      return (
        <div style={{
          minHeight: "100vh", width: "100vw", background: "linear-gradient(120deg,#f3f7fa 10%,#f2fff6 90%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            padding: "32px 12px 27px 12px", background: "#fff", borderRadius: 25,
            boxShadow: "0 4px 38px #ddeff940", width:"95vw", maxWidth: 375, minHeight: 250,
            display:"flex", flexDirection:"column", alignItems:"center"
          }}>
            <div style={{fontSize:38, fontWeight: 800, color:"#1d3557", marginBottom: 14, marginTop:8}}>👋 Привет!</div>
            <form
              style={{ width:"100%" }}
              onSubmit={e => { e.preventDefault(); if(name.trim()) setStage("onboard"); }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Твоё имя"
                  style={{
                    fontSize:21,padding:"17px 14px",width:"99%",border:"1.2px solid #e3ebf3",
                    borderRadius:15,background:"#f6f8fc",outline:"none",marginBottom:19,
                    color:"#222",fontWeight:700,boxSizing:"border-box"
                  }}
                  autoFocus
                  required
                  onKeyDown={e=>{if(e.key==="Enter")e.target.blur()}}
                  />
                <button type="submit"
                  style={{width:"100%",padding:"16px 0",fontWeight:800,fontSize:20,
                    background:"linear-gradient(135deg,#68e0cf 60%,#6ccf83)",
                    color:"#fff",border:0,borderRadius:15,cursor:"pointer",marginTop:2,
                    boxShadow:"0 2px 14px #63d1c32c"}}
                >Продолжить</button>
            </form>
          </div>
        </div>
      );
    }

    // Если имя есть — просто приветствие и кнопка "Продолжить"
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", background: "linear-gradient(120deg,#f3f7fa 10%,#f2fff6 90%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          padding: "38px 24px 31px 24px", background: "#fff", borderRadius: 25,
          boxShadow: "0 4px 38px #ddeff940", width:"95vw", maxWidth: 375, minHeight: 230,
          display:"flex", flexDirection:"column", alignItems:"center"
        }}>
          <div style={{fontSize:38, fontWeight: 800, color:"#1d3557", marginBottom: 15}}>👋 Привет, {name}!</div>
          <div style={{fontSize:17, color:"#6d7887", fontWeight:600,marginBottom:23,marginTop:-3}}>Это твой SmartFitness AI <br/> Давай начнём путь к цели!</div>
          <button onClick={()=>setStage("onboard")}
            style={{width:"100%",padding:"17px 0",fontWeight:800,fontSize:20,
            background:"linear-gradient(135deg,#68e0cf 60%,#6ccf83)",color:"#fff",
            border:0,borderRadius:15,cursor:"pointer",marginTop:2,boxShadow:"0 2px 14px #63d1c32c"}}
          >Продолжить</button>
        </div>
      </div>
    );
  }

  // ----- Онбординг параметров -----
  if (stage === "onboard" && !user) {
    const formFieldStyle = {
      width: "100%", marginTop: 5, padding: "13px 12px", borderRadius: 12,
      border: "1px solid #e3ebf3", outline: "none", fontSize: 17, background: "#f6f8fc",
      color: "#14213d", fontWeight: 500, boxSizing:"border-box"
    };
    const [params, setParams] = useState({
      sex: "male", age: "", height: "", weight: "",
      activity: "1.2", goal: "weight-loss"
    });
    const handleChange = e => {
      const { name, value } = e.target;
      setParams(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = e => {
      e.preventDefault();
      document.activeElement && document.activeElement.blur();
      if (params.age && params.height && params.weight) {
        setUser({ ...params, age: Number(params.age), height: Number(params.height), weight: Number(params.weight), name });
      }
    };
    return (
      <div style={{
        minHeight: "100vh", width:"100vw",
        background: "linear-gradient(135deg, #f5fafd 60%, #e1f6ef 120%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "SF Pro Display, sans-serif"
      }}>
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          style={{
            background: "#fff", borderRadius: 25,
            boxShadow: "0 4px 24px #ddeff940",
            padding: "27px 7px 18px 7px", width: "99vw", maxWidth: 375, margin: "0 auto",
            color: "#14213d",boxSizing:"border-box"
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
              onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
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
              onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
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
              onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
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
          <button type="submit" style={{
            width: "100%", background: "linear-gradient(135deg,#68e0cf 60%,#6ccf83)", padding: "15px",
            borderRadius: 15, color: "#fff", border: 0, fontWeight: 800, fontSize: 19, letterSpacing: ".01em",
            boxShadow: "0 2px 12px #63d1c380", marginTop: 8, transition: "0.13s", cursor: "pointer"
          }}>
            Сохранить и продолжить
          </button>
        </form>
      </div>
    );
  }

  // ----- DASHBOARD + Tabs -----
  if (user) {
    // Логика для твоего основного экрана (выделим вкладку Home — только она пока живёт)
    const kbju = calcKBJU(user);
    const pct = (val, max) => Math.min(100, Math.round((val / max) * 100));
    return (
      <div style={{
        minHeight: "100vh", width:"100vw",background: "#fafbf8", display: "flex", flexDirection: "column",alignItems:"center"
      }}>
        {/* Tab MENU */}
        <div style={{
          flexGrow:1, width:"100%", paddingTop: user ? 18 : 0, paddingBottom: 78, boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center"
        }}>
          {/* Главная DASHBOARD */}
          {tab==="home" && (
            <div style={{width:"99vw", maxWidth:480, padding:"1vw", boxSizing:"border-box"}}>
              <div style={{
                background:"#fff",borderRadius:32,boxShadow:"0 2px 25px #e9e9f1a0",
                padding:"3vw 5vw 3vw 5vw",marginBottom:"19px"
              }}>
                <div style={{fontWeight:800, fontSize:28, color:"#1d3557",textAlign:"center",marginBottom:2,marginTop:2}}>
                  {today.calories} <span style={{fontWeight:500,fontSize:15,color:"#b8bfc7"}}>Ккал</span>
                </div>
                <div style={{width:"100%",display:"flex",justifyContent:"center",marginBottom:7,marginTop:0}}>
                  <Ring 
                    percent={pct(today.calories, kbju.calories)} 
                    color="#ff5252" size={90} bgcolor="#ffeaea" />
                </div>
                <div style={{textAlign:"center",margin:"4px 0 2px 0",color:"#888",fontSize:15}}>
                  <span style={{fontWeight:700}}>{user.name || "Ты"}</span>, твой лимит: <b>{kbju.calories}</b> Ккал
                </div>
                <div style={{ marginTop: 10 }}>
                  <MiniRing label="Белки" value={today.protein} max={kbju.protein} color="#6CCF83" />
                  <MiniRing label="Жиры" value={today.fat} max={kbju.fat} color="#ffbf47" />
                  <MiniRing label="Углеводы" value={today.carb} max={kbju.carb} color="#40a4ff" />
                </div>
              </div>
              <div style={{
                background:"#fff",borderRadius:24,boxShadow:"0 2px 25px #e9e9f050",
                padding:"15px 6vw 17px 6vw",marginBottom:10
              }}>
                <div style={{fontSize:18,fontWeight:750,marginBottom:7}}>Сегодня, {(new Date()).toLocaleDateString()}</div>
                <button
                  style={{
                    width:'100%',background:"#2573ff",color:"#fff",border:"none",borderRadius:14,
                    fontWeight:700,fontSize:19,padding:"13px",margin:"9px 0 4px 0",
                    boxShadow:"0 2px 17px #9db8ff30"
                  }}
                  onClick={()=>setToday(t=>({
                    ...t,
                    calories:t.calories+120,protein:t.protein+5,fat:t.fat+2,carb:t.carb+15
                  }))}
                >+ Добавить еду (пример)</button>
              </div>
              {/* Список последних приёмов пищи (заглушка) */}
              <div style={{
                background:"#fff",borderRadius:22,boxShadow:"0 2px 20px #e9e9f030",
                padding:"13px 17px 11px 18px",marginTop:5
              }}>
                <div style={{fontWeight:600,fontSize:17,marginBottom:7}}>Недавние блюда</div>
                <div style={{display:"flex",justifyContent:"space-between",color:"#111",fontSize:16,marginBottom:3}}>
                  <span>🍳 Яичница</span><span style={{fontWeight:700}}>211 г</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",color:"#111",fontSize:16,marginBottom:3}}>
                  <span>🍌 Банан</span><span style={{fontWeight:700}}>90 г</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",color:"#111",fontSize:16,marginBottom:3}}>
                  <span>🥗 Салат</span><span style={{fontWeight:700}}>220 г</span>
                </div>
              </div>
            </div>
          )}
          {/* Остальные вкладки-заглушки (можно расширить) */}
          {tab==="food" && (
            <div style={{
              background:"#fff",borderRadius:24,padding:"32px",marginTop:20,
              textAlign:"center",color:"#444",fontWeight:700,fontSize:21
            }}>Здесь появится Питание</div>
          )}
          {tab==="train" && (
            <div style={{
              background:"#fff",borderRadius:24,padding:"32px",marginTop:20,
              textAlign:"center",color:"#444",fontWeight:700,fontSize:21
            }}>Раздел Тренировки (скоро!)</div>
          )}
          {tab==="ai" && (
            <div style={{
              background:"#fff",borderRadius:24,padding:"32px",marginTop:20,
              textAlign:"center",color:"#444",fontWeight:700,fontSize:21
            }}>AI Ассистент...</div>
          )}
          {tab==="settings" && (
            <div style={{
              background:"#fff",borderRadius:24,padding:"32px",marginTop:20,
              textAlign:"center",color:"#444",fontWeight:700,fontSize:21
            }}>Настройки (скоро)</div>
          )}
        </div>
        {/* Нижнее меню */}
        <div style={{
          width:"100vw", position:"fixed", left:0, bottom:0,background:"#fff",
          borderTop:"1px solid #eff0f2",boxShadow:"0 -2px 12px #e9f1fe11",height:60,
          zIndex:10,display:"flex"
        }}>
          <TabItem isActive={tab==="home"} icon="🏠" label="Главная" onClick={()=>setTab("home")} />
          <TabItem isActive={tab==="food"} icon="🍽️" label="Питание" onClick={()=>setTab("food")} />
          <TabItem isActive={tab==="train"} icon="💪" label="Тренировки" onClick={()=>setTab("train")} />
          <TabItem isActive={tab==="ai"} icon="🤖" label="AI-совет" onClick={()=>setTab("ai")} />
          <TabItem isActive={tab==="settings"} icon="⚙️" label="Настр." onClick={()=>setTab("settings")} />
        </div>
      </div>
    );
  }

  return null;
}

// ----- Кольцо прогресса
function Ring({percent=0,color="#2573ff",size=80,bgcolor="#ebebf5"}) {
  const r = size*0.46, c = 2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{display:"block"}}>
      <circle r={r} cx={size/2} cy={size/2} fill="none" stroke={bgcolor} strokeWidth={size*0.11} />
      <circle r={r} cx={size/2} cy={size/2}
        fill="none" stroke={color} strokeWidth={size*0.13}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * percent / 100)}
        style={{ transition:".7s stroke-dashoffset cubic-bezier(.48,.31,.4,.86)" }}
      />
    </svg>
  );
}

// ----- Мини-кольца для БЖУ
function MiniRing({label,value,max,color}) {
  const percent = Math.min(100, Math.round((value/max)*100));
  return (
    <div style={{display:"flex",alignItems:"center",marginBottom:4}}>
      <div style={{width:30, height:30,marginRight:11}}>
        <Ring percent={percent} color={color} size={29} bgcolor="#eee"/>
      </div>
      <span style={{fontWeight:700, fontSize:16, color, minWidth:44,display:"inline-block"}}>{value}</span>
      <span style={{color:"#b8bfc7",marginLeft:2,fontSize:14}}>/ {max} {label}</span>
    </div>
  )
}

// ----- Навигационное меню с emoji и цветом
function TabItem({isActive,icon,label,onClick}) {
  return (
    <div onClick={onClick} style={{
      flex:"1 1 0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      fontWeight:700,fontSize:18,cursor:"pointer",color: isActive ? "#2573ff" : "#a2a5af",
      padding:"5px 0",transition:".2s color"
    }}>
      <span style={{fontSize:23,marginBottom:2}}>{icon}</span>
      <div style={{fontSize:13,marginTop:"-2px",letterSpacing:".01em"}}>{label}</div>
      {isActive && <div style={{
        marginTop:4, width:26, height:3, borderRadius:2, background:"#2573ff", boxShadow:"0 1.5px 6px #a9d4ff55"
      }}/>}
    </div>
  )
}

export default App;
