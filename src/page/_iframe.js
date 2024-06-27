import React from 'react'
import {Skeleton
} from '@mui/material'
import { InstagramEmbed } from 'react-social-media-embed';

const IFRAMEwithPost = ({item}) => {
    const ref = React.useRef(null);


    return ( <iframe src={'https://instagram.com/p/' + item.postId + '/embed'} ref={ref} width="100%"
    style={{
        height: 500,
        overflow: "auto",
        border: "none"
    }}></iframe> );
  
}
 
export default IFRAMEwithPost;
