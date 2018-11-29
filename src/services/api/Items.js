import { BASE_URL } from "@/variables.js";

export default {

  createItem(itemData, accessToken) {
    const data = {
      "title": [
        {
          value: itemData.title
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
