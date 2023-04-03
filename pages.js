// 多页配置 ( header footer  about 页面不能删除！！！)
module.exports = {
    // 商品详情
    index: {
        js: "./src/pages/index",
        html: "./src/pages/index/index.html",
        out: "index.html"
    },
	//完善资料
	completeInfo:{
		js: "./src/pages/completeInfo",
		html: "./src/pages/completeInfo/index.html",
		out: "completeInfo.html"
	},
	//签字
	sign:{
		js: "./src/pages/sign",
		html: "./src/pages/sign/index.html",
		out: "sign.html"
	},
	// 完成支付
	success: {
		js: "./src/pages/success",
		html: "./src/pages/success/index.html",
		out: "success.html"
	}
};
