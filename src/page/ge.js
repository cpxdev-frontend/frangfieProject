import React from "react";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  LinearProgress,
  CardActions,
  CardHeader,
  Button,
  Grid,
  Avatar,
  Fade,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  DialogActions,
  Fab,
  DialogContent,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  CardMedia,
  Backdrop,
  MenuItem,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Swal from "sweetalert2";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setLaunch,
} from "../redux/action";
import moment from "moment";
import CountUp from "react-countup";
import {
  AddPhotoAlternate,
  BorderColor,
  Save,
  Delete,
  AspectRatio,
  PanTool,
  Edit,
  Done,
  Wallpaper,
} from "@mui/icons-material";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";
import { Resizable } from "re-resizable";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { SketchPicker } from "react-color";
import ReactGA from "react-ga4";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/mainbirth";
import stepTh from "../stepGuide/th/mainbirth";
import { editEn, moveEn, resizeEn } from "../stepGuide/en/birth";
import { edit, move, resize } from "../stepGuide/th/birth";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import PollIcon from "@mui/icons-material/Poll";
import LiveTvIcon from "@mui/icons-material/LiveTv";

const Ge = ({
  currentPage,
  lang,
  setLang,
  setLaunch,
  setPage,
  launch,
  leftmode,
  opacity,
  guide,
}) => {
  const [headedit, setHeadedit] = React.useState(false);
  const [header, setHead] = React.useState("Kaofrang Birthday");
  const [bg, setBg] = React.useState("#fff");
  const [bgd, setChangebg] = React.useState(false);
  const [h, setH] = React.useState(window.innerHeight);
  const [sizes, setSizescreennotmatch] = React.useState(
    window.innerWidth < 900
  );
  const [sizezoom, setSizeZoom] = React.useState(0);
  const [headercolor, setHeadcolor] = React.useState("#000");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const editor = Boolean(anchorEl);

  const [up, setUp] = React.useState(false);
  const cardsuccess = React.useRef(null);
  const [editmode, setEditmode] = React.useState("");
  const [text, setAddText] = React.useState([]);

  const [editmodeimg, setEditmodeImg] = React.useState("");
  const [img, setAddImg] = React.useState([]);

  const [t, setTutor] = React.useState(false);
  const [selectedcountry, setCountry] = React.useState("");
  const [load, setLoad] = React.useState(false);
  const [timeline, setCurrentTimeline] = React.useState(0);

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (text.length == 0 && img.length == 0) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [text, img]);

  const RefreshDate = () => {
    fetch(process.env.REACT_APP_APIE_2 + "/kfsite/birthdayStatus?ok=kf", {
      method: "post",
    })
      .then((response) => response.json())
      .then((result) => {
        setUp(result.response);
        // setUp(true);
      })
      .catch((error) => console.log("error", error));

    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => setCountry(data.country));
  };

  const [open, setOpen] = React.useState(false);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    RefreshDate();
    window.addEventListener(
      "resize",
      function (event) {
        setSizescreennotmatch(window.innerWidth < 900);
        setH(window.innerHeight);
        if (window.innerWidth < 1056) {
          setSizeZoom(
            cardsuccess.current != null
              ? cardsuccess.current.clientWidth / window.innerWidth
              : 0
          );
        } else {
          setSizeZoom(0);
        }
      },
      true
    );
    setPage(
      lang == "th"
        ? "กิจกรรมการเลือกตั้งเซมบัดซึทั่วไปของ BNK48 และ CGM48 ครั้งที่ 5"
        : "BNK48 & CGM48 Senbatsu General Election 2025"
    );
  }, []);

  const addTxt = () => {
    const API = uuidv4();
    setAddText([
      ...text,
      {
        id: API,
        txt: "",
        color: "#000",
        w: 270,
        h: "100%",
      },
    ]);
    setEditmode(API);
  };

  const Updateh = (e, id) => {
    let updatedList = text.map((item) => {
      if (item.id == id) {
        return { ...item, txt: e.target.value }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item
    });

    setAddText(updatedList);
  };

  const UpdateColorBody = (color, id) => {
    let updatedList = text.map((item) => {
      if (item.id == id) {
        return { ...item, color: color.hex }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item
    });

    setAddText(updatedList);
  };

  const resizeModeImg = (w, h, id) => {
    let updatedList = img.map((item) => {
      if (item.id == id) {
        return { ...item, w: w, h: h }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item
    });

    setAddImg(updatedList);
  };

  const addImg = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/webp, image/jpg, image/jpeg";
    input.style.display = "none";

    document.body.appendChild(input);

    input.click();

    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64String = event.target.result;
        setAddImg([
          ...img,
          {
            id: uuidv4(),
            w: 270,
            h: "100%",
            src: base64String,
          },
        ]);
      };

      reader.readAsDataURL(file);
    });
  };

  const Export = async () => {
    if (cardsuccess.current === null) {
      return;
    }

    setLoad(true);
    ReactGA.event({
      category: "User",
      action: "Use birthday content",
    });
    setTimeout(() => {
      toPng(cardsuccess.current, {
        preferredFontFormat:
          "QGZvbnQtZmFjZXtuYW1lOidtaXNhbnMnO3NyYzp1cmwoJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC9jcHgyMDE3L21pc2Fuc2ZvbnRAbWFpbi9lbi9NaVNhbnMtTm9ybWFsLndvZmYyJykgZm9ybWF0KCd3b2ZmMicpLHVybCgnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL2NweDIwMTcvbWlzYW5zZm9udEBtYWluL2VuL01pU2Fucy1Ob3JtYWwud29mZicpIGZvcm1hdCgnd29mZicpO2ZvbnQtd2VpZ2h0OjUwMDtmb250LXN0eWxlOm5vcm1hbDtmb250LWRpc3BsYXk6c3dhcH0=",
      })
        .then((dataUrl) => {
          Swal.fire({
            title: "Do you want to export Card to file",
            imageUrl: dataUrl,
            imageWidth: 600,
            showDenyButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Cancel`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              const link = document.createElement("a");
              link.download = "Your KorKaofrang Birthday Card.jpg";
              link.href = dataUrl;
              link.click();
            }
          });
          setLoad(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
  };

  const switchimg = (v) => {
    if (editmodeimg != "") {
      setEditmodeImg("");
    } else {
      setEditmodeImg(v);
    }
  };

  const RenderHTML = (html) => (
    <div dangerouslySetInnerHTML={{ __html: html }}></div>
  );

  const getsessionactive = (v) => {
    switch (v) {
      case 0: {
        if (
          moment() > moment.unix(1733590800) &&
          moment() <= moment.unix(1734281999)
        ) {
          return true;
        }
        return false;
      }
      case 1: {
        if (
          moment() > moment.unix(1739250000) &&
          moment() <= moment.unix(1743094799)
        ) {
          return true;
        }
        return false;
      }
      case 2: {
        if (
          moment() > moment.unix(1739358000) &&
          moment() <= moment.unix(1739365200)
        ) {
          return true;
        }
        return false;
      }
      case 3: {
        if (
          moment() > moment.unix(1743224400) &&
          moment() <= moment.unix(1743253200)
        ) {
          return true;
        }
        return false;
      }
    }
  };
  const getsessioncomplete = (v) => {
    switch (v) {
      case 0: {
        if (moment() > moment.unix(1734281999)) {
          return true;
        }
        return false;
      }
      case 1: {
        if (moment() > moment.unix(1743094799)) {
          return true;
        }
        return false;
      }
      case 2: {
        if (moment() > moment.unix(1739365200)) {
          return true;
        }
        return false;
      }
      case 3: {
        if (moment() > moment.unix(1743253200)) {
          return true;
        }
        return false;
      }
    }
  };

  const steps = [
    "Candidate Acceptance Period",
    "Voting Period",
    "Final Announcement",
  ];

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader
          title={<h3>BNK48 & CGM48 Senbatsu General Election 2025</h3>}
        />

        <Box className="m-3">
          <CardHeader title="Event TimeLine" />
          <Stepper
            orientation={window.innerWidth > 900 ? "landscape" : "vertical"}>
            <Step
              active={getsessionactive(0)}
              completed={getsessioncomplete(0)}>
              <StepLabel
                StepIconComponent={ScheduleIcon}
                sx={{ backgroundColor: timeline > 0 ? "#58eb34" : "" }}>
                <h6>
                  {lang == "th"
                    ? "เปิดลงทะเบียนการเข้าร่วมกิจกรรม (สำหรับเมมเบอร์ BNK48 และ CGM48)"
                    : "Candidate Acceptance Period (For BNK48 and CGM48 members session)"}
                </h6>
              </StepLabel>
              <StepContent>
                {lang == "th"
                  ? "วันที่ 8 - 15 ธันวาคม 2567"
                  : "December 8-15, 2024"}
              </StepContent>
            </Step>
            <Step
              active={getsessionactive(1)}
              completed={getsessioncomplete(1)}>
              <StepLabel
                StepIconComponent={HowToVoteIcon}
                sx={{ backgroundColor: timeline > 1 ? "#58eb34" : "" }}>
                <h6>{lang == "th" ? "เปิดการโหวต" : "Voting Period"}</h6>
              </StepLabel>
              <StepContent>
                {lang == "th"
                  ? "วันที่ 11 กุมภาพันธ์ - 27 มีนาคม 2568"
                  : "Feburary 11 - March 27, 2025"}
              </StepContent>
            </Step>
            <Step
              active={getsessionactive(2)}
              completed={getsessioncomplete(2)}>
              <StepLabel
                StepIconComponent={PollIcon}
                sx={{ backgroundColor: timeline > 2 ? "#58eb34" : "" }}>
                <h6>
                  {lang == "th"
                    ? "ประกาศผลด่วน 24 ชั่วโมงแรก"
                    : "The Preliminary Announcement"}
                </h6>
              </StepLabel>
              <StepContent>
                {lang == "th"
                  ? "วันที่ 12 กุมภาพันธ์ 2568"
                  : "February 12, 2025"}
              </StepContent>
            </Step>
            <Step
              active={getsessionactive(3)}
              completed={getsessioncomplete(3)}>
              <StepLabel
                StepIconComponent={LiveTvIcon}
                sx={{ backgroundColor: timeline > 3 ? "#58eb34" : "" }}>
                <h6>
                  {lang == "th"
                    ? "ประกาศผลอย่างเป็นทางการ"
                    : "Final Announcement"}
                </h6>
              </StepLabel>
              <StepContent>
                {lang == "th" ? "วันที่ 29 มีนาคม 2568" : "March 29, 2025"}
              </StepContent>
            </Step>
          </Stepper>
        </Box>

        <Box className="container mt-5" sx={{ flexGrow: 1 }}>
          <Grid container spacing={5}>
            <Grid item lg={3} md={6} xs={12} className="text-center">
              <Box
                className="p-3"
                sx={{
                  borderRadius: 5,
                  background:
                    "linear-gradient(180deg, rgba(203,150,194,1) 0%, rgba(73,197,168,1) 100%)",
                }}>
                <p>General Election Candidated Members</p>
                <h1>
                  <CountUp end={48} onEnd={() => {}} duration={5} />
                </h1>
              </Box>
            </Grid>
            <Grid item lg={3} md={6} xs={12} className="text-center">
              <Box
                className="p-3"
                sx={{
                  borderRadius: 5,
                  backgroundColor: "#cb96c2",
                }}>
                <p>BNK48 Candidated Members</p>
                <h1>
                  <CountUp end={30} onEnd={() => {}} duration={5} />
                </h1>
              </Box>
            </Grid>
            <Grid item lg={3} md={6} xs={12} className="text-center">
              <Box
                className="p-3"
                sx={{
                  borderRadius: 5,
                  backgroundColor: "#49c5a8",
                }}>
                <p>CGM48 Candidated Members</p>
                <h1>
                  <CountUp end={18} onEnd={() => {}} duration={5} />
                </h1>
              </Box>
            </Grid>
            <Grid item lg={3} md={6} xs={12} className="text-center">
              <Box
                className="p-3"
                sx={{
                  borderRadius: 5,
                  backgroundColor: "#404040",
                  color: "#fff",
                }}>
                <p>Song Selected by Candidated members</p>
                <h1>
                  <CountUp end={70} onEnd={() => {}} duration={5} />
                </h1>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className="mt-5">
          <CardHeader title="Begining of War" />
          <div className="container" data-aos="fade-right">
            <Card>
              <CardMedia
                sx={{ height: "50vh", width: "100%" }}
                image="https://pbs.twimg.com/media/Ge0Am9Vb0AE5pVe?format=jpg&name=large"
                title="kfge5begin"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {lang == "th"
                    ? "ข้าวฟ่าง–ญาณิศา เมืองคำ (BNK48 Team NV) ได้ลงสมัคร BNK48 & CGM48 Senbatsu General Election 2025 เมื่อวันที่ 15 ธันวาคม 2024 เวลา 00:25 (ตามเวลาประเทศไทย)"
                    : "Kaofrang Yanisa or Kaofrang BNK48 has applied for joining BNK48 & CGM48 Senbatsu General Election 2025 in December 15, 2024 about 0:50 AM. (Based on Asia/Bangkok Timezone)"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/bnk48official/posts/pfbid0JXgFZzmA6CLm9wx9cucESrgSZYk1qv8Yw1ZsoPe4EmkxuQJyL4FPLv8XfzoLmGqMl",
                      "_blank"
                    )
                  }>
                  {lang == "th" ? "ไปยังลิงก์" : "Go to external link"}
                </Button>
              </CardActions>
            </Card>
          </div>
        </Box>

        <Box className="mt-5">
          <CardHeader
            title="The Songs List of Single (BNK48 19th Single)"
            subheader={
              lang == "th"
                ? "เพลงที่ข้าวฟ่างเลือกเป็นเซ็นเตอร์"
                : "Song list for Center position of Kaofrang"
            }
          />
          <div className="container">
            <Card data-aos="fade-right">
              <CardMedia
                sx={{ height: "50vh", width: "100%" }}
                src="https://youtube.com/embed/CGXwRIcnrJo"
                component="iframe"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {lang == "th"
                    ? "เพลงหลัก (อันดับที่ 1) - Saikou ka yo | HKT48"
                    : "Main song (1st Position) - Saikou ka yo | HKT48"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    window.open(
                      "https://youtube.com/watch?v=CGXwRIcnrJo",
                      "_blank"
                    )
                  }>
                  {lang == "th"
                    ? "รับชมมิวสิควีดีโอต้นฉบับ"
                    : "Watching original Music Video"}
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://open.spotify.com/track/6wgJfy5bVOhEiKz08YaV64",
                      "_blank"
                    )
                  }>
                  {lang == "th" ? "รับฟังบน Spotify" : "Listen it on Spotify!"}
                </Button>
              </CardActions>
            </Card>
            <Card className="mt-3" data-aos="fade-right">
              <CardMedia
                sx={{ height: "50vh", width: "100%" }}
                src="https://youtube.com/embed/0pKfxbCHLoU"
                component="iframe"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {lang == "th"
                    ? "เพลงรอง (อันดับที่ 13) - Sustainable | AKB48"
                    : "Couple song (13th Position) - Sustainable | AKB48"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    window.open(
                      "https://youtube.com/watch?v=0pKfxbCHLoU",
                      "_blank"
                    )
                  }>
                  {lang == "th"
                    ? "รับชมมิวสิควีดีโอต้นฉบับ"
                    : "Watching original Music Video"}
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://open.spotify.com/track/1Paki9ZUoGAJCDfykNrHV8",
                      "_blank"
                    )
                  }>
                  {lang == "th" ? "รับฟังบน Spotify" : "Listen it on Spotify!"}
                </Button>
              </CardActions>
            </Card>
            <Card className="mt-3" data-aos="fade-right">
              <CardMedia
                sx={{ height: "50vh", width: "100%" }}
                src="https://youtube.com/embed/tBFJFAP3GKU"
                component="iframe"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {lang == "th"
                    ? "เพลงรอง (อันดับที่ 25) - Idol Nanka Janakattara | AKB48"
                    : "Couple song (25th Position) - Idol Nanka Janakattara | AKB48"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    window.open(
                      "https://youtube.com/watch?v=tBFJFAP3GKU",
                      "_blank"
                    )
                  }>
                  {lang == "th"
                    ? "รับชมมิวสิควีดีโอต้นฉบับ"
                    : "Watching original Music Video"}
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://open.spotify.com/track/0svM1S2Msb3aIfpf2Cf0YT",
                      "_blank"
                    )
                  }>
                  {lang == "th" ? "รับฟังบน Spotify" : "Listen it on Spotify!"}
                </Button>
              </CardActions>
            </Card>
          </div>
        </Box>

        <Box className="mt-5">
          <CardHeader title="Special Project for Kami 7" />
          <div className="container" data-aos="fade-right">
            <Card>
              <CardMedia
                sx={{ height: "100vh", width: "100%" }}
                image="https://i.scdn.co/image/ab6761610000e5ebcf6dc7909f08fd4c42c59a24"
                title="fhero"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {lang == "th"
                    ? "7 เมมเบอร์ที่ได้รับคะแนนโหวตสูงที่สุด จะมีโอกาสได้ทำโปรเจคพิเศษร่วมกับ F.HERO (กอล์ฟ ฟักกลิ้งฮีโร่ หรือณัฐวุฒิ ศรีหมอก)"
                    : "The 7 members that received the highest votes will have the opportunity to do a special project with F.HERO (Nattawut Srimhok)"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    window.open("https://youtu.be/1cVvscOjruc", "_blank")
                  }>
                  {lang == "th" ? "ไปยังลิงก์" : "Go to external link"}
                </Button>
              </CardActions>
            </Card>
          </div>
        </Box>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}>
          <CircularProgress />
        </Backdrop>
      </Box>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  country: state.country,
  guide: state.guide,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setLaunch: (val) => dispatch(setLaunch(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Ge);
