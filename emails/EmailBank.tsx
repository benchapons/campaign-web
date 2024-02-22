import { Body, Container, Head, Html, Text } from '@react-email/components';
import * as React from 'react';

interface LinearLoginCodeEmailProps {
  validationCode?: string;
  reportName: string;
}

// const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

export const EmailBank = ({ validationCode = 'tt226-5398x', reportName }: LinearLoginCodeEmailProps) => (
  <Html>
    <Head />
    {/* <Preview>Your login code for Linear</Preview> */}
    <Body style={main}>
      <Container style={container}>
        {/* <Img src={`${baseUrl}/static/linear-logo.png`} width="42" height="42" alt="Linear" style={logo} /> */}
        {/* <Heading style={heading}>Your login code for Linear</Heading> */}
        <Text style={paragraph}>
          รหัสผ่านสำหรับเปิดไฟล์ <strong style={strong}>{reportName}</strong>
        </Text>

        <code style={code}>{validationCode}</code>

        <Text style={paragraph}>กรุณาใช้รหัสผ่านนี้เพื่อเปิดไฟล์</Text>
        <Text style={paragraph}>Email นี้เป็นการแจ้งจากระบบอัตโนมัติ</Text>
        <Text style={paragraph}>กรุณาอย่าตอบกลับ</Text>
      </Container>
    </Body>
  </Html>
);

export default EmailBank;

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
};

const strong = {
  padding: '0 4px',
};

// const heading = {
//   fontSize: '18px',
//   letterSpacing: '-0.5px',
//   lineHeight: '1.3',
//   fontWeight: '500',
//   color: '#484848',
//   padding: '17px 0 0',
// };

const paragraph = {
  display: 'flex',
  margin: '0 0 15px',
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const code = {
  fontFamily: 'monospace',
  fontWeight: '700',
  padding: '1px 4px',
  backgroundColor: '#dfe1e4',
  letterSpacing: '-0.3px',
  fontSize: '21px',
  borderRadius: '4px',
  color: '#3c4149',
};
