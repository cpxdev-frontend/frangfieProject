import React from 'react'
import {Card, CardContent, Fade, CardHeader, Button
  } from '@mui/material'
  import {
    useHistory
  } from "react-router-dom";

const Home = () => {
    const history = useHistory();

    return ( 
        <div>
             <Fade in={true} timeout={1200}>
 <div className="video-container">
    <img className='d-block d-md-none' width='100%' height='100%' src='https://s3.ap.cloud-object-storage.appdomain.cloud/cpxdevmain/kfbg1.jpg' style={{filter: 'brightness(80%)'}}/>
    <video className='d-none d-md-block' width="100%" height="100%" muted autoPlay style={{pointerEvents: 'none'}}>
        <source src="https://s3.ap.cloud-object-storage.appdomain.cloud/cpxdevmain/kf1.mp4" type="video/mp4"/>
        Your browser does not support the video tag.
      </video>
  </div>
 </Fade>
  <Card className="text-container">
    <CardContent>
      <CardHeader sx={{marginTop: {xs: 0, sm: 10}}} title={<h3 style={{color: 'rgb(252, 91, 214)'}}>Welcome to KaofrangFie Fansite</h3>} subheader={<p className='overlaytext'>This is your space for Kaofrang Yanisa or Kaofrang BNK48 fans. Let's come to enjoy with us!</p>} />
      <Button className='ml-2' onClick={() => history.push('/aboutkf')}>Get Started</Button>
    </CardContent>
  </Card>
        </div>
     );
}
 
export default Home;