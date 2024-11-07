import React from "react";
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
  IconButton,
  List,
  ListItem,
  Chip,
  Skeleton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";
import { InfoOutlined } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { connect } from "react-redux";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setInGame,
} from "../redux/action";
import { useHistory, useParams } from "react-router-dom";
import { Chart } from "react-google-charts";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/quizscore";
import stepTh from "../stepGuide/th/quizscore";

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

let timerInterval;
let gamein = false;

function secondsToMinSec(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
}

const GameApp = ({
  currentPage,
  lang,
  setLang,
  currentCountry,
  setPage,
  setInGame,
  country,
  guide,
  game,
}) => {
  const { c } = useParams();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [fresh, setFresh] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [zone, setZone] = React.useState("world");
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  function headertrans() {
    if (lang == "th") {
      return (
        "สถิติผู้เล่นจาก" +
        (c == "all"
          ? "ทั่วโลก"
          : country.filter((x) => x.alpha2 == c.toUpperCase()).length > 0
          ? "ประเทศ" +
            country.filter((x) => x.alpha2 == c.toUpperCase())[0].name
          : "")
      );
    }
    return (
      "Player Statistic from " +
      (c == "all"
        ? "Worldwide"
        : country.filter((x) => x.alpha2 == c.toUpperCase()).length > 0
        ? country.filter((x) => x.alpha2 == c.toUpperCase())[0].enName
        : "")
    );
  }

  const [aver, setAver] = React.useState(null);

  const checkpoint = (result) => {
    const res = [];
    if (lang == "th") {
      res.push(["ประเทศ", "คะแนนเฉลี่ย", "ระยะเวลาที่เล่นโดยเฉลี่ย (วินาที)"]);
    } else {
      res.push([
        "Countries",
        "Average Score",
        "Average Time Duration (Seconds)",
      ]);
    }
    for (let i = 0; i < result.responses.length; i++) {
      res.push([
        country.filter((x) => x.alpha2 == result.responses[i].country)[0]
          .enName,
        result.responses[i].totalPoints,
        result.responses[i].time,
      ]);
    }
    setData(res);
  };

  React.useEffect(() => {
    if (fresh != null) {
      checkpoint(fresh);
    }
  }, [lang]);

  React.useEffect(() => {
    if (c == null) {
      history.push("/quizgame");
      return;
    }
    fetch(
      process.env.REACT_APP_APIE +
        "/kfsite/kfrank?o=" +
        (c == "all" ? c : c.toUpperCase()),
      {
        method: "post",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setAver(result);
      })
      .catch((error) => console.log("error", error));
    fetch(process.env.REACT_APP_APIE_2 + "/kfsite/kflistall", {
      method: "post",
    })
      .then((response) => response.json())
      .then((result) => {
        checkpoint(result);
        setFresh(result);
      })
      .catch((error) => console.log("error", error));
  }, []);

  React.useEffect(() => {
    gamein = game;
  }, [game]);

  React.useEffect(() => {
    setPage("Quiz Game World Tournament");
  }, []);

  return (
    <Fade in={open} timeout={300}>
      <div
        className="d-flex justify-content-center"
        style={{ marginBottom: 200 }}>
        <Card sx={{ marginTop: "8%", width: { xs: "90%", md: "70%" } }}>
          <CardContent>
            <CardHeader
              title={"World Challenge"}
              data-aos="fade-right"
              action={
                <IconButton onClick={() => history.push("/quizgame")}>
                  <SportsEsportsIcon />
                </IconButton>
              }
            />
            {data != null ? (
              <Box data-tour="quizscore">
                <Chart
                  chartEvents={[
                    {
                      eventName: "select",
                      callback: ({ chartWrapper }) => {
                        const chart = chartWrapper.getChart();
                        const selection = chart.getSelection();
                        if (selection.length === 0) return;
                        const region = data[selection[0].row + 1];
                        console.clear();
                      },
                    },
                  ]}
                  options={{ region: zone }}
                  chartType="GeoChart"
                  width="100%"
                  height="500px"
                  data={data}
                />
                <RadioGroup
                  row
                  className="justify-content-center"
                  name="row-radio-buttons-group">
                  <FormControlLabel
                    control={
                      <Radio
                        checked={zone == "world"}
                        onChange={() => setZone("world")}
                      />
                    }
                    label={lang == "th" ? "ทั่วโลก" : "Global"}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={zone == "142"}
                        onChange={() => setZone("142")}
                      />
                    }
                    label={lang == "th" ? "เอเชีย" : "Asia"}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={zone == "150"}
                        onChange={() => setZone("150")}
                      />
                    }
                    label={lang == "th" ? "ยุโรป" : "Europe"}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={zone == "002"}
                        onChange={() => setZone("002")}
                      />
                    }
                    label={lang == "th" ? "แอฟริกา" : "Africa"}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={zone == "019"}
                        onChange={() => setZone("019")}
                      />
                    }
                    label={lang == "th" ? "อเมริกา" : "Americas"}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={zone == "009"}
                        onChange={() => setZone("009")}
                      />
                    }
                    label={lang == "th" ? "แปซิฟิก" : "Pacific"}
                  />
                </RadioGroup>
              </Box>
            ) : (
              <Skeleton height={600} width="100%" />
            )}
            <CardHeader
              title={headertrans()}
              className="mt-5"
              data-aos="fade-right"
              action={
                <IconButton onClick={() => history.push("/quizgame")}>
                  <SportsEsportsIcon />
                </IconButton>
              }
            />
            {aver != null ? (
              <>
                {aver.fromAll > 0 ? (
                  <>
                    <Typography className="ml-3" data-aos="fade-in">
                      {lang == "th"
                        ? "คะแนนเฉลี่ยจากผู้เล่น " +
                          aver.average +
                          " คะแนนจากทั้งหมด " +
                          aver.fromAll +
                          " คะแนน"
                        : "Average scores are " +
                          aver.average +
                          " points from all " +
                          aver.fromAll +
                          " points."}
                    </Typography>
                    <Typography className="ml-3" data-aos="zoom-in-right">
                      {lang == "th"
                        ? "เวลาที่ใช้ไปโดยเฉลี่ย " +
                          (secondsToMinSec(aver.time).minutes > 0
                            ? secondsToMinSec(aver.time).minutes +
                              " นาที " +
                              secondsToMinSec(aver.time).seconds +
                              " วินาที"
                            : secondsToMinSec(aver.time).seconds + " วินาที")
                        : "Average time duration " +
                          (secondsToMinSec(aver.time).minutes > 0
                            ? secondsToMinSec(aver.time).minutes +
                              " minutes " +
                              secondsToMinSec(aver.time).seconds +
                              " seconds"
                            : secondsToMinSec(aver.time).seconds + " seconds")}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography className="ml-3" data-aos="zoom-in-down">
                      {lang == "th"
                        ? "ไม่พบข้อมูลในระบบในขณะนี้"
                        : "System not found any game records of this country"}
                    </Typography>
                  </>
                )}
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
              <Skeleton height={100} />
            )}
          </CardContent>
        </Card>
      </div>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  currentPage: state.currentPage,
  game: state.game,
  country: state.country,
  guide: state.guide,
  currentCountry: state.currentCountry,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
  setInGame: (val) => dispatch(setInGame(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(GameApp);
