/**
 * 密码管理相关的
 */
'use strict';

const { Service } = require('ee-core');
const Storage = require('ee-core/storage');
const _ = require('lodash');
const path = require('path');

const passwordTable = 'b_password';
const passwordHistoryTable = 'b_password_history';
const passwordBelongTable = 'b_password_belong';
const passwordLabelTable = 'b_password_label';

/**
 * 密码数据存储
 * @class
 */
class PasswordService extends Service {

  constructor (ctx) {
    super(ctx);

    // 初始化加载sqlite数据库
    this.sqliteFile = 'password.db';
    let sqliteOptions = {
      driver: 'sqlite',
      default: {
        timeout: 6000,
        verbose: console.log // 打印sql语法
      }
    }
    this.passwordSqliteDB = Storage.connection(this.sqliteFile, sqliteOptions);
  }

  /**
   * b_password （密码表）
   *
   * 检查并创建表 (sqlite)
   */
  async checkAndCreatePasswordTableSqlite(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name is required`);
    }
    // 检查表是否存在
    const passwordTable = this.passwordSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
    const result = passwordTable.get('table', tableName);
    //console.log('result:', result);
    if (result) {
      return;
    }

    // 创建表
    const create_table =
    `CREATE TABLE ${tableName}
     (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        password CHAR(100) NOT NULL,
        account CHAR(100) NOT NULL,
        description CHAR(50) NOT NULL,
        time TIMESTAMP,
        labels CHAR(255),
        website CHAR(255),
        belong INTEGER,
        sort INT
     );`
    this.passwordSqliteDB.db.exec(create_table);
  }

  /**
   * b_password_label (密码标签表)
   * 
   * @param {*} tableName 
   * @returns 
   */
  async checkAndCreatePasswordLabelTableSqlite(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name is required`);
    }
    // 检查表是否存在
    const passwordLabelTable = this.passwordSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
    const result = passwordLabelTable.get('table', tableName);
    //console.log('result:', result);
    if (result) {
      return;
    }

    // 创建表
    const create_table =
    `CREATE TABLE ${tableName}
     (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label CHAR(50) NOT NULL,
        color CHAR(50)
     );`
    this.passwordSqliteDB.db.exec(create_table);
  }

  /**
   * b_password_history (历史密码表)
   * 
   * @param {*} tableName 
   * @returns 
   */
  async checkAndCreatePasswordHistoryTableSqlite(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name is required`);
    }
    // 检查表是否存在
    const userTable = this.passwordSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
    const result = userTable.get('table', tableName);
    //console.log('result:', result);
    if (result) {
      return;
    }

    // 创建表
    const create_table =
    `CREATE TABLE ${tableName}
     (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        password CHAR(100) NOT NULL,
        relid INTEGER,
        remark CHAR(200),
        history TIMESTAMP
     );`
    this.passwordSqliteDB.db.exec(create_table);
  }

  /**
   * b_password_belong (密码所属比如软件、项目等)
   * 
   * @param {*} tableName 
   * @returns 
   */
  async checkAndCreatePasswordBelongTableSqlite(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name is required`);
    }
    // 检查表是否存在
    const passwordBelongTable = this.passwordSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
    const result = passwordBelongTable.get('table', tableName);
    //console.log('result:', result);
    if (result) {
      return;
    }

    // 创建表
    const create_table =
    `CREATE TABLE ${tableName}
     (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        belong CHAR(100) NOT NULL,
        color CHAR(20) DEFAULT NULL,
        sort INT
     );`
    this.passwordSqliteDB.db.exec(create_table);
  }

  /*
   * 增 Test data (sqlite)
   */
  async addPasswordDataSqlite(data) {
    await this.checkAndCreatePasswordTableSqlite(passwordTable);
    const insert = this.passwordSqliteDB.db.prepare(`INSERT INTO ${passwordTable} (account, password, description, labels, website, time, belong, sort) VALUES (@account, @password, @description, @labels, @website, @time, @belong, @sort)`);
    insert.run(data);
    return true;
  }

  /*
   * 删 Test data (sqlite)
   */
  async delPasswordDataSqlite(id = '') {
    await this.checkAndCreatePasswordTableSqlite(passwordTable);
    const delUser = this.passwordSqliteDB.db.prepare(`DELETE FROM ${passwordTable} WHERE id = ?`);
    delUser.run(id);
    return true;
  }

  /*
   * 改 Test data (sqlite)
   */
  async updatePasswordDataSqlite(data) {
    await this.checkAndCreatePasswordTableSqlite(passwordTable);
    const updateUser = this.passwordSqliteDB.db.prepare(`UPDATE ${passwordTable} SET account = @account, password = @password, description = @description, labels = @labels, website = @website, time = @time, sort = @sort WHERE id = @id`);
    updateUser.run(data);
    return true;
  }  

  /*
   * 查 Test data (sqlite)
   */
  async getPasswordDataSqlite(id) {
    await this.checkAndCreateTableSqlite(passwordTable);
    const selectPassword = this.passwordSqliteDB.db.prepare(`SELECT * FROM ${passwordTable} WHERE id = @id`);
    const passwords = selectPassword.all({id: id});
    return passwords;
  }  
  
  /*
   * all Test data (sqlite)
   */
  async getAllPasswordDataSqlite(belong) {
    await this.checkAndCreatePasswordTableSqlite(passwordTable);
    const selectAllPassword = this.passwordSqliteDB.db.prepare(`SELECT * FROM ${passwordTable} WHERE belong = ?`);
    const allPassword =  selectAllPassword.all(belong);
    return allPassword;
  }

  /*
   * 增 Test data (sqlite)
   */
  async addPasswordBelongDataSqlite(data) {
    await this.checkAndCreatePasswordBelongTableSqlite(passwordBelongTable);
    const insert = this.passwordSqliteDB.db.prepare(`INSERT INTO ${passwordBelongTable} (belong, color, sort) VALUES (@belong, @color, @sort)`);
    insert.run(data);
    return true;
  }

  /*
   * 删 Test data (sqlite)
   */
  async delPasswordBelongDataSqlite(id = '') {
    await this.checkAndCreatePasswordBelongTableSqlite(passwordBelongTable);
    await this.checkAndCreatePasswordTableSqlite(passwordTable);
    const delPasswordBelong = this.passwordSqliteDB.db.prepare(`DELETE FROM ${passwordBelongTable} WHERE id = ?`);
    delPasswordBelong.run(id);
    // 删除所属的密码信息
    const delPassword = this.passwordSqliteDB.db.prepare(`DELETE FROM ${passwordTable} WHERE belong = ?`);
    delPassword.run(id);
    return true;
  }

  /*
   * 改 Test data (sqlite)
   */
  async updatePasswordBelongDataSqlite(data) {
    await this.checkAndCreatePasswordBelongTableSqlite(passwordBelongTable);
    const updateBelong = this.passwordSqliteDB.db.prepare(`UPDATE ${passwordBelongTable} SET belong = @belong, color = @color, sort = @sort WHERE id = @id`);
    updateBelong.run(data);
    return true;
  }  

  /*
   * 查 Test data (sqlite)
   */
  async getPasswordBelongDataSqlite(id) {
    await this.checkAndCreatePasswordBelongTableSqlite(passwordBelongTable);
    const selectBelong = this.passwordSqliteDB.db.prepare(`SELECT * FROM ${passwordBelongTable} WHERE id = @id`);
    const belongs = selectBelong.all({id: id});
    return belongs;
  }  
  
  /*
   * all Test data (sqlite)
   */
  async getAllPasswordBelongDataSqlite() {
    await this.checkAndCreatePasswordBelongTableSqlite(passwordBelongTable);
    const selectAllBelong = this.passwordSqliteDB.db.prepare(`SELECT * FROM ${passwordBelongTable}`);
    const allBelong =  selectAllBelong.all();
    return allBelong;
  }
}

PasswordService.toString = () => '[class PasswordService]';
module.exports = PasswordService;
