import "./index.css";
import { _ } from "../common/public";
import { areaList } from '@vant/area-data';

var vm = null;
(function () {
    initVue();
    function initVue() {
        vm = new Vue({
            el: '#app',
            data: {
				stepNum: 8,
				stepVal: 2,
                info: {
					cardName: '',
					extraInvestor: '本人',
					extraBeneficiary: '本人',
					cardNum: '',
					sex: '',
					cardBirth: '',
					cardEndDate: '',
					cardCountry: ''
				},
                company: '',//工作单位
                position: '',//职务
                record: 0,
                checked: false,
                selectItem: '',
                eduSelect: false,
                proSelect: false,
                recordSelect: false,
                eduRadio: 0,
                proRadio: 0,
                recordRadio: 0,
                educationBackground: undefined,//学历
                profession: undefined,//职业
                otherProfession: undefined,//其他职业
                recordItem: undefined,
                other: '',
                otherRecord: '7',
                otherPro: '11',
                areaList: [],
                searchResult: [],
                addressList: areaList, //区域列表
                showProvinceCode: false,
                addressCode: '',
                addressName: '请选择省市区',
                email: '',
                addressDetail: '',
                id: _.getQueryValue('id'),
				params : {},
				areaVal: '',
				extraOccupationTip: false,
				extraCompanyNameTip: false,
				extraPostTip: false,
				extraEducationTip: false,
				extraEmailTip: false,
				extraCityTip: false,
				extraAddressTip: false,
				extraCreditRemarkTip: false,
				extraSelect: false,
				extraArr:[{optName: "请选择", optValue: "0"},{optName: "本人", optValue: "1"},{optName: "其他", optValue: "2"}],
			    extRadio: 1,
				otherExtra: '',
				incomeSelect: false,
				otherType: null,
				extOtherInfo: false,
				setEndDate: '',
				upEndDate: false,
				minDate: new Date(2023, 3, 1),
				maxDate: new Date(2300, 11, 31),
				nameTip : false,
				extraInvestorTip: false,
				extraBeneficiaryTip: false,
				cardNumTip: false,
				sexTip: false,
				birthDataTip: false,
				endDataTip: false,
				nationalityTip: false
            },
            created: function () {
				var that = this
				if(this.status != "0"){
					_.getCurrentStep(this,"");
				}
				
				_.logKeystrokes('实名认证确认', '进入信息采集页', function () {
					that.getList()
					that.getInfo()
				},this)
            },
            methods: {
				formatter2(value) {
					return value.replace(/\w/g, '');
				},
				formatter(type, val) {
				  if (type === 'year') {
					return val + '年';
				  }
				  if (type === 'month') {
					return val + '月';
				  }
				  if (type === 'day') {
					return val + '日';
				  }
				  return val;
				},
                getList: function () {
                    var that = this;
                    this.$toast.loading({message: '加载中...', duration: 0, mask: true});
					//职业
					_._ajax(_.globalVar.domain + '/customer/common/dictionary/extra_occupation', 'get', '', function (res) {
					    that.$toast.clear();
					    if (res && res.code === 200) {
							that.profession = [{optName: '请选择',optValue:'0'}].concat(res.data.options)
					    } else {
					        that.$dialog.alert({title: "提示", message: res.msg});
					    }
					}, this);

					//学历
					this.$toast.loading({message: '加载中...', duration: 0, mask: true});
					_._ajax(_.globalVar.domain + '/customer/common/dictionary/extra_education', 'get', '', function (res) {
					    that.$toast.clear();
					    if (res && res.code === 200) {
							that.educationBackground = [{optName: '请选择',optValue:'0'}].concat(res.data.options)
					    } else {
					        that.$dialog.alert({title: "提示", message: res.msg});
					    }
					}, this);

					//征信
					this.$toast.loading({message: '加载中...', duration: 0, mask: true});
					_._ajax(_.globalVar.domain + '/customer/common/dictionary/extra_credit', 'get', '', function (res) {
					    that.$toast.clear();
					    if (res && res.code === 200) {
							that.recordItem = [{optName: '请选择',optValue:'0'},{optName: '无不良诚信记录',optValue:'-1'}].concat(res.data.options)
					    } else {
					        that.$dialog.alert({title: "提示", message: res.msg});
					    }
					}, this);

                },
				 getInfo: function () {
					var that = this;
					this.$toast.loading({message: '加载中...', duration: 0, mask: true});
					_._ajax(_.globalVar.domain + '', 'get', '', function (res) {
						that.$toast.clear();
						if (res && res.code === 200) {
							that.info = {
								cardName: res.data.cardInfoVO.cardName,
								extraInvestor: res.data.extraInfoVO.extraInvestor,
								extraBeneficiary: res.data.extraInfoVO.extraBeneficiary,
								cardNum: res.data.cardInfoVO.cardNum,
								cardBirth: res.data.cardInfoVO.cardBirth,
								cardEndDate:res.data.cardInfoVO.cardEndDate,
								cardCountry: res.data.cardInfoVO.cardCountry	
							}
							if(res.data.cardInfoVO.cardSex == '1'){
								that.info.sex = '男'
							}else if(res.data.cardInfoVO.cardSex == '2'){
								that.info.sex = '女'
							}else{
								that.info.sex = '' 
							}
							
							that.params = {
								extraAddress: res.data.extraInfoVO.extraAddress,
								extraArea: res.data.extraInfoVO.extraArea,
								extraAreaId: null,
								extraBeneficiary: res.data.extraInfoVO.extraBeneficiary,
								extraCity: res.data.extraInfoVO.extraCity,
								extraCityId:null,
								extraCompanyName: res.data.extraInfoVO.extraCompanyName,
								extraCredit: res.data.extraInfoVO.extraCredit,
								extraCreditName: res.data.extraInfoVO.extraCreditName,
								extraCreditRemark: res.data.extraInfoVO.extraCreditRemark,
								extraEducation: res.data.extraInfoVO.extraEducation,
								extraEducationId: null,
								extraEmail: res.data.extraInfoVO.extraEmail,
								extraInvestor: res.data.extraInfoVO.extraInvestor,
								extraOccupation: res.data.extraInfoVO.extraOccupation,
								extraOccupationId: null,
								extraPost: res.data.extraInfoVO.extraPost,
								extraProvince: res.data.extraInfoVO.extraProvince,
								extraProvinceId: null
							};
							
							if(that.params.extraOccupation && that.params.extraCompanyName && that.params.extraPost && that.params.extraEducation && that.params.extraProvince && that.params.extraCity &&  that.params.extraArea && that.params.extraCreditName){
								that.status = '0'
							}
							
							if(that.params.extraOccupation == null && that.params.extraCompanyName == null && that.params.extraEducation == null
								&& that.params.extraEmail == null &&   that.params.extraProvince == null &&  that.params.extraCity == null &&  
								that.params.extraArea == null &&  that.params.extraAddress == null){
								that.alreadyStatus = 0
							}else{
								that.alreadyStatus = 1
							}
							that.setData()
						} else {
							that.$dialog.alert({title: "提示", message: res.msg});
						}
					}, this,null,null,false);
				},
                setData: function (){
					if(this.profession && this.educationBackground && this.recordItem){
						if(this.params.extraOccupation){
							this.profession.map((item,index) => {
								if(item.optName == this.params.extraOccupation){
									this.params.extraOccupationId = item.optValue
									this.proRadio = index
								}
							})
						}

						if(this.params.extraEducation){
							this.educationBackground.map((item, index) => {
								if (item.optName == this.params.extraEducation) {
									this.params.extraEducationId = item.optValue
									this.eduRadio = index
								}
							})
						}


						if(this.params.extraProvince){
							this.addressName = this.params.extraProvince
							for(var item in this.addressList.province_list){
								if(this.addressList.province_list[item] == this.params.extraProvince){
									this.params.extraProvinceId = item
									break;
								}
							}
						}

						if(this.params.extraCity){
							this.addressName += " "+this.params.extraCity
							for(var item in this.addressList.city_list){
								if(this.addressList.city_list[item] == this.params.extraCity){
									this.params.extraCityId = item
									break;
								}
							}
						}

						if(this.params.extraArea){
							this.addressName += " "+this.params.extraArea
							for(var item in this.addressList.county_list){
								if(this.addressList.county_list[item] == this.params.extraArea){
									this.params.extraAreaId = item
									this.areaVal = item
									break;
								}
							}
						}

						if(this.params.extraCredit == "1"){
							this.recordItem.map((item,index) => {
								if(item.optName == this.params.extraCreditName){
									this.recordRadio = parseInt(item.optValue)
									if(item.optName == "其他"){
										this.other = this.params.extraCreditRemark
									}
								}
							})
						}
					}else{
						var that = this
						setTimeout(function () {
							that.setData()
						}, 50);
					}
			    },
                saveInfo: function () {
                    var that = this;
					var reg = /^.+@.+\.([a-zA-Z]{2,4})$/;
					 this.params.cardName = this.info.cardName && this.info.cardName.trim();
					 this.params.extraInvestor = this.info.extraInvestor && this.info.extraInvestor.trim();
					 this.params.extraBeneficiary = this.info.extraBeneficiary && this.info.extraBeneficiary.trim();
					 this.params.cardNum = this.info.cardNum && this.info.cardNum.trim();
					 this.info.sex = this.info.sex && this.info.sex.trim();
					 if(this.info.sex == '男'){
						  this.params.cardSex = '1'
					 }else if(this.info.sex == '女'){
						  this.params.cardSex = '2'
					 }else{
						this.params.cardSex = '' 
					 }
					 this.params.cardBirth = this.info.cardBirth && this.info.cardBirth.trim();
					 this.params.cardEndDate = this.info.cardEndDate == '长期' ? '9999/12/31' : this.info.cardEndDate;
					 this.params.cardCountry = this.info.cardCountry && this.info.cardCountry.trim();
					 this.params.extraCompanyName = this.params.extraCompanyName && this.params.extraCompanyName.trim();
					 this.params.extraPost = this.params.extraPost && this.params.extraPost.trim();
					 this.params.extraEmail = this.params.extraEmail && this.params.extraEmail.trim();
					 this.params.extraAddress = this.params.extraAddress && this.params.extraAddress.trim();
		
					if(!this.params.cardName){
						this.nameTip = true
					}
					if(!this.params.extraInvestor){
						this.extraInvestorTip = true
					}
					if(!this.params.extraBeneficiary){
						this.extraBeneficiaryTip = true
					}
					if(!this.params.cardNum){
						this.cardNumTip = true
					}
					if(!this.params.cardSex){
						this.sexTip = true
					}
					if(!this.params.cardBirth){
						this.birthDataTip = true
					}
					if(!this.params.cardEndDate){
						this.endDataTip = true
					}
					if(!this.params.cardCountry){
						this.nationalityTip = true
					}
					
					if(!this.params.extraOccupation){
						this.extraOccupationTip = true
					}
					if(!this.params.extraCompanyName){
						this.extraCompanyNameTip = true
					}
					if(!this.params.extraPost){
						this.extraPostTip = true
					}
					if(!this.params.extraEducation){
						this.extraEducationTip = true
					}
					// if(this.params.extraEmail == ""){
					// 	return this.$toast({title: "提示", message: '请填写电子邮箱！'});
					// }
					// if(!reg.test(this.params.extraEmail)){
					// 	return this.$toast({title: "提示", message: '邮箱格式错误！'});
					// }
					if(!this.params.extraProvince ||  !this.params.extraCity || !this.params.extraArea){
						this.extraCityTip = true
					}
					if(!this.params.extraAddress){
						this.extraAddressTip = true
					}
					
					if(!this.params.extraCreditName){
						this.extraCreditRemarkTip = true
					}
					
					if(this.nameTip || this.extraInvestorTip || this.extraBeneficiaryTip || this.cardNumTip || this.sexTip || this.birthDataTip || this.endDataTip ||   this.nationalityTip ||  this.extraOccupationTip || this.extraCompanyNameTip || this.extraPostTip || this.extraEducationTip || this.extraCityTip || this.extraAddressTip || this.extraCreditRemarkTip){
						return this.$toast({title: "提示", message: '请完善未填写信息！'});
					}
					
					if(this.params.extraCreditName == "其他"){
						this.params.extraCreditRemark = this.other
					}else{
						this.params.extraCreditRemark = ''
					}
					
					if(this.params.extraCreditName == "无不良诚信记录"){
						this.params.extraCredit = 0
					}else{
						this.params.extraCredit = 1
					}
                    this.$toast.loading({message: '加载中...', duration: 0, mask: true});
					this.checked = false;
					_.logKeystrokes('完善个人信息', '提交了信息采集信息', function () {
						_._ajax(_.globalVar.domain + '', 'post', JSON.stringify(that.params), function (res) {
							if (res && res.code === 200) {
								_._ajax(_.globalVar.domain + '', 'get', '', function (r) {
									that.$toast.clear();
									if (r && r.code === 200) {
										var num =  parseInt(r.data.stepNum)
										if(num== 5){
											window.location.href = _.globalVar.baseUrl +  '/ensureRisk.html?id=' + that.id
										}else{
											window.location.href = _.globalVar.baseUrl +  '/evaluate.html?id=' + that.id
										}
									}else {
										that.$dialog.alert({title: "提示", message: r.msg});
									}
								}, that,null,null,false);
							} else {
								that.$toast.clear();
								that.$dialog.alert({title: "提示", message: res.msg});
							}
						}, that,null,null,true);
					},that)
                },
                changeSincerity: function (e) {
				   this.params.extraCredit = e
				   this.extraCreditRemarkTip = false
                   this.recordSelect = true;
                },
                selectAddressCode: function (list) {
                    var codes = "";
                    var names = "";
                    list.forEach(function (item) {
                        if (item) {
                            codes += " " + item.code;
                            names += " " + item.name;
                        }
                    });
					this.params.extraProvince = list[0].name
					this.params.extraProvinceId = list[0].code
					this.params.extraCity = list[1].name
					this.params.extraCityId	 = list[1].code
					this.params.extraArea = list[2].name
					this.params.extraAreaId	 = list[2].code
                    this.addressCode = codes.trim();
                    this.addressName = names.trim();
                    this.showProvinceCode = false;
                },
				addOtherInfo : function (num) {
					this.extraSelect = true;
					this.otherExtra = '';
					this.otherType = num;
				},
				selectExtraRadio: function (key) {
					if (key === 0) return
					if(key == 1){
						if(this.otherType == 1){
							this.info.extraInvestor =  '本人'
						}else if(this.otherType == 2){
							this.info.extraBeneficiary =  '本人'
						}
						this.extraSelect = false
					}
					
					if(key == 2){
						this.otherExtra = '';
						this.extraSelect = false
						this.extOtherInfo = true
					}
				},
				extClose : function () {
					this.otherExtra = '';
					this.extOtherInfo = false
				},
				extConfirm : function () {
					if(this.otherExtra.trim() == ""){
						if(this.otherType == 1){
							this.$toast({title: "提示", message: '请输入实际控制投资自然人！'});
						}else{
							this.$toast({title: "提示", message: '请输入交易实际收益人！'});
						}
					}else{
						if(this.otherType == 1){
							this.info.extraInvestor = this.otherExtra
						}else{
							this.info.extraBeneficiary = this.otherExtra
						}
						this.otherExtra = '';
						this.extOtherInfo = false
					}
				},
                selectRadio: function (type, key) {
					if (key === 0) return
					if(type === 1){
						this.eduRadio = key
						this.params.extraEducation = this.educationBackground[key].optName
						this.params.extraEducationId = this.educationBackground[key].optValue
						this.eduSelect = false
					} else if(type === 2){
						this.proRadio = key
						this.params.extraOccupation = this.profession[key].optName
						this.params.extraOccupationId = this.profession[key].optValue
						if(this.params.extraOccupationId == 10){
							this.params.extraCompanyName = "无"
							this.params.extraPost = "无"
						}
						this.proSelect = false
					}else if(type === 3){
						 this.recordRadio = key
						 this.params.extraCreditName = this.recordItem[key].optName
						 if (this.recordItem[key].optValue != this.otherRecord) {
							 this.recordSelect = false
						 }
					}else if(type === 4){
						if (this.other.trim() == "") return this.$toast({title: "提示", message: '请输入不良诚信记录的具体内容！'}); 
						 this.recordSelect = false
					}else if(type === 5){
						this.proSelect = false
					}
                },
				setCard: function () {
					if(this.info.cardNum.length >= 17){
						if (parseInt(this.info.cardNum.substr(16, 1)) % 2 == 1) {
							this.info.sex = '男'
						} else {
							this.info.sex = '女'
						}
						this.sexTip = false
					}else if(this.info.cardNum.length < 17){
						this.info.sex = ''
					}
					
					if(this.info.cardNum.length >= 14){
						this.info.cardBirth = this.info.cardNum.substring(6, 10) + "/" + this.info.cardNum.substring(10, 12) + "/" + this.info.cardNum.substring(12, 14);
						this.birthDataTip = false
					}else if(this.info.cardNum.length < 14){
						this.info.cardBirth = ''
					}
					
					var sfz = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ //身份证
					var tbz = /^[a-zA-Z0-9]{5,21}$/ //港澳台通行证
					if(this.info.cardNum.length > 0){
						if(tbz.test(this.info.cardNum)){
							if(this.info.cardNum.substr(0,1).toUpperCase() == 'M'){
								this.info.cardCountry = '澳门'
							}else if(this.info.cardNum.substr(0,1).toUpperCase() == 'H'){
								this.info.cardCountry = '香港'
							}
						}
						if (sfz.test(this.info.cardNum)) {
							this.info.cardCountry = '中国'
						}
						this.nationalityTip = false
					}else{
						this.info.cardCountry = ''	
					}
					
				},
				setUserDate: function (num) {
					if(num == 1){
						if(this.setEndDate <= new Date()){
							this.$toast({title: "提示", message: '证件到期日期不能小于现在日期！'}); 
						}else{
							this.info.cardEndDate = _.formatDate(this.setEndDate)
							this.upEndDate = false
						}
					}else if(num == 2){
						this.info.cardEndDate = '长期'
						this.upEndDate = false
					}
				}
            },
            computed: {}

        });
    }

})();


