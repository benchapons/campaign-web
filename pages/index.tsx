import { PagePermission } from '@/constants/auth';
import withSession from '@/hoc/withSession';
import { AuthorizedUserType } from '@/types/auth.type';

interface PropsType {
  authorizedUser: AuthorizedUserType;
}

const Home = ({ authorizedUser }: PropsType) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-6xl font-extrabold text-blue-cobalt mb-5">Welcome</h1>
      <p className="text-3xl text-blue-pacific">{authorizedUser?.displayName}</p>
    </div>
  );
};

export default withSession(Home, PagePermission.home);
