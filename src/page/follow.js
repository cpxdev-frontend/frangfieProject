import React from 'react'
import { connect } from 'react-redux';
import {Card, CardContent, LinearProgress, CardHeader, Button, Grid, Avatar, Box, Tabs, Tab, Typography,
    List, ListItemButton, ListItemAvatar, Skeleton, ListItemText, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material'

import { faFacebook, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons'
import { faMobileAlt, faDesktop, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  setLoad, setLang, setDarkMode, setPage
} from '../redux/action';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import moment from 'moment';
import LanguageIcon from '@mui/icons-material/Language';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3B4dGgyMDE3IiwiYSI6ImNsZHY0MzN6bTBjNzEzcXJmamJtN3BsZ3AifQ.mYNwWaYKsiLeYXngFDtaWQ';

const Follow = ({currentPage, lang, setLang, setPage, launch}) => {
    React.useEffect(() => {
        setPage(lang == 'th' ? 'ติดตามข้าวฟ่าง' : 'Follow Kaofrang')
      }, [])

    return ( <Box sx={{marginTop: {xs: 0, md:13}, marginBottom: 15}}>
        <CardHeader title={<h3>Follow Kaofrang</h3>} subheader={lang == 'th' ? 'ติดตามความเคลื่อนไหวของน้องข้าวฟ่างได้ตามด้านล่างนี้เลย' : "Follow Kaofrang Yanisa or Kaofrang BNK48 to see her update below."} />
        <div className='container mt-3 d-flex justify-content-center'>
        <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
            <ListItemButton component="a" href="https://facebook.com/bnk48official.kaofrang" target='_blank' data-aos="fade-right">
                <ListItemAvatar>
                <Avatar sx={{backgroundColor: '#1877F2'}}>
                    <FontAwesomeIcon icon={faFacebook} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Facebook Fanpage' secondary="Kaofrang BNK48" />
            </ListItemButton>
            <ListItemButton component="a" href="https://instagram.com/kaofrang.bnk48official" target='_blank' data-aos="fade-right" data-aos-delay={window.innerHeight > 900 ? "500" : '0'}>
                <ListItemAvatar>
                <Avatar sx={{background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'}}>
                    <FontAwesomeIcon icon={faInstagram} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Instagram Account" secondary="kaofrang.bnk48official" />
            </ListItemButton>
            <ListItemButton component="a" href="https://tiktok.com/@kaofrang.bnk48official" target='_blank' data-aos="fade-right" data-aos-delay={window.innerHeight > 900 ? "1000" : '0'}>
                <ListItemAvatar>
                <Avatar sx={{backgroundColor: '#000', color: '#fff'}}>
                    <FontAwesomeIcon icon={faTiktok} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="TikTok Account" secondary="@kaofrang.bnk48official" />
            </ListItemButton>
            <ListItemButton component="a" href="https://www.bnk48.com/index.php?page=listMembers&memberId=86" target='_blank' data-aos="fade-right" data-aos-delay={window.innerHeight > 900 ? "1500" : '0'}>
                <ListItemAvatar>
                <Avatar sx={{backgroundColor: '#CB96C2'}}>
                    <FontAwesomeIcon icon={faGlobe} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="BNK48 Official Website" secondary="Kaofrang" />
            </ListItemButton>
            <ListItemButton component="a" href="https://app.bnk48.com/members/bnk48/kaofrang" target='_blank' data-aos="fade-right" data-aos-delay={window.innerHeight > 900 ? "2000" : '0'}>
                <ListItemAvatar>
                <Avatar sx={{backgroundColor: '#8AAEB5'}}>
                    <FontAwesomeIcon icon={faMobileAlt} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="IAM48 Mobile Application" secondary="Kaofrang" />
            </ListItemButton>
            <ListItemButton component="a" href="https://cp-bnk48.pages.dev/member/kaofrang" target='_blank' data-aos="fade-right" data-aos-delay={window.innerHeight > 900 ? "2500" : '0'}>
                <ListItemAvatar>
                <Avatar sx={{backgroundColor: '#CB96C2'}}>
                    <FontAwesomeIcon icon={faDesktop} />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="BNK48 Fan Space Platform" secondary="Kaofrang" />
            </ListItemButton>
            </List>
        </div>
    </Box> );
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
