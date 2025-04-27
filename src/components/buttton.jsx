import { useState } from "react";
import "../assets/styles/cbutton.css";
const CButton = ({ text, bg = false, style, onClick }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      className={`cbutton ${isActive ? "active" : ""}`}
      style={{
        backgroundColor: "#e0e0e0",
        border: bg ? "1px solid" : "",
        ...style,
      }}
      onClick={()=>{
        setIsActive(true)

        setTimeout(() => {
            setIsActive(false)
        }, 1500);
        onClick()
      }}
    >
      {text}
    </div>
  );
};

export default CButton;
