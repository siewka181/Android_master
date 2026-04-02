CREATE TABLE `operationLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`featureKey` varchar(64) NOT NULL,
	`level` enum('SUCCESS','WARN','ERROR','INFO','XDR') NOT NULL,
	`message` text NOT NULL,
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `operationLogs_id` PRIMARY KEY(`id`)
);
