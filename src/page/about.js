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
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import getAge from "get-age";
import moment from "moment";

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

const About = ({ currentPage, lang, setLang, setPage }) => {
  const [data, setData] = React.useState(null);
  const [value, setValue] = React.useState(0);

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
      headers: {
        Origin: "cp-bnk48.pages.dev",
      },
    };

    setPage(lang == "th" ? "เกี่ยวกับข้าวฟ่าง" : "All About Kaofrang");
    fetch(
      "https://cpxdevweb.onrender.com/bnk48/getmember?name=kaofrang",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.response);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <div style={{ marginTop: 80, marginBottom: 150 }}>
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
          <>
            <Grid container spacing={5}>
              <Grid item lg={5} xs={12}>
                <Avatar
                  src={data.img}
                  sx={{
                    width: { md: "400px", xs: "100%" },
                    height: { md: "400px", xs: "100%" },
                  }}
                />
              </Grid>
              <Grid item lg={7} xs={12}>
                <Grid xs={12}>
                  <CardHeader
                    className="pl-0"
                    title={
                      <h4>
                        {lang == "th" ? "ชื่อจริง" : "Fullname"}:{" "}
                        {lang == "th" ? data.fullnameTh[0] : data.fullnameEn[0]}{" "}
                        {lang == "th" ? data.fullnameTh[1] : data.fullnameEn[1]}
                      </h4>
                    }
                    subheader={
                      <h5>
                        {lang == "th" ? "ชื่อเล่น" : "Nickname"}:{" "}
                        {lang == "th" ? "ข้าวฟ่าง" : data.name}
                      </h5>
                    }
                  />
                  <p>
                    {lang == "th" ? "ภูมิลำเนา" : "Domicile"}:{" "}
                    {lang == "th" ? "กรุงเทพมหานคร" : "Bangkok, Thailand"}
                  </p>
                  <p>
                    {lang == "th" ? "กรุ๊ปเลือด" : "Blood Group"}:{" "}
                    {lang == "th" ? "เอ" : "A"}
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
                    {lang == "th"
                      ? [
                          "อินดิเพนเด้นท์ อาร์ททิสต์ เมเนจเม้นท์ - ไอแอม (บีเอ็นเคโฟตี้เอต)",
                          'อินดิเพนเด้นท์ เรคคอร์ด - ไออาร์ (โปรเจค "อินดี้ แคมป์" ครั้งที่สอง)',
                        ].join(", ")
                      : [
                          "Independent Artist Management - iAM (BNK48)",
                          "Independent Records - iR (Indy Camp Season 2 Project)",
                        ].join(", ")}
                  </p>
                </Grid>
                <Grid xs={12} className="mt-3 pt-3">
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                        variant="scrollable"
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
                    <CustomTabPanel value={value} index={0}>
                      <h4>
                        {lang == "th"
                          ? "ข้อมูลด้านการเป็นสมาชิกบีเอ็นเคโฟตี้เอต"
                          : "All about Kaofrang as BNK48 member"}
                      </h4>
                      <h6>
                        {lang == "th" ? "ลำดับรุ่น" : "Member Generation"}:{" "}
                        {lang == "th" ? "รุ่นที่สาม" : "Third Generation"}
                      </h6>
                      <h6>
                        {lang == "th" ? "ทีมบนสเตจเธียเตอร์" : "Stage Team"}:{" "}
                        {lang == "th"
                          ? "เอ็นไฟว์ (NV) - รองกับตันทีม"
                          : "NV (N Five) - Team Vice Captain"}
                      </h6>
                      <h6>
                        {lang == "th" ? "สิ่งที่ชอบ" : "Favorite"}:{" "}
                        {lang == "th"
                          ? "ลาบทอด, เจ้าหญิง, ท้องฟ้า, เดินตลาด, สีชมพูม หนังสยองขวัญ"
                          : data.favorite.join(", ")}
                      </h6>
                      <h6>
                        {lang == "th" ? "งานอดิเรก" : "Hobbies"}:{" "}
                        {lang == "th"
                          ? "ดูหนัง ซี่รีส์ เล่นอูคูเลเล่ กีตาร์ เล่นเกมออนไลน์"
                          : data.hobby.join(", ")}
                      </h6>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      <h4>
                        {lang == "th"
                          ? "ข้อมูลด้านการเป็นศิลปินสังกัดอินดิเพนเด้นท์ เรคคอร์ด"
                          : "All about Kaofrang Yanisa as Artist"}
                      </h4>
                      <h6>
                        {lang == "th" ? "ชื่อศิลปินประจำสังกัด" : "Artist name"}
                        :{" "}
                        {lang == "th"
                          ? "ข้าวฟ่าง " + data.fullnameTh[0]
                          : data.name + " " + data.fullnameEn[0]}
                      </h6>
                      <h6>
                        {lang == "th"
                          ? "ชื่อวง/โปรเจคของศิลปิน"
                          : "Band Name/Artist Project"}
                        :{" "}
                        {lang == "th"
                          ? "อินดี้ แคมป์ ครั้งที่ 2"
                          : "Indy Camp Season 2"}
                      </h6>
                    </CustomTabPanel>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <hr />
            <Grid xs={12}>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value2}
                    onChange={handleChange2}
                    variant="scrollable"
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
                <CustomTabPanel value={value2} index={0}>
                  <List component="nav" sx={{ bgcolor: "background.paper" }}>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "ข้าวฟ่างได้ปรากฎตัวครั้งแรกที่โรงละครของวง เมื่อวันที่ " +
                                moment
                                  .unix(1599627600)
                                  .local()
                                  .lang(lang)
                                  .format("DD MMMM YYYY")
                              : "Kaofrang Yanisa made her first appearance at BNK48 Theater since " +
                                moment
                                  .unix(1599627600)
                                  .local()
                                  .lang(lang)
                                  .format("DD MMMM YYYY")}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "ข้าวฟ่างได้เปิดตัวสู่สาธารณะครั้งแรกตั้งแต่วันที่ " +
                                moment("2020-08-09")
                                  .lang(lang)
                                  .format("DD MMMM YYYY") +
                                " (อ้างอิงจากวันที่สมาชิกรุ่นที่สามโพสต์โซเชียลเป็นครั้งแรก)"
                              : "Kaofrang Yanisa is come to join as BNK48 3rd Generation on publicly since " +
                                moment("2020-08-09")
                                  .lang(lang)
                                  .format("DD MMMM YYYY") +
                                ". (Based from the first social update of BNK48 3rd Generation.)"}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "ข้าวฟ่างมีความชื่นชอบด้านฟุตบอลและวงการด้านสกุลเงินดิจิทัล (Crypto Currency)"
                              : "She likes sport especially in soccer. And also update herself about Crypto Currency."}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? 'หนึ่งในของหวานสุดโปรดที่ข้าวฟ่างสามารถทานได้โดยไม่รู้เบื่อ ก็คือ "ขนมเบื้อง"'
                              : 'One of her favorite desserts that she can enjoy anytime she wants is "Thai Crispy Pancake"'}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? 'ที่หอพักของบีเอ็นเคโฟตี้เอต จะมีบางเมมเบอร์ที่ต้องอยู่ร่วมกันในห้องเดียวซึ่งเรียกว่าคู่บัดดี้ โดยข้าวฟ่างมี "น้องเกรซ" เป็นคู่บัดดี้ของข้าวฟ่าง และยังเป็นสมาชิกรุ่นสามเหมือนกันอีกด้วย'
                              : 'Some BNK48 members will have "Dorm Buddy Duo" when live at their dorm. And Kaofrang also has her buddy called "Grace Virunpat" who is also BNK48 3rd Generation members too.'}
                          </p>
                        }
                      />
                    </ListItem>
                  </List>
                </CustomTabPanel>
                <CustomTabPanel value={value2} index={1}>
                  <List component="nav" sx={{ bgcolor: "background.paper" }}>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "เมื่อวันที่ " +
                                moment
                                  .unix(1467824400)
                                  .lang(lang)
                                  .format("DD MMMM YYYY") +
                                " ต้นสังกัดของกลุ่มวงโฟตี้เอตประกาศจัดตั้งวงน้องสาวทั้งหมด 3 วงได้แก่ บีเอ็นเคโฟตี้เอต, เอ็มเอ็นแอลโฟตี้เอต และทีพีอีโฟตี้เอต (ปัจจุบันคือเอเคบีโฟตี้เอต ทีมทีพี)"
                              : "In " +
                                moment
                                  .unix(1467824400)
                                  .lang(lang)
                                  .format("DD MMMM YYYY") +
                                ", 48 Group Fanchise Owner announced to preparing found sister band girl group such as BNK48, MNL48 and TPE48 (AKB48 Team TP)."}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "เมื่อวันที่ " +
                                moment
                                  .unix(1486832400)
                                  .lang(lang)
                                  .format("DD MMMM YYYY") +
                                ' ได้มีการเปิดตัวสมาชิกกลุ่มแรกของวง และประกาศให้ "เฌอปราง" เป็นกับตันวงคนแรก'
                              : "In " +
                                moment
                                  .unix(1486832400)
                                  .lang(lang)
                                  .format("DD MMMM YYYY") +
                                ', BNK48 announced the first generation and "Cherprang" as the first band captain.'}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? 'เปิดตัวซิงเกิ้ลแรก "Aittakata - อยากจะได้พบเธอ" เมื่อวันที่ ' +
                                moment
                                  .unix(1496336400)
                                  .lang(lang)
                                  .local()
                                  .format("DD MMMM YYYY")
                              : 'The first performance of the first single "Aittakata - อยากจะได้พบเธอ" in ' +
                                moment
                                  .unix(1496336400)
                                  .lang(lang)
                                  .local()
                                  .format("DD MMMM YYYY")}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "เปิดตัว Digital LIVE Studio (ตู้ปลา) ที่ศูนย์การค้าเอ็มควอเทียร์ในวันที่ " +
                                moment
                                  .unix(1496466000)
                                  .lang(lang)
                                  .local()
                                  .format("DD MMMM YYYY")
                              : 'Grand opening of "Digital LIVE Studio" at EmQuartier in ' +
                                moment
                                  .unix(1496466000)
                                  .lang(lang)
                                  .local()
                                  .format("DD MMMM YYYY")}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "งานจับมือครั้งแรกของวงเกิดขึ้นเมื่อวันที่ " +
                                moment
                                  .unix(1503680400)
                                  .lang(lang)
                                  .local()
                                  .format("DD MMMM YYYY")
                              : "The first Handshake event in " +
                                moment
                                  .unix(1503680400)
                                  .lang(lang)
                                  .local()
                                  .format("DD MMMM YYYY")}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? 'คอนเสิร์ตใหญ่ครั้งแรกของวง "Starto Concert" ภายใต้การควบคุมโดยโอม ปัณฑพล (โอม วงค็อกเทล) เมื่อเดือน ' +
                                moment
                                  .unix(1522558800)
                                  .utc()
                                  .format("MMMM YYYY")
                              : 'The first BNK48 LIVE concert "Starto Concert" produced by Ohm Panthapol (Ohm Cocktail or Ohm GeneLabs). And the announcement place of the first BNK48 album "RIVER" in ' +
                                moment
                                  .unix(1522558800)
                                  .utc()
                                  .format("MMMM YYYY")}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? 'การแสดงครั้งแรกที่เกิดขึ้นในโรงละครของวงที่เดอะมอลล์บางกะปิ โดยจะเป็นการแสดงสุดพิเศษที่มีให้รับชม "เฉพาะ" ในโรงละครนี้เท่านั้นและจะต้องมีการสุ่มสิทธิ์เพื่อให้ได้สิทะิ์การเข้ารับชมเนื่องด้วยที่นั่งจำนวนจำกัด รวมทั้งเป็นพื้นที่การแสดงให้วงในเครือข่ายโฟร์ตี้เอตได้มีส่วนร่วมด้วย เมื่อเดือน ' +
                                moment
                                  .unix(1524718800)
                                  .utc()
                                  .format("MMMM YYYY")
                              : "The first stage show of BNK48 at BNK48 Theater at The Mall Bangkapi. BNK48 Theater the their theater. So that the BNK48 members have the opportunity to fully show their singing and dancing performances. Including fans will receive exclusive access to viewing because you have to randomly have access to see because seats are limited. And are inherent in almost all circles of the 48 Group's culture in " +
                                moment
                                  .unix(1524718800)
                                  .utc()
                                  .format("MMMM YYYY")}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "คอนเสิร์ตครั้งแรกของรุ่นแรกและรุ่นที่สอง และการเปิดตัวรุ่นที่สองอย่างเป็นทางการ เมื่อเดือน " +
                                moment
                                  .unix(1536987600)
                                  .utc()
                                  .format("DD MMMM YYYY")
                              : 'The first BNK48 1st and 2nd Generation concert. And the officail debut of 2nd Generation. And also the first performance of the 4th Single "Kimi wa melody" in ' +
                                moment
                                  .unix(1536987600)
                                  .utc()
                                  .format("DD MMMM YYYY")}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "รุ่นที่สามปรากฎตัวครั้งแรกที่โรงละครของวง เมื่อวันที่ " +
                                moment
                                  .unix(1599627600)
                                  .local()
                                  .lang(lang)
                                  .format("DD MMMM YYYY")
                              : "BNK48 3rd Generation made their first appearance at BNK48 Theater since " +
                                moment
                                  .unix(1599627600)
                                  .local()
                                  .lang(lang)
                                  .format("DD MMMM YYYY")}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "เปิดตัวเทคโนโลยีบล็อกเชนสำหรับกิจกรรมของวง (เป็นการร่วมทุนกับ TokenX ในเครือบริษัทเอสซีบี เอ็กซ์ จำกัด (มหาชน)) เมื่อวันที่ " +
                                moment
                                  .unix(1654146000)
                                  .local()
                                  .lang(lang)
                                  .format("DD MMMM YYYY")
                              : "Launch blockchain technology system (Collab with TokenX (Undered by SCBX PCL.)) since " +
                                moment
                                  .unix(1654146000)
                                  .local()
                                  .lang(lang)
                                  .format("DD MMMM YYYY")}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "ในเดือนพฤษภาคม 2567 วงบีเอ็นเคโฟตี้เอตมีสมาชิกทั้งหมดสี่รุ่น โดยมีรุ่นที่ 1, 3, 4 และ 5 (โดยรุ่นที่ 2 ได้จบการศึกษาหรือสิ้นสุดสัญญากับทางวงโดยทั้งหมดแล้วตั้งแต่เดือนเมษายน 2567) รวมทั้งสิ้น 40 คน"
                              : "As of May 2024, BNK48 are included 4 generations by 1st Generation, 3rd Generation, 4th and 5th Generation (All BNK48 2nd Generation members are graduated or contract with BNK48 is expired in April 2024.). So that BNK48 have 40 members right now."}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "บีเอ็นเคโฟตี้เอตจะมีเธียเตอร์หรือโรงละครเป็นพื้นที่สำหรับแสดงโชว์ของเมมเบอรืแต่ละคน โดยจะมีการจัดแบ่งเป็นทั้งหมด 3 ทีมได้แก่ ทีม บีทรี (BIII), เอ็นไฟว์ (NV) และทีมฝึกหัด (Trainee) โดยในแต่ละทึมจะมีรูปแบบการแสดงที่ต่างกันออกไปในแต่ละทีม และจะมีการจัดลำดับการแสดงสลับกันไปในทุกสัปดาห์ (ปัจจุบันเธียเตอร์อยู่ระหว่างการจัดหาสถานที่ชั่วคราว หลังจากหมดสัญญากับทางเดอะมอลล์ไลฟ์สโตร์ บางกะปิ)"
                              : "BNK48 is included their own Theater where is place to showtime exclusive performance with managed by main 3 teams such as B Three (BIII), N Five (NV) and Trainee teams. Each team will have their own unique performance format, and the performance order will rotate weekly. (์But now theater is temporary place and currently find for permenent place. After rental contract with The Mall LifeStore Bangkapi has expired)"}
                          </p>
                        }
                      />
                    </ListItem>
                  </List>
                </CustomTabPanel>
                <CustomTabPanel value={value2} index={2}>
                  <List component="nav" sx={{ bgcolor: "background.paper" }}>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "อินดิเพนเด้นท์ เรคคอร์ด ก่อตั้งเมื่อวันที่ " +
                                moment
                                  .unix(1664265600)
                                  .lang(lang)
                                  .format("DD MMMM YYYY") +
                                " โดยมีสถานะเป็นค่ายเพลงลูกในเครืออินดิเพนเด้นท์ อาร์ททิสต์ เมเนจเม้นท์ (ไอแอม) โดยมีวัตถุประสงค์เพื่อดึงศิลปินบีเอ็นเคโฟร์ตี้เอต และซีจีเอ็มโฟร์ตี้เอตเป็นศิลปินหน้าใหม่โดยเน้นความเป็นตัวเองโดยไม่ขึ้นต่อระบบ 48 Group และผลิตผลงานเพลงที่ตอบโจทย์กลุ่มตลาดที่หลากหลายขึ้น"
                              : "Independent Records found in " +
                                moment
                                  .unix(1664265600)
                                  .lang(lang)
                                  .format("DD MMMM YYYY") +
                                ". It is a affiliated music label company of Independent Artist Management (iAM) With the objective of promote BNK48 and CGM48 members to be as new artist and independent of the 48 group system. Also enhance new market target in music industries."}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "ในวันเดียวกัน ทางค่ายได้เปิดตัวศิลปินคนแรกในค่ายคือ ณัฐรุจา ชุติวรรณโสภณ (แก้ว) [ปัจจุบันแก้วได้เป็นศิลปินอิสระแล้ว]"
                              : 'Independent Records announced "Natruja Chutiwansopon (Kaew)" as the first artist of music label company. [She is currently independent artist now]'}
                          </p>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        secondary={
                          <p>
                            {lang == "th"
                              ? "อินดิเพนเด้นท์ เรคคอร์ด มีศิลปินในค่ายในปัจจุบันคือ คาร่า และในอดีตมีศิลปินกลุ่มได้แก่ อีร่า รวมทั้งมีโปรเจคอินดี้แคมป์ เป็นโปรเจคพิเศษที่ทางค่ายจัดทำขึ้นมาเพื่อให้ศิลปินมีผลงานเพลงที่แต่งด้วยตนเองและร้องเองได้"
                              : "Independent Records included currently affiliated artists as QRRA. and also former artist as ERAA and also Indy Camp Project (Season 1 ans 2)"}
                          </p>
                        }
                      />
                    </ListItem>
                  </List>
                </CustomTabPanel>
              </Box>
            </Grid>
          </>
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(About);
