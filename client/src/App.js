import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    // ws protocol was used to force io to use websocket and avoid io issues with react
    const socket = io('ws://localhost:8000', { transports: ['websocket'] }); // initialized inside useEffect so it's not doing it every time component rerenders
    setSocket(socket); // set as state so the whole component has access to it
    // listeners
    socket.on('updateData', tasksList => {
      updateTasks(tasksList);
    });
    socket.on('addTask', task => {
      addTask(task);
    });
    socket.on('removeTask', id => {
      removeTask(id, false);
    })


    return () => {
      socket.disconnect(); // disconnect when component is unmounted
    };
  }, []);


  const removeTask = (id, shouldEmit) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    if (shouldEmit) socket.emit('removeTask', id)
  };

  const addTask = newTask => setTasks(tasks => [...tasks, newTask]);

  const updateTasks = tasksList => setTasks(tasksList);

  const submitForm = e => {
    e.preventDefault();
    const newTask = { id: uuidv4(), name: taskName }
    addTask(newTask);
    socket.emit('addTask', newTask);
    setTaskName('');
  }

  return (
    <div classNameName="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>
      <section className="to-do-section">
        <h2>Tasks</h2>
        <ul className="to-do-list" id="to-do-list">
          {tasks.map(element => {
            return (
              <li className="task" key={element.id}>{element.name}<button className="btn btn--red" onClick={() => {
                removeTask(element.id, true)
              }}>Remove</button></li>
            )
          })}
        </ul>
        <form id="add-task-form" onSubmit={submitForm}>
          <input type="text" name="task-name" id="task-name" autocomplete="off" className='text-input' placeholder="Type your task..." onChange={e => setTaskName(e.target.value)} value={taskName} />
          <button type="submit" className="btn">Add task</button>
        </form>
      </section>
    </div >
  );
}

export default App;
