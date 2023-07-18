const page_label = document.querySelector('#page_label');
const list = document.querySelector('#list');
const addData = document.querySelector('#add');
const footer = document.querySelector('footer');


let page_value = '全部'; //預設標籤頁
let listData = 
[{content:"這是測試1號",checked:true,num:0},
{content:"這是測試2號",checked:false,num:1},
{content:"這是測試3號",checked:false,num:2}]; //紀錄資料的

// 物件格式
// { content:"內容",checked:"被選取的狀態",num:"索引值" }

render(listData); //初始化


    
// 清單更新
list.addEventListener('click',function(e){ //如果對條件做點擊，依照標籤分頁更改checked的狀態
        if(e.target.nodeName == 'INPUT' || e.target.nodeName == 'I'){
        let findList = listData.find( (item) => {
            return e.target.getAttribute('data-num') == item.num;
        })
        let findListIndex = listData.findIndex( (item) => {
            return e.target.getAttribute('data-num') == item.num;
        })
        findList.checked = !findList.checked; //UPDATE data checked
        listData[findListIndex].checked = findList.checked; //將原本listData的checked資料取代
        selected_delete(e); //刪除選擇的單筆資料
        if(page_value == '全部'){ //依照標籤渲染內容
            render(listData);
        }
        if(page_value == '待完成'){
            render(becompleted());
        }
        if(page_value == '已完成'){
            render(completed());  
        }
    }
})
addData.addEventListener('click',function(e){ //當按下新增按鈕時觸發
    const content = document.querySelector('#content');
    if(e.target.nodeName !== 'I'){
        return;
    }
    if(content.value.length == 0){ //檢測是否輸入空值
        return;
    }
    add(content.value);
    content.value = ""; //刷新
    render(listData);
})
page_label.addEventListener('click',function(e){ //按下分類標籤時觸發
    if(e.target.nodeName !== 'INPUT'){
        return;
    }
    if(e.target.getAttribute('id') == '全部'){
        page_value = '全部';                        
        render(listData);
    }
    if(e.target.getAttribute('id') == '待完成'){  
        page_value = '待完成';           
        render(becompleted());
    }
    if(e.target.getAttribute('id') == '已完成'){    
        page_value = '已完成';         
        render(completed());
    }
})
function deletelist(){ //按下清除已完成資料
    const delete_list = document.querySelector('.delete-list');
    delete_list.addEventListener('click',function(e){ //按下清除已完成
        e.preventDefault();
        listData = listData.filter( item => {
            return item.checked == false;
        })
        render(listData);
        console.log(listData);
    })
}
function add(value){ //此函數為加入事項
    let obj = {};
    obj.content = value;
    obj.checked = false;
    obj.num = listData.length;
    listData.push(obj);
}
function completed(){ //已完成
    let completed_data = listData.filter((item) => {
        return item.checked == true;
    })
    return completed_data;
}
function becompleted(){ //待完成
    let becompleted_data = listData.filter((item) => {
        return item.checked == false;
    })
    return becompleted_data;
}
function render(listData){ //資料展示/渲染
    let str = "";
    let datachecked = "";
    listData.forEach((item) => {
        if(item.checked == true){ //新增checked的屬性
            datachecked = "checked";
        }else{
            datachecked = "";
        }
        
        str += `
        <li class="py-16 border-bottom list-data d-flex justify-content-between">
            <label class="check-box" for="data-${item.num}">
                <input type="checkbox" id="data-${item.num}" data-num=${item.num} ${datachecked}/>
                <span>${item.content}</span>
            </label>
            <div class="cursor-pointer delete" id="delete"><i class="fa-solid fa-trash" data-num=${item.num}></i></div>
        </li>`;
    })
    list.innerHTML = str;
    footer.innerHTML = `<p>${becompleted().length} 個待完成項目</p> <div class="delete-list" ><p class="text-light cursor-pointer">清除已完成項目</p></a>`;
    deletelist();//非同步 渲染完畫面才可抓取按鈕
}

function selected_delete(e){ //刪除單筆資料
    if(e.target.nodeName == 'I'){
        listData.splice(e.target.getAttribute('data-num'),1)
        listData.forEach((item,index) => {
            item.num = index;
        })
    }
    render(listData);
}