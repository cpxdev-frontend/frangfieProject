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
  Fab,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  DialogActions,
  TextField,
  CardMedia,
  Backdrop
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
import { AddPhotoAlternate, BorderColor, Save, Delete, AspectRatio, PanTool, Edit, Done } from "@mui/icons-material";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import draftToHtml from "draftjs-to-html";
import { Base64 } from 'https://cdn.jsdelivr.net/npm/js-base64@3.7.7/base64.min.js';
import Draggable from 'react-draggable';
import { v4 as uuidv4 } from 'uuid';
import { Resizable } from 're-resizable';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

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
  const [header, setHead] = React.useState('Kaofrang Birthday');
  const [up, setUp] = React.useState(false);
  const cardsuccess = React.useRef(null)
  const [editmode, setEditmode] = React.useState('');
  const [text, setAddText] = React.useState([]);

  const [editmodeimg, setEditmodeImg] = React.useState('');
  const [img, setAddImg] = React.useState([]);

  const [selectedcountry, setCountry] = React.useState("");
  const [open, setLoad] = React.useState(false);

  const RefreshDate = () => {
    fetch(process.env.REACT_APP_APIE + "/kfsite/birthdayStatus?ok=kf", { method: 'post' })
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
    setPage(lang == "th" ? "กิจกรรมวันเกิดของข้าวฟ่าง" : "Birthday Campaign of Kaofrang");
  }, []);

  const addTxt = () => {
    const API = uuidv4();
    setAddText([...text, {
      id: API,
      txt: '',
      w: 270,
      h: '100%'
    }])
    setEditmode(API);
  }

  const Updateh = (e, id) => {
    let updatedList = text.map(item => {
      if (item.id == id) {
        return { ...item, txt: e.target.value }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item 
    });

    setAddText(updatedList);
  }

  const resizeMode = (w, h, id) => {
    let updatedList = text.map(item => {
      if (item.id == id) {
        return { ...item, w: w, h: h }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item 
    });

    setAddText(updatedList);
  }
  const resizeModeImg = (w, h, id) => {
    let updatedList = img.map(item => {
      if (item.id == id) {
        return { ...item, w: w, h: h }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item 
    });

    setAddImg(updatedList);
  }

  const addImg = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/webp';
    input.style.display = 'none';

    document.body.appendChild(input);

    input.click();


    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64String = event.target.result;
        setAddImg([...img, {
          id: uuidv4(),
          w: 270,
          h: '100%',
          src: base64String
        }])
      };

      reader.readAsDataURL(file);
    });
  }

  const Export = () => {
    if (cardsuccess.current === null) {
      return
    }
    setLoad(true);
    toJpeg(cardsuccess.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'Your KaofrangFie Birthday Card.jpg'
        link.href = dataUrl
        link.click()
        setLoad(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const RenderHTML = (html) => (<div dangerouslySetInnerHTML={{ __html: html }}></div>)

  return (
    <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
      <CardHeader
        title={<h3>KaofrangFie Day Card</h3>}
        subheader={
          up
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
            : lang == "th"
              ? "ยังไม่พร้อมให้บริการในขณะนี้ ขออภัยในความไม่สะดวก"
              : "Oops! We are not ready right now."
        }
        action={headedit ? null : <Button variant="contained" onClick={() => text.length > 0 || img.length > 0 && Export()}>{lang == "th"
          ? "ส่งออกเป็นรูปภาพ"
          : "Export to Image"}</Button>}
      />
      <div className="container d-flex justify-content-center mt-3">
        <Card sx={{ minHeight: 800, width: { md: 600, xs: '100%' } }} ref={cardsuccess}>
          <CardContent>
            {
              headedit == false ? (
                <CardHeader title={header} action={open ? null : <Button onClick={() => setHeadedit(true)}><Edit/></Button>} />
              ) : (
                <Box className='mb-3'>
                  <TextField sx={{width: '80%'}} value={header} onChange={(e) => setHead(e.target.value)} />
                  <Button className="mt-2" onClick={() => setHeadedit(false)}><Done/></Button>
                  </Box>
              )
            }
            <Divider className='mb-3' />
            <Draggable disabled={editmode != '' || editmodeimg != ''}>
              <div>
                {
                  text.map((item, i) => item.id == editmode ? (
                    <Resizable
                      style={{ border: open ? '' : 'solid 1px #ddd' }}
                      defaultSize={{
                        width: item.w,
                        height: item.h
                      }}
                      onResizeStop={(e, direction, ref, d) => {
                        resizeMode(item.w + d.width, item.h + d.width, item.id);
                      }}
                    >
                      <TextField fullWidth multiline rows={5} onChange={(e) => Updateh(e, item.id)} autoComplete="off" value={item.txt} />
                      {!open && (
                        <div className="col-12">
                        <Button onClick={() => item.txt.length > 0 && setEditmode('')}>
                          <Save />
                        </Button>
                        <Button onClick={() => {
                          setAddText([
                            ...text.slice(0, i),
                            ...text.slice(i + 1)
                          ])
                          setEditmode('');
                        }}>
                          <Delete />
                        </Button>
                      </div>
                      )}
                    </Resizable>
                  ) : (
                    <Typography style={{ wordBreak: 'break-all' }} onDoubleClick={() => setEditmode(item.id)} variant="div">{RenderHTML(item.txt.replaceAll('\n', '<br/>'))}</Typography>
                  ))
                }
                {
                  img.map((item, i) => (
                    <Resizable
                      style={{ border: open? '' : 'solid 1px #ddd' }}
                      defaultSize={{
                        width: item.w,
                        height: item.h
                      }}
                      enable={editmodeimg != '' ? { topRight: true, bottomRight: true, bottomLeft: true, topLeft: true } : false}
                      onResizeStop={(e, direction, ref, d) => {
                        resizeModeImg(item.w + d.width, item.h + d.width, item.id);
                      }}
                    >
                      <CardMedia sx={{ width: '100%', height: '100%' }} component='img' src={item.src} />
                     {!open && (
                       <div className="col-12">
                       <Button onClick={() => setEditmodeImg(editmodeimg == '' ? item.id : '')}>
                         {editmodeimg != '' ? <AspectRatio /> : <PanTool />}
                       </Button>
                       <Button onClick={() => {
                         setAddImg([
                           ...img.slice(0, i),
                           ...img.slice(i + 1)
                         ])
                       }}>
                         <Delete />
                       </Button>
                     </div>
                     )}
                    </Resizable>
                  ))
                }
              </div>
            </Draggable>
          </CardContent>
        </Card>
      </div>
      {
        editmode == '' && open == false && headedit == false && (
          <>
            <Fab
              color="primary"
              sx={
                {
                  display: {
                    bottom: 240,
                    right: 8,
                    position: "fixed",
                    zIndex: 1300,
                    opacity: opacity,
                  }
                }
              }
              onClick={() => addTxt()}>
              <BorderColor />
            </Fab>
            <Fab
              color="primary"
              sx={
                {
                  display: {
                    bottom: 170,
                    right: 8,
                    position: "fixed",
                    zIndex: 1300,
                    opacity: opacity,
                  }
                }
              }
              onClick={() => addImg()}>
              <AddPhotoAlternate />
            </Fab>
          </>
        )
      }
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress />
      </Backdrop>
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
