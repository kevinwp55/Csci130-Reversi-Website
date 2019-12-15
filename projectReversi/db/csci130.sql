-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2019 at 03:49 AM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `csci130`
--

-- --------------------------------------------------------

--
-- Table structure for table `gamedata`
--

CREATE TABLE `gamedata` (
  `username` varchar(255) NOT NULL,
  `gameMode` varchar(255) NOT NULL,
  `gameSize` int(12) NOT NULL,
  `p1Discs` int(12) NOT NULL,
  `p2Discs` int(12) NOT NULL,
  `status` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `date` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `gamedata`
--

INSERT INTO `gamedata` (`username`, `gameMode`, `gameSize`, `p1Discs`, `p2Discs`, `status`, `time`, `date`) VALUES
('dude999', 'ComputerHard', 8, 38, 26, 'You Won!', '1:05', '12-10-2019 18:41:34'),
('dude999', 'ComputerHard', 6, 6, 30, 'You Lost!', '0:29', '12-10-2019 18:42:18'),
('dude999', 'ComputerHard', 8, 61, 3, 'You Won!', '1:02', '12-10-2019 18:43:33'),
('kevin', 'ComputerEasy', 4, 6, 10, 'You Lost!', '0:08', '12-10-2019 18:44:07'),
('kevin', 'ComputerEasy', 6, 12, 24, 'You Lost!', '0:27', '12-10-2019 18:44:41'),
('kevin', 'ComputerHard', 4, 9, 7, 'You Won!', '0:09', '12-10-2019 18:44:57'),
('kevin', 'ComputerHard', 6, 26, 10, 'You Won!', '0:29', '12-10-2019 18:45:32'),
('kevin', 'ComputerHard', 8, 32, 32, 'You Lost!', '1:06', '12-10-2019 18:47:26');

-- --------------------------------------------------------

--
-- Table structure for table `prregusers`
--

CREATE TABLE `prregusers` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `userPic` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prregusers`
--

INSERT INTO `prregusers` (`id`, `username`, `password`, `email`, `userPic`) VALUES
(1, 'kevin', '$2y$10$V8OK7uDy6PRhqSdVfv4nquBmlyPysGMk083b9F9SooH1lub.myANi', 'power@gmail.com', 'smiley.jpg'),
(2, 'dude999', '$2y$10$rnDNMKz0uCk3XwJ85j8nouqbLpkSgsrlIA2/XXeRddePNWjvVqWKC', 'SomebodyOnce@gmail.com', 'DinosaurEmoji.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `prregusers`
--
ALTER TABLE `prregusers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `prregusers`
--
ALTER TABLE `prregusers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
