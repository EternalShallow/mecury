<template>
  <header>
    <section class="inputName bookName">
      <span>查找用户：</span>
      <div><input id="userName" v-model="search.userName" placeholder="输入手机号/扫描条形码" @keydown="$emit('searchUserNameEvent')"></div>
      <button :disabled="!search.userName" type="button" @click="$emit('searchUserName')">查询</button>
      <button v-if="data && data.flag" type="button" @click="$emit('useMembers')">使用入场券</button>
    </section>
    <fieldset>
      <legend>会员基本信息</legend>
      <article class="userName ">
        <section>
          <div>用户姓名：<label>{{ data.babyName }}</label></div>
          <div>会员号：<label>{{ data.uid }}</label></div>
          <div>手机号：<label>{{ data.cellphone }}</label></div>
          <div>出生日期：<label>{{ data.babyBirth }}</label></div>
          <div>性别：<label>{{ data.babyGender }}</label></div>
          <div>借书情况：<label>{{ data.borrowBooksCount }}</label></div>
          <div>借书次数：<label>{{ data.borrowCount }}</label></div>
          <div>截止日期：<label>{{ data.borrowDeadline }}</label></div>
          <div class="red">押金：<label>{{ data.depositMoney / 100 }}</label></div>
          <div>可借阅多少本：<label>{{ data.maxBorrowCount }}</label></div>
          <div>状态：<label>{{ data.status }}</label></div>
          <div>入场券截止日期：<label>{{ data.ticketDeadline }}</label></div>
          <div>入场券的次数：<label>{{ data.ticketNum }}</label></div>
        </section>
      </article>

    </fieldset>
  </header>
</template>
<script>
export default {
  props: ["search", "data"],
  created() {
    console.log(this.search);
  },
  data(){
    return {}
  }
};
</script>