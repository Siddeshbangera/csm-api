CREATE TABLE `cms`.`user_tb` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(1000) NOT NULL,
  `password` VARCHAR(1000) NOT NULL,
  `isActive` TINYINT NOT NULL DEFAULT 0,
  `isAdmin` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));


CREATE TABLE `cms`.`issue_tb` (
  `issue_id` INT NOT NULL AUTO_INCREMENT,
  `id` INT NOT NULL,
  `pincode` VARCHAR(45) NULL,
  `lat` VARCHAR(1000) NULL,
  `long` VARCHAR(1000) NULL,
  `add1` VARCHAR(1000) NULL,
  `add2` VARCHAR(1000) NULL,
  `image1` VARCHAR(1000) NULL,
  `image2` VARCHAR(1000) NULL,
  `image3` VARCHAR(1000) NULL,
  `status` VARCHAR(1000) NULL,
  `isActive` VARCHAR(45) NULL,
  PRIMARY KEY (`issue_id`));