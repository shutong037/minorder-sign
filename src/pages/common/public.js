// 引入公共css
import "../common/reset.css";
import "@/assets/global.css";
import "@/assets/vant.css";

import './vendor/vue.min'
import './vendor/vant.min'

let  js = document.createElement('script');
js.src = 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js';
document.head.appendChild(js);

export const _ = {
    globalVar: {
        domain: '/api',
		baseUrl: '/mini'
    },
    /*去除两边空格*/
    trim: function (str) {
        if (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        return str;
    },
    //ajax
    _ajax: function (url, type, data, callback, vm, img, time, isLogin) {
		var xhr = new XMLHttpRequest();
        var that = this;
        xhr.open(type, url, true);
		_.setCookie("Auth-Token","",-1)
		xhr.setRequestHeader("Access-Token", _.getCookie('Access-Token'))
	    if (img){
		  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8;")
	    }
        if (vm) {
            xhr.timeout = time ? time : 20000
            xhr.ontimeout = function () {
                vm.$dialog.alert({ title: "提示", message: '请求超时！' });
                vm.$toast.clear();
            }
            xhr.error = function () {
                vm.$dialog.alert({ title: "提示", message: '当前网络质量不佳，请稍后重试！' });
                vm.$toast.clear();
            }
        }
		if(isLogin){
			xhr.setRequestHeader("Content-Type", "application/json");
		}
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var loading = document.getElementById("loadingToast");
                if (loading && !no) loading.remove();
                if (xhr.response && JSON.parse(xhr.response).code === 401) {
					return that.getAuth(vm)
                } else if (xhr.response && JSON.parse(xhr.response).code === 10086) {
                    vm.$dialog.alert({
                        showConfirmButton: false,
                        showCancelButton: false,
                        message: JSON.parse(xhr.response).msg
                    });
                }
                callback(xhr.response ? JSON.parse(xhr.response) || "" : "");
            } else {
               // console.log(xhr.readyState)
            }
        };
    },
    logKeystrokes: function (title, btnName, callback,vm) {
		var id = _.getQueryValue('id')
		var orderId = _.getQueryValue('orderId') != "" ? _.getQueryValue('orderId'): null
        var params = {
            sbrCycleId: id, //小商品ID
			sbrGoodsId: id.substring(0,4), // 商品ID
			sbrOdId: orderId, //订单ID
			sbrTitle: title,
			sbrDetail: btnName,
			sbrUrl: window.location.href
        }
        _._ajax(_.globalVar.domain + '', 'post', JSON.stringify(params), function (res) {
			if(res.code == 200){
				callback()
			}else if(res.code == 500){
				vm.$dialog.alert({ title: "提示", message: res.msg });
			}
        },vm,null,null,true);
    },
    getAuth: function (vm) {
		var oldUrl = window.location.href;
		_.setCookie("defaultUrl",oldUrl)
		var id = _.getQueryValue('id')
		var a = _.getQueryValue('a')
		_._ajax(_.globalVar.domain + '', 'get', '', function (res) {
			if(res && res.code == 200){
				var url =  ""
				if(id == "" &&  a == ""){
					url =  location.protocol + "//" + location.host + _.globalVar.baseUrl +"/empty.html"
				}else{
					if(id != ""){
						url =  location.protocol + "//" + location.host + _.globalVar.baseUrl +"/empty.html?id="+ id
					}else if(a != ""){
						url =  location.protocol + "//" + location.host + _.globalVar.baseUrl +"/empty.html?a="+ a
					}
				}
				if(url.indexOf('?') != '-1'){
					url = url + '&oldUrl=' + encodeURIComponent(oldUrl)
				}else{
					url = url + '?oldUrl=' + encodeURIComponent(oldUrl)
				}
				var data = res.data.replace(/REDIRECTURI/g , encodeURIComponent(url))
				window.location.href =  data
			}else{
				vm.$dialog.alert({ title: "提示", message: res.msg });
			}
		},vm,null,null,false);
    },
    accMul: function (arg1, arg2) {
        if (!arg1) {
            return arg1
        }
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length;
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    Subtr: function (arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    //拼接json多参数字符串
    toString: function (obj) {
        var str = "";
        for (var prop in obj) {
            str += prop + "=" + obj[prop] + "&";
        }
        return str.substring(0, str.length - 1);
    },
    empty: function (data) {
        if (!data) return "";
        return data;
    },
    // 根据QueryString参数名称获取值
    getQueryValue: function (key) {
        var result = location.href.match(new RegExp("[\?\&]" + key + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    },
    /* 验证手机号*/
    regTel: function (val) {
        var telReg = /^[1][3456789][0-9]{9}$/;
        return telReg.test(val);
    },
    setCookie: function (name, value, val) {
		var exdate = new Date();
		if(val == undefined){
			exdate.setDate(exdate.getDate() + 1);
		}else{
			exdate.setTime(exdate.getTime() + 60 * 1000 * val);
		}
        // domain=rolormd.com
        document.cookie = name + "=" + value + ((1 == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/;";
    },
    getCookie: function (key) {
        var cookies = document.cookie;
        var result = cookies.match(new RegExp(key + "=([^\;]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    },
    //判断是否有class
    hasClass: function (ele, cName) {
        return !!ele.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
    },
    //添加class
    addClass: function (ele, cName) {
        if (ele && !this.hasClass(ele, cName)) ele.className += " " + cName;
    },
    isIphoneX: function () {
        return (/iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812) ||
            (/iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896) ||
            (/iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896)
    },
    isEmpty: function (str) {
        if (str instanceof String) {
            str = this.trim(str);
        }
        if (str == null || str == "" || str == undefined || str == [] || str == "undefined") {
            return true;
        } else if (str instanceof Object) {
            var hasProp = false;
            for (var prop in str) {
                hasProp = true;
                break;
            }
            if (!hasProp) return true;
        }
        return false;
    },
	//签约步骤
	getCurrentStep(vm,linkUrl) {
		var id = _.getQueryValue('id');
		var url = window.location.href;
	    _._ajax(_.globalVar.domain + '/order/sign/step', 'get', '', function (res) {
			//0-3：完成采集信息填写  4：完成采集信息确认 5：完成风险测试
	        if (res && res.code === 200) {
				var num = parseInt(res.data.stepNum)
				switch(num){
					case 0:
					case 1:
					case 2:
					case 3:
						if(url.indexOf("completeInfo") == -1){
							window.location.href = _.globalVar.baseUrl +  "/completeInfo.html?id="+id
						}
						break; 
					case 4:
						if(url.indexOf("questionnaire") == -1){
							window.location.href = _.globalVar.baseUrl +  "/questionnaire.html?id="+id
						}
						break;
					case 5:
						//完成所有步骤
						if(linkUrl != ""){
							window.location.href = linkUrl
						}
						break;
				}
	        }else{
				vm.$dialog.alert({ title: "提示", message: res.msg });
			}
	    }, vm,null,null,false);
	},
	formatDate :function (time) {
		var date = new Date(time);
		var y = date.getFullYear();  
		var m = date.getMonth() + 1;  
		m = m < 10 ? '0' + m : m;  
		var d = date.getDate();  
		d = d < 10 ? ('0' + d) : d;  
		return y + '/' + m + '/' + d;  
	}
};

(function () {
    if (_.isIphoneX()) {
        var bodyEl = document.getElementsByTagName("body");
        _.addClass(bodyEl[0], "iphoneX");
    }
    //添加remove 方法
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function () {
            this.parentNode.removeChild(this);
        };
    }
    // 添加replaceAll方法
    String.prototype.replaceAll = function (v1, v2) {
        if (this) return this.replace(new RegExp(v1, "gm"), v2);
    };
})();

