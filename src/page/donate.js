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
  ListItemButton,
  ListItemAvatar,
  Skeleton,
  ListItemText,
  DialogTitle,
  DialogContent,
  TextField,
  Divider,
  CardMedia,
} from "@mui/material";

import {
  faFacebook,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMobileAlt,
  faDesktop,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import moment from "moment";
import LanguageIcon from "@mui/icons-material/Language";
const generatePayload = require("promptpay-qr");

mapboxgl.accessToken =
  "pk.eyJ1IjoiY3B4dGgyMDE3IiwiYSI6ImNsZHY0MzN6bTBjNzEzcXJmamJtN3BsZ3AifQ.mYNwWaYKsiLeYXngFDtaWQ";

const Donate = ({ currentPage, lang, setLang, setPage, launch }) => {
  const [qrCode, setqrCode] = React.useState(
    generatePayload("004999166938497", {})
  );
  React.useEffect(() => {
    setPage(lang == "th" ? "การโดเนทเพื่อดันข้าวฟ่าง" : "Donate Kaofrang");
  }, []);

  return (
    <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
      <CardHeader
        title={<h3>Fight for Kaofrang</h3>}
        subheader={
          lang == "th"
            ? "ร่วมโดเนทเพื่อผลักดันโปรเจคต่างๆของข้าวฟ่างได้ที่ช่องทางนี้"
            : "Let's support Kaofrang with our fandom."
        }
      />
      <div className="container mt-3 d-flex justify-content-center">
        <div className="row text-center">
          <Typography className="col-12">
            สแกน QR Code ด้านล่างนี้เพื่อโดเนท (รองรับทุกธนาคาร)
          </Typography>
          <div className="col-12 d-flex justify-content-center mt-3">
            <CardMedia
              sx={{ width: 250, height: 250 }}
              src={
                "https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=" +
                qrCode
              }
              component="img"
            />
          </div>
          <TextField
            select
            label="เลือกจำนวนเงิน"
            className="mt-5 mb-3"
            defaultValue={0}
            fullWidth
            onChange={(e) => parseInt(e.target.value) == 0 ? setqrCode(generatePayload("004999166938497", {})) : setqrCode(generatePayload("004999166938497", {amount:parseInt(e.target.value)}))}
            SelectProps={{
              native: true,
            }}>
            <option value={0}>ระบุจำนวนเงินเองในภายหลัง</option>
            <option value={100.0}>20 บาท</option>
            <option value={100.0}>50 บาท</option>
            <option value={100.0}>100 บาท</option>
            <option value={200.0}>200 บาท</option>
            <option value={300.0}>300 บาท</option>
            <option value={400.0}>400 บาท</option>
            <option value={500.0}>500 บาท</option>
            <option value={1000.0}>1,000 บาท</option>
            <option value={5000.0}>5,000 บาท</option>
            <option value={10000.0}>10,000 บาท</option>
          </TextField>
          <Divider />
          <Typography className="col-12 mt-3">
            หรือโอนเข้าบัญชี<b>ธนาคารกสิกรไทย</b> เลขที่บัญชี{" "}
            <b>176-1-39401-7</b> ชื่อบัญชี{" "}
            <b>นายคมกฤษ ถาวรชีวัน และ นาย อนุชิต ชาอุรัมย์</b>
          </Typography>
        </div>
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Donate);
