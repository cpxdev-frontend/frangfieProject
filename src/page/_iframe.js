import React from "react";
import { Skeleton } from "@mui/material";
import { FacebookEmbed } from "react-social-media-embed";

const IFRAMEwithPost = ({ item, lang }) => {
  const ref = React.useRef(null);
  const [load, setLoad] = React.useState(true);

  if (item.postId.includes("facebook.com")) {
    return (
      <FacebookEmbed
        url={item.postId}
        width="100%"
        style={{
          height: 500,
          overflow: "auto",
          border: "none",
        }}
      />
    );
  }

  return (
    <>
      <iframe
        onLoad={() => setLoad(false)}
        src={"https://instagram.com/p/" + item.postId + "/embed"}
        ref={ref}
        width="100%"
        style={{
          display: load ? "none" : "initial",
          height: 700,
          overflow: "auto",
          border: "none",
        }}></iframe>
      <div
        data-aos="fade-in"
        style={{
          display: load ? "flex" : "none",
          height: 500,
        }}
        className="justify-content-center align-items-center align-self-center">
        <img
          src="https://cdn.statically.io/gl/cpx2017/cpxcdnbucket@main/main/bnk-circular.svg"
          width="30px"
        />
        <div className="ml-2">
          {lang == "th" ? "กำลังโหลดข้อมูลจาก" : "Fetching data from"} Instagram
        </div>
      </div>
    </>
  );
  // return (
  //     <InstagramEmbed url={"https://www.instagram.com/p/" + item.postId} ref={ref} width='100%' height={500} style={{
  //         overflow: "auto",
  //         border: "none"
  //     }} />
  // )
};

export default IFRAMEwithPost;
