if (!window.Fsns) {
	window.Fsns = {};
}
Fsns.utils = {};
var pub_layer;
jQuery.fn.serializeJSON = function() {
	var json = {};
	jQuery.map($(this).serializeArray(), function(n, i){
		json[n['name']] = n['value'];
	});
	return json;
};
var beforeRequest = function(callback) {
	if ($.isPlainObject(callback)) {
		var before = callback.before;
		pub_layer=	layer.open({
			type: 2,
			shadeClose:false
		});
		if ($.isFunction(before)) {
			before();
		}
	}
};

var afterRequest = function(callback) {

	if ($.isPlainObject(callback)) {
		var after = callback.after;
		layer.close(pub_layer);
		if ($.isFunction(after)) {
			after();
		}
	}
};

var doSuccess = function(data, callback) {

	var success, fail;
	if ($.isFunction(callback)) {
		success = callback;
	} else if ($.isPlainObject(callback)) {
		success = callback.success;
		fail = callback.fail;
	}
	if (!data) {
		data = {};
	}
	if (data.errorCode !== undefined) {
		var ret;
		if ($.isFunction(fail)) {
			ret = fail(data);
		}
		if (!ret) {
			alert('错误码：' + data.code + '，错误信息：' + data.mes);
		}
	} else if ($.isFunction(success)) {
		success(data);
	}
};

var doFail = function(data, callback) {

	data.errorCode = 'HTTP-' + data.errorCode;
	var fail;
	if ($.isPlainObject(callback)) {
		fail = callback.fail;
	}
	if ($.isFunction(fail)) {
		fail(data);
	} else {
		if (data.errorCode != 'HTTP-0') {
			alert('错误码：' + data.code + '，错误信息：' + data.mes);
		}
	}
};

var request = function(method, url, params,callback,btb) {
	var option;
	if ($.isPlainObject(callback)) {
		option = callback.option;
	}

	if (params) {
		$.each(params, function(key, value) {
			if (value === null || value === undefined) {
				delete params[key];
			}
		});
	}
    var b=true;
   
    if(btb!=undefined&&btb==false)
    	b=btb;
	beforeRequest(callback);
	return $.ajax({
		url : url,
		data : params,
		type : method,
		cache : true,
		async:b,
		traditional : true,
		success : function(data, textStatus, jqXHR) {
			afterRequest(callback);
			doSuccess(data, callback);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			afterRequest(callback);
			var errorCode = jqXHR.status, errorMessage = errorThrown;
			doFail({
				errorCode : errorCode,
				errorMessage : errorMessage
			}, callback);
		}
	});
};

Fsns.utils.Post = function(url, params, callback,b) {
	return request('POST', url, params, callback,b);
};

Fsns.utils.advertisement = function(code) {
	var dataOption="";
	Fsns.utils.Post(base_path + 'pub/common/advertise.json', {
		code : code
	}, {
		success : function(data) {
		dataOption=data;
		}
	},false);
	return dataOption;
}


Fsns.utils.UUID = {};
Fsns.utils.UUID._uuid_default_prefix = '';
Fsns.utils.UUID._uuidlet = function () {
	return(((1+Math.random())*0x10000)|0).toString(16).substring(1);
};
Fsns.utils.UUID.uuid = function (p) {
	if (typeof(p) == 'object' && typeof(p.prefix) == 'string') {
		Fsns.utils.UUID._uuid_default_prefix = p.prefix;
	} else {
		p = p || Fsns.utils.UUID._uuid_default_prefix || '';
		return(p+Fsns.utils.UUID._uuidlet()+Fsns.utils.UUID._uuidlet()+"-"+Fsns.utils.UUID._uuidlet()+"-"+Fsns.utils.UUID._uuidlet()+"-"+Fsns.utils.UUID._uuidlet()+"-"+Fsns.utils.UUID._uuidlet()+Fsns.utils.UUID._uuidlet()+Fsns.utils.UUID._uuidlet());
	};
};

Fsns.utils.isName = function(name) {
	
	return /^([\u4e00-\u9fa5])+$/.test(name);
};
Fsns.utils.isPassWord=function(password){
	return /^[\A-Za-z0-9\_]{6,16}$/.test(password);
};
Fsns.utils.isLoginName=function(password){
	return /^[a-zA-z][a-zA-Z0-9_]{3,15}$/.test(password);
};

