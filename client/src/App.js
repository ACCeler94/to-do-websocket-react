function App() {
  return (
    <div classNameName="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>
      <section className="to-do-section">
        <h2>Tasks</h2>
        <ul className="to-do-list" id="to-do-list">

        </ul>
        <form id="add-task-form">
          <input type="text" name="task-name" id="task-name" autocomplete="off" className='text-input' />
          <button type="submit" className="btn">Add task</button>
        </form>
      </section>
    </div >
  );
}

export default App;
