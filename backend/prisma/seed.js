const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const categories = [
  {
    name: "General Waste",
    icon: "🗑️",
    description: "Everyday household waste that doesn't fit other categories.",
  },
  {
    name: "Recyclable Waste",
    icon: "♻️",
    description: "Paper, cardboard, glass, metal and plastic that can be recycled.",
  },
  {
    name: "Organic/Wet Waste",
    icon: "🥬",
    description: "Food scraps, garden waste and other biodegradable material.",
  },
  {
    name: "E-Waste",
    icon: "🔌",
    description: "Electronic devices, batteries, cables and other electronic items.",
  },
  {
    name: "Hazardous Waste",
    icon: "🧪",
    description: "Chemicals, paints, and other materials requiring special handling.",
  },
  {
    name: "Bulk Waste",
    icon: "🪑",
    description: "Large items such as furniture, mattresses and appliances.",
  },
];

const timeSlots = ["09:00 AM – 12:00 PM", "12:00 PM – 03:00 PM", "03:00 PM – 06:00 PM"];
const statuses = ["PENDING", "SCHEDULED", "PICKED_UP", "COMPLETED", "CANCELLED"];

function pad(num, size) {
  return num.toString().padStart(size, "0");
}

async function main() {
  console.log("Seeding database...");

  // Clear existing data (order matters due to FKs)
  await prisma.statusHistory.deleteMany();
  await prisma.pickupRequest.deleteMany();
  await prisma.wasteCategory.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const createdCategories = [];
  for (const cat of categories) {
    const c = await prisma.wasteCategory.create({ data: cat });
    createdCategories.push(c);
  }
  console.log(`Created ${createdCategories.length} waste categories`);

  // Create demo users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@wasteapp.com",
      phone: "9999999999",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "user@wasteapp.com",
      phone: "8888888888",
      password: userPassword,
      role: "USER",
    },
  });

  // A couple of extra sample users for variety
  const extraUsers = [];
  const names = ["Rahul Sharma", "Priya Nair", "Amit Verma"];
  for (const n of names) {
    const u = await prisma.user.create({
      data: {
        name: n,
        email: `${n.split(" ")[0].toLowerCase()}@example.com`,
        phone: "70000000" + Math.floor(Math.random() * 90 + 10),
        password: userPassword,
        role: "USER",
      },
    });
    extraUsers.push(u);
  }

  const allUsers = [demoUser, ...extraUsers];
  const cities = ["Navi Mumbai", "Pune", "Thane", "Mumbai"];

  console.log("Creating sample pickup requests...");
  for (let i = 1; i <= 10; i++) {
    const user = allUsers[i % allUsers.length];
    const category = createdCategories[i % createdCategories.length];
    const status = statuses[i % statuses.length];
    const requestId = `WCR-2026-${pad(i, 4)}`;

    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + (i % 7) - 3);

    const request = await prisma.pickupRequest.create({
      data: {
        requestId,
        userId: user.id,
        categoryId: category.id,
        quantity: ["Small bag", "2-3 items", "Medium load", "1 large item"][i % 4],
        description: `Sample request #${i} for ${category.name}`,
        address: `${100 + i} Green Street`,
        city: cities[i % cities.length],
        pincode: `4000${10 + i}`,
        contactName: user.name,
        phone: user.phone,
        pickupDate,
        timeSlot: timeSlots[i % timeSlots.length],
        status,
      },
    });

    await prisma.statusHistory.create({
      data: {
        requestId: request.id,
        status: "PENDING",
        note: "Request submitted",
        changedBy: user.name,
      },
    });

    if (status !== "PENDING") {
      await prisma.statusHistory.create({
        data: {
          requestId: request.id,
          status,
          note: `Status updated to ${status}`,
          changedBy: admin.name,
        },
      });
    }
  }

  console.log("Seeding complete!");
  console.log("Demo Admin: admin@wasteapp.com / admin123");
  console.log("Demo User:  user@wasteapp.com / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
