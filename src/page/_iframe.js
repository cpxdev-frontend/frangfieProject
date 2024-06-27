import React from 'react'
import {Skeleton
} from '@mui/material'
import { InstagramEmbed } from 'react-social-media-embed';

const IFRAMEwithPost = ({item}) => {
    const ref = React.useRef(null);


    // return ( <iframe src={'https://instagram.com/p/' + item.postId + '/embed'} ref={ref} width="100%"
    // style={{
    //     height: 500,
    //     overflow: "auto",
    //     border: "none"
    // }}></iframe> );
    return (
        <InstagramEmbed url={"https://www.instagram.com/p/" + item.postId} ref={ref} width='100%' height={500} style={{
            overflow: "auto",
            border: "none"
        }} />
    )
}
 
export default IFRAMEwithPost;
