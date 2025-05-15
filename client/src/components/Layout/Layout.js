import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Tooltip,
  Badge,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  BoltOutlined as EnergyIcon,
  Business as CompanyIcon,
  People as PeopleIcon,
  AccountCircle,
  Logout,
  ChevronLeft as ChevronLeftIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExpandLess,
  ExpandMore,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ColorModeContext } from '../../App';

const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(5),
    },
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  boxShadow: theme.palette.mode === 'light' 
    ? '0 4px 20px 0 rgba(0,0,0,0.05)' 
    : '0 4px 20px 0 rgba(0,0,0,0.2)',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backdropFilter: 'blur(8px)',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(18, 18, 18, 0.9)',
  color: theme.palette.mode === 'light' ? theme.palette.text.primary : '#fff',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  backgroundColor: theme.palette.primary.main,
  color: '#fff'
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
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

const Layout = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [callsOpen, setCallsOpen] = useState(location.pathname.includes('/calls'));
  const [counterpartsOpen, setCounterpartsOpen] = useState(location.pathname.includes('/counterparts'));

  console.log('Usuário logado:', user);
  console.log('Role do usuário:', user?.role);
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleToggleCallsMenu = () => {
    setCallsOpen(!callsOpen);
  };

  const handleToggleCounterpartsMenu = () => {
    setCounterpartsOpen(!counterpartsOpen);
  };

  const isSelected = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/',
      exact: true 
    },
    { 
      text: 'Chamadas de Energia', 
      icon: <EnergyIcon />, 
      path: '/calls',
      subMenu: [
        { text: 'Listar Todas', path: '/calls' },
        { text: 'Criar Nova', path: '/calls/create' }
      ]
    },
    { 
      text: 'Contrapartes', 
      icon: <CompanyIcon />, 
      path: '/counterparts',
      subMenu: [
        { text: 'Listar Todas', path: '/counterparts' },
        { text: 'Adicionar Nova', path: '/counterparts/create' }
      ]
    },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ text: 'Usuários', icon: <PeopleIcon />, path: '/users' });
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600, 
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(90deg, #90caf9 0%, #1976d2 100%)' 
                : 'linear-gradient(90deg, #1976d2 0%, #0d47a1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            EnergyCalls - CELESC
          </Typography>

          <Tooltip title="Notificações">
            <IconButton 
              color="inherit" 
              sx={{ mx: 1 }}
            >
              <Badge badgeContent={3} color="error">
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

          <div>
            <Tooltip title={user?.name || 'Usuário'}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
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
                  {user?.name?.charAt(0) || 'U'}
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
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 8px 32px rgba(0,0,0,0.12)'
                    : '0 8px 32px rgba(0,0,0,0.3)'
                }
              }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText>Perfil</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sair</ListItemText>
              </MenuItem>
            </Menu>
          </div>
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
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            EnergyCalls
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: '#fff' }}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, opacity: 0.8 }}>
            Menu Principal
          </Typography>
          
          <List sx={{ px: 0 }} component="nav">
            {/* Dashboard Item */}
            <ListItem key="dashboard" disablePadding>
              <StyledListItemButton 
                selected={isSelected('/')} 
                onClick={() => navigate('/')}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </StyledListItemButton>
            </ListItem>

            {/* Calls Item with submenu */}
            <ListItem key="calls" disablePadding>
              <StyledListItemButton 
                selected={isSelected('/calls')}
                onClick={handleToggleCallsMenu}
              >
                <ListItemIcon>
                  <EnergyIcon />
                </ListItemIcon>
                <ListItemText primary="Chamadas de Energia" />
                {callsOpen ? <ExpandLess /> : <ExpandMore />}
              </StyledListItemButton>
            </ListItem>
            <Collapse in={callsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem disablePadding>
                  <StyledListItemButton 
                    sx={{ pl: 4 }} 
                    selected={location.pathname === '/calls'} 
                    onClick={() => navigate('/calls')}
                  >
                    <ListItemText primary="Listar Todas" />
                  </StyledListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <StyledListItemButton 
                    sx={{ pl: 4 }} 
                    selected={location.pathname === '/calls/create'} 
                    onClick={() => navigate('/calls/create')}
                  >
                    <ListItemText primary="Criar Nova" />
                  </StyledListItemButton>
                </ListItem>
              </List>
            </Collapse>

            {/* Counterparts Item with submenu */}
            <ListItem key="counterparts" disablePadding>
              <StyledListItemButton 
                selected={isSelected('/counterparts')}
                onClick={handleToggleCounterpartsMenu}
              >
                <ListItemIcon>
                  <CompanyIcon />
                </ListItemIcon>
                <ListItemText primary="Contrapartes" />
                {counterpartsOpen ? <ExpandLess /> : <ExpandMore />}
              </StyledListItemButton>
            </ListItem>
            <Collapse in={counterpartsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem disablePadding>
                  <StyledListItemButton 
                    sx={{ pl: 4 }} 
                    selected={location.pathname === '/counterparts'} 
                    onClick={() => navigate('/counterparts')}
                  >
                    <ListItemText primary="Listar Todas" />
                  </StyledListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <StyledListItemButton 
                    sx={{ pl: 4 }} 
                    selected={location.pathname === '/counterparts/create'} 
                    onClick={() => navigate('/counterparts/create')}
                  >
                    <ListItemText primary="Adicionar Nova" />
                  </StyledListItemButton>
                </ListItem>
              </List>
            </Collapse>

            {/* Users Item (admin only) */}
            {user?.role === 'admin' && (
              <ListItem key="users" disablePadding>
                <StyledListItemButton 
                  selected={isSelected('/users')} 
                  onClick={() => navigate('/users')}
                >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Usuários" />
                </StyledListItemButton>
              </ListItem>
            )}
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
              Logado como:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {user?.name || 'Usuário'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user?.email || 'usuario@exemplo.com'}
            </Typography>
          </Box>
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box 
          sx={{
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(255,255,255,0.7)' 
              : 'rgba(30,30,30,0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            boxShadow: theme.palette.mode === 'light'
              ? '0 4px 24px rgba(0,0,0,0.05)'
              : '0 4px 24px rgba(0,0,0,0.2)',
          }}
        >
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default Layout; 