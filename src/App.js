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
      <h1>Hello, Discord Embedded App!</h1>
      {user ? (
        <p>
          Welcome, {user.username}#{user.discriminator}
        </p>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}

export default App;
