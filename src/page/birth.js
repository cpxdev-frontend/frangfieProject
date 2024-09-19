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
  Fade,
  Box,
  CircularProgress,
  Menu,
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

const Birth = ({
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
  const [port, setPortrait] = React.useState(false);

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
    fetch(process.env.REACT_APP_APIE + "/kfsite/birthdayStatus?ok=kf", {
      method: "post",
    })
      .then((response) => response.json())
      .then((result) => {
        //setUp(result.response);
        setUp(true);
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

  if (up == false) {
    return (
      <Fade in={open} timeout={300}>
        <Box
          sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}
          className="container">
          <Card className="text-center">
            <CardContent>
              <h6 className="mt-3">
                {lang == "th"
                  ? "ฟีเจอร์นี้ยังไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้งในภายหลัง"
                  : "This feature is unavaliable yet. Please come back again soon."}
              </h6>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader
          data-tour="birthmain-1"
          title={<h3>KorKaofrang Day Card</h3>}
          subheader={
            up
              ? lang == "th"
                ? "ร่วมอวยพรวันเกิดข้าวฟ่างกัน! [ระยะเวลาร่วมกิจกรรม " +
                  moment(new Date().getFullYear() + "-11-13T17:00:00Z")
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
                  moment(new Date().getFullYear() + "-11-13T17:00:00Z")
                    .local()
                    .lang(lang)
                    .format("DD MMMM YYYY HH:mm") +
                  " to " +
                  moment(new Date().getFullYear() + "-11-16T16:59:59Z")
                    .local()
                    .lang(lang)
                    .format("DD MMMM YYYY HH:mm") +
                  ". Based on Asia/Bangkok timezone]"
              : lang == "th"
              ? "ยังไม่พร้อมให้บริการในขณะนี้ ขออภัยในความไม่สะดวก"
              : "Oops! We are not ready right now."
          }
          action={
            headedit ? null : (
              <Box data-tour="birthmain-5">
                <Button
                  variant="contained"
                  onPointerUp={() =>
                    text.length > 0 || img.length > 0
                      ? Export()
                      : Swal.fire({
                          title: "No Content",
                          text:
                            lang == "th"
                              ? "คุณสามารถบอกอะไรให้น้องข้าวฟ่างรับรู้ได้นะ"
                              : "Let you can say something to Kaofrang.",
                          icon: "warning",
                        })
                  }>
                  {lang == "th" ? "ส่งออกเป็นรูปภาพ" : "Export to Image"}
                </Button>
              </Box>
            )
          }
        />
        {text.length > 0 && (
          <h6 className="text-center text-info">
            {lang == "th"
              ? "คำแนะนำ: กรุณาดับเบิ้ลคลิกที่ข้อความ (ยกเว้นไตเติ้ล) เพื่อแก้ไข"
              : "Guide: You can double-click at text (except Title text) to edit which you want."}
          </h6>
        )}
        {text.length > 0 && (
          <DialogTitle
            className="text-muted text-center"
            sx={{ marginTop: -1, fontSize: 14 }}>
            {lang == "th"
              ? "คุณสามารถกดค้างที่ข้อความยาว (ยกเว้นไตเติ้ล) เพื่อย้ายตำแหน่งได้"
              : "You can hold paragraph to move paragraph position"}
          </DialogTitle>
        )}
        <div
          className={
            port
              ? "container d-md-flex d-initial justify-content-center mt-3 p-5"
              : "container d-lg-flex d-initial justify-content-center mt-3 p-5"
          }
          style={{ overflow: t ? "hidden" : "scroll" }}>
          <Card
            data-tour="birthmain-3"
            sx={{
              borderRadius: 5,
              backgroundColor: bg,
              minWidth: !port ? 1011 : 638,
              minHeight: !port ? 638 : 1011,
              width: !port ? 1011 : 638,
              height: !port ? 638 : 1011,
            }}
            ref={cardsuccess}>
            <CardContent>
              <CardHeader
                data-tour="birthmain-2"
                title={
                  <h3 style={{ color: headercolor, fontSize: port ? 28 : 33 }}>
                    {header}
                  </h3>
                }
                action={
                  load ? null : (
                    <Button color="inherit" onClick={() => setHeadedit(true)}>
                      <Edit />
                    </Button>
                  )
                }
              />
              <Divider className="mb-3" />

              <div>
                {text.map((item, i) => (
                  <Draggable disabled={item.id == editmode}>
                    <div>
                      <Typography
                        key={item.id}
                        className="col-12"
                        sx={{
                          fontSize: 23,
                          position: "absolute",
                          cursor: "grab",
                          wordBreak: "break-all",
                          color: item.color,
                        }}
                        onDoubleClick={() => setEditmode(item.id)}
                        variant="div">
                        {RenderHTML(item.txt.replaceAll("\n", "<br/>"))}
                      </Typography>
                      <Dialog open={item.id == editmode}>
                        <DialogTitle>
                          {lang == "th" ? "แก้ไขข้อความ" : "Paragraph Editor"}
                        </DialogTitle>
                        <DialogTitle
                          className="text-muted"
                          sx={{ marginTop: -3, fontSize: 14 }}>
                          {lang == "th"
                            ? "คุณสามารถแก้ไขข้อความ และเลือกสีของข้อความได้ และกดปุ่มไอคอนเทปเพื่อบันทึกหรือถังขยะเพื่อลบข้อความนี้"
                            : "Edit or change this parapraph text color here. Also click 'Save' icon to apply changed or click 'trash' icon to delete this paragraph."}
                        </DialogTitle>
                        <DialogContent>
                          {!load && (
                            <div className="col-12 text-right">
                              <IconButton
                                color="dark"
                                onClick={() =>
                                  item.txt.length > 0 && setEditmode("")
                                }>
                                <Save />
                              </IconButton>
                              <IconButton
                                color="dark"
                                onClick={() => {
                                  Swal.fire({
                                    title:
                                      lang == "th"
                                        ? "คุณต้องการลบข้อความนี้หรือไม่"
                                        : "Do you want to remove this paragraph",
                                    showDenyButton: true,
                                    confirmButtonText:
                                      lang == "th" ? "ยืนยัน" : "Confirm",
                                    denyButtonText:
                                      lang == "th" ? "แก้ไขต่อ" : "Stay edit",
                                  }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                      setAddText([
                                        ...text.slice(0, i),
                                        ...text.slice(i + 1),
                                      ]);
                                      setEditmode("");
                                    }
                                  });
                                }}>
                                <Delete />
                              </IconButton>
                            </div>
                          )}
                          <TextField
                            fullWidth
                            multiline
                            rows={5}
                            onChange={(e) => Updateh(e, item.id)}
                            autoComplete="off"
                            value={item.txt}
                          />
                          <SketchPicker
                            width="90%"
                            color={item.color}
                            onChangeComplete={(c) =>
                              UpdateColorBody(c, item.id)
                            }
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              if (item.txt.length == 0) {
                                setAddText([
                                  ...text.slice(0, i),
                                  ...text.slice(i + 1),
                                ]);
                              }
                              setEditmode("");
                            }}>
                            {lang == "th" ? "ปิด" : "Close"}
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </Draggable>
                ))}
                {img.map((item, i) => (
                  <Draggable disabled={editmodeimg != ""}>
                    <div
                      style={{
                        position: "static",
                        cursor: editmodeimg != "" ? "" : "grab",
                        width: "max-content",
                      }}
                      key={item.id}>
                      <Resizable
                        style={{
                          border: load ? "" : "solid 1px #8a8a8a",
                          borderRadius: 5,
                        }}
                        defaultSize={{
                          width: item.w,
                          height: item.h,
                        }}
                        enable={
                          editmodeimg !== ""
                            ? {
                                topRight: true,
                                bottomRight: true,
                                bottomLeft: true,
                                topLeft: true,
                              }
                            : false
                        }
                        onResizeStop={(e, direction, ref, d) => {
                          resizeModeImg(
                            item.w + d.width,
                            item.h + d.width,
                            item.id
                          );
                        }}>
                        {!load && (
                          <div className="col-12 text-right">
                            <IconButton
                              color="dark"
                              onPointerUp={() => switchimg(item.id)}>
                              {editmodeimg !== "" ? (
                                <AspectRatio />
                              ) : (
                                <PanTool />
                              )}
                            </IconButton>
                            <IconButton
                              color="dark"
                              onPointerUp={() => {
                                Swal.fire({
                                  title:
                                    lang == "th"
                                      ? "คุณต้องการลบรูปนี้หรือไม่"
                                      : "Do you want to remove this image",
                                  showDenyButton: true,
                                  confirmButtonText:
                                    lang == "th" ? "ยืนยัน" : "Confirm",
                                  denyButtonText:
                                    lang == "th" ? "แก้ไขต่อ" : "Stay edit",
                                }).then((result) => {
                                  /* Read more about isConfirmed, isDenied below */
                                  if (result.isConfirmed) {
                                    setAddImg([
                                      ...img.slice(0, i),
                                      ...img.slice(i + 1),
                                    ]);
                                  }
                                });
                              }}>
                              <Delete />
                            </IconButton>
                            <DialogTitle
                              className="text-muted text-center"
                              sx={{ marginTop: -1, fontSize: 14 }}>
                              {lang == "th"
                                ? editmodeimg != ""
                                  ? "คลิกที่ไอคอนนี้จนขึ้นไอคอน 'ขยายรูป' และลากที่มุมของกรอบรูปเพื่อปรับขนาดรูปภาพตามที่ต้องการได้"
                                  : "คลิกที่ไอคอนนี้จนขึ้นไอคอน 'แบมือ' และลากเพื่อย้ายข้อความยาวหรือรูปภาพได้"
                                : editmodeimg != ""
                                ? "Click this button to show 'Resize' icon then drag from image corner to adjust image sizes which you want."
                                : "Click this button to show 'Plam Hand' icon then drag this text any direction to move this paragraph or image."}
                            </DialogTitle>
                          </div>
                        )}
                        <CardMedia
                          draggable={false}
                          sx={{
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                          }}
                          component="img"
                          src={item.src}
                        />
                      </Resizable>
                    </div>
                  </Draggable>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {editmode == "" && load == false && headedit == false && (
          <>
            <Menu
              open={editor}
              anchorEl={anchorEl}
              onClick={() => (t ? null : setAnchorEl(null))}>
              <MenuItem onClick={() => setChangebg(true)}>
                {lang == "th"
                  ? "เปลี่ยนสีการ์ด"
                  : "Change Card Background Color"}
              </MenuItem>
              <MenuItem onClick={() => addTxt()}>
                {lang == "th" ? "เพิ่มข้อความ" : "Add Paragraph"}
              </MenuItem>
              <MenuItem onClick={() => addImg()}>
                {lang == "th" ? "แทรกรูปภาพ" : "Browse Image"}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (text.length > 0 || img.length > 0) {
                    Swal.fire({
                      title:
                        lang == "th"
                          ? "คุณต้องการหมุนด้านของการ์ดเป็น" +
                            (port == true ? "แนวนอน" : "แนวตั้ง") +
                            "หรือไม่"
                          : "Do you want to rotated your card on " +
                            (port == true ? "landscape" : "portrait") +
                            " layout?",
                      text:
                        lang == "th"
                          ? "ข้อความ (ยกเว้นข้อความไตเติ้ล) และรูปภาพจะถูกลบทั้งหมด"
                          : "All Texts (except Title text) and images will be clear.",
                      showDenyButton: true,
                      confirmButtonText: lang == "th" ? "ยืนยัน" : "Confirm",
                      denyButtonText: lang == "th" ? "แก้ไขต่อ" : "Stay edit",
                    }).then((result) => {
                      /* Read more about isConfirmed, isDenied below */
                      if (result.isConfirmed) {
                        setAddText([]);
                        setAddImg([]);
                        setPortrait(!port);
                      }
                    });
                  } else {
                    setPortrait(!port);
                  }
                }}>
                {lang == "th" ? "สลับด้านของการ์ด" : "Rotate Card"}
              </MenuItem>
            </Menu>
            <Fab
              data-tour="birthmain-4"
              color="primary"
              sx={{
                display: {
                  bottom: 180,
                  right: 8,
                  position: "fixed",
                  zIndex: 1300,
                },
              }}
              onClick={(e) => {
                t ? setAnchorEl(null) : setAnchorEl(e.currentTarget);
              }}>
              <BorderColor />
            </Fab>
          </>
        )}

        <Joyride
          steps={lang == "th" ? stepTh : stepEn}
          continuous
          callback={(e) => {
            console.log(e);
            e.lifecycle == "tooltip" ? setTutor(true) : setTutor(false);
          }}
          run={!load && guide ? true : false}
          styles={{
            options: {
              arrowColor: "#fb61ee",
              backgroundColor: "#f1cef2",
              primaryColor: "#f526fc",
              textColor: "#000",
            },
          }}
        />

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}>
          <CircularProgress />
        </Backdrop>

        <Dialog open={bgd}>
          <DialogTitle>
            {lang == "th"
              ? "เปลี่ยนสีพื้นหลังการ์ด"
              : "Change Card Background Color"}
          </DialogTitle>
          <DialogContent data-tour="birthmenu-1">
            <SketchPicker
              width="90%"
              color={bg}
              onChangeComplete={(c) => setBg(c.hex)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChangebg(false)}>
              {lang == "th" ? "ปิด" : "Close"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={headedit}>
          <DialogTitle>
            {lang == "th" ? "แก้ไขข้อความไตเติ้ล" : "Edit Title"}
          </DialogTitle>
          <DialogTitle
            className="text-muted"
            sx={{ marginTop: -3, fontSize: 14 }}>
            {lang == "th"
              ? "คุณสามารถแก้ไขข้อความ และเลือกสีของข้อความไตเติ้ลได้ โดยการเปลี่ยนแปลงจะมีผลทันที"
              : "Edit Title or change Title text color here. All changed will be affected immediately."}
          </DialogTitle>
          <DialogContent>
            <Box className="mb-3">
              <TextField
                sx={{ width: { md: "80%", xs: "100%" } }}
                value={header}
                onChange={(e) => setHead(e.target.value)}
              />
              <br />
              <SketchPicker
                className="w-md-75 w-100"
                color={headercolor}
                onChangeComplete={(c) => setHeadcolor(c.hex)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHeadedit(false)}>
              {lang == "th" ? "ปิด" : "Close"}
            </Button>
          </DialogActions>
        </Dialog>
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
export default connect(mapStateToProps, mapDispatchToProps)(Birth);
