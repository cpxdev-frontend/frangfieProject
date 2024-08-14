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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
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
import ReactGA from 'react-ga4';

mapboxgl.accessToken =
  "pk.eyJ1IjoiY3B4dGgyMDE3IiwiYSI6ImNsZHY0MzN6bTBjNzEzcXJmamJtN3BsZ3AifQ.mYNwWaYKsiLeYXngFDtaWQ";

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

const Trend = ({ currentPage, lang, setLang, setLaunch, setPage, launch }) => {
  const [data, setData] = React.useState(null);
  const [fet, setFetch] = React.useState(false);
  const [unix, setUnix] = React.useState(launch);

  const RefreshDate = () => {
    setFetch(false);
    fetch("https://cpxdevnode.onrender.com/auth/getunix", {})
      .then((response) => response.json())
      .then((result) => {
        setLaunch();
        setUnix(result.unix);
        setTimeout(() => {
          setFetch(true);
        }, 10000);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };

    RefreshDate();
    setPage(lang == "th" ? "ดันเทรน" : "Trend for Kaofrang");
    fetch(
      process.env.REACT_APP_APIE + "/kfsite/tagboost?data=kf",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.response);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
      <CardHeader
        title={<h3>Start Trend</h3>}
        subheader={
          lang == "th"
            ? "ร่วมดันเทรน (ปั่นแท็ก) กิจกรรมของข้าวฟ่างไปด้วยกัน"
            : "Let's join to growth trend of X tag(s) about Kaofrang events."
        }
        action={
          fet == true ? (
            <IconButton onClick={() => RefreshDate()}>
              <RefreshRounded />
            </IconButton>
          ) : null
        }
      />
      <div className="container mt-3">
        {data != null ? (
          <>
            {data.length > 0 ? (
              data.map((item, i) => (
                <Card
                  key={item.trendId}
                  className="mb-3"
                  data-aos="zoom-in-right">
                  <CardContent
                    sx={{
                      opacity: item.end > 0 && launch >= item.end ? 0.4 : 1,
                    }}>
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
                                lang == "th" ? "DD MMMM YYYY" : "MMMM DD, YYYY"
                              )}
                          </p>
                        )}
                        <p className="mt-4">
                          {lang == "th" ? "รายละเอียดกิจกรรม" : "Description"}:{" "}
                          {item.desc[lang]}
                        </p>
                        <p className="mt-4" style={{ wordWrap: "break-word" }}>
                          {lang == "th" ? "แท็กที่ใช้" : "Available Tags"}:
                          {unix >= item.start && (
                            <Box
                              sx={{
                                display:
                                  item.tags > 3
                                    ? "initial"
                                    : { xs: "initial", lg: "none" },
                              }}>
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
                                target="_blank">
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
                        {unix < item.start ? (
                          <Button
                            variant="outlined"
                            onClick={() => {
                              ReactGA.event({
                                category: "User",
                                action: "Trend link copied",
                              });
                              navigator.clipboard.writeText(
                                "https://cpxstatusservice.azurewebsites.net/kaofrangfie/trend/" +
                                  item.trendId
                              );
                              alert(
                                lang == "th"
                                  ? "คัดลอกลิงก์แล้ว"
                                  : "Copied link to clipboard"
                              );
                            }}
                            className="mt-3">
                            {lang == "th" ? "คัดลอกลิงก์" : "Copy Link"}
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            onClick={() => {
                              ReactGA.event({
                                category: "User",
                                action: "Trend link access",
                              });
                              window.open(
                                "https://cpxstatusservice.azurewebsites.net/kaofrangfie/trend/" +
                                  item.trendId,
                                "_blank"
                              );
                            }}
                            className="mt-3">
                            {lang == "th" ? "เริ่มเทรน" : "Start Trend"}
                          </Button>
                        )}
                      </Grid>
                    </Grid>
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
    </Box>
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
export default connect(mapStateToProps, mapDispatchToProps)(Trend);
