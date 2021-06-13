export default function (func, time) {
    let timer = null;
    return function(){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(()=>func(...arguments),time);
    }
}