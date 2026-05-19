const QUESTION_SETS = {
  de: [
    {
      id: 'isEuCitizen',
      question: 'Are you a citizen of an EU, EEA, or Swiss country?',
      hint: 'EU/EEA includes Germany, France, Spain, Italy, Poland, the Netherlands, and 20+ other countries, plus Norway, Iceland, and Liechtenstein.',
      type: 'radio',
      options: [
        { label: 'Yes — I hold an EU, EEA, or Swiss passport', value: true },
        { label: 'No — I hold a non-EU passport', value: false },
      ],
    },
    {
      id: 'hasLeftEu',
      question: 'Have you permanently left the EU, EEA, and Switzerland?',
      hint: 'EU/EEA citizens can only claim a German pension refund if they move outside the entire EU/EEA/Switzerland permanently — not just outside Germany.',
      type: 'radio',
      condition: (a) => a.isEuCitizen === true,
      options: [
        { label: 'Yes — I now live permanently outside the EU/EEA/Switzerland', value: true },
        { label: 'No — I still live within the EU/EEA/Switzerland', value: false },
      ],
    },
    {
      id: 'monthsWorked',
      question: 'How many months did you work in Germany?',
      hint: 'You must have worked fewer than 60 months (5 years) in Germany to be eligible for a refund. With 5+ years of contributions you receive a pension instead.',
      type: 'number',
      unit: 'months',
      placeholder: '24',
      min: 1,
      max: 120,
    },
    {
      id: 'leaveDate',
      question: 'When did you permanently leave Germany?',
      hint: 'German law requires a 24-month waiting period after leaving Germany before you can apply for a contribution refund.',
      type: 'monthYear',
    },
    {
      id: 'monthlyGrossSalary',
      question: 'What was your average monthly gross salary in Germany?',
      hint: 'Enter your gross monthly salary in Euros (before taxes and social contributions). This is used to estimate your total pension contributions.',
      type: 'number',
      unit: '€',
      placeholder: '3500',
      min: 100,
      max: 100000,
    },
  ],

  uk: [
    {
      id: 'hadWorkplacePension',
      question: 'Did you have a UK workplace or occupational pension?',
      hint: "Since 2012, UK employers must auto-enrol eligible employees into a pension. Common providers: NEST, The People's Pension, or a company scheme.",
      type: 'radio',
      options: [
        { label: 'Yes — I was enrolled in a workplace pension', value: true },
        { label: 'No — I did not have a workplace pension', value: false },
      ],
    },
    {
      id: 'monthsInPension',
      question: 'How many months were you a member of the pension scheme?',
      hint: 'A "short service refund" is available if you leave a defined contribution pension with fewer than 2 years (24 months) of membership.',
      type: 'number',
      unit: 'months',
      placeholder: '18',
      min: 1,
      max: 240,
      condition: (a) => a.hadWorkplacePension === true,
    },
    {
      id: 'hasLeftUk',
      question: 'Have you permanently left the UK, or are you a non-UK resident?',
      hint: 'Short service pension refunds are generally available to those who have left the UK or do not intend to remain permanently.',
      type: 'radio',
      options: [
        { label: 'Yes — I have left the UK or I am a non-UK resident', value: true },
        { label: 'No — I am still living in the UK', value: false },
      ],
    },
    {
      id: 'monthlyGrossSalary',
      question: 'What was your average monthly gross salary in the UK?',
      hint: 'Enter your gross monthly salary in British Pounds before any deductions. Used to estimate your auto-enrolment contributions.',
      type: 'number',
      unit: '£',
      placeholder: '2800',
      min: 100,
      max: 100000,
    },
  ],

  nl: [
    {
      id: 'hadOccupationalPension',
      question: 'Did you participate in an occupational pension scheme in the Netherlands?',
      hint: 'Most Dutch employers enrol staff in a sector pension fund (bedrijfstakpensioenfonds) or company pension scheme. This is separate from the state AOW pension.',
      type: 'radio',
      options: [
        { label: 'Yes — I had an employer pension scheme', value: true },
        { label: 'No — I only had the state AOW pension', value: false },
      ],
    },
    {
      id: 'monthsInPension',
      question: 'How many months were you a member of the Dutch pension scheme?',
      hint: 'If your pension scheme membership was under 12 months, a refund of your own contributions may be possible. Longer membership results in preserved pension rights.',
      type: 'number',
      unit: 'months',
      placeholder: '8',
      min: 1,
      max: 240,
      condition: (a) => a.hadOccupationalPension === true,
    },
    {
      id: 'monthsWorked',
      question: 'How many months in total did you work in the Netherlands?',
      hint: 'Include all months during which you paid Dutch social contributions (premies).',
      type: 'number',
      unit: 'months',
      placeholder: '18',
      min: 1,
      max: 120,
    },
    {
      id: 'monthlyGrossSalary',
      question: 'What was your average monthly gross salary in the Netherlands?',
      hint: 'Enter your gross monthly salary in Euros before tax and deductions.',
      type: 'number',
      unit: '€',
      placeholder: '3200',
      min: 100,
      max: 100000,
    },
  ],

  ch: [
    {
      id: 'isEuEftaCitizen',
      question: 'Are you a citizen of an EU or EFTA country?',
      hint: 'EFTA countries are Norway, Iceland, Liechtenstein, and Switzerland. This affects your eligibility for an AHV (1st pillar) refund due to bilateral social security agreements.',
      type: 'radio',
      options: [
        { label: 'Yes — I hold an EU or EFTA passport', value: true },
        { label: 'No — I hold a non-EU/non-EFTA passport', value: false },
      ],
    },
    {
      id: 'hasLeftEuEfta',
      question: 'Have you permanently left Switzerland AND the EU/EFTA area?',
      hint: 'Due to social security agreements, EU/EFTA citizens living within the EU/EFTA cannot claim an AHV refund. Leaving the EU/EFTA area permanently makes you eligible.',
      type: 'radio',
      condition: (a) => a.isEuEftaCitizen === true,
      options: [
        { label: 'Yes — I have permanently moved outside EU/EFTA', value: true },
        { label: 'No — I still live within the EU/EFTA area', value: false },
      ],
    },
    {
      id: 'monthsWorked',
      question: 'How many months did you work in Switzerland?',
      hint: 'Include all months during which you paid AHV/IV/EO contributions to Swiss social insurance.',
      type: 'number',
      unit: 'months',
      placeholder: '30',
      min: 1,
      max: 120,
    },
    {
      id: 'monthlyGrossSalary',
      question: 'What was your average monthly gross salary in Switzerland?',
      hint: 'Enter your gross monthly salary in Swiss Francs (CHF) before deductions. Used to estimate AHV contributions and Pillar 2 entitlements.',
      type: 'number',
      unit: 'CHF',
      placeholder: '6000',
      min: 100,
      max: 200000,
    },
    {
      id: 'hadPillar2',
      question: 'Did you have a Pillar 2 occupational pension (BVG) through your employer?',
      hint: 'All Swiss employees earning above CHF 22,050/year are automatically enrolled in Pillar 2 (BVG). Both you and your employer contributed. You can claim this as a lump sum when leaving Switzerland permanently.',
      type: 'radio',
      options: [
        { label: 'Yes — I had a Pillar 2 BVG pension', value: true },
        { label: "No — I earned below the threshold or I'm not sure", value: false },
      ],
    },
  ],
}

export function getQuestions(countryId, answers = {}) {
  const all = QUESTION_SETS[countryId] || []
  return all.filter((q) => !q.condition || q.condition(answers))
}
