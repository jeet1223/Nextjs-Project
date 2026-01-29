CREATE TABLE `addToCart` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quantity` varchar(255) NOT NULL,
	`price` int NOT NULL,
	`item_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `addToCart_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `addToCart` ADD CONSTRAINT `addToCart_item_id_items_id_fk` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE cascade ON UPDATE no action;