<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<meta charset="UTF-8" />
<title><?php echo $title; ?></title>
<link rel='shortcut icon' href='media/favicon.ico' />
<?php
	echo Assets::factory('jcs-all')
		->js($jul_root.'polyfill.js')
		->css('https://fonts.googleapis.com/css?family=Roboto+Condensed|Varela')
		->css($ample_root.'languages/xhtml/themes/default/style-prod.css')
		->css($ample_root.'languages/xul/themes/default/style-prod.css')
		->css('main.css')
		->css('skin.css')
		->js($ample_root.'runtime.js')
		->js($ample_root.'languages/xhtml/xhtml.js')
		->js($ample_root.'languages/xul/xul.js')
		->js($ample_root.'plugins/cookie/cookie.js')
		->js($jul_root.'jul.js')
		->js_block('JUL.Comments = '.json_encode($app).';')
		->js('jcs.js')
		->js('config.js', array('processor' => false));
?>
</head>
<body>
<script type="text/javascript">
ample.$init();
JUL.Comments.init();
</script>
</body>
</html>
