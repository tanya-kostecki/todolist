import { Meta, StoryObj } from "@storybook/react";
import { Task } from "features/TodolistPage/ui/Todolist/Tasks/Task/Task";
import { TaskPriorities, TaskStatuses } from "common/enum";
import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "features/TodolistPage/model/tasksSlice";
import { Provider } from "react-redux";

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

const withProvider = (Story: any) => (
  <Provider store={store}>
    <Story />
  </Provider>
);

const meta: Meta<typeof Task> = {
  title: "TODOLISTS/Task",
  component: Task,
  decorators: [withProvider],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    task: {
      description: "",
      title: "Task1",
      status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      id: "1234",
      todoListId: "todolistID1",
      order: 0,
      addedDate: "",
      entityStatus: "idle",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Task>;

export const TaskIsDoneStory: Story = {
  args: {
    task: {
      description: "",
      title: "Task1",
      status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      id: "1234",
      todoListId: "todolistID1",
      order: 0,
      addedDate: "",
      entityStatus: "idle",
    },
  },
};

export const TaskIsNotDoneStory: Story = {
  args: {
    task: {
      description: "",
      title: "Task1",
      status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      id: "1234",
      todoListId: "todolistID1",
      order: 0,
      addedDate: "",
      entityStatus: "idle",
    },
  },
};
