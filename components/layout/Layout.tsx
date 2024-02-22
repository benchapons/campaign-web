import router, { useRouter } from 'next/router';
import { CSSProperties, Fragment, PropsWithChildren, useState } from 'react';
import Head from 'next/head';

import { AuthorizedUserType } from '@/types/auth.type';
import styles from './styles/Layout.module.css';
import SideBar from './SideBar';
import { signOut } from 'next-auth/react';

export type LayoutType = PropsWithChildren<{
  authorizedUser: AuthorizedUserType;
  status: 'authenticated' | 'loading' | 'unauthenticated';
  title: string;
}>;

const Layout = ({ children, authorizedUser, status, title }: LayoutType) => {
  const { pathname } = useRouter();
  const [opacityImg, setOpacity] = useState<CSSProperties>({
    opacity: 0.8,
  });

  const handleHoverImg = () => {
    setOpacity({
      boxShadow: '0 4px 8px 0 rgba(120, 120, 120, 0.6), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
      opacity: 1,
      borderRadius: '3px',
    });
  };

  const handleOverImg = () => {
    setOpacity({
      opacity: 1,
    });
  };

  const handleMenuResponsive = () => {
    const menuList = document.querySelector('#ul-menu');
    if (menuList) {
      menuList.classList.toggle(styles.show);
    }
  };

  const handleRemoveMenuResponsive = () => {
    const menuList = document.querySelector('#ul-menu');

    if (menuList) {
      menuList.classList.remove(styles.show);
    }
  };

  const handleMenuAccount = () => {
    const menuList = document.querySelector('#ul-account');
    if (menuList) {
      menuList.classList.toggle(styles.show);
    }
  };

  const handleRemoveMenuAccount = () => {
    const menuList = document.querySelector('#ul-account');
    if (menuList) {
      menuList.classList.remove(styles.show);
    }
  };

  const handleLogout = () => {
    router.push('/auth/landing-logout');
  };

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      <div onMouseEnter={handleRemoveMenuResponsive} className={styles.layout} onClick={handleRemoveMenuAccount}>
        <SideBar
          authorizedUser={authorizedUser}
          opacityImg={opacityImg}
          pathname={pathname as string}
          handleHoverImg={handleHoverImg}
          handleOverImg={handleOverImg}
          handleLogout={handleLogout}
        >
          {children}
        </SideBar>
      </div>
    </Fragment>
  );
};

export default Layout;
