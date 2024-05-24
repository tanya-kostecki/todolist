import {Meta, StoryObj} from "@storybook/react";
import {Task} from "../components/todolist/Task";
import {fn} from "@storybook/test";
import {useState} from "react";

const meta: Meta<typeof Task> = {
    title: 'TODOLISTS/Task',
    component: Task,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        task: {id: '1234', title: 'Task1', isDone: true},
        todolistID: 'todolist1',
        removeTasks: fn(),
        changeTaskStatus: fn(),
        updateTaskTitle: fn(),
    }
}

export default meta
type Story = StoryObj<typeof Task>

export const TaskIsDoneStory: Story = {}

export const TaskIsNotDoneStory: Story = {
    args: {
        task: {id: '1234', title: 'Task1', isDone: false},
    }
}

export const TaskToggleStory: Story = {
    render: (args) => {
        const [task, setTask] = useState(args.task)

        function changeTaskStatus() {
            setTask({...task, isDone: !task.isDone})
        }

        function updateTaskTitle(todolistId: string, taskId: string, newTitle: string) {
            setTask({...task, title: newTitle});
        }

        return <Task task={task} todolistID={'todolist1'} removeTasks={args.removeTasks}
                     changeTaskStatus={changeTaskStatus} updateTaskTitle={updateTaskTitle}/>
    }
}
