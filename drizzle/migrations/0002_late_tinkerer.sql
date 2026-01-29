CREATE TABLE `item_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`item_id` int NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `item_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `item_images` ADD CONSTRAINT `item_images_item_id_items_id_fk` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE cascade ON UPDATE no action;