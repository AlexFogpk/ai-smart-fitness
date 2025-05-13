import React from "react";
import { motion } from "framer-motion";

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

// Чат с ИИ
export default function AIChatMobile({ messages, setMessages, onBack, username }) {
  const [input, setInput] = React.useState("");
  const messagesEndRef = React.useRef(null);

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
    
    // TODO: Заменить на реальный вызов API к AI тренеру
    // Имитация ответа ИИ!
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "Я ваш AI-тренер! Задайте мне вопрос о питании или тренировках." }]);
    }, 800);
  }

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
        }}
      >
        <Box sx={{display: 'flex', justifyContent:'space-between', alignItems:'center', p: {xs: 1.5, sm: 2}, borderBottom: 1, borderColor: 'divider'}}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
            ИИ Тренер
          </Typography>
          <IconButton onClick={onBack} aria-label="Назад" color="primary">
            <span className="material-symbols-rounded">close</span>
          </IconButton>
        </Box>
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: {xs: 1.5, sm: 2}, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {messages.length === 0 && (
            <Box sx={{flexGrow:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color: 'text.secondary', textAlign:'center', p:2}}>
                <span className="material-symbols-rounded" style={{ fontSize: 56, marginBottom: '16px' }}>psychology</span>
                <Typography variant="h6" sx={{mb:1}}>Готов помочь!</Typography>
                <Typography variant="body2">Задайте вопрос по питанию или тренировкам.</Typography>
            </Box>
          )}
          {messages.map((msg, i) => (
            <Paper 
              key={i} 
              elevation={0}
              sx={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                bgcolor: msg.role === "user" ? "primary.main" : "surfaceVariant.main",
                color: msg.role === "user" ? "primary.contrastText" : "text.primary",
                borderRadius: msg.role === "user" 
                  ? '20px 20px 4px 20px' 
                  : '20px 20px 20px 4px',
                p: '10px 16px',
                maxWidth: "85%",
                lineHeight: 1.45,
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body1">
                {msg.role === "user" && <Box component="span" sx={{ fontWeight: 'bold'}}>{username || "Вы"}:&nbsp;</Box>}
                {msg.text}
              </Typography>
            </Paper>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: {xs: 1.5, sm: 2}, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper'}}>
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
              sx: { borderRadius: '28px', px: 1 },
              endAdornment: (
                <IconButton color="primary" onClick={handleSend} disabled={!input.trim()} sx={{mr: -0.5}}>
                  <span className="material-symbols-rounded">send</span>
                </IconButton>
              )
            }}
            sx={{ bgcolor: 'surfaceVariant.main', borderRadius: '28px' }}
          />
        </Box>
      </Paper>
    </Container>
  );
} 