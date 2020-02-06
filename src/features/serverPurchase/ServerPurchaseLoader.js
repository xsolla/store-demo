import axios from "axios";


export const purchaseItems = (data) => {
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
