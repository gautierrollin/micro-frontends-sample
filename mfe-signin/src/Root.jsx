import React, { useState } from "react";

function Root() {
  const [error, setError] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== "ohman") {
      setError(true);
      return;
    }

    setError(false);
    global.root.context.onSignedIn();
  };

  return (
    <div>
      <h1>
        Hello {global.root.context.userName}!
      </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Password
          <br />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && (
          <>
            <br />
            <span>Invalid password!</span>
          </>
        )}
        <br /><br />
        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Root;
