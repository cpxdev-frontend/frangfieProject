import React from 'react'
import { connect } from 'react-redux';
import {Card, CardContent, Fade, CardHeader, Button, Grid, Avatar, Box, Tabs, Tab, Typography,
    List, ListItem, ListItemText, Skeleton
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
                setData(result.response)
            })
            .catch(error => console.log('error', error));
      }, [])

    return ( <div style={{marginTop: 80, marginBottom: 150}}>
        <CardHeader title={<h3>Incoming Events of Kaofrang</h3>} subheader={lang == 'th' ? 'เร็วๆนี้น้องมีงานอะไรให้เราตามบ้าง ไปดูกัน!' : "See all Kaofrang Yanisa or Kaofrang BNK48 events here."} />
        <div className='container mt-3'>
   
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
