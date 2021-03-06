import {
  BASE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_SCOPE,
  CLIENT_GRANT_PASSWORD,
  CLIENT_GRANT_REFRESH
} from "@/variables.js";
import store from "@/store.js";

export default {
  /**********************GET TOKENS AND STORE THEM********************************/
  passwordGrant(username, password) {
    const data = {
      grant_type: CLIENT_GRANT_PASSWORD,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: username,
      password: password,
      scope: CLIENT_SCOPE
    };

    const formBody = Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");

    let promise = fetch(BASE_URL + "oauth/token", {
      method: "POST",
      body: formBody,
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    })
      .then(res => {
        if (!res.ok) {
          console.log(res.statusText);
          return false;
        } else {
          return res.json();
        }
      })
      .then(data => {
        if (data !== false) {
          store.dispatch("storeAccessToken", data.access_token);
          store.dispatch("storeRefreshToken", data.refresh_token);
          store.dispatch("storeCurrentUser", username);
          return true;
        } else {
          return false;
        }
      });
    return promise;
  },

  /*******************Use refresh token to get new token pair.***********************/
  refreshTokens(refreshToken) {
    const data = {
      grant_type: CLIENT_GRANT_REFRESH,
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
      // scope: CLIENT_SCOPE // this must be disabled to get valid access tokens !!!
    };

    const formBody = Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");

    let promise = fetch(BASE_URL + "oauth/token", {
      method: "POST",
      body: formBody,
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    })
      .then(res => {
        if (!res.ok) {
          console.log(res.statusText);
          return false;
        } else {
          return res.json();
        }
      })
      .then(data => {
        if (data !== false) {
          store.dispatch("storeAccessToken", data.access_token);
          store.dispatch("storeRefreshToken", data.refresh_token);
        } else {
          console.log("Refreshing tokens failed. Logging out user.");
          store.dispatch("userLogOut");
        }
      });
    return promise;
  },

  // Registration for new user.
  register(username, password, email) {
    const data = {
      name: [
        {
          value: username
        }
      ],
      pass: [
        {
          value: password
        }
      ],
      mail: [
        {
          value: email
        }
      ]
    };

    let promise = fetch(BASE_URL + "user/register?_format=json", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(data)
    }).then(res => {
      if (!res.ok) {
        console.log(res.statusText);
        return false;
      } else {
        return true;
      }
    });
    return promise;
  }
};
