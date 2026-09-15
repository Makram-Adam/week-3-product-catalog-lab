-- Week 3 Lab: Semantic Search with pgvector

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the product vector table
CREATE TABLE product_vecs (
    name TEXT,
    embedding VECTOR(3)
);

-- Insert product embeddings
INSERT INTO product_vecs (name, embedding) VALUES
    ('Laptop Pro', '[0.9, 0.1, 0.0]'),
    ('Headphones', '[0.8, 0.2, 0.1]'),
    ('Standing Desk', '[0.1, 0.1, 0.9]');

-- Semantic search
-- Find the two products most similar to the search vector
SELECT
    name,
    embedding <=> '[0.85,0.15,0.05]' AS distance
FROM product_vecs
ORDER BY distance
LIMIT 2;