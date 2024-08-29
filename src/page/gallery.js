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
  ListItem,
  ImageList,
  ImageListItem,
  Skeleton,
  Fade,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
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

// import LightGallery from "lightgallery/react";
// import lgZoom from "lightgallery/plugins/zoom";
import fjGallery from "flickr-justified-gallery";
import "lightbox.js-react/dist/index.css";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
import { useHistory, useParams } from "react-router-dom";
import Masonry from "react-responsive-masonry";

let thumb = false;

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}`,
    srcSet: `${image}`,
  };
}

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
  const [imgLoad, setImgLoad] = React.useState(false);
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
    if (data != null && imgLoad) {
      fjGallery(document.querySelectorAll(".gallery"), {
        itemSelector: ".gallery__item",
        rowWeight: "100%",
        lastRow: "start",
        gutter: 2,
        rowHeightTolerance: 0.1,
        calculateItemsHeight: false,
      });
    }
  }, [data]);

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
                {/* <LightGallery
                  // plugins={[lgZoom]}
                  mode="lg-fade"
                  pager={false}
                  thumbnail={true}
                  // autoplayFirstVideo={false}
                  isMobile={true}
                  onInit={() => setImgLoad(true)}
                  onBeforeOpen={() => (thumb = true)}
                  onBeforeClose={() => (thumb = false)}
                  mobileSettings={{
                    showCloseIcon: true,
                  }}
                  elementClassNames={"gallery"}
                >
                  {data.map((item, i) => (
                    <a
                      key={item.id}
                      data-lg-size="600-800"
                      className="gallery__item"
                      data-src={
                        "https://drive.google.com/thumbnail?id=" +
                        item.id +
                        "&sz=w700"
                      }
                      data-referrerPolicy="no-referrer"
                      data-sub-html={
                        lang == "th"
                          ? "<h4>อัปโหลดโดย " +
                            item.lastModifyingUserName +
                            "</h4><br/><p>อัปเดตเมื่อ " +
                            moment(item.modifiedDate)
                              .lang(lang)
                              .local()
                              .format("DD MMMM YYYY HH:mm") +
                            "</p>"
                          : "<h4>Uploaded by " +
                            item.lastModifyingUserName +
                            "</h4><br/><p>Updated in " +
                            moment(item.modifiedDate)
                              .lang(lang)
                              .local()
                              .format("DD MMMM YYYY HH:mm") +
                            "</p>"
                      }
                    >
                      <img
                        className="img-responsive"
                        referrerPolicy="no-referrer"
                        src={
                          "https://drive.google.com/thumbnail?id=" +
                          item.id +
                          "&sz=w400"
                        }
                      />
                    </a>
                  ))}
                </LightGallery> */}
                <ImageList cols={Math.floor(width / 300)}>
                  {data.map((item) => (
                    <ImageListItem key={item.id} cols={item.imageMediaMetadata.width > item.imageMediaMetadata.height ? 2 : 1} rows={item.imageMediaMetadata.width < item.imageMediaMetadata.height ? 2 : 1}>
                      <img
                        {...srcset(
                          "https://drive.google.com/thumbnail?id=" +
                            item.id +
                            "&sz=w4000",
                          item.imageMediaMetadata.width,
                          item.imageMediaMetadata.height,
                          undefined,
                          undefined
                        )}
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
                  }}
                >
                  <ArrowBackIosNewIcon />
                </Fab>
              </Box>
              {/* <Box sx={{ display: imgLoad ? "none" : "initial" }}>
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
              </Box> */}
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
