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
} from "@mui/material";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setLaunch,
} from "../redux/action";
import moment from "moment";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import {
  faGoogle,
  faMicrosoft,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth0 } from "@auth0/auth0-react";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/gallery";
import stepTh from "../stepGuide/th/gallery";

import { Scanner } from "@yudiel/react-qr-scanner";

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

  const {
    loginWithPopup,
    user,
    isAuthenticated,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  const setCheckevent = (code) => {
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

    fetch(process.env.REACT_APP_APIE + "/kfsite/checkevent", requestOptions)
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
      }),
    };

    fetch(process.env.REACT_APP_APIE + "/kfsite/joinevent", requestOptions)
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
          });
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

  React.useEffect(() => {
    setPage("KorKao ID");

    if (isAuthenticated) {
      setData(user);
    }
  }, [isAuthenticated]);

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
                </CardContent>
                <CardActions sx={{ display: { xs: "block", md: "none" } }}>
                  <Button
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
                </CardActions>
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
              onScan={(result) => setCheckevent(result[0].rawValue)}
              onError={null}
            />
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
                      : event.part + " persons participating in this event."
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
                <Typography>{event.res.desc[lang]}</Typography>
                <Divider className="mt-4" />
                <Typography className="mt-2">
                  {lang == "th"
                    ? "การเข้าถึงข้อมูลส่วนบุคคล: ทางผู้พัฒนาต้องการเข้าถึงข้อมูล ได้แก่ ที่อยู่อีเมลและชื่อผู้ใช้ โดยมีวัตุถุประสงค์เพื่อนำไปใช้ในกิจกรรมที่เกี่ยวข้องกับกิจกรรมนี้ และจะมีผลจนถึงวันและเวลาที่สิ้นสุดกิจกรรมนี้ และผู้พัฒนาจะลบข้อมูลที่เก็บไว้ออกจากระบบ"
                    : "Privacy Info Access Information: The developer requires access to information including email addresses and usernames. The objective is to be used in activities related to this activity. and will remain in effect until the day and time this activity ends. and the developer will delete the stored data from the system."}
                </Typography>
                <Typography className="mt-2">
                  {lang == "th"
                    ? "1 ไอดีผู้ใช้สามารถเข้าร่วมกิจกรรมได้ 1 คนเท่านั้น หากยืนยันเข้าร่วมแล้วจะไม่สามารถยกเลิก หรือเข้าร่วมงานซ้ำในภายหลังได้"
                    : "You can join this event 1 ID per 1 person. You cannot join this event repeatly or cancel joined event anyway."}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => joinevent()}>
                  {lang == "th" ? "เข้าร่วมกิจกรรม" : "Join this event"}
                </Button>
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
