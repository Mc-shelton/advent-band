import { useState } from "react"
import '../assets/styles/global.css'

const MessageBox = ({type, txt})=>{
    let color;
    if(type == 'error') color = 'rgb(184, 0, 0)'
    if(type == 'success')color = 'rgb(0, 75, 0)'
    if(type == 'warn')color = 'rgb(224, 224, 224)'
    return(
        <div className="message_box" style={{
            backgroundColor:color,
            color: type == 'warn' ? 'black' : 'white'
        }}>
            {txt}
        </div>
    )
}
export default MessageBox