Fsns.utils.isEmail = function(email) {
	
	return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(email);
};
Fsns.utils.isPhone = function(phone) {
	var b=/^(((14[0-9]{1})| (17[0-9]{1}) |(13[0-9]{1})|(15[0-9]{1})|18[0-9]{1})+\d{8})$/.test(phone);
	
	if(!b){
		b= /^(\d{3,4}-?)?\d{7,8}$/.test(phone);
	}
	
	return b;
};
Fsns.utils.isTelePhone = function(phone) {
	
	var b=/^(\d{3,4}-?)?\d{7,8}$/.test(phone);
	return b;
};
Fsns.utils.isMobile = function(mobile) {
	
	return /^(( (14[0-9]{1})|(17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|18[0-9]{1})+\d{8})$/.test(mobile);
};

Fsns.utils.isPostcode = function(postcode) {
	
	return /^[0-9]{6}$/.test(postcode);
};

Fsns.utils.isUrl = function(url) {
	
	return /^(http(s)?\:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?$/.test(url);
};

Fsns.utils.isInteger = function(number) {
	if(number==0)
		return true;
	else
	return /^[1-9]*[1-9][0-9]*$/.test(number);
	
};
Fsns.utils.isNumber= function(number) {
	return /^[0-9]*[1-9][0-9]*$/.test(number);
	
};
Fsns.utils.isIntegerF = function(number) {
	return /^-[0-9]*[1-9][0-9]*$/.test(number);
};
Fsns.utils.isFlaot = function(number) {
	
	return /^-?\d+\.\d+$/.test(number);
};

Fsns.utils.isLetter = function(number) {
	
	return /^[a-zA-Z0-9]+$/.test(number);
};

Fsns.utils.isBigLetter = function(number) {
	
	return /^[A-Z0-9]+$/.test(number);
};
Fsns.utils.isSmallLetter = function(number) {
	
	return /^[a-z0-9]+$/.test(number);
};

Fsns.utils.isMoney = function(number) {

	return /^([1-9][\d]{0,9})(\.[\d]{1,2})?$/.test(number);
};
//按键抬起触发
Fsns.utils.keyup = function(e){
    if(e.value.length==1){
        e.value=e.value.replace(/[^0-9]/g,'')
	}else{
	    if (e.value.indexOf('.') > 0) {
			e.value = e.value.substring(0,e.value.toString().indexOf('.') + 3);
			var temp = e.value.split('.');
			temp[0] = temp[0].replace(/\D/g, '');
			temp[1] = temp[1].replace(/\D/g, '');
			e.value = temp[0] + '.' + temp[1]; 
		}else {
		    e.value=e.value.replace(/\D/g,'')
		}
	}
};
//粘贴之后触发
Fsns.utils.afterpaste = function(e){
    if(e.value.length==1){
        e.value=e.value.replace(/[^0-9]/g,'')
	}else{
	    if (e.value.indexOf('.') > 0) {
			e.value = e.value.substring(0,e.value.toString().indexOf('.') + 3);
			var temp = e.value.split('.');
			temp[0] = temp[0].replace(/\D/g, '');
			temp[1] = temp[1].replace(/\D/g, '');
			e.value = temp[0] + '.' + temp[1]; 
		}else {
		    e.value=e.value.replace(/\D/g,'')
		}
	}
};
Fsns.utils.isCard=function (idcard){
var b=true;
 var Errors=new Array(
 "验证通过!",
 "身份证号码位数不对!",
 "身份证号码出生日期超出范围或含有非法字符!",
 "身份证号码校验错误!",
 "身份证地区非法!"
 );
var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 

var Y,JYM;
 var S,M;
 var idcard_array = new Array();
 idcard_array = idcard.split("");
 /*地区检验*/
if(area[parseInt(idcard.substr(0,2))]==null) 
 {
    //alert(Errors[4]); 
	b=false;
    return false;
 }
 /*身份号码位数及格式检验*/
switch(idcard.length){
    case 15:
    if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
     ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
   } else {
     ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
   }
    if(ereg.test(idcard)){
   // alert(Errors[0]+"15"); 
    	//b=false;
     // return false;
    	b=true;
    	return true;
     }
    else {
     // alert(Errors[2]);
    	b=false;
       return false;
      }
    break;
   
    case 18:
    //18位身份号码检测
   //出生日期的合法性检查 
   //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
    //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
    if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){
    ereg=/^[1-9][0-9]{7}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9X]$/;//闰年出生日期的合法性正则表达式
   } else {
    ereg=/^[1-9][0-9]{7}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9X]$/;//平年出生日期的合法性正则表达式
   }
    if(ereg.test(idcard)){//测试出生日期的合法性
    //计算校验位
    S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
     + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
     + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
     + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
     + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
     + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
     + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
     + parseInt(idcard_array[7]) * 1 
     + parseInt(idcard_array[8]) * 6
     + parseInt(idcard_array[9]) * 3 ;
     Y = S % 11;
     M = "F";
     JYM = "10X98765432";
     M = JYM.substr(Y,1);/*判断校验位*/
     if(M == idcard_array[17]){
    // alert(Errors[0]+"18"); 
     // return false; /*检测ID的校验位*/
    	 b=true;
    	 return true;
     }
     else {
     // alert(Errors[3]);
    	 b=false;
      return false;
     }
    }
    else {
   //  alert(Errors[2]);
    	b=false;
     return false;
    }
    break;
   
    default:
    //alert(Errors[1]); 
     b=false;
    
 }
