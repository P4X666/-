
import { inject, observer } from 'mobx-react';
import React from 'react';
import './App.css';
import TodoListView from './todoview';

function App({ todolist }) {

  const add = () => {
    todolist.addTodo("第一个待办事项");
  }

  // todolist.addTodo("第二个待办事项")
  return (
    <div className="App">
      <TodoListView/>
      <button onClick={add}>add</button>
    </div>
  );
}

export default inject('todolist')(observer(App));
