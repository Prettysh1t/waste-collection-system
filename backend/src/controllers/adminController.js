const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const STATUS_FLOW = ["PENDING", "SCHEDULED", "PICKED_UP", "COMPLETED"];

exports.getAllRequests = async (req, res) => {
  try {
    const { search, status, category, date } = req.query;

    const where = {};

    if (status) where.status = status;
    if (category) where.categoryId = category;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      where.pickupDate = { gte: start, lt: end };
    }

    if (search) {
      where.OR = [
        { requestId: { contains: search } },
        { contactName: { contains: search } },
        { phone: { contains: search } },
        { user: { name: { contains: search } } },
      ];
    }

    const requests = await prisma.pickupRequest.findMany({
      where,
      include: { category: true, user: { select: { id: true, name: true, email: true, phone: true } } },
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
      where: { OR: [{ id }, { requestId: id }] },
      include: {
        category: true,
        history: { orderBy: { createdAt: "asc" } },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
    if (!request) return res.status(404).json({ message: "Request not found." });
    res.json({ request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch request." });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ["PENDING", "SCHEDULED", "PICKED_UP", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const request = await prisma.pickupRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ message: "Request not found." });

    const updated = await prisma.pickupRequest.update({
      where: { id },
      data: { status },
      include: { category: true, user: { select: { id: true, name: true, email: true, phone: true } } },
    });

    await prisma.statusHistory.create({
      data: {
        requestId: id,
        status,
        note: note || `Status updated to ${status}`,
        changedBy: req.user.name,
      },
    });

    res.json({ request: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status." });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const total = await prisma.pickupRequest.count();

    const statusCounts = {};
    const statuses = ["PENDING", "SCHEDULED", "PICKED_UP", "COMPLETED", "CANCELLED"];
    for (const s of statuses) {
      statusCounts[s] = await prisma.pickupRequest.count({ where: { status: s } });
    }

    const categories = await prisma.wasteCategory.findMany();
    const categoryDistribution = [];
    for (const cat of categories) {
      const count = await prisma.pickupRequest.count({ where: { categoryId: cat.id } });
      categoryDistribution.push({
        name: cat.name,
        icon: cat.icon,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      });
    }

    res.json({
      total,
      statusCounts,
      categoryDistribution,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch statistics." });
  }
};
