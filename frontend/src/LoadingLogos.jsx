import { motion } from "framer-motion";

// SVG-робот (символ ИИ)
const LogoRobot = () => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
    style={{ width: 82, height: 82, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
      <rect x="10" y="20" width="50" height="30" rx="14" fill="#229ED9" stroke="#222" strokeWidth="2"/>
      <ellipse cx="26" cy="35" rx="5" ry="6" fill="#fff" stroke="#222" strokeWidth="1.5"/>
      <ellipse cx="44" cy="35" rx="5" ry="6" fill="#fff" stroke="#222" strokeWidth="1.5"/>
      <ellipse cx="26" cy="36" rx="2" ry="2.4" fill="#229ED9"/>
      <ellipse cx="44" cy="36" rx="2" ry="2.4" fill="#229ED9"/>
      <rect x="30" y="44" width="10" height="3" rx="1.5" fill="#fff" stroke="#222" strokeWidth="1"/>
      <rect x="33" y="13" width="4" height="11" rx="2" fill="#68e0cf" stroke="#222" strokeWidth="1"/>
      <circle cx="35" cy="11" r="3" fill="#68e0cf" stroke="#229ED9" strokeWidth="1"/>
      <ellipse cx="18.5" cy="42.5" rx="2" ry="1.2" fill="#eaf6fb"/>
      <ellipse cx="51.5" cy="42.5" rx="2" ry="1.2" fill="#eaf6fb"/>
    </svg>
  </motion.div>
);

export default LogoRobot;
