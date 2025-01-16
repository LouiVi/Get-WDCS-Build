var wdcs = new Array();
wdcs.push("https://ambientemoderno.wdcsapp.com/Account/Login?ReturnUrl=%2F");
wdcs.push("https://qa.devzone.multisystems.com/");//Account/Login?ReturnUrl=%2F");
wdcs.push("https://freije.wdcsapp.com/Account/Login?ReturnUrl=%2F");
wdcs.push("https://freije.wdcsapp.com/Account/Login?ReturnUrl=%2F");

current="";
d = 0;
async function OnStart()
{
	lay = app.CreateLayout( "Linear", "VCenter,FillXY" )

	web = app.CreateWebView( 1, 1, "IgnoreErrors, IgnoreSSLErrors" );
	web.SetOnProgress( web_Progress );
	lay.AddChild( web );
	
	app.AddLayout( lay )
	await ParseBuilds();
}

function web_Progress(progress) {
	if(progress == 100) web.Execute( "document.getElementsByClassName('text-sm')[0].innerText;", LogEntry );
}

function LogEntry(result) {
	app.WriteFile( "Builds.txt", result+", "+wdcs[d]+"\n", "Append" );
	d+=1;
}

async function ParseBuilds() {
	for(c = 0; c < wdcs.length; c++) {
		await app.HttpRequest( "GET", wdcs[c], "", "", SaveToLog );
	}
}

function SaveToLog(error, response, status) {
	if(status === 200) web.LoadHtml( response );
}