import { SearchDropdown } from '@/components/common/Dropdown';
import AuditLogTable from '@/components/common/Table/AuditLogTable';
import { SearchInput } from '@/components/common/TextInput';
import HeaderAuditLog from '@/components/features/auditLog/HeaderAuditLog';

import { PagePermission } from '@/constants/auth';
import withSession from '@/hoc/withSession';
import useAuditlog from '@/hooks/useAuditlog';

const AuditLog = () => {
  const { event, searchText, searchList, eventList, isLoading, onChangeSearchText, onChangeEvent, onExpend } =
    useAuditlog();
  return (
    <div>
      <HeaderAuditLog />
      <div className="overflow-auto h-[calc(100vh-61px)] px-5">
        <div className="card flex justify-center items-center gap-4 py-5">
          <div className="w-[70%]">
            <SearchInput
              className="w-full"
              value={searchText}
              isShowCloseBtn
              label="ค้นหาข้อมูล"
              onChange={onChangeSearchText}
            />
          </div>
          <div className="w-[30%]">
            <SearchDropdown
              isSearchable
              isFull
              label="Event"
              value={event}
              options={eventList}
              name={''}
              onChange={onChangeEvent}
            />
          </div>
        </div>
        <AuditLogTable dataList={searchList} onExpend={onExpend} isLoading={isLoading} />
      </div>
    </div>
  );
};
export default withSession(AuditLog, PagePermission.auditLog);
