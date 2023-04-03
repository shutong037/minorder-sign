import "./index.css";
import { _ } from "../common/public";
var vm = null;
var canvas = null;
var canvasTxt = null;
(function() {
	initVue();
	
	function initVue() {
		vm = new Vue({
			el: '#app',
			data: {
				id: _.getQueryValue('id'),
				sid: sessionStorage.getItem('sid'),
				uid: sessionStorage.getItem('uid'),
				totalTerm: null,
				signList: [],
				userName: '',
				tipName: '',
				nameNum:  0,
				commitStatus: true,
				subSignStatus: true,
				imgWidth: "28%",
				imgborder: true,
				dataSrc:{
					lattice: require('../../assets/img/lattice.png').default,
					yes: require('../../assets/img/yes.png').default,
					no: require('../../assets/img/no.png').default,
					C1: require('../../assets/img/C1.png').default,
					C2: require('../../assets/img/C2.png').default,
					C3: require('../../assets/img/C3.png').default,
					C4: require('../../assets/img/C4.png').default,
					tipImg: ""
				},
				protocolOne: undefined,
				protocolTwo: undefined,
				protocolThree: undefined,
				protocolFour: undefined,
				showProtocol: 0,
				result: undefined,
				goodInfo: null,
				showGrade: false,
				showContent: false,
				goodsRiskLevel: ["R1","R2","R3","R4","R5"], // 服务风险等级
				courseRiskLevel: ["R1-1","R2-1","R3-1","R4-1","R5-1"], // 课程服务风险等级
				incrementRiskLevel: ["R1-2","R2-2","R3-2","R4-2","R5-2"],// 增值服务风险等级
				gradeList: [
					{ grade: 'R1', title: '低风险', content: '结构简单，容易理解，流动性高，本金遭受损失的可能性极低。' },
					{ grade: 'R2', title: '中低风险', content: '结构简单，容易理解，流动性较高，本金遭受损失的可能性较低。' },
					{ grade: 'R3', title: '中等风险', content: '结构较复杂，流动性较高,本金安全具有一定的不确定性,特殊情况下可能损失全部本金。' },
					{ grade: 'R4', title: '中高风险', content: '结构复杂，流动性较低，本金安全面临较大的不确定性，可能损失全部本金。' },
					{ grade: 'R5', title: '高风险', content: '结构复杂，不易理解，不易估值、流动性低、透明度较低，本金安全面临极大的不确定性，甚至损失可能超过本金。' }
				],
				canvasStatus: true,
				canvasRect: null, 
				ctx: null,  // 画笔对象
				startX: 0,
				startY: 0,
				endX: 0,
				endY: 0,
				stepNum: 8,
				stepVal: 6
			},
			created: function() {
				var that = this
				_.logKeystrokes('电子签名页', '进入电子签名页', function () {
					_.getCurrentStep(that, "")
					that.getUserName()
					that.getGoodInfo()
					that.getResult()
				},this)
			},
			mounted() {
				var that = this;
				canvas = document.getElementById("can_vans");
				if(!canvas.getContext){
					this.$dialog.alert({title: "提示", message: "当前微信浏览器不支持，请更换手机或升级微信再试！"});
					return;
				}
				canvas.width = 297;
				canvas.height = 297;
				this.ctx = canvas.getContext("2d");// 设置2D渲染区域
				this.ctx.lineWidth = 5;// 设置线的宽度
				this.ctx.lineCap = "round";
				this.ctx.lineJoin = "round";
				this.canvasRect = canvas.getBoundingClientRect();
			},
			methods: {
				getUserName: function() {
					var that = this
					this.$toast.loading({ mask: true, message: "加载中...", duration: 0 });
					_._ajax(_.globalVar.domain + '/customer/info', 'get', '', function (res) {
					    that.$toast.clear();
					    if (res && res.code === 200) {
							that.userName = res.data.cardInfoVO.cardName
							that.name = that.userName.substr(0,1)
							that.setNameImg(that.name)
							that.tipName = "请输入您姓名中的 “ <span>"+that.userName.substr(0,1)+"</span> ” 字"
					    } else {
					        that.$dialog.alert({title: "提示", message: res.msg});
					    }
					}, this,null,null,false);
				},
				setNameImg: function(name) {
					var canvas = document.createElement("canvas");
						canvas.width = 297;
						canvas.height = 297;
					var context = canvas.getContext("2d");
					context.font = "240px Verdana";
					context.fillStyle = "#dadada";
					if(/([a-zA-Z]|\.|\·|\(|\))/.test(name)){
						context.fillText(name, 100, 236);
					}else{
						context.fillText(name, 30, 236);
					}
					this.dataSrc.tipImg = canvas.toDataURL('image/png', 1)
				},
				touchStart(ev) {
				  ev = ev || event
				  ev.preventDefault()
				  if(this.signList.length == this.userName.length){
					this.commitStatus = true
				  }else{
					this.commitStatus = false
				  }
				  this.startX = ev.targetTouches[0].clientX - this.canvasRect.left;
				  this.startY = ev.targetTouches[0].clientY - this.canvasRect.top;
				  this.endX = this.startX;
				  this.endY = this.startY;
				  this.draw();
				},
				touchMove(ev) {
				  ev = ev || event
				  ev.preventDefault()
				  this.endX = ev.targetTouches[0].clientX - this.canvasRect.left;
		          this.endY = ev.targetTouches[0].clientY - this.canvasRect.top;
		          this.draw()
		          this.startX = this.endX;
		          this.startY = this.endY;
				},
				touchEnd(ev) {
				  ev = ev || event
				  ev.preventDefault()
				  this.endX = ev.changedTouches[0].clientX - this.canvasRect.left;
				  this.endY = ev.changedTouches[0].clientY - this.canvasRect.top;
				},
				draw () {
					this.ctx.beginPath();
					this.ctx.moveTo(this.startX, this.startY);
					this.ctx.lineTo(this.endX, this.endY);
					this.ctx.strokeStyle = "#000000";
					this.ctx.stroke();
					this.ctx.closePath();
				},
				mouseDown(ev) {
					ev = ev || event
					ev.preventDefault()
					if(this.signList.length == this.userName.length){
						this.commitStatus = true
					}else{
						this.commitStatus = false
					}
					let obj = {
						x: ev.offsetX,
						y: ev.offsetY
					}
					this.startX = obj.x
					this.startY = obj.y
					canvasTxt.beginPath()
					canvasTxt.moveTo(this.startX, this.startY)
					canvasTxt.lineTo(obj.x, obj.y)
					canvasTxt.stroke()
					canvasTxt.closePath()
					this.isDown = true
				},
				mouseMove(ev) {
					ev = ev || event
					ev.preventDefault()
					if (this.isDown) {
						let obj = {
						  x: ev.offsetX,
						  y: ev.offsetY
						}
						this.moveY = obj.y
						this.moveX = obj.x
						canvasTxt.beginPath()
						canvasTxt.moveTo(this.startX, this.startY)
						canvasTxt.lineTo(obj.x, obj.y)
						canvasTxt.stroke()
						canvasTxt.closePath()
						this.startY = obj.y
						this.startX = obj.x
					}
				},
				mouseUp(ev) {
				    ev = ev || event
				    ev.preventDefault()
				    let obj = {
				       x: ev.offsetX,
				       y: ev.offsetY
				    }
				    canvasTxt.beginPath()
				    canvasTxt.moveTo(this.startX, this.startY)
				    canvasTxt.lineTo(obj.x, obj.y)
				    canvasTxt.stroke()
				    canvasTxt.closePath()
				    this.isDown = false
				},
				overwrite: function() {
					var canvas = document.getElementById("can_vans")
					var ctx = canvas.getContext("2d")
					ctx.clearRect(0, 0, canvas.width, canvas.height)
					this.commitStatus = true
				},
				commit: function() {
					this.nameNum ++
					if(this.userName.substr(this.nameNum,1) != ""){
						this.name = this.userName.substr(this.nameNum,1)
						this.setNameImg(this.name)
						this.tipName = "请输入您姓名中的 “ <span>"+this.userName.substr(this.nameNum,1)+"</span> ” 字"
					}else{
						this.tipName = ""
						this.name = ""
						this.setNameImg("")
						this.subSignStatus = false
					}
					var canvas = document.getElementById('can_vans')
					var ctx = canvas.getContext('2d')
					var oImg = new Image()
					ctx.drawImage(oImg, 0, 0)
					var  img = canvas.toDataURL('image/png',1)
					this.signList.push(canvas.toDataURL());
					this.overwrite()
				},
				delImg: function(index){
					if(index == this.signList.length - 1 && this.canvasStatus){
						this.signList = this.signList.splice(0,index)
						this.nameNum --
						this.name = this.userName.substr(this.nameNum,1)
						this.setNameImg(this.name)
						this.tipName = "请输入您姓名中的 “ <span>"+this.userName.substr(this.nameNum,1)+"</span> ” 字"
						this.subSignStatus = true
					}
				},
				subSign: function(){
					var that = this;
					_.logKeystrokes('电子签名页', '点击了确认提交', function () {
						if(that.signList.length != that.userName.length){
							that.$dialog.alert({title: "提示", message: "当前签名与当前客户不匹配，请完成签名！"});
						}else{
							that.$dialog.confirm({
							  title: "",
							  messageAlign:"left",
							  message: '请确认您的电子签名书写清晰正确，若签名模糊或与您姓名不符，则会导致签约失效。',
							  confirmButtonText: "确定",
							  cancelButtonText:"取消",
							  className:"sign-txt",
							})
							  .then(() => {
								that.imgborder = false
								_.logKeystrokes('电子签名页', '点击了确认', function () {
									that.$toast.loading({mask: true, message: "提交中...", duration: 0});
									_._ajax(_.globalVar.domain +that.id, 'get', '', function (res) {
										that.$toast.clear();
										if (res && res.code === 200) {
											if(res.data.flag){
												that.splicingImages()
											}else{
												var odId = res.data.odId;
												if(odId != null){
													that.subSignStatus = true
													that.canvasStatus = false
													window.location.href = _.globalVar.baseUrl +  '/orderDetail.html?id=' + that.id+'&orderId='+odId;
												}
											}
										} else {
											that.$dialog.alert({ title: "提示", message: res.msg});
										}
									}, that);
								}, that);
								
							  })
							  .catch(() => {
								
							  });
						}
					},this)
					
				},
				splicingImages: function(){
					var canvas = document.createElement("canvas");
						canvas.width = this.signList.length * 74;
						canvas.height = 150;
					var context = canvas.getContext("2d");
					var  x = 6;
					this.signList.forEach((item, index) => {
						var width = 74
						var img = new Image();
							img.src = item;
						context.drawImage(img, x, 20, width, 100)
						x += width
					})
					this.clearblankimg(canvas.toDataURL('image/png', 1))
				},
				clearblankimg: function(imgData){
					var that = this,
						img = new Image();
					img.src = imgData;
					img.onload = function() {
						var a = document.createElement("canvas"),
							b = a.getContext("2d");
						a.width = img.width;
						a.height = img.height;
						b.drawImage(img, 0, 0);
						var f = b.getImageData(0, 0, a.width, a.height).data;
						b = a.width;
						for (var g = 0, c = a.height, h = 0, d = 0; d < a.width; d++) for (var e = 0; e < a.height; e++) {
							var k = 4 * (d + a.width * e);
							if (255 == f[k] || 255 == f[k + 1] || 255 == f[k + 2] || 255 == f[k + 3]) h = Math.max(e, h), g = Math.max(d, g), c = Math.min(e, c), b = Math.min(d, b)
						}
						b++;
						g++;
						c++;
						h++;
						a = document.createElement("canvas");
						a.width = g - b;
						a.height = h - c;
						a.getContext("2d").drawImage(img, b - 5, c - 5, a.width + 10, a.height + 10, 0, 0, a.width, a.height);
						that.baseToBlob(a.toDataURL())
					};
				},
				// base64转blob
				baseToBlob: function (base64Data) {
					var arr = base64Data.split(','),
						fileType = this.signList[0].match(/:(.*?);/)[1],
						bstr = atob(arr[1]),
						l = bstr.length,
						u8Arr = new Uint8Array(l);
					while (l--) {
						u8Arr[l] = bstr.charCodeAt(l);
					}
					this.blobToFile(new Blob([u8Arr], {
						type: fileType
					}), 'img')
				},
				blobToFile: function (newBlob, fileName, key) {
					newBlob.lastModifiedDate = new Date();
					newBlob.name = fileName;
					this.getOdId(newBlob)
				},
				getOdId: function(file){
					var that = this;
					var formData = new FormData();
					formData.append("file", file);
					formData.append("goodsId", this.id.substring(0,4));
					formData.set("enctype", "multipart/form-data");
					this.$toast.loading({mask: true, message: "提交中...", duration: 0});
					_._ajax(_.globalVar.domain + '', 'post', formData, function (res) {
						if (res && res.code === 200) {
							that.addOrder(res.data)
						} else {
							that.$dialog.alert({title: "提示", message: res.msg});
						}
					}, this, null,30000,false)
				},
				addOrder: function (odId){
					var that = this;
					var data = {
						odCouponIds: [],
						odProdCount: 1,
						odContractVersion: 2,
						odProdNum: this.id,
						odId: odId,
						exchangeNum: null,
					}

					if(this.sid != null && this.uid != null){
						data.odExtn = "{sid: "+this.sid+", uid: "+this.uid+"}"
					}
					
					_._ajax(_.globalVar.domain + '', 'post', JSON.stringify(data), function (res) {
						that.$toast.clear()
						if (res && res.code === 200) {
							that.subSignStatus = true
							that.canvasStatus = false
							_.logKeystrokes('电子签名', '下一步', function () {
								window.location.href = _.globalVar.baseUrl +  "/orderDetail.html?id=" + that.id + '&orderId=' + res.data.odId
							},that)
						} else {
							that.$dialog.alert({title: "提示", message: res.msg});
						}
					}, this, null, null, true)
				},
				getProtocol: function () {
					var that = this;
					this.$toast.loading({ mask: true, message: '加载中...', duration: 0 });
					_._ajax(_.globalVar.domain + '', 'post', JSON.stringify({
						saTypes: '101,102,103',
						totalTerm: that.totalTerm,
						productNum: that.id
					}), function (res) {
						that.$toast.clear();
						if (res && res.code === 200) {
							// 风险揭示书  101  服务项目说明书  102  投顾合同 103
							res.rows.forEach(function (item) {
								if (item.saType === 103) {
									that.protocolOne = item.saContent
								}else if (item.saType === 101) {
									that.protocolThree = item.saContent
								} else if (item.saType === 102) {
									that.protocolFour = item.saContent
								}
							})
						} else {
							that.$dialog.alert({ title: '提示', message: res.msg });
						}
					}, this, null, null, true);
				},
				toggleProtocol: function (e) {
					this.showProtocol = this.showProtocol === e ? 0 : e
				},
				getResult: function () {
				   var that = this;
				   this.$toast.loading({ mask: true, message: "加载中...", duration: 0 });
				   _._ajax(_.globalVar.domain + '', 'get', '', function (res) {
					   that.$toast.clear();
					   if (res && res.code === 200) {
						   var cusTypeName = "";
						   if(res.data.riskLevelCode == "C1"){
							 cusTypeName = "保守型";
						   }else if(res.data.riskLevelCode == "C2"){
							cusTypeName = "谨慎性";
						   }else if(res.data.riskLevelCode == "C3"){
							cusTypeName = "稳健性";
						   }else if(res.data.riskLevelCode == "C4"){
							cusTypeName = "积极型";
						   }else if(res.data.riskLevelCode == "C5"){
							cusTypeName = "激进型";
						   }
						   res.data.cusTypeName = cusTypeName
						   that.result = res.data
					   } else {
						   that.$dialog.alert({ title: "提示", message: res.msg });
					   }
				   }, this);
				},
				getGoodInfo: function () {
					var that = this
					var goodsId = this.id.substring(0,4)
					_._ajax(_.globalVar.domain + '', 'post', JSON.stringify({
							goodsId: goodsId,
						}), function (res) {
							that.$toast.clear();
							if (res && res.code === 200) {
								var detail = res.data.detail
								detail.goodsRiskLevelName = that.goodsRiskLevel[detail.goodsRiskLevel - 1]
								detail.courseRiskLevelName = that.courseRiskLevel[detail.courseRiskLevel - 1]
								detail.incrementRiskLevelName = that.incrementRiskLevel[detail.incrementRiskLevel - 1]
								that.goodInfo = detail
								
								var data = res.data.cycle
								data.find(function(item){
									if(item.saleId == that.id){
										that.totalTerm =  item.goodsCycle
									}
								})
								that.getProtocol()
								
							} else {
								that.$dialog.alert({ title: "提示", message: res.msg });
							}
					}, this,null,null,true);
				},
				toggleGrade: function () {
					this.showGrade = !this.showGrade;
				},
				toggleContent: function () {
					this.showContent = !this.showContent;
				}
			},
			computed: {}

		});
	}


})();
