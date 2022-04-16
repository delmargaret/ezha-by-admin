import React from "react";
import { Switch, Route, useRouteMatch, withRouter } from "react-router-dom";

import CateringFacilitiesPage from "./catering-facilities";
import AddCateringFacility from "./add-catering-facility";
import UpdateCateringFacility from "./update-catering-facility";

export default function () {
  let { path } = useRouteMatch();

  const UpdateCateringFacilityWithRouter = withRouter(UpdateCateringFacility);

  return (
    <Switch>
      <Route exact path={path}>
        <CateringFacilitiesPage />
      </Route>
      <Route path={`${path}/new`}>
        <AddCateringFacility />
      </Route>
      <Route path={`${path}/edit/:id`}>
        <UpdateCateringFacilityWithRouter />
      </Route>
    </Switch>
  );
}
