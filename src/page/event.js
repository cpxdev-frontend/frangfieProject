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
  Pagination,
  IconButton,
  Chip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setLaunch,
} from "../redux/action";
import moment from "moment";
import { RefreshRounded } from "@mui/icons-material";
import usePagination from "../pagination";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/event";
import stepTh from "../stepGuide/th/event";

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

const Event = ({ currentPage, lang, setLang, setLaunch, setPage, launch }) => {
  const [data, setData] = React.useState(null);
  const [sam, setSam] = React.useState([]);
  const [getData, setGetData] = React.useState(null);
  const [unix, setUnix] = React.useState(launch);
  const [fet, setFetch] = React.useState(false);
  const [pageset, setPagin] = React.useState(1);
  const PER_PAGE = 5;

  let count = Math.ceil(sam.length / PER_PAGE);
  let _DATA = usePagination(sam, PER_PAGE);

  const event = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  const handleChange = (e, p) => {
    if (event.current) {
      event.current.scrollIntoView({ behavior: "smooth" });
    }
    setPagin(p);
    _DATA.jump(p);
  };

  const RefreshDate = () => {
    setFetch(false);
    fetch("https://cpxdevnode.onrender.com/auth/getunix", {})
      .then((response) => response.json())
      .then((result) => {
        setLaunch(result.unix);
        setUnix(result.unix);
        setTimeout(() => {
          setFetch(true);
        }, 60000);
      })
      .catch((error) => console.log("error", error));
  };

  const getMap = (item) => {
    if (item.place.includes("IAMP")) {
      setGetData({
        locate: item.placeobj.placeCoodinate,
        place: item.placeobj.ref,
      });
    } else {
      setGetData({
        place: item.place,
        locate: item.locate,
      });
    }
  };

  const checkeventtype = (obj) => {
    if (obj.locate == null && obj.place == "") {
      return lang == "th" ? "กิจกรรมเข้าร่วมแบบออนไลน์" : "Online event";
    } else {
      if (obj.link != "") {
        return lang == "th" ? "กิจกรรมเปิด" : "Full event";
      } else {
        return lang == "th" ? "กิจกรรมเข้าร่วมแบบออฟไลน์" : "Offline event";
      }
    }
  };

  const checkeventstatus = (obj) => {
    if (obj.timerange[0] > 0 && obj.timerange[1] == 0) {
      if (unix >= obj.timerange[0]) {
        return lang == "th" ? "ปกติ" : "Normal";
      } else {
        return lang == "th" ? "กำลังจะมาถึง" : "Preparing";
      }
    } else {
      if (unix >= obj.timerange[0] && unix <= obj.timerange[1]) {
        return lang == "th" ? "ปกติ" : "Normal";
      } else if (unix > obj.timerange[1]) {
        return lang == "th" ? "สิ้นสุดแล้ว" : "All done";
      } else if (unix >= obj.timerange[0] - 432000 && unix < obj.timerange[0]) {
        const d = compareTimestamps(unix, obj.timerange[0]);
        return lang == "th" ? "ใกล้เริ่มต้นแล้ว" : "Incoming";
      } else {
        return lang == "th" ? "กำลังจะมาถึง" : "Coming soon";
      }
    }
  };
  const checktime = (obj) => {
    if (
      obj.timerange[0] > 0 &&
      obj.timerange[1] > 0 &&
      unix >= obj.timerange[0] - 432000 &&
      unix < obj.timerange[0]
    ) {
      const buffer =
        ((unix - (obj.timerange[0] - 432000)) /
          (obj.timerange[0] - (obj.timerange[0] - 432000))) *
        100;
      return {
        prepare: buffer,
        launch: 0,
      };
    } else if (
      obj.timerange[0] > 0 &&
      obj.timerange[1] > 0 &&
      unix >= obj.timerange[0] &&
      unix <= obj.timerange[1]
    ) {
      const ready =
        ((unix - obj.timerange[0]) / (obj.timerange[1] - obj.timerange[0])) *
        100;
      return {
        prepare: 100,
        launch: ready,
      };
    } else if (
      obj.timerange[0] > 0 &&
      obj.timerange[1] > 0 &&
      unix > obj.timerange[1]
    ) {
      return {
        prepare: 100,
        launch: 100,
      };
    }
    return {
      prepare: 0,
      launch: 0,
    };
  };

  React.useEffect(() => {
    console.log(getData);
  }, [getData]);

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };

    RefreshDate();
    setPage(lang == "th" ? "ข้อมูลกิจกรรม" : "Events of Kaofrang");
    fetch(process.env.REACT_APP_APIE + "/kfsite/listevent", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setGetData(undefined);
        setData(result);
        setSam(result);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }} ref={event}>
        <CardHeader
          title={<h3>Incoming Events of Kaofrang</h3>}
          subheader={
            lang == "th"
              ? "ข้าวฟ่างมีงานอะไรบ้างนะในช่วงนี้"
              : "See all Kaofrang Yanisa or Kaofrang BNK48 events here."
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
              {data.length > PER_PAGE && (
                <div className="col-md-12 d-flex justify-content-center mb-3">
                  <Pagination
                    count={count}
                    size="large"
                    page={pageset}
                    onChange={handleChange}
                  />
                </div>
              )}
              {_DATA.currentData().map((item, i) => (
                <Card
                  key={item.newsId}
                  data-tour="event"
                  className="mb-3"
                  data-aos="zoom-in-right">
                  <CardContent
                    sx={{
                      opacity:
                        item.timerange[1] > 0 && launch >= item.timerange[1]
                          ? 0.4
                          : 1,
                    }}>
                    <CardHeader
                      className="pl-0 pb-0"
                      title={<h4>{item.title}</h4>}
                      subheader={
                        <Chip
                          label={
                            (lang == "th"
                              ? "สถานะกิจกรรม: "
                              : "Event status: ") + checkeventstatus(item)
                          }
                          color="primary"
                        />
                      }
                      action={
                        item.timerange[0] > 0 &&
                        item.timerange[1] > 0 &&
                        unix >= item.timerange[0] - 432000 &&
                        unix < item.timerange[0] && (
                          <Chip
                            className="p-1"
                            sx={{ display: { xs: "none", lg: "initial" } }}
                            label={
                              lang == "th"
                                ? "กำลังเริ่มต้นในอีก " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .days +
                                  " วัน " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .hours +
                                  " ชั่วโมง " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .minutes +
                                  " นาที"
                                : "Event start in " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .days +
                                  " day(s) " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .hours +
                                  " hr(s) " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .minutes +
                                  " minute(s)"
                            }
                            color="primary"
                          />
                        )
                      }
                    />
                    {item.timerange[0] > 0 &&
                      item.timerange[1] > 0 &&
                      unix >= item.timerange[0] - 432000 &&
                      unix < item.timerange[0] && (
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
                                compareTimestamps(unix, item.timerange[0])
                                  .days +
                                " วัน " +
                                compareTimestamps(unix, item.timerange[0])
                                  .hours +
                                " ชั่วโมง " +
                                compareTimestamps(unix, item.timerange[0])
                                  .minutes +
                                " นาที"
                              : "Event start in " +
                                compareTimestamps(unix, item.timerange[0])
                                  .days +
                                " day(s) " +
                                compareTimestamps(unix, item.timerange[0])
                                  .hours +
                                " hr(s) " +
                                compareTimestamps(unix, item.timerange[0])
                                  .minutes +
                                " minute(s)"
                          }
                          color="primary"
                        />
                      )}
                    <hr />
                    <Grid container spacing={2}>
                      <Grid item lg={5} xs={12}>
                        <Avatar
                          src={item.src}
                          variant="rounded"
                          sx={{
                            width: { md: "400px", xs: "100%" },
                            height: "100%",
                          }}
                        />
                      </Grid>
                      <Grid item lg={7} xs={12}>
                        <h6 className="text-muted">
                          {lang == "th" ? "ประเภทกิจกรรม" : "Event Type"}:{" "}
                          {checkeventtype(item)}
                        </h6>
                        {item.timerange[0] > 0 &&
                        item.timerange[1] > 0 &&
                        moment
                          .unix(item.timerange[0])
                          .local()
                          .format("MMMM DD, YYYY") ===
                          moment
                            .unix(item.timerange[1])
                            .local()
                            .format("MMMM DD, YYYY") ? (
                          <p>
                            {lang == "th"
                              ? "ช่วงเวลาของกิจกรรม"
                              : "Event duration"}
                            :{" "}
                            {moment
                              .unix(item.timerange[0])
                              .lang(lang)
                              .local()
                              .format(
                                lang == "th"
                                  ? "DD MMMM YYYY เวลา HH:mm"
                                  : "MMMM DD, YYYY HH:mm"
                              )}
                            {lang == "th" ? " ถึง " : " to "}
                            {moment
                              .unix(item.timerange[1])
                              .lang(lang)
                              .local()
                              .format("HH:mm")}
                          </p>
                        ) : item.timerange[0] > 0 &&
                          item.timerange[1] > 0 &&
                          moment
                            .unix(item.timerange[0])
                            .local()
                            .format("MMMM DD, YYYY") !==
                            moment
                              .unix(item.timerange[1])
                              .local()
                              .format("MMMM DD, YYYY") ? (
                          <p>
                            {lang == "th"
                              ? "ช่วงเวลาของกิจกรรม"
                              : "Event duration"}
                            :{" "}
                            {moment
                              .unix(item.timerange[0])
                              .lang(lang)
                              .local()
                              .format(
                                lang == "th"
                                  ? "DD MMMM YYYY เวลา HH:mm"
                                  : "MMMM DD, YYYY HH:mm"
                              )}
                            {lang == "th" ? " ถึง " : " to "}
                            {moment
                              .unix(item.timerange[1])
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
                              .unix(item.timerange[0])
                              .lang(lang)
                              .local()
                              .format(
                                lang == "th" ? "DD MMMM YYYY" : "MMMM DD, YYYY"
                              )}
                          </p>
                        )}
                        <p className="mt-4">
                          {lang == "th" ? "รายละเอียดกิจกรรม" : "Description"}:{" "}
                          {lang == "th" ? item.desc2 : item.desc}
                        </p>
                        {item.timerange[0] > 0 && item.timerange[1] > 0 && (
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
                        {!(item.locate == null && item.place == "") && (
                          <Button
                            onClick={() => getMap(item)}
                            disabled={
                              item.timerange[1] > 0 &&
                              launch >= item.timerange[1]
                            }
                            variant="outlined"
                            className="mt-3 mr-1">
                            {lang == "th" ? "สถานที่จัดงาน" : "Event location"}
                          </Button>
                        )}
                        {item.link != "" && (
                          <Button
                            variant="outlined"
                            disabled={
                              item.timerange[1] > 0 &&
                              launch >= item.timerange[1]
                            }
                            onClick={() =>
                              window.open(
                                item.link.includes("http")
                                  ? item.link
                                  : "https://cp-bnk48.pages.dev/" + item.link,
                                "_blank"
                              )
                            }
                            className="mt-3">
                            {lang == "th" ? "ดูเพิ่มเติม" : "View more"}
                          </Button>
                        )}
                        {item.timerange[1] > 0 &&
                          launch >= item.timerange[1] && (
                            <p className="mt-3 text-info">
                              <b>
                                {lang == "th"
                                  ? "กิจกรรมนี้จะถูกลบออกจากระบบภายในเที่ยงคืนของวันถัดไป (ตามเวลาประเทศไทย)"
                                  : "This event will be remove from list in midnight of tomorrow. (Based on Asia/Bangkok timezone)"}
                              </b>
                            </p>
                          )}
                      </Grid>
                    </Grid>
                  </CardContent>
                  {!(
                    checktime(item).prepare == 0 && checktime(item).launch == 0
                  ) &&
                    item.timerange[1] > 0 &&
                    unix <= item.timerange[1] && (
                      <LinearProgress
                        sx={{
                          width: "100%",
                          height: window.innerHeight * 0.02,
                        }}
                        variant="buffer"
                        value={checktime(item).launch}
                        valueBuffer={checktime(item).prepare}
                      />
                    )}
                </Card>
              ))}
              {data.length > PER_PAGE && (
                <div className="col-md-12 d-flex justify-content-center mb-3">
                  <Pagination
                    count={count}
                    size="large"
                    page={pageset}
                    onChange={handleChange}
                  />
                </div>
              )}
              <Joyride
                steps={lang == "th" ? stepTh : stepEn}
                continuous
                run={true}
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
  setLaunch: (val) => dispatch(setLaunch(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Event);
