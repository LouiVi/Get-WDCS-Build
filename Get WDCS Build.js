cfg.Landscape;

app.WriteFile( "Builds.txt","","Write");
app.DeleteFile( "Builds.txt" );
var wdcs = new Array();
wdcs = ['https://qa.devzone.multisystems.com','https://ambientemoderno.wdcsapp.com'  ,'https://basebda.wdcsapp.com'  ,'https://cblbahama.wdcsapp.com'  ,'https://ct.wdcsapp.com'  ,'https://distvazquez.wdcsapp.com'  ,'https://farmaciasaliadas.wdcsapp.com'  ,'https://freije.wdcsapp.com'  ,'https://mipad.wdcsapp.com'  ,'https://mocoroa.wdcsapp.com'  ,'https://especiasmontero.wdcsapp.com'  ,'https://speedster.wdcsapp.com'  ,'https://surgical.wdcsapp.com']
current="";
d = 0;

function formatDateToShort(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

async function OnStart()
{
	app.SetOrientation( "Landscape" );
	lay = app.CreateLayout( "Linear", "VCenter,FillXY" )
	web = app.CreateWebView( 0, 0, "IgnoreErrors, IgnoreSSLErrors" );
	web.SetOnProgress( web_Progress );
	lay.AddChild( web );
	webLog= app.CreateWebView( 1, 1, "IgnoreErrors, IgnoreSSLErrors" );
	lay.AddChild( webLog );
	app.AddLayout( lay )
	await ParseBuilds();
		
	
	 /*var packageName = "com.microsoft.office.outlook";
    var className = "com.microsoft.office.outlook.ui";
    var action = "android.intent.action.VIEW";
    var category = null;
    var uri = "lramirez@multisystems.com";
    var type = "message/rfc822";
    
    var extras = [ 
        {name:"android.intent.extra.EMAIL", type:"list", value:"luillosoftinc@gmail.com"},
        {name:"android.intent.extra.SUBJECT", type:"string", value:"My subject"},
        {name:"android.intent.extra.TEXT", type:"string", value:"Hello!"} 
    ];
    extras = JSON.stringify( extras )

    app.SendIntent( packageName, className, action, category, uri, type, extras ) */
}

async function web_Progress(progress) {
	if(progress == 100) await web.Execute( "document.getElementsByClassName('text-sm')[0].innerText;", LogEntry );
}

function createDateFromString(dateString, daysToAdd) {
    const [month, day, year] = dateString.split('/');
    const date = new Date(year, month - 1, day); // Create the date object
    date.setDate(date.getDate() + (daysToAdd-1)); // Add the specified number of days
    return formatDateToShort(date);
}

// Example usage:
//const newDate = createDateFromString("01/16/2025", 10);
//console.log(newDate); // Outputs: Sun Jan 26 2025 00:00:00 GMT+0000 (UTC)

function getCurrentTimeStandard() {
    const now = new Date(); // Get the current date and time
    let hours = now.getHours(); // Get hours (0-23)
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes and pad with zero if needed
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Get seconds and pad with zero if needed
    const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM

    // Convert to 12-hour format
    hours = hours % 12; 
    hours = hours ? String(hours).padStart(2, '0') : '12'; // Adjust hours to 12-hour format

    return `${hours}:${minutes}:${seconds} ${ampm}`; // Return formatted time
}

// Example usage:
//const currentTime = getCurrentTimeStandard();
//console.log(currentTime); // Outputs: HH:MM:SS AM/PM (e.g., 02:05:09 PM)
async function LogEntry(result) {
//Ver. 1.25.016, d.8d97c252e
res = result.split(".");
year = (parseInt(res[2])+parseInt(2000));
day = parseInt(res[3].replace("d",""));
commit = parseInt(res[4]);
release = createDateFromString("01/01/"+year, day);
r = result.split(", ")[1].split(".")[1];
if(r == app.ReadFile( "CurrentBuild.txt" )) {
line = "<tr class='greenGradient'><td align='center'>" + release + "</td><td>" + wdcs[d] + "</td><td>" + result + "</td><td>" + getCurrentTimeStandard() + "</td></tr>";
}else{
line = "<tr class='redGradient'><td align='center'>" + release + "</td><td>" + wdcs[d] + "</td><td>" + result + "</td><td>" + getCurrentTimeStandard() + "</td></tr>";
}
	await app.WriteFile( "Builds.txt", line + "\r\n", "append");//result+", "+wdcs[d]+"\r\n", "Append" );
d+=1;
contents = "<style>" + app.ReadFile("gradients.css") + "</style><table width='100%' cellspacing='0' style='font-size: 14px;text-shadow: 1px 1px 2px #333333;color: #ffffff;white-space:nowrap;'  border='1'>" + app.ReadFile( "Builds.txt" )+"</table>";
//alert(d)
//alert(wdcs.length)
	if(d==wdcs.length-1){
	app.WriteFile( "report.html", contents );
	app.SendFile( "report.html", "Reporte de WDCS Site Builds", contents );
	
	}
	await webLog.LoadHtml(contents );//.split(",").join("<br/>")+"<hr>" );
}

async function ParseBuilds() {
	for(c = 0; c < wdcs.length; c++) {
		await app.HttpRequest( "GET", wdcs[c]+"/Account/Login?ReturnUrl=%2F", "", "", SaveToLog );
	}
}

async function SaveToLog(error, response, status) {
	if(status === 200) await web.LoadHtml( response );
}