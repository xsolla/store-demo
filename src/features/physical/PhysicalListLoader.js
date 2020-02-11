import { PhysicalGood } from 'store-js-sdk/src/physical-goods/physical-goods';
import { init } from 'store-js-sdk/src/init';

export const loadPhysicalGoods = async (projectId, loginToken) => {
    //TODO добавить возможность использовать cancelToken в SDK
    init({ projectId, version: 'v2' });
    const physicalGood = new PhysicalGood(loginToken);
    const response = await physicalGood.getPhysicalGoodList();
    return response.data.items;
};