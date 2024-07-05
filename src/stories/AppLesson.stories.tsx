import { Meta, StoryObj } from "@storybook/react";
import App from "app/App";
import { ReduxStoreProviderDecorator } from "app/ReduxStoreProviderDecorator";

const meta: Meta<typeof App> = {
  title: "TODOLISTS/App",
  component: App,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [ReduxStoreProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof App>;

export const AppLessonStory: Story = {};
