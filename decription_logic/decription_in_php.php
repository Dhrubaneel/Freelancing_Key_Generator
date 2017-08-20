<?php 
	function disableApplication(){
		//logic to stop the application from run
		module_disable(array('account'));
	}
	
	function enableApplication(){
		//logic to make the application normal
		module_enable(array('account'));
	}

	if(variable_get('site_name', NULL)==NULL || variable_get('application_hash_salt', NULL)==NULL ){
		//site name or license key not set, application cannot run
		drupal_set_message("There is some issue with application configuration, kindly contact administrator to get the issue fixed.","error");
		disableApplication();
	}else{
		//lets check the license key
		$application_name= variable_get('site_name', NULL);
		$application_key= variable_get('application_hash_salt', NULL);
		
		$application_key_part = explode(" / ",$application_key);
		
		/* While decoding last part will be decoded first. Then based on that number first and second part
        will be changed. In this case for odd position previous nth character and 
        for even positon next nth character will be considered. After that first part will be decoded
        to base64 which will give a MD5 hash. If that hash matches with the application name converted
        in MD5 then its a valid key. Second part will be then decoded to implement valid key logic. */
	
		//get the random number
		$key_random_number= base64_decode($application_key_part[2]);
		
		//validate key based on application name
		$application_name_md5= md5($application_name);
		
		$chars = array();
		for ($i = 0; $i < mb_strlen(htmlspecialchars_decode($application_key_part[0])); $i++ ) {
			$chars[] = htmlspecialchars(mb_substr(htmlspecialchars_decode($application_key_part[0]), $i, 1)); // only one char to go to the array
		}
		
		for($i=0;$i<sizeof($chars);$i++){
			if(($i%2)==1){
				//Odd Position
				list(, $ord) = unpack('N', mb_convert_encoding(htmlspecialchars_decode($chars[$i]), 'UCS-4BE', 'UTF-8'));
				$chars[$i]= mb_convert_encoding('&#' . intval($ord - $key_random_number) . ';', 'UTF-8', 'HTML-ENTITIES');
			}else{
				//Even Position
				list(, $ord) = unpack('N', mb_convert_encoding(htmlspecialchars_decode($chars[$i]), 'UCS-4BE', 'UTF-8'));
				$chars[$i]= mb_convert_encoding('&#' . intval($ord + $key_random_number) . ';', 'UTF-8', 'HTML-ENTITIES');
			} 
		}
		
		$key_application_name_base64=implode("",$chars);
		$key_application_name_md5= base64_decode($key_application_name_base64);
		
		if(strcmp($key_application_name_md5,$application_name_md5)== 0){
			//valid key
			
			//validate validity date
			$chars = array();
			for ($i = 0; $i < mb_strlen(htmlspecialchars_decode($application_key_part[1])); $i++ ) {
				$chars[] = htmlspecialchars(mb_substr(htmlspecialchars_decode($application_key_part[1]), $i, 1)); // only one char to go to the array
			}
			
			for($i=0;$i<sizeof($chars);$i++){
				if(($i%2)==1){
					//Odd Position
					list(, $ord) = unpack('N', mb_convert_encoding(htmlspecialchars_decode($chars[$i]), 'UCS-4BE', 'UTF-8'));
					$chars[$i]= mb_convert_encoding('&#' . intval($ord - $key_random_number) . ';', 'UTF-8', 'HTML-ENTITIES');
				}else{
					//Even Position
					list(, $ord) = unpack('N', mb_convert_encoding(htmlspecialchars_decode($chars[$i]), 'UCS-4BE', 'UTF-8'));
					$chars[$i]= mb_convert_encoding('&#' . intval($ord + $key_random_number) . ';', 'UTF-8', 'HTML-ENTITIES');
				} 
			}
			
			$key_validity_base64=implode("",$chars);
			$key_validity_date= base64_decode($key_validity_base64);
			
			$today = date('Y-m-d');
			
			$time = strtotime($key_validity_date);
			$validity_date = date('Y-m-d',$time);
			
			if(strtotime($validity_date) < strtotime($today)){
				//Software license expired
				drupal_set_message("Application license has expired, kindly contact administrator.","error");
				disableApplication();
			}else{
				//Software has valid license
				enableApplication();
			}
			
		}else{
			drupal_set_message("Application license key is invalid, kindly contact administrator.","error");
			//invalid key
			disableApplication();
		}
		
	
	};
		
		
?>