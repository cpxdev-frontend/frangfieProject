import React from 'react'
import { connect } from 'react-redux';
import {Card, CardContent, Fade, CardHeader, Button, Grid, Avatar, Box, Tabs, Tab, Typography,
    List, ListItem, ListItemText, Skeleton
} from '@mui/material'
import {
  setLoad, setLang, setDarkMode, setPage
} from '../redux/action';
import getAge from 'get-age';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
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
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  function a11yProps2(index) {
    return {
      id: `simple-tab2-${index}`,
      'aria-controls': `simple-tabpanel2-${index}`,
    };
  }

const About = ({currentPage, lang, setLang, setPage}) => {
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
            method: 'POST',
            headers: {
                "Origin": "cp-bnk48.pages.dev"
              }
          };

        setPage(lang == 'th' ? 'เกี่ยวกับข้าวฟ่าง' : 'All About Kaofrang')
        fetch("https://cpxdevservice.onrender.com/bnk48/getmember?name=kaofrang", requestOptions)
            .then(response => response.json())
            .then(result => {
                setData(result.response)
            })
            .catch(error => console.log('error', error));
      }, [])

    return ( <div style={{marginTop: 100, marginBottom: 150}}>
        <CardHeader title={<h3>All about Kaofrang</h3>} subheader={lang == 'th' ? 'มารู้จักตัวตนของน้องข้าวฟ่างเบื้องต้นกันเถอะ!' : "Let's know about Kaofrang Yanisa or Kaofrang BNK48 on basic step."} />
        <div className='container mt-3'>
        {
            data != null ? (
                <>
                <Grid container spacing={5}>
                    <Grid item lg={5} xs={12}>
                        <Avatar src={data.img} sx={{width: {md:'400px', xs: '100%'}, height: {md:'400px', xs: '100%'}}} />
                    </Grid>
                    <Grid item lg={7} xs={12}>
                        <Grid xs={12}>
                            <CardHeader className='pl-0' title={<h4>{lang == 'th'? 'ชื่อจริง' : 'Fullname'}: {lang == 'th' ? data.fullnameTh[0] : data.fullnameEn[1]} {lang == 'th' ? data.fullnameTh[1] : data.fullnameEn[1]}</h4>}
                            subheader={<h5>{lang == 'th'? 'ชื่อเล่น' : 'Nickname'}: {lang == 'th' ? 'ข้าวฟ่าง' : data.name}</h5>} />
                            <p>{lang == 'th'? 'ภูมิลำเนา' : 'Domicile'}: {lang == 'th' ? 'กรุงเทพมหานคร' : 'Bangkok, Thailand'}</p>
                            <p>{lang == 'th'? 'กรุ๊ปเลือด' : 'Blood Group'}: {lang == 'th' ? 'เอ' : 'A'}</p>
                            <p>{lang == 'th'? 'วันเกิด' : 'Birthday'}: {new Date(data.birthday).toDateString()}</p>
                            <p>{lang == 'th'? 'อายุ' : 'Age'}: {getAge(data.birthday) + (lang == 'th' ? ' ปี' : ' year(s) old')}</p>
                            <p>{lang == 'th'? 'สังกัดศิลปิน' : 'Music label'}: {lang == 'th' ? (["อินดิเพนเด้นท์ อาร์ททิสต์ เมเนจเม้นท์ - ไอแอม (บีเอ็นเคโฟตี้เอต)", "อินดิเพนเด้นท์ เรคคอร์ด - ไออาร์ (โปรเจค \"อินดี้ แคมป์\" ครั้งที่สอง)"]).join(", ") : (["Independent Artist Management - iAM (BNK48)", "Independent Records - iR (Indy Camp Season 2 Project)"]).join(", ")}</p>
                        </Grid>
                        <Grid xs={12} className='mt-3 pt-3'>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" allowScrollButtonsMobile>
                                    <Tab sx={{color: '#000'}} label={lang == 'th'? 'สมาชิกบีเอ็นเคโฟตี้เอต' : 'BNK48 member'} {...a11yProps(0)} />
                                    <Tab sx={{color: '#000'}} label={lang == 'th'? 'ศิลปินสังกัดอินดิเพนเด้นท์ เรคคอร์ด' : 'Independent Records Artist'} {...a11yProps(1)} />
                                </Tabs>
                                </Box>
                                <CustomTabPanel value={value} index={0}>
                                    <h4>{lang == 'th'? 'ข้อมูลด้านการเป็นสมาชิกบีเอ็นเคโฟตี้เอต' : 'All about Kaofrang as BNK48 member'}</h4>
                                    <h6>{lang == 'th'? 'ลำดับรุ่น' : 'Member Generation'}: {lang == 'th' ? 'รุ่นที่สาม' : 'Third Generation'}</h6>
                                    <h6>{lang == 'th'? 'ทีมบนสเตจเธียเตอร์' : 'Stage Team'}: {lang == 'th' ? 'เอ็นไฟว์ (NV) - รองกับตันทีม' : 'NV (N Five) - Team Vice Captain'}</h6>
                                    <h6>{lang == 'th'? 'สิ่งที่ชอบ' : 'Favorite'}: {lang == 'th' ? 'ลาบทอด, เจ้าหญิง, ท้องฟ้า, เดินตลาด, สีชมพูม หนังสยองขวัญ' : data.favorite.join(', ')}</h6>
                                    <h6>{lang == 'th'? 'งานอดิเรก' : 'Hobbies'}: {lang == 'th' ? 'ดูหนัง ซี่รีส์ เล่นอูคูเลเล่ กีตาร์ เล่นเกมออนไลน์' : data.hobby.join(', ')}</h6>
                                </CustomTabPanel>
                                <CustomTabPanel value={value} index={1}>
                                    <h4>{lang == 'th'? 'ข้อมูลด้านการเป็นศิลปินสังกัดอินดิเพนเด้นท์ เรคคอร์ด' : 'All about Kaofrang Yanisa as Artist'}</h4>
                                    <h6>{lang == 'th'? 'ชื่อศิลปินประจำสังกัด' : 'Artist name'}: {lang == 'th' ? 'ข้าวฟ่าง ' + data.fullnameTh[0] : data.name + ' ' + data.fullnameEn[0]}</h6>
                                    <h6>{lang == 'th'? 'ชื่อวง/โปรเจคของศิลปิน' : 'Band Name/Artist Project'}: {lang == 'th' ? 'อินดี้ แคมป์ ครั้งที่ 2' : 'Indy Camp Season 2'}</h6>
                                </CustomTabPanel>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <hr />
                    <Grid xs={12}>
                            <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value2} onChange={handleChange2} variant="scrollable" allowScrollButtonsMobile>
                                    <Tab sx={{color: '#000'}} label={lang == 'th'? 'ไลฟ์สไตล์ของน้องข้าวฟ่าง' : "All about Kaofrang's Lifestyle"} {...a11yProps2(0)} />
                                    <Tab sx={{color: '#000'}} label={lang == 'th'? 'เกร็ดความรู้เกี่ยวกับระบบวงบีเอ็นเคโฟตี้เอต' : 'All about BNK48'} {...a11yProps2(1)} />
                                    <Tab sx={{color: '#000'}} label={lang == 'th'? 'เกร็ดความรู้เกี่ยวกับค่ายเพลงอินดิเพนเด้นท์ เรคคอร์ด' : 'All about Independent Records (iR)'} {...a11yProps2(2)} />
                                </Tabs>
                                </Box>
                                <CustomTabPanel value={value2} index={0}>
                                    <List
                                        component="nav"
                                        sx={{ bgcolor: 'background.paper' }}
                                    >
                                        <ListItem>
                                            <ListItemText
                                                secondary={<p>{lang == 'th'? 'บีเอ็นเคโฟตี้เอตเป็น 1 ใน 12 วงน้องสาวของ AKB48 โดยอยู่ที่กรุงเทพมหานครเป็นหลัก รูปแบบวงจะมีความเป็น J-POP ผสมผสานกับความเป็น Idol Group โดยในปัจจุบันถือว่าเป็นศิลปินกลุ่มที่จำนวนสมาชิกมากที่สุดในไทย' : 'BNK48 is the one of twelve sister girl group of AKB48 which is based at Bangkok, Thailand. Band unique is mixed between J-POP and Idol group styles. They are the artist with the largest number of members in Thailand.'}</p>}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                secondary={<p>{lang == 'th'? 'ในเดือนพฤษภาคม 2567 วงบีเอ็นเคโฟตี้เอตมีสมาชิกทั้งหมดสี่รุ่น โดยมีรุ่นที่ 1, 3, 4 และ 5 (โดยรุ่นที่ 2 ได้จบการศึกษาหรือสิ้นสุดสัญญากับทางวงโดยทั้งหมดแล้วตั้งแต่เดือนเมษายน 2567) รวมทั้งสิ้น 40 คน' : 'As of May 2024, BNK48 are included 4 generations by 1st Generation, 3rd Generation, 4th and 5th Generation (All BNK48 2nd Generation members are graduated or contract with BNK48 is expired in April 2024.). So that BNK48 have 40 members right now.'}</p>}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                secondary={<p>{lang == 'th'? 'บีเอ็นเคโฟตี้เอตจะมีเธียเตอร์หรือโรงละครเป็นพื้นที่สำหรับแสดงโชว์ของเมมเบอรืแต่ละคน โดยจะมีการจัดแบ่งเป็นทั้งหมด 3 ทีมได้แก่ ทีม บีทรี (BIII), เอ็นไฟว์ (NV) และทีมฝึกหัด (Trainee) โดยในแต่ละทึมจะมีรูปแบบการแสดงที่ต่างกันออกไปในแต่ละทีม และจะมีการจัดลำดับการแสดงสลับกันไปในทุกสัปดาห์ (ปัจจุบันเธียเตอร์อยู่ระหว่างการจัดหาสถานที่ชั่วคราว หลังจากหมดสัญญากับทางเดอะมอลล์ไลฟ์สโตร์ บางกะปิ)' : 'BNK48 is included their own Theater where is place to showtime exclusive performance with managed by main 3 teams such as B Three (BIII), N Five (NV) and Trainee teams. Each team will have their own unique performance format, and the performance order will rotate weekly. (์But now theater is temporary place and currently find for permenent place. After rental contract with The Mall LifeStore Bangkapi has expired)'}</p>}
                                            />
                                        </ListItem>
                                    </List>
                                </CustomTabPanel>
                                <CustomTabPanel value={value2} index={1}>
                                    <List
                                        component="nav"
                                        sx={{ bgcolor: 'background.paper' }}
                                    >
                                        <ListItem>
                                            <ListItemText
                                                secondary={<p>{lang == 'th'? 'บีเอ็นเคโฟตี้เอตเป็น 1 ใน 12 วงน้องสาวของ AKB48 โดยอยู่ที่กรุงเทพมหานครเป็นหลัก รูปแบบวงจะมีความเป็น J-POP ผสมผสานกับความเป็น Idol Group โดยในปัจจุบันถือว่าเป็นศิลปินกลุ่มที่จำนวนสมาชิกมากที่สุดในไทย' : 'BNK48 is the one of twelve sister girl group of AKB48 which is based at Bangkok, Thailand. Band unique is mixed between J-POP and Idol group styles. They are the artist with the largest number of members in Thailand.'}</p>}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                secondary={<p>{lang == 'th'? 'ในเดือนพฤษภาคม 2567 วงบีเอ็นเคโฟตี้เอตมีสมาชิกทั้งหมดสี่รุ่น โดยมีรุ่นที่ 1, 3, 4 และ 5 (โดยรุ่นที่ 2 ได้จบการศึกษาหรือสิ้นสุดสัญญากับทางวงโดยทั้งหมดแล้วตั้งแต่เดือนเมษายน 2567) รวมทั้งสิ้น 40 คน' : 'As of May 2024, BNK48 are included 4 generations by 1st Generation, 3rd Generation, 4th and 5th Generation (All BNK48 2nd Generation members are graduated or contract with BNK48 is expired in April 2024.). So that BNK48 have 40 members right now.'}</p>}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                secondary={<p>{lang == 'th'? 'บีเอ็นเคโฟตี้เอตจะมีเธียเตอร์หรือโรงละครเป็นพื้นที่สำหรับแสดงโชว์ของเมมเบอรืแต่ละคน โดยจะมีการจัดแบ่งเป็นทั้งหมด 3 ทีมได้แก่ ทีม บีทรี (BIII), เอ็นไฟว์ (NV) และทีมฝึกหัด (Trainee) โดยในแต่ละทึมจะมีรูปแบบการแสดงที่ต่างกันออกไปในแต่ละทีม และจะมีการจัดลำดับการแสดงสลับกันไปในทุกสัปดาห์ (ปัจจุบันเธียเตอร์อยู่ระหว่างการจัดหาสถานที่ชั่วคราว หลังจากหมดสัญญากับทางเดอะมอลล์ไลฟ์สโตร์ บางกะปิ)' : 'BNK48 is included their own Theater where is place to showtime exclusive performance with managed by main 3 teams such as B Three (BIII), N Five (NV) and Trainee teams. Each team will have their own unique performance format, and the performance order will rotate weekly. (์But now theater is temporary place and currently find for permenent place. After rental contract with The Mall LifeStore Bangkapi has expired)'}</p>}
                                            />
                                        </ListItem>
                                    </List>
                                </CustomTabPanel>
                                <CustomTabPanel value={value2} index={2}>

                                </CustomTabPanel>
                            </Box>
                        </Grid>
                </>
            ) : (
                <Grid container spacing={5}>
                <Grid item lg={5} xs={12}>
                    <Skeleton variant='circular' className='bg-m' sx={{width: { md:'400px', xs:'100%'}, height: { md:'400px', xs:'100%'}}} />
                </Grid>
                <Grid item lg={7} xs={12}>
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '4rem' }} />
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '2rem' }} />
                    <Skeleton variant="text" className='bg-m mt-2' sx={{ fontSize: '15px' }} />
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '15px' }} />
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '15px' }} />
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '15px' }} />
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '15px' }} />
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '15px' }} />
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '15px' }} />
                    <Skeleton variant="text" className='bg-m mt-4' sx={{ fontSize: '3rem' }} />
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '15px' }} />
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '15px' }} />
                    <Skeleton variant="text" className='bg-m' sx={{ fontSize: '15px' }} />
                </Grid>
            </Grid>
            )
        }
        </div>
    </div> );
}
 
const mapStateToProps = (state) => ({
    load: state.load,
    dark: state.dark,
    lang: state.lang,
    currentPage: state.currentPage
  });
  const mapDispatchToProps = (dispatch) => ({
    setLoad: (val) => dispatch(setLoad(val)),
    setDark: (val) => dispatch(setDarkMode(val)),
    setLang: (val) => dispatch(setLang(val)),
    setPage: (val) => dispatch(setPage(val))
  });
  export default connect(mapStateToProps, mapDispatchToProps)(About);
