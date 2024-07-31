import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Fade,
  Card,
  Container,
  Divider,
  Avatar,
  Button,
  MenuItem,
  Slide,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Fab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AOS from "aos";
import {
  Route,
  Link,
  Switch as BasicSwitch,
  useHistory,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { connect } from "react-redux";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setLaunch,
} from "./redux/action";
import "moment/locale/th"; // without this line it didn't work
import "mapbox-gl/dist/mapbox-gl.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import moment from "moment";

import Home from "./page/home";
import About from "./page/about";
import Disco from "./page/port";
import Event from "./page/event";
import Game from "./page/game";
import Feed from "./page/update";
import Follow from "./page/follow";
import Err from "./page/error";

const pageSec = [
  "",
  "aboutkf",
  "discography",
  "trend",
  "events",
  "feeds",
  "quizgame",
  "follow",
];
const pagesEn = [
  "Home",
  "About Kaofrang",
  "Discography",
  "Trend Boost",
  "Events of Frang",
  "Social Feeds",
  "Quiz",
  "Follow KaofrangFie",
];
const pagesTh = [
  "หน้าหลัก",
  "เกี่ยวกับข้าวฟ่าง",
  "ผลงาน",
  "ปั่นเทรน",
  "กิจกรรม",
  "ฟีดออนไลน์",
  "มินิเกมส์",
  "ช่องทางการติดตาม",
];

