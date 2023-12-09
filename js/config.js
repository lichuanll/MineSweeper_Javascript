/**
 * 游戏配置
 * @type {{normal: {}, hard: {}, easy: {}}}
 */
//一个对象
var config={
    //三个对象
    easy:{
        row:10,
        col:10,
        MineNum:10,
    },
    normal:{
        row:15,
        col:15,
        MineNum:30,
    },
    hard :{
        row:20,
        col:20,
        MineNum:60,
    },
}
var  curLevel =config.easy;
var  score=0;
var  timelong=0;
var  stoptime;