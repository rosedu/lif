<?php
$IP = $_SERVER['REMOTE_ADDR'];
session_start();
if(!isset($_SESSION['users'][$IP])) {
	header('HTTP/1.1 403 Forbidden');
	exit();
}

require_once 'smarty/Smarty.class.php';
include_once 'db.php';
include_once 'utils.php';

global $LIF_path;
$smarty = new Smarty();

$helpers = getHelpers();
$participants = getParticipants();
//$helpers_list = getArrayHelpers($participants);		//list of helpers that a participant has
$participants_count = getArrayCountParticipants($helpers);
	
/*
if($participants!='false') {
	$participants_list = getArrayParticipants($helpers);	//list of participants that a helper has
	$smarty->assign('participants_list',$participants_list);
}*/

$smarty->setCompileDir($LIF_path.'templates_c/compiled/');
$smarty->assign('helpers',$helpers);
//$smarty->assign('helpers_list',$helpers_list);
$smarty->assign('participants',$participants);
$smarty->assign('participants_count',$participants_count);

$smarty->display($LIF_path.'templates_c/admin.tpl');
