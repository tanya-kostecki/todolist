import React, {useCallback, ChangeEvent, memo} from 'react'
import ListItem from '@mui/material/ListItem';
import Checkbox from "@mui/material/Checkbox";
import {getListItemSx } from "./Todolist.styles";
import { EditableSpan } from '../EditableSpan';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { TaskType } from '../../App';

type TaskPropsType = {
    task: TaskType
    todolistID: string
    removeTasks: (todolistID: string, id: string) => void;
    changeTaskStatus: (
        todolistID: string,
        taskId: string,
        taskStatus: boolean
    ) => void;
    updateTaskTitle: (
        todoListID: string,
        taskID: string,
        newTitle: string
    ) => void;
}
export const Task = memo(({task, todolistID, changeTaskStatus, updateTaskTitle, removeTasks}: TaskPropsType) => {
    console.log('Task')
    const updateTaskTitleHandler = useCallback((taskID: string, newTitle: string) => {
        updateTaskTitle(todolistID, taskID, newTitle);
      }, [todolistID, updateTaskTitle]);
  
    const removeTaskHandler = () => {
        removeTasks(todolistID, task.id);
    };

    const changeTaskStatusHandler = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const newTaskStatus = event.currentTarget.checked;
        changeTaskStatus(
          todolistID,
          task.id,
          newTaskStatus
        );
    };

    return (
        <ListItem sx={getListItemSx(task.isDone)}>
          <div>
            <Checkbox
              checked={task.isDone}
              onChange={changeTaskStatusHandler}
            />
            <EditableSpan
              oldTitle={task.title}
              updateTitle={(newTitle: string) =>
                updateTaskTitleHandler(task.id, newTitle)
              }
            />
          </div>
          <IconButton aria-label="delete" onClick={removeTaskHandler}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      );
})
