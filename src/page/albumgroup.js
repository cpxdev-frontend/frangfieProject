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
  DialogContentText,
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

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/gallery";
import stepTh from "../stepGuide/th/gallery";

const Album = ({ currentPage, lang, setLang, setLaunch, setPage, launch, guide }) => {
  const [data, setData] = React.useState(null);
  const [getData, setGetData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const [load, setLoad] = React.useState(false);

  const setFileName = (name) => {
    if (name.split("|").length > 1) {
      return name.split("|")[1].replaceAll("_", " ");
    } else {
      return name;
    }
  };

  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  const getLink = (item, redirect) => {
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.id,
        title: item.title,
      }),
    };

    setLoad(true);
    fetch(process.env.REACT_APP_APIE + "/kfsite/gallerylinkgen", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoad(false);
        if (redirect) {
          history.push("/gallery/" + result.encrypt);
        } else {
          navigator.clipboard.writeText(
            window.location.href + "/" + result.encrypt
          );
          Swal.fire({
            title:
              lang == "th"
                ? "คัดลอกอัลบั้มลิงก์แล้ว"
                : "Album link as been copied",
            icon: "success",
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };

    setPage(lang == "th" ? "คลังรูปของข้าวฟ่าง" : "Gallery of Kaofrang");
    fetch(
      process.env.REACT_APP_APIE_2 + "/kfsite/getgalleryevent",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.items);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader
          title={<h3>Kaofrang Gallery Space</h3>}
          subheader={
            lang == "th"
              ? "จักรวาลคลังรูปของข้าวฟ่างโดยหัวใจคนรักข้าวฟ่าง ให้บริการโดยกูเกิ้ลไดรฟ์"
              : "The universe of Kaofrang's Gallery by KorKao Team Support. Provided by Google Drive"
          }
        />
        <div className="container mt-3">
          {data != null ? (
            <>
              {data.map((item) => (
                <Card key={item.id} className="mb-3" data-tour="gallery">
                  <CardContent>
                    <CardHeader
                      className="forceline"
                      title={setFileName(item.title)}
                      subheader={
                        (lang == "th"
                          ? "อัปเดตล่าสุดเมื่อ "
                          : "Latest update in ") +
                        moment(item.modifiedDate)
                          .lang(lang)
                          .local()
                          .format("DD MMMM YYYY HH:mm")
                      }
                      action={
                        <Box sx={{ display: { xs: "none", lg: "initial" } }}>
                          <IconButton
                            color="primary"
                            aria-label="navigate"
                            size="small"
                            onClick={() => getLink(item, true)}>
                            <CollectionsIcon />
                            &nbsp;{lang == "th" ? "ดูอัลบั้ม" : "View Album"}
                          </IconButton>
                          <br />
                          <IconButton
                            color="primary"
                            size="small"
                            aria-label="copyalbumlink"
                            onClick={() => getLink(item, false)}>
                            <ContentCopyIcon />
                            &nbsp;
                            {lang == "th"
                              ? "คัดลอกลิงก์อัลบั้ม"
                              : "Copy Album link"}
                          </IconButton>
                        </Box>
                      }
                    />
                    <Box sx={{ display: { xs: "initial", lg: "none" } }}>
                      <Button onClick={() => getLink(item, true)}>
                        <CollectionsIcon />
                        &nbsp;{lang == "th" ? "ดูอัลบั้ม" : "View Album"}
                      </Button>
                      <Button onClick={() => getLink(item, false)}>
                        <ContentCopyIcon />
                        &nbsp;
                        {lang == "th"
                          ? "คัดลอกลิงก์อัลบั้ม"
                          : "Copy Album link"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              <Joyride
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
              />
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
        <Dialog open={getData != undefined} maxWidth="xl">
          <DialogTitle id="alert-dialog-title">
            {lang == "th" ? "สถานที่จัดงาน" : "Event Location"}
          </DialogTitle>
          <DialogContent>
            {getData != undefined && getData != null ? (
              <>
                <iframe
                  width="100%"
                  height="450"
                  style={{ border: "none" }}
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  src={
                    "https://www.google.com/maps/embed/v1/place?key=AIzaSyAL0rpaALNBZalhJuywgqWl4sgFDvXVSz4&q=" +
                    getData.locate[0] +
                    "," +
                    getData.locate[1]
                  }></iframe>
              </>
            ) : (
              <>
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ height: 400 }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setGetData(null);
              }}>
              {lang == "th" ? "ปิด" : "Close"}
            </Button>
            <Button
              onClick={() =>
                getData != null && getData != undefined
                  ? window.open(getData.place, "_blank")
                  : null
              }>
              {lang == "th" ? "ไปยังแอป Google Maps" : "View on Google Maps"}
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
export default connect(mapStateToProps, mapDispatchToProps)(Album);
