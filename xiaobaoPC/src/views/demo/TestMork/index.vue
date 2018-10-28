<template>
	<div>
		模拟模拟数据
	</div>
</template>
<script>
	/*require('./mock.js')
				import axios from 'axios';

				fetch('/Ainews/indexw').then(data => {
					console.log(data)
				}).catch(e => console.log("错误信息：", e))

				//方式2
				axios.post('/news/index', 'type=top&key=123456').then(res => {
					console.log(res.data.articles);
				});*/

	//post
	/*fetch('/mock/userInfo', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: "POST",
		body: JSON.stringify({
			a: 1,
			b: 2
		})
	}).then(response => {
		return response.json();
	}).then(res => {
		console.clear();
		res.map(v=>{
			console.log(v.description)
		})
	});*/
/*	let aaa = require('@/mock/js/mock.js');
	console.log(aaa)*/
	
	fetch('/api/stua', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: "POST",
		body: JSON.stringify({
			a: 1,
			b: 2
		})
	}).then(response => {
		return response.json();
	}).then(res => {
		res.map(v=>{
			console.log(v)
		})
	});
	/*fetch('/api/stub', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: "POST",
		body: JSON.stringify({
			a: 1,
			b: 2
		})
	}).then(response => {
		return response.json();
	}).then(res => {
		res.map(v=>{
			console.log(v.description)
		})
	});*/
	
	
</script>