import {
  BASE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_SCOPE,
  CLIENT_GRANT_TYPE
} from "@/variables.js";

export default {
  // Get access- and refresh token.
  passwordGrant(username, password) {
    const data = {
      grant_type: CLIENT_GRANT_TYPE,
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
        }
        return res.json();
      })
      .catch(err => {
        console.log(err);
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
    })
      .then(res => {
        if (!res.ok) {
          console.log(res.statusText);
          return false;
        } else {
          return true;
        }
      })
      .catch(err => {
        console.log(err);
      });
    return promise;
  }
};
