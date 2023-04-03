import "../common/reset.css";
import "./index.css";
import "@/assets/vant.css";
import "@/assets/vant.css";
import { _ } from "../common/public";

var vm = null;
var interval = undefined;
(function () {
    initVue();
    function initVue () {
        vm = new Vue({
            el: '#app',
            data: {
                code: _.getQueryValue('code'),
				showVerify: false,
				wxKey: '',
				phone: '',
				verificationCode: '',
				lastNum: 0,
				dataSrc:{
					empty: require('../../assets/img/empty.jpg').default
				},
				wechatV: ''
            },
            created: function () {
				if(navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)){
					this.wechatV = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)[1]
				}
				var defaultUrl = _.getCookie("defaultUrl");
				var showT = this.compareVersion(this.wechatV,"8.0.31")
				if(defaultUrl == "" && showT != -1){
					//微信版本 8.0.31 以上会提示完整服务。
					this.$dialog.alert({ title: "提示",  message: "请点击右下方的按钮 “使用完整服务”；\n 如未出现按钮，请下载图片并使用个人微信扫码。", showConfirmButton: false, overlay: false});
				}else{
					this.getToken()
				}
            },
			methods:{
				getToken: function(){
					var that  = this
					var url = decodeURIComponent(_.getQueryValue('oldUrl'));
					_._ajax(_.globalVar.domain + '?code='+ this.code, 'get', '', function (res) {
					    if (res && res.code === 200) {
							if (res.data.token) {
							   _.setCookie('Access-Token', res.data.token)
							   _.logKeystrokes('授权页面', '点击了微信登录', function () {
									_.getCurrentStep(that,url);
							   },that)
							} else {
								that.wxKey = res.data.wxKey
								that.showVerify = true
							}
						} else {
							that.$dialog.alert({ title: "提示", message: res.msg });
						}
					}, this, true, null, false);
				},
				compareVersion: function(v1, v2) {
				  var cpResult;
				  var i = 0;
				  var arr1 = v1.replace(/[^0-9.]/, '').split('.');
				  var arr2 = v2.replace(/[^0-9.]/, '').split('.');
				  while (true) {
					var s1 = arr1[i];
					var s2 = arr2[i++];
					if (s1 === undefined || s2 === undefined) {
					  cpResult = arr1.length - arr2.length;
					  break;
					}
					if (s1 === s2) continue;
					cpResult = s1 - s2;
					break;
				  }
				  return cpResult > 0 ? 1 : cpResult === 0 ? 0 : -1;
				},
				getValidCode: function  (){
					this.$refs.inputVeri.blur()
					this.$refs.inputPhone.blur()
					if (this.lastNum > 0) return;
					var phone = _.trim(this.phone);
					var expreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
					if (!phone || !expreg.test(phone)) return this.$dialog.alert({ title: "提示", message: '手机号码不能为空!' });
					if (!_.regTel(phone)) return this.$dialog.alert({ title: "提示", message: '手机号格式不正确!' });
					this.lastNum = 60;
					var that = this;
					interval = setInterval(function () {
						that.lastNum--
						if (that.lastNum === 0) clearInterval(interval)
					}, 1000)
					if (typeof (Storage) !== "undefined") {
						var obj = { 'lastNum': that.lastNum, 'time': (new Date()).getTime() }
						//存倒计时时间
						sessionStorage.setItem(phone, JSON.stringify(obj));
					}
					this.sendCode(phone);
				},
				sendCode: function (phone){
					var that = this;
					this.$toast.loading({ message: '正在发送...', duration: 0, mask: true });
					_._ajax(_.globalVar.domain + '', 'post', JSON.stringify({
						'phone': phone,
					}), function (res) {
						that.$toast.clear();
						if (res && res.code === 200) {
							that.$dialog.alert({ title: "提示", message: "验证码已发送至手机,请注意查收!" });
						} else {
							that.$dialog.alert({ title: "提示", message: res.msg });
						}
					}, null, true, null, false);
				},
				toggleVerify: function (){
					this.showVerify = false
				},
				sureCode: function  (){
					if (!this.phone) return this.$dialog.alert({ title: "提示", message: '手机号码不能为空!' });
					if (!_.regTel(this.phone)) return this.$dialog.alert({ title: "提示", message: '手机号格式不正确!' });
					if (!this.verificationCode) return this.$dialog.alert({ title: "提示", message: '验证码不能为空!' });
					var that = this;
					this.$toast.loading({ mask: true, message: "加载中...", duration: 0 });
					_._ajax(_.globalVar.domain + '', 'put', JSON.stringify({
						acChannel: 1,
						acTerminalType: 4,
						phone: this.phone,
						verifyCode: this.verificationCode,
						wxKey: this.wxKey
					}), function (res) {
						that.$toast.clear();
						if (res && res.code === 200) {
							that.$dialog.alert({ title: "提示", message: "验证成功!" });
							that.showVerify = false;
							 _.setCookie('Access-Token', res.data.token)
							_.logKeystrokes('授权页面', '点击了手机号登录', function () {
								var url = _.getCookie("defaultUrl");
								 _.getCurrentStep(that,url);
							},that)
						} else {
							that.$dialog.alert({ title: "提示", message: res.msg });
						}
					},this,null,null,true);
				}
			},
			watch: {
				phone: function (val) {
					if (val.length === 11 && sessionStorage) {
						var obj = sessionStorage.getItem(val);
						if (obj) {
							obj = JSON.parse(obj)
							var lastNum = obj.lastNum + Math.round((obj.time - new Date().getTime()) / 1000)
							if (lastNum > 0) {
								this.lastNum = lastNum
							} else {
								sessionStorage.removeItem(val)
							}
						}
					}
				}
			},
        })
    }
})
();
