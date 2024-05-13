import React from 'react'
import {Skeleton
} from '@mui/material'

const IFRAMEwithPost = ({item}) => {
    const ref = React.useRef(null);


    return ( <iframe src={'https://instagram.com/p/' + item.postId + '/embed'} ref={ref} width="100%"
    style={{
        height: 700,
        overflow: "auto",
    }}></iframe> );
}
 
export default IFRAMEwithPost;