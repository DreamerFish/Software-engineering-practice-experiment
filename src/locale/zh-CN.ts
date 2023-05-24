import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeMonitor from '@/views/dashboard/monitor/locale/zh-CN';

import localeSearchTable from '@/views/account/account-list/locale/zh-CN';
import localeAddAdministrator from '@/views/account/add-administrator/locale/zh-CN';

import localeUserSetting from '@/views/user/setting/locale/zh-CN';

import addEquipment from '@/views/equipment/add-equipment/locale/zh-CN'
import equipmentInquiry from '@/views/equipment/equipment-inquiry/locale/zh-CN'
import hireRecord from '@/views/equipment/hire-record/locale/zh-CN'
import checkEquipment from '@/views/equipment/check-equipment/locale/zh-CN'
import rentEquipment from '@/views/equipment/rent-equipment/locale/zh-CN'

import addPlace from '@/views/place/add-place/locale/zh-CN'
import placeInquiry from '@/views/place/place-inquiry/locale/zh-CN'
import bookRecord from '@/views/place/book-record/locale/zh-CN'
import checkPlace from '@/views/place/check-place/locale/zh-CN'
import alterPlace from '@/views/place/alter-place/locale/zh-CN'

import matchInquiry from '@/views/match/match-inquiry/locale/zh-CN'
import addMatch from '@/views/match/add-match/locale/zh-CN'
// import bookRecord from '@/views/place/book-record/locale/zh-CN'
import checkMatch from '@/views/match/check-match/locale/zh-CN'
import alterMatch from '@/views/match/alter-match/locale/zh-CN'
// import alterPlace from '@/views/place/alter-place/locale/zh-CN'

import announcementPenalty from '@/views/announcement/announcement-penalty/locale/zh-CN'
import checkAnnouncement from '@/views/announcement/check-announcement/locale/zh-CN'

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '管理员账户管理',
  'menu.equipment': '器材信息',
  'menu.place': '场所信息',
  'menu.match': '赛事信息',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.announcement': '体育馆公告',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'announcement.accountList':'公告编辑',
  'check-announcement.accountList':'公告查看',
  'menu.defaulter':'失约信息',
  'menu.defaulter.list':'失约人员列表',
  'menu.defaulter.add':'添加失约人员',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,

  ...localeMonitor,
  ...localeSearchTable,
  ...localeAddAdministrator,
  ...announcementPenalty,
  ...checkAnnouncement,
  ...addEquipment,
  ...equipmentInquiry,
  ...hireRecord,
  ...checkEquipment,
  ...rentEquipment,
  ...addPlace,
  ...placeInquiry,
  ...bookRecord,
  ...checkPlace,
  ...alterPlace,

  ...addMatch,
  ...matchInquiry,
  ...alterMatch,
  ...checkMatch,

  ...localeUserSetting,
};
