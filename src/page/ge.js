import React from "react";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  LinearProgress,
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
        ? "กิจกรรมวันเกิดของข้าวฟ่าง"
        : "Birthday Campaign of Kaofrang"
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
          data-tour="birthmain-1"
          title={<h3>BNK48 & CGM48 Senbatsu General Election 2025</h3>}
        />

        <Box className="m-3">
          <Stepper orientation="vertical">
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
