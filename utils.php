<?php

global $hash_file;
global $stats_file;
global $LIF_path;

if(file_exists('changes.json'))
	$hash_file = fopen('changes.json', 'r+');
else
	$hash_file = fopen('changes.json', 'w+');
	
$LIF_path = '/home/lif/public_html/';

function ConstructHash() {
	global $hash_file;
	
	$hash = md5(strval(time()));
	$json = array();
	$json['hash'] = $hash;
	$json['type'] = -1;
	fwrite($hash_file, json_encode($json));
}

function getHash(){
	if(!filesize('changes.json'))	//if it's a 0 byte file
		ConstructHash();
	
	return file_get_contents('changes.json');
}

//type: 1 - helper, 0 - participant, 2 - both
function setHash($string, $type){
	global $hash_file;
	
	$json = array("hash" => $string, "type" => $type);
	fwrite($hash_file, json_encode($json));
}

function LDAP_login($user, $pass) {
	$LDAP_SERVER = "ldaps://swarm.cs.pub.ro/";

	$ds = ldap_connect($LDAP_SERVER);
	if(!$ds)
		return "Can't connect to ldap server1.\n";
	$sr = ldap_search($ds, "dc=swarm,dc=cs,dc=pub,dc=ro", "(uid=".$user.")");
	if (ldap_count_entries($ds, $sr) > 1)
		return "Multiple entries with the same uid in LDAP database??";
	if (ldap_count_entries($ds, $sr) < 1) {
		ldap_close($ds);
		return false;
	}
	
	$info = ldap_get_entries($ds, $sr);
	$dn = $info[0]["dn"];
	ldap_close($ds);

	$ds = ldap_connect($LDAP_SERVER);
	if(!$ds)
		return "Can't connect to ldap server2.\n";
	ldap_set_option($ds, LDAP_OPT_PROTOCOL_VERSION, 3);
	if (!@ldap_bind($ds, $dn, $pass) or $pass == '') {
		ldap_close($ds);
		return false;
	}
	
    return true;
}

function getArrayParticipants($helpers){
	if($helpers=='false') return false;
	foreach($helpers as $h) {	//since we got the list of all helpers
		$participants_ids = getParticipants($h['id']);	//we get the array with all the helpers participant with id has
		if(!empty($participants_ids)) {
			$participants_array = array();
			$participants_string = '';
	
			foreach($participants_ids as $p_id) {
				$participants_string .= getParticipantName($p_id);
				$participants_string .= '<br />';
			}
		
			$participants_list[$h['id']] = $participants_string;
		}
		else
			$participants_list[$h['id']] = '<p style="color: red">No participants assigned.</p>';
	}
	return $participants_list;
}

function getArrayHelpers($participants){
	if($participants=='false') return false;
	foreach($participants as $p) {
	
	$helpers_ids = getHelpers($p['id']);	//we get the array with all the helpers participant with id has
	if(!empty($helpers_ids)) {
		$helpers_array = array();
		$helpers_string = '';
	
		foreach($helpers_ids as $h_id) {
			$helpers_string .= getHelperName($h_id);
			$helpers_string .= '<br />';
		}
	
		$helpers_list[$p['id']] = $helpers_string;
	}
	else
		$helpers_list[$p['id']] = '<p style="color: red">No helper assigned.</p>';
	}
	return $helpers_list;
}

function getArrayCountParticipants($helpers) {
	if($helpers=='false') return 'false';
	
	$result = array();
	foreach($helpers as $h)
		$result[$h['id']] = GetParticipantCount($h['id']);
	
	return $result;
}
