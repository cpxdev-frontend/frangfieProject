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
    <img className='d-block d-md-none' width='100%' height='100%' src='https://pbs.twimg.com/media/GM0OOtda0AADg9N?format=webp&name=large' style={{filter: 'brightness(80%)'}}/>
    <iframe className="d-none d-md-block" 
      src="https://www.youtube.com/embed/5OvhKE-VW74?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=5OvhKE-VW74&showinfo=0" 
      frameBorder="0">
    </iframe>
  </div>
 </Fade>
  <Card className="text-container">
    <CardContent>
      <CardHeader sx={{marginTop: {xs: 0, sm: 10}}} title={<h3 style={{color: 'rgb(252, 91, 214)'}}>Welcome to KaofrangFie Fansite</h3>} subheader={<p className='overlaytext'>This is your space for Kaofrang Yanisa or Kaofrang BNK48 fans. Let's come to enjoy with us!</p>} />
      <Button color='secondary' className='ml-2' onClick={() => history.push('/aboutkf')}>Get Started</Button>
    </CardContent>
  </Card>
        </div>
     );
}
 
export default Home;