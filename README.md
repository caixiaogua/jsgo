# jsgo

A JavaScript Engin for Server, and better performance than nodejs.

go的性能，js的语法，php的写法。（无需写异步和回调）

```
v3.2更新：
1. 服务端js代码安全性改进，路由表中的js文件为服务端程序，其他js文件会作为静态资源文件
2. 支持命令行指定服务端口："jsgo 3421"
3. 单独封装了mysql代理服务："mysql.exe"
```

例如：
```
// "/test.js"
// http://localhost:83/test
function main(){
	var res=api.httpGet("http://www.baidu.com/");
	ctx.Header("Content-Type", "text/html; charset=utf-8");
	return res;
}
```

更多：
```
// 完全兼容gin.ctx

function main(){
	var time=new Date().toLocaleString();
	var act=ctx.Query("do");
	var topic=ctx.Query("topic");
	// api.httpGet(url)
	// api.getFile(path)
	// api.saveFile(path, string)
	// return(ctx.Query("name"))
	// return(ctx.PostForm("password"))
	// return "当前时间："+time+"...";
	// var res=api.httpGet("http://www.baidu.com/");
	// return api.saveFile("baidu.txt", res);
	// api.remove("cat2.jpg")
	// return JSON.stringify(api.stat("dazi/20200.json"),null,2);
	// var res=require("class.js")
	// return res;
	// return api.fileType("main2.js");
	// var list=api.getList(".")[0];
	// list=list.filter(function(x){return !x.IsDir()}).map(function(x){return x.Name()});
	// return JSON.stringify(list);
	var query=api.import("dbc/pdo.js")(["mysql:host=127.0.0.1:3307;dbname=testdb","testdb","#molJOCcqqJoYrmH6"], api);
	// var query=api.import("dbc/pdo.js")("sqlite:../sqlite/testdb.db", api);
	// var newobj={title:"老大哥", content:"吃饭了吗？"};
	// var res=query("delete from json where id>?", [23]);
	// var res=query("insert into json (obj) values (?)", [newobj]);
	// return res;
	var res=query("select * from json where id>?", [43]);
	// res=decodeURIComponent(res);
	return res;
	return JSON.stringify(JSON.parse(res).map(function(x){x.obj=JSON.parse(decodeURIComponent(x.obj));return x;}),null,2);
	api.name="mark";
	api.age=23;
	api.arr=[1,2,"333"];
	api.obj={child:5,wife:"lucy"};
	if(!api.count)api.count=0;
	api.count++;
	return JSON.stringify(api.obj);
	// var upfile=ctx.FormFile("upfile")[0];
	// ctx.SaveUploadedFile(upfile, upfile.Filename);
	ctx.Header("Content-Type", "text/html; charset=utf-8");
	// return upfile.Filename;
	// return JSON.stringify(ctx.Request.Cookies());
	return api.httpGet("http://www.baidu.com/");
	// return JSON.stringify(JSON.parse(getFile("2020.json")),null,2);
	if(act=="getbj")
		return '{"logs":'+api.getFile("dazi/2020.json")+'}'
	else
		return api.getFile("dazi/main.html")
}
```
