const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Generates a unique, sequential request ID in the form WCR-YYYY-0001
 */
async function generateRequestId() {
  const year = new Date().getFullYear();
  const prefix = `WCR-${year}-`;

  const existingRequests = await prisma.pickupRequest.findMany({
    where: {
      requestId: {
        startsWith: prefix,
      },
    },
    select: {
      requestId: true,
    },
  });

  let maxNum = 0;
  for (const r of existingRequests) {
    const suffix = r.requestId.slice(prefix.length);
    const num = parseInt(suffix, 10);
    if (!isNaN(num) && num > maxNum) {
      maxNum = num;
    }
  }

  const nextNumber = (maxNum + 1).toString().padStart(4, "0");
  return `${prefix}${nextNumber}`;
}

module.exports = generateRequestId;
