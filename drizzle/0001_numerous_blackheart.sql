CREATE TABLE `screen_forms` (
	`screen_id` text PRIMARY KEY NOT NULL,
	`fields` text NOT NULL,
	`version` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `test_data` (
	`test_id` text PRIMARY KEY NOT NULL,
	`party` text NOT NULL,
	`amount` text NOT NULL,
	`currency` text NOT NULL,
	`document_number` text NOT NULL,
	`date` text NOT NULL,
	`branch` text NOT NULL,
	`notes` text NOT NULL,
	`custom_values` text NOT NULL,
	`ready` integer NOT NULL,
	`version` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `app_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`permissions` text NOT NULL,
	`systems` text NOT NULL,
	`active` integer NOT NULL,
	`version` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_users_email_unique` ON `app_users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_users_user_id_unique` ON `app_users` (`user_id`);--> statement-breakpoint
ALTER TABLE `results` ADD `document_number` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `results` ADD `linked_document_number` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `results` ADD `custom_values` text DEFAULT '{}' NOT NULL;