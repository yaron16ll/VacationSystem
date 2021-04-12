-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: travelagency
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `destinations`
--

DROP TABLE IF EXISTS `destinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinations`
--

LOCK TABLES `destinations` WRITE;
/*!40000 ALTER TABLE `destinations` DISABLE KEYS */;
INSERT INTO `destinations` VALUES (5,'Australia'),(9,'Brazil'),(7,'China'),(4,'Italy'),(8,'Japan'),(10,'Russia'),(1,'Thailand'),(6,'The Caribbean'),(2,'UK'),(3,'US');
/*!40000 ALTER TABLE `destinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `followings`
--

DROP TABLE IF EXISTS `followings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `followings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `vacation_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_id_idx` (`user_id`),
  KEY `fk_vacation_id_idx` (`vacation_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_vacation_id` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=932 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followings`
--

LOCK TABLES `followings` WRITE;
/*!40000 ALTER TABLE `followings` DISABLE KEYS */;
INSERT INTO `followings` VALUES (883,2,5),(885,2,6),(886,2,8),(887,2,14),(888,2,1),(889,2,7),(890,2,12),(922,1,9),(930,1,8),(931,1,13);
/*!40000 ALTER TABLE `followings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `user_type` varchar(45) NOT NULL DEFAULT 'CUSTOMER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'daniel','mizrahi','oasis@gmail.com','Aa1234','CUSTOMER'),(2,'avi','Cohen','avi@gmail.com','Bb1234','CUSTOMER'),(3,'asi','Cohen','asi45@gmail.com','Cc1234','CUSTOMER'),(4,'dani','Lavi','dani@gmail.com','Ff1234','CUSTOMER'),(5,'dan','Cohen','dan78@gmail.com','1235Aa','ADMIN'),(10,'danny','Cohen','da18@gmail.com','Ee1234','CUSTOMER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city` varchar(45) NOT NULL,
  `description` varchar(220) NOT NULL,
  `picture` varchar(200) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` double(8,2) NOT NULL DEFAULT '0.00',
  `followings_amount` int NOT NULL DEFAULT '0',
  `destination_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `picture_UNIQUE` (`picture`),
  KEY `fk_destination_id_idx` (`destination_id`),
  CONSTRAINT `fk_destination_id` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (1,'New York','Take a trip to New York and allow yourself to be swept up in the energy and excitement of the \"city that never sleeps\".','newYork.jpg','2020-11-11','2021-11-30',20000.54,1,3),(3,'WashingtonDC','Washington DC is one of the most interesting and popular cities in the United States, and for good reason! It is the capital of the country.','washingtonDc.jpg','2020-11-21','2020-12-25',18524.54,0,3),(4,'London','From trendsetting shops and stylish hotels to world-class theater and regal history, London is the heartbeat of Britain.','london.jpg','2020-11-28','2020-12-25',18524.54,0,2),(5,'Rome','Rome has major attractions like Colosseum and Pantheon, it shouldn\'t be a surprise that this area is the number one choice for many visitors. ','rome.jpg','2020-11-21','2020-12-23',12522.54,1,4),(6,'Sydney','Sydney is a harbour city, and its situation fronting the huge expanse of sheltered water make it one of the most spectacular cities in the World.','sydney.jpg','2020-10-21','2020-11-23',12522.54,1,5),(7,'Carribbean Islands','Each Island has it\'s own story to tell, each rich with history,Once you\'ve experienced one island you\'ll want to experience all of the Caribbean.','Carribbean.jpg','2020-11-21','2020-12-23',12622.54,1,6),(8,'Hong Kong','Explore Hong Kong, the place where East meets West! Western culture coexists seamlessly with traditional philosophy.','hongKong.jpg','2020-11-10','2020-12-23',22622.54,2,7),(9,'Shanghai','Not only is Shanghai the largest city in China but it’s also one of the largest cities in the world. It’s an important business center.','shanghai.jpg','2020-11-10','2021-01-23',21622.54,1,7),(10,'Tokyo','A Tokyo vacation means you’ll discover incredible technology in a place that also promotes rich traditions.','tokyo.jpg','2020-11-10','2021-01-23',22632.54,0,8),(11,'Venice','A vacation in Italy is not complete without a visit to Venice, especially for those seeking a romantic getaway. The visually striking canals, designer shops.','Venice.jpg','2020-12-10','2021-01-23',12632.54,0,4),(12,'Rio de Janeiro','Rio de Janeiro is full of sights, including Christ the Redeemer and Sugar Loaf Mountain. These two top most tourists\' to-do lists.','rio.jpg','2020-12-10','2021-01-23',16632.54,1,9),(13,'Moscow','Moscow is full of activities to do on vacation – from visiting Red Square and the Kremlin to taking an excursion to the Pushkin Museum.','Moscow.jpg','2020-12-23','2021-01-25',18632.54,1,10),(14,'Bangkok','Bangkok serves up a mix of old-world and new-world,Its sensory delight is riddled with contrasts, from gold temples to modern office buildings.','thailand.jpg','2020-10-28','2021-01-23',12622.54,1,1);
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-26  1:32:30
