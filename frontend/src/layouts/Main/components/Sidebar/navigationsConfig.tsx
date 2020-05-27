import React from 'react';
import { colors } from '@material-ui/core';
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
import { Label } from 'components';

export default [
    {
        title: 'Страницы',
        pages: [
            {
                title: 'Монитор дел',
                href: '/dashboard',
                icon: DashboardIcon
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
                    }
                ]
            },
            {
                title: 'Клиенты',
                href: '/clients',
                icon: GroupOutlinedIcon
            },
            {
                title: 'Контракты',
                href: '/orders',
                icon: WorkOutlineOutlinedIcon
            },
            {
                title: 'Производство',
                href: '/factory',
                icon: DomainOutlinedIcon
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
                ]
            }
        ]
    },
    {
        title: 'Отчётность',
        pages: [
            {
                title: 'Заключенные договоры',
                href: '/report/contracts',
                icon: EqualizerOutlinedIcon
            },
            {
                title: 'Продажи',
                href: '/report/...',
                icon: EqualizerOutlinedIcon
            }
        ]
    },
    {
        title: 'Администрирование',
        pages: [
            {
                title: 'Пользователи',
                href: '/admin/users',
                icon: PeopleIcon
            },
            {
                title: 'Настройки',
                href: '/admin/settings',
                icon: SettingsIcon
            }
        ]
    },
    {
        title: 'Приложение',
        pages: [
            {
                title: 'О приложении',
                href: '/about',
                icon: InfoOutlinedIcon
            },
            {
                title: 'Изменения',
                href: '/changelog',
                icon: NewReleasesOutlinedIcon,
                label: () => <Label color={colors.blue['500']}>v1.2.0</Label>
            }
        ]
    }
];
