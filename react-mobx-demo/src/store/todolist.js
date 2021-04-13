import { observable, computed, action } from "mobx";

class Todo {
  id = Math.random();
  title = "";
  @observable finished = false;
  constructor(title) {
    this.title = title;
  }
  @action.bound
  isfinished() {
    this.finished = !this.finished;
  }
}

//所有的待办事项数量
class TodoList {
  @observable todos = [];
  @computed get unfinishedTodoCount() {
    const len = this.todos.filter((todo) => !todo.finished).length;
    return len;
  }

  @action.bound
  addTodo(title = "") {
    const todo = new Todo(title);
    this.todos.push(todo);
  }
}

export default new TodoList();
