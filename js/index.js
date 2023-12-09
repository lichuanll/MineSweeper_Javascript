/**
 * 游戏主要逻辑
 */
//根据选择器获取元素。，如果有多个，只返回第一个
/**
 * 程序入口
 */

//雷数组
var mineArray=null;

//获取html雷区容器
var MineArea = $(".mineArea");


//存储整张地图每个格子额外的一些信息
var tableData=[];

//获取游戏选择的按钮
var btns = $$(".level>button");

var _socre=$(".score");

var _time= $(".time");
/**
 * 返回地雷的数组
 * @returns {*[]}
 */
function initMine()
{
    var arr=new Array(curLevel.row*curLevel.col);
    //按顺序填充数组
    for(var i=0;i<arr.length;i++)
    {
        arr[i]=i;
    }
    //打乱数组
    arr.sort(()=>0.5-Math.random());
    //只保留雷的数组长度

    return arr.slice(0,curLevel.MineNum);
}
function clearScene(){
    MineArea.innerHTML="";
    _socre.innerHTML=0;
    _time.innerHTML=0;
    score=0;
    timelong=0;
}
function IsWin()
{
    let CanFlagNum=0;
    for(let i=0;i<curLevel.row;i++)
    {
        for(let j=0;j<curLevel.col;j++)
        {
            if(tableData[i][j].checked===false)
            {
                CanFlagNum++;
            }
        }
    }

    if(CanFlagNum===curLevel.MineNum)
    {
        //console.log(CanFlagNum);
        showAnswer();
        return true;
    }
    return false;
}

//初始化
function init()
{
    //console.log("chushihua");
    clearScene();
    stoptime=setInterval(updateCountdown,1000);
    //1.随机生成雷
    mineArray=initMine();
    //alert(mineArray);
    //2.生成所选配置的表格
    var table =document.createElement('table');

    //初始化格子下标
    var index=0;
    for(var i=0;i<curLevel.row;i++){
        //创建新的一行
        tableData[i]=[];//每行为table开辟一段内存
        var tr = document.createElement("tr");
        for(var j=0;j<curLevel.col;j++){
            //创建一行有多少列
            var td = document.createElement("td");
            var div =document.createElement("div");
            //每一个小格子都会对应一个js对象
            //每一个对象存储了额外的一些信息
            tableData[i][j]={
                row:i,
                col:j,
                type:"number",
                value:0,//周围雷的数量
                index,//格子的下标
                checked:false,//是否被检验过
            };

            div.dataset.id=index;//添加格子的下标
            div.classList.add("canFlag");//标记当前格子可以插旗

            //查看当前格子的下标是否在雷的数组里面
            if(mineArray.includes(tableData[i][j].index)){
                tableData[i][j].type="mine";
                div.classList.add("mine");
                //div.style.background='url(data:image/png;base64,${base64Image}) center/cover no-repeat';
            }
            td.appendChild(div);
            tr.appendChild(td);
            index++;
        }
        //tr.innerHTML=1;
        table.appendChild(tr);
    }

    MineArea.appendChild(table);

    MineArea.onmousedown=function (e) {
        e.preventDefault();
        if (e.button === 0) {
            searchArea(e.target);
            _socre.innerHTML=score;
            if(IsWin())
            {
                GameOver(true);
            }
        }
        if (e.button === 2) {
            // 阻止默认的右键菜单弹出
            console.log("右键点击事件触发！");
            flag(e.target);
        }
    }
    //console.log(tableData);
}


function showAnswer()
{
    let mineArr=$$("td>div.mine");
    for(var i=0;i<mineArr.length;i++)
    {
        mineArr[i].style.opacity=1;
    }

    MineArea.onmousedown=null;
}

/**
 * 找到DOM对应tableData里面的JS对象
 * @param cell
 */

function getTableItem(cell)
{
    var index1 =cell.dataset.id;
    let flatTableData = tableData.flat();
    //console.log(flatTableData);
    //flatTableData.filter(flatTableData[0])
    for(let i=0;i<flatTableData.length;i++)
    {
        if(flatTableData[i].index==index1)
        {
            return flatTableData[i];
        }
    }
}

/**
 * 会返回该对象对应的四周的边界
 * @param obj
 */
