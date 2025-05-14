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
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

// Настройки профиля
export default function SettingsMobile({
  profile,
  setProfile,
  editName,
  setEditName,
  newName,
  setNewName,
  onBack
}) {
  const [saved, setSaved] = React.useState(false);
  // Добавляем состояние для режима КБЖУ (auto или manual)
  const [kbjuMode, setKbjuMode] = React.useState(profile.customKBJU ? "manual" : "auto");
  // Состояние для хранения пользовательских значений КБЖУ
  const defaultKBJU = { 
    calories: 2000, 
    protein: 75, 
    fat: 60, 
    carb: 250 
  };
  const [userKBJU, setUserKBJU] = React.useState(profile.customKBJU || defaultKBJU);

  function handleSaveName() {
    setProfile(p => ({ ...p, name: newName }));
    setEditName(false);
    showSavedMessage();
  }
  
  function handleUpdateProfile(key, value) {
    setProfile(p => ({ ...p, [key]: value }));
    showSavedMessage();
  }
  
  // Обработчик изменения режима КБЖУ
  function handleKBJUModeChange(event, newMode) {
    if (newMode !== null) {
      setKbjuMode(newMode);
      // Если режим изменился, обновляем профиль
      if (newMode === 'auto' && profile.customKBJU) {
        // Удаляем пользовательские значения из профиля
        setProfile(p => {
          const { customKBJU, ...rest } = p;
          return rest;
        });
        showSavedMessage();
      } else if (newMode === 'manual' && !profile.customKBJU) {
        // Добавляем пользовательские значения в профиль
        setProfile(p => ({
          ...p,
          customKBJU: { ...userKBJU }
        }));
        showSavedMessage();
      }
    }
  }
  
  // Обработчик изменения пользовательских значений КБЖУ
  function handleCustomKBJUChange(key, value) {
    const numValue = parseInt(value, 10) || 0;
    setUserKBJU(prev => ({
      ...prev,
      [key]: numValue
    }));
    
    // Обновляем профиль
    setProfile(p => ({
      ...p,
      customKBJU: {
        ...p.customKBJU || userKBJU,
        [key]: numValue
      }
    }));
    showSavedMessage();
  }
  
  function showSavedMessage() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const activityLevels = [
    { value: 1.2, label: "Минимальная", icon: "self_improvement", description: "Сидячий образ жизни, минимальная активность" },
    { value: 1.375, label: "Лёгкая", icon: "directions_walk", description: "Легкие тренировки 1-3 раза в неделю" },
    { value: 1.55, label: "Средняя", icon: "fitness_center", description: "Умеренные тренировки 3-5 раз в неделю" },
    { value: 1.725, label: "Высокая", icon: "exercise", description: "Интенсивные тренировки 6-7 раз в неделю" },
    { value: 1.9, label: "Очень высокая", icon: "local_fire_department", description: "Физическая работа или 2 тренировки в день" },
  ];

  const goals = [
    { value: "maintain", label: "Держать вес", icon: "balance", description: "Сохранение текущего веса" },
    { value: "loss", label: "Похудеть", icon: "trending_down", description: "Дефицит калорий для снижения веса" },
    { value: "gain", label: "Набрать вес", icon: "trending_up", description: "Профицит калорий для набора массы" },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const Item = ({icon, primary, secondary, onClick, selected}) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      variants={itemVariants}
    >
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
            boxShadow: selected ? '0 0 0 2px var(--mui-palette-primary-light)' : '0 1px 5px rgba(0,0,0,0.08)',
          }
        }}
        onClick={onClick}
      >
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Box 
            sx={{
              mr: 1.5, 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: selected ? 'primary.main25' : 'surfaceVariant.main',
              color: selected ? 'primary.main' : 'text.secondary',
              transition: 'all 0.2s ease'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 20 }}>{icon}</span>
          </Box>
          <Box>
            <Typography variant="body1" sx={{fontWeight: selected ? 600: 500, color: selected ? 'primary.main' : 'text.primary'}}>{primary}</Typography>
            {secondary && <Typography variant="caption" sx={{color: 'text.secondary', display: 'block'}}>{secondary}</Typography>}
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
  
  const SectionHeader = ({ title, icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          width: 28, 
          height: 28, 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 16 }}>{icon}</span>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
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
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            style={{ 
              position: 'fixed', 
              top: 70, 
              left: '50%', 
              transform: 'translateX(-50%)',
              zIndex: 1100,
              width: '80%',
              maxWidth: 320
            }}
          >
            <Alert 
              severity="success" 
              variant="filled"
              sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}
            >
              Настройки сохранены
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Paper 
        elevation={2}
        sx={{
          width: '100%', 
          maxWidth: 520, 
          p: { xs: 2.5, sm: 3 }, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '6px',
            bgcolor: 'primary.main',
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={onBack} aria-label="Назад" color="primary" sx={{ mr: 1, ml: -1 }}>
              <span className="material-symbols-rounded">arrow_back</span>
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Настройки
            </Typography>
          </Box>
          
          <ToggleButtonGroup
            value={kbjuMode}
            exclusive
            onChange={handleKBJUModeChange}
            aria-label="Режим КБЖУ"
            size="small"
            color="primary"
            sx={{ height: 36 }}
          >
            <ToggleButton value="auto" aria-label="КБЖУ автоматически">
              <span className="material-symbols-rounded" style={{ fontSize: 18, marginRight: 4 }}>calculate</span>
              Авто
            </ToggleButton>
            <ToggleButton value="manual" aria-label="КБЖУ вручную">
              <span className="material-symbols-rounded" style={{ fontSize: 18, marginRight: 4 }}>edit</span>
              Вручную
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        {kbjuMode === "manual" && (
          <Box 
            component={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            sx={{ mt: 0, mb: 0 }}
          >
            <Paper
              elevation={0}
              sx={{ p: 2, borderRadius: 3, bgcolor: 'surfaceVariant.main' }}
            >
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                Настройка КБЖУ вручную
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Калории"
                    type="number"
                    InputProps={{ 
                      endAdornment: <InputAdornment position="end">ккал</InputAdornment>,
                      inputProps: { min: 500, max: 10000 }
                    }}
                    value={userKBJU.calories}
                    onChange={(e) => handleCustomKBJUChange('calories', e.target.value)}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Белки"
                    type="number"
                    InputProps={{ 
                      endAdornment: <InputAdornment position="end">г</InputAdornment>,
                      inputProps: { min: 10, max: 500 }
                    }}
                    value={userKBJU.protein}
                    onChange={(e) => handleCustomKBJUChange('protein', e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Жиры"
                    type="number"
                    InputProps={{ 
                      endAdornment: <InputAdornment position="end">г</InputAdornment>,
                      inputProps: { min: 10, max: 500 }
                    }}
                    value={userKBJU.fat}
                    onChange={(e) => handleCustomKBJUChange('fat', e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Углеводы"
                    type="number"
                    InputProps={{ 
                      endAdornment: <InputAdornment position="end">г</InputAdornment>,
                      inputProps: { min: 10, max: 1000 }
                    }}
                    value={userKBJU.carb}
                    onChange={(e) => handleCustomKBJUChange('carb', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        <Box component={motion.div} variants={itemVariants}>
          <SectionHeader title="Имя профиля" icon="person" />
          
          {editName ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                value={newName}
                onChange={e => setNewName(e.target.value)}
                fullWidth
                label="Ваше имя"
                variant="outlined"
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setEditName(false)} edge="end" size="small">
                        <span className="material-symbols-rounded" style={{ fontSize: 20 }}>close</span>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleSaveName}
                sx={{ px: 3, height: 56 }}
              >
                Сохранить
              </Button>
            </Box>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                bgcolor: 'surfaceVariant.main',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '1.2rem'
                  }}
                >
                  {profile.name ? profile.name[0].toUpperCase() : 'Г'}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.name || "Гость"}
                </Typography>
              </Box>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setNewName(profile.name);
                    setEditName(true);
                  }}
                  startIcon={<span className="material-symbols-rounded">edit</span>}
                  sx={{ px: 2 }}
                >
                  Изменить
                </Button>
              </motion.div>
            </Box>
          )}
        </Box>

        <Box component={motion.div} variants={itemVariants}>
          <SectionHeader title="Пол" icon="wc" />
          
          <ToggleButtonGroup
            value={profile.sex}
            exclusive
            onChange={(e, newValue) => newValue && handleUpdateProfile('sex', newValue)}
            aria-label="Пол"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="male" aria-label="Мужской">
              <span className="material-symbols-rounded" style={{ marginRight: 8 }}>male</span>
              Мужской
            </ToggleButton>
            <ToggleButton value="female" aria-label="Женский">
              <span className="material-symbols-rounded" style={{ marginRight: 8 }}>female</span>
              Женский
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <motion.div variants={itemVariants}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Box>
                <SectionHeader title="Возраст" icon="cake" />
                <TextField
                  type="number"
                  value={profile.age}
                  onChange={e => handleUpdateProfile('age', Number(e.target.value) || profile.age)}
                  InputProps={{ 
                    inputProps: { min: 12, max: 100 },
                    endAdornment: <InputAdornment position="end">лет</InputAdornment>
                  }}
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box>
                <SectionHeader title="Вес" icon="monitor_weight" />
                <TextField
                  type="number"
                  value={profile.weight}
                  onChange={e => handleUpdateProfile('weight', Number(e.target.value) || profile.weight)}
                  InputProps={{ 
                    inputProps: { min: 30, max: 300 },
                    endAdornment: <InputAdornment position="end">кг</InputAdornment>
                  }}
                  fullWidth
                />
              </Box>
            </Grid>
          </Grid>
        </motion.div>

        <Box component={motion.div} variants={itemVariants}>
          <SectionHeader title="Рост" icon="height" />
          <TextField
            type="number"
            value={profile.height}
            onChange={e => handleUpdateProfile('height', Number(e.target.value) || profile.height)}
            InputProps={{ 
              inputProps: { min: 100, max: 250 },
              endAdornment: <InputAdornment position="end">см</InputAdornment>
            }}
            fullWidth
          />
        </Box>

        <Box component={motion.div} variants={itemVariants}>
          <SectionHeader title="Уровень активности" icon="fitness_center" />
          {activityLevels.map(level => (
            <Tooltip
              key={level.value}
              title={level.description}
              placement="right"
              arrow
            >
              <Box>
                <Item
                  icon={level.icon}
                  primary={level.label}
                  secondary={level.description}
                  selected={profile.activity === level.value}
                  onClick={() => handleUpdateProfile('activity', level.value)}
                />
              </Box>
            </Tooltip>
          ))}
        </Box>

        <Box component={motion.div} variants={itemVariants}>
          <SectionHeader title="Цель" icon="flag" />
          {goals.map(goal => (
            <Tooltip
              key={goal.value}
              title={goal.description}
              placement="right"
              arrow
            >
              <Box>
                <Item
                  icon={goal.icon}
                  primary={goal.label}
                  secondary={goal.description}
                  selected={profile.goal === goal.value}
                  onClick={() => handleUpdateProfile('goal', goal.value)}
                />
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Paper>
    </Container>
  );
} 