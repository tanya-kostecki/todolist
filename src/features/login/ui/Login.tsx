import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom";
import { useLogin } from "features/login/lib/useLogin";

export const Login = () => {
  const { formik, isLoggedIn, captcha } = useLogin();

  if (isLoggedIn) return <Navigate to="/todolists" />;

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"} rel="noopener noreferrer">
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                error={!!(formik.touched.email && formik.errors.email)}
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && <div style={{ color: "red" }}>{formik.errors.email}</div>}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                error={!!(formik.touched.password && formik.errors.password)}
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              )}
              {captcha && (
                <>
                  <img src={captcha} alt="captcha" />
                  <TextField
                    type="text"
                    label="Captcha"
                    margin="normal"
                    onFocus={() => formik.setFieldTouched("captcha", true)}
                    error={!!(formik.touched.captcha && formik.errors.captcha)}
                    {...formik.getFieldProps("captcha")}
                  />
                  {formik.touched.captcha && formik.errors.captcha && (
                    <div style={{ color: "red" }}>{formik.errors.captcha}</div>
                  )}
                </>
              )}

              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox checked={formik.values.rememberMe} {...formik.getFieldProps("rememberMe")} />}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
