<link rel='stylesheet' href='style.css' />

<?php

session_start();

if (isset($_POST['install'])) {
    if (empty($_POST['dbhost'] && $_POST['dbname'] &&
        $_POST['dbuser'] && $_POST['dbpass'])) {
        echo "<h2 align=center >All Fields are required! Please Re-enter</h2>";
    } else {
        $mysqli = @mysqli_connect(
            $_POST['dbhost'],
            $_POST['dbuser'],
            $_POST['dbpass']
        ) or die("<h2>Database Error, Contact With Admin </h2>");

        @mysqli_select_db(
            $mysqli,
            $_POST['dbname']
        ) or die("<h2>Database Error, Contact With Admin</h2>");
        $_SESSION['db'] = $_POST;
        header('Location: installing.php');
    }
}

$HOST_name = "<input class='input' type='text' name='dbhost' placeholder='Enter Host Name' />";
$DB_username = "<input class='input' type='text' name='dbuser' placeholder='Enter DB User Name' />";
$DB_password = "<input class='input' type='password' name='dbpass' placeholder='***********' />";
$DB_name = "<input class='input' type='text' name='dbname' placeholder='Enter DB Name' />";
echo "<div class='box' >
            <form class='ins' method='post' action='index.php' >
                    <p>Enter Host Name:<p>
                    $HOST_name
                    <p>Enter DB User Name:<p>
                    $DB_username
                    <p>Enter DB PassWord:<p>
                    $DB_password
                    <p>Enter DB Name:<p>
                    $DB_name
                    <input class='submit' type='submit' name='install' value='NEXT' />
            </form>
        </div>";
?>