function getBound(obj)
{
    // 上下边界
    var rowTop = obj.row - 1 < 0 ? 0 : obj.row - 1;
    var rowBottom = obj.row + 1 === curLevel.row ? curLevel.row - 1 : obj.row + 1;
    // 左右边界
    var colLeft = obj.col - 1 < 0 ? 0 : obj.col - 1;
    var colRight = obj.col + 1 === curLevel.col ? curLevel.col - 1: obj.col + 1;
    return{
        rowTop,
        rowBottom,
        colLeft,
        colRight,
    };
}
/**
 * 返回该格子周围雷的数量
 * @param obj 格子对应的js对象
 */
function findMineNum(obj)
{
    let count=0;
    var { rowTop, rowBottom, colLeft, colRight } = getBound(obj);
    for(let i=rowTop;i<=rowBottom;i++)
    {
        for(let j=colLeft;j<=colRight;j++)
        {
            if(tableData[i][j].type==="mine")
            {
                count++;
            }
        }
    }
    return count;
}

/**
 * 根据tableData的js对象返回对应的div
 * @param obj
 */
function getDOM(obj)
{
    var divArray = $$("td>div");
    return divArray[obj.index];
}
/**
 * 搜索该单元格的九宫格
 * @param cell
 */
function getAround(cell)
{
    if(cell.classList.contains("canFlag"))
    {
        score++;
    }

    cell.parentNode.style.border="none";
    cell.classList.remove("canFlag");
    //获取每个格子的js对象
    var tableItem =getTableItem(cell);

    if(!tableItem)
    {
        return;
    }

    tableItem.checked=true;

    let MineNum=findMineNum(tableItem);
    if(!MineNum)
    {

        var { rowTop, rowBottom, colLeft, colRight } = getBound(tableItem);
        for(let i=rowTop;i<=rowBottom;i++)
        {
            for(let j=colLeft;j<=colRight;j++)
            {
                if(!tableData[i][j].checked)
                {
                    getAround(getDOM(tableData[i][j]));
                }
            }
        }
    }
    else
    {
        cell.innerHTML = MineNum;
    }
    //  console.log(MineNum);
}
/**
 *
 * @param cell 代表用户点击的DOM元素
 */

function searchArea(cell)
{
///判断该单元格是否是雷
    if(cell.classList.contains("mine")){
        cell.classList.add("error")
        cell.classList.remove("mine");
        showAnswer();
        GameOver(false);

        return;
    }
    /**
     * 判断周围有没有雷，如果有，显示数量，如果没有，继续递归搜索
     */
    getAround(cell);
}
function flag(cell)
{

    //console.log("dddd");
    if(cell.classList.contains("canFlag"))
    {
        //进行插旗
        cell.classList.add("flag");
        cell.classList.remove("canFlag");
        //console.log("yes");
    }
    else if(cell.classList.contains("flag"))
    {
        cell.classList.add("canFlag");
        cell.classList.remove("flag");
    }

}

//绑定事件
function bindEvent()
{
    MineArea.addEventListener("contextmenu", function(event) {
        if (event.button === 2) {
            event.preventDefault(); // 阻止默认的右键菜单弹出
            //console.log("右键点击事件触发！");
        }
    });


    $(".level").onclick=function (e){
        for(let i=0;i<btns.length;i++)
        {
            btns[i].classList.remove("active");
        }
        e.target.classList.add("active");
        switch (e.target.innerHTML)
        {
            case "初级":{
                curLevel=config.easy;

                //console.log("chu");
                break;
            }
            case "中级":{
                curLevel=config.normal;
                //console.log("zhong");
                break;
            }
            case "高级":{
                curLevel=config.hard;
                //console.log("gao");
                break;
            }
        }
        GameOver(false);
        init();
    };
}

function GameOver(f)
{
    clearInterval(stoptime);
    //document.getElementById("score").value=score.toString();
    if(f)
    {
        var gameOver1 = confirm("你赢了~你想再来一局吗？");
        if (gameOver1) {
            init();
        }
    }

    else{
        var gameOver2 = confirm("你输了~你想再来一局吗？");
        if(gameOver2)
        {
            init();
        }
        //document.getElementById("TimeLong").value="Fail";
    }
    //document.getElementById("submit").submit();
    //CreateHistoryTable();
}

function main()
{
    //1.游戏的初始化
    init();
    bindEvent();

}

function updateCountdown()
{
    timelong++;

    _time.innerHTML=timelong.toString()+"秒";
    //console.log(timelong);
}

main();