import React from 'react'
import {AppBar, Box,Toolbar, IconButton, Typography, Menu, Card,
  Container,Avatar,Button, MenuItem, Slide, Tooltip, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions
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
import { connect } from 'react-redux';
import {
  setLoad, setLang, setDarkMode, setPage, setLaunch
} from './redux/action';
import 'moment/locale/th'  // without this line it didn't work
import "mapbox-gl/dist/mapbox-gl.css";

import Home from './page/home';
import About from './page/about';
import Disco from './page/port';
import Event from './page/event';
import Feed from './page/update';

const pageSec = ['', 'aboutkf', 'discography', 'events', 'feeds', 'follow', 'more'];
const pagesEn = ['Home', 'About Kaofrang', 'Discography', 'Events for Frang', 'Social Feeds', 'Follow KaofrangFie', 'More things'];
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

function App({currentPage, lang, setLang, setLaunch, launch}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation();

  const [unlock, setUnlock] = React.useState(null);

  React.useEffect(() => {
    AOS.init({ duration: 800 });
    fetch("https://worldtimeapi.org/api/timezone/utc", {})
    .then(response => response.json())
    .then(result => {
      setLaunch(result.unixtime)
      if (result.unixtime >= 1731603600 || (localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") != null && localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") == '56f006fb7a76776e1e08eac264bd491aa1a066a1')) {
        setUnlock(true)
      } else {
        setUnlock(false)
      }
    })
    .catch(error => console.log('error', error));
  }, []);

  const [pages, setPage] = React.useState(lang == 'th' ? pagesTh : pagesEn);
  const [appbarx, setApp] = React.useState(false);

  React.useEffect(() => {
    setApp(location.pathname != '/' && unlock ? true : false)
  }, [location.pathname, unlock]);

  React.useEffect(() => {
    if (localStorage.getItem('kflang') == null) {
      localStorage.setItem('kflang', 'th')
    } else {
      setPage(lang == 'th' ? pagesTh : pagesEn)
      localStorage.setItem('kflang', lang)
    }
  }, [lang]);

  React.useEffect(() => {
    document.title = currentPage + ' | KaofrangFie Site'
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div>
    <div id="blockwhenland" className='d-flex justify-content-center align-items-center text-center'>
        <h5>This screen size is not support on this device. Please rotate your device screen.</h5>
    </div>
      <Slide direction='down' in={appbarx}>

      <AppBar position="fixed" sx={{ borderBottomLeftRadius: 10, borderBottomRightRadius:10}}>
   <Container maxWidth="xl">
     <Toolbar disableGutters>
        <Avatar sx={{ display: { xs: 'none', lg: 'flex' }, mr: 1 }} alt="kaofrangicon" src="https://pbs.twimg.com/profile_images/1775717193298354176/9GyCNMZW_400x400.jpg" />
       <Typography
         variant="h6"
         noWrap
         sx={{
           mr: 2,
           display: { xs: 'none', lg: 'flex' },
           color: 'inherit',
           textDecoration: 'none',
         }}
       >
         <b>KaofrangFie</b>
       </Typography>

       <Box className='justify-content-center' sx={{ flexGrow: 0, display: { xs: 'flex', lg: 'none' } }}>
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



         <Dialog
              open={anchorElNav}
              onClose={handleCloseNavMenu}
              maxWidth='xl'
            >
              <DialogTitle>
                {lang == 'th' ? 'เมนูหลัก' : 'Main Menu'}
              </DialogTitle>
              <DialogContent>
              {pages.map((page, i) => (
                  <MenuItem component={Link} key={page} to={'/'+pageSec[i]} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center" sx={{color: location.pathname == '/'+pageSec[i] ? 'rgb(252, 91, 214)' : '#000'}} component='p'>{page}</Typography>
                  </MenuItem>
              ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseNavMenu}>{lang =='th' ? 'ปิด' : 'Close'}</Button>
              </DialogActions>
            </Dialog>
       </Box>
       <Avatar sx={{ display: { xs: 'flex', lg: 'none' }, ml: 1, mr: 1 }} alt="kaofrangicon" src="https://pbs.twimg.com/profile_images/1775717193298354176/9GyCNMZW_400x400.jpg" />
       <Typography
         variant="h6"
         noWrap
         sx={{
           mr: 2,
           display: { xs: 'flex', lg: 'none' },
           color: 'inherit',
           textDecoration: 'none',
         }}
       >
         <b>KaofrangFie</b>
       </Typography>
       <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' } }}>
         {pages.map((page, i) => (
           <Button
             key={page}
             component={Link}
             to={'/'+pageSec[i]}
             size='medium'
             onClick={handleCloseNavMenu}
             sx={{ my: 2, color: location.pathname == '/'+pageSec[i] ? '#fff' : '#000', display: 'block' }}
           >
             {page}
           </Button>
         ))}
       </Box>

       <Box sx={{ position: 'fixed', right: 30 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={() => setAnchorElUser(true)} sx={{ p: 0 }}>
                <Avatar sx={{width: 30, height: 30}} variant='rounded' alt="lang" src={"https://pub-8132af7faa6a48298af6aaa68af91b48.r2.dev/" + (lang == 'th' ? 'th.png' : 'us.png')} />
              </IconButton>
            </Tooltip>

            <Dialog
              open={anchorElUser}
              onClose={() => setAnchorElUser(false)}
              maxWidth='xl'
            >
              <DialogTitle>
                {lang == 'th' ? 'การตั้งค่าภาษา' : 'Language Setting'}
              </DialogTitle>
              <DialogContent>
              <TextField
                    select
                    label="Change Language"
                    value={lang}
                    variant="filled"
                    onChange={(e) => setLang(e.target.value)}
                    sx={{width: 180}}
                    fullWidth={true}
                  >
                    {langList.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setAnchorElUser(false)}>{lang =='th' ? 'ปิด' : 'Close'}</Button>
              </DialogActions>
            </Dialog>
          </Box>
     </Toolbar>
   </Container>
 </AppBar>
      </Slide>

         {unlock ? (
           <BasicSwitch>
           <Route
             exact
             path="/"
             render={() => (
               <Home setMenu={(v) => setAnchorElNav(v)} setLangMod={() => setAnchorElUser(true)} />
             )}
           />
           <Route
             path="/aboutkf"
             render={() => (
               <About />
             )}
           />
          <Route
             path="/discography"
             render={() => (
               <Disco />
             )}
           />
           <Route
             path="/events"
             render={() => (
               <Event />
             )}
           />
           <Route
             path="/feeds"
             render={() => (
               <Feed />
             )}
           />
          </BasicSwitch>
         ) : (
          <BasicSwitch>
          <Route
          exact
            render={() => (
              <Home setMenu={(v) => setAnchorElNav(v)} setLangMod={() => setAnchorElUser(true)} />
            )}
          />
  </BasicSwitch>
         )}
    <footer className='fixed-bottom bg-secondary text-center'>
      <Card className='p-2' style={{borderTopLeftRadius: 0, borderTopRightRadius: 0, fontSize: 14, lineHeight: 1.2}}>
      &copy; Copyright {new Date().getFullYear()}, CPXDevStudio<br/>
      <small style={{fontSize: 10}}>All BNK48 contents are licensed by Independent Artist Management (iAM). These member images and all events poster is objective for Kaofrang BNK48 and other BNK48 members supporting only.</small>
      </Card>
    </footer>
 </div>
  );
}

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  currentPage: state.currentPage
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setLaunch: (val) => dispatch(setLaunch(val)),
  setPage: (val) => dispatch(setPage(val))
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
