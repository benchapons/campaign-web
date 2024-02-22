import { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';

import { HTTPDataType } from '@/types/global.type';
import {
  VERSION_1,
  REPORT,
  RECEIPT_TRANSACTION_REPORT,
  API_REPORT_RECEIPT_TRANSACTION_REPORT,
} from '@/constants/bff-url';
import middleware from '../auth/middleware';
import { AuthorizedUserType } from '@/types/auth.type';
import { CreateLogType } from '@/types/auditlog.type';
import { AUDIT_LOG_EVENTS, OWNER_ID_REPORT } from '@/constants/auditlog';
import { createLog } from '@/services/server/auditlog.service';
import { formatDateFileNameReport, formatDateShotEng } from '@/utilities/format';
import { ReceiptTxnReportResponseInterface } from '@/types/report-campaign.interface';
import { encodeBase64, generatePassword } from '@/utilities/encrypt';
import { sendEmail } from '@/utilities/email';
import EmailBank from '@/emails/EmailBank';
import permissionGuard from '../auth/permissionGuard';
import { Permission } from '@/constants/auth';
import ReportService from '@/services/server/report-service.service';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
};

const receiptTransactionReport = (
  req: NextApiRequest,
  res: NextApiResponse<any>,
  authorizedUser: AuthorizedUserType
) => {
  if (req.method === 'GET') {
    const options: HTTPDataType = {
      pathService: `/${VERSION_1}/${API_REPORT_RECEIPT_TRANSACTION_REPORT}`,
      params: req.query,
    };
    permissionGuard([Permission.RPT_REDEMP_05], authorizedUser.userPage, res);
    ReportService.get({ ...options })
      .then(async (response) => {
        // const password = generatePassword();
        // const credentialExcelForDecrypt = encodeBase64(password);
        // const result = response?.length
        //   ? response?.map((report: ReceiptTxnReportResponseInterface) => {
        //       const redemptionDate = report?.receiptDateString ? formatDateShotEng(report?.receiptDateString) : '-';
        //       return {
        //         ...report,
        //         receiptDate: redemptionDate,
        //       };
        //     })
        //   : [];
        // const reportName = formatDateFileNameReport('Receipt_transaction_report');
        // await sendEmail({
        //   to: authorizedUser?.mail,
        //   subject: `รหัสผ่านสำหรับเปิดไฟล์ ${reportName}`,
        //   html: render(EmailBank({ validationCode: password, reportName })),
        // });
        // try {
        //   const auditLog: CreateLogType = {
        //     event: AUDIT_LOG_EVENTS.RPT_EXTRACT_05,
        //     detailMessage: `Receipt Transaction Report`,
        //     from: JSON.stringify(req.query),
        //     to: JSON.stringify({ result: result?.length }),
        //     createBy: authorizedUser?.displayName,
        //     ownerId: OWNER_ID_REPORT.REPORT_05,
        //   };
        //   createLog(auditLog);
        // } catch (error) {
        //   console.error(error);
        // }
        // res.status(200).json({ success: true, credentialExcelForDecrypt, data: result });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json(error);
      });
  }
};

export default middleware(receiptTransactionReport);
