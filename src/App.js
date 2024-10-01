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
  Switch,
  ButtonGroup,
  ToggleButtonGroup,
  CardActions,
  CardContent,
  ToggleButton,
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
  switchTutor,
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
import Account from "./page/account";
import Err from "./page/error";

import { useAuth0 } from "@auth0/auth0-react";

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
  "Follow KorKaofrang",
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
    label: "ENG",
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

const isSupported = () =>
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window;

function App({
  currentPage,
  lang,
  setLang,
  setLaunch,
  setZone,
  launch,
  game,
  guide,
  switchTutor,
}) {
  const [betabypass, setBetaMode] = React.useState(false);
  const {
    loginWithPopup,
    user,
    isAuthenticated,
    getAccessTokenSilently,
    logout,
  } = useAuth0();
  const [transit, setTran] = React.useState(false);
  const [mainten, setOnMaintain] = React.useState(false);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [birthdaycampain, setBirthday] = React.useState(false);
  const [launchredis, setLaunchd] = React.useState(launch);
  const [noti, setNoti] = React.useState(0);
  const [locklang, setLockLang] = React.useState(false);

  const location = useLocation();
  const [opacity, setOpacity] = React.useState(1); // เริ่มต้น opacity เต็ม
  const scrollRef = React.useRef(null); // เก็บ reference ของ element ที่ scroll
  const history = useHistory();

  const targetTime = 1730448000;

  React.useEffect(() => {
    if (noti == 0 && isSupported()) {
      Notification.requestPermission()
        .then((permission) => {
          if (permission == "denied") {
            setNoti(2);
          } else {
            setNoti(1);
          }
        })
        .catch((error) => {
          setNoti(0);
        });
    }
  }, [noti]);

  React.useEffect(() => {
    if (isSupported()) {
      Notification.requestPermission()
        .then((permission) => {
          if (permission == "denied") {
            setNoti(2);
          } else {
            setNoti(1);
          }
        })
        .catch((error) => {
          setNoti(0);
        });
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently();
      console.log("view user", user);
    }
  }, [isAuthenticated]);

  function calculateTimeLeft() {
    const difference = moment.unix(targetTime) - moment.unix(launchredis + adm);
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
    if (moment.unix(targetTime) - moment.unix(launchredis + adm) <= 0) {
      return;
    }
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      if (moment.unix(targetTime) - moment.unix(launchredis + adm) <= 0) {
        clearInterval(interval);
        window.location.reload();
      } else {
        adm += 1;
        setTimeLeft(calculateTimeLeft());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [launchredis]);

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

  const setNotiStatus = () => {
    if (lang == "th") {
      return noti == 2
        ? "ถูกปฏิเสธการเข้าถึง"
        : noti == 1
        ? "เปิดใช้งานแล้ว"
        : "ยังไม่ได้เปิดใช้งาน";
    } else {
      return noti == 2 ? "Blocked" : noti == 1 ? "Ready" : "Disabled";
    }
  };

  const fetchtime = () => {
    fetch("https://cpxdevnode.onrender.com/auth/getunix", {})
      .then((response) => response.json())
      .then((result) => {
        setLaunch(result.unix);
      })
      .catch((error) => console.log("error", error));
  };

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
        document.title = "System Maintenance | KorKaofrang Site";
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
    setLaunchd(moment().unix());
    fetch(process.env.REACT_APP_APIE + "/kfsite/birthdayStatus?ok=kf", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => {
        setBirthday(result.response);
      })
      .catch((error) => console.log("error", error));
    if (localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") !== null) {
      setUnlock(true);
      fetch("https://cpxdevnode.onrender.com/auth/getunix", {})
        .then((response) => response.json())
        .then((result) => {
          setLaunch(result.unix);
          setLaunchd(result.unix);
          setInterval(() => {
            fetchtime();
          }, 5000);
        })
        .catch((error) => console.log("error", error));
      return;
    }
    fetch("https://cpxdevnode.onrender.com/auth/getunix", {})
      .then((response) => response.json())
      .then((result) => {
        setLaunch(result.unix);
        setLaunchd(result.unix);

        if (
          result.unix >= targetTime ||
          (localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") != null &&
            localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") ==
              "56f006fb7a76776e1e08eac264bd491aa1a066a1")
        ) {
          setUnlock(true);
          setInterval(() => {
            fetchtime();
          }, 5000);
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
    setLockLang(true);
    setTimeout(() => {
      setLockLang(false);
    }, 2000);
  }, [lang]);

  React.useEffect(() => {
    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => setZone(data.country));
  }, []);

  React.useEffect(() => {
    document.title = currentPage + " | KorKaofrang Site";
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

  if (launchredis > targetTime - 1209600 && launchredis < targetTime) {
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
                      src="https://d3hhrps04devi8.cloudfront.net/kf/korfranglogo.webp"
                    />
                  )}

                <Dialog
                  open={anchorElNav}
                  onClose={handleCloseNavMenu}
                  maxWidth="xl"
                  sx={{ display: { xs: "initial", xl: "none" } }}>
                  <DialogTitle>
                    {lang == "th" ? "เมนูหลัก" : "Main Menu"}
                  </DialogTitle>
                  <DialogContent sx={{ width: { xs: "100%", sm: 340 } }}>
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
                                (pageSec[i] == "quizgame" &&
                                  location.pathname.includes(
                                    "/quizgameresult/"
                                  )) ||
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
                                (pageSec[i] == "quizgame" &&
                                  location.pathname.includes(
                                    "/quizgameresult/"
                                  )) ||
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
                    <Divider />
                    <Card className="mt-3 mb-3">
                      {isAuthenticated && (
                        <CardContent>
                          <Typography>
                            {lang == "th"
                              ? "ยินดีต้อนรับคุณ "
                              : "Welcome back, "}{" "}
                            {user.given_name != null
                              ? user.given_name
                              : user.name}
                          </Typography>
                        </CardContent>
                      )}
                      {isAuthenticated ? (
                        <CardActions>
                          <Button
                            onClick={() => {
                              history.push("/account");
                              handleCloseNavMenu();
                            }}>
                            View Profile
                          </Button>
                          <Button
                            onClick={() =>
                              logout({
                                logoutParams: {
                                  returnTo: window.location.origin,
                                },
                              })
                            }>
                            Sign-out
                          </Button>
                        </CardActions>
                      ) : (
                        <CardActions>
                          <Button onClick={() => loginWithPopup()}>
                            Become or Log-in to KorKao ID
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                    <Box
                      sx={{
                        display:
                          window.location.pathname == "/"
                            ? { xs: "none", xl: "initial" }
                            : "initial",
                      }}>
                      <Typography>Change Language</Typography>
                      <ToggleButtonGroup
                        color="primary"
                        className="mt-1"
                        value={lang}
                        disabled={locklang}
                        exclusive
                        onChange={(e) =>
                          e.target.value != lang && setLang(e.target.value)
                        }>
                        {langList.map((option) => (
                          <ToggleButton
                            sx={{ borderRadius: 1 }}
                            value={option.value}
                            key={option.value}>
                            {option.label}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                      <br />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={guide}
                            onChange={() => switchTutor()}
                          />
                        }
                        label={
                          lang == "th" ? "คำอธิบายการใช้งาน" : "Tutorial Guide"
                        }
                      />
                      <br />
                      <Typography>
                        {lang == "th"
                          ? "สถานะการแจ้งเตือน: "
                          : "Notification Status: "}{" "}
                        {setNotiStatus()}
                      </Typography>
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
                src="https://d3hhrps04devi8.cloudfront.net/kf/korfranglogo.webp"
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
                <b>KorKaofrang</b>
              </Typography>

              <Box
                className="justify-content-center"
                sx={{ flexGrow: 0, display: { xs: "flex", xl: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  sx={{ display: { md: "none", xl: "initial" } }}
                  color="inherit">
                  <MenuIcon />
                </IconButton>

                <Box sx={{ display: { lg: "initial", xs: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    sx={{
                      position: "fixed",
                      right: 80,
                      top: 10,
                    }}
                    color="inherit">
                    <MenuIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setAnchorElUser(true)}
                    sx={{
                      display: { xs: "none", lg: "initial", xl: "none" },
                      position: "fixed",
                      right: 20,
                      top: 10,
                    }}>
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
                </Box>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  sx={{
                    display: { xs: "initial", lg: "none" },
                    position: "fixed",
                    right: 20,
                    top: -2,
                  }}
                  color="inherit">
                  <MenuIcon />
                </IconButton>
                <IconButton
                  onClick={() => setAnchorElUser(true)}
                  sx={{
                    display: { xs: "none", lg: "none", xl: "initial" },
                    position: "fixed",
                    right: 60,
                    top: 10,
                  }}>
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

                <Dialog
                  open={anchorElNav}
                  onClose={handleCloseNavMenu}
                  maxWidth="xl"
                  sx={{ display: { xs: "none", xl: "initial" } }}>
                  <DialogTitle>
                    {lang == "th" ? "เมนูหลัก" : "Main Menu"}
                  </DialogTitle>
                  <DialogContent sx={{ width: { xs: "100%", sm: 340 } }}>
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
                                (pageSec[i] == "quizgame" &&
                                  location.pathname.includes(
                                    "/quizgameresult/"
                                  )) ||
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
                                (pageSec[i] == "quizgame" &&
                                  location.pathname.includes(
                                    "/quizgameresult/"
                                  )) ||
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
                    <Card className="mt-3">
                      {isAuthenticated && (
                        <CardContent>
                          <Typography>
                            {lang == "th"
                              ? "ยินดีต้อนรับคุณ "
                              : "Welcome back, "}{" "}
                            {user.given_name != null
                              ? user.given_name
                              : user.name}
                          </Typography>
                        </CardContent>
                      )}
                      {isAuthenticated ? (
                        <CardActions>
                          <Button
                            onClick={() => {
                              history.push("/account");
                              handleCloseNavMenu();
                            }}>
                            View Profile
                          </Button>
                          <Button
                            onClick={() =>
                              logout({
                                logoutParams: {
                                  returnTo: window.location.origin,
                                },
                              })
                            }>
                            Sign-out
                          </Button>
                        </CardActions>
                      ) : (
                        <CardActions>
                          <Button onClick={() => loginWithPopup()}>
                            Become or Log-in to KorKao ID
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                    <Box sx={{ display: { xs: "initial", xl: "none" } }}>
                      <Divider
                        sx={{
                          display:
                            window.location.pathname == "/" ? "none" : "block",
                        }}
                        className="border border-secondary mb-3 mt-2"
                      />
                      <Typography>Change Language</Typography>
                      <ToggleButtonGroup
                        color="primary"
                        className="mt-1"
                        value={lang}
                        disabled={locklang}
                        exclusive
                        onChange={(e) =>
                          e.target.value != lang && setLang(e.target.value)
                        }>
                        {langList.map((option) => (
                          <ToggleButton
                            sx={{ borderRadius: 1 }}
                            value={option.value}
                            key={option.value}>
                            {option.label}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>
                    <br />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={guide}
                          onChange={() => switchTutor()}
                        />
                      }
                      label={
                        lang == "th" ? "คำอธิบายการใช้งาน" : "Tutorial Guide"
                      }
                    />
                    <Typography>
                      {lang == "th"
                        ? "สถานะการแจ้งเตือน: "
                        : "Notification Status: "}{" "}
                      {setNotiStatus()}
                    </Typography>
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
                src="https://d3hhrps04devi8.cloudfront.net/kf/korfranglogo.webp"
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
                <b>KorKaofrang</b>
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", xl: "flex" } }}>
                {pages.map((page, i) =>
                  pageSec[i] != "birthday" ? (
                    <Button
                      key={page}
                      component={Link}
                      to={"/" + pageSec[i]}
                      size="medium"
                      className="text-center"
                      onClick={handleCloseNavMenu}
                      sx={{
                        my: 2,
                        color:
                          (pageSec[i] == "quizgame" &&
                            location.pathname.includes("/quizgameresult/")) ||
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
                      className="text-center"
                      onClick={handleCloseNavMenu}
                      sx={{
                        my: 2,
                        color:
                          (pageSec[i] == "quizgame" &&
                            location.pathname.includes("/quizgameresult/")) ||
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
                    sx={{ p: 0, display: { xs: "none", xl: "flex" } }}>
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
                    {lang == "th" ? "การตั้งค่า" : "Setting"}
                  </DialogTitle>
                  <Card
                    className="m-4"
                    sx={{
                      display:
                        location.pathname == "/" || location.pathname == "/404"
                          ? "none"
                          : "initial",
                    }}>
                    {isAuthenticated && (
                      <CardContent>
                        <Typography>
                          {lang == "th" ? "ยินดีต้อนรับคุณ " : "Welcome back, "}{" "}
                          {user.given_name != null
                            ? user.given_name
                            : user.name}
                        </Typography>
                      </CardContent>
                    )}
                    {isAuthenticated ? (
                      <CardActions>
                        <Button
                          onClick={() => {
                            history.push("/account");
                            handleCloseNavMenu();
                          }}>
                          View Profile
                        </Button>
                        <Button
                          onClick={() =>
                            logout({
                              logoutParams: {
                                returnTo: window.location.origin,
                              },
                            })
                          }>
                          Sign-out
                        </Button>
                      </CardActions>
                    ) : (
                      <CardActions>
                        <Button onClick={() => loginWithPopup()}>
                          Become or Log-in to KorKao ID
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                  <DialogContent>
                    <Typography>Change Language</Typography>
                    <ToggleButtonGroup
                      color="primary"
                      className="mt-1"
                      value={lang}
                      disabled={locklang}
                      exclusive
                      onChange={(e) =>
                        e.target.value != lang && setLang(e.target.value)
                      }>
                      {langList.map((option) => (
                        <ToggleButton
                          sx={{ borderRadius: 1 }}
                          value={option.value}
                          key={option.value}>
                          {option.label}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                    <br />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={guide}
                          onChange={() => switchTutor()}
                        />
                      }
                      label={
                        lang == "th" ? "คำอธิบายการใช้งาน" : "Tutorial Guide"
                      }
                    />
                    <br />
                    <Typography>
                      {lang == "th"
                        ? "สถานะการแจ้งเตือน: "
                        : "Notification Status: "}{" "}
                      {setNotiStatus()}
                    </Typography>
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
              {isAuthenticated && (
                <Route
                  data-aos="fade-in"
                  path="/account"
                  render={() => <Account />}
                />
              )}
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
  guide: state.guide,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setLaunch: (val) => dispatch(setLaunch(val)),
  setPage: (val) => dispatch(setPage(val)),
  setZone: (val) => dispatch(setZone(val)),
  switchTutor: (val) => dispatch(switchTutor(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
