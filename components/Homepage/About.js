import classes from "./About.module.css";
import { FaStar } from "react-icons/fa";
import { MdLocalBar } from "react-icons/md";
import { BiParty } from "react-icons/bi";
import { LuSofa } from "react-icons/lu";
import { IoPricetagOutline } from "react-icons/io5";
import { LuMusic2 } from "react-icons/lu";
import { MdCorporateFare } from "react-icons/md";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { GiPartyFlags } from "react-icons/gi";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";

export default function About() {
  const skillRef = useRef();
  const isSkillRefinView = useInView(skillRef);

  // Definiujemy sekwencję animacji
  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2, // Opóźnienie dla każdego kolejnego elementu
        duration: 0.5,
      },
    }),
  };

  const icons = [
    { icon: <MdLocalBar />, label: "Pub & Bar" },
    { icon: <BiParty />, label: "Klub & Parkiet" },
    { icon: <LuSofa />, label: "Stoły do rezerwacji" },
    { icon: <IoPricetagOutline />, label: "Zniżki dla każdego" },
    { icon: <LuMusic2 />, label: "Muzyka od DJ'a" },
    { icon: <MdCorporateFare />, label: "Imprezy firmowe" },
    { icon: <LiaBirthdayCakeSolid />, label: "Organizacja urodzin" },
    { icon: <GiPartyFlags />, label: "Tematyczne Eventy" },
  ];

  return (
    <div className={classes.back}>
      <div className={classes.container}>
        <div className={classes.textContainer}>
          <h2>Pub & Club</h2>
          <div>
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} className={classes.star} />
            ))}
          </div>
          <p>
            Zapraszamy do Huki Muki, wyjątkowego pubu i baru oraz klubu zlokalizowanego w
            samym sercu Krakowa! Oferujemy przytulną atmosferę, doskonałe ceny i
            atrakcyjne zniżki studenckie. Na dole naszego lokalu znajduje się
            klub, w którym zabawa trwa do białego rana. Przyjdź i przekonaj się
            sam, dlaczego Huki Muki to idealne miejsce na wieczór z
            przyjaciółmi!
          </p>
        </div>
        <div className={classes.icons} ref={skillRef}>
          {icons.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={isSkillRefinView ? "visible" : "hidden"}
              variants={iconVariants}
              className={classes.icon}
            >
              {item.icon}
              <p>{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
