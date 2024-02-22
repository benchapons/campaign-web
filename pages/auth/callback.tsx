import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import { LoaderAuth } from '@/components/Loader';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.code) redeemToken(router.query);
  }, [router.isReady]);

  async function redeemToken(callbackData: ParsedUrlQuery) {
    await signIn('credentials', {
      code: callbackData.code,
      redirect: false,
    });
    const stateParam = router?.query?.state;
    if (typeof stateParam === 'string') {
      try {
        const jsonString = Buffer.from(stateParam, 'base64').toString('utf-8');
        const customParam = JSON.parse(jsonString);
        const redirectUrl = customParam.customRedirectUrl || '/';
        router.push(redirectUrl);
      } catch (error) {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }
  return <LoaderAuth />;
};

export default Callback;
