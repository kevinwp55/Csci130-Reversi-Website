var x = sessionStorage.getItem('username');
//console.log("session: "+x);

if(x != null)
{
	if(String(x).length > 0)
	{
		window.location.href = 'projectReversiUser.html'
	}
}
