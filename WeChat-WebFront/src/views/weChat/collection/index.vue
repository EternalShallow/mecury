<!--收藏-->
<template>
	<div class="collection iconfont ">
        <swipeout v-if="list.length>0">
            <swipeout-item :threshold=".5" underlay-color="#ccc" v-for="(v,i) in list" :key="i">
                <div slot="right-menu">
                    <swipeout-button @click.native="onButtonClick('delete',v.bookBaseInfo.id)" background-color="#FF3333">删除</swipeout-button>
                </div>
                <div slot="content">
                    <section class="collection-section">
                        <div @click="routerForward(v)">
                            <img :src="URL+[v.bookBaseInfo.headImage && v.bookBaseInfo.headImage.split(',')[0]]" />
                        </div>
                        <div @click="routerForward(v)">
                            <code>{{v.bookBaseInfo.name}} <label>{{v.bookBaseInfo.publisher}}</label></code>
                            <span class="br" v-show="v.bookBaseInfo.editor">作者：{{v.bookBaseInfo.editor}}</span>
                        </div>
                        <div class="btnTab">
                            <span class="icon-gouwuche" @click="tabShopping(v)"></span>
                        </div>
                    </section>
                </div>
            </swipeout-item>
        </swipeout>
        <no-data v-if="list.length<=0"></no-data>
	</div>
</template>

<script>
import api from './api';
import tab from './api/utils';
import NoData from 'components/common/noData';

import { Swipeout, SwipeoutItem, SwipeoutButton, XButton } from "vux";
import bookShop from '../bookBox/api/utils';
export default {
    data() {
        return {
            URL: utils.url.curr,
            list: [],
        }
    },
    components: {
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        XButton,
        NoData
    },
    created() {
        this.getList();
    },
    mounted() { },
    methods: {
        routerForward(item) {
            this.$router.push({
                path: '/weChat/home/details',
                query: {
                    _title: item.bookBaseInfo.name,
                    detailId: item.bookBaseInfo.id,
                }
            });
        },
        onButtonClick(type, id) {//删除购物清当
            if (type == "delete") {
                this.del(id);
            }
        },
        getList() {
            api.getListInfo(req => {
                if (req.code == 200) {
                    this.list = [];
                    req.data.map(data => {
                        this.list.push(data.book);
                    })
                    console.log(this.list)
                } else {
                    this.list = [];
                    utils.toast(req.message);
                }
            });
        },
        del(val) { //删除功能
            tab.tabCollection(val, event, true);

            this.getList();
        },
        tabShopping(item) { //购物车
            bookShop.tabShopping(item, this);
        },
    }
}
</script>

<style lang="less" scoped>
.flex {
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
}

.collection {
    overflow: hidden;
    height: 100%;
    &-section {
        .flex;
        border-bottom: 1px solid #dddddd;
        padding: 12px 20px;
        position: relative;
        div {
            margin-top: 2px;
            margin-left: 12px;
            code,
            span {
                display: block;
            }
            span {
                font-size: 16px;
            }
            &:nth-child(2) {
                width: 71%;
                margin-top: 6px;
                .br {
                    width: 88%;
                    display: block;
                    color: #222222;
                }
                code {
                    font-size: 16px;
                    display: block;
                    margin-top: 4px;
                    label {
                        font-size: 12px;
                        color: #999999;
                        padding: 2px 0;
                        display: block;
                    }
                }
                .ellipsis2 {
                    width: 88%;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                }
                span {
                    margin-top: 3px;
                    font-size: 14px;
                }
            }
            &:nth-child(3) {
                .flex;
                position: absolute;
                right: 16px;
                top: 45px;
                span {
                    padding: 6px;
                    font-size: 20px;
                }
            }
        }
    }
    img {
        width: 100px;
        height: 100px;
        margin-left: -20px;
    }
}
</style>