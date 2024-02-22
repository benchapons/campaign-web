import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useSidebarCustomer = () => {
  const router = useRouter();
  const [isSidebar, setIsSidebar] = useState<boolean>(true);
  const [isShowSubMenuReport, setIsShowSubMenuReport] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady && router?.pathname.startsWith('/reports')) {
      setIsShowSubMenuReport(true);
    }
  }, [router]);

  const menuType = {
    isShowCampaign: true,
  };

  const handleRoute = (path: string) => {
    router.push(path);
  };

  const handleToggleReport = () => {
    setIsShowSubMenuReport((prev) => !prev);
  };

  return {
    isSidebar,
    isShowSubMenuReport,
    menuType,
    handleRoute,
    setIsSidebar,
    handleToggleReport,
  };
};

export default useSidebarCustomer;
