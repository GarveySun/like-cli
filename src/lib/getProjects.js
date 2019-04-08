const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const config = require('../../data/config.json')

module.exports = function () {

// 待发布的目录，对应 likechuxing-html/frontendDist
  const PROJECT_BUILD_ROOT = path.join(config.root, '../../', 'likechuxing-html/frontendDist/')

  class Project {

    constructor (file_path) {

      let data = require(file_path)

      this._checkProjectConfig(data)

      this.isProduction = process.env.NODE_ENV === 'production'

      /*** 基础属性 ***/
      this.src_path = path.dirname(file_path) // 项目源码目录
      this.id = Number(data.id) // 列表id，命令行npm run dev [id]中的索引项
      this.name = data.name // 项目名称，英文
      this.name_zh = data.name_zh || data.zh_name // 项目名称，中文
      this.group = data.group // 项目分组
      this.version = data.version || data.ver // 项目版本

      /*** 自定义编译属性 ***/
      this.image_quailty = data.image_quailty || 80
      this.bundle_vendor = data.bundle_vendor || false // 是否提取公共代码，多页项目建议提取 true/false
      this.dll = data.dll && data.dll.length > 0 ? data.dll : []  // 是否采用dll打包公共库，Array
      this.useHash = !this.isProduction ? false : data.hasOwnProperty('useHash') ? data.useHash : true // 静态文件是否使用hash命名，默认true
      this.manualVersion = data.manualVersion || '' // 如果useHush=false 时，代替的用于手动控制版本号的字符串，例如：1001

      // 是否不额外生成静态文件
      this.all_in_html = Boolean(data.all_in_html)

      this.copy = this._getCopyPath(data.copy) // 是否执行cp命令，true(会用默认路径)/false/[Object]

      this.template = this._getTemplate(data.template) // 配置html模板
      this.staticDirName = data.staticDirName || this.group + '_' + this.name // 打包后项目静态文件存放的目录名，如果不设置则默认是:group_name

      /*** webpack属性 ***/
      this.input_file = this._getInputFile(data.input_file) // 入口文件
      this.output_file = this._getOutPutFile(data.output_file) // 输出
    }

    _checkProjectConfig (project) {
      // todo 检测project原始配置中各必须字段是否存在
    }

    _getCopyPath (copy) {
      if (copy) {
        if (copy.hasOwnProperty('directory') && copy.hasOwnProperty('files')) {
          return {
            directory: path.join(config.root, copy.directory),
            files: path.join(config.root, copy.files)
          }
        } else {
          return {
            // js/css/images复制目的目录
            directory: path.join(PROJECT_BUILD_ROOT),
            // html等复制目的目录
            files: path.join(PROJECT_BUILD_ROOT, this.group, this.name)
          }
        }
      } else {
        return false
      }
    }

    _getInputFile (input_file) {
      let data = {}
      //input_file地址绝对化
      for (let k in input_file) {
        data[k] = input_file[k].map(item => path.join(this.src_path, item))
      }
      return data
    }

    _getFileName (type) {
      switch (type) {
        case 'js':
          return this.useHash ? '[name].[chunkhash:6].js' : this.manualVersion ? `[name].${this.manualVersion}.js` : '[name].js'
        case 'css':
          return this.useHash ? '[name].[contenthash:6].css' : this.manualVersion ? `[name].${this.manualVersion}.css` : '[name].css'
        case 'img':
          return this.useHash ? '[hash:16].[ext]' : '[name].[ext]'
      }
    }

    _getOutPutFile (output_file) {
      let data = {
        publicPath: "/",
      }

      if (output_file) {
        // output地址绝对化
        data.path = path.join(config.root, output_file.path)
        // filename增加hash todo 迁移到公共配置
        data.filename = output_file.filename.replace('[name].js', this._getFileName('js'))
      } else {
        data.path = path.join(config.root, `/dist/${this.group}/${this.name}`)
        data.filename = `js/${this.group}_${this.name}/${this._getFileName('js')}`
      }

      return data
    }

    _getTemplate (template) {
      if (!template) return null

      let data = {}

      if (template.manual_list) {
        data.manual_list = template.manual_list.map(item => {
          return {
            title: item.title || "立刻出行",
            meta: item.meta || ['default'],
            filename: item.name,
            appMountId: item.appMountId || '',
            assets: item.assets || [],
            vconsole: Boolean(item.vconsole),
            polyfill: item.hasOwnProperty('polyfill') ? Boolean(item.polyfill) : true
          }
        })
      } else {
        data.list = template.list.map(item => {
          return {
            filename: item.replace(/\.(html|pug)/, ''),
            path: path.join(this.src_path, item)
          }
        })
      }

      // 打包时各html是否引入所有资源（单页应用无所谓，多页应用false，类似静态页结构的多项目单打包的true）
      data.importAll = template.importAll || false

      return data
    }

    getCopyRight (mode) {

      switch (mode) {
        case 1:
          return `Copyright © since 2017 立刻出行 版权所有 Recent edit by ${config.name}/${config.email} on ${new Date().toLocaleString()}`
        default:
          return `Copyright © 2018 立刻出行 版权所有
Project name:${this.group}_${this.name}
Version:${this.version}
Recent edit by ${config.name}/${config.email} on ${new Date().toLocaleString()}`
      }
    }

  }

// 所有项目源码的总目录
  const project_dir = path.join(config.root, '/src/pages')
// 项目标识文件
  const target_file = /^likePackage\.js(on)?$/
// 排除的目录
  const exclude_dir_name = [
    /^(js|css|images?|fileCopy|components?|v\d)$/,
    // /test/
  ]

  const readDir = function (_path) {
    let list = []

    let files = fse.readdirSync(_path)

    files.forEach(file => {

      let new_path = path.join(_path, file)

      if (target_file.test(file)) {
        list.push(new_path)
      } else if (/[^\.]/.test(file) && !exclude_dir_name.some(item => item.test(file))) {
        let stat = fs.statSync(new_path)
        if (stat.isDirectory()) {
          list = list.concat(readDir(new_path))
        }
      }
    })

    return list
  }

  let time1 = new Date()
  let list = readDir(project_dir)
  let time2 = new Date()
  list = list.map(file => new Project(file)).sort((item1, item2) => item1.id - item2.id)
  let time3 = new Date().getTime()

  return list

}
