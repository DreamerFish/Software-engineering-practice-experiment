import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeMonitor from '@/views/dashboard/monitor/locale/en-US';

import localeSearchTable from '@/views/account/account-list/locale/en-US';
import localeAddAdministrator from '@/views/account/add-administrator/locale/en-US';

import addEquipment from '@/views/equipment/add-equipment/locale/en-US'
import equipmentInquiry from '@/views/equipment/equipment-inquiry/locale/en-US'
import hireRecord from '@/views/equipment/hire-record/locale/en-US'

import localeUserSetting from '@/views/user/setting/locale/en-US';

import announcementPenalty from '@/views/announcement/announcement-penalty/locale/en-US'

import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'Administrator account management',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,

  ...localeMonitor,
  ...localeSearchTable,
  ...localeAddAdministrator,
  ...announcementPenalty,
  ...addEquipment,
  ...equipmentInquiry,
  ...hireRecord,
  ...localeUserSetting,
};
