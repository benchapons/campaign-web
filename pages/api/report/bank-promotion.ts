import { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';

import { HTTPDataType } from '@/types/global.type';
import { VERSION_1, API_REPORT_BANK_PROMOTION } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import permissionGuard from '../auth/permissionGuard';
import { Permission } from '@/constants/auth';
import { AuthorizedUserType } from '@/types/auth.type';
import { convertBuilding, convertPaymentMethod } from '@/utilities/global';
import { AUDIT_LOG_EVENTS, OWNER_ID_REPORT } from '@/constants/auditlog';
import { CreateLogType } from '@/types/auditlog.type';
import { createLog } from '@/services/server/auditlog.service';
import { buildingWithComma } from '@/dto/global.dto';
import { sendEmail } from '@/utilities/email';
import EmailBank from '@/emails/EmailBank';
import { encodeBase64, generatePassword } from '@/utilities/encrypt';
import { formatDateEng, formatDateFileNameReport, formatDateTime } from '@/utilities/format';

import ReportService from '@/services/server/report-service.service';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
};

const bankPromotion = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  if (req.method === 'GET') {
    const options: HTTPDataType = {
      pathService: `/${VERSION_1}/${API_REPORT_BANK_PROMOTION}`,
      params: req.query,
    };
    permissionGuard([Permission.RPT_REDEMP_03], authorizedUser.userPage, res);
    ReportService.get({ ...options })
      .then(async (response) => {
        // const password = generatePassword();
        // const encrypt = encodeBase64(password);
        // const result = response?.length
        //   ? response?.map((report: any) => {
        //       return {
        //         ...report,
        //         building: Array.isArray(report?.buildings)
        //           ? buildingWithComma(report?.buildings)
        //           : convertBuilding(report?.buildings),
        //         paymentMethod: convertPaymentMethod(report?.paymentMethod),
        //         redemptionDate: formatDateTime(report?.redemptionDate),
        //         receiptDate: formatDateEng(report?.receiptDate),
        //       };
        //     })
        //   : [];
        // const reportName = formatDateFileNameReport('Bank_Promotion');
        // await sendEmail({
        //   to: authorizedUser?.mail,
        //   subject: `รหัสผ่านสำหรับเปิดไฟล์ ${reportName}`,
        //   html: render(EmailBank({ validationCode: password, reportName })),
        // });
        // try {
        //   const auditLog: CreateLogType = {
        //     event: AUDIT_LOG_EVENTS.RPT_EXTRACT_03,
        //     detailMessage: 'Bank Promotion',
        //     from: JSON.stringify(req.query),
        //     to: JSON.stringify({ result: result?.length }),
        //     createBy: authorizedUser?.displayName,
        //     ownerId: OWNER_ID_REPORT.REPORT_03,
        //   };
        //   createLog(auditLog);
        // } catch (error) {
        //   console.error(error);
        // }
        // res.status(200).json({ success: true, data: result, bankCode: encrypt });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json(error);
      });
  }
};

export default middleware(bankPromotion);
