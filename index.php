<html>
	<head>
		<title>JqCombos</title>
		<style>
			.clearfix{
				clear:both;
			}
		</style>
		<script type="text/javascript" src="js/jquery-1.6.2.min.js"></script>
		<script type="text/javascript" src="js/jqCombos.js"></script>
		<script type="text/javascript">
			$(document).ready(function(){
				$("#jqCombo_0").jqCombos({
					target 	: '#generated',
					file	: 'ajax.php',
					wrapper	: '<div class="clearfix" />'
				});
			});
		</script>
	</head>
	<body>
		<div id="container">
			<div id="generated">
				<label for="jqCombo_0">Secciones</label>
				<select name="jqCombo_0" id="jqCombo_0">
					<option value="">--</option>
					<option value="1">Deportes</option>
					<option value="2">Especiales</option>
				</select>
			</div>
			<div>
				<label for="anyOther">Any other selectbox</label>
				<select name="anyOther" id="anyOther">
					<option value="anyOther1">One Option</option>
					<option value="anyOther2">Two Options</option>
				</select>
			</div>
		</div>
	</body>
</html>