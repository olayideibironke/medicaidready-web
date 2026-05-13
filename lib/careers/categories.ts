import { supabaseAdmin } from "../supabaseAdmin";
import { rowToCareersJob } from "./db";
import type { CareersJob } from "./sampleJobs";

export type CategoryFAQ = { q: string; a: string };

export type CategoryMatcher = {
  categories?: string[];
  titleKeywords?: string[];
  keywords?: string[];
  workMode?: "remote" | "hybrid" | "on_site";
};

export type CategoryConfig = {
  slug: string;
  eyebrow: string;
  heading: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  about: string[];
  emptyStateCopy: string;
  faq: CategoryFAQ[];
  related: string[];
  matcher: CategoryMatcher;
};

function makeFaq(role: string, work: string): CategoryFAQ[] {
  return [
    {
      q: `What kind of ${role} jobs are listed here?`,
      a: work,
    },
    {
      q: "Are these jobs reviewed before appearing?",
      a: "Yes. MedicaidReady Careers is curated around healthcare coverage, care workforce, healthcare operations, analytics, compliance, and healthcare technology roles. Listings link to employer career pages whenever possible.",
    },
    {
      q: "How often are jobs updated?",
      a: "The board is designed for frequent updates. Older, duplicate, or broken-link postings can be archived so the public board stays useful and current.",
    },
  ];
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    slug: "medicaid-analyst-jobs",
    eyebrow: "Medicaid analyst jobs",
    heading: "Medicaid analyst jobs",
    metaTitle:
      "Medicaid Analyst Jobs — Policy, Program, and Operations Roles | MedicaidReady Careers",
    metaDescription:
      "Open Medicaid analyst jobs across policy, program operations, compliance, and reporting. Curated weekly from health plans, providers, agencies, and healthcare organizations.",
    intro:
      "Open analyst roles across Medicaid policy, program operations, compliance, reporting, and healthcare administration.",
    about: [
      "Medicaid analyst roles support policy research, reporting, operations, compliance, finance, and program management work.",
      "Common titles include Medicaid Policy Analyst, Program Analyst, Compliance Analyst, Operations Analyst, Reporting Analyst, and Healthcare Data Analyst.",
      "These roles are a strong fit for people with SQL, Excel, reporting, stakeholder communication, policy, compliance, or healthcare operations experience.",
    ],
    emptyStateCopy:
      "We do not have an open Medicaid analyst role this week. New roles are added regularly — check back soon, or browse all current jobs.",
    faq: makeFaq(
      "Medicaid analyst",
      "This category includes policy analyst, program analyst, compliance analyst, operations analyst, reporting analyst, and healthcare data analyst roles connected to Medicaid, Medicare, ACA, and healthcare operations."
    ),
    related: [
      "medicaid-analytics-jobs",
      "healthcare-compliance-jobs",
      "healthcare-data-analyst-jobs",
    ],
    matcher: {
      titleKeywords: ["analyst"],
      keywords: [
        "medicaid analyst",
        "policy analyst",
        "program analyst",
        "operations analyst",
      ],
    },
  },
  {
    slug: "medicaid-eligibility-jobs",
    eyebrow: "Medicaid eligibility jobs",
    heading: "Medicaid eligibility specialist jobs",
    metaTitle:
      "Medicaid Eligibility Specialist Jobs — Enrollment & Renewal Roles | MedicaidReady Careers",
    metaDescription:
      "Open Medicaid eligibility specialist and enrollment roles at health systems, FQHCs, managed care plans, public programs, and healthcare organizations.",
    intro:
      "Eligibility specialist, enrollment counselor, benefits navigator, and patient access roles across the Medicaid ecosystem.",
    about: [
      "Eligibility specialists help individuals and families apply for Medicaid, complete renewals, gather documents, and avoid coverage gaps.",
      "Common titles include Medicaid Eligibility Specialist, Enrollment Counselor, Benefits Navigator, Patient Access Coordinator, and Outreach Coordinator.",
      "Many roles value public benefits experience, bilingual communication, strong documentation, and patient-facing support skills.",
    ],
    emptyStateCopy:
      "We do not have an open eligibility specialist role this week. New roles are added regularly — check back soon, or browse all current jobs.",
    faq: makeFaq(
      "Medicaid eligibility",
      "This category includes eligibility specialist, enrollment, renewal, navigator, patient access, and benefits support roles."
    ),
    related: ["medicaid-care-management-jobs", "cna-jobs", "caregiver-jobs"],
    matcher: {
      categories: ["eligibility"],
      titleKeywords: ["eligibility", "enrollment", "navigator", "patient access"],
      keywords: ["medicaid eligibility", "enrollment specialist", "benefits navigator"],
    },
  },
  {
    slug: "medicaid-care-management-jobs",
    eyebrow: "Medicaid care management jobs",
    heading: "Medicaid care management jobs",
    metaTitle:
      "Medicaid Care Management Jobs — RN, Care Coordinator, and Case Manager Roles | MedicaidReady Careers",
    metaDescription:
      "Open Medicaid care management roles for RNs, social workers, care coordinators, LTSS teams, and case managers.",
    intro:
      "RN care managers, care coordinators, social workers, and case management roles supporting Medicaid members.",
    about: [
      "Care management connects members to the right care, supports care plans, and coordinates resources across providers and community services.",
      "Common titles include RN Care Manager, Care Coordinator, Case Manager, Social Worker, Community Health Worker, and LTSS Coordinator.",
      "These roles often connect directly to Medicaid managed care, LTSS, behavioral health, waiver programs, and member support.",
    ],
    emptyStateCopy:
      "We do not have an open care management role this week. New roles are added regularly — check back soon, or browse all current jobs.",
    faq: makeFaq(
      "care management",
      "This category includes RN care manager, case manager, social worker, care coordinator, LTSS coordinator, and community health roles."
    ),
    related: ["ltss-care-jobs", "direct-support-professional-jobs", "home-health-aide-jobs"],
    matcher: {
      categories: ["care_management"],
      titleKeywords: [
        "care manager",
        "care coordinator",
        "case manager",
        "care coordination",
        "social worker",
      ],
      keywords: ["care management", "case management", "transitions of care"],
    },
  },
  {
    slug: "remote-medicaid-jobs",
    eyebrow: "Remote Medicaid jobs",
    heading: "Remote Medicaid jobs",
    metaTitle:
      "Remote Medicaid Jobs — Work-from-Home Roles in Healthcare Coverage | MedicaidReady Careers",
    metaDescription:
      "Open remote Medicaid, Medicare, ACA, healthcare operations, compliance, analytics, and care management jobs.",
    intro:
      "Remote-friendly roles across Medicaid, Medicare, ACA, care management, analytics, compliance, and healthcare operations.",
    about: [
      "Remote Medicaid and healthcare operations roles are common at managed care plans, vendors, contractors, and consulting teams.",
      "Common remote roles include analyst, compliance, reporting, care management, provider operations, data, and program management jobs.",
      "Some roles still have state residence requirements, market travel, or time-zone expectations, so always confirm details with the employer.",
    ],
    emptyStateCopy:
      "We do not have an open fully remote Medicaid role this week. Browse all current jobs to see remote and hybrid options.",
    faq: makeFaq(
      "remote Medicaid",
      "This category includes remote Medicaid, Medicare, ACA, payer operations, care management, compliance, analytics, and healthcare administration roles."
    ),
    related: ["medicaid-analyst-jobs", "healthcare-it-jobs", "healthcare-data-analyst-jobs"],
    matcher: { workMode: "remote" },
  },
  {
    slug: "healthcare-compliance-jobs",
    eyebrow: "Healthcare compliance jobs",
    heading: "Healthcare compliance jobs",
    metaTitle:
      "Healthcare Compliance Jobs — Medicaid, HIPAA, Audit, and Regulatory Roles | MedicaidReady Careers",
    metaDescription:
      "Open healthcare compliance jobs, Medicaid compliance analyst roles, audit roles, HIPAA roles, regulatory roles, and compliance officer jobs.",
    intro:
      "Compliance, audit, regulatory, HIPAA, and risk roles across Medicaid, Medicare, ACA, payer, and provider organizations.",
    about: [
      "Healthcare compliance roles help organizations follow CMS, state Medicaid, HIPAA, privacy, audit, and regulatory requirements.",
      "Common titles include Compliance Analyst, Compliance Officer, Regulatory Specialist, Auditor, Privacy Specialist, and Risk Manager.",
      "Compliance jobs are often remote-friendly and fit people with policy, quality, audit, documentation, and healthcare operations experience.",
    ],
    emptyStateCopy:
      "We do not have an open healthcare compliance role this week. New roles are added regularly — check back soon, or browse all current jobs.",
    faq: makeFaq(
      "healthcare compliance",
      "This category includes compliance analyst, compliance officer, audit, regulatory, privacy, HIPAA, and risk roles in healthcare."
    ),
    related: ["medicaid-analyst-jobs", "claims-systems-jobs", "provider-data-jobs"],
    matcher: {
      categories: ["compliance"],
      titleKeywords: ["compliance", "regulatory", "auditor", "audit", "hipaa", "risk"],
      keywords: ["compliance officer", "compliance analyst", "hipaa", "regulatory"],
    },
  },
  {
    slug: "medicaid-analytics-jobs",
    eyebrow: "Medicaid analytics jobs",
    heading: "Medicaid analytics and data jobs",
    metaTitle:
      "Medicaid Analytics Jobs — Healthcare Data Analyst, BI, and Reporting Roles | MedicaidReady Careers",
    metaDescription:
      "Open Medicaid analytics and healthcare data jobs, including reporting analyst, BI developer, data scientist, and claims analytics roles.",
    intro:
      "Data analyst, reporting, BI, SQL, analytics engineering, and data science roles in Medicaid and healthcare operations.",
    about: [
      "Medicaid analytics roles work with claims, eligibility, quality, care management, finance, provider, and utilization data.",
      "Common tools include SQL, Excel, Power BI, Tableau, Python, R, Snowflake, Databricks, and healthcare reporting systems.",
      "This category overlaps with healthcare data analyst jobs, but focuses more strongly on Medicaid, Medicare, payer, and health plan analytics.",
    ],
    emptyStateCopy:
      "We do not have an open Medicaid analytics role this week. New roles are added regularly — check back soon, or browse all current jobs.",
    faq: makeFaq(
      "Medicaid analytics",
      "This category includes healthcare data analyst, reporting, BI, data engineering, claims analytics, quality analytics, and Medicaid analytics roles."
    ),
    related: ["healthcare-data-analyst-jobs", "claims-systems-jobs", "provider-data-jobs"],
    matcher: {
      categories: ["analytics", "data"],
      titleKeywords: [
        "data analyst",
        "data scientist",
        "data engineer",
        "analytics engineer",
        "reporting analyst",
        "bi analyst",
        "bi developer",
        "business intelligence",
        "analytics",
      ],
      keywords: ["medicaid analytics", "healthcare data", "claims data", "data scientist"],
    },
  },
  {
    slug: "cna-jobs",
    eyebrow: "CNA jobs",
    heading: "CNA jobs",
    metaTitle: "CNA Jobs — Certified Nursing Assistant Roles | MedicaidReady Careers",
    metaDescription:
      "Browse CNA jobs in nursing homes, hospitals, assisted living, home care, long-term care, and healthcare support settings.",
    intro:
      "Certified nursing assistant roles in long-term care, assisted living, hospitals, home care, and clinical support settings.",
    about: [
      "CNA jobs are some of the fastest-moving healthcare jobs because nursing homes, hospitals, assisted living facilities, and home care agencies hire continuously.",
      "CNAs support patients and residents with daily activities, vital signs, mobility, meals, hygiene, comfort, and communication with nursing teams.",
      "These roles help MedicaidReady Careers serve the real care workforce, not only administrative and analyst roles.",
    ],
    emptyStateCopy:
      "We do not have open CNA roles this week. New frontline care roles are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "CNA",
      "This category includes certified nursing assistant, nursing assistant, long-term care CNA, hospital CNA, rehab CNA, and care facility CNA jobs."
    ),
    related: ["gna-jobs", "home-health-aide-jobs", "caregiver-jobs"],
    matcher: {
      titleKeywords: ["cna", "certified nursing assistant", "nursing assistant"],
      keywords: ["certified nursing assistant", "cna license", "nursing assistant"],
    },
  },
  {
    slug: "gna-jobs",
    eyebrow: "GNA jobs",
    heading: "GNA jobs",
    metaTitle: "GNA Jobs — Geriatric Nursing Assistant Roles | MedicaidReady Careers",
    metaDescription:
      "Browse GNA jobs in long-term care, skilled nursing, assisted living, rehabilitation, and elder care settings.",
    intro:
      "Geriatric nursing assistant roles serving older adults in long-term care, rehabilitation, and skilled nursing settings.",
    about: [
      "GNA jobs are especially important in Maryland and other markets where geriatric care staffing is a major part of long-term care.",
      "GNAs help older adults with daily living needs, mobility, hygiene, meals, comfort, and communication with nursing teams.",
      "These roles move quickly and fit the MedicaidReady Careers focus on care access, long-term care, and the direct care workforce.",
    ],
    emptyStateCopy:
      "We do not have open GNA roles this week. New care workforce jobs are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "GNA",
      "This category includes geriatric nursing assistant, long-term care, skilled nursing, rehab, assisted living, and elder care support roles."
    ),
    related: ["cna-jobs", "caregiver-jobs", "home-health-aide-jobs"],
    matcher: {
      titleKeywords: ["gna", "geriatric nursing assistant"],
      keywords: ["geriatric nursing assistant", "gna license", "long-term care"],
    },
  },
  {
    slug: "caregiver-jobs",
    eyebrow: "Caregiver jobs",
    heading: "Caregiver jobs",
    metaTitle:
      "Caregiver Jobs — Home Care, Companion, and Personal Care Roles | MedicaidReady Careers",
    metaDescription:
      "Browse caregiver jobs, companion care jobs, personal care aide roles, direct care roles, and home care support jobs.",
    intro:
      "Caregiver, companion, personal care aide, and direct care roles supporting people at home and in community settings.",
    about: [
      "Caregiver jobs help older adults, people with disabilities, and families with daily living support, companionship, meals, errands, and safety.",
      "These jobs move quickly because home care and community-based care providers frequently need reliable staff across many shifts.",
      "Caregiver roles fit MedicaidReady Careers because many are connected to Medicaid waiver, home care, aging-in-place, and long-term services programs.",
    ],
    emptyStateCopy:
      "We do not have open caregiver roles this week. New direct care jobs are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "caregiver",
      "This category includes caregiver, companion, personal care aide, direct care, home care, and community support roles."
    ),
    related: ["home-health-aide-jobs", "cna-jobs", "direct-support-professional-jobs"],
    matcher: {
      titleKeywords: [
        "caregiver",
        "companion",
        "personal care aide",
        "pca",
        "care aide",
        "direct care",
      ],
      keywords: ["caregiver", "companion care", "personal care aide", "home care"],
    },
  },
  {
    slug: "home-health-aide-jobs",
    eyebrow: "Home health aide jobs",
    heading: "Home health aide jobs",
    metaTitle:
      "Home Health Aide Jobs — HHA and Home Care Support Roles | MedicaidReady Careers",
    metaDescription:
      "Browse home health aide jobs, HHA roles, home care aide jobs, and personal care support roles.",
    intro:
      "HHA and home care support roles helping clients remain safe, supported, and independent at home.",
    about: [
      "Home health aides support clients with personal care, daily living needs, mobility, meals, light household tasks, and care plan follow-through.",
      "Many HHA roles are connected to Medicaid waiver, long-term services and supports, aging-in-place, and home care programs.",
      "Employers may require state training, HHA certification, CNA certification, CPR, background checks, or reliable transportation.",
    ],
    emptyStateCopy:
      "We do not have open home health aide roles this week. New care jobs are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "home health aide",
      "This category includes HHA, home health aide, home care aide, personal care, and in-home support roles."
    ),
    related: ["caregiver-jobs", "cna-jobs", "direct-support-professional-jobs"],
    matcher: {
      titleKeywords: ["home health aide", "hha", "home care aide", "homecare aide"],
      keywords: ["home health aide", "home care", "hha", "personal care"],
    },
  },
  {
    slug: "patient-care-tech-jobs",
    eyebrow: "Patient care tech jobs",
    heading: "Patient care tech jobs",
    metaTitle:
      "Patient Care Tech Jobs — PCT and Clinical Support Roles | MedicaidReady Careers",
    metaDescription:
      "Browse patient care technician jobs, PCT roles, clinical support roles, hospital patient care jobs, and unit support roles.",
    intro:
      "Patient care technician and clinical support roles in hospitals, clinics, dialysis centers, rehab, and care facilities.",
    about: [
      "Patient care techs support nurses and clinical teams with patient care tasks, vital signs, mobility, transport, documentation, and unit support.",
      "PCT roles are common in hospitals, emergency departments, dialysis centers, rehabilitation centers, and long-term care settings.",
      "Many employers prefer CNA, PCT, phlebotomy, EKG, dialysis, or clinical support experience depending on the setting.",
    ],
    emptyStateCopy:
      "We do not have open patient care tech roles this week. New clinical support jobs are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "patient care tech",
      "This category includes patient care technician, PCT, clinical support, hospital support, dialysis support, and unit care roles."
    ),
    related: ["cna-jobs", "home-health-aide-jobs", "caregiver-jobs"],
    matcher: {
      titleKeywords: ["patient care tech", "patient care technician", "pct"],
      keywords: ["patient care technician", "patient care tech", "clinical support"],
    },
  },
  {
    slug: "direct-support-professional-jobs",
    eyebrow: "Direct support professional jobs",
    heading: "Direct support professional jobs",
    metaTitle:
      "Direct Support Professional Jobs — DSP and Disability Support Roles | MedicaidReady Careers",
    metaDescription:
      "Browse direct support professional jobs, DSP roles, residential support jobs, waiver support jobs, and disability services roles.",
    intro:
      "DSP and disability support roles helping people with daily living, independence, community participation, and care routines.",
    about: [
      "Direct support professionals help people with intellectual and developmental disabilities, behavioral health needs, or daily living support needs.",
      "DSP roles are closely connected to Medicaid waiver programs, community-based services, residential support, and long-term care systems.",
      "Many employers provide training. Some roles require CPR, medication administration training, valid driver's license, background checks, or prior direct support experience.",
    ],
    emptyStateCopy:
      "We do not have open direct support professional roles this week. New care workforce jobs are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "direct support professional",
      "This category includes DSP, direct support, disability support, residential support, waiver support, and community care roles."
    ),
    related: ["caregiver-jobs", "home-health-aide-jobs", "ltss-care-jobs"],
    matcher: {
      titleKeywords: [
        "direct support professional",
        "dsp",
        "direct support",
        "residential counselor",
        "residential support",
      ],
      keywords: ["direct support professional", "dsp", "developmental disabilities", "waiver"],
    },
  },
  {
    slug: "ltss-care-jobs",
    eyebrow: "LTSS care jobs",
    heading: "LTSS and long-term care jobs",
    metaTitle:
      "LTSS Care Jobs — Long-Term Services, Waiver, and Care Support Roles | MedicaidReady Careers",
    metaDescription:
      "Browse LTSS, waiver, long-term care, care coordination, home care, and community-based care roles connected to Medicaid programs.",
    intro:
      "Long-term services and supports roles across waiver programs, community care, care coordination, and member support.",
    about: [
      "LTSS roles support people who need long-term help with daily living, disability support, community services, home care, and care coordination.",
      "These jobs include service coordinators, care coordinators, waiver support roles, direct care staff, community health workers, and care managers.",
      "LTSS work is deeply connected to Medicaid because many long-term services are funded or coordinated through Medicaid waiver programs.",
    ],
    emptyStateCopy:
      "We do not have open LTSS care roles this week. New long-term care and waiver-related jobs are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "LTSS",
      "This category includes long-term services and supports, waiver, community care, care coordination, home care, and long-term care roles."
    ),
    related: ["medicaid-care-management-jobs", "direct-support-professional-jobs", "home-health-aide-jobs"],
    matcher: {
      titleKeywords: ["ltss", "long term services", "long-term services", "waiver"],
      keywords: ["ltss", "long-term services", "waiver", "community-based services"],
    },
  },
  {
    slug: "healthcare-it-jobs",
    eyebrow: "Healthcare IT jobs",
    heading: "Healthcare IT jobs",
    metaTitle:
      "Healthcare IT Jobs — Health Systems, Payer Technology, and IT Operations | MedicaidReady Careers",
    metaDescription:
      "Browse healthcare IT jobs across EHR systems, payer systems, claims platforms, healthcare data, interoperability, and IT operations.",
    intro:
      "Healthcare IT roles across health systems, payer technology, EHR platforms, claims systems, and data operations.",
    about: [
      "Healthcare IT jobs support the technology behind hospitals, clinics, health plans, public programs, healthcare vendors, and payer operations.",
      "Common titles include Healthcare IT Analyst, Clinical Systems Analyst, Application Analyst, Systems Analyst, IT Project Manager, Integration Analyst, and Technical Program Manager.",
      "Many roles require knowledge of HIPAA, clinical workflows, payer operations, EHR systems, claims platforms, SQL, reporting, or healthcare data exchange.",
    ],
    emptyStateCopy:
      "We do not have open healthcare IT roles this week. New health technology jobs are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "healthcare IT",
      "This category includes healthcare IT analyst, clinical systems, application support, technical program, health systems, payer technology, and implementation roles."
    ),
    related: ["ehr-analyst-jobs", "claims-systems-jobs", "healthcare-data-analyst-jobs"],
    matcher: {
      titleKeywords: [
        "healthcare it",
        "systems analyst",
        "application analyst",
        "clinical systems",
        "it analyst",
        "technical analyst",
        "information systems",
        "technical program",
      ],
      keywords: [
        "healthcare technology",
        "clinical systems",
        "health information system",
        "system implementation",
      ],
    },
  },
  {
    slug: "ehr-analyst-jobs",
    eyebrow: "EHR analyst jobs",
    heading: "EHR analyst jobs",
    metaTitle:
      "EHR Analyst Jobs — Epic, Cerner, and Clinical Systems Roles | MedicaidReady Careers",
    metaDescription:
      "Browse EHR analyst jobs for Epic, Cerner, clinical systems, application support, implementation, and workflow optimization.",
    intro:
      "Epic, Cerner, clinical application, and EHR support roles across healthcare organizations.",
    about: [
      "EHR analysts support electronic health record systems used by hospitals, clinics, health systems, and providers.",
      "Common responsibilities include build support, workflow analysis, testing, training, upgrades, implementation support, reporting, and issue resolution.",
      "Epic, Cerner, Meditech, eClinicalWorks, Athena, and other clinical systems experience can help depending on the employer.",
    ],
    emptyStateCopy:
      "We do not have open EHR analyst roles this week. New EHR and clinical systems jobs are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "EHR analyst",
      "This category includes Epic, Cerner, clinical systems, application analyst, implementation, workflow, training, and EHR support roles."
    ),
    related: ["healthcare-it-jobs", "healthcare-data-analyst-jobs", "claims-systems-jobs"],
    matcher: {
      titleKeywords: [
        "ehr",
        "epic",
        "cerner",
        "clinical application analyst",
        "clinical applications analyst",
        "clinical systems analyst",
        "application analyst",
      ],
      keywords: ["ehr", "electronic health record", "epic", "cerner", "clinical systems"],
    },
  },
  {
    slug: "healthcare-data-analyst-jobs",
    eyebrow: "Healthcare data analyst jobs",
    heading: "Healthcare data analyst jobs",
    metaTitle:
      "Healthcare Data Analyst Jobs — BI, Reporting, SQL, and Analytics Roles | MedicaidReady Careers",
    metaDescription:
      "Browse healthcare data analyst jobs, BI analyst roles, reporting analyst roles, SQL analyst jobs, and healthcare analytics positions.",
    intro:
      "Healthcare data, reporting, BI, SQL, and analytics roles across payers, providers, vendors, and public programs.",
    about: [
      "Healthcare data analyst jobs use claims, clinical, enrollment, quality, finance, utilization, and operations data to support better decisions.",
      "Common tools include SQL, Excel, Tableau, Power BI, Python, R, Snowflake, Databricks, and healthcare reporting systems.",
      "These roles support Medicaid programs, health plans, provider operations, compliance, care outcomes, and healthcare technology teams.",
    ],
    emptyStateCopy:
      "We do not have open healthcare data analyst roles this week. New analytics and reporting roles are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "healthcare data analyst",
      "This category includes healthcare data analyst, reporting analyst, BI analyst, SQL analyst, healthcare analytics, and dashboard roles."
    ),
    related: ["medicaid-analytics-jobs", "healthcare-it-jobs", "claims-systems-jobs"],
    matcher: {
      categories: ["analytics", "data"],
      titleKeywords: [
        "healthcare data analyst",
        "data analyst",
        "reporting analyst",
        "business intelligence",
        "bi analyst",
        "bi developer",
        "analytics",
        "data engineer",
      ],
      keywords: ["healthcare data", "claims data", "sql", "power bi", "tableau"],
    },
  },
  {
    slug: "claims-systems-jobs",
    eyebrow: "Claims systems jobs",
    heading: "Claims systems jobs",
    metaTitle:
      "Claims Systems Jobs — QNXT, Facets, Configuration, and Payer Systems | MedicaidReady Careers",
    metaDescription:
      "Browse claims systems jobs, claims configuration roles, QNXT jobs, Facets jobs, payer systems analyst jobs, and claims operations technology roles.",
    intro:
      "Claims systems, configuration, payer platforms, testing, and operations roles in healthcare.",
    about: [
      "Claims systems jobs support the technology and operations behind healthcare claims payment, configuration, adjudication, testing, and issue resolution.",
      "Common systems and keywords include QNXT, Facets, provider configuration, claims configuration, EDI, payment integrity, claims operations, and payer platforms.",
      "These jobs matter in Medicaid, Medicare, and managed care because claims accuracy affects members, providers, compliance, and financial performance.",
    ],
    emptyStateCopy:
      "We do not have open claims systems roles this week. New payer systems and claims technology jobs are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "claims systems",
      "This category includes claims configuration, QNXT, Facets, payer systems, EDI, payment integrity, claims testing, and claims operations roles."
    ),
    related: ["healthcare-it-jobs", "provider-data-jobs", "healthcare-data-analyst-jobs"],
    matcher: {
      titleKeywords: [
        "claims system",
        "claims analyst",
        "claims configuration",
        "configuration analyst",
        "claims operations",
        "payment integrity",
        "qnxt",
        "facets",
        "edi",
      ],
      keywords: [
        "claims system",
        "claims configuration",
        "qnxt",
        "facets",
        "payment integrity",
        "payer systems",
      ],
    },
  },
  {
    slug: "provider-data-jobs",
    eyebrow: "Provider data jobs",
    heading: "Provider data jobs",
    metaTitle:
      "Provider Data Jobs — Credentialing, Network Data, Provider Configuration | MedicaidReady Careers",
    metaDescription:
      "Browse provider data jobs, credentialing roles, provider configuration jobs, network data analyst jobs, and provider operations roles.",
    intro:
      "Provider data, credentialing, network operations, provider configuration, and directory accuracy roles.",
    about: [
      "Provider data roles maintain the information health plans and healthcare organizations use for provider directories, network adequacy, credentialing, contracting, and claims setup.",
      "Common titles include Provider Data Analyst, Credentialing Specialist, Provider Configuration Analyst, Network Operations Analyst, and Provider Relations Specialist.",
      "This work matters because inaccurate provider data can affect claims, member access, compliance, and health plan performance.",
    ],
    emptyStateCopy:
      "We do not have open provider data roles this week. New provider operations and network jobs are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "provider data",
      "This category includes provider data, credentialing, provider configuration, network operations, provider relations, and directory accuracy roles."
    ),
    related: ["claims-systems-jobs", "healthcare-it-jobs", "healthcare-compliance-jobs"],
    matcher: {
      titleKeywords: [
        "provider data",
        "provider configuration",
        "provider credentialing",
        "credentialing",
        "network data",
        "provider relations",
        "network operations",
      ],
      keywords: [
        "provider data",
        "provider configuration",
        "credentialing",
        "provider directory",
        "network adequacy",
      ],
    },
  },
  {
    slug: "healthcare-product-manager-jobs",
    eyebrow: "Healthcare product manager jobs",
    heading: "Healthcare product manager jobs",
    metaTitle:
      "Healthcare Product Manager Jobs — Health Tech, Payer Product, and Platform Roles | MedicaidReady Careers",
    metaDescription:
      "Browse healthcare product manager jobs, payer product roles, health tech product owner jobs, program manager roles, and platform product roles.",
    intro:
      "Product manager, product owner, technical product, and program roles in healthcare technology and payer platforms.",
    about: [
      "Healthcare product managers work on digital tools, payer platforms, member experiences, provider systems, claims workflows, analytics products, and clinical or administrative technology.",
      "These roles often combine stakeholder management, product strategy, workflow understanding, technical coordination, and healthcare domain knowledge.",
      "Healthcare product roles fit MedicaidReady Careers because many products support access, enrollment, claims, care management, analytics, and compliance.",
    ],
    emptyStateCopy:
      "We do not have open healthcare product manager roles this week. New product and platform roles are added regularly — browse all current jobs or check back soon.",
    faq: makeFaq(
      "healthcare product manager",
      "This category includes product manager, product owner, technical product, platform, program manager, and health technology delivery roles."
    ),
    related: ["healthcare-it-jobs", "claims-systems-jobs", "healthcare-data-analyst-jobs"],
    matcher: {
      titleKeywords: [
        "product manager",
        "product owner",
        "technical product manager",
        "product management",
        "program manager",
      ],
      keywords: [
        "healthcare product",
        "payer platform",
        "member experience",
        "provider platform",
        "product roadmap",
      ],
    },
  },
];

