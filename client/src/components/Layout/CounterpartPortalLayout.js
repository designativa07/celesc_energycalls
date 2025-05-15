import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ViewList as ViewListIcon,
  Send as SendIcon,
  AccountCircle,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useCounterpartAuth } from '../../contexts/CounterpartAuthContext';
import { ColorModeContext } from '../../App';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  minHeight: '56px'
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  margin: theme.spacing(0.5, 0.5),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.9rem',
  padding: '6px 12px',
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(25, 118, 210, 0.1)' 
      : 'rgba(144, 202, 249, 0.1)',
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    }
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(25, 118, 210, 0.05)' 
      : 'rgba(144, 202, 249, 0.05)',
  }
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: theme.palette.mode === 'light' 
    ? '0 4px 20px 0 rgba(0,0,0,0.05)' 
    : '0 4px 20px 0 rgba(0,0,0,0.2)',
  backdropFilter: 'blur(8px)',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(18, 18, 18, 0.9)',
  color: theme.palette.mode === 'light' ? theme.palette.text.primary : '#fff',
}));

const CounterpartPortalLayout = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { counterpart, logout } = useCounterpartAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/counterpart-login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const isSelected = (path) => {
    if (path === '/counterpart-portal') {
      return location.pathname === '/counterpart-portal';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBarStyled position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, ...(drawerOpen && isMobile && { display: 'none' }) }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600, 
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(90deg, #90caf9 0%, #1976d2 100%)' 
                : 'linear-gradient(90deg, #1976d2 0%, #0d47a1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Portal da Contraparte - EnergyCalls
          </Typography>
          
          {!isMobile && (
            <Box sx={{ mx: 2 }}>
              <Button 
                color="inherit" 
                sx={{ 
                  mx: 1,
                  fontWeight: isSelected('/counterpart-portal') && location.pathname === '/counterpart-portal' ? 600 : 400,
                  borderBottom: isSelected('/counterpart-portal') && location.pathname === '/counterpart-portal' 
                    ? `2px solid ${theme.palette.primary.main}` : 'none'
                }} 
                onClick={() => handleNavigation('/counterpart-portal')}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                sx={{ 
                  mx: 1,
                  fontWeight: isSelected('/counterpart-portal/calls') ? 600 : 400,
                  borderBottom: isSelected('/counterpart-portal/calls') 
                    ? `2px solid ${theme.palette.primary.main}` : 'none'
                }}
                onClick={() => handleNavigation('/counterpart-portal/calls')}
              >
                Chamadas
              </Button>
              <Button 
                color="inherit" 
                sx={{ 
                  mx: 1,
                  fontWeight: isSelected('/counterpart-portal/my-proposals') ? 600 : 400,
                  borderBottom: isSelected('/counterpart-portal/my-proposals') 
                    ? `2px solid ${theme.palette.primary.main}` : 'none'
                }}
                onClick={() => handleNavigation('/counterpart-portal/my-proposals')}
              >
                Propostas
              </Button>
            </Box>
          )}

          <Tooltip title="Notificações">
            <IconButton 
              color="inherit" 
              sx={{ mx: 1 }}
            >
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={theme.palette.mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
            <IconButton 
              onClick={colorMode.toggleColorMode} 
              color="inherit" 
              sx={{ mx: 1 }}
            >
              {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={counterpart?.companyName || 'Contraparte'}>
            <IconButton
              size="large"
              aria-label="perfil do usuário"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: theme.palette.secondary.main,
                  border: `2px solid ${theme.palette.background.paper}`
                }}
              >
                {counterpart?.companyName?.charAt(0) || 'C'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                boxShadow: theme.palette.mode === 'light'
                  ? '0 8px 32px rgba(0,0,0,0.12)'
                  : '0 8px 32px rgba(0,0,0,0.3)'
              }
            }}
          >
            <MenuItem disabled>
              {counterpart?.companyName}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sair</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: theme.palette.mode === 'light'
              ? '4px 0 24px rgba(0,0,0,0.05)'
              : '4px 0 24px rgba(0,0,0,0.2)',
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Portal Contraparte
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, opacity: 0.8 }}>
            {counterpart?.companyName}
          </Typography>
          
          <List sx={{ px: 0 }} component="nav">
            <ListItem disablePadding>
              <StyledListItemButton 
                selected={isSelected('/counterpart-portal') && location.pathname === '/counterpart-portal'} 
                onClick={() => handleNavigation('/counterpart-portal')}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </StyledListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <StyledListItemButton 
                selected={isSelected('/counterpart-portal/calls')} 
                onClick={() => handleNavigation('/counterpart-portal/calls')}
              >
                <ListItemIcon>
                  <ViewListIcon />
                </ListItemIcon>
                <ListItemText primary="Chamadas Disponíveis" />
              </StyledListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <StyledListItemButton 
                selected={isSelected('/counterpart-portal/my-proposals')} 
                onClick={() => handleNavigation('/counterpart-portal/my-proposals')}
              >
                <ListItemIcon>
                  <SendIcon />
                </ListItemIcon>
                <ListItemText primary="Minhas Propostas" />
              </StyledListItemButton>
            </ListItem>
          </List>
        </Box>
        
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'light' 
                ? 'rgba(25, 118, 210, 0.05)' 
                : 'rgba(144, 202, 249, 0.05)',
              border: `1px solid ${theme.palette.mode === 'light' 
                ? 'rgba(25, 118, 210, 0.2)' 
                : 'rgba(144, 202, 249, 0.2)'}`
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Contraparte:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {counterpart?.companyName || 'Empresa'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {counterpart?.email || 'contato@empresa.com'}
            </Typography>
          </Box>
        </Box>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 7,
          px: { xs: 1.5, sm: 2, md: 3 },
          pb: 3,
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: drawerOpen ? `${drawerWidth}px` : 0 },
          transition: (theme) => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Box 
          sx={{
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(255,255,255,0.7)' 
              : 'rgba(30,30,30,0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: 2,
            p: { xs: 1.5, sm: 2 },
            boxShadow: theme.palette.mode === 'light'
              ? '0 2px 12px rgba(0,0,0,0.05)'
              : '0 2px 12px rgba(0,0,0,0.2)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default CounterpartPortalLayout; 