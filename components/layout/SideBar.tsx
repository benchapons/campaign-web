import React, { CSSProperties, Fragment, PropsWithChildren } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tooltip } from 'react-tooltip';
import { FaAngleLeft, FaPollH } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineCampaign, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { HiOutlineTrophy } from 'react-icons/hi2';
import { TbReport } from 'react-icons/tb';

import OneSiamLogo from '@/public/icons/one_siam_logo.jpeg';

import useSidebarCustomer from '@/hooks/useSidebarCustomer';
import { AuthorizedUserType } from '@/types/auth.type';
import styles from './styles/Sidebar.module.css';
import { isPagePermission } from '@/utilities/auth';
import { Permission } from '@/constants/auth';

type SidebarType = PropsWithChildren<{
  pathname: string;
  authorizedUser: AuthorizedUserType;
  opacityImg: CSSProperties;
  handleHoverImg: () => void;
  handleOverImg: () => void;
  handleLogout: () => void;
}>;

function SideBar({
  children,
  opacityImg,
  pathname,
  handleHoverImg,
  handleOverImg,
  authorizedUser,
  handleLogout,
}: SidebarType) {
  const { isSidebar, isShowSubMenuReport, handleRoute, setIsSidebar, handleToggleReport } = useSidebarCustomer();

  const handleSidebar = () => {
    setIsSidebar(!isSidebar);
    const sidebar = document.querySelector('#aside');
    const children = document.querySelector('#aside-children');
    sidebar && sidebar.classList.toggle(styles['sidebar-toggle']);
    children && children.classList.toggle(styles['profile-toggle']);
  };

  return (
    <Fragment>
      <div className="w-full flex flex-row bg-white">
        <div
          id="aside"
          className={`justify-center min-w-[300px] max-w-[300px] duration-500 bg-white-ghost h-full  border-r border-gray-gainsboro shadow-sm`}
        >
          <div className={`relative h-full`}>
            <div id="btn-sidebar" className="absolute items-start -right-3.5 top-5 z-10">
              <button test-id="expand-sidebar" className={styles.button} onClick={handleSidebar}>
                <FaAngleLeft className={`text-lg ${isSidebar ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {isSidebar ? (
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col px-4 py-5">
                  <div
                    id="logo"
                    onMouseEnter={handleHoverImg}
                    onMouseLeave={handleOverImg}
                    className={`${styles['nav-img-content']} mb-10`}
                  >
                    <Link href="/" className="flex items-center">
                      <Image
                        alt="OneSiam logo"
                        src={OneSiamLogo}
                        width={30}
                        height={30}
                        // priority={true}
                        style={opacityImg}
                      />
                      <h1 className="font-bold pl-2">CAMPAIGN MANAGEMENT</h1>
                    </Link>
                  </div>
                  <div id="menu" className="flex flex-col gap-1">
                    {isPagePermission(authorizedUser, [Permission.CAMP_SEARCH]) && (
                      <button
                        test-id="campaign"
                        className={`${styles.menu} ${pathname.startsWith('/campaign') ? styles.active : ''}`}
                        onClick={() => handleRoute('/campaign')}
                      >
                        <div className="flex items-center">
                          <MdOutlineCampaign className="text-2xl" />
                          <p className="pl-2">Campaign</p>
                        </div>
                      </button>
                    )}
                    {isPagePermission(authorizedUser, [Permission.RWD_SEARCH]) && (
                      <button
                        test-id="reward"
                        className={`${styles.menu} ${pathname.startsWith('/reward') ? styles.active : ''}`}
                        onClick={() => handleRoute('/reward')}
                      >
                        <div className="flex items-center">
                          <HiOutlineTrophy className="text-xl" />
                          <p className="pl-2">Reward</p>
                        </div>
                      </button>
                    )}
                    {isPagePermission(authorizedUser, [Permission.MASTER_SEARCH]) && (
                      <button
                        test-id="master-management"
                        className={`${styles.menu} ${pathname.startsWith('/master') ? styles.active : ''}`}
                        onClick={() => handleRoute('/master')}
                      >
                        <div className="flex items-center">
                          <FaPollH className="text-xl" />
                          <p className="pl-2">Master Management</p>
                        </div>
                      </button>
                    )}

                    {isPagePermission(authorizedUser, [
                      Permission.RPT_REDEMP_01,
                      Permission.RPT_REDEMP_02,
                      Permission.RPT_REDEMP_03,
                      Permission.RPT_REDEMP_04,
                      Permission.RPT_REDEMP_05,
                      Permission.RPT_REDEMP_06,
                      Permission.RPT_REDEMP_07,
                    ]) && (
                      <div
                        test-id="report"
                        className={`${styles.menu} cursor-pointer ${
                          pathname.startsWith('/reports') ? styles.active : ''
                        }`}
                        onClick={() => handleToggleReport()}
                      >
                        <div className="flex items-center">
                          <TbReport className="text-xl" />
                          <p className="pl-2">Reports</p>
                        </div>
                        {isShowSubMenuReport ? (
                          <MdOutlineKeyboardArrowUp className="text-2xl text-blue-oxford" />
                        ) : (
                          <MdOutlineKeyboardArrowDown className="text-2xl text-blue-oxford" />
                        )}
                      </div>
                    )}
                    <div
                      className={`pl-3 pr-2 duration-300 ${
                        isShowSubMenuReport ? 'ease-in opacity-100' : 'ease-out opacity-0 pointer-events-none'
                      }`}
                    >
                      {isPagePermission(authorizedUser, [Permission.RPT_REDEMP_01]) && (
                        <div className="flex">
                          <div className="flex flex-col w-4 h-full">
                            <div className="flex w-4 h-6  border-l border-b rounded-bl-md border-blue-fresh"></div>
                            <div className="flex w-4 h-6 border-l -mt-1 border-blue-fresh"></div>
                          </div>
                          <button
                            test-id="report-condition"
                            data-tooltip-id="sidebar-tooltip"
                            data-tooltip-content="Redemption Transaction by Condition"
                            className={`${styles['menu-collaborative']} w-full ${
                              pathname.startsWith('/reports/redemption-transaction-condition') ? styles.active : ''
                            }`}
                            onClick={() => handleRoute('/reports/redemption-transaction-condition')}
                          >
                            <div className="flex items-center  w-full">
                              <p className="pl-2 text-left text-truncate">Redemption Transaction by Condition</p>
                            </div>
                          </button>
                        </div>
                      )}
                      {isPagePermission(authorizedUser, [Permission.RPT_REDEMP_02]) && (
                        <div className="flex">
                          <div className="flex flex-col w-4 h-full">
                            <div className="flex w-4 h-6  border-l border-b rounded-bl-md border-blue-fresh"></div>
                            <div className="flex w-4 h-6 border-l -mt-1 border-blue-fresh"></div>
                          </div>
                          <button
                            test-id="report-receipt"
                            data-tooltip-id="sidebar-tooltip"
                            data-tooltip-content="Redemption Transaction by Receipt"
                            className={`${styles['menu-collaborative']} w-full ${
                              pathname.startsWith('/reports/redemption-transaction-receipt') ? styles.active : ''
                            }`}
                            onClick={() => handleRoute('/reports/redemption-transaction-receipt')}
                          >
                            <div className="flex items-center  w-full">
                              <p className="pl-2 text-left text-truncate">Redemption Transaction by Receipt</p>
                            </div>
                          </button>
                        </div>
                      )}
                      {isPagePermission(authorizedUser, [Permission.RPT_REDEMP_03]) && (
                        <div className="flex">
                          <div className="flex flex-col w-4 h-full">
                            <div className="flex w-4 h-6  border-l border-b rounded-bl-md border-blue-fresh"></div>
                            <div className="flex w-4 h-6 border-l -mt-1 border-blue-fresh"></div>
                          </div>
                          <button
                            test-id="report-bank"
                            className={`${styles['menu-collaborative']} w-full ${
                              pathname.startsWith('/reports/bank-promotion') ? styles.active : ''
                            }`}
                            onClick={() => handleRoute('/reports/bank-promotion')}
                          >
                            <div className="flex items-center  w-full">
                              <p className="pl-2 text-left text-truncate">Bank Promotion</p>
                            </div>
                          </button>
                        </div>
                      )}
                      {isPagePermission(authorizedUser, [Permission.RPT_REDEMP_04]) && (
                        <div className="flex">
                          <div className="flex flex-col w-4 h-full">
                            <div className="flex w-4 h-6  border-l border-b rounded-bl-md border-blue-fresh"></div>
                            <div className="flex w-4 h-6 border-l -mt-1 border-blue-fresh"></div>
                          </div>
                          <button
                            test-id="report-summary"
                            className={`${styles['menu-collaborative']} w-full ${
                              pathname.startsWith('/reports/summary-redemption-reward') ? styles.active : ''
                            }`}
                            onClick={() => handleRoute('/reports/summary-redemption-reward')}
                          >
                            <div className="flex items-center  w-full">
                              <p className="pl-2 text-left text-truncate">Summary Redemption Reward</p>
                            </div>
                          </button>
                        </div>
                      )}
                      {isPagePermission(authorizedUser, [Permission.RPT_REDEMP_05]) && (
                        <div className="flex">
                          <div className="flex flex-col w-4 h-full">
                            <div className="flex w-4 h-6 border-l border-b rounded-bl-md border-blue-fresh"></div>
                          </div>
                          <button
                            test-id="receipt-transaction-report"
                            className={`${styles['menu-collaborative']} w-full ${
                              pathname.startsWith('/reports/receipt-transaction-report') ? styles.active : ''
                            }`}
                            onClick={() => handleRoute('/reports/receipt-transaction-report')}
                          >
                            <div className="flex items-center  w-full">
                              <p className="pl-2 text-left text-truncate">Receipt Transaction Report</p>
                            </div>
                          </button>
                        </div>
                      )}
                      {isPagePermission(authorizedUser, [Permission.RPT_REDEMP_06]) && (
                        <div className="flex">
                          <div className="flex flex-col w-4 h-full">
                            <div className="flex w-4 h-6 border-l border-b rounded-bl-md border-blue-fresh"></div>
                            <div className="flex w-4 h-6 border-l -mt-1 border-blue-fresh"></div>
                          </div>
                          <button
                            test-id="receipt-transaction-report"
                            className={`${styles['menu-collaborative']} w-full ${
                              pathname.startsWith('/reports/operation-report') ? styles.active : ''
                            }`}
                            onClick={() => handleRoute('/reports/operation-report')}
                          >
                            <div className="flex items-center  w-full">
                              <p className="pl-2 text-left text-truncate">Operation-report</p>
                            </div>
                          </button>
                        </div>
                      )}
                      {isPagePermission(authorizedUser, [Permission.RPT_REDEMP_07]) && (
                        <div className="flex">
                          <div className="flex flex-col w-4 h-full">
                            <div className="flex w-4 h-6 border-l border-b rounded-bl-md border-blue-fresh"></div>
                          </div>
                          <button
                            test-id="receipt-transaction-report"
                            className={`${styles['menu-collaborative']} w-full ${
                              pathname.startsWith('/reports/operation-bank-report') ? styles.active : ''
                            }`}
                            onClick={() => handleRoute('/reports/operation-bank-report')}
                          >
                            <div className="flex items-center  w-full">
                              <p className="pl-2 text-left text-truncate">Operation-report (bank)</p>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div id="user" className="flex p-6">
                  <div className="flex flex-col w-11/12">
                    <p className="font-semibold">{authorizedUser?.displayName}</p>
                    <p className="text-sm">{authorizedUser?.mail}</p>
                    <p className="text-sm">{authorizedUser?.userInfo?.roleName}</p>
                  </div>
                  <div className="flex w-1/12 items-baseline">
                    <button test-id="logout" onClick={handleLogout} className="hover:bg-blue-fresh p-1.5 rounded-md">
                      <FiLogOut className="text-2xl" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div id="aside-children ml-[12px]" className={`duration-500 w-full h-screen`}>
          <div className={`bg-white max-h-screen overflow-hidden ${isSidebar ? 'w-[calc(100vw-300px)]' : 'w-full'}`}>
            {children}
          </div>
        </div>
      </div>
      <Tooltip id="sidebar-tooltip" />
    </Fragment>
  );
}

export default SideBar;
