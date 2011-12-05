<?php
if(isset($_POST['data'])){
// Se supone que ya hice la consulta y debo formatear los resultados de la siguiente manera
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