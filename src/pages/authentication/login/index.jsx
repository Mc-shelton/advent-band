import CButton from "../../../components/buttton";
import CloseButton from "../../../components/c-x";
import Logo from "../../../components/Logo/Logo";
import "../../../assets/styles/login.css";
import { useGiraf } from "../../../giraf";
import { useEffect, useState } from "react";
import { baseUrl, useGetApi, usePostApi } from "../../../../bff/hooks";
import Loading from "../../../components/loading";
import MessageBox from "../../../components/message";
import { jwtDecode } from "jwt-decode"
import Cookies from 'js-cookie'


const AuthLogin = () => {
  const { gHead, addGHead } = useGiraf();
  const [newUser, setNewUser] = useState(false);
  const { actionRequest } = usePostApi();
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState()
  const [messageType, setMessageType] = useState('')
  const [email, setEmail]= useState('')
  const [phone, setPhone] = useState("")
  const [name, setName] = useState('')

  useEffect(()=>{
    if(gHead.user){
      setNewUser(true)
      setName(gHead.user.name)
      setPhone(gHead.user.phone)
    }
  },[])

  const pushMessage = (m, t) => {
    setMessageType(t)
    setMessage(k => {
        let i = m;
        setTimeout(() => {
            setMessage(p => null)
        }, 3000);
        return i
    })
}
  const actionLogin = () => {
    setLoading(true)
    actionRequest({
      endPoint: `${baseUrl}basicAuth`,
      params: {
        email,
      },
    })
      .then((res) => {
        const session_user = jwtDecode(res.data)
        pushMessage(res.message, 'success')
        addGHead("user", session_user)
        addGHead("auth_token", 'Bearer '+res.data)
        Cookies.set('auth_token', res.data)
        if(!session_user.name){
          setNewUser(true)
        }else{
        addGHead("login", false);
        }
      })
      .catch((err) => {
        console.log("here is the error ::: ", err);
        pushMessage(err.message, 'error')

      })
      .finally(() => {
        setLoading(false)
      });
  };

  const updateDetails = () => {
    setLoading(true)
    actionRequest({
      endPoint: `${baseUrl}accounts/user`,
      params: {
        ...gHead.user,
        name,
        phone
      }
    })
      .then((res) => {
        const session_user = jwtDecode(res.data)
        pushMessage(res.message, 'success')
        addGHead("user", session_user)
        addGHead("auth_token", 'Bearer '+ res.data)
        // addGHead("token", res.data)
        Cookies.set('auth_token', res.data)
        addGHead("login", false);
      })
      .catch((err) => {
        console.log("here is the error ::: ", err);
        pushMessage(err.message, 'error')

      })
      .finally(() => {
        setLoading(false)

      });
  };
  return (
    <div className="login nav_page .p_p">
      {loading && <Loading/>}
      {message && <MessageBox txt={message} type={messageType} key={"some key"} />}
      <CloseButton
        onClick={() => {
          addGHead("login", false);
        }}
      />
      <div className="l_box">
        <Logo />
        <div className="d">
          {!newUser && (
            <input className="login_inputs" placeholder="email address" value={email} onChange={e=>setEmail(e.target.value)} />
          )}
          {newUser && (
            <input className="login_inputs" placeholder="full name" value={name} onChange={e=>setName(e.target.value)}  />
          )}
          {newUser && (
            <input className="login_inputs" placeholder="phone number"  value={phone} onChange={e=>setPhone(e.target.value)} />
          )}
          <CButton
            text={newUser ? "Update Details" : "Continue with email"}
            style={{
              width: "250px",
            }}
            onClick={()=>{
              newUser? updateDetails() : actionLogin()
            }}
          />
          {(newUser && !gHead.user?.name) && <p style={{
            fontStyle:'italic',
            color:"gray",
            marginBottom:'0'

          }}
          onClick={()=>{
          addGHead("login", false);
          }}
          >skip update</p>}
          ...
          {gHead.user && <p style={{
            fontStyle:'italic',
            color:"gray",
            marginTop:'0'
          }}
          onClick={()=>{
            setNewUser(false)
            addGHead('user', null)
            addGHead('auth_token', null)
            Cookies.remove("auth_token")
          }}
          >log out</p>}
        </div>
        <p className="p_p">
          We Value Your Privacy <br />
          By signing up, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthLogin;
