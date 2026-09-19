import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { AuthProvider } from "../src/context/AuthContext";
import { AppRouter } from "../src/router/AppRouter";

function renderApp() {
  window.history.pushState({}, "", "/");
  return render(
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

describe("DE-17 frontend scaffold", () => {
  test("DE-17-TC01 renders login page when unauthenticated", () => {
    renderApp();

    expect(
      screen.getByRole("heading", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("DE-17-TC02 logs in and navigates to dashboard", () => {
    renderApp();

    fireEvent.click(
      screen.getByRole("button", { name: /sign in as demo user/i })
    );

    expect(
      screen.getByRole("heading", { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  test("DE-17-TC03 renders bootstrap navbar brand", () => {
    renderApp();

    expect(screen.getByText(/aiad demo/i)).toBeInTheDocument();
  });
});
