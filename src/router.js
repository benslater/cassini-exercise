import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/error";
import ItemPage, { deleteAction, editAction, itemLoader } from "./pages/item";
import NewPage, { newAction } from "./pages/new";
import RootPage, { rootLoader } from "./pages/root";

export const routes = [
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/item/:id",
            element: <ItemPage />,
            loader: itemLoader,
            children: [
              {
                path: "/item/:id/edit",
                action: editAction,
              },
              {
                path: "/item/:id/delete",
                action: deleteAction,
              },
            ],
          },
          {
            path: "/item/new",
            element: <NewPage />,
            action: newAction,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
