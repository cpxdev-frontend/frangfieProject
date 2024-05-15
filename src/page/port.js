import React from 'react'
import { connect } from 'react-redux';
import {Card, CardContent, Fade, CardHeader, Button, Grid, Avatar, Box, Tabs, Tab, Typography,CardMedia,
    List, ListItem, Chip, Skeleton,
    CardActionArea
} from '@mui/material'
import {
  setLoad, setLang, setDarkMode, setPage
} from '../redux/action';
import moment from 'moment';

const Discography = ({currentPage, lang, setLang, setPage}) => {
    const [data1, setData1] = React.useState(null);

    React.useEffect(() => {
        var requestOptions = {
            method: 'POST'
          };

        setPage(lang == 'th' ? 'ผลงานเพลงและการแสดง' : 'Discography and Acting')
        fetch("https://cpxdevservice.onrender.com/kfsite/kfspotplay", requestOptions)
            .then(response => response.json())
            .then(result => {
                setData1(result.res.tracks.items)
            })
            .catch(error => console.log('error', error));
      }, [])

    return ( <div style={{marginTop: 80, marginBottom: 150}}>
        <CardHeader title={<h3>Discography and Acting of Kaofrang</h3>} subheader={lang == 'th' ? 'ผลงานที่ผ่านมาของน้องข้าวฟ่าง (อ้างอิงจาก Spotify และ Youtube)' : "All Discography and Acting of Kaofrang Yanisa or Kaofrang BNK48 (From Spotify and Youtube)"} />
        <div className='container mt-3'>
        {data1 != null ? (
          <Grid container spacing={2}>
            <CardHeader title={lang == 'th' ? 'แฟรงเพลย์' : "'Frang Play"} subheader={lang == 'th' ? 'ผลงานเพลงน้องข้าวฟ่าง (อ้างอิงจาก Spotify)' : "All Discography and Single of Kaofrang Yanisa or Kaofrang BNK48 (From Spotify)"} />
          {
            data1.map((item, i) => (
                <Card component={Grid} className='mb-3 ml-3 ml-lg-0' container key={item.track.id}>
                <Grid item md={4} xs={12} sx={{display: {xs: 'block', md:'none'}}}>
                    <CardMedia
                        component="img"
                        sx={{ width: '100%' }}
                        image={item.track.album.images[0].url}
                        alt="Live from space album cover"
                    />
                </Grid>
                <Grid item md sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5" sx={{fontSize: 22}}>
                      <b>{item.track.name}</b>
                    </Typography>
                    <small className='text-muted'>{lang == 'th' ? 'จำหน่ายเมื่อวันที่ ' : "Released in "} {moment(item.track.album.release_date).lang(lang).local().format('DD MMMM YYYY')}</small>
                    <hr />
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {lang == 'th' ? 'ศิลปิน' : "Artist name"}: {item.track.artists.map(function(val) {
                            return val.name;
                        }).join(', ')}
                    </Typography>
                    <Typography variant='p' color="text.primary" className='mt-2'>
                        {lang == 'th' ? 'อัลบั้ม/ซิงเกิ้ล' : "Album name"}: {item.track.album.name}
                    </Typography>
                    <CardActionArea className='mt-5'>
                        <Button variant='outlined' className='text-success border-success' onClick={() => window.open(item.track.external_urls.spotify,'_blank')}>
                            {lang == 'th' ? 'ฟังบน Spotify' : "Play on Spotify"}
                        </Button>
                    </CardActionArea>
                  </CardContent>
                </Grid>
                <Grid item md={4} sx={{display: {xs: 'none', md:'block'}}}>
                    <CardMedia
                        component="img"
                        sx={{ width: '100%' }}
                        image={item.track.album.images[0].url}
                        alt="Live from space album cover"
                    />
                </Grid>
              </Card>
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
  export default connect(mapStateToProps, mapDispatchToProps)(Discography);
