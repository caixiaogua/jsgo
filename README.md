# jsgo

A JavaScript Runtime for Server, and better performance than nodejs.

### 底层为go，逻辑层为js，且无需写异步和回调。

为什么选择jsgo？
```
1. 跨平台，无差别，高性能，低延时
2. 独立Javascript引擎，与nodejs无关
3. 完全同步代码，无需考虑异步和回调
4. 完美热更新，修改路由控制器代码无需重启服务
5. 框架成熟，功能完善，可快速开发微服务接口
6. 内建高性能Mysql驱动，开箱即用，省心省事
7. 绿色单文件二进制主程序，环保高效无依赖
8. 可加密编译js源码，可打包静态资源文件
9. 内置go语言jit编译器，可在js中执行go代码
```
#### 欢迎加入QQ群：739721147

#### 快速入门
```
//访问http://127.0.0.1:83/，返回当前时间戳
//app.js
function main(){
    let res=Date.now();
    return res;
}
```
#### 进阶范例（无异步无回调体验）
```
//获取url内容并返回
function main(){
    let res=api.httpGet("http://www.baidu.com/");
    return res;
}
```
```
//获取当前目录下的文件列表
function main(){
	let res=api.getList(".").filter(x=>!x.IsDir()).map(x=>x.Name());
	return res;
}
```
```
//v5.3开始，可直接在js文件中编写go代码，可定义go函数并在js中调用
//范例1：返回go函数，可在js中调用
function main(){
    let readFile=api.goFunc(`
	    	func(f string)string{
		    	bs:=ioutil.ReadFile(f);
		    	return string(bs)
	    	}
    	`);
    return readFile("test3.js");
}

//范例2：go自执行函数，直接返回结果
function main(){
	let res=api.goRun(`
		func()string{
			type Object struct {
			    Name  string \`json:"name"\`
			    Order string \`json:"order"\`
			}
			animals := []Object{
				Object{Name: "Platypus", Order: "Monotremata"},
				Object{Name: "Quoll",    Order: "Dasyuromorphia"},
				Object{Name: "Peiqi",    Order: "Basketball"},
			}
			return string(json.Marshal(animals))
		}()
	`);
	return res;
』
```
#### 功能强大，接口丰富（同一需求多种实现方式）
```
//例：读取users.json文件内容，至少4种方法
function main(){
	// let res=api.goRun(`string(ioutil.ReadFile("users.json"))`);
	// let res=api.Convert.Bytes2Str(api.FS.ReadFile("users.json"));
	// let res=api.FS.ReadInArray("users.json").join("\n");
	let res=api.getFile("users.json");
	return res;
}
```

##### v6.0开始支持两种模式
1. 单体架构模式（推荐），仅有一个入口程序"app.js"，类似其他传统框架的开发体验，适合业务集中的场景，安全性更高。（v6.0版本开始支持）

2. 微服务模式，每个路由文件相对独立，互不影响，同一端口运行多个微服务，适合业务分散的场景。（需要管理路由表routes.ini，路由表中的路径才可访问）（可使用“jsgo6.1 init”命令初始化routes.ini文件，单体模式不需要该文件）
```
/index.js 对应的路由为 /
/test.js 对应的路由为 /test
/book/index.js 对应的路由为 /book/index
```
```
注：目录中存在app.js或app.so或app.sox文件时，启动为单体架构模式，否则为微服务模式。
```

##### 自定义服务端口
通过命令启动服务时，可附带端口号，如：./jsgo6.0 -port 8082

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
"fileInfo": os.Stat,
"println":  fmt.Println,
"getList":  ioutil.ReadDir,
"getFile":  getFileStr,
"saveFile": saveFile,
"dbGet":    getJson,
"query":    query,
"mysql":    mysql,

//更多其它接口见后文
```

##### js调用go函数时，如果有多个返回值，则返回值为一个数组。

#### 所有异步任务均由go在底层完成，js层无需异步代码。

### 部分常用功能：

```
var id=ctx.Query("id") //获取query数据
var password=ctx.PostForm("password") //获取post数据
var res=ctx.Cookie("uname") //获取cookie
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

更多功能请参考：
gin框架（https://github.com/gin-gonic/gin）（ctx == *gin.Context）
kgo框架（https://pkg.go.dev/github.com/kakuilan/kgo#section-documentation）
（v5.3开始）api接口与kgo对应关系如下：
api.OS		=	kgo.KOS
api.FS		=	kgo.KFile
api.Date	=	kgo.KTime
api.Encode	=	kgo.KEncr
api.Convert	=	kgo.KConv
api.Array	=	kgo.KArr
api.String	=	kgo.KStr
api.Number	=	kgo.KNum
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
// 编译test.js，输出test.so
jsgo5.0 build test.js

// 删除test.js，依然可访问http://127.0.0.1:83/test
```
#### 更新日志：
```
v7.0更新：
1. 精简代码，优化性能，提升稳定性
2. 仅保留单入口模式，入口文件可自定义（默认为app.js）：jsgo7.0 run index.js
3. 默认关闭热更新，可使用命令参数启动：jsgo7.0 -watch 5	（其中5表示检查周期为5秒）
4. 新增api.getQueryObj()方法，返回querystring解析后的js对象，使用更方便。
5. 新增api.getPostObj()方法，返回Post请求解析后的js对象，使用更方便。
例如：
let {id, type}=api.getQueryObj();
let {user, data, token}=api.getPostObj();

v6.1更新：
1. 可将整个项目源文件编译打包为一个独立的.sox文件，使用以下命令：
jsgo6.1 buildx app.js
2. 可将静态目录打包为独立的.pkg文件，例如将css目录打包为css.pkg文件：
jsgo6.1 pack css

##打包资源的调用方式##
function main(){
	let path=ctx.Request.URL.Path;
	let pkg=api.loadPack("css.pkg");
	if(path=="/img/go.jpg"){
		ctx.Data(200, "image/jpg", pkg["go.jpg"]);
	}else if(path=="/css/main.css"){
		ctx.Data(200, "text/css", pkg["main.css"]);
	}else{
		return "none";
	}
}

v6.0更新：
1. 支持单体模式和微服务模式，可根据自己的需求选择
2. 根目录存在app.so或app.js时，服务会启动为单体架构模式，整个项目的入口为app.so或app.js
3. 需要切换为微服务模式，请删除app.so和app.js文件，重新启动服务
4. "jsgo init"命令可生成routes.ini路由表文件，该文件仅对微服务模式有效，单体模式无视该文件
5. "jsgo build app.js"命令可将app.js编译为app.so文件，程序执行会优先选择so文件
6. "jsgo -port 888"命令可指定服务运行端口
//app.js
function main(){
	let path=ctx.Request.URL.Path;
	if(path=="/"){
		return api.import("count.js")();
	}else if(path=="/item"){
		return api.import("item.js")(6);
	}
	return "none";
}
//count.js
function main(){
	//通过return返回一个函数
	return ()=>{
		if(!api.db.count)api.db.count=0;
		api.db.count++;
		return "首页-"+api.db.count;
	}
}
//item.js
function main(){
	//通过return返回一个函数
	return (v)=>{
		return "item-"+v;
	}
}

v5.4更新：
1. 主程序文件大小缩小三分之一
2. 支持js文件中调用dotnet框架
function main(){
	let res=api.dotnet(function(){
		return System.DateTime.Now.ToString('yyyy-MM-dd hh:mm:ss');
	});
	return res;
}

v5.3更新：
支持js文件中嵌套go代码，无需import直接使用go标准库
function main(){
    let res=api.goRun(`
	  func()string{
	      bs:=ioutil.ReadFile("test.js");
	      return string(bs)
	  }()
    `);
    return res;
}

v5.2更新：
优化程序逻辑，并发性能提升20%

v5.1更新：
新增五大功能拓展模块，近百个常用功能函数
mysql接口调整，支持问号参数
用法1：
//dbtest.js
function main(){
	if(!api.db.query){
		let dbstr="root:#molJOCcqqJoYrmH8@tcp(192.168.1.205:3306)/testdb";
		let conn=api.mysql(dbstr);
		//使用闭包将连接缓存，可提高性能
		api.db.query=function(sql,args){
			return api.dataGet(conn,sql,args);
		}
		console.log("api.db.conn.created");
	}
	let sqlstr="select * from json where id > ? limit ?";
	let res=api.db.query(sqlstr, [20,5]);
	return res;
}
用法2：
//dbtest2.js
function main(){
	let dbstr="root:#molJOCcqqJoYrmH8@tcp(192.168.1.205:3306)/testdb";
	let sqlstr="select * from json where id > ?";
	let res=api.query(dbstr, sqlstr, [20]);
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
		var dbstr="root:#molJOCcqqJoYrmH6@tcp(192.168.1.205:3306)/testdb";
		var conn=api.mysql(dbstr);
		//使用闭包将连接缓存，可提高性能
		api.db.query=function(s){
			return api.dbGet(s, conn);
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
	var dbstr="root:#molJOCcqqJoYrmH6@tcp(192.168.1.205:3306)/testdb";
	var sqlstr="select * from json where id>1";
	var res=api.query(sqlstr, dbstr);
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


