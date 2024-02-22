import { Tooltip } from 'react-tooltip';

import withSession from '@/hoc/withSession';

import HeaderMasterList from '@/components/features/master/header/HeaderMasterList';

import { PagePermission } from '@/constants/auth';
import useMasterList from '@/hooks/master/useMasterList';
import MasterTable from '@/components/common/Table/MasterTable';
import { SearchDropdown } from '@/components/common/Dropdown';
import { transformMapMaster } from '@/utilities/format';

const MasterPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    masterList,
    groupMasterList,
    groupMaster,
    handleChangeGroupMaster,
    handleClickAddMaster,
    handleClickEditMaster,
    handleClickDeleteMaster,
    handleClickAuditLog,
  } = useMasterList(authorizedUser);

  return (
    <div>
      <HeaderMasterList authorizedUser={authorizedUser} handleClickAddMaster={handleClickAddMaster} />

      <div className="overflow-auto h-[calc(100vh-61px)] px-5">
        <div className="flex mb-5 w-full mt-5">
          <div className="w-[50%]">
            <SearchDropdown
              isClearable
              isSearchable
              isFull
              label="Search Master Group"
              value={groupMaster}
              options={groupMasterList}
              name={'groupMaster'}
              onChange={handleChangeGroupMaster}
            />
          </div>
        </div>
        <MasterTable
          isLoading={isLoading}
          authorizedUser={authorizedUser}
          dataList={masterList}
          groupMap={transformMapMaster(groupMasterList)}
          onClickEdit={handleClickEditMaster}
          onClickDelete={handleClickDeleteMaster}
          onClickAuditLog={handleClickAuditLog}
        />
      </div>
      <Tooltip id="master-tooltip" />
    </div>
  );
};

export default withSession(MasterPage, PagePermission.masterSearch);
