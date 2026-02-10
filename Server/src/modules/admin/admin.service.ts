import prisma from "../../config/db.js";

interface CreateSchemeInput {
  scheme_id: string;
  scheme_name: string;
  state?: string;
  category: "SUBSIDY" | "INSURANCE" | "WELFARE";
  min_land_acres?: number;
  supported_crops?: string[];

  details: any;
  benefits: any;
  eligibility: any;
  application_process: any;
  documents_required: any;
}

export const createSchemeService = async (input: CreateSchemeInput) => {
  const {
    scheme_id,
    scheme_name,
    state,
    category,
    min_land_acres,
    supported_crops = [],
    details,
    benefits,
    eligibility,
    application_process,
    documents_required
  } = input;

  // ✅ Basic validation
  if (!scheme_id || !scheme_name || !category) {
    throw new Error("scheme_id, scheme_name and category are required");
  }

  // ✅ Check duplicate
  const existingScheme = await prisma.scheme.findUnique({
    where: { schemeId: scheme_id }
  });

  if (existingScheme) {
    throw new Error("Scheme with this scheme_id already exists");
  }

  if (!details || !benefits || !application_process) {
  throw new Error("Incomplete scheme content: details, benefits and application_process are required");
  }

  if (!Array.isArray(documents_required)) {
    throw new Error("documents_required must be an array");
  }


  // ✅ Create scheme (NO TRANSACTION)
const normalizedCrops =
  supported_crops?.map((crop) => crop.toUpperCase()) || [];

const scheme = await prisma.scheme.create({
  data: {
    schemeId: scheme_id,
    schemeName: scheme_name,
    state,
    category,
    minLandAcres: min_land_acres,
    supportedCrops: normalizedCrops as any
  }
});


  // ✅ Create scheme content
  await prisma.schemeContent.create({
    data: {
      schemeId: scheme.id,
      details,
      benefits,
      eligibility,
      applicationProcess: application_process,
      documentsRequired: documents_required
    }
  });

  return scheme;
};
