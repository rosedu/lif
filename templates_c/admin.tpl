<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="style.css" />
<script type="text/javascript" src="jquery-1.4.4.js"></script>
<script type="text/javascript" src="script.js"></script>
<title>Insert title here</title>
</head>
<body>

<div id="helper" class="helpers">
{include file="templates_c/helper.tpl"}
</div>
<input style="position: absolute; left: 15%; top: 27%" type="button" value="Toggle Away" onclick="ToggleAway()" />
<input style="position: fixed; left: 47%; top: 40%" type="button" value="<- Assign ->" onclick='AssignHelpers()' />
<input style="position: fixed; left: 47%; top: 43%" type="button" value="Unassign" onclick='Unassign()' />
<input style="position: fixed; left: 47%; top: 46%" type="button" value="Delete" onclick='Delete()' />
<input style="position: absolute; left: 75%; top: 27%" type="button" value="Complete" onclick="GetCommentBox()" />
<div id="participant" class="participants">
{include file="templates_c/participant.tpl"}
</div>
<div class="container">
<p style="display: inline;">Nume & Prenume: <input class="fields" id="name" type="text" size="20" /></p><br />
<p style="display: inline;">Linux distribution: <input class="fields" id="distro" type="text" size="20" /></p><br/>
<p style="display: inline;">Participant sau Helper? </p>
<select id="type" class="fields">
	<option value="0">Participant</option>
	<option value="1">Helper</option>
</select>
<br /><br />
<input style="position: relative; left: 150px; top: 20px" type="button" value="Register" onclick="Register()" />
<a style="position: relative; left: 0; top: 0" href="statistics.php" target="_blank">Statistics</a>
<a style="position: relative; left: 110px; top: 0" href="logout.php">Logout</a>
<p style="position: relative; left: 40px" id="message"></p>
</div>
<div id="test" style="position: absolute; top: 80%"></div>
</body>
</html>
