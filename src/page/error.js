import React from 'react'
import {
  Card, CardContent, Fade, CardHeader, Button, Zoom
} from '@mui/material'
import {
  useHistory
} from "react-router-dom";
import { connect } from 'react-redux';
import {
  setLoad, setLang, setDarkMode, setPage
} from '../redux/action';

const Err = ({ currentPage, lang, setLang, setPage, setMenu, setLangMod, launch }) => {
  const history = useHistory();
  const [data, setData] = React.useState(false);
  React.useEffect(() => {
    setPage('404 Not Found')
    if (launch >= 1731603600 || (localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") != null && localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") == '56f006fb7a76776e1e08eac264bd491aa1a066a1')) {
      setData(true)
    } else {
      setData(false)
    }
  }, [])

  return (
    <div>
      <Fade in={true} timeout={1200}>
        <div className="video-container">
          <div className='d-block d-lg-none img' style={{ filter: 'brightness(80%)', backgroundImage: 'url(https://d2m23ocr3g32v7.cloudfront.net/kf/kaofrang.webp)' }}></div>
          <div className='d-none d-lg-block img' style={{ filter: 'brightness(80%)', backgroundImage: 'url(https://pbs.twimg.com/media/GTqpfrGb0AAcPAG?format=webp&name=4096x4096)' }}></div>
        </div>
      </Fade>
      {data ? (
        <Card className="text-container">
          <CardContent className='p-2'>
            <CardHeader title={<h3 style={{ color: '#fb61ee', textShadow: '2px 2px 2px #fae6f9' }}>This Site is not found</h3>} subheader={<p className='overlaytext'>{lang == 'th' ? "หน้านี้ไม่มีอยู่จริง แต่ความน่ารักของน้องข้าวฟ่าง มีอยู่จริงนะ" : "Oops! This site is not found. But cuteness of Kaofrang is over found, haha."}</p>} />
            <Button className='ml-2' variant='outlined' onClick={() => setMenu(true)}>Go to Menu</Button>
            <Button className='ml-2' onClick={() => setLangMod(true)}>Choose Language</Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-container">
          <CardContent className='p-2'>
            <CardHeader title={<h3 style={{ color: '#fb61ee', textShadow: '2px 2px 2px #fae6f9' }}>This Site is not found</h3>} subheader={<p className='overlaytext'>{lang == 'th' ? "หน้านี้ไม่มีอยู่จริง แต่ความน่ารักของน้องข้าวฟ่าง มีอยู่จริงนะ" : "Oops! This site is not found. But cuteness of Kaofrang is over found, haha."}</p>} />
            <h5 className='text-center text-light'>{lang == 'th' ? "พบกันได้ ในวันที่ 15 พฤศจิกายน 2567 เป็นต้นไป" : "Let's meet this website soon in November 15, 2024"}</h5>
            <br />
            <Button className='ml-2' onClick={() => setLangMod(true)}>Choose Language</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
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
export default connect(mapStateToProps, mapDispatchToProps)(Err);
