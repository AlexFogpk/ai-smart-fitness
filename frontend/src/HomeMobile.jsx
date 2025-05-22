import React from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ProgressRings from "./components/ProgressRings";
import Header from "./Header";

export default function HomeMobile({ kbju, summary, onMenuClick }) {
  return (
    <>
      <Header onMenuClick={onMenuClick} />
      <Container 
        disableGutters
        maxWidth={false}
        sx={{
          pt: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 'calc(100vh - 56px)',
          boxSizing: 'border-box',
          px: { xs: 1, sm: 2 },
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      >
        <Paper 
          elevation={2}
          sx={{
            width: '100%',
            p: { xs: 1.5, sm: 2.5 },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 3 },
            borderRadius: { xs: 2, sm: 3 },
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <ProgressRings
              calories={summary.calories}
              caloriesGoal={kbju.calories}
              protein={summary.protein}
              proteinGoal={kbju.protein}
              fat={summary.fat}
              fatGoal={kbju.fat}
              carb={summary.carb}
              carbGoal={kbju.carb}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  bgcolor: '#e3f2fd', 
                  borderRadius: 2 
                }}
              >
                <Typography variant="caption" sx={{ color: '#1976d2', display: 'block' }}>Калории</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {summary.calories} / {kbju.calories}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  bgcolor: '#e8f5e9', 
                  borderRadius: 2 
                }}
              >
                <Typography variant="caption" sx={{ color: '#2e7d32', display: 'block' }}>Белки</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                  {summary.protein} / {kbju.protein} г
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  bgcolor: '#fff3e0', 
                  borderRadius: 2 
                }}
              >
                <Typography variant="caption" sx={{ color: '#e65100', display: 'block' }}>Жиры</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#e65100' }}>
                  {summary.fat} / {kbju.fat} г
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  bgcolor: '#fce4ec', 
                  borderRadius: 2 
                }}
              >
                <Typography variant="caption" sx={{ color: '#c2185b', display: 'block' }}>Углеводы</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#c2185b' }}>
                  {summary.carb} / {kbju.carb} г
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
