import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Zoom from '@mui/material/Zoom';
import Chip from '@mui/material/Chip';

// Калькулятор питания
export default function CalculatorMobile({
  setMealsByType,
  calcType,
  setCalcType,
  onBack
}) {
  const [meal, setMeal] = React.useState({ name: "", grams: "", calories: "", protein: "", carb: "", fat: "", emoji: "" });
  const [submitted, setSubmitted] = React.useState(false);
  const nameInputRef = React.useRef(null);

  function handleAddMeal() {
    if (!meal.name || !meal.grams) return;
    
    setMealsByType((prev) => ({
      ...prev,
      [calcType]: [...prev[calcType], { ...meal, grams: Number(meal.grams), calories: Number(meal.calories), protein: Number(meal.protein), carb: Number(meal.carb), fat: Number(meal.fat) }]
    }));
    
    // Показать сообщение об успешном добавлении
    setSubmitted(true);
    
    // Сбросить форму через небольшую задержку
    setTimeout(() => {
      setMeal({ name: "", grams: "", calories: "", protein: "", carb: "", fat: "", emoji: "" });
      setSubmitted(false);
      // Фокус на поле имени
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 1500);
  }

  const handleCalcTypeChange = (event, newCalcType) => {
    if (newCalcType !== null) {
      setCalcType(newCalcType);
    }
  };

  const mealTypes = [
    { value: "breakfast", label: "Завтрак", icon: "bakery_dining", color: "#ff9800" },
    { value: "lunch", label: "Обед", icon: "lunch_dining", color: "#2196f3" },
    { value: "dinner", label: "Ужин", icon: "dinner_dining", color: "#673ab7" },
    { value: "snack", label: "Перекус", icon: "bakery_dining", color: "#4caf50" },
  ];
  
  // Найти цвет текущего типа приема пищи
  const currentTypeColor = mealTypes.find(type => type.value === calcType)?.color || "#2196f3";

  // Анимации для контейнера
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };
  
  // Анимации для полей ввода
  const inputVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0 }
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
        boxSizing: 'border-box',
        overflow: 'hidden' 
      }}
    >
      <Paper 
        elevation={2}
        sx={{
          width: '100%', 
          maxWidth: 480,
          p: { xs: 2.5, sm: 3 }, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2.5,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Декоративный элемент с цветом текущего типа приема пищи */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '6px',
            bgcolor: currentTypeColor,
            transition: 'background-color 0.3s ease'
          }}
        />
        
        <Box sx={{display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={onBack} 
              aria-label="Назад" 
              color="primary"
              sx={{ mr: 1, ml: -1 }}
            >
              <span className="material-symbols-rounded">arrow_back</span>
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Добавить приём пищи
            </Typography>
          </Box>
        </Box>
        
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity="success" 
                sx={{ mb: 2, borderRadius: 2 }}
                icon={<span className="material-symbols-rounded">check_circle</span>}
              >
                Блюдо успешно добавлено в дневник
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        
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
            overflow: 'hidden',
            mb: 1,
            '& .MuiToggleButtonGroup-grouped': {
              mx: 0.5,
              my: 0.5,
              border: 0,
              borderRadius: '24px !important',
              padding: '8px 12px',
              fontSize: {xs: '0.8rem', sm: '0.875rem'},
              color: 'text.secondary',
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                color: 'primary.contrastText',
                bgcolor: 'primary.main',
                boxShadow: '0px 2px 6px rgba(0,0,0,0.1)'
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
              sx={{ flexGrow: 1 }}
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span 
                className="material-symbols-rounded" 
                style={{
                  marginRight: 6, 
                  fontSize: 18,
                  color: calcType === type.value ? '#fff' : type.color
                }}
              >
                {type.icon}
              </span>
              {type.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <motion.div
          variants={inputVariants}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <TextField 
            fullWidth 
            label="Название блюда/продукта" 
            value={meal.name} 
            onChange={e => setMeal(m => ({ ...m, name: e.target.value }))}
            inputRef={nameInputRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="material-symbols-rounded" style={{ color: currentTypeColor }}>restaurant</span>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: currentTypeColor,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: currentTypeColor,
              },
            }}
          />
        </motion.div>
        
        <Grid container spacing={2}>
          <Grid xs={6}>
            <motion.div
              variants={inputVariants}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <TextField 
                fullWidth 
                label="Граммы" 
                type="number" 
                value={meal.grams} 
                onChange={e => setMeal(m => ({ ...m, grams: e.target.value.replace(/\D/g, "") }))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">г</InputAdornment>,
                }}
              />
            </motion.div>
          </Grid>
          <Grid xs={6}>
            <motion.div
              variants={inputVariants}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <TextField 
                fullWidth 
                label="Калории" 
                type="number" 
                value={meal.calories} 
                onChange={e => setMeal(m => ({ ...m, calories: e.target.value.replace(/\D/g, "") }))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ккал</InputAdornment>,
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="material-symbols-rounded" style={{ fontSize: 18 }}>local_fire_department</span>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
        
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mt: 0.5, 
            fontWeight: 600, 
            color: 'text.secondary', 
            display: 'flex', 
            alignItems: 'center',
            gap: 0.5 
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 18 }}>data_array</span>
          Макронутриенты:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid xs={4}>
            <motion.div
              variants={inputVariants}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <TextField 
                fullWidth 
                label="Белки" 
                type="number" 
                value={meal.protein} 
                onChange={e => setMeal(m => ({ ...m, protein: e.target.value.replace(/\D/g, "") }))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">г</InputAdornment>,
                  sx: { 
                    '& .MuiInputAdornment-root': { color: '#2e7d32' }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2e7d32',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2e7d32',
                  },
                }}
              />
            </motion.div>
          </Grid>
          <Grid xs={4}>
            <motion.div
              variants={inputVariants}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <TextField 
                fullWidth 
                label="Углеводы" 
                type="number" 
                value={meal.carb} 
                onChange={e => setMeal(m => ({ ...m, carb: e.target.value.replace(/\D/g, "") }))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">г</InputAdornment>,
                  sx: { 
                    '& .MuiInputAdornment-root': { color: '#0277bd' }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#0277bd',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0277bd',
                  },
                }}
              />
            </motion.div>
          </Grid>
          <Grid xs={4}>
            <motion.div
              variants={inputVariants}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <TextField 
                fullWidth 
                label="Жиры" 
                type="number" 
                value={meal.fat} 
                onChange={e => setMeal(m => ({ ...m, fat: e.target.value.replace(/\D/g, "") }))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">г</InputAdornment>,
                  sx: { 
                    '& .MuiInputAdornment-root': { color: '#e65100' }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#e65100',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#e65100',
                  },
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
        
        <motion.div
          variants={inputVariants}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <TextField 
            fullWidth 
            label="Эмодзи (опционально)" 
            value={meal.emoji} 
            onChange={e => setMeal(m => ({ ...m, emoji: e.target.value }))} 
            InputProps={{
              startAdornment: <span className="material-symbols-rounded" style={{ marginRight: 8, color: 'text.secondary' }}>sentiment_satisfied</span>,
            }}
          />
        </motion.div>
        
        <Box sx={{ pt: 1.5 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1.5, gap: 0.5 }}>
            {["🍗", "🥗", "🍎", "🍞", "🥛", "🍳", "🍚", "🥩"].map((emoji) => (
              <Chip
                key={emoji}
                label={emoji}
                onClick={() => setMeal(m => ({ ...m, emoji: emoji }))}
                sx={{ 
                  fontSize: '1rem',
                  cursor: 'pointer',
                  bgcolor: meal.emoji === emoji ? 'primary.light' : 'surfaceVariant.main',
                  '&:hover': {
                    bgcolor: meal.emoji === emoji ? 'primary.light' : 'action.hover',
                  }
                }}
                component={motion.div}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </Box>
          
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={handleAddMeal} 
              disabled={!meal.name || !meal.grams || submitted}
              startIcon={<span className="material-symbols-rounded">add_task</span>}
              sx={{ 
                py: 1.5, 
                fontSize: 16, 
                borderRadius: '28px',
                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.25)',
                bgcolor: currentTypeColor,
                '&:hover': {
                  bgcolor: currentTypeColor,
                  filter: 'brightness(0.9)'
                }
              }}
            >
              Добавить в дневник
            </Button>
          </motion.div>
        </Box>
      </Paper>
    </Container>
  );
} 