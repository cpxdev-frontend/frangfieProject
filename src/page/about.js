import React from 'react'
import { connect } from 'react-redux';
import {Card, CardContent, Fade, CardHeader, Button, Grid, Avatar
} from '@mui/material'
import {
  setLoad, setLang, setDarkMode, setPage
} from '../redux/action';
import getAge from 'get-age';

const About = ({currentPage, lang, setLang, setPage}) => {
    const [data, setData] = React.useState(null);

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
            data != null && (
                <Grid container spacing={5}>
                    <Grid item lg={5} xs={12}>
                        <Avatar src={data.img} sx={{width: '400px', height: '400px'}} />
                    </Grid>
                    <Grid item lg={7} xs={12}>
                        <Grid xs={12}>
                            <h4>{lang == 'th'? 'ชื่อจริง' : 'Fullname'}: {lang == 'th' ? data.fullnameTh[0] : data.fullnameEn[1]} {lang == 'th' ? data.fullnameTh[1] : data.fullnameEn[1]}</h4>
                            <h5>{lang == 'th'? 'ชื่อเล่น' : 'Nickname'}: {lang == 'th' ? 'ข้าวฟ่าง' : data.name}</h5>
                            <p>{lang == 'th'? 'ภูมิลำเนา' : 'Domicile'}: {lang == 'th' ? 'กรุงเทพมหานคร' : 'Bangkok, Thailand'}</p>
                            <p>{lang == 'th'? 'กรุ๊ปเลือด' : 'Blood Group'}: {lang == 'th' ? 'เอ' : 'A'}</p>
                            <p>{lang == 'th'? 'วันเกิด' : 'Birthday'}: {new Date(data.birthday).toDateString()}</p>
                            <p>{lang == 'th'? 'อายุ' : 'Age'}: {getAge(data.birthday) + (lang == 'th' ? ' ปี' : ' year(s) old')}</p>
                            <p>{lang == 'th'? 'สังกัดศิลปิน' : 'Music label'}: {lang == 'th' ? (["อินดิเพนเด้นท์ อาร์ททิสต์ เมเนจเม้นท์ - ไอแอม (บีเอ็นเคโฟตี้เอต)", "อินดิเพนเด้นท์ เรคคอร์ด - ไออาร์ (โปรเจค \"อินดี้ แคมป์\" ฤดูกาลที่สอง)"]).join(", ") : (["Independent Artist Management - iAM (BNK48)", "Independent Records - iR (Indy Camp Season 2 Project)"]).join(", ")}</p>
                        </Grid>
                        <Grid xs={12} className='mt-3 pt-3'>
                            <h4>{lang == 'th'? 'ข้อมูลด้านการเป็นสมาชิกบีเอ็นเคโฟตี้เอต' : 'All about Kaofrang as BNK48 member'}</h4>
                            <h6>{lang == 'th'? 'ลำดับรุ่น' : 'Member Generation'}: {lang == 'th' ? 'รุ่นที่สาม' : 'Third Generation'}</h6>
                            <h6>{lang == 'th'? 'ทีมบนสเตจเธียเตอร์' : 'Stage Team'}: {lang == 'th' ? 'เอ็นไฟว์ (NV) - รองกับตันทีม' : 'NV (N Five) - Team Vice Captain'}</h6>
                            <h6>{lang == 'th'? 'สิ่งที่ชอบ' : 'Favorite'}: {lang == 'th' ? 'ลาบทอด, เจ้าหญิง, ท้องฟ้า, เดินตลาด, สีชมพูม หนังสยองขวัญ' : data.favorite.join(', ')}</h6>
                            <h6>{lang == 'th'? 'งานอดิเรก' : 'Hobbies'}: {lang == 'th' ? 'ดูหนัง ซี่รีส์ เล่นอูคูเลเล่ กีตาร์ เล่นเกมออนไลน์' : data.hobby.join(', ')}</h6>
                        </Grid>
                    </Grid>
                    <Grid xs={12} className='mt-5'>
                            <h4 className='mb-4'>{lang == 'th'? 'เกร็ดความรู้เกี่ยวกับระบบวงบีเอ็นเคโฟตี้เอต' : 'All about BNK48'}</h4>
                            <p>{lang == 'th'? 'บีเอ็นเคโฟตี้เอตจะมีเธียเตอร์หรือโรงละครเป็นพื้นที่สำหรับแสดงโชว์ของเมมเบอรืแต่ละคน โดยจะมีการจัดแบ่งเป็นทั้งหมด 3 ทีมได้แก่ ทีม บีทรี (BIII), เอ็นไฟว์ (NV) และทีมฝึกหัด (Trainee) โดยในแต่ละทึมจะมีรูปแบบการแสดงที่ต่างกันออกไปในแต่ละทีม และจะมีการจัดลำดับการแสดงสลับกันไปในทุกสัปดาห์ (ปัจจุบันเธียเตอร์อยู่ระหว่างการจัดหาสถานที่ชั่วคราว หลังจากหมดสัญญากับทางเดอะมอลล์ไลฟ์สโตร์ บางกะปิ)' : 'BNK48 is included their own Theater where is place to showtime exclusive performance with managed by main 3 teams such as B Three (BIII), N Five (NV) and Trainee teams. Each team will have their own unique performance format, and the performance order will rotate weekly. (์But now theater is temporary place and currently find for permenent place. After rental contract with The Mall LifeStore Bangkapi has expired)'}</p>
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