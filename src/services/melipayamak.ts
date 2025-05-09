import axios from 'axios';

export async function sendOtpSms(to: string, code: string) {
  const username = process.env.MELIPAYAMAK_USERNAME;
  const password = process.env.MELIPAYAMAK_PASSWORD;
  const bodyId = process.env.MELIPAYAMAK_OTP_PATTERN;

  try {
    console.log(username,
      password,
      code,
      to,
      bodyId)
    const response = await axios.post('https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber', {
      username,
      password,
      text: code,
      to,
      bodyId,
    });

    console.log('پاسخ از ملی پیامک:', response.data);
  } catch (error) {
    console.error('خطا در ارسال پیامک:', error);
  }
}
