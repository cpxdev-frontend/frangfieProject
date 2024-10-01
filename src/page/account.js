import React from "react";
import { connect } from "react-redux";
import {
  Card,
  CardContent,
  LinearProgress,
  CardHeader,
  Button,
  Grid,
  Avatar,
  Box,
  Tabs,
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
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CollectionsIcon from "@mui/icons-material/Collections";
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
  const [getData, setGetData] = React.useState(false);
  const [getData2, setGetData2] = React.useState(false);
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
        alert(JSON.stringify(code));
        if (result.status) {
          setGetData2(true);
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

  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    setPage("KorKao ID");

    setData(user);
  }, []);

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
                        className="mr-2"
                        aria-label="recipe"></Avatar>
                    }
                    title={user.name}
                    subheader={"ID: " + user.email}
                    action={
                      <IconButton aria-label="google">
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
                    size="small"
                    onClick={() =>
                      window.location.href.includes('localhost')
                        ? setCheckevent(
                            "83ADFB165B70679A85A1513BD56A1FA8042D1154B7DEE5CF70FF687613C353559580D635DCDF71BE8282CAD41AEDB0F8"
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
              onScan={(result) => setCheckevent(result)}
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

        <Dialog open={getData2} maxWidth="xl">
          <DialogTitle id="alert-dialog-title">
            {lang == "th" ? "สแกนโค้ดกิจกรรม" : "Scan Event QR Code"}
          </DialogTitle>
          <DialogContent></DialogContent>
          <DialogActions>
            <Button onClick={() => {}}>
              {lang == "th" ? "เข้าร่วมกิจกรรม" : "Join this event"}
            </Button>
            <Button
              onClick={() => {
                setGetData2(false);
              }}>
              {lang == "th" ? "ปิด" : "Close"}
            </Button>
          </DialogActions>
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
