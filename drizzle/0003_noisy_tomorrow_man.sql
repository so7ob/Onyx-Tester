CREATE TABLE `test_form_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`test_id` text NOT NULL,
	`version` integer NOT NULL,
	`snapshot` text NOT NULL,
	`actor_id` text NOT NULL,
	`actor_name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_test_form_versions_test_version` ON `test_form_versions` (`test_id`,`version`);--> statement-breakpoint
CREATE TABLE `test_forms` (
	`test_id` text PRIMARY KEY NOT NULL,
	`screen_id` text NOT NULL,
	`fields` text NOT NULL,
	`version` integer NOT NULL,
	`base_version` integer NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL,
	`change_id` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `site_owner` ADD `name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `results` ADD `tester_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `results` ADD `tester_email` text DEFAULT '' NOT NULL;