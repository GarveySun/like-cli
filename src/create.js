const getConfig = require('./lib/getConfig')
const log = require('./lib/log')
const fse = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer');
const getProjects = require('./lib/getProjects');
const chalk = require('chalk')

const replaceKeys = function(target,info){

  let files = [
    path.join(target,'likePackage.js'),
    path.join(target,'fileCopy/index.php')
  ]

  return Promise.all(files.map(item=>{
    return fse.readFile(item,'utf-8').then(res=>{
      for(let k in info){
        res = res.replace('${'+k+'}',info[k])
      }
      return res
    }).then(content => {
      return fse.writeFile(item,content,'utf-8')
    })
  }))

}

module.exports = function () {
  const config = getConfig()
  const projects = getProjects()

  const promptList = [
    {
      type: 'list',
      message: '请选择一个分组',
      name: 'group',
      choices: [
        'app',
        'activity',
        'manage',
        'static',
        'test'
      ]
    },{
      type: 'input',
      message: '输入项目名称（英文）',
      name: 'name',
      validate: function (val,answers) {
        if (/^[a-zA-Z0-9]+$/.test(val)) {
          if(projects.filter(item=>item.group===answers.group).some(item=>item.name.toLowerCase()===val.toLowerCase())){
            return answers.group+'分组中已经存在名为'+val+'的项目，拒绝重名(大小写不敏感)'
          }else{
            return true
          }
        }

        return '名称仅支持大小写英文和数字'
      }
    },{
      type: 'list',
      message: '请选择一个类型',
      name: 'type',
      choices: [
        'vue',
        'react',
        'html'
      ]
    }];

  inquirer.prompt(promptList).then(answers=>{
    let info = {
      project_id:Math.max(...projects.filter(item=>item.group===answers.group).map(item=>item.id))+1,
      project_group:answers.group,
      project_name:answers.name
    }

    // 目标文件夹
    let target = path.join(config.root,'src/pages',answers.group,answers.name)

    fse.ensureDir(target).then(()=>{

      // 样板路径
      let sorce = path.join(__dirname,'../data/projectExample',answers.type)

      return fse.copy(sorce,target)

    }).then(()=>{
      return replaceKeys(target,info)
    }).then(()=>{
      console.log(chalk.cyan('release success! project_id:')+info.project_id)

    })
  })

}
