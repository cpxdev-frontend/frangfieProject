import React from 'react'
import { connect } from 'react-redux';
import {Card, CardContent, LinearProgress, CardHeader, Button, Grid, Avatar, Box, Tabs, Tab, Typography,
    List, ListItem, Chip, Skeleton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material'
import {
  setLoad, setLang, setDarkMode, setPage
} from '../redux/action';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import moment from 'moment';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3B4dGgyMDE3IiwiYSI6ImNsZHY0MzN6bTBjNzEzcXJmamJtN3BsZ3AifQ.mYNwWaYKsiLeYXngFDtaWQ';

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

const Event = ({currentPage, lang, setLang, setPage, launch}) => {
    const [data, setData] = React.useState(null);
    const [getData, setGetData] = React.useState(null);
    const unix = launch;
    
    const getMap = (item) => {
      if (item.place.includes("IAMP")) {
        setGetData({
          locate: item.placeobj.placeCoodinate,
          place: item.placeobj.ref
        })
      } else {
        setGetData({
          place: item.place,
          locate: item.locate
        })
      }
    }

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
    if (obj.timerange[0] > 0 && obj.timerange[1] > 0 && unix >= obj.timerange[0] - 432000 && unix < obj.timerange[0]) {
      const buffer = ((unix - (obj.timerange[0] - 432000)) / (obj.timerange[0] - (obj.timerange[0] - 432000))) * 100;
      return {
        prepare : buffer,
        launch: 0
      }
    } else if (obj.timerange[0] > 0 && obj.timerange[1] > 0 && unix >= obj.timerange[0] && unix <= obj.timerange[1]) {
      const ready = ((unix - obj.timerange[0]) / (obj.timerange[1] - obj.timerange[0])) * 100;
      return {
        prepare : 100,
        launch: ready
      }
    } else if (obj.timerange[0] > 0 && obj.timerange[1] > 0 && unix > obj.timerange[1]) {
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


React.useEffect(() => {
  console.log(getData)
}, [getData])

    React.useEffect(() => {
        var requestOptions = {
            method: 'POST'
          };
       
        setPage(lang == 'th' ? 'ข้อมูลกิจกรรม' : 'Events of Kaofrang')
        fetch("https://cpxdevservice.onrender.com/kfsite/listevent", requestOptions)
            .then(response => response.json())
            .then(result => {
              setGetData(undefined)
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
              <Card key={item.newsId} className='mb-3' sx={{opacity: item.timerange[1] > 0 && unix >= item.timerange[1] ? 0.6 : 1}}>
                <CardContent>
                  <CardHeader className='pl-0 pb-0' title={<h4>{item.title}</h4>} subheader={<Chip label={(lang == 'th' ? 'สถานะกิจกรรม: ' : "Event status: ") + checkeventstatus(item)} color="primary" />}
                    action={
                      item.timerange[0] > 0 && item.timerange[1] > 0 && unix >= item.timerange[0] - 432000 && unix < item.timerange[0] &&
                       <Chip className='p-1' sx={{display: {xs: 'none', lg: 'initial'}}} label={(lang == 'th' ?
                       'กำลังเริ่มต้นในอีก '+compareTimestamps(unix, item.timerange[0]).days + ' วัน ' + compareTimestamps(unix, item.timerange[0]).hours + ' ชั่วโมง '+ compareTimestamps(unix, item.timerange[0]).minutes + ' นาที'
                        : "Event start in " + compareTimestamps(unix, item.timerange[0]).days + ' day(s) ' + compareTimestamps(unix, item.timerange[0]).hours + ' hr(s) '+ compareTimestamps(unix, item.timerange[0]).minutes + ' minute(s)')} color="primary" />
                     } />
                     {
                   item.timerange[0] > 0 && item.timerange[1] > 0 && unix >= item.timerange[0] - 432000 && unix < item.timerange[0] &&
                    <Chip sx={{display: {xs: 'inline-block', lg: 'none'}, marginTop: 1, padding: 0, paddingTop: '.4rem'}} label={(lang == 'th' ?
                    'กำลังเริ่มต้นในอีก '+compareTimestamps(unix, item.timerange[0]).days + ' วัน ' + compareTimestamps(unix, item.timerange[0]).hours + ' ชั่วโมง '+ compareTimestamps(unix, item.timerange[0]).minutes + ' นาที'
                     : "Event start in " + compareTimestamps(unix, item.timerange[0]).days + ' day(s) ' + compareTimestamps(unix, item.timerange[0]).hours + ' hr(s) '+ compareTimestamps(unix, item.timerange[0]).minutes + ' minute(s)')} color="primary" />
                  }
                  <hr />
                <Grid container spacing={2}>
                <Grid item lg={5} xs={12}>
                  <Avatar src={item.src} variant='rounded' sx={{width: {md:'400px', xs: '100%'}, height: '100%'}} />
                </Grid>
                <Grid item lg={7} xs={12}>
                    <h6 className='text-muted'>{lang == 'th' ? 'ประเภทกิจกรรม' : "Event Type"}: {checkeventtype(item)}</h6>
                    {item.timerange[0] > 0 && item.timerange[1] > 0 && moment.unix(item.timerange[0]).local().format('MMMM DD, YYYY') === moment.unix(item.timerange[1]).local().format('MMMM DD, YYYY') ? (
                      <p>{lang == 'th' ? 'ช่วงเวลาของกิจกรรม' : "Event duration"}: {moment.unix(item.timerange[0]).lang(lang).local().format(lang == 'th' ? 'DD MMMM YYYY เวลา HH:mm' :'MMMM DD, YYYY HH:mm')}{lang == 'th' ? ' ถึง ' : " to "}{moment.unix(item.timerange[1]).lang(lang).local().format('HH:mm')}</p>
                    ) : item.timerange[0] > 0 && item.timerange[1] > 0 && moment.unix(item.timerange[0]).local().format('MMMM DD, YYYY') !== moment.unix(item.timerange[1]).local().format('MMMM DD, YYYY') ? (
                      <p>{lang == 'th' ? 'ช่วงเวลาของกิจกรรม' : "Event duration"}: {moment.unix(item.timerange[0]).lang(lang).local().format(lang == 'th' ? 'DD MMMM YYYY เวลา HH:mm' :'MMMM DD, YYYY HH:mm')}{lang == 'th' ? ' ถึง ' : " to "}{moment.unix(item.timerange[1]).lang(lang).local().format(lang == 'th' ? 'DD MMMM YYYY เวลา HH:mm' :'MMMM DD, YYYY HH:mm')}</p>
                    ) : (
                      <p>{lang == 'th' ? 'วันที่เริ่มต้นกิจกรรม ' : "Event start on "} {moment.unix(item.timerange[0]).lang(lang).local().format(lang == 'th' ? 'DD MMMM YYYY' :'MMMM DD, YYYY')}</p>
                    )}
                    <p className='mt-4'>{lang == 'th' ? 'รายละเอียดกิจกรรม' : "Description"}: {item.desc}</p>
                    {
                      item.timerange[0] > 0 && item.timerange[1] > 0 && (
                        <small>{lang == 'th' ? 'หมายเหตุ' : "Notes"}: {lang == 'th' ? 'ช่วงเวลาของกิจกรรมอ้างอิงตามโซนเวลาของอุปกรณ์' : "Event time duration are based on device timezone."}</small>
                      )
                    }
                    <br />
                    {
                      !(item.locate == null && item.place == "") && (
                        <Button onClick={() => getMap(item)} variant='outlined' className='mt-3'>{lang == 'th' ? 'สถานที่จัดงาน' : "Event location"}</Button>
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
        <Dialog
          open={getData != undefined}
          maxWidth= 'xl'
        >
          <DialogTitle id="alert-dialog-title">
          {lang == 'th' ? 'สถานที่จัดงาน' : "Event Location"}
          </DialogTitle>
          <DialogContent>
            {
              getData != undefined && getData != null ? (
                <>
                  <iframe
                    width="100%"
                    height="450"
                    style={{border:'none'}}
                    loading="lazy"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyAL0rpaALNBZalhJuywgqWl4sgFDvXVSz4&q=" + getData.locate[0] + ',' + getData.locate[1]}>
                  </iframe>
                </>
              ) : (
                <>
                 <Skeleton variant="text" className='bg-m' sx={{ height: 400 }} />
              <Skeleton variant="text" className='bg-m' sx={{ fontSize: '1rem' }} />
                </>
              )
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setGetData(null)
            }}>{lang == 'th' ? 'ปิด' : "Close"}</Button>
            <Button onClick={() => getData != null && getData != undefined ? window.open(getData.place, '_blank') : null}>
              {lang == 'th' ? 'ไปยังแอป Google Maps' : "View on Google Maps"}
            </Button>
          </DialogActions>
        </Dialog>
    </div> );
}
 
const mapStateToProps = (state) => ({
    load: state.load,
    dark: state.dark,
    lang: state.lang,
    launch: state.launch,
    currentPage: state.currentPage
  });
  const mapDispatchToProps = (dispatch) => ({
    setLoad: (val) => dispatch(setLoad(val)),
    setDark: (val) => dispatch(setDarkMode(val)),
    setLang: (val) => dispatch(setLang(val)),
    setPage: (val) => dispatch(setPage(val))
  });
  export default connect(mapStateToProps, mapDispatchToProps)(Event);
