import React from "react";
import { FaHome, FaAppleAlt, FaRobot, FaUtensils, FaCog, FaDumbbell, FaUserCircle, FaSignOutAlt, FaInfoCircle } from "react-icons/fa";
// import "./SideMenu.css"; // Will be removed or replaced by MUI styles

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
// import Switch from '@mui/material/Switch';

const drawerWidth = 290;

export default function SideMenu({ open, onClose, current, onSelect, profile = { name: "Гость" } }) {
  // const theme = useTheme();
  
  const menuItems = [
    { id: "home", label: "Главная", icon: <FaHome /> },
    { id: "calc", label: "Калькулятор", icon: <FaAppleAlt /> },
    { id: "meals", label: "Мои блюда", icon: <FaUtensils /> },
    { id: "progress", label: "Замеры и Прогресс", icon: <FaDumbbell />, accent: true },
    { id: "chat", label: "ИИ-чат", icon: <FaRobot /> },
    { id: "settings", label: "Настройки", icon: <FaCog /> },
  ];

  const bottomMenuItems = [
    { id: "about", label: "О приложении", icon: <FaInfoCircle />, onClick: () => console.log("About clicked") },
    { id: "logout", label: "Выйти", icon: <FaSignOutAlt />, onClick: () => console.log("Logout clicked") },
  ];

  const drawerContent = (
    <Box
      sx={{ width: drawerWidth, display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}
      role="presentation"
    >
      {/* Header с именем пользователя */}
      <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pt: 4, pb: 2, mb: 1, bgcolor: 'background.paper', borderRadius: 0, boxShadow: 'none' }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', mb: 1 }}>
          <FaUserCircle size={32} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>{profile.name || "Гость"}</Typography>
      </Paper>
      <Divider sx={{ mb: 1 }} />
      {/* Навигация */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={current === item.id}
            onClick={() => { onSelect(item.id); onClose(); }}
            sx={(theme) => ({
              borderRadius: 3,
              mb: 0.5,
              py: 1.2,
              px: 2,
              transition: 'background 0.2s',
              ...(item.accent && {
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.secondary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.main,
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.secondary.dark,
                  color: theme.palette.secondary.contrastText,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.secondary.contrastText,
                  }
                }
              }),
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                boxShadow: '0 2px 7px #e7f6ff55',
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.contrastText,
                }
              },
            })}
          >
            <ListItemIcon sx={{ color: item.accent ? 'inherit' : 'primary.main', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: (current === item.id || item.accent) ? 'bold' : 'medium', fontSize: 17 }}
            />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      {/* Нижний блок */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Paper elevation={1} sx={{ borderRadius: 3, bgcolor: 'grey.100', p: 1 }}>
          <List>
            {bottomMenuItems.map((item) => (
              <ListItemButton key={item.id} onClick={item.onClick} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon sx={{ color: 'text.secondary', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderTopLeftRadius: 22,
          borderBottomLeftRadius: 22,
          backgroundColor: 'background.paper',
          backdropFilter: 'blur(8px)',
          boxShadow: '-4px 0 28px #d3eafc33',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

// SideMenuItem component is no longer needed as its logic is integrated above
