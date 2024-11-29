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
  Alert,
  Snackbar,
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
import { useHistory } from "react-router-dom";

import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { QRCode } from "react-qrcode-logo";
import ReactGA from "react-ga4";
import { useAuth0 } from "@auth0/auth0-react";

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

const NfcRead = ({ currentPage, lang, setLang, setPage, launch, guide }) => {
  const His = useHistory();
  const {
    loginWithPopup,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    logout,
  } = useAuth0();
  const [load, setLoad] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [err, setErr] = React.useState(false);

  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  const onReading = ({ message, serialNumber }) => {
    console.log(serialNumber);
    for (const record of message.records) {
      const textDecoder = new TextDecoder(record.encoding);
      alert('msg from nfc: ' + textDecoder)
      break;
    }
  };

  React.useEffect(async () => {
    setPage("KorKao Smart Tag Campaign");
    if ("NDEFReader" in window) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();

        console.log("Scan started successfully.");
        ndef.onreadingerror = () => {};

        ndef.onreading = (event) => {
          console.log("NDEF message read.");
          onReading(event); //Find function below
        };
      } catch (error) {
        console.log(`Error! Scan failed to start: ${error}.`);
      }
    } else {
      setErr(true);
      setTimeout(() => {
        setErr(false);
      }, 10000);
    }
  }, []);

  function comma(number) {
    const formatter = new Intl.NumberFormat("en-US");
    const formattedNumber = formatter.format(number);
    return formattedNumber;
  }

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader
          title={<h3>NFC Reader for KorKao Activity</h3>}
          subheader={
            lang == "th"
              ? "คุณสามารถเข้าถึงคอนเทนท์หรือกิจกรรมพิเศษโดยแตะการ์ด NFC ที่มือถือคุณ (หากแตะเสร็จกรุณานำการ์ดคืนที่บ้านกอข้าว)"
              : "Access exclusive content from KorKao team with tap NFC card (Please return the card to team)."
          }
        />
        <div
          className="container mt-3 d-flex justify-content-center"
          data-aos="fade-in"></div>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}>
          <CircularProgress />
        </Backdrop>
        <Backdrop
          sx={{
            color: "#000",
            backgroundColor: "rgb(248, 195, 248)",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={err}>
          <Typography>
            {lang == "th"
              ? "อุปกรณ์ NFC อาจไม่รองรับ"
              : "NFC is not support on this device."}
          </Typography>
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
});
export default connect(mapStateToProps, mapDispatchToProps)(NfcRead);
