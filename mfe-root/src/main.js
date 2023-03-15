import { navigateToUrl, registerApplication, start } from "single-spa";
import { constructApplications, constructLayoutEngine, constructRoutes } from "single-spa-layout";

const routes = constructRoutes({
  base : "/",
  routes : [{
    type : "route",
    path : "signin",
    routes : [{
      type : "application",
      name : "mfe-signin"
    }]
  }, {
    type : "route",
    default : true,
    // Applications order matters.
    routes : [{
      type : "application",
      name : "mfe-header"
    }, {
      type : "application",
      name : "mfe-settings"
    }]
  }]
});

(async function main() {

  // 1. Register micro frontend applications.
  const applications = constructApplications({
    routes,
    loadApp : ({ name }) => ({
      "mfe-header" : () => import("mfeHeader/Root"),
      "mfe-settings" : () => import("mfeSettings/Root"),
      "mfe-signin" : () => import("mfeSignin/Root")
    }[name]())
  });

  constructLayoutEngine({
    applications,
    routes
  });

  applications.forEach(registerApplication);

  // 2. Define global context shared across all MFE.
  const context = {
    userName : "Tomtom",
    onSignedIn : () => {
      navigateToUrl("/");
    }
  };

  global.root = { context };

  // 3. Start application.
  navigateToUrl("/signin");
  start();

}());
