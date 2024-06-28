import React from 'react'
import { connect } from 'react-redux';
import {Card, CardContent, Fade, CardHeader, Button, Grid, Avatar, Box, Tabs, Tab, Typography,
    List, ListItem, Chip, Skeleton
} from '@mui/material'
import {
  setLoad, setLang, setDarkMode, setPage
} from '../redux/action';
import getAge from 'get-age';
import Iframe from './_iframe'

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
            method: 'GET'
          };

        setPage(lang == 'th' ? 'อัปเดตจากข้าวฟ่าง' : 'Social Update')
        fetch("https://cpxdevweb.onrender.com/kfsite/sociallist", requestOptions)
            .then(response => response.json())
            .then(result => {
                setData(result.response)
            })
            .catch(error => console.log('error', error));
      }, [])

    return ( <div style={{marginTop: 80, marginBottom: 150}}>
      {data != null && data[0].postId.includes('facebook.com') ? (
        <CardHeader title={<h3>More update of Kaofrang</h3>} subheader={lang == 'th' ? 'น้องข้างฟ่างเป็นยังไงบ้าง ไปดูโพสต์ล่าสุดของเธอกัน (อ้างอิงจาก Facebook: Kaofrang BNK48)' : "See all Kaofrang Yanisa or Kaofrang BNK48 update here. (From Facebook: Kaofrang BNK48)"} />
      ) : (
        <CardHeader title={<h3>More update of Kaofrang</h3>} subheader={lang == 'th' ? 'น้องข้างฟ่างเป็นยังไงบ้าง ไปดูโพสต์ล่าสุดของเธอกัน (อ้างอิงจาก Instagram: kaofrang.bnk48official)' : "See all Kaofrang Yanisa or Kaofrang BNK48 update here. (From Instagram: kaofrang.bnk48official)"} />
      )}
        <div className='container mt-3'>
        {data != null ? (
          <Grid container className='d-flex justify-content-center' spacing={2}>
          {
            data.map((item, i) => (
             <Grid item lg={8} xs={12}>
                 <Card key={item.postId} className='mb-3'>
                    <CardContent className='col-12'>
                    <Iframe item={item} lang={lang} />
                    </CardContent>
                </Card>
             </Grid>
            ))
          }
          </Grid>
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
        <div className='container text-center'>
        {data != null && data[0].postId.includes('facebook.com') ? (
          <Button variant='contained' onClick={() => window.open('https://facebook.com/bnk48official.kaofrang', '_blank')}>{lang == 'th' ? 'ดูโพสต์อื่น (Facebook: Kaofrang BNK48)' : "View more posts (From Facebook: Kaofrang BNK48)"}</Button>
        ) : (
          <Button variant='contained' onClick={() => window.open('https://instagram.com/kaofrang.bnk48official', '_blank')}>{lang == 'th' ? 'ดูโพสต์อื่น (Instagram: kaofrang.bnk48official)' : "View more posts (Instagram: kaofrang.bnk48official)"}</Button>
        )}
        </div>
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
