
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
 
import TodoView from "./todoitemview"

@inject('todolist')
@observer
class TodoListView extends  Component{
  render(){
    return(
        <div>
            <ul>
                {this.props.todolist.todos.map(todo => (
                    <TodoView todo = {todo} key={todo.id}/>
                ))}
            </ul>
            剩余任务:{this.props.todolist.unfinishedTodoCount}
        </div>
    );
  }
}
 
export default TodoListView
