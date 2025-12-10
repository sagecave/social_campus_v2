-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Vært: mariadb
-- Genereringstid: 10. 12 2025 kl. 09:34:48
-- Serverversion: 10.6.20-MariaDB-ubu2004
-- PHP-version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `social_campus_v2`
--

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `followers`
--

CREATE TABLE `followers` (
  `follower_id` bigint(20) UNSIGNED NOT NULL,
  `following_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `followers`
--

INSERT INTO `followers` (`follower_id`, `following_id`) VALUES
(40, 40),
(40, 42),
(40, 43),
(57, 44);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `posts`
--

CREATE TABLE `posts` (
  `post_pk` bigint(20) UNSIGNED NOT NULL,
  `post_text` varchar(500) NOT NULL,
  `post_created_at` bigint(20) UNSIGNED NOT NULL,
  `post_updated_at` bigint(20) UNSIGNED DEFAULT NULL,
  `post_deleted_at` bigint(20) UNSIGNED DEFAULT NULL,
  `user_fk` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `posts`
--

INSERT INTO `posts` (`post_pk`, `post_text`, `post_created_at`, `post_updated_at`, `post_deleted_at`, `user_fk`) VALUES
(21, 'HAHAHAHAH', 1764856535, 123123, NULL, 40),
(30, 'hej\n', 1765196946, NULL, NULL, 40),
(31, 'lolsssss', 1765196956, 1765211464, NULL, 40),
(32, 'asd', 1765211511, 1765236410, NULL, 40),
(33, 'asd', 1765236413, 1765236494, NULL, 40),
(34, 'hej', 1765288305, NULL, NULL, 57),
(35, '', 1765295832, NULL, NULL, 40),
(38, 'w', 1765354942, NULL, NULL, 40);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `posts_comments`
--

CREATE TABLE `posts_comments` (
  `comment_pk` bigint(20) UNSIGNED NOT NULL,
  `post_fk` bigint(20) UNSIGNED NOT NULL,
  `user_fk` bigint(20) UNSIGNED NOT NULL,
  `comment_text` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `posts_comments`
--

INSERT INTO `posts_comments` (`comment_pk`, `post_fk`, `user_fk`, `comment_text`) VALUES
(5, 21, 40, '123'),
(7, 21, 40, 'TEAH BODY!!!'),
(21, 32, 40, 'awd'),
(22, 32, 40, 'asd'),
(23, 33, 57, 'hey'),
(24, 32, 40, 'hej');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `posts_likes`
--

CREATE TABLE `posts_likes` (
  `post_fk` bigint(20) UNSIGNED NOT NULL,
  `user_fk` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `posts_likes`
--

INSERT INTO `posts_likes` (`post_fk`, `user_fk`) VALUES
(33, 57);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `users`
--

CREATE TABLE `users` (
  `user_pk` bigint(20) UNSIGNED NOT NULL,
  `user_first_name` varchar(60) NOT NULL,
  `user_last_name` varchar(60) NOT NULL,
  `user_username` varchar(60) NOT NULL,
  `user_education` varchar(255) NOT NULL,
  `user_school` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_verification_key` char(32) DEFAULT NULL,
  `user_verified_at` bigint(20) UNSIGNED NOT NULL,
  `user_token` varchar(128) DEFAULT NULL,
  `user_token_created_at` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `user_avatar` varchar(1000) NOT NULL DEFAULT '0b8f19cd-f8bf-43a6-886a-1be53fe89c60.png',
  `user_role` char(5) NOT NULL DEFAULT 'user',
  `user_block_status` char(20) NOT NULL DEFAULT 'notBlock'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `users`
--

INSERT INTO `users` (`user_pk`, `user_first_name`, `user_last_name`, `user_username`, `user_education`, `user_school`, `user_email`, `user_password`, `user_verification_key`, `user_verified_at`, `user_token`, `user_token_created_at`, `user_avatar`, `user_role`, `user_block_status`) VALUES
(40, 'amadeu', 'amadeu', 'andreassss', 'web dev', 'ek', 'andreassage@gmail.com', 'scrypt:32768:8:1$Ajy8JCokodKLgDpg$40f47e6af098ae0c54e1ec45d07e72973ae4aed8fe1a21ef7299b1247ac9a991f7bf7d88831226754b3fc07ca8bcb96ca27efa24f8ceec746da544d10e5b4fa7', NULL, 1764773416, NULL, 1765229804, '34e41b63-3712-4824-88ea-9a8ada436edf.jpg', 'admin', 'notBlock'),
(42, 'aa', 'AA', 'AA', 'EK', 'EK', 'a@a.com', '123123', NULL, 123123, NULL, 0, '0b8f19cd-f8bf-43a6-886a-1be53fe89c60.png', 'user', 'block'),
(43, 'lll', 'LLL', 'LLL', 'L', 'L', 'l@l.com', '123123', NULL, 1235124, NULL, 0, '0b8f19cd-f8bf-43a6-886a-1be53fe89c60.png', 'user', 'block'),
(44, 'OP', 'op', 'op', 'op', 'op', 'op@op.com', '123123', NULL, 123312123, NULL, 0, '0b8f19cd-f8bf-43a6-886a-1be53fe89c60.png', 'user', 'block'),
(47, 'andreas', 'amadeu', 'aaaaa', 'ek', 'ek', 'andreassages@gmail.com', 'scrypt:32768:8:1$PO4hc26HXBbWkVso$b752451b491f40087af388c4b55a5ff4b5ff9a20f0729a95f4d4a7051103ffe50c3ceefa96816152ef80786141e793ba5a241ac91c29a3bc4a9d5d4b265a9ea1', 'b7c63ad6e3714e1c92b62558925392bf', 0, NULL, 0, '0b8f19cd-f8bf-43a6-886a-1be53fe89c60.png', 'user', 'notBlock'),
(57, 'qweq', 'we', 'creoostudio', 'qwe', 'qwe', 'creoostudiowork@gmail.com', 'scrypt:32768:8:1$ZglIqqDEJ4C5qIVT$8e27a19420c06f4c75533cc0ac77fdfd11158a551a4b2e5b258c6fd2ec23a73245e7f8ac205751953572c28b08b4cd8e5e9dc7c8b6241780c5ea74f87088e635', NULL, 1765286030, NULL, 0, '0b8f19cd-f8bf-43a6-886a-1be53fe89c60.png', 'user', 'notBlock');

--
-- Begrænsninger for dumpede tabeller
--

--
-- Indeks for tabel `followers`
--
ALTER TABLE `followers`
  ADD UNIQUE KEY `follower_id` (`follower_id`,`following_id`),
  ADD KEY `following` (`following_id`);

--
-- Indeks for tabel `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_pk`),
  ADD UNIQUE KEY `post_pk` (`post_pk`),
  ADD KEY `post_owner` (`user_fk`);