return b;
}

Fsns.utils.isDate=function(date){
	var b=false;
	if(Fsns.utils.isInteger(date)){
		if(date.length==8){
			var year=date.substr(0,4);
			var month=date.substr(4,2);
			var day=date.substr(6,2);
			if(month.indexOf("0")==0)
				month=month.substr(1,2);
			//alert(month);
			var month=new Number(month);
			// alert(year+"  "+month+"  "+day);
			var  t = new Date(year, month - 1,day);
			var num=new Number(t.getMonth())+1;
			var year2=year;
			year=new Number(year)-1900;
			// alert(" year "+year +" = "+ t.getYear() +" month  "+ month +" = "+ num +"  day  "+ day +" ="+ t.getDate())
			if(year>=0&&(year == t.getYear()||year2==t.getYear()) && month == num && day == t.getDate()) 
				b=true;
		}
	}
	return b;
};

var DateUtils = {
		format : function(str) {
			var yyyy = str.substr(0, 4);
			var MM = str.substr(4, 2);
			var dd = str.substr(6, 2);
			var hh = str.substr(8, 2);
			var mm = str.substr(10, 2);
			var ss = str.substr(12, 2);
			var sb = yyyy + '年' + MM + '月' + dd + '日';
			sb += (hh ? (hh + '时') : '') + (mm ? (mm + '分') : '') + (ss ? (ss + '秒') : '');
			return sb;
		},
		parse : function(str) {
			var yyyy = str.substr(0, 4);
			var MM = str.substr(5, 2);
			var dd = str.substr(8, 2);
			
			return yyyy+MM+dd;
		},
		
		timestampToDate : function(timestamp) {

			var d = new Date(timestamp);
			var yyyy = d.getFullYear();
			var MM = d.getMonth()+1;
			var dd = d.getDate();
			var hh = d.getHours(); 
			var mm = d.getMinutes(); 
			var ss = d.getSeconds();

			if (yyyy == new Date().getFullYear()) {
				return (MM>9?MM:'0'+MM) + '-' + (dd>9?dd:'0'+dd) + ' ' 
						+ (hh>9?hh:'0'+hh) + ':' + (mm>9?mm:'0'+mm);
			} else {
				return yyyy + '-' + (MM>9?MM:'0'+MM) + '-' + (dd>9?dd:'0'+dd) + ' ' 
						+ (hh>9?hh:'0'+hh) + ':' + (mm>9?mm:'0'+mm);
			}
		} 	
	};



