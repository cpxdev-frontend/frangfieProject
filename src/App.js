import React from 'react'
import {AppBar, Box,Toolbar, IconButton, Typography, Menu,
  Container,Avatar,Button, MenuItem, Slide, Tooltip, TextField
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import AOS from "aos";
import {
  Route,
  Link,
  Switch as BasicSwitch,
  useHistory,
  useLocation
} from "react-router-dom";
import './App.css'

import Home from './page/home';
import About from './page/about';

const pageSec = ['', 'aboutkf', 'entertainwithkf', 'events', 'feeds', 'follow', 'more'];
const pagesEn = ['Home', 'About Kaofrang', 'Entertain', 'Events for Frang', 'Feed', 'Follow KaofrangFie', 'More things'];
const pagesTh = ['หน้าหลัก', 'เกี่ยวกับข้าวฟ่าง', 'ผลงาน', 'กิจกรรม', 'ฟีดออนไลน์', 'ช่องทางการติดตาม', 'เพิ่มเติม'];

const langList = [
  {
    value: 'th',
    label: 'ไทย',
  },
  {
    value: 'en',
    label: 'English',
  }
];

export default function App() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation();

  React.useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const [pages, setPage] = React.useState(pagesTh);
  const [appbarx, setApp] = React.useState(false);

  React.useEffect(() => {
    setApp(location.pathname != '/' ? true : false)
  }, [location.pathname]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div>
      <Slide direction='down' in={appbarx}>

      <AppBar position="fixed" sx={{top: 0, zIndex:20,borderRadius: 3}}>
   <Container maxWidth="xl">
     <Toolbar disableGutters>
        <Avatar sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} alt="kaofrangicon" src="https://pbs.twimg.com/profile_images/1775717193298354176/9GyCNMZW_400x400.jpg" />
       <Typography
         variant="h6"
         noWrap
         sx={{
           mr: 2,
           display: { xs: 'none', md: 'flex' },
           color: 'inherit',
           textDecoration: 'none',
         }}
       >
         <b>KaofrangFie</b>
       </Typography>

       <Box className='justify-content-center' sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
         <IconButton
           size="large"
           aria-label="account of current user"
           aria-controls="menu-appbar"
           aria-haspopup="true"
           onClick={handleOpenNavMenu}
           color="inherit"
         >
           <MenuIcon />
         </IconButton>
         <Menu
           id="menu-appbar"
           anchorEl={anchorElNav}
           anchorOrigin={{
             vertical: 'bottom',
             horizontal: 'left',
           }}
           keepMounted
           transformOrigin={{
             vertical: 'top',
             horizontal: 'left',
           }}
           open={Boolean(anchorElNav)}
           onClose={handleCloseNavMenu}
           sx={{
             display: { xs: 'block', md: 'none' },
           }}
         >
           {pages.map((page, i) => (
              <MenuItem component={Link} key={page} to={'/'+pageSec[i]} onClick={handleCloseNavMenu}>
                <Typography textAlign="center" component='p'>{page}</Typography>
              </MenuItem>
           ))}
         </Menu>
       </Box>
       <Avatar sx={{ display: { xs: 'flex', md: 'none' }, ml: 1, mr: 1 }} alt="kaofrangicon" src="https://pbs.twimg.com/profile_images/1775717193298354176/9GyCNMZW_400x400.jpg" />
       <Typography
         variant="h6"
         noWrap
         sx={{
           mr: 2,
           display: { xs: 'flex', md: 'none' },
           color: 'inherit',
           textDecoration: 'none',
         }}
       >
         <b>KaofrangFie</b>
       </Typography>
       <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
         {pages.map((page, i) => (
           <Button
             key={page}
             component={Link}
             to={'/'+pageSec[i]}
             size='medium'
             onClick={handleCloseNavMenu}
             sx={{ my: 2, color: '#000', display: 'block' }}
           >
             {page}
           </Button>
         ))}
       </Box>

       <Box sx={{ flexGrow: 0, mr: 1, ml:3 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={() => setAnchorElUser(true)} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="https://pub-8132af7faa6a48298af6aaa68af91b48.r2.dev/us.png" />
              </IconButton>
            </Tooltip>
            <Menu
               sx={{ mt: '45px', height: 500 }}
               id="menu-appbar"
               anchorEl={anchorElUser}
               anchorOrigin={{
                 vertical: 'top',
                 horizontal: 'right',
               }}
               keepMounted
               transformOrigin={{
                 vertical: 'top',
                 horizontal: 'right',
               }}
               open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(false)}
            >
              <MenuItem>
                  <TextField
                    select
                    label="Change Language"
                    defaultValue="en"
                    variant="filled"
                    sx={{width: 180}}
                    fullWidth={true}
                  >
                    {langList.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </MenuItem>
            </Menu>
          </Box>
     </Toolbar>
   </Container>
 </AppBar>
      </Slide>

          <BasicSwitch>
            <Route
              exact
              path="/"
              render={() => (
                <Home />
              )}
            />
            <Route
              path="/aboutkf"
              render={() => (
                <About />
              )}
            />
    </BasicSwitch>
 </div>
  );
}