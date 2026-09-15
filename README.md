# Week 3 Product Catalog Lab

## Hands-On Lab: MongoDB, Redis, and PostgreSQL with pgvector

**Student:** Makram Adam  
**Course:** Software Engineering  
**Week:** 3  
**Project:** Product Catalog, Redis Cache, and Semantic Search  
**GitHub:** Makram-Adam

---

## 📌 Project Overview

This project is a hands-on database lab that demonstrates how different database technologies can be used together in a modern e-commerce application.

The project uses three main technologies:

1. **MongoDB** — for storing and querying product catalog data.
2. **Redis** — for caching, product price rankings, and real-time Pub/Sub messaging.
3. **PostgreSQL with pgvector** — for storing vector embeddings and performing semantic similarity searches.

The goal of this lab is to gain practical experience working with different types of databases and understand how each technology can solve a specific problem.

---

# 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| MongoDB | Product catalog and document-based data |
| Mongosh | MongoDB command-line shell |
| Redis / Memurai | Caching, sorted sets, and Pub/Sub |
| PostgreSQL | Relational database |
| pgvector | Vector similarity and semantic search |
| VS Code | Code editing and project development |
| Git | Version control |
| GitHub | Project hosting and submission |

# 1. 🍃 MongoDB Product Catalog
Objective

MongoDB was used to create an e-commerce product catalog.

MongoDB is a document-oriented NoSQL database. It allows product information to be stored in flexible documents.

The database used in this project is:

shop

The collection is:

products
Product Data

Three products were added to the catalog:

Laptop Pro
Category: Electronics
Price: $1299.99
Stock: 45
Tags: work, portable
Ratings: 5, 4
Headphones
Category: Electronics
Price: $89.99
Stock: 200
Tags: audio
Rating: 5
Standing Desk
Category: Furniture
Price: $549.00
Stock: 12
Tags: ergonomic
Rating: 4
MongoDB Insert Operation

The products were inserted using:

use shop

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
MongoDB Filtering

The project searches for products that:

Belong to the Electronics category
Cost less than $200

The query used was:

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
Result

The query returned:

Headphones
Price: $89.99

This demonstrates how MongoDB can filter documents using multiple conditions.

MongoDB Aggregation

An aggregation pipeline was used to calculate the average rating for each product category.

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
Aggregation Results
Category	Average Rating	Number of Ratings
Electronics	4.67	3
Furniture	4.00	1

The aggregation demonstrates how MongoDB can process and summarize data using pipelines.

2. ⚡ Redis Cache
Objective

Redis was used to demonstrate fast in-memory data storage.

Redis can be useful for caching frequently accessed information so that applications do not need to query the main database every time.

In this lab, the product catalog count was stored in Redis.

Storing the Catalog Count

The following command stores the value 3 for 300 seconds:

SET catalog:count 3 EX 300

The value can then be retrieved using:

GET catalog:count
Result
3

The EX 300 option gives the cached value a 300-second expiration time.

3. 🏆 Redis Sorted Set

Redis sorted sets were used to rank products according to their prices.

The following command was used:

ZADD products:byprice 1299.99 laptop 89.99 headphones 549 desk

The products were then retrieved from the highest price to the lowest price using:

ZREVRANGE products:byprice 0 -1 WITHSCORES
Result
laptop
1299.99

desk
549

headphones
89.99
Price Ranking
Rank	Product	Price
1	Laptop Pro	$1299.99
2	Standing Desk	$549.00
3	Headphones	$89.99

This demonstrates how Redis sorted sets can be used to create rankings and leaderboards.

4. 📢 Redis Pub/Sub

Redis Pub/Sub was used to demonstrate real-time communication between different terminals or application components.

The subscriber listens to the inventory channel.

Terminal 1
SUBSCRIBE inventory
Terminal 2

The following message was published:

PUBLISH inventory "Laptop Pro stock updated to 44"

The subscriber received the inventory update.

Example Message
Laptop Pro stock updated to 44

This demonstrates how Redis Pub/Sub can be used for real-time notifications, such as:

Inventory updates
Notifications
Application events
Live status updates
5. 🐘 PostgreSQL with pgvector
Objective

PostgreSQL was used together with the pgvector extension to demonstrate semantic search.

Semantic search uses vector representations to find items that are similar to a search query.

Enabling pgvector

The pgvector extension was enabled using:

CREATE EXTENSION IF NOT EXISTS vector;
Creating the Vector Table

A table called product_vecs was created:

CREATE TABLE product_vecs (
    name TEXT,
    embedding VECTOR(3)
);

The embedding column stores three-dimensional vector values.

Adding Product Embeddings

The following products and embeddings were inserted:

