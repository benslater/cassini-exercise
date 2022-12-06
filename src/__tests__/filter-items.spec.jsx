import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../router";
import { setupServer } from "msw/node";
import { handleGetAllProductData } from "./msw-handlers";

const handlers = [handleGetAllProductData];

describe("filtering items", () => {
  let server;

  beforeAll(() => {
    server = setupServer(...handlers);
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it("shows no items when no filters are present", async () => {
    const router = createMemoryRouter(routes);

    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Add item")).toBeInTheDocument();
    const itemList = screen.getByLabelText("list of items");
    expect(itemList.childNodes.length).toBe(1);
  });

  it("displays only filtered items when filters are present", async () => {
    const router = createMemoryRouter(routes);

    render(<RouterProvider router={router} />);

    const filterButton = await screen.findByText(
      "Filter items",
      {
        exact: false,
      },
      { timeout: 20000 }
    );
    expect(filterButton).toBeInTheDocument();

    userEvent.click(filterButton);

    const jeweleryFilter = await screen.findByRole("checkbox", {
      name: "jewelery",
    });
    expect(jeweleryFilter).toBeInTheDocument();

    userEvent.click(jeweleryFilter);

    expect(jeweleryFilter).toBeChecked();

    const itemList = screen.getByLabelText("list of items");
    await waitFor(() => {
      expect(itemList.childNodes.length).toBe(5);
    });
  });
});
