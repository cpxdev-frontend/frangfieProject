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
  Pagination,
  Skeleton,
} from "@mui/material";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import getAge from "get-age";
import Iframe from "./_iframe";
import usePagination from "../pagination";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/feed";
import stepTh from "../stepGuide/th/feed";

const Event = ({ currentPage, lang, setLang, setPage, guide }) => {
  const [data, setData] = React.useState(null);
  const [sam, setSam] = React.useState([]);
  const [pageset, setPagin] = React.useState(1);
  const PER_PAGE = 10;

  let count = Math.ceil(sam.length / PER_PAGE);
  let _DATA = usePagination(sam, PER_PAGE);
  const [open, setOpen] = React.useState(false);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  const event = React.useRef(null);

  const handleChange = (e, p) => {
    if (event.current) {
      event.current.scrollIntoView({ behavior: "smooth" });
    }
    setPagin(p);
    _DATA.jump(p);
  };

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };

    setPage(lang == "th" ? "อัปเดตจากข้าวฟ่าง" : "Social Update");
    fetch(process.env.REACT_APP_APIE_2 + "/kfsite/sociallist", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setData(result.response);
        setSam(result.response);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }} ref={event}>
        {data != null && data[0].postId.includes("facebook.com") ? (
          <CardHeader
            title={<h3>More update of Kaofrang</h3>}
            data-tour="feed"
            subheader={
              lang == "th"
                ? "น้องข้างฟ่างเป็นยังไงบ้าง ไปดูโพสต์ล่าสุดของเธอกัน (อ้างอิงจาก Facebook: Kaofrang BNK48)"
                : "See all Kaofrang Yanisa or Kaofrang BNK48 update here. (From Facebook: Kaofrang BNK48)"
            }
          />
        ) : (
          <CardHeader
            title={<h3>More update of Kaofrang</h3>}
            subheader={
              lang == "th"
                ? "น้องข้างฟ่างเป็นยังไงบ้าง ไปดูโพสต์ล่าสุดของเธอกัน (อ้างอิงจาก Instagram: kaofrang.bnk48official)"
                : "See all Kaofrang Yanisa or Kaofrang BNK48 update here. (From Instagram: kaofrang.bnk48official)"
            }
          />
        )}
          
        <div className="container mt-3">
        {/* <iframe width='340' height="300" src='https://www.facebook.com/v18.0/plugins/page.php?href=https://www.facebook.com/bnk48official.kaofrang&show_posts=true' /> */}
          {data != null ? (
            <Grid
              container
              className="d-flex justify-content-center"
              spacing={2}>
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
                <Grid
                  item
                  lg={8}
                  xs={12}
                  data-aos={"zoom-in-right"}
                  data-tour="feed">
                  <Card key={item.postId} className="mb-3">
                    <CardContent className="col-12">
                      <Iframe item={item} lang={lang} />
                    </CardContent>
                  </Card>
                </Grid>
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
            </Grid>
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
          {data != null && (
            <div className="container text-center">
              {data != null && data[0].postId.includes("facebook.com") ? (
                <Button
                  variant="contained"
                  onClick={() =>
                    window.open(
                      "https://facebook.com/bnk48official.kaofrang",
                      "_blank"
                    )
                  }>
                  {lang == "th"
                    ? "ดูโพสต์อื่น (Facebook: Kaofrang BNK48)"
                    : "View more posts (From Facebook: Kaofrang BNK48)"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() =>
                    window.open(
                      "https://instagram.com/kaofrang.bnk48official",
                      "_blank"
                    )
                  }>
                  {lang == "th"
                    ? "ดูโพสต์อื่น (Instagram: kaofrang.bnk48official)"
                    : "View more posts (Instagram: kaofrang.bnk48official)"}
                </Button>
              )}
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Event);
