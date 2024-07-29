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
  Tabs,
  Tab,
  Typography,
  CardMedia,
  List,
  Dialog,
  ListItem,
  Chip,
  Slide,
  Skeleton,
  AppBar,
  Toolbar,
  IconButton,
  CardActionArea,
  Divider,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import moment from "moment";
import { Carousel as MobileCarousel } from "react-responsive-carousel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Discography = ({ currentPage, lang, setLang, setPage }) => {
  const [width, setRealwidth] = React.useState(window.innerWidth);
  const [data1, setData1] = React.useState(null);
  const [data2, setData2] = React.useState(null);
  const [ix, setIx] = React.useState(0);

  const [clip, setClip] = React.useState(null);

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };
    setIx(0);
    setData1(null);
    setPage(lang == "th" ? "ผลงานเพลงและการแสดง" : "Discography and Acting");
    fetch(
      "https://cpxdevweb.onrender.com/kfsite/kfspotplay?l=" + lang,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setData1(result.res.tracks.items);
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
    fetch("https://cpxdevweb.onrender.com/kfsite/kfytplay", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setData2(result.items);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Box sx={{ marginTop: { xs: 0, md: 15 }, marginBottom: 15 }}>
      <CardHeader
        title={<h3>Discography and Acting of Kaofrang</h3>}
        subheader={
          lang == "th"
            ? "ผลงานที่ผ่านมาของน้องข้าวฟ่าง (อ้างอิงจาก Spotify และ Youtube)"
            : "All Discography and Acting of Kaofrang Yanisa or Kaofrang BNK48 (From Spotify and Youtube)"
        }
      />
      <div className="container">
        {data1 != null ? (
          <Grid container spacing={2}>
            <CardHeader
              title={lang == "th" ? "แฟรงเพลย์" : "'Frang Play"}
              subheader={
                lang == "th"
                  ? "ผลงานเพลงน้องข้าวฟ่าง (อ้างอิงจาก Spotify)"
                  : "All Discography and Single of Kaofrang Yanisa or Kaofrang BNK48 (From Spotify)"
              }
            />
            <Box className="ml-1" data-aos="zoom-in-down" sx={{ display: { sm: 'initial', xs: 'none' } }}>
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
            <Box className="ml-1" sx={{ display: { sm: 'none', xs: 'initial' } }}>
              {data1.length > 0 &&
                data1.map((item, i) => (
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
          <Grid container spacing={2}>
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
            {data2.map((item, i) => (
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
                <Grid item md sx={{ display: "flex", flexDirection: "column" }}>
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
            ))}
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
      </div>
      <Dialog fullScreen open={clip != null} TransitionComponent={Transition}>
        {clip != null && (
          <>
            <AppBar sx={{ position: "relative" }}>
              <Toolbar>
                <CardHeader sx={{ flex: 1, paddingTop: 2 }} title={<h5 className="text-break">{clip.snippet.title}</h5>} subheader={<small>{lang == "th" ? "อัปโหลดโดย " : "Uploaded by "}{" "}
                  {clip.snippet.videoOwnerChannelTitle}</small>} />
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
                  height: 400,
                }}
                component="iframe"
                image={
                  "https://youtube.com/embed/" + clip.snippet.resourceId.videoId
                }
                alt={"clip-" + clip.snippet.title}
              />
              <Divider />
              <Card component={CardContent} className="mt-3">
                <Typography
                  data-aos="fade-in"
                  variant="p"
                  color="text.primary"
                  className="mt-2 text-break"
                  dangerouslySetInnerHTML={{
                    __html:
                      (lang == "th" ? "รายละเอียด: " : "Description: ") +
                      clip.snippet.description.replace(/\n/g, "<br />"),
                  }}></Typography>
              </Card>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Discography);