--
-- Indeks for tabel `posts_comments`
--
ALTER TABLE `posts_comments`
  ADD UNIQUE KEY `comment_pk` (`comment_pk`),
  ADD KEY `post_cascade` (`post_fk`),
  ADD KEY `user_cascade` (`user_fk`);

--
-- Indeks for tabel `posts_likes`
--
ALTER TABLE `posts_likes`
  ADD PRIMARY KEY (`post_fk`,`user_fk`),
  ADD UNIQUE KEY `post_fk` (`post_fk`,`user_fk`),
  ADD UNIQUE KEY `post_fk_2` (`post_fk`,`user_fk`),
  ADD UNIQUE KEY `post_fk_3` (`post_fk`,`user_fk`),
  ADD KEY `user_id_cascade` (`user_fk`);

--
-- Indeks for tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_pk`),
  ADD UNIQUE KEY `user_pk` (`user_pk`),
  ADD UNIQUE KEY `user_username` (`user_username`),
  ADD UNIQUE KEY `user_email` (`user_email`);

--
-- Brug ikke AUTO_INCREMENT for slettede tabeller
--

--
-- Tilføj AUTO_INCREMENT i tabel `posts`
--
ALTER TABLE `posts`
  MODIFY `post_pk` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Tilføj AUTO_INCREMENT i tabel `posts_comments`
--
ALTER TABLE `posts_comments`
  MODIFY `comment_pk` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Tilføj AUTO_INCREMENT i tabel `users`
--
ALTER TABLE `users`
  MODIFY `user_pk` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Begrænsninger for dumpede tabeller
--

--
-- Begrænsninger for tabel `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `follower` FOREIGN KEY (`follower_id`) REFERENCES `users` (`user_pk`) ON DELETE CASCADE,
  ADD CONSTRAINT `following` FOREIGN KEY (`following_id`) REFERENCES `users` (`user_pk`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `post_owner` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_pk`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `posts_comments`
--
ALTER TABLE `posts_comments`
  ADD CONSTRAINT `post_cascade` FOREIGN KEY (`post_fk`) REFERENCES `posts` (`post_pk`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_cascade` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_pk`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `posts_likes`
--
ALTER TABLE `posts_likes`
  ADD CONSTRAINT `post_id_cascade` FOREIGN KEY (`post_fk`) REFERENCES `posts` (`post_pk`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_id_cascade` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_pk`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
