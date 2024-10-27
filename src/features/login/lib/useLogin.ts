import { AppRootStateType, useAppDispatch } from "app/model/store";
import { useSelector } from "react-redux";
import { login, selectCaptcha, selectIsLoggedIn } from "features/login/model/authSlice";
import { useFormik } from "formik";
import { BaseResponse } from "common/types";
import { LoginParamsType } from "features/login/api/authApi.types";

type Errors = Partial<LoginParamsType>;

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector<AppRootStateType, boolean>(selectIsLoggedIn);
  const captcha = useSelector<AppRootStateType, string>(selectCaptcha);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
      captcha: "",
    },
    validate: (values) => {
      const errors: Errors = {};
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
      if (captcha && !values.captcha && formik.touched.captcha) {
        errors.captcha = "Captcha is required";
      }
      return errors;
    },

    onSubmit: (values, formikHelpers) => {
      dispatch(login(values))
        .unwrap()
        .catch((error: BaseResponse) => {
          error.fieldsErrors?.forEach((el) => formikHelpers.setFieldError(el.field, el.error));
        });
      // formik.setFieldValue("captcha", "");
      formik.setTouched({ captcha: false });
    },
  });
  return { formik, isLoggedIn, captcha };
};
