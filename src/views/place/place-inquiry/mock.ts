import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|1-3': /[0-9]/,
      'name': Random.cname(),
      'Time': Random.date(),
      'expense|1-2': /[1-9]元\/每小时/,
      'campus': Random.cname(),
      'placeType': /未损坏/,
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/equipment/policy'), (params: GetParams) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        list: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});
