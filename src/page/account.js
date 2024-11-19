import React from "react";
import { connect } from "react-redux";
import {
  Card,
  CardContent,
  LinearProgress,
  CardHeader,
  Button,
  CardMedia,
  Avatar,
  Box,
  Divider,
  Fade,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  CardActions,
  Backdrop,
  DialogActions,
  CardActionArea,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TableContainer,
  TableBody,
  Paper,
  Table,
  TableRow,
  TableHead,
  TableCell,
  styled,
} from "@mui/material";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setLaunch,
} from "../redux/action";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/Key";
import StarsIcon from "@mui/icons-material/Stars";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import QrScanner from "qr-scanner";
import moment from "moment";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import {
  faGoogle,
  faMicrosoft,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth0 } from "@auth0/auth0-react";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/gallery";
import stepTh from "../stepGuide/th/gallery";

import { Scanner } from "@yudiel/react-qr-scanner";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function reader(file, callback) {
  const fr = new FileReader();
  fr.onload = () => callback(null, fr.result);
  fr.onerror = (err) => callback(err);
  fr.readAsDataURL(file);
}

const Acct = ({
  currentPage,
  lang,
  setLang,
  setLaunch,
  setPage,
  launch,
  guide,
}) => {
  const [data, setData] = React.useState(null);
  const [event, setEventDetail] = React.useState(null);
  const [getData, setGetData] = React.useState(false);
  const [getData2, setGetData2] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const [load, setLoad] = React.useState(false);
  const [point, setPoint] = React.useState(null);
  const [viewPoint, setPointView] = React.useState(false);
  const [pointHis, setHis] = React.useState(null);

  const [edonate, setEdonate] = React.useState(false);
  const [slipFile, setFile] = React.useState(null);
  const [base, setBase] = React.useState(null);

  const {
    loginWithPopup,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  const setCheckevent = (code) => {
    if (load == true) {
      return;
    }
    setLoad(true);
    setGetData(false);

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        encId: code,
        userId: user.email,
        provider: user.sub,
      }),
    };

    fetch(
      (Math.floor(Math.random() * 10) + 1 < 5
        ? process.env.REACT_APP_APIE_1
        : process.env.REACT_APP_APIE_2) + "/kfsite/checkevent",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLoad(false);
        if (result.status) {
          setEventDetail(result);
          setGetData2(code);
        } else {
          switch (result.error) {
            case 1: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "กิจกรรมนี้ยังไม่ถึงเวลาให้ลงทะเบียน"
                    : "This event is not yet to ready to join.",
                icon: "warning",
              });
              break;
            }
            case 2: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "กิจกรรมนี้สิ้นสุดการเข้าร่วมแล้ว"
                    : "This event is already done.",
                icon: "warning",
              });
              break;
            }
            case 3: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "ไม่พบกิจกรรมนี้ในระบบ"
                    : "This event is not found.",
                icon: "warning",
              });
              break;
            }
            case 4: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "คุณเคยเข้าร่วมกิจกรรมนี้แล้ว"
                    : "You are already joined this event.",
                icon: "warning",
              });
              break;
            }
            case 5: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "กรุณาสะสมคะแนนเพื่อเข้าร่วมกิจกรรมนี้"
                    : "Please earn more point to join events",
                icon: "warning",
              });
              break;
            }
            case 6: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "คะแนนสะสมของคุณไม่เพียงพอในการเข้าร่วมกิจกรรมนี้"
                    : "Your KorKao Points is not enough to join this event.",
                icon: "warning",
                footer:
                  lang == "th"
                    ? "หมายเหตุ: คุณต้องใช้ " +
                      result.point +
                      " คะแนนเพื่อเข้าร่วม"
                    : "Notes: You need to use " +
                      result.point +
                      " KorKao Points to join.",
              });
              break;
            }
            default: {
              Swal.fire({
                title: result.message,
                icon: "error",
              });
              break;
            }
          }
        }
      })
      .catch((error) => console.log("error", error));
    console.log(code);
  };

  const joinevent = () => {
    setLoad(true);
    const eventId = getData2;
    setGetData2(null);
    setEventDetail(null);

    var requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        encId: eventId,
        userId: user.email,
        userName: user.given_name != null ? user.given_name : user.name,
        provider: user.sub,
        notiId: atob(localStorage.getItem("osigIdPush")),
      }),
    };

    fetch(
      (Math.floor(Math.random() * 10) + 1 < 5
        ? process.env.REACT_APP_APIE_1
        : process.env.REACT_APP_APIE_2) + "/kfsite/joinevent",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLoad(false);
        if (result.status) {
          Swal.fire({
            title:
              lang == "th"
                ? "คุณเข้าร่วมกิจกรรมเรียบร้อยแล้ว"
                : "You are joining this event now! Please enjoy our activities.",
            icon: "success",
            footer:
              lang == "th"
                ? "รหัสอ้างอิงของคุณคือ " +
                  result.refCode +
                  " กรุณาเก็บไว้เพื่ออ้างอิงในการยืนยันสิทธิ์"
                : "Your reference code is " +
                  result.refCode +
                  ". Please keep it to confirm your joined event rights.",
          });
          fetchpoint();
        } else {
          switch (result.error) {
            case 1: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "กิจกรรมนี้ยังไม่ถึงเวลาให้ลงทะเบียน"
                    : "This event is not yet to ready to join.",
                icon: "warning",
              });
              break;
            }
            case 2: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "กิจกรรมนี้สิ้นสุดการเข้าร่วมแล้ว"
                    : "This event is already done.",
                icon: "warning",
              });
              break;
            }
            case 3: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "ไม่พบกิจกรรมนี้ในระบบ"
                    : "This event is not found.",
                icon: "warning",
              });
              break;
            }
            case 4: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "คุณเคยเข้าร่วมกิจกรรมนี้แล้ว"
                    : "You are already joined this event.",
                icon: "warning",
              });
              break;
            }
            case 5: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "กรุณาสะสมคะแนนเพื่อเข้าร่วมกิจกรรมนี้"
                    : "Please earn more point to join events",
                icon: "warning",
              });
              break;
            }
            case 6: {
              Swal.fire({
                title:
                  lang == "th"
                    ? "คะแนนสะสมของคุณไม่เพียงพอในการเข้าร่วมกิจกรรมนี้"
                    : "Your KorKao Points is not enough to join this event.",
                icon: "warning",
                footer:
                  lang == "th"
                    ? "หมายเหตุ: คุณต้องใช้ " +
                      result.point +
                      " คะแนนเพื่อเข้าร่วม"
                    : "Notes: You need to use " +
                      result.point +
                      " KorKao Points to join.",
              });
              break;
            }
            default: {
              Swal.fire({
                title: result.message,
                icon: "error",
              });
              break;
            }
          }
        }
      })
      .catch((error) => console.log("error", error));
  };

  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  const fetchpoint = () => {
    if (isAuthenticated) {
      setData(user);
      var requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.email,
          notiId: atob(localStorage.getItem("osigIdPush")),
        }),
      };

      setPoint(null);
      fetch(process.env.REACT_APP_APIE_2 + "/kfsite/getPoint", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setPoint(result.point);
          }
        })
        .catch((error) => console.log("error", error));
      fetch(
        process.env.REACT_APP_APIE + "/kfsite/getPointTransaction",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setHis(result.points);
          }
        })
        .catch((error) => console.log("error", error));
    } else {
      setHis(null);
    }
  };

  React.useEffect(() => {
    if (edonate == false) {
      setFile(null);
      setBase(null);
    }
  }, [edonate]);

  React.useEffect(() => {
    setPage("KorKao ID");
    fetchpoint();
    if (!isLoading && isAuthenticated) {
      var url = new URL(window.location.href);
      var c = url.searchParams.get("action");
      if (c != null && c == "korkaoslip") {
        setEdonate(true);
      }
      const params = new URLSearchParams(url.search);
      params.delete("action");
      params.toString() === ""
        ? (url.search = "")
        : (url.search = "?" + params.toString());
      window.history.replaceState({}, "", url.toString());
    }
  }, [isAuthenticated]);

  const QRDonate = () => {
    var requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.email,
        provider: user.sub,
        qrRef: slipFile,
        notiId: atob(localStorage.getItem("osigIdPush")),
      }),
    };
    setEdonate(false);
    setLoad(true);
    fetch(
      (Math.floor(Math.random() * 10) + 1 < 5
        ? process.env.REACT_APP_APIE_1
        : process.env.REACT_APP_APIE_2) + "/kfsite/exchangedonation",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLoad(false);
        if (result.status) {
          Swal.fire({
            title:
              "คุณได้รับคะแนนเพิ่มแล้ว ขอบคุณสำหรับการสนับสนุนน้องข้าวฟ่าง",
            message: "KorKao Points ที่ได้รับ " + result.earned + " คะแนน",
            icon: "success",
          });
          fetchpoint();
        } else {
          Swal.fire({
            title: result.message,
            icon: "warning",
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  if (isLoading) {
    return (
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <div className="container mt-3">
          <Card>
            <CardContent>
              <Skeleton
                variant="text"
                className="bg-m"
                sx={{ fontSize: "2rem" }}
              />
              <Skeleton
                variant="text"
                className="bg-m"
                sx={{ fontSize: "1rem" }}
              />
              <Skeleton
                variant="text"
                className="bg-m"
                sx={{ fontSize: "1rem" }}
              />
              <Skeleton
                variant="text"
                className="bg-m"
                sx={{ fontSize: "1rem" }}
              />
              <Skeleton
                variant="text"
                className="bg-m"
                sx={{ fontSize: "1rem" }}
              />
              <Skeleton
                variant="text"
                className="bg-m"
                sx={{ fontSize: "1rem" }}
              />
            </CardContent>
          </Card>
        </div>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Fade in={open} timeout={300}>
        <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
          <CardHeader
            title={<h3>Benefit of KorKao ID</h3>}
            subheader={
              lang == "th"
                ? "สิทธิประโยชน์ของ KorKao ID"
                : "All you should know about KorKao ID"
            }
            action={
              <Button variant="outlined" onClick={() => loginWithPopup()}>
                <KeyIcon />
                &nbsp;{lang == "th" ? "เข้าสู่ระบบ" : "Login now!"}
              </Button>
            }
          />
          <div className="container mt-3">
            <Card sx={{ marginTop: 5, width: "100%" }}>
              <CardContent>
                <CardHeader
                  title={
                    lang == "th" ? "KorKao ID คืออะไร" : "What is KorKao ID"
                  }
                />
                <Typography>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {lang == "th"
                    ? "KorKao ID เป็นระบบสมาชิกสำหรับแฟนด้อมของข้าวฟ่างที่จะยกระดับการเข้าร่วมกิจกรรมให้มีความพิเศษมากยิ่งขึ้น รวมทั้งการเข้าถึงฟีเจอร์พิเศษที่ทางผู้พัฒนาและบ้านกอฟ่างได้ร่วมมือกันสำหรับสมาชิกเท่านั้น"
                    : "KorKao ID is membership system for Kaofrang Yanisa or Kaofrang BNK48's fanclub to enhance participation in activities to make it special for them. Including access to special features that the developer and Kaofrang BNK48 Thailand Fanclub have collaborated on exclusively for membership."}
                </Typography>
                <List
                  className="mt-5"
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                  }}>
                  <ListItem className="mb-5">
                    <ListItemAvatar>
                      <Avatar className="iconchoice">
                        <CardMembershipIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        lang == "th"
                          ? "ผู้ใช้งานแบบไหนสามารถเข้าใช้งาน KorKao ID"
                          : "Who can use KorKao ID?"
                      }
                      secondary={
                        lang == "th"
                          ? "คุณสามารถเข้าใช้งาน KorKao ID ได้โดยไม่มีข้อจำกัดเรื่องเพศหรืออายุใดๆ อย่างไรก็ตามเราขอแนะนำให้เป็นผู้ที่มีอายุเกิน 15 ปีเป็นต้นไป เนื่องจากอาจมีกิจกรรมที่จะต้องลุ้นรางวัลด้วย หากคุณอายุต่ำกว่านั้นอาจต้องได้รับความยินยอมจากผู้ปกครองของคุณด้วย"
                          : "You can access KorKao ID without any restrictions regarding gender or age. However, we recommend that users be 15 years old and above, as there may be activities that involve prize draws. If you are younger than that, you may need to obtain consent from your parent."
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="iconchoice">
                        <MilitaryTechIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        lang == "th"
                          ? "สิทธิประโยชน์ของ KorKao ID ที่จะได้รับมีอะไรบ้าง"
                          : "How are the KorKao ID benefits?"
                      }
                    />
                  </ListItem>
                  <TableContainer component={Paper} className="mb-5">
                    <Table sx={{ minWidth: 650 }}>
                      <caption>
                        *{" "}
                        {lang == "th"
                          ? "กรณีถ้ามีสุ่มจับฉลากลุ้นรางวัล ผู้ใช้งานทั่วไปจะไม่ได้รับสิทธิประโยชน์ตรงนี้"
                          : "For drawing prize events are excepted with generally users."}
                      </caption>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            {lang == "th"
                              ? "ฟีเจอร์ไฮไลท์ในเว็บไซต์นี้"
                              : "Highlight features of KorKao FanSite"}
                          </TableCell>
                          <TableCell align="right">
                            {lang == "th"
                              ? "ผู้ใช้งานทั่วไป"
                              : "Generally Users"}
                          </TableCell>
                          <TableCell align="right">
                            KorKao ID Membership
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}>
                          <TableCell component="th" scope="row">
                            {lang == "th"
                              ? "ดูโปรไฟล์ของน้องหรือ เพลงและคอนเทนต์ต่างๆของน้องข้าวฟ่าง"
                              : "Visit all basic of Kaofrang's profile, discography and special contents."}
                          </TableCell>
                          <TableCell align="right">
                            <CheckCircleOutlineIcon />
                          </TableCell>
                          <TableCell align="right">
                            <CheckCircleOutlineIcon />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}>
                          <TableCell component="th" scope="row">
                            {lang == "th"
                              ? "ดูกิจกรรมของข้าวฟ่างและเปิดการแจ้งเตือนกิจกรรมแบบเรียลไทม์"
                              : "View Kaofrang's events and activities. And also enable push notification."}
                          </TableCell>
                          <TableCell align="right">
                            <CheckCircleOutlineIcon />
                          </TableCell>
                          <TableCell align="right">
                            <CheckCircleOutlineIcon />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}>
                          <TableCell component="th" scope="row">
                            {lang == "th"
                              ? "เล่นมินิเกมส์พร้อมกับดูคะแนนเฉลี่ยจากผู้เล่นทั่วโลก"
                              : "Play KorKao's Quiz Game and see average scores from around the world."}
                          </TableCell>
                          <TableCell align="right">
                            <CheckCircleOutlineIcon />
                          </TableCell>
                          <TableCell align="right">
                            <CheckCircleOutlineIcon />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}>
                          <TableCell component="th" scope="row">
                            {lang == "th"
                              ? "การเข้าร่วมกิจกรรมที่จัดขึ้นโดยบ้านกอข้าว"
                              : "Join special event of KorKao team."}
                          </TableCell>
                          <TableCell align="right">
                            * <CheckCircleOutlineIcon />
                          </TableCell>
                          <TableCell align="right">
                            <CheckCircleOutlineIcon />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}>
                          <TableCell component="th" scope="row">
                            {lang == "th"
                              ? "ดูคะแนนและประวัติการเล่นมินิเกมส์ของคุณได้สูงสุด 1 ปี"
                              : "View your score and game histories up to one year."}
                          </TableCell>
                          <TableCell align="right">
                            <DoNotDisturbOnIcon />
                          </TableCell>
                          <TableCell align="right">
                            <CheckCircleOutlineIcon />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}>
                          <TableCell component="th" scope="row">
                            {lang == "th"
                              ? "การสะสมคะแนนเพื่อลุ้นของรางวัล หรือการเข้าร่วมกิจกรรมที่ต้องใช้คะแนน (KorKao Points)"
                              : "All activities or events which you need to use KorKao Points. and earn points from AirDrop"}
                          </TableCell>
                          <TableCell align="right">
                            <DoNotDisturbOnIcon />
                          </TableCell>
                          <TableCell align="right">
                            <CheckCircleOutlineIcon />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <ListItem className="mb-5">
                    <ListItemAvatar>
                      <Avatar className="iconchoice">
                        <LockIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        lang == "th"
                          ? "ทางผู้พัฒนาเข้าถึงข้อมูลส่วนบุคคลอย่างไรบ้าง"
                          : "How is our developer access your personal data?"
                      }
                      secondary={
                        lang == "th"
                          ? "ผู้พัฒนาต้องการเข้าถึงข้อมูลส่วนบุคคลได้แก่ชื่อผู้ใช้ ที่อยู่อีเมล และ Provider ที่คุณเข้าใช้ โดยที่เราจะเรียกใช้ข้อมูลของคุณเมื่อคุณยินยอมการเข้าร่วมกิจกรรมนั้นๆ และจะนำข้อมูลดังกล่าวไปใช้ในวัตถุประสงค์ที่เกี่ยวข้องกับกิจกรรมนั้น หลังจากนั้นเราจะลบข้อมูลผู้เข้าร่วมกิจกรรมทั้งหมดเป็นเวลาภายใน 30 วันนับจากวันที่ปิดกิจกรรมนั้นๆ นอกจากนี้ คุณสามารถเข้าไปที่หน้าจัดการบัญชีผู้ใช้ของคุณบนเว็บไซต์ Provider ที่คุณเข้าใช้งานเพื่อก้ไขข้อมูลของคุณได้ โดยที่ทางผู้พัฒนาจะไม่มีสิทธิ์การเข้าถึงการแก้ไขข้อมูลส่วนบุคคลของคุณแต่อย่างใด"
                          : "The developer needs to access personal information such as your username, email address, and the provider you are using. We will only retrieve your information when you consent to participate in that activity, and this data will be used for purposes related to that activity. Afterward, all participant data will be deleted within 30 days from the closure of the activity. Additionally, you can visit your account management page on the provider's website to modify your information, and the developer will not have the right to modify your personal data in any way."
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="iconchoice">
                        <KeyIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        lang == "th"
                          ? "การเข้าสู่ระบบหรือสมัครสมาชิกต้องทำอย่างไร"
                          : "How I can login or register to KorKao ID?"
                      }
                      secondary={
                        lang == "th"
                          ? "คุณสามารถเลือกเข้าสู่ระบบได้จาก 1 ใน 3 Provider ที่เราเปิดบริการ ได้แก่ Google, Microsoft และ Spotify หากคุณมีบัญชีอย่างน้อยหนึ่งในสามผู้ให้บริการนี้ คุณสามารถเข้าสู่ระบบ KorKao ID และใช้งานได้ทันทีโดยไม่ต้องกรอกข้อมูลใดๆ และสมาชิกใหม่จะได้รับ 1 KorKao Points ทันทีเมื่อมีการเข้าใช้งานครั้งแรก"
                          : "You can log in using one of the three providers we offer: Google, Microsoft, or Spotify. If you have an account with at least one of these three providers, you can log into KorKao ID and start using it immediately without entering any information. Additionally, new members will receive 1 KorKao Point upon their first login."
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card sx={{ marginTop: 5, width: "100%" }}>
              <CardContent>
                <CardHeader
                  title={
                    lang == "th"
                      ? "KorKao Points คืออะไร"
                      : "What is KorKao Points"
                  }
                />
                <Typography>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {lang == "th"
                    ? "KorKao Points เป็นระบบจัดการคะแนนสะสมในเว็บ KorKao FanSite ซึ่งทำงานร่วมกับระบบ KorKao ID เพื่อให้สมาชิกได้มีโอกาสเข้าถึงฟีเจอร์ต่างๆ"
                    : "KorKao ID is membership system for Kaofrang Yanisa or Kaofrang BNK48's fanclub to enhance participation in activities to make it special for them. Including access to special features that the developer and Kaofrang BNK48 Thailand Fanclub have collaborated on exclusively for membership."}
                </Typography>
                <List
                  className="mt-5"
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                  }}>
                  <ListItem className="mb-5">
                    <ListItemAvatar>
                      <Avatar className="iconchoice">
                        <StarsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        lang == "th"
                          ? "เราสามารถสะสม KorKao Points ได้ผ่านทางช่องทางใดบ้าง"
                          : "Through what channels can we collect KorKao Points?"
                      }
                      secondary={
                        lang == "th"
                          ? "คุณสามารถสะสมคะแนนได้จากกล่องสุ่มรายวัน (Daily AirDrop) โดยคุณมีโอกาสได้รับคะแนนสูงสุด 20 คะแนนเข้าบัญชีของคุณ ตัดรอบในทุกๆ เวลา 0:00 AM (ตามไทม์โซน UTC) รวมทั้งจะมีช่องทางในการสะสมคะแนนที่กำลังจะเกิดขึ้นในอนาคต"
                          : "You can collect KorKao Points from the Daily AirDrop, where you have a chance to receive up to 20 points to your account. The cutoff time is every day at 0:00 AM (UTC time zone), and there will also be upcoming ways to earn points in the future."
                      }
                    />
                  </ListItem>
                  <ListItem className="mb-5">
                    <ListItemAvatar>
                      <Avatar className="iconchoice">
                        <SwapHorizontalCircleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        lang == "th"
                          ? "เราสามารถนำ KorKao Points ไปทำอะไรได้บ้าง"
                          : "How do we use KorKao Points?"
                      }
                      secondary={
                        lang == "th"
                          ? "คุณสามารถนำ KorKao Points ไปใช้เข้าร่วมกิจกรรมของบ้านกอข้าวที่ได้จัดขึ้น หรือลุ้นรับหรือแลกของรางวัลที่เป็นเฉพาะข้าวฟ่าง เช่น BNK48 Merchandise ที่เป็นลายข้าวฟ่าง เป็นต้น"
                          : "You can use KorKao Points to join exclusive events from KorKao team. Or to drawing chance to get prize of exclusive merchandises like Kaofrang BNK48's Merchandise."
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="iconchoice">
                        <ErrorOutlineIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        lang == "th"
                          ? "ทำไมกิจกรรมที่ไม่จำเป็นต้องใช้คะแนนเพื่อเข้าร่วม ถึงไม่สามารถเข้าร่วมได้หากไม่มีคะแนน"
                          : "Why I cannot join events that don't need to use any KorKao Points when KorKao Points is zero?"
                      }
                      secondary={
                        lang == "th"
                          ? "ระบบจำเป็นต้องมีการยืนยันสถานะของผู้ใช้ KorKao ID นั้นว่าสามารถเข้าร่วมกิจกรรมได้หรือไม่ โดยคุณจำเป็นต้องมีอย่างน้อย 1 KorKao Points เพื่อเข้าร่วมในทุกกิจกรรม โดยที่คะแนนของคุณจะถูกใช้ก็ต่อเมื่อกิจกรรมนั้นมีการกำหนดจำนวนคะแนนที่ต้องใช้เท่านั้น"
                          : "The developer needs to access personal information such as your username, email address, and the provider you are using. We will only retrieve your information when you consent to participate in that activity, and this data will be used for purposes related to that activity. Afterward, all participant data will be deleted within 30 days from the closure of the activity. Additionally, you can visit your account management page on the provider's website to modify your information, and the developer will not have the right to modify your personal data in any way."
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </div>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader title={<h3>Your KorKao ID</h3>} />
        <div className="container mt-3">
          {data != null ? (
            <>
              <Card>
                <CardContent>
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ width: 80, height: 80 }}
                        src={user.picture}
                        className="mr-md-2 mr-0"
                        aria-label="recipe"></Avatar>
                    }
                    title={user.name}
                    subheader={"ID: " + user.email}
                    action={
                      <IconButton
                        aria-label="google"
                        onClick={() =>
                          window.open(
                            user.sub.includes("google")
                              ? "https://myaccount.google.com/"
                              : user.sub.includes("windowslive")
                              ? "https://account.microsoft.com"
                              : user.sub.includes("spotify")
                              ? "https://www.spotify.com/account/overview"
                              : null,
                            "_blank"
                          )
                        }>
                        <FontAwesomeIcon
                          icon={
                            user.sub.includes("google")
                              ? faGoogle
                              : user.sub.includes("windowslive")
                              ? faMicrosoft
                              : user.sub.includes("spotify")
                              ? faSpotify
                              : null
                          }
                        />
                      </IconButton>
                    }
                  />
                  <CardActionArea
                    onClick={() => {
                      point != null && setPointView(true);
                    }}>
                    <Typography className="ml-3">
                      {point != null ? (
                        lang == "th" ? (
                          "KorKao Point ของคุณ: " + point + " คะแนน"
                        ) : (
                          "KorKao Point: " + point + " point(s)"
                        )
                      ) : (
                        <Skeleton variant="text" />
                      )}
                      <FontAwesomeIcon
                        className="ml-2"
                        icon={point != null ? faQuestionCircle : null}
                      />
                    </Typography>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      sx={{ display: { xs: "block", md: "none" } }}
                      onClick={() =>
                        window.location.href.includes("localhost")
                          ? setCheckevent(
                              "B9CEFA4286CD4D0398DCED46D64A495468BB7EBAA9AF324613D7C42FF8A6721A1094F7BD4CB0B3AC8030EDCBB493CBC4"
                            )
                          : setGetData(true)
                      }>
                      {lang == "th"
                        ? "สแกนเพื่อเข้าร่วมกิจกรรม"
                        : "Scan to join event"}
                    </Button>
                    <Button onClick={() => setEdonate(true)}>
                      {lang == "th"
                        ? "รับ KorKao Points จากสลิปโดเนท"
                        : "E-Donate to KorKao Points"}
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>

              <Card sx={{ marginTop: 5, width: "100%" }}>
                <CardContent>
                  <CardHeader
                    title={
                      lang == "th" ? "KorKao ID คืออะไร" : "What is KorKao ID"
                    }
                  />
                  <Typography>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {lang == "th"
                      ? "KorKao ID เป็นระบบสมาชิกสำหรับแฟนด้อมของข้าวฟ่างที่จะยกระดับการเข้าร่วมกิจกรรมให้มีความพิเศษมากยิ่งขึ้น รวมทั้งการเข้าถึงฟีเจอร์พิเศษที่ทางผู้พัฒนาและบ้านกอฟ่างได้ร่วมมือกันสำหรับสมาชิกเท่านั้น"
                      : "KorKao ID is membership system for Kaofrang Yanisa or Kaofrang BNK48's fanclub to enhance participation in activities to make it special for them. Including access to special features that the developer and Kaofrang BNK48 Thailand Fanclub have collaborated on exclusively for membership."}
                  </Typography>
                  <List
                    className="mt-5"
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                    }}>
                    <ListItem className="mb-5">
                      <ListItemAvatar>
                        <Avatar className="iconchoice">
                          <CardMembershipIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          lang == "th"
                            ? "ผู้ใช้งานแบบไหนสามารถเข้าใช้งาน KorKao ID"
                            : "Who can use KorKao ID?"
                        }
                        secondary={
                          lang == "th"
                            ? "คุณสามารถเข้าใช้งาน KorKao ID ได้โดยไม่มีข้อจำกัดเรื่องเพศหรืออายุใดๆ อย่างไรก็ตามเราขอแนะนำให้เป็นผู้ที่มีอายุเกิน 15 ปีเป็นต้นไป เนื่องจากอาจมีกิจกรรมที่จะต้องลุ้นรางวัลด้วย หากคุณอายุต่ำกว่านั้นอาจต้องได้รับความยินยอมจากผู้ปกครองของคุณด้วย"
                            : "You can access KorKao ID without any restrictions regarding gender or age. However, we recommend that users be 15 years old and above, as there may be activities that involve prize draws. If you are younger than that, you may need to obtain consent from your parent."
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className="iconchoice">
                          <MilitaryTechIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          lang == "th"
                            ? "สิทธิประโยชน์ของ KorKao ID ที่จะได้รับมีอะไรบ้าง"
                            : "How are the KorKao ID benefits?"
                        }
                      />
                    </ListItem>
                    <TableContainer component={Paper} className="mb-5">
                      <Table sx={{ minWidth: 650 }}>
                        <caption>
                          *{" "}
                          {lang == "th"
                            ? "กรณีถ้ามีสุ่มจับฉลากลุ้นรางวัล ผู้ใช้งานทั่วไปจะไม่ได้รับสิทธิประโยชน์ตรงนี้"
                            : "For drawing prize events are excepted with generally users."}
                        </caption>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              {lang == "th"
                                ? "ฟีเจอร์ไฮไลท์ในเว็บไซต์นี้"
                                : "Highlight features of KorKao FanSite"}
                            </TableCell>
                            <TableCell align="right">
                              {lang == "th"
                                ? "ผู้ใช้งานทั่วไป"
                                : "Generally Users"}
                            </TableCell>
                            <TableCell align="right">
                              KorKao ID Membership
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}>
                            <TableCell component="th" scope="row">
                              {lang == "th"
                                ? "ดูโปรไฟล์ของน้องหรือ เพลงและคอนเทนต์ต่างๆของน้องข้าวฟ่าง"
                                : "Visit all basic of Kaofrang's profile, discography and special contents."}
                            </TableCell>
                            <TableCell align="right">
                              <CheckCircleOutlineIcon />
                            </TableCell>
                            <TableCell align="right">
                              <CheckCircleOutlineIcon />
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}>
                            <TableCell component="th" scope="row">
                              {lang == "th"
                                ? "ดูกิจกรรมของข้าวฟ่างและเปิดการแจ้งเตือนกิจกรรมแบบเรียลไทม์"
                                : "View Kaofrang's events and activities. And also enable push notification."}
                            </TableCell>
                            <TableCell align="right">
                              <CheckCircleOutlineIcon />
                            </TableCell>
                            <TableCell align="right">
                              <CheckCircleOutlineIcon />
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}>
                            <TableCell component="th" scope="row">
                              {lang == "th"
                                ? "เล่นมินิเกมส์พร้อมกับดูคะแนนเฉลี่ยจากผู้เล่นทั่วโลก"
                                : "Play KorKao's Quiz Game and see average scores from around the world."}
                            </TableCell>
                            <TableCell align="right">
                              <CheckCircleOutlineIcon />
                            </TableCell>
                            <TableCell align="right">
                              <CheckCircleOutlineIcon />
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}>
                            <TableCell component="th" scope="row">
                              {lang == "th"
                                ? "การเข้าร่วมกิจกรรมที่จัดขึ้นโดยบ้านกอข้าว"
                                : "Join special event of KorKao team."}
                            </TableCell>
                            <TableCell align="right">
                              * <CheckCircleOutlineIcon />
                            </TableCell>
                            <TableCell align="right">
                              <CheckCircleOutlineIcon />
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}>
                            <TableCell component="th" scope="row">
                              {lang == "th"
                                ? "ดูคะแนนและประวัติการเล่นมินิเกมส์ของคุณได้สูงสุด 1 ปี"
                                : "View your score and game histories up to one year."}
                            </TableCell>
                            <TableCell align="right">
                              <DoNotDisturbOnIcon />
                            </TableCell>
                            <TableCell align="right">
                              <CheckCircleOutlineIcon />
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}>
                            <TableCell component="th" scope="row">
                              {lang == "th"
                                ? "การสะสมคะแนนเพื่อลุ้นของรางวัล หรือการเข้าร่วมกิจกรรมที่ต้องใช้คะแนน (KorKao Points)"
                                : "All activities or events which you need to use KorKao Points. and earn points from AirDrop"}
                            </TableCell>
                            <TableCell align="right">
                              <DoNotDisturbOnIcon />
                            </TableCell>
                            <TableCell align="right">
                              <CheckCircleOutlineIcon />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <ListItem className="mb-5">
                      <ListItemAvatar>
                        <Avatar className="iconchoice">
                          <LockIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          lang == "th"
                            ? "ทางผู้พัฒนาเข้าถึงข้อมูลส่วนบุคคลอย่างไรบ้าง"
                            : "How is our developer access your personal data?"
                        }
                        secondary={
                          lang == "th"
                            ? "ผู้พัฒนาต้องการเข้าถึงข้อมูลส่วนบุคคลได้แก่ชื่อผู้ใช้ ที่อยู่อีเมล และ Provider ที่คุณเข้าใช้ โดยที่เราจะเรียกใช้ข้อมูลของคุณเมื่อคุณยินยอมการเข้าร่วมกิจกรรมนั้นๆ และจะนำข้อมูลดังกล่าวไปใช้ในวัตถุประสงค์ที่เกี่ยวข้องกับกิจกรรมนั้น หลังจากนั้นเราจะลบข้อมูลผู้เข้าร่วมกิจกรรมทั้งหมดเป็นเวลาภายใน 30 วันนับจากวันที่ปิดกิจกรรมนั้นๆ นอกจากนี้ คุณสามารถเข้าไปที่หน้าจัดการบัญชีผู้ใช้ของคุณบนเว็บไซต์ Provider ที่คุณเข้าใช้งานเพื่อก้ไขข้อมูลของคุณได้ โดยที่ทางผู้พัฒนาจะไม่มีสิทธิ์การเข้าถึงการแก้ไขข้อมูลส่วนบุคคลของคุณแต่อย่างใด"
                            : "The developer needs to access personal information such as your username, email address, and the provider you are using. We will only retrieve your information when you consent to participate in that activity, and this data will be used for purposes related to that activity. Afterward, all participant data will be deleted within 30 days from the closure of the activity. Additionally, you can visit your account management page on the provider's website to modify your information, and the developer will not have the right to modify your personal data in any way."
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className="iconchoice">
                          <KeyIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          lang == "th"
                            ? "การเข้าสู่ระบบหรือสมัครสมาชิกต้องทำอย่างไร"
                            : "How I can login or register to KorKao ID?"
                        }
                        secondary={
                          lang == "th"
                            ? "คุณสามารถเลือกเข้าสู่ระบบได้จาก 1 ใน 3 Provider ที่เราเปิดบริการ ได้แก่ Google, Microsoft และ Spotify หากคุณมีบัญชีอย่างน้อยหนึ่งในสามผู้ให้บริการนี้ คุณสามารถเข้าสู่ระบบ KorKao ID และใช้งานได้ทันทีโดยไม่ต้องกรอกข้อมูลใดๆ และสมาชิกใหม่จะได้รับ 1 KorKao Points ทันทีเมื่อมีการเข้าใช้งานครั้งแรก"
                            : "You can log in using one of the three providers we offer: Google, Microsoft, or Spotify. If you have an account with at least one of these three providers, you can log into KorKao ID and start using it immediately without entering any information. Additionally, new members will receive 1 KorKao Point upon their first login."
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              <Card sx={{ marginTop: 5, width: "100%" }}>
                <CardContent>
                  <CardHeader
                    title={
                      lang == "th"
                        ? "KorKao Points คืออะไร"
                        : "What is KorKao Points"
                    }
                  />
                  <Typography>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {lang == "th"
                      ? "KorKao Points เป็นระบบจัดการคะแนนสะสมในเว็บ KorKao FanSite ซึ่งทำงานร่วมกับระบบ KorKao ID เพื่อให้สมาชิกได้มีโอกาสเข้าถึงฟีเจอร์ต่างๆ"
                      : "KorKao ID is membership system for Kaofrang Yanisa or Kaofrang BNK48's fanclub to enhance participation in activities to make it special for them. Including access to special features that the developer and Kaofrang BNK48 Thailand Fanclub have collaborated on exclusively for membership."}
                  </Typography>
                  <List
                    className="mt-5"
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                    }}>
                    <ListItem className="mb-5">
                      <ListItemAvatar>
                        <Avatar className="iconchoice">
                          <StarsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          lang == "th"
                            ? "เราสามารถสะสม KorKao Points ได้ผ่านทางช่องทางใดบ้าง"
                            : "Through what channels can we collect KorKao Points?"
                        }
                        secondary={
                          lang == "th"
                            ? "คุณสามารถสะสมคะแนนได้จากกล่องสุ่มรายวัน (Daily AirDrop) โดยคุณมีโอกาสได้รับคะแนนสูงสุด 20 คะแนนเข้าบัญชีของคุณ ตัดรอบในทุกๆ เวลา 0:00 AM (ตามไทม์โซน UTC) รวมทั้งจะมีช่องทางในการสะสมคะแนนที่กำลังจะเกิดขึ้นในอนาคต"
                            : "You can collect KorKao Points from the Daily AirDrop, where you have a chance to receive up to 20 points to your account. The cutoff time is every day at 0:00 AM (UTC time zone), and there will also be upcoming ways to earn points in the future."
                        }
                      />
                    </ListItem>
                    <ListItem className="mb-5">
                      <ListItemAvatar>
                        <Avatar className="iconchoice">
                          <SwapHorizontalCircleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          lang == "th"
                            ? "เราสามารถนำ KorKao Points ไปทำอะไรได้บ้าง"
                            : "How do we use KorKao Points?"
                        }
                        secondary={
                          lang == "th"
                            ? "คุณสามารถนำ KorKao Points ไปใช้เข้าร่วมกิจกรรมของบ้านกอข้าวที่ได้จัดขึ้น หรือลุ้นรับหรือแลกของรางวัลที่เป็นเฉพาะข้าวฟ่าง เช่น BNK48 Merchandise ที่เป็นลายข้าวฟ่าง เป็นต้น"
                            : "You can use KorKao Points to join exclusive events from KorKao team. Or to drawing chance to get prize of exclusive merchandises like Kaofrang BNK48's Merchandise."
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className="iconchoice">
                          <ErrorOutlineIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          lang == "th"
                            ? "ทำไมกิจกรรมที่ไม่จำเป็นต้องใช้คะแนนเพื่อเข้าร่วม ถึงไม่สามารถเข้าร่วมได้หากไม่มีคะแนน"
                            : "Why I cannot join events that don't need to use any KorKao Points when KorKao Points is zero?"
                        }
                        secondary={
                          lang == "th"
                            ? "ระบบจำเป็นต้องมีการยืนยันสถานะของผู้ใช้ KorKao ID นั้นว่าสามารถเข้าร่วมกิจกรรมได้หรือไม่ โดยคุณจำเป็นต้องมีอย่างน้อย 1 KorKao Points เพื่อเข้าร่วมในทุกกิจกรรม โดยที่คะแนนของคุณจะถูกใช้ก็ต่อเมื่อกิจกรรมนั้นมีการกำหนดจำนวนคะแนนที่ต้องใช้เท่านั้น"
                            : "The developer needs to access personal information such as your username, email address, and the provider you are using. We will only retrieve your information when you consent to participate in that activity, and this data will be used for purposes related to that activity. Afterward, all participant data will be deleted within 30 days from the closure of the activity. Additionally, you can visit your account management page on the provider's website to modify your information, and the developer will not have the right to modify your personal data in any way."
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* <Joyride
                steps={lang == "th" ? stepTh : stepEn}
                continuous
                run={guide}
                styles={{
                  options: {
                    arrowColor: '#fb61ee',
                    backgroundColor: '#f1cef2',
                    primaryColor: '#f526fc',
                    textColor: '#000'
                  },
                }}
              /> */}
            </>
          ) : (
            <Card>
              <CardContent>
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "2rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <Dialog open={getData} maxWidth="xl">
          <DialogTitle id="alert-dialog-title">
            {lang == "th" ? "สแกนโค้ดกิจกรรม" : "Scan Event QR Code"}
          </DialogTitle>
          <DialogContent>
            <Scanner
              classNames={{
                container: "scanner",
              }}
              components={{ audio: false }}
              scanDelay={-10000}
              formats={["qr_code"]}
              onScan={(result) => setCheckevent(result[0].rawValue)}
              onError={null}
            />
            {/* <Box sx={{ display: "none" }}>
              <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={(err, result) => {
                  if (result) setCheckevent(result.text);
                  else return;
                }}
              />
            </Box> */}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setGetData(false);
              }}>
              {lang == "th" ? "ปิด" : "Close"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={getData2 != null} maxWidth="xl">
          {event != null && (
            <>
              <DialogTitle id="alert-dialog-title">
                <CardHeader
                  title={event.res.title}
                  subheader={
                    lang == "th"
                      ? "มีผู้เข้าร่วมกิจกรรมแล้ว " + event.part + " คน"
                      : "There are already " +
                        event.part +
                        " participants in this event."
                  }
                />
                <Chip
                  className="ml-md-3 ml-1"
                  label={
                    lang == "th"
                      ? "เข้าร่วมได้จนถึงวันที่ " +
                        moment
                          .unix(event.res.end)
                          .local()
                          .lang(lang)
                          .format("DD MMMM YYYY เวลา HH:mm")
                      : "You can join this event until " +
                        moment
                          .unix(event.res.end)
                          .local()
                          .lang(lang)
                          .format("DD MMMM YYYY HH:mm")
                  }
                  sx={{ display: { xs: "none", md: "flex" } }}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  className="ml-md-3 ml-1"
                  label={
                    lang == "th"
                      ? "เข้าร่วมได้จนถึง " +
                        moment
                          .unix(event.res.end)
                          .local()
                          .lang(lang)
                          .format("DD/MM/YYYY เวลา HH:mm")
                      : "Join until " +
                        moment
                          .unix(event.res.end)
                          .local()
                          .lang(lang)
                          .format("DD/MM/YYYY HH:mm")
                  }
                  sx={{ display: { xs: "flex", md: "none" } }}
                  color="primary"
                  variant="outlined"
                />
                <Divider className="mt-3" />
              </DialogTitle>
              <DialogContent className="m-md-3 m-1">
                {event.res.src != "" && (
                  <CardMedia
                    component="img"
                    height="300"
                    image={event.res.src}
                    alt="eventimg"
                  />
                )}
                {point < event.res.pointused ? (
                  <Typography className="mt-2 mb-2 text-info">
                    {lang == "th"
                      ? "หมายเหตุ: คะแนนของคุณไม่เพียงพอในการเข้าร่วมกิจกรรม คุณต้องมีอย่างน้อย " +
                        event.res.pointused +
                        " คะแนน"
                      : "Notes: Your KorKao Points are not enough to join this event. You should have at least " +
                        event.res.pointused +
                        " KorKao Points."}
                  </Typography>
                ) : (
                  <Typography className="mt-2 mb-2 text-info">
                    {lang == "th"
                      ? "หมายเหตุ: คะแนนที่ใช้สำหรับเข้าร่วมกิจกรรม " +
                        event.res.pointused +
                        " คะแนน"
                      : "Notes: Redeemed Points of this event " +
                        event.res.pointused +
                        " KorKao Points."}
                  </Typography>
                )}
                <Typography>{event.res.desc[lang]}</Typography>
                <Divider className="mt-4" />
                <Typography className="mt-2">
                  {lang == "th"
                    ? "การเข้าถึงข้อมูลส่วนบุคคล: ทางผู้พัฒนาต้องการเข้าถึงข้อมูล ได้แก่ ที่อยู่อีเมลและชื่อผู้ใช้ โดยมีวัตถุประสงค์เพื่อนำไปใช้ในการเข้าร่วมกิจกรรมต่างๆ ที่เกี่ยวข้องกับกิจกรรมนี้ และจะมีผลจนถึงวันและเวลาที่สิ้นสุดกิจกรรมนี้ และผู้พัฒนาจะลบข้อมูลที่เก็บไว้ออกจากระบบ"
                    : "Privacy Info Access Information: The developers require access to information, including email addresses and usernames, for the purpose of participation in various activities related to this event. This will remain in effect until the date and time of the conclusion of this event, after which the developers will delete the stored data from the system."}
                </Typography>
                {event.res.isJoinagain ? (
                  <Typography className="mt-2">
                    {lang == "th"
                      ? "กิจกรรมนี้สามารถเข้าร่วมได้มากกว่า 1 ครั้ง จนกว่าจะสิ้นสุดแคมเปญ"
                      : "This event can be joined multiple times until the end of the campaign."}
                  </Typography>
                ) : (
                  <Typography className="mt-2">
                    {lang == "th"
                      ? "1 ไอดีผู้ใช้สามารถเข้าร่วมกิจกรรมได้ 1 คนเท่านั้น หากยืนยันเข้าร่วมแล้วจะไม่สามารถยกเลิก หรือเข้าร่วมงานซ้ำในภายหลังได้"
                      : "One user ID can participate in the event only once. Once confirmed for participation, it will not be possible to cancel or participate in the event again in the future."}
                  </Typography>
                )}
              </DialogContent>
              <DialogActions>
                {point >= event.res.pointused && (
                  <Button onClick={() => joinevent()}>
                    {lang == "th" ? "เข้าร่วมกิจกรรม" : "Join this event"}
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setGetData2(null);
                  }}>
                  {lang == "th" ? "ปิด" : "Close"}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog open={viewPoint} maxWidth="xl">
          <>
            <DialogTitle id="alert-dialog-title">
              <CardHeader
                title={
                  lang == "th"
                    ? "KorKao Point คืออะไร"
                    : "What is the KorKao Point?"
                }
              />
              <Divider className="mt-3" />
            </DialogTitle>
            <DialogContent className="m-md-3 m-1">
              <Typography className="mt-2">
                {lang == "th"
                  ? "KorKao Point เป็นระบบการสะสม และคะแนนสำหรับใช้เข้าร่วมกิจกรรมหรือลุ้นรับรางวัลเป็น BNK48 Merchandise หรือของรางวัลสุดพิเศษสำหรับชาวด้อมกอข้าวของข้าวฟ่าง ที่จะเกิดขึ้นในอนาคต"
                  : "KorKao Point is an earning and redeem points for use to participate in activities or win prizes like BNK48 Merchandise or special prizes for KorKao fans that will occur in the future."}
              </Typography>
              <Typography className="mt-2">
                {lang == "th"
                  ? "หมายเหตุ: คุณจำเป็นต้องมีอย่างน้อย 1 คะแนนเพื่อเข้าร่วมกิจกรรมหรือรับสิทธิ์ในแต่ละครั้งเพื่อไว้ในการยืนยันการเป็นสมาชิก แม้ว่ากิจกรรมนั้นจะไม่จำเป็นต้องแลกคะแนนก็ตาม"
                  : "Note: You must have at least 1 point to participate in the event or to qualify each time for membership verification, even if the event does not require points for redemption."}
              </Typography>
              <TableContainer component={Paper} className="mt-5">
                <CardHeader
                  title={
                    lang == "th" ? "ประวัติการใช้งาน" : "KorKao Points History"
                  }
                />
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {lang == "th" ? "สถานะอัปเดตล่าสุด" : "Latest update"}
                      </TableCell>
                      <TableCell>
                        {lang == "th" ? "รายละเอียด" : "Activity Detail"}
                      </TableCell>
                      <TableCell align="right">
                        {lang == "th"
                          ? "สถานะการเปลี่ยนแปลง"
                          : "Points Update Status"}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pointHis != null ? (
                      pointHis.map((row) => (
                        <TableRow
                          key={row.activDate}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}>
                          <TableCell component="th" scope="row">
                            {moment(row.activDate)
                              .lang(lang)
                              .local()
                              .format("DD MMMM YYYY HH:mm:ss")}
                          </TableCell>
                          <TableCell align="left">{row.remark}</TableCell>
                          <TableCell align="right">
                            {row.pointActivity}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <Card>
                        <CardContent>
                          <Skeleton
                            variant="text"
                            className="bg-m"
                            sx={{ fontSize: "2rem" }}
                          />
                          <Skeleton
                            variant="text"
                            className="bg-m"
                            sx={{ fontSize: "1rem" }}
                          />
                          <Skeleton
                            variant="text"
                            className="bg-m"
                            sx={{ fontSize: "1rem" }}
                          />
                          <Skeleton
                            variant="text"
                            className="bg-m"
                            sx={{ fontSize: "1rem" }}
                          />
                          <Skeleton
                            variant="text"
                            className="bg-m"
                            sx={{ fontSize: "1rem" }}
                          />
                          <Skeleton
                            variant="text"
                            className="bg-m"
                            sx={{ fontSize: "1rem" }}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setPointView(false);
                }}>
                {lang == "th" ? "ปิด" : "Close"}
              </Button>
            </DialogActions>
          </>
        </Dialog>

        <Dialog open={edonate} maxWidth="xl">
          <>
            <DialogTitle id="alert-dialog-title">
              <CardHeader
                title={
                  lang == "th"
                    ? "สลิปโดเนทของคุณมีค่า สามารถนำมาและเปลี่ยนเป็น KorKao Points ใช้ร่วมกิจกรรมสุดพิเศษได้"
                    : "KorKao E-Donate to KorKao Points Project"
                }
              />
              <Divider className="mt-3" />
            </DialogTitle>
            <DialogContent className="m-md-3 m-1">
              <Typography className="mt-2">
                1. การโดเนทหรือสนับสนุนโปรเจคต่างๆกับบ้านกอข้าวทุกๆ 80 บาท
                จะได้รับ 1 KorKao Points (ยอดโดเนทส่วนเกินที่ไม่ถึง 80
                บาทจะไม่ได้นำไปคำนวน)
              </Typography>
              <Typography className="mt-2">
                2.
                ฟีเจอร์นี้รองรับเฉพาะการทำธุรกรรมผ่านแอปธนาคารที่อยู่ในประเทศไทยเท่านั้น
              </Typography>
              <Typography className="mt-2">
                2. สลิปของคุณจะต้องเป็นสลิปที่โอนเข้า<b>บัญชีธนาคารกสิกรไทย</b>{" "}
                ภายใต้ชื่อบัญชี{" "}
                <b>นายคมกฤษ ถาวรชีวัน และ นาย อนุชิต ชาอุรัมย์</b> เท่านั้น
              </Typography>
              <Typography className="mt-2">
                3. สลิปจากการโดเนทจะต้องมีอายุไม่เกิน 7
                วันนับจากวันเวลาที่บันทึกข้อมูลขึ้นเว็บไซต์นี้
              </Typography>
              <Typography className="mt-2">
                4. สามารถอัปโหลดสลิปได้เพียง 1 ครั้งต่อวันต่อ 1 KorKao ID
                เท่านั้น (กรณีดำเนินการสำเร็จหรือพบว่ายอดโดเนทไม่ถึงที่กำหนด)
              </Typography>
              <Button
                component="label"
                className="mt-3"
                role={undefined}
                variant="contained"
                tabIndex={-1}>
                เลือกสลิปในคลังรูปภาพ
                <VisuallyHiddenInput
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(event) => {
                    reader(event.target.files[0], (err, res) => {
                      setBase(res);
                    });
                    QrScanner.scanImage(event.target.files[0])
                      .then((result) => setFile(result))
                      .catch((error) => {
                        setBase(null);
                        Swal.fire({
                          title: "ไม่พบ Micro QR จากรูปที่คุณเลือก",
                          icon: "warning",
                        });
                      });
                  }}
                />
              </Button>
              {slipFile != null && (
                <Typography className="mt-4" sx={{ wordBreak: "break-all" }}>
                  QR Code Detected: {slipFile}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              {slipFile != null && (
                <Button onClick={() => QRDonate()}>อัปโหลดข้อมูล</Button>
              )}
              <Button
                onClick={() => {
                  setEdonate(false);
                }}>
                ปิด
              </Button>
            </DialogActions>
          </>
        </Dialog>

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
export default connect(mapStateToProps, mapDispatchToProps)(Acct);
