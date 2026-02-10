import prisma from "../../config/db.js";

export const getAllSchemesService = async (farmer: any) => {
  const where: any = {
    isActive: true
  };

  // ✅ State filter (only if farmer has state)
  if (farmer?.state) {
    where.OR = [
      { state: farmer.state },
      { state: null } // central schemes
    ];
  }

  // ✅ Land filter (only if farmer has land data)
  if (
    farmer?.landSizeAcres !== null &&
    farmer?.landSizeAcres !== undefined
  ) {
    where.minLandAcres = {
      lte: farmer.landSizeAcres
    };
  }

  // ✅ Crop filter (only if farmer selected crops)
  if (farmer?.crops && farmer.crops.length > 0) {
    where.supportedCrops = {
      hasSome: farmer.crops
    };
  }

return prisma.scheme.findMany({
  where,
  include: {
    content: true
  },
  orderBy: {
    createdAt: "desc"
  }
});

};

export const getSchemeByIdService = async (schemeId: string) => {
  return prisma.scheme.findUnique({
    where: { schemeId },
    include: {
      content: true
    }
  });
};
