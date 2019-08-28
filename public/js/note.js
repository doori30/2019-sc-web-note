const auth = firebase.auth();
const google = new firebase.auth.GoogleAuthProvider();
const db = firebase.database();
var user = null; //로그인한 사용자의 정보를 저장하는 변수
var nowKey = null;

const _btLogin = document.querySelector("#btLogin");
const _btLogout = document.querySelector("#btLogout");
const _btSave = document.querySelector("#btSave");
const _content = document.querySelector("#noteTxt");
const _lists = document.querySelector(".lists");
const _btWing = document.querySelector("#btWing");
//인증기능 만들기
//$("#btLogin").click(function(e){});
//auth.onAuthStateChanged(onAuth);

auth.onAuthStateChanged((data) => {
	user = data;
	if (user == null) viewChg('');
	else {
		viewChg('R');
		dbInit();
}
});
// on 이 붙으면 이벤트 실행/ auth의 상태가 변화되면 onAuth를 실행.

_btLogin.addEventListener("click", () => {
	//auth.signInWithRedirect(google);
	//페이지에서 새창에서 구글을 실행(팝업창), 넘어가서 로그인이 되었다가 다시 페이지로 돌아옴..
	auth.signInWithPopup(google);
});
_btLogout.addEventListener("click", e => {
	auth.signOut();
});
//console.log(auth);

//노트 추가/수정 하기
_btSave.addEventListener("click",(e) => {
	var content = _content.value.trim();
	if(content ===""){
	// 문자열로 들어옴. 2-값,3-type
	alert("내용을 입력하세요.");
	_content.focus();
	return false;
	}
	if(nowKey == null){
//신규작성
db.ref("root/notes/"+user.uid).push({
	content: content,
	time: new Date().getTime(),
	icon: content.substring(0,1) //자릿수, index값
}).key;
	}
	else{
//수정하기
db.ref("root/notes/"+user.uid +"/"+nowKey).update({
	content: content,
	icon: content.substring(0,1)
});
	}
	_content.value = "";
	nowKey = null;
});

//Database init
function dbInit(){
	_lists.innerHTML ='';
	db.ref("root/notes/"+user.uid).on("child_added", onAdd);
	db.ref("root/notes/"+user.uid).on("child_removed", onRev);
	db.ref("root/notes/"+user.uid).on("child_changed", onChg);
}


//Database onAdd 콜백
function onAdd(data){
	console.log(data)
	var html = '';
	html += '<ul class="list border border-white rounded p-3 mt-3 bg-primary text-white position-relative" id="'+data.key+'" onclick="dataGet(this)">';
	//                                                                   id에 데이터 키를 저장함
	html += '<li class="d-flex">';
	html += '<h1 class="icon bg-light text-primary rounded-circle text-center mr-3 flex-shrink-0"style="width:60px; height:60px;">'+data.val().icon+'</h1>';
	html += '<div class="cont">'+data.val().content.substring(0,60)+'</div>';
	html += '</li>';
	html += '<li>'+dspDate(new Date(data.val().time))+'</li>';
		//                    ↑firebase value 객체가 가지고 있는 함수
	html += '<li class="position-absolute" style="bottom:5px; right:10px; cursor:pointer;">';
	html += '<i class="fas fa-trash-alt" onclick="dataRev(this);"></i>';
	html += '</li>';					
	html += '</ul>';
	_lists.innerHTML = html + _lists.innerHTML;
//ul클릭하면 이벤트 실행onclick
};

// Database onRev 콜백함수
function onRev(data){
	if(confirm("삭제할까요?")){
	var id = data.key;
	document.querySelector("#"+id).remove();
	}
};
// Database onChg 콜백함수
function onChg(data){
	var id =data.key;
	document.querySelector("#"+id+" .icon").innerHTML = data.val().icon;
	document.querySelector("#"+id+" .cont").innerHTML = data.val().content.substring(0,60);
};

//onclick함수 :dataRev()
function dataRev(obj){
	//console.log(obj.parentNode.parentNode.getAttribute("id"));
	event.stopPropagation();
	//이벤트의 번식을 막아라.
	var key = obj.parentNode.parentNode.getAttribute("id");
	db.ref("root/notes/"+user.uid+"/"+Key).remove();
	 //firebase삭제 -> db.ref("root/notes/"+user.uid).on("child_removed", onRev);발생 -> onRev에서 DOM삭제
}

//onclick함수: dataGet(this)
function dataGet(obj) {
	//console.log(obj.getAttribute("id"));
	nowKey = obj.getAttribute("id");
	db.ref("root/notes/"+user.uid + "/" +nowKey).once("value").then((data) => {
		_content.value = data.val().content;
	});
	//                                이벤트가 단한번만 실행이 가능하다.(값)을 가져온 이후(then) 함수를 실행(functuin)
  }

//onClick-btWing
_btWing.addEventListener("click",() =>{
	var left = getComputedStyle(_lists).left.replace("px","");
	var tarLeft = "-"+getComputedStyle(_lists).width;
	if(left == 0){
		_lists.style.left = tarLeft;
		_btWing.querySelector(".fas").classList.remove("fa-angle-left");
		_btWing.querySelector(".fas").classList.add("fa-angle-right");
	}
	else{
		_lists.style.left = 0;	
		_btWing.querySelector(".fas").classList.add("fa-angle-left");
		_btWing.querySelector(".fas").classList.remove("fa-angle-right");
	}
})

//onResize
window.addEventListener("resize",function(e){
 //console.log(getComputedStyle(_lists).position);
 //           window생략가능.
	var position = getComputedStyle(_lists).position;
	if(position == "absolute"){

	}
})

//화면전환 함수
function viewChg(state) {
	switch (state) {
		case "R":
			console.log(user)
			// if(user,photoURL) url =user.photoURL;
			// else url = ""
			imagesLoaded(document.querySelector(".email img"), () => {
				document.querySelector(".email img").setAttribute("src", user.photoURL);
				document.querySelector(".email-txt").innerHTML = user.email;
				document.querySelector(".email").style.display = "flex";
				document.querySelector("#btLogin").style.display = "none";
			});//이미지가성공하면 상단 내용이진행됨.
				document.querySelector(".email img").setAttribute("src", user.photoURL);
			break;
		default:
			document.querySelector(".email > div").innerHTML = "";
			document.querySelector(".email").style.display = "none";
			document.querySelector("#btLogin").style.display = "inline-block";
			break;
	}
}


//java의 animate,->setInterval
//갈놈 = 갈놈 +(목표값 - 갈놈)*0.2
//60fps  60/1000=0.0167...
//이진값공식으로 만들어야함.
