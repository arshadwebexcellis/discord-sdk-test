import React, { useEffect, useState } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";

function App() {
  const [sdk, setSDK] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize the SDK and set it to state
    const discordSDK = new DiscordSDK();
    setSDK(discordSDK);

    // Get the current user data if SDK is ready
    discordSDK.user
      .getCurrentUser()
      .then(setUser)
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  return (
    <div>
      <h1>Discord Embedded App SDK Example</h1>
      <h2>Current User:</h2>
      {user ? (
        <div>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Discriminator:</strong> {user.discriminator}
          </p>
          <p>
            <strong>Avatar:</strong>{" "}
            <img
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
              alt="User Avatar"
              style={{ width: 50, height: 50 }}
            />
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
