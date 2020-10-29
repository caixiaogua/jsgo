
function main(){

	return function(dsn, api){
		var user, pass;
		if(dsn&&dsn.join){
			user=dsn[1]||"";
			pass=dsn[2]||"";
			dsn=dsn[0];
		}
		return function (sql, arr) {
			var url;
			if(arr&&arr.join){
				arr.forEach(function(x){
					if(typeof x=="object")x=JSON.stringify(x);
					sql=sql.replace("?", JSON.stringify(encodeURIComponent(x)));
				})
			}
			if(dsn.indexOf("@tcp")>0)url="http://127.0.0.1:3344/";
			else url="http://127.0.0.1:3355/";
			return api.httpGet(url+"?db="+encodeURIComponent(dsn)+"&sql="+encodeURIComponent(sql));
		};
	};

}
