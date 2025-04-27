import CButton from "../../../components/buttton";
import CloseButton from "../../../components/c-x";
import Logo from "../../../components/Logo/Logo";
import "../../../assets/styles/login.css";
import { useGiraf } from "../../../giraf";

const AuthLogin = () => {
  const {addGHead} = useGiraf()
  return (
    <div className="login nav_page .p_p">
      <CloseButton onClick={()=>{
        addGHead("login",false)
      }}/>
      <div className="l_box">
        <Logo />
        <div className="d">
          <p style={{ fontSize: "12px" }}>Create Free Account</p>
          <CButton text={"Continue with GMail"} />
        </div>
        <p className="p_p">
          We Value Your Privacy <br />
          By signing up, you agree to our Terms and Privacy 
          Policy
        </p>
      </div>
    </div>
  );
};

export default AuthLogin;
