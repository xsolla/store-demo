import React from "react";

export default async function StoreLoader(projectId, loginToken) {
  let result = {};
  let all = [];
  let allGroup = await loadUngroup(projectId).then(allGroup => {
    console.log("allGroup = ", allGroup);
    return allGroup;
  });
  all.push(allGroup);
  // await response of fetch call
  let responseGroups = await fetch(
    "https://store.xsolla.com/api/v1/project/" + projectId + "/items/groups",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + loginToken
      }
    }
  );
  console.log("responseGroups = ", responseGroups);
  if (responseGroups) {
    // only proceed once promise is resolved
    let resolvedGroups = await responseGroups.json();
    resolvedGroups = resolvedGroups["groups"];
    // only proceed once second promise is resolved

    let fulfilledGroups = await Promise.all(
      resolvedGroups.map((oneGroup, key) => {
        console.log("group", oneGroup);
        return loadByGroup(projectId, oneGroup);
      })
    ).then(fulfilledGroups => {
      console.log("fulfilledGroups = ", fulfilledGroups);
      return fulfilledGroups;
    });
    all = all.concat(fulfilledGroups);
  }

  console.log("result = ", all);

  result = {
    virtualItems: all
  };
  return result;
}

function loadByGroup(projectId, group) {
  return new Promise((resolve, reject) => {
    fetch(
      "https://store.xsolla.com/api/v1/project/" +
        projectId +
        "/items/virtual_items/group/" +
        group["external_id"]
    )
      .then(response => response.json())
      .then(json => {
        let products = json["items"];
        group["products"] = products;
        resolve(group);
      })
      .catch(function(error) {
        console.log("Products ERROR = ", error.message);
        reject(error.message);
      });
  });
}

function loadUngroup(projectId) {
  return new Promise((resolve, reject) => {
    fetch(
      "https://store.xsolla.com/api/v1/project/" +
        projectId +
        "/items/virtual_items"
    )
      .then(response => response.json())
      .then(json => {
        let products = json["items"];
        let group = {
          id: 0,
          external_id: "0_all",
          description: "all",
          name: "all"
        };
        group["products"] = products;
        console.log("all = ", group);
        resolve(group);
      })
      .catch(function(error) {
        console.log("Products ERROR = ", error.message);
        reject(error.message);
      });
  });
}