Fsns.Validator = function() {
	
	var DEFAULT_MSGS = {
		'ERR_REQUIRED' : '请输入%name%！',
		'ERR_INVALID' : '%name%格式不正确！',
		'ERR_MIN_VALUE' : '%name%最小为%minValue%！',
		'ERR_MAX_VALUE' : '%name%最大为%maxValue%！',
		'ERR_MIN_LENGTH' : '%name%最短为%minLength%个字符！',
		'ERR_MAX_LENGTH' : '%name%最长为%maxLength%个字符！'
	};
	
	var vd = function(form) {
		var $form = $(form);
		this.$form = $form;
		this.rules = {};
		this.keys = [];
	//	this.els = {};
	};
	
	vd.prototype = {
		addRules : function(rules) {
			if (!$.isArray(rules)) {
				rules = [rules];
			}
			$(rules).each($.proxy(this._addRule, this));
		},
		
		_addRule : function(index, rule) {
			try{
			var key = rule.key;
			if (key) {
				var ori = this.rules[key];
				this.rules[key] = ori ? $.extend(ori, rule) : rule;
				if ($.inArray(key, this.keys) == -1) {
					this.keys.push(key);
					this._addEvent(key);
				}
				this._cleanError(key);
			}
			}catch(e){}
		},
		
		_event : function(key) {
			
			this._cleanError(key);
			this.check(key);
		},
		_event_focus:function(key){
			
			this._cleanError(key);
		},
		_addEvent : function(key) {
			var _this = this;
			var $el = this._getEl(key);
			if ($el.hasClass('hasDatepicker')) {
				$el.datepicker('option' , 'onSelect', function(dateText, inst) {
					_this._event(key);
				});
			} 
			else {
				var eventName = 'blur';
				if ($el.is('select')) {
					eventName = 'change';
				}
				$el.on(eventName, $.proxy(this._event,this,key));
				
				var eventName_focus = 'focus';
				if ($el.is('select')) {
					eventName = 'change';
				}
				$el.on(eventName_focus, $.proxy(this._event_focus, this, key));
				
			}
		},
		
		check : function(keys) {
			if (!keys) {
				keys = this.keys;
			}
			if (!$.isArray(keys)) {
				keys = [keys];
			}
			var errors = [];
			$(keys).each($.proxy(function(index, key) {
				var res = this._check(key);
				if (res !== true) {
					errors.push(res);
				}
			}, this));
			
			if (errors.length > 0) {
				this._reportErrors(errors);
				return false;
			} else {
				return true;
			}
		},
		
		_check : function(key) {
			
			var rule = this.rules[key];
			if (rule) {
				var value = this._getValue(key);
				if (rule.required && (value === undefined || value === null || value === '')) {
					
					
					return $.extend({},rule,{error:'ERR_REQUIRED'});
					
					
				}
				if (value !== undefined && value !== null && value !== '') {
					//数据类型
					if (rule.type == 'phone' && !Fsns.utils.isPhone(value)
							|| rule.type == 'name' && !Fsns.utils.isName(value)
							|| rule.type == 'email' && !Fsns.utils.isEmail(value)
							|| rule.type == 'mobile' && !Fsns.utils.isMobile(value)
							|| rule.type == 'postcode' && !Fsns.utils.isPostcode(value)
							|| rule.type == 'url' && !Fsns.utils.isUrl(value)
							|| rule.type == 'int' && !Fsns.utils.isInteger(value)
							|| rule.type == 'intF' && !Fsns.utils.isIntegerF(value)
							|| rule.type == 'number' && !Fsns.utils.isNumber(value)
					        || rule.type == 'float' && !Fsns.utils.isFlaot(value)&&!Fsns.utils.isInteger(value)
							|| rule.type == 'password' && !Fsns.utils.isPassWord(value)
							|| rule.type == 'loginName' && !Fsns.utils.isLoginName(value)
							|| rule.type == 'telephone' && !Fsns.utils.isTelePhone(value)
							|| rule.type == 'card' && !Fsns.utils.isCard(value)
							||rule.type=='letter'&&!Fsns.utils.isLetter(value)
							||rule.type=='bigLetter'&&!Fsns.utils.isBigLetter(value)
							||rule.type=='smallLetter'&&!Fsns.utils.isSmallLetter(value)
						    ||rule.type=='date'&&!Fsns.utils.isDate(value)
						    ||rule.type=='money'&&!Fsns.utils.isMoney(value)	
					) {
						return $.extend({}, rule, {error:'ERR_INVALID'});
					}
					//长度
					
					if (rule.minLength && value.length < rule.minLength) {
						return $.extend({}, rule, {error:'ERR_MIN_LENGTH'});
					}
					if (rule.maxLength && value.length > rule.maxLength) {
						return $.extend({}, rule, {error:'ERR_MAX_LENGTH'});
					}
					if (rule.minValue ) {
						var num1=new Number(value);
						var num2=new Number(rule.minValue)
						if(num1<num2)
						return $.extend({}, rule, {error:'ERR_MIN_VALUE'});
					}
					if (rule.maxValue ) {
						var num1=new Number(value);
						var num2=new Number(rule.maxValue)
						if(num1>num2)
						return $.extend({}, rule, {error:'ERR_MAX_VALUE'});
					}
					
				}
				if ($.isFunction(rule.validator)) {
					var ret = rule.validator(value, rule);
					if ($.isString(ret)) {
						ret = {error:ret};
					}
					if ($.isPlainObject(ret)) {
						return $.extend({}, rule, ret);
					} 
				}
			}
			return true;
		},
		
		_getEl : function(key) {
			
			return this.$form.find('[name="'+key+'"]');
		},
		
		_getValue : function(key) {
		
			var $el = this._getEl(key);
			//TODO radio check etc..
			
			return $el.val();
		},
		
		_getMemo : function(key) {

			var rule = this.rules[key];
			var memoTarget = rule.memoTarget ? rule.memoTarget : key;
			return this.$form.find('[memo="'+memoTarget+'"]');
		},
		
		_reportErrors : function(errors) {
			
			$(errors).each($.proxy(function(index, error) {
				var key = error.key;
				var message = error.error;
				if (error.messages && error.messages[message]) {
					message = error.messages[message];
				} else if (DEFAULT_MSGS[message]) {
					message = DEFAULT_MSGS[message];
				}
				message = this._formatMessage(message, error);
				 layer.closeAll();
				 layer.open({
					    content: message,
					    style: 'background-color:rgba(0, 0, 0, 0.6); color:#fff; border:1px;text-align:center;',
					    shadeClose:false,
					    time:2
					});

				 
				     return ;
				//this.reportError(key, message);
			}, this));
		},
		
		reportError : function(key, message) {
			 layer.closeAll();
			 layer.open({
				    content: message,
				    style: 'background-color:rgba(0, 0, 0, 0.6); color:#fff; border:1px;text-align:center;',
				    shadeClose:false,
				    time:2
			});
		},
		
		cleanErrors : function(keys) {
			if (!keys) {
				keys = this.keys;
			}
			if (!$.isArray(keys)) {
				keys = [keys];
			}
			$(keys).each($.proxy(function(index, key) {
				this._cleanError(key);
			}, this));
		},
		
		_cleanError : function(key) {

			var rule = this.rules[key];
			var $memo = this._getMemo(key).addClass('bl_ui_it_memo').removeClass('bl_ui_it_memo_err');
			if (rule.memo) {
				$memo.text(rule.memo);
			} else {
				$memo.empty();
			}
			this._getEl(key).removeClass('l-text-invalid');
		},
		
		_formatMessage : function(message, data) {
			return message.replace(/%(\w)+%/g, function(word){
				var name = word.substring(1, word.length-1);
				if (data[name]) {
					return data[name];
				} else {
					return word;
				}
			});
		}
	};
	
	return vd;
}();
Fsns.utils.getUID = function() {
	
	var guid = "";
	for (var i = 1; i <= 32; i++){
		var n = Math.floor(Math.random()*16.0).toString(16);
		guid += n;
	}
	return guid;
};
Fsns.utils.fileType=function(type,fileId){
	if("JPG,GIF,PNG,BMP".indexOf(type)>=0){
		return base_path+'common/attachment/viewImage.html?fileId='+fileId;
	}
	else if("DOC,DOCX".indexOf(type)>=0)
	return base_path+'public/images/word.png';
	else if("XLS,XLSX".indexOf(type)>=0)
		return base_path+'public/images/excel.png';
	else if("ZIP,RAR".indexOf(type)>=0)
		return base_path+'public/images/zip.png';
	else if("PDF".indexOf(type)>=0)
		return base_path+'public/images/pdf.png';
}

