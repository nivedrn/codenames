import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
// As a basic setup, import your same slice reducers
import {
	userLoginReducer,
	userRegisterReducer,
	userListReducer,
} from "../../reducers/userReducer";

export function renderWithProviders(
  ui,
  {
    initialState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: { userLogin: userLoginReducer,
        userRegister: userRegisterReducer,
        userList: userListReducer },
      initialState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}