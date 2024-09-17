const steps = [
    // {
    //   target: '[data-tour="home-1"]',
    //   disableBeaco: true,
    //   content: "เลือก 'Get Started' เพื่อเริ่มต้นดูโปรไฟล์ของข้าวฟ่างได้เลย!"
    // },
    // {
    //   target: '[data-tour="home-2"]',
    //   disableBeaco: true,
    //   content: "หรือเลือกตัวเลือกนี้เพื่อไปยังหน้าอื่นได้นะ"
    // },
    // {
    //   target: '[data-tour="home-3"]',
    //   disableBeaco: true,
    //   content: "เว็บไซต์นี้จะใช้ค่าเริ่มต้นเป็นภาษาไทย นอกจากนี้เรายังรองรับภาษาอังกฤษอีกด้วย คุณสามารถเลือกเปลี่ยนภาษาได้ตามใจชอบ"
    // },
    // {
    //     target: '[data-tour="profile-1"]',
    //     content: "นี่คือข้อมูลและไฟล์สไตล์ของข้าวฟ่างที่คุณอยากรู้"
    //   },
    //   {
    //     target: '[data-tour="profile-2"]',
    //     content: "ในส่วนของแท็ปเหล่านี้จะแยกข้อมูลการทำงานและโปรไฟล์เป็นหมวดไว้ให้แล้ว สามารถเลือกดูได้ตามสะดวก"
    //   },
      // {
      //   target: '[data-tour="disco-1"]',
      //   position: 'bottom',
      //   content: "ผลงานซิงเกิ้ลและอัลบั้มของข้าวฟ่าง ตลอดจนคอนเทนต์ต่างๆที่น้องมีส่วนร่วมตลอดที่ผ่านมาในวงการบันเทิง"
      // },
      // {
      //   target: '[data-tour="disco-2"]',
      //   content: "ผลงานซิงเกิ้ลและอัลบั้มของข้าวฟ่างจะอยู่ตรงส่วนนี้"
      // },
      // {
      //   target: '[data-tour="disco-3"]',
      //   content: "คอนเทนต์ต่างๆที่น้องข้าวฟ่างมีส่วนร่วม เลือก 'ดูคอนเทนต์' เพื่อรับชมคอนเทนต์ได้โดยตรง"
      // },
      // {
      //   target: '[data-tour="trend"]',
      //   content: "เริ่มเทรนที่เป็นเฉพาะกิจกรรมของข้าวฟ่างบน X (Twitter) ได้ง่ายๆ ในที่เดียว คุณสามารถรีเฟรชเวลาปัจจุบันได้โดยอ้างอิงจากเซิฟเวอร์ของเรา"
      // },
    //   {
    //     target: '[data-tour="gallery"]',
    //     content: "จักรวาลคลังรูปของข้าวฟ่างเป็นอีกหนึ่งสิ่งที่ทำให้คุณสามารถย้อนกลับไปดูกิจกรรมที่ผ่านมาของน้องได้ คุณสามารถเลือกอัลบั้มรูปเพื่อเข้ารับชมหรือจะคัดลอกลิงก์เพื่อเข้าชมได้เช่นกัน"
    //   },
    //   {
    //     target: '[data-tour="event"]',
    //     content: "รวมทุกกิจกรรมของข้าวฟ่างไว้ในที่เดียว และแสดงสถานะกิจกรรมไว้อย่างละเอียด คุณสามารถรีเฟรชเวลาปัจจุบันได้โดยอ้างอิงจากเซิฟเวอร์ของเรา ทั้งนี้ คุณสามารถเปิดการแจ้งเตือนบนเว็บบราวเซอร์ของคุณบนเว็บไซต์นี้เพื่อรับการแจ้งเตือนข่าวสารหรืออัปเดตต่างของข้าวฟ่างได้แล้ว"
    //   },
    //   {
    //     target: '[data-tour="feed"]',
    //     content: "โพสต์ไฮไลท์ของข้าวฟ่างบนอินสตาแกรมของเธอ เป็นอีกหนึ่งช่องทางทำให้เรารู้จักเธอมากขึ้น"
    //   },
    //   {
    //     target: '[data-tour="quiz"]',
    //     content: "มินิเกมสำหรับแฟนพันธุ์แท้ของข้าวฟ่าง 10 คำถามสุ่มกับ 1 คำตอบที่ใช่ที่คุณต้องตอบให้ถูก"
    //   },
    //   {
    //     target: '[data-tour="quizscore"]',
    //     content: "การยกระดับการเล่นมินิเกมที่จะไม่เหมือนเดิมอีกต่อไป เมื่อคะแนนผู้เล่นของแต่ละครั้งจะถูกคำนวนเฉลี่ยแยกตามแต่ละประเทศทั่วโลก ประเทศไหนจะทำคะแนนได้เท่าไหร่และใช้เวลาการเล่นไปมากแค่ไหน มาดูกัน!"
    //   },
    //   {
    //     target: '[data-tour="follow-1"]',
    //     content: "ช่องทางการติดตามน้องข้าวฟ่างและกลุ่มด้อมชาวกอข้าวทุกคน"
    //   },
    //   {
    //     target: '[data-tour="follow-2"]',
    //     content: "ช่องทางการติดตามของน้องข้าวฟ่างทั้งหมด"
    //   },
    //   {
    //     target: '[data-tour="follow-3"]',
    //     content: "พื้นที่ของเหล่าชาวกอข้าวทุกคน มารวมตัวกันที่นี่ได้เลย!"
    //   },
      {
        target: '[data-tour="donate-1"]',
        content: "คุณสามารถร่วมสนับสนุนทุกโปรเจคของน้องข้าวฟ่างได้ที่นี่เลย"
      },
      {
        target: '[data-tour="donate-3"]',
        content: "เลือกยอดเงินที่คุณต้องการโดเนท"
      },
      {
        target: '[data-tour="donate-4"]',
        content: "บันทึก QR Payment Code เพื่อแชร์ให้เพื่อนๆของคุณร่วมสนับสนุนได้"
      }
  ];
  
  export default steps;
  