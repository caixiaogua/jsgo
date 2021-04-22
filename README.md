# jsgo

A JavaScript Engine for Server, and better performance than nodejs.

go的性能，js的语法，php的思路。（无需写异步和回调）

框架目录中，每一个js文件即为一个路由，支持子目录。
在“routes.ini”文件中配置允许访问的路由。

完美兼容gin框架，全局对象 ctx 就是 gin.Context 实例，可调用其所用方法，具体请参考：
https://github.com/gin-gonic/gin

js路由中的另一个全局变量 api 包含以下方法（对应了go的函数）：
```
"httpGet":  httpGet,
"httpPost": httpPost,
"remove":   os.Remove,
"rename":   os.Rename,
"fileType": fileType,
"stat":     os.Stat,
"println":  fmt.Println,
"getList":  ioutil.ReadDir,
"getFile":  getFileStr,
"saveFile": saveFile,
"dbGet":    getJson,
"query":    query,
"mysql":    mysql,
```

js调用go函数时，如果有多个返回值，则返回值为一个数组。

## 使用方法：
下载jsgo4.1.zip，解压，执行。
其中routes.ini为允许访问的路由配置。
/子目录/static/均为为静态文件目录。
jsgo4.0起已经内置了mysql驱动，直接可以连接mysql数据库。
目前仅支持ES5的语法，所有异步任务均由go在底层完成，js层无需异步代码。

```
v4.1更新：
返回的数据如果是对象或数组，会自动序列化，不需要手动JSON.stringify()

v4.0更新：
内置mysql支持
用法1：
//dbtest.js
function main(){
	var dbstr="testdb:#molJOCcqqJoYrmH6@tcp(192.168.1.205:3306)/testdb";
	var sqlstr="select * from json where id>1";
	if(!api.db.conn){
		//将连接缓存，可提高性能
		api.db.conn=api.mysql(dbstr);
		console.log("api.db.conn.created");
	}
	res=api.dbGet(sqlstr, api.db.conn);
	var data=res[0];
	// var error=res[1];
	return data;
}
用法2：
//dbtest2.js
function main(){
	var dbstr="testdb:#molJOCcqqJoYrmH6@tcp(192.168.1.205:3306)/testdb";
	var sqlstr="select * from json where id>1";
	var res=api.query(sqlstr, dbstr);
	return res;
}

v3.2更新：
1. 服务端js代码安全性改进，路由表中的js文件为服务端程序，其他js文件会作为静态资源文件
2. 支持命令行指定服务端口："jsgo 3421"
3. 单独封装了mysql代理服务："mysql.exe"
4. 单独封装了sqlite代理服务："sqlite.exe"
4. 单独封装了数据库通用接口："sql.js"
5. 解决了共享变量的并发安全问题："api.db"为同个路由的共享变量
6. 修复了js语法错误导致线程卡住的bug  （2020.11.7）

用法：
//连接mysql数据库
var query=api.import("dbc/sql.js")(["mysql:host=127.0.0.1:3307;dbname=testdb","root","123456"], api);
//连接sqlite3数据库
var query=api.import("dbc/sql.js")("testdb.db", api);
//执行sql
var res=query("select * from json where id>?", [10]);
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
	// return res;
	// return api.fileType("main2.js");
	// var list=api.getList(".")[0];
	// list=list.filter(function(x){return !x.IsDir()}).map(function(x){return x.Name()});
	// return JSON.stringify(list);
	// var query=api.import("dbc/sql.js")(["mysql:host=127.0.0.1:3307;dbname=testdb","root","123456"], api);
	// var query=api.import("dbc/sql.js")("testdb.db", api);
	var newobj={title:"老大哥", content:"吃饭了吗？"};
	// var res=query("delete from json where id>?", [23]);
	// var res=query("insert into json (obj) values (?)", [newobj]);
	// return res;
	// var res=query("select * from json where id>?", [43]);
	// var query=function(sql){return api.httpGet("http://127.0.0.1:3344/?db="+encodeURIComponent("testdb:#molJOCcqqJoYrmH6@tcp(192.168.1.205:3307)/testdb")+"&sql="+encodeURIComponent(sql))}
	// var query=function(sql){return api.httpGet("http://127.0.0.1:3355/?db="+"testdb.db"+"&sql="+encodeURIComponent(sql))}
	// var res=query("insert into json (obj) values ('"+encodeURIComponent(JSON.stringify(newobj))+"')");
	// var res=query("select * from json where id>22")
	// res=decodeURIComponent(res);
	// return res;
	// return JSON.stringify(JSON.parse(res).map(function(x){x.obj=JSON.parse(decodeURIComponent(x.obj));return x;}),null,2);
	var obj={};
	obj.name="mark";
	obj.age=23;
	obj.arr=[1,2,"333"];
	obj.obj={child:5,wife:"lucy"};
	if(!api.db.count)api.db.count=0;
	api.db.count++;
	return JSON.stringify(api.db.count);
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
