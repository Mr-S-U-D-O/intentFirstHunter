export interface NicheData {
  slug: string;
  industry: string;
  nichePersona: string;
  platform: 'Reddit' | 'StackOverflow';
  painPoint: string;
  actionWord: string; // e.g., "finding", "intercepting", "discovering"
  exampleLeadUser: string;
  exampleLeadPost: string;
  exampleLeadContext: string;
  pricingContext: string;
}

export const pseoData: NicheData[] = [
  // --- 1. Specialized Marketing, PR, and Design Agencies ---
  {
    slug: 'marketing-agencies-for-founders-on-reddit',
    industry: 'Specialized Marketing & PR',
    nichePersona: 'Founders',
    platform: 'Reddit',
    painPoint: 'terrible ROAS and unreliable growth partners',
    actionWord: 'intercepting',
    exampleLeadUser: 'SaaS_Founder_Stuck',
    exampleLeadPost: "Our current PR agency just burns cash. Does anyone know a specialized team that actually understands B2B tech?",
    exampleLeadContext: "posted in r/SaaS",
    pricingContext: "high-value retainers"
  },
  {
    slug: 'marketing-agencies-for-cmos-on-reddit',
    industry: 'Specialized Marketing & PR',
    nichePersona: 'CMOs',
    platform: 'Reddit',
    painPoint: 'terrible ROAS and unreliable growth partners',
    actionWord: 'intercepting',
    exampleLeadUser: 'SaaS_CMO_Stuck',
    exampleLeadPost: "Our current PR agency just burns cash. Does anyone know a specialized team that actually understands B2B tech?",
    exampleLeadContext: "posted in r/marketing",
    pricingContext: "high-value retainers"
  },
  {
    slug: 'design-agencies-on-stackoverflow',
    industry: 'UI/UX Design',
    nichePersona: 'Technical Founders',
    platform: 'StackOverflow',
    painPoint: 'terrible user experience holding back their technical products',
    actionWord: 'discovering',
    exampleLeadUser: 'DevOps_Dave',
    exampleLeadPost: "Our backend is solid, but the frontend UX is confusing users. Looking for best practices or specialized UI experts.",
    exampleLeadContext: "asked in UX/UI Design",
    pricingContext: "specialized design projects"
  },

  // --- 2. Software companies with high standard retainers (Enterprise/B2B Tech) ---
  {
    slug: 'enterprise-software-for-ctos-on-reddit',
    industry: 'Enterprise Software',
    nichePersona: 'CTOs',
    platform: 'Reddit',
    painPoint: 'outdated legacy systems and scaling bottlenecks',
    actionWord: 'intercepting',
    exampleLeadUser: 'Scaling_CTO',
    exampleLeadPost: "We're outgrowing our current CRM workflow. Need an enterprise-grade solution that won't take 12 months to deploy.",
    exampleLeadContext: "posted in r/EnterpriseTech",
    pricingContext: "high-standard software retainers"
  },
  {
    slug: 'enterprise-software-for-operations-directors-on-reddit',
    industry: 'Enterprise Software',
    nichePersona: 'Operations Directors',
    platform: 'Reddit',
    painPoint: 'outdated legacy systems and scaling bottlenecks',
    actionWord: 'intercepting',
    exampleLeadUser: 'Scaling_Ops_Director',
    exampleLeadPost: "We're outgrowing our current CRM workflow. Need an enterprise-grade solution that won't take 12 months to deploy.",
    exampleLeadContext: "posted in r/EnterpriseTech",
    pricingContext: "high-standard software retainers"
  },
  {
    slug: 'saas-infrastructure-for-lead-engineers-on-stackoverflow',
    industry: 'SaaS Infrastructure',
    nichePersona: 'Lead Engineers',
    platform: 'StackOverflow',
    painPoint: 'critical server downtime and architecture migration failures',
    actionWord: 'identifying',
    exampleLeadUser: 'Lead_Eng_Panic',
    exampleLeadPost: "AWS migration keeps timing out on large database chunks. Does anyone specialize in zero-downtime MongoDB migrations?",
    exampleLeadContext: "asked in Database Scaling",
    pricingContext: "premium technical retainers"
  },
  {
    slug: 'saas-infrastructure-for-architects-on-stackoverflow',
    industry: 'SaaS Infrastructure',
    nichePersona: 'Architects',
    platform: 'StackOverflow',
    painPoint: 'critical server downtime and architecture migration failures',
    actionWord: 'identifying',
    exampleLeadUser: 'SysAdmin_Panic',
    exampleLeadPost: "AWS migration keeps timing out on large database chunks. Does anyone specialize in zero-downtime MongoDB migrations?",
    exampleLeadContext: "asked in Database Scaling",
    pricingContext: "premium technical retainers"
  },

  // --- 3. High-end boutique recruitment ---
  {
    slug: 'boutique-recruitment-for-hiring-managers-on-reddit',
    industry: 'Boutique Recruitment',
    nichePersona: 'Hiring Managers',
    platform: 'Reddit',
    painPoint: 'wasting months on unqualified candidates in generic talent pools',
    actionWord: 'locating',
    exampleLeadUser: 'DesperateForDevs',
    exampleLeadPost: "We've been looking for a Senior Rust Developer for 6 months. LinkedIn is useless right now. Any elite recruitment firms out there?",
    exampleLeadContext: "posted in r/recruiting",
    pricingContext: "high-end placement fees"
  },
  {
    slug: 'boutique-recruitment-for-founders-on-reddit',
    industry: 'Boutique Recruitment',
    nichePersona: 'Founders',
    platform: 'Reddit',
    painPoint: 'wasting months on unqualified candidates in generic talent pools',
    actionWord: 'locating',
    exampleLeadUser: 'DesperateFounderForDevs',
    exampleLeadPost: "We've been looking for a Senior Rust Developer for 6 months. LinkedIn is useless right now. Any elite recruitment firms out there?",
    exampleLeadContext: "posted in r/rust",
    pricingContext: "high-end placement fees"
  },
  {
    slug: 'specialized-hiring-on-stackoverflow',
    industry: 'Technical Recruitment',
    nichePersona: 'Engineering Directors',
    platform: 'StackOverflow',
    painPoint: 'finding highly specialized engineering talent',
    actionWord: 'spotting',
    exampleLeadUser: 'Eng_Director_01',
    exampleLeadPost: "Trying to build a team for low-latency trading systems in C++. The talent pool seems incredibly small.",
    exampleLeadContext: "discussed in C++ Architecture",
    pricingContext: "specialized talent acquisition"
  },

  // --- 4. Specialized legal/financial advisors ---
  {
    slug: 'financial-advisors-for-hnwi-on-reddit',
    industry: 'Specialized Finance',
    nichePersona: 'High-Net-Worth Individuals',
    platform: 'Reddit',
    painPoint: 'complex tax implications after funding rounds or exits',
    actionWord: 'finding',
    exampleLeadUser: 'Tech_Exit_Throwaway',
    exampleLeadPost: "Just sold my startup. Our current accountant is out of their depth. Need a specialized financial advisor who understands tech exits.",
    exampleLeadContext: "posted in r/fatFIRE",
    pricingContext: "premium advisory retainers"
  },
  {
    slug: 'financial-advisors-for-startup-founders-on-reddit',
    industry: 'Specialized Finance',
    nichePersona: 'Startup Founders',
    platform: 'Reddit',
    painPoint: 'complex tax implications after funding rounds or exits',
    actionWord: 'finding',
    exampleLeadUser: 'SeriesA_Founder',
    exampleLeadPost: "Just closed our Series A. Our current accountant is out of their depth. Need a specialized financial advisor who understands SaaS metrics.",
    exampleLeadContext: "posted in r/startups",
    pricingContext: "premium advisory retainers"
  },
  {
    slug: 'legal-tech-advisors-for-tech-founders-on-stackoverflow',
    industry: 'Tech Law & Compliance',
    nichePersona: 'Tech Founders',
    platform: 'StackOverflow',
    painPoint: 'navigating complex compliance (GDPR/SOC2) during app development',
    actionWord: 'intercepting',
    exampleLeadUser: 'Tech_Founder_Dev',
    exampleLeadPost: "How do we structure our Postgres database to ensure strict GDPR compliance for EU users? Most lawyers don't understand the tech stack.",
    exampleLeadContext: "asked in Data Compliance",
    pricingContext: "specialized legal consulting"
  },
  {
    slug: 'legal-tech-advisors-for-data-officers-on-stackoverflow',
    industry: 'Tech Law & Compliance',
    nichePersona: 'Data Officers',
    platform: 'StackOverflow',
    painPoint: 'navigating complex compliance (GDPR/SOC2) during app development',
    actionWord: 'intercepting',
    exampleLeadUser: 'Data_Privacy_Dev',
    exampleLeadPost: "How do we structure our Postgres database to ensure strict GDPR compliance for EU users? Most lawyers don't understand the tech stack.",
    exampleLeadContext: "asked in Data Compliance",
    pricingContext: "specialized legal consulting"
  },

  // --- 5. Digital real estate firms ---
  {
    slug: 'digital-real-estate-for-portfolio-investors-on-reddit',
    industry: 'Digital Real Estate',
    nichePersona: 'Portfolio Investors',
    platform: 'Reddit',
    painPoint: 'finding profitable digital assets and vetted SaaS acquisitions',
    actionWord: 'identifying',
    exampleLeadUser: 'Acquisition_Hungry',
    exampleLeadPost: "Looking to acquire a profitable Micro-SaaS in the $50k-$100k ARR range. Where are the good brokers hiding?",
    exampleLeadContext: "posted in r/SaaS",
    pricingContext: "high-value digital acquisitions"
  },
  {
    slug: 'digital-real-estate-for-ecom-owners-on-reddit',
    industry: 'Digital Real Estate',
    nichePersona: 'E-Com Owners',
    platform: 'Reddit',
    painPoint: 'finding profitable digital assets and vetted eCommerce acquisitions',
    actionWord: 'identifying',
    exampleLeadUser: 'Ecm_Exit_Hunt',
    exampleLeadPost: "Looking to acquire a profitable store in the $50k-$100k ARR range. Where are the good brokers hiding?",
    exampleLeadContext: "posted in r/Entrepreneur",
    pricingContext: "high-value digital acquisitions"
  },
  {
    slug: 'proptech-on-stackoverflow',
    industry: 'PropTech Infrastructure',
    nichePersona: 'Real Estate Data Engineers',
    platform: 'StackOverflow',
    painPoint: 'aggregating and processing massive property data feeds (MLS/IDX)',
    actionWord: 'connecting with',
    exampleLeadUser: 'RealEstate_Dev',
    exampleLeadPost: "Struggling to normalize the data coming from multiple MLS RETS feeds. Is there a specialized firm that handles this?",
    exampleLeadContext: "asked in Data Normalization",
    pricingContext: "PropTech data retainers"
  }
];

export const getPSEODataBySlug = (slug: string): NicheData | undefined => {
  return pseoData.find((data) => data.slug === slug);
};
