import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

// ------ Главный компонент ------
function App() {
  const [stage, setStage] = useState("splash");
  const [tab, setTab] = useState("home");
  const [profile, setProfile] = useState(defaultProfile);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  useEffect(() => {
    if (stage === "splash") {
      setTimeout(() => setStage("app"), 1500);
    }
  }, [stage]);

  const kbju = getKBJU(profile);
  const [mealsByType, setMealsByType] = useState(initialMealsByType);
  
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
            <IconButton 
                aria-label="Open date picker" 
                onClick={(e) => {
                    const datePickerInput = e.currentTarget.parentElement?.querySelector('input[placeholder="MM/DD"]');
                    if (datePickerInput && typeof datePickerInput.click === 'function') {
                        datePickerInput.click();
                    }
                }}
                color="primary"
                sx={{p: {xs:0.5, sm:0.75}}}
            >
                <span className="material-symbols-rounded" style={{fontSize: {xs: '22px', sm: '24px'}}}>calendar_month</span>
            </IconButton>
            <LocalizationProvider dateAdapter={AdapterDateFns} >
            <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                format="MM/dd"
                enableAccessibleFieldDOMStructure={false}
                slots={{textField: (params) => <TextField {...params} variant="standard" /> }}
                slotProps={{
                textField: {
                    variant: 'standard',
                    inputProps: { 'aria-label': 'Choose date' }, 
                    sx: { 
                        width: {xs: 55, sm: 60}, 
                        '& .MuiInputBase-input': {
                            fontWeight: 600, 
                            fontSize: {xs: '0.9rem', sm: '0.95rem'}, 
                            color: 'text.primary',
                            py: '6px',
                            textAlign: 'left',
                            letterSpacing: '0.5px'
                        }
                    },
                    InputProps: { disableUnderline: true, sx: { '&:hover': { bgcolor: 'action.hover' }, borderRadius: 2, px:0 } },
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
            onGoToChat={() => setTab("chat")}
            onGoToCalc={() => setTab("calc")}
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
function HomeMobile({ kbju, summary, onGoToChat, onGoToCalc }) {
  const caloriesPercentage = Math.min(100, (summary.calories / kbju.calories) * 100 || 0);

  const macroData = [
    { name: 'Углеводы', value: summary.carb, goal: kbju.carb, color: 'primary.main', icon: 'grain' },
    { name: 'Белки', value: summary.protein, goal: kbju.protein, color: 'success.main', icon: 'egg' },
    { name: 'Жиры', value: summary.fat, goal: kbju.fat, color: 'warning.main', icon: 'oil_barrel' },
  ];

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: {xs: 2, sm: 3}, pb: {xs: 10, sm: 12} }}>
      {/* Daily Goal Card */}
      <Card sx={{ width: '100%', maxWidth: {xs: 380, sm: 420, md: 480}, p: { xs: 2, sm: 2.5 }, textAlign: 'center' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary', fontSize: {xs: '1rem', sm: '1.15rem'} }}>
          Ваша цель на сегодня
        </Typography>
        <Box sx={{ position: 'relative', width: { xs: 150, sm: 170, md:180 }, height: { xs: 150, sm: 170, md:180 }, margin: '0 auto', mb: 2.5 }}>
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
            <span className="material-symbols-rounded" style={{ fontSize: {xs: 30, sm:34}, color: 'var(--mui-palette-primary-main)', marginBottom: '2px' }}>local_fire_department</span>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.1, fontSize: {xs: '1.8rem', sm: '2rem', md: '2.2rem'} }}>
              {summary.calories}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: {xs: '0.85rem', sm: '0.9rem'} }}>
              из {kbju.calories} ккал
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onGoToCalc} 
          startIcon={<span className="material-symbols-rounded">add_circle</span>} 
          sx={{ mt: 1, borderRadius: '20px', px: {xs:2.5, sm:3}, py: {xs: 1, sm: 1.2}, fontSize: {xs:15, sm:16} }}
        >
          Добавить приём пищи
        </Button>
      </Card>

      {/* Macronutrients Section */}
      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary', width: '100%', maxWidth: {xs: 380, sm: 420, md: 480}, textAlign: 'left', fontSize: {xs: '1.1rem', sm: '1.2rem'} }}>
        Макронутриенты
      </Typography>
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ width: '100%', maxWidth: {xs: 380, sm: 420, md: 480} }}>
        {macroData.map((macro) => (
          <Grid xs={12} sm={4} key={macro.name}>
            <Paper elevation={0} sx={{ p: {xs: 1.5, sm:2}, textAlign: 'center', borderRadius: 3, border: 1, borderColor: 'divider', bgcolor:'background.paper' }}>
              <span className="material-symbols-rounded" style={{ fontSize: {xs:26, sm:28}, color: macro.color, marginBottom: '8px' }}>{macro.icon}</span>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5, fontSize: {xs: '0.9rem', sm: '0.95rem'} }}>{macro.name}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, fontSize: {xs: '0.75rem', sm: '0.8rem'} }}>{macro.value} / {macro.goal} г</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (macro.value / macro.goal) * 100 || 0)}
                sx={{ height: 6, borderRadius: 3, bgcolor: 'surfaceVariant.main', '& .MuiLinearProgress-bar': { bgcolor: macro.color } }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Action Bar с подписями */}
      <Paper 
        elevation={3} 
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          py: { xs: 1.2, sm: 1.5 }, 
          px: { xs: 1.5, sm: 2 }, 
          display: 'flex',
          gap: { xs: 1, sm: 1.5 }, 
          justifyContent: 'space-around', 
          borderTopLeftRadius: { xs: 18, sm: 22 },
          borderTopRightRadius: { xs: 18, sm: 22 },
          zIndex: (theme) => theme.zIndex.drawer + 1, 
          borderTop: '1px solid', 
          borderColor: 'divider'
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onGoToCalc}
          sx={{ 
            flex: 1, 
            py: {xs:1, sm:1.2}, 
            fontSize: {xs: '0.85rem', sm: '0.9rem'}, 
            borderRadius: '20px',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.3
          }}
        >
          <span className="material-symbols-rounded" style={{fontSize: 22}}>add</span>
          <span>Добавить Еду</span>
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onGoToChat}
          sx={{ 
            flex: 1, 
            py: {xs:1, sm:1.2}, 
            fontSize: {xs: '0.85rem', sm: '0.9rem'}, 
            borderRadius: '20px', 
            borderWidth: 1.5,
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.3
          }}
        >
          <span className="material-symbols-rounded" style={{fontSize: 22}}>psychology</span>
          <span>ИИ Тренер</span>
        </Button>
      </Paper>
    </Box>
  );
}

export default App;
