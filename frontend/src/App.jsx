import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SideMenu from "./SideMenu";
import LogoRobot from "./LoadingLogos";

// Компоненты из новых отдельных файлов
import CalculatorMobile from "./components/CalculatorMobile";
import AIChatMobile from "./components/AIChatMobile";
import SettingsMobile from "./components/SettingsMobile";
import MealsMobile from "./components/MealsMobile";
import ProgressDashboard from "./components/ProgressDashboard";

// MUI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MenuIcon from '@mui/icons-material/Menu';
import { ru } from 'date-fns/locale';

// ------ Утилиты ------
function getKBJU({ sex, weight, height, age, activity, goal, customKBJU }) {
  if (customKBJU) {
    return {
      calories: customKBJU.calories || 0,
      protein: customKBJU.protein || 0,
      fat: customKBJU.fat || 0,
      carb: customKBJU.carb || 0,
    };
  }
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
    calories: Math.round(tdee) || 0, // Fallback to 0 if calculation results in NaN
    protein: protein || 0,
    fat: fat || 0,
    carb: carb || 0,
  };
}

const defaultProfile = {
  sex: "male",
  age: 25,
  height: 180,
  weight: 75,
  activity: 1.375,
  goal: "maintain",
  name: "",
  customKBJU: null, // Добавлено для ручного ввода КБЖУ
};
const initialMealsByType = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snack: [],
};

// Анимированный круговой прогресс - полностью переписан
const AnimatedCircularProgress = ({ value, color, size, thickness }) => {
  // Определяем размеры и координаты
  const halfSize = size / 2;
  const radius = halfSize - thickness;
  const circumference = 2 * Math.PI * radius;
  
  // Вычисляем dashoffset на основе процента
  const percent = typeof value === 'number' ? value : 0; // Значение в процентах (0-100)
  const strokeDashoffset = circumference * (1 - (percent / 100));
  
  console.log("AnimatedCircularProgress rendering:", { percent, strokeDashoffset, circumference });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {/* Фоновый серый круг */}
      <circle 
        stroke="#E0E0E0"
        fill="transparent"
        strokeWidth={thickness}
        r={radius}
        cx={halfSize}
        cy={halfSize}
      />
      
      {/* Цветной прогресс круг с анимацией */}
      <motion.circle 
        stroke={color}
        fill="transparent"
        strokeWidth={thickness}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1, ease: "easeOut" }}
        strokeLinecap="round"
        r={radius}
        cx={halfSize}
        cy={halfSize}
      />
    </svg>
  );
};

