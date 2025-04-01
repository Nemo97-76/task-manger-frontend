import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/signup', {
        email,
        name,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Register failed: ' + (err.response?.data.msg || err.message));
    }
  };

  return (
    <div className="signup">
      <h2 className='winky-sans-login-header'>signup</h2>
      <form className='signupForm' onSubmit={handleSubmit}>
      <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          endDecorator={<PersonRoundedIcon/>}
          required
        />       
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
endDecorator={<AlternateEmailRoundedIcon/>}
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          endDecorator={<PasswordRoundedIcon/>}
          required
        />
        <Button endDecorator={<AddRoundedIcon/>} type="submit">signup</Button>
      </form>
    </div>
  );
};

export default Register;