import { DEFAULT_LAYOUT } from '@/router/constants';

export default {
    path: '/equipment',
    name: 'equipment',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.equipment',
        requiresAuth: true,
        icon: 'icon-tool',
        order: 4,
    },
    children: [
        {
            path: 'equipment-inquiry',
            name: 'EquipmentInquiry',
            component: () => import('@/views/equipment/equipment-inquiry/index.vue'),
            meta: {
                locale: 'menu.equipment.equipmentInquiry',
                requiresAuth: true,
                roles: ['admin','equipment','user'],
            },
        },
        {
            path: 'Add-Equipment',
            name: 'AddEquipment',
            component: () => import('@/views/equipment/add-equipment/index.vue'),
            meta: {
                locale: 'menu.equipment.addEquipment',
                requiresAuth: true,
                roles: ['admin','equipment'],
            },
        }, 
        {
            path: 'Hire-Record',
            name: 'HireRecord',
            component: () => import('@/views/equipment/hire-record/index.vue'),
            meta: {
                locale: 'menu.equipment.hireRecord',
                requiresAuth: true,
                roles: ['admin','equipment'],
            },
        }, {
            path: 'Check-Equipment',
            name: 'CheckEquipment',
            component: () => import('@/views/equipment/check-equipment/index.vue'),
            meta: {
                locale: 'menu.equipment.checkEquipment',
                requiresAuth: true,
                roles: ['-'],
            },
        }, {
            path: 'Rent-Equipment',
            name: 'RentEquipment',
            component: () => import('@/views/equipment/rent-equipment/index.vue'),
            meta: {
                locale: 'menu.equipment.rentEquipment',
                requiresAuth: true,
                roles: ['-'],
            },
        }, {
            path: 'Check-Rent-Equipment',
            name: 'CheckRentEquipment',
            component: () => import('@/views/equipment/check-rent-equipment/index.vue'),
            meta: {
                locale: 'menu.equipment.checkRentEquipment',
                requiresAuth: true,
                roles: ['-'],
            },
        }, {
            path: 'equipment-announcement-penalty',
            name: 'EquipmentAoticePenalty',
            component: () => import('@/views/equipment/announcement-penalty/index.vue'),
            meta: {
                locale: 'announcement.accountList',
                requiresAuth: true,
                roles: ['admin', 'equipment'],
            },
        }, {
            path: 'equipment-check-announcement',
            name: 'EquipmentCheckPenalty',
            component: () => import('@/views/equipment/check-announcement/index.vue'),
            meta: {
                locale: 'check-announcement.accountList',
                requiresAuth: true,
                roles: ['*'],
            },
        }
    ],
};
