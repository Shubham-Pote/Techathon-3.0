import { createContext, useContext } from "react"
import { useTranslation } from "react-i18next"

const LangContext = createContext()

const translations = {
  /* ════════════════════════════════════════════
     ENGLISH
  ════════════════════════════════════════════ */
  en: {
    nav: {
      login: "Login",
      logout: "Logout",
      schemes: "Schemes",
      insurance: "Insurance",
      howItWorks: "How it Works",
      impact: "Impact",
      checkEligibility: "Check Eligibility",
    },

    hero: {
      title1: "Find the Right Scheme",
      title2: "for Your Farm",
      subtitle: "Search across government agricultural schemes, subsidies, and insurance programs",
      searchPlaceholder: "Enter scheme name to search...",
      searchBtn: "Search",
    },

    schemes: {
      heading: "Available Schemes",
      showing: (n, total) => `Showing ${n} of ${total} schemes`,
      filters: "Filters",
      filtersDesc: "Narrow down schemes by location, type, or crop.",
      active: "active",
      state: "State",
      supportType: "Support Type",
      crop: "Crop",
      eligibility: "Eligibility",
      allSchemes: "All Schemes",
      eligibleOnly: "Eligible Only",
      notEligible: "Not Eligible",
      clearFilters: "Clear All Filters",
      sortDefault: "Sort: Default",
      sortAZ: "Sort: A → Z",
      sortZA: "Sort: Z → A",
      loading: "Loading schemes...",
      noResults: "No schemes found",
      noResultsHint: "Try adjusting your filters or search",
      prev: "← Previous",
      next: "Next →",
    },

    landing: {
      heroTitle: "Krishiculture",
      heroSubtitle:
        "Simplifying access to government schemes, insurance, and financial support for farmers through minimal input and smart technology.",
      checkYourEligibility: "Check Your Eligibility",
      exploreSchemes: "Explore Schemes",
      heroNote: "No complex forms. No confusion. Just the right support.",

      challengeLabel: "The Challenge",
      challengeTitle: "Why Farmers Struggle to Access Benefits",
      challengeDesc:
        "Farmers often miss out on government schemes and insurance benefits due to complex procedures, scattered information, and lengthy paperwork.",

      solutionLabel: "The Solution",
      solutionTitle: "Our Solution",
      solutionDesc:
        "Our platform uses 2-3 smart filters to instantly match farmers with relevant state and central government schemes, insurance, and financial support.",

      featuresLabel: "Key Features",
      featuresTitle: "Designed for Modern Agriculture",
      viewAllFeatures: "View All Features",

      impactLabel: "Our Impact",
      impactTitle: "Creating Measurable Impact",

      ctaTitle: "Krishiculture",
      ctaDesc: "Join thousands of farmers who are already securing their financial future through AgriScheme Access.",
      ctaBtn: "Get Started Now",
      ctaVerified: "Verified Portal",
      ctaSecure: "Secure Data",

      footerDesc: "Dedicated to bringing the benefits of governance to every farmer's doorstep.",
      platform: "Platform",
      resources: "Resources",
      connect: "Connect",
      copyright: "© 2024 AgriScheme Access Platform. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      accessibility: "Accessibility",

      challenges: [
        { title: "Complicated Documentation", desc: "Too many forms and confusing legal requirements." },
        { title: "Lack of Centralized Info", desc: "Information is spread across disconnected departments." },
        { title: "Time-Consuming", desc: "Waiting for months to get even simple approvals." },
        { title: "Digital Barriers", desc: "Complex portals that are hard to navigate on mobile." },
      ],
      steps: [
        { title: "Enter Basic Details", desc: "Simply provide your state, land size, and crop type to get started." },
        { title: "Get Recommendations", desc: "Instantly view schemes tailored specifically to your farm profile." },
        { title: "Apply with Confidence", desc: "Complete one-click applications with pre-filled documents." },
      ],
      features: [
        { title: "Minimal Data Requirement", desc: "No need to remember hundreds of details. Just the basics to get you verified." },
        { title: "Smart Matching System", desc: "AI-driven engine that finds benefits you didn't even know you qualified for." },
        { title: "Integrated Support Finder", desc: "Find insurance and financial credit options alongside government subsidies." },
        { title: "State-Specific Recommendations", desc: "Localized schemes that vary by region and agricultural climatic zones." },
        { title: "User-Friendly Interface", desc: "Simple, clean navigation built for farmers of all technological backgrounds." },
        { title: "Low Digital Barriers", desc: "Optimized for low-bandwidth areas and works seamlessly on basic smartphones." },
      ],
      metrics: [
        { value: "95%", label: "Streamlined Access", desc: "Success rate in identifying eligible schemes" },
        { value: "-80%", label: "Reduced Time", desc: "Faster application processing versus manual" },
        { value: "3X", label: "Improved Awareness", desc: "Increase in scheme utilization per farmer" },
        { value: "$2B+", label: "Financial Inclusion", desc: "Total benefits facilitated through our portal" },
      ],
      platformLinks: ["Available Schemes", "Insurance Plans", "Eligibility Checker", "Financial Support"],
      resourceLinks: ["Farming Tips", "Success Stories", "Help Center", "Policy Updates"],
    },

    card: {
      eligible: "✓ Eligible",
      notEligible: "Not Eligible",
      financialAssistance: "Financial Assistance",
      more: (n) => `+${n} more`,
      minAcre: (n) => `Min ${n} acre`,
      applyNow: "Apply Now",
      allIndia: "All India",
      noDescription: "No description available",
    },

    schemeDetail: {
      loading: "Loading...",
      schemeSection: "Scheme Section",
      back: "← Back to Schemes",
      financialAssistance: "Financial Assistance",
      applyNow: "Apply Now →",
      minAcre: (n) => `Min ${n} Acre`,
      sidebar: {
        details: "Details",
        benefits: "Benefits",
        eligibility: "Eligibility",
        process: "Application Process",
        docs: "Documents Required",
      },
      content: {
        detailsHeading: "Details",
        noDescription: "No description available.",
        benefitsHeading: "Benefits",
        noBenefits: "No benefits listed.",
        maxLimit: "Max Limit:",
        agency: "Agency:",
        disbursingAuthority: "Disbursing Authority:",
        eligibilityHeading: "Eligibility",
        noEligibility: "No eligibility conditions available.",
        processHeading: "Application Process",
        mode: "Mode:",
        portal: "Portal:",
        visitPortal: "Visit Portal →",
        checkStatus: "Check Status →",
        note: "Note:",
        docsHeading: "Documents Required",
        noDocs: "No documents listed.",
      },
    },
  },

  /* ════════════════════════════════════════════
     हिंदी  (HINDI)
  ════════════════════════════════════════════ */
  hi: {
    nav: {
      login: "लॉगिन",
      logout: "लॉगआउट",
      schemes: "योजनाएं",
      insurance: "बीमा",
      howItWorks: "यह कैसे काम करता है",
      impact: "प्रभाव",
      checkEligibility: "पात्रता जांचें",
    },

    hero: {
      title1: "सही योजना खोजें",
      title2: "अपने खेत के लिए",
      subtitle: "सरकारी कृषि योजनाओं, सब्सिडी और बीमा कार्यक्रमों में खोजें",
      searchPlaceholder: "योजना का नाम दर्ज करें...",
      searchBtn: "खोजें",
    },

    schemes: {
      heading: "उपलब्ध योजनाएं",
      showing: (n, total) => `${total} में से ${n} योजनाएं दिखाई जा रही हैं`,
      filters: "फ़िल्टर",
      filtersDesc: "स्थान, प्रकार या फसल के आधार पर योजनाएं खोजें।",
      active: "सक्रिय",
      state: "राज्य",
      supportType: "सहायता प्रकार",
      crop: "फसल",
      eligibility: "पात्रता",
      allSchemes: "सभी योजनाएं",
      eligibleOnly: "केवल पात्र",
      notEligible: "पात्र नहीं",
      clearFilters: "सभी फ़िल्टर हटाएं",
      sortDefault: "क्रम: डिफ़ॉल्ट",
      sortAZ: "क्रम: अ → ज",
      sortZA: "क्रम: ज → अ",
      loading: "योजनाएं लोड हो रही हैं...",
      noResults: "कोई योजना नहीं मिली",
      noResultsHint: "फ़िल्टर या खोज बदलकर देखें",
      prev: "← पिछला",
      next: "अगला →",
    },

    landing: {
      heroTitle: "कृषिकल्चर",
      heroSubtitle:
        "न्यूनतम जानकारी और स्मार्ट तकनीक के माध्यम से किसानों के लिए सरकारी योजनाओं, बीमा और वित्तीय सहायता तक पहुंच को सरल बनाना।",
      checkYourEligibility: "अपनी पात्रता जांचें",
      exploreSchemes: "योजनाएं देखें",
      heroNote: "कोई जटिल फॉर्म नहीं। कोई भ्रम नहीं। बस सही सहायता।",

      challengeLabel: "चुनौती",
      challengeTitle: "किसानों को लाभ पाने में क्यों होती है कठिनाई",
      challengeDesc:
        "जटिल प्रक्रियाओं, बिखरी जानकारी और लंबी कागज़ी कार्रवाई के कारण किसान अक्सर सरकारी योजनाओं और बीमा लाभों से वंचित रह जाते हैं।",

      solutionLabel: "समाधान",
      solutionTitle: "हमारा समाधान",
      solutionDesc:
        "हमारा प्लेटफ़ॉर्म 2-3 स्मार्ट फ़िल्टर का उपयोग करके किसानों को तुरंत राज्य व केंद्र सरकार की योजनाओं, बीमा और वित्तीय सहायता से जोड़ता है।",

      featuresLabel: "मुख्य विशेषताएं",
      featuresTitle: "आधुनिक कृषि के लिए डिज़ाइन",
      viewAllFeatures: "सभी विशेषताएं देखें",

      impactLabel: "हमारा प्रभाव",
      impactTitle: "मापनीय प्रभाव बनाना",

      ctaTitle: "कृषिकल्चर",
      ctaDesc: "हज़ारों किसानों से जुड़ें जो AgriScheme के ज़रिए अपना वित्तीय भविष्य सुरक्षित कर रहे हैं।",
      ctaBtn: "अभी शुरू करें",
      ctaVerified: "प्रमाणित पोर्टल",
      ctaSecure: "सुरक्षित डेटा",

      footerDesc: "हर किसान के दरवाज़े तक शासन का लाभ पहुंचाने के लिए समर्पित।",
      platform: "प्लेटफ़ॉर्म",
      resources: "संसाधन",
      connect: "संपर्क",
      copyright: "© 2024 AgriScheme एक्सेस प्लेटफ़ॉर्म। सर्वाधिकार सुरक्षित।",
      privacyPolicy: "गोपनीयता नीति",
      termsOfService: "सेवा की शर्तें",
      accessibility: "अभिगम्यता",

      challenges: [
        { title: "जटिल दस्तावेज़", desc: "बहुत सारे फॉर्म और भ्रामक कानूनी आवश्यकताएं।" },
        { title: "केंद्रीकृत जानकारी का अभाव", desc: "जानकारी अलग-अलग विभागों में बिखरी हुई है।" },
        { title: "समय लेने वाली प्रक्रिया", desc: "सरल अनुमोदन के लिए भी महीनों इंतजार करना पड़ता है।" },
        { title: "डिजिटल बाधाएं", desc: "मोबाइल पर नेविगेट करना कठिन जटिल पोर्टल।" },
      ],
      steps: [
        { title: "बुनियादी विवरण दर्ज करें", desc: "बस अपना राज्य, भूमि का आकार और फसल का प्रकार बताएं।" },
        { title: "सिफारिशें पाएं", desc: "अपनी खेती के प्रोफ़ाइल के अनुसार तुरंत योजनाएं देखें।" },
        { title: "आत्मविश्वास के साथ आवेदन करें", desc: "पूर्व-भरे दस्तावेज़ों के साथ एक क्लिक में आवेदन करें।" },
      ],
      features: [
        { title: "न्यूनतम डेटा आवश्यकता", desc: "सैकड़ों विवरण याद रखने की ज़रूरत नहीं। सत्यापन के लिए केवल बुनियादी जानकारी।" },
        { title: "स्मार्ट मिलान प्रणाली", desc: "AI-संचालित इंजन जो वे लाभ ढूंढता है जिनके बारे में आप नहीं जानते थे।" },
        { title: "एकीकृत सहायता खोजक", desc: "सरकारी सब्सिडी के साथ बीमा और वित्तीय ऋण विकल्प खोजें।" },
        { title: "राज्य-विशिष्ट सिफारिशें", desc: "क्षेत्र और कृषि जलवायु क्षेत्र के अनुसार स्थानीय योजनाएं।" },
        { title: "उपयोगकर्ता-अनुकूल इंटरफ़ेस", desc: "सभी तकनीकी पृष्ठभूमि के किसानों के लिए सरल, स्वच्छ नेविगेशन।" },
        { title: "कम डिजिटल बाधाएं", desc: "कम बैंडविड्थ क्षेत्रों के लिए अनुकूलित, बेसिक स्मार्टफोन पर भी काम करता है।" },
      ],
      metrics: [
        { value: "95%", label: "सुव्यवस्थित पहुंच", desc: "पात्र योजनाओं की पहचान में सफलता दर" },
        { value: "-80%", label: "कम समय", desc: "मैन्युअल की तुलना में तेज़ आवेदन प्रसंस्करण" },
        { value: "3X", label: "बेहतर जागरूकता", desc: "प्रति किसान योजना उपयोग में वृद्धि" },
        { value: "$2B+", label: "वित्तीय समावेश", desc: "पोर्टल के माध्यम से कुल सुविधा प्राप्त लाभ" },
      ],
      platformLinks: ["उपलब्ध योजनाएं", "बीमा योजनाएं", "पात्रता जांचकर्ता", "वित्तीय सहायता"],
      resourceLinks: ["खेती के टिप्स", "सफलता की कहानियां", "सहायता केंद्र", "नीति अपडेट"],
    },

    card: {
      eligible: "✓ पात्र",
      notEligible: "पात्र नहीं",
      financialAssistance: "वित्तीय सहायता",
      more: (n) => `+${n} और`,
      minAcre: (n) => `न्यूनतम ${n} एकड़`,
      applyNow: "आवेदन करें",
      allIndia: "सम्पूर्ण भारत",
      noDescription: "कोई विवरण उपलब्ध नहीं",
    },

    schemeDetail: {
      loading: "लोड हो रहा है...",
      schemeSection: "योजना अनुभाग",
      back: "← योजनाओं पर वापस जाएं",
      financialAssistance: "वित्तीय सहायता",
      applyNow: "आवेदन करें →",
      minAcre: (n) => `न्यूनतम ${n} एकड़`,
      sidebar: {
        details: "विवरण",
        benefits: "लाभ",
        eligibility: "पात्रता",
        process: "आवेदन प्रक्रिया",
        docs: "आवश्यक दस्तावेज़",
      },
      content: {
        detailsHeading: "विवरण",
        noDescription: "कोई विवरण उपलब्ध नहीं।",
        benefitsHeading: "लाभ",
        noBenefits: "कोई लाभ सूचीबद्ध नहीं।",
        maxLimit: "अधिकतम सीमा:",
        agency: "एजेंसी:",
        disbursingAuthority: "वितरण प्राधिकरण:",
        eligibilityHeading: "पात्रता",
        noEligibility: "कोई पात्रता शर्तें उपलब्ध नहीं।",
        processHeading: "आवेदन प्रक्रिया",
        mode: "माध्यम:",
        portal: "पोर्टल:",
        visitPortal: "पोर्टल देखें →",
        checkStatus: "स्थिति जांचें →",
        note: "नोट:",
        docsHeading: "आवश्यक दस्तावेज़",
        noDocs: "कोई दस्तावेज़ सूचीबद्ध नहीं।",
      },
    },
  },

  /* ════════════════════════════════════════════
     मराठी  (MARATHI)
  ════════════════════════════════════════════ */
  mr: {
    nav: {
      login: "लॉगिन",
      logout: "लॉगआउट",
      schemes: "योजना",
      insurance: "विमा",
      howItWorks: "हे कसे कार्य करते",
      impact: "परिणाम",
      checkEligibility: "पात्रता तपासा",
    },

    hero: {
      title1: "योग्य योजना शोधा",
      title2: "तुमच्या शेतासाठी",
      subtitle: "सरकारी कृषी योजना, अनुदान आणि विमा कार्यक्रमांमध्ये शोधा",
      searchPlaceholder: "योजनेचे नाव प्रविष्ट करा...",
      searchBtn: "शोधा",
    },

    schemes: {
      heading: "उपलब्ध योजना",
      showing: (n, total) => `${total} पैकी ${n} योजना दाखवत आहे`,
      filters: "फिल्टर",
      filtersDesc: "स्थान, प्रकार किंवा पीक यानुसार योजना शोधा.",
      active: "सक्रिय",
      state: "राज्य",
      supportType: "समर्थन प्रकार",
      crop: "पीक",
      eligibility: "पात्रता",
      allSchemes: "सर्व योजना",
      eligibleOnly: "केवळ पात्र",
      notEligible: "पात्र नाही",
      clearFilters: "सर्व फिल्टर काढा",
      sortDefault: "क्रम: डिफॉल्ट",
      sortAZ: "क्रम: अ → ज",
      sortZA: "क्रम: ज → अ",
      loading: "योजना लोड होत आहेत...",
      noResults: "कोणतीही योजना सापडली नाही",
      noResultsHint: "फिल्टर किंवा शोध बदलून पहा",
      prev: "← मागील",
      next: "पुढील →",
    },

    landing: {
      heroTitle: "कृषिकल्चर",
      heroSubtitle:
        "किमान माहिती आणि स्मार्ट तंत्रज्ञानाद्वारे शेतकऱ्यांसाठी सरकारी योजना, विमा आणि आर्थिक सहाय्यापर्यंत प्रवेश सुलभ करणे.",
      checkYourEligibility: "तुमची पात्रता तपासा",
      exploreSchemes: "योजना पाहा",
      heroNote: "जटिल फॉर्म नाहीत. गोंधळ नाही. फक्त योग्य सहाय्य.",

      challengeLabel: "आव्हान",
      challengeTitle: "शेतकऱ्यांना फायदे मिळवण्यात का अडचण येते",
      challengeDesc:
        "जटिल प्रक्रिया, विखुरलेली माहिती आणि दीर्घ कागदपत्रांमुळे शेतकरी अनेकदा सरकारी योजना आणि विमा लाभांपासून वंचित राहतात.",

      solutionLabel: "उपाय",
      solutionTitle: "आमचा उपाय",
      solutionDesc:
        "आमचे व्यासपीठ 2-3 स्मार्ट फिल्टर वापरून शेतकऱ्यांना तत्काळ राज्य व केंद्र सरकारच्या योजना, विमा आणि आर्थिक सहाय्याशी जोडते.",

      featuresLabel: "मुख्य वैशिष्ट्ये",
      featuresTitle: "आधुनिक शेतीसाठी डिझाइन",
      viewAllFeatures: "सर्व वैशिष्ट्ये पाहा",

      impactLabel: "आमचा परिणाम",
      impactTitle: "मोजता येण्याजोगा परिणाम निर्माण करणे",

      ctaTitle: "कृषिकल्चर",
      ctaDesc: "हजारो शेतकऱ्यांसोबत सामील व्हा जे AgriScheme द्वारे त्यांचे आर्थिक भविष्य सुरक्षित करत आहेत.",
      ctaBtn: "आत्ता सुरुवात करा",
      ctaVerified: "प्रमाणित पोर्टल",
      ctaSecure: "सुरक्षित डेटा",

      footerDesc: "प्रत्येक शेतकऱ्याच्या दारापर्यंत शासनाचे फायदे पोहोचवण्यासाठी समर्पित.",
      platform: "व्यासपीठ",
      resources: "संसाधने",
      connect: "संपर्क",
      copyright: "© 2024 AgriScheme ॲक्सेस प्लॅटफॉर्म. सर्व हक्क राखीव.",
      privacyPolicy: "गोपनीयता धोरण",
      termsOfService: "सेवेच्या अटी",
      accessibility: "प्रवेशयोग्यता",

      challenges: [
        { title: "जटिल कागदपत्रे", desc: "खूप जास्त फॉर्म आणि गोंधळात टाकणाऱ्या कायदेशीर आवश्यकता." },
        { title: "केंद्रीकृत माहितीचा अभाव", desc: "माहिती वेगवेगळ्या विभागांमध्ये विखुरलेली आहे." },
        { title: "वेळखाऊ प्रक्रिया", desc: "साध्या मंजुरींसाठीही महिने प्रतीक्षा करावी लागते." },
        { title: "डिजिटल अडथळे", desc: "मोबाइलवर नेव्हिगेट करणे कठीण असलेले जटिल पोर्टल." },
      ],
      steps: [
        { title: "मूलभूत तपशील प्रविष्ट करा", desc: "फक्त तुमचे राज्य, जमिनीचा आकार आणि पिकाचा प्रकार द्या." },
        { title: "शिफारसी मिळवा", desc: "तुमच्या शेत प्रोफाइलनुसार तत्काळ योजना पाहा." },
        { title: "आत्मविश्वासाने अर्ज करा", desc: "पूर्व-भरलेल्या कागदपत्रांसह एक क्लिकमध्ये अर्ज करा." },
      ],
      features: [
        { title: "किमान डेटा आवश्यकता", desc: "शेकडो तपशील लक्षात ठेवण्याची गरज नाही. फक्त मूलभूत माहिती." },
        { title: "स्मार्ट जुळवणी प्रणाली", desc: "AI-चालित इंजिन जे तुम्हाला माहीत नसलेले फायदे शोधते." },
        { title: "एकात्मिक सहाय्य शोधक", desc: "सरकारी अनुदानासोबत विमा व आर्थिक कर्ज पर्याय शोधा." },
        { title: "राज्य-विशिष्ट शिफारसी", desc: "प्रदेश आणि कृषी हवामान क्षेत्रानुसार स्थानिक योजना." },
        { title: "वापरकर्ता-अनुकूल इंटरफेस", desc: "सर्व तांत्रिक पार्श्वभूमीच्या शेतकऱ्यांसाठी सोपे नेव्हिगेशन." },
        { title: "कमी डिजिटल अडथळे", desc: "कमी बँडविड्थ क्षेत्रांसाठी ऑप्टिमाइज्ड, साध्या स्मार्टफोनवर काम करते." },
      ],
      metrics: [
        { value: "95%", label: "सुव्यवस्थित प्रवेश", desc: "पात्र योजना ओळखण्यातील यशाचा दर" },
        { value: "-80%", label: "कमी वेळ", desc: "मॅन्युअलच्या तुलनेत जलद अर्ज प्रक्रिया" },
        { value: "3X", label: "सुधारित जागरूकता", desc: "प्रति शेतकरी योजना वापरात वाढ" },
        { value: "$2B+", label: "आर्थिक समावेश", desc: "पोर्टलद्वारे एकूण सुविधा मिळालेले फायदे" },
      ],
      platformLinks: ["उपलब्ध योजना", "विमा योजना", "पात्रता तपासक", "आर्थिक सहाय्य"],
      resourceLinks: ["शेतीच्या टिप्स", "यशोगाथा", "मदत केंद्र", "धोरण अपडेट"],
    },

    card: {
      eligible: "✓ पात्र",
      notEligible: "पात्र नाही",
      financialAssistance: "आर्थिक सहाय्य",
      more: (n) => `+${n} अधिक`,
      minAcre: (n) => `किमान ${n} एकर`,
      applyNow: "अर्ज करा",
      allIndia: "संपूर्ण भारत",
      noDescription: "कोणताही तपशील उपलब्ध नाही",
    },

    schemeDetail: {
      loading: "लोड होत आहे...",
      schemeSection: "योजना विभाग",
      back: "← योजनांकडे परत जा",
      financialAssistance: "आर्थिक सहाय्य",
      applyNow: "अर्ज करा →",
      minAcre: (n) => `किमान ${n} एकर`,
      sidebar: {
        details: "तपशील",
        benefits: "फायदे",
        eligibility: "पात्रता",
        process: "अर्ज प्रक्रिया",
        docs: "आवश्यक कागदपत्रे",
      },
      content: {
        detailsHeading: "तपशील",
        noDescription: "कोणताही तपशील उपलब्ध नाही.",
        benefitsHeading: "फायदे",
        noBenefits: "कोणतेही फायदे सूचीबद्ध नाहीत.",
        maxLimit: "कमाल मर्यादा:",
        agency: "एजन्सी:",
        disbursingAuthority: "वितरण प्राधिकरण:",
        eligibilityHeading: "पात्रता",
        noEligibility: "कोणत्याही पात्रता अटी उपलब्ध नाहीत.",
        processHeading: "अर्ज प्रक्रिया",
        mode: "माध्यम:",
        portal: "पोर्टल:",
        visitPortal: "पोर्टल पाहा →",
        checkStatus: "स्थिती तपासा →",
        note: "टीप:",
        docsHeading: "आवश्यक कागदपत्रे",
        noDocs: "कोणतीही कागदपत्रे सूचीबद्ध नाहीत.",
      },
    },
  },
}


export function LanguageProvider({ children }) {
  return <>{children}</>
}

export const useLang = () => {
  const { t, i18n } = useTranslation()
  return { lang: i18n.language, setLang: i18n.changeLanguage.bind(i18n), t }
}
