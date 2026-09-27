const { PrismaClient } = require("@prisma/client");
const generateRequestId = require("../utils/generateRequestId");

const prisma = new PrismaClient();

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.wasteCategory.findMany({ orderBy: { name: "asc" } });
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories." });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const {
      categoryId,
      quantity,
      description,
      address,
      city,
      pincode,
      contactName,
      phone,
      pickupDate,
      timeSlot,
    } = req.body;

    if (!categoryId || !address || !city || !pincode || !pickupDate || !timeSlot) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const category = await prisma.wasteCategory.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(400).json({ message: "Invalid waste category selected." });
    }

    const requestId = await generateRequestId();

    const request = await prisma.pickupRequest.create({
      data: {
        requestId,
        userId: req.user.id,
        categoryId,
        quantity,
        description,
        address,
        city,
        pincode,
        contactName,
        phone,
        pickupDate: new Date(pickupDate),
        timeSlot,
        status: "PENDING",
      },
      include: { category: true },
    });

    await prisma.statusHistory.create({
      data: {
        requestId: request.id,
        status: "PENDING",
        note: "Request submitted by user",
        changedBy: req.user.name,
      },
    });

    res.status(201).json({ request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create pickup request." });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await prisma.pickupRequest.findMany({
      where: { userId: req.user.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch requests." });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await prisma.pickupRequest.findFirst({
      where: {
        OR: [{ id }, { requestId: id }],
      },
      include: {
        category: true,
        history: { orderBy: { createdAt: "asc" } },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!request) return res.status(404).json({ message: "Request not found." });

    // Non-admins may only view their own requests
    if (req.user.role !== "ADMIN" && request.userId !== req.user.id) {
      return res.status(403).json({ message: "You do not have access to this request." });
    }

    res.json({ request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch request." });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await prisma.pickupRequest.findUnique({ where: { id } });

    if (!request) return res.status(404).json({ message: "Request not found." });
    if (request.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only cancel your own requests." });
    }
    if (["COMPLETED", "CANCELLED"].includes(request.status)) {
      return res.status(400).json({ message: `Request already ${request.status.toLowerCase()}.` });
    }

    const updated = await prisma.pickupRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: { category: true },
    });

    await prisma.statusHistory.create({
      data: {
        requestId: id,
        status: "CANCELLED",
        note: "Cancelled by user",
        changedBy: req.user.name,
      },
    });

    res.json({ request: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel request." });
  }
};
