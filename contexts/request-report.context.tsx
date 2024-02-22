import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { PropsWithChildren, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
// const voidFuctionType = () => {};

// type UsersContextValueType = {
//   users: UserDTOType;
//   appendUsers: (users: UserDTOType) => void;
//   status: 'loading' | 'authenticated' | 'unauthenticated';
//   data: Session;
// };

const defaultContext = {
  users: undefined,
  appendUsers: () => {},
  status: 'loading',
  data: {
    user: {},
    expires: '',
  },
};

export const UsersContext = React.createContext<any>(defaultContext);
UsersContext.displayName = 'Users';

// eslint-disable-next-line @typescript-eslint/ban-types
type UsersProviderPropsType = PropsWithChildren<{}>;

export const UsersProvider = ({ children }: UsersProviderPropsType) => {
  // const [users, setUsers] = useState<UserDTOType>();

  // const appendUsers = (_users: UserDTOType) => {
  //   if (users) return;
  //   setUsers(_users);
  // };

  return (
    <UsersContext.Provider
      value={
        {
          // users,
          // appendUsers,
          // status,
          // data,
        }
      }
    >
      {children}
    </UsersContext.Provider>
  );
};
