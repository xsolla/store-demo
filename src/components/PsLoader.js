import React from "react";

export default async function PsLoader(psToken, what) {
  if (what === "all") {
    let result = {};
    // await response of fetch call
    let responseGroups = await fetch(
      "https://secure.xsolla.com/paystation2/api/virtualitems/groups",
      {
        method: "POST",
        body: "access_token=" + psToken,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
    // only proceed once promise is resolved
    let resolvedGroups = await responseGroups.json();
    resolvedGroups = resolvedGroups["groups"];
    // only proceed once second promise is resolved

    let fulfilledGroups = await Promise.all(
      resolvedGroups.map((oneGroup, key) => {
        return loadPS(psToken, oneGroup);
      })
    ).then(fulfilledGroups => {
      console.log("fulfilledGroups = ", fulfilledGroups);
      return fulfilledGroups;
    });
    console.log("result = ", fulfilledGroups);

    // return result

    let responseCurr = await fetch(
      "https://secure.xsolla.com/paystation2/api/pricepoints",
      {
        method: "POST",
        body: "access_token=" + psToken,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );

    let resolvedCurrency = await responseCurr.json();

    let responseSubsc = await fetch(
      "https://store.xsolla.com/api/v1/subscription/paystation/plans/" + psToken
    );
    let resolvedSubscr = await responseSubsc.json();

    result = {
      virtualItems: fulfilledGroups,
      currency: resolvedCurrency,
      subscriptions: resolvedSubscr
    };

    return result;
  }

  if (what === "virtualitems") {
    // await response of fetch call
    let response = await fetch(
      "https://secure.xsolla.com/paystation2/api/virtualitems/groups",
      {
        method: "POST",
        body: "access_token=" + psToken,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
    // only proceed once promise is resolved
    let resolvedGroups = await response.json();
    resolvedGroups = resolvedGroups["groups"]; //TODO: пересмотреть структуру
    // only proceed once second promise is resolved

    let result = await Promise.all(
      resolvedGroups.map((oneGroup, key) => {
        return loadPS(psToken, oneGroup);
      })
    ).then(fulfilledGroups => {
      console.log("fulfilledGroups = ", fulfilledGroups);
      return fulfilledGroups;
    });
    console.log("result = ", result);
    return result;
  }

  if (what === "virtualcurrency") {
    // await response of fetch call
    let response = await fetch(
      "https://secure.xsolla.com/paystation2/api/pricepoints",
      {
        method: "POST",
        body: "access_token=" + psToken,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
    // only proceed once promise is resolved
    let resolvedCurrency = await response.json();
    let resolvedCurrPacks = resolvedCurrency["list"];
    let resolvedCurrName = resolvedCurrency["projectCurrency"];
    // only proceed once second promise is resolved
    let result = {
      resolvedCurrPacks: resolvedCurrPacks,
      resolvedCurrName: resolvedCurrName
    };
    return result;
  }

  if (what === "subscripstions") {
    // await response of fetch call
    let response = await fetch(
      "https://secure.xsolla.com/paystation2/api/pricepoints",
      {
        method: "POST",
        body: "access_token=" + psToken,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
    // only proceed once promise is resolved
    let resolvedCurrency = await response.json();
    let resolvedCurrPacks = resolvedCurrency["list"];
    let resolvedCurrName = resolvedCurrency["projectCurrency"];
    // only proceed once second promise is resolved
    let result = {
      resolvedCurrPacks: resolvedCurrPacks,
      resolvedCurrName: resolvedCurrName
    };
    return result;
  }
}

function loadPS(psToken, group) {
  return new Promise((resolve, reject) => {
    fetch(
      "https://secure.xsolla.com/paystation2/api/virtualitems/items?access_token=" +
        psToken +
        "&group_id=" +
        group["id"]
    )
      .then(response => response.json())
      .then(json => {
        let products = json["virtual_items"];
        group["products"] = products;
        resolve(group);
      })
      .catch(function(error) {
        console.log("Products ERROR = ", error.message);
        reject(error.message);
      });
  });
}

export const loadFromPS = (psToken, groupId) => {
  return new Promise((resolve, reject) => {
    fetch(
      "https://secure.xsolla.com/paystation2/api/virtualitems/items?access_token=" +
        psToken +
        "&group_id=" +
        groupId
    )
      .then(response => response.json())
      .then(json => {
        let curVI = json["virtual_items"];
        console.log("result = ", curVI);
        resolve(curVI);
      })
      .catch(function(error) {
        console.log("Products ERROR = ", error.message);
        reject(error.message);
      });
  });
};

export function PsLoader1(psToken, what = "virtualItems") {
  return new Promise((resolve, reject) => {
    if (what === "virtualItems") {
      fetch("https://secure.xsolla.com/paystation2/api/virtualitems/groups", {
        method: "POST",
        body: "access_token=" + psToken,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      })
        .then(response => response.json())
        .then(groupsData => {
          let virtualItems = groupsData["groups"];
          // this.loadProducts(virtualItems);
          // this.setState({ virtualItems });
          // virtualItems
          //console.log('virtualItems = ', virtualItems);
          resolve(virtualItems);
        })
        // .then(virtualItems => {

        //   virtualItems.map((oneGroupData, key) => {

        //     fetch('https://secure.xsolla.com/paystation2/api/virtualitems/items?access_token=' + psToken + '&group_id=' + oneGroupData['id'])
        //       .then(response => response.json())
        //       .then(function (json) {
        //         let curVI = json["virtual_items"];
        //         oneGroupData['product'] = curVI;
        //         console.log('oneGroupData = ', oneGroupData);
        //         if (key === virtualItems.length) {
        //           resolve(virtualItems);
        //         }
        //       })
        //       .catch(function (error) {
        //         console.log('Products ERROR = ', error.message)
        //       });
        //   })
        //     .then(virtualItems => { resolve(virtualItems); })
        //   // resolve(virtualItems);
        // })
        .catch(function(error) {
          console.log("Groups ERROR = ", error.message);
          reject(error.message);
        });
    }

    if (what === "storeProducts") {
    }
  });
}

const loadProducts = virtualItems => {
  virtualItems.map((oneGroupData, key) => {
    // let
    return oneGroupData["id"];
  });
  this.setState({ virtualItems });
};
