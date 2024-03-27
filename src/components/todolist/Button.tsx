import React from "react";

type ButtonPropsType = {
  title: string;
  callback: () => void;
};
export const Button = ({ title, callback }: ButtonPropsType) => {
    const onClickHandler = () => {
    callback();
  };

  return <button onClick={onClickHandler}>{title}</button>;
};
