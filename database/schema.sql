-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 24, 2021 at 10:02 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `army_tracker`
--
CREATE DATABASE IF NOT EXISTS `army_tracker` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `army_tracker`;

-- --------------------------------------------------------

--
-- Table structure for table `guild`
--

CREATE TABLE `guild` (
  `id` varchar(18) NOT NULL,
  `prefix` varchar(5) NOT NULL DEFAULT '+',
  `upload_channel` varchar(18) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `participation`
--

CREATE TABLE `participation` (
  `id` int(11) NOT NULL,
  `user_id` varchar(18) NOT NULL,
  `guild_id` varchar(18) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `quantity`
--

CREATE TABLE `quantity` (
  `id` int(11) NOT NULL,
  `user_id` varchar(18) NOT NULL,
  `troop_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `size_role`
--

CREATE TABLE `size_role` (
  `role_id` varchar(18) NOT NULL,
  `size` int(11) NOT NULL,
  `guild_id` varchar(18) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `troop`
--

CREATE TABLE `troop` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `faction` varchar(32) NOT NULL,
  `type` varchar(32) NOT NULL,
  `tier` int(11) NOT NULL,
  `wage` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `troop`
--

INSERT INTO `troop` (`id`, `name`, `faction`, `type`, `tier`, `wage`) VALUES
(257, 'Arboreal', 'Vlandia', 'Ranged', 5, 0),
(258, 'Aserai Archer', 'Aserai', 'Ranged', 4, 57),
(259, 'Aserai Armed Trader', 'Aserai', 'Ranged', 3, 0),
(260, 'Aserai Caravan Guard', 'Aserai', 'Cavalry', 4, 0),
(261, 'Aserai Caravan Master', 'Aserai', 'Infantry', 5, 0),
(262, 'Aserai Faris', 'Aserai', 'Cavalry', 4, 62),
(263, 'Aserai Footman', 'Aserai', 'Infantry', 3, 23),
(264, 'Aserai Infantry', 'Aserai', 'Infantry', 4, 44),
(265, 'Aserai Mameluke Axeman', 'Aserai', 'Infantry', 3, 24),
(266, 'Aserai Mameluke Cavalry', 'Aserai', 'Horse Archer', 4, 78),
(267, 'Aserai Mameluke Guard', 'Aserai', 'Infantry', 4, 44),
(268, 'Aserai Mameluke Heavy Cavalry', 'Aserai', 'Horse Archer', 5, 124),
(269, 'Aserai Mameluke Palace Guard', 'Aserai', 'Infantry', 5, 74),
(270, 'Aserai Mameluke Regular', 'Aserai', 'Cavalry', 3, 31),
(271, 'Aserai Mameluke Soldier', 'Aserai', 'Infantry', 2, 8),
(272, 'Aserai Master Archer', 'Aserai', 'Ranged', 5, 101),
(273, 'Aserai Militia Archer', 'Aserai', 'Ranged', 2, 0),
(274, 'Aserai Militia Spearman', 'Aserai', 'Infantry', 2, 0),
(275, 'Aserai Militia Veteran Archer', 'Aserai', 'Ranged', 4, 0),
(276, 'Aserai Militia Veteran Spearman', 'Aserai', 'Infantry', 4, 0),
(277, 'Aserai Recruit', 'Aserai', 'Infantry', 1, 6),
(278, 'Aserai Skirmisher', 'Aserai', 'Infantry', 3, 23),
(279, 'Aserai Tribal Horseman', 'Aserai', 'Cavalry', 3, 33),
(280, 'Aserai Tribesman', 'Aserai', 'Infantry', 2, 13),
(281, 'Aserai Vanguard Faris', 'Aserai', 'Cavalry', 6, 162),
(282, 'Aserai Veteran Caravan Guard', 'Aserai', 'Horse Archer', 5, 0),
(283, 'Aserai Veteran Faris', 'Aserai', 'Cavalry', 5, 105),
(284, 'Aserai Veteran Infantry', 'Aserai', 'Infantry', 5, 77),
(285, 'Aserai Youth', 'Aserai', 'Cavalry', 2, 13),
(286, 'Battanian Armed Trader', 'Battania', 'Ranged', 3, 0),
(287, 'Battanian Caravan Guard', 'Battania', 'Cavalry', 4, 0),
(288, 'Battanian Caravan Master', 'Battania', 'Infantry', 5, 0),
(289, 'Battanian Clan Warrior', 'Battania', 'Infantry', 2, 8),
(290, 'Battanian Falxman', 'Battania', 'Infantry', 4, 44),
(291, 'Battanian Fian', 'Battania', 'Ranged', 5, 127),
(292, 'Battanian Fian Champion', 'Battania', 'Ranged', 6, 187),
(293, 'Battanian Hero', 'Battania', 'Ranged', 4, 65),
(294, 'Battanian Highborn Warrior', 'Battania', 'Ranged', 3, 39),
(295, 'Battanian Highborn Youth', 'Battania', 'Ranged', 2, 13),
(296, 'Battanian Horseman', 'Battania', 'Cavalry', 5, 97),
(297, 'Battanian Militia Archer', 'Battania', 'Ranged', 2, 0),
(298, 'Battanian Militia Spearman', 'Battania', 'Infantry', 2, 0),
(299, 'Battanian Militia Veteran Archer', 'Battania', 'Ranged', 4, 0),
(300, 'Battanian Militia Veteran Spearm', 'Battania', 'Infantry', 4, 0),
(301, 'Battanian Mounted Skirmisher', 'Battania', 'Cavalry', 5, 102),
(302, 'Battanian Picked Warrior', 'Battania', 'Infantry', 4, 47),
(303, 'Battanian Raider', 'Battania', 'Infantry', 3, 23),
(304, 'Battanian Scout', 'Battania', 'Cavalry', 4, 59),
(305, 'Battanian Skirmisher', 'Battania', 'Infantry', 3, 21),
(306, 'Battanian Trained Spearman', 'Battania', 'Infantry', 5, 0),
(307, 'Battanian Trained Warrior', 'Battania', 'Infantry', 3, 23),
(308, 'Battanian Veteran Caravan Guard', 'Battania', 'Cavalry', 5, 0),
(309, 'Battanian Veteran Falxman', 'Battania', 'Infantry', 5, 70),
(310, 'Battanian Veteran Skirmisher', 'Battania', 'Infantry', 4, 42),
(311, 'Battanian Volunteer', 'Battania', 'Infantry', 1, 6),
(312, 'Battanian Wildling', 'Battania', 'Infantry', 5, 72),
(313, 'Battanian Wood Runner', 'Battania', 'Infantry', 2, 8),
(314, 'Bedouin Rover', 'Desert Bandits', 'Infantry', 2, 6),
(315, 'Beni Zilal Recruit', 'Aserai', 'Horse Archer', 2, 0),
(316, 'Beni Zilal Royal Guard', 'Aserai', 'Horse Archer', 5, 0),
(317, 'Beni Zilal Soldier', 'Aserai', 'Horse Archer', 3, 0),
(318, 'Boar Champion', 'Vlandia', 'Ranged', 5, 0),
(319, 'Boar Novice', 'Vlandia', 'Ranged', 1, 0),
(320, 'Boar Veteran', 'Vlandia', 'Ranged', 3, 0),
(321, 'Borrowed Troop', 'Empire', 'Infantry', 1, 0),
(322, 'Brigand', 'Mountain Bandits', 'Infantry', 3, 22),
(323, 'Bushwacker', 'Forest Bandits', 'Ranged', 2, 9),
(324, 'Champion Fighter', 'Empire', 'Infantry', 4, 0),
(325, 'Chosen Wolf', 'Battania', 'Ranged', 5, 0),
(326, 'Desert Bandit Boss', 'Desert Bandits', 'Infantry', 5, 103),
(327, 'Deserter', 'Looters', 'Infantry', 2, 8),
(328, 'Expert Eleftheroi', 'Empire', 'Cavalry', 3, 0),
(329, 'Expert Forester', 'Vakken', 'Ranged', 3, 0),
(330, 'Expert Guardian', 'Empire', 'Ranged', 3, 0),
(331, 'Expert Oath Keeper', 'Empire', 'Infantry', 3, 0),
(332, 'Forest Bandit', 'Forest Bandits', 'Ranged', 4, 73),
(333, 'Forest Bandit Boss', 'Forest Bandits', 'Infantry', 5, 81),
(334, 'Freebooter', 'Forest Bandits', 'Ranged', 3, 27),
(335, 'Ghilman', 'Darshi', 'Cavalry', 3, 0),
(336, 'Ghulam', 'Darshi', 'Cavalry', 5, 0),
(337, 'Guard', 'Aserai', 'Infantry', 4, 0),
(338, 'Guard', 'Empire', 'Infantry', 4, 0),
(339, 'Guardian Recruit', 'Empire', 'Ranged', 1, 0),
(340, 'Harami', 'Desert Bandits', 'Cavalry', 4, 59),
(341, 'Hastati', 'Empire', 'Infantry', 2, 0),
(342, 'Headman\'s Troop', 'Empire', 'Cavalry', 4, 0),
(343, 'Hidden Hand', 'Empire', 'Infantry', 3, 0),
(344, 'Hidden Pawn', 'Empire', 'Infantry', 2, 0),
(345, 'Highwayman', 'Mountain Bandits', 'Cavalry', 4, 70),
(346, 'Hillmen', 'Mountain Bandits', 'Infantry', 2, 8),
(347, 'Hired Blade', 'Mercenary', 'Infantry', 5, 66),
(348, 'Hired Crossbow', 'Mercenary', 'Ranged', 5, 74),
(349, 'Imperial Archer', 'Empire', 'Ranged', 2, 11),
(350, 'Imperial Armed Trader', 'Empire', 'Ranged', 3, 0),
(351, 'Imperial Bucellarii', 'Empire', 'Horse Archer', 5, 121),
(352, 'Imperial Caravan Guard', 'Empire', 'Cavalry', 4, 0),
(353, 'Imperial Caravan Master', 'Empire', 'Infantry', 5, 0),
(354, 'Imperial Cataphract', 'Empire', 'Cavalry', 5, 105),
(355, 'Imperial Crossbowman', 'Empire', 'Ranged', 4, 57),
(356, 'Imperial Elite Cataphract', 'Empire', 'Cavalry', 6, 198),
(357, 'Imperial Elite Menavliaton', 'Empire', 'Infantry', 5, 72),
(358, 'Imperial Equite', 'Empire', 'Cavalry', 3, 36),
(359, 'Imperial Heavy Horseman', 'Empire', 'Cavalry', 4, 74),
(360, 'Imperial Infantryman', 'Empire', 'Infantry', 2, 8),
(361, 'Imperial Legionary', 'Empire', 'Infantry', 5, 72),
(362, 'Imperial Menavliaton', 'Empire', 'Infantry', 4, 44),
(363, 'Imperial Militia Archer', 'Empire', 'Ranged', 2, 0),
(364, 'Imperial Militia Spearman', 'Empire', 'Infantry', 2, 0),
(365, 'Imperial Militia Veteran Archer', 'Empire', 'Ranged', 4, 0),
(366, 'Imperial Militia Veteran Spearma', 'Empire', 'Infantry', 4, 0),
(367, 'Imperial Palatine Guard', 'Empire', 'Ranged', 5, 93),
(368, 'Imperial Recruit', 'Empire', 'Infantry', 1, 6),
(369, 'Imperial Sergeant Crossbowman', 'Empire', 'Ranged', 5, 93),
(370, 'Imperial Trained Archer', 'Empire', 'Ranged', 3, 30),
(371, 'Imperial Trained Infantryman', 'Empire', 'Infantry', 3, 23),
(372, 'Imperial Veteran Archer', 'Empire', 'Ranged', 4, 57),
(373, 'Imperial Veteran Caravan Guard', 'Empire', 'Cavalry', 5, 0),
(374, 'Imperial Veteran Infantryman', 'Empire', 'Infantry', 4, 44),
(375, 'Imperial Vigla Recruit', 'Empire', 'Infantry', 2, 8),
(376, 'Jawwal Bedouin', 'Aserai', 'Cavalry', 5, 0),
(377, 'Jawwal Camel Rider', 'Aserai', 'Cavalry', 3, 0),
(378, 'Jawwal Recruit', 'Aserai', 'Infantry', 1, 0),
(379, 'Karakhuzait Elder', 'Khuzait', 'Horse Archer', 5, 0),
(380, 'Karakhuzait Nomad', 'Khuzait', 'Horse Archer', 2, 0),
(381, 'Karakhuzait Rider', 'Khuzait', 'Horse Archer', 3, 0),
(382, 'Kern', 'Battania', 'Infantry', 3, 0),
(383, 'Khuzait Archer', 'Khuzait', 'Ranged', 4, 57),
(384, 'Khuzait Armed Trader', 'Khuzait', 'Ranged', 3, 0),
(385, 'Khuzait Caravan Guard', 'Khuzait', 'Cavalry', 4, 0),
(386, 'Khuzait Caravan Master', 'Khuzait', 'Infantry', 5, 0),
(387, 'Khuzait Darkhan', 'Khuzait', 'Infantry', 5, 72),
(388, 'Khuzait Footman', 'Khuzait', 'Infantry', 2, 8),
(389, 'Khuzait Heavy Horse Archer', 'Khuzait', 'Horse Archer', 5, 124),
(390, 'Khuzait Heavy Lancer', 'Khuzait', 'Cavalry', 5, 132),
(391, 'Khuzait Horse Archer', 'Khuzait', 'Horse Archer', 4, 76),
(392, 'Khuzait Horseman', 'Khuzait', 'Cavalry', 3, 31),
(393, 'Khuzait Hunter', 'Khuzait', 'Ranged', 3, 30),
(394, 'Khuzait Khan\'s Guard', 'Khuzait', 'Horse Archer', 6, 259),
(395, 'Khuzait Kheshig', 'Khuzait', 'Horse Archer', 5, 133),
(396, 'Khuzait Lancer', 'Khuzait', 'Cavalry', 4, 59),
(397, 'Khuzait Marksman', 'Khuzait', 'Ranged', 5, 93),
(398, 'Khuzait Militia Archer', 'Khuzait', 'Ranged', 2, 0),
(399, 'Khuzait Militia Spearman', 'Khuzait', 'Infantry', 2, 0),
(400, 'Khuzait Militia Veteran Archer', 'Khuzait', 'Infantry', 4, 0),
(401, 'Khuzait Militia Veteran Spearman', 'Khuzait', 'Ranged', 4, 0),
(402, 'Khuzait Noble\'s Son', 'Khuzait', 'Horse Archer', 2, 17),
(403, 'Khuzait Nomad', 'Khuzait', 'Infantry', 1, 6),
(404, 'Khuzait Qanqli', 'Khuzait', 'Horse Archer', 3, 40),
(405, 'Khuzait Raider', 'Khuzait', 'Horse Archer', 3, 47),
(406, 'Khuzait Spear Infantry', 'Khuzait', 'Infantry', 4, 44),
(407, 'Khuzait Spearman', 'Khuzait', 'Infantry', 3, 23),
(408, 'Khuzait Torguud', 'Khuzait', 'Horse Archer', 4, 94),
(409, 'Khuzait Tribal Warrior', 'Khuzait', 'Horse Archer', 2, 15),
(410, 'Khuzait Veteran Caravan Guard', 'Khuzait', 'Horse Archer', 5, 0),
(411, 'Koleman', 'Darshi', 'Cavalry', 2, 0),
(412, 'Looter', 'Looters', 'Infantry', 1, 11),
(413, 'Marauder', 'Steppe Bandits', 'Horse Archer', 3, 49),
(414, 'Mercenary Cavalry', 'Mercenary', 'Cavalry', 5, 97),
(415, 'Mercenary Crossbowman', 'Mercenary', 'Ranged', 4, 50),
(416, 'Mercenary Guard', 'Mercenary', 'Ranged', 3, 17),
(417, 'Mercenary Horseman', 'Mercenary', 'Cavalry', 4, 44),
(418, 'Mercenary Scout', 'Mercenary', 'Cavalry', 3, 29),
(419, 'Mercenary Swordsman', 'Mercenary', 'Infantry', 4, 33),
(420, 'Mountain Bandit Boss', 'Mountain Bandits', 'Infantry', 5, 74),
(421, 'Nomad Bandit', 'Desert Bandits', 'Cavalry', 3, 29),
(422, 'Oath Keeper Recruit', 'Empire', 'Infantry', 1, 0),
(423, 'Poacher', 'Vlandia', 'Ranged', 2, 0),
(424, 'Principes', 'Empire', 'Infantry', 3, 0),
(425, 'Puppeteer', 'Empire', 'Infantry', 5, 0),
(426, 'Radagos\'s Raider', 'Looters', 'Infantry', 1, 0),
(427, 'Raider', 'Steppe Bandits', 'Horse Archer', 4, 78),
(428, 'Recruit Eleftheroi', 'Empire', 'Cavalry', 1, 0),
(429, 'Recruit Forester', 'Vakken', 'Ranged', 1, 0),
(430, 'Redshank', 'Battania', 'Ranged', 5, 0),
(431, 'Regular Fighter', 'Empire', 'Infantry', 2, 0),
(432, 'Sapling', 'Vlandia', 'Ranged', 3, 0),
(433, 'Sea Raider', 'Sea Raiders', 'Infantry', 2, 8),
(434, 'Sea Raider Boss', 'Sea Raiders', 'Infantry', 5, 81),
(435, 'Sea Raider Chief', 'Sea Raiders', 'Infantry', 4, 47),
(436, 'Sea Raider Warrior', 'Sea Raiders', 'Infantry', 3, 24),
(437, 'Seasoned Wolf', 'Battania', 'Ranged', 3, 0),
(438, 'Skene', 'Battania', 'Ranged', 2, 0),
(439, 'Skolder Recruit', 'Nord', 'Infantry', 2, 0),
(440, 'Skolder Recruit', 'Sturgia', 'Infantry', 2, 0),
(441, 'Skolder Veteran Brotva', 'Nord', 'Infantry', 5, 0),
(442, 'Skolder Veteran Brotva', 'Sturgia', 'Infantry', 5, 0),
(443, 'Skolder Warrior Brotva', 'Nord', 'Infantry', 3, 0),
(444, 'Skolder Warrior Brotva', 'Sturgia', 'Infantry', 3, 0),
(445, 'Sprout', 'Vlandia', 'Ranged', 2, 0),
(446, 'Steppe Bandit', 'Steppe Bandits', 'Cavalry', 2, 11),
(447, 'Steppe Bandit Boss', 'Steppe Bandits', 'Horse Archer', 5, 134),
(448, 'Sturgian Archer', 'Sturgia', 'Ranged', 4, 50),
(449, 'Sturgian Armed Trader', 'Sturgia', 'Ranged', 3, 0),
(450, 'Sturgian Berserker', 'Sturgia', 'Infantry', 4, 50),
(451, 'Sturgian Brigand', 'Sturgia', 'Infantry', 3, 25),
(452, 'Sturgian Caravan Guard', 'Sturgia', 'Cavalry', 4, 0),
(453, 'Sturgian Caravan Master', 'Sturgia', 'Infantry', 5, 0),
(454, 'Sturgian Druzhinnik', 'Sturgia', 'Cavalry', 5, 102),
(455, 'Sturgian Druzhinnik Champion', 'Sturgia', 'Cavalry', 6, 204),
(456, 'Sturgian Hardened Brigand', 'Sturgia', 'Cavalry', 4, 59),
(457, 'Sturgian Horse Raider', 'Sturgia', 'Cavalry', 5, 97),
(458, 'Sturgian Hunter', 'Sturgia', 'Ranged', 3, 30),
(459, 'Sturgian Militia Archer', 'Sturgia', 'Ranged', 2, 0),
(460, 'Sturgian Militia Spearman', 'Sturgia', 'Infantry', 2, 0),
(461, 'Sturgian Militia Veteran Archer', 'Sturgia', 'Ranged', 4, 0),
(462, 'Sturgian Militia Veteran Spearma', 'Sturgia', 'Infantry', 4, 0),
(463, 'Sturgian Recruit', 'Sturgia', 'Infantry', 1, 6),
(464, 'Sturgian Shock Troop', 'Sturgia', 'Infantry', 5, 75),
(465, 'Sturgian Soldier', 'Sturgia', 'Infantry', 3, 23),
(466, 'Sturgian Spearman', 'Sturgia', 'Infantry', 4, 44),
(467, 'Sturgian Ulfhednar', 'Sturgia', 'Infantry', 5, 79),
(468, 'Sturgian Veteran Bowman', 'Sturgia', 'Ranged', 5, 93),
(469, 'Sturgian Veteran Caravan Guard', 'Sturgia', 'Cavalry', 5, 0),
(470, 'Sturgian Veteran Warrior', 'Sturgia', 'Infantry', 5, 72),
(471, 'Sturgian Warrior', 'Sturgia', 'Infantry', 2, 8),
(472, 'Sturgian Warrior Son', 'Sturgia', 'Infantry', 2, 7),
(473, 'Sturgian Woodsman', 'Sturgia', 'Infantry', 2, 8),
(474, 'Sword Sister', 'Empire', 'Infantry', 4, 0),
(475, 'Triarii', 'Empire', 'Infantry', 5, 0),
(476, 'Varyag', 'Sturgia', 'Infantry', 3, 25),
(477, 'Varyag Veteran', 'Sturgia', 'Infantry', 4, 45),
(478, 'Veteran Borrowed Troop', 'Empire', 'Infantry', 2, 0),
(479, 'Veteran Eleftheroi', 'Empire', 'Cavalry', 5, 0),
(480, 'Veteran Fighter', 'Empire', 'Infantry', 3, 0),
(481, 'Veteran Forester', 'Vakken', 'Ranged', 5, 0),
(482, 'Veteran Guardian', 'Empire', 'Ranged', 5, 0),
(483, 'Veteran Oath Keeper', 'Empire', 'Infantry', 5, 0),
(484, 'Vlandian Armed Trader', 'Vlandia', 'Ranged', 3, 0),
(485, 'Vlandian Banner Knight', 'Vlandia', 'Cavalry', 6, 204),
(486, 'Vlandian Billman', 'Vlandia', 'Infantry', 4, 44),
(487, 'Vlandian Caravan Guard', 'Vlandia', 'Cavalry', 4, 0),
(488, 'Vlandian Caravan Master', 'Vlandia', 'Infantry', 5, 0),
(489, 'Vlandian Champion', 'Vlandia', 'Cavalry', 5, 105),
(490, 'Vlandian Crossbowman', 'Vlandia', 'Ranged', 3, 30),
(491, 'Vlandian Footman', 'Vlandia', 'Infantry', 2, 8),
(492, 'Vlandian Gallant', 'Vlandia', 'Cavalry', 3, 40),
(493, 'Vlandian Hardened Crossbowman', 'Vlandia', 'Ranged', 4, 57),
(494, 'Vlandian Infantry', 'Vlandia', 'Infantry', 3, 23),
(495, 'Vlandian Knight', 'Vlandia', 'Cavalry', 4, 62),
(496, 'Vlandian Levy Crossbowman', 'Vlandia', 'Ranged', 2, 11),
(497, 'Vlandian Light Cavalry', 'Vlandia', 'Cavalry', 4, 59),
(498, 'Vlandian Militia Archer', 'Vlandia', 'Ranged', 2, 0),
(499, 'Vlandian Militia Spearman', 'Vlandia', 'Infantry', 2, 0),
(500, 'Vlandian Militia Veteran Archer', 'Vlandia', 'Ranged', 4, 0),
(501, 'Vlandian Militia Veteran Spearma', 'Vlandia', 'Infantry', 4, 0),
(502, 'Vlandian Pikeman', 'Vlandia', 'Infantry', 5, 72),
(503, 'Vlandian Recruit', 'Vlandia', 'Infantry', 1, 6),
(504, 'Vlandian Sergeant', 'Vlandia', 'Infantry', 5, 44),
(505, 'Vlandian Sharpshooter', 'Vlandia', 'Ranged', 5, 93),
(506, 'Vlandian Spearman', 'Vlandia', 'Infantry', 3, 23),
(507, 'Vlandian Squire', 'Vlandia', 'Cavalry', 2, 12),
(508, 'Vlandian Swordsman', 'Vlandia', 'Infantry', 4, 23),
(509, 'Vlandian Vanguard', 'Vlandia', 'Cavalry', 5, 97),
(510, 'Vlandian Veteran Caravan Guard', 'Vlandia', 'Cavalry', 5, 0),
(511, 'Vlandian Voulgier', 'Vlandia', 'Infantry', 5, 72),
(512, 'Watchman', 'Mercenary', 'Infantry', 2, 7),
(513, 'Young Wolf', 'Battania', 'Ranged', 2, 0),
(514, 'Sturgian Heavy Axeman', 'Sturgia', 'Infantry', 5, 0),
(515, 'Battanian Oathsworn', 'Battania', 'Infantry', 5, 72),
(516, 'Sturgian Line Breaker', 'Sturgia', 'Infantry', 4, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(18) NOT NULL,
  `username` varchar(32) NOT NULL,
  `max_party_size` int(11) NOT NULL,
  `gold` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `guild`
--
ALTER TABLE `guild`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `participation`
--
ALTER TABLE `participation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quantity`
--
ALTER TABLE `quantity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `size_role`
--
ALTER TABLE `size_role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `troop`
--
ALTER TABLE `troop`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `participation`
--
ALTER TABLE `participation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quantity`
--
ALTER TABLE `quantity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
