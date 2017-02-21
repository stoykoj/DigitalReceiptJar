var e = document.getElementById('house');
e.onmouseover = function(){
	
	document.getElementById('popup').style.display = 'block';
}

e.onmouseout = function() {
	document.getElementById('popup').style.display = 'none';
}