/**
 * 判断是否登录
 * @returns {Boolean}
 */
Fsns.utils.isLogin=function(){
	var b=false;
	Fsns.utils.Post(base_path+"pub/common/common/isLogin", {}, {
		success:function(data){
		  if(data.isLogin=='suc'){
		    b=true;
		  }
		}
	},false);
	return b;
};

/**
 * 格式化金额 为 11,111.00
 * */
Fsns.utils.fmoney=function(s, n)   {
   if(s == '' || s == null){
	  return '0.00';
   }
   if(isNaN(s)){
       return '0.00';
   }
   n = n > 0 && n <= 20 ? n : 2;   
   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
   var l = s.split(".")[0].split("").reverse(),   
   r = s.split(".")[1];   
   t = "";   
   for(i = 0; i < l.length; i ++ )   
   {   
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
   }   
   return t.split("").reverse().join("") + "." + r;   
}
/**
 * 格式化金额 为 11,111.00
 * */
Fsns.utils.fmoneyZero=function(s)   {
   if(s == '' || s == null){
	  return '0.00';
   }	
   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(4) + "";   
   var l = s.split(".")[0].split("").reverse(),   
   r = s.split(".")[1].split("").reverse();   
   t = "";   
   for(i = 0; i < l.length; i ++ )   
   {   
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
   }
   
   t2 = "";
   for(i = 0; i < r.length; i ++ )   
   {  
	   if ((r.length-2) <= i) {
		   t2 += r[i];
	   } else if(r[i] != '0') {
    	   t2 += r[i];
      }   
   }
   t2 = t2.split("").reverse().join("");
   return t.split("").reverse().join("") + "." + t2;   
}

