import "./index.css";
import { _ } from "../common/public";

var vm = null;
var interval = undefined;
(function () {
    initVue();
    function initVue () {
        vm = new Vue({
            el: '#app',
            data: {
				stepNum: 8,
				stepVal: 1,
                id: _.getQueryValue('id'),
                sid: _.getQueryValue('sid'),
                uid: _.getQueryValue('uid'),
				proCombatB: [],
				goodsStatus: 1,
				goodsId: '',
				goodsName: '',
            },
            created: function () {
				if(this.id){
					this.goodsId = this.id.substring(0,4)
					this.goodInfo()
				}else{
					this.$dialog.alert({ title: "提示", message: "当前访问的商品不存在。" });
				}
				
				if(this.sid != ""){
					sessionStorage.setItem('sid', this.sid)
				}else{
					sessionStorage.removeItem('sid')
				}
				
				if(this.uid != ""){
					sessionStorage.setItem('uid', this.uid)
				}else{
					sessionStorage.removeItem('uid')
				}
				
			},
            methods: {
				goodInfo: function () {
					var that = this
					_._ajax(_.globalVar.domain + '', 'post', JSON.stringify({
							goodsId: this.goodsId,
						}), function (res) {
							that.$toast.clear();
							if (res && res.code === 200) {
								var detail = res.data.detail
								if(detail != null){
									document.title = detail.goodsName;
									that.goodsName = detail.goodsName;
									var imgs = detail.detailImgUrl.split(",");
									 imgs.forEach((item,index) => {
										imgs[index] = "/api/product/common/file?filePath="+ encodeURI(item)
									 })
									that.proCombatB = imgs
									var goodsInfo = res.data.cycle
									goodsInfo.find((item) => {
										if(item.cycleId == that.id){
											that.goodsStatus = item.status
											return
										}
									})
									setTimeout(function() {
										that.judgeId()
									},2000)
								}
							} else {
								that.$dialog.alert({ title: "提示", message: res.msg });
							}
					}, this,null,null,true);
				},
				judgeId: function () {
					if(this.goodsStatus == 2){
						this.$dialog.alert({ title: "提示", message: "当前访问的商品已过期。" });
					}else{
						var url = _.globalVar.baseUrl +  "/personalInfo.html?id=" + this.id 
						var that = this
						_.logKeystrokes(this.goodsName, '去购买', function () {
							_.getCurrentStep(that,url);
						},this)
					}
				}
            },
            computed: {}
        });
    }
})
();
