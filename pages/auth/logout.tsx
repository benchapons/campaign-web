import React, { useEffect } from 'react';
import Image from 'next/image';
import { AzureAdService } from '@/services/client/azure-ad.service';
import { AuthenStatus, AzurePropTypes } from '@/types/auth.type';
import useUsers from '@/hooks/useUsers';
import OneSiamLogo from '@/public/icons/one_siam_logo.jpeg';
import { FaBitcoin, FaCoins, FaGift, FaPollH } from 'react-icons/fa';

export async function getServerSideProps() {
  return {
    props: {
      azureClientId: process.env.AZURE_AD_CLIENT_ID,
      azureTenantId: process.env.AZURE_AD_TENANT_ID,
      azureScope: process.env.AZURE_AD_SCOPE,
      azureRedirectUrI: process.env.AZURE_AD_REDIRECT_URI,
      azureLogoutUrI: process.env.AZURE_AD_LOGOUT_URI,
      azureLoginDamain: process.env.AZURE_AD_LOGIN_DOMAIN,
    },
  };
}

const Logout = ({
  azureClientId,
  azureTenantId,
  azureScope,
  azureRedirectUrI,
  azureLogoutUrI,
  azureLoginDamain,
}: AzurePropTypes) => {
  const azureService = new AzureAdService(
    azureClientId,
    azureTenantId,
    azureScope,
    azureRedirectUrI,
    azureLogoutUrI,
    azureLoginDamain
  );
  const { authorizedUser, status, router } = useUsers();

  useEffect(() => {
    if (authorizedUser && status === AuthenStatus.authenticated) router.replace('/');
  }, [status, authorizedUser]);

  const handleLogin = () => {
    azureService.logIn(router.asPath);
  };
  //bg-gradient-to-b from-blue-light to-blue-oxford
  return (
    <div className="bg-blue-light/90 h-screen w-screen flex items-center justify-center ">
      <div className="bg-white shadow-2xl flex flex-col font-bold p-8 rounded-lg w-[620px]  justify-center items-center">
        {/* <div className="bg-white  flex justify-center shadow-2xl absolute w-[120px] h-[116px] p-4 mt-[-500px] mr-[-600px] rounded-[56px]">
          <Image alt="GiftImage" src={OneSiamLogo} className="opacity-80 w-[80px] h-[48px] mt-4" />
        </div> */}

        <div className="flex flex-row pt-8 items-end gap-2">
          <div className="bg-blue-light/10 border border-2 border-white rounded-[56px] p-4">
            <FaPollH className="text-[32px] text-blue-light/80 " />
          </div>
          <div className="bg-blue-light/20 border border-2 border-white rounded-[56px] p-4">
            <FaGift className="text-[48px] text-blue-light/90" />
          </div>
          <div className="bg-blue-dark border border-2 border-white rounded-[56px] p-4">
            <Image alt="GiftImage" src={OneSiamLogo} className="opacity-90 w-[74px] h-[70px]" />
          </div>
          <div className="bg-blue-light/20 border border-2 border-white rounded-[56px] p-4">
            <FaCoins className="text-[48px] text-blue-light/90 " />
          </div>
          <div className="bg-blue-light/10 border border-2 border-white rounded-[56px] p-4">
            <FaBitcoin className="text-[32px] text-blue-light/80 " />
          </div>
        </div>

        <div className="text-[64px] pt-6 gap-4 flex text-blue-dark/80 text-center items-center tracking-[0.15em] ">
          CAMPAIGN
        </div>
        <div className="text-[30px] flex mt-[-4px] gap-4 text-gray-deep text-center tracking-[0.1em]">MANAGEMENT</div>
        <div className="flex justify-center pt-14">
          <button
            name="login"
            className="mt- w-[300px] h-[50px] bg-blue-dark/80 text-white items-center rounded-xl hover:bg-blue-oxford"
            onClick={handleLogin}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
