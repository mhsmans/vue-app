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
  }

};
