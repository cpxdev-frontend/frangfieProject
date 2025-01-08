import React from "react";
import { connect } from "react-redux";
import {
  Card,
  CardContent,
  Fade,
  CardHeader,
  Button,
  Grid,
  CardActions,
  Box,
  Chip,
  Tab,
  Typography,
  CardMedia,
  List,
  Dialog,
  ListItem,
  Pagination,
  Slide,
  Skeleton,
  AppBar,
  Toolbar,
  IconButton,
  CardActionArea,
  Divider,
  DialogContent,
} from "@mui/material";
import CountUp from "react-countup";
import "../iframenormal.css";
import CloseIcon from "@mui/icons-material/Close";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import moment from "moment";
import { Carousel as MobileCarousel } from "react-responsive-carousel";
import usePagination from "../pagination";
import Swal from "sweetalert2";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/disco";
import stepTh from "../stepGuide/th/disco";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function convertUrlsAndHashtagsToLinks(text) {
  // Regular expressions to match URLs and hashtags
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;
  const hashtagRegex = /#([A-Zกa-z\u0E00-\u0E7F\w0-9_]+)/g;

  // Replace URLs with clickable links
  text = text.replace(urlRegex, function (match) {
    return (
      '<a class="App-link" href="' +
      match +
      '" target="_blank">' +
      match +
      "</a>"
    );
  });

  // Replace hashtags with clickable links
  text = text.replace(hashtagRegex, function (match, hashtag) {
    return (
      '<a class="App-link" href="https://x.com/hashtag/' +
      hashtag +
      '?src=hashtag_click&f=live" target="_blank">' +
      match +
      "</a>"
    );
  });

  return text;
}

