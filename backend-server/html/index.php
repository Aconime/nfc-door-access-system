<?php

/**
 * The Secure Door Access Server
 * @author Nirmal Sunny (nirmal.sunny@study.beds.ac.uk)
 * @version 0.1
 */

define('APP_VERSION', '0.1');

/**
 * Check whether the installation was completed
 */
//checkInstalled();

include dirname(__FILE__) . '/../config.php';

include SYSTEM . '/vendor/autoload.php';
include SYSTEM . '/Bootstrap.php';
include SYSTEM . '/Routes.php';
include SYSTEM . '/Controller.php';
include SYSTEM . '/View.php';

include SYSTEM . '/Helpers.php';

if (DEBUG) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

if (isset($_GET['route']) && !empty($_GET['route'])) {
    $app = new App($_GET['route']);
} else {
    $app = new App("home");
}
$app->run();


function checkInstalled()
{
    if (file_exists(dirname(__FILE__) . '/install')) {

        //redirect to install directory
        header("Location: ./install");
    }
}
