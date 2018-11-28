import { BASE_URL } from "@/variables.js";

export default {
  getItems() {
    return fetch(BASE_URL + "node/251?_format=json", {
      method: "GET",
      headers: new Headers({
        Accept: "application/json"
      })
    })
      .then(res => res.json())
      .catch(err => {
        console.log(err);
      })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  },

  createItem(accessToken) {
    const data = {
      "title": [
        {
          value: "test"
        }
      ], 
      "type": [
        {
          "target_id": "test"
        }
      ]
    }

    let promise = fetch(BASE_URL + 'node?_format=json', {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken
      }),
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) {
        console.log(res.statusText);
        return false;
      } else {
        return res.json();
      }
    })
    .catch(err => {
      console.log(err);
    });
    return promise;
  }
};
