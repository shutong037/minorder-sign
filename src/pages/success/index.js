import "./index.css";
import { _ } from "../common/public";
var vm = null;
(function () {
	initVue();

	function initVue() {
		vm = new Vue({
			el: '#app',
			data: {
				seconds: 2,
				checked: 0,
				name: '',
				stepNum: 8,
				stepVal: 8,
				globalData:{
					isMobile: true,
					openInType: 'android'
				},
				accessToken: _.getQueryValue('accessToken'),
			},
			created: function () {
				var that = this;
				if(this.accessToken != ''){
					_.setCookie('Access-Token', this.accessToken)
				}
				_.logKeystrokes('完成支付', '进入下载APP过渡页', function () {
					
				},this)
				
				var ua = navigator.userAgent;
				if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1 || ua.indexOf("iPod") > -1) {
					this.globalData.openInType = 'ios'
				}else{
					this.globalData.openInType = 'android'
				}
				
				this.getInfo()
			},
			methods: {
				getInfo : function () {
					var that = this;
					_._ajax(_.globalVar.domain + '/customer/info', 'get', '', function (res) {
					    if (res && res.code === 200) {
							that.name = res.data.cardInfoVO.cardName
					    } else {
					        that.$dialog.alert({title: "提示", message: res.msg});
					    }
					}, this,null,null,false);
				},
				openApp : function () {
					var that = this
					if (this.globalData.isMobile && this.globalData.openInType == "android") {
					  that.$toast.loading({mask: true, message: '打开中...', duration: 3000});
					  var timer = setTimeout(function () {
						that.goDownload()
						clearTimeout(timer)
					  }, 3000)
					}
					if (this.globalData.isMobile && this.globalData.openInType == "ios") {
					   window.location = ""
					   that.$toast.loading({mask: true, message: '打开中...', duration: 3000});
					  var timer = setTimeout(function () {
						that.goDownload()
						clearTimeout(timer)
					  }, 3000)
					}
				},
				goDownload: function () {
				    var u = navigator.userAgent;
					var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
					var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
					window.location.href = ''
					return false
				}
			},
			computed: {}

		});
	}

})();











