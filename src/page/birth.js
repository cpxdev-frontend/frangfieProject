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
import { AddPhotoAlternate, BorderColor } from "@mui/icons-material";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import draftToHtml from "draftjs-to-html";
import { Base64 } from 'https://cdn.jsdelivr.net/npm/js-base64@3.7.7/base64.min.js';
import Draggable from 'react-draggable';
import { v4 as uuidv4 } from 'uuid';
import { Resizable } from 'react-resizable';

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
  const [up, setUp] = React.useState(false);
  const [editmode, setEditmode] = React.useState('');
  const [text, setAddText] = React.useState([]);

  const [selectedcountry, setCountry] = React.useState("");

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
      txt: ''
    }])
    setEditmode(API);
  }

  const Updateh = (e, id) => {
    let updatedList = text.map(item => 
      {
        if (item.id == id){
          return {...item, txt: e.target.value}; //gets everything that was already in item, and updates "done"
        }
        return item; // else return unmodified item 
      });
  
    setAddText(updatedList); 
}

const RenderHTML = (html) => (<div dangerouslySetInnerHTML={{__html:html}}></div>)

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
        action={<Button variant="contained">{lang == "th"
          ? "ส่งออกเป็นรูปภาพ"
          : "Export to Image"}</Button>}
      />
      <div className="container d-flex justify-content-center mt-3">
        <Card sx={{ minHeight: 800, width: { md: 600, xs: '100%' } }}>
          <CardContent>
            <Draggable>
              <div>
                {
                  text.map((item, i) => item.id == editmode ? (
                    <TextField sx={{width: 290}} multiline rows={3} onChange={(e) => Updateh(e, item.id)} autoComplete="off" value={item.txt} onDoubleClick={() => item.txt.length > 0 && setEditmode('')} helperText={lang == "th"
                      ? "ดับเบิ้ลคลิกที่ช่องกรอกเพื่อบันทึกการเปลี่ยนแปลง"
                      : "Double click on text field to confirm updated."} />
                  ) : (
                    <Resizable style={{wordBreak: 'break-all'}} onDoubleClick={() => setEditmode(item.id)}>
                    <Typography variant="div">{RenderHTML(item.txt.replace('\n', '<br/>'))}</Typography>
                    </Resizable>
                  ))
                }
              </div>
            </Draggable>
          </CardContent>
        </Card>
      </div>
      {
        editmode == '' && (
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
            <BorderColor  />
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
            onClick={() => {}}>
            <AddPhotoAlternate  />
          </Fab>
          </>
        )
      }
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
