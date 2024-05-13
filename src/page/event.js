import React from 'react'
import { connect } from 'react-redux';
import {Card, CardContent, LinearProgress, CardHeader, Button, Grid, Avatar, Box, Tabs, Tab, Typography,
    List, ListItem, Chip, Skeleton
} from '@mui/material'
import {
  setLoad, setLang, setDarkMode, setPage
} from '../redux/action';
import getAge from 'get-age';

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

const Event = ({currentPage, lang, setLang, setPage}) => {
    const [data, setData] = React.useState(null);
    const [unix, setValue] = React.useState(Math.floor(new Date().getTime() / 1000));

    const checkeventtype = (obj) => {
        if (obj.locate == null && obj.place == "") {
          return lang == 'th' ? 'กิจกรรมเข้าร่วมแบบออนไลน์' : 'Online event'
        } else {
          if (obj.link != '') {
            return lang == 'th' ? 'กิจกรรมเปิด' : 'Full event (Both Online and Offline event)'
          } else {
            return lang == 'th' ? 'กิจกรรมเข้าร่วมแบบออฟไลน์' : 'Offline event'
          }
        }
    }

    const checkeventstatus = (obj) => {
      if (obj.timerange[0] > 0 && obj.timerange[1] == 0) {
        if (unix >= obj.timerange[0]) {
          return lang == 'th' ? 'ปกติ' : 'Normal'
        } else {
          return lang == 'th' ? 'เตรียมความพร้อมในการจัดงาน' : 'Preparing to operate event'
        }
      } else {
        if (unix >= obj.timerange[0] && unix <= obj.timerange[1]) {
          return lang == 'th' ? 'ปกติ' : 'Normal'
        } else if (unix > obj.timerange[1]) {
          return lang == 'th' ? 'สิ้นสุดแล้ว' : 'All done'
        } else if (unix >= obj.timerange[0] - 432000 && unix < obj.timerange[0]) {
          const d = compareTimestamps(unix, obj.timerange[0]);
          return lang == 'th' ? 'ใกล้เริ่มต้นแล้ว' : 'Coming soon'
        } else {
          return lang == 'th' ? 'กำลังจะมาถึง' : 'Incoming'
        }
      }
  }
  const checktime = (obj) => {
    if (!(obj.timerange[0] > 0 && obj.timerange[1] == 0) && unix >= obj.timerange[0] - 432000 && unix < obj.timerange[0]) {
      const buffer = ((unix - (obj.timerange[0] - 432000)) / (obj.timerange[0] - (obj.timerange[0] - 432000))) * 100;
      return {
        prepare : buffer,
        launch: 0
      }
    } else if (!(obj.timerange[0] > 0 && obj.timerange[1] == 0) && unix >= obj.timerange[0] && unix <= obj.timerange[1]) {
      const ready = ((unix - obj.timerange[0]) / (obj.timerange[1] - obj.timerange[0])) * 100;
      return {
        prepare : 100,
        launch: ready
      }
    } else if (unix > obj.timerange[1]) {
      return {
        prepare : 100,
        launch: 100
      }
    }
    return {
      prepare : 0,
      launch: 0
    }
}


    const [value2, setValue2] = React.useState(0);

    const handleChange2 = (event, newValue) => {
      setValue2(newValue);
    };

    React.useEffect(() => {
        var requestOptions = {
            method: 'POST'
          };

          fetch("https://worldtimeapi.org/api/timezone/utc", {})
            .then(response => response.json())
            .then(result => {
              setValue(result.unixtime)
            })
            .catch(error => console.log('error', error));
        setPage(lang == 'th' ? 'เกี่ยวกับข้าวฟ่าง' : 'All About Kaofrang')
        fetch("https://cpxdevservice.onrender.com/kfsite/listevent", requestOptions)
            .then(response => response.json())
            .then(result => {
                setData(result)
            })
            .catch(error => console.log('error', error));
      }, [])

    return ( <div style={{marginTop: 80, marginBottom: 150}}>
        <CardHeader title={<h3>Incoming Events of Kaofrang</h3>} subheader={lang == 'th' ? 'เร็วๆนี้น้องข้าวฟ่างมีงานอะไรให้เราตามบ้าง ไปดูกัน!' : "See all Kaofrang Yanisa or Kaofrang BNK48 events here."} />
        <div className='container mt-3'>
        {data != null ? (
          <>
          {
            data.map((item, i) => (
              <Card key={item.newsId} className='mb-3'>
                <CardContent>
                  <CardHeader className='pl-0 pb-0' title={<h4>{item.title}</h4>} subheader={<Chip label={(lang == 'th' ? 'สถานะกิจกรรม: ' : "Event status: ") + checkeventstatus(item)} color="primary" />} />
                  <hr />
                <Grid container spacing={2}>
                <Grid item lg={5} xs={12}>
                  <Avatar src={item.src} variant='rounded' sx={{width: {md:'400px', xs: '100%'}, height: '100%'}} />
                </Grid>
                <Grid item lg={7} xs={12}>
                    <h6 className='text-muted'>{lang == 'th' ? 'ประเภทกิจกรรม' : "Event Type"}: {checkeventtype(item)}</h6>
                    <p className='mt-4'>{lang == 'th' ? 'รายละเอียดกิจกรรม' : "Description"}: {item.desc}</p>
                    {
                      !(item.locate == null && item.place == "") && (
                        <Button variant='outlined' className='mt-3'>{lang == 'th' ? 'สถานที่จัดงาน' : "Event location"}</Button>
                      )
                    }
                     {
                      item.link != '' && (
                        <Button variant='outlined' onClick={() => window.open(item.link.includes('http') ? item.link : 'https://cp-bnk48.pages.dev/' + item.link, '_blank')} className='mt-3'>{lang == 'th' ? 'ดูเพิ่มเติม' : "View more"}</Button>
                      )
                    }
                </Grid>
            </Grid>
                </CardContent>
                {
                  !(checktime(item).prepare == 0 && checktime(item).launch == 0) && (
                    <LinearProgress sx={{width: '100%', height: window.innerHeight * 0.02}} variant="buffer" value={checktime(item).launch} valueBuffer={checktime(item).prepare} />
                  )
                }
              </Card>
            ))
          }
          </>
        ) : (
          <Card>
            <CardContent>
              <Skeleton variant="text" className='bg-m' sx={{ fontSize: '2rem' }} />
              <Skeleton variant="text" className='bg-m' sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" className='bg-m' sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" className='bg-m' sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" className='bg-m' sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" className='bg-m' sx={{ fontSize: '1rem' }} />
            </CardContent>
          </Card>
        )}
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
  export default connect(mapStateToProps, mapDispatchToProps)(Event);
