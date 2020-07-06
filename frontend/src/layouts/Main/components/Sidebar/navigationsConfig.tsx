import React from 'react';
import {colors} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import NewReleasesOutlinedIcon from '@material-ui/icons/NewReleasesOutlined';
import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined';
import DomainOutlinedIcon from '@material-ui/icons/DomainOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import WidgetsOutlinedIcon from '@material-ui/icons/WidgetsOutlined';
import {Label} from 'components';
import {
    GROUP_ADMIN,
    GROUP_ALL,
    GROUP_BOSS,
    GROUP_FACTORY,
    GROUP_FINANCE,
    GROUP_MANAGER,
    GROUP_REPORT
} from "utils/AppConst";

export default [
    {
        title: 'Страницы',
        pages: [
            {
                title: 'Монитор дел',
                href: '/dashboard',
                icon: DashboardIcon,
                access: [GROUP_ALL]
            },
            {
                title: 'Справочники',
                href: '/catalogs',
                icon: LibraryBooksOutlinedIcon,
                children: [
                    {
                        title: 'Ед. измерения',
                        href: '/catalogs/units'
                    },
                    {
                        title: 'Тара',
                        href: '/catalogs/tare'
                    },
                    {
                        title: 'Сырьё',
                        href: '/catalogs/raw'
                    },
                    {
                        title: 'Продукция',
                        href: '/catalogs/product'
                    },
                    {
                        title: 'Рецептура',
                        href: '/catalogs/formula'
                    },
                    {
                        title: 'Производственные линии',
                        href: '/catalogs/lines'
                    },
                    {
                        title: 'Затраты',
                        href: '/catalogs/cost'
                    }
                ],
                access: [GROUP_ADMIN]
            },
            {
                title: 'Клиенты',
                href: '/clients',
                icon: GroupOutlinedIcon,
                access: [GROUP_MANAGER, GROUP_BOSS, GROUP_ADMIN]
            },
            {
                title: 'Контракты',
                href: '/contracts',
                icon: WorkOutlineOutlinedIcon,
                access: [GROUP_MANAGER, GROUP_BOSS, GROUP_ADMIN]
            },
            {
                title: 'Производство',
                href: '/factory',
                icon: DomainOutlinedIcon,
                access: [GROUP_FACTORY, GROUP_BOSS, GROUP_ADMIN]
            },
            {
                title: 'Затраты',
                href: '/expense',
                icon: AccountBalanceWalletOutlinedIcon,
                access: [GROUP_ADMIN, GROUP_FINANCE]
            },
            {
                title: 'Склад',
                href: '/store',
                icon: WidgetsOutlinedIcon,
                children: [
                    {
                        title: 'Сырьё',
                        href: '/store/raw'
                    },
                    {
                        title: 'Готовая продукция',
                        href: '/store/product'
                    },
                    {
                        title: 'Складской журнал',
                        href: '/store/journal'
                    },
                    {
                        title: 'Резерв продукции',
                        href: '/store/reserve'
                    }
                ],
                access: [GROUP_ADMIN, GROUP_FINANCE]
            },
            {
                title: 'Организация',
                href: '/profile',
                icon: AccountBalanceOutlinedIcon,
                children: [
                    {
                        title: 'Реквизиты',
                        href: '/org/requisite'
                    },
                    {
                        title: 'Должности',
                        href: '/org/staff'
                    },
                    {
                        title: 'Структура',
                        href: '/org/structure'
                    },
                    {
                        title: 'Сотрудники',
                        href: '/org/employee'
                    }
                ],
                access: [GROUP_ADMIN, GROUP_BOSS, GROUP_FINANCE]
            }
        ],
        access: [GROUP_ADMIN, GROUP_MANAGER, GROUP_FACTORY]
    },
    {
        title: 'Отчётность',
        pages: [
            {
                title: 'Заключенные договоры',
                href: '/report/contracts',
                icon: EqualizerOutlinedIcon,
                access: [GROUP_REPORT, GROUP_MANAGER]
            },
            {
                title: 'Продажи',
                href: '/report/sales',
                icon: EqualizerOutlinedIcon,
                access: [GROUP_REPORT, GROUP_MANAGER]
            },
            {
                title: 'Производство готовой продукции',
                href: '/report/production',
                icon: EqualizerOutlinedIcon,
                access: [GROUP_REPORT, GROUP_FACTORY]
            }
        ],
        access: [GROUP_ADMIN, GROUP_FACTORY, GROUP_MANAGER, GROUP_REPORT]
    },
    {
        title: 'Администрирование',
        pages: [
            {
                title: 'Пользователи',
                href: '/admin/users',
                icon: PeopleIcon,
                access: []
            },
            {
                title: 'Настройки',
                href: '/setup',
                icon: SettingsIcon,
                access: []
            }
        ],
        access: [GROUP_ADMIN]
    },
    {
        title: 'Приложение',
        pages: [
            {
                title: 'О приложении',
                href: '/about',
                icon: InfoOutlinedIcon,
                access: []
            },
            {
                title: 'Изменения',
                href: '/changelog',
                access: [],
                icon: NewReleasesOutlinedIcon,
                label: () => <Label color={colors.blue['500']}>v20.05</Label>
            }
        ],
        access: [GROUP_ALL]
    }
];
