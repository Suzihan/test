var myScroll;
(function (window, undefined) {
    'use strict'
    function fantianying() {
    };
    fantianying.prototype = {
        init:function () {
            this.historyBack();
            this.emptyInput();
            this.showPassword();
            this.goPage();
        },
        historyBack:function () {
            $('body').on('click','#J_header_back',function () {
                window.history.back();
            });
        },//end historyBack
        goPage:function(){
            if(!/phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent)) {
                this.msg('请使用移动端设备访问',0)
                // window.location.href = "http://www.taotaojin.com/";
                //跳转PC
            }
        },//end goPage
        iScroll:function(func){
            var myScroll,pullUpEl, pullUpOffset;
            function loaded() {
                if (!$('#pullUp').is('div')) return;
                pullUpEl = document.getElementById('pullUp');
                pullUpOffset = pullUpEl.offsetHeight;
                setTimeout(function () {
                    myScroll = new iScroll('wrapper', {
                        vScrollbar: false,
                        useTransition: true,
                        onRefresh: function () {
                            if (pullUpEl.className.match('loading')) {
                                pullUpEl.className = '';
                                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉查看更多';
                            }
                        },
                        onScrollMove: function () {
                            if (pullUpEl.className.match('loading')) return;
                            if ((this.maxScrollY - this.y) > 50 && !pullUpEl.className.match('flip')) {
                                pullUpEl.className = 'flip';
                                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开立即加载';
                            } else if ((this.maxScrollY - this.y) < 50  && pullUpEl.className.match('flip')) {
                                pullUpEl.className = '';
                                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉查看更多';
                            }
                        },
                        onScrollEnd: function () {
                            if (pullUpEl.className.match('flip')) {
                                pullUpEl.className = 'loading';
                                pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在加载';
                                if(func) func();
                                myScroll.refresh();
                            }
                        }
                    });
                }, 300);
            }
            document.addEventListener('DOMContentLoaded', loaded, false);
            document.addEventListener('touchmove', function (e) {e.preventDefault();}, { passive: false });
            if(func) func();
        },//end iScroll
        noData:function(msg){
            var content = typeof msg === 'undefined'? '暂无数据': msg,
                htmlStr = '<div class="no-data pa" id="J_no_data"><div class="no-data-ct pa tc fc-666"><p>' + content + '</p></div></div>';
            $(htmlStr).appendTo('.m-content');
        },//end noData
        dialog:function (content,className ) {
            //传id或者字符串
            var content = content;
            if(content.indexOf("#") === 0) content = $(content).html();
            layer.open({
                type:1,
                className:typeof className === 'undefined' ? className : '',
                shadeClose:false,
                content:content
            })
        },//end dialog
        showPassword:function () {
            //显示密码
            $('body').on('click','.show-password-icon',function () {
                var $password = $(this).siblings('input');
                $(this).toggleClass('open');
                if ($(this).is('.open')) {
                    $password.attr('type', 'text');
                } else {
                    $password.attr('type', 'password');
                }
            });
        },//end showPassword
        emptyInput:function () {
            //清空表单
            $('body').on('input', '.C-empty-ipt',function () {
                var val = $(this).val();
                if (val === '') {
                    $(this).siblings('.ipt-empty-icon').hide();
                } else {
                    $(this).siblings('.ipt-empty-icon').css('display','block');
                }
            });
            $(document).on('click','.ipt-empty-icon',function () {
                $(this).hide().siblings('input').val('').focus();
            });
        },//end emptyInput
        tradePassword:function (func) {
            var htmlStr = '';
            htmlStr += '<div class="m-dialog trade-password-dialog">';
            htmlStr += '    <div class="m-dialog-head">交易密码<span class="close-gray" onclick="layer.closeAll()"></span></div>';
            htmlStr += '    <div class="m-dialog-body">';
            htmlStr += '        <div class="trade-password-wrap pr">';
            htmlStr += '            <input type="password" class="trade-password-ipt"  placeholder="请输入交易密码" id="tradePass" maxLength="6">';
            htmlStr += '        </div>';
            htmlStr += '        <div class="trade-password-btn"><a href="javascript:;" class="btn go-invest-btn" id="J_trade_password">确定</a></div>';
            htmlStr += '    </div>';
            htmlStr += '</div>';
            this.dialog(htmlStr);
            $('.trade-password-ipt').off('focus').on('focus',function () {
                $(this).parent().addClass('focus');
            }).off('blur').on('blur',function () {
                $(this).parent().removeClass('focus');
            });
            $('#J_trade_password').off('click').on('click',function () {

                var tradePass = $("#tradePass").val();
                if(tradePass == ''){
                    fty.msg('请输入交易密码!');
                    return;
                }
                if(func) func();
            });
        },//end tradePassword
        tradePasswordError:function (msg,func,oldUrl) {
            var htmlStr = '',
                content = typeof msg === 'undefined'? '支付密码不正确' : msg;
            htmlStr += '<div class="m-dialog trade-password-dialog">';
            htmlStr += '    <div class="m-dialog-body">';
            htmlStr += '        <div class="trade-password-error f16 tc">' + content + '</div>';
            htmlStr += '        <div class="trade-password-error-btn">';
            htmlStr += '            <a href="javascript:;" class="btn go-invest-btn fr" id="bth_forget">忘记密码</a>';
            htmlStr += '            <a href="javascript:;" class="btn go-invest-btn btn-gray" onclick="" id="J_again_input">重新输入</a>';
            htmlStr += '        </div>';
            htmlStr += '    </div>';
            htmlStr += '</div>';
            this.dialog(htmlStr);
            $('#J_again_input').off('click').on('click',function () {
                layer.closeAll();
                fty.tradePassword(func);
            });
            $('#bth_forget').off('click').on('click',function () {
            	if(typeof oldUrl != 'undefined'){
            		Fsns.utils.Post(
                			base_path + 'pub/common/ui/setOldUrl',
                			{'oldUrl':oldUrl}, {
                				success : function(data) {
                					
                				}
                	});
            	}
            	fty.gotoUrl('portal/safe/transPwd/resetPage');
            });
        },//end failed
        login:function (func) {//登录方法的页面，需要引入加密的对应js(aes.js,BigInt.js,md5.js,encrypt.js)
            var htmlStr = '';
            htmlStr += '<div class="m-dialog">';
            htmlStr += '	<form id="dailogForm"><div class="login-dialog">';
            htmlStr += '		<div class="pr">';
            htmlStr += '			<input id="dialogMobile" name="dialogMobile" type="number" class="C-empty-ipt" placeholder="请输入手机号码" oninput="if(value.length>11)value=value.slice(0,11)">';
            htmlStr += '			<span class="ipt-empty-icon" onclick="fty.emptyInput()"></span>';
            htmlStr += '		</div>';
            htmlStr += '		<div class="pr">';
            htmlStr += '			<input id="dialogPwd" name="dialogPwd" type="password" class="C-empty-ipt" placeholder="请输入登录密码" autocomplete="new-password" oninput="if(value.length>35)value=value.slice(0,35)">';
            htmlStr += '			<span class="show-password-icon" onclick="fty.showPassword()"></span>';
            htmlStr += '			<span class="ipt-empty-icon" onclick="fty.emptyInput()"></span>';
            htmlStr += '		</div>';
            
            htmlStr += '		<div style="display: none" class="pr" id="img_div">';
            htmlStr += '			<input id="dialogImgCode" name="dialogImgCode" type="text" class="C-empty-ipt" placeholder="图形验证码" maxlength="4">';
            htmlStr += '			<img id="dialog_img_code"  src="" class="img-code" alt="换一张" />';
            htmlStr += '			<span class="ipt-empty-icon" onclick="fty.emptyInput()"></span>';
            htmlStr += '		</div>';
            htmlStr += '		<div style="display: none" class="pr" id="phoneCode_div">';
            htmlStr += '			<input id="dialogPhoneCode" name="dialogPhoneCode" type="text" class="C-empty-ipt" placeholder="短信验证码" maxlength="6">';
            htmlStr += '			<span class="msg-second" id="dialog_btn_send">获取验证码</span>';
            htmlStr += '			<span class="ipt-empty-icon" onclick="fty.emptyInput()"></span>';
            htmlStr += '		</div>';
            
            htmlStr += '		<div class="login-dialog-btn">';
            htmlStr += '			<div class="tl"><a href="'+base_path+'pub/auth/regist/registStep1Page" class="fc-blue">注册新用户</a><a href="'+base_path+'pub/auth/findPassword/forgetPasswordPage1" class="fc-blue fr">忘记密码？</a></div>';
            htmlStr += '			<a href="javascript:;" class="btn go-invest-btn" id="J_login_submit">登录</a>';
            htmlStr += '			<div><a href="'+base_path+'pub/auth/fpLogin/loginPage" class="fc-blue">泛钛客账号登录</a></div>';
            htmlStr += '		</div>';
            htmlStr += '	</div></form>';
            htmlStr += '	<span class="close" onclick="layer.closeAll()">关闭</span>';
            htmlStr += '</div>';
            this.dialog(htmlStr);
            this.showPassword();

            var submiting_d = false;
            $('#J_login_submit').off('click').on('click',function () {
            	if(submiting_d){
            		return;
            	}
            	var dialogMobile = $('#dialogMobile').val();
            	var dialogPwd = $('#dialogPwd').val();
            	var params = {};
            	if(dialogMobile==''||dialogMobile==null){
            		fty.msg('请输入手机号码');
            		return;
            	}
            	if(!fty.checkPhoneNo(dialogMobile)){
            		fty.msg('请输入11位合法手机号码');
            		return;
            	}
            	params.name = dialogMobile;
            	if(dialogPwd==''||dialogPwd==null){
            		fty.msg('请输入登录密码');
            		return;
            	}
            	params.pwd = ttj_encrypt(dialogPwd);
            	if( $('#img_div').css("display") != 'none' ){
            		var dialogImgCode = $('#dialogImgCode').val();
            		if(null==dialogImgCode||$.trim(dialogImgCode)==''){
            			fty.msg('请输入图形验证码');
            			return;
            		}
            		if(dialogImgCode.length!=4){
            			fty.msg('图形验证码是4位字母');
            			return;
            		}
            		params.imgCode = dialogImgCode;
            	}
            	if( $('#phoneCode_div').css("display") != 'none' ){
            		var dialogPhoneCode = $('#dialogPhoneCode').val();
                	if(null==dialogPhoneCode||$.trim(dialogPhoneCode)==''){
                		fty.msg('请输入短信验证码');
                		return;
                	}
                	if(dialogPhoneCode.length!=6){
                		fty.msg('短信验证码为6位数字');
                		return;
                	}
                	params.phoneCode = dialogPhoneCode;
            	}
            	submiting_d = true;
            	params.token='';
            	Fsns.utils.Post(
            			base_path + 'pub/auth/login/login',
            			params, {
            				success : function(data) {
            			       if (data.code == '00') {
            			    	   fty.msg('登录成功 !');	
            			    	   if(func){//执行回调方法
            			    		   func();
            			    	   } else{
            			    		   setTimeout('fty.gotoUrl()',1000);
            			    	   }
            	                } else if(data.code == '92'){//设备号校验显示手机验证码
            	                	$('#phoneCode_div').css("display","block");
            	                	fty.msg(data.mes);
            	                	submiting_d = false;
            					}  
            	                else if(data.code == '91'||data.code == '93'||data.code == '95'){//1密码次数输入过多；2设备号的手机验证码不通过则显示图形验证码3、用户名或者密码错误
            						$('#img_div').css("display","block");
            						if($('#dialog_img_code').attr('src')==''){
            							$('#dialog_img_code').attr('src',base_path+'pub/auth/regist/registerVerifyCode?'+new Date().getTime());
            						}
            	                	fty.msg(data.mes);
            	                	submiting_d = false;
            					}  
            	                else if(data.code == '98'){//图形验证码输入错误（不重新刷新图形验证码）
            	                	fty.msg(data.mes);
            	                	submiting_d = false;
            					}
            	                else{
            						fty.msg(data.mes);
            						submiting_d = false;
            					} 
            		   }
            	});
            	
            });
            $('#dialog_img_code').off('click').on('click',function () {
            	$(this).attr('src',base_path+'pub/auth/regist/registerVerifyCode?'+new Date().getTime());
            });
            $("input[name='dialogPhoneCode']").keyup(function(){//keyup事件处理 
                $(this).val($(this).val().replace(/\D/g,''));  
            }).bind("paste",function(){  //CTR+V事件处理 
                $(this).val($(this).val().replace(/\D/g,''));  
            });
            var dialog_wait = 0;
            var dialog_time = function(o, second) {
            	dialog_wait = second;
            	if (dialog_wait <= 0) {
            		o.text('重新发送');
            		dialog_wait = 2;
            	} else {
            		o.text(dialog_wait+"S");
            		dialog_wait--;
            		setTimeout(function() {
            			dialog_time(o, dialog_wait);
            		}, 1000);
            	}
            }
            $('#dialog_btn_send').off('click').on('click',function () {
        		var text = $(this).text();
        		if(text.indexOf('S')>-1){
        			return;
        		}
        		Fsns.utils.Post(
        				base_path + 'pub/auth/login/phoneVerifyCode',
        				{}, {
        					success : function(data) {
        						if (data.code == '00') {
        							dialog_time($('#dialog_btn_send'), 120);
        						}
        						else{
        							fty.msg(data.mes);
        						}
        					},
        					error:function(){
        						
        					}
        		});
            });
        },//end login
        gotoUrl:function(url){
            if (url == null || url == '' || url == 'null') {
                url = 'pub/home/indexPage';
            }
            if(typeof url=='object'){//参数类型是对象
                var targetUrl = $(url).attr('targetUrl');
                if(null!=targetUrl&&''!=targetUrl&&undefined!=targetUrl){
                    url =targetUrl;
                }
            }
            url = base_path + url;
            window.location.href=url;
        }
        ,
        handNullValue:function(v){/**处理null的数据显示*/
            if(undefined==v||null==v){
                return '';
            }
            return v;
        }
        ,flushVerifyCode:function(){//刷新图形验证码
            document.getElementById("img_code").src = base_path + 'pub/auth/regist/registerVerifyCode?' + new Date().getTime();
            $('#imgCode').val('');
        }
        ,checkPhoneNo:function(phone){//检查手机号
            if (phone == null || phone == '') {
                return false;
            }
            var exp = /^(((10[0-9]{1})|(11[0-9]{1})|(12[0-9]{1})|(13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|18[0-9]{1}|19[0-9]{1})+\d{8})$/;
            var regMobilePhoneStatus = exp.test(phone);
            if (!regMobilePhoneStatus) {
                return false;
            }
            return true;
        }
        ,checkPwd:function(pwd,type){//校验密码
            var obj = new Object();
            if (pwd == null || pwd == '') {
                obj.code = false;
                obj.mes = '密码不能为空!';
                return obj;
            }
            var exp = /^[A-Za-z0-9\_]{6,16}$/;
            var flag = exp.test(pwd);
            if (!flag) {
                obj.code = false;
                if(type == '2'){
                    obj.mes = '请设置6~16位含字母和数字的平台交易密码';
                }else{
                    obj.mes = '请设置6~16位含字母和数字的登录密码';
                }
                return obj;
            }
            var checkResult = fty.pwdSimple(pwd);
            if(!checkResult){
                obj.code = false;
                if(type == '2'){
                    obj.mes = '请设置6~16位含字母和数字的平台交易密码';
                }else{
                    obj.mes = '请设置6~16位含字母和数字的登录密码';
                }
                return obj;
            }
            obj.code = true;
            obj.mes = '';
            return obj;
        },pwdSimple:function(v){
            var num = 0;
            var reg = /\d/; //如果有数字
            if (reg.test(v)) {
                num++;
            }
            reg = /[a-zA-Z]/; //如果有字母
            if (reg.test(v)) {
                num++;
            }
            reg = /[^0-9a-zA-Z]/; //如果有特殊字符
            if (reg.test(v)) {
                num++;
            }
            if(num < 2){
                return false;
            }
            return true;
        },msg:function(content, time,success){//提示信息层（会执行layer.closeAll）
            //text 提示文本，time默认3秒自动关闭，可不传值
            layer.open({
                style: 'border:none; background:rgba(0,0,0,.6);color:#fff;padding: 15px 12px; text-align: center; min-width: 40%;'
                ,content: content
                ,shadeClose:false
                ,time: typeof time !== 'undefined' ? time : 3
                ,success:function () {
                    if(!success) return;
                    setTimeout(function () {
                        success();
                    },time*1000);
                }
            });
        },
        confirm:function (option) {
            /*
                 option = {
                 title:'标题',
                 content:'内容',
                 btn:['确定','取消'],
                 yes:function () {},
                 no:function () {},
                 end:function () {}
                 }
                 必填项：content、btn
             */
            layer.open({
                title:!option.title?false:option.title
                ,shadeClose:false
                ,content: option.msg
                ,className:'fty-confirm'
                ,btn: option.btn
                ,yes: typeof fty.confirm === 'function' ? option.yes : null
                ,no:typeof fty.confirm === 'function' ? option.no : null
                ,end:typeof fty.confirm === 'function' ? option.end : null
            });

        },
        checkTransPwd:function(v){//校验平台交易密码（新）
            if(v==''||v==null||v==undefined){
                return false;
            }
            var reg = /^\d{6}$/;
            return reg.test(v);
        },
        queryHashName:function(name){//查询参数路径值
            var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "g"));
            if (result == null || result.length < 1) {
                return "";
            }
            if (result.length == 1) return decodeURI(result[0].split('=')[1]);
            var arr = [];
            for (var i = 0; i < result.length; i++) {
                arr.push(decodeURI(result[i].split('=')[1]));
            }
            return arr.toString();
        },
        radio:function(){
            $('.radio input').on('click',function () {
                var name = $(this).attr('name');
                if($(this).prop('checked')){
                    $('[name='+ name +']').parent('.radio').removeClass('checked');
                    $(this).parent().addClass('checked');
                }
            });
        },
        setOldUrl:function(oldUrl){
        	if(null==oldUrl||''==oldUrl||undefined==oldUrl){
        		return;
        	}
        	Fsns.utils.Post(
        			base_path + 'pub/common/ui/setOldUrl',
        			{'oldUrl':oldUrl}, {
        				success : function(data) {
        					
        				}
        	});
        }
    }
    if (typeof window.fty === 'undefined') {
        window.fty = new fantianying();
        fty.init();
    }
})(window);