export const CATEGORY_SLUGS: string[] = CATEGORY_CONFIGS.map((c) => c.slug);

const CONFIG_MAP: Record<string, CategoryConfig> = Object.fromEntries(
  CATEGORY_CONFIGS.map((c) => [c.slug, c])
);

export function getCategoryConfig(slug: string): CategoryConfig | null {
  return CONFIG_MAP[slug] ?? null;
}

type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  company: string;
  category: string | null;
  location: string | null;
  work_mode: "remote" | "hybrid" | "on_site" | null;
  employment_type: "full_time" | "part_time" | "contract" | "internship" | null;
  salary_min: number | string | null;
  salary_max: number | string | null;
  salary_currency: string | null;
  salary_period: "year" | "month" | "hour" | null;
  salary_display: string | null;
  summary: string | null;
  description: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  benefits: string[] | null;
  apply_url: string | null;
  source_type: string | null;
  status: string;
  featured: boolean;
  expires_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const SELECT_FIELDS = [
  "id",
  "slug",
  "title",
  "company",
  "category",
  "location",
  "work_mode",
  "employment_type",
  "salary_min",
  "salary_max",
  "salary_currency",
  "salary_period",
  "salary_display",
  "summary",
  "description",
  "responsibilities",
  "requirements",
  "benefits",
  "apply_url",
  "source_type",
  "status",
  "featured",
  "expires_at",
  "published_at",
  "created_at",
  "updated_at",
].join(", ");

