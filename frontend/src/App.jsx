import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars } from "react-icons/fa";
import SideMenu from "./SideMenu";
import LogoRobot from "./LoadingLogos";
import { PiBowlFoodFill } from "react-icons/pi";
import {
  CalculatorMobile,
  AIChatMobile,
  SettingsMobile,
  MealsMobile,
  MacroBar,
} from "./components/MobileExtra";
import Header from "./Header";

// MUI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';

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
  const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
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

  // Имя Telegram (можно оставить, если используется где-то ещё)
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

  // Splash (загрузка) — увеличено до 3 секунд и сразу переход в основной интерфейс
  useEffect(() => {
    if (stage === "splash") {
      setTimeout(() => setStage("app"), 3000);
    }
  }, [stage]);

  // --- ВАЖНО: удалено всё, что связано с welcome, typed и приветствием ---

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
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  // Кнопка гамбургера
  const Hamburger = (
    <IconButton
      aria-label="Меню"
      onClick={() => setSideMenuOpen(true)}
      sx={{
        position: "fixed", 
        right: 18, 
        top: 18, 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'primary.main',
        padding: '10px',
        boxShadow: 3,
        '&:hover': {
          backgroundColor: 'grey.100',
        }
      }}
    >
      <FaBars fontSize="inherit" />
    </IconButton>
  );

  // Splash
  if (stage === "splash") {
    return (
      <Box sx={{
        minHeight: "100vh", 
        width: "100vw", 
        background: "linear-gradient(120deg,#eef5fe 30%,#dffcf9 90%)",
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center"
      }}>
        <LogoRobot />
        <Typography variant="h4" component="div" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: ".01em", mt: 2 }}>
          SmartFitness AI
        </Typography>
        <Typography variant="subtitle1" component="div" sx={{ mt: 1, color: "text.secondary", fontWeight: 600, letterSpacing: ".02em" }}>
          Загрузка...
        </Typography>
      </Box>
    );
  }

  // Основной интерфейс
  return (
    <div style={{ minHeight: "100vh", background: "#fafbfc", fontFamily: "system-ui", position: "relative" }}>
      {Hamburger}
      <SideMenu
        open={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        current={tab}
        onSelect={setTab}
        profile={profile}
      />
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
        {tab === "programs" && (
          <Container maxWidth="xs" sx={{ pt: { xs: 2, sm: 3 }, pb: 2, mt: {xs: 5, sm: 7} }}>
            <Card sx={{ borderRadius: '16px', boxShadow: 3, p: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: "primary.main", mb: 2 }}>
                  Программы тренировок
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Скоро здесь появятся ваши программы тренировок!
                </Typography>
                 {/* Тут сделай свою логику/контент для программ */}
              </CardContent>
            </Card>
          </Container>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- ГЛАВНАЯ СТРАНИЦА ---
function HomeMobile({ kbju, summary, allMeals, onGoToChat, onGoToCalc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
    >
      <Container maxWidth="sm" sx={{ pt: 2, pb: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', minHeight: 'calc(100vh - 72px)' }}>
        <Card sx={{ width: '93%', borderRadius: '16px', boxShadow: 3 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, px: 2 }}>
            <CaloriesRing value={summary.calories} max={kbju.calories} />
            <Typography variant="h4" component="div" sx={{ fontWeight: 800, color: 'text.primary', mt: 1 }}>
              {summary.calories}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
              <Typography component="span" sx={{ color: 'primary.main', fontWeight: 800 }}>
                {kbju.calories}
              </Typography> цель
            </Typography>
            <Box sx={{ width: '100%', px: 2, boxSizing: 'border-box' }}>
              <MacroBar label="Углеводы" value={summary.carb} max={kbju.carb} color="#3bafe8" />
              <MacroBar label="Белки" value={summary.protein} max={kbju.protein} color="#5fc77f" />
              <MacroBar label="Жиры" value={summary.fat} max={kbju.fat} color="#ffb24a" />
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={onGoToChat}
              sx={{
                mt: 2.5,
                fontWeight: 800,
                fontSize: 17,
                borderRadius: '12px',
                width: '85%',
                maxWidth: 260,
                py: 1.5,
                background: 'linear-gradient(135deg,#35c7a5 60%,#229ED9)', // Keep custom gradient for now
                '&:hover': {
                  background: 'linear-gradient(135deg,#2da98e 60%,#1e8ac8)', // Darken gradient on hover
                }
              }}
            >
              ИИ Тренер
            </Button>
          </CardContent>
        </Card>
        <Card sx={{ width: '93%', borderRadius: '16px', boxShadow: 3 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2.5, px: 2 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 800, mb: 0.25 }}>Сегодня</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 14, mb: 1.25 }}>{getDayString()}</Typography>
            <Button
              variant="contained"
              onClick={onGoToCalc}
              sx={{
                fontWeight: 800,
                fontSize: 17,
                borderRadius: '12px',
                padding: '12px 0',
                width: '100%',
                mt: 1.25,
                background: 'linear-gradient(135deg,#3bafe8 80%,#53ddc9)', // Keep custom gradient
                 '&:hover': {
                  background: 'linear-gradient(135deg,#329cd6 80%,#4ac4b8)', // Darken gradient on hover
                }
              }}
            >
              Добавить еду
            </Button>
          </CardContent>
        </Card>
        <Card sx={{ width: '93%', borderRadius: '16px', boxShadow: 3, minHeight: 80 }}>
          <CardContent sx={{ py: 2, px: 2 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 800, fontSize: 16, mb: 0.5 }}>Последние блюда</Typography>
            {allMeals.length === 0 ? (
              <Box sx={{ color: 'text.secondary', fontSize: 15, mt: 1.5, textAlign: 'center' }}>
                <span role="img" aria-label="plate" style={{ fontSize: 22 }}>🍽️</span>
                <br />
                <Typography variant="body2">Пока ничего не добавлено</Typography>
              </Box>
            ) : (
              allMeals.slice(-3).reverse().map((m, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15, mb: 0.25 }}>
                  <Typography variant="body2">{m.emoji || "🍽️"} {m.name}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{m.grams} г</Typography>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Container>
    </motion.div>
  );
}

function CaloriesRing({ value, max }) {
  const pct = Math.min(100, (value / max) * 100 || 0);
  const size = 108;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', width: size, height: size, mb: 0.75 }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={4}
        sx={{
          color: (theme) => theme.palette.grey[200],
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      />
      <CircularProgress
        variant="determinate"
        value={pct}
        size={size}
        thickness={4}
        sx={{
          color: 'primary.main', // Or your specific theme color e.g. "#229ED9"
          position: 'absolute',
          left: 0,
          top: 0,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PiBowlFoodFill color="#229ED9" size={38} />
      </Box>
    </Box>
  );
}

export default App;
