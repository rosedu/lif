<?php
require_once 'smarty/Smarty.class.php';
include_once 'db.php';
include_once 'utils.php';

global $LIF_path;

$participants = getParticipants(-1,true);
//$helpers_list = getArrayHelpers($participants);

$smarty = new Smarty();
$smarty->setCompileDir($LIF_path.'templates_c/compiled/');
$smarty->assign('participants',$participants);
//$smarty->assign('helpers_list',$helpers_list);
$smarty->display($LIF_path.'templates_c/statistics.tpl');
