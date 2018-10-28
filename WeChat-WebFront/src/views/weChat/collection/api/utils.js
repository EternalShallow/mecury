import apiCollection from './index';
export default {
    tabCollection(val, event, cacelFlag) {
        let tar = event.target, flag = cacelFlag || tar.classList.contains("red"), arr = [];
        arr.push(val);
        if (flag) {
            apiCollection.cancelWatch({
                data: arr
            }, req => {
                if (req.code == 200) {
                    tar.className = "icon-shoucang";
                    utils.toast("取消收藏", 600);
                } else {
                    utils.toast(req.message);
                }
            });
        } else {
            apiCollection.showWatch({
                data: arr
            }, req => {
                if (req.code == 200) {
                    tar.className = "icon-shoucang1 red";
                    utils.toast("收藏成功", 600);
                }
            });
        }
    }
}