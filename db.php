<?php

$DB = mysql_connect('koala.cs.pub.ro','rosedu_lif','peewethahz');
mysql_select_db('rosedu_lif',$DB);
global $DB;

function addUser($name,$type,$distro=null) {
	global $DB;
	
	$time = date('H:i:s');
	
	switch($type) {
		case '0': {
			mysql_query("INSERT INTO `participant`(`name`,`distribution`,`date_reg`) VALUES ('$name','$distro','$time');",$DB);
			break;
		}
		case '1': {
			mysql_query("INSERT INTO `helper`(`name`,`date_reg`) VALUES ('$name','$time');",$DB);
			break;
		}
	}
	$error = mysql_error($DB);
	return $error;
}

function assignHelper($h_id, $p_id) {
	global $DB;
	
	foreach($p_id as $p) {
		if(!isAssigned($h_id,$p)) {
			mysql_query("INSERT INTO `installation`(`helper_id`,`participant_id`) VALUES ('$h_id','$p');",$DB);
			mysql_query("UPDATE `helper` SET `status` = '1' WHERE `id` = '$h_id';");
			addHelperHTML($h_id, $p);
		}
	}

	if(mysql_errno($DB))
		return 'error';
	return 'success '.count($p_id);
}

/**
 * 
 * Gets the helpers.
 * @param int $id gets helpers which work with Participant id $id. If -1, it will return all helpers.
 * @return Array with the results from DB.
 */

function getHelpers($participant_id = -1) {
	global $DB;
	
	if($participant_id != -1) {
		$query = mysql_query("SELECT `helper_id` FROM `installation` where `participant_id` = '$participant_id' ;",$DB);
		$result = array();
		$array = @mysql_fetch_array($query,MYSQL_NUM);
	
		for($i=0; $array; $i++){
			$result[$i] = $array[0];
			$array = mysql_fetch_array($query,MYSQL_NUM);
		}
	}
	else {
		$query = mysql_query("SELECT * FROM `helper` ORDER BY `name`;",$DB);
		if(!mysql_num_rows($query))
			return 'false'; //intended to be string
		$result = array();
		$array = mysql_fetch_array($query,MYSQL_ASSOC);
	
		for($i=0; $array; $i++){
			$result[$i] = $array;
			$array = mysql_fetch_array($query,MYSQL_ASSOC);
		}
	}
	return $result;	
}

function getParticipants($helper_id = -1, $show_completed=null) {
	global $DB;
	
	if($helper_id != -1) {
		$query = mysql_query("SELECT `participant_id` FROM `installation` where `helper_id` = '$helper_id' ;",$DB);
		$result = array();
		$array = mysql_fetch_array($query,MYSQL_NUM);
	
		for($i=0; $array; $i++){
			$result[$i] = $array[0];
			$array = mysql_fetch_array($query,MYSQL_NUM);
		}
	}
	else {
		if($show_completed)
			$query = mysql_query("SELECT * FROM `participant` ORDER BY `name`;",$DB);
		else
			$query = mysql_query("SELECT * FROM `participant` WHERE `is_finished` != '1' ORDER BY `name` ;",$DB);
		if(@!mysql_num_rows($query))
			return 'false';
		$result = array();
		$array = @mysql_fetch_array($query,MYSQL_ASSOC);
	
		for($i=0; $array; $i++){
			$result[$i] = $array;
			$array = mysql_fetch_array($query,MYSQL_ASSOC);
		}
	}
	
	return $result;
}

function CompleteInstallation($ID, $comment) {
	global $DB;
	
	$time = date('H:i:s');
	mysql_query("UPDATE `participant` SET `is_finished` = '1', `comments` = '$comment', `date_finished` = '$time' WHERE `id` = '$ID' ",$DB);
	
	$list_helpers = getHelpers($ID);	//helpers which have more participants will not get "unbusyied"

	foreach($list_helpers as $helper)
		if(GetParticipantCount($helper) == 1)
			mysql_query("UPDATE `helper` SET `status` = '0' WHERE `id` = '$helper' ",$DB);
	mysql_query("DELETE FROM `installation` WHERE `participant_id` = '$ID';",$DB);
	if(mysql_errno($DB))
		return 0;
	return 1;
}

function Unassign($pid, $hid) {
	global $DB;

	if(GetParticipantCount($hid) == 1)
		mysql_query("UPDATE `helper` SET `status` = '0' WHERE `id` = '$hid'; ",$DB);
	mysql_query("DELETE FROM `installation` WHERE `participant_id` = '$pid' AND `helper_id` = '$hid';",$DB);
	RemoveHelperHTML($pid, $hid);
}

function DeleteUser($ID,$type) {
	global $DB;

	switch($type){
		case 'helper': {
			mysql_query("DELETE FROM `helper` WHERE `id` = '$ID';",$DB);
			break;
		}
		case 'participant': {
			mysql_query("DELETE FROM `participant` WHERE `id` = '$ID';",$DB);
			break;
		}
	}
}

function GetParticipantCount($id) {
	global $DB;
	
	$query = mysql_query("SELECT * FROM `installation` WHERE `helper_id` = '$id';",$DB);
	return mysql_num_rows($query);
}

function getHelperName($id) {
	global $DB;
	
	$query = mysql_query("SELECT `name` FROM `helper` WHERE `id` = '$id';");
	$result = mysql_fetch_row($query);
	$result = $result[0];
	return $result;
}

function getParticipantName($id) {
	global $DB;
	
	$query = mysql_query("SELECT `name` FROM `participant` WHERE `id` = '$id';");
	$result = mysql_fetch_row($query);
	$result = $result[0];
	return $result;
}

function SetBusy($id,$state) {
	global $DB;
	
	mysql_query("UPDATE `helper` SET `busy` = '$state' WHERE `id` = '$id';",$DB);
	return mysql_errno();
}

function isAssigned($helper_id, $participant_id) {
	global $DB;
	
	$query = mysql_query("SELECT * FROM `installation` WHERE `helper_id` = '$helper_id' AND `participant_id` = '$participant_id';",$DB);
	if(mysql_num_rows($query))
		return true;
	return false;
}

function addHelperHTML($h_id, $p_id) {
	global $DB;
	
	$query = mysql_query("SELECT `helpers_html` from `participant` WHERE `id` = '$p_id'",$DB);
	$current = mysql_fetch_row($query);
	$string = $current[0];
	if($string == '<p style="color: red">No helpers assigned.</p>')
		$string = getHelperName($h_id);
	else $string .= getHelperName($h_id);
	$string .= " <br />";
	mysql_query("UPDATE `participant` SET `helpers_html` = '$string' WHERE `id` = '$p_id';",$DB);
}

function RemoveHelperHTML($pid, $hid) {
	global $DB;

	$helper_name = getHelperName($hid);
	$query = mysql_query("SELECT `helpers_html` FROM `participant` WHERE `id` = '$pid'",$DB);
	$result = mysql_fetch_row($query);
	$result = $result[0];
	$result = str_replace($helper_name.' <br />','',$result);
	mysql_query("UPDATE `participant` SET `helpers_html` = '$result' WHERE `id` = '$pid';",$DB);
}
