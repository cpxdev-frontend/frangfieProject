import React from 'react'
import { connect } from 'react-redux';
import {Card, CardContent, Fade, CardHeader, Button, Grid, Avatar, Box, Tabs, Tab, Typography,
    List, ListItem, Chip, Skeleton
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

const Event = ({currentPage, lang, setLang, setPage}) => {
    const [data, setData] = React.useState(null);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

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
      const unix = Math.floor(new Date().getTime() / 1000)
      if (obj.timerange[0] > 0 && obj.timerange[1] == 0) {
        if (unix >= obj.timerange[0]) {
          return lang == 'th' ? 'ปกติ' : 'Normal'
        } else {
          return lang == 'th' ? 'เตรียมความพร้อมในการจัดงาน' : 'Preparing to operate event'
        }
      } else {
        return 'ทดสอบระบบ'
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
              <Card key={item.newsId}>
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
                </Grid>
            </Grid>
                </CardContent>
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
