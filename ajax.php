<?php
/*
Trayendo resultados de una BD puede ser así
	$sql = mysql_query("SELECT * FROM tabla WHERE idcampo = $_POST['data']");
	if(mysql_num_rows($sql) > 0){
		while($rs=mysql_fetch_assoc($sql)){
			$id[] = $rs['id'];
			$name[] = $rs['name'];
		}
	}
	$datas = json_encode(array('id'=>$id,'name'=>$name));
	echo $data;
*/

if(isset($_POST['data'])){
if($_POST['data'] == 0){
	echo json_encode(array("id"=>array("0"),"name" => array("boom")));
}
if($_POST['data'] == 1){
	echo json_encode(array("id"=>array("3","4"),"name" => array("futbol","basket")));
}
if($_POST['data'] == 2){
	echo json_encode(array("id"=>array("8","9"),"name" => array("bicentenario","wikileaks")));
}
if($_POST['data'] == 3){
	echo json_encode(array("id"=>array("6","7"),"name" => array("primera division", "no se otra cosa")));
}

if($_POST['data'] == 4){
	echo json_encode(array("id"=>array("10"),"name" => array("femenino")));
}

}
?>