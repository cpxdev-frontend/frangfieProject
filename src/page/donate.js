import React from "react";
import { connect } from "react-redux";
import {
  Card,
  CardContent,
  LinearProgress,
  CardHeader,
  Button,
  Grid,
  Fade,
  Box,
  Tabs,
  Tab,
  Typography,
  List,
  ListItemButton,
  ListItemAvatar,
  Skeleton,
  Backdrop,
  CircularProgress,
  DialogContent,
  TextField,
  Divider,
  CardMedia,
} from "@mui/material";
import Swal from "sweetalert2";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { QRCode } from "react-qrcode-logo";
import ReactGA from "react-ga4";
const generatePayload = require("promptpay-qr");

let mem = false;

mapboxgl.accessToken =
  "pk.eyJ1IjoiY3B4dGgyMDE3IiwiYSI6ImNsZHY0MzN6bTBjNzEzcXJmamJtN3BsZ3AifQ.mYNwWaYKsiLeYXngFDtaWQ";

const Donate = ({ currentPage, lang, setLang, setPage, launch }) => {
  const [qrCode, setqrCode] = React.useState(
    generatePayload("004999166938497", {})
  );
  const cardsuccess = React.useRef(null);
  const [num, setNum] = React.useState(0);
  const [rate, setRate] = React.useState(0);
  const [change, setLockchange] = React.useState(false);
  const [print, setPrint] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    setPage(lang == "th" ? "โดเนทเพื่อข้าวฟ่าง" : "Donate Kaofrang");
  }, []);

  const ExportQR = () => {
    if (cardsuccess.current === null) {
      return;
    }
    setPrint(true);
    setLoad(true);
    ReactGA.event({
      category: "User",
      action: "Save QR Payment",
    });
    setTimeout(() => {
      toJpeg(cardsuccess.current, {
        includeQueryParams: true,
        preferredFontFormat:
          "QGZvbnQtZmFjZXtuYW1lOidtaXNhbnMnO3NyYzp1cmwoJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC9jcHgyMDE3L21pc2Fuc2ZvbnRAbWFpbi9lbi9NaVNhbnMtTm9ybWFsLndvZmYyJykgZm9ybWF0KCd3b2ZmMicpLHVybCgnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL2NweDIwMTcvbWlzYW5zZm9udEBtYWluL2VuL01pU2Fucy1Ob3JtYWwud29mZicpIGZvcm1hdCgnd29mZicpO2ZvbnQtd2VpZ2h0OjUwMDtmb250LXN0eWxlOm5vcm1hbDtmb250LWRpc3BsYXk6c3dhcH0=",
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "KaofrangFie QR Donate.jpg";
          link.href = dataUrl;
          link.click();
          setPrint(false);
          setLoad(false);
          if (change == false && mem == false) {
            mem = true;
            setTimeout(() => {
              setRate(0);
            }, 30000);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoad(false);
        });
    }, 200);
  };

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader
          title={<h3>Fight for Kaofrang</h3>}
          subheader={
            lang == "th"
              ? "ร่วมโดเนทเพื่อผลักดันกิจกรรมหรือโปรเจคต่างๆ ของข้าวฟ่างได้ที่ช่องทางนี้"
              : "Let's support Kaofrang with donate every projects to our fan supporter."
          }
        />
        <div
          className="container mt-3 d-flex justify-content-center"
          data-aos="fade-in">
          <div className="row text-center">
            <Typography className="col-12 mb-3">
              {lang == "th"
                ? "สแกน QR Code ด้านล่างนี้เพื่อโดเนท (รองรับทุกธนาคาร)"
                : "Scan below QR Code to donating (Support every thai mobile banking or some e-wallet applications)"}
            </Typography>
            <div
              className="col-12 text-center"
              ref={cardsuccess}
              style={{ backgroundColor: print ? "#fff" : "" }}>
              <div className="col-12 d-flex justify-content-center">
                {print == false ? (
                  <QRCode
                    value={qrCode}
                    logoImage="https://www.bot.or.th/content/dam/bot/icons/icon-thaiqr.png"
                    logoWidth={100}
                    logoHeight={100}
                    size={300}
                    style={{ width: 250, height: 250 }}
                    qrStyle="dots"
                    crossorigin="anonymous"
                  />
                ) : (
                  <CardMedia
                    sx={{ width: 250, height: 250 }}
                    src={
                      "https://quickchart.io/qr?size=300&text=" +
                      qrCode +
                      "&centerImageUrl=https%3A%2F%2Fwww.bot.or.th%2Fcontent%2Fdam%2Fbot%2Ficons%2Ficon-thaiqr.png"
                    }
                    component="img"
                  />
                )}
              </div>
              {num > 0 && print && (
                <Typography className="col-12 mt-3">
                  ยอดที่โอน {num} บาท
                </Typography>
              )}
              {print && (
                <Typography className="col-12 mt-3">
                  Biller ID: 004999166938497
                  <br />
                  ชื่อบัญชี: นายคมกฤษ ถาวรชีวัน และ นาย อนุชิต ชาอุรัมย์
                </Typography>
              )}
            </div>
            <TextField
              select
              label={
                lang == "th"
                  ? "เลือกจำนวนเงิน (บาท)"
                  : "Choose amount (Thai Baht)"
              }
              value={num}
              className="mt-5 mb-3"
              defaultValue={0}
              fullWidth
              onChange={(e) => {
                ReactGA.event({
                  category: "User",
                  action: "Gen QR Payment",
                });
                if (rate == 30) {
                  Swal.fire({
                    title:
                      lang == "th"
                        ? "คุณเลือกยอดการโอนถี่เกินไป"
                        : "You choose the transfer amount too frequently!",
                    icon: "error",
                  });
                  if (change == false) {
                    setLockchange(true);
                    mem = true;
                    setTimeout(() => {
                      setLockchange(false);
                      setRate(0);
                    }, 30000);
                  }
                } else {
                  if (parseInt(e.target.value) == 0) {
                    setqrCode(generatePayload("004999166938497", {}));
                  } else {
                    setqrCode(
                      generatePayload("004999166938497", {
                        amount: parseInt(e.target.value),
                      })
                    );
                  }
                  setNum(parseInt(e.target.value));
                  setRate(rate + 1);
                }
              }}
              SelectProps={{
                native: true,
              }}>
              <option value={0}>
                {lang == "th"
                  ? "ระบุจำนวนเงินเองในภายหลัง"
                  : "Depended to your choice (Select your amount on your application)"}
              </option>
              <option value={20.0}>20</option>
              <option value={50.0}>50</option>
              <option value={100.0}>100</option>
              <option value={200.0}>200</option>
              <option value={300.0}>300</option>
              <option value={400.0}>400</option>
              <option value={500.0}>500</option>
              <option value={1000.0}>1,000</option>
              <option value={5000.0}>5,000</option>
              <option value={10000.0}>10,000</option>
            </TextField>
            <Button variant="outlined" onClick={() => ExportQR()}>
              {lang == "th" ? "บันทึก QR Code นี้" : "Save this QR Payment"}
            </Button>
            <Divider />
            {lang == "th" ? (
              <Typography className="col-12 mt-3">
                หรือโอนเข้าบัญชี <img style={{marginTop: -6}} src='https://cdn.jsdelivr.net/npm/thai-banks-logo@1.0.6/icons/KBANK.png' width={22} height={22} /> <b>ธนาคารกสิกรไทย</b><br />เลขที่บัญชี{" "}
                <b>176-1-39401-7</b><br/>ชื่อบัญชี{" "}
                <b>นายคมกฤษ ถาวรชีวัน และ นาย อนุชิต ชาอุรัมย์</b>
              </Typography>
            ) : (
              <Typography className="col-12 mt-3">
                Sorry, but this donation way is supported for thai peoples only.
              </Typography>
            )}
            <Typography variant="subtitle2" className="col-12 mt-3">
              {lang == "th"
                ? "หมายเหตุ: เงินที่โอนผ่านช่องทางนี้จะถูกโอนเข้าบัญชีของบ้านข้าวฟ่างโดยตรงเพื่อนำไปใช้ในการสนับสนุนในทุกกิจกรรมน้องข้าวฟ่าง โดยเว็บไซต์นี้เป็นแค่เพียงตัวกลางเพื่อกระจายข่าวสารเท่านั้น"
                : "Notes: All donated amounts will be transfer directly to Kaofrang's Fandom supporter to make supporting about projects of Kaofrang Yanisa or Kaofrang BNK48. This website is only a medium for sharing events or about all of her projects."}
            </Typography>
          </div>
        </div>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}>
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
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Donate);