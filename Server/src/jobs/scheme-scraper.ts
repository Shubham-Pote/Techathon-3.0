import cron from 'node-cron';
import axios from 'axios';
import prisma from '../config/db.js';
import { SchemeCategory, CropType } from '../generated/prisma/client.js';

const scrapeSchemes = async () => {
  console.log('\n========================================');
  console.log('Running scheme scraper cron job...');
  console.log('Timestamp:', new Date().toISOString());
  console.log('========================================\n');
  
  try {
    // TODO: Replace with actual API endpoint
    // To find the real API:
    // 1. Open https://www.myscheme.gov.in or https://www.india.gov.in in browser
    // 2. Press F12 → Network tab → Filter by "Fetch/XHR"
    // 3. Search/browse schemes and look for API calls
    // 4. Copy the API endpoint URL and replace below
    
    // Example API endpoints to try:
    // const apiUrl = 'https://api.myscheme.gov.in/schemes';
    // const apiUrl = 'https://www.india.gov.in/api/schemes';
    
    console.log('⚠ Note: Using demo data structure. Replace with real API endpoint.\n');
    
    // Mock API response - Replace this with actual API call: const { data } = await axios.get(apiUrl);
    const apiResponse = await fetchSchemesFromAPI();
    
    console.log(`✓ Fetched ${apiResponse.length} schemes\n`);
    
    const schemePromises = apiResponse.map(async (schemeData, index) => {
      try {
        // Validate required fields
        if (!schemeData.scheme_id || !schemeData.scheme_name) {
          console.warn(`⚠ Skipping scheme - missing required fields:`, schemeData);
          return;
        }
        
        // Check if scheme already exists with same data to avoid unnecessary updates
        const existingScheme = await prisma.scheme.findUnique({
          where: { schemeId: schemeData.scheme_id },
          include: { content: true }
        });
        
        // Skip if scheme exists and was updated recently (within last 12 hours)
        if (existingScheme) {
          const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
          if (existingScheme.updatedAt > twelveHoursAgo) {
            console.log(`⏭ [${index + 1}] Skipped (recently updated): ${schemeData.scheme_name}`);
            return;
          }
        }
        
        // Parse category with fallback
        let category: SchemeCategory = SchemeCategory.WELFARE;
        if (schemeData.category && schemeData.category in SchemeCategory) {
          category = schemeData.category as SchemeCategory;
        } else {
          console.warn(`⚠ Unknown category "${schemeData.category}" for ${schemeData.scheme_name}, defaulting to WELFARE`);
        }
        
        // Parse supported crops with validation
        const supportedCrops: CropType[] = [];
        if (Array.isArray(schemeData.supported_crops)) {
          schemeData.supported_crops.forEach((crop: string) => {
            if (crop in CropType) {
              supportedCrops.push(CropType[crop as keyof typeof CropType]);
            } else {
              console.warn(`⚠ Unknown crop type "${crop}" for ${schemeData.scheme_name}, skipping`);
            }
          });
        }
        
        // Parse minLandAcres with validation
        let minLandAcres: number | null = null;
        if (schemeData.min_land_acres !== undefined && schemeData.min_land_acres !== null) {
          const parsed = typeof schemeData.min_land_acres === 'number' 
            ? schemeData.min_land_acres 
            : parseFloat(String(schemeData.min_land_acres));
          if (!isNaN(parsed) && parsed >= 0) {
            minLandAcres = parsed;
          }
        }
        
        // Create or update Scheme
        const scheme = await prisma.scheme.upsert({
          where: { schemeId: schemeData.scheme_id },
          update: {
            schemeName: schemeData.scheme_name,
            state: schemeData.state || null,
            category: category,
            minLandAcres: minLandAcres,
            supportedCrops: supportedCrops,
            isActive: true,
            updatedAt: new Date(),
          },
          create: {
            schemeId: schemeData.scheme_id,
            schemeName: schemeData.scheme_name,
            state: schemeData.state || null,
            category: category,
            minLandAcres: minLandAcres,
            supportedCrops: supportedCrops,
            isActive: true,
          },
        });
        
        // Prepare SchemeContent with fallbacks for missing data
        const schemeContent = {
          details: schemeData.details || {
            description: (schemeData as any).description || "No description available",
            technical_highlights: (schemeData as any).technical_highlights || [],
            financial_assistance_summary: (schemeData as any).financial_assistance_summary || "Information not available"
          },
          benefits: schemeData.benefits || {
            assistance_details: [],
            disbursing_authority: "Information not available"
          },
          eligibility: Array.isArray(schemeData.eligibility) ? schemeData.eligibility : 
                       (schemeData.eligibility ? [schemeData.eligibility] : ["Eligibility criteria not specified"]),
          applicationProcess: schemeData.application_process || {
            mode: "Not specified",
            steps: ["Visit official portal for application details"],
            portal_url: (schemeData as any).portal_url || "#",
            portal_name: (schemeData as any).portal_name || "Official Portal",
            payment_note: "Contact implementing agency for details",
            application_status_url: (schemeData as any).application_status_url || "#"
          },
          documentsRequired: Array.isArray(schemeData.documents_required) ? schemeData.documents_required : 
                            (schemeData.documents_required ? [schemeData.documents_required] : ["Contact implementing agency for document requirements"])
        };
        
        // Create or update SchemeContent with detailed information
        await prisma.schemeContent.upsert({
          where: { schemeId: scheme.id },
          update: schemeContent,
          create: {
            schemeId: scheme.id,
            ...schemeContent
          },
        });
        
        console.log(`✓ [${index + 1}] Saved: ${schemeData.scheme_name}`);
        console.log(`   ID: ${schemeData.scheme_id}`);
        console.log(`   Category: ${category}`);
        console.log(`   State: ${schemeData.state || 'Central'}`);
        console.log(`   Crops: ${supportedCrops.length > 0 ? supportedCrops.join(', ') : 'All crops'}\n`);
      } catch (error) {
        console.error(`✗ Error saving scheme ${schemeData.scheme_name || 'unknown'}:`, error);
      }
    });
    
    await Promise.all(schemePromises);
    
    console.log('========================================');
    console.log('✓ Scraper completed successfully!');
    console.log(`Total schemes processed: ${apiResponse.length}`);
    console.log('========================================\n');
    
  } catch (error) {
    console.error('\n❌ Error in scheme scraper:', error);
    console.error('========================================\n');
  }
};

