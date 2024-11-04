import React, { useEffect, useState } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";

function App() {
  const [sdk, setSDK] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Initialize the SDK and set it to state
      const discordSDK = new DiscordSDK();
      setSDK(discordSDK);

      // Ensure that SDK is ready and user object is available
      if (discordSDK && discordSDK.user) {
        discordSDK.user
          .getCurrentUser()
          .then((userData) => {
            setUser(userData);
          })
          .catch((err) => {
            console.error("Error fetching user:", err);
            setError("Failed to fetch user data.");
          });
      } else {
        setError("Discord SDK failed to initialize.");
      }
    } catch (e) {
      console.error("SDK initialization error:", e);
      setError("SDK initialization failed.");
    }
  }, []);

  return (
    <div>
      <h1>Discord Embedded App SDK Example</h1>
      <h2>Current User:</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : user ? (
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