// ------ Главный компонент ------
function App() {
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("userProfile");
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });
  const [mealsByType, setMealsByType] = useState(() => {
    const savedMeals = localStorage.getItem("mealsByType");
    return savedMeals ? JSON.parse(savedMeals) : initialMealsByType;
  });
  const [chatMessages, setChatMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [currentKBJU, setCurrentKBJU] = useState(getKBJU(profile));
  const [currentSummary, setCurrentSummary] = useState({ calories: 0, protein: 0, fat: 0, carb: 0 });
  const [tab, setTab] = useState("home");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Состояние для общей загрузки

  // Для анимации навигации
  const prevTab = useRef(tab);
  const initialTab = useRef(tab);

  // Обновляем КБЖУ при изменении профиля
  useEffect(() => {
    setCurrentKBJU(getKBJU(profile));
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  // Обновляем сводку при изменении блюд или КБЖУ
  useEffect(() => {
    const summary = Object.values(mealsByType).flat().reduce(
      (acc, meal) => ({
        calories: acc.calories + (Number(meal.calories) || 0),
        protein: acc.protein + (Number(meal.protein) || 0),
        fat: acc.fat + (Number(meal.fat) || 0),
        carb: acc.carb + (Number(meal.carb) || 0),
      }),
      { calories: 0, protein: 0, fat: 0, carb: 0 }
    );
    setCurrentSummary(summary);
    localStorage.setItem("mealsByType", JSON.stringify(mealsByType));
  }, [mealsByType]);
  
  // Save chat messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Задержка для отображения лоадера при первом запуске (симуляция)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Убрал лого робота, т.к. его нет в импортах сейчас
    return () => clearTimeout(timer);
  }, []);

  // Для анимации: определяем направление навигации
  const isNavigatingForward = (current, previous) => {
    const order = ["home", "calc", "meals", "progress", "chat", "settings"];
    return order.indexOf(current) > order.indexOf(previous);
  };

  useEffect(() => {
    prevTab.current = tab;
  }, [tab]);
  

  // AppBar для всех страниц
  const CommonAppBar = (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary'}}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setSideMenuOpen(true)}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {tab === 'home' && 'Главная'}
          {tab === 'calc' && 'Калькулятор КБЖУ'}
          {tab === 'meals' && 'Мои блюда'}
          {tab === 'progress' && 'Замеры и Прогресс'}
          {tab === 'chat' && 'ИИ-Ассистент'}
          {tab === 'settings' && 'Настройки профиля'}
        </Typography>
        {/* Можно добавить иконку пользователя или другие элементы */}
      </Toolbar>
    </AppBar>
  );

  // Отображение компонента в зависимости от активной вкладки
  let ActiveComponent;
  if (tab === "home") {
    ActiveComponent = <HomeMobile kbju={currentKBJU} summary={currentSummary} onNavigateToCalculator={() => setTab("calc")} />;
  } else if (tab === "calc") {
    ActiveComponent = <CalculatorMobile mealsByType={mealsByType} setMealsByType={setMealsByType} kbju={currentKBJU} currentSummary={currentSummary} setProfile={setProfile} profile={profile} />; 
  } else if (tab === "chat") {
    ActiveComponent = <AIChatMobile messages={chatMessages} setMessages={setChatMessages} onBack={() => setTab("home")} username={profile.name} />;
  } else if (tab === "settings") {
    ActiveComponent = <SettingsMobile profile={profile} setProfile={setProfile} />;
  } else if (tab === "meals") {
    ActiveComponent = <MealsMobile mealsByType={mealsByType} onBack={() => setTab("home")} />;
  } else if (tab === "progress") { // <-- Вот здесь используем новый компонент
    ActiveComponent = <ProgressDashboard />;
  } else {
    ActiveComponent = (
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 4 }}>
        <Paper elevation={3} sx={{ p: {xs: 2, sm:3, md:4}, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: 300}}>
          <span className="material-symbols-rounded" style={{ fontSize: 64, color: 'var(--mui-palette-primary-main)' }}>
            construction
          </span>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: "primary.main"}}>
            Раздел в разработке
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 380 }}>
            Мы активно работаем над этим разделом. Скоро здесь будет что-то интересное!
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => setTab("home")} 
            startIcon={<span className="material-symbols-rounded">arrow_back</span>}
            sx={{mt: 2, borderRadius: '20px', px:3}}
            >
            Вернуться на главную
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "background.default" }}>
        <SideMenu 
            open={sideMenuOpen} 
            onClose={() => setSideMenuOpen(false)} 
            current={tab} 
            onSelect={(newTab) => { setTab(newTab); setSideMenuOpen(false); }} 
            profile={profile}
        />
        <Box 
            component="main" 
            sx={{ 
                flexGrow: 1, 
                display: 'flex', // Добавлено для корректной работы AppBar и контента
                flexDirection: 'column', // Добавлено
                overflowY: 'auto', 
                overflowX: 'hidden', 
                position: 'relative' 
            }}
        >
          {CommonAppBar} {/* AppBar теперь здесь, над контентом */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', width: '100%' }}> {/* Обертка для скролла контента */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === initialTab.current ? 0 : (isNavigatingForward(tab, prevTab.current) ? 30 : -30) }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isNavigatingForward(tab, prevTab.current) ? -30 : 30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ width: '100%', height: '100%' }} // height: 100% для заполнения
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
                    <LogoRobot /> {/* Убедитесь, что LogoRobot импортирован и доступен */}
                    <Typography variant="h6">Загрузка данных...</Typography>
                    <CircularProgress />
                  </Box>
                ) : ActiveComponent}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

