import Button from "@/components/common/Button"
import Pagination from "@/components/common/Table/Pagination"
import ErrorStatus from "@/components/status/ErrorStatus"
import PendingStatus from "@/components/status/PendingStatus"
import SuccessStatus from "@/components/status/SuccessStatus"
import { ChangeEventBaseType } from "@/types/event.interface"
import { ListReport, Meta, StatusReportEnum, ReportTypeEnum } from "@/types/report.type"
import { Fragment } from "react"
import { MdDelete, MdDownload, MdEmail, MdRecentActors } from "react-icons/md"

type TableReportType<T> = {
  reportListPage: ListReport<T>[]
  page: number
  meta: Meta
  sizePage: number
  reportType: ReportTypeEnum
  handlePage: (pageSelect: number) => void
  handlePerPage: (event: ChangeEventBaseType<string>) => void
  deleteRequestReportId: (requestId: string) => Promise<void>
  reSentEmail: (requestId: string) => Promise<void>
}

const StatusBar = {
  [StatusReportEnum.COMPLETED]: <SuccessStatus />,
  [StatusReportEnum.PENDING]: <PendingStatus />,
  [StatusReportEnum.ERROR]: <ErrorStatus />,
};

const TableReport = <V,>({
  reportListPage,
  page,
  meta,
  sizePage,
  reportType,
  handlePage,
  handlePerPage,
  deleteRequestReportId,
  reSentEmail
}: TableReportType<V>) => {
  return <Fragment>
    <table className="table-auto border-collapse w-full mt-4">
      <thead className="text-start text-blue-oxford text-[14px] bg-gradient-head-table rounded-t-lg w-full border-b border-blue-sea/30 py-2">
        <tr>
          <th className="px-1 py-3 max-w-[150px]">RequestId</th>
          <th className="px-1 py-3 max-w-[150px]">Report Criteria</th>
          <th className="px-1 py-3 max-w-[150px]">Status</th>
          <th className="px-1 py-3 max-w-[150px]">CreateAt</th>
          <th className="px-1 py-3 max-w-[150px]">Action</th>
        </tr>
      </thead>
      <tbody className="text-center text-[14px] bg-white-ghost body-table">
        {reportListPage.length > 0 ? (
          reportListPage.map((_report, index) => (
            <tr key={index} className="border-b border-gray-gainsboro">
              <td className="min-w-[120px]">{_report.jobId}</td>
              <td className="max-w-[140px]">{JSON.stringify(_report.payload, null, 2)}</td>
              <td className="min-w-[120px]">{StatusBar[_report.status]}</td>
              <td className="min-w-[120px]">{_report.createdAt}</td>
              <td className="min-w-[120px]">
                <div className="flex justify-center items-center">
                  <Button
                    theme="secondary"
                    isSmall
                    name="download"
                    onClick={() => window?.open(_report.signedUrl, '_blank', 'noreferrer')}
                  >
                    <MdDownload className="text-[18px]" />
                  </Button>
                  {reportType === ReportTypeEnum.BANK_PROMOTION_REPORT || reportType === ReportTypeEnum.RECEIPT_TRANSACTION_REPORT ? (
                    <Fragment>
                      <div className="pl-2" />
                      <Button theme="info" isSmall name="recent" onClick={() => reSentEmail(_report._id)}>
                        <MdRecentActors className="text-[18px]" />
                      </Button>
                    </Fragment>
                  ) : null}
                  <div className="pl-2" />
                  <Button theme="danger" isSmall name="delete" onClick={() => deleteRequestReportId(_report._id)}>
                    <MdDelete className="text-[18px]" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr className="border-b border-gray-gainsboro">
            <td colSpan={5}>ไม่พบข้อมูล</td>
          </tr>
        )}
      </tbody>
    </table>

    <Pagination
      currentPage={page}
      totalCount={meta.totalData}
      pageSize={sizePage}
      onPageChange={handlePage}
      onPageSizeChange={handlePerPage}
    />
  </Fragment>
}

export default TableReport