function lc(s: string | null | undefined): string {
  return typeof s === "string" ? s.toLowerCase() : "";
}

function rowMatchesCategory(row: CategoryRow, matcher: CategoryMatcher): boolean {
  if (matcher.workMode && row.work_mode === matcher.workMode) {
    return true;
  }

  if (matcher.categories && row.category) {
    const cat = row.category.toLowerCase();
    if (matcher.categories.some((c) => c.toLowerCase() === cat)) {
      return true;
    }
  }

  const title = lc(row.title);
  if (matcher.titleKeywords?.some((k) => title.includes(k.toLowerCase()))) {
    return true;
  }

  if (matcher.keywords && matcher.keywords.length > 0) {
    const haystack = [
      row.title,
      row.company,
      row.category,
      row.location,
      row.summary,
      row.description,
      ...(row.responsibilities ?? []),
      ...(row.requirements ?? []),
      ...(row.benefits ?? []),
    ]
      .filter((x): x is string => typeof x === "string" && x.length > 0)
      .join(" ")
      .toLowerCase();

    if (matcher.keywords.some((k) => haystack.includes(k.toLowerCase()))) {
      return true;
    }
  }

  return false;
}

export async function listJobsForCategory(slug: string): Promise<CareersJob[]> {
  const config = getCategoryConfig(slug);
  if (!config) return [];

  try {
    const sb = supabaseAdmin();
    const nowIso = new Date().toISOString();

    const { data, error } = await sb
      .from("careers_jobs")
      .select(SELECT_FIELDS)
      .eq("status", "approved")
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false, nullsFirst: false });

    if (error) {
      console.warn(
        `[careers] listJobsForCategory(${slug}) query failed:`,
        error.message
      );
      return [];
    }

    if (!data || data.length === 0) return [];

    const rows = data as unknown as CategoryRow[];
    const matching = rows.filter((r) => rowMatchesCategory(r, config.matcher));

    return matching.map((r) =>
      rowToCareersJob(r as unknown as Parameters<typeof rowToCareersJob>[0])
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`[careers] listJobsForCategory(${slug}) threw:`, msg);
    return [];
  }
}
