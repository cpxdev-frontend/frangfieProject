import React from "react";
import {
  Card,
  CardContent,
  Fade,
  CardHeader,
  Button,
  Zoom,
} from "@mui/material";
import moment from "moment";
import momentTz from "moment-timezone";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";

import Joyride from 'react-joyride';
import stepEn from '../stepGuide/en/home'
import stepTh from '../stepGuide/th/home'

const Home = ({
  currentPage,
  quickmode,
  lang,
  timeready,
  setPage,
  setMenu,
  setLangMod,
  launch,
}) => {
  const history = useHistory();
  const [data, setData] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
    setPage(lang == "th" ? "หน้าหลัก" : "Homepage");
  }, [currentPage]);

  React.useEffect(() => {
    if (launch != null && timeready != null) {
      if (
        launch >= timeready ||
        (localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") != null &&
          localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") ==
            "56f006fb7a76776e1e08eac264bd491aa1a066a1")
      ) {
        setData(true);
      } else {
        setData(false);
      }
    } else {
      setData(false);
    }
  }, [launch, timeready]);

  return (
    <Fade in={open} timeout={300}>
      <div>
      <Joyride steps={lang == 'th' ? stepTh : stepEn} stepIndex={0}/>
        <Fade in={open} timeout={1200}>
          <div className="video-container">
            <div
              className="d-block d-lg-none img"
              style={{
                filter: "brightness(80%)",
                backgroundImage:
                  "url(https://d3hhrps04devi8.cloudfront.net/kf/kaofrang.webp)",
              }}></div>
            <video
              className="d-none d-lg-block vdo overflow-hidden"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              muted
              autoPlay
              style={{
                pointerEvents: "none",
                scrollbarWidth: "none",
                top: "50%",
                left: "50%",
                minWidth: "100%",
                minHeight: "100%",
                width: "auto",
                height: "auto",
                transform: "translate(-50%,-50%)",
              }}
              loop
              playsinline>
              <source
                src="https://d3hhrps04devi8.cloudfront.net/kf/vdo.webm"
                type="video/webm"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </Fade>
        {data ? (
          <Card className="text-container">
            <CardContent className="p-2">
              <CardHeader
                title={
                  <h3
                    style={{
                      color: "#fb61ee",
                      textShadow: "2px 2px 2px #fae6f9",
                    }}>
                    Welcome to KorKaofrang Fansite
                  </h3>
                }
                subheader={
                  <p className="overlaytext">
                    {lang == "th"
                      ? 'เว็บไซต์ที่จะทำให้คุณรู้จัก "น้องข้าวฟ่าง" มากขึ้น มาร่วมโดนตก (หลุมรัก) ข้าวฟ่างไปด้วยกัน'
                      : "This is your space for Kaofrang Yanisa or Kaofrang BNK48 fans. Come to enjoy with us!"}
                  </p>
                }
              />
              <Button
                className="ml-2 home-1"
                variant="contained"
                onClick={() => history.push("/aboutkf")}>
                Get Started
              </Button>
              <Button
                className="ml-2 home-2"
                variant="outlined"
                onClick={() => setMenu(true)}>
                Go to Menu
              </Button>
              <br />
              <Button className="ml-2 mt-3 home-3" onClick={() => setLangMod(true)}>
                Choose Language
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-container">
            <CardContent className="p-2">
              <CardHeader
                title={
                  <h3
                    style={{
                      color: "#fb61ee",
                      textShadow: "2px 2px 2px #fae6f9",
                    }}>
                    Welcome to KorKaofrang Fansite
                  </h3>
                }
                subheader={
                  <p className="overlaytext">
                    {lang == "th"
                      ? 'เว็บไซต์ที่จะทำให้คุณรู้จัก "น้องข้าวฟ่าง" มากขึ้น มาร่วมโดนตก (หลุมรัก) ข้าวฟ่างไปด้วยกัน เร็วๆนี้'
                      : "This is your space for Kaofrang Yanisa or Kaofrang BNK48 fans. Come to enjoy with us soon!"}
                  </p>
                }
              />
              <h5 className="text-center text-md-left text-light ml-0 ml-md-3">
                {lang == "th"
                  ? "พบกันได้ ในวันที่ " +
                    moment.unix(timeready).lang(lang).local().format("D MMMM") +
                    " 2567"
                  : "Let's meet this website soon in " +
                    moment.unix(timeready).lang(lang).local().format("MMMM D") +
                    ", 2024"}
              </h5>
              <p className="text-center text-md-left text-light ml-0 ml-md-3">
                {lang == "th"
                  ? "เวลา " +
                    moment.unix(timeready).lang(lang).local().format("HH:mm") +
                    " เป็นต้นไป" +
                    " ตามโซนเวลา " +
                    momentTz.tz.guess()
                  : "In " +
                    moment.unix(timeready).lang(lang).local().format("h:mm A") +
                    ". Based on " +
                    momentTz.tz.guess() +
                    " timezone."}
              </p>
              <br />
              <Button className="ml-2 mt-1" onClick={() => setLangMod(true)}>
                Choose Language
              </Button>
              <Button
                className="ml-2 mt-1"
                onClick={() => {
                  let person = prompt(
                    "Enter your passkey hash to ready for testing."
                  );
                  if (
                    person != null &&
                    person === "1967fe1d511c1de55dc3379b515df6f2"
                  ) {
                    localStorage.setItem(
                      "1967fe1d511c1de55dc3379b515df6f2",
                      "56f006fb7a76776e1e08eac264bd491aa1a066a1"
                    );
                    window.location.reload();
                  }
                }}>
                Developer mode
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
