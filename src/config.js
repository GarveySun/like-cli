/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: index
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-04-02-14:03
 * Description:
 *
 *************************************************/
const config = require('../data/config.json')
const log = require('./lib/log')
const fse = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer');

const handleGet = function(){
  log.out(config)
}

const handleSet = function(){
  const promptList = [
    {
      type: 'input',
      message: '输入项目目录，精确到 ***/likechuxing-html-src/frontend 文件夹',
      name: 'root',
      validate: function (val) {
        if(/frontend$/.test(val)){
          return true
        }

        return '请精确到 ***/likechuxing-html-src/frontend 文件夹'
      },
      default:config.root
    },
    {
      type: 'input',
      message: '输入你的名字（全英文）',
      name: 'name',
      validate: function (val) {
        if(val === config.name || /^[a-zA-Z0-9\s]+$/.test(val)){
          return true
        }

        return '请输入全英文名字'
      },
      default:config.name
    },
    {
      type: 'input',
      message: '输入你的邮箱（XXX@likechuxing.com）',
      name: 'email',
      validate: function (val) {
        if(val === config.email || /@likechuxing\.com$/.test(val)){
          return true
        }

        return '请设置公司邮箱'
      },
      default:config.email
    },
  ];

  inquirer.prompt(promptList).then(answers=>{
    let file_path = path.join(__dirname,'../data/config.json')
    fse.writeJson(file_path, answers, {spaces:2}).then(()=>{
        return fse.readJson(file_path)
    }).then(res=>{
      log.out(res)
    }).catch(err=>{
      throw err
    })
  })
}

module.exports = function(method){

  switch (method){
    case 'get':
      handleGet()
      break;
    case 'set':
      handleSet()
      break;
    default:
      log.error('无效的操作参数，lkf config [get|set]')
  }

}
