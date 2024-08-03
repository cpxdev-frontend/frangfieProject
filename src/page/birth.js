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
  CircularProgress,
  Tab,
  Typography,
  List,
  Backdrop,
  Fab,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setLaunch,
} from "../redux/action";
import moment from "moment";
import { RefreshRounded, NoteAdd, SetMeal } from "@mui/icons-material";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import draftToHtml from "draftjs-to-html";
import { Base64 } from 'https://cdn.jsdelivr.net/npm/js-base64@3.7.7/base64.min.js';

const Birth = ({
  currentPage,
  lang,
  setLang,
  setLaunch,
  setPage,
  launch,
  leftmode,
  opacity,
  country,
}) => {
  const [data, setData] = React.useState(null);
  const [view, setView] = React.useState(false);
  const [up, setUp] = React.useState(false);
  const [us, userReadyset] = React.useState(
    localStorage.getItem("kfbirthuser") == null
  );
  const [setupuser, setUserReady] = React.useState(
    localStorage.getItem("kfbirthuser")
  );
  const [loadx, setLoadx] = React.useState(false);

  const [addPost, setPost] = React.useState(false);
  const [msg, setMsg] = React.useState(EditorState.createEmpty());

  const [selectedcountry, setCountry] = React.useState("");

  React.useEffect(() => {
    if (addPost == false) {
      setMsg(EditorState.createEmpty());
    }
  }, [addPost]);

  const RefreshDate = () => {
    fetch("https://cpxdevweb.onrender.com/kfsite/birthdayStatus?ok=kf", {})
      .then((response) => response.json())
      .then((result) => {
        setUp(result.response);
      })
      .catch((error) => console.log("error", error));
    fetch("https://cpxdevweb.onrender.com/kfsite/birthdayStatus", {})
      .then((response) => response.json())
      .then((result) => {
        setView(result.response);
      })
      .catch((error) => console.log("error", error));
    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => setCountry(data.country));
  };

  const refhd = (requestOptions) => {
    if (loadx == false) {
      fetch(
        "https://cpxdevweb.onrender.com/kfsite/birthdayList",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setData(result.response);
        })
        .catch((error) => console.log("error", error));
    }
  };

  React.useEffect(() => {
    var requestOptions = {
      method: "GET",
    };
    RefreshDate();
    setPage(lang == "th" ? "กิจกรรมวันเกิดของข้าวฟ่าง" : "Birthday Campaign of Kaofrang");
    fetch("https://cpxdevweb.onrender.com/kfsite/birthdayList", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setData(result.response);
        setInterval(() => {
          refhd(requestOptions);
        }, 30000);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const savepost = () => {
    var requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: btoa(unescape(encodeURIComponent(draftToHtml(convertToRaw(msg.getCurrentContent()))))),
        user: setupuser,
        country: selectedcountry,
      }),
    };
    setLoadx(true)
    fetch(
      "https://cpxdevweb.onrender.com/kfsite/birthdayUpload",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLoadx(false)
        if (result.status) {
          refhd({
            method: "GET",
          })
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
      <CardHeader
        title={<h3>KaofrangFie Day Trend</h3>}
        subheader={
          up && view
            ? lang == "th"
              ? "ร่วมอวยพรวันเกิดข้าวฟ่างกัน! [ระยะเวลาร่วมกิจกรรม " +
              moment(new Date().getFullYear() + "-11-14T17:00:00Z")
                .local()
                .lang(lang)
                .format("DD MMMM YYYY HH:mm") +
              " ถึง " +
              moment(new Date().getFullYear() + "-11-16T16:59:59Z")
                .local()
                .lang(lang)
                .format("DD MMMM YYYY HH:mm") +
              " อ้างอิงตามเวลาประเทศไทย]"
              : "Let's celebrate the special day of Kaofrang. [Campaign Event between " +
              moment(new Date().getFullYear() + "-11-14T17:00:00Z")
                .local()
                .lang(lang)
                .format("DD MMMM YYYY HH:mm") +
              " to " +
              moment(new Date().getFullYear() + "-11-16T16:59:59Z")
                .local()
                .lang(lang)
                .format("DD MMMM YYYY HH:mm") +
              ". Based on Asia/Bangkok timezone]"
            : up == false && view
              ? lang == "th"
                ? "ดูคำอวยพรได้ถึงวันที่ " +
                moment(new Date().getFullYear() + "-11-16T16:59:59Z")
                  .local()
                  .lang(lang)
                  .format("DD MMMM YYYY HH:mm") +
                " (อ้างอิงตามเวลาประเทศไทย)"
                : "See blessing message until " +
                moment(new Date().getFullYear() + "-11-16T16:59:59Z")
                  .local()
                  .lang(lang)
                  .format("DD MMMM YYYY HH:mm") +
                ". (Based on Asia/Bangkok timezone)"
              : lang == "th"
                ? "ยังไม่พร้อมให้บริการในขณะนี้ ขออภัยในความไม่สะดวก"
                : "Oops! We are not ready right now."
        }
      />
      <div className="container mt-3">
        {data != null ? (
          <>
            {data.length > 0 ? data.map((item, i) => (
              <Card
                key={item.birthDayLog}
                className="mb-3"
                data-aos="zoom-in-right">
                <CardHeader
                  title={item.birthDayby}
                  subheader={
                    (lang == "th" ? "โพสต์เมื่อ " : "Post in ") +
                    moment(item.created)
                      .lang(lang)
                      .local()
                      .format("DD MMMM YYYY HH:mm") +
                    (lang == "th"
                      ? " ที่ " +
                      country.filter(
                        (x) => x.alpha2 == item.birthDayLocate
                      )[0].name
                      : " from " +
                      country.filter(
                        (x) => x.alpha2 == item.birthDayLocate
                      )[0].enName)
                  }
                />
                <CardContent className="w-100" sx={{wordBreak: 'break-word'}}>
                  <Typography variant="body2" color="text.secondary" className="txtPost" dangerouslySetInnerHTML={{ __html: decodeURIComponent(escape(window.atob(item.birthDaymessage))) }}>
                  </Typography>
                </CardContent>
              </Card>
            )) : (
              <Card>
                <CardContent className="text-center">
                {lang == "th"
                  ? "เรากำลังรอคำอวยพรจากคุณอยู่ คุณสามารถร่วมอวยพรน้องเป็นคนแรกได้นะ"
                  : "You can come to join as first persons to celebrating now."}
                </CardContent>
              </Card>
            )}
            {up && localStorage.getItem("kfbirthuser") != null && (
              <Fab
                color="primary"
                sx={
                  leftmode
                    ? {
                      display: {
                        bottom: 170,
                        left: 8,
                        position: "fixed",
                        zIndex: 1300,
                        opacity: opacity,
                      },
                    }
                    : {
                      display: {
                        bottom: 170,
                        right: 8,
                        position: "fixed",
                        zIndex: 1300,
                        opacity: opacity,
                      },
                    }
                }
                onClick={() => setPost(true)}>
                <NoteAdd />
              </Fab>
            )}
            <Dialog open={us && up} maxWidth="md">
              <DialogTitle>
                {lang == "th"
                  ? "กรอกชื่อผู้ใช้สำหรับเข้าใช้งาน"
                  : "Please create new username to continue"}
              </DialogTitle>
              <DialogContent>
                <TextField
                  label="Create your username"
                  value={setupuser}
                  variant="standard"
                  onChange={(e) => setUserReady(e.target.value)}
                  fullWidth={true}
                />
                <Typography className="text-info mt-1" variant="subtitle2">
                  {lang == "th"
                    ? "หมายเหตุ: คุณไม่สามารถแก้ไขในภายหลังได้"
                    : "Notes: You cannot change username later."}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  disabled={setupuser == null || setupuser == ""}
                  onClick={() => {
                    Swal.fire({
                      title: lang == "th" ? "คุณต้องการใช้ชื่อ \"" + setupuser + "\" เป็นชื่อผู้ใช้สำหรับการเขียนคำอวยพรหรือไม่" : "Do you want to use \"" + setupuser + "\" as username?",
                      showDenyButton: true,
                      confirmButtonText: lang == "en" ? "Confirm" : "ยืนยัน",
                      denyButtonText: lang == "en" ? "Stay" : "แก้ไขต่อ",
                    }).then((result) => {
                      /* Read more about isConfirmed, isDenied below */
                      if (result.isConfirmed) {
                        localStorage.setItem("kfbirthuser", setupuser);
                        userReadyset(false);
                      }
                    });
                  }}>
                  {lang == "th" ? "ตกลง" : "Confirm"}
                </Button>
                <Button
                  onClick={() => {
                    userReadyset(false);
                  }}>
                  {lang == "th" ? "ยกเลิก" : "Cancel"}
                </Button>
              </DialogActions>
            </Dialog>
            {selectedcountry != "" && (
              <Dialog open={addPost && up} maxWidth="xl">
                <DialogTitle>
                  {lang == "th"
                    ? "กรอกข้อความที่ต้องการอวยพร"
                    : "Please say something to Kaofrang"}
                </DialogTitle>
                <DialogContent>
                  <TextField
                    label="Your Username"
                    value={setupuser}
                    variant="standard"
                    className="mb-2"
                    fullWidth={true}
                  />
                  <TextField
                    label="Your location (Based on your IP)"
                    value={
                      lang == "th"
                        ? "ประเทศ" +
                        country.filter((x) => x.alpha2 == selectedcountry)[0]
                          .name
                        : country.filter((x) => x.alpha2 == selectedcountry)[0]
                          .enName
                    }
                    variant="standard"
                    fullWidth={true}
                  />
                  <div className="mt-3 border">
                    <Editor
                      editorState={msg}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={(e) => setMsg(e)}
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={msg.getCurrentContent().hasText() === false}
                    onClick={() => {
                      Swal.fire({
                        title: lang == "th" ? "คุณต้องการยืนยันการส่งคำอวยพรหรือไม่" : "Do you want to upload this post",
                        text: lang == "th" ? "คุณจะไม่สามารถแก้ไขข้อความได้ในภายหลัง" : "You cannot edit message later.",
                        showDenyButton: true,
                        confirmButtonText: lang == "en" ? "Confirm" : "ยืนยัน",
                        denyButtonText: lang == "en" ? "Cancel" : "ยกเลิก",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          console.log(
                            draftToHtml(convertToRaw(msg.getCurrentContent()))
                          );
                          setPost(false)
                          savepost();
                          // Call sender api
                        }
                      });
                    }}>
                    {lang == "th" ? "โพสต์" : "Upload"}
                  </Button>
                  <Button onClick={() => setPost(false)}>
                    {lang == "th" ? "ยกเลิก" : "Cancel"}
                  </Button>
                </DialogActions>
              </Dialog>
            )}
            <Backdrop
              sx={{ color: '#fff', position: 'fixed', zIndex: 2000 }}
              open={loadx}
            >
              <CircularProgress color="primary" />
            </Backdrop>
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
    </Box>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  country: state.country,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setLaunch: (val) => dispatch(setLaunch(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Birth);
