export function calculateEligibility(countryId, answers) {
  switch (countryId) {
    case 'de': return assessGermany(answers)
    case 'uk': return assessUK(answers)
    case 'nl': return assessNetherlands(answers)
    case 'ch': return assessSwitzerland(answers)
    default: return null
  }
}

function fmt(symbol, amount) {
  return `${symbol}${Math.round(amount).toLocaleString('en-GB')}`
}

function monthsSince(year, month) {
  const now = new Date()
  const then = new Date(year, month - 1, 1)
  return Math.max(0, (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth()))
}

// ─── Germany ────────────────────────────────────────────────────────────────

function assessGermany(a) {
  const { isEuCitizen, hasLeftEu, monthsWorked, leaveDate, monthlyGrossSalary } = a
  const elapsed = leaveDate ? monthsSince(leaveDate.year, leaveDate.month) : 0
  const remaining = Math.max(0, 24 - elapsed)
  const symbol = '€'

  const criteria = []
  let eligible = true

  // Citizenship / residence
  if (isEuCitizen && !hasLeftEu) {
    eligible = false
    criteria.push({ met: false, text: 'Must permanently leave EU/EEA/Switzerland (required for EU/EEA citizens)' })
  } else {
    criteria.push({
      met: true,
      text: isEuCitizen
        ? 'Permanently left EU/EEA area ✓'
        : 'Non-EU/EEA citizen — meets the primary eligibility criterion ✓',
    })
  }

  // Duration
  if (monthsWorked >= 60) {
    eligible = false
    criteria.push({ met: false, text: `Worked ${monthsWorked} months — must be under 60 months (5 years)` })
  } else {
    criteria.push({ met: true, text: `Worked ${monthsWorked} months in Germany (under 60-month limit) ✓` })
  }

  // Waiting period
  if (elapsed < 24) {
    eligible = false
    criteria.push({
      met: false,
      text: `Waiting period: ${elapsed} of 24 required months have passed (${remaining} months to go)`,
    })
  } else {
    criteria.push({ met: true, text: `24-month waiting period met (${elapsed} months since leaving) ✓` })
  }

  const totalEarnings = monthlyGrossSalary * monthsWorked
  const refundRate = 0.093
  const estimatedRefund = eligible ? totalEarnings * refundRate : 0

  return {
    eligible,
    currency: 'EUR',
    symbol,
    estimatedRefund,
    headline: eligible
      ? 'You are likely eligible for a German pension refund.'
      : 'You do not currently meet all criteria for a German pension refund.',
    criteria,
    calculation: eligible
      ? [
          { label: 'Monthly gross salary', value: fmt(symbol, monthlyGrossSalary) },
          { label: 'Months worked', value: `${monthsWorked}` },
          { label: 'Total gross earnings', value: fmt(symbol, totalEarnings) },
          { label: 'Employee contribution rate', value: '9.3%' },
          { label: 'Estimated refund', value: fmt(symbol, estimatedRefund) },
        ]
      : [],
    nextSteps: eligible
      ? [
          'Request your pension account statement (Rentenauskunft) from Deutsche Rentenversicherung',
          'Complete application form V0901 (Antrag auf Beitragserstattung)',
          'Provide proof of your current address abroad and valid ID',
          'Submit your application to: Deutsche Rentenversicherung Bund, 10704 Berlin, Germany',
          'Processing typically takes 3–6 months',
        ]
      : [],
    legalNote: 'Based on § 210 SGB VI (Sozialgesetzbuch Sechstes Buch). The 24-month waiting period is defined in § 210 Abs. 2 SGB VI.',
    disclaimer:
      'This estimate is based on the standard 9.3% employee contribution rate. Your actual refund is calculated by Deutsche Rentenversicherung from your official contribution history. Employer contributions (also 9.3%) are not refunded.',
  }
}

// ─── United Kingdom ──────────────────────────────────────────────────────────

