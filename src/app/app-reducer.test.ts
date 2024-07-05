import { appActions, appReducer, RequestStatusType } from "app/appSlice";

type AppInitialState = {
  error: string | null;
  status: RequestStatusType;
  isInitialized: boolean;
};
let startState: AppInitialState;

beforeEach(() => {
  startState = {
    error: null,
    status: "idle",
    isInitialized: false,
  };
});

test("correct error message should be set", () => {
  const endState = appReducer(startState, appActions.setError({ error: "some error" }));
  expect(endState.error).toBe("some error");
});

test("correct status should be set", () => {
  const endState = appReducer(startState, appActions.setAppStatus({ status: "loading" }));
  expect(endState.status).toBe("loading");
});