// --- ГЛАВНАЯ СТРАНИЦА ---
function HomeMobile({ kbju, summary, onNavigateToCalculator }) {
  // Вычисляем процент заполнения калорий
  const caloriesPercentage = Math.min(100, Math.round((summary.calories / kbju.calories) * 100) || 0);
  console.log("Calories: ", summary.calories, "/", kbju.calories, "=", caloriesPercentage, "%");

  const macroData = [
    { name: 'Углеводы', value: summary.carb, goal: kbju.carb, color: 'primary.main', icon: 'grain' },
    { name: 'Белки', value: summary.protein, goal: kbju.protein, color: 'success.main', icon: 'egg' },
    { name: 'Жиры', value: summary.fat, goal: kbju.fat, color: 'warning.main', icon: 'oil_barrel' },
  ];

  return (
    <Box sx={{ 
      flexGrow: 1, 
      overflowY: 'auto', 
      p: { xs: 1.5, sm: 2, md: 3 }, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: {xs: 1.5, sm: 2, md: 3}, 
      pb: {xs: 3, sm: 4},
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Daily Goal Card */}
      <Card 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          width: '100%', 
          maxWidth: {xs: '100%', sm: 420, md: 480}, 
          p: { xs: 1.5, sm: 2, md: 2.5 }, 
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(66, 133, 244, 0.08)'
        }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary', fontSize: {xs: '0.95rem', sm: '1.1rem', md: '1.15rem'} }}>
          Ваша цель на сегодня
        </Typography>
        <Box sx={{ 
          position: 'relative', 
          width: { xs: 130, sm: 150, md: 170 }, 
          height: { xs: 130, sm: 150, md: 170 }, 
          margin: '0 auto', 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AnimatedCircularProgress 
            value={caloriesPercentage} 
            color="#4285F4" 
            size={170} 
            thickness={8} 
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: {xs: 26, sm: 30, md: 34}, color: '#4285F4', marginBottom: '2px' }}>local_fire_department</span>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.1, fontSize: {xs: '1.6rem', sm: '1.8rem', md: '2rem'} }}>
              {summary.calories}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: {xs: '0.8rem', sm: '0.85rem', md: '0.9rem'} }}>
              из {kbju.calories} ккал
            </Typography>
          </motion.div>
        </Box>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onNavigateToCalculator} 
            startIcon={<span className="material-symbols-rounded">add_circle</span>} 
            sx={{ 
              mt: 1, 
              borderRadius: '20px', 
              px: {xs: 2, sm: 2.5, md: 3}, 
              py: {xs: 0.8, sm: 1, md: 1.2}, 
              fontSize: {xs: 14, sm: 15, md: 16} 
            }}
          >
            Добавить приём пищи
          </Button>
        </motion.div>
      </Card>

      {/* Macronutrients Section */}
      <Box sx={{ width: '100%', maxWidth: {xs: '100%', sm: 420, md: 480} }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary', width: '100%', textAlign: 'left', fontSize: {xs: '1rem', sm: '1.1rem', md: '1.2rem'}, mb: 1 }}>
          Макронутриенты
        </Typography>
        <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
          {macroData.map((macro, index) => (
            <Grid item xs={12} sm={4} key={macro.name}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                style={{ height: '100%' }}
              >
                <Paper elevation={0} sx={{ 
                  p: {xs: 1.2, sm: 1.5, md: 2}, 
                  textAlign: 'center', 
                  borderRadius: 3, 
                  border: 1, 
                  borderColor: 'divider', 
                  bgcolor:'background.paper',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span className="material-symbols-rounded" style={{ 
                    fontSize: {xs: 24, sm: 28, md: 32}, 
                    color: macro.color,
                    marginBottom: {xs: 0.5, sm: 1}
                  }}>
                    {macro.icon}
                  </span>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    fontSize: {xs: '0.9rem', sm: '1rem'}
                  }}>
                    {macro.name}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: macro.color,
                    fontSize: {xs: '1.1rem', sm: '1.2rem', md: '1.3rem'}
                  }}>
                    {macro.value}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'text.secondary',
                    fontSize: {xs: '0.75rem', sm: '0.8rem'}
                  }}>
                    из {macro.goal} г
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
