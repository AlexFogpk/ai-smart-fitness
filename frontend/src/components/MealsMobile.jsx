import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';

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

  // Цвета для категорий приема пищи
  function mealTypeColor(type) {
    const colors = {
      breakfast: "#ff9800", // оранжевый
      lunch: "#2196f3",    // синий
      dinner: "#673ab7",   // фиолетовый
      snack: "#4caf50",    // зеленый
    };
    return colors[type] || "#9e9e9e";
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

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
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
      <Box
        sx={{
          width: '100%',
          maxWidth: 520,
          display: 'flex', 
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Box 
          sx={{
            display: 'flex', 
            justifyContent:'space-between', 
            alignItems:'center', 
            mb: 2,
            px: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={onBack} 
              aria-label="Назад" 
              color="primary"
              sx={{ mr: 1 }}
            >
              <span className="material-symbols-rounded">arrow_back</span>
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Мои блюда
            </Typography>
          </Box>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Chip 
              label={`Всего: ${totalMeals}`} 
              color="primary" 
              variant="outlined"
              icon={<span className="material-symbols-rounded" style={{ fontSize: 18 }}>nutrition</span>}
            />
          </motion.div>
        </Box>
        
        <Box sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <AnimatePresence>
            {totalMeals === 0 ? (
              <Paper
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                elevation={2}
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 2,
                  borderRadius: 3
                }}
              >
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 72, color: 'var(--mui-palette-text-disabled)' }}>restaurant</span>
                </motion.div>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  У вас еще нет добавленных блюд
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Добавьте приёмы пищи в дневник, чтобы они отображались здесь
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="contained"
                    color="primary"
                    onClick={onBack}
                    startIcon={<span className="material-symbols-rounded">add</span>}
                    sx={{ px: 3, py: 1.2, borderRadius: 28 }}
                  >
                    Добавить питание
                  </Button>
                </motion.div>
              </Paper>
            ) : (
              <Box component={motion.div} variants={listVariants} initial="hidden" animate="visible">
                {Object.entries(mealsByType).map(([type, meals]) => 
                  meals.length > 0 && (
                    <Box key={type} sx={{ mb: 3 }}>
                      <ListSubheader 
                        component="div" 
                        sx={{ 
                          bgcolor: 'transparent',
                          fontWeight: 600, 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          px: 1,
                          pb: 1
                        }}
                      >
                        <span className="material-symbols-rounded" style={{ 
                          fontSize: 22, 
                          color: mealTypeColor(type),
                          backgroundColor: `${mealTypeColor(type)}15`,
                          padding: '4px',
                          borderRadius: '50%'
                        }}>
                          {mealTypeIcon(type)}
                        </span>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {mealTypeRus(type)}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={meals.length} 
                          sx={{ 
                            ml: 'auto', 
                            bgcolor: `${mealTypeColor(type)}15`,
                            color: mealTypeColor(type),
                            fontWeight: 600,
                            height: 26
                          }} 
                        />
                      </ListSubheader>
                      
                      <Grid container spacing={1.5}>
                        {meals.map((meal, i) => (
                          <Grid item xs={12} key={`${type}-${i}`}>
                            <Card 
                              component={motion.div}
                              variants={itemVariants}
                              whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                              elevation={1}
                              sx={{ 
                                p: 0, 
                                overflow: 'hidden',
                                borderRadius: 3
                              }}
                            >
                              {/* Градиентный заголовок */}
                              <Box 
                                sx={{ 
                                  background: `linear-gradient(90deg, ${mealTypeColor(type)}50 0%, ${mealTypeColor(type)}20 100%)`,
                                  p: 1.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                <Box 
                                  sx={{ 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: '50%', 
                                    bgcolor: mealTypeColor(type),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <span className="material-symbols-rounded" style={{ color: 'white', fontSize: 18 }}>
                                    {mealTypeIcon(type)}
                                  </span>
                                </Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                  {meal.name} {meal.emoji && meal.emoji}
                                </Typography>
                                <Chip 
                                  size="small" 
                                  label={`${meal.calories} ккал`} 
                                  sx={{ 
                                    bgcolor: 'white', 
                                    color: mealTypeColor(type), 
                                    fontWeight: 700, 
                                    ml: 'auto' 
                                  }} 
                                />
                              </Box>
                              
                              {/* Тело карточки */}
                              <Box sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Порция: <b>{meal.grams} г</b>
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="Редактировать" arrow>
                                      <IconButton size="small" sx={{ p: 0.5 }}>
                                        <span className="material-symbols-rounded" style={{ fontSize: 18 }}>edit</span>
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Копировать" arrow>
                                      <IconButton size="small" sx={{ p: 0.5 }}>
                                        <span className="material-symbols-rounded" style={{ fontSize: 18 }}>content_copy</span>
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить" arrow>
                                      <IconButton size="small" sx={{ p: 0.5 }}>
                                        <span className="material-symbols-rounded" style={{ fontSize: 18 }}>delete</span>
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>
                                
                                <Grid container spacing={1.5}>
                                  <Grid item xs={4}>
                                    <Paper 
                                      elevation={0} 
                                      sx={{ 
                                        p: 1, 
                                        textAlign: 'center', 
                                        bgcolor: '#e8f5e9', 
                                        borderRadius: 2 
                                      }}
                                    >
                                      <Typography variant="caption" sx={{ color: '#2e7d32', display: 'block' }}>Белки</Typography>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                                        {meal.protein} г
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Paper 
                                      elevation={0} 
                                      sx={{ 
                                        p: 1, 
                                        textAlign: 'center', 
                                        bgcolor: '#fff3e0', 
                                        borderRadius: 2 
                                      }}
                                    >
                                      <Typography variant="caption" sx={{ color: '#e65100', display: 'block' }}>Жиры</Typography>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#e65100' }}>
                                        {meal.fat} г
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Paper 
                                      elevation={0} 
                                      sx={{ 
                                        p: 1, 
                                        textAlign: 'center', 
                                        bgcolor: '#e3f2fd', 
                                        borderRadius: 2 
                                      }}
                                    >
                                      <Typography variant="caption" sx={{ color: '#0277bd', display: 'block' }}>Углеводы</Typography>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0277bd' }}>
                                        {meal.carb} г
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )
                )}
              </Box>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Container>
  );
} 