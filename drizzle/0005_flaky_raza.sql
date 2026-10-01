CREATE TABLE `result_history` (
	`id` text PRIMARY KEY NOT NULL,
	`test_id` text NOT NULL,
	`snapshot` text NOT NULL,
	`evidence` text NOT NULL,
	`actor_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_result_history_test` ON `result_history` (`test_id`);--> statement-breakpoint
ALTER TABLE `evidence` ADD `run_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `results` ADD `run_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `results` ADD `started_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `results` ADD `approved_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `results` ADD `approved_by` text DEFAULT '' NOT NULL;
UPDATE results SET run_id=id||'-legacy';
UPDATE evidence SET run_id=COALESCE((SELECT run_id FROM results WHERE results.id=evidence.test_id),'');
