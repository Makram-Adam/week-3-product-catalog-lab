// Week 3 Lab: MongoDB Product Catalog

// Select the shop database
use shop

// Insert products
db.products.insertMany([
  {
    name: "Laptop Pro",
    category: "Electronics",
    price: 1299.99,
    stock: 45,
    tags: ["work", "portable"],
    ratings: [
      { u: "a", s: 5 },
      { u: "b", s: 4 }
    ]
  },
  {
    name: "Headphones",
    category: "Electronics",
    price: 89.99,
    stock: 200,
    tags: ["audio"],
    ratings: [
      { u: "c", s: 5 }
    ]
  },
  {
    name: "Standing Desk",
    category: "Furniture",
    price: 549.00,
    stock: 12,
    tags: ["ergonomic"],
    ratings: [
      { u: "d", s: 4 }
    ]
  }
])

// Query: Electronics products under $200
db.products.find(
  {
    category: "Electronics",
    price: { $lt: 200 }
  },
  {
    name: 1,
    price: 1,
    _id: 0
  }
)

// Aggregation: Average rating by category
db.products.aggregate([
  { $unwind: "$ratings" },
  {
    $group: {
      _id: "$category",
      avg: { $avg: "$ratings.s" },
      n: { $sum: 1 }
    }
  },
  {
    $project: {
      category: "$_id",
      avg: { $round: ["$avg", 2] },
      n: 1,
      _id: 0
    }
  },
  {
    $sort: { avg: -1 }
  }
])