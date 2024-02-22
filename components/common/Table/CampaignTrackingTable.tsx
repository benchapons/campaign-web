import { useMemo, useState } from 'react';
import Pagination from './Pagination';
import { Loader } from '@/components/Loader';
import { ChangeEventBaseType } from '@/types/event.interface';

interface PropsType {
  isLoading: boolean;
  dataList: any[];
}

const CampaignTrackingTable = ({ isLoading, dataList }: PropsType) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return dataList.slice(firstPageIndex, lastPageIndex);
  }, [dataList, currentPage, pageSize]);

  const onChangePageSize = (data: ChangeEventBaseType) => {
    setPageSize(+data?.value);
  };

  return (
    <div className="overflow-x-auto overflow-y-hidden rounded-md w-full">
      <table className="table-auto border-collapse w-full">
        <thead className="text-start text-blue-oxford text-[14px] bg-gradient-head-table rounded-t-lg w-full border-b border-blue-sea/30 py-2">
          <tr>
            <th className="px-1 py-3 min-w-[160px]">Campaign Name</th>
            <th className="px-1 py-3 min-w-[160px]">Condition Group Name</th>
            <th className="px-1 py-3">Building</th>
            <th className="px-1 py-3">Condition (Joiner, Date)</th>
          </tr>
        </thead>
        {currentTableData?.length ? (
          <tbody className="text-center text-[14px] bg-white-ghost body-table">
            {currentTableData?.map((_campaign) => (
              <tr
                key={_campaign?.code}
                className="hover:bg-blue-light/20 hover:cursor-pointer border-b border-gray-gainsboro"
              >
                <td
                  data-tooltip-id="campaign-tooltip"
                  data-tooltip-content={_campaign.name}
                  className="text-truncate max-w-[1px]"
                >
                  {_campaign?.name}
                </td>
                <td
                  data-tooltip-id="campaign-tooltip"
                  data-tooltip-content={_campaign.conditionGroupName}
                  className="text-truncate max-w-[1px]"
                >
                  {_campaign?.conditionGroupName}
                </td>
                <td className="max-w-[200px]">{_campaign?.building}</td>
                <td className="min-w-[154px]">{_campaign?.condition}</td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
      {isLoading ? (
        <Loader />
      ) : !currentTableData?.length ? (
        <div className="flex w-full justify-center min-h-[100px] items-center  bg-blue-light/10">
          ไม่พบข้อมูลของแคมเปญ
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

export default CampaignTrackingTable;
