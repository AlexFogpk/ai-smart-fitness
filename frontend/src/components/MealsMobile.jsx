import React from "react";
import { motion } from "framer-motion";

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

// Компонент для отображения списка блюд
export default function MealsMobile({ mealsByType, onBack }) {
  function mealTypeRus(type) {
    const types = {
      breakfast: "Завтрак",
      lunch: "Обед",
      dinner: "Ужин",
      snack: "Перекусы",
    };
    return types[type] || type;
  }

  function mealTypeIcon(type) {
    const icons = {
      breakfast: "bakery_dining",
      lunch: "lunch_dining",
      dinner: "dinner_dining",
      snack: "bakery_dining",
    };
    return icons[type] || "lunch_dining";
  }

  // Считаем общее количество приемов пищи
  const totalMeals = Object.values(mealsByType).reduce(
    (sum, meals) => sum + meals.length,
    0
  );

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
          maxWidth: 520,
          p: { xs: 0, sm: 0 }, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{display: 'flex', justifyContent:'space-between', alignItems:'center', p: {xs: 1.5, sm: 2}, borderBottom: 1, borderColor: 'divider'}}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Мои блюда
          </Typography>
          <IconButton onClick={onBack} aria-label="Назад" color="primary">
            <span className="material-symbols-rounded">close</span>
          </IconButton>
        </Box>
        
        <Box sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {totalMeals === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span className="material-symbols-rounded" style={{ fontSize: 64, color: 'var(--mui-palette-text-disabled)', marginBottom: 8 }}>restaurant</span>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                У вас еще нет добавленных блюд
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Добавьте приёмы пищи в дневник, чтобы они отображались здесь
              </Typography>
              <Button 
                variant="contained"
                color="primary"
                onClick={onBack}
                startIcon={<span className="material-symbols-rounded">add</span>}
                sx={{ px: 3 }}
              >
                Добавить питание
              </Button>
            </Box>
          ) : (
            <>
              {Object.entries(mealsByType).map(([type, meals]) => 
                meals.length > 0 && (
                  <div key={type}>
                    <List
                      subheader={
                        <ListSubheader component="div" sx={{ bgcolor: 'surfaceVariant.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span className="material-symbols-rounded" style={{ fontSize: 20 }}>{mealTypeIcon(type)}</span>
                          {mealTypeRus(type)}
                        </ListSubheader>
                      }
                    >
                      {meals.map((meal, i) => (
                        <ListItem 
                          key={`${type}-${i}`} 
                          divider
                          secondaryAction={
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {meal.calories} ккал
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {meal.grams} г
                              </Typography>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ mr: 0.5 }}>{meal.name}</Typography>
                                {meal.emoji && <Typography variant="body2">{meal.emoji}</Typography>}
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Б: {meal.protein}г · Ж: {meal.fat}г · У: {meal.carb}г
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                )
              )}
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
} 