// Replace this function with actual API call
const fetchSchemesFromAPI = async () => {
  // TODO: Replace with real API call
  // const response = await axios.get('YOUR_API_ENDPOINT_HERE', {
  //   headers: {
  //     'User-Agent': 'Mozilla/5.0...',
  //     'Accept': 'application/json',
  //   },
  //   timeout: 30000,
  // });
  // return response.data;
  
  // Demo data matching your schema
  return [
    {
      scheme_id: "CTR_NABARD_REFIN_SUB_001",
      scheme_name: "NABARD Refinancing & Rural Agri MSME Funding",
      state: null,
      category: "SUBSIDY",
      supported_crops: [],
      min_land_acres: null,
      details: {
        description: "NABARD Refinancing & Rural Agri MSME Funding is a central initiative through which the National Bank for Agriculture and Rural Development (NABARD) provides refinance support to banks and financial institutions for lending to agriculture, rural infrastructure, and agri-based MSMEs. The scheme strengthens rural credit flow and promotes sustainable rural development.",
        technical_highlights: [
          "Refinance support to banks and rural financial institutions",
          "Funding for agriculture, allied activities, and rural MSMEs",
          "Support for irrigation, farm mechanization, and infrastructure",
          "Enhancement of rural credit availability",
          "Promotion of agri-based entrepreneurship"
        ],
        financial_assistance_summary: "Refinance assistance provided to eligible financial institutions for onward lending to agriculture and rural MSME sectors as per NABARD norms."
      },
      benefits: {
        assistance_details: [
          {
            max_limit: "As per NABARD refinance norms and approved limits",
            assistance: "Refinance funding to banks for agriculture and rural enterprise lending",
            scheme_component: "Refinance Support for Agriculture and Rural MSMEs",
            implementing_agency: "National Bank for Agriculture and Rural Development (NABARD)"
          }
        ],
        disbursing_authority: "Participating Banks and Financial Institutions under NABARD guidelines"
      },
      eligibility: [
        "Participating banks and financial institutions must meet NABARD eligibility criteria",
        "End beneficiaries may include farmers, agri-entrepreneurs, and rural MSMEs",
        "Projects must fall under approved agriculture or rural development activities",
        "End beneficiaries must comply with lending institution norms"
      ],
      application_process: {
        mode: "Online / Offline",
        steps: [
          "Banks or financial institutions apply for refinance support from NABARD",
          "Submit project proposals and lending details",
          "Undergo appraisal and approval process",
          "Upon approval, refinance is released to lending institution",
          "End beneficiaries apply for loans through participating banks"
        ],
        portal_url: "https://www.nabard.org/",
        portal_name: "NABARD Official Portal",
        payment_note: "Refinance assistance is provided to financial institutions; loan disbursement to end beneficiaries is handled by participating banks as per approved terms.",
        application_status_url: "https://www.nabard.org/"
      },
      documents_required: [
        "Loan Application Form (for end beneficiaries)",
        "Project Proposal",
        "Identity Proof (for end beneficiaries)",
        "Land or Business Ownership Documents",
        "Bank Account Details"
      ]
    },
    {
      scheme_id: "CTR_PM_KISAN_SUB_002",
      scheme_name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      state: null,
      category: "SUBSIDY",
      supported_crops: ["PADDY", "WHEAT", "COTTON", "MAIZE", "SOYBEAN", "SUGARCANE"],
      min_land_acres: 0,
      details: {
        description: "PM-KISAN is a Central Sector scheme providing income support of ₹6,000 per year to all landholding farmers' families across the country. The scheme aims to supplement the financial needs of farmers for procuring various inputs related to agriculture and allied activities.",
        technical_highlights: [
          "Direct income support of ₹6000 per year",
          "Payment in three equal installments of ₹2000 each",
          "Transferred directly to bank accounts of beneficiaries",
          "Coverage for all landholding farmer families",
          "Self-registration facility available"
        ],
        financial_assistance_summary: "₹6000 per year in three equal installments to all eligible farmer families."
      },
      benefits: {
        assistance_details: [
          {
            max_limit: "₹6000 per year",
            assistance: "₹2000 per installment (3 installments per year)",
            scheme_component: "Income Support",
            implementing_agency: "Ministry of Agriculture & Farmers Welfare"
          }
        ],
        disbursing_authority: "Direct Benefit Transfer to farmer bank accounts"
      },
      eligibility: [
        "All landholding farmers families are eligible",
        "Must have valid Aadhar card",
        "Bank account linked with Aadhar",
        "Cultivable land in any capacity (owner/tenant/sharecropper)",
        "No upper limit on landholding size"
      ],
      application_process: {
        mode: "Online / Offline",
        steps: [
          "Visit PM-KISAN portal or nearest CSC",
          "Register with Aadhar number",
          "Fill farmer registration form",
          "Upload land records and bank details",
          "Submit application",
          "Verification by local revenue authorities",
          "Approval and first installment credit"
        ],
        portal_url: "https://pmkisan.gov.in/",
        portal_name: "PM-KISAN Portal",
        payment_note: "Amount is credited directly to farmer bank accounts in three installments.",
        application_status_url: "https://pmkisan.gov.in/BeneficiaryStatus.aspx"
      },
      documents_required: [
        "Aadhar Card",
        "Bank Account Passbook",
        "Land Ownership Documents",
        "Mobile Number",
        "Passport Size Photograph"
      ]
    },
    {
      scheme_id: "CTR_PMFBY_INS_003",
      scheme_name: "Pradhan Mantri Fasal Bima Yojana",
      state: null,
      category: "INSURANCE",
      supported_crops: ["PADDY", "WHEAT", "COTTON", "MAIZE", "SOYBEAN", "SUGARCANE"],
      min_land_acres: 0,
      details: {
        description: "PMFBY provides comprehensive insurance coverage against crop loss to farmers, helping to stabilize their income. The scheme covers yield losses due to non-preventable natural risks from pre-sowing to post-harvest stages.",
        technical_highlights: [
          "Low premium rates: 2% for Kharif, 1.5% for Rabi crops",
          "Coverage for all stages from sowing to post-harvest",
          "Use of technology like satellites and drones for yield estimation",
          "Localized calamities and post-harvest losses covered",
          "Quick claim settlement process"
        ],
        financial_assistance_summary: "Insurance coverage with subsidized premium rates, with compensation based on actual crop loss assessment."
      },
      benefits: {
        assistance_details: [
          {
            max_limit: "Sum insured based on scale of finance for notified crop",
            assistance: "Difference between threshold yield and actual yield",
            scheme_component: "Crop Insurance Coverage",
            implementing_agency: "Ministry of Agriculture & Farmers Welfare"
          }
        ],
        disbursing_authority: "Insurance companies through Direct Benefit Transfer"
      },
      eligibility: [
        "All farmers including sharecroppers and tenant farmers",
        "Compulsory for loanee farmers",
        "Voluntary for non-loanee farmers",
        "Must cultivate notified crops in notified areas",
        "Bank account with Aadhar linkage required"
      ],
      application_process: {
        mode: "Online / Offline",
        steps: [
          "Visit PMFBY portal or nearest bank/CSC",
          "Select crop and area to be insured",
          "Fill application form with land details",
          "Pay applicable premium amount",
          "Submit required documents",
          "Receive insurance policy document",
          "In case of loss, report within 72 hours"
        ],
        portal_url: "https://pmfby.gov.in/",
        portal_name: "Pradhan Mantri Fasal Bima Yojana Portal",
        payment_note: "Claims are settled within 2 months of crop cutting experiments.",
        application_status_url: "https://pmfby.gov.in/farmerLogin"
      },
      documents_required: [
        "Aadhar Card",
        "Land Records/Lease Agreement",
        "Bank Account Details",
        "Sowing Certificate",
        "Loan Sanction Letter (for loanee farmers)",
        "Mobile Number"
      ]
    }
  ];
};

// Schedule the cron job to run once a day at midnight
cron.schedule('0 0 * * *', scrapeSchemes);

export { scrapeSchemes };