function assessUK(a) {
  const { hadWorkplacePension, monthsInPension, hasLeftUk, monthlyGrossSalary } = a
  const symbol = '£'

  const criteria = []
  let eligible = true

  if (!hadWorkplacePension) {
    eligible = false
    criteria.push({ met: false, text: 'No UK workplace pension — no contributions available to refund' })
    return buildResult(eligible, 'GBP', symbol, 0, criteria, [], [], '', '')
  }

  criteria.push({ met: true, text: 'Had a UK workplace pension ✓' })

  if (monthsInPension >= 24) {
    eligible = false
    criteria.push({
      met: false,
      text: `Scheme membership was ${monthsInPension} months — short service refund requires under 24 months`,
    })
  } else {
    criteria.push({ met: true, text: `Scheme membership of ${monthsInPension} months qualifies for a short service refund ✓` })
  }

  if (!hasLeftUk) {
    eligible = false
    criteria.push({ met: false, text: 'Must be a non-UK resident or have permanently left the UK' })
  } else {
    criteria.push({ met: true, text: 'Non-UK resident ✓' })
  }

  const employeeRate = 0.05
  const taxRate = 0.20
  const grossContributions = monthlyGrossSalary * (monthsInPension || 0) * employeeRate
  const estimatedRefund = eligible ? grossContributions * (1 - taxRate) : 0

  const calculation = eligible
    ? [
        { label: 'Monthly gross salary', value: fmt(symbol, monthlyGrossSalary) },
        { label: 'Months in pension scheme', value: `${monthsInPension}` },
        { label: 'Employee contributions (5% min.)', value: fmt(symbol, grossContributions) },
        { label: 'Income tax deduction (20%)', value: `− ${fmt(symbol, grossContributions * taxRate)}` },
        { label: 'Estimated net refund', value: fmt(symbol, estimatedRefund) },
      ]
    : []

  const nextSteps = eligible
    ? [
        'Contact your former pension scheme provider or your previous UK employer\'s HR department',
        'Request a "short service refund" application form',
        'Provide your National Insurance number and proof of non-UK residency',
        'A 20% income tax deduction is applied automatically to the refund',
        'Processing typically takes 1–3 months',
      ]
    : []

  return {
    eligible,
    currency: 'GBP',
    symbol,
    estimatedRefund,
    headline: eligible
      ? 'You are likely eligible for a UK short service pension refund.'
      : 'You do not currently qualify for a UK workplace pension refund.',
    criteria,
    calculation,
    nextSteps,
    legalNote: 'Based on the UK Pensions Act 2014 and Occupational Pension Schemes (Short Service Benefits) Regulations 1992.',
    disclaimer:
      'Estimated using the 5% minimum auto-enrolment employee contribution rate. Your actual rate may be higher. The refund is subject to a 20% income tax deduction at source.',
  }
}

// ─── Netherlands ────────────────────────────────────────────────────────────

function assessNetherlands(a) {
  const { hadOccupationalPension, monthsInPension, monthsWorked, monthlyGrossSalary } = a
  const symbol = '€'

  const criteria = []
  let eligible = true
  let preservedRights = false

  if (!hadOccupationalPension) {
    eligible = false
    criteria.push({
      met: false,
      text: 'No Dutch occupational pension — state AOW contributions cannot be directly refunded',
    })
    return buildResult(eligible, 'EUR', symbol, 0, criteria, [], [], '', '')
  }

  criteria.push({ met: true, text: 'Had a Dutch occupational pension scheme ✓' })

  if ((monthsInPension || 0) >= 12) {
    eligible = false
    preservedRights = true
    criteria.push({
      met: false,
      text: `Scheme membership of ${monthsInPension} months — refund only possible under 12 months; your rights are preserved instead`,
    })
  } else {
    criteria.push({ met: true, text: `Short membership of ${monthsInPension} months — refund of own contributions possible ✓` })
  }

  const employeeRate = 0.05
  const estimatedRefund = eligible ? monthlyGrossSalary * (monthsInPension || 0) * employeeRate : 0

  const calculation = eligible
    ? [
        { label: 'Monthly gross salary', value: fmt(symbol, monthlyGrossSalary) },
        { label: 'Months in pension scheme', value: `${monthsInPension}` },
        { label: 'Approx. employee contribution (5%)', value: fmt(symbol, estimatedRefund) },
        { label: 'Estimated refund', value: fmt(symbol, estimatedRefund) },
      ]
    : []

  const nextSteps = eligible
    ? [
        'Contact your Dutch pension fund (pensioenfonds) directly — find them via mijnpensioenoverzicht.nl',
        'Request a "restitutie eigen bijdrage" (refund of own contributions)',
        'Provide your BSN (Dutch social security number) and proof of departure from the Netherlands',
        'Processing typically takes 2–4 months',
      ]
    : preservedRights
    ? [
        'Your Dutch pension rights are preserved — you will receive a pension payment when you reach Dutch pension age (AOW leeftijd)',
        'Check your accrued rights at mijnpensioenoverzicht.nl using your DigiD',
        'Consider a value transfer (waardeoverdracht) to a pension scheme in your new country',
        'Consult a pension adviser for options around early or partial withdrawal',
      ]
    : []

  return {
    eligible,
    preservedRights,
    currency: 'EUR',
    symbol,
    estimatedRefund,
    headline: eligible
      ? 'You may be eligible for a small refund of your Dutch pension contributions.'
      : preservedRights
      ? 'A direct refund is not available, but you have preserved Dutch pension rights.'
      : 'You do not qualify for a Dutch pension contribution refund.',
    criteria,
    calculation,
    nextSteps,
    legalNote: 'Based on the Dutch Pension Act (Pensioenwet). Short-term members with under 12 months accrual may receive a refund of own contributions at the pension fund\'s discretion.',
    disclaimer:
      'The 5% employee contribution is an approximation — actual rates vary by sector and pension fund (typically 3–8%). Contact your specific pension fund for the exact amount.',
  }
}

