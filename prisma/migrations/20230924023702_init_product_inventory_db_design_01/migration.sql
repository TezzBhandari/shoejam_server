-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `category_name` VARCHAR(100) NOT NULL,
    `category_slug` VARCHAR(120) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `parent_category_id` VARCHAR(191) NULL,

    UNIQUE INDEX `Category_category_name_key`(`category_name`),
    UNIQUE INDEX `Category_category_slug_key`(`category_slug`),
    INDEX `Category_category_slug_idx`(`category_slug`),
    INDEX `Category_category_name_idx`(`category_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `product_name` VARCHAR(200) NOT NULL,
    `product_slug` VARCHAR(250) NOT NULL,
    `product_description` TEXT NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `compare_at_price` DECIMAL(65, 30) NOT NULL,
    `is_featured` BOOLEAN NULL DEFAULT (false),
    `is_trending` BOOLEAN NULL DEFAULT (false),
    `is_published` BOOLEAN NULL DEFAULT (false),
    `brand_id` VARCHAR(191) NULL,

    UNIQUE INDEX `Product_product_name_key`(`product_name`),
    UNIQUE INDEX `Product_product_slug_key`(`product_slug`),
    INDEX `Product_product_name_idx`(`product_name`),
    INDEX `Product_product_slug_idx`(`product_slug`),
    INDEX `Product_price_idx`(`price`),
    INDEX `Product_is_published_idx`(`is_published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sub_Product` (
    `id` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `sku` VARCHAR(100) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,

    INDEX `Sub_Product_price_idx`(`price`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Brand` (
    `id` VARCHAR(191) NOT NULL,
    `brand_name` VARCHAR(100) NOT NULL,
    `brand_slug` VARCHAR(120) NOT NULL,

    INDEX `Brand_brand_name_idx`(`brand_name`),
    INDEX `Brand_brand_slug_idx`(`brand_slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product_Attribute` (
    `id` VARCHAR(191) NOT NULL,
    `attribute_name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attribute_Value` (
    `id` VARCHAR(191) NOT NULL,
    `attribute_value` VARCHAR(70) NOT NULL,
    `product_attribute_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product_Image` (
    `id` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `sub_product_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Product_Image_product_id_key`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sub_Product_Attribute_Values` (
    `attribute_value_id` VARCHAR(191) NOT NULL,
    `sub_product_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`attribute_value_id`, `sub_product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products_Categories` (
    `product_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`product_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category_Product_Attribute` (
    `category_id` VARCHAR(191) NOT NULL,
    `product_attribute_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`category_id`, `product_attribute_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parent_category_id_fkey` FOREIGN KEY (`parent_category_id`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `Brand`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attribute_Value` ADD CONSTRAINT `Attribute_Value_product_attribute_id_fkey` FOREIGN KEY (`product_attribute_id`) REFERENCES `Product_Attribute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_Image` ADD CONSTRAINT `Product_Image_sub_product_id_fkey` FOREIGN KEY (`sub_product_id`) REFERENCES `Sub_Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_Image` ADD CONSTRAINT `Product_Image_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sub_Product_Attribute_Values` ADD CONSTRAINT `Sub_Product_Attribute_Values_attribute_value_id_fkey` FOREIGN KEY (`attribute_value_id`) REFERENCES `Attribute_Value`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sub_Product_Attribute_Values` ADD CONSTRAINT `Sub_Product_Attribute_Values_sub_product_id_fkey` FOREIGN KEY (`sub_product_id`) REFERENCES `Sub_Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products_Categories` ADD CONSTRAINT `Products_Categories_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products_Categories` ADD CONSTRAINT `Products_Categories_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category_Product_Attribute` ADD CONSTRAINT `Category_Product_Attribute_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category_Product_Attribute` ADD CONSTRAINT `Category_Product_Attribute_product_attribute_id_fkey` FOREIGN KEY (`product_attribute_id`) REFERENCES `Product_Attribute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
