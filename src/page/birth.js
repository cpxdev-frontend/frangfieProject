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
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import draftToHtml from "draftjs-to-html";
import { Base64 } from "https://cdn.jsdelivr.net/npm/js-base64@3.7.7/base64.min.js";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";
import { Resizable } from "re-resizable";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { SketchPicker } from "react-color";

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

  const [selectedcountry, setCountry] = React.useState("");
  const [open, setLoad] = React.useState(false);

  const [expo, setExport] = React.useState("");

  const RefreshDate = () => {
    fetch(process.env.REACT_APP_APIE + "/kfsite/birthdayStatus?ok=kf", {
      method: "post",
    })
      .then((response) => response.json())
      .then((result) => {
        // setUp(result.response);
        setUp(true);
      })
      .catch((error) => console.log("error", error));

    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => setCountry(data.country));
  };

  React.useEffect(() => {
    RefreshDate();
    window.addEventListener(
      "resize",
      function (event) {
        setSizescreennotmatch(window.innerWidth < 900);
        setH(window.innerHeight)
        if (window.innerWidth < 1056) {
          setSizeZoom(cardsuccess.current != null
            ? cardsuccess.current.clientWidth / window.innerWidth
            : 0);
        } else {
          setSizeZoom(0)
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

  const resizeMode = (w, h, id) => {
    let updatedList = text.map((item) => {
      if (item.id == id) {
        return { ...item, w: w, h: h }; //gets everything that was already in item, and updates "done"
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

    setTimeout(() => {
      toJpeg(cardsuccess.current, {
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
              link.download = "Your KaofrangFie Birthday Card.jpg";
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

  return (
    <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
      {/* {
        sizes && up && <Alert sx={{ position: 'fixed', zIndex: 1300, buttom: '20%' }} onClick={() => setSizescreennotmatch(false)} severity="warning"><b>{lang == 'th' ? 'ขนาดหน้าจอไม่เหมาะสม' : 'The screen size is not appropriate.'}</b> {lang == 'th' ? 'การสร้างการ์ดอาจไม่ได้ขนาดตามที่ระบบกำหนด (ขนาดเท่าบัตรเครดิต)' : 'Your Card maybe not same as standard size (Size similiar to Credit Card)'}</Alert>
      } */}
      <CardHeader
        title={<h3>KaofrangFie Day Card</h3>}
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
            <Box>
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
      <div className="container d-flex justify-content-center mt-3">
        <Card
          sx={{
            borderRadius: 5,
            backgroundColor: bg,
            wordBreak: "break-all",
            width: 950,
            height: sizes == true ? 850 : (h < 800 ? 580 : '60vh'),
            zoom: sizezoom
          }}
          ref={cardsuccess}>
          <CardContent>
            <CardHeader
              title={<h3 style={{ color: headercolor, fontSize: 28 / 1.11 }}>{header}</h3>}
              action={
                open ? null : (
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
                      <DialogContent>
                        {!open && (
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
                          onChangeComplete={(c) => UpdateColorBody(c, item.id)}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setEditmode("")}>
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
                      style={{ border: open ? "" : "solid 1px #ddd" }}
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
                      {!open && (
                        <div className="col-12 text-right">
                          <IconButton
                            color="dark"
                            onPointerUp={() => switchimg(item.id)}>
                            {editmodeimg !== "" ? <AspectRatio /> : <PanTool />}
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
      {editmode == "" && open == false && headedit == false && (
        <>
          <Menu
            open={editor}
            anchorEl={anchorEl}
            onClick={() => setAnchorEl(null)}>
            <MenuItem onClick={() => setChangebg(true)}>
              {lang == "th" ? "เปลี่ยนสีการ์ด" : "Change Card Background Color"}
            </MenuItem>
            <MenuItem onClick={() => addTxt()}>
              {lang == "th" ? "เพิ่มข้อความ" : "Add Paragraph"}
            </MenuItem>
            <MenuItem onClick={() => addImg()}>
              {lang == "th" ? "แทรกรูปภาพ" : "Browse Image"}
            </MenuItem>
          </Menu>
          <Fab
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
              setAnchorEl(e.currentTarget);
            }}>
            <BorderColor />
          </Fab>
        </>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}>
        <CircularProgress />
      </Backdrop>

      <Dialog open={bgd}>
        <DialogTitle>
          {lang == "th"
            ? "เปลี่ยนสีพื้นหลังการ์ด"
            : "Change Card Background Color"}
        </DialogTitle>
        <DialogContent>
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
