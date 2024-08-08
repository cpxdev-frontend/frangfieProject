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
  ListItemButton,
  List,
  ListItem,
  Chip,
  Skeleton,
  CardMedia,
  CardActionArea,
  ListItemText,
} from "@mui/material";
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
import { useHistory } from 'react-router-dom';

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

const GameApp = ({ currentPage, lang, setLang, currentCountry, setPage, setInGame, game }) => {
  const [gamemeet, setGame] = React.useState(0);
  const [quesList, setQuesList] = React.useState([]);
  const [correct, setCorrect] = React.useState(0);
  const [selected, setSelected] = React.useState(0);
  const [stat, setStatperques] = React.useState(0);
  const [ques, setQues] = React.useState(0);
  const [checked, setCheck] = React.useState(false);
  const [startLoad, setLoad] = React.useState(false);

  const [time, setTime] = React.useState(0);

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    let intervalId;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 9);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const [readyans, setAns] = React.useState(false);

  const [aver, setAver] = React.useState(null);

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (gamein == false) {
        return;
      }
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  React.useEffect(() => {
    gamein = game;
  }, [game]);

  React.useEffect(() => {
    setPage(lang == "th" ? "มินิเกมส์" : "Quiz Game");
  }, []);

  const StartGame = () => {
    setAver(null);
    setQues(0);
    setGame(0);
    setCorrect(0);
    setTime(0);
    setInGame(true);
    setLoad(true);
    var requestOptions = {
      method: "POST",
    };

    fetch(process.env.REACT_APP_APIE + "/kfsite/kffetchquiz", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          if (!isIOS()) {
            navigator.vibrate([
              100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 800,
            ]);
          }
          Swal.fire({
            title: "Game will be started",
            html:
              lang == "th"
                ? "เกมส์กำลังจะเริ่มในอีก <b></b> วินาที"
                : "Please wait in <b></b> seconds.",
            timer: 6000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timer.textContent = `5`;
              timerInterval = setInterval(() => {
                timer.textContent = `${Math.floor(Swal.getTimerLeft() / 1000)}`;
              }, 1000);
            },
            allowOutsideClick: () => !Swal.isLoading(),
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((r) => {
            /* Read more about handling dismissals below */
            if (r.dismiss === Swal.DismissReason.timer) {
              if (JSON.parse(result.data)[0].img != undefined) {
                if (!isIOS()) {
                  navigator.vibrate([100, 200, 100]);
                }
                Swal.fire({
                  footer:
                    lang == "th"
                      ? "คำเตือน: คำถามข้อแรก เกี่ยวข้องกับภาพนี้"
                      : "Warning: The first question concerns this image.",
                  imageUrl: JSON.parse(result.data)[0].img,
                  timerProgressBar: true,
                  didOpen: () => {
                    Swal.showLoading();
                    timerInterval = setTimeout(() => {
                      Swal.hideLoading();
                    }, 3000);
                  },
                  allowOutsideClick: () => false,
                }).then((r) => {
                  clearInterval(timerInterval);
                  setQuesList(JSON.parse(result.data));
                  console.log(JSON.parse(result.data));
                  setGame(1);
                  setLoad(false);
                  setAns(false);  
                  setIsRunning(false);
                  setTimeout(
                    () => {
                      setAns(true);
                      setIsRunning(true);
                    },
                    (window.innerHeight > (JSON.parse(result.data)[0].img? 700 : 500) ? 3800 : 1000)
                  );
                });
              } else {
                setQuesList(JSON.parse(result.data));
                console.log(JSON.parse(result.data));
                setGame(1);
                setLoad(false);
                setAns(false);
                setIsRunning(false);
                setTimeout(
                  () => {
                    setAns(true);
                    setIsRunning(true);
                  },
                  (window.innerHeight > (JSON.parse(result.data)[0].img ? 700 : 500) ? 3800 : 1000)
                );
              }
            }
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const SelectGame = (key, select) => {
    if (checked || readyans == false) {
      return;
    }
    setSelected(select);
    setCheck(true);
    setIsRunning(false);
    if (key === select) {
      setStatperques(1);
      setCorrect((x) => (x = x + 1));
    } else {
      if (!isIOS()) {
        navigator.vibrate(600);
      }
      setStatperques(2);
    }
    if (ques == quesList.length - 1) {
      if (!isIOS()) {
        navigator.vibrate([600, 100, 600, 100, 600]);
      }
      fetch(process.env.REACT_APP_APIE + "/kfsite/kfkeep", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quesText: JSON.stringify(quesList),
          quizScore: correct + (key === select ? 1 : 0),
          quizFrom: quesList.length,
          quizDuration: Math.floor((time % 6000) / 100),
          quizCountry: currentCountry
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          setAver(result);
          setTimeout(() => {
            setStatperques(0);
            setQuesList([]);
            setCheck(false);
            setGame(2);
            setSelected(0);
            setInGame(false);
          }, 4000);
        })
        .catch((error) => console.log("error", error));
    } else {
      setTimeout(() => {
        if (quesList[ques + 1].img != undefined) {
          if (!isIOS()) {
            navigator.vibrate([100, 200, 100]);
          }
          Swal.fire({
            footer:
              lang == "th"
                ? "คำเตือน: คำถามต่อไป เกี่ยวข้องกับภาพนี้"
                : "Warning: The next question concerns this image.",
            imageUrl: quesList[ques + 1].img,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              timerInterval = setTimeout(() => {
                Swal.hideLoading();
              }, 3000);
            },
            allowOutsideClick: () => false,
          }).then((r) => {
            clearInterval(timerInterval);
            setStatperques(0);
            setCheck(false);
            setQues((x) => (x = x + 1));
            setSelected(0);
            setAns(false);
            setTimeout(
              () => {
                setAns(true);
                setIsRunning(true);
              },
              (window.innerHeight > (quesList[ques + 1].img ? 700 : 500) ? 3800 : 1000)
            );
          });
        } else {
          if (!isIOS()) {
            navigator.vibrate(100);
          }
          setStatperques(0);
          setCheck(false);
          setQues((x) => (x = x + 1));
          setSelected(0);
          setAns(false);
          setTimeout(
            () => {
              setAns(true);
              setIsRunning(true);
            },
            (window.innerHeight > (quesList[ques + 1].img ? 700 : 500) ? 3800 : 1000)
          );
        }
      }, 6000);
    }
  };

  if (gamemeet == 0) {
    return (
      <div
        data-aos="fade-in"
        className="d-flex justify-content-center"
        style={{ marginBottom: 100 }}>
        <Card sx={{ marginTop: "15vh", width: { xs: "90%", md: "70%" } }}>
          <CardContent>
            <CardHeader
              title="Quiz Game"
              subheader={
                lang == "th"
                  ? "คำถามพิชิตสุดยอดกองฟ่างของข้าวฟ่าง"
                  : "KaofrangFie Fandom Quiz"
              }
            />
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    lang == "th"
                      ? "1. เลือกคำถามที่ถูกต้องที่สุด"
                      : "1. Please choose correct answer as you can."
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    lang == "th"
                      ? "2. หากเลือกแล้วจะไม่สามารถเปลี่ยนตัวเลือกได้"
                      : "2. You cannot change answer after selected."
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    lang == "th"
                      ? "3. หากตอบคำถามถูกจะได้ 1 คะแนน"
                      : "3. You will earn 1 point when answer correct."
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    lang == "th"
                      ? "4. สำหรับผู้ใช้งาน Android ทางผู้พัฒนาได้พัฒนาระบบคำสั่งสั่นที่ตัวอุปกรณ์เพื่อเพิ่มอรรถรสในการเล่น"
                      : "4. We use vibration on your device for Android device to increase the enjoyment of playing the game."
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    lang == "th"
                      ? "5. หลังเกมจบ คุณสามารถเข้ามาเล่นซ้ำได้ แต่คำถามจะถูกเปลี่ยนสลับกันไปโดยไม่ซ้ำลำดับกัน"
                      : "5. After the game ends, you can come and play again. But the questions will be rotated in no repeating order."
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    lang == "th"
                      ? "6. แคปหน้าจอและแชร์คะแนนไปที่กลุ่มเฟสบุ๊คหรือ LINE Square ของข้าวฟ่างด้วยนะ"
                      : "6. Take your scores and share to Kaofrang Facebook group or LINE Square."
                  }
                />
              </ListItem>
            </List>
            <Button
              className="mt-5"
              variant="contained"
              disabled={startLoad}
              onClick={() => StartGame()}>
              {lang == "th" ? "เริ่มเกมส์" : "Play!"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (gamemeet == 2) {
    return (
      <div
        className="d-flex justify-content-center"
        style={{ marginBottom: 100 }}>
        <Card sx={{ marginTop: "30vh", width: { xs: "90%", md: "70%" } }}>
          <CardContent>
            <CardHeader
              title="Result"
              data-aos="fade-right"
              subheader={
                lang == "th"
                  ? "คุณตอบคำถามถูกไป " + correct + " ข้อ (คะแนน)"
                  : "You are correct " + correct + " answers (points)"
              }
            />
            {aver != null ? (
              <>
                <Typography className="ml-3" data-aos="zoom-in-down">
                  {lang == "th"
                    ? "คะแนนเฉลี่ยจากผู้เล่นทั่วโลก " +
                      aver.average +
                      " คะแนนจากทั้งหมด " +
                      aver.fromAll +
                      " คะแนน"
                    : "Average scores from worldwide are " +
                      aver.average +
                      " points from all " +
                      aver.fromAll +
                      " points."}
                </Typography>
                <Typography className="ml-3" data-aos="zoom-in-down">
                  {lang == "th"
                    ? "เวลาที่ใช้ไปโดยเฉลี่ยทั่วโลก " +
                     (secondsToMinSec(aver.time).minutes > 0 ? secondsToMinSec(aver.time).minutes + ' นาที ' + secondsToMinSec(aver.time).seconds + ' วินาที' : secondsToMinSec(aver.time).seconds + ' วินาที') 
                    : "Worldwide average time duration " +
                    (secondsToMinSec(aver.time).minutes > 0 ? secondsToMinSec(aver.time).minutes + ' minutes ' + secondsToMinSec(aver.time).seconds + ' seconds' : secondsToMinSec(aver.time).seconds + ' seconds') }
                </Typography>
              </>
            ) : (
              <Skeleton height={500} />
            )}
            <Button
              className="mt-5"
              variant="contained"
              disabled={startLoad}
              onClick={() => setGame(0)}>
              {lang == "th" ? "เล่นอีกครั้ง" : "Play again"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div
      className="d-flex justify-content-center"
      style={{ marginBottom: 100 }}>
      {quesList.map(
        (item, i) =>
          i === ques && (
            <Card
              data-aos="fade-in"
              key={item.quizId}
              sx={{ marginTop: "5vh", width: { xs: "90%", md: "70%" } }}>
              <CardContent>
                <CardHeader
                  title={item.question[lang]}
                  subheader={
                    (lang == "th" ? "คำถามที่ " : "Question ") +
                    (ques + 1) +
                    "/" +
                    quesList.length
                  }
                />
                {item.img != undefined && checked == false && (
                  <p className="mt-2 text-primary ml-3" onClick={() => {
                      Swal.fire({
                        imageUrl: item.img
                      })
                    }}><b>{lang == "th" ? "คำแนะนำ: คลิกหรือแตะที่นี่เพื่อดูรูปเต็ม" : "Guide: Click or tap here to view full-size image"}</b></p>
                )}
                {item.img != undefined && checked == true && (
                  <div className="text-center">
                    <CardMedia component='img' src={item.img} width={300} />
                  </div>
                )}
                <List>
                  {item.choices.map((choice, ix) => (
                    <ListItemButton
                      sx={{
                        borderRadius: "10px",
                      }}
                      data-aos="fade-right"
                      data-aos-delay={
                        window.innerHeight > (item.img != undefined ? 700 : 500)
                          ? ix == 0
                            ? 500
                            : (500 * (ix + ix)).toString()
                          : 0
                      }
                      onClick={() => SelectGame(item.key, choice.choiceId)}
                      key={item.quizId + choice.choiceId}
                      className={
                        checked && item.key === choice.choiceId
                          ? "text-success" +
                            (choice.choiceId == selected
                              ? " bgSelectedquiz"
                              : " shake")
                          : checked && item.key !== choice.choiceId
                          ? "text-danger" +
                            (choice.choiceId == selected
                              ? " bgSelectedquiz"
                              : "")
                          : ""
                      }>
                      <ListItemText
                        primary={ix + 1 + ". " + choice.choiceName[lang]}
                      />
                    </ListItemButton>
                  ))}
                </List>
                {stat === 1 && (
                  <Typography
                    className="text-info mt-3"
                    data-aos="zoom-in-right">
                    <CheckCircleIcon className="mr-2" />
                    {item.correctMessage[lang].replace(/\\/g, "")}
                  </Typography>
                )}
                {stat === 2 && (
                  <Typography
                    className="text-danger mt-3"
                    data-aos="zoom-in-right">
                    <CancelIcon className="mr-2" />
                    {item.wrongMessage[lang].replace(/\\/g, "")}
                  </Typography>
                )}
                <br />
                {stat > 0 && ques < quesList.length - 1 && (
                  <Typography className="mt-2 nextText">
                    <InfoOutlined className="mr-2" />
                    {lang == "th"
                      ? "คำถามต่อไปกำลังจะเริ่มในอีกไม่ช้า"
                      : "Next question will be started soon"}
                  </Typography>
                )}
                {stat > 0 && ques == quesList.length - 1 && (
                  <Typography className="mt-2 nextText">
                    <InfoOutlined className="mr-2" />
                    {lang == "th"
                      ? "คุณตอบคำถามครบทุกข้อแล้ว กรุณารอสักครู่"
                      : "Game is done. Please wait for processing scores."}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  currentPage: state.currentPage,
  game: state.game,
  currentCountry: state.currentCountry
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
  setInGame: (val) => dispatch(setInGame(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(GameApp);
