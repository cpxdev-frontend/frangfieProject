import React from "react";
import {
  Card,
  CardContent,
  Fade,
  CardHeader,
  Button,
  Zoom,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";

const Home = ({
  currentPage,
  quickmode,
  lang,
  setLang,
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
  }, [currentPage]);

  React.useEffect(() => {
    setPage(lang == "th" ? "หน้าหลัก" : "Homepage");
    if (quickmode) {
      setData(true);
    } else {
      if (
        launch >= 1731603600 ||
        (localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") != null &&
          localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") ==
            "56f006fb7a76776e1e08eac264bd491aa1a066a1")
      ) {
        setData(true);
      } else {
        setData(false);
      }
    }
  }, [quickmode, currentPage]);

  return (
    <Fade in={open} timeout={300}>
      <div>
        <Fade in={open} timeout={1200}>
          <div className="video-container">
            <div
              className="d-block d-lg-none img"
              style={{
                filter: "brightness(80%)",
                backgroundImage:
                  "url(https://ucjgycqgnxeuujucorsm.supabase.co/storage/v1/object/public/kfsite/kaofrang.webp)",
              }}></div>
            <video
              className="d-none d-lg-block vdo overflow-hidden"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              muted
              autoPlay
              style={{ pointerEvents: "none", scrollbarWidth: "none" }}
              loop
              playsinline>
              <source
                src="https://ucjgycqgnxeuujucorsm.supabase.co/storage/v1/object/public/kfsite/vdo.webm"
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
                    Welcome to KaofrangFie Fansite
                  </h3>
                }
                subheader={
                  <p className="overlaytext">
                    {lang == "th"
                      ? 'เว็บไซต์ที่จะทำให้คุณรู้จัก "น้องข้าวฟ่าง" มากขึ้น มาร่วมโดนตก (หลุมรัก) ข้าวฟ่างไปด้วยกัน'
                      : "This is your space for Kaofrang Yanisa or Kaofrang BNK48 fans. Let's come to enjoy with us!"}
                  </p>
                }
              />
              <Button
                className="ml-2"
                variant="contained"
                onClick={() => history.push("/aboutkf")}>
                Get Started
              </Button>
              <Button
                className="ml-2"
                variant="outlined"
                onClick={() => setMenu(true)}>
                Go to Menu
              </Button>
              <br />
              <Button className="ml-2 mt-3" onClick={() => setLangMod(true)}>
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
                    Welcome to KaofrangFie Fansite
                  </h3>
                }
                subheader={
                  <p className="overlaytext">
                    {lang == "th"
                      ? 'เว็บไซต์ที่จะทำให้คุณรู้จัก "น้องข้าวฟ่าง" มากขึ้น มาร่วมโดนตก (หลุมรัก) ข้าวฟ่างไปด้วยกัน'
                      : "This is your space for Kaofrang Yanisa or Kaofrang BNK48 fans. Let's come to enjoy with us!"}
                  </p>
                }
              />
              {launch < 1724457600 ? (
                <h5 className="text-center text-md-left text-light ml-0 ml-md-3">
                  {lang == "th"
                    ? "สัมผัสประสบการณ์เว็บได้ก่อนใคร ในวันที่ 24-25 สิงหาคม 2567 นี้ (เป็นการทดสอบระบบก่อนเปิดใช้งานจริง)"
                    : "Let's meet this website experience as the first group of the world soon in August 24-25, 2024 (Public Beta testing)"}
                </h5>
              ) : (
                <h5 className="text-center text-md-left text-light ml-0 ml-md-3">
                  {lang == "th"
                    ? "พบกันได้ ในวันที่ 15 พฤศจิกายน 2567 เป็นต้นไป"
                    : "Let's meet this website soon in November 15, 2024"}
                </h5>
              )}
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
