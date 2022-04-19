<link rel='stylesheet' href='style.css' />
<?php

session_start();

if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on')
    $link = "https";
else $link = "http";

$link .= "://";
$link .= $_SERVER['HTTP_HOST'];
$link .= $_SERVER['REQUEST_URI'];
$link = str_replace('install/installing.php', '', $link);
$link .= 'public';

$writer = "<?php" . PHP_EOL . PHP_EOL .
    "define('ROOT', __DIR__);" . PHP_EOL .
    "define('SYSTEM', __DIR__ . '/system');" . PHP_EOL .
    "define('CONTROLLERS_FOLDER', ROOT . '/controllers');" . PHP_EOL .
    "define('VIEWS_FOLDER', ROOT . '/views');" . PHP_EOL . PHP_EOL .
    "define('ROOT_URL', '" . $link . "');" . PHP_EOL . PHP_EOL .
    "define('DB_HOST', '" . $_SESSION['db']['dbhost'] . "');" . PHP_EOL .
    "define('DB_USER', '" . $_SESSION['db']['dbuser'] . "');" . PHP_EOL .
    "define('DB_PASS', '" . $_SESSION['db']['dbpass'] . "');" . PHP_EOL .
    "define('DB_NAME', '" . $_SESSION['db']['dbname'] . "');" . PHP_EOL .
    "define('DB_PORT', '3306');";

$write = fopen(dirname(__FILE__).'/../config.php', 'w');
fwrite($write, $writer);
fclose($write);

echo "<div class='box'>
        <form class='ins' action='installed.php' method='post'>
            <h2 align=center color=red>Config file has been generated.<h2>
            <input type=checkbox name=demo value=yes> Add demo data
            <input class='submit' type='submit' value='NEXT' name='next'/>
        </form>
    </div>";
?>