/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: getConfig
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-04-02-14:03
 * Description:
 *
 *************************************************/
const log = require('../lib/log')
const config = require('../../data/config.json')
const keys = [
  'root',
  'name',
  'email'
]

module.exports = function(){

  // 未设定的值为空字符串
  if(keys.some(key=>config[key]==='')) {
    log.error('config.json中必要的值为空，请先用lkf config set进行设置')
    process.exit()
  }

  return true
}
