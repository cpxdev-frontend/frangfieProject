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
  LinearProgress,
  Alert,
  ButtonGroup,
  Backdrop,
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
  setZone,
} from "./redux/action";
import "moment/locale/th"; // without this line it didn't work
import "mapbox-gl/dist/mapbox-gl.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import moment from "moment";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import ReactGA from "react-ga4";

import Home from "./page/home";
import About from "./page/about";
import Disco from "./page/port";
import Trend from "./page/trend";
import Event from "./page/event";
import Album from "./page/albumgroup";
import Gallery from "./page/gallery";
import Game from "./page/game";
import GameD from "./page/gamedash";
import Feed from "./page/update";
import Donate from "./page/donate";
import Follow from "./page/follow";
import Birth from "./page/birth";
import Err from "./page/error";

const pageSec = [
  "",
  "aboutkf",
  "discography",
  "birthday",
  "trend",
  "gallery",
  "events",
  "feeds",
  "quizgame",
  "follow",
  "donation",
];
const pagesEn = [
  "Home",
  "About Kaofrang",
  "Discography",
  "KF.Day Trend",
  "Trend Boost",
  "Gallery",
  "Events of Frang",
  "Social Feeds",
  "Quiz",
  "Follow KaofrangFie",
  "Donate",
];
const pagesTh = [
  "หน้าหลัก",
  "เกี่ยวกับข้าวฟ่าง",
  "ผลงาน",
  "กิจกรรมอวยพรวันเกิด",
  "ปั่นเทรน",
  "คลังรูป",
  "กิจกรรม",
  "ฟีดออนไลน์",
  "มินิเกมส์",
  "ช่องทางการติดตาม",
  "โดเนท",
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

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

let adm = 0;

function App({ currentPage, lang, setLang, setLaunch, setZone, launch, game }) {
  const [betabypass, setBetaMode] = React.useState(false);
  const [bypassonclose, setOnClose] = React.useState(false);
  const [transit, setTran] = React.useState(false);
  const [mainten, setOnMaintain] = React.useState(false);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [birthdaycampain, setBirthday] = React.useState(false);

  const location = useLocation();
  const [opacity, setOpacity] = React.useState(1); // เริ่มต้น opacity เต็ม
  const scrollRef = React.useRef(null); // เก็บ reference ของ element ที่ scroll

  const targetTime = 1730448000;

  function calculateTimeLeft() {
    const difference = moment.unix(targetTime) - moment.unix(launch + adm);
    let duration = moment.duration(difference);
    return {
      months: duration.months(),
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  }

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  React.useEffect(() => {
    if (moment.unix(targetTime) - moment.unix(launch + adm) <= 0) {
      return;
    }
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      if (moment.unix(targetTime) - moment.unix(launch + adm) <= 0) {
        clearInterval(interval);
        window.location.reload();
      } else {
        adm += 1;
        setTimeLeft(calculateTimeLeft());
        console.log("time trigger");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [launch]);

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
    ReactGA.initialize("G-HGFSHDZZMC");
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    window.addEventListener("scroll", debounce(handleScroll, 200));
    fetch(process.env.REACT_APP_APIE + "/home/status", {})
      .then((response) => response.text())
      .then((result) => {})
      .catch((error) => {
        document.title = "System Maintenance | KaofrangFie Site";
        setOnMaintain(true);
      });
  }, []);

  React.useEffect(() => {
    if (location.pathname == window.location.pathname) {
      setTran(true);
    } else {
      setTran(false);
    }
    setTimeout(() => {
      setTran(true);
    }, 50);
  }, [location]);

  const [unlock, setUnlock] = React.useState(null);

  React.useEffect(() => {
    AOS.init({ duration: 800 });
    setLaunch(moment().unix());
    fetch(process.env.REACT_APP_APIE + "/kfsite/birthdayStatus?ok=kf", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => {
        setBirthday(result.response);
      })
      .catch((error) => console.log("error", error));
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
          result.unix >= targetTime ||
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
    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => setZone(data.country));
  }, []);

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

  if (isInIframe()) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        className="text-center">
        {lang == "th"
          ? "เว็บไซต์นี้ไม่รองรับการแสดงแบบฝังบนเว็บไซต์อื่น"
          : "This site is not support on iframe tag"}
      </Backdrop>
    );
  }

  if (mainten) {
    return (
      <div
        className="d-flex justify-content-center align-items-center text-center row"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
        <div className="col-12">
          <img
            src="https://niceillustrations.com/wp-content/uploads/2021/07/Connection-Lost-color-800px.png"
            width={300}
          />
        </div>
        <div className="col-12">
          <h5>
            {lang == "th"
              ? "อยู่ระหว่างการปรับปรุงระบบ ขออภัยในความไม่สะดวก"
              : "Our Web Server is under maintenance. Sorry for inconvenience."}
          </h5>
        </div>
      </div>
    );
  }

  if (launch > targetTime - 1209600 && launch < targetTime) {
    if (
      timeLeft.months == 0 &&
      timeLeft.days == 0 &&
      timeLeft.hours == 0 &&
      timeLeft.minutes == 0 &&
      timeLeft.seconds > 0
    ) {
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          className="text-center">
          <div className="row">
            <h5 className="col-12">
              {lang == "th"
                ? "คุณกำลังเข้าสู่เว็บไซต์นี้ในอีก " +
                  timeLeft.seconds +
                  " วินาที"
                : "We are almost ready in " + timeLeft.seconds + " seconds"}
            </h5>
            <div className="col-12">
              <LinearProgress
                className="d-initial"
                variant="determinate"
                sx={{ height: 5, width: "100%" }}
                value={((60 - (timeLeft.seconds - 1)) / 60) * 100}
              />
            </div>
          </div>
        </Backdrop>
      );
    }
    if (
      timeLeft.months == 0 &&
      timeLeft.days == 0 &&
      timeLeft.hours == 0 &&
      timeLeft.minutes == 0 &&
      timeLeft.seconds == 0
    ) {
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          className="text-center">
          <h4>
            {lang == "th"
              ? "เราพร้อมมอบประสบการณ์ของการเยี่ยมชมจักรวาลของข้าวฟ่างแล้ว!"
              : "You are ready to move through The KorKaofrang Universe!"}
          </h4>
        </Backdrop>
      );
    }
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        className="text-center">
        {lang == "th"
          ? "เว็บไซต์นี้กำลังจะเปิดตัวในอีก " +
            timeLeft.days +
            " วัน " +
            timeLeft.hours +
            " ชั่วโมง " +
            timeLeft.minutes +
            " นาที " +
            timeLeft.seconds +
            " วินาที"
          : "This website is soon in " +
            timeLeft.days +
            " days " +
            timeLeft.hours +
            " hours " +
            timeLeft.minutes +
            " minutes " +
            timeLeft.seconds +
            " seconds"}
      </Backdrop>
    );
  }

  return (
    <div ref={scrollRef}>
      <div
        id="blockwhenland"
        className="d-flex justify-content-center align-items-center text-center">
        <h5>
          <img
            src="https://cdn-icons-png.flaticon.com/512/6737/6737502.png"
            width={150}
          />
          <br />
          {lang == "th"
            ? "เว็บไซต์ไม่รองรับขนาดหน้าจอนี้ กรุณาหมุนจอเป็นแนวตั้งหรือทางทิศที่เหมาะสม"
            : "This screen size is not support on this device. Please rotate your device screen."}
        </h5>
      </div>
      {betabypass && bypassonclose && (
        <Alert
          severity="info"
          className="w-100"
          sx={{ position: "fixed", top: 0, zIndex: 1300 }}>
          <b>Exclusive in BNK48 17th Single "BORDERLESS" Handshake Event</b>{" "}
          คุณสามารถสัมผัสประสบการณ์ของเว็บ KaofrangFie ได้ก่อนใครแล้ว วันนี้!
          <br />
          <span>
            หมายเหตุ: เนื่องจากระบบอยู่ระหว่างการพัฒนา
            การทำงานอาจมีข้อผิดพลาดเกิดขึ้นได้
            กรุณาส่งรายงานข้อผิดพลาดได้ที่อีเมล์ cpxdev@outlook.com
          </span>
          <br />
          <ButtonGroup variant="contained" className="mt-3">
            <Button
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/e/1FAIpQLSd6POb3SrDfm88ZZ84274fwfcG3zFDn4069ExbImVCk-T6esg/viewform?usp=sf_link",
                  "_target"
                )
              }>
              ตอบแบบสำรวจความพึงพอใจ
            </Button>
            <Button onClick={() => setOnClose(false)}>ปิด</Button>
          </ButtonGroup>
        </Alert>
      )}

      {/* Mobile */}
      <Fade
        sx={{ display: { xs: "initial", md: "none" } }}
        in={
          unlock &&
          location.pathname != "/" &&
          !game &&
          !currentPage.includes("404 Not Found")
        }>
        <AppBar position="fixed" className="newmobileAppbar">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box
                className="justify-content-center"
                sx={{ flexGrow: 0, display: { xs: "flex", lg: "none" } }}>
                {location.pathname != "/" &&
                  !currentPage.includes("404 Not Found") && (
                    <Avatar
                      data-aos="fade-in"
                      sx={{
                        width: 70,
                        height: 70,
                        display: { xs: "flex", lg: "none" },
                        ml: 1,
                        mr: 1,
                      }}
                      alt="kaofrangicon"
                      src="https://d2m23ocr3g32v7.cloudfront.net/kf/korfranglogo.webp"
                    />
                  )}

                <Dialog
                  open={anchorElNav}
                  onClose={handleCloseNavMenu}
                  maxWidth="xl">
                  <DialogTitle>
                    {lang == "th" ? "เมนูหลัก" : "Main Menu"}
                  </DialogTitle>
                  <DialogContent>
                    {pages.map((page, i) =>
                      pageSec[i] != "birthday" ? (
                        <MenuItem
                          component={Link}
                          key={page}
                          to={"/" + pageSec[i]}
                          onClick={handleCloseNavMenu}>
                          <Typography
                            textAlign="center"
                            sx={{
                              color:
                                (pageSec[i] == "gallery" &&
                                  location.pathname.includes("/gallery/")) ||
                                location.pathname == "/" + pageSec[i]
                                  ? "#fb61ee"
                                  : "#000",
                            }}
                            component="p">
                            {page}
                          </Typography>
                        </MenuItem>
                      ) : pageSec[i] == "birthday" &&
                        birthdaycampain == true ? (
                        <MenuItem
                          component={Link}
                          key={page}
                          to={"/" + pageSec[i]}
                          onClick={handleCloseNavMenu}>
                          <Typography
                            textAlign="center"
                            sx={{
                              color:
                                (pageSec[i] == "gallery" &&
                                  location.pathname.includes("/gallery/")) ||
                                location.pathname == "/" + pageSec[i]
                                  ? "#fb61ee"
                                  : "#000",
                            }}
                            component="p">
                            {page}
                          </Typography>
                        </MenuItem>
                      ) : null
                    )}

                    <Box sx={{ display: { xs: "initial", md: "none" } }}>
                      <Divider
                        sx={{
                          display:
                            window.location.pathname == "/" ? "none" : "block",
                        }}
                        className="border border-secondary mb-3 mt-2"
                      />
                      <TextField
                        select
                        label="Change Language"
                        value={lang}
                        variant="filled"
                        onChange={(e) => setLang(e.target.value)}
                        sx={{
                          width: 180,
                          display:
                            window.location.pathname == "/" ? "none" : "block",
                        }}
                        fullWidth={true}>
                        {langList.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseNavMenu}>
                      {lang == "th" ? "ปิด" : "Close"}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>

              {location.pathname !== "/" &&
                !currentPage.includes("404 Not Found") && (
                  <IconButton
                    data-aos="fade-in"
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    sx={{
                      color: location.pathname == "/" ? "white" : "",
                      position: "fixed",
                      right: 20,
                    }}
                    onClick={handleOpenNavMenu}
                    color="inherit">
                    <MenuIcon />
                  </IconButton>
                )}

              <Box sx={{ right: 30, display: { xs: "none", lg: "flex" } }}>
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
      </Fade>

      {/* PC or Tablet */}
      <Slide
        direction="down"
        in={appbarx}
        sx={{ display: { xs: "none", md: "initial" } }}>
        <AppBar position="fixed" className="newpcAppbar">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  display: { xs: "none", lg: "flex" },
                  mr: 1,
                }}
                alt="kaofrangicon"
                src="https://d2m23ocr3g32v7.cloudfront.net/kf/korfranglogo.webp"
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
                  sx={{ display: { md: "none", lg: "initial" } }}
                  color="inherit">
                  <MenuIcon />
                </IconButton>

                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  sx={{
                    display: { md: "initial", lg: "none" },
                    position: "fixed",
                    right: 20,
                    top: -1,
                  }}
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
                    {pages.map((page, i) =>
                      pageSec[i] != "birthday" ? (
                        <MenuItem
                          component={Link}
                          key={page}
                          to={"/" + pageSec[i]}
                          onClick={handleCloseNavMenu}>
                          <Typography
                            textAlign="center"
                            sx={{
                              color:
                                (pageSec[i] == "gallery" &&
                                  location.pathname.includes("/gallery/")) ||
                                location.pathname == "/" + pageSec[i]
                                  ? "#fb61ee"
                                  : "#000",
                            }}
                            component="p">
                            {page}
                          </Typography>
                        </MenuItem>
                      ) : pageSec[i] == "birthday" &&
                        birthdaycampain == true ? (
                        <MenuItem
                          component={Link}
                          key={page}
                          to={"/" + pageSec[i]}
                          onClick={handleCloseNavMenu}>
                          <Typography
                            textAlign="center"
                            sx={{
                              color:
                                (pageSec[i] == "gallery" &&
                                  location.pathname.includes("/gallery/")) ||
                                location.pathname == "/" + pageSec[i]
                                  ? "#fb61ee"
                                  : "#000",
                            }}
                            component="p">
                            {page}
                          </Typography>
                        </MenuItem>
                      ) : null
                    )}
                    <Box sx={{ display: { xs: "initial", lg: "none" } }}>
                      <Divider
                        sx={{
                          display:
                            window.location.pathname == "/" ? "none" : "block",
                        }}
                        className="border border-secondary mb-3 mt-2"
                      />
                      <TextField
                        select
                        label="Change Language"
                        value={lang}
                        variant="filled"
                        onChange={(e) => setLang(e.target.value)}
                        sx={{
                          width: 180,
                          display:
                            window.location.pathname == "/" ? "none" : "block",
                        }}
                        fullWidth={true}>
                        {langList.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                sx={{
                  width: 70,
                  height: 70,
                  display: { xs: "flex", lg: "none" },
                  ml: 1,
                  mr: 1,
                }}
                alt="kaofrangicon"
                src="https://d2m23ocr3g32v7.cloudfront.net/kf/korfranglogo.webp"
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
                {pages.map((page, i) =>
                  pageSec[i] != "birthday" ? (
                    <Button
                      key={page}
                      component={Link}
                      to={"/" + pageSec[i]}
                      size="medium"
                      onClick={handleCloseNavMenu}
                      sx={{
                        my: 2,
                        color:
                          (pageSec[i] == "gallery" &&
                            location.pathname.includes("/gallery/")) ||
                          location.pathname == "/" + pageSec[i]
                            ? "#fff"
                            : "#000",
                        display: "block",
                      }}>
                      {page}
                    </Button>
                  ) : pageSec[i] == "birthday" && birthdaycampain == true ? (
                    <Button
                      key={page}
                      component={Link}
                      to={"/" + pageSec[i]}
                      size="medium"
                      onClick={handleCloseNavMenu}
                      sx={{
                        my: 2,
                        color:
                          (pageSec[i] == "gallery" &&
                            location.pathname.includes("/gallery/")) ||
                          location.pathname == "/" + pageSec[i]
                            ? "#fff"
                            : "#000",
                        display: "block",
                      }}>
                      {page}
                    </Button>
                  ) : null
                )}
              </Box>

              <Box sx={{ right: 30, display: { xs: "none", lg: "flex" } }}>
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
      <Fade in={transit} timeout={!transit ? 0 : 700}>
        <Box
          sx={{
            marginTop: {
              xs:
                unlock &&
                location.pathname != "/" &&
                !currentPage.includes("404 Not Found")
                  ? 10
                  : 0,
              md: 0,
            },
          }}>
          {unlock ? (
            <BasicSwitch>
              <Route
                exact
                path="/"
                render={() => (
                  <Home
                    data-aos="fade-in"
                    timeready={targetTime}
                    quickmode={betabypass}
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
                path="/gallery/:id"
                render={() => <Gallery />}
              />
              <Route
                data-aos="fade-in"
                path="/gallery"
                render={() => <Album />}
              />
              <Route
                data-aos="fade-in"
                path="/discography"
                render={() => <Disco />}
              />
              <Route
                data-aos="fade-in"
                path="/events"
                render={() => <Event />}
              />
              <Route
                data-aos="fade-in"
                path="/trend"
                render={() => <Trend />}
              />
              <Route
                data-aos="fade-in"
                path="/birthday"
                render={() => <Birth leftmode={false} opacity={opacity} />}
              />
              <Route data-aos="fade-in" path="/feeds" render={() => <Feed />} />
              <Route
                data-aos="fade-in"
                path="/quizgame"
                render={() => <Game />}
              />
              <Route
                data-aos="fade-in"
                path="/quizgameresult/:c"
                render={() => <GameD />}
              />
              <Route
                data-aos="fade-in"
                path="/follow"
                render={() => <Follow />}
              />
              <Route
                data-aos="fade-in"
                path="/donation"
                render={() => <Donate />}
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
                    timeready={targetTime}
                    quickmode={betabypass}
                    setMenu={(v) => setAnchorElNav(v)}
                    setLangMod={() => setAnchorElUser(true)}
                  />
                )}
              />
            </BasicSwitch>
          )}
        </Box>
      </Fade>
      <footer className="fixed-bottom bg-secondary text-center">
        <Card
          className="p-2 foot"
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
      {/* {appbarx && (
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
              src="https://d2m23ocr3g32v7.cloudfront.net/kf/korfranglogo.webp"
            />
          ) : (
            <MenuOpenIcon />
          )}
        </Fab>
      )} */}
    </div>
  );
}

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  currentPage: state.currentPage,
  game: state.game,
  launch: state.launch,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setLaunch: (val) => dispatch(setLaunch(val)),
  setPage: (val) => dispatch(setPage(val)),
  setZone: (val) => dispatch(setZone(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
