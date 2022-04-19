<?php
if (isset($_POST['next'])) {

    if (isset($_POST['demo']) && $_POST['demo'] == 'yes') {
        $sql = file_get_contents('secure_door_access-with-demo.sql');
    } else {
        $sql = file_get_contents('secure_door_access.sql');
    }

    include dirname(__FILE__) . '/../config.php';

    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

    /* execute multi query */
    $mysqli->multi_query($sql);
    echo "<h2 align=center >Finished</h2>";
} else {
    echo "<h2 align=center >Error</h2>";
}
