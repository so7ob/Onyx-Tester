CREATE TABLE `evidence` (
	`id` text PRIMARY KEY NOT NULL,
	`test_id` text NOT NULL,
	`name` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_evidence_test_id` ON `evidence` (`test_id`);--> statement-breakpoint
CREATE TABLE `results` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`actual` text NOT NULL,
	`notes` text NOT NULL,
	`tester` text NOT NULL,
	`evidence_url` text NOT NULL,
	`version` integer NOT NULL,
	`updated_at` text NOT NULL
);
