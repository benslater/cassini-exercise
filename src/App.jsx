import { Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/error";
import ItemPage, { editAction, itemLoader } from "./pages/item";
import NewPage, { newAction } from "./pages/new";
import RootPage, { rootLoader } from "./pages/root";

const routes = (
  <Routes>
    <Route
      path="/"
      element={<RootPage />}
      loader={rootLoader}
      errorElement={<ErrorPage />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route
          path="item/:id"
          element={<ItemPage />}
          loader={itemLoader}
          action={editAction}
        />
        <Route path="item/new" element={<NewPage />} action={newAction} />
      </Route>
    </Route>
  </Routes>
);

export default routes;
