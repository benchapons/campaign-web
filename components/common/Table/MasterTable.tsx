import { useMemo, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

import ActionButtonMasterTable from '@/components/features/master/ActionButtonMasterTable';
import { Loader } from '@/components/Loader';

import { isPagePermission } from '@/utilities/auth';
import { AuthorizedUserType } from '@/types/auth.type';
import { Permission } from '@/constants/auth';
import Pagination from './Pagination';
import { ChangeEventBaseType } from '@/types/event.interface';
import TagStatusMasterData from '@/components/features/master/TagStatusMasterData';
import { StatusMasterData } from '@/constants/enum';
import { useSortableTable } from '@/hooks/useSortableTable';

interface PropsType {
  isLoading: boolean;
  dataList: any[];
  groupMap: any;
  authorizedUser: AuthorizedUserType;
  onClickEdit: (rewardId: string) => void;
  onClickAuditLog: (rewardId: string) => void;
  onClickDelete: (rewardId: string, rewardName: string) => void;
}

const columns: any[] = [
  { label: 'Master ID', accessor: 'masterId', sortable: true, className: '' },
  { label: 'Group', accessor: 'group', sortable: true, className: '' },
  { label: 'Value', accessor: 'value', sortable: true, className: 'w-[130px]' },
  { label: 'Label TH', accessor: 'nameTh', sortable: true, className: '' },
  { label: 'Label EN', accessor: 'nameEn', sortable: true, className: '' },
  { label: 'Description', accessor: 'desc', sortable: true, className: '' },
  { label: 'Parent', accessor: 'parentId', sortable: true, className: 'max-w-[80px]' },
  { label: 'Order Index', accessor: 'orderIndex', sortable: true, className: 'max-w-[80px]' },
  { label: 'Status', accessor: 'status', sortable: true, className: 'max-w-[80px]' },
];

const MasterTable = ({
  isLoading,
  dataList,
  authorizedUser,
  groupMap,
  onClickEdit,
  onClickAuditLog,
  onClickDelete,
}: PropsType) => {
  const { tableData, handleSorting } = useSortableTable(dataList, columns);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('');

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return tableData.slice(firstPageIndex, lastPageIndex);
  }, [tableData, currentPage, pageSize, order, sortField]);

  const onChangePageSize = (data: ChangeEventBaseType) => {
    setPageSize(+data?.value);
  };

  const handleSortingChange = (accessor: string) => {
    const sortOrder = accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
    setCurrentPage(1);
  };

  return (
    <div className="overflow-x-auto overflow-y-hidden rounded-md w-full">
      <table className="table-auto border-collapse w-full">
        <thead className="text-start text-blue-oxford text-[14px] bg-gradient-head-table rounded-t-lg w-full border-b border-blue-sea/30 py-2">
          <tr>
            {columns?.map((column) => (
              <th
                key={column?.accessor}
                className={`px-1 py-3 ${column?.className} cursor-pointer relative`}
                onClick={column?.sortable ? () => handleSortingChange(column?.accessor) : () => {}}
              >
                {column?.label}
                <div className="absolute right-0 top-[32%]">
                  {column?.sortable ? (
                    sortField === column?.accessor && order === 'asc' ? (
                      <FaCaretUp className="text-orange text-lg" />
                    ) : sortField === column?.accessor && order === 'desc' ? (
                      <FaCaretDown className="text-orange text-lg" />
                    ) : null
                  ) : null}
                </div>
              </th>
            ))}
            <th className="px-1 py-3  max-w-[80px]">Action</th>
          </tr>
        </thead>
        {currentTableData?.length ? (
          <tbody className="text-center text-[14px] bg-white-ghost body-table">
            {currentTableData?.map((_master, idx) => (
              <tr
                key={`${_master?.type}-${idx}`}
                className="hover:bg-blue-light/20 hover:cursor-pointer border-b border-gray-gainsboro"
              >
                <td className="w-[100px]">{_master?.masterId}</td>
                <td className="min-w-[180px]">
                  {groupMap?.[_master?.group] ? groupMap?.[_master?.group] : _master?.group}
                </td>
                <td
                  data-tooltip-id="master-tooltip"
                  data-tooltip-content={_master.value}
                  className="text-truncate max-w-[1px]"
                >
                  {_master?.value}
                </td>
                <td className="min-w-[120px]">{_master?.nameTh}</td>
                <td className="min-w-[120px]">{_master?.nameEn}</td>
                <td className="w-[130px]">{_master?.desc}</td>
                <td className="w-[80px]">{_master?.parentId}</td>
                <td className="w-[80px]">{_master?.orderIndex}</td>
                <td className="w-[80px]">
                  <TagStatusMasterData theme={_master?.status} />
                </td>
                <td className="w-[100px]">
                  <ActionButtonMasterTable
                    isPermissionDelete={isPagePermission(authorizedUser, [Permission.MASTER_DELETE])} 
                    isPermissionEdit={isPagePermission(authorizedUser, [Permission.MASTER_UPDATE])}
                    isPermissionAuditLog={isPagePermission(authorizedUser, [Permission.VW_MAST_AUDIT_LOG])}
                    index={idx}
                    isDisableDelete={_master?.status === StatusMasterData?.INACTIVE}
                    onClickEdit={() => onClickEdit(_master?._id)}
                    onClickDelete={() => onClickDelete(_master?._id, _master?.masterId)}
                    onClickAuditLog={() => onClickAuditLog(_master?._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
      {isLoading ? (
        <Loader />
      ) : !currentTableData?.length ? (
        <div className="flex w-full justify-center min-h-[100px] items-center  bg-blue-light/10">
          ไม่พบข้อมูลของ master
        </div>
      ) : null}
      <Pagination
        currentPage={currentPage}
        totalCount={dataList.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={onChangePageSize}
      />
    </div>
  );
};

export default MasterTable;
