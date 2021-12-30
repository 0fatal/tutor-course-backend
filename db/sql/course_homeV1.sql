/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80022
 Source Host           : localhost:3306
 Source Schema         : course_home

 Target Server Type    : MySQL
 Target Server Version : 80022
 File Encoding         : 65001

 Date: 22/12/2021 14:12:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course`  (
  `courseId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `courseName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `courseNum` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `beginYear` int NOT NULL,
  `courseState` tinyint NULL DEFAULT 0 COMMENT '是否开课：0 未开课，1 开课',
  `endYear` int NOT NULL,
  `credit` tinyint NULL DEFAULT 2 COMMENT '学分',
  `semester` tinyint NOT NULL COMMENT '学期',
  `courseNatureId` int NULL DEFAULT NULL,
  PRIMARY KEY (`courseId`) USING BTREE,
  UNIQUE INDEX `course_courseNum_uindex`(`courseNum`) USING BTREE,
  INDEX `course_course_nature_id_fk`(`courseNatureId`) USING BTREE,
  CONSTRAINT `course_course_nature_id_fk` FOREIGN KEY (`courseNatureId`) REFERENCES `course_nature` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of course
-- ----------------------------
INSERT INTO `course` VALUES ('d6b7d891-d39b-4740-a466-1a5f59774541', '创新实践2', 'S0500782', '2021-12-21 17:06:33', '2021-12-22 00:17:24', 2021, 1, 2022, 2, 2, 1);
INSERT INTO `course` VALUES ('d6b7d891-d39b-4740-a466-1a5f59774543', '创新实践3', 'S0500783', '2021-12-21 17:07:16', '2021-12-21 18:26:27', 2022, 1, 2023, 2, 1, 1);
INSERT INTO `course` VALUES ('d6b7d891-d39b-4740-a466-1a5f59774545', '创新实践1', 'S0500781', '2021-12-02 19:15:23', '2021-12-21 09:00:10', 2021, 1, 2022, 2, 1, 1);

-- ----------------------------
-- Table structure for course_nature
-- ----------------------------
DROP TABLE IF EXISTS `course_nature`;
CREATE TABLE `course_nature`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `course_nature_name_uindex`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of course_nature
-- ----------------------------
INSERT INTO `course_nature` VALUES (1, '实践必修');

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher`  (
  `staffId` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isAdmin` tinyint NOT NULL DEFAULT 0,
  PRIMARY KEY (`staffId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES ('400401', 'admin', '9fbe545a8997556d8534e616387c2a0b', '2021-12-01 00:07:28', '2021-12-21 23:41:22', 1);

-- ----------------------------
-- Table structure for template
-- ----------------------------
DROP TABLE IF EXISTS `template`;
CREATE TABLE `template`  (
  `tid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `filepath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '模板在服务器的路径',
  `templateName` char(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '模板文件名',
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`tid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of template
-- ----------------------------
INSERT INTO `template` VALUES ('19b1b800-0961-468a-986d-d00ee91aa10e', 'template\\19b1b800-0961-468a-986d-d00ee91aa10e.docx', 'course-template.docx', '2021-12-16 18:12:14', 0);
INSERT INTO `template` VALUES ('ab0b8f02-bb67-459d-abc3-12430bbc2ffe', 'template\\ab0b8f02-bb67-459d-abc3-12430bbc2ffe.docx', 'demo.docx', '2021-12-16 17:34:06', 1);

-- ----------------------------
-- Table structure for template_instance
-- ----------------------------
DROP TABLE IF EXISTS `template_instance`;
CREATE TABLE `template_instance`  (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '实例ID',
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tags` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '变量',
  `staffId` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `templateId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `courseId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '实例',
  `excelId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '若有成绩实例，则此字段不为空',
  `type` tinyint NULL DEFAULT 0,
  `excelS` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `template_instance_pk`(`staffId`, `courseId`, `templateId`, `excelS`) USING BTREE,
  INDEX `template_instance_course_courseId_fk`(`courseId`) USING BTREE,
  INDEX `template_instance_template_instance_id_fk`(`excelId`) USING BTREE,
  INDEX `template_instance_template_tid_fk`(`templateId`) USING BTREE,
  CONSTRAINT `template_instance_course_courseId_fk` FOREIGN KEY (`courseId`) REFERENCES `course` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `template_instance_teacher_staffId_fk` FOREIGN KEY (`staffId`) REFERENCES `teacher` (`staffId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `template_instance_template_instance_id_fk` FOREIGN KEY (`excelId`) REFERENCES `template_instance` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `template_instance_template_tid_fk` FOREIGN KEY (`templateId`) REFERENCES `template` (`tid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of template_instance
-- ----------------------------
INSERT INTO `template_instance` VALUES ('0d1f292e-1b7d-48b0-8e77-37c5d5872cb0', '2021-12-16 18:13:36', '2021-12-21 19:31:03', '{\"beginSchoolYear\":2021,\"endSchoolYear\":2022,\"semester\":2,\"teacherName\":\"admin\",\"courseName\":\"创新实践2\",\"courseCode\":\"(2021-2022-2)-S0500782-\",\"nature\":\"实践必修\",\"editTime\":\"2021-12-21\",\"credit\":2,\"totalHours\":\"\",\"teachHours\":\"\",\"experiHours\":\"\",\"operateHours\":\"\",\"practiceHours\":\"\",\"selfStudyHours\":\"\",\"resource\":\"\",\"assessment\":\"\",\"courseTime\":\"\",\"classroom\":\"\"}', '400401', '19b1b800-0961-468a-986d-d00ee91aa10e', 'd6b7d891-d39b-4740-a466-1a5f59774541', '测试一下', NULL, 0, NULL);
INSERT INTO `template_instance` VALUES ('149046b0-2818-4058-89ac-85111c11d0ee', '2021-12-21 23:03:44', '2021-12-21 23:03:44', '{\"clints\":[{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86}]}', '400401', 'ab0b8f02-bb67-459d-abc3-12430bbc2ffe', NULL, 'demo.xlsx', NULL, 1, '9f35a2d7-e5c4-4a32-969e-1d6c7cf29849');
INSERT INTO `template_instance` VALUES ('bde11a34-318f-4f2d-a401-61ceafcf7fff', '2021-12-16 18:13:36', '2021-12-21 17:02:06', '{\"beginSchoolYear\":\"2021\",\"endSchoolYear\":2022,\"semester\":1,\"teacherName\":\"admin\",\"courseName\":\"创新实践1\",\"courseCode\":\"(2021-2022-1)-S0500781-11\",\"nature\":\"专业必修课\",\"editTime\":\"2021-12-16\",\"credit\":\"2\",\"totalHours\":\"10\",\"teachHours\":\"2\",\"experiHours\":\"2\",\"operateHours\":\"2\",\"practiceHours\":\"2\",\"selfStudyHours\":\"2\",\"resource\":\"无\",\"assessment\":\"无\",\"courseTime\":\"周四10-11节\",\"classroom\":\"四教北111\"}', '400401', '19b1b800-0961-468a-986d-d00ee91aa10e', 'd6b7d891-d39b-4740-a466-1a5f59774545', '测试生成的实例', NULL, 0, NULL);

SET FOREIGN_KEY_CHECKS = 1;
