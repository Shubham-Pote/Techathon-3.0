import prisma from "../../config/db.js";

export const getAllSchemesService = async (farmer: any) => {
  const schemes = await prisma.scheme.findMany({
    where: {
      isActive: true
    },
    include: {
      content: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return schemes.map((s) => ({
    scheme_id: s.schemeId,
    scheme_name: s.schemeName,
    state: s.state,
    category: s.category,
    supported_crops: s.supportedCrops,
    details: s.content?.details,
    benefits: s.content?.benefits,
    eligibility: s.content?.eligibility,
    application_process: s.content?.applicationProcess,
    documents_required: s.content?.documentsRequired
  }));
};

export const getSchemeByIdService = async (schemeId: string) => {
  const s = await prisma.scheme.findUnique({
    where: { schemeId },
    include: { content: true }
  });

  if (!s) return null;

  return {
    scheme_id: s.schemeId,
    scheme_name: s.schemeName,
    state: s.state,
    category: s.category,
    supported_crops: s.supportedCrops,

    // ✅ FIXED
    details: s.content?.details,
    benefits: s.content?.benefits,
    eligibility: s.content?.eligibility,
    application_process: s.content?.applicationProcess,
    documents_required: s.content?.documentsRequired
  };
};