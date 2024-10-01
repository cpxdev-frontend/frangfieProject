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
import moment from "moment";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { QRCode } from "react-qrcode-logo";
import ReactGA from "react-ga4";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/donate";
import stepTh from "../stepGuide/th/donate";

const generatePayload = require("promptpay-qr");

let mem = false;

const moneyCurren = [
  {
    val: "khr",
    lab: "Cambodia Riel (KHR)",
  },
  {
    val: "hkd",
    lab: "Hong Kong Dollar (HKD)",
  },
  {
    val: "khr",
    lab: "Indonesian Rupiah (IDR)",
  },
  {
    val: "lak",
    lab: "Lao PDR Kip (LAK)",
  },
  {
    val: "myr",
    lab: "Malaysia Ringgit (MYR)",
  },
  {
    val: "sgd",
    lab: "Singapore Dollar (SGD)",
  },
  {
    val: "vnd",
    lab: "Vietnamese Dong (VND)",
  },
];

mapboxgl.accessToken =
  "pk.eyJ1IjoiY3B4dGgyMDE3IiwiYSI6ImNsZHY0MzN6bTBjNzEzcXJmamJtN3BsZ3AifQ.mYNwWaYKsiLeYXngFDtaWQ";

const Donate = ({ currentPage, lang, setLang, setPage, launch, guide }) => {
  const [qrCode, setqrCode] = React.useState(
    generatePayload("004999166938497", {})
  );
  const cardsuccess = React.useRef(null);
  const [num, setNum] = React.useState(0);
  const [rate, setRate] = React.useState(0);
  const [lock, setLockcache] = React.useState(false);
  const [change, setLockchange] = React.useState(false);
  const [print, setPrint] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [exc, setExch] = React.useState([]);
  const [excDate, setExchd] = React.useState("");
  const [setexc, setSelctedExc] = React.useState("-");

  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    setPage(lang == "th" ? "โดเนทเพื่อข้าวฟ่าง" : "Donate Kaofrang");
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("amount");
    if (myParam != null && myParam != "") {
      setNum(parseInt(myParam));
      setqrCode(
        generatePayload("004999166938497", {
          amount: parseInt(myParam),
        })
      );
      setLockcache(true);
    }
  }, []);

  React.useEffect(() => {
    if (lang != "th") {
      fetch(
        // "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@" +
        //   moment().format("YYYY.M") +
        //   "/v1/currencies/thb.json?time=" +
        //   moment().unix(),
        'https://latest.currency-api.pages.dev/v1/currencies/thb.json',
        {
          method: "get",
        }
      )
        .then((response) => response.json())
        .then((result) => {
          setExch(result.thb);
          setExchd(result.date);
        })
        .catch((error) => {
          console.log("error", error);
          setExch([]);
          setExchd("");
        });
    }
  }, [lang]);

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
          link.download = "KorKaofrang QR Donate.jpg";
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

  function comma(number) {
    const formatter = new Intl.NumberFormat("en-US");
    const formattedNumber = formatter.format(number);
    return formattedNumber;
  }

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader
          title={<h3>Fight for Kaofrang</h3>}
          data-tour="donate-1"
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
                    logoImage="https://d3hhrps04devi8.cloudfront.net/kf/thqr.webp"
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
                      "&centerImageUrl=https://d3hhrps04devi8.cloudfront.net/kf/thqr.webp"
                    }
                    component="img"
                  />
                )}
              </div>
              {num > 0 && print && (
                <Typography
                  className="col-12 mt-3"
                  dangerouslySetInnerHTML={{
                    __html:
                      lang == "th"
                        ? "ยอดที่โอน " + comma(num) + " บาท"
                        : "Amount " +
                          comma(num) +
                          (setexc == "-"
                            ? " THB<br />Please check your exchange rate on your local mobile banking after scan this QR Code."
                            : " THB<br />(Based on estimated " +
                              comma((num * exc[setexc]).toFixed(2)) +
                              " " +
                              setexc.toUpperCase()) +
                          ")",
                  }}></Typography>
              )}
              {print && (
                <>
                  <Typography className="col-12 mt-3">
                    Biller ID: 004999166938497
                    <br />
                    {lang == "th"
                      ? "ชื่อบัญชี: นายคมกฤษ ถาวรชีวัน และ นาย อนุชิต ชาอุรัมย์"
                      : "Account Name: Mr.Khomkrit Thaworncheewan and Mr.Anuchit Chaurum"}
                  </Typography>
                  <Typography className="col-12 mt-3">
                    {lang != "th" &&
                      "Please make sure that your local mobile banking is support to transfer to international bank via Thai QR payment. You maybe have some fee for transfer abroad. However, this exchange rate maybe different to data from your local mobile banking. Please refer to the exchange rate of the bank you use."}
                  </Typography>
                </>
              )}
              {lock && !print && (
                <Typography
                  className="col-12 mt-3"
                  dangerouslySetInnerHTML={{
                    __html:
                      lang == "th"
                        ? "ยอดที่โอน " + comma(num) + " บาท"
                        : "Amount " +
                          comma(num) +
                          " THB<br />Please view exchange rate below.",
                  }}></Typography>
              )}
            </div>
            {lang != "th" && (
              <TextField
                select
                data-tour="donate-2"
                label="Choose your currency"
                value={setexc}
                helperText={
                  lang == "en" && excDate == ""
                    ? null
                    : "Latest update exchange rates as of " +
                      moment(excDate).lang("en").format("DD MMMM YYYY")
                }
                className="mt-5 m-2"
                defaultValue={0}
                fullWidth
                onChange={(e) => {
                  setSelctedExc(e.target.value);
                }}
                SelectProps={{
                  native: true,
                }}>
                <option value="-">Select your currency</option>
                {moneyCurren.map((item) => (
                  <option value={item.val}>{item.lab}</option>
                ))}
              </TextField>
            )}
            <TextField
              select
              label={
                lang == "th"
                  ? "เลือกจำนวนเงิน (บาท)"
                  : "Choose amount (Thai Baht)"
              }
              data-tour="donate-3"
              value={num}
              helperText={
                lang == "th" ||
                (lang == "en" && setexc == "-" && num == 0) ||
                (lang == "en" && excDate == "" && setexc == "-")
                  ? null
                  : lang == "en" && setexc != "-" && num == 0
                  ? "Current exchange rate 1 THB approximately " +
                    comma((1 * exc[setexc]).toFixed(2)) +
                    " " +
                    setexc.toUpperCase()
                  : lang == "en" && setexc != "-" && num > 0
                  ? "Estimated in " +
                    moneyCurren.filter((x) => x.val == setexc)[0].lab +
                    " are " +
                    comma((num * exc[setexc]).toFixed(2)) +
                    " " +
                    setexc.toUpperCase()
                  : null
              }
              disabled={lock}
              className={(lang == "th" ? "mt-5" : "mt-3") + " mb-3 m-2"}
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
            <Button
              data-tour="donate-4"
              variant="outlined"
              onClick={() => ExportQR()}
              className="m-2">
              {lang == "th" ? "บันทึก QR Code นี้" : "Save this QR Payment"}
            </Button>
            <Divider />
            {lang == "th" ? (
              <Typography className="col-12 mt-3">
                หรือโอนเข้าบัญชี{" "}
                <img
                  style={{ marginTop: -6 }}
                  src="https://cdn.jsdelivr.net/npm/thai-banks-logo@1.0.6/icons/KBANK.png"
                  width={22}
                  height={22}
                />{" "}
                <b>ธนาคารกสิกรไทย</b>
                <br />
                เลขที่บัญชี <b>176-1-39401-7</b>
                <br />
                ชื่อบัญชี <b>นายคมกฤษ ถาวรชีวัน และ นาย อนุชิต ชาอุรัมย์</b>
              </Typography>
            ) : (
              <Typography className="col-12 mt-3">
                Thai QR Payment is also support with foreigner from Cambodia,
                Hong Kong, Indonesia, Laos, Malaysia, Singapore and Vietnam
                banking. You can use your supported mobile banking to scan upper
                QR Payment directly. Please click{" "}
                <a
                  href="https://s7ap1.scene7.com/is/image/bot/2024_06_19_Crossborder%20QR%20Payment_Brochure_update%20(1)?ts=1718875185342&dpr=off"
                  target="_blank">
                  here
                </a>{" "}
                to view Accepted international mobile banking with Thai QR
                payment. However, this exchange rate maybe different to data
                from your local mobile banking. Please refer to the exchange
                rate of the bank you use.
                <br />
                (Information referenced by The Bank Of Thailand - BOT)
              </Typography>
            )}
            <Typography variant="subtitle2" className="col-12 mt-3">
              {lang == "th"
                ? "หมายเหตุ: เงินที่โอนผ่านช่องทางนี้จะถูกโอนเข้าบัญชีของบ้านข้าวฟ่างโดยตรงเพื่อนำไปใช้ในการสนับสนุนในทุกกิจกรรมน้องข้าวฟ่าง โดยเว็บไซต์นี้เป็นแค่เพียงตัวกลางเพื่อกระจายข่าวสารเท่านั้น"
                : "Notes: All donated amounts will be transfer directly to Kaofrang's Fandom supporter to make supporting about projects of Kaofrang Yanisa or Kaofrang BNK48. This website is only a agent for sharing events or about all of her projects."}
            </Typography>
          </div>
        </div>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}>
          <CircularProgress />
        </Backdrop>

        {open && (
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
        )}
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Donate);
