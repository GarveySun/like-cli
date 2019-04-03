module.exports = {
  "id": ${project_id},
  "zh_name": "请设置项目中文名称",
  "name": "${project_name}",
  "group": "${project_group}",
  "bundle_vendor": false,
  "copy": true,
  "dll":[],
  "input_file": {
    "index": [
      "index.js"
    ]
  },
  "template": {
    manual_list:[
      {
        name:'index',
        title:'页面title',
        meta:['default'],
        polyfill:true,
        vconsole:true,
        appMountId: 'app',
        assets:[]
      }
    ]
  }
}
