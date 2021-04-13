import { observer } from "mobx-react";


const TodoView = ({ todo }) => {

    function onChange(e) {
        console.log(`checked = ${e.target.checked}`);
        todo.isfinished()
    }
    return (
        <li>
            <input id="check" type="checkbox" onChange={onChange}></input>
            <label htmlFor="check">{todo.title}</label>
        </li>
    );
};
export default observer(TodoView)