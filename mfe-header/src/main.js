// Split out the initialization code to avoid any additional round trips.
// Moreover, we don't need it in the remote entry file.
// See https://webpack.js.org/concepts/module-federation/#troubleshooting
import("./bootstrap");
