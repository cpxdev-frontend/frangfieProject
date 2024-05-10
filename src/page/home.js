import React from 'react'
import {Card, CardContent, Fade, CardHeader, Button
  } from '@mui/material'
  import {
    useHistory
  } from "react-router-dom";
  import { connect } from 'react-redux';
  import {
    setLoad, setLang, setDarkMode, setPage
  } from '../redux/action';

const Home = ({currentPage, lang, setLang, setPage, setMenu, setLangMod}) => {
    const history = useHistory();
    React.useEffect(() => {
      setPage(lang == 'th' ? 'หน้าหลัก' : 'Homepage')
    }, [])

    return ( 
        <div>
             <Fade in={true} timeout={1200}>
 <div className="video-container">
    <img className='d-block d-lg-none img' width='100%' height='100%' src='https://pub-b590efd174044d4bb32753301d5bbd24.r2.dev/kfbg1.jpg' style={{filter: 'brightness(80%)'}}/>
    <video className='d-none d-lg-block vdo overflow-hidden' muted autoPlay style={{pointerEvents: 'none', scrollbarWidth: 'none'}}>
        <source src="https://pub-b590efd174044d4bb32753301d5bbd24.r2.dev/kf1.mp4" type="video/mp4"/>
        Your browser does not support the video tag.
      </video>
  </div>
 </Fade>
  <Card className="text-container">
    <CardContent className='p-2'>
      <CardHeader title={<h3 style={{color: 'rgb(252, 91, 214)'}}>Welcome to KaofrangFie Fansite</h3>} subheader={<p className='overlaytext'>{lang == 'th' ? "เว็บไซต์ที่จะทำให้คุณรู้จัก \"น้องข้าวฟ่าง\" มากขึ้น มาร่วมโดนตก (หลุมรัก) ข้าวฟ่างไปด้วยกัน" : "This is your space for Kaofrang Yanisa or Kaofrang BNK48 fans. Let's come to enjoy with us!"}</p>} />
      <Button className='ml-2' variant='contained' onClick={() => history.push('/aboutkf')}>Get Started</Button>
      <Button className='ml-2' variant='outlined' onClick={() => setMenu(true)}>Go to Menu</Button>
      <br />
      <Button className='ml-2 mt-3' onClick={() => setLangMod(true)}>Choose Language</Button>
    </CardContent>
  </Card>
        </div>
     );
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);