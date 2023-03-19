'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { Controller } = require('ee-core');
const {
  app: electronApp,
  dialog, shell, BrowserView, Notification, 
  powerMonitor, screen, nativeTheme
} = require('electron');
const dayjs = require('dayjs');
const { ChildJob } = require('ee-core/jobs');
const Ps = require('ee-core/ps');
const Log = require('ee-core/log');

let myTimer = null;
let browserViewObj = null;
let notificationObj = null;

/**
 * 示例控制器
 * @class
 */
class PasswordController extends Controller {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。invoke()方法时，event == IpcMainInvokeEvent; send()/sendSync()方法时，event == IpcMainEvent
   */

  /**
   * json数据库操作
   */   
  async dbOperation(args) {
    const { service } = this;
    const paramsObj = args;
    //Log.info('eeeee paramsObj:', paramsObj);
    const data = {
      action: paramsObj.action,
      result: null,
      all_list: []
    };
    
    switch (paramsObj.action) {
      case 'add' :
        data.result = await service.password.addPassword(paramsObj.info);;
        break;
      case 'del' :
        data.result = await service.password.delPassword(paramsObj.delete_name);;
        break;
      case 'update' :
        data.result = await service.password.updatePassword(paramsObj.update_info);
        break;
      case 'get' :
        data.result = await service.password.getPassword(paramsObj.search_id);
        break;
      case 'addBelong' :
        data.result = await service.password.addBelong(paramsObj.info);;
        break;
      case 'delBelong' :
        data.result = await service.password.delBelong(paramsObj.delete_id);;
        break;
      case 'updateBelong' :
        data.result = await service.password.updateBelong(paramsObj.update_info);
        break;
      case 'getBelong' :
        data.result = await service.password.getBelong(paramsObj.search_id);
        break;
    }

    data.all_list = await service.password.getAllPasswordData();

    return data;
  }
}

PasswordController.toString = () => '[class PasswordController]';
module.exports = PasswordController;
