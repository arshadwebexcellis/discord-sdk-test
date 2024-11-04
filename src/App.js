import React, { useEffect, useState } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";

function App() {
  const [sdk, setSDK] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize Discord SDK
    const client_id = "1301518697197994035"; // Use your actual client ID
    const discordSdk = new DiscordSDK(client_id);
    setSDK(discordSdk);

    // Setup Discord SDK and fetch user details
    setupDiscordSdk(discordSdk)
      .then((access_token) => {
        console.log("Discord SDK is authenticated");
        fetchUserDetails(access_token);
      })
      .catch((error) => {
        console.error("Error setting up Discord SDK:", error);
        setError("Failed to setup Discord SDK.");
      });
  }, []);

  async function setupDiscordSdk(discordSdk) {
    await discordSdk.ready();

    console.log("Discord SDK is ready");

    // Authorize with Discord Client
    const { code } = await discordSdk.commands.authorize({
      client_id: "1301518697197994035",
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify", "guilds"],
    });

    // Retrieve an access token
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: "1301518697197994035",
        client_secret: "zSKjATfdsjD4rdrKcPIw1Adi2ETahFKx",
        grant_type: "authorization_code",
        code: code,
      }),
    });
    console.log("respomse f ", response);

    // Retrieve the access_token from the response
    const { access_token } = await response.json();

    if (!access_token) {
      throw new Error("Failed to retrieve access token");
    }

    const auth = await discordSdk.commands.authenticate({ access_token });

    if (!auth) {
      throw new Error("Authentication failed");
    }

    return access_token;
  }

  // Fetch user details from Discord API
  async function fetchUserDetails(accessToken) {
    try {
      const userResponse = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await userResponse.json();
      setUser(userData);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details.");
    }
  }

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
