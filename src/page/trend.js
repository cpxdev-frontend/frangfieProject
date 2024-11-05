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
  Menu,
  MenuItem,
  DialogContentText,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import Swal from "sweetalert2";
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

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/trend";
import stepTh from "../stepGuide/th/trend";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY3B4dGgyMDE3IiwiYSI6ImNsZHY0MzN6bTBjNzEzcXJmamJtN3BsZ3AifQ.mYNwWaYKsiLeYXngFDtaWQ";

function compareTimestamps(timestamp1, timestamp2) {
  // Get the difference in milliseconds
  const difference = timestamp2 * 1000 - timestamp1 * 1000;

  // Calculate days
  const days =
    difference / (1000 * 60 * 60 * 24) >
    Math.floor(difference / (1000 * 60 * 60 * 24))
      ? Math.floor(difference / (1000 * 60 * 60 * 24))
      : Math.floor(difference / (1000 * 60 * 60 * 24)) - 1;

  // Get remaining milliseconds after removing days
  const remainingMilliseconds = difference % (1000 * 60 * 60 * 24);

  // Calculate hours
  const hours =
    remainingMilliseconds / (1000 * 60 * 60) >
    Math.floor(remainingMilliseconds / (1000 * 60 * 60))
      ? Math.floor(remainingMilliseconds / (1000 * 60 * 60))
      : Math.floor(remainingMilliseconds / (1000 * 60 * 60)) - 1;

  // Get remaining milliseconds after removing hours
  const remainingMinutes = remainingMilliseconds % (1000 * 60 * 60);

  // Calculate minutes
  const minutes =
    remainingMinutes / (1000 * 60) > Math.round(remainingMinutes / (1000 * 60))
      ? Math.round(remainingMinutes / (1000 * 60)) + 1
      : Math.round(remainingMinutes / (1000 * 60));

  return {
    days,
    hours,
    minutes,
  };
}

function comma(number) {
  const formatter = new Intl.NumberFormat("en-US");
  const formattedNumber = formatter.format(number);
  return formattedNumber;
}

