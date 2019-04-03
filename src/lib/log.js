/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: stdout
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-04-02-14:11
 * Description:
 *
 *************************************************/
const chalk = require('chalk')

const formatString = function(data){
  if('string' === typeof data){
    return data;
  }else{
    return JSON.stringify(data,null,2);
  }
}

module.exports = {
  out(data){console.log(formatString(data))},

  success(data){console.log(chalk.cyan(formatString(data)))},

  warn(data){console.log(chalk.yellow(formatString(data)))},

  error(data){console.log(chalk.red(formatString(data)))}
}
