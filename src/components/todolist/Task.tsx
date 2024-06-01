import React, {ChangeEvent, memo, useCallback} from 'react'
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from '../EditableSpan';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskType} from "../../api/api";
import {TaskStatuses} from "../../api/api";

export type TaskPropsType = {
    task: TaskType
    todolistID: string
    removeTasks: (todolistID: string, id: string) => void;
    changeTaskStatus: (
        todolistID: string,
        taskId: string,
        taskStatus: TaskStatuses
    ) => void;
    updateTaskTitle: (
        todoListID: string,
        taskID: string,
        newTitle: string,
    ) => void;
}
export const Task = memo(({task, todolistID, changeTaskStatus, updateTaskTitle, removeTasks}: TaskPropsType) => {
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
          newTaskStatus ? TaskStatuses.Completed : TaskStatuses.New
        );
    };

    return (
          <div>
            <Checkbox
              checked={task.status === TaskStatuses.Completed}
              onChange={changeTaskStatusHandler}
            />
            <EditableSpan
              oldTitle={task.title}
              updateTitle={(newTitle: string) =>
                updateTaskTitleHandler(task.id, newTitle)
              }
            />
              <IconButton aria-label="delete" onClick={removeTaskHandler}>
                  <DeleteIcon />
              </IconButton>
          </div>


      );
})
