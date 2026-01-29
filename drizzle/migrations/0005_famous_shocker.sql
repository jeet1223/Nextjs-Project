ALTER TABLE `items` MODIFY COLUMN `description` varchar(255);--> statement-breakpoint
ALTER TABLE `items` ADD `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `items` ADD `in_stock` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `items` ADD `tag` varchar(255);--> statement-breakpoint
ALTER TABLE `items` ADD `quantityName` varchar(500);--> statement-breakpoint
ALTER TABLE `items` ADD `limitedItem` int;