Fsns.utils.passwordStrength=function(passwordID,strengthDivID){
    document.getElementById(passwordID).onkeyup = function(){
    	Fsns.utils.checkStrength(this.value,strengthDivID);
    };
}

 Fsns.utils.checkStrength=function(val,strengthDivID){
    var lv = 0;
    if(val.length > 5){
    	if(val.match(/[a-z]/g)){lv++;}
	    if(val.match(/[0-9]/g)){lv++;}
	    if(val.match(/(.[^a-z0-9])/g)){lv++;}
    }else{
    	lv=0;
    }
    if(lv > 3){lv=3;}
    if (lv == 1) {
    	document.getElementById(strengthDivID).innerHTML='<p></p>';
    	document.getElementById(strengthDivID).innerHTML='<p>密码强度:</p><span class="ruo">弱</span><span>中</span><span>强</span>';
	}
    if (lv == 2) {
    	document.getElementById(strengthDivID).innerHTML='<p></p>';
    	document.getElementById(strengthDivID).innerHTML='<p>密码强度:</p><span>弱</span><span class="zhong">中</span><span>强</span>';
    }
    if (lv == 3) {
    	document.getElementById(strengthDivID).innerHTML='<p></p>';
    	document.getElementById(strengthDivID).innerHTML='<p>密码强度:</p><span>弱</span><span>中</span><span class="qiang">强</span>';
    }
    if (lv == 0) {
    	document.getElementById(strengthDivID).innerHTML='<p></p>';
    }
    
}

// 发送手机验证码
Fsns.utils.sendMobileCode=function(userId){
	var retObj=new Object();
	if(userId==undefined||userId==""||userId==null)
		userId="";
	Fsns.utils.Post(base_path+"/common/common/sendMobileCode.html", {userId:userId}, {
		loadingArea : '#loadArea',
		success:function(data){
			retObj.errorCode=data.sendResultCode;
			retObj.errorMsg=data.sendResultMsg;
		}
	},false);
	return retObj;
}
Fsns.utils.vadMobileCode=function(code){
	var b=false;
	Fsns.utils.Post(base_path+"/common/common/vadMobileCode.html", {code:code}, {
		loadingArea : '#loadArea',
		success:function(data){
		   if(data=='suc')
			b=true;
		   else
			  b=false;
		}
	},false);
	return b;
}

/**
 * 校验手机验证码
 * @author qinjingkai
 * @param code
 * @returns {Boolean}
 */
Fsns.utils.checkMobileCode=function(code){
	var b="0";
	Fsns.utils.Post(base_path+"/common/common/checkMobileCode.html", {code:code}, {
		loadingArea : '#loadArea',
		success:function(data){
			b=data;
		}
	},false);
	return b;
}


//金额转换为大写
Fsns.utils.numToCny = function(num){
	var numValue = num.value;
	for(i=numValue.length-1;i>=0;i--)
	{
	numValue = numValue.replace(",","")
	numValue = numValue.replace(" ","")
	}
	numValue = numValue.replace("￥","")
	if(isNaN(numValue)) {
	alert("请检查小写金额是否正确");
	return;
	}
	part = String(numValue).split(".");
	newchar = "";
	for(i=part[0].length-1;i>=0;i--){
	if(part[0].length > 10){ alert("位数过大，无法计算");return "";}
	tmpnewchar = ""
	perchar = part[0].charAt(i);
	switch(perchar){
	case "0": tmpnewchar="零" + tmpnewchar ;break;
	case "1": tmpnewchar="壹" + tmpnewchar ;break;
	case "2": tmpnewchar="贰" + tmpnewchar ;break;
	case "3": tmpnewchar="叁" + tmpnewchar ;break;
	case "4": tmpnewchar="肆" + tmpnewchar ;break;
	case "5": tmpnewchar="伍" + tmpnewchar ;break;
	case "6": tmpnewchar="陆" + tmpnewchar ;break;
	case "7": tmpnewchar="柒" + tmpnewchar ;break;
	case "8": tmpnewchar="捌" + tmpnewchar ;break;
	case "9": tmpnewchar="玖" + tmpnewchar ;break;
	}
	switch(part[0].length-i-1){
	case 0: tmpnewchar = tmpnewchar +"元" ;break;
	case 1: if(perchar!=0)tmpnewchar= tmpnewchar +"拾" ;break;
	case 2: if(perchar!=0)tmpnewchar= tmpnewchar +"佰" ;break;
	case 3: if(perchar!=0)tmpnewchar= tmpnewchar +"仟" ;break;
	case 4: tmpnewchar= tmpnewchar +"万" ;break;
	case 5: if(perchar!=0)tmpnewchar= tmpnewchar +"拾" ;break;
	case 6: if(perchar!=0)tmpnewchar= tmpnewchar +"佰" ;break;
	case 7: if(perchar!=0)tmpnewchar= tmpnewchar +"仟" ;break;
	case 8: tmpnewchar= tmpnewchar +"亿" ;break;
	case 9: tmpnewchar= tmpnewchar +"拾" ;break;
	}
	newchar = tmpnewchar + newchar;
	}
	if(numValue.indexOf(".")!=-1){
	if(part[1].length > 2) {
	part[1] = part[1].substr(0,2)
	}
	for(i=0;i<part[1].length;i++){
	tmpnewchar = ""
	perchar = part[1].charAt(i)
	switch(perchar){
	case "0": tmpnewchar="零" + tmpnewchar ;break;
	case "1": tmpnewchar="壹" + tmpnewchar ;break;
	case "2": tmpnewchar="贰" + tmpnewchar ;break;
	case "3": tmpnewchar="叁" + tmpnewchar ;break;
	case "4": tmpnewchar="肆" + tmpnewchar ;break;
	case "5": tmpnewchar="伍" + tmpnewchar ;break;
	case "6": tmpnewchar="陆" + tmpnewchar ;break;
	case "7": tmpnewchar="柒" + tmpnewchar ;break;
	case "8": tmpnewchar="捌" + tmpnewchar ;break;
	case "9": tmpnewchar="玖" + tmpnewchar ;break;
	}
	if(i==0)tmpnewchar =tmpnewchar + "角";
	if(i==1)tmpnewchar = tmpnewchar + "分";
	newchar = newchar + tmpnewchar;
	}
	}
	while(newchar.search("零零") != -1)
	newchar = newchar.replace("零零", "零");
	newchar = newchar.replace("零亿", "亿");
	newchar = newchar.replace("亿万", "亿");
	newchar = newchar.replace("零万", "万");
	newchar = newchar.replace("零元", "元");
	newchar = newchar.replace("零角", "");
	newchar = newchar.replace("零分", "");
	if (newchar.charAt(newchar.length-1) == "元" || newchar.charAt(newchar.length-1) == "角")
	newchar = newchar+"整";

	
    var renderTo = num.getAttribute("renderto");
    var cc = document.getElementById(renderTo);
    document.getElementById(renderTo).innerHTML = newchar;
};

