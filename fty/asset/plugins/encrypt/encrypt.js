var g = "2";  
var p = "106025087133488299239129351247929016326438167258746469805890028339770628303789813787064911279666129";
var iv_key = "1234567812345678";
/**
 * 产生秘钥(秘钥可供多次加密使用)
 * @return
 */
function ttj_genSecretKey(){
	var big_a = randBigInt(100);
	var big_p = str2bigInt(p, 10, 0);
	var big_g = str2bigInt(g, 10, 0);
	var A = powMod(big_g, big_a, big_p);
    var str_A = bigInt2str(A, 10);
    var params={};
    params.csk = str_A;
    var secretKey = '-1';
    $.ajax({
		url : base_path + "pub/common/encrypt/genSSK",
		data : params,
		type : 'POST',
		cache : true,
		async : false,
		traditional : true,
		success : function(data) {
			if(data.code == '00'){
    	    	var serverKey = data.serverKey;
    	    	var big_serverKey = str2bigInt(serverKey, 10, 0);
    			secretKey = powMod(big_serverKey, big_a, big_p);
    			secretKey = bigInt2str(secretKey, 10);
    			secretKey = CryptoJS.MD5(secretKey)+'';
    			secretKey = secretKey.substr(0,16);
    	    }
		}
	});
    return secretKey;
}
/**
 * 加密文本<br>
 * 此方法适合多次加密使用(采用参数秘钥进行加密)
 * @param str  需要加密的文本
 * @param secretKey 秘钥
 * @return 加密后的文本
 */
function ttj_encryptByKey(str,secretKey){
	if('-1' == secretKey){
		 return str; //加密出错,直接返回原始内容,不做加密处理  modified at 4/24/2015
	}
	var pwd = CryptoJS.enc.Utf8.parse(str);
	var key = CryptoJS.enc.Utf8.parse(secretKey);
	var iv  = CryptoJS.enc.Utf8.parse(iv_key);
	var encrypted = CryptoJS.AES.encrypt(pwd, key, {iv:iv});
	return encrypted;
}
/**
 * 加密文本<br>
 * 此方法适合一次加密使用(包括生成秘钥以及加密功能)
 * @param str 需要加密的文本
 * @return 加密后的文本
 */
function ttj_encrypt(str){
	var big_a = randBigInt(100);
	var big_p = str2bigInt(p, 10, 0);
	var big_g = str2bigInt(g, 10, 0);
	var A = powMod(big_g, big_a, big_p);
    var str_A = bigInt2str(A, 10);
    var params={};
    params.csk = str_A;
    var secretKey = '-1';
    $.ajax({
		url : base_path + "pub/common/encrypt/genSSK",
		data : params,
		type : 'POST',
		cache : true,
		async : false,
		traditional : true,
		success : function(data) {
    	    if(data.code == '00'){
    	    	var serverKey = data.serverKey;
    	    	var big_serverKey = str2bigInt(serverKey, 10, 0);
    			secretKey = powMod(big_serverKey, big_a, big_p);
    			secretKey = bigInt2str(secretKey, 10);
    			secretKey = CryptoJS.MD5(secretKey)+'';
    			secretKey = secretKey.substr(0,16);
    	    }
		}
	 });
     if('-1' == secretKey){
    	 return str; //加密出错,直接返回原始内容,不做加密处理  modified at 4/24/2015
     }else{
    	 var pwd = CryptoJS.enc.Utf8.parse(str);
    	 var key = CryptoJS.enc.Utf8.parse(secretKey);
    	 var iv  = CryptoJS.enc.Utf8.parse(iv_key);
    	 var encrypted = CryptoJS.AES.encrypt(pwd, key, {iv:iv});
    	 return encrypted;
     }
}