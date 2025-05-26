// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { addDays, subDays, format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Иконки (примеры, можно будет добавить другие)
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'; // Для общей темы
import StraightenIcon from '@mui/icons-material/Straighten'; // Для замеров (линейка)
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Для прогресса
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShowChartIcon from '@mui/icons-material/ShowChart'; // Для иконки графика
import FlagIcon from '@mui/icons-material/Flag'; // Для целей
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Переносим measurementTypes сюда, чтобы он был доступен глобально в компоненте ProgressDashboard
const measurementTypes = [
  { id: 'weight', label: 'Вес', unit: 'кг' },
  { id: 'waist', label: 'Талия', unit: 'см' },
  { id: 'chest', label: 'Грудь', unit: 'см' },
  { id: 'hips', label: 'Бедра', unit: 'см' },
  { id: 'biceps', label: 'Бицепс', unit: 'см' },
];

const ProgressDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [measurements, setMeasurements] = useState({}); // { '2023-10-26': [{ type: 'weight', value: 70, unit: 'kg' }] }
  const [goals, setGoals] = useState({}); // { 'weight': { target: 65, unit: 'kg' } }

  // TODO: Load data from localStorage on mount
  useEffect(() => {
    const savedMeasurements = localStorage.getItem('measurements');
    if (savedMeasurements) {
      setMeasurements(JSON.parse(savedMeasurements));
    }
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // TODO: Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('measurements', JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddMeasurement = (date, type, value, unit) => {
    const dateString = format(date, 'yyyy-MM-dd');
    setMeasurements(prev => {
      const dayMeasurements = prev[dateString] || [];
      // Check if measurement of this type already exists for this day, update if so
      const existingIndex = dayMeasurements.findIndex(m => m.type === type);
      if (existingIndex > -1) {
        dayMeasurements[existingIndex] = { type, value, unit };
        return { ...prev, [dateString]: [...dayMeasurements] };
      }
      return { ...prev, [dateString]: [...dayMeasurements, { type, value, unit }] };
    });
  };

  const handleSetGoal = (type, target, unit) => {
    setGoals(prev => ({ ...prev, [type]: { target: parseFloat(target), unit } }));
  };

  const handlePrevDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  // TODO: Компонент для ввода нового замера
  const MeasurementInput = () => {
    const [type, setType] = useState('weight');
    const [value, setValue] = useState('');
    const [unit, setUnit] = useState('kg');

    const handleSubmit = () => {
      if (value && type) {
        handleAddMeasurement(selectedDate, type, parseFloat(value), unit);
        setValue(''); // Reset value
      }
    };
    
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', color: 'primary.main'}}>
          <AddCircleOutlineIcon sx={{mr: 1}} /> Добавить замер на {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
        </Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Тип замера"
              value={type}
              onChange={(e) => {
                const selectedType = measurementTypes.find(t => t.id === e.target.value);
                setType(e.target.value);
                if (selectedType) setUnit(selectedType.unit);
              }}
              fullWidth
              SelectProps={{ native: true }}
              variant="outlined"
            >
              {measurementTypes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              label="Значение"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{ endAdornment: <Typography variant="caption" sx={{ml:0.5}}>{unit}</Typography> }}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
             <TextField
              label="Ед. изм."
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              fullWidth
              variant="outlined"
              disabled // Пока что единицы измерения зависят от типа
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="contained" onClick={handleSubmit} fullWidth sx={{height: '56px'}}>
              Добавить
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // TODO: Компонент для отображения замеров за выбранный день
  const DailyMeasurements = () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const currentMeasurements = measurements[dateString] || [];

    if (currentMeasurements.length === 0) {
      return (
        <Paper elevation={1} sx={{ p: 2, textAlign: 'center', borderRadius: 3, backgroundColor: 'grey.100' }}>
          <StraightenIcon sx={{fontSize: 40, color: 'grey.400', mb:1}}/>
          <Typography variant="subtitle1" color="textSecondary">
            Нет замеров за {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Добавьте свой первый замер с помощью формы выше.
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom sx={{color: 'primary.main', display: 'flex', alignItems: 'center'}}>
          <CalendarTodayIcon sx={{mr:1}}/> Замеры за {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
        </Typography>
        <Grid container spacing={2}>
          <AnimatePresence>
            {currentMeasurements.map(m => (
              <Grid item xs={6} sm={4} md={3} key={m.type}> 
                <motion.div 
                  key={m.type} // Ключ важен для AnimatePresence
                  layout // Плавное изменение расположения при удалении/добавлении
                  initial={{ opacity: 0, y: 20, scale: 0.9 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: -20, scale: 0.9 }} 
                  transition={{ duration: 0.3 }}
                >
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center', borderRadius: 2, backgroundColor: 'secondary.lightOpal' }}>
                    <Typography variant="button" display="block" color="text.secondary" sx={{textTransform: 'capitalize'}}>
                      {measurementTypes.find(mt => mt.id === m.type)?.label || m.type}
                    </Typography>
                    <Typography variant="h5" component="p" sx={{fontWeight: 'bold', color: 'secondary.main'}}>
                      {m.value} <Typography variant="caption" component="span">{m.unit}</Typography>
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Paper>
    );
  };
  
  const WeightChart = () => {
    const dataForChart = Object.entries(measurements)
      .map(([date, dailyMeasurements]) => {
        const weightMeasurement = dailyMeasurements.find(m => m.type === 'weight');
        return weightMeasurement ? { date, weight: parseFloat(weightMeasurement.value) } : null;
      })
      .filter(item => item !== null)
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Сортируем по дате

    if (dataForChart.length < 2) {
      return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p:2, minHeight: 200}}>
            <ShowChartIcon sx={{fontSize: 40, color: 'grey.400', mb:1}}/>
            <Typography color="textSecondary">Недостаточно данных для графика веса.</Typography>
            <Typography variant="caption" color="textSecondary">Добавьте хотя бы два замера веса в разные дни.</Typography>
        </Box>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataForChart} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(tick) => format(new Date(tick), 'dd.MM', { locale: ru })} />
          <YAxis allowDecimals={true} unit=" кг" domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(value) => value.toFixed(1)} />
          <Tooltip formatter={(value) => [`${value.toFixed(1)} кг`, "Вес"]} />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} name="Вес" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // TODO: Компонент для графиков прогресса (заглушка)
  const ProgressCharts = () => (
    <Paper elevation={2} sx={{ p: {xs: 1, sm: 2}, mt: 2, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{color: 'primary.main', display: 'flex', alignItems: 'center', mb:2}}>
        <TrendingUpIcon sx={{mr: 1}}/> График изменения веса
      </Typography>
      <WeightChart />
    </Paper>
  );

  // TODO: Компонент для установки целей (заглушка)
  const GoalSetting = () => {
    const [goalType, setGoalType] = useState('weight');
    const [goalValue, setGoalValue] = useState('');
    const [goalUnit, setGoalUnit] = useState('кг');
    const [showInputForm, setShowInputForm] = useState(false); // Управляет видимостью формы

    useEffect(() => {
      const currentGoal = goals[goalType];
      if (currentGoal) {
        setGoalValue(currentGoal.target.toString());
        setGoalUnit(currentGoal.unit);
        setShowInputForm(false); // Если цель есть, по умолчанию скрываем форму
      } else {
        setGoalValue('');
        const typeInfo = measurementTypes.find(t => t.id === goalType);
        if (typeInfo) setGoalUnit(typeInfo.unit);
        setShowInputForm(true); // Если цели нет, показываем форму для её создания
      }
    }, [goalType, goals]);

    const handleGoalSubmit = () => {
      if (goalValue && goalType) {
        handleSetGoal(goalType, parseFloat(goalValue), goalUnit);
        setShowInputForm(false); // Скрываем форму после сохранения
      }
    };

    const handleEditGoal = (typeToEdit) => {
        setGoalType(typeToEdit); // Устанавливаем тип редактируемой цели
        const currentGoal = goals[typeToEdit];
        if (currentGoal) {
            setGoalValue(currentGoal.target.toString());
            setGoalUnit(currentGoal.unit);
        }
        setShowInputForm(true); // Показываем форму для редактирования
    };
    
    const handleAddNewGoal = () => {
        const firstTypeWithoutGoal = measurementTypes.find(mt => !goals[mt.id]);
        if (firstTypeWithoutGoal) {
            setGoalType(firstTypeWithoutGoal.id);
            setGoalValue('');
            setGoalUnit(firstTypeWithoutGoal.unit);
        } else { // Если на все типы есть цели, выбираем первый тип по умолчанию
            setGoalType(measurementTypes[0].id);
            setGoalValue('');
            setGoalUnit(measurementTypes[0].unit);
        }
        setShowInputForm(true);
    };

    return (
      <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 3 }}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
            <Typography variant="h6" sx={{color: 'primary.main', display: 'flex', alignItems: 'center'}}>
              <FlagIcon sx={{mr: 1}}/> Мои Цели
            </Typography>
            {!showInputForm && Object.keys(goals).length < measurementTypes.length && (
                 <Button variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />} onClick={handleAddNewGoal}>Добавить цель</Button>
            )}
        </Box>
        
        {showInputForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Grid container spacing={2} alignItems="flex-end" sx={{mb: 2}}>
                <Grid item xs={12} sm={4}>
                    <TextField 
                        select 
                        label="Тип Цели" 
                        value={goalType} 
                        onChange={(e) => {
                            const selected = measurementTypes.find(t => t.id === e.target.value);
                            setGoalType(e.target.value);
                            if (selected) setGoalUnit(selected.unit);
                            const existingGoal = goals[e.target.value];
                            if (existingGoal) {
                                setGoalValue(existingGoal.target.toString());
                            } else {
                                setGoalValue('');
                            }
                        }} 
                        fullWidth 
                        SelectProps={{ native: true }} 
                        variant="outlined"
                        disabled={Object.keys(goals).includes(goalType) && goals[goalType]?.target.toString() === goalValue} // Блокируем если это существующая цель, которую не начали редактировать
                    >
                    {measurementTypes.map((option) => (<option key={option.id} value={option.id}>{option.label}</option>))}
                    </TextField>
                </Grid>
                <Grid item xs={8} sm={4}>
                    <TextField label="Целевое значение" type="number" value={goalValue} onChange={(e) => setGoalValue(e.target.value)} fullWidth variant="outlined" InputProps={{ endAdornment: <Typography variant="caption" sx={{ml:0.5}}>{goalUnit}</Typography> }}/>
                </Grid>
                <Grid item xs={4} sm={2}>
                    <TextField label="Ед." value={goalUnit} fullWidth variant="outlined" disabled />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button variant="contained" onClick={handleGoalSubmit} fullWidth sx={{height: '56px'}}>
                        {goals[goalType] ? 'Обновить' : 'Сохранить'}
                    </Button>
                </Grid>
                 {goals[goalType] && (
                    <Grid item xs={12}>
                        <Button variant="text" size="small" onClick={() => setShowInputForm(false)}>Отмена</Button>
                    </Grid>
                )}
                </Grid>
            </motion.div>
        )}

        {Object.keys(goals).length > 0 ? (
            <Box>
              <AnimatePresence>
                {measurementTypes.filter(mt => goals[mt.id]).map(mt => {
                    const goal = goals[mt.id];
                    let latestMeasurementValue = null;
                    let initialMeasurementValue = null; 
                    
                    const sortedDates = Object.keys(measurements).sort((a,b) => new Date(a) - new Date(b));
                    
                    if (sortedDates.length > 0) {
                        for (const date of sortedDates) {
                            const dayMeasurement = measurements[date]?.find(m => m.type === mt.id);
                            if (dayMeasurement) {
                                initialMeasurementValue = parseFloat(dayMeasurement.value);
                                break;
                            }
                        }
                        for (let i = sortedDates.length - 1; i >= 0; i--) {
                            const dayMeasurement = measurements[sortedDates[i]]?.find(m => m.type === mt.id);
                            if (dayMeasurement) {
                                latestMeasurementValue = parseFloat(dayMeasurement.value);
                                break;
                            }
                        }
                    }
                    
                    let progressText = "Нет данных для отслеживания";
                    let progressPercent = 0;
                    let isAchieved = false;

                    if (latestMeasurementValue !== null) {
                        isAchieved = latestMeasurementValue === goal.target;
                        if (isAchieved) {
                            progressText = "Цель достигнута!";
                            progressPercent = 100;
                        } else {
                            const target = goal.target;
                            const startPoint = initialMeasurementValue !== null ? initialMeasurementValue : (target < latestMeasurementValue ? target * 1.5 : target * 0.5); 
                            
                            if (target === startPoint) { 
                                progressPercent = latestMeasurementValue === target ? 100 : 0;
                            } else {
                                progressPercent = Math.max(0, Math.min(100, 
                                    ((latestMeasurementValue - startPoint) / (target - startPoint)) * 100
                                ));
                            }
                            
                            if (target > latestMeasurementValue) { 
                                progressText = `Осталось ${ (target - latestMeasurementValue).toFixed(1) } ${goal.unit}`;
                            } else { 
                                progressText = `Осталось ${ (latestMeasurementValue - target).toFixed(1) } ${goal.unit}`;
                            }
                        }
                    }

                    return (
                        <motion.div // Оборачиваем Paper в motion.div для анимации
                            key={mt.id} // Ключ важен для AnimatePresence
                            layout // Плавное изменение расположения
                            initial={{ opacity: 0, x: -50 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: 50, transition: {duration: 0.2} }} 
                            transition={{ duration: 0.3, delay: 0.1 * measurementTypes.findIndex(i => i.id === mt.id) }} // Небольшая задержка для каскадного эффекта
                            style={{ opacity: showInputForm && goalType === mt.id ? 0.5 : 1 }} // Переносим opacity сюда
                        >
                            <Paper elevation={1} sx={{p: 1.5, mb:1.5, borderRadius:2}}>
                                <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', mb: 0.5}}>
                                    <Typography variant="subtitle1" sx={{fontWeight:'bold'}}>{mt.label}: 
                                        <Typography component="span" sx={{color: 'primary.main'}}>{goal.target} {goal.unit}</Typography>
                                    </Typography>
                                    {!showInputForm && <Button size="small" variant="text" startIcon={<EditIcon />} onClick={() => handleEditGoal(mt.id)} sx={{mr: -1}}>Изм.</Button>}
                                </Box>
                                {latestMeasurementValue !== null && (
                                    <Box sx={{mb: 0.5}}>
                                        <Typography variant="caption" sx={{color: 'text.secondary'}}>Текущий: {latestMeasurementValue} {goal.unit}</Typography>
                                    </Box>
                                )}
                                <LinearProgress 
                                    variant="determinate" 
                                    value={progressPercent} 
                                    sx={{ height: 8, borderRadius: 4, mb: 0.5 }} 
                                    color={isAchieved ? "success" : "primary"}
                                />
                                <Typography variant="body2" sx={{color: isAchieved ? 'success.main' : 'text.secondary', fontSize: '0.75rem'}}>{progressText}</Typography>
                            </Paper>
                        </motion.div>
                    );
                })}
              </AnimatePresence>
            </Box>
        ) : (
            !showInputForm && <Typography color="textSecondary" sx={{textAlign: 'center', mt: 2}}>У вас пока нет установленных целей. Нажмите "Добавить цель", чтобы начать.</Typography>
        )}
      </Paper>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', mb: 3 }}>
            <FitnessCenterIcon sx={{ fontSize: '2.5rem', mr: 1.5 }} />
            Замеры и Прогресс
          </Typography>
        </motion.div>

        <Grid container spacing={{xs: 1, sm: 2}} alignItems="center" sx={{mb: 2}}>
          <Grid item xs={12} sm={6} md={5} lg={4}>
            <Paper elevation={1} sx={{p: {xs: 1, sm: 1.5}, borderRadius: 3, display: 'flex', alignItems: 'center'}}> 
              <IconButton onClick={handlePrevDay} aria-label="Предыдущий день" size="small" sx={{mr: {xs:0, sm:0.5}}}>
                  <ArrowBackIosNewIcon fontSize="inherit" />
              </IconButton>
              <DatePicker
                label={selectedDate instanceof Date && !isNaN(selectedDate) ? format(selectedDate, 'dd MMMM yyyy', { locale: ru }) : "Выберите дату"}
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate || new Date())}
                showToolbar={false}
                renderInput={(params) => 
                    <TextField 
                        {...params} 
                        fullWidth 
                        variant="standard" 
                        InputProps={{
                            ...params.InputProps,
                            sx: {
                                textAlign: 'center', 
                                fontWeight:'bold', 
                                cursor: 'pointer',
                                fontSize: {xs: '0.8rem', sm: '1rem'}
                            }
                        }}
                        sx={{ 
                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                        }}
                    />}
                sx={{ width: '100%', flexGrow:1 }}
                components={{ OpenPickerIcon: () => null }} 
              />
              <IconButton onClick={handleNextDay} aria-label="Следующий день" size="small" sx={{ml: {xs:0, sm:0.5}}}>
                  <ArrowForwardIosIcon fontSize="inherit" />
              </IconButton>
            </Paper>
          </Grid>
           <Grid item xs={12} sm={6} md={7} lg={8} sx={{display: 'flex', alignItems: 'center', justifyContent: {xs: 'center', sm: 'flex-start'}, gap: 1, mt: {xs:1, sm: 0}}}>
                <Button variant="outlined" onClick={() => setSelectedDate(new Date())} startIcon={<CalendarTodayIcon/>} sx={{flexShrink:0}}>
                    Сегодня
                </Button>
            </Grid>
        </Grid>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <MeasurementInput />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <DailyMeasurements />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <ProgressCharts />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <GoalSetting />
        </motion.div>

      </Box>
    </LocalizationProvider>
  );
};

export default ProgressDashboard; 