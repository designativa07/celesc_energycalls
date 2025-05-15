import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Página não encontrada
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            A página que você está procurando não existe ou foi movida.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
          >
            Voltar para o início
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound; 