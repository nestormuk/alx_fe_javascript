import { useState } from 'react';
import './App.css';

function App(){
  const [tasks, setTasks] = useState([])

  return (
    <>
      <div id="toto-app">
        <h1>My To-Do List</h1>
        <input type="text" id='task-input'  placeholder='Enter a task'/>
        <button id='add-task-btn'>Add Task</button>
        <ul id="task-list">
            {
              tasks.map((task) => {
                return  (
                  <li>
                    
                  </li>
                )
              })
            }

        </ul>
      </div>
    </>
  )
}

export default App;