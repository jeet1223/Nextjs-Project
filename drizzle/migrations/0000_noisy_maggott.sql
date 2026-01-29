CREATE TABLE `addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`street` varchar(255),
	`city` varchar(100),
	`state` varchar(100),
	`country` varchar(100),
	`area` varchar(100),
	`pincode` varchar(20),
	`landmark` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`description` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`image` text,
	`description` varchar(500) NOT NULL,
	`price` int NOT NULL,
	`category_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`email` varchar(255),
	`password` varchar(255),
	`phone_number` varchar(20),
	`role` varchar(50) DEFAULT 'user',
	`status` boolean DEFAULT true,
	`refresh_token` varchar(255),
	`is_notification` boolean DEFAULT true,
	`device_token` varchar(255) DEFAULT '',
	`device_type` varchar(50) DEFAULT 'web',
	`login_with` varchar(50) DEFAULT 'andriod',
	`image` varchar(255),
	`address_id` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `items_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_address_id_addresses_id_fk` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE cascade ON UPDATE no action;