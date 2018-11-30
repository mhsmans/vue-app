import { BASE_URL } from "@/variables.js";

export default {
  // Create new item
  createItem(itemData, accessToken) {
    const data = {
      title: [
        {
          value: itemData.title
        }
      ],
      type: [
        {
          target_id: "test"
        }
      ],
      body: [
        {
          value: itemData.body,
          format: "basic_html"
        }
      ],
      img: [
        {
          "target_id": itemData.createdImageId
        }
      ]
    };

    let promise = fetch(BASE_URL + "node?_format=json", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken
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
  },

  // Create image
  createImage(itemData, accessToken) {
    const data = {
      _links: {
        type: {
          href: BASE_URL + "rest/type/file/image"
        }
      },
      filename: [
        {
          value: itemData.imageName
        }
      ],
      data: [
        {
          value: itemData.base64Image
        }
      ]
    };

    let promise = fetch(BASE_URL + "entity/file?_format=hal_json", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/hal+json",
        Accept: "application/hal+json",
        Authorization: "Bearer " + accessToken
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
    return promise;
  }
};
