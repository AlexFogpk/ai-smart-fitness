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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';

// Компонент для ручного ввода данных о блюде
function ManualInputForm({ meal, setMeal, nameInputRef, currentTypeColor, inputVariants }) {
  // ... Код ManualInputForm ...
}

// Компонент для ввода данных через ИИ
function AIInputForm({ 
  aiQuery, 
  setAiQuery, 
  isAnalyzing, 
  aiResults, 
  aiError, 
  analyzeWithAI, 
  recentQueries, 
  currentTypeColor, 
  fadeVariants,
  inputVariants,
  meal,
  setMeal
}) {
  return (
    <motion.div
      key="ai-form"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
    >
      <motion.div 
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        style={{ marginTop: 16 }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1, 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: 'surfaceVariant.main',
            mb: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 18, verticalAlign: 'text-bottom', marginRight: 4 }}>
              tips_and_updates
            </span>
            Опишите блюдо своими словами
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.3 }}>
            Введите название блюда и его примерный состав. ИИ определит пищевую ценность и КБЖУ.
            Например: "Куриная грудка 200 грамм с рисом и овощами" или "Греческий салат с сыром фета".
          </Typography>
        </Box>
      </motion.div>
      
      <motion.div variants={inputVariants}>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Опишите ваше блюдо..."
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                <span className="material-symbols-rounded" style={{ color: currentTypeColor }}>smart_toy</span>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 1.5,
            '& .MuiOutlinedInput-root': {
              pt: 2.3,
              '&.Mui-focused fieldset': {
                borderColor: currentTypeColor,
              },
            },
          }}
        />
      </motion.div>
      
      <motion.div variants={inputVariants}>
        <Button
          variant="contained"
          fullWidth
          onClick={analyzeWithAI}
          disabled={isAnalyzing || !aiQuery.trim()}
          startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <span className="material-symbols-rounded">psychology</span>}
          sx={{
            mb: 2,
            py: 1.2,
            backgroundColor: currentTypeColor,
            '&:hover': {
              backgroundColor: currentTypeColor,
              filter: 'brightness(0.9)',
            }
          }}
        >
          {isAnalyzing ? 'Анализирую...' : 'Анализировать с ИИ'}
        </Button>
        
        {aiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {aiError}
          </Alert>
        )}
      </motion.div>
      
      {recentQueries.length > 0 && !aiResults && !isAnalyzing && (
        <motion.div variants={fadeVariants}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 1
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>history</span>
            Недавние запросы:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
            {recentQueries.map((query, index) => (
              <Chip
                key={index}
                label={query}
                onClick={() => setAiQuery(query)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: 'surfaceVariant.main',
                }}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </Box>
        </motion.div>
      )}
      
      {/* Результаты анализа ИИ */}
      <AnimatePresence>
        {aiResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, type: 'spring' }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 1,
                mb: 2,
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'surfaceVariant.light'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {aiResults.name}
                </Typography>
                <Chip
                  size="small"
                  label={`${aiResults.confidence.toFixed(0)}% уверенность`}
                  color={aiResults.confidence > 80 ? "success" : "warning"}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 1.5 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Вес: <b>{aiResults.grams}г</b>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Калории: <b>{aiResults.calories} ккал</b>
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Макронутриенты:</Typography>
              
              <Grid container spacing={2}>
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
                      {aiResults.protein} г
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
                      {aiResults.carb} г
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
                      {aiResults.fat} г
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<span className="material-symbols-rounded" style={{ fontSize: 18 }}>edit</span>}
                  onClick={() => setMeal(prevMeal => ({
                    ...prevMeal,
                    emoji: meal.emoji // Сохраняем выбранный эмодзи
                  }))}
                  sx={{ flex: 1, borderRadius: 6 }}
                >
                  Редактировать
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<span className="material-symbols-rounded" style={{ fontSize: 18 }}>restart_alt</span>}
                  onClick={() => {
                    setAiQuery('');
                    setAiResults(null);
                  }}
                  sx={{ flex: 1, borderRadius: 6 }}
                >
                  Сбросить
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Секция для эмодзи */}
      {(aiResults || isAnalyzing) && (
        <motion.div
          variants={fadeVariants}
          transition={{ delay: 0.2 }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600, 
              color: 'text.secondary', 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.5,
              mb: 1 
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>emoji_emotions</span>
            Выберите эмодзи (опционально):
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            {["🍗", "🥗", "🍎", "🍞", "🥛", "🍳", "🍚", "🥩", "🍕", "🥑", "🍌", "🥤"].map((emoji) => (
              <Chip
                key={emoji}
                label={emoji}
                onClick={() => setMeal(m => ({ ...m, emoji: emoji }))}
                sx={{ 
                  fontSize: '1.2rem',
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
        </motion.div>
      )}
    </motion.div>
  );
}

// Калькулятор питания
export default function CalculatorMobile({
  setMealsByType,
  calcType,
  setCalcType,
  onBack
}) {
  // Базовое состояние для блюда
  const [meal, setMeal] = React.useState({ name: "", grams: "", calories: "", protein: "", carb: "", fat: "", emoji: "" });
  const [submitted, setSubmitted] = React.useState(false);
  const nameInputRef = React.useRef(null);
  
  // Состояние для переключения между вкладками (ручной ввод / ИИ)
  const [inputMode, setInputMode] = React.useState('manual'); // 'manual' или 'ai'
  
  // Состояние для работы с ИИ
  const [aiQuery, setAiQuery] = React.useState('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [aiResults, setAiResults] = React.useState(null);
  const [aiError, setAiError] = React.useState('');
  
  // Недавно использованные запросы для быстрого доступа
  const [recentQueries, setRecentQueries] = React.useState([
    "Куриная грудка 200 грамм",
    "Омлет с сыром и помидорами",
    "Греческий салат",
    "Овсянка с ягодами"
  ]);

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
      setAiResults(null);
      // Фокус на поле имени или запроса в зависимости от режима
      if (inputMode === 'manual' && nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 1500);
  }

  const handleCalcTypeChange = (event, newCalcType) => {
    if (newCalcType !== null) {
      setCalcType(newCalcType);
    }
  };
  
  // Функция для анализа пищи с помощью ИИ (заглушка, будет подключена к реальному API)
  const analyzeWithAI = () => {
    if (!aiQuery.trim()) return;
    
    setIsAnalyzing(true);
    setAiError('');
    
    // Добавляем запрос в список недавних, если его там еще нет
    if (!recentQueries.includes(aiQuery)) {
      setRecentQueries(prev => [aiQuery, ...prev.slice(0, 3)]);
    }
    
    // Имитация запроса к API (будет заменено на реальный API-вызов)
    setTimeout(() => {
      try {
        // Симуляция ответа от ИИ
        const mockResult = {
          name: aiQuery.split(' ').slice(0, 3).join(' '),
          grams: aiQuery.toLowerCase().includes('грамм') ? parseInt(aiQuery.match(/\d+/)?.[0] || '100') : 100,
          calories: Math.floor(Math.random() * 300) + 100,
          protein: Math.floor(Math.random() * 20) + 5,
          carb: Math.floor(Math.random() * 30) + 10,
          fat: Math.floor(Math.random() * 15) + 2,
          confidence: Math.random() * 30 + 70, // Уровень уверенности в %
        };
        
        setAiResults(mockResult);
        setMeal(prev => ({
          ...prev,
          name: mockResult.name,
          grams: mockResult.grams.toString(),
          calories: mockResult.calories.toString(),
          protein: mockResult.protein.toString(),
          carb: mockResult.carb.toString(),
          fat: mockResult.fat.toString(),
        }));
        
        setIsAnalyzing(false);
      } catch (error) {
        setAiError('Не удалось проанализировать блюдо. Пожалуйста, попробуйте другой запрос или введите данные вручную.');
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  const mealTypes = [
    { value: "breakfast", label: "Завтрак", icon: "bakery_dining", color: "#ff9800" },
    { value: "lunch", label: "Обед", icon: "lunch_dining", color: "#2196f3" },
    { value: "dinner", label: "Ужин", icon: "dinner_dining", color: "#673ab7" },
    { value: "snack", label: "Перекус", icon: "bakery_dining", color: "#4caf50" },
  ];
  
  // Найти цвет текущего типа приема пищи
  const currentTypeColor = mealTypes.find(type => type.value === calcType)?.color || "#2196f3";

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };
  
  const inputVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0 }
  };
  
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
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
        pt: { xs: 1.5, sm: 2 }, 
        pb: { xs: 1.5, sm: 2 }, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 56px)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        px: { xs: 1.5, sm: 2 }
      }}
    >
      <Paper 
        elevation={2}
        sx={{
          width: '100%', 
          maxWidth: 480,
          p: { xs: 2, sm: 2.5 }, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 1.5, sm: 2 },
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
              sx={{ mr: 1, ml: -1, p: { xs: 0.5, sm: 0.75 } }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: { xs: 20, sm: 24 } }}>arrow_back</span>
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
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
                sx={{ mb: 1, borderRadius: 2 }}
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
              padding: { xs: '6px 8px', sm: '8px 12px' },
              fontSize: {xs: '0.75rem', sm: '0.875rem'},
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
                  marginRight: { xs: 4, sm: 6 }, 
                  fontSize: { xs: 16, sm: 18 },
                  color: calcType === type.value ? '#fff' : type.color
                }}
              >
                {type.icon}
              </span>
              {type.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        
        {/* Вкладки для переключения между режимами */}
        <Tabs 
          value={inputMode} 
          onChange={(e, newValue) => setInputMode(newValue)}
          variant="fullWidth"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: { xs: 40, sm: 48 },
              fontWeight: 600,
              textTransform: 'none',
              fontSize: { xs: '0.85rem', sm: '0.95rem' }
            }
          }}
        >
          <Tab 
            value="manual" 
            label="Ручной ввод" 
            icon={<span className="material-symbols-rounded" style={{fontSize: { xs: 18, sm: 20 }}}>edit</span>} 
            iconPosition="start"
          />
          <Tab 
            value="ai" 
            label="ИИ-помощник" 
            icon={<span className="material-symbols-rounded" style={{fontSize: { xs: 18, sm: 20 }}}>smart_toy</span>}
            iconPosition="start"
          />
        </Tabs>
        
        <AnimatePresence mode="wait">
          {inputMode === 'manual' ? (
            <ManualInputForm 
              meal={meal}
              setMeal={setMeal}
              nameInputRef={nameInputRef}
              currentTypeColor={currentTypeColor}
              inputVariants={inputVariants}
            />
          ) : (
            <AIInputForm
              aiQuery={aiQuery}
              setAiQuery={setAiQuery}
              isAnalyzing={isAnalyzing}
              aiResults={aiResults}
              aiError={aiError}
              analyzeWithAI={analyzeWithAI}
              recentQueries={recentQueries}
              currentTypeColor={currentTypeColor}
              fadeVariants={fadeVariants}
              inputVariants={inputVariants}
              meal={meal}
              setMeal={setMeal}
            />
          )}
        </AnimatePresence>
        
        {/* Общая часть для обоих режимов */}
        <Box sx={{ pt: 1 }}>
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={handleAddMeal} 
              disabled={!meal.name || !meal.grams || submitted || isAnalyzing}
              startIcon={<span className="material-symbols-rounded">add_task</span>}
              sx={{ 
                py: { xs: 1.2, sm: 1.5 }, 
                fontSize: { xs: 14, sm: 16 }, 
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
