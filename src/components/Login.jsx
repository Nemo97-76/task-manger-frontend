import React ,{useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

const Login=()=>{
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const navigate= useNavigate();

const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
        const res=await axios.post("http://localhost:5000/auth/login",{email,password})
        localStorage.setItem("token",res.data.token);
        navigate("/");
    }
    catch(err){
        console.error(err.response?.data || err.message);
alert("login failed");
}
}
return(
   
<>
 <div className="login">
        <h2 className="winky-sans-login-header">login</h2>
        <form className="loginForm" onSubmit={handleSubmit}>
        <Input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} required endDecorator={<AlternateEmailRoundedIcon/>}/>
        <Input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} required endDecorator={< PasswordRoundedIcon/>}/>
        <Button endDecorator={<LoginRoundedIcon/>} type="submit">login</Button>
        </form>
 </div>
</>

    )};
export default Login;