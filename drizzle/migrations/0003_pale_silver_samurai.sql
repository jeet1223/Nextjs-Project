CREATE TABLE `cms_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(20) NOT NULL,
	`html` text NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cms_content_id` PRIMARY KEY(`id`)
);