Fsns.utils.pwdSimple=function(v) {
    var num = 0;
    var reg = /\d/; //如果有数字
    if (reg.test(v)) {
        num++;
    }
    reg = /[a-zA-Z]/; //如果有字母
    if (reg.test(v)) {
        num++;
    }
    reg = /[_]/; //如果有特殊字符
    if (reg.test(v)) {
        num++;
    }
    if(num < 2){
    	return false;
    }
    var exp = /^[\A-Za-z0-9\_]{6,16}$/;
    var flag = exp.test(v);
    return flag;
}




Fsns.ui = {};

var fsns_page_no=0;
/**
 * 初始化iScroll控件
 */
Fsns.ui.loaded=function() {
	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;
	myScroll = new iScroll('wrapper', {
		useTransition: true,    
		onRefresh: function () {
			if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			}
		},
		onScrollMove: function () {
			if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function () {
			if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
				pullUpAction();	
			}
		}
	});
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

var fsns_page=0;
var fsns_page_count=1;

Fsns.ui.initScroll=function(){
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	document.addEventListener('DOMContentLoaded', Fsns.ui.loaded, false);
}

Fsns.ui.PageNav = function() {
    var pageId="";
    var pageType="";
    var fsns_pageInfo={page:fsns_page, pageTotal:0,count:0};
	var DEFAULT_CONFIG = {
		defaultPageSize : 10 
	};
	var pn = function(container, config,pageSize) {
		if(pageSize&&pageSize!=null)
			DEFAULT_CONFIG.defaultPageSize=pageSize
		var _this = this;
		this._config = $.extend({pageNumbers:true}, DEFAULT_CONFIG, config);
        var params={page:fsns_page,pagesize:DEFAULT_CONFIG.defaultPageSize}
		if ($.isFunction(this._config.callback)) {
			this._config.callback(params);
			fsns_page=fsns_page+1;
		}
	};
	pn.prototype = {
		_doCallBack : function(params, type) {
			if ($.isFunction(this._config.callback)) {
				this._config.callback(params, type);
			}
		}
	};
	
	return pn;
}();


