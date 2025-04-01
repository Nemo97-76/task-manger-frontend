import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Button, Input, Table} from "@mui/joy"
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate,setDueDate]=useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("fetched , tasks :",res.data)
        setTasks(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchTasks();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/tasks',
        { title, description ,dueDate},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setTitle('');
      setDescription('');
      setDueDate("")
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Failed to add task');
    }
  };

  return (
    <div className='tasks-container'>
      <h2>Your Tasks</h2>
      <form  onSubmit={handleSubmit} className='task-form'>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <Input
        type='date'
        value={dueDate}
        onChange={(e)=>setDueDate(e.target.value)}
        placeholder='due date'
        required
        />
        <Button type="submit">Add Task</Button>
      </form>
      
<Table arial-label="basic table" hoverRow={true}>
  <thead>
  <tr>
          <th>title</th>
          <th style={{ width: '25%'}}>description</th>
          <th style={{width:"25%"}}>created By</th>
          <th>completed</th>
          <th>due date</th>
          <th>created At</th>
        </tr> 
         </thead>

         <tbody>
{tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description || 'N/A'}</td>
                <td>{task.createdBy}</td>
                <td>{!(task.completed)?"false":"true"}</td>
<td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                <td>{new Date(task.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No tasks yet</td>
            </tr>
          )}
                  </tbody>
      </Table>


     
    </div>
  );
};

export default Tasks;