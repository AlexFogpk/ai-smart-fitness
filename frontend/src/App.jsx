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
import LinearProgress from '@mui/material/LinearProgress';

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc', display: 'flex', flexDirection: 'column' }}>
      {/* Top App Bar */}
      <Box sx={{
        width: '100%',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.2,
        boxShadow: 1,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'grey.100',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 16 }}>
          {getDayString()}  
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '.01em', fontSize: 20 }}>
          SmartFitness AI
        </Typography>
        <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="https://mui.com/static/images/avatar/1.jpg" alt="profile" style={{ width: 28, height: 28, borderRadius: '50%' }} />
        </Box>
      </Box>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, pb: 2 }}>
        {/* Calories Circular Progress */}
        <Box sx={{ mb: 3 }}>
          <CaloriesRing value={summary.calories} max={kbju.calories} />
          <Box sx={{ position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: 160 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1, fontSize: 38 }}>
              {summary.calories}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 18 }}>
              из {kbju.calories} ккал
            </Typography>
          </Box>
        </Box>
        {/* Macros */}
        <Box sx={{ width: '100%', maxWidth: 340, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#3bafe8' }}>Углеводы</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{summary.carb} / {kbju.carb} г</Typography>
          </Box>
          <LinearProgress variant="determinate" value={Math.min(100, (summary.carb / kbju.carb) * 100)} sx={{ height: 8, borderRadius: 5, mb: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: '#3bafe8' } }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#5fc77f' }}>Белки</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{summary.protein} / {kbju.protein} г</Typography>
          </Box>
          <LinearProgress variant="determinate" value={Math.min(100, (summary.protein / kbju.protein) * 100)} sx={{ height: 8, borderRadius: 5, mb: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: '#5fc77f' } }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#ffb24a' }}>Жиры</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{summary.fat} / {kbju.fat} г</Typography>
          </Box>
          <LinearProgress variant="determinate" value={Math.min(100, (summary.fat / kbju.fat) * 100)} sx={{ height: 8, borderRadius: 5, mb: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: '#ffb24a' } }} />
        </Box>
        <Box sx={{ flex: 1 }} />
      </Box>
      {/* Bottom Action Bar */}
      <Box sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        bgcolor: 'background.paper',
        boxShadow: '0 -2px 12px 0 rgba(0,0,0,0.04), 0 -1px 0 0 #e0e0e0',
        py: 1.5,
        px: 2,
        display: 'flex',
        gap: 2,
        justifyContent: 'center',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        zIndex: 20,
      }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ fontWeight: 800, borderRadius: 3, px: 3, boxShadow: 2, fontSize: 17 }}
          onClick={onGoToCalc}
        >
          Добавить еду +
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          sx={{ fontWeight: 800, borderRadius: 3, px: 3, fontSize: 17, borderWidth: 2 }}
          onClick={onGoToChat}
          startIcon={<span role="img" aria-label="ai">🧠</span>}
        >
          ИИ Тренер
        </Button>
      </Box>
    </Box>
  );
}

// --- Кольцевой прогресс ---
function CaloriesRing({ value, max }) {
  const pct = Math.min(100, (value / max) * 100 || 0);
  const size = 160;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={5.5}
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
        thickness={5.5}
        sx={{
          color: 'primary.main',
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
        <PiBowlFoodFill color="#229ED9" size={44} />
      </Box>
    </Box>
  );
}

export default App;
