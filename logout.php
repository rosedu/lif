<?php
$IP = $_SERVER['REMOTE_ADDR'];
session_start();
if(isset($_SESSION['users'][$IP])) {
	unset($_SESSION['users'][$IP]);
	header('Location: /');
}
else
	header('Location: /');