const Trend = ({
  currentPage,
  lang,
  setLang,
  setLaunch,
  setPage,
  launch,
  guide,
}) => {
  const [data, setData] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const editor = Boolean(anchorEl);
  const [unix, setUnix] = React.useState(launch);
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [tid, setTid] = React.useState(null);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    setUnix(launch);
  }, [launch]);

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };

    setPage(lang == "th" ? "ดันเทรน" : "Trend for Kaofrang");
    fetch(
      process.env.REACT_APP_APIE_2 + "/kfsite/tagboost?data=kf",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.response);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const startTrendData = (trend, w) => {
    var requestOptions = {
      method: "POST",
    };

    setLoad(true);
    fetch(
      process.env.REACT_APP_APIE + "/kfsite/trend?way=" + w + "&trendid=" + trend,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLoad(false);
        if (result.status) {
          window.open(result.url, '_blank');
        } else {
          if (result.icon == "warning") {
            if (result.code == 2) {
              Swal.fire({
                title:
                  lang == "th"
                    ? "เทรนใกล้เริ่มแล้ว กรุณารอสักครู่"
                    : "Trend almost ready soon. Please come back later",
                icon: "warning",
              });
            } else {
              Swal.fire({
                title:
                  lang == "th"
                    ? "เทรนนี้สิ้นสุดแล้ว กรุณาติดตามกิจกรรมใหม่ได้ในครั้งต่อไป"
                    : "Trend is ended. Thank you for coming.",
                icon: "warning",
              });
            }
          } else {
            Swal.fire({
              title: result.code,
              icon: result.icon,
            });
          }
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader
          title={<h3>Start Trend</h3>}
          data-tour="trend"
          subheader={
            lang == "th"
              ? "ร่วมดันเทรน (ปั่นแท็ก) กิจกรรมของข้าวฟ่างไปด้วยกัน"
              : "Let's join to growth trend of X tag(s) about Kaofrang events."
          }
        />
        <div className="container mt-3">
          {data != null ? (
            <>
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
              {data.length > 0 ? (
                data.map((item, i) => (
                  <Card
                    key={item.trendId}
                    className="mb-3"
                    data-aos-delay="600"
                    data-aos="zoom-in-right"
                  >
                    <CardContent
                      sx={{
                        opacity: item.end > 0 && launch >= item.end ? 0.4 : 1,
                      }}
                    >
                      <CardHeader
                        className="pl-0 pb-0"
                        title={<h4>{item.title}</h4>}
                        action={
                          unix < item.start && (
                            <Chip
                              className="p-1"
                              sx={{ display: { xs: "none", lg: "initial" } }}
                              label={
                                lang == "th"
                                  ? "กำลังเริ่มต้นในอีก " +
                                    compareTimestamps(unix, item.start).days +
                                    " วัน " +
                                    compareTimestamps(unix, item.start).hours +
                                    " ชั่วโมง " +
                                    compareTimestamps(unix, item.start)
                                      .minutes +
                                    " นาที"
                                  : "Event start in " +
                                    compareTimestamps(unix, item.start).days +
                                    " day(s) " +
                                    compareTimestamps(unix, item.start).hours +
                                    " hr(s) " +
                                    compareTimestamps(unix, item.start)
                                      .minutes +
                                    " minute(s)"
                              }
                              color="primary"
                            />
                          )
                        }
                      />
                      {unix < item.start && (
                        <Chip
                          sx={{
                            display: { xs: "inline-block", lg: "none" },
                            marginTop: 1,
                            padding: 0,
                            paddingTop: ".4rem",
                          }}
                          label={
                            lang == "th"
                              ? "กำลังเริ่มต้นในอีก " +
                                compareTimestamps(unix, item.start).days +
                                " วัน " +
                                compareTimestamps(unix, item.start).hours +
                                " ชั่วโมง " +
                                compareTimestamps(unix, item.start).minutes +
                                " นาที"
                              : "Event start in " +
                                compareTimestamps(unix, item.start).days +
                                " day(s) " +
                                compareTimestamps(unix, item.start).hours +
                                " hr(s) " +
                                compareTimestamps(unix, item.start).minutes +
                                " minute(s)"
                          }
                          color="primary"
                        />
                      )}
                      <hr />
                      <Grid container spacing={2}>
                        {item.img != undefined &&
                          item.img != null &&
                          item.img != "" && (
                            <Grid item lg={5} xs={12}>
                              <Avatar
                                src={item.img}
                                variant="rounded"
                                sx={{
                                  width: { lg: "400px", xs: "100%" },
                                  height: "100%",
                                }}
                              />
                            </Grid>
                          )}
                        <Grid item lg={7} xs={12}>
                          {/* {unix >= item.start && (
                            <Chip
                              label={
                                (lang == "th"
                                  ? "การเข้าร่วมเทรนตอนนี้ "
                                  : "Current trend hit are ") +
                                comma(item.boost) +
                                (lang == "th" ? " ครั้ง " : " times")
                              }
                              color="primary"
                              variant="outlined"
                              className="mb-4"
                            />
                          )} */}
                          {item.start > 0 &&
                          item.end > 0 &&
                          moment
                            .unix(item.start)
                            .local()
                            .format("MMMM DD, YYYY") ===
                            moment
                              .unix(item.end)
                              .local()
                              .format("MMMM DD, YYYY") ? (
                            <p>
                              {lang == "th"
                                ? "ช่วงเวลาของเทรน"
                                : "Trend duration"}
                              :{" "}
                              {moment
                                .unix(item.start)
                                .lang(lang)
                                .local()
                                .format(
                                  lang == "th"
                                    ? "DD MMMM YYYY เวลา HH:mm"
                                    : "MMMM DD, YYYY HH:mm"
                                )}
                              {lang == "th" ? " ถึง " : " to "}
                              {moment
                                .unix(item.end)
                                .lang(lang)
                                .local()
                                .format("HH:mm")}
                            </p>
                          ) : item.start > 0 &&
                            item.end > 0 &&
                            moment
                              .unix(item.start)
                              .local()
                              .format("MMMM DD, YYYY") !==
                              moment
                                .unix(item.end)
                                .local()
                                .format("MMMM DD, YYYY") ? (
                            <p>
                              {lang == "th"
                                ? "ช่วงเวลาของเทรน"
                                : "Trend duration"}
                              :{" "}
                              {moment
                                .unix(item.start)
                                .lang(lang)
                                .local()
                                .format(
                                  lang == "th"
                                    ? "DD MMMM YYYY เวลา HH:mm"
                                    : "MMMM DD, YYYY HH:mm"
                                )}
                              {lang == "th" ? " ถึง " : " to "}
                              {moment
                                .unix(item.end)
                                .lang(lang)
                                .local()
                                .format(
                                  lang == "th"
                                    ? "DD MMMM YYYY เวลา HH:mm"
                                    : "MMMM DD, YYYY HH:mm"
                                )}
                            </p>
                          ) : (
                            <p>
                              {lang == "th"
                                ? "วันที่เริ่มต้นกิจกรรม "
                                : "Event start on "}{" "}
                              {moment
                                .unix(item.start)
                                .lang(lang)
                                .local()
                                .format(
                                  lang == "th"
                                    ? "DD MMMM YYYY"
                                    : "MMMM DD, YYYY"
                                )}
                            </p>
                          )}
                          <p className="mt-4">
                            {lang == "th" ? "รายละเอียดกิจกรรม" : "Description"}
                            : {item.desc[lang]}
                          </p>
                          <p
                            className="mt-4"
                            style={{ wordWrap: "break-word" }}
                          >
                            {lang == "th" ? "แท็กที่ใช้" : "Available Tags"}:
                            {unix >= item.start && (
                              <Box
                                sx={{
                                  display:
                                    item.tags > 3
                                      ? "initial"
                                      : { xs: "initial", lg: "none" },
                                }}
                              >
                                <br />
                              </Box>
                            )}
                            {unix >= item.start ? (
                              item.tags.map((txt) => (
                                <a
                                  href={
                                    "https://x.com/hashtag/" +
                                    txt +
                                    "?src=hashtag_click&f=live"
                                  }
                                  className="ml-1"
                                  target="_blank"
                                >
                                  #{txt}
                                </a>
                              ))
                            ) : (
                              <span>
                                {lang == "th"
                                  ? " ใกล้เริ่มเทรนแล้ว"
                                  : " Almost ready"}
                              </span>
                            )}
                          </p>
                          {item.start > 0 && item.end > 0 && (
                            <small>
                              <i>
                                {lang == "th" ? "หมายเหตุ" : "Notes"}:{" "}
                                {lang == "th"
                                  ? "ช่วงเวลาของกิจกรรมอ้างอิงตามโซนเวลาของอุปกรณ์"
                                  : "Event time duration are based on device timezone."}
                              </i>
                            </small>
                          )}
                          <br />
                          <Button
                            variant="outlined"
                            onClick={(e) => {
                              ReactGA.event({
                                category: "User",
                                action: "Trend link access",
                              });
                              setTid(item.trendId);
                              setAnchorEl(e.currentTarget)
                            }}
                            className="mt-3"
                          >
                            {lang == "th" ? "เริ่มเทรน" : "Start Trend"}
                          </Button>
                        </Grid>
                      </Grid>
                    <Menu
                      open={editor}
                      anchorEl={anchorEl}
                      onClick={() => setAnchorEl(null)}
                    >
                      <MenuItem onClick={() => startTrendData(tid, 'x')}>
                        X (Twitter)
                      </MenuItem>
                      <MenuItem onClick={() => startTrendData(tid, 'face')}>
                        Facebook
                      </MenuItem>
                    </Menu>
                    </CardContent>
                    {/* {!(
                  checktime(item).prepare == 0 && checktime(item).launch == 0
                ) &&
                  item.end > 0 &&
                  launch < item.end && (
                    <LinearProgress
                      sx={{ width: "100%", height: window.innerHeight * 0.02 }}
                      variant="buffer"
                      value={checktime(item).launch}
                      valueBuffer={checktime(item).prepare}
                    />
                  )} */}
                  </Card>
                ))
              ) : (
                <Box component={Card} className="p-5 text-center">
                  <Typography variant="h5">
                    {lang == "th"
                      ? "ไม่พบเทรนในช่วงนี้"
                      : "Not found any trend(s) soon."}
                  </Typography>
                </Box>
              )}
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}
        >
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
  setPage: (val) => dispatch(setPage(val)),
  setLaunch: (val) => dispatch(setLaunch(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Trend);
