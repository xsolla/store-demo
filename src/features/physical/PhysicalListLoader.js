import { PhysicalGood } from 'store-js-sdk/src/physical-goods/physical-goods';
import { init } from 'store-js-sdk/src/init';

export const getPhysicalGoods = (projectId, loginToken) => {
    //TODO добавить возможность использовать cancelToken в SDK
    init({
        projectId: projectId,
        version: 'v2'
    });

    const physicalGood = new PhysicalGood(loginToken);
    return physicalGood.getPhysicalGoodList().then(response => response.data.items);
};