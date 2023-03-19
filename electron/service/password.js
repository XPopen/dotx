/**
 * 密码管理相关的
 */
'use strict';

const { Service } = require('ee-core');
const Storage = require('ee-core/storage');
const _ = require('lodash');
const path = require('path');

/**
 * 密码数据存储
 * @class
 */
class PasswordService extends Service {

  constructor (ctx) {
    super(ctx);

    // sqlite数据库
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
    const userTable = this.demoSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
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
        account CHAR(100) NOT NULL,
        description CHAR(50) NOT NULL,
        time TIMESTAMP,
        labels CHAR(255),
        belong INTEGER,
        sort INT
     );`
    this.demoSqliteDB.db.exec(create_table);

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
    const userTable = this.demoSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
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
        label CHAR(50) NOT NULL,
        color CHAR(50)
     );`
    this.demoSqliteDB.db.exec(create_table);

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
    const userTable = this.demoSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
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
    this.demoSqliteDB.db.exec(create_table);

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
    const userTable = this.demoSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
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
        belong CHAR(100) NOT NULL,
        color CHAR(20) DEFAULT NULL,
        sort INT
     );`
    this.demoSqliteDB.db.exec(create_table);

  }

  /*
   * 增 Test data (sqlite)
   */
  async addTPasswordDataSqlite(data) {
    //console.log("add data:", data);

    let table = 'b_password';
    await this.checkAndCreatePasswordTableSqlite(table);

    const insert = this.demoSqliteDB.db.prepare(`INSERT INTO ${table} (account, password, description, labels, time, belong, sort) VALUES (@account, @password, @description, @labels, @time, @belong, @sort)`);
    insert.run(data);

    return true;
  }

  /*
   * 删 Test data (sqlite)
   */
  async delPasswordDataSqlite(id = '') {
    //console.log("delete name:", name);

    let table = 'b_password';
    await this.checkAndCreatePasswordTableSqlite(table);

    const delUser = this.demoSqliteDB.db.prepare(`DELETE FROM ${table} WHERE id = ?`);
    delUser.run(id);

    return true;
  }

  /*
   * 改 Test data (sqlite)
   */
  async updatePasswordDataSqlite(data) {
    let table = 'b_password';
    let historyTable = 'b_password_history';
    await this.checkAndCreatePasswordTableSqlite(table);
    await this.checkAndCreatePasswordHistoryTableSqlite(table);

    const updateUser = this.demoSqliteDB.db.prepare(`UPDATE ${table} SET password = @password, labels = @labels, time = @time, sort = @sort WHERE id = @id`);
    updateUser.run(data);

    return true;
  }  

  /*
   * 查 Test data (sqlite)
   */
  async getPasswordDataSqlite(id) {
    //console.log("select :", {age});

    let table = 'b_password';
    await this.checkAndCreateTableSqlite(table);

    const selectUser = this.demoSqliteDB.db.prepare(`SELECT * FROM ${table} WHERE id = @id`);
    const users = selectUser.all({id: id});
    //console.log("select users:", users);
    return users;
  }  
  
  /*
   * all Test data (sqlite)
   */
  async getAllPasswordDataSqlite(belong) {
    //console.log("select all user");

    let table = 'b_password';
    await this.checkAndCreatePasswordTableSqlite(table);

    const selectAllPassword = this.demoSqliteDB.db.prepare(`SELECT * FROM ${table} WHERE belong = ?`);
    const allPassword =  selectAllPassword.all(belong);
    //console.log("select allUser:", allUser);
    return allPassword;
  }
  
  /*
   * get data dir (sqlite)
   */
  async getDataDir() {
    const dir = this.demoSqliteDB.getStorageDir();    

    return dir;
  } 

  /*
   * set custom data dir (sqlite)
   */
  async setCustomDataDir(dir) {
    if (_.isEmpty(dir)) {
      return;
    }

    // the absolute path of the db file
    const dbFile = path.join(dir, this.sqliteFile);
    const sqliteOptions = {
      driver: 'sqlite',
      default: {
        timeout: 6000,
        verbose: console.log
      }
    }
    this.demoSqliteDB = Storage.connection(dbFile, sqliteOptions);    

    return;
  }
}

PasswordService.toString = () => '[class PasswordService]';
module.exports = PasswordService;