const Discography = ({ currentPage, lang, setLang, setPage, guide }) => {
  const [width, setRealwidth] = React.useState(window.innerWidth);
  const [data1, setData1] = React.useState(null);
  const [data2, setData2] = React.useState(null);
  const [sam1, setSam1] = React.useState([]);
  const [sam2, setSam2] = React.useState([]);
  const [ix, setIx] = React.useState(0);
  const [pageset1, setPagin1] = React.useState(1);
  const [pageset2, setPagin2] = React.useState(1);
  const PER_PAGE = 8;
  const [clip, setClip] = React.useState(null);
  const [view, setView] = React.useState(null);

  const music = React.useRef(null);
  const content = React.useRef(null);

  let count1 = Math.ceil(sam1.length / PER_PAGE);
  let _DATA1 = usePagination(sam1, PER_PAGE);

  const handleChange1 = (e, p) => {
    if (music.current) {
      music.current.scrollIntoView({ behavior: "smooth" });
    }
    setPagin1(p);
    _DATA1.jump(p);
  };

  let count2 = Math.ceil(sam2.length / PER_PAGE);
  let _DATA2 = usePagination(sam2, PER_PAGE);

  const handleChange2 = (e, p) => {
    if (content.current) {
      content.current.scrollIntoView({ behavior: "smooth" });
    }
    setPagin2(p);
    _DATA2.jump(p);
  };

  const [open, setOpen] = React.useState(false);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };
    setIx(0);
    setData1(null);
    setPage(lang == "th" ? "ผลงานเพลงและการแสดง" : "Discography and Acting");
    fetch(
      process.env.REACT_APP_APIE + "/kfsite/kfspotplay?l=" + lang,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setData1(result.res.tracks.items);
        setSam1(result.res.tracks.items);
      })
      .catch((error) => console.log("error", error));
  }, [lang]);
  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };
    function handleWindowResize() {
      setRealwidth(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowResize);
    setData2(null);
    fetch(process.env.REACT_APP_APIE_2 + "/kfsite/kfytplay", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setData2(result.items);
        setSam2(result.items);
      })
      .catch((error) => console.log("error", error));
  }, []);

  React.useEffect(() => {
    if (clip != null) {
      var requestOptions = {
        method: "POST",
      };

      setTimeout(() => {
        fetch(
          process.env.REACT_APP_APIE_2 +
            "/kfsite/ytviewCount?id=" +
            clip.snippet.resourceId.videoId,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            setView(parseInt(result));
          })
          .catch((error) => console.log("error", error));
      }, 400);
    } else {
      setView(null);
    }
    if (clip != null && navigator.connection != undefined) {
      if (
        navigator.connection.downlink < 3 ||
        navigator.connection.rtt >= 800
      ) {
        Swal.fire({
          title: "This content may require a faster internet connection.",
          text:
            lang == "th"
              ? "การรับชมคลิปคอนเทนต์จำเป็นต้องใช้อินเทอร์เน็ตความเร็วสูงมากกว่านี้เพื่อการรับชมที่ลื่นไหลขึ้น"
              : "Watching content videos requires a higher internet speed for smoother video contents.",
          icon: "warning",
        });
      }
    }
  }, [clip]);

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 15 }, marginBottom: 15 }}>
        <CardHeader
          title={<h3>Discography and Acting of Kaofrang</h3>}
          data-tour="disco-1"
          subheader={
            lang == "th"
              ? "ผลงานที่ผ่านมาของน้องข้าวฟ่าง (อ้างอิงจาก Spotify และ Youtube)"
              : "All Discography and Acting of Kaofrang Yanisa or Kaofrang BNK48 (From Spotify and Youtube)"
          }
        />
        <div className="container">
          {data1 != null ? (
            <Grid container spacing={2} data-tour="disco-2">
              <CardHeader
                title={lang == "th" ? "แฟรงเพลย์" : "'Frang Play"}
                subheader={
                  lang == "th"
                    ? "ผลงานเพลงน้องข้าวฟ่าง (อ้างอิงจาก Spotify)"
                    : "All Discography and Single of Kaofrang Yanisa or Kaofrang BNK48 (From Spotify)"
                }
              />
              <Box
                className="ml-1"
                data-aos="zoom-in-down"
                sx={{ display: { md: "initial", xs: "none" } }}>
                <MobileCarousel
                  autoPlay
                  centerMode
                  centerSlidePercentage={
                    data1.length > 0
                      ? width < 700
                        ? 80
                        : width >= 700 && width < 1150
                        ? 50
                        : 30
                      : 100
                  }
                  infiniteLoop
                  showArrows
                  showIndicators={false}
                  swipeable={true}
                  showStatus={false}
                  interval={8000}
                  onChange={(e) => setIx(e)}>
                  {data1.length > 0 &&
                    data1.map((item, i) => (
                      <Card
                        key={"home-" + item.track.id}
                        data-tempid={item.track.id}
                        className="m-2"
                        sx={{ backgroundColor: "transperent" }}>
                        <CardActionArea className="cro-container">
                          <CardMedia
                            src={item.track.album.images[0].url}
                            width={500}
                            component="img"
                          />
                          {ix == i && (
                            <Card data-aos="fade-in">
                              <CardHeader
                                title={<h4>{item.track.name}</h4>}
                                subheader={item.track.artists[0].name}
                              />
                              <CardActions>
                                <Button
                                  className="bg-success text-light"
                                  size="large"
                                  onClick={() =>
                                    window.open(
                                      item.track.external_urls.spotify,
                                      "_blank"
                                    )
                                  }>
                                  {lang == "th"
                                    ? "ฟังเพลงนี้บน Spotify"
                                    : "Listening on Spotify"}
                                </Button>
                              </CardActions>
                            </Card>
                          )}
                        </CardActionArea>
                      </Card>
                    ))}
                </MobileCarousel>
              </Box>
              <Box
                className="ml-1"
                ref={music}
                sx={{ display: { md: "none", xs: "initial" } }}>
                {data1.length > PER_PAGE && (
                  <div className="col-md-12 d-flex justify-content-center mb-3">
                    <Pagination
                      count={count1}
                      size="large"
                      page={pageset1}
                      onChange={handleChange1}
                    />
                  </div>
                )}
                {data1.length > 0 &&
                  _DATA1.currentData().map((item, i) => (
                    <Card
                      data-aos="fade-right"
                      key={"home-" + item.track.id}
                      data-tempid={item.track.id}
                      className="m-3"
                      sx={{ backgroundColor: "transperent" }}>
                      <CardActionArea className="cro-container">
                        <CardMedia
                          src={item.track.album.images[0].url}
                          width={500}
                          component="img"
                        />
                        <Card data-aos="fade-in">
                          <CardHeader
                            title={<h4>{item.track.name}</h4>}
                            subheader={item.track.artists[0].name}
                          />
                          <CardActions>
                            <Button
                              className="bg-success text-light"
                              size="large"
                              onClick={() =>
                                window.open(
                                  item.track.external_urls.spotify,
                                  "_blank"
                                )
                              }>
                              {lang == "th"
                                ? "ฟังเพลงนี้บน Spotify"
                                : "Listening on Spotify"}
                            </Button>
                          </CardActions>
                        </Card>
                      </CardActionArea>
                    </Card>
                  ))}
                {data1.length > PER_PAGE && (
                  <div className="col-md-12 d-flex justify-content-center mb-3">
                    <Pagination
                      count={count1}
                      size="large"
                      page={pageset1}
                      onChange={handleChange1}
                    />
                  </div>
                )}
              </Box>
            </Grid>
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
          <div className="mt-5" />
          {data2 != null ? (
            <Grid container spacing={2} ref={content} data-tour="disco-3">
              <CardHeader
                title={
                  lang == "th" ? "ห้องนั่งเล่นของข้าวฟ่าง" : "'Frang Playground"
                }
                subheader={
                  lang == "th"
                    ? "ผลงานเพลงและคอนเทนท์ของน้องข้าวฟ่าง (อ้างอิงจาก Youtube)"
                    : "All Discography and original contents of Kaofrang Yanisa or Kaofrang BNK48 (From Youtube)"
                }
              />
              {data2.length > PER_PAGE && (
                <div className="col-md-12 d-flex justify-content-center mb-3">
                  <Pagination
                    count={count2}
                    size="large"
                    page={pageset2}
                    onChange={handleChange2}
                  />
                </div>
              )}
              {_DATA2.currentData().map(
                (item, i) =>
                  item.snippet.title !== "Deleted video" &&
                  item.snippet.description !== "This video is unavailable." && (
                    <Card
                      data-aos="fade-right"
                      component={Grid}
                      className="mb-3 ml-3 ml-lg-0"
                      container
                      key={item.snippet.resourceId.videoId}>
                      <Grid xs={12}>
                        <CardMedia
                          sx={{ width: "100%" }}
                          component="img"
                          image={item.snippet.thumbnails.maxres.url}
                          alt={item.snippet.title}
                        />
                      </Grid>
                      <Grid
                        item
                        md
                        sx={{ display: "flex", flexDirection: "column" }}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography
                            component="div"
                            variant="h5"
                            sx={{ fontSize: 22 }}>
                            <b>{item.snippet.title}</b>
                          </Typography>
                          <small className="text-muted">
                            {lang == "th" ? "อัปโหลดโดย " : "Uploaded by "}{" "}
                            {item.snippet.videoOwnerChannelTitle}
                          </small>
                          <hr />
                          <CardActionArea className="mt-5">
                            <Button
                              variant="outlined"
                              className="text-success border-success m-1"
                              onClick={() => setClip(item)}>
                              {lang == "th" ? "รับชมคลิป" : "View Content"}
                            </Button>
                            <Button
                              variant="outlined"
                              className="text-primary border-primary m-1"
                              onClick={() =>
                                window.open(
                                  "https://youtube.com/channel/" +
                                    item.snippet.videoOwnerChannelId,
                                  "_blank"
                                )
                              }>
                              {lang == "th"
                                ? "รับชมรายการอื่น"
                                : "View other contents"}
                            </Button>
                          </CardActionArea>
                        </CardContent>
                      </Grid>
                    </Card>
                  )
              )}
              {data2.length > PER_PAGE && (
                <div className="col-md-12 d-flex justify-content-center mb-3">
                  <Pagination
                    count={count2}
                    size="large"
                    page={pageset2}
                    onChange={handleChange2}
                  />
                </div>
              )}
            </Grid>
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
          {data1 != null && data2 != null && (
            <Joyride
              steps={lang == "th" ? stepTh : stepEn}
              continuous
              run={guide}
              styles={{
                options: {
                  arrowColor: "#fb61ee",
                  backgroundColor: "#f1cef2",
                  primaryColor: "#f526fc",
                  textColor: "#000",
                },
              }}
            />
          )}
        </div>
        <Dialog
          fullScreen
          open={clip != null}
          PaperProps={{
            sx: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
          }}
          TransitionComponent={Transition}>
          {clip != null && (
            <>
              <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                  <CardHeader
                    sx={{ flex: 1, paddingTop: 2 }}
                    title={<h5 className="text-break">{clip.snippet.title}</h5>}
                    subheader={
                      <small>
                        {lang == "th" ? "อัปโหลดโดย " : "Uploaded by "}{" "}
                        {clip.snippet.videoOwnerChannelTitle}
                      </small>
                    }
                  />
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => setClip(null)}
                    aria-label="close">
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <DialogContent>
                <CardMedia
                  data-aos="zoom-in-down"
                  sx={{
                    width: "100%",
                    height: { md: "70vh", xs: "50vh" },
                    position: "initial",
                    left: 0,
                  }}
                  component="iframe"
                  src={
                    "https://youtube.com/embed/" +
                    clip.snippet.resourceId.videoId
                  }
                  alt={"clip-" + clip.snippet.title}
                />
                <Divider />
                <Card component={CardContent} className="mt-3">
                  {view != null ? (
                    <Chip
                      color="primary"
                      className="mb-2"
                      variant="outlined"
                      label={
                        <Box sx={{ fontWeight: "bold" }}>
                          <CountUp end={view} onEnd={() => {}} duration={3} />{" "}
                          Views on Youtube
                        </Box>
                      }></Chip>
                  ) : (
                    <Skeleton
                      variant="text"
                      className="bg-m w-100"
                      sx={{ fontSize: "2rem" }}
                    />
                  )}
                  <br />
                  <Typography
                    data-aos="fade-in"
                    variant="p"
                    color="text.primary"
                    className="mt-2 text-break"
                    dangerouslySetInnerHTML={{
                      __html:
                        (lang == "th" ? "รายละเอียด: " : "Description: ") +
                        convertUrlsAndHashtagsToLinks(
                          clip.snippet.description.replace(/\n/g, "<br />")
                        ),
                    }}></Typography>
                </Card>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  guide: state.guide,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Discography);
