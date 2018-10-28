export default {
  tabShopping(item, _this) { //购物车
    if (item.bookBaseInfo.bookFlag && item.bookBaseInfo.bookFlag === 2) {
      utils.toast("杂志请到馆阅览")
      return false;
    }

    let list = localStorage.shopList || [], flag = true;
    try {
      if (list && list.length > 0) {
        list = decodeURIComponent(list);
        if (list) {
          list = JSON.parse(list);
          list.map(data => {
            if (item.bookBaseInfo.id == data.bookBaseInfo.id) {
              return flag = false;
            }
          })
        }
      }
      if (flag) {
        list.push(item);
        _this.$store.commit('updateBadge', {
          badge: list.length
        })
        localStorage.shopList = encodeURIComponent(JSON.stringify(list))
        utils.toast("添加成功");
        return true;
      } else {
        utils.toast("已加入购物车");
        return false;
      }
    } catch (e) {
      localStorage.clear();
    }
  },
  getLocalStoreList(key, _this) {
    let shopList = localStorage.shopList || [];
    try {
      if (shopList && shopList.length > 0) {
        shopList = decodeURIComponent(shopList);
        if (shopList) {
          shopList = JSON.parse(shopList);
          if (key) {
            key.map(req => {
              shopList.map((data, index) => {
                if (req == data.bookBaseInfo.id) {
                  shopList.splice(index, 1);
                }
              })
            });
            localStorage.shopList = encodeURIComponent(JSON.stringify(shopList))
          }
        }
      }
      _this.$store.commit('updateBadge', {
        badge: shopList && shopList.length
      })
      return shopList;
    } catch (e) {
      localStorage.clear();
    }
  }
}