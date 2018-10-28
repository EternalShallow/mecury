let Mock = require('mockjs');
exports.before = (app) => {
	app.post('/api/stua', function(req, res) {
		// 获取 mock.Random 对象
		const Random = Mock.Random;
		// mock一组数据
		const produceNewsData = () => {
			let articles = [];
			for(let i = 0; i < 10; i++) {
				let newArticleObject = {
					title: Random.csentence(5, 30), //  Random.csentence( min, max )
					thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片') || "https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
					author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
					date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
				}
				articles.push(newArticleObject)
			}
			return articles;
		}
		let list = Mock.mock(produceNewsData)
		res.json(list);
	});

	app.post('/api/stub', function(req, res) {
		let list = [];
		for(let i = 0; i < 10; i++) {
			let str = {
				index: i,
				hello: 'Hello',
				description: "AAAABBBB测试赛是是是",
				time: new Date(),
				score: Math.random() * 100,
				order: [1, 2, 3, 4].map(i => i * i)
			}
			list.push(str)
		}
		res.json(list);
	});
}