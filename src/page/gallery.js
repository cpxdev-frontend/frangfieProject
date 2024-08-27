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
  Tab,
  Typography,
  List,
  ListItem,
  Chip,
  Skeleton,
  Fade,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  CardMedia,
} from "@mui/material";
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

import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import fjGallery from "flickr-justified-gallery";
import "lightbox.js-react/dist/index.css";

function compareTimestamps(timestamp1, timestamp2) {
  // Get the difference in milliseconds
  const difference = timestamp2 * 1000 - timestamp1 * 1000;

  // Calculate days
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  // Get remaining milliseconds after removing days
  const remainingMilliseconds = difference % (1000 * 60 * 60 * 24);

  // Calculate hours
  const hours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));

  // Get remaining milliseconds after removing hours
  const remainingMinutes = remainingMilliseconds % (1000 * 60 * 60);

  // Calculate minutes
  const minutes = Math.floor(remainingMinutes / (1000 * 60));

  return {
    days,
    hours,
    minutes,
  };
}

let thumb = false;
const Gallery = ({
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

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (thumb == false) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };
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
    fjGallery(document.querySelectorAll(".gallery"), {
      itemSelector: ".gallery__item",
      rowWeight: "100%",
      lastRow: "start",
      gutter: 2,
      rowHeightTolerance: 0.1,
      calculateItemsHeight: false,
    });
  }, [data, imgLoad]);

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };

    thumb = false;
    setPage(lang == "th" ? "คลังรูปของข้าวฟ่าง" : "Gallery of Kaofrang");
    fetch(process.env.REACT_APP_APIE + "/kfsite/getgallery", requestOptions)
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
              : "The universe of Kaofrang's Gallery by KorKaofrang Team Support. Provided by Google Drive"
          }
        />
        <div className="container mt-3">
          {data != null ? (
            <>
              <Box sx={{ display: "block" }}>
                <LightGallery
                  plugins={[lgZoom]}
                  mode="lg-fade"
                  pager={false}
                  thumbnail={true}
                  autoplayFirstVideo={false}
                  isMobile={true}
                  onInit={() =>
                    setImgLoad(true)
                  }
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
                        "&sz=w800"
                      }
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
                        data-aos="fade-in"
                        data-aos-duration="1500"
                        className="img-responsive"
                        src={
                          "https://drive.google.com/thumbnail?id=" +
                          item.id +
                          "&sz=w400"
                        }
                      />
                    </a>
                  ))}
                </LightGallery>
              </Box>
              <Box sx={{ display: imgLoad ? "none" : "initial" }}>
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
              </Box>
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
export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
