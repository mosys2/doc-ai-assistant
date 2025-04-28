export type TemplateGenerator = (input: any) => string;

export interface TemplateConfig {
  requiredFields: string[];
  generate: TemplateGenerator;
}

export const templates: { [key: string]: TemplateConfig } = {
  legalPetition: {
    requiredFields: [
      'plaintiffName',
      'defendantName',
      'subject',
      'eventDescription',
      'evidence',
      'legalRequest',
    ],
    generate: (data) => `
شما یک وکیل رسمی دادگستری در ایران هستید.
بر اساس اطلاعات زیر، یک لایحه دفاعیه رسمی به زبان فارسی و با رعایت عرف قضایی ایران بنویسید:

- نام شاکی: ${data.plaintiffName}
- نام خوانده: ${data.defendantName}
- موضوع شکایت: ${data.subject}
- شرح ماوقع: ${data.eventDescription}
- دلایل و مستندات: ${data.evidence}
- درخواست حقوقی: ${data.legalRequest}

نکات:
- لحن رسمی باشد.
- ساختار مقدمه، شرح دعوی، دلایل و نتیجه رعایت شود.
    `
  },
  rentalContract: {
    requiredFields: [
      'lessorName',
      'lesseeName',
      'propertyAddress',
      'rentalAmount',
      'duration',
    ],
    generate: (data) => `
شما یک مشاور حقوقی متخصص قراردادهای اجاره در ایران هستید.
بر اساس اطلاعات زیر، یک قرارداد اجاره رسمی تنظیم کنید:

- نام موجر: ${data.lessorName}
- نام مستأجر: ${data.lesseeName}
- آدرس ملک: ${data.propertyAddress}
- مبلغ اجاره: ${data.rentalAmount}
- مدت اجاره: ${data.duration}

لطفاً قرارداد را با لحن رسمی، شامل شرایط فسخ، تضامین و تعهدات طرفین بنویسید.
    `
  },
};
