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
  kbju,
  mealsByType,
  setMealsByType,
  calcType,
  setCalcType,
  calcMode,
  setCalcMode,
  aiLoading,
  setAiLoading,
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
    { value: "breakfast", label: "Завтрак" },
    { value: "lunch", label: "Обед" },
    { value: "dinner", label: "Ужин" },
    { value: "snack", label: "Перекус" },
  ];

  return (
    <Container component={motion.div} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.6 }}
      maxWidth="xs"
      sx={{ pt: 2, pb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 72px)', boxSizing: 'border-box' }}
    >
      <Card sx={{ width: '100%', borderRadius: '16px', boxShadow: 3, p: 1 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 800, mb: 1 }}>
            Добавить приём пищи
          </Typography>
          <ToggleButtonGroup
            value={calcType}
            exclusive
            onChange={handleCalcTypeChange}
            aria-label="Meal type"
            fullWidth
            sx={{ mb: 1 }}
          >
            {mealTypes.map((type) => (
              <ToggleButton key={type.value} value={type.value} sx={{ flexGrow: 1, py: 0.5, fontSize: '0.8rem'}}>
                {type.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <TextField fullWidth label="Название блюда" variant="outlined" size="small" value={meal.name} onChange={e => setMeal(m => ({ ...m, name: e.target.value }))} />
          <TextField fullWidth label="Граммы" type="number" variant="outlined" size="small" value={meal.grams} onChange={e => setMeal(m => ({ ...m, grams: e.target.value.replace(/\D/g, "") }))} />
          <TextField fullWidth label="Калории" type="number" variant="outlined" size="small" value={meal.calories} onChange={e => setMeal(m => ({ ...m, calories: e.target.value.replace(/\D/g, "") }))} />
          <TextField fullWidth label="Белки" type="number" variant="outlined" size="small" value={meal.protein} onChange={e => setMeal(m => ({ ...m, protein: e.target.value.replace(/\D/g, "") }))} />
          <TextField fullWidth label="Углеводы" type="number" variant="outlined" size="small" value={meal.carb} onChange={e => setMeal(m => ({ ...m, carb: e.target.value.replace(/\D/g, "") }))} />
          <TextField fullWidth label="Жиры" type="number" variant="outlined" size="small" value={meal.fat} onChange={e => setMeal(m => ({ ...m, fat: e.target.value.replace(/\D/g, "") }))} />
          <TextField fullWidth label="Эмодзи (необязательно)" variant="outlined" size="small" value={meal.emoji} onChange={e => setMeal(m => ({ ...m, emoji: e.target.value }))} />

          <Button variant="contained" fullWidth onClick={handleAddMeal} sx={{ mt: 1, fontWeight: 'bold', py: 1.25 }}>
            Добавить
          </Button>
          <Button variant="outlined" fullWidth onClick={onBack} sx={{ mt: 0.5, fontWeight: 'medium' }}>
            Назад
          </Button>
        </CardContent>
      </Card>
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

  function handleSend() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    // Имитация ответа ИИ!
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "Я ваш AI-тренер! Задайте мне вопрос о питании или тренировках." }]);
    }, 800);
  }
  return (
    <Container component={motion.div} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.6 }}
      maxWidth="xs" 
      sx={{ pt: 2, pb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 72px)', boxSizing: 'border-box' }}
    >
      <Card sx={{ width: '100%', borderRadius: '16px', boxShadow: 3, p: 0.5, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 90px)' /* Adjust height as needed */ }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1.5, overflow: 'hidden' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            Чат с ИИ тренером
          </Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 /* For scrollbar space */, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {messages.length === 0 && (
              <Typography sx={{ color: "text.secondary", p: 2, textAlign: "center" }}>
                Задайте вопрос по питанию или тренировкам!
              </Typography>
            )}
            {messages.map((msg, i) => (
              <Paper 
                key={i} 
                elevation={1}
                sx={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  bgcolor: msg.role === "user" ? "primary.light" : "grey.200",
                  color: msg.role === "user" ? "primary.contrastText" : "text.primary",
                  borderRadius: msg.role === "user" ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  p: '8px 12px',
                  maxWidth: "85%",
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                }}
              >
                <Typography variant="body2">
                  {msg.role === "user" && <Box component="span" sx={{ fontWeight: 'bold'}}>{username || "Вы"}:&nbsp;</Box>}
                  {msg.text}
                </Typography>
              </Paper>
            ))}
            <div ref={messagesEndRef} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1}}>
            <TextField 
              fullWidth 
              variant="outlined" 
              size="small" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ваш вопрос..." 
              onKeyDown={e => e.key === "Enter" && handleSend()}
              sx={{ flexGrow: 1 }}
            />
            <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
          <Button variant="outlined" fullWidth onClick={onBack} sx={{ mt: 1, fontWeight: 'medium' }}>
            Назад
          </Button>
        </CardContent>
      </Card>
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
    { value: 1.2, label: "Минимальная" },
    { value: 1.375, label: "Лёгкая" },
    { value: 1.55, label: "Средняя" },
    { value: 1.725, label: "Высокая" },
    { value: 1.9, label: "Очень высокая" },
  ];

  const goals = [
    { value: "maintain", label: "Держать вес" },
    { value: "loss", label: "Похудеть" },
    { value: "gain", label: "Набрать вес" },
  ];

  return (
    <Container component={motion.div} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.6 }}
      maxWidth="xs"
      sx={{ pt: 2, pb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 72px)', boxSizing: 'border-box' }}
    >
      <Card sx={{ width: '100%', borderRadius: '16px', boxShadow: 3, p:1 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            Настройки профиля
          </Typography>

          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary' }}>Имя:</Typography>
            {editName ? (
              <Box sx={{ display: "flex", gap: 1, alignItems: 'center' }}>
                <TextField fullWidth variant="outlined" size="small" value={newName} onChange={e => setNewName(e.target.value)} />
                <Button variant="contained" size="small" onClick={handleSaveName} sx={{minWidth: 'auto', px:1.5}}>OK</Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: "primary.main" }}>
                  {profile.name || "Нет имени"}
                </Typography>
                <Button variant="text" size="small" onClick={() => setEditName(true)}>Изменить</Button>
              </Box>
            )}
          </Box>

          <TextField fullWidth label="Возраст" type="number" variant="outlined" size="small" value={profile.age} onChange={e => setProfile(p => ({ ...p, age: Number(e.target.value) }))} />
          <TextField fullWidth label="Рост (см)" type="number" variant="outlined" size="small" value={profile.height} onChange={e => setProfile(p => ({ ...p, height: Number(e.target.value) }))} />
          <TextField fullWidth label="Вес (кг)" type="number" variant="outlined" size="small" value={profile.weight} onChange={e => setProfile(p => ({ ...p, weight: Number(e.target.value) }))} />
          
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Пол</InputLabel>
            <Select value={profile.sex} label="Пол" onChange={e => setProfile(p => ({ ...p, sex: e.target.value }))}>
              <MenuItem value="male">Мужской</MenuItem>
              <MenuItem value="female">Женский</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Активность</InputLabel>
            <Select value={profile.activity} label="Активность" onChange={e => setProfile(p => ({ ...p, activity: Number(e.target.value) }))}>
              {activityLevels.map(level => (
                <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Цель</InputLabel>
            <Select value={profile.goal} label="Цель" onChange={e => setProfile(p => ({ ...p, goal: e.target.value }))}>
              {goals.map(g => (
                <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" fullWidth onClick={onBack} sx={{ mt: 1.5, fontWeight: 'medium' }}>
            Назад
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

// История блюд
export function MealsMobile({ mealsByType, onBack }) {
  function mealTypeRus(type) {
    switch (type) {
      case "breakfast": return "Завтрак";
      case "lunch": return "Обед";
      case "dinner": return "Ужин";
      case "snack": return "Перекус";
      default: return "";
    }
  }
  const mealOrder = ["breakfast", "lunch", "dinner", "snack"];

  return (
    <Container component={motion.div} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.6 }}
      maxWidth="xs"
      sx={{ pt: 2, pb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 72px)', boxSizing: 'border-box' }}
    >
      <Card sx={{ width: '100%', borderRadius: '16px', boxShadow: 3, p:1 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            История блюд
          </Typography>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {mealOrder.map((type, index) => (
              <React.Fragment key={type}>
                {index > 0 && <Divider component="li" variant="middle" sx={{my:1}}/>}
                <ListSubheader sx={{ bgcolor: 'transparent', fontWeight: 'bold', color: 'primary.main', lineHeight: '2em'}}>
                  {mealTypeRus(type)}
                </ListSubheader>
                {mealsByType[type] && mealsByType[type].length === 0 ? (
                  <ListItem>
                    <ListItemText primaryTypographyProps={{variant:'body2', color: 'text.secondary', textAlign:'center'}} primary="Пусто" />
                  </ListItem>
                ) : (
                  mealsByType[type] && mealsByType[type].map((meal, idx) => (
                    <ListItem 
                        key={idx} 
                        disablePadding 
                        sx={{ 
                            bgcolor: 'grey.100', 
                            borderRadius: 2, 
                            mb: 0.5, 
                            px:1.5, py: 0.5 
                        }}
                    >
                      <ListItemIcon sx={{minWidth: 36, fontSize: '1.2rem'}}>{meal.emoji || "🍽️"}</ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" component="span">{meal.name}</Typography>} 
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold'}}>{meal.grams} г</Typography>
                    </ListItem>
                  ))
                )}
              </React.Fragment>
            ))}
          </List>
          <Button variant="outlined" fullWidth onClick={onBack} sx={{ mt: 1.5, fontWeight: 'medium' }}>
            Назад
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
