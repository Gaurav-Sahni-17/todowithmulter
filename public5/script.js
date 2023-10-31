let count=Math.floor(Date.now()/1000);
const ip=document.getElementById('task');
const file=document.getElementById('file')
const btn=document.getElementById('btn');
const parent=document.getElementById('list');
btn.addEventListener("click",()=>{
    let value=ip.value;
    if(value!=="" && file.files[0]!==undefined){
    saveTodo(value,function(i){
        const li=document.createElement('li');
        li.id=count;
        const span=document.createElement('span');
        span.textContent=value;
        const div=document.createElement('div');
        const img=document.createElement('img');
        img.src=i;
        console.log(img.src);
        const check=document.createElement('input');
        check.type="checkbox";
        const del=document.createElement('button');
        del.textContent="Delete";
        check.addEventListener("click",strike);
        del.addEventListener("click",deletetodo);
        div.style.float="right";
        div.appendChild(img);
        div.appendChild(check)
        div.appendChild(del);
        li.appendChild(span)
        li.appendChild(div)
        parent.appendChild(li);
        ip.value="";
        file.value="";
        count++;
    })
}
else{
    alert("Please Fill All Fields");
}
})
function saveTodo(value,callback){
    const request=new XMLHttpRequest();
    request.open("POST","/savetodo");
    let a= new FormData();
    a.append("id",count);
    a.append("task",value);
    a.append("iscomplete",false);
    a.append("file",file.files[0]);
    request.send(a);
    request.addEventListener("load",()=>{
        if(request.status===200){
        callback(request.responseText);
        }
    })
}
window.addEventListener("load",()=>{
    getTodo((todos)=>{
        todos.forEach((todo)=>{
            value=todo.task;
            const li=document.createElement('li');
            li.id=todo.id;
            const span=document.createElement('span');
            span.textContent=value;
            const div=document.createElement('div');
            const img=document.createElement('img');
            img.src=todo.file;
            const check=document.createElement('input');
            check.type="checkbox";
            const del=document.createElement('button');
            del.textContent="Delete";
            del.addEventListener("click",deletetodo);
            check.addEventListener("click",strike);
            div.appendChild(img);
            div.appendChild(check)
            div.appendChild(del);
            div.style.float="right";
            li.appendChild(span)
            li.appendChild(div)
        if(todo.iscomplete===true)
        {
            span.style.textDecoration="line-through";
            check.checked=true;
        }
        else{
            span.style.textDecoration="none";
            check.checked=false;
        }
        parent.appendChild(li);
        })
    })
})
function getTodo(callback){
    const request=new XMLHttpRequest();
    request.open("GET","/gettodo");
    request.send();
    request.addEventListener("load",()=>{
        callback(JSON.parse(request.responseText));
    })  
}
function strike(e){
    let target=e.target;
    const request=new XMLHttpRequest();
    request.open("POST","/read");
    request.setRequestHeader("Content-type","application/json");
    let a=e.target.parentNode.parentNode;
    request.send(JSON.stringify({id: a.id}));
    request.addEventListener("load",()=>{
        if(target.checked)
        {
            a.querySelector('span').style.textDecoration="line-through";
        }
        else{
            a.querySelector('span').style.textDecoration="none";
        }
    })  
}
function deletetodo(e){
    const request=new XMLHttpRequest();
    request.open("DELETE","/delete");
    request.setRequestHeader("Content-type","application/json");
    let a=e.target.parentNode.parentNode;
    request.send(JSON.stringify({id: a.id}));
    request.addEventListener("load",()=>{
        a.remove();
    })  
}