Fsns.ui.Button = function() {
	var pn = function(target, func, style, hover) {
		var _this = this;
		var $target = $(target);
		this.$target = $target;
		if ($target.is('a') && !$target.attr('href')) {
			$target.attr('href','javascript:void(0)');
		}
		this.style = style;
		this.text = $target.text();
		this.hover = hover;
		this.func = func;
		
		this.className = style ? 'bl_ui_button_'+style : 'bl_ui_button';
		var classNameD = this.className + '_d';
		this.classNameD = classNameD;
		var classNameL = 'over';
		this.classNameL = classNameL;
		
		$target.addClass(this.className)
			.click(function() {
				if ($.isFunction(_this.func) && !$target.hasClass(classNameD)) {
					_this.func(_this, this);
				}
			});
		this._mouseEnterFunc = $.proxy(this._mouseEnter, this);
		this._mouseLeaveFunc = $.proxy(this._mouseLeave, this);
		
		if (hover) {
			$target.mouseenter(this._mouseEnterFunc);
			$target.mouseleave(this._mouseLeaveFunc);
		}
	};
	
	pn.prototype = {
		changeFunc : function(func) {
          
			if ($.isFunction(func)) {
				this.func = func;
			} else {
				this.func = null;
			}
			return this;
		},
		
		changeStyle : function(style) {
			
			this.style = style;
			this._changeStyle(style); 
			return this;
		},
		
		changeText : function(text) {
			this.text = text;
			this.$target.text(text);
			return this;
		},
		
		changeHover : function(hover) {
			
			var $target = this.$target;
			$target.off('mouseenter', this._mouseEnterFunc);
			$target.off('mouseleave', this._mouseLeaveFunc);
			if (hover) {
				$target.mouseenter(this._mouseEnterFunc);
				$target.mouseleave(this._mouseLeaveFunc);
			}
			this.hover = hover;
			return this;
		},
		
		_mouseEnter : function() {
			if (!this._hovered) {
				this._hovered = true;
				if (!this.$target.hasClass(this.classNameL)) {
					this._changeStyle(this.hover.style, this.hover.text);
				}
			}
		},
		
		_mouseLeave : function() {
			this._hovered = false;
			if (!this.$target.hasClass(this.classNameL)) {
				this._changeStyle(this.style, this.text);
			}
		},
		
		_changeStyle : function(style, text) {
			
			var disabled, loading;
			if (this.$target.hasClass(this.classNameD)) {
				disabled = true;
				this.$target.removeClass(this.classNameD);
			}
			if (this.$target.hasClass(this.classNameL)) {
				loading = true;
				this.$target.removeClass(this.classNameL);
			}
			this.$target.removeClass(this.className);

			this.className = style ? 'bl_ui_button_'+style : 'bl_ui_button';
			var classNameD = this.className + '_d';
			this.classNameD = classNameD;
			var classNameL = this.className + '_l';
			this.classNameL = classNameL;

			this.$target.addClass(this.className);
			if (disabled) {
				this.$target.addClass(this.classNameD);
			}
			if (loading) {
				this.$target.addClass(this.classNameL);
			}
			
			if (text)
				this.$target.text(text);
		},
		
		enable : function(text) {
			if(text!=null)
			this.$target.html("正在登录..");
			$("#microLogin").attr("disable",true);
			this.$target.removeClass(this.classNameD);
		},
		
		disable : function() {
			
			this.$target.addClass(this.classNameD);
		},
		
		loading : function(loading) {
			
			if (loading) {
				this.$target.addClass(this.classNameL)
					.append('<span class="bl_ui_button_loading" ></span>');
			} else {
				this.$target.removeClass(this.classNameL)
					.find('.bl_ui_button_loading').remove();
				if (this._hovered) {
					this._changeStyle(this.hover.style, this.hover.text);
				} else {
					this._changeStyle(this.style, this.text);
				}
			} 
		}
	};
	
	return pn;
}();


Fsns.ui.select = function(select, key, type, va,b) {
	var $select = $(select);
	 var opValue=va;
	if(b!=undefined&&b==false)
	var sb = '';
	else{
	var sb = '<option></option>';
	}
	if (type && type == 'dict') {
		Fsns.utils.Post(base_path + 'pub/common/ui/makeSelect', {
			key : key,
			type:type
		}, {
			success : function(data) {
				$(data.gridData).each(
						function(index, record) {
							if(record.value==opValue){
								sb += '<option  selected="selected" value="' + record.value + '" >'
								+ record.name + '</option>';
							}
							else
							sb += '<option value="' + record.value + '" >'
									+ record.name + '</option>';
						});
				$select.html(sb);
				 
				
			}
		});

		
	} else {
		Fsns.utils.Post(base_path + '/common/ui/makeSelect', {
			key : key,
			type:type
		}, {
			success : function(data) {
				$(data.gridData).each(
						function(index, record) {
							if(opValue==record.value){
								sb += '<option  selected="selected" value="' + record.value + '" >'
								+ record.name + '</option>';
							}
							else
							sb += '<option value="' + record.value + '" >' + record.name
									+ '</option>';

						});
				
				$select.html(sb);
			}
		});
	}
};