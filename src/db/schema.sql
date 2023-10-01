CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create category table
CREATE TABLE IF NOT EXISTS category (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    category_slug VARCHAR(120) NOT NULL UNIQUE,
    parent_cateogry_id UUID REFERENCES category(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger function to update category updated_at
CREATE OR REPLACE FUNCTION update_category_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on UPDATE
CREATE TRIGGER category_updated_at_trigger
BEFORE UPDATE ON category
FOR EACH ROW
EXECUTE FUNCTION update_category_updated_at();

-- Create brand table
CREATE TABLE brand (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brand_name VARCHAR(50) NOT NULL UNIQUE,
    brand_slug VARCHAR(80) NOT NULL UNIQUE
);

-- Create product_image table with one-to-one relationship
CREATE TABLE IF NOT EXISTS product_image (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url VARCHAR(300) NOT NULL UNIQUE
);



-- Create product table
CREATE TABLE IF NOT EXISTS product (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_slug VARCHAR(150) NOT NULL UNIQUE,
    product_description TEXT,
    thumbnail UUID REFERENCES product_image(id),
    brand_id UUID REFERENCES brand(id),
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    is_trending BOOLEAN,
    is_published BOOLEAN,
    is_featured BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create trigger function to update product updated_at
CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE product
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create product_category table for many-to-many relationship
CREATE TABLE IF NOT EXISTS product_category (
    product_id UUID REFERENCES product(id),
    category_id UUID REFERENCES category(id),
    PRIMARY KEY (product_id, category_id)
);




-- Create subcategory table with one-to-many relationship to product
CREATE TABLE IF NOT EXISTS sub_product (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    price DECIMAL(10, 2) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    quantity INTEGER NOT NULL,
    product_id UUID REFERENCES product(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger function to update subcategory updated_at
CREATE OR REPLACE FUNCTION update_sub_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on UPDATE
CREATE TRIGGER sub_product_updated_at_trigger
BEFORE UPDATE ON sub_product
FOR EACH ROW
EXECUTE FUNCTION update_sub_product_updated_at();


-- Create attribute table
CREATE TABLE IF NOT EXISTS product_attribute (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    attribute_name VARCHAR(60) NOT NULL
);

-- Create attribute_value table
CREATE TABLE IF NOT EXISTS attribute_value (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    attribute_value VARCHAR(60) NOT NULL,
    product_attribute_id UUID REFERENCES product_attribute(id)
);

-- Create category_product_attribute table for many-to-many relationship
CREATE TABLE IF NOT EXISTS category_product_attribute (
    category_id UUID REFERENCES category(id),
    product_attribute_id UUID REFERENCES product_attribute(id),
    PRIMARY KEY (category_id, product_attribute_id)
);

-- Create subcategory_attribute_value table for many-to-many relationship
CREATE TABLE IF NOT EXISTS sub_product_attribute_value (
    sub_product_id UUID REFERENCES sub_product(id),
    attribute_value_id UUID REFERENCES attribute_value(id),
    PRIMARY KEY (sub_product_id, attribute_value_id)
);

-- Assume product_image table already exists

-- Alter product_image table to add subproduct_id column with foreign key constraint
ALTER TABLE product_image
ADD COLUMN sub_product_id UUID REFERENCES sub_product(id);