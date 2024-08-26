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
import lgVideo from "lightgallery/plugins/video";
import fjGallery from "flickr-justified-gallery";

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

const Gallery = ({
  currentPage,
  lang,
  setLang,
  setLaunch,
  setPage,
  launch,
}) => {
  const [dataMob, setMob] = React.useState([]);
  const [data, setData] = React.useState(null);
  const [fet, setFetch] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef(null);
  const [galleryContainer, setGalleryContainer] = React.useState(null);

  const onInit = React.useCallback(
    (detail) => {
      if (detail) {
        // lightGalleryRef.current = detail.instance;
        detail.instance.openGallery();
      }
    },
    [data]
  );

  React.useEffect(() => {
    if (containerRef.current) {
      setGalleryContainer("aaa");
    }
  }, []);

  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    if (data != null) {
      fjGallery(document.querySelectorAll(".gallery"), {
        itemSelector: ".gallery__item",
        rowHeight: 180,
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
              <Box className={data == null ? "d-
                            "" : ""}>
                <LightGallery
                  className="pb-3"
                  plugins={[lgZoom, lgVideo]}
                  mode="lg-fade"
                  pager={false}
                  thumbnail={true}
                  galleryId={"nature"}
                  autoplayFirstVideo={false}
                  elementClassNames={"gallery"}>
                  {data.map((item, i) => (
                    <a
                      key={item.id}
                      data-aos="zoom-in"
                      data-lg-size="1600-2400"
                      className="gallery__item"
                      data-src={item.thumbnailLink.replace("=s220", "=s800")}
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
                      }>
                      <img
                        className="img-responsive"
                        src={item.thumbnailLink.replace("=s220", "=s400")}
                      />
                    </a>
                  ))}
                </LightGallery>
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
