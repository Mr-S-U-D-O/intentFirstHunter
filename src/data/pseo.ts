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
  },

  // ─── Question-Intent Pages (Strategy 3) ────────────────────────────────────
  // Targets zero-competition queries that map directly to buyer searches
  {
    slug: 'how-to-find-clients-on-reddit',
    industry: 'Reddit Lead Generation',
    nichePersona: 'B2B Service Providers',
    platform: 'Reddit',
    painPoint: 'cold outreach being ignored and paid ads draining budgets',
    actionWord: 'finding',
    exampleLeadUser: 'Agency_Owner_Lost',
    exampleLeadPost: "How do people actually find B2B clients on Reddit without spamming? Cold DMs feel gross and I'm not sure where to even look.",
    exampleLeadContext: "posted in r/Entrepreneur",
    pricingContext: "organic pipeline building"
  },
  {
    slug: 'how-to-monitor-reddit-for-leads',
    industry: 'Reddit Monitoring',
    nichePersona: 'Founders & Consultants',
    platform: 'Reddit',
    painPoint: 'missing high-intent conversations happening right now in their niche',
    actionWord: 'intercepting',
    exampleLeadUser: 'Consulting_Mike',
    exampleLeadPost: "Is there any tool that monitors specific subreddits for potential clients? Manual browsing is not scalable.",
    exampleLeadContext: "posted in r/consulting",
    pricingContext: "automated lead monitoring"
  },
  {
    slug: 'how-to-get-customers-from-reddit',
    industry: 'Reddit Customer Acquisition',
    nichePersona: 'SaaS Founders',
    platform: 'Reddit',
    painPoint: 'struggling to convert Reddit engagement into paying customers',
    actionWord: 'converting',
    exampleLeadUser: 'SaaS_Founder_Trying',
    exampleLeadPost: "Posted in r/SaaS a few times but never got any customers. What am I missing? Is Reddit even a viable channel?",
    exampleLeadContext: "posted in r/SaaS",
    pricingContext: "converting community into revenue"
  },
  {
    slug: 'reddit-lead-generation-tool',
    industry: 'Reddit Lead Generation',
    nichePersona: 'Growth Teams',
    platform: 'Reddit',
    painPoint: 'no scalable system for capturing buyer intent signals on Reddit',
    actionWord: 'automating',
    exampleLeadUser: 'Growth_Lead_Hunt',
    exampleLeadPost: "Looking for a Reddit lead gen tool that actually scores intent rather than just keyword matches. Does anything like this exist?",
    exampleLeadContext: "posted in r/marketing",
    pricingContext: "automated intent-based lead generation"
  },
  {
    slug: 'reddit-monitoring-for-agencies',
    industry: 'Agency Growth',
    nichePersona: 'Agency Owners',
    platform: 'Reddit',
    painPoint: 'spending thousands on ads while ideal clients are already publicly asking for help on Reddit',
    actionWord: 'intercepting',
    exampleLeadUser: 'Agency_Owner_2024',
    exampleLeadPost: "My agency spends $8k/mo on LinkedIn ads. Someone told me our ideal clients are literally posting 'who can help me with X' on Reddit every day. Is this true?",
    exampleLeadContext: "posted in r/agency",
    pricingContext: "agency prospect monitoring"
  },
  {
    slug: 'reddit-social-listening-b2b',
    industry: 'B2B Social Intelligence',
    nichePersona: 'B2B Marketers',
    platform: 'Reddit',
    painPoint: 'traditional social listening tools missing Reddit\'s unfiltered buyer intent signals',
    actionWord: 'detecting',
    exampleLeadUser: 'B2B_Marketer_Pro',
    exampleLeadPost: "We use Mention and Brand24 for social listening but they miss most of Reddit. Reddit has the most honest B2B buyer conversations I've seen.",
    exampleLeadContext: "posted in r/marketing",
    pricingContext: "B2B social intelligence"
  },
  {
    slug: 'how-to-track-reddit-mentions',
    industry: 'Reddit Brand Monitoring',
    nichePersona: 'Brand Managers',
    platform: 'Reddit',
    painPoint: 'missing real-time mentions and competitor discussions on Reddit',
    actionWord: 'tracking',
    exampleLeadUser: 'Brand_Monitor_Sarah',
    exampleLeadPost: "How do you track when your brand or competitors are mentioned on Reddit? Google Alerts doesn't pick up most Reddit content.",
    exampleLeadContext: "posted in r/marketing",
    pricingContext: "real-time Reddit tracking"
  },
  {
    slug: 'reddit-intent-signals-b2b',
    industry: 'Intent-Based Marketing',
    nichePersona: 'Revenue Leaders',
    platform: 'Reddit',
    painPoint: 'buying signals being scattered across subreddits with no systematic capture',
    actionWord: 'capturing',
    exampleLeadUser: 'RevOps_Director',
    exampleLeadPost: "Does anyone systematically capture buyer intent signals from Reddit? People literally post 'I need a vendor for X' and nobody responds professionally.",
    exampleLeadContext: "posted in r/sales",
    pricingContext: "structured intent signal capture"
  },
  {
    slug: 'how-to-find-saas-customers-reddit',
    industry: 'SaaS Growth',
    nichePersona: 'SaaS Founders',
    platform: 'Reddit',
    painPoint: 'spending months on product-led growth without finding the right Reddit communities',
    actionWord: 'locating',
    exampleLeadUser: 'Early_SaaS_Rob',
    exampleLeadPost: "My SaaS has been live for 4 months. I know my customers are on Reddit but r/SaaS feels saturated. Where else should I be looking?",
    exampleLeadContext: "posted in r/SaaS",
    pricingContext: "SaaS community-led growth"
  },
  {
    slug: 'reddit-comment-marketing-strategy',
    industry: 'Comment Marketing',
    nichePersona: 'Content Strategists',
    platform: 'Reddit',
    painPoint: 'commenting on Reddit without a strategy, getting ignored or banned',
    actionWord: 'strategizing',
    exampleLeadUser: 'Content_Strat_Pro',
    exampleLeadPost: "We tried Reddit comment marketing but it felt like shouting into a void. Is there a system for identifying which threads are actually worth responding to?",
    exampleLeadContext: "posted in r/content_marketing",
    pricingContext: "strategic comment engagement"
  },
  {
    slug: 'best-subreddits-for-b2b-leads',
    industry: 'B2B Lead Generation',
    nichePersona: 'Sales Leaders',
    platform: 'Reddit',
    painPoint: 'not knowing which subreddits their ideal buyers are actively posting in',
    actionWord: 'discovering',
    exampleLeadUser: 'Sales_Director_Ken',
    exampleLeadPost: "What are the best subreddits for finding B2B leads? We sell to SaaS companies and CROs. I assume r/SaaS but not sure where else.",
    exampleLeadContext: "posted in r/sales",
    pricingContext: "multi-subreddit lead sourcing"
  },
  {
    slug: 'reddit-vs-linkedin-outreach',
    industry: 'B2B Outreach',
    nichePersona: 'Sales Professionals',
    platform: 'Reddit',
    painPoint: 'LinkedIn InMail open rates under 15% while Reddit conversations have far higher trust signals',
    actionWord: 'comparing',
    exampleLeadUser: 'SDR_Manager_Q',
    exampleLeadPost: "Our LinkedIn outreach has a 12% open rate. Someone told me responding to Reddit posts is getting 40%+ response rates. Anyone done this at scale?",
    exampleLeadContext: "posted in r/sales",
    pricingContext: "high-trust outbound engagement"
  },
  {
    slug: 'how-brands-use-reddit-marketing',
    industry: 'Reddit Marketing',
    nichePersona: 'Marketing Directors',
    platform: 'Reddit',
    painPoint: 'watching competitors gain organic Reddit traction with no proven playbook to follow',
    actionWord: 'modeling',
    exampleLeadUser: 'Marketing_Dir_Amy',
    exampleLeadPost: "How do professional brands use Reddit for marketing without getting called out as corporate? Seen some do it well but can't figure out the formula.",
    exampleLeadContext: "posted in r/marketing",
    pricingContext: "authentic Reddit brand building"
  },
  {
    slug: 'reddit-keyword-alert-tool',
    industry: 'Reddit Alert Systems',
    nichePersona: 'Entrepreneurs',
    platform: 'Reddit',
    painPoint: 'setting up manual Google Alerts that miss 80% of Reddit content',
    actionWord: 'alerting',
    exampleLeadUser: 'Alert_Setup_Newbie',
    exampleLeadPost: "Is there a Reddit-specific keyword alert tool? Google Alerts barely indexes Reddit and I'm missing conversations where my name or service comes up.",
    exampleLeadContext: "posted in r/Entrepreneur",
    pricingContext: "real-time Reddit keyword monitoring"
  },
  {
    slug: 'monitor-reddit-for-competitors',
    industry: 'Competitive Intelligence',
    nichePersona: 'Product Managers',
    platform: 'Reddit',
    painPoint: 'competitor mentions and feature requests going unnoticed in public subreddits',
    actionWord: 'monitoring',
    exampleLeadUser: 'PM_Competitor_Watch',
    exampleLeadPost: "I want to monitor Reddit for mentions of our competitors so I can jump in with a comparison. Any tools specifically for Reddit competitive intelligence?",
    exampleLeadContext: "posted in r/ProductManagement",
    pricingContext: "competitive Reddit monitoring"
  },
  {
    slug: 'find-high-intent-reddit-posts',
    industry: 'High-Intent Lead Capture',
    nichePersona: 'Business Development Teams',
    platform: 'Reddit',
    painPoint: 'wading through thousands of irrelevant posts to find the 5 that actually have buying intent',
    actionWord: 'filtering',
    exampleLeadUser: 'BizDev_Overloaded',
    exampleLeadPost: "Has anyone built or found a way to filter Reddit posts specifically for ones where someone is actively seeking a service provider? Manual browsing wastes hours.",
    exampleLeadContext: "posted in r/sales",
    pricingContext: "high-signal post filtering"
  },
  {
    slug: 'reddit-buyer-intent-signals',
    industry: 'Buyer Intent Research',
    nichePersona: 'Demand Generation Leaders',
    platform: 'Reddit',
    painPoint: 'paying for intent data tools that don\'t cover Reddit\'s unstructured conversations',
    actionWord: 'decoding',
    exampleLeadUser: 'DemandGen_VP',
    exampleLeadPost: "We pay for G2 intent data but it doesn't capture Reddit. Reddit has RAW buyer intent — people literally asking 'who can help me with X'. Anyone systematizing this?",
    exampleLeadContext: "posted in r/demandgen",
    pricingContext: "unstructured buyer intent data"
  },
  {
    slug: 'reddit-lead-monitoring-automation',
    industry: 'Sales Automation',
    nichePersona: 'Sales Ops Teams',
    platform: 'Reddit',
    painPoint: 'manual Reddit monitoring being unsustainable and inconsistent across the team',
    actionWord: 'automating',
    exampleLeadUser: 'SalesOps_Automate',
    exampleLeadPost: "We have a marketing VA manually browsing Reddit for leads 2hrs/day. This is not scalable. Is there a tool that automates Reddit lead monitoring with scoring?",
    exampleLeadContext: "posted in r/SalesOps",
    pricingContext: "automated Reddit lead operations"
  },
  {
    slug: 'best-way-to-respond-to-reddit-leads',
    industry: 'Sales Engagement',
    nichePersona: 'Sales Representatives',
    platform: 'Reddit',
    painPoint: 'responding to Reddit posts wrong — either too salesy and getting downvoted, or too helpful with no conversion',
    actionWord: 'responding to',
    exampleLeadUser: 'AE_Reddit_Newbie',
    exampleLeadPost: "I found a Reddit thread where our ideal customer is asking for exactly what we sell. How do I respond without looking like a spammer? What's the right approach?",
    exampleLeadContext: "posted in r/sales",
    pricingContext: "expert-led Reddit response strategy"
  },
  {
    slug: 'why-reddit-beats-cold-email-for-b2b',
    industry: 'B2B Outbound Strategy',
    nichePersona: 'Growth Hackers',
    platform: 'Reddit',
    painPoint: 'cold email deliverability below 20% while Reddit conversations go unresponded',
    actionWord: 'replacing cold email with',
    exampleLeadUser: 'GrowthHacker_Mark',
    exampleLeadPost: "Cold email response rates are at an all-time low. I've been testing Reddit as an outbound channel and the receptivity is night and day. Anyone else seeing this?",
    exampleLeadContext: "posted in r/growth",
    pricingContext: "warm outbound via intent interception"
  },
  {
    slug: 'reddit-monitoring-saas-founders',
    industry: 'SaaS Founder Intelligence',
    nichePersona: 'SaaS Vendors',
    platform: 'Reddit',
    painPoint: 'SaaS founders publicly asking for tool recommendations with no vendors responding',
    actionWord: 'intercepting',
    exampleLeadUser: 'SaaS_Vendor_Missing',
    exampleLeadPost: "I see SaaS founders posting in r/SaaS asking for tool recommendations in our category every day. How do we get notified in real-time without manually checking?",
    exampleLeadContext: "posted in r/SaaS",
    pricingContext: "SaaS community interception"
  }
];

export const getPSEODataBySlug = (slug: string): NicheData | undefined => {
  return pseoData.find((data) => data.slug === slug);
};
