import React from "react";
import { connect } from "react-redux";
import {
  Card,
  CardContent,
  LinearProgress,
  CardHeader,
  Button,
  Fade,
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
  DialogContentText,
  DialogActions,
} from "@mui/material";

import {
  faFacebook,
  faInstagram,
  faTiktok,
  faLine,
  faXTwitter,
  faFacebookF,
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

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/follow";
import stepTh from "../stepGuide/th/follow";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY3B4dGgyMDE3IiwiYSI6ImNsZHY0MzN6bTBjNzEzcXJmamJtN3BsZ3AifQ.mYNwWaYKsiLeYXngFDtaWQ";

const Follow = ({ currentPage, lang, setLang, setPage, launch, guide }) => {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState(null);

  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    setPage(lang == "th" ? "ติดตามข้าวฟ่าง" : "Follow Kaofrang");
    var requestOptions = {
      method: "POST",
    };

    fetch(
      process.env.REACT_APP_APIE + "/kfsite/getkaofrangwork",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.response);
        var url = new URL(window.location.href);
        var c = url.searchParams.get("contactjob");
        if (c !== null) {
          var newURL = window.location.href.split("?")[0];
          window.history.pushState("object", document.title, newURL);
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 } }}>
        <CardHeader
          title={<h3>Follow Kaofrang</h3>}
          sx={{ marginTop: { xs: 8, md: 0 } }}
          data-tour="follow-1"
          subheader={
            lang == "th"
              ? "ติดตามความเคลื่อนไหวของน้องข้าวฟ่างได้ตามด้านล่างนี้เลย"
              : "Follow Kaofrang Yanisa or Kaofrang BNK48 to see her update below."
          }
        />
        <div className="container mt-3 justify-content-center">
          <div className="row">
            <div className="col-md col-12 m-xs-2">
              <CardHeader
                title={lang == "th" ? "ช่องทางหลัก" : "Kaofrang's Official SNS"}
              />
              <List
                data-tour="follow-2"
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  bgcolor: "background.paper",
                  borderRadius: 5,
                }}>
                <ListItemButton
                  component="a"
                  href="https://facebook.com/bnk48official.kaofrang"
                  target="_blank"
                  data-aos="fade-right">
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#1877F2" }}>
                      <FontAwesomeIcon icon={faFacebook} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Facebook Fanpage"
                    secondary="Kaofrang BNK48"
                  />
                </ListItemButton>
                <ListItemButton
                  component="a"
                  href="https://instagram.com/kaofrang.bnk48official"
                  target="_blank"
                  data-aos="fade-right"
                  data-aos-delay={window.innerHeight > 700 ? "500" : "0"}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background:
                          "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                      }}>
                      <FontAwesomeIcon icon={faInstagram} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Instagram Account"
                    secondary="kaofrang.bnk48official"
                  />
                </ListItemButton>
                <ListItemButton
                  component="a"
                  href="https://tiktok.com/@kaofrang.bnk48official"
                  target="_blank"
                  data-aos="fade-right"
                  data-aos-delay={window.innerHeight > 700 ? "1000" : "0"}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#000", color: "#fff" }}>
                      <FontAwesomeIcon icon={faTiktok} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="TikTok Account"
                    secondary="@kaofrang.bnk48official"
                  />
                </ListItemButton>
                <ListItemButton
                  component="a"
                  href="https://www.bnk48.com/index.php?page=listMembers&memberId=86"
                  target="_blank"
                  data-aos="fade-right"
                  data-aos-delay={window.innerHeight > 700 ? "1500" : "0"}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#CB96C2" }}>
                      <FontAwesomeIcon icon={faGlobe} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="BNK48 Official Website"
                    secondary="Kaofrang"
                  />
                </ListItemButton>
                <ListItemButton
                  component="a"
                  href="https://app.bnk48.com/members/bnk48/kaofrang"
                  target="_blank"
                  data-aos="fade-right"
                  data-aos-delay={window.innerHeight > 700 ? "2000" : "0"}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#8AAEB5" }}>
                      <FontAwesomeIcon icon={faMobileAlt} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="IAM48 Mobile Application"
                    secondary="Kaofrang"
                  />
                </ListItemButton>
              </List>
            </div>
            <div className="col-md col-12 m-xs-2">
              <CardHeader
                sx={{ marginTop: { xs: 8, md: 0 } }}
                title={lang == "th" ? "สำหรับชาวกอข้าว" : "For Kaofrang Fandom"}
              />
              <List
                data-tour="follow-3"
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  bgcolor: "background.paper",
                  borderRadius: 5,
                }}>
                <ListItemButton
                  component="a"
                  href="https://cp-bnk48.pages.dev/member/kaofrang"
                  target="_blank"
                  data-aos="fade-right">
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#fb61ee" }}>
                      <FontAwesomeIcon icon={faDesktop} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="BNK48 Fan Space Platform"
                    secondary="Kaofrang"
                  />
                </ListItemButton>
                <ListItemButton
                  component="a"
                  href="https://facebook.com/105487801630676"
                  target="_blank"
                  data-aos="fade-right"
                  data-aos-delay={
                    window.innerWidth > 800 && window.innerHeight > 700
                      ? "500"
                      : "0"
                  }>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#1877F2" }}>
                      <FontAwesomeIcon icon={faFacebook} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Facebook Fanpage"
                    secondary="Kaofrang BNK48 Thailand Fanclub"
                  />
                </ListItemButton>
                <ListItemButton
                  component="a"
                  href="https://www.facebook.com/groups/280412833494438"
                  target="_blank"
                  data-aos="fade-right"
                  data-aos-delay={
                    window.innerWidth > 800 && window.innerHeight > 700
                      ? "1000"
                      : "0"
                  }>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#1877F2" }}>
                      <FontAwesomeIcon icon={faFacebookF} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Facebook Group"
                    secondary="กอข้าวของKaofrangBNK48"
                  />
                </ListItemButton>
                {/* <ListItemButton
              component="a"
              href="https://tiktok.com/@kaofrang.bnk48official"
              target="_blank"
              data-aos="fade-right">
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: "#000", color: "#fff" }}>
                  <FontAwesomeIcon icon={faTiktok} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="TikTok Account"
                secondary="@kaofrang.bnk48official"
              />
            </ListItemButton> */}
                <ListItemButton
                  component="a"
                  href="https://x.com/Kaofrangbnk48TH"
                  target="_blank"
                  data-aos="fade-right"
                  data-aos-delay={
                    window.innerWidth > 800 && window.innerHeight > 700
                      ? "1500"
                      : "0"
                  }>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#14171A" }}>
                      <FontAwesomeIcon icon={faXTwitter} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="X (Twitter)"
                    secondary="@Kaofrangbnk48TH"
                  />
                </ListItemButton>
                <ListItemButton
                  component="a"
                  href="https://line.me/ti/g2/_tY9YerBmKlDxIoFzU1zdg"
                  target="_blank"
                  data-aos="fade-right"
                  data-aos-delay={
                    window.innerWidth > 800 && window.innerHeight > 700
                      ? "2000"
                      : "0"
                  }>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#06c755" }}>
                      <FontAwesomeIcon icon={faLine} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="LINE Open Chat"
                    secondary="Kaofrang BNK48 TH.FC (กอข้าวของข้าวฟ่าง)"
                  />
                </ListItemButton>
              </List>
            </div>
          </div>
        </div>
        <CardHeader
          sx={{ marginTop: 8 }}
          title={<h3>Contact for Working</h3>}
          subheader={
            lang == "th"
              ? "ติดต่อสำหรับจ้างงานน้องข้าวฟ่างเท่านั้น"
              : "Contact them when you want hiring her only."
          }
        />
        {data != null ? (
          <Card className="m-md-5 m-3" data-tour="follow-4">
            {data.contact.map((item) => (
              <ListItemButton
                data-aos="fade-right"
                key={item.link}
                component="a"
                target="_blank"
                href={item.link}>
                <ListItemText
                  primary={item.label[lang]}
                  secondary={item.value[lang]}
                />
              </ListItemButton>
            ))}
          </Card>
        ) : (
          <Card className="m-md-5 m-3">
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
        {open && (
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
        )}
        <Box sx={{ marginBottom: 20 }} />
      </Box>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  guide: state.guide,
  launch: state.launch,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Follow);
