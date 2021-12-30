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

 Date: 30/12/2021 14:00:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for course_instance
-- ----------------------------
DROP TABLE IF EXISTS `course_instance`;
CREATE TABLE `course_instance`  (
  `courseId` varchar(36) CHARACTER SET utf8mb4  NOT NULL,
  `courseTemplateId` varchar(36) CHARACTER SET utf8mb4  NOT NULL,
  `classroom` varchar(20) CHARACTER SET utf8mb4  NOT NULL,
  `classTime` varchar(20) CHARACTER SET utf8mb4  NOT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `staffId` varchar(36) CHARACTER SET utf8mb4  NOT NULL,
  `beginYear` int NOT NULL,
  `endYear` int NOT NULL,
  `semester` int NOT NULL,
  `classNum` int NULL DEFAULT NULL COMMENT '教学班号',
  PRIMARY KEY (`courseId`) USING BTREE,
  UNIQUE INDEX `course_instance_courseTemplateId_staffId_uindex`(`courseTemplateId`, `staffId`) USING BTREE,
  INDEX `course_instance_teacher_staffId_fk`(`staffId`) USING BTREE,
  CONSTRAINT `course_instance_course_template_courseId_fk` FOREIGN KEY (`courseTemplateId`) REFERENCES `course_template` (`courseTemplateId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_instance_teacher_staffId_fk` FOREIGN KEY (`staffId`) REFERENCES `teacher` (`staffId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4  ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of course_instance
-- ----------------------------
INSERT INTO `course_instance` VALUES ('0d9c64c8-a3f3-4ab2-a067-686840f2b0ff', '691fb5e7-8d79-44f8-abe4-9a40ed68fae4', '4教东401', '周四10-11节', '2021-12-30 13:02:13', '2021-12-30 13:17:28', '400401', 2021, 2022, 1, 11);
INSERT INTO `course_instance` VALUES ('3380d4f7-af09-44f0-8e85-f98366f33dd7', 'a144fe72-282f-4b59-8762-6a82535d8a2f', '四教南111', '周四10-11节', '2021-12-30 13:41:12', '2021-12-30 13:41:12', '400401', 2021, 2022, 2, 11);

-- ----------------------------
-- Table structure for course_template
-- ----------------------------
DROP TABLE IF EXISTS `course_template`;
CREATE TABLE `course_template`  (
  `courseTemplateId` varchar(36) CHARACTER SET utf8mb4  NOT NULL,
  `courseName` varchar(20) CHARACTER SET utf8mb4  NOT NULL,
  `credit` int NULL DEFAULT 2,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `courseCode` varchar(10) CHARACTER SET utf8mb4  NOT NULL,
  `courseState` int NULL DEFAULT 1,
  `courseNature` varchar(20) CHARACTER SET utf8mb4  NULL DEFAULT '实践必修',
  PRIMARY KEY (`courseTemplateId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4  ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of course_template
-- ----------------------------
INSERT INTO `course_template` VALUES ('63442c89-ec74-40d8-beba-d5cdcf6f7527', '创新实践4', 2, '2021-12-30 12:46:25', '2021-12-30 12:46:25', 'S0500784', 1, '实践必修');
INSERT INTO `course_template` VALUES ('691fb5e7-8d79-44f8-abe4-9a40ed68fae4', '创新实践1', 2, '2021-12-30 12:45:31', '2021-12-30 12:45:31', 'S0500781', 1, '实践必修');
INSERT INTO `course_template` VALUES ('a144fe72-282f-4b59-8762-6a82535d8a2f', '创新实践2', 2, '2021-12-30 12:45:52', '2021-12-30 12:45:52', 'S0500782', 1, '实践必修');
INSERT INTO `course_template` VALUES ('c582d8c7-f552-4018-9e68-1599387d2463', '创新实践3', 2, '2021-12-30 12:46:11', '2021-12-30 12:46:11', 'S0500783', 1, '实践必修');

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher`  (
  `staffId` varchar(10) CHARACTER SET utf8mb4  NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4  NOT NULL,
  `password` char(32) CHARACTER SET utf8mb4  NOT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isAdmin` tinyint NOT NULL DEFAULT 0,
  `forbidden` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`staffId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4  ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES ('400401', 'admin', '46ec6891c9353c9d4c4bed40810983a3', '2021-12-01 00:07:28', '2021-12-30 13:44:07', 1, 0);
INSERT INTO `teacher` VALUES ('400402', 'test', 'ff35c32c464b8ee66d94c17fe8ad5b80', '2021-12-30 12:47:17', '2021-12-30 13:44:26', 0, 0);

-- ----------------------------
-- Table structure for template
-- ----------------------------
DROP TABLE IF EXISTS `template`;
CREATE TABLE `template`  (
  `tid` varchar(64) CHARACTER SET utf8mb4  NOT NULL,
  `filepath` varchar(255) CHARACTER SET utf8mb4  NOT NULL COMMENT '模板在服务器的路径',
  `templateName` char(255) CHARACTER SET utf8mb4  NOT NULL COMMENT '模板文件名',
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`tid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4  ROW_FORMAT = Dynamic;

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
  `id` char(36) CHARACTER SET utf8mb4  NOT NULL COMMENT '实例ID',
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tags` text CHARACTER SET utf8mb4  NOT NULL COMMENT '变量',
  `staffId` varchar(10) CHARACTER SET utf8mb4  NOT NULL,
  `templateId` char(36) CHARACTER SET utf8mb4  NOT NULL,
  `courseId` varchar(36) CHARACTER SET utf8mb4  NULL DEFAULT NULL,
  `name` varchar(64) CHARACTER SET utf8mb4  NULL DEFAULT '实例',
  `excelId` varchar(36) CHARACTER SET utf8mb4  NULL DEFAULT NULL COMMENT '若有成绩实例，则此字段不为空',
  `type` tinyint NULL DEFAULT 0,
  `excelS` varchar(36) CHARACTER SET utf8mb4  NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `template_instance_pk`(`staffId`, `courseId`, `templateId`, `excelS`) USING BTREE,
  INDEX `template_instance_template_instance_id_fk`(`excelId`) USING BTREE,
  INDEX `template_instance_template_tid_fk`(`templateId`) USING BTREE,
  INDEX `template_instance_course_instance_courseId_fk`(`courseId`) USING BTREE,
  CONSTRAINT `template_instance_course_instance_courseId_fk` FOREIGN KEY (`courseId`) REFERENCES `course_instance` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `template_instance_teacher_staffId_fk` FOREIGN KEY (`staffId`) REFERENCES `teacher` (`staffId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `template_instance_template_instance_id_fk` FOREIGN KEY (`excelId`) REFERENCES `template_instance` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `template_instance_template_tid_fk` FOREIGN KEY (`templateId`) REFERENCES `template` (`tid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4  ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of template_instance
-- ----------------------------
INSERT INTO `template_instance` VALUES ('0419c0e5-a17b-4193-af73-01c82cd075b2', '2021-12-30 13:39:26', '2021-12-30 13:39:26', '{\"clints\":[{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86},{\"序号\":1,\"学号\":20051601,\"姓名\":\"哈哈哈\",\"团队表现\":99,\"作品\":97,\"答辩\":78,\"文档\":76,\"总评\":86}]}', '400401', 'ab0b8f02-bb67-459d-abc3-12430bbc2ffe', NULL, '创新实践1成绩册.xlsx', NULL, 1, 'fa9f89f6-24ab-4903-889c-2d1e163d93fb');
INSERT INTO `template_instance` VALUES ('c382dc21-9d55-40db-9def-93d22dcbfa32', '2021-12-30 13:38:09', '2021-12-30 13:39:46', '{\"beginSchoolYear\":2021,\"endSchoolYear\":2022,\"semester\":1,\"teacherName\":\"admin\",\"courseName\":\"创新实践1\",\"courseCode\":\"(2021-2022-1)-S0500781-11\",\"nature\":\"实践必修\",\"editTime\":\"2021-12-30\",\"credit\":2,\"totalHours\":\"40\",\"teachHours\":\"12\",\"experiHours\":\"12\",\"operateHours\":\"12\",\"practiceHours\":\"12\",\"selfStudyHours\":\"12\",\"resource\":\"教学资源\",\"assessment\":\"教学任务\",\"courseTime\":\"周四10-11节\",\"classroom\":\"4教东401\"}', '400401', '19b1b800-0961-468a-986d-d00ee91aa10e', '0d9c64c8-a3f3-4ab2-a067-686840f2b0ff', '创新实践1教学文档', '0419c0e5-a17b-4193-af73-01c82cd075b2', 0, '1');

SET FOREIGN_KEY_CHECKS = 1;
