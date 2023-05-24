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
      'alias|3-4': /[A-Z]/,
      'role': /[1-9]元\/每小时/,
      'createdTime': Random.datetime(),
      'phone':/未损坏/,
      'email|1-5':/[0-9]/
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
