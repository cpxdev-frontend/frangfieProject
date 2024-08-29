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
  Fab,
  Tab,
  Typography,
  List,
  Dialog,
  ImageList,
  ImageListItem,
  Skeleton,
  Fade,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grow,
  CardMedia,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setLaunch,
} from "../redux/action";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import moment from "moment";
import { RefreshRounded } from "@mui/icons-material";
import ReactGA from "react-ga4";

import { useHistory, useParams } from "react-router-dom";

let thumb = false;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow timeout={1200} ref={ref} {...props} />;
});

const GalleryMod = ({
  currentPage,
  lang,
  setLang,
  setLaunch,
  setPage,
  launch,
}) => {
  const [data, setData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [l, setL] = React.useState(false);
  const [imgLoad, setImgAct] = React.useState(false);
  const [imgtag, setImgtag] = React.useState(null);
  const { id } = useParams();
  const his = useHistory();
  const [width, setRealwidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (thumb == false) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };
    function handleWindowResize() {
      setRealwidth(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    if (imgLoad == false) {
        setImgtag(null);
        setL(false);
    }
  }, [imgLoad]);

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };

    thumb = false;
    const stance = JSON.parse(atob(atob(id)));
    setPage(stance.name);
    fetch(
      process.env.REACT_APP_APIE + "/kfsite/getgalleryeach?id=" + stance.id,
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
          className="text-center"
          sx={{ wordWrap: "break-word" }}
          title={<h3>{JSON.parse(atob(atob(id))).name}</h3>}
          subheader={
            lang == "th"
              ? "มาย้อนความทรงจำของรูปเหล่านี้กันเถอะ"
              : "Let's enjoy with Kaofrang Gallery"
          }
        />
        <div className="container mt-3">
          {data != null ? (
            <>
              <Box sx={{ display: "block" }}>
                <ImageList cols={Math.floor(width / 350)}>
                  {data.map((item) => (
                    <ImageListItem
                      data-aos="fade-in"
                      onClick={() => {
                        setImgtag(item);
                        setImgAct(true);
                      }}
                      key={item.id}
                      cols={
                        item.imageMediaMetadata.width >
                          item.imageMediaMetadata.height && width > 650
                          ? 2
                          : 1
                      }
                      rows={
                        item.imageMediaMetadata.width <
                          item.imageMediaMetadata.height && width > 650
                          ? 2
                          : 1
                      }>
                      <CardMedia
                        src={
                          "https://drive.google.com/thumbnail?id=" +
                          item.id +
                          "&sz=w700"
                        }
                        component="img"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>

                <Fab
                  color="primary"
                  sx={{
                    display: {
                      bottom: 100,
                      right: 8,
                      position: "fixed",
                      zIndex: 1300,
                    },
                  }}
                  onClick={(e) => {
                    his.push("/gallery");
                  }}>
                  <ArrowBackIosNewIcon />
                </Fab>
              </Box>

              <Dialog
                tra
                open={imgLoad}
                maxWidth="lg"
                TransitionComponent={Transition}>
                {imgtag != null && (
                  <>
                    <DialogTitle>
                      {lang == "th"
                        ? "อัปโหลดโดย " + imgtag.lastModifyingUserName
                        : "Uploaded by " + imgtag.lastModifyingUserName}
                    </DialogTitle>
                    <DialogTitle
                      className="text-muted"
                      sx={{ marginTop: -3, fontSize: 14 }}>
                      {lang == "th"
                        ? "อัปเดตเมื่อ " +
                          moment(imgtag.modifiedDate)
                            .lang(lang)
                            .local()
                            .format("DD MMMM YYYY HH:mm") +
                          ""
                        : " Updated in " +
                          moment(imgtag.modifiedDate)
                            .lang(lang)
                            .local()
                            .format("DD MMMM YYYY HH:mm") +
                          ""}
                    </DialogTitle>
                    <DialogContent>
                      <img
                        src={
                          "https://drive.google.com/thumbnail?id=" +
                          imgtag.id +
                          "&sz=w700"
                        }
                        style={{
                          display: l ? "initial" : "none",
                        }}
                        width={"100%"}
                        onLoad={() => setL(true)}
                      />
                    </DialogContent>
                    <Skeleton
                      variant="rounded"
                      className="bg-m"
                      sx={{
                        display: l ? "none" : "initial",
                        width: imgtag.imageMediaMetadata.width,
                        height: imgtag.imageMediaMetadata.height,
                      }}
                    />
                    <DialogActions>
                      <Button onClick={() => setImgAct(false)} autoFocus>
                        {lang == "th" ? "ปิด" : "Close"}
                      </Button>
                    </DialogActions>
                  </>
                )}
              </Dialog>
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
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
  setLaunch: (val) => dispatch(setLaunch(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(GalleryMod);
