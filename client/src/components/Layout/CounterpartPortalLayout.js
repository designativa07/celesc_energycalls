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

const drawerWidth = 220;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  minHeight: '48px'
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  margin: theme.spacing(0.5, 0.5),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.85rem',
  padding: '6px 10px',
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
    ? '0 1px 8px 0 rgba(0,0,0,0.05)' 
    : '0 1px 8px 0 rgba(0,0,0,0.2)',
  backdropFilter: 'blur(8px)',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(18, 18, 18, 0.9)',
  color: theme.palette.mode === 'light' ? theme.palette.text.primary : '#fff',
  zIndex: theme.zIndex.drawer + 1, // Garante que AppBar fique sobre o drawer
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
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <AppBarStyled position="fixed">
        <Toolbar variant="dense">
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1, ...(drawerOpen && isMobile && { display: 'none' }) }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 500, 
              fontSize: '0.95rem',
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
            <Box sx={{ mx: 1 }}>
              <Button 
                color="inherit" 
                size="small"
                sx={{ 
                  mx: 0.5,
                  fontWeight: isSelected('/counterpart-portal') && location.pathname === '/counterpart-portal' ? 600 : 400,
                  fontSize: '0.85rem',
                  borderBottom: isSelected('/counterpart-portal') && location.pathname === '/counterpart-portal' 
                    ? `2px solid ${theme.palette.primary.main}` : 'none',
                  borderRadius: 0,
                  py: 1,
                  px: 1.5
                }} 
                onClick={() => handleNavigation('/counterpart-portal')}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                size="small"
                sx={{ 
                  mx: 0.5,
                  fontWeight: isSelected('/counterpart-portal/calls') ? 600 : 400,
                  fontSize: '0.85rem',
                  borderBottom: isSelected('/counterpart-portal/calls') 
                    ? `2px solid ${theme.palette.primary.main}` : 'none',
                  borderRadius: 0,
                  py: 1,
                  px: 1.5
                }}
                onClick={() => handleNavigation('/counterpart-portal/calls')}
              >
                Chamadas
              </Button>
              <Button 
                color="inherit" 
                size="small"
                sx={{ 
                  mx: 0.5,
                  fontWeight: isSelected('/counterpart-portal/my-proposals') ? 600 : 400,
                  fontSize: '0.85rem',
                  borderBottom: isSelected('/counterpart-portal/my-proposals') 
                    ? `2px solid ${theme.palette.primary.main}` : 'none',
                  borderRadius: 0,
                  py: 1,
                  px: 1.5
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
              size="small"
              sx={{ ml: 0.5, mr: 0.5 }}
            >
              <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: '18px', minWidth: '18px' } }}>
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={theme.palette.mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
            <IconButton 
              onClick={colorMode.toggleColorMode} 
              color="inherit" 
              size="small"
              sx={{ mr: 0.5 }}
            >
              {theme.palette.mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title={counterpart?.companyName || 'Contraparte'}>
            <IconButton
              size="small"
              aria-label="perfil do usuário"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
              sx={{ ml: 0.5 }}
            >
              <Avatar 
                sx={{ 
                  width: 28, 
                  height: 28, 
                  bgcolor: theme.palette.secondary.main,
                  fontSize: '0.8rem'
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
                mt: 1,
                boxShadow: theme.palette.mode === 'light'
                  ? '0 4px 12px rgba(0,0,0,0.1)'
                  : '0 4px 12px rgba(0,0,0,0.3)',
                minWidth: 180
              }
            }}
          >
            <MenuItem dense disabled sx={{ fontSize: '0.85rem', opacity: 0.7 }}>
              {counterpart?.companyName}
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem dense onClick={handleLogout} sx={{ fontSize: '0.85rem' }}>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sair" />
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
              ? '1px 0 8px rgba(0,0,0,0.05)'
              : '1px 0 8px rgba(0,0,0,0.2)',
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <DrawerHeader>
          <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 500, fontSize: '0.9rem' }}>
            Portal Contraparte
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff', padding: '4px' }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        </DrawerHeader>
        
        <Box sx={{ p: 1.5, overflow: 'auto' }}>
          <Typography variant="caption" color="text.secondary" sx={{ pl: 1, display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
            {counterpart?.companyName}
          </Typography>
          
          <List dense sx={{ px: 0 }} component="nav">
            <ListItem disablePadding>
              <StyledListItemButton 
                selected={isSelected('/counterpart-portal') && location.pathname === '/counterpart-portal'} 
                onClick={() => handleNavigation('/counterpart-portal')}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '0.85rem' }} />
              </StyledListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <StyledListItemButton 
                selected={isSelected('/counterpart-portal/calls')} 
                onClick={() => handleNavigation('/counterpart-portal/calls')}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ViewListIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Chamadas Disponíveis" primaryTypographyProps={{ fontSize: '0.85rem' }} />
              </StyledListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <StyledListItemButton 
                selected={isSelected('/counterpart-portal/my-proposals')} 
                onClick={() => handleNavigation('/counterpart-portal/my-proposals')}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <SendIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Minhas Propostas" primaryTypographyProps={{ fontSize: '0.85rem' }} />
              </StyledListItemButton>
            </ListItem>
          </List>
        </Box>
        
        <Box sx={{ mt: 'auto', p: 1.5 }}>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 1.5,
              bgcolor: theme.palette.mode === 'light' 
                ? 'rgba(25, 118, 210, 0.05)' 
                : 'rgba(144, 202, 249, 0.05)',
              border: `1px solid ${theme.palette.mode === 'light' 
                ? 'rgba(25, 118, 210, 0.1)' 
                : 'rgba(144, 202, 249, 0.1)'}`
            }}
          >
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
              Contraparte:
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.85rem' }}>
              {counterpart?.companyName || 'Empresa'}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.75rem', opacity: 0.8 }}>
              {counterpart?.email || 'contato@empresa.com'}
            </Typography>
          </Box>
        </Box>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 6,
          px: { xs: 1, sm: 2, md: 2 },
          pb: 2,
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: drawerOpen ? `${drawerWidth}px` : 0 },
          transition: (theme) => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        }}
      >
        <Box 
          sx={{
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(255,255,255,0.9)' 
              : 'rgba(30,30,30,0.9)',
            borderRadius: 1,
            p: { xs: 1, sm: 2 },
            overflow: 'auto',
            boxShadow: theme.palette.mode === 'light'
              ? '0 1px 4px rgba(0,0,0,0.05)'
              : '0 1px 4px rgba(0,0,0,0.15)',
            mt: 0.5,
            mb: 0.5
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default CounterpartPortalLayout; 