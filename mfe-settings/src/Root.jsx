import React from "react";

function Root() {
  return (
    <section>
      <h1>User Settings</h1>
      Name: {global.root.context.userName}
    </section>
  );
}

export default Root;