INSERT INTO product_vecs (name, embedding) VALUES
    ('Laptop Pro', '[0.9, 0.1, 0.0]'),
    ('Headphones', '[0.8, 0.2, 0.1]'),
    ('Standing Desk', '[0.1, 0.1, 0.9]');
6. 🔎 Semantic Search

A search vector was created:

[0.85, 0.15, 0.05]

The following SQL query was used:

SELECT
    name,
    embedding <=> '[0.85,0.15,0.05]' AS distance
FROM product_vecs
ORDER BY distance
LIMIT 2;

The <=> operator calculates vector distance.

Products with smaller distances are more similar to the search vector.

Semantic Search Result

The two most similar products were:

1. Laptop Pro
2. Headphones

This demonstrates how vector similarity can be used to find products that are close to a search query.

7. 🔗 How the Technologies Work Together

The three database technologies can serve different purposes in the same application.

                    E-Commerce Application
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
         MongoDB         Redis        PostgreSQL
             │              │              │
             │              │              │
       Product Data       Cache       Vector Search
       Catalog            Ranking      Semantic Search
                          Pub/Sub
MongoDB

Stores flexible product information such as:

Product name
Category
Price
Stock
Tags
Ratings
Redis

Provides fast operations such as:

Caching
Product rankings
Real-time notifications
PostgreSQL + pgvector

Provides:

Vector storage
Similarity calculations
Semantic search
8. 💡 What I Learned

Through this lab, I learned how different database technologies can be used for different application requirements.

MongoDB

I learned how to:

Create and use a MongoDB database
Insert multiple documents
Query documents
Filter data
Use aggregation pipelines
Calculate average values
Redis

I learned how to:

Store cached values
Set expiration times
Create sorted sets
Rank products
Use Pub/Sub for real-time messaging
PostgreSQL and pgvector

I learned how to:

Enable PostgreSQL extensions
Create vector columns
Store vector embeddings
Calculate vector distances
Perform a basic semantic search
9. 🧪 Lab Results

The main results from the lab were:

MongoDB
Electronics product under $200:
Headphones - $89.99
MongoDB Aggregation
Electronics: 4.67
Furniture: 4.00
Redis Cache
catalog:count = 3
Redis Price Ranking
Laptop Pro   - 1299.99
Standing Desk - 549
Headphones   - 89.99
Redis Pub/Sub
Laptop Pro stock updated to 44
PostgreSQL Semantic Search
Laptop Pro
Headphones
10. 📂 Files in This Repository
mongodb/catalog.js

Contains the MongoDB product catalog operations, including:

Database selection
Product insertion
Product filtering
Aggregation
redis/redis-commands.txt

Contains Redis commands for:

Caching
Sorted sets
Pub/Sub
postgresql/semantic-search.sql

Contains PostgreSQL and pgvector operations for:

Enabling pgvector
Creating the vector table
Inserting embeddings
Performing semantic search
README.md

Contains the documentation and explanation of the complete Week 3 project.

11. ▶️ How to Run the Project
MongoDB

Open MongoDB Shell:

mongosh

Then run the commands from:

mongodb/catalog.js
Redis

Using Memurai Redis CLI:

memurai-cli.exe

Then run the commands from:

redis/redis-commands.txt
PostgreSQL

Open PostgreSQL using pgAdmin or another PostgreSQL client.

Run the SQL commands from:

postgresql/semantic-search.sql

Make sure the vector extension is installed before running the semantic search section.

12. 🎯 Project Objectives Completed

The following objectives were completed:

 Create a MongoDB product catalog
 Insert product documents
 Query and filter MongoDB data
 Perform MongoDB aggregation
 Store data in Redis
 Create a Redis sorted set
 Test Redis Pub/Sub
 Enable PostgreSQL pgvector
 Create vector embeddings
 Perform semantic similarity search
 Document the project
 Organize the project for GitHub
13. 🚀 Future Improvements

If this project were developed into a complete e-commerce application, I would add:

A web-based product catalog
User authentication
Shopping cart functionality
Product images
Product reviews
Product recommendations
REST API integration
More advanced vector embeddings
Search by natural language
Real-time inventory management
Redis caching for frequently accessed products
A frontend using HTML, CSS, and JavaScript
A backend using Python, Django, or another web framework
14. 📚 Conclusion

This Week 3 lab provided practical experience with MongoDB, Redis, and PostgreSQL with pgvector.

MongoDB was useful for storing flexible product documents and performing queries and aggregations. Redis provided fast caching, ranking, and real-time messaging capabilities. PostgreSQL with pgvector demonstrated how vector embeddings can be stored and compared to perform semantic search.

The project shows that different database technologies can work together to solve different problems within the same software application.

This practical experience has helped me understand how databases are used in real-world software engineering projects.

👨‍💻 Author

Makram Adam

Software Engineering Student

GitHub: Makram-Adam