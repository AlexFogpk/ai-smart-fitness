import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';

// Компонент индикатора набора текста
const TypingIndicator = () => (
  <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center', px: 0.5 }}>
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        initial={{ opacity: 0.3, y: 0 }}
        animate={{ opacity: 1, y: [0, -5, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          delay: dot * 0.2,
        }}
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'var(--mui-palette-primary-main)',
        }}
      />
    ))}
  </Box>
);

// Чат с ИИ
export default function AIChatMobile({ messages, setMessages, onBack, username }) {
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  const chatContainerRef = React.useRef(null);

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
    
    // Показываем индикатор набора текста
    setIsTyping(true);
    
    // TODO: Заменить на реальный вызов API к AI тренеру
    // Имитация ответа ИИ!
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: "Я ваш AI-тренер! Задайте мне вопрос о питании или тренировках." 
      }]);
    }, 1500);
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const messageVariants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 }
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
          borderRadius: 3,
        }}
      >
        <Box 
          sx={{
            display: 'flex', 
            justifyContent:'space-between', 
            alignItems:'center', 
            p: {xs: 1.5, sm: 2}, 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton 
              onClick={onBack} 
              aria-label="Назад" 
              color="primary"
              sx={{ flexShrink: 0 }}
            >
              <span className="material-symbols-rounded">arrow_back</span>
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 38, 
                  height: 38 
                }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: 20 }}>psychology</span>
              </Avatar>
              <Box>
                <Typography variant="subtitle1" component="h1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  ИИ Тренер
                </Typography>
                <Typography variant="caption" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main', 
                      display: 'inline-block' 
                    }} 
                  />
                  Онлайн
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton color="primary">
            <span className="material-symbols-rounded">more_vert</span>
          </IconButton>
        </Box>
        
        <Box 
          ref={chatContainerRef}
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: {xs: 2, sm: 2.5}, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            bgcolor: 'surfaceVariant.main',
          }}
        >
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '16px'
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 80, color: 'var(--mui-palette-primary-main)', marginBottom: '16px' }}>psychology</span>
                </motion.div>
                <Typography variant="h5" sx={{mb: 1, fontWeight: 600, color: 'primary.main'}}>Привет! Я твой ИИ-тренер</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 400, mb: 2 }}>
                  Задай мне вопросы о питании, тренировках, или запроси персональные рекомендации
                </Typography>
                <Paper 
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 3,
                    maxWidth: 320
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Примеры вопросов:</Typography>
                  {["Какие упражнения помогут укрепить спину?", "Составь мне план питания на день", "Как правильно считать калории?"].map((example, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.2 }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.primary', 
                          mb: 0.5, 
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1
                        }}
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: 16, marginTop: 4 }}>arrow_right</span>
                        {example}
                      </Typography>
                    </motion.div>
                  ))}
                </Paper>
              </motion.div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={messageVariants}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, maxWidth: "85%" }}>
                    {msg.role === "ai" && (
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          width: 32, 
                          height: 32,
                          display: { xs: 'none', sm: 'flex' } 
                        }}
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: 16 }}>psychology</span>
                      </Avatar>
                    )}
                    <Paper 
                      elevation={0}
                      sx={{
                        bgcolor: msg.role === "user" ? "primary.main" : "background.paper",
                        color: msg.role === "user" ? "primary.contrastText" : "text.primary",
                        borderRadius: msg.role === "user" 
                          ? '20px 4px 20px 20px' 
                          : '4px 20px 20px 20px',
                        p: '12px 16px',
                        lineHeight: 1.45,
                        wordBreak: 'break-word',
                        boxShadow: msg.role === "user" ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
                      }}
                    >
                      <Typography variant="body1">
                        {msg.text}
                      </Typography>
                    </Paper>
                    {msg.role === "user" && (
                      <Avatar 
                        sx={{ 
                          bgcolor: 'grey.200', 
                          color: 'text.primary',
                          width: 32, 
                          height: 32,
                          display: { xs: 'none', sm: 'flex' } 
                        }}
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: 18 }}>person</span>
                      </Avatar>
                    )}
                  </Box>
                  {msg.role === "user" && (
                    <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', alignSelf: 'flex-end', fontSize: '0.7rem' }}>
                      {username || "Вы"}
                    </Typography>
                  )}
                </motion.div>
              ))
            )}
            
            {/* Индикатор набора текста */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  style={{ alignSelf: "flex-start" }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        width: 32, 
                        height: 32,
                        display: { xs: 'none', sm: 'flex' } 
                      }}
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: 16 }}>psychology</span>
                    </Avatar>
                    <Paper 
                      elevation={0}
                      sx={{
                        bgcolor: "background.paper",
                        p: 1.5,
                        borderRadius: '4px 20px 20px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      }}
                    >
                      <TypingIndicator />
                    </Paper>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </Box>

        <Zoom in={true} style={{ transitionDelay: '500ms' }}>
          <Box 
            sx={{ 
              p: {xs: 1.5, sm: 2}, 
              borderTop: 1, 
              borderColor: 'divider', 
              bgcolor: 'background.paper',
              position: 'relative',
            }}
          >
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
                sx: { 
                  borderRadius: '28px', 
                  px: 1,
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 2px var(--mui-palette-primary-light)'
                  }
                },
                endAdornment: (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton 
                      color="primary" 
                      onClick={handleSend} 
                      disabled={!input.trim()} 
                      sx={{
                        mr: -0.5,
                        transition: 'transform 0.2s ease',
                        bgcolor: input.trim() ? 'primary.main' : 'transparent',
                        color: input.trim() ? 'white' : 'primary.main',
                        '&:hover': {
                          bgcolor: input.trim() ? 'primary.dark' : 'action.hover',
                        },
                        '&.Mui-disabled': {
                          color: 'text.disabled',
                          bgcolor: 'transparent'
                        }
                      }}
                    >
                      <span className="material-symbols-rounded">send</span>
                    </IconButton>
                  </motion.div>
                )
              }}
              sx={{ 
                bgcolor: 'surfaceVariant.main', 
                borderRadius: '28px',
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                  bgcolor: 'surfaceVariant.dark',
                }
              }}
            />
          </Box>
        </Zoom>
      </Paper>
    </Container>
  );
} 