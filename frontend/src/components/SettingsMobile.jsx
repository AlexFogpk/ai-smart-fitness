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
import Grid from '@mui/material/Grid';

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
  function handleSaveName() {
    setProfile(p => ({ ...p, name: newName }));
    setEditName(false);
  }

  const activityLevels = [
    { value: 1.2, label: "Минимальная", icon: "self_improvement" },
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
            Настройки
          </Typography>
          <IconButton onClick={onBack} aria-label="Назад" color="primary">
            <span className="material-symbols-rounded">close</span>
          </IconButton>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Имя профиля
          </Typography>
          {editName ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                value={newName}
                onChange={e => setNewName(e.target.value)}
                fullWidth
                label="Ваше имя"
                variant="outlined"
                autoFocus
              />
              <Button 
                variant="contained" 
                onClick={handleSaveName}
                sx={{ px: 3 }}
              >
                Сохранить
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body1">{profile.name || "Гость"}</Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setNewName(profile.name);
                  setEditName(true);
                }}
                sx={{ px: 3 }}
              >
                Изменить
              </Button>
            </Box>
          )}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
            Пол
          </Typography>
          <Grid container spacing={1}>
            {genders.map(gender => (
              <Grid xs={6} key={gender.value}>
                <Item
                  icon={gender.icon}
                  primary={gender.label}
                  selected={profile.sex === gender.value}
                  onClick={() => setProfile(p => ({ ...p, sex: gender.value }))}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={2}>
          <Grid xs={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
              Возраст
            </Typography>
            <TextField
              type="number"
              value={profile.age}
              onChange={e => setProfile(p => ({ ...p, age: Number(e.target.value) || p.age }))}
              InputProps={{ inputProps: { min: 12, max: 100 } }}
            />
          </Grid>
          <Grid xs={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
              Вес (кг)
            </Typography>
            <TextField
              type="number"
              value={profile.weight}
              onChange={e => setProfile(p => ({ ...p, weight: Number(e.target.value) || p.weight }))}
              InputProps={{ inputProps: { min: 30, max: 300 } }}
            />
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
            Рост (см)
          </Typography>
          <TextField
            type="number"
            value={profile.height}
            onChange={e => setProfile(p => ({ ...p, height: Number(e.target.value) || p.height }))}
            InputProps={{ inputProps: { min: 100, max: 250 } }}
          />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
            Уровень активности
          </Typography>
          {activityLevels.map(level => (
            <Item
              key={level.value}
              icon={level.icon}
              primary={level.label}
              selected={profile.activity === level.value}
              onClick={() => setProfile(p => ({ ...p, activity: level.value }))}
            />
          ))}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
            Цель
          </Typography>
          {goals.map(goal => (
            <Item
              key={goal.value}
              icon={goal.icon}
              primary={goal.label}
              selected={profile.goal === goal.value}
              onClick={() => setProfile(p => ({ ...p, goal: goal.value }))}
            />
          ))}
        </Box>
      </Paper>
    </Container>
  );
} 