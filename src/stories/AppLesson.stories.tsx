import { Meta, StoryObj } from "@storybook/react";
import AppLesson from "../AppLesson";
import { ReduxStoreProviderDecorator } from "../model/ReduxStoreProviderDecorator";

const meta: Meta<typeof AppLesson> = {
  title: "TODOLISTS/AppWithRedux",
  component: AppLesson,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [ReduxStoreProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof AppLesson>;

export const AppLessonStory: Story = {};
