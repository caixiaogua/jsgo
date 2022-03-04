# jsgo

A JavaScript Engine for Server, and better performance than nodejs.

### go的性能，js的语法，php的思路。（无需写异步和回调）

为什么选择jsgo？
```
1. 跨平台，无差别，高性能，低延时
2. 独立Javascript引擎，与nodejs无关
3. 完全同步代码，无需考虑异步和回调
4. 完美热更新，修改路由控制器代码无需重启服务
5. 框架成熟，功能完善，可快速开发微服务接口
6. 内建高性能Mysql驱动，开箱即用，省心省事
```
#### 欢迎加入QQ群：739721147

#### 快速入门
```
//访问http://127.0.0.1:83/，返回当前时间戳
//index.js
function main(){
    var res=Date.now();
    return res;
}
```
#### 进阶范例（无异步无回调体验）
```
//访问http://127.0.0.1:83/test，获取url内容并返回
//test.js
function main(){
    var res=api.httpGet("http://www.baidu.com/");
    return res;
}
```
```
//获取当前目录下的文件列表
//test2.js
function main(){
	//var res=api.getList(".")[0].filter(function(x){return !x.IsDir()}).map(function(x){return x.Name()});	//v4.2及之前版本
	let res=api.getList(".").filter(x=>!x.IsDir()).map(x=>x.Name());	//v4.3及以上版本（可使用ES6语法）
	return res;
}
```

##### 框架目录中，每一个js文件即为一个路由控制器，支持子目录。例如：
```
/test.js 对应的路由为 /test
/book/index.js 对应的路由为 /book/index
```
##### 路由配置文件：routes.ini
在该文件中配置允许访问的路由，如果修改了配置文件，可以通过访问 http://127.0.0.1:83/init 来重新加载配置文件（无需重启服务）。

##### 自定义服务端口
通过命令启动服务时，可附带端口号，如：./jsgo4.2 8082

#### 连接实例对象：ctx
##### 完美兼容gin框架，全局对象 ctx 就是 gin.Context 实例，可调用其所有方法，具体请参考：
https://github.com/gin-gonic/gin

#### 公共全局对象：api
##### js文件中的另一个全局对象 api 包含以下方法（对应了go的函数）：
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

##### js调用go函数时，如果有多个返回值，则返回值为一个数组。

### 安装和使用方法：
下载jsgo4.2.zip，解压，执行。
其中routes.ini为允许访问的路由配置。
/子目录/static/均为为静态文件目录。
jsgo4.0起已经内置了mysql驱动，直接可以连接mysql数据库。
目前底层仅支持ES5的语法（v4.3开始支持部分ES6语法），但是，你可以使用typescript提升开放体验（可使用最新的js语法），tsconfig.json配置如下：
```
{
  "compilerOptions": {
    "lib": ["es5", "dom"],
    "target": "es5",
  }
}
```
ts使用例子：
```
var api, ctx;
function main(){
    let arr=[1,2,3,4];
    arr=arr.map(x=>x+=1);
    let obj={name:"mike",age:32,sex:1,arr};
    console.log(api, ctx);
    return obj;
}
```
所有异步任务均由go在底层完成，js层无需异步代码。

### 部分常用功能：

```
var id=ctx.Query("id") //获取query数据
var password=ctx.PostForm("password") //获取post数据
var res=ctx.Cookie("uname")[0] //获取cookie
ctx.SetCookie("name", "value", 3600) //设置cookie
var res=api.httpGet(url) //Get方式请求url
var res=api.httpPost(url, datastr, datatype) //Post方式请求url，datatype为""或"json"
var res=api.getFile("text.html") //读取文件内容
api.saveFile(path, string) //保存字符串到文件
api.remove("cat2.jpg") //删除指定文件
var upfile=ctx.FormFile("upfile")[0]; //获取上传文件
ctx.SaveUploadedFile(upfile, upfile.Filename); //保存上传文件
ctx.Header("Content-Type", "text/html; charset=utf-8"); //设置响应头
var dbc=api.import("dbc.js") //引用文件，得到被引用文件main函数的返回值
```
#### v5.1新增五个强大的功能拓展模块：

###### api.OS	参考文档：https://pkg.go.dev/github.com/kakuilan/kgo#LkkOS
###### api.FS	参考文档：https://pkg.go.dev/github.com/kakuilan/kgo#LkkFile
###### api.Date	参考文档：https://pkg.go.dev/github.com/kakuilan/kgo#LkkTime
###### api.Encode	参考文档：https://pkg.go.dev/github.com/kakuilan/kgo#LkkEncrypt
###### api.Convert	参考文档：https://pkg.go.dev/github.com/kakuilan/kgo#LkkConvert
```
// 使用范例：获取服务器IP地址
function main(){
    let ips=api.OS.GetIPs();
    return ips;
}
```
#### v5.0重要更新：支持ES6语法，支持js文件编译
```
// test.js
function main(){
    let fn=(a,b)=>a+b;
    return fn(3,5);
}

// 编译test.js，输出test.so
jsgo5.0 build test.js

// 删除test.js，依然可访问http://127.0.0.1:83/test
```
#### 更新日志：
```
v5.1更新：
新增五大功能拓展模块，近百个常用功能函数
mysql接口调整，支持问号参数
用法1：
//dbtest.js
function main(){
	if(!api.db.query){
		var dbstr="testdb:#molJOCcqqJoYrmH8@tcp(192.168.1.205:3306)/testdb";
		//使用闭包将连接缓存，可提高性能
		api.db.query=function(sql,args){
			return api.dbGet(api.mysql(dbstr),sql,args);
		}
		console.log("api.db.conn.created");
	}
	var sqlstr="select * from json where id > ?";
	res=api.db.query(sqlstr, [20]);
	return res;
}
用法2：
//dbtest2.js
function main(){
	var dbstr="testdb:#molJOCcqqJoYrmH8@tcp(192.168.1.205:3306)/testdb";
	var sqlstr="select * from json where id > ?";
	var res=api.query(dbstr, sqlstr, [20]);
	return res;
}

v5.0更新：
可对js文件进行加密编译

v4.3更新：
支持ES6语法

v4.2更新：
并发性能提升30%
可通过启动参数关闭控制台日志打印：./jsgo4.2 83 1

v4.1更新：
main函数返回的数据如果是对象或数组，会自动序列化，不需要手动JSON.stringify()

v4.0更新：
内置mysql支持
用法1：
//dbtest.js
function main(){
	if(!api.db.query){
		var dbstr="testdb:#molJOCcqqJoYrmH6@tcp(192.168.1.205:3307)/testdb";
		//使用闭包将连接缓存，可提高性能
		api.db.query=function(s){
			return api.dbGet(s, api.mysql(dbstr));
		}
		console.log("api.db.conn.created");
	}
	var sqlstr="select * from json where id > 40";
	res=api.db.query(sqlstr);
	return res;
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
2. 支持命令行指定服务端口："jsgo 3421" （3421为端口号）
3. 单独封装了sqlite代理服务："sqlite.exe"
4. 单独封装了数据库通用接口："sql.js"
5. 解决了共享变量的并发安全问题："api.db"为同个路由的共享变量
6. 修复了js语法错误导致线程卡住的bug  （2020.11.7）

用法：
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



#### #友情链接#
vue官网：https://cn.vuejs.org/

woo官网：https://woo.wooyri.com/

woo线上码：https://live.wooyri.com/

