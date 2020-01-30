import axios from "axios";

export const getVirtualItemList = (projectId) => {
    let opts = {
        url:
            `https://store.xsolla.com/api/v2/project/${projectId}/items/virtual_items`,
        method: "GET",
    };

    return axios(opts)
        .then(function(response) {
            return response.data.items;
        });
}

export const rewardItems = (data) => {
    let opts = {
        url:
            `https://livedemo.xsolla.com/store-demo/api/index.php`,
        method: "POST",
        data: data
    }

    return axios(opts)
        .then(function(response) {
            return response.data;
        });
}