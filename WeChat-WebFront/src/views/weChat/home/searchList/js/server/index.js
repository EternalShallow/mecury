import api from '../api';
import ageApi from '../../../api';
import { router } from 'router';

/**
 * mutation-js
 */
export const SEARCHLIST = 'SEARCHLIST'; //首页搜索结果列表
const state = {
  list: [],
}

//放置ajax请求
const actions = {
  getSearchList({
    commit
  }, param) {
    let curr = router.currentRoute.query;

    if (curr.type == "age") { //年龄分段
      return ageApi.getSearchByAge({
        age: curr.ageValue,
        refreshInfo: param.refreshInfo
      }, data => {
        commit(SEARCHLIST, data, param);
      });
    } else if (curr.type == "label") { //名家书单
    
      return ageApi.getSearchByLabel({
        name: curr.nameValue,
        refreshInfo: param.refreshInfo
      }, data => {
        commit(SEARCHLIST, data, param);
      });
    } else if (curr.type == "classification") {
      let dataInfo = JSON.parse(decodeURI(decodeURIComponent(curr.data)));
      dataInfo.refreshInfo = param.refreshInfo;
      //2018-09-15
      dataInfo.size = param.refreshInfo.pageSize;
      dataInfo.start = param.refreshInfo.currIndex;
      return ageApi.getListByCategeory(dataInfo, data => {
        commit(SEARCHLIST, data, param);
      });
    } else { //搜索列表
      return api.getSearchList(param, data => {
        commit(SEARCHLIST, data, param);
      });
    }
    return null;
  },
};

// mutations
const mutations = {
  [SEARCHLIST](state, data) {
    if (data.code == "200") {
      state.list = [];
      return state.list = [...data.data] || [];
    } else {
      utils.toast(data.message);
      return state.list = [];
    }
  }
}

const getters = {
  getHomeSearchList: state => state,
}

export default {
  state,
  actions,
  mutations,
  getters
}