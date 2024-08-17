import { Action } from "common/types";
import { authReducer, login, logout, me } from "features/login/model/authSlice";

type AppInitialState = {
  isLoggedIn: boolean;
};
let startState: AppInitialState;

beforeEach(() => {
  startState = {
    isLoggedIn: false,
  };
});

test("should correctly handle login ", () => {
  const action: Action<typeof login.fulfilled> = {
    type: login.fulfilled.type,
    payload: { isLoggedIn: true },
  };
  const state = authReducer(startState, action);
  expect(state.isLoggedIn).toBe(true);
});

test("should correctly handle logout ", () => {
  const action: Action<typeof logout.fulfilled> = {
    type: login.fulfilled.type,
    payload: { isLoggedIn: false },
  };
  const state = authReducer(startState, action);
  expect(state.isLoggedIn).toBe(false);
});

test("should correctly handle login ", () => {
  const action: Action<typeof me.fulfilled> = {
    type: login.fulfilled.type,
    payload: { isLoggedIn: true },
  };
  const state = authReducer(startState, action);
  expect(state.isLoggedIn).toBe(true);
});
