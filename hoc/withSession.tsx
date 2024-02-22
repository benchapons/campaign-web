import Forbidden from '@/components/error/Forbidden';
import RequestReportBar from '@/components/features/request-report/RequestReportBar';
import Layout from '@/components/layout/Layout';
import { LoaderAuth } from '@/components/Loader';
import useUsers from '@/hooks/useUsers';
import { AuthenStatus, AuthorizedUserType, TitlePermission } from '@/types/auth.type';
import { isPagePermission } from '@/utilities/auth';
import { NextRouter } from 'next/router';
import React from 'react';

type HocWithSessionType = {
  authorizedUser: AuthorizedUserType;
  status?: 'authenticated' | 'loading' | 'unauthenticated';
  router?: NextRouter;
};

const withSession = <P extends object>(
  WrappedComponent: React.ComponentType<P & HocWithSessionType>,
  page: TitlePermission
) => {
  const ComponentWithSession = (props: P) => {
    const { authorizedUser, status, router } = useUsers();
    if (status && status === AuthenStatus.unauthenticated) router.push('/auth/logout');
    if (status === AuthenStatus.loading) return <LoaderAuth />;
    else if (authorizedUser && status === AuthenStatus.authenticated) {
      return (
        <Layout authorizedUser={authorizedUser} status={status} title={page.title}>
          {isPagePermission(authorizedUser, page.permission) ? (
            <WrappedComponent {...props} authorizedUser={authorizedUser} />
          ) : (
            <Forbidden />
          )}
          {/* <RequestReportBar /> */}
        </Layout>
      );
    } else {
      <LoaderAuth />;
    }
  };

  ComponentWithSession.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;
  return ComponentWithSession;
};

export default withSession;
