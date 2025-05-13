import React from "react";
import { motion } from "framer-motion";

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

// Калькулятор питания
export default function CalculatorMobile({
  setMealsByType,
  calcType,
  setCalcType,
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
          <Grid xs={6}>
            <TextField 
              fullWidth 
              label="Граммы" 
              type="number" 
              value={meal.grams} 
              onChange={e => setMeal(m => ({ ...m, grams: e.target.value.replace(/\D/g, "") }))} 
            />
          </Grid>
          <Grid xs={6}>
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
          <Grid xs={4}>
            <TextField 
              fullWidth 
              label="Белки (г)" 
              type="number" 
              value={meal.protein} 
              onChange={e => setMeal(m => ({ ...m, protein: e.target.value.replace(/\D/g, "") }))} 
            />
          </Grid>
          <Grid xs={4}>
            <TextField 
              fullWidth 
              label="Углеводы (г)" 
              type="number" 
              value={meal.carb} 
              onChange={e => setMeal(m => ({ ...m, carb: e.target.value.replace(/\D/g, "") }))} 
            />
          </Grid>
          <Grid xs={4}>
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