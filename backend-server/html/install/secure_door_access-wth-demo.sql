SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `access_list` (
  `access_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `door_id` int DEFAULT NULL,
  `card_id` int DEFAULT NULL,
  `asset_id` int DEFAULT NULL,
  `is_approved` int DEFAULT NULL,
  `accessed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `access_list` (`access_id`, `user_id`, `door_id`, `card_id`, `asset_id`, `is_approved`, `accessed_at`) VALUES
(1, 2, 1, 1, 1, 0, '2022-04-08 03:08:59'),
(2, 2, 1, 1, 1, 0, '2022-04-08 03:09:02'),
(3, 2, 1, 1, 1, 0, '2022-04-08 03:09:04'),
(4, 2, 1, 1, 1, 0, '2022-04-08 03:10:22'),
(5, 2, 1, 1, 1, 0, '2022-04-08 03:10:24'),
(6, 6, 1, 3, 1, 1, '2022-04-08 03:10:32'),
(7, 6, 1, 3, 1, 0, '2022-04-08 03:10:45'),
(8, 6, 1, 3, 1, 1, '2022-04-08 03:10:55'),
(9, 6, 1, 3, 1, 0, '2022-04-08 03:11:18'),
(10, 6, 1, 3, 1, 0, '2022-04-08 03:11:21'),
(11, 6, 1, 3, 1, 0, '2022-04-08 03:11:34'),
(12, 6, 1, 3, 1, 1, '2022-04-08 03:28:22');

CREATE TABLE `api_keys` (
  `api_key_id` int NOT NULL,
  `api_key` varchar(1000) NOT NULL,
  `user_id` int NOT NULL,
  `is_active` int NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `api_keys` (`api_key_id`, `api_key`, `user_id`, `is_active`, `expires_at`) VALUES
(1, '441684d87a9ec4dce49b59935a283ab858b78333d9e116f2d65a33a94396ab5a9442ed208b782b68a8e986af8b31e2156fe9eec5c95075af51d53fce0439b37c', 1, 0, '2022-04-08 23:51:56'),
(2, '3dda8a9386ba7506cbc01d37ef26ad2f5b86f98b7610cd7fbea1bbc00ab7850d80755916d458205ada937ad32befa9246dec7bdf44cb9e762ee2822209c028c5', 1, 0, '2022-04-09 01:42:00'),
(3, 'a2d28a979426f2ee4b1467f8d14e4dd1e8ebc6aaa3630bca7f85b99a78a6fb324e484f0fb23ad8d67055e500bb8f6793e36c5b5d8e28b12a2de53760f7317204', 1, 1, '2022-04-09 02:50:10');

CREATE TABLE `assets` (
  `asset_id` int NOT NULL,
  `asset_tag` varchar(100) NOT NULL,
  `asset_info` varchar(500) NOT NULL,
  `is_active` int NOT NULL,
  `asset_token` varchar(1000) NOT NULL,
  `token_created_at` datetime DEFAULT NULL,
  `door_id` int NOT NULL,
  `modified_by` int NOT NULL,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `assets` (`asset_id`, `asset_tag`, `asset_info`, `is_active`, `asset_token`, `token_created_at`, `door_id`, `modified_by`, `modified_at`) VALUES
(1, 'ESP8266-A1', 'The scanner hardware for Door A1', 1, 'b571871fc871b2c78d5e69338d40d289a2cade50cab478526cf84422d2b91d60eb42a680f99d1ba6af0ab456f8c1ba2e9702937af1ed0674e133077d8d3b9b51', '2022-04-04 22:41:55', 1, 3, '2022-03-20 11:13:42'),
(2, 'ESP8266-A2', 'The scanner hardware for Door A2', 1, 'bzv zdjbvjz vzdzdjn jshgioadsnvladhgad vaghak', NULL, 2, 3, '2022-03-20 11:13:42');

CREATE TABLE `cards` (
  `card_id` int NOT NULL,
  `uid` varchar(50) NOT NULL,
  `assigned_to` int DEFAULT NULL,
  `is_active` int NOT NULL DEFAULT '1',
  `expires_at` datetime DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `cards` (`card_id`, `uid`, `assigned_to`, `is_active`, `expires_at`, `modified_by`, `modified_at`) VALUES
(1, 'd3852107', 2, 1, '2022-04-16 00:57:00', 3, '2022-03-20 11:07:44'),
(2, '76ae4b03', 4, 1, '2022-05-13 01:56:00', 3, '2022-03-31 14:03:56'),
(3, '4f8e4803', 6, 1, NULL, 1, '2022-04-07 15:07:27'),
(4, '563e7c36', NULL, 0, NULL, 1, '2022-04-07 23:54:41'),
(5, 'c2adcf39', 3, 1, NULL, NULL, '2022-04-07 23:58:16');

CREATE TABLE `card_to_door` (
  `card_to_door_id` int NOT NULL,
  `card_id` int NOT NULL,
  `door_id` int NOT NULL,
  `is_allowed` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `card_to_door` (`card_to_door_id`, `card_id`, `door_id`, `is_allowed`) VALUES
(3, 4, 1, 1),
(4, 3, 1, 1),
(5, 5, 1, 1),
(6, 5, 4, 1),
(7, 5, 11, 1);

CREATE TABLE `card_to_level` (
  `card_to_level_id` int NOT NULL,
  `card_id` int NOT NULL,
  `level_id` int NOT NULL,
  `is_allowed` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `card_to_level` (`card_to_level_id`, `card_id`, `level_id`, `is_allowed`) VALUES
(2, 4, 2, 1),
(3, 3, 2, 1),
(4, 5, 1, 1);

CREATE TABLE `doors` (
  `door_id` int NOT NULL,
  `door_identifier` varchar(100) NOT NULL,
  `door_access_level_id` int NOT NULL,
  `is_active` int NOT NULL DEFAULT '1',
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `doors` (`door_id`, `door_identifier`, `door_access_level_id`, `is_active`, `modified_at`) VALUES
(1, 'Room A1:A1', 1, 1, '2022-04-07 23:54:34'),
(2, 'Room A2:A2', 1, 0, '2022-04-07 23:54:43'),
(3, 'Room A3:A3', 1, 1, '2022-04-07 23:54:59'),
(4, 'Room B1:B1', 2, 1, '2022-04-07 23:55:10'),
(5, 'Room B2:B2', 2, 0, '2022-04-07 23:55:20'),
(6, 'Room B3:B3', 2, 1, '2022-04-07 23:55:29'),
(11, 'Room C1:C1', 4, 1, '2022-04-08 02:35:59');

CREATE TABLE `levels` (
  `level_id` int NOT NULL,
  `level` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `levels` (`level_id`, `level`) VALUES
(1, 'Level A'),
(2, 'Level B'),
(4, 'Level C');

CREATE TABLE `logs` (
  `log_id` int NOT NULL,
  `log_category` varchar(200) NOT NULL,
  `message` varchar(5000) NOT NULL,
  `severity` int DEFAULT NULL,
  `logged_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_notified` int NOT NULL DEFAULT '0',
  `has_investigated` int NOT NULL DEFAULT '0',
  `investigated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `logs` (`log_id`, `log_category`, `message`, `severity`, `logged_at`, `is_notified`, `has_investigated`, `investigated_at`) VALUES
(1, 'access', 'Test User has tried to access door A1 with asset (Asset ID: 1) for 3 times in last 5 minutes', 3, '2022-04-08 03:11:18', 0, 0, '2022-04-08 03:11:18'),
(2, 'access', 'Test User has tried to access door A1 with asset (Asset ID: 1) for 4 times in last 5 minutes', 3, '2022-04-08 03:11:21', 0, 0, '2022-04-08 03:11:21'),
(3, 'access', 'Test User has tried to access door A1 with asset (Asset ID: 1) for 5 times in last 5 minutes', 3, '2022-04-08 03:11:33', 0, 1, '2022-04-08 03:12:06');

CREATE TABLE `requests` (
  `request_id` int NOT NULL,
  `request_header` varchar(1000) NOT NULL,
  `request_body` varchar(5000) NOT NULL,
  `request_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `response` mediumtext NOT NULL,
  `response_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(75) NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `user_access_level_id` int DEFAULT NULL,
  `allow_global_level_access` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(50) NOT NULL DEFAULT '2',
  `is_active` int NOT NULL DEFAULT '0',
  `employee_id` varchar(30) DEFAULT NULL,
  `comments` varchar(5000) DEFAULT NULL,
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `user_name`, `password`, `user_access_level_id`, `allow_global_level_access`, `created_at`, `role`, `is_active`, `employee_id`, `comments`, `modified_at`) VALUES
(1, 'Eugene', 'Rupi', 'eugene@rupi.com', 'eugene', '$2y$10$KfG4EFsrvlJbOhcrSAYyweOriDr9PHC22cGZSQn2zPppnmO3mieie', 0, 1, '2022-04-07 23:50:21', '1', 1, NULL, NULL, '2022-04-07 23:50:21'),
(2, 'Manos', 'Sarigiannis', 'manos.sar@gmail.com', NULL, NULL, NULL, 0, '2022-04-07 23:58:23', '2', 1, NULL, NULL, '2022-04-08 00:32:58'),
(3, 'Nirmal', 'Sunny', 'sunny@gmail.com', NULL, NULL, NULL, 0, '2022-04-08 00:46:57', '2', 1, NULL, NULL, '2022-04-08 02:37:50'),
(4, 'Eugen', 'Rupi', 'eugen.rupi@gmail.com', NULL, NULL, NULL, 0, '2022-04-08 00:47:29', '2', 1, NULL, NULL, '2022-04-08 00:56:52'),
(6, 'Test', 'User', 'test@user.com', NULL, NULL, NULL, 0, '2022-04-08 02:37:00', '2', 1, NULL, NULL, '2022-04-08 02:37:00');


ALTER TABLE `access_list`
  ADD PRIMARY KEY (`access_id`);

ALTER TABLE `api_keys`
  ADD PRIMARY KEY (`api_key_id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `assets`
  ADD PRIMARY KEY (`asset_id`),
  ADD KEY `door_id` (`door_id`);

ALTER TABLE `cards`
  ADD PRIMARY KEY (`card_id`),
  ADD KEY `modified_by` (`modified_by`);

ALTER TABLE `card_to_door`
  ADD PRIMARY KEY (`card_to_door_id`),
  ADD KEY `card_id` (`card_id`),
  ADD KEY `door_id` (`door_id`);

ALTER TABLE `card_to_level`
  ADD PRIMARY KEY (`card_to_level_id`),
  ADD KEY `card_id` (`card_id`),
  ADD KEY `level_id` (`level_id`);

ALTER TABLE `doors`
  ADD PRIMARY KEY (`door_id`);

ALTER TABLE `levels`
  ADD PRIMARY KEY (`level_id`);

ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`);

ALTER TABLE `requests`
  ADD PRIMARY KEY (`request_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_access_level_id` (`user_access_level_id`);


ALTER TABLE `access_list`
  MODIFY `access_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `api_keys`
  MODIFY `api_key_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `assets`
  MODIFY `asset_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `cards`
  MODIFY `card_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `card_to_door`
  MODIFY `card_to_door_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `card_to_level`
  MODIFY `card_to_level_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `doors`
  MODIFY `door_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

ALTER TABLE `levels`
  MODIFY `level_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `logs`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `requests`
  MODIFY `request_id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;


ALTER TABLE `api_keys`
  ADD CONSTRAINT `api_keys_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `assets`
  ADD CONSTRAINT `assets_ibfk_1` FOREIGN KEY (`door_id`) REFERENCES `doors` (`door_id`);

ALTER TABLE `card_to_door`
  ADD CONSTRAINT `card_to_door_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `cards` (`card_id`),
  ADD CONSTRAINT `card_to_door_ibfk_2` FOREIGN KEY (`door_id`) REFERENCES `doors` (`door_id`);

ALTER TABLE `card_to_level`
  ADD CONSTRAINT `card_to_level_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `cards` (`card_id`),
  ADD CONSTRAINT `card_to_level_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `levels` (`level_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
