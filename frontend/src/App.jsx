import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SideMenu from "./SideMenu";
import LogoRobot from "./LoadingLogos";

// Компоненты из новых отдельных файлов
import CalculatorMobile from "./components/CalculatorMobile";
import AIChatMobile from "./components/AIChatMobile";
import SettingsMobile from "./components/SettingsMobile";
import MealsMobile from "./components/MealsMobile";

// MUI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

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
  const [stage, setStage] = useState("splash");
  const [tab, setTab] = useState("home");
  const [profile, setProfile] = useState(defaultProfile);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  // функция для навигации, чтобы передать её в HomeMobile
  const navigateToCalculator = () => setTab("calc");

  useEffect(() => {
    if (stage === "splash") {
      setTimeout(() => setStage("app"), 1500);
    }
  }, [stage]);

  const kbju = profile.customKBJU || getKBJU(profile);
  const [mealsByType, setMealsByType] = useState(initialMealsByType);
  
  // Используем useMemo для summary, чтобы он пересчитывался при изменении mealsByType
  const summary = React.useMemo(() => {
    console.log("Recalculating summary:", mealsByType); // Диагностика
    return Object.values(mealsByType).flat().reduce(
      (acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carb: acc.carb + (m.carb || 0),
        fat: acc.fat + (m.fat || 0)
      }),
      { calories: 0, protein: 0, carb: 0, fat: 0 }
    );
  }, [mealsByType]);

  const [messages, setMessages] = useState([]);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(profile.name);
  const [calcType, setCalcType] = useState("breakfast");

  if (stage === "splash") {
    return (
      <Box sx={{
        minHeight: "100vh", 
        width: "100vw", 
        background: (theme) => `linear-gradient(145deg, ${theme.palette.surfaceVariant.main} 0%, ${theme.palette.background.default} 100%)`,
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        p: 3,
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
        >
          <LogoRobot /> 
          <Typography variant="h3" component="div" sx={{ color: "primary.main", fontWeight: 700, letterSpacing: ".01em", mt: 3, mb:1, textAlign: 'center' }}>
            SmartFitness AI
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ color: "text.secondary", fontWeight: 500, letterSpacing: ".02em", mb: 4, textAlign: 'center' }}>
            Персональный ИИ-тренер и диетолог
          </Typography>
          <CircularProgress color="primary" size={36} thickness={3.6} />
        </motion.div>
      </Box>
    );
  }

  const appBarHeight = { xs: 56, sm: 60 };

  const CommonAppBar = (
    <AppBar 
      position="sticky"
      elevation={1} 
      sx={{ 
        bgcolor: 'background.paper', 
        borderBottom: 1, 
        borderColor: 'divider',
        height: appBarHeight
      }}
    >
      <Toolbar sx={{ minHeight: appBarHeight, px: { xs: 1, sm: 1.5 } }}>
        <Box sx={{display: 'flex', alignItems: 'center', flexShrink: 0, mr: {xs: 0.5, sm:1}}}>
            <LocalizationProvider dateAdapter={AdapterDateFns} >
            <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                format="MM/dd"
                enableAccessibleFieldDOMStructure={false}
                slots={{
                    openPickerIcon: () => (
                        <span className="material-symbols-rounded" style={{fontSize: 24, color: 'var(--mui-palette-primary-main)'}}>
                            calendar_month
                        </span>
                    ),
                }}
                slotProps={{
                    textField: {
                        variant: 'standard',
                        sx: {
                            '& .MuiInputBase-root': {
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'action.hover' }, 
                                borderRadius: 2,
                                cursor: 'pointer',
                                paddingLeft: 0.5
                            },
                            '& .MuiInputBase-input': {
                                p: '4px 0',
                                width: 50,
                            },
                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                        }
                    },
                }}
            />
            </LocalizationProvider>
        </Box>
        <Typography 
            variant="h6" 
            sx={{ 
                flexGrow: 1, 
                fontWeight: 700, 
                color: 'text.primary', 
                letterSpacing: '.01em', 
                fontSize: { xs: '1rem', sm: '1.15rem' }, 
                textAlign: 'center', 
                mx: {xs: 0.5, sm: 1},
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}
        >
          SmartFitness AI
        </Typography>
        <IconButton color="primary" onClick={() => setSideMenuOpen(true)} sx={{ p: {xs: 0.75, sm: 1}, ml: {xs:0.5, sm:1}, flexShrink: 0 }}>
          <span className="material-symbols-rounded" style={{fontSize: {xs: '24px', sm: '26px'}}}>menu</span>
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  return (
    <Box sx={{ height: "100vh", display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflow: 'hidden'}}> 
      {CommonAppBar}
      <SideMenu
        open={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        current={tab}
        onSelect={setTab}
        profile={profile}
      />
      <Box 
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          width: '100%',
        }}
      > 
        {tab === "home" && (
          <HomeMobile
            kbju={kbju}
            summary={summary}
            onNavigateToCalculator={navigateToCalculator}
          />
        )}
        {tab === "calc" && (
          <CalculatorMobile
            setMealsByType={setMealsByType}
            calcType={calcType}
            setCalcType={setCalcType}
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
          <Container 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            maxWidth="sm" 
            sx={{ 
              pt: { xs: 2, sm: 3 }, 
              pb: { xs: 2, sm: 3 }, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1, 
              boxSizing: 'border-box'
            }}
          >
            <Paper 
                elevation={2}
                sx={{
                  width: '100%',
                  maxWidth: 520,
                  p: { xs: 3, sm: 4 }, 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 2
                }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 64, color: 'var(--mui-palette-primary-main)' }}>
                model_training
              </span>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: "primary.main"}}>
                Программы тренировок
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 380 }}>
                Этот раздел находится в разработке. Скоро здесь появятся персональные программы тренировок, составленные нашим ИИ тренером!
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
        )}
      </Box>
    </Box>
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
