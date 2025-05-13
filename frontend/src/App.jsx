import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion"; // Не используется
import { FaBars } from "react-icons/fa";
import SideMenu from "./SideMenu";
import LogoRobot from "./LoadingLogos";
// import { PiBowlFoodFill } from "react-icons/pi"; // Заменено на Material Symbols
import {
  CalculatorMobile,
  AIChatMobile,
  SettingsMobile,
  MealsMobile,
  // MacroBar, // Заменено на кастомные карточки в HomeMobile
} from "./components/MobileExtra";
// import Header from "./Header"; // Не используется, AppBar внутри HomeMobile

// MUI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles'; // Не используется
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// import Avatar from '@mui/material/Avatar'; // Не используется в HomeMobile AppBar
// import MenuIcon from '@mui/icons-material/Menu'; // Заменен на Material Symbol
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ru } from 'date-fns/locale';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

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
// function getDayString(date = new Date()) { // Не используется в HomeMobile, DatePicker сам форматирует
//   const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
//   const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
//   return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
// }
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

  // Имя Telegram
  // const [telegramName, setTelegramName] = useState(""); // Не используется напрямую в App или HomeMobile
  // useEffect(() => {
  //   if (
  //     window.Telegram &&
  //     window.Telegram.WebApp &&
  //     window.Telegram.WebApp.initDataUnsafe?.user?.first_name
  //   ) {
  //     setTelegramName(window.Telegram.WebApp.initDataUnsafe.user.first_name);
  //   }
  // }, []);

  useEffect(() => {
    if (stage === "splash") {
      setTimeout(() => setStage("app"), 3000);
    }
  }, [stage]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const kbju = getKBJU(profile);
  const [mealsByType, setMealsByType] = useState(initialMealsByType);
  // const allMeals = [ // Не используется в HomeMobile в новом дизайне
  //   ...mealsByType.breakfast.map(m => ({ ...m, type: "breakfast" })),
  //   ...mealsByType.lunch.map(m => ({ ...m, type: "lunch" })),
  //   ...mealsByType.dinner.map(m => ({ ...m, type: "dinner" })),
  //   ...mealsByType.snack.map(m => ({ ...m, type: "snack" })),
  // ];
  const summary = Object.values(mealsByType).flat().reduce(
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

  const Hamburger = (
    <IconButton
      aria-label="Меню"
      onClick={() => setSideMenuOpen(true)}
      sx={{
        position: "fixed", 
        right: 18, 
        top: 18, 
        zIndex: (theme) => theme.zIndex.drawer + 2, // Выше AppBar
        backgroundColor: 'background.paper',
        color: 'primary.main',
        padding: '8px', // Уменьшил padding
        boxShadow: 3,
        '&:hover': {
          backgroundColor: 'action.hover',
        }
      }}
    >
      <FaBars fontSize="20px" /> {/* Указал размер иконки */} 
    </IconButton>
  );

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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: 'background.default'}}> {/* Заменил div на Box для консистентности */} 
      {Hamburger} {/* Гамбургер теперь отображается здесь, над всем */} 
      <SideMenu
        open={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        current={tab}
        onSelect={setTab}
        profile={profile}
      />
      {/* AnimatePresence не нужен, если нет анимаций смены вкладок в App.jsx */}
      {/* <AnimatePresence mode="wait"> */}
        {tab === "home" && (
          <HomeMobile
            // profile={profile} // profile не используется в HomeMobile
            kbju={kbju}
            summary={summary}
            // allMeals={allMeals} // allMeals не используется в HomeMobile
            onGoToChat={() => setTab("chat")}
            onGoToCalc={() => setTab("calc")}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onMenuOpen={() => setSideMenuOpen(true)} // Передаем функцию открытия меню
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
          <Container maxWidth="xs" sx={{ pt: { xs: 2, sm: 3 }, pb: 2, mt: {xs: 7, sm: 8} /* Отступ под AppBar */ }}>
            <Card sx={{ p: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
                  Программы тренировок
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Скоро здесь появятся ваши программы тренировок!
                </Typography>
              </CardContent>
            </Card>
          </Container>
        )}
      {/* </AnimatePresence> */}
    </Box>
  );
}

// --- ГЛАВНАЯ СТРАНИЦА ---
function HomeMobile({ kbju, summary, /*allMeals,*/ onGoToChat, onGoToCalc, selectedDate, setSelectedDate, onMenuOpen }) {
  // const [anchorEl, setAnchorEl] = React.useState(null); // Не используется, меню открывается через App state
  // const handleMenuOpen = (event) => setAnchorEl(event.currentTarget); // Заменено
  // const handleMenuClose = () => setAnchorEl(null); // Заменено
  const caloriesPercentage = Math.min(100, (summary.calories / kbju.calories) * 100 || 0);

  const macroData = [
    { name: 'Углеводы', value: summary.carb, goal: kbju.carb, color: 'primary.main', icon: 'grain' },
    { name: 'Белки', value: summary.protein, goal: kbju.protein, color: 'success.main', icon: 'egg' },
    { name: 'Жиры', value: summary.fat, goal: kbju.fat, color: 'warning.main', icon: 'oil_barrel' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Top App Bar */}
      <AppBar position="sticky" color="inherit" elevation={1} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ minHeight: 56, px: { xs: 1, sm: 2 } }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              format="MM/dd"
              slotProps={{
                textField: {
                  variant: 'standard',
                  sx: { minWidth: 70, mr: { xs: 0.5, sm: 2 }, fontWeight: 700, fontSize: 15 },
                  InputProps: { disableUnderline: true, sx: { '&:hover': { bgcolor: 'action.hover' }, borderRadius: 1 } },
                },
                openPickerButton: {
                  sx: { color: 'primary.main' }
                }
              }}
            />
          </LocalizationProvider>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, color: 'text.primary', letterSpacing: '.01em', fontSize: { xs: 17, sm: 19 }, textAlign: 'center' }}>
            SmartFitness AI
          </Typography>
          <IconButton color="primary" onClick={onMenuOpen} sx={{ ml: { xs: 0.5, sm: 1 } }}>
            <span className="material-symbols-rounded">menu</span>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content Scrollable Area */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, pb: 12 }}>
        
        {/* Daily Goal Card */}
        <Card sx={{ width: '100%', maxWidth: 500, p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
            Ваша цель на сегодня
          </Typography>
          <Box sx={{ position: 'relative', width: { xs: 180, sm: 200 }, height: { xs: 180, sm: 200 }, margin: '0 auto', mb: 2 }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size="100%"
              thickness={2.5}
              sx={{ color: 'surfaceVariant.main', position: 'absolute', left: 0, top: 0 }}
            />
            <CircularProgress
              variant="determinate"
              value={caloriesPercentage}
              size="100%"
              thickness={2.5}
              sx={{ color: 'primary.main', position: 'absolute', left: 0, top: 0, '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }}
            />
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 36, color: 'var(--mui-palette-primary-main)', marginBottom: '4px' }}>local_fire_department</span>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.1 }}>
                {summary.calories}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                из {kbju.calories} ккал
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onGoToCalc} 
            startIcon={<span className="material-symbols-rounded">add_circle</span>} 
            sx={{ mt: 1, borderRadius: '20px', px:3, py: 1.2, fontSize: 16 }}
          >
            Добавить приём пищи
          </Button>
        </Card>

        {/* Macronutrients Section */}
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary', width: '100%', maxWidth: 500, textAlign: 'left' }}>
          Макронутриенты
        </Typography>
        <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ width: '100%', maxWidth: 500 }}>
          {macroData.map((macro) => (
            <Grid item xs={12} sm={4} key={macro.name}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 3, border: 1, borderColor: 'divider', bgcolor:'background.paper' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 30, color: macro.color, marginBottom: '8px' }}>{macro.icon}</span>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>{macro.name}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{macro.value} / {macro.goal} г</Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (macro.value / macro.goal) * 100 || 0)}
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'surfaceVariant.main', '& .MuiLinearProgress-bar': { bgcolor: macro.color } }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Bottom Action Bar */}
      <Paper 
        elevation={3} 
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          py: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
          display: 'flex',
          gap: { xs: 1.5, sm: 2 },
          justifyContent: 'center',
          borderTopLeftRadius: { xs: 20, sm: 24 },
          borderTopRightRadius: { xs: 20, sm: 24 },
          zIndex: (theme) => theme.zIndex.appBar, 
          borderTop: '1px solid', 
          borderColor: 'divider'
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onGoToCalc}
          startIcon={<span className="material-symbols-rounded">add</span>}
          sx={{ flexGrow: 1, py: 1.5, fontSize: {xs: 15, sm: 16}, borderRadius: '28px'}}
        >
          Добавить Еду
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onGoToChat}
          startIcon={<span className="material-symbols-rounded">psychology</span>}
          sx={{ flexGrow: 1, py: 1.5, fontSize: {xs: 15, sm: 16}, borderRadius: '28px', borderWidth: 1.5}}
        >
          ИИ Тренер
        </Button>
      </Paper>
    </Box>
  );
}

// --- Кольцевой прогресс --- // Удален, так как логика встроена в HomeMobile
// function CaloriesRing({ value, max }) { ... }

export default App;