// ─── Switzerland ────────────────────────────────────────────────────────────

function assessSwitzerland(a) {
  const { isEuEftaCitizen, hasLeftEuEfta, monthsWorked, monthlyGrossSalary, hadPillar2 } = a
  const symbol = 'CHF '

  const criteria = []
  let ahvEligible = true
  let bvgEligible = hadPillar2 === true

  // AHV eligibility
  if (isEuEftaCitizen && !hasLeftEuEfta) {
    ahvEligible = false
    criteria.push({
      met: false,
      text: 'AHV refund not available — EU/EFTA citizens must leave the EU/EFTA area permanently',
    })
  } else {
    criteria.push({
      met: true,
      text: isEuEftaCitizen
        ? 'Permanently left EU/EFTA area — AHV refund eligible ✓'
        : 'Non-EU/EFTA citizen — AHV refund eligible ✓',
    })
  }

  if (hadPillar2) {
    criteria.push({ met: true, text: 'Had a Pillar 2 (BVG) pension — full lump sum payout eligible ✓' })
  } else {
    criteria.push({ met: false, text: 'No Pillar 2 pension — only AHV refund applies' })
  }

  const eligible = ahvEligible || bvgEligible

  // AHV: employee share is 4.35% of gross salary
  const ahvRate = 0.0435
  const ahvRefund = ahvEligible ? monthlyGrossSalary * monthsWorked * ahvRate : 0

  // Pillar 2 (BVG): approximate employee contribution
  // Coordination deduction 2024: CHF 25,725/year = CHF 2,144/month
  const coordinationDeduction = 2144
  const coordinatedSalary = Math.max(0, monthlyGrossSalary - coordinationDeduction)
  const bvgRate = 0.07
  const bvgRefund = bvgEligible ? coordinatedSalary * monthsWorked * bvgRate * 2 : 0

  const estimatedRefund = eligible ? ahvRefund + bvgRefund : 0

  const calculation = eligible
    ? [
        ...(ahvEligible
          ? [
              { label: 'Monthly gross salary', value: fmt(symbol, monthlyGrossSalary) },
              { label: 'Months worked', value: `${monthsWorked}` },
              { label: 'AHV employee rate (4.35%)', value: fmt(symbol, ahvRefund) },
            ]
          : [{ label: 'AHV refund', value: 'Not eligible' }]),
        ...(bvgEligible
          ? [
              { label: 'Coordinated BVG salary/month', value: fmt(symbol, coordinatedSalary) },
              {
                label: 'Pillar 2 lump sum (employer + employee ~14%)',
                value: fmt(symbol, bvgRefund),
              },
            ]
          : []),
        { label: 'Total estimated refund', value: fmt(symbol, estimatedRefund) },
      ]
    : []

  const nextSteps = eligible
    ? [
        'Locate your Freizügigkeitskonto (vested benefits account) — check with your last Swiss pension fund',
        'Submit a withdrawal request to your Freizügigkeitseinrichtung (vested benefits institution)',
        'For AHV: request form AHV-285.D from the Swiss Compensation Office (SVA)',
        'Provide proof of permanent departure from Switzerland (and EU/EFTA if applicable)',
        'Processing typically takes 3–6 months; funds are paid to your foreign bank account',
      ]
    : []

  return {
    eligible,
    currency: 'CHF',
    symbol,
    estimatedRefund,
    headline: eligible
      ? `You are likely eligible for a Swiss pension refund${ahvEligible && bvgEligible ? ' (AHV + Pillar 2)' : ahvEligible ? ' (AHV)' : ' (Pillar 2)'}. `
      : 'You do not currently qualify for a Swiss pension refund.',
    criteria,
    calculation,
    nextSteps,
    legalNote: 'AHV refunds: Art. 18 AHVG. Pillar 2 lump-sum withdrawal: Art. 25f FZG (Freizügigkeitsgesetz). Non-EU/EFTA nationals may withdraw BVG vested benefits immediately upon leaving Switzerland.',
    disclaimer:
      'AHV estimate uses the 4.35% employee rate. Pillar 2 estimate uses ~14% combined employer + employee contributions on the coordinated salary (above CHF 25,725/year threshold). Your actual Pillar 2 balance depends on your pension fund and investment performance.',
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildResult(eligible, currency, symbol, estimatedRefund, criteria, calculation, nextSteps, legalNote, disclaimer) {
  return {
    eligible,
    currency,
    symbol,
    estimatedRefund,
    headline: eligible ? 'You may be eligible.' : 'You do not currently qualify.',
    criteria,
    calculation,
    nextSteps,
    legalNote,
    disclaimer,
  }
}
