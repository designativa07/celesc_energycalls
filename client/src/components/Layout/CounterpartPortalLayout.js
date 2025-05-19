import React, { useState, useContext, useEffect } from 'react';
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
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  minHeight: '56px',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0.5, 1),
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
    '& .MuiListItemIcon-root': {
    },
  },
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backdropFilter: 'blur(10px)',
  backgroundColor: theme.palette.mode === 'light'
    ? 'rgba(244, 246, 248, 0.85)'
    : 'rgba(10, 25, 41, 0.85)',
  color: theme.palette.text.primary,
  zIndex: theme.zIndex.drawer + 1,
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  fontSize: '0.9rem',
  fontWeight: 500,
}));

const CounterpartPortalLayout = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { counterpart, logout } = useCounterpartAuth();

  useEffect(() => {
    if (!isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isMobile, drawerOpen]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setDrawerOpen(!drawerOpen);
    }
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
    if (isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  };

  const isSelected = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/counterpart-portal', exact: true },
    { text: 'Chamadas', icon: <ViewListIcon />, path: '/counterpart-portal/calls' },
    { text: 'Minhas Propostas', icon: <SendIcon />, path: '/counterpart-portal/my-proposals' },
  ];

  const drawerContent = (
    <>
      <DrawerHeader>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Portal CELESC
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <List component="nav">
        {menuItems.map((item) => (
          <StyledListItemButton
            key={item.text}
            selected={isSelected(item.path, item.exact)}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }} />
          </StyledListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBarStyled position="fixed">
        <Toolbar variant="dense">
          {isMobile && (
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              fontSize: '1rem',
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
                : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Portal da Contraparte
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map(item => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  size="small"
                  sx={{
                    mx: 0.5,
                    fontWeight: isSelected(item.path, item.exact) ? 600 : 500,
                    fontSize: '0.875rem',
                    color: isSelected(item.path, item.exact) ? theme.palette.primary.main : theme.palette.text.secondary,
                    borderBottom: isSelected(item.path, item.exact)
                      ? `3px solid ${theme.palette.primary.main}`
                      : '3px solid transparent',
                    borderRadius: 0,
                    pb: 0.5,
                    mt: '3px',
                    transition: 'color 0.2s, border-bottom-color 0.2s',
                    '&:hover': {
                      color: theme.palette.primary.light,
                      backgroundColor: 'transparent',
                      borderBottomColor: theme.palette.primary.light,
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

          <Tooltip title={theme.palette.mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              size="medium"
              sx={{ mx: 0.5 }}
            >
              {theme.palette.mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notificações">
            <IconButton
              color="inherit"
              size="medium"
              sx={{ mx: 0.5 }}
            >
              <Badge badgeContent={counterpart?.notificationsCount || 0} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: '16px', minWidth: '16px' } }}>
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={counterpart?.companyName || 'Contraparte'}>
            <IconButton
              size="medium"
              aria-label="perfil da contraparte"
              aria-controls="menu-appbar-counterpart"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
              sx={{ ml: 0.5 }}
            >
              <UserAvatar>
                {counterpart?.companyName ? counterpart.companyName.charAt(0).toUpperCase() : <AccountCircle />}
              </UserAvatar>
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar-counterpart"
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
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 28,
                  height: 28,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem disabled sx={{ opacity: '1 !important' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" fontWeight={600}>{counterpart?.companyName}</Typography>
                <Typography variant="caption" color="text.secondary">{counterpart?.email}</Typography>
              </Box>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
              <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 36 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>

      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
          px: { xs: 2, sm: 3 },
          mt: '48px',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default CounterpartPortalLayout; 