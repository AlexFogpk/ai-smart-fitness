import React from "react";
import { FaHome, FaAppleAlt, FaRobot, FaUtensils, FaCog, FaDumbbell, FaUserCircle, FaSignOutAlt, FaInfoCircle } from "react-icons/fa";
// import "./SideMenu.css"; // Will be removed or replaced by MUI styles

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Avatar from '@mui/material/Avatar';

const drawerWidth = 290;

export default function SideMenu({ open, onClose, current, onSelect, profile = { name: "Гость" } }) {
  const menuItems = [
    { id: "home", label: "Главная", icon: <FaHome /> },
    { id: "calc", label: "Калькулятор", icon: <FaAppleAlt /> },
    { id: "meals", label: "Мои блюда", icon: <FaUtensils /> },
    { id: "programs", label: "Программы тренировок", icon: <FaDumbbell />, accent: true },
    { id: "chat", label: "ИИ-чат", icon: <FaRobot /> },
    { id: "settings", label: "Настройки", icon: <FaCog /> },
  ];

  const bottomMenuItems = [
    { id: "about", label: "О приложении", icon: <FaInfoCircle />, onClick: () => console.log("About clicked") }, // Replace with actual handler
    { id: "logout", label: "Выйти", icon: <FaSignOutAlt />, onClick: () => console.log("Logout clicked") }, // Replace with actual handler
  ];

  const drawerContent = (
    <Box
      sx={{ width: drawerWidth, display: 'flex', flexDirection: 'column', height: '100%' }}
      role="presentation"
    >
      {/* Профиль */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 3, pb: 2, mb: 1, bgcolor: 'action.hover', px: 2 }}>
        <Avatar sx={{ width: 46, height: 46, bgcolor: 'primary.main' }}>
          <FaUserCircle size={32} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{profile.name || "Гость"}</Typography>
      </Box>
      
      {/* Навигация */}
      <List sx={{ flexGrow: 1, px:1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={current === item.id}
            onClick={() => { onSelect(item.id); onClose(); }}
            sx={theme => ({
              borderRadius: 2,
              mb: 0.5,
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
            <ListItemIcon sx={{color: item.accent ? 'inherit' : 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ fontWeight: (current === item.id || item.accent) ? 'bold' : 'medium'}} // Corrected fontWeight logic
            />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      {/* Нижний блок */}
      <List sx={{ px: 1, py:1 }}>
        {bottomMenuItems.map((item) => (
          <ListItemButton key={item.id} onClick={item.onClick} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
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
          borderTopLeftRadius: 22, // from SideMenu.css
          borderBottomLeftRadius: 22, // from SideMenu.css
          backgroundColor: 'background.paper', // from SideMenu.css
          backdropFilter: 'blur(8px)', // from SideMenu.css
          boxShadow: '-4px 0 28px #d3eafc33', // from SideMenu.css
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

// SideMenuItem component is no longer needed as its logic is integrated above
