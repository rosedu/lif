<?php

include_once 'db.php';
include_once 'utils.php';

switch($_REQUEST['action']) {
	case 'register': {
		if(isset($_REQUEST['distro']))
			$x = addUser($_REQUEST['name'],$_REQUEST['type'],$_REQUEST['distro']);
		else
			$x = addUser($_REQUEST['name'],$_REQUEST['type']);
		echo $x;
		setHash($_REQUEST['hash'],$_REQUEST['type']);
		break;
	}
	case 'assign': {
		$helper_id = $_REQUEST['helper'];
		$participants_id = explode(',',$_REQUEST['participants']);
		$status = assignHelper($helper_id,$participants_id);
		
		if($status == 'error') {
			echo "DB error";
			exit();
		}
		
		echo $status;
		setHash($_REQUEST['hash'],'2');	//assigning = always both tables
		break;
	}
	
	case 'getHash' : {		//the initial step when we get the first hash
		header('Content-type: application/json');
		echo getHash();
		break;
	}

	case 'checkChanges' : {
		header('Content-type: application/json');
		
		$hash_from_file = getHash();
		$json = json_decode($hash_from_file,true);
		
		$server_hash = $json['hash'];
		$client_hash = $_REQUEST['hash'];
		if($server_hash == $client_hash) {	
			echo '{}';
			exit();
		}
		else
			echo $hash_from_file;
		break;
	}
	
	case 'getUpdates' : {
		include_once 'smarty/Smarty.class.php';
		global $LIF_PATH;
		header('Content-type: application/json');
		
		$type = $_REQUEST['type'];
		
		$smarty = new Smarty();
		$helpers = getHelpers();
		$participants = getParticipants();
		
		switch($type) {
			case '1': {
				$participants_count = getArrayCountParticipants($helpers);
				//$participants_list = getArrayParticipants($helpers);
				$smarty->assign('helpers',$helpers);
				//$smarty->assign('participants_list',$participants_list);
				$smarty->assign('participants_count',$participants_count);
				$json['string'] = $smarty->fetch($LIF_PATH."templates_c/helper.tpl");
				echo json_encode($json);
				break;
			}
			
			case '0': {
				//$helpers_list = getArrayHelpers($participants);
				$smarty->assign('participants',$participants);
				//$smarty->assign('helpers_list',$helpers_list);	
				$json['string'] = $smarty->fetch($LIF_PATH."templates_c/participant.tpl");
				echo json_encode($json);
				break;
			}
			
			case '2': {
				$participants_count = getArrayCountParticipants($helpers);
				//$participants_list = getArrayParticipants($helpers);
				$smarty->assign('helpers',$helpers);
				$smarty->assign('participants_count',$participants_count);
				//$smarty->assign('participants_list',$participants_list);
				$json['helper'] = $smarty->fetch($LIF_PATH."templates_c/helper.tpl");
				
				$smarty->clearAllAssign();
				
				$helpers_list = getArrayHelpers($participants);
				$smarty->assign('participants',$participants);
				$smarty->assign('helpers_list',$helpers_list);
				
				$json['participant'] = $smarty->fetch($LIF_PATH."templates_c/participant.tpl");	

				echo json_encode($json);
				break;
			}
		}
		break;
	}
	case 'completeInstall': {
		$pid = $_REQUEST['ID'];
		$comment = $_REQUEST['comment'];
		$x = CompleteInstallation($pid,$comment);
		if($x==0) {
			echo "mysql error";
			exit();
		}
		setHash($_REQUEST['hash'],'2');
		echo "success ";
		break;
	}
	case 'toggleAway': {
		$hash = $_REQUEST['hash'];
		$hid = $_REQUEST['id'];
		$state = $_REQUEST['state'];
		setHash($hash,'1');
		echo SetBusy($hid,$state);
		break;
	}
	case 'checkStats': {
		$hash = json_decode(getHash(),true);
		
		$stats_hash = $_REQUEST['hash'];
		$server_hash = $hash['hash'];
		if($stats_hash == $server_hash)
			echo '{"no_change": "0"}';
		else {
			header('Content-type: application/json');
			
			include_once 'smarty/Smarty.class.php';
			global $LIF_PATH;
			
			$json = array();
			$json['hash'] = $server_hash;
			
			$smarty = new Smarty();
			$participants = getParticipants(-1, true);
			$smarty->setCompileDir($LIF_path.'templates_c/compiled/');
			$smarty->assign('participants',$participants);
			$json['html'] = $smarty->fetch($LIF_path.'templates_c/stats_table.tpl');
			
			echo json_encode($json);
		}
		break;
	}
	case 'ldap_login': {
		$username = $_REQUEST['username'];
		$password = $_REQUEST['password'];

		$result = LDAP_login($username,$password);
		if($result === true) {
			session_start();
			$IP = $_SERVER['REMOTE_ADDR'];
			$_SESSION['users'][$IP] = $username;
			echo 'Login Successful';
		}
		else if($result === false)
			echo 'Login Failed';
		else
			echo $result;
		break;
	}
	case 'unassign': {
		$pid = $_REQUEST['pid'];
		$hid = $_REQUEST['hid'];
		Unassign($pid, $hid);
		setHash($_REQUEST['hash'],'2');

		break;
	}
	case 'delete': {
		$type = $_REQUEST['type'];
		$ID = $_REQUEST['id'];
		$hash = $_REQUEST['hash'];

		DeleteUser($ID,$type);
		setHash($hash,'2');	
		
		break;
	}
}
