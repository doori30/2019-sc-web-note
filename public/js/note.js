const auth = firebase.auth();
const google = new firebase.auth.GoogleAuthProvider();
var user = null; //로그인한 사용자의 정보를 저장하는 변수

//인증기능 만들기
//$("#btLogin").click(function(e){});
//auth.onAuthStateChanged(onAuth);

auth.onAuthStateChanged((data) => {
	user = data;
	if (user == null) viewChg('');
	else viewChg('R')
});
// on 이 붙으면 이벤트 실행/ auth의 상태가 변화되면 onAuth를 실행.

document.querySelector("#btLogin").addEventListener("click", () => {
	//auth.signInWithRedirect(google);
	//페이지에서 새창에서 구글을 실행(팝업창), 넘어가서 로그인이 되었다가 다시 페이지로 돌아옴..
	auth.signInWithPopup(google);
});
document.querySelector("#btLogout").addEventListener("click", e => {
	auth.signOut();
});
//console.log(auth);

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
