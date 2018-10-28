<template>
	<div>
		<div class="demo-upload-list" v-for="item in uploadList">
			<template v-if="item.status === 'finished'">
				<img :src="item.url">
				<div class="demo-upload-list-cover">
					<Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
					<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
				</div>
			</template>
			<template v-else>
				<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
			</template>
		</div>
		<Upload class="upload" ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" action="" >
			<div style="width: 58px;height:58px;line-height: 58px;">
				<Icon type="camera" size="20"></Icon>
			</div>
		</Upload>
		<Modal title="View Image" v-model="visible">
			<img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
		</Modal>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				defaultList: [{
						'name': 'a42bdcc1178e62b4694c830f028db5c0',
						'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
					},
					{
						'name': 'bc7521e033abdd1e92222d733590f104',
						'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
					}
				],
				imgName: '',
				visible: false,
				uploadList: []
			}
		},
		methods: {
			handleView(name) {
				this.imgName = name;
				this.visible = true;
			},
			handleRemove(file) {
				debugger
				const fileList = this.$refs.upload.fileList;
				this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
			},
			handleSuccess(res, file) {
				debugger
				file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
				file.name = '7eb99afb9d5f317c912f08b5212fd69a';
			},
			handleFormatError(file) {
				debugger
				this.$Notice.warning({
					title: 'The file format is incorrect',
					desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
				});
			},
			handleMaxSize(file) {
				debugger
				this.$Notice.warning({
					title: 'Exceeding file size limit',
					desc: 'File  ' + file.name + ' is too large, no more than 2M.'
				});
			},
			handleBeforeUpload() {
				const check = this.uploadList.length < 5;
				if(!check) {
					this.$Notice.warning({
						title: 'Up to five pictures can be uploaded.'
					});
				}
				return check;
			}
		},
		mounted() {
			this.uploadList = this.$refs.upload.fileList;
		}
	}
</script>
<style scoped>
	@import url("./less");
</style>