<style lang="less">
    @import './less/500';
</style>

<template>
    <div class="error500">
        <div class="error500-body-con">
            <Card>
                <div class="error500-body-con-title">
                    5<span class="error500-0-span"></span><span class="error500-0-span"></span>
                </div>
                <p class="error500-body-con-message">Oops! the server is wrong</p>
                <div class="error500-btn-con">
                    <button @click="backPage" type="primary">返回上一页</button>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error500',
    methods: {
        backPage () {
            this.$router.go(-1);
        }
    }
};
</script>
