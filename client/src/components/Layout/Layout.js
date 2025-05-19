import React, { useState, useContext, useEffect } from 'react';
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

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('md')]: {
      marginLeft: `-${drawerWidth}px`,
    },
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    marginTop: '64px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '56px',
    }
  }),
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backdropFilter: 'blur(10px)',
  backgroundColor: theme.palette.mode === 'light'
    ? 'rgba(244, 246, 248, 0.8)'
    : 'rgba(10, 25, 41, 0.8)',
  color: theme.palette.text.primary,
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
  minHeight: '64px',
  [theme.breakpoints.down('sm')]: {
    minHeight: '56px',
  },
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  paddingLeft: theme.spacing(2.5),
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  fontSize: '1rem',
  fontWeight: 600,
}));

const Layout = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [callsMenuOpen, setCallsMenuOpen] = useState(location.pathname.startsWith('/calls'));
  const [counterpartsMenuOpen, setCounterpartsMenuOpen] = useState(location.pathname.startsWith('/counterparts'));

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);
  
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
    setCallsMenuOpen(!callsMenuOpen);
  };

  const handleToggleCounterpartsMenu = () => {
    setCounterpartsMenuOpen(!counterpartsMenuOpen);
  };
  
  useEffect(() => {
    setCallsMenuOpen(location.pathname.startsWith('/calls'));
    setCounterpartsMenuOpen(location.pathname.startsWith('/counterparts'));
  }, [location.pathname]);

  const isSelected = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      exact: true,
    },
    {
      text: 'Chamadas de Energia',
      icon: <EnergyIcon />,
      path: '/calls',
      onClick: handleToggleCallsMenu,
      open: callsMenuOpen,
      subMenu: [
        { text: 'Listar Todas', path: '/calls', exact: true },
        { text: 'Criar Nova', path: '/calls/create' },
      ],
    },
    {
      text: 'Contrapartes',
      icon: <CompanyIcon />,
      path: '/counterparts',
      onClick: handleToggleCounterpartsMenu,
      open: counterpartsMenuOpen,
      subMenu: [
        { text: 'Listar Todas', path: '/counterparts', exact: true },
        { text: 'Adicionar Nova', path: '/counterparts/create' },
      ],
    },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ text: 'Usuários', icon: <PeopleIcon />, path: '/users' });
  }

  const drawerContent = (
    <>
      <DrawerHeader>
        <img src="/logo-celesc-horizontal-peq.png" alt="Celesc Logo" style={{ height: '32px', marginRight: 'auto' }} />
        <IconButton onClick={handleDrawerClose} sx={{ color: theme.palette.text.secondary }}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List component="nav">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <StyledListItemButton
              selected={!item.subMenu && isSelected(item.path, item.exact)}
              onClick={() => {
                if (item.subMenu) {
                  item.onClick();
                } else {
                  navigate(item.path);
                  if (isMobile) handleDrawerClose();
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem' }}/>
              {item.subMenu && (item.open ? <ExpandLess /> : <ExpandMore />)}
            </StyledListItemButton>
            {item.subMenu && (
              <Collapse in={item.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subMenu.map((subItem) => (
                    <StyledListItemButton
                      key={subItem.text}
                      selected={isSelected(subItem.path, subItem.exact)}
                      onClick={() => {
                        navigate(subItem.path);
                        if (isMobile) handleDrawerClose();
                      }}
                      sx={{ pl: 5, py: 0.8 }}
                    >
                      <ListItemText primary={subItem.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 400 }} />
                    </StyledListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarStyled position="fixed" open={open} elevation={1}>
        <Toolbar sx={{ minHeight: '64px !important', [theme.breakpoints.down('sm')]: { minHeight: '56px !important' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            EnergyCalls - CELESC
          </Typography>
          <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ mr: 1 }}>
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          
          <Tooltip title="Notificações">
            <IconButton color="inherit" sx={{ mr: 0.5 }}>
                <Badge badgeContent={user?.notificationsCount || 0} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
          </Tooltip>

          {user && (
            <>
              <Tooltip title="Configurações da Conta">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <UserAvatar>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</UserAvatar>
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
                  elevation: 2,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}                
              >
                <MenuItem onClick={handleClose} sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pointerEvents: 'none'}}>
                  <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>{user.name}</Typography>
                  <Typography variant="caption">{user.email}</Typography>
                </MenuItem>
                <Divider sx={{my: 0.5}}/>
                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  Minha Conta
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </>
          )}
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
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.background.paper, 
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        {drawerContent}
      </Drawer>
      <Main open={open && !isMobile}>
        <Outlet />
      </Main>
    </Box>
  );
};

export default Layout; 