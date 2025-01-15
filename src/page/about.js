import React from "react";
import { connect } from "react-redux";
import {
  Card,
  CardContent,
  Fade,
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
  ListItemText,
  Skeleton,
} from "@mui/material";
import AOS from "aos";
import { useHistory } from "react-router-dom";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import getAge from "get-age";
import moment from "moment";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/profile";
import stepTh from "../stepGuide/th/profile";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function a11yProps2(index) {
  return {
    id: `simple-tab2-${index}`,
    "aria-controls": `simple-tabpanel2-${index}`,
  };
}

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

const About = ({ currentPage, lang, setLang, setPage, guide }) => {
  const [data, setData] = React.useState(null);
  const [img, setImg] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [value2, setValue2] = React.useState(0);

  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
  };

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };

    setPage(lang == "th" ? "เกี่ยวกับข้าวฟ่าง" : "All About Kaofrang");
    fetch(
      process.env.REACT_APP_APIE + "/kfsite/getkaofranginfo",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.response);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader
          title={<h3>All about Kaofrang</h3>}
          subheader={
            lang == "th"
              ? "มารู้จักตัวตนของน้องข้าวฟ่างเบื้องต้นกันเถอะ!"
              : "Let's know about Kaofrang Yanisa or Kaofrang BNK48 on basic step."
          }
        />
        <div className="container mt-3">
          {data != null ? (
            <div data-aos="fade-in">
              <Grid container spacing={5}>
                <Grid item className="d-flex align-items-center" lg={5} xs={12}>
                  <Avatar
                    src={data.img}
                    slotProps={{
                      img: {
                        onLoad: () => setImg(true),
                      },
                    }}
                    sx={{
                      display: img ? "block" : "none",
                      width: { md: "400px", xs: "100%" },
                      height: { md: "400px", xs: "100%" },
                    }}
                  />
                  {!img && (
                    <Skeleton
                      variant="circular"
                      className="bg-m"
                      sx={{
                        width: { md: "400px", xs: window.innerWidth * 0.9 },
                        height: { md: "400px", xs: window.innerWidth * 0.9 },
                      }}
                    />
                  )}
                </Grid>
                <Grid item lg={7} xs={12}>
                  <Grid xs={12} data-aos="zoom-in-right" data-tour="profile-1">
                    <CardHeader
                      className="pl-0"
                      title={
                        <h4>
                          {lang == "th" ? "ชื่อจริง" : "Fullname"}:{" "}
                          {lang == "th"
                            ? data.fullnameTh[0]
                            : data.fullnameEn[0]}{" "}
                          {lang == "th"
                            ? data.fullnameTh[1]
                            : data.fullnameEn[1]}
                        </h4>
                      }
                      subheader={
                        <h5>
                          {lang == "th" ? "ชื่อเล่น" : "Nickname"}:{" "}
                          {lang == "th" ? data.nameTh : data.name}
                        </h5>
                      }
                    />
                    <p>
                      {lang == "th" ? "ภูมิลำเนา" : "Domicile"}:{" "}
                      {data.province[lang]}
                    </p>
                    <p>
                      {lang == "th" ? "กรุ๊ปเลือด" : "Blood Group"}:{" "}
                      {data.blood[lang]}
                    </p>
                    <p>
                      {lang == "th" ? "วันเกิด" : "Birthday"}:{" "}
                      {moment(data.birthday)
                        .lang(lang)
                        .local()
                        .format("DD MMMM YYYY")}
                    </p>
                    <p>
                      {lang == "th" ? "อายุ" : "Age"}:{" "}
                      {getAge(data.birthday) +
                        (lang == "th" ? " ปี" : " year(s) old")}
                    </p>
                    <p>
                      {lang == "th" ? "สังกัดศิลปิน" : "Music label"}:{" "}
                      {data.musicLabel[lang].join(", ")}
                    </p>
                  </Grid>
                  <Button
                    variant="contained"
                    onClick={() => history.push("/follow?contactjob=true")}>
                    {lang == "th" ? "ติดต่องาน" : "Contact for Working"}
                  </Button>
                </Grid>
              </Grid>
              <hr />
              <Grid xs={12} className="mt-3 pt-3">
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      data-aos="fade-in"
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                      variant="scrollable"
                      data-tour="profile-2"
                      allowScrollButtonsMobile>
                      <Tab
                        sx={{ color: "#000" }}
                        label={
                          lang == "th"
                            ? "สมาชิกบีเอ็นเคโฟตี้เอต"
                            : "BNK48 member"
                        }
                        {...a11yProps(0)}
                      />
                      <Tab
                        sx={{ color: "#000" }}
                        label={
                          lang == "th"
                            ? "ศิลปินสังกัดอินดิเพนเด้นท์ เรคคอร์ด"
                            : "Independent Records Artist"
                        }
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                  <CustomTabPanel
                    value={value}
                    index={0}
                    data-aos="zoom-in-right">
                    <h4 className="mb-4">
                      {lang == "th"
                        ? "ข้อมูลด้านการเป็นสมาชิกบีเอ็นเคโฟตี้เอต"
                        : "All about Kaofrang as BNK48 member"}
                    </h4>
                    {data.bnk48Profile.map((item) => (
                      <h6 data-aos="fade-in">{item[lang]}</h6>
                    ))}
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <h4 className="mb-4">
                      {lang == "th"
                        ? "ข้อมูลด้านการเป็นศิลปินสังกัดอินดิเพนเด้นท์ เรคคอร์ด"
                        : "All about Kaofrang Yanisa as Artist"}
                    </h4>
                    {data.irProfile.map((item) => (
                      <h6 data-aos="fade-in">{item[lang]}</h6>
                    ))}
                  </CustomTabPanel>
                </Box>
              </Grid>
              <Grid xs={12}>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                    data-aos="fade-in">
                    <Tabs
                      value={value2}
                      onChange={handleChange2}
                      variant="scrollable"
                      data-tour="profile-2"
                      allowScrollButtonsMobile>
                      <Tab
                        sx={{ color: "#000" }}
                        label={
                          lang == "th"
                            ? "ไลฟ์สไตล์ของน้องข้าวฟ่าง"
                            : "All about Kaofrang's Lifestyle"
                        }
                        {...a11yProps2(0)}
                      />
                      <Tab
                        sx={{ color: "#000" }}
                        label={
                          lang == "th"
                            ? "เกร็ดความรู้เกี่ยวกับระบบวงบีเอ็นเคโฟตี้เอต"
                            : "All about BNK48"
                        }
                        {...a11yProps2(1)}
                      />
                      <Tab
                        sx={{ color: "#000" }}
                        label={
                          lang == "th"
                            ? "เกร็ดความรู้เกี่ยวกับค่ายเพลงอินดิเพนเด้นท์ เรคคอร์ด"
                            : "All about Independent Records (iR)"
                        }
                        {...a11yProps2(2)}
                      />
                    </Tabs>
                  </Box>
                  <CustomTabPanel value={value2} index={0} data-aos="fade-in">
                    <List component="nav" sx={{ bgcolor: "background.paper" }}>
                      {data.kfKnow.map((item) => (
                        <ListItem data-aos="flip-up">
                          <ListItemText secondary={<p>{item[lang]}</p>} />
                        </ListItem>
                      ))}
                    </List>
                  </CustomTabPanel>
                  <CustomTabPanel value={value2} index={1}>
                    <List component="nav" sx={{ bgcolor: "background.paper" }}>
                      {data.bnk48Know.map((item) => (
                        <ListItem data-aos="flip-up">
                          <ListItemText secondary={<p>{item[lang]}</p>} />
                        </ListItem>
                      ))}
                    </List>
                  </CustomTabPanel>
                  <CustomTabPanel value={value2} index={2}>
                    <List component="nav" sx={{ bgcolor: "background.paper" }}>
                      {data.irKnow.map((item) => (
                        <ListItem data-aos="flip-up">
                          <ListItemText secondary={<p>{item[lang]}</p>} />
                        </ListItem>
                      ))}
                    </List>
                  </CustomTabPanel>
                </Box>
              </Grid>
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
            </div>
          ) : (
            <Grid container spacing={5}>
              <Grid item lg={5} xs={12}>
                <Skeleton
                  variant="circular"
                  className="bg-m"
                  sx={{
                    width: { md: "400px", xs: window.innerWidth * 0.9 },
                    height: { md: "400px", xs: window.innerWidth * 0.9 },
                  }}
                />
              </Grid>
              <Grid item lg={7} xs={12}>
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "4rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "2rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m mt-2"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m mt-4"
                  sx={{ fontSize: "3rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
              </Grid>
            </Grid>
          )}
        </div>
      </Box>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  guide: state.guide,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(About);
