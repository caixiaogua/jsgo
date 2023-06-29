# jsgo

A JavaScript Runtime for Server, and better performance than nodejs.

### 一个高性能的JavasSript服务端运行时（框架）
### 底层为go，逻辑层为js，且无需写异步和回调。

#### 下载地址：https://github.com/caixiaogua/jsgo/releases

为什么选择jsgo？
```
1. 跨平台，无差别，高性能，低延时
2. 独立Javascript引擎，与nodejs无关
3. 完全同步代码，无需考虑异步和回调
4. 内置数据压缩模块，节省带宽70%以上
5. 内置php函数集，可快速开发微服务接口
6. 内置高性能Mysql驱动，开箱即用，省心省事
7. 内置go语言jit编译器，可在js中执行go代码
8. 可加密编译js源码，可打包静态资源文件
9. 绿色单文件二进制主程序，环保高效无依赖
```
#### 欢迎加入QQ群：739721147

##### 为提高性能，jsgo7.0起默认关闭了热更新，但可使用命令参数开启：
```
//后面数字表示检查间隔（秒）
./jsgo7.3 -watch 5
```
##### 可自定义服务端口（默认为 83 端口）
```
./jsgo7.3 -port 8182
```

#### 快速入门
```
//访问http://127.0.0.1:83/，返回当前时间戳
//app.js
function main(ctx){
    let res=Date.now();
    return res;
}
```
#### 进阶范例（无异步无回调体验）
```
//获取url内容并返回
function main(ctx){
    let res=api.httpGet("http://www.baidu.com/");
    return res;
}
```
```
//获取请求数据并返回
function main(ctx){
	let method=ctx.Request.Method; //返回请求方法名称，返回GET或POST
	let {id}=api.getQueryObj(ctx); //获取query数据对象，并解构出id
	let {user, data}=api.getPostObj(ctx); //获取post请求的数据对象
	return {method,id,user,data};
}
```
```
//从Mysql数据库中读取数据，并返回客户端
let query=api.MysqlQuery('root:pass@tcp(192.168.1.205:3306)/testdb');
function main(ctx){
	let path=ctx.Request.URL.Path;	//获取当前路由
	if(path=='/userlist'){
		let res=query("select * from users where id > ? limit ?", [20,5]);
		return res;
	}else{
		return 404;
	}
}
```
```
//v5.3开始，可直接在js文件中编写go代码，可定义go函数并在js中调用
//范例1：直接执行go函数，返回结果
function main(ctx){
	let res=api.goRun(`time.Now().Format("2006.01.02 15:04:05")`);
	return res;
}

//范例2：返回go函数，可在js中调用
function main(ctx){
    let readFile=api.goFunc(`
	    	func(f string)string{
		    	bs:=ioutil.ReadFile(f);
		    	return string(bs)
	    	}
    	`);
    return readFile("test3.js");
}

//范例3：go自执行函数，直接返回结果
function main(ctx){
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
}
```
#### 在jsgo中，static和dist为默认的静态资源目录，如有个性化需求可参考以下范例
#### 特殊需求范例1（纯静态资源服务器）
```
//app.js
function main(ctx){
	let path=ctx.Request.URL.Path;	//获取当前路由
	ctx.File(path.slice(1));	//返回静态文件
}
```
#### 特殊需求范例2（除个别接口外其他均为静态资源）
```
//app.js
function main(ctx){
	let path=ctx.Request.URL.Path;	//获取当前路由
	if(path=='/api/list'){
		return [1,2,3];		//特定接口逻辑
	}else{
		ctx.File(path.slice(1));	//返回静态文件
	}
}
```

#### 功能强大，接口丰富（同一需求多种实现方式）
```
//例：读取users.json文件内容，至少5种方法
function main(ctx){
	// let res=api.goRun(`string(ioutil.ReadFile("users.json"))`);
	// let res=api.Convert.Bytes2Str(api.FS.ReadFile("users.json"));
	// let res=api.FS.ReadInArray("users.json").join("\n");
	// let res=api.php.FileGetContents("users.json");
	let res=api.getFile("users.json");
	return res;
}
```
#### 两种编程范式（单线程和多线程），随心切换（改变main函数形参即可）
```
//js单线程模式，优点：逻辑简单，js变量可随意共享
let Data={};	//共享变量
function main(ctx){
    return '单线程模式';
}

//js多线程模式，优点：线程互不影响，适合更复杂逻辑的业务
function main(task){
    api.Date.Sleep(1);	//等待1秒
    return '多线程模式';
}
```

#### 连接实例对象：ctx
##### 完美兼容gin框架，全局对象 ctx 就是 gin.Context 实例，可调用其所有方法，具体请参考：
https://pkg.go.dev/github.com/gin-gonic/gin

