import { AppRootStateType, useAppDispatch } from "app/store";
import { useSelector } from "react-redux";
import { login, selectIsLoggedIn } from "features/login/model/authSlice";
import { useFormik } from "formik";
import { BaseResponse } from "common/types";

type ErrorsType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector<AppRootStateType, boolean>(selectIsLoggedIn);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: ErrorsType = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 4) {
        errors.password = "Password length must be longer than 3 symbols";
      }
      return errors;
    },

    onSubmit: (values, formikHelpers) => {
      dispatch(login(values))
        .unwrap()
        .catch((error: BaseResponse) => {
          error.fieldsErrors?.forEach((el) => formikHelpers.setFieldError(el.field, el.error));
        });
      // formik.resetForm();
    },
  });
  return { formik, isLoggedIn };
};
