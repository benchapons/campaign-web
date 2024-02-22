import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '@/components/Loader';
import { AzureAdService } from '@/services/client/azure-ad.service';
import { AzurePropTypes } from '@/types/auth.type';
import { signOut } from 'next-auth/react';

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

const Login = ({
  azureClientId,
  azureTenantId,
  azureScope,
  azureRedirectUrI,
  azureLogoutUrI,
  azureLoginDamain,
}: AzurePropTypes) => {
  const router = useRouter();
  const azureService = new AzureAdService(
    azureClientId,
    azureTenantId,
    azureScope,
    azureRedirectUrI,
    azureLogoutUrI,
    azureLoginDamain
  );

  useEffect(() => {
    signOut().then(() => {
      azureService.logOut();
    });
  });

  return (
    <div className="h-full bg-blue-fresh">
      <Loader />
    </div>
  );
};

export default Login;
