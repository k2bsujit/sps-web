/**
 * Starting content, taken from the approved design.
 * - Used when Sanity is not connected yet (so the site always builds).
 * - Also used to create the first Sanity content (npm run make-seed → studio/seed/seed.ndjson).
 * After that, edit everything in the admin; this file is only a safety net.
 * Text in [square brackets] is a placeholder the business still needs to fill in.
 */

export const fallback = {
  settings: {
    businessName: 'SP Surya',
    tagline: 'Surya Se Shakti, Shakti Se Samriddhi',
    areasServed: ['Nilagiri', 'Balasore', 'Soro', 'Basta', 'Jaleswar', 'Oupada', 'Remuna', 'Bhadrak', 'Mayurbhanj'],
    vendorId: '',
    gstin: '',
    foundingYear: null as number | null,
    footerNote: 'Subsidy amounts are set by government schemes and may change.',
    phone: '+919853289304',
    phoneDisplay: '98532 89304',
    whatsapp: '919853289304',
    whatsappMessage: 'Hello SP Surya, I want to know about rooftop solar and subsidy.',
    email: '',
    streetAddress: "Nilgiri Women's College Road, Bypass Road",
    locality: 'Nilagiri',
    district: 'Balasore',
    state: 'Odisha',
    pincode: '756040',
    lat: null as number | null,
    lng: null as number | null,
    mapsUrl: '',
    hoursText: 'Mon–Sat · 9:30 am – 8:00 pm',
    opens: '09:30',
    closes: '20:00',
    openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    socials: [] as string[],
    logo: null as any,
    logoOnDark: null as any,
    seo: {
      title: 'Rooftop Solar in Balasore & Nilagiri | PM Surya Ghar Subsidy | SP Surya',
      description:
        'Rooftop solar for homes, shops and schools in Balasore, Bhadrak & Mayurbhanj. Get up to ₹1,38,000 subsidy — we handle survey, paperwork, installation and net meter. Free home survey.',
      ogImage: null as any,
      noindex: false,
    },
    googleVerification: '',
  },

  home: {
    heroBadge: 'PM Surya Ghar rooftop solar · Balasore, Bhadrak & Mayurbhanj',
    heroTitle: 'Your roof can earn',
    heroHighlight: '₹1,38,000',
    heroTitleEnd: 'in subsidy.',
    heroText:
      'Rooftop solar for homes, shops and schools across north Odisha. Survey, subsidy paperwork, installation, net meter and service, all handled by one local team from Nilagiri, Balasore.',
    heroImage: null as any,
    primaryCta: 'Book a free home survey',
    secondaryCta: 'Calculate my subsidy',
    stats: [
      {value: '₹1,38,000', label: 'Max subsidy on a 3 kW home', accent: true},
      {value: '90+', label: 'Roofs installed locally', accent: false},
      {value: '30 yrs', label: 'Panel performance warranty', accent: false},
      {value: '300–360', label: 'Units a month from 3 kW', accent: false},
    ],
    whyEyebrow: 'Why SP Surya',
    whyTitle: 'Built to last 25 years. Backed by people who pick up the phone.',
    whyItems: [
      {icon: 'pin', title: 'Local, not long-distance', text: 'Our office is on Bypass Road, Nilagiri, Balasore. Surveys and service visits happen in days, not weeks.'},
      {icon: 'doc', title: 'Subsidy, start to finish', text: 'Portal registration, DISCOM approval, net meter and inspection. We follow your file until the money lands.'},
      {icon: 'wind', title: 'Cyclone-ready structures', text: 'Galvanised steel on concrete footings, anchored for coastal Odisha winds, with neat concealed wiring.'},
      {icon: 'wrench', title: 'Service after the sale', text: 'Generation checks, panel cleaning and fault visits for the life of your system. [Add AMC terms.]'},
    ],
    compareTitle: 'Not all solar installations are the same.',
    compareThem: [
      'Leaves the subsidy paperwork to you',
      "Thin frames that aren't built for cyclones",
      'Hard to reach once the job is paid',
      'Verbal quotes and surprise extra charges',
    ],
    compareUs: [
      'We file and track your subsidy to your bank',
      'Galvanised structures on concrete footings',
      'Local office in Nilagiri, Balasore for service visits',
      'Written quote with no hidden charges',
    ],
    processTitle: 'From first call to subsidy in five steps.',
    processSteps: [
      {title: 'Free home survey', text: 'We check your roof, shade and last few electricity bills.'},
      {title: 'Written quote', text: 'Right system size, full price and subsidy on paper. No hidden charges.'},
      {title: 'Portal application', text: 'We register you on PM Surya Ghar and get DISCOM feasibility.'},
      {title: 'Installation', text: 'Footings, structure, panels, inverter and earthing in [1–2] days.'},
      {title: 'Net meter & subsidy', text: 'Inspection done, net meter fitted, subsidy credited to your bank.'},
    ],
    servicesTitle: 'One team for every kind of roof.',
    galleryTitle: "Roofs we've powered across north Odisha.",
    fact: {value: '60%', text: 'of solar homes in western Odisha now get a zero electricity bill.', source: 'Source: TPWODL, March 2026'},
    enquiryTitle: "Tell us about your home. We'll call you back today.",
    ctaTitle: 'Find out what your roof can earn. The survey is free.',
    seo: null as any,
  },

  subsidy: {
    rows: [
      {label: '1 kW', central: 30000, state: 25000, units: '≈ 100–120', isDefault: false},
      {label: '2 kW', central: 60000, state: 50000, units: '≈ 200–240', isDefault: false},
      {label: '3 kW & above', central: 78000, state: 60000, units: '≈ 300–360', isDefault: true},
    ],
    lastChecked: '',
    pageTitle: 'PM Surya Ghar subsidy in Odisha: how much you get and how to claim it',
    pageIntro:
      'Homes in Odisha can claim two rooftop solar subsidies: the central PM Surya Ghar: Muft Bijli Yojana subsidy and an extra top-up from the Government of Odisha. Here is how much you can get, who is eligible and how the process works.',
    body: null as any,
    seo: {
      title: 'PM Surya Ghar Subsidy in Odisha 2026 – Up to ₹1,38,000 | SP Surya',
      description:
        'Odisha homes get central + state rooftop solar subsidy: up to ₹1,38,000 on 3 kW. See the amount for 1, 2 and 3 kW, eligibility and steps. Free help from SP Surya, Balasore.',
    },
  },

  services: [
    {
      title: 'Home on-grid',
      slug: 'home-solar',
      summary: '1–10 kW with net metering and full subsidy support. Tata Power Solaroof and other leading brands.',
      priceText: 'From [₹ PRICE] after subsidy',
      image: null as any,
      features: ['Eligible for PM Surya Ghar + Odisha subsidy', 'Net meter: sell extra power to the grid', 'Cyclone-ready galvanised structure', 'We file all subsidy paperwork'],
      body: null as any,
      seo: {
        title: 'Home Rooftop Solar with Subsidy in Balasore | SP Surya',
        description: 'On-grid rooftop solar for homes in Balasore, Bhadrak & Mayurbhanj. 1–10 kW, net metering, PM Surya Ghar + Odisha subsidy handled for you.',
      },
    },
    {
      title: 'Hybrid & battery backup',
      slug: 'hybrid-battery-solar',
      summary: 'Keep lights and fans running through power cuts, or go fully off-grid on farms.',
      priceText: 'From [₹ PRICE]',
      image: null as any,
      features: ['Backup during power cuts', 'Lithium or tubular battery options', 'Works with or without the grid', 'Good for farms and remote homes'],
      body: null as any,
      seo: {
        title: 'Hybrid Solar with Battery Backup in Balasore | SP Surya',
        description: 'Solar with battery backup for homes, shops and farms in north Odisha. Keep power on during cuts. Free site survey from SP Surya.',
      },
    },
    {
      title: 'Commercial & institutional',
      slug: 'commercial-solar',
      summary: 'Shops, schools, hospitals, colleges and rice mills. Cut daytime bills where you use the most power.',
      priceText: 'Free site assessment',
      image: null as any,
      features: ['Sized from your bills and load', 'Fast payback on daytime use', 'Accelerated depreciation benefit for businesses', 'Monitoring and AMC'],
      body: null as any,
      seo: {
        title: 'Commercial Rooftop Solar for Shops, Schools & Mills | SP Surya',
        description: 'Rooftop solar for shops, schools, hospitals and rice mills in Balasore, Bhadrak & Mayurbhanj. Cut daytime power bills. Free site assessment.',
      },
    },
    {
      title: 'Service & AMC',
      slug: 'solar-service-amc',
      summary: 'Cleaning, generation audits and repairs, even for systems another company installed.',
      priceText: 'AMC from [₹ PRICE]/yr',
      image: null as any,
      features: ['Panel cleaning', 'Generation check against expected units', 'Inverter and wiring faults', 'Any brand, any installer'],
      body: null as any,
      seo: {
        title: 'Solar Panel Cleaning, Repair & AMC in Balasore | SP Surya',
        description: 'Solar panel cleaning, repair and annual maintenance in north Odisha — for any brand or installer. Book a service visit with SP Surya.',
      },
    },
  ],

  areas: [
    {name: 'Nilagiri', slug: 'nilagiri', district: 'Balasore', publishPage: false, intro: '', body: null as any, seo: null as any},
    {name: 'Balasore', slug: 'balasore', district: 'Balasore', publishPage: false, intro: '', body: null as any, seo: null as any},
    {name: 'Soro', slug: 'soro', district: 'Balasore', publishPage: false, intro: '', body: null as any, seo: null as any},
    {name: 'Basta', slug: 'basta', district: 'Balasore', publishPage: false, intro: '', body: null as any, seo: null as any},
    {name: 'Jaleswar', slug: 'jaleswar', district: 'Balasore', publishPage: false, intro: '', body: null as any, seo: null as any},
    {name: 'Oupada', slug: 'oupada', district: 'Balasore', publishPage: false, intro: '', body: null as any, seo: null as any},
    {name: 'Remuna', slug: 'remuna', district: 'Balasore', publishPage: false, intro: '', body: null as any, seo: null as any},
    {name: 'Bhadrak', slug: 'bhadrak', district: 'Bhadrak', publishPage: false, intro: '', body: null as any, seo: null as any},
    {name: 'Mayurbhanj', slug: 'mayurbhanj', district: 'Mayurbhanj', publishPage: false, intro: '', body: null as any, seo: null as any},
  ],

  projects: [] as any[],

  faqs: [
    {question: 'Who is eligible for the subsidy?', answer: 'A residential electricity connection in your name, a roof you own, and no earlier solar subsidy on that connection. We check this for free during the survey.', showOnHome: true},
    {question: 'How long until I get the subsidy?', answer: 'After installation, the DISCOM inspects and fits the net meter. The subsidy is then credited to your bank account. We track every step for you.', showOnHome: true},
    {question: 'Which size do I need?', answer: 'Each kilowatt makes roughly 100–120 units a month. Most families with a ₹1,500–₹3,000 monthly bill choose 2–3 kW. Share your bill on WhatsApp for a free sizing.', showOnHome: true},
    {question: 'Will it survive a cyclone?', answer: 'We mount panels on galvanised steel set in concrete footings and anchor every structure for coastal winds. [Add your wind-rating or structure warranty here.]', showOnHome: true},
    {question: 'Is EMI or a loan available?', answer: '[Add your bank or finance partner details here.]', showOnHome: true},
  ],

  testimonials: [] as any[],
  posts: [] as any[],
}

export type SiteData = typeof fallback