const langList = [
  {
    value: "th",
    label: "ไทย",
  },
  {
    value: "en",
    label: "English",
  },
];
let scrollmot = false;
function App({ currentPage, lang, setLang, setLaunch, launch, game }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [leftmode, setLeftMode] = React.useState(
    localStorage.getItem("left") != null
  );
  const location = useLocation();
  const [opacity, setOpacity] = React.useState(1); // เริ่มต้น opacity เต็ม
  const scrollRef = React.useRef(null); // เก็บ reference ของ element ที่ scroll

  function debounce(func, wait) {
    let timeout;
    return function () {
      if (window.innerWidth < 800) {
        scrollmot = true;
        setOpacity(0.3); // ตั้งค่า opacity ต่ำเมื่อ scroll

        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      }
    };
  }

  const handleScroll = () => {
    scrollmot = false;
    setTimeout(() => {
      if (scrollmot == false) {
        setOpacity(1); // แสดงปุ่มปกติหลัง 5 วินาที
      }
    }, 3000);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", debounce(handleScroll, 200));
  }, []);

  const [unlock, setUnlock] = React.useState(null);

  React.useEffect(() => {
    if (leftmode) {
      localStorage.setItem("left", "");
    } else {
      localStorage.removeItem("left");
    }
  }, [leftmode]);

  React.useEffect(() => {
    AOS.init({ duration: 800 });
    setLaunch(moment().unix());
    if (localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") != null) {
      setUnlock(true);
      fetch("https://cpxdevnode.onrender.com/auth/getunix", {})
        .then((response) => response.json())
        .then((result) => {
          setLaunch(result.unix);
        })
        .catch((error) => console.log("error", error));
      return;
    }
    fetch("https://cpxdevnode.onrender.com/auth/getunix", {})
      .then((response) => response.json())
      .then((result) => {
        setLaunch(result.unix);
        if (
          result.unix >= 1731603600 ||
          (localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") != null &&
            localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") ==
              "56f006fb7a76776e1e08eac264bd491aa1a066a1")
        ) {
          setUnlock(true);
        } else {
          setUnlock(false);
        }
      })
      .catch((error) => console.log("error", error));
  }, []);

  const [pages, setPage] = React.useState(lang == "th" ? pagesTh : pagesEn);
  const [appbarx, setApp] = React.useState(false);

  React.useEffect(() => {
    if (currentPage.includes("404 Not Found")) {
      setApp(false);
    } else {
      setApp(location.pathname != "/" && unlock && !game ? true : false);
    }
  }, [currentPage, location.pathname, unlock, game]);

  React.useEffect(() => {
    if (localStorage.getItem("kflang") == null) {
      localStorage.setItem("kflang", "th");
    } else {
      setPage(lang == "th" ? pagesTh : pagesEn);
      localStorage.setItem("kflang", lang);
    }
  }, [lang]);

  React.useEffect(() => {
    document.title = currentPage + " | KaofrangFie Site";
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleOpenNavMenu = (event) => {
    setOpacity(1);
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Fade in={true} timeout={800}>
      <div ref={scrollRef}>
        <div
          id="blockwhenland"
          className="d-flex justify-content-center align-items-center text-center">
          <h5>
            This screen size is not support on this device. Please rotate your
            device screen.
          </h5>
        </div>
        <Slide
          direction="down"
          in={appbarx}
          sx={{ display: { xs: "none", md: "initial" } }}>
          <AppBar
            position="fixed"
            sx={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                <Avatar
                  sx={{ display: { xs: "none", lg: "flex" }, mr: 1 }}
                  alt="kaofrangicon"
                  src="https://pbs.twimg.com/profile_images/1775717193298354176/9GyCNMZW_400x400.jpg"
                />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    mr: 2,
                    display: { xs: "none", lg: "flex" },
                    color: "inherit",
                    textDecoration: "none",
                  }}>
                  <b>KaofrangFie</b>
                </Typography>

                <Box
                  className="justify-content-center"
                  sx={{ flexGrow: 0, display: { xs: "flex", lg: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit">
                    <MenuIcon />
                  </IconButton>

                  <Dialog
                    open={anchorElNav}
                    onClose={handleCloseNavMenu}
                    maxWidth="xl">
                    <DialogTitle>
                      {lang == "th" ? "เมนูหลัก" : "Main Menu"}
                    </DialogTitle>
                    <DialogContent>
                      {pages.map((page, i) => (
                        <MenuItem
                          component={Link}
                          key={page}
                          to={"/" + pageSec[i]}
                          onClick={handleCloseNavMenu}>
                          <Typography
                            textAlign="center"
                            sx={{
                              color:
                                location.pathname == "/" + pageSec[i]
                                  ? "#fb61ee"
                                  : "#000",
                            }}
                            component="p">
                            {page}
                          </Typography>
                        </MenuItem>
                      ))}
                      <Box sx={{ display: { xs: "initial", md: "none" } }}>
                        <Divider className="border border-secondary mb-3 mt-2" />
                        <TextField
                          select
                          label="Change Language"
                          value={lang}
                          variant="filled"
                          onChange={(e) => setLang(e.target.value)}
                          sx={{
                            width: 180,
                            display:
                              window.location.pathname == "/"
                                ? "none"
                                : "block",
                          }}
                          fullWidth={true}>
                          {langList.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>

                        <FormControlLabel
                          onChange={() => setLeftMode(!leftmode)}
                          control={<Switch checked={leftmode} />}
                          label={
                            lang == "th"
                              ? "โหมดใช้งานข้างซ้าย"
                              : "Left Hand mode"
                          }
                        />
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseNavMenu}>
                        {lang == "th" ? "ปิด" : "Close"}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
                <Avatar
                  sx={{ display: { xs: "flex", lg: "none" }, ml: 1, mr: 1 }}
                  alt="kaofrangicon"
                  src="https://pbs.twimg.com/profile_images/1775717193298354176/9GyCNMZW_400x400.jpg"
                />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    mr: 2,
                    display: { xs: "flex", lg: "none" },
                    color: "inherit",
                    textDecoration: "none",
                  }}>
                  <b>KaofrangFie</b>
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: "none", lg: "flex" } }}>
                  {pages.map((page, i) => (
                    <Button
                      key={page}
                      component={Link}
                      to={"/" + pageSec[i]}
                      size="medium"
                      onClick={handleCloseNavMenu}
                      sx={{
                        my: 2,
                        color:
                          location.pathname == "/" + pageSec[i]
                            ? "#fff"
                            : "#000",
                        display: "block",
                      }}>
                      {page}
                    </Button>
                  ))}
                </Box>

                <Box sx={{ position: "fixed", right: 30 }}>
                  <Tooltip title="Open settings">
                    <IconButton
                      onClick={() => setAnchorElUser(true)}
                      sx={{ p: 0 }}>
                      <Avatar
                        sx={{ width: 30, height: 30 }}
                        variant="rounded"
                        alt="lang"
                        src={
                          "https://pub-8132af7faa6a48298af6aaa68af91b48.r2.dev/" +
                          (lang == "th" ? "th.png" : "us.png")
                        }
                      />
                    </IconButton>
                  </Tooltip>

                  <Dialog
                    open={anchorElUser}
                    onClose={() => setAnchorElUser(false)}
                    maxWidth="xl">
                    <DialogTitle>
                      {lang == "th" ? "การตั้งค่าภาษา" : "Language Setting"}
                    </DialogTitle>
                    <DialogContent>
                      <TextField
                        select
                        label="Change Language"
                        value={lang}
                        variant="filled"
                        onChange={(e) => setLang(e.target.value)}
                        sx={{ width: 180 }}
                        fullWidth={true}>
                        {langList.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setAnchorElUser(false)}>
                        {lang == "th" ? "ปิด" : "Close"}
                      </Button>
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
                <Home
                  data-aos="fade-in"
                  setMenu={(v) => setAnchorElNav(v)}
                  setLangMod={() => setAnchorElUser(true)}
                />
              )}
            />
            <Route
              data-aos="fade-in"
              path="/aboutkf"
              render={() => <About />}
            />
            <Route
              data-aos="fade-in"
              path="/discography"
              render={() => <Disco />}
            />
            <Route data-aos="fade-in" path="/events" render={() => <Event />} />
            <Route data-aos="fade-in" path="/feeds" render={() => <Feed />} />
            <Route
              data-aos="fade-in"
              path="/quizgame"
              render={() => <Game />}
            />
            <Route
              data-aos="fade-in"
              path="/follow"
              render={() => <Follow />}
            />
            <Route
              exact
              data-aos="fade-in"
              render={() => (
                <Err
                  setMenu={(v) => setAnchorElNav(v)}
                  setLangMod={() => setAnchorElUser(true)}
                />
              )}
            />
          </BasicSwitch>
        ) : (
          <BasicSwitch>
            <Route
              exact
              render={() => (
                <Home
                  data-aos="fade-in"
                  setMenu={(v) => setAnchorElNav(v)}
                  setLangMod={() => setAnchorElUser(true)}
                />
              )}
            />
          </BasicSwitch>
        )}
        <footer className="fixed-bottom bg-secondary text-center">
          <Card
            className="p-2"
            style={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              fontSize: 14,
              lineHeight: 1.2,
            }}>
            &copy; Copyright {new Date().getFullYear()}, CPXDevStudio
            <br />
            <small style={{ fontSize: 10 }}>
              All BNK48 contents are licensed by Independent Artist Management
              (iAM). These member images and all events poster is objective for
              Kaofrang BNK48 and other BNK48 members supporting only.
            </small>
          </Card>
        </footer>
        {appbarx && (
          <Fab
            color="primary"
            sx={
              leftmode
                ? {
                    display: {
                      xs: "initial",
                      md: "none",
                      bottom: 100,
                      left: 8,
                      position: "fixed",
                      zIndex: 1300,
                      opacity: opacity,
                    },
                  }
                : {
                    display: {
                      xs: "initial",
                      md: "none",
                      bottom: 100,
                      right: 8,
                      position: "fixed",
                      zIndex: 1300,
                      opacity: opacity,
                    },
                  }
            }
            onClick={handleOpenNavMenu}>
            {anchorElNav ? (
              <Avatar
                sx={{ width: 55, height: 55 }}
                alt="kaofrangicon"
                src="https://pbs.twimg.com/profile_images/1775717193298354176/9GyCNMZW_400x400.jpg"
              />
            ) : (
              <MenuOpenIcon />
            )}
          </Fab>
        )}
      </div>
    </Fade>
  );
}

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  currentPage: state.currentPage,
  game: state.game,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setLaunch: (val) => dispatch(setLaunch(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