#### 公共全局对象：api
##### js文件中的全局 api 对象：
```
api.httpGet    //发起get请求
api.httpPost    //发起post请求
api.remove	//删除文件
api.rename	//重命名文件
api.fileType    //判断文件类型，返回：0-不存在，1-文件，2-文件夹
api.fileInfo    //获取文件信息

api.php    //go实现的php函数集，参考文档：https://pkg.go.dev/github.com/syyongx/php2go

例如：api.php.Md5("str")

## 另外还有丰富的go语言工具函数集，参考文档：https://pkg.go.dev/github.com/kakuilan/kgo
api.OS		=	kgo.KOS
api.FS		=	kgo.KFile
api.Date	=	kgo.KTime
api.Encode	=	kgo.KEncr
api.Convert	=	kgo.KConv
api.Array	=	kgo.KArr
api.String	=	kgo.KStr
api.Number	=	kgo.KNum

例如：api.OS.GetIPs()
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
api.routeDir(ctx, "routes") //设置路由文件夹为"routes"，该文件下的js文件自动映射

更多功能请参考：
gin框架（https://pkg.go.dev/github.com/gin-gonic/gin）（ctx == *gin.Context）
php2go框架（https://pkg.go.dev/github.com/syyongx/php2go）（如：api.php.Md5("str")）
kgo框架（https://pkg.go.dev/github.com/kakuilan/kgo）

// 使用范例：获取服务器IP地址
function main(){
    let ips=api.OS.GetIPs();
    return ips;
}
```

#### 更新日志：
```
v7.3更新：
1. 更新依赖库，更好地支持go1.20
2. 新增 api.routeDir() 接口，设置路由文件夹更方便
3. 更丰富的php函数库，参考：https://pkg.go.dev/github.com/syyongx/php2go
4. 新增更高效的api.MysqlQuery(dsn)接口函数，返回可复用的query函数：
let query=api.MysqlQuery('root:pass@tcp(192.168.1.205:3306)/testdb');
function main(ctx){
	let res=query("select * from json where id > ? limit ?", [20,5]);
	return res;
}
5. 新增 api.sync() 接口，完美解决多线程模式下的数据共享问题：
// app.js中main(task)自动开启多线程模式
function main(task){
	let count=api.sync(function(jdb){
		// jdb为全局共享对象，所有线程共享
		if(!jdb.count)jdb.count=1;
		jdb.count++;
		return jdb.count;
	});
	return count;
}

v7.2更新：
1. 对响应数据自动进行gzip压缩，传输数据量减少70%以上。
2. 优化静态资源打包，支持子目录，并减少打包文件大小。
##静态资源打包##
jsgo7.2 pack dist2	//注意不要使用默认静态目录名称static和dist，资源相互引用请使用相对路径
##打包资源的调用方式##
let pkg=api.loadPack("dist2.pkg");
function main(ctx){
	let path=ctx.Request.URL.Path;
	if(path.indexOf('/dist2/')==0){
		if(path.slice(-5)=='.html'){
			ctx.Data(200, "text/html", pkg[path.slice(1)]);
		}else if(path.slice(-4)=='.css'){
			ctx.Data(200, "text/css", pkg[path.slice(1)]);
		}else if(path.slice(-3)=='.js'){
			ctx.Data(200, "text/js", pkg[path.slice(1)]);
		}else{
			return "none";
		}
	}else{
		//其它接口
	}
}
3. 新增php函数集，可在js中调用大部分php函数。
例如：
let filestr=api.php.FileGetContents("test.json");
let urlstr=api.php.Rawurlencode(url);
接口文档：https://pkg.go.dev/github.com/syyongx/php2go

v7.1更新：
1. 优化buildx打包逻辑，提升稳定性

v7.0更新：
1. 精简代码，优化性能，提升稳定性
2. 仅保留单入口模式，入口文件可自定义（默认为app.js）：jsgo7.0 -run index.js
3. 默认关闭热更新，可使用命令参数启动：jsgo7.0 -watch 5	（其中5表示检查周期为5秒）
4. 新增api.getQueryObj()方法，返回url参数querystring解析后的js对象，使用更方便。
5. 新增api.getPostObj()方法，返回post请求（json格式）解析后的js对象，使用更方便。
使用范例：
let {id, type}=api.getQueryObj(ctx);
let {user, data, token}=api.getPostObj(ctx);

6. 内置redis支持（请参考文档：https://pkg.go.dev/github.com/go-redis/redis）：
let redis=api.newRedis("192.168.1.200:6379","",0);
function main(ctx){
	//redis.Set("key", "value", 0);
	redis.SetNX("key2", "value2", 10*1e9);	//过期时间单位为纳秒，1e9相等于1秒
	let res=redis.Get("key2").Val();
	return res;
}

7. 内置melondb支持（github.com/caixiaogua/melon-db）：
let dbc=api.melondb("http://192.168.1.200:1688/test");
function main(ctx){
	dbc(`db.arr=[1,2,3];db.time=Date.now();`);
	let res=dbc(`return db.arr`);
	return res;
}

8. 内置服务器端模板引擎（模板语法请参考gin框架）：
//可载入templates文件夹中的模板文件，可自定义变量标签
api.gin.Delims("{{", "}}");
api.gin.LoadHTMLGlob("templates/*");
//渲染模板页
ctx.HTML(200, "index.tmpl", {title:"jsgo_test",list:[1,2,3]});

9. 可随时开启新线程，新线程可后台持续运行，可用于特殊需求：
if(!api.db.heartInit){
	api.newTask(function(){
		while(true){
			//每秒打印1次时间，后台持续运行
			api.Date.Sleep(1);
			api.println(new Date());
		}
	});
	api.db.heartInit=true;	//避免线程重复开启
}

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


