<?php
	$tmpl = $_GET['tmpl'];
	
   	header('Content-Type:application/json; charset=utf-8');
   	
   	$tmpl_data = [];
   	
   	$get_tmpl = file_get_contents('./../example/tmpl-and-tmpl-router-demo/tmpl/'.$tmpl.'.tmpl');
   	
   	$tmpl_data['tmpl'] = $get_tmpl;
   	
// 	sleep(1);
   	
	echo json_encode($tmpl_data,0);
	
?>	