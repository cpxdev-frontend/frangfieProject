import React from 'react'
import { connect } from 'react-redux';
import {Card, CardContent, LinearProgress, CardHeader, Button, Grid, Avatar, Box, Tabs, Tab, Typography,
    List, ListItemButton, ListItemAvatar, Skeleton, ListItemText, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material'

import { faFacebook, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons'
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

const Follow = ({currentPage, lang, setLang, setPage, launch}) => {
    const unix = launch;
    
    

    React.useEffect(() => {
        setPage(lang == 'th' ? 'ติดตามข้าวฟ่าง' : 'Follow Kaofrang')
      }, [])

    return ( <div style={{marginTop: 80, marginBottom: 150}}>
        <CardHeader title={<h3>Follow Kaofrang</h3>} subheader={lang == 'th' ? 'ติดตามความเคลื่อนไหวของน้องข้าวฟ่างได้ตามด้านล่างนี้เลย' : "Follow Kaofrang Yanisa or Kaofrang BNK48 to see her update below."} />
        <div className='container mt-3 d-flex justify-content-center'>
        <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
            <ListItemButton component="a" href="https://facebook.com/bnk48official.kaofrang" target='_blank'>
                <ListItemAvatar>
                <Avatar sx={{backgroundColor: '#1877F2'}}>
                    <FontAwesomeIcon icon={faFacebook} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Facebook Fanpage' secondary="Kaofrang BNK48" />
            </ListItemButton>
            <ListItemButton component="a" href="https://instagram.com/kaofrang.bnk48official" target='_blank'>
                <ListItemAvatar>
                <Avatar sx={{background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'}}>
                    <FontAwesomeIcon icon={faInstagram} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Instagram Account" secondary="kaofrang.bnk48official" />
            </ListItemButton>
            <ListItemButton component="a" href="https://tiktok.com/@kaofrang.bnk48official" target='_blank'>
                <ListItemAvatar>
                <Avatar sx={{backgroundColor: '#000', color: '#fff'}}>
                    <FontAwesomeIcon icon={faTiktok} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="TikTok Account" secondary="@kaofrang.bnk48official" />
            </ListItemButton>
            <ListItemButton component="a" href="https://app.bnk48.com/members/bnk48/kaofrang" target='_blank'>
                <ListItemAvatar>
                <Avatar sx={{backgroundColor: '#8AAEB5'}}>
                    <FontAwesomeIcon icon={faMobileAlt} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="IAM48 Mobile Application" secondary="Kaofrang" />
            </ListItemButton>
            <ListItemButton component="a" href="https://cp-bnk48.pages.dev/member/kaofrang" target='_blank'>
                <ListItemAvatar>
                <Avatar sx={{backgroundColor: '#CB96C2'}}>
                    <FontAwesomeIcon icon={faMobileAlt} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="BNK48 Fan Space Platform" secondary="Kaofrang BNK48" />
            </ListItemButton>
            </List>
        </div>
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
  export default connect(mapStateToProps, mapDispatchToProps)(Follow);
