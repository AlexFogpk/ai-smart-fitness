import React from "react";
import { motion } from "framer-motion";

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

// Прогресс-бар макросов
export function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100 || 0);
  return (
    <Box sx={{ my: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {value} / {max} г
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            backgroundColor: color,
          },
        }}
      />
    </Box>
  );
}

// Калькулятор питания
export function CalculatorMobile({
  // kbju, // Не используется в текущем UI CalculatorMobile
  // mealsByType, // Не используется напрямую в UI CalculatorMobile, но нужен для setMealsByType (оставляем в App.jsx)
  setMealsByType,
  calcType,
  setCalcType,
  // calcMode, // Не используется в текущем UI CalculatorMobile
  // setCalcMode, // Не используется в текущем UI CalculatorMobile
  // aiLoading, // Не используется в текущем UI CalculatorMobile
  // setAiLoading, // Не используется в текущем UI CalculatorMobile
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

  const handleCalcTypeChange = (event, newCalcType) => {
    if (newCalcType !== null) {
      setCalcType(newCalcType);
    }
  };

  const mealTypes = [
    { value: "breakfast", label: "Завтрак", icon: "bakery_dining" },
    { value: "lunch", label: "Обед", icon: "lunch_dining" },
    { value: "dinner", label: "Ужин", icon: "dinner_dining" },
    { value: "snack", label: "Перекус", icon: "bakery_dining" },
  ];

  // Анимации для контейнера
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <Container 
      component={motion.div} 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      maxWidth="sm"
      sx={{
        pt: { xs: 2, sm: 3 }, 
        pb: { xs: 2, sm: 3 }, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 56px)',
        boxSizing: 'border-box' 
      }}
    >
      <Paper 
        elevation={2}
        sx={{
          width: '100%', 
          maxWidth: 480,
          p: { xs: 2, sm: 3 }, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2.5,
        }}
      >
        <Box sx={{display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Добавить приём пищи
          </Typography>
          <IconButton onClick={onBack} aria-label="Назад" color="primary">
            <span className="material-symbols-rounded">close</span>
          </IconButton>
        </Box>
        
        <ToggleButtonGroup
          value={calcType}
          exclusive
          onChange={handleCalcTypeChange}
          aria-label="Тип приёма пищи"
          fullWidth
          color="primary"
          sx={{ 
            bgcolor: 'surfaceVariant.main',
            borderRadius: '28px',
            border: 'none',
            '& .MuiToggleButtonGroup-grouped': {
              mx: 0.5,
              my: 0.5,
              border: 0,
              borderRadius: '24px !important',
              padding: '8px 12px',
              fontSize: {xs: '0.8rem', sm: '0.875rem'},
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.contrastText',
                bgcolor: 'primary.main',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1)'
              },
              '&:not(.Mui-selected):hover': {
                bgcolor: 'action.hover'
              }
            }
          }}
        >
          {mealTypes.map((type) => (
            <ToggleButton 
              key={type.value} 
              value={type.value} 
              sx={{ flexGrow: 1}}
            >
              <span className="material-symbols-rounded" style={{marginRight: 6, fontSize: 18}}>{type.icon}</span>
              {type.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <TextField 
          fullWidth 
          label="Название блюда/продукта" 
          value={meal.name} 
          onChange={e => setMeal(m => ({ ...m, name: e.target.value }))} 
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField 
              fullWidth 
              label="Граммы" 
              type="number" 
              value={meal.grams} 
              onChange={e => setMeal(m => ({ ...m, grams: e.target.value.replace(/\D/g, "") }))} 
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              fullWidth 
              label="Калории (ккал)" 
              type="number" 
              value={meal.calories} 
              onChange={e => setMeal(m => ({ ...m, calories: e.target.value.replace(/\D/g, "") }))} 
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField 
              fullWidth 
              label="Белки (г)" 
              type="number" 
              value={meal.protein} 
              onChange={e => setMeal(m => ({ ...m, protein: e.target.value.replace(/\D/g, "") }))} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              fullWidth 
              label="Углеводы (г)" 
              type="number" 
              value={meal.carb} 
              onChange={e => setMeal(m => ({ ...m, carb: e.target.value.replace(/\D/g, "") }))} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              fullWidth 
              label="Жиры (г)" 
              type="number" 
              value={meal.fat} 
              onChange={e => setMeal(m => ({ ...m, fat: e.target.value.replace(/\D/g, "") }))} 
            />
          </Grid>
        </Grid>
        <TextField 
          fullWidth 
          label="Эмодзи (опционально)" 
          value={meal.emoji} 
          onChange={e => setMeal(m => ({ ...m, emoji: e.target.value }))} 
          InputProps={{
            startAdornment: <span className="material-symbols-rounded" style={{ marginRight: 8, color: 'text.secondary' }}>sentiment_satisfied</span>,
          }}
        />

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleAddMeal} 
          disabled={!meal.name || !meal.grams}
          startIcon={<span className="material-symbols-rounded">add_task</span>}
          sx={{ py: 1.5, fontSize: 16, borderRadius: '28px'}}
        >
          Добавить в дневник
        </Button>
      </Paper>
    </Container>
  );
}

// Чат с ИИ
export function AIChatMobile({ messages, setMessages, onBack, username }) {
  const [input, setInput] = React.useState("");
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const newUserMessage = { role: "user", text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    
    // TODO: Заменить на реальный вызов API к AI тренеру
    // Имитация ответа ИИ!
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "Я ваш AI-тренер! Задайте мне вопрос о питании или тренировках." }]);
    }, 800);
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <Container 
      component={motion.div} 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      maxWidth="sm" 
      sx={{
        pt: { xs: 2, sm: 3 }, 
        pb: { xs: 1, sm: 2 },
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 'calc(100vh - 56px)',
        boxSizing: 'border-box' 
      }}
    >
      <Paper 
        elevation={2}
        sx={{
          width: '100%',
          maxWidth: 600,
          flexGrow: 1,
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{display: 'flex', justifyContent:'space-between', alignItems:'center', p: {xs: 1.5, sm: 2}, borderBottom: 1, borderColor: 'divider'}}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
            ИИ Тренер
          </Typography>
          <IconButton onClick={onBack} aria-label="Назад" color="primary">
            <span className="material-symbols-rounded">close</span>
          </IconButton>
        </Box>
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: {xs: 1.5, sm: 2}, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {messages.length === 0 && (
            <Box sx={{flexGrow:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color: 'text.secondary', textAlign:'center', p:2}}>
                <span className="material-symbols-rounded" style={{ fontSize: 56, marginBottom: '16px' }}>psychology</span>
                <Typography variant="h6" sx={{mb:1}}>Готов помочь!</Typography>
                <Typography variant="body2">Задайте вопрос по питанию или тренировкам.</Typography>
            </Box>
          )}
          {messages.map((msg, i) => (
            <Paper 
              key={i} 
              elevation={0}
              sx={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                bgcolor: msg.role === "user" ? "primary.main" : "surfaceVariant.main",
                color: msg.role === "user" ? "primary.contrastText" : "text.primary",
                borderRadius: msg.role === "user" 
                  ? '20px 20px 4px 20px' 
                  : '20px 20px 20px 4px',
                p: '10px 16px',
                maxWidth: "85%",
                lineHeight: 1.45,
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body1">
                {msg.role === "user" && <Box component="span" sx={{ fontWeight: 'bold'}}>{username || "Вы"}:&nbsp;</Box>}
                {msg.text}
              </Typography>
            </Paper>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: {xs: 1.5, sm: 2}, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper'}}>
          <TextField 
            fullWidth 
            variant="filled"
            size="medium"
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Ваш вопрос..." 
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            multiline
            maxRows={4}
            InputProps={{
              disableUnderline: true,
              sx: { borderRadius: '28px', px: 1 },
              endAdornment: (
                <IconButton color="primary" onClick={handleSend} disabled={!input.trim()} sx={{mr: -0.5}}>
                  <span className="material-symbols-rounded">send</span>
                </IconButton>
              )
            }}
            sx={{ bgcolor: 'surfaceVariant.main', borderRadius: '28px' }}
          />
        </Box>
      </Paper>
    </Container>
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

  const activityLevels = [
    { value: 1.2, label: "Минимальная", icon: "self_improvement" }, // Пример иконок
    { value: 1.375, label: "Лёгкая", icon: "directions_walk" },
    { value: 1.55, label: "Средняя", icon: "fitness_center" },
    { value: 1.725, label: "Высокая", icon: "exercise" },
    { value: 1.9, label: "Очень высокая", icon: "local_fire_department" },
  ];

  const goals = [
    { value: "maintain", label: "Держать вес", icon: "balance" },
    { value: "loss", label: "Похудеть", icon: "trending_down" },
    { value: "gain", label: "Набрать вес", icon: "trending_up" },
  ];
  
  const genders = [
      { value: "male", label: "Мужской", icon: "male" },
      { value: "female", label: "Женский", icon: "female" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };
  
  const Item = ({icon, primary, secondary, onClick, selected}) => (
    <Paper 
      elevation={0} 
      sx={{
        p: 1.5, 
        mb: 1.5, 
        borderRadius: 3, 
        border: 1, 
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'action.selected' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: selected ? 'primary.dark' : 'grey.400',
          boxShadow: selected ? '0 0 0 2px var(--mui-palette-primary-light)' : '0 1px 3px rgba(0,0,0,0.05)',
        }
      }}
      onClick={onClick}
    >
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <span className="material-symbols-rounded" style={{ fontSize: 28, marginRight: 12, color: selected ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-text-secondary)' }}>{icon}</span>
        <Box>
          <Typography variant="body1" sx={{fontWeight: selected ? 600: 500, color: selected ? 'primary.main' : 'text.primary'}}>{primary}</Typography>
          {secondary && <Typography variant="caption" sx={{color: 'text.secondary'}}>{secondary}</Typography>}
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Container 
      component={motion.div} 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      maxWidth="sm"
      sx={{
        pt: { xs: 2, sm: 3 }, 
        pb: { xs: 2, sm: 3 }, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 56px)', 
        boxSizing: 'border-box' 
      }}
    >
      <Paper 
        elevation={2}
        sx={{
          width: '100%', 
          maxWidth: 520, 
          p: { xs: 2, sm: 3 }, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2.5,
        }}
      >
        <Box sx={{display: 'flex', justifyContent:'space-between', alignItems:'center', mb: 1}}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Настройки профиля
          </Typography>
          <IconButton onClick={onBack} aria-label="Назад" color="primary">
            <span className="material-symbols-rounded">close</span>
          </IconButton>
        </Box>

        {/* Имя */}
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary', mb:1 }}>Имя</Typography>
          {editName ? (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: 'center' }}>
              <TextField fullWidth label="Введите ваше имя" variant="outlined" value={newName} onChange={e => setNewName(e.target.value)} autoFocus/>
              <Button variant="contained" onClick={handleSaveName} sx={{px:2, py:1, borderRadius: '20px'}}>
                <span className="material-symbols-rounded">done</span>
              </Button>
            </Box>
          ) : (
            <Item 
                icon="badge" 
                primary={profile.name || "Укажите имя"} 
                onClick={() => setEditName(true)}
            />
          )}
        </Box>

        {/* Основные параметры */}
        <Grid container spacing={{xs: 1.5, sm: 2}}>
          <Grid item xs={6} sm={4}>
            <TextField fullWidth label="Возраст" type="number" variant="outlined" value={profile.age} onChange={e => setProfile(p => ({ ...p, age: Number(e.target.value) }))} InputProps={{startAdornment: <span className="material-symbols-rounded" style={{ marginRight: 8, color: 'text.secondary'}}>cake</span>}}/>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField fullWidth label="Рост (см)" type="number" variant="outlined" value={profile.height} onChange={e => setProfile(p => ({ ...p, height: Number(e.target.value) }))} InputProps={{startAdornment: <span className="material-symbols-rounded" style={{ marginRight: 8, color: 'text.secondary'}}>height</span>}}/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Вес (кг)" type="number" variant="outlined" value={profile.weight} onChange={e => setProfile(p => ({ ...p, weight: Number(e.target.value) }))} InputProps={{startAdornment: <span className="material-symbols-rounded" style={{ marginRight: 8, color: 'text.secondary'}}>scale</span>}}/>
          </Grid>
        </Grid>
        
        {/* Пол */}
        <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary', mb:1 }}>Пол</Typography>
            <Grid container spacing={1.5}>
                {genders.map(g => (
                    <Grid item xs={6} key={g.value}>
                        <Item 
                            icon={g.icon} 
                            primary={g.label} 
                            onClick={() => setProfile(p => ({ ...p, sex: g.value }))}
                            selected={profile.sex === g.value}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>

        {/* Активность */}
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary', mb:1 }}>Уровень активности</Typography>
          {activityLevels.map(level => (
            <Item 
                key={level.value} 
                icon={level.icon} 
                primary={level.label} 
                onClick={() => setProfile(p => ({ ...p, activity: Number(level.value) }))}
                selected={profile.activity === level.value}
            />
          ))}
        </Box>

        {/* Цель */}
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary', mb:1 }}>Ваша цель</Typography>
          {goals.map(g => (
            <Item 
                key={g.value} 
                icon={g.icon} 
                primary={g.label} 
                onClick={() => setProfile(p => ({ ...p, goal: g.value }))}
                selected={profile.goal === g.value}
            />
          ))}
        </Box>

      </Paper>
    </Container>
  );
}

// История блюд
export function MealsMobile({ mealsByType, onBack }) {
  function mealTypeRus(type) {
    switch (type) {
      case "breakfast": return {label: "Завтрак", icon: "bakery_dining"};
      case "lunch": return {label: "Обед", icon: "lunch_dining"};
      case "dinner": return {label: "Ужин", icon: "dinner_dining"};
      case "snack": return {label: "Перекус", icon: "icecream"}; // или cookie, fastfood
      default: return {label: "Приём пищи", icon: "restaurant"};
    }
  }
  const mealOrder = ["breakfast", "lunch", "dinner", "snack"];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };
  
  const isEmpty = mealOrder.every(type => !mealsByType[type] || mealsByType[type].length === 0);

  return (
    <Container 
      component={motion.div} 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      maxWidth="sm"
      sx={{
        pt: { xs: 2, sm: 3 }, 
        pb: { xs: 2, sm: 3 }, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 56px)', 
        boxSizing: 'border-box' 
      }}
    >
      <Paper 
        elevation={2}
        sx={{
          width: '100%', 
          maxWidth: 520, 
          p: 0, // Убираем внутренние отступы Paper, чтобы List занял всю ширину
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden', // Для скругления углов List
        }}
      >
        <Box sx={{display: 'flex', justifyContent:'space-between', alignItems:'center', p: {xs: 1.5, sm: 2}, borderBottom: 1, borderColor: 'divider'}}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            История блюд
          </Typography>
          <IconButton onClick={onBack} aria-label="Назад" color="primary">
            <span className="material-symbols-rounded">close</span>
          </IconButton>
        </Box>
        
        {isEmpty ? (
            <Box sx={{flexGrow:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color: 'text.secondary', textAlign:'center', p:4, minHeight: 200}}>
                <span className="material-symbols-rounded" style={{ fontSize: 64, marginBottom: '16px', color: 'var(--mui-palette-surfaceVariant-main)' }}>ramen_dining</span>
                <Typography variant="h6" sx={{mb:1, fontWeight:600}}>Пока пусто</Typography>
                <Typography variant="body2">Здесь будет отображаться ваша история приёмов пищи.</Typography>
            </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', py: 1, px: {xs: 1, sm: 1.5} }}>
            {mealOrder.map((type, index) => {
              const mealInfo = mealTypeRus(type);
              const meals = mealsByType[type] || [];
              if (meals.length === 0) return null; // Не отображаем категорию, если в ней нет блюд

              return (
                <React.Fragment key={type}>
                  {index > 0 && <Divider component="li" variant="middle" sx={{my:2, mx: -2 /* Компенсируем padding List*/}}/>}
                  <ListSubheader sx={{ 
                      bgcolor: 'transparent', 
                      fontWeight: 600, 
                      color: 'primary.main', 
                      lineHeight: '2.5em', 
                      display:'flex', 
                      alignItems:'center', 
                      gap: 1, 
                      pl: 1 // Небольшой отступ для заголовка
                    }}>
                    <span className="material-symbols-rounded">{mealInfo.icon}</span>
                    {mealInfo.label}
                  </ListSubheader>
                  {meals.map((meal, idx) => (
                    <ListItem 
                        key={idx} 
                        disablePadding 
                        sx={{ 
                            bgcolor: 'surfaceVariant.main', 
                            borderRadius: 3, 
                            mb: 1, 
                            p: 1.5,
                            transition: 'background-color 0.2s',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                      <ListItemIcon sx={{minWidth: 40, fontSize: '1.5rem', color: 'text.secondary'}}>
                        {meal.emoji || <span className="material-symbols-rounded">restaurant</span>}
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body1" component="span" sx={{fontWeight: 500}}>{meal.name}</Typography>} 
                        secondary={`${meal.calories} ккал • Б:${meal.protein} У:${meal.carb} Ж:${meal.fat}`}
                        secondaryTypographyProps={{variant:'caption', color: 'text.secondary'}}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary'}}>{meal.grams} г</Typography>
                    </ListItem>
                  ))}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>
    </Container>
  );
}
