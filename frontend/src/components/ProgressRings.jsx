import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function ProgressRings({
  calories,
  caloriesGoal,
  protein,
  proteinGoal,
  fat,
  fatGoal,
  carb,
  carbGoal
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Функция для расчета процента
  const calculatePercentage = (value, goal) => {
    return Math.min(100, (value / goal) * 100);
  };

  // Размеры для разных экранов
  const sizes = {
    outer: isMobile ? 280 : 320,
    inner: isMobile ? 220 : 260,
    stroke: isMobile ? 12 : 14,
    fontSize: {
      value: isMobile ? '2rem' : '2.5rem',
      caption: isMobile ? '0.75rem' : '0.875rem'
    }
  };

  // Функция для создания SVG круга
  const createCircle = (percentage, color, size, strokeWidth) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Фоновый круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${color}20`}
          strokeWidth={strokeWidth}
        />
        {/* Прогресс */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
            transform: `rotate(-90deg)`,
            transformOrigin: 'center'
          }}
        />
      </svg>
    );
  };

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        opacity: 0,
        animation: 'fadeIn 0.5s ease-out forwards',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'scale(0.9)'
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)'
          }
        }
      }}
    >
      {/* Внешний круг (калории) */}
      <Box sx={{ position: 'relative' }}>
        {createCircle(
          calculatePercentage(calories, caloriesGoal),
          '#1976d2',
          sizes.outer,
          sizes.stroke
        )}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1976d2',
              fontSize: sizes.fontSize.value
            }}
          >
            {calories}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontSize: sizes.fontSize.caption
            }}
          >
            из {caloriesGoal} ккал
          </Typography>
        </Box>
      </Box>

      {/* Внутренний круг (макронутриенты) */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {createCircle(
          calculatePercentage(protein, proteinGoal),
          '#2e7d32',
          sizes.inner,
          sizes.stroke
        )}
        {createCircle(
          calculatePercentage(fat, fatGoal),
          '#e65100',
          sizes.inner - 40,
          sizes.stroke
        )}
        {createCircle(
          calculatePercentage(carb, carbGoal),
          '#c2185b',
          sizes.inner - 80,
          sizes.stroke
        )}
      </Box>
    </Box>
  );
} 