import { Outlet } from "react-router-dom";
import BottomNav from "../../components/tabs/bottomnav";
import RightSideBar from "../../components/tabs/rightsidebar";
import { useGiraf } from "../../giraf";
import AuthLogin from "../../pages/authentication/login";

// ==============================|| MINIMAL LAYOUT ||============================== //

const MainLayout = () => {
  const {gHead, addGHead} = useGiraf()
  return (
    <div className="main">
      {gHead.sidebar && <RightSideBar />}
      {gHead.login && <AuthLogin />}
      <Outlet />
      {!gHead.keyboard && <BottomNav />}
       {/* <BottomNav /> */}
    </div>
  );
};

export default MainLayout;
