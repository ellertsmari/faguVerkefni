CREATE TABLE `project_content` (
	`number` integer PRIMARY KEY NOT NULL,
	`published_json` text,
	`draft_json` text,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL,
	`published_at` text
);
