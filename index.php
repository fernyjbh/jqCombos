<html>
	<head>
		<title>JqCombos</title>
		<style>
			.clearfix{
				clear:both;
				margin:20px auto;
			}
			.medium{
				width:250px;
			}
			.red{
				border:1px solid red;
			}
		</style>
		<script type="text/javascript" src="js/jquery-1.6.2.min.js"></script>
		<script type="text/javascript" src="js/jqCombos.js"></script>
		<script type="text/javascript">
			$(document).ready(function(){
				$("#jqCombo_0").jqCombos({
					target 	: '#generated',
					file	: 'ajax.php',
					comboClass : 'medium red',
					wrapper	: '<div class="clearfix" />'
				});
			});
		</script>
	</head>
	<body>
		<div id="container">
			<div id="generated">
				<div class="clearfix">
					<label for="jqCombo_0">Primer nivel</label>
					<select name="jqCombo_0" id="jqCombo_0">
						<option value="">--</option>
						<option value="1" >Deportes</option>
						<option value="2" selected>Especiales</option>
					</select>
				</div>
				<div class="clearfix">
					<label for="jqCombo_1">Segundo nivel</label>
					<select name="jqCombo_1" id="jqCombo_1">
						<option value="">--</option>
						<option value="8" selected >bicentenario</option>
						<option value="9">wikileaks</option>
					</select>
				</div>

			</div>
			<div class="clearfix">&nbsp;</div>
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