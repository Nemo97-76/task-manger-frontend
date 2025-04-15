import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Button, Radio, Input, ModalClose, Table, RadioGroup} from "@mui/joy"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';

import Divider from '@mui/joy/Divider';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate,setDueDate]=useState("")
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editTaskId,setEditTaskId]=useState(null)
  const [eidtTitle,setEditTitle]=useState("")
  const [editDescription,setEditDescription]=useState("")
  const [editDueDate,setEditDueDate]=useState("")
  const [editCompleted,setEditCompleted]=useState(false)
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

  const handleEditClick =async (taskId) => {
try{
const token = localStorage.getItem('token');
const res=await axios.get(`http://localhost:5000/api/tasks/${taskId}`,{
headers:{Authorization:`Bearer ${token}`},
});
const task=res.data;
setEditTaskId(taskId);
setEditTitle(task.title);
setEditDescription(task.description);
setEditDueDate(task.dueDate? task.dueDate.split("T")[0]:"");
setEditCompleted(task.completed);
setOpen(true);
}catch(err){
console.error(err.response?.data || err.message);
console.log(task.dueDate)
alert("Failed to fetch task")
}
  }

  const handleUpdateTask=async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
   if(!token){
    navigate('/login');
    return;
   } 
   try {
    const updatedTask={
      title: eidtTitle,
      description: editDescription,
      dueDate: editDueDate,
      completed: editCompleted,
    }
    console.log('Sending update:', updatedTask); // Debug log
    const res=await axios.put(`http://localhost:5000/api/tasks/${editTaskId}`,updatedTask,{
      headers:{Authorization:`Bearer ${token}`},
    }    
  )
  console.log('Updated task:', res.data); // Debug log
  setTasks(
    tasks.map((task) => (task._id === editTaskId ? { ...task, ...updatedTask } : task))
  )
  setOpen(false);
  setEditTaskId(null);
  setEditTitle("");
  setEditDescription("");
  setEditDueDate("");
  setEditCompleted(false);
     } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Failed to update task")
   }
  } 
  
  const handledeleteTask=async(taskId)=>{
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      setOpenDelete(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Failed to delete task');
    
    }
  }
  return (
    <div className='tasks-container'>
      <h2>Your Tasks</h2>
      <form  onSubmit={handleSubmit} className='task-form'>
      <FormControl>
        <FormLabel>task title</FormLabel>
        <Input placeholder='title' type='text' value={title} onChange={(e) => setTitle(e.target.value)} required/>
      </FormControl>

   <FormControl>
    <FormLabel>task Description</FormLabel>
    <Input placeholder='description' type='text' value={description} onChange={(e) => setDescription(e.target.value)} required/>
    </FormControl>   

    <FormControl>
      <FormLabel>due date</FormLabel>
    <Input type='date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} required/>
    </FormControl>
    <Button type="submit" endDecorator={<AddRoundedIcon/>}>Add Task</Button>
     </form>
      
<Table stickyHeader borderAxis='both' arial-label="basic table" hoverRow={true}>
  <thead>
  <tr>
          <th style={{width:"5%"}}>title</th>
          <th style={{ width:'10%'}}>description</th>
          <th style={{width:"25%"}}>created By</th>
          <th>completed</th>
          <th>due date</th>
          <th>created At</th>
          <th style={{width:"20%"}}>actions</th>
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
                <td style={{ display: 'flex', gap: '10px' }}>
          
                 <Button className='editBTN' endDecorator={<EditRoundedIcon/>} onClick={()=>handleEditClick(task._id)}>edit</Button>
                 <Modal open={open}  onClose={() => setOpen(false)}>
                  <ModalDialog variant='soft' sx={{bgcolor:"#dbdbf9"}}>
                    <ModalClose />
                    <DialogTitle>edit task</DialogTitle>
                    <form
            onSubmit={handleUpdateTask}
          >
            <Stack className="update-form" spacing={2}>
              <FormControl>
                <FormLabel>title</FormLabel>
                <Input value={eidtTitle} onChange={(e)=>setEditTitle(e.target.value)}  autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input value={editDescription} onChange={(e)=>setEditDescription(e.target.value)}  required />
              </FormControl>
              <FormControl>
                <FormLabel>completed</FormLabel>
             <RadioGroup orientation='horizontal' value={editCompleted.toString()} onChange={(e)=>setEditCompleted(e.target.value==="true")} name='completed'>
              <Radio value={true} label="true"  variant='soft' color='success' />
              <Radio value={false} label="false" variant='soft' color='danger' />
             </RadioGroup>
             
               </FormControl>
              <FormControl>
                <FormLabel>due date</FormLabel>
                <Input type='date' value={editDueDate} onChange={(e)=>setEditDueDate(e.target.value)}   required />
              </FormControl>
              <Button type="submit">save</Button>
            </Stack>
          </form>
                  </ModalDialog>
                  </Modal> 
                  <Button className='deleteBTN' endDecorator={<DeleteForeverRoundedIcon/>} onClick={()=>setOpenDelete(true)}>Delete</Button>
<Modal open={openDelete} onClose={() => setOpenDelete(false)}>
  <ModalDialog variant='soft' sx={{bgcolor:"#dbdbf9"}}>
  <DialogTitle>
            <WarningRoundedIcon />
            Delete
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to delete this task?
          </DialogContent>
          <DialogActions>
            <Button endDecorator={<DeleteForeverRoundedIcon/>} variant="solid" color="danger" onClick={()=>handledeleteTask(task._id)}>
Delete
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
          </DialogActions>
  </ModalDialog>
</Modal> 
                   </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No tasks yet</td>
            </tr>
          )}
                  </tbody>
      </Table>


     
    </div>
  );
};

export default Tasks;