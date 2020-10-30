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
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import {Barcode, BuildingWarehouse, Flask} from 'tabler-icons-react';
import Rotate90DegreesCcwIcon from '@material-ui/icons/Rotate90DegreesCcw';
import {AccessGroups} from 'utils/AppConst'


export default [
    {
        title: 'Страницы',
        pages: [
            {
                title: 'Монитор дел',
                href: '/dashboard',
                icon: DashboardIcon,
                access: [AccessGroups.ALL]
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
                        title: 'ТМЦ',
                        href: '/catalogs/stock'
                    },
                    {
                        title: 'Производственные линии',
                        href: '/catalogs/lines'
                    },
                    {
                        title: 'Затраты',
                        href: '/catalogs/cost'
                    },
                    {
                        title: 'Работы',
                        href: '/catalogs/works'
                    },
                    {
                        title: 'Методы оплат',
                        href: '/catalogs/paymethod'
                    },
                    {
                        title: 'Шаблоны смен',
                        href: '/catalogs/team_template'
                    }
                ],
                access: [AccessGroups.ADMIN, AccessGroups.TECHNOLOGIST, AccessGroups.FACTORY, AccessGroups.BUH]
            },
        ],
        access: [AccessGroups.ADMIN, AccessGroups.MANAGER, AccessGroups.FACTORY, AccessGroups.REPORT,
            AccessGroups.BUH, AccessGroups.BOSS]
    },
    {
        title: 'Бухгалтерия',
        access: [
            AccessGroups.ADMIN, AccessGroups.BOSS, AccessGroups.FINANCE, AccessGroups.BUH
        ],
        pages: [
            {
                title: 'Затраты',
                href: '/expense',
                icon: AccountBalanceWalletOutlinedIcon,
                access: [AccessGroups.ADMIN, AccessGroups.FINANCE, AccessGroups.BUH, AccessGroups.BOSS]
            },
            {
                title: 'Склад',
                href: '/store',
                icon: BuildingWarehouse,
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
                        title: 'ТМЦ',
                        href: '/store/stock'
                    },
                    {
                        title: 'Складской журнал',
                        href: '/store/journal'
                    },
                    {
                        title: 'Резерв продукции',
                        href: '/store/reserved'
                    }
                ],
                access: [AccessGroups.ADMIN, AccessGroups.FINANCE, AccessGroups.BUH]
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
                access: [AccessGroups.ADMIN, AccessGroups.BOSS, AccessGroups.FINANCE, AccessGroups.BUH]
            }
        ]
    },
    {
        title: 'Продажи',
        access: [
            AccessGroups.MANAGER, AccessGroups.BOSS, AccessGroups.ADMIN, AccessGroups.BUH, AccessGroups.REPORT
        ],
        pages: [
            {
                title: 'Клиенты',
                href: '/clients',
                icon: GroupOutlinedIcon,
                access: [AccessGroups.MANAGER, AccessGroups.BOSS, AccessGroups.ADMIN, AccessGroups.BUH, AccessGroups.REPORT]
            },
            {
                title: 'Контракты',
                href: '/contracts',
                icon: WorkOutlineOutlinedIcon,
                access: [AccessGroups.MANAGER, AccessGroups.BOSS, AccessGroups.ADMIN, AccessGroups.BUH, AccessGroups.REPORT]
            },
            {
                title: 'Платежи',
                href: '/payments',
                icon: AccountBalanceIcon,
                access: [AccessGroups.MANAGER, AccessGroups.BOSS, AccessGroups.ADMIN, AccessGroups.BUH, AccessGroups.REPORT]
            },
            {
                title: 'Цены',
                href: '/price',
                icon: Barcode,
                access: [AccessGroups.BUH, AccessGroups.BOSS, AccessGroups.ADMIN, AccessGroups.REPORT]
            },
            {
                title: 'Прайс-лист',
                href: '/user-price',
                icon: Barcode,
                access: [AccessGroups.MANAGER]
            },
            {
                title: 'Возвраты продукции',
                href: '/return',
                icon: Rotate90DegreesCcwIcon,
                access: [AccessGroups.MANAGER]
            },
        ]
    },
    {
        title: 'Производство',
        access: [
            AccessGroups.FACTORY, AccessGroups.BOSS, AccessGroups.ADMIN, AccessGroups.TECHNOLOGIST
        ],
        pages: [
            {
                title: 'Рецептура',
                href: '/catalogs/formula',
                icon: Flask,
                access: [AccessGroups.TECHNOLOGIST, AccessGroups.BOSS, AccessGroups.ADMIN]
            },
            {
                title: 'Производство',
                href: '/factory',
                icon: DomainOutlinedIcon,
                access: [AccessGroups.FACTORY, AccessGroups.BOSS, AccessGroups.ADMIN, AccessGroups.TECHNOLOGIST]
            },
        ]
    },
    {
        title: 'Отчётность',
        pages: [
            {
                title: 'Заключенные договоры',
                href: '/report/contracts',
                icon: EqualizerOutlinedIcon,
                access: [AccessGroups.REPORT, AccessGroups.MANAGER]
            },
            {
                title: 'Продажи',
                href: '/report/sales',
                icon: EqualizerOutlinedIcon,
                access: [AccessGroups.REPORT, AccessGroups.MANAGER]
            },
            {
                title: 'Производство готовой продукции',
                href: '/report/production',
                icon: EqualizerOutlinedIcon,
                access: [AccessGroups.REPORT, AccessGroups.FACTORY]
            }
        ],
        access: [AccessGroups.ADMIN, AccessGroups.FACTORY, AccessGroups.MANAGER, AccessGroups.REPORT,
            AccessGroups.BOSS, AccessGroups.BUH]
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
        access: [AccessGroups.ADMIN]
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
                icon: NewReleasesOutlinedIcon
            }
        ],
        access: [AccessGroups.ALL